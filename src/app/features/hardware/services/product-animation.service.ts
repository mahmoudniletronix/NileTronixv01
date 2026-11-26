import { Injectable } from '@angular/core';
import type GsapType from 'gsap';
import type * as ThreeNamespace from 'three';
import { loadGsap } from '../../../core/animation/gsap-loader';

@Injectable()
export class ProductAnimationService {
  private modelTimeline: ReturnType<typeof GsapType.timeline> | null = null;
  private animGeneration = 0;

  cancel(): void {
    this.animGeneration++;
    if (this.modelTimeline) {
      this.modelTimeline.kill();
      this.modelTimeline = null;
    }
  }

  animateEntrance(
    stageGroup: ThreeNamespace.Group,
    reducedMotion: boolean,
    onUpdate: () => void
  ): void {
    this.cancel();

    if (reducedMotion) {
      stageGroup.scale.setScalar(1);
      stageGroup.position.y = 0;
      stageGroup.rotation.y = 0;
      onUpdate();
      return;
    }

    stageGroup.scale.setScalar(0.92);
    stageGroup.position.y = -0.06;
    stageGroup.rotation.y = -0.35;

    const gen = ++this.animGeneration;
    void loadGsap().then((gsap) => {
      if (gen !== this.animGeneration) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onUpdate,
        onComplete: () => {
          this.modelTimeline = null;
          onUpdate();
        },
      });

      tl.to(stageGroup.scale, { x: 1, y: 1, z: 1, duration: 0.72 }, 0);
      tl.to(stageGroup.position, { y: 0, duration: 0.72 }, 0);
      tl.to(stageGroup.rotation, { y: 0, duration: 0.9, ease: 'power2.out' }, 0);

      this.modelTimeline = tl;
    });
  }

  animateOut(
    stageGroup: ThreeNamespace.Group,
    reducedMotion: boolean,
    onUpdate: () => void
  ): Promise<void> {
    this.cancel();

    if (reducedMotion) {
      return Promise.resolve();
    }

    const gen = ++this.animGeneration;
    return loadGsap().then(
      (gsap) =>
        new Promise((resolve) => {
          if (gen !== this.animGeneration) {
            resolve();
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: 'power2.in' },
            onUpdate,
            onComplete: () => {
              this.modelTimeline = null;
              resolve();
            },
          });

          tl.to(stageGroup.scale, { x: 0.93, y: 0.93, z: 0.93, duration: 0.22 }, 0);
          tl.to(stageGroup.rotation, { y: stageGroup.rotation.y + 0.18, duration: 0.22 }, 0);
          this.modelTimeline = tl;
        })
    );
  }

  destroy(): void {
    this.cancel();
  }
}
