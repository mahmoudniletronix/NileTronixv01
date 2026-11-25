import { Injectable, NgZone, inject } from '@angular/core';
import type * as ThreeNamespace from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPresetId } from '../models/camera-preset.model';
import { HardwareProductItem } from '../models/hardware-product.model';
import { ProductHotspot, ProjectedHotspot } from '../models/product-hotspot.model';
import { CameraControllerService, FramingBox } from './camera-controller.service';
import { ModelCacheService } from './model-cache.service';
import { ModelLoaderService } from './model-loader.service';
import { ProductAnimationService } from './product-animation.service';

export interface SceneCallbacks {
  readonly onLoadProgress: (pct: number) => void;
  readonly onModelReady: (productId: string) => void;
  readonly onModelError: (message: string) => void;
  readonly onContextLost: () => void;
  readonly onHotspotsProjected: (projected: readonly ProjectedHotspot[]) => void;
  readonly onUserInteract: () => void;
}

@Injectable()
export class ThreeSceneService {
  private readonly ngZone = inject(NgZone);
  private readonly loader = inject(ModelLoaderService);
  private readonly cache = inject(ModelCacheService);
  private readonly cameraController = inject(CameraControllerService);
  private readonly animator = inject(ProductAnimationService);

  private T: typeof ThreeNamespace | null = null;
  private renderer: ThreeNamespace.WebGLRenderer | null = null;
  private scene: ThreeNamespace.Scene | null = null;
  private camera: ThreeNamespace.PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private pmremGenerator: ThreeNamespace.PMREMGenerator | null = null;
  private envRenderTarget: ThreeNamespace.WebGLRenderTarget | null = null;
  private stageGroup: ThreeNamespace.Group | null = null;
  private groundShadowGeo: ThreeNamespace.BufferGeometry | null = null;
  private groundShadowMat: ThreeNamespace.Material | null = null;
  private contactShadowGeo: ThreeNamespace.BufferGeometry | null = null;
  private contactShadowMat: ThreeNamespace.Material | null = null;
  private contactShadowTex: ThreeNamespace.Texture | null = null;

  private containerEl: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private callbacks: SceneCallbacks | null = null;

  private currentProduct: HardwareProductItem | null = null;
  private currentModelRoot: ThreeNamespace.Group | null = null;
  private currentFraming: FramingBox | null = null;

  private rafId: number | null = null;
  private isVisibleInViewport = true;
  private isDocumentVisible = true;
  private autoRotateEnabled = false;
  private needsRender = true;
  private dampingActive = false;
  private reducedMotion = false;
  private loadGeneration = 0;
  private destroyed = false;

  private readonly boundVisibilityChange = () => this.onVisibilityChange();
  private readonly boundContextLost = (e: Event) => {
    e.preventDefault();
    this.stopLoop();
    this.callbacks?.onContextLost();
  };
  private readonly boundContextRestored = () => {
    this.requestRender();
  };

  isWebGLAvailable(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
      );
    } catch {
      return false;
    }
  }

  async init(
    container: HTMLElement,
    callbacks: SceneCallbacks,
    reducedMotion: boolean
  ): Promise<boolean> {
    if (this.destroyed || !this.isWebGLAvailable()) {
      return false;
    }

    this.containerEl = container;
    this.callbacks = callbacks;
    this.reducedMotion = reducedMotion;

    const [T, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
      this.loader.getThree(),
      import('three/examples/jsm/controls/OrbitControls.js'),
      import('three/examples/jsm/environments/RoomEnvironment.js'),
    ]);

    if (this.destroyed) return false;
    this.T = T;

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 300);

    const renderer = new T.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    renderer.domElement.className = 'nt-3d-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.addEventListener('webglcontextlost', this.boundContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', this.boundContextRestored, false);

    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new T.Scene();
    this.scene = scene;

    // Neutral industrial studio IBL environment (no external HDRI network fetch required)
    const pmrem = new T.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    roomEnv.dispose();
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.72;
    this.pmremGenerator = pmrem;
    this.envRenderTarget = envTarget;

    // Perspective camera
    const camera = new T.PerspectiveCamera(36, width / height, 0.05, 50);
    camera.position.set(1.2, 1.0, 2.8);
    this.camera = camera;

    // 3-point studio photography lighting (soft overhead key + balanced front fill)
    const hemi = new T.HemisphereLight(0xf8fcff, 0xdce5ec, 0.85);
    scene.add(hemi);

    const keyLight = new T.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(1.6, 5.2, 2.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -2.2;
    keyLight.shadow.camera.right = 2.2;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -1.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 8;
    scene.add(keyLight);

    const fillLight = new T.DirectionalLight(0xe4f1f9, 0.82);
    fillLight.position.set(-2.8, 2.4, 2.6);
    scene.add(fillLight);

    const rimLight = new T.DirectionalLight(0xeef2f6, 0.42);
    rimLight.position.set(-1.6, 3.2, -3.4);
    scene.add(rimLight);

    // Subtle ground directional shadow catcher
    const shadowGeo = new T.PlaneGeometry(5.5, 5.5);
    const shadowMat = new T.ShadowMaterial({ opacity: 0.085 });
    const shadowPlane = new T.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.003;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    this.groundShadowGeo = shadowGeo;
    this.groundShadowMat = shadowMat;

    // Soft radial studio contact shadow directly beneath the hardware base
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const cCtx = contactCanvas.getContext('2d');
    if (cCtx) {
      const grad = cCtx.createRadialGradient(128, 128, 12, 128, 128, 124);
      grad.addColorStop(0, 'rgba(8, 47, 67, 0.24)');
      grad.addColorStop(0.5, 'rgba(8, 47, 67, 0.09)');
      grad.addColorStop(1, 'rgba(8, 47, 67, 0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(0, 0, 256, 256);
    }
    const contactTex = new T.CanvasTexture(contactCanvas);
    const contactGeo = new T.PlaneGeometry(1.45, 1.45);
    const contactMat = new T.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
    });
    const contactMesh = new T.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.y = -0.001;
    scene.add(contactMesh);
    this.contactShadowGeo = contactGeo;
    this.contactShadowMat = contactMat;
    this.contactShadowTex = contactTex;

    // Stage container holding the active hardware model
    const stageGroup = new T.Group();
    stageGroup.name = 'hardware-stage';
    scene.add(stageGroup);
    this.stageGroup = stageGroup;

    // OrbitControls with smooth damping and safe constraints
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.rotateSpeed = 0.78;
    controls.zoomSpeed = 0.85;
    controls.minDistance = 1.1;
    controls.maxDistance = 5.4;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI * 0.51;
    controls.autoRotateSpeed = 1.15;

    controls.addEventListener('start', () => {
      this.cameraController.cancelTransition();
      this.dampingActive = true;
      this.callbacks?.onUserInteract();
      this.requestRender();
    });
    controls.addEventListener('change', () => {
      this.requestRender();
    });
    this.controls = controls;

    // ResizeObserver for crisp responsive canvas sizing
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    document.addEventListener('visibilitychange', this.boundVisibilityChange);
    return true;
  }

  async showProduct(product: HardwareProductItem, animateSwap: boolean): Promise<void> {
    if (this.destroyed || !this.T || !this.stageGroup || !this.camera || !this.controls) {
      return;
    }

    const gen = ++this.loadGeneration;
    this.callbacks?.onLoadProgress(10);

    try {
      const result = await this.loader.loadProductModel(
        product.id,
        product.model3d,
        (pct) => {
          if (gen === this.loadGeneration) {
            this.callbacks?.onLoadProgress(pct);
          }
        }
      );

      // Ignore stale async load if the user switched models rapidly
      if (this.destroyed || gen !== this.loadGeneration) return;

      // Smoothly animate old model out while keeping it visible during load
      if (this.currentModelRoot && animateSwap) {
        await this.animator.animateOut(this.stageGroup, this.reducedMotion, () =>
          this.requestRender()
        );
        if (this.destroyed || gen !== this.loadGeneration) return;
      }

      if (this.currentModelRoot) {
        this.stageGroup.remove(this.currentModelRoot);
      }

      this.cache.setActiveId(product.id);
      this.currentProduct = product;
      this.currentModelRoot = result.entry.root;
      this.stageGroup.add(result.entry.root);

      // Reset stage transforms cleanly before framing
      this.stageGroup.scale.setScalar(1);
      this.stageGroup.position.set(0, 0, 0);
      this.stageGroup.rotation.set(0, 0, 0);

      this.currentFraming = this.cameraController.computeFraming(this.T, this.stageGroup);
      const idealDist = this.cameraController.getIdealDistance(
        this.camera,
        this.currentFraming,
        product.model3d.distanceScale ?? 1.1
      );
      this.controls.minDistance = Math.max(this.currentFraming.radius * 1.1, 0.85);
      this.controls.maxDistance = Math.max(idealDist * 2.1, 4.8);

      this.cameraController.moveToPreset(
        this.T,
        this.camera,
        this.controls,
        this.currentFraming,
        'perspective',
        product.model3d.defaultYawDeg,
        product.model3d.defaultPitchDeg,
        product.model3d.distanceScale ?? 1.1,
        !animateSwap || this.reducedMotion,
        () => this.requestRender()
      );

      this.animator.animateEntrance(this.stageGroup, this.reducedMotion, () =>
        this.requestRender()
      );

      this.callbacks?.onModelReady(product.id);
      this.requestRender();
    } catch (err) {
      if (gen === this.loadGeneration) {
        console.error('[NileTronix 3D] Model load error:', err);
        this.callbacks?.onModelError('Failed to render 3D hardware model.');
      }
    }
  }

  setCameraPreset(preset: CameraPresetId): void {
    if (!this.T || !this.camera || !this.controls || !this.currentFraming || !this.currentProduct) {
      return;
    }
    this.cameraController.moveToPreset(
      this.T,
      this.camera,
      this.controls,
      this.currentFraming,
      preset,
      this.currentProduct.model3d.defaultYawDeg,
      this.currentProduct.model3d.defaultPitchDeg,
      this.currentProduct.model3d.distanceScale ?? 1.1,
      this.reducedMotion,
      () => this.requestRender()
    );
  }

  focusHotspot(hotspot: ProductHotspot): void {
    if (!this.T || !this.camera || !this.controls || !this.currentFraming) return;
    this.cameraController.focusHotspot(
      this.T,
      this.camera,
      this.controls,
      this.currentFraming,
      hotspot,
      this.reducedMotion,
      () => this.requestRender()
    );
  }

  zoomIn(): void {
    if (!this.camera || !this.controls) return;
    this.cameraController.zoomByFactor(
      this.camera,
      this.controls,
      0.8,
      this.reducedMotion,
      () => this.requestRender()
    );
  }

  zoomOut(): void {
    if (!this.camera || !this.controls) return;
    this.cameraController.zoomByFactor(
      this.camera,
      this.controls,
      1.25,
      this.reducedMotion,
      () => this.requestRender()
    );
  }

  setAutoRotate(enabled: boolean): void {
    this.autoRotateEnabled = enabled && !this.reducedMotion;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotateEnabled;
    }
    if (this.autoRotateEnabled) {
      this.requestRender();
    }
  }

  setViewportVisibility(visible: boolean): void {
    this.isVisibleInViewport = visible;
    if (visible) {
      this.requestRender();
    } else {
      this.stopLoop();
    }
  }

  handleResize(): void {
    if (!this.containerEl || !this.renderer || !this.camera) return;
    const width = Math.max(this.containerEl.clientWidth, 1);
    const height = Math.max(this.containerEl.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.requestRender();
  }

  requestRender(): void {
    if (this.destroyed || !this.isVisibleInViewport || !this.isDocumentVisible) return;
    this.needsRender = true;
    if (this.rafId === null) {
      this.ngZone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(() => this.tick());
      });
    }
  }

  private tick(): void {
    this.rafId = null;
    if (this.destroyed || !this.renderer || !this.scene || !this.camera || !this.controls) {
      return;
    }

    const prevPos = this.camera.position.clone();
    const controlsUpdated = this.controls.update();
    const moved = prevPos.distanceToSquared(this.camera.position) > 1e-8;

    if (this.needsRender || controlsUpdated || moved || this.autoRotateEnabled) {
      this.renderer.render(this.scene, this.camera);
      this.projectHotspots();
      this.needsRender = false;
    }

    // Keep animating only while autoRotate or OrbitControls damping is actively settling
    if (
      this.isVisibleInViewport &&
      this.isDocumentVisible &&
      (this.autoRotateEnabled || moved || this.dampingActive)
    ) {
      if (!moved && !this.autoRotateEnabled) {
        this.dampingActive = false;
      }
      this.rafId = requestAnimationFrame(() => this.tick());
    }
  }

  private projectHotspots(): void {
    if (!this.T || !this.camera || !this.currentProduct || !this.currentFraming || !this.stageGroup) {
      return;
    }
    const hotspots = this.currentProduct.model3d.hotspots;
    if (!hotspots.length) {
      this.callbacks?.onHotspotsProjected([]);
      return;
    }

    const T = this.T;
    const camPos = this.camera.position;
    const framing = this.currentFraming;
    const projected: ProjectedHotspot[] = hotspots.map((hs) => {
      const worldPos = new T.Vector3(
        framing.center.x + hs.anchor.x * framing.size.x,
        framing.center.y + hs.anchor.y * framing.size.y,
        framing.center.z + hs.anchor.z * framing.size.z
      );

      const normal = new T.Vector3(hs.normal.x, hs.normal.y, hs.normal.z).normalize();
      const toCam = camPos.clone().sub(worldPos).normalize();
      const facingCamera = normal.dot(toCam) > 0.08;

      const ndc = worldPos.clone().project(this.camera!);
      const inBounds = ndc.z > -1 && ndc.z < 1 && Math.abs(ndc.x) <= 0.96 && Math.abs(ndc.y) <= 0.94;

      return {
        hotspot: hs,
        xPercent: (ndc.x * 0.5 + 0.5) * 100,
        yPercent: (-ndc.y * 0.5 + 0.5) * 100,
        visible: facingCamera && inBounds,
      };
    });

    this.callbacks?.onHotspotsProjected(projected);
  }

  private onVisibilityChange(): void {
    this.isDocumentVisible = !document.hidden;
    if (this.isDocumentVisible && this.isVisibleInViewport) {
      this.requestRender();
    } else {
      this.stopLoop();
    }
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.stopLoop();
    this.cameraController.destroy();
    this.animator.destroy();
    document.removeEventListener('visibilitychange', this.boundVisibilityChange);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    if (this.currentModelRoot && this.stageGroup) {
      this.stageGroup.remove(this.currentModelRoot);
      this.currentModelRoot = null;
    }
    this.cache.setActiveId(null);

    this.groundShadowGeo?.dispose();
    this.groundShadowMat?.dispose();
    this.contactShadowGeo?.dispose();
    this.contactShadowMat?.dispose();
    this.contactShadowTex?.dispose();
    this.envRenderTarget?.dispose();
    this.pmremGenerator?.dispose();

    if (this.renderer) {
      this.renderer.domElement.removeEventListener('webglcontextlost', this.boundContextLost);
      this.renderer.domElement.removeEventListener('webglcontextrestored', this.boundContextRestored);
      this.renderer.dispose();
      this.renderer.domElement.remove();
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;
    this.stageGroup = null;
    this.containerEl = null;
    this.callbacks = null;
  }
}
