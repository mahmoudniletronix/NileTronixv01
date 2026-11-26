import { DOCUMENT, isPlatformBrowser } from '@angular/common';
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
 * Adds a restrained cursor-following specular spotlight overlay (inspired by SpotlightCard)
 * using a dedicated non-interactive layer so it never conflicts with `::before`/`::after`
 * corner marks or existing backgrounds. Runs strictly outside Angular Zone.
 */
@Directive({
  selector: '[appNtSpotlight]',
})
export class NtSpotlightDirective implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly spotlightTone = input<'dark' | 'light'>('dark');

  private layerEl: HTMLSpanElement | null = null;
  private cachedRect: DOMRect | null = null;
  private rafId: number | null = null;
  private nextX = 0;
  private nextY = 0;

  private readonly onPointerEnter = () => {
    this.cachedRect = this.elRef.nativeElement.getBoundingClientRect();
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !this.layerEl) return;
    const rect = this.cachedRect ?? this.elRef.nativeElement.getBoundingClientRect();
    this.nextX = e.clientX - rect.left;
    this.nextY = e.clientY - rect.top;

    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      if (!this.layerEl) return;
      this.layerEl.style.setProperty('--nt-spot-x', `${this.nextX.toFixed(1)}px`);
      this.layerEl.style.setProperty('--nt-spot-y', `${this.nextY.toFixed(1)}px`);
      this.layerEl.classList.add('is-active');
    });
  };

  private readonly onPointerLeave = () => {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cachedRect = null;
    this.layerEl?.classList.remove('is-active');
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.shouldDisable()) return;

    const host = this.elRef.nativeElement;
    const layer = this.document.createElement('span');
    layer.setAttribute('aria-hidden', 'true');
    layer.className = `nt-spotlight-layer ${
      this.spotlightTone() === 'light' ? 'is-light' : 'is-dark'
    }`;

    host.classList.add('nt-spotlight-host');
    host.insertBefore(layer, host.firstChild);
    this.layerEl = layer;

    this.ngZone.runOutsideAngular(() => {
      host.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
      host.addEventListener('pointermove', this.onPointerMove, { passive: true });
      host.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    const host = this.elRef.nativeElement;
    host.removeEventListener('pointerenter', this.onPointerEnter);
    host.removeEventListener('pointermove', this.onPointerMove);
    host.removeEventListener('pointerleave', this.onPointerLeave);
    this.cachedRect = null;
    host.classList.remove('nt-spotlight-host');
    this.layerEl?.remove();
    this.layerEl = null;
  }

  private shouldDisable(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }
}
