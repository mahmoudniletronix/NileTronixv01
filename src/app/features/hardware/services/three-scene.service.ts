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
  private contactShadowMesh: ThreeNamespace.Mesh | null = null;

  private containerEl: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private callbacks: SceneCallbacks | null = null;

  private currentProduct: HardwareProductItem | null = null;
  private currentModelRoot: ThreeNamespace.Group | null = null;
  private currentFraming: FramingBox | null = null;
  private activePreset: CameraPresetId | null = 'perspective';
  private userHasOrbited = false;

  private rafId: number | null = null;
  private isTicking = false;
  private introRotateTimer: ReturnType<typeof setTimeout> | null = null;
  private isVisibleInViewport = true;
  private isDocumentVisible = true;
  private autoRotateEnabled = false;
  private introRotateActive = false;
  private needsRender = true;
  private dampingActive = false;
  private reducedMotion = false;
  private loadGeneration = 0;
  private destroyed = false;
  private lastHotspotEmitTime = 0;
  private lastHotspotSignature = '';
  private scratchPrevPos: ThreeNamespace.Vector3 | null = null;
  private scratchWorldPos: ThreeNamespace.Vector3 | null = null;
  private scratchNormal: ThreeNamespace.Vector3 | null = null;
  private scratchToCam: ThreeNamespace.Vector3 | null = null;
  private scratchNdc: ThreeNamespace.Vector3 | null = null;

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
    this.scratchPrevPos = new T.Vector3();
    this.scratchWorldPos = new T.Vector3();
    this.scratchNormal = new T.Vector3();
    this.scratchToCam = new T.Vector3();
    this.scratchNdc = new T.Vector3();

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 300);

    const renderer = new T.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;

    renderer.domElement.className = 'nt-3d-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.addEventListener('webglcontextlost', this.boundContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', this.boundContextRestored, false);

    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new T.Scene();
    this.scene = scene;

    // Neutral industrial studio IBL environment (balanced for white & dark powder-coated metals)
    const pmrem = new T.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.045);
    roomEnv.dispose();
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.62;
    this.pmremGenerator = pmrem;
    this.envRenderTarget = envTarget;

    // Perspective camera (34deg telephoto architectural lens reduces distortion & enhances proportion)
    const camera = new T.PerspectiveCamera(34, width / height, 0.05, 50);
    camera.position.set(1.1, 0.95, 2.5);
    this.camera = camera;

    // Soft calibrated studio lighting (preserves crisp shading on white kiosks & matte terminals)
    const hemi = new T.HemisphereLight(0xf6fafd, 0xc9d7e2, 0.8);
    scene.add(hemi);

    const keyLight = new T.DirectionalLight(0xfffdf9, 1.42);
    keyLight.position.set(2.1, 5.0, 2.9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -2.2;
    keyLight.shadow.camera.right = 2.2;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -1.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);

    const fillLight = new T.DirectionalLight(0xd9eaf4, 0.78);
    fillLight.position.set(-3.0, 2.2, 2.4);
    scene.add(fillLight);

    const rimLight = new T.DirectionalLight(0xc8e4f2, 0.68);
    rimLight.position.set(-1.5, 3.0, -3.5);
    scene.add(rimLight);

    // Subtle ground directional shadow catcher
    const shadowGeo = new T.PlaneGeometry(5.5, 5.5);
    const shadowMat = new T.ShadowMaterial({ opacity: 0.13 });
    const shadowPlane = new T.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.003;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    this.groundShadowGeo = shadowGeo;
    this.groundShadowMat = shadowMat;

    // Soft radial studio contact shadow dynamically scaled to each model footprint
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const cCtx = contactCanvas.getContext('2d');
    if (cCtx) {
      const grad = cCtx.createRadialGradient(128, 128, 14, 128, 128, 124);
      grad.addColorStop(0, 'rgba(10, 25, 36, 0.34)');
      grad.addColorStop(0.45, 'rgba(10, 25, 36, 0.14)');
      grad.addColorStop(1, 'rgba(10, 25, 36, 0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(0, 0, 256, 256);
    }
    const contactTex = new T.CanvasTexture(contactCanvas);
    const contactGeo = new T.PlaneGeometry(1, 1);
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
    this.contactShadowMesh = contactMesh;

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
      this.stopIntroRotate();
      this.userHasOrbited = true;
      this.activePreset = null;
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

      // Always halt any active intro rotation before framing the new hardware model
      this.stopIntroRotate();

      this.currentFraming = this.cameraController.computeFraming(this.T, this.stageGroup);
      this.activePreset = 'perspective';
      this.userHasOrbited = false;

      // Dynamically scale contact shadow to match the loaded hardware footprint
      if (this.contactShadowMesh) {
        const footprintX = Math.max(this.currentFraming.size.x * 1.9, 0.85);
        const footprintZ = Math.max(this.currentFraming.size.z * 1.9, 0.85);
        this.contactShadowMesh.scale.set(footprintX, footprintZ, 1);
      }

      const idealDist = this.cameraController.getIdealDistance(
        this.T,
        this.camera,
        this.currentFraming,
        product.model3d.defaultYawDeg,
        product.model3d.defaultPitchDeg
      );
      this.controls.minDistance = Math.max(this.currentFraming.radius * 1.05, 0.75);
      this.controls.maxDistance = Math.max(idealDist * 2.2, 4.8);

      // Snap cleanly to the new model's front-facing 3/4 pose before starting subtle intro spin
      this.cameraController.moveToPreset(
        this.T,
        this.camera,
        this.controls,
        this.currentFraming,
        'perspective',
        product.model3d.defaultYawDeg,
        product.model3d.defaultPitchDeg,
        true,
        () => this.requestRender(),
        () => {
          if (!this.destroyed && gen === this.loadGeneration) {
            this.startIntroRotate();
          }
        }
      );

      this.animator.animateEntrance(this.stageGroup, this.reducedMotion, () => {
        if (this.renderer) {
          this.renderer.shadowMap.needsUpdate = true;
        }
        this.requestRender();
      });

      this.lastHotspotSignature = '';
      if (this.renderer) {
        this.renderer.shadowMap.needsUpdate = true;
      }
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
    this.stopIntroRotate();
    this.activePreset = preset;
    this.userHasOrbited = false;
    this.cameraController.moveToPreset(
      this.T,
      this.camera,
      this.controls,
      this.currentFraming,
      preset,
      this.currentProduct.model3d.defaultYawDeg,
      this.currentProduct.model3d.defaultPitchDeg,
      this.reducedMotion,
      () => this.requestRender()
    );
  }

  focusHotspot(hotspot: ProductHotspot): void {
    if (!this.T || !this.camera || !this.controls || !this.currentFraming) return;
    this.stopIntroRotate();
    this.userHasOrbited = true;
    this.activePreset = null;
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
    this.stopIntroRotate();
    this.userHasOrbited = true;
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
    this.stopIntroRotate();
    this.userHasOrbited = true;
    this.cameraController.zoomByFactor(
      this.camera,
      this.controls,
      1.25,
      this.reducedMotion,
      () => this.requestRender()
    );
  }

  setAutoRotate(enabled: boolean): void {
    this.stopIntroRotate();
    this.autoRotateEnabled = enabled && !this.reducedMotion;
    if (this.controls) {
      this.controls.autoRotateSpeed = 1.15;
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

    // Recalculate auto-framing cleanly on resize while preserving user's manual camera angle
    if (
      !this.userHasOrbited &&
      this.activePreset &&
      this.T &&
      this.controls &&
      this.currentFraming &&
      this.currentProduct
    ) {
      this.cameraController.moveToPreset(
        this.T,
        this.camera,
        this.controls,
        this.currentFraming,
        this.activePreset,
        this.currentProduct.model3d.defaultYawDeg,
        this.currentProduct.model3d.defaultPitchDeg,
        true,
        () => this.requestRender()
      );
    } else {
      this.requestRender();
    }
  }

  requestRender(): void {
    if (this.destroyed || !this.isVisibleInViewport || !this.isDocumentVisible) return;
    this.needsRender = true;
    if (!this.isTicking && this.rafId === null) {
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

    this.isTicking = true;
    try {
      const prevPos = this.scratchPrevPos!;
      prevPos.copy(this.camera.position);
      const controlsUpdated = this.controls.update();
      const moved = prevPos.distanceToSquared(this.camera.position) > 1e-7;

      const isRotating = this.autoRotateEnabled || this.introRotateActive;
      const shouldRender = this.needsRender || controlsUpdated || moved || isRotating;
      if (shouldRender) {
        this.renderer.render(this.scene, this.camera);
        this.projectHotspots(!moved && !isRotating);
        this.needsRender = false;
      }

      // Keep animating only while autoRotate, brief intro spin, or OrbitControls damping is active
      if (
        this.isVisibleInViewport &&
        this.isDocumentVisible &&
        (isRotating || moved || this.dampingActive)
      ) {
        if (!moved && !isRotating) {
          this.dampingActive = false;
        }
        if (this.rafId === null) {
          this.rafId = requestAnimationFrame(() => this.tick());
        }
      }
    } finally {
      this.isTicking = false;
    }
  }

  private startIntroRotate(): void {
    this.stopIntroRotate();
    if (this.reducedMotion || this.autoRotateEnabled || !this.controls) return;

    this.introRotateActive = true;
    this.controls.autoRotateSpeed = 0.65;
    this.controls.autoRotate = true;
    this.requestRender();

    this.ngZone.runOutsideAngular(() => {
      this.introRotateTimer = setTimeout(() => {
        this.stopIntroRotate();
      }, 2600);
    });
  }

  private stopIntroRotate(): void {
    if (this.introRotateTimer !== null) {
      clearTimeout(this.introRotateTimer);
      this.introRotateTimer = null;
    }
    if (this.introRotateActive) {
      this.introRotateActive = false;
      if (this.controls) {
        this.controls.autoRotate = this.autoRotateEnabled;
        this.controls.autoRotateSpeed = 1.15;
      }
      this.projectHotspots(true);
    }
  }

  private projectHotspots(force = false): void {
    if (
      !this.T ||
      !this.camera ||
      !this.currentProduct ||
      !this.currentFraming ||
      !this.stageGroup ||
      !this.scratchWorldPos ||
      !this.scratchNormal ||
      !this.scratchToCam ||
      !this.scratchNdc
    ) {
      return;
    }

    const now = performance.now();
    if (!force && now - this.lastHotspotEmitTime < 34) {
      return;
    }

    const hotspots = this.currentProduct.model3d.hotspots;
    if (!hotspots.length) {
      if (this.lastHotspotSignature !== 'empty') {
        this.lastHotspotSignature = 'empty';
        this.lastHotspotEmitTime = now;
        this.callbacks?.onHotspotsProjected([]);
      }
      return;
    }

    const camPos = this.camera.position;
    const framing = this.currentFraming;
    const worldPos = this.scratchWorldPos;
    const normal = this.scratchNormal;
    const toCam = this.scratchToCam;
    const ndc = this.scratchNdc;

    let signature = '';
    const projected: ProjectedHotspot[] = hotspots.map((hs) => {
      worldPos.set(
        framing.center.x + hs.anchor.x * framing.size.x,
        framing.center.y + hs.anchor.y * framing.size.y,
        framing.center.z + hs.anchor.z * framing.size.z
      );

      normal.set(hs.normal.x, hs.normal.y, hs.normal.z).normalize();
      toCam.copy(camPos).sub(worldPos).normalize();
      const facingCamera = normal.dot(toCam) > 0.08;

      ndc.copy(worldPos).project(this.camera!);
      const inBounds = ndc.z > -1 && ndc.z < 1 && Math.abs(ndc.x) <= 0.96 && Math.abs(ndc.y) <= 0.94;
      const visible = facingCamera && inBounds;
      const xPercent = Math.round((ndc.x * 0.5 + 0.5) * 200) / 2;
      const yPercent = Math.round((-ndc.y * 0.5 + 0.5) * 200) / 2;

      signature += `${hs.id}:${visible ? 1 : 0}:${xPercent}:${yPercent}|`;
      return {
        hotspot: hs,
        xPercent,
        yPercent,
        visible,
      };
    });

    if (!force && signature === this.lastHotspotSignature) {
      return;
    }
    this.lastHotspotSignature = signature;
    this.lastHotspotEmitTime = now;
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
    this.stopIntroRotate();
    this.stopLoop();
    this.contactShadowMesh = null;
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
