import { Injectable } from '@angular/core';
import gsap from 'gsap';
import type * as ThreeNamespace from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPresetId } from '../models/camera-preset.model';
import { ProductHotspot } from '../models/product-hotspot.model';

export interface FramingBox {
  readonly center: ThreeNamespace.Vector3;
  readonly size: ThreeNamespace.Vector3;
  readonly radius: number;
}

@Injectable()
export class CameraControllerService {
  private activeTween: gsap.core.Timeline | null = null;

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

  getIdealDistance(
    camera: ThreeNamespace.PerspectiveCamera,
    framing: FramingBox,
    distanceScale = 1.18
  ): number {
    const fovRad = (camera.fov * Math.PI) / 180;
    const aspect = Math.max(camera.aspect, 0.65);
    const vDist = (framing.size.y * 0.6) / Math.tan(fovRad / 2);
    const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
    const hDist = (framing.size.x * 0.64) / Math.tan(hFov / 2);
    return Math.max(vDist, hDist, framing.radius * 2.05) * distanceScale;
  }

  cancelTransition(): void {
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
    distanceScale: number,
    immediate: boolean,
    onFrameUpdate: () => void
  ): void {
    const dist = this.getIdealDistance(camera, framing, distanceScale);
    const target = framing.center.clone();
    // Slight downward target offset lifts the model cleanly above the bottom controls bar
    target.y -= framing.size.y * 0.08;
    const pos = target.clone();

    switch (preset) {
      case 'front':
        pos.add(new T.Vector3(0, framing.size.y * 0.02, dist));
        break;
      case 'back':
        pos.add(new T.Vector3(0, framing.size.y * 0.04, -dist));
        break;
      case 'left':
        pos.add(new T.Vector3(-dist, framing.size.y * 0.03, 0));
        break;
      case 'right':
        pos.add(new T.Vector3(dist, framing.size.y * 0.03, 0));
        break;
      case 'top':
        pos.add(new T.Vector3(0, dist * 1.05, dist * 0.14));
        break;
      case 'perspective':
      default: {
        const yaw = (defaultYawDeg * Math.PI) / 180;
        const pitch = (defaultPitchDeg * Math.PI) / 180;
        pos.add(
          new T.Vector3(
            Math.sin(yaw) * Math.cos(pitch) * dist,
            Math.sin(pitch) * dist,
            Math.cos(yaw) * Math.cos(pitch) * dist
          )
        );
        break;
      }
    }

    this.animateCameraTo(camera, controls, pos, target, immediate, onFrameUpdate);
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
      .multiplyScalar(Math.max(framing.radius * 1.45, 1.15));

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

  private animateCameraTo(
    camera: ThreeNamespace.PerspectiveCamera,
    controls: OrbitControls,
    destPos: ThreeNamespace.Vector3,
    destTarget: ThreeNamespace.Vector3,
    immediate: boolean,
    onFrameUpdate: () => void,
    duration = 0.72
  ): void {
    this.cancelTransition();

    if (immediate) {
      camera.position.copy(destPos);
      controls.target.copy(destTarget);
      controls.update();
      onFrameUpdate();
      return;
    }

    const tl = gsap.timeline({
      defaults: { duration, ease: 'power3.inOut' },
      onUpdate: () => {
        controls.update();
        onFrameUpdate();
      },
      onComplete: () => {
        this.activeTween = null;
        onFrameUpdate();
      },
    });

    tl.to(camera.position, { x: destPos.x, y: destPos.y, z: destPos.z }, 0);
    tl.to(controls.target, { x: destTarget.x, y: destTarget.y, z: destTarget.z }, 0);
    this.activeTween = tl;
  }

  destroy(): void {
    this.cancelTransition();
  }
}
