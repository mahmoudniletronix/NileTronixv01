import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import gsap from 'gsap';

/**
 * Adds a restrained, precision magnetic attraction (±4px max) to primary CTA buttons
 * on fine-pointer desktop devices using GSAP `quickTo` outside Angular Zone.
 */
@Directive({
  selector: '[appNtMagnetic]',
})
export class NtMagneticDirective implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly magneticMax = input<number>(4.5);

  private quickX: gsap.QuickToFunc | null = null;
  private quickY: gsap.QuickToFunc | null = null;

  private readonly onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !this.quickX || !this.quickY) return;
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
    const relY = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
    const max = this.magneticMax();

    this.quickX(Math.max(-max, Math.min(max, relX * max * 2)));
    this.quickY(Math.max(-max, Math.min(max, relY * max * 2)));
  };

  private readonly onPointerLeave = () => {
    if (!this.quickX || !this.quickY) return;
    gsap.to(this.elRef.nativeElement, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
      clearProps: 'transform',
    });
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.shouldDisable()) return;

    const el = this.elRef.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      this.quickX = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3.out' });
      this.quickY = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3.out' });
      el.addEventListener('pointermove', this.onPointerMove, { passive: true });
      el.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    const el = this.elRef.nativeElement;
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerleave', this.onPointerLeave);
    gsap.killTweensOf(el);
    this.quickX = null;
    this.quickY = null;
  }

  private shouldDisable(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }
}
