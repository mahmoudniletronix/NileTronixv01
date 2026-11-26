import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import gsap from 'gsap';
import type Lenis from 'lenis';

export interface SmoothScrollOptions {
  readonly offset?: number;
  readonly duration?: number;
  readonly immediate?: boolean;
}

/**
 * Coordinates desktop Lenis smooth inertial scrolling synchronized with GSAP's ticker
 * and ScrollTrigger. Automatically bypasses touch/coarse-pointer devices and honors
 * `prefers-reduced-motion: reduce`, while providing a unified `scrollTo` API for all
 * devices.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly ngZone = inject(NgZone);
  private readonly document = inject(DOCUMENT);

  private lenis: Lenis | null = null;
  private tickerFn: ((time: number) => void) | null = null;
  private fallbackTween: gsap.core.Tween | null = null;
  private initPromise: Promise<void> | null = null;
  private destroyed = false;

  init(): Promise<void> {
    if (!this.isBrowser || this.lenis || this.initPromise) {
      return this.initPromise ?? Promise.resolve();
    }

    if (this.prefersReducedMotion() || this.isTouchPrimaryDevice()) {
      return Promise.resolve();
    }

    this.destroyed = false;
    this.initPromise = this.ngZone.runOutsideAngular(async () => {
      try {
        const [{ default: LenisCtor }, { ScrollTrigger }] = await Promise.all([
          import('lenis'),
          import('gsap/ScrollTrigger'),
        ]);

        if (this.destroyed) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new LenisCtor({
          duration: 1.05,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.5,
          autoRaf: false,
        });

        this.lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);

        this.tickerFn = (time: number) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(this.tickerFn);
        gsap.ticker.lagSmoothing(0);
      } catch {
        // Gracefully degrade to native scrolling if dynamic chunk fails
      }
    });

    return this.initPromise;
  }

  destroy(): void {
    this.destroyed = true;
    this.fallbackTween?.kill();
    this.fallbackTween = null;

    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    this.initPromise = null;
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  scrollToTop(immediate = false): void {
    this.scrollTo(0, { immediate, duration: 0.95 });
  }

  scrollToElement(elementId: string, options: SmoothScrollOptions = {}): void {
    if (!this.isBrowser) return;
    const el = this.document.getElementById(elementId);
    if (!el) return;
    this.scrollTo(el, options);
  }

  scrollTo(target: number | HTMLElement, options: SmoothScrollOptions = {}): void {
    if (!this.isBrowser) return;

    const offset = options.offset ?? 0;
    const reduced = this.prefersReducedMotion();
    const immediate = Boolean(options.immediate || reduced);

    if (this.lenis) {
      this.ngZone.runOutsideAngular(() => {
        this.lenis?.scrollTo(target, {
          offset,
          duration: immediate ? 0 : (options.duration ?? 1.05),
          immediate,
        });
      });
      return;
    }

    let targetY = 0;
    if (typeof target === 'number') {
      targetY = Math.max(0, target + offset);
    } else {
      const rect = target.getBoundingClientRect();
      targetY = Math.max(0, rect.top + window.scrollY + offset);
    }

    if (immediate) {
      window.scrollTo(0, targetY);
      return;
    }

    this.fallbackTween?.kill();
    const state = { y: window.scrollY || this.document.documentElement.scrollTop || 0 };
    const distance = Math.abs(targetY - state.y);
    const duration = options.duration ?? Math.min(1.0, Math.max(0.45, distance / 2600));

    this.ngZone.runOutsideAngular(() => {
      this.fallbackTween = gsap.to(state, {
        y: targetY,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => window.scrollTo(0, state.y),
        onComplete: () => {
          this.fallbackTween = null;
        },
      });
    });
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private isTouchPrimaryDevice(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    );
  }
}
