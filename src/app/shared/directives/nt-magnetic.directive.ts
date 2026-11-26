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

/**
 * Adds a restrained, precision magnetic attraction (±4px max) to primary CTA buttons
 * on fine-pointer desktop devices using native RAF + GPU transforms outside Angular Zone.
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

  private cachedRect: DOMRect | null = null;
  private rafId: number | null = null;
  private targetX = 0;
  private targetY = 0;
  private prevTransition = '';

  private readonly onPointerEnter = () => {
    const el = this.elRef.nativeElement;
    this.cachedRect = el.getBoundingClientRect();
    el.style.willChange = 'transform';
    el.style.transition = 'transform 140ms cubic-bezier(0.22, 1, 0.36, 1)';
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const rect = this.cachedRect ?? this.elRef.nativeElement.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
    const relY = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
    const max = this.magneticMax();

    this.targetX = Math.max(-max, Math.min(max, relX * max * 2));
    this.targetY = Math.max(-max, Math.min(max, relY * max * 2));

    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.elRef.nativeElement.style.transform = `translate3d(${this.targetX.toFixed(2)}px, ${this.targetY.toFixed(2)}px, 0)`;
    });
  };

  private readonly onPointerLeave = () => {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cachedRect = null;
    const el = this.elRef.nativeElement;
    el.style.transition = this.prevTransition || 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = '';
    el.style.willChange = '';
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.shouldDisable()) return;

    const el = this.elRef.nativeElement;
    this.prevTransition = el.style.transition;
    this.ngZone.runOutsideAngular(() => {
      el.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
      el.addEventListener('pointermove', this.onPointerMove, { passive: true });
      el.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    const el = this.elRef.nativeElement;
    el.removeEventListener('pointerenter', this.onPointerEnter);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerleave', this.onPointerLeave);
    el.style.transform = '';
    el.style.willChange = '';
  }

  private shouldDisable(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }
}
