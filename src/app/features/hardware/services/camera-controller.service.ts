import { Injectable } from '@angular/core';
import type GsapType from 'gsap';
import type * as ThreeNamespace from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadGsap } from '../../../core/animation/gsap-loader';
import { CameraPresetId } from '../models/camera-preset.model';
import { ProductHotspot } from '../models/product-hotspot.model';

export interface FramingBox {
  readonly center: ThreeNamespace.Vector3;
  readonly size: ThreeNamespace.Vector3;
  readonly radius: number;
}

@Injectable()
export class CameraControllerService {
  private activeTween: ReturnType<typeof GsapType.timeline> | null = null;
  private tweenGeneration = 0;

  computeFraming(T: typeof ThreeNamespace, object: ThreeNamespace.Object3D): FramingBox {
    object.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(object);
    const center = new T.Vector3();
    const size = new T.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const sphere = new T.Sphere();
    box.getBoundingSphere(sphere);

    return {
      center,
      size,
      radius: Math.max(sphere.radius, 0.35),
    };
  }

  /**
   * Computes exact view-aligned camera distance from the 3D bounding box so every
   * model proportion (tall kiosks, landscape displays, LED boards, compact terminals)
   * fills ~74–80% of usable viewer height/width without clipping on rotation or resize.
   */
  getIdealDistanceForDirection(
    T: typeof ThreeNamespace,
    camera: ThreeNamespace.PerspectiveCamera,
    framing: FramingBox,
    viewDir: ThreeNamespace.Vector3,
    isTopView = false
  ): number {
    const dir = viewDir.clone().normalize();
    const worldUp = isTopView ? new T.Vector3(0, 0, -1) : new T.Vector3(0, 1, 0);
    const right = new T.Vector3().crossVectors(worldUp, dir);
    if (right.lengthSq() < 1e-6) {
      right.set(1, 0, 0);
    } else {
      right.normalize();
    }
    const up = new T.Vector3().crossVectors(dir, right).normalize();

    const hx = framing.size.x * 0.5;
    const hy = framing.size.y * 0.5;
    const hz = framing.size.z * 0.5;

    // Exact projected bounding extents along the camera's local right, up, and depth axes
    const projHalfW = hx * Math.abs(right.x) + hy * Math.abs(right.y) + hz * Math.abs(right.z);
    const projHalfH = hx * Math.abs(up.x) + hy * Math.abs(up.y) + hz * Math.abs(up.z);
    const projHalfD = hx * Math.abs(dir.x) + hy * Math.abs(dir.y) + hz * Math.abs(dir.z);

    const fovRad = (camera.fov * Math.PI) / 180;
    const tanHalfV = Math.tan(fovRad / 2);
    const aspect = Math.max(camera.aspect, 0.55);
    const tanHalfH = tanHalfV * aspect;

    // Target ~76–80% of usable viewer area (leaving balanced room for top telemetry & bottom toolbar)
    const fillV = aspect < 0.9 ? 0.72 : 0.78;
    const fillH = aspect < 0.9 ? 0.84 : 0.8;

    const depthMargin = projHalfD * 0.68;
    const vDist = projHalfH / (fillV * tanHalfV) + depthMargin;
    const hDist = projHalfW / (fillH * tanHalfH) + depthMargin;

    return Math.max(vDist, hDist, framing.radius * 1.45);
  }

  getIdealDistance(
    T: typeof ThreeNamespace,
    camera: ThreeNamespace.PerspectiveCamera,
    framing: FramingBox,
    defaultYawDeg = 20,
    defaultPitchDeg = 10
  ): number {
    const dir = this.getPresetDirection(T, 'perspective', defaultYawDeg, defaultPitchDeg);
    return this.getIdealDistanceForDirection(T, camera, framing, dir, false);
  }

  cancelTransition(): void {
    this.tweenGeneration++;
    if (this.activeTween) {
      this.activeTween.kill();
      this.activeTween = null;
    }
  }

  moveToPreset(
    T: typeof ThreeNamespace,
    camera: ThreeNamespace.PerspectiveCamera,
    controls: OrbitControls,
    framing: FramingBox,
    preset: CameraPresetId,
    defaultYawDeg: number,
    defaultPitchDeg: number,
    immediate: boolean,
    onFrameUpdate: () => void,
    onComplete?: () => void
  ): void {
    const isTop = preset === 'top';
    const dir = this.getPresetDirection(T, preset, defaultYawDeg, defaultPitchDeg);
    const dist = this.getIdealDistanceForDirection(T, camera, framing, dir, isTop);

    const target = framing.center.clone();
    // Slight vertical framing offset keeps product centered cleanly between top & bottom UI chrome
    if (!isTop) {
      target.y -= framing.size.y * 0.03;
    }

    const pos = target.clone().addScaledVector(dir, dist);
    this.animateCameraTo(camera, controls, pos, target, immediate, onFrameUpdate, 0.68, onComplete);
  }

  focusHotspot(
    T: typeof ThreeNamespace,
    camera: ThreeNamespace.PerspectiveCamera,
    controls: OrbitControls,
    framing: FramingBox,
    hotspot: ProductHotspot,
    immediate: boolean,
    onFrameUpdate: () => void
  ): void {
    const anchor = new T.Vector3(
      framing.center.x + hotspot.anchor.x * framing.size.x,
      framing.center.y + hotspot.anchor.y * framing.size.y,
      framing.center.z + hotspot.anchor.z * framing.size.z
    );

    const offset = new T.Vector3(
      hotspot.cameraOffset.x,
      hotspot.cameraOffset.y,
      hotspot.cameraOffset.z
    )
      .normalize()
      .multiplyScalar(Math.max(framing.radius * 1.35, 1.05));

    const pos = anchor.clone().add(offset);
    this.animateCameraTo(camera, controls, pos, anchor, immediate, onFrameUpdate);
  }

  zoomByFactor(
    camera: ThreeNamespace.PerspectiveCamera,
    controls: OrbitControls,
    factor: number,
    immediate: boolean,
    onFrameUpdate: () => void
  ): void {
    const offset = camera.position.clone().sub(controls.target);
    const currentDist = offset.length();
    const clamped = Math.min(controls.maxDistance, Math.max(controls.minDistance, currentDist * factor));
    offset.setLength(clamped);
    const nextPos = controls.target.clone().add(offset);
    this.animateCameraTo(camera, controls, nextPos, controls.target.clone(), immediate, onFrameUpdate, 0.42);
  }

  private getPresetDirection(
    T: typeof ThreeNamespace,
    preset: CameraPresetId,
    defaultYawDeg: number,
    defaultPitchDeg: number
  ): ThreeNamespace.Vector3 {
    switch (preset) {
      case 'front':
        return new T.Vector3(0, 0.02, 1).normalize();
      case 'back':
        return new T.Vector3(0, 0.03, -1).normalize();
      case 'left':
        return new T.Vector3(-1, 0.02, 0).normalize();
      case 'right':
        return new T.Vector3(1, 0.02, 0).normalize();
      case 'top':
        return new T.Vector3(0, 0.99, 0.14).normalize();
      case 'perspective':
      default: {
        const yaw = (defaultYawDeg * Math.PI) / 180;
        const pitch = (defaultPitchDeg * Math.PI) / 180;
        return new T.Vector3(
          Math.sin(yaw) * Math.cos(pitch),
          Math.sin(pitch),
          Math.cos(yaw) * Math.cos(pitch)
        ).normalize();
      }
    }
  }

  private animateCameraTo(
    camera: ThreeNamespace.PerspectiveCamera,
    controls: OrbitControls,
    destPos: ThreeNamespace.Vector3,
    destTarget: ThreeNamespace.Vector3,
    immediate: boolean,
    onFrameUpdate: () => void,
    duration = 0.68,
    onComplete?: () => void
  ): void {
    this.cancelTransition();

    if (immediate) {
      const prevDamping = controls.enableDamping;
      controls.enableDamping = false;
      camera.position.copy(destPos);
      controls.target.copy(destTarget);
      controls.update();
      controls.enableDamping = prevDamping;
      onFrameUpdate();
      onComplete?.();
      return;
    }

    const gen = ++this.tweenGeneration;
    void loadGsap().then((gsap) => {
      if (gen !== this.tweenGeneration) return;
      const tl = gsap.timeline({
        defaults: { duration, ease: 'power3.inOut' },
        onUpdate: () => {
          controls.update();
          onFrameUpdate();
        },
        onComplete: () => {
          this.activeTween = null;
          onFrameUpdate();
          onComplete?.();
        },
      });

      tl.to(camera.position, { x: destPos.x, y: destPos.y, z: destPos.z }, 0);
      tl.to(controls.target, { x: destTarget.x, y: destTarget.y, z: destTarget.z }, 0);
      this.activeTween = tl;
    });
  }

  destroy(): void {
    this.cancelTransition();
  }
}
