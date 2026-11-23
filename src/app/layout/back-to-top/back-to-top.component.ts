import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import gsap from 'gsap';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-back-to-top',
  template: `
    <button
      type="button"
      class="back-to-top"
      [class.is-visible]="visible()"
      [attr.aria-label]="lang() === 'ar' ? 'العودة إلى أعلى الصفحة' : 'Back to top'"
      [attr.aria-hidden]="!visible()"
      [tabindex]="visible() ? 0 : -1"
      (click)="scrollToTop()"
    >
      <svg class="progress-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="ring-track" cx="24" cy="24" r="21" />
        <circle
          class="ring-fill"
          cx="24"
          cy="24"
          r="21"
          [style.stroke-dasharray]="circumference"
          [style.stroke-dashoffset]="dashOffset()"
        />
      </svg>
      <i class="fa-solid fa-arrow-up arrow-icon" aria-hidden="true"></i>
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
      width: 50px;
      height: 50px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background-color: var(--nt-dark-navy);
      color: #ffffff;
      box-shadow: 0 12px 28px rgba(6, 40, 61, 0.24);
      cursor: pointer;
      opacity: 0;
      transform: translateY(16px) scale(0.9);
      pointer-events: none;
      transition:
        opacity 240ms var(--nt-ease),
        transform 240ms var(--nt-ease),
        background-color 180ms var(--nt-ease);
    }

    .back-to-top.is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .back-to-top:hover {
      background-color: var(--nt-nile-blue);
      transform: translateY(-3px) scale(1.04);
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
      stroke: rgba(255, 255, 255, 0.14);
      stroke-width: 2.5;
    }

    .ring-fill {
      fill: none;
      stroke: var(--nt-cyan-accent);
      stroke-width: 2.5;
      stroke-linecap: round;
      transition: stroke-dashoffset 80ms linear;
    }

    .arrow-icon {
      position: relative;
      z-index: 1;
      font-size: 0.95rem;
      transition: transform 180ms var(--nt-ease);
    }

    .back-to-top:hover .arrow-icon {
      transform: translateY(-2px);
    }

    @media (max-width: 767px) {
      .back-to-top {
        inset-block-end: 1.1rem;
        inset-inline-end: 1.1rem;
        width: 46px;
        height: 46px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly lang = inject(LanguageService).lang;

  protected readonly circumference = 2 * Math.PI * 21;
  protected readonly visible = signal(false);
  protected readonly progress = signal(0);

  protected readonly dashOffset = computed(
    () => this.circumference * (1 - this.progress())
  );

  private scrollTween: gsap.core.Tween | null = null;

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (!this.isBrowser) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );

    this.visible.set(scrollY > 320);
    this.progress.set(Math.min(1, Math.max(0, scrollY / maxScroll)));
  }

  @HostListener('window:wheel')
  @HostListener('window:touchstart')
  protected cancelSmoothScroll(): void {
    this.scrollTween?.kill();
    this.scrollTween = null;
  }

  protected scrollToTop(): void {
    if (!this.isBrowser) return;

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    this.scrollTween?.kill();
    const state = { y: window.scrollY || document.documentElement.scrollTop || 0 };
    const duration = Math.min(1.15, Math.max(0.65, state.y / 2800));

    this.scrollTween = gsap.to(state, {
      y: 0,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => window.scrollTo(0, state.y),
      onComplete: () => {
        this.scrollTween = null;
      },
    });
  }

  ngOnDestroy(): void {
    this.scrollTween?.kill();
  }
}
