import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { NtIconComponent, NtIconName } from '../../shared/ui/nt-icon.component';

export interface SocialFabItem {
  readonly id: 'whatsapp' | 'instagram' | 'facebook' | 'linkedin';
  readonly icon: NtIconName;
  readonly labelEn: string;
  readonly labelAr: string;
  readonly href: string;
  readonly brandColor: string;
  readonly brandBg: string;
  readonly cos: number;
  readonly sin: number;
}

const makeItem = (
  id: SocialFabItem['id'],
  icon: NtIconName,
  labelEn: string,
  labelAr: string,
  href: string,
  brandColor: string,
  brandBg: string,
  angleDeg: number
): SocialFabItem => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    id,
    icon,
    labelEn,
    labelAr,
    href,
    brandColor,
    brandBg,
    cos: Number(Math.cos(rad).toFixed(4)),
    sin: Number((-Math.sin(rad)).toFixed(4)),
  };
};

const SOCIAL_ITEMS: readonly SocialFabItem[] = [
  makeItem(
    'whatsapp',
    'whatsapp',
    'WhatsApp',
    'واتساب',
    'https://wa.me/201000000000',
    '#25d366',
    '#25d366',
    95
  ),
  makeItem(
    'instagram',
    'instagram',
    'Instagram',
    'إنستجرام',
    'https://www.instagram.com/niletronix',
    '#dd2a7b',
    'linear-gradient(135deg, #f58529 0%, #dd2a7b 52%, #8134af 100%)',
    140
  ),
  makeItem(
    'facebook',
    'facebook',
    'Facebook',
    'فيسبوك',
    'https://www.facebook.com/niletronix',
    '#1877f2',
    '#1877f2',
    185
  ),
  makeItem(
    'linkedin',
    'linkedin',
    'LinkedIn',
    'لينكدإن',
    'https://www.linkedin.com/company/niletronix',
    '#0a66c2',
    '#0a66c2',
    230
  ),
];

@Component({
  selector: 'app-social-fab',
  imports: [NtIconComponent],
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
            class="arc-btn"
            role="menuitem"
            [href]="item.href"
            target="_blank"
            rel="noopener noreferrer"
            [style.--brand-color]="item.brandColor"
            [style.--brand-bg]="item.brandBg"
            [style.--arc-cos]="item.cos"
            [style.--arc-sin]="item.sin"
            [style.--arc-open-delay]="idx * 50 + 'ms'"
            [style.--arc-close-delay]="(items.length - 1 - idx) * 28 + 'ms'"
            [attr.aria-label]="lang() === 'ar' ? item.labelAr : item.labelEn"
            [attr.title]="lang() === 'ar' ? item.labelAr : item.labelEn"
            [attr.tabindex]="isOpen() ? 0 : -1"
            (click)="close()"
          >
            <app-nt-icon [name]="item.icon" [size]="18" />
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
          <app-nt-icon name="close" class="fab-icon is-close" [size]="18" />
        } @else {
          @for (item of items; track item.id; let idx = $index) {
            <app-nt-icon
              [name]="item.icon"
              class="fab-icon cycle-icon"
              [class.is-current]="idx === activeIconIndex()"
              [size]="20"
            />
          }
        }
      </button>
    </div>
  `,
  styles: `
    .social-fab-wrap {
      position: fixed;
      inset-block-end: 5.15rem;
      inset-inline-end: 1.5rem;
      z-index: 155;
      width: 46px;
      height: 46px;
      --arc-radius: 78px;
      --arc-dir: 1;
    }

    :host-context([dir='rtl']) .social-fab-wrap {
      --arc-dir: -1;
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
      transform: translate3d(0, 0, 0) scale(0.35);
      pointer-events: none;
      transition:
        transform 260ms cubic-bezier(0.4, 0, 1, 1) var(--arc-close-delay, 0ms),
        opacity 200ms var(--nt-ease) var(--arc-close-delay, 0ms),
        filter 180ms var(--nt-ease),
        box-shadow 180ms var(--nt-ease);
    }

    .social-fab-wrap.is-open .arc-btn {
      pointer-events: auto;
      opacity: 1;
      transform: translate3d(
        calc(var(--arc-cos) * var(--arc-radius) * var(--arc-dir)),
        calc(var(--arc-sin) * var(--arc-radius)),
        0
      ) scale(1);
      transition:
        transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--arc-open-delay, 0ms),
        opacity 280ms var(--nt-ease) var(--arc-open-delay, 0ms),
        filter 180ms var(--nt-ease),
        box-shadow 180ms var(--nt-ease);
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
      width: 46px;
      height: 46px;
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
      background: var(--nt-navy-hover);
    }

    .fab-trigger:focus-visible {
      outline: 2px solid var(--nt-focus-ring);
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
        --arc-radius: 68px;
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
      .arc-btn,
      .social-fab-wrap.is-open .arc-btn {
        transition: opacity 150ms linear;
        transition-delay: 0ms;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialFabComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly langService = inject(LanguageService);

  protected readonly lang = this.langService.lang;
  protected readonly items = SOCIAL_ITEMS;

  protected readonly isOpen = signal(false);
  protected readonly activeIconIndex = signal(0);
  protected readonly activeItem = computed(
    () => this.items[this.activeIconIndex()] ?? this.items[0]
  );

  private cycleTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.ngZone.runOutsideAngular(() => {
      this.cycleTimer = setInterval(() => {
        if (!this.isOpen() && typeof document !== 'undefined' && !document.hidden) {
          this.ngZone.run(() => {
            this.activeIconIndex.update((i) => (i + 1) % this.items.length);
          });
        }
      }, 2600);
    });
  }

  ngOnDestroy(): void {
    if (this.cycleTimer !== null) {
      clearInterval(this.cycleTimer);
      this.cycleTimer = null;
    }
  }

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
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
}
