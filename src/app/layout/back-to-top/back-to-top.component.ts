import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { SmoothScrollService } from '../../core/animation/smooth-scroll.service';
import { LanguageService } from '../../core/i18n/language.service';
import { NtIconComponent } from '../../shared/ui/nt-icon.component';

@Component({
  selector: 'app-back-to-top',
  imports: [NtIconComponent],
  template: `
    <button
      type="button"
      class="back-to-top"
      [class.is-visible]="visible()"
      [attr.aria-label]="lang() === 'ar' ? 'العودة إلى أعلى الصفحة' : 'Back to top'"
      [attr.title]="lang() === 'ar' ? 'العودة للأعلى' : 'Back to top'"
      [attr.aria-hidden]="!visible()"
      [tabindex]="visible() ? 0 : -1"
      (click)="scrollToTop()"
    >
      <svg class="progress-ring" viewBox="0 0 46 46" aria-hidden="true">
        <circle class="ring-track" cx="23" cy="23" r="21.5" />
        <circle
          #ringFill
          class="ring-fill"
          cx="23"
          cy="23"
          r="21.5"
          [style.stroke-dasharray]="circumference"
          [style.stroke-dashoffset]="circumference"
        />
      </svg>
      <app-nt-icon name="arrow-up" class="arrow-icon" [size]="16" />
    </button>
  `,
  styles: `
    .back-to-top {
      position: fixed;
      inset-block-end: 1.5rem;
      inset-inline-end: 1.5rem;
      z-index: 150;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background-color: rgba(10, 25, 36, 0.94);
      color: rgba(255, 255, 255, 0.92);
      box-shadow: 0 8px 24px rgba(10, 25, 36, 0.24);
      cursor: pointer;
      opacity: 0;
      transform: translateY(12px) scale(0.92);
      pointer-events: none;
      transition:
        opacity var(--nt-dur-base) var(--nt-ease),
        transform var(--nt-dur-base) var(--nt-ease),
        background-color var(--nt-dur-fast) var(--nt-ease),
        box-shadow var(--nt-dur-fast) var(--nt-ease),
        color var(--nt-dur-fast) var(--nt-ease);
    }

    .back-to-top.is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .back-to-top:hover {
      background-color: var(--nt-navy-hover);
      color: #ffffff;
      box-shadow: 0 10px 28px rgba(10, 25, 36, 0.32);
    }

    .back-to-top:active {
      transform: scale(0.95);
    }

    .back-to-top:focus-visible {
      outline: 2px solid var(--nt-brand-red);
      outline-offset: 3px;
    }

    .progress-ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      pointer-events: none;
    }

    .ring-track {
      fill: none;
      stroke: rgba(255, 255, 255, 0.16);
      stroke-width: 1.5;
    }

    .ring-fill {
      fill: none;
      stroke: var(--nt-brand-red);
      stroke-width: 1.85;
      stroke-linecap: round;
    }

    .arrow-icon {
      position: relative;
      z-index: 1;
      transition: transform var(--nt-dur-fast) var(--nt-ease);
    }

    .back-to-top:hover .arrow-icon {
      transform: translateY(-2px);
    }

    @media (max-width: 767px) {
      .back-to-top {
        inset-block-end: 1.1rem;
        inset-inline-end: 1.1rem;
        width: 44px;
        height: 44px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly smoothScroll = inject(SmoothScrollService);
  protected readonly lang = inject(LanguageService).lang;

  @ViewChild('ringFill') private ringFillRef?: ElementRef<SVGCircleElement>;

  protected readonly circumference = 2 * Math.PI * 21.5;
  protected readonly visible = signal(false);

  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private cachedMaxScroll = 1;

  private readonly boundScroll = () => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.updateScrollState();
    });
  };

  private readonly boundMetrics = () => {
    this.cachedMaxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    this.boundScroll();
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.cachedMaxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    this.updateScrollState();
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.boundScroll, { passive: true });
      window.addEventListener('resize', this.boundMetrics, { passive: true });
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.boundMetrics);
        this.resizeObserver.observe(document.documentElement);
      }
    });
  }

  private updateScrollState(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const progress = Math.min(1, Math.max(0, scrollY / this.cachedMaxScroll));

    // Direct DOM ring update outside Angular Zone — zero change detection during scroll
    if (this.ringFillRef) {
      this.ringFillRef.nativeElement.style.strokeDashoffset = String(
        this.circumference * (1 - progress)
      );
    }

    const shouldShow = scrollY > 320;
    if (shouldShow !== this.visible()) {
      this.ngZone.run(() => this.visible.set(shouldShow));
    }
  }

  protected scrollToTop(): void {
    if (!this.isBrowser) return;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.smoothScroll.scrollToTop();
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.boundScroll);
      window.removeEventListener('resize', this.boundMetrics);
    }
  }
}
