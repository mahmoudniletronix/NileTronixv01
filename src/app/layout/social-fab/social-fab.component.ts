import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import gsap from 'gsap';
import { LanguageService } from '../../core/i18n/language.service';

export interface SocialFabItem {
  readonly id: 'whatsapp' | 'instagram' | 'facebook' | 'linkedin';
  readonly icon: string;
  readonly labelEn: string;
  readonly labelAr: string;
  readonly href: string;
  readonly brandColor: string;
  readonly brandBg: string;
  /** Angle in degrees along the inward semicircle (LTR reference) */
  readonly angleDeg: number;
}

const SOCIAL_ITEMS: readonly SocialFabItem[] = [
  {
    id: 'whatsapp',
    icon: 'fa-brands fa-whatsapp',
    labelEn: 'WhatsApp',
    labelAr: 'واتساب',
    href: 'https://wa.me/201000000000',
    brandColor: '#25d366',
    brandBg: '#25d366',
    angleDeg: 95,
  },
  {
    id: 'instagram',
    icon: 'fa-brands fa-instagram',
    labelEn: 'Instagram',
    labelAr: 'إنستجرام',
    href: 'https://www.instagram.com/niletronix',
    brandColor: '#dd2a7b',
    brandBg: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 52%, #8134af 100%)',
    angleDeg: 140,
  },
  {
    id: 'facebook',
    icon: 'fa-brands fa-facebook-f',
    labelEn: 'Facebook',
    labelAr: 'فيسبوك',
    href: 'https://www.facebook.com/niletronix',
    brandColor: '#1877f2',
    brandBg: '#1877f2',
    angleDeg: 185,
  },
  {
    id: 'linkedin',
    icon: 'fa-brands fa-linkedin-in',
    labelEn: 'LinkedIn',
    labelAr: 'لينكدإن',
    href: 'https://www.linkedin.com/company/niletronix',
    brandColor: '#0a66c2',
    brandBg: '#0a66c2',
    angleDeg: 230,
  },
];

@Component({
  selector: 'app-social-fab',
  template: `
    <div
      class="social-fab-wrap"
      [class.is-open]="isOpen()"
    >
      <!-- Semicircle Fanned Social Icons -->
      <div
        class="social-arc"
        role="menu"
        [attr.aria-hidden]="!isOpen()"
      >
        @for (item of items; track item.id; let idx = $index) {
          <a
            #arcItem
            class="arc-btn"
            role="menuitem"
            [href]="item.href"
            target="_blank"
            rel="noopener noreferrer"
            [style.--brand-color]="item.brandColor"
            [style.--brand-bg]="item.brandBg"
            [attr.aria-label]="lang() === 'ar' ? item.labelAr : item.labelEn"
            [attr.title]="lang() === 'ar' ? item.labelAr : item.labelEn"
            [attr.tabindex]="isOpen() ? 0 : -1"
            (click)="close()"
          >
            <i [class]="item.icon" aria-hidden="true"></i>
          </a>
        }
      </div>

      <!-- Main Floating Social Toggle Button with Auto-Cycling Icon -->
      <button
        type="button"
        class="fab-trigger"
        [class.is-open]="isOpen()"
        [style.--active-brand]="activeItem().brandColor"
        [style.--active-bg]="activeItem().brandBg"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-label]="
          isOpen()
            ? (lang() === 'ar' ? 'إغلاق روابط التواصل' : 'Close social links')
            : (lang() === 'ar' ? 'تواصل معنا عبر السوشيال ميديا' : 'Connect on social media')
        "
        (click)="toggle()"
      >
        <span class="fab-pulse" aria-hidden="true"></span>
        @if (isOpen()) {
          <i class="fa-solid fa-xmark fab-icon is-close" aria-hidden="true"></i>
        } @else {
          @for (item of items; track item.id; let idx = $index) {
            <i
              [class]="item.icon + ' fab-icon cycle-icon'"
              [class.is-current]="idx === activeIconIndex()"
              aria-hidden="true"
            ></i>
          }
        }
      </button>
    </div>
  `,
  styles: `
    .social-fab-wrap {
      position: fixed;
      inset-block-end: 5.5rem;
      inset-inline-end: 1.5rem;
      z-index: 155;
      width: 50px;
      height: 50px;
    }

    .social-arc {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .arc-btn {
      position: absolute;
      inset: 3px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--brand-bg);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.08rem;
      text-decoration: none;
      box-shadow: 0 10px 24px rgba(8, 47, 67, 0.22);
      opacity: 0;
      transform: scale(0.35);
      pointer-events: none;
      will-change: transform, opacity;
      transition:
        filter 180ms var(--nt-ease),
        box-shadow 180ms var(--nt-ease);
    }

    .social-fab-wrap.is-open .arc-btn {
      pointer-events: auto;
    }

    .arc-btn:hover,
    .arc-btn:focus-visible {
      filter: brightness(1.08);
      box-shadow: 0 12px 28px rgba(8, 47, 67, 0.3);
      outline: none;
    }

    /* Main Floating Social Trigger */
    .fab-trigger {
      position: relative;
      z-index: 2;
      width: 50px;
      height: 50px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--active-bg);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 28px rgba(8, 47, 67, 0.28);
      cursor: pointer;
      transition:
        background 360ms var(--nt-ease),
        transform 200ms var(--nt-ease),
        filter 200ms var(--nt-ease);
    }

    .fab-trigger:hover {
      filter: brightness(1.06);
      transform: scale(1.06);
    }

    .fab-trigger.is-open {
      background: var(--nt-dark-navy);
    }

    .fab-trigger.is-open:hover {
      background: var(--nt-nile-blue);
    }

    .fab-trigger:focus-visible {
      outline: 2px solid var(--nt-cyan-accent);
      outline-offset: 3px;
    }

    .fab-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid var(--active-brand);
      opacity: 0;
      pointer-events: none;
      animation: socialPulse 2.8s var(--nt-ease) infinite;
      transition: border-color 320ms var(--nt-ease);
    }

    .fab-trigger.is-open .fab-pulse {
      animation: none;
      opacity: 0;
    }

    .fab-icon {
      font-size: 1.2rem;
      line-height: 1;
    }

    .cycle-icon {
      position: absolute;
      opacity: 0;
      transform: scale(0.45) rotate(-25deg);
      transition:
        opacity 320ms var(--nt-ease),
        transform 360ms var(--nt-ease);
      pointer-events: none;
    }

    .cycle-icon.is-current {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    .fab-icon.is-close {
      font-size: 1.1rem;
      animation: closeSpinIn 240ms var(--nt-ease) both;
    }

    @keyframes socialPulse {
      0% {
        transform: scale(0.92);
        opacity: 0.55;
      }
      70% {
        transform: scale(1.26);
        opacity: 0;
      }
      100% {
        transform: scale(1.26);
        opacity: 0;
      }
    }

    @keyframes closeSpinIn {
      from {
        opacity: 0;
        transform: rotate(-90deg) scale(0.6);
      }
      to {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }
    }

    @media (max-width: 767px) {
      .social-fab-wrap {
        inset-block-end: 4.75rem;
        inset-inline-end: 1.1rem;
        width: 46px;
        height: 46px;
      }

      .fab-trigger {
        width: 46px;
        height: 46px;
      }

      .arc-btn {
        inset: 2px;
        width: 42px;
        height: 42px;
        font-size: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .fab-pulse {
        animation: none;
      }
      .cycle-icon {
        transition: opacity 150ms linear;
        transform: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialFabComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly langService = inject(LanguageService);

  @ViewChildren('arcItem') private arcItems?: QueryList<ElementRef<HTMLAnchorElement>>;

  protected readonly lang = this.langService.lang;
  protected readonly isRtl = this.langService.isRtl;
  protected readonly items = SOCIAL_ITEMS;

  protected readonly isOpen = signal(false);
  protected readonly activeIconIndex = signal(0);
  protected readonly activeItem = computed(
    () => this.items[this.activeIconIndex()] ?? this.items[0]
  );

  private cycleTimer: ReturnType<typeof setInterval> | null = null;
  private arcTimeline: gsap.core.Timeline | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.cycleTimer = setInterval(() => {
      if (!this.isOpen()) {
        this.activeIconIndex.update((i) => (i + 1) % this.items.length);
      }
    }, 2200);
  }

  ngOnDestroy(): void {
    if (this.cycleTimer !== null) {
      clearInterval(this.cycleTimer);
      this.cycleTimer = null;
    }
    this.arcTimeline?.kill();
    this.arcTimeline = null;
  }

  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  protected open(): void {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    this.animateArc(true);
  }

  protected close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.animateArc(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node | null;
    if (target && !this.hostEl.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }

  private animateArc(opening: boolean): void {
    if (!this.isBrowser || !this.arcItems?.length) return;

    const nodes = this.arcItems.toArray().map((ref) => ref.nativeElement);
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 767;
    const radius = isMobile ? 68 : 78;
    const dirSign = this.isRtl() ? -1 : 1;

    this.arcTimeline?.kill();
    const tl = gsap.timeline();
    this.arcTimeline = tl;

    nodes.forEach((el, idx) => {
      const item = this.items[idx];
      const rad = (item.angleDeg * Math.PI) / 180;
      // cos(angle) is negative for 95..230° (fans left in LTR; negated in RTL to fan right)
      const tx = Math.cos(rad) * radius * dirSign;
      // sin(angle) is positive for 95..180° (upward -> negative CSS Y), negative for >180° (downward -> positive CSS Y)
      const ty = -Math.sin(rad) * radius;

      if (opening) {
        tl.to(
          el,
          {
            x: tx,
            y: ty,
            scale: 1,
            opacity: 1,
            duration: reducedMotion ? 0.15 : 0.42,
            ease: reducedMotion ? 'power1.out' : 'back.out(1.7)',
          },
          reducedMotion ? 0 : idx * 0.055
        );
      } else {
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            scale: 0.35,
            opacity: 0,
            duration: reducedMotion ? 0.12 : 0.24,
            ease: 'power2.in',
          },
          reducedMotion ? 0 : (nodes.length - 1 - idx) * 0.03
        );
      }
    });
  }
}
