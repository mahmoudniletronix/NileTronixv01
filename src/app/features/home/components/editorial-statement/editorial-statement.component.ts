import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';
import gsap from 'gsap';
import { LanguageService } from '../../../../core/i18n/language.service';

interface StatementWord {
  readonly text: string;
  readonly accent: boolean;
}

const STATEMENT_EN: readonly StatementWord[] = [
  { text: 'One', accent: false },
  { text: 'engineering', accent: false },
  { text: 'partner', accent: false },
  { text: 'for', accent: false },
  { text: 'enterprise', accent: true },
  { text: 'software,', accent: true },
  { text: 'field', accent: true },
  { text: 'hardware,', accent: true },
  { text: 'and', accent: false },
  { text: 'integrated', accent: false },
  { text: 'infrastructure', accent: false },
  { text: 'built', accent: false },
  { text: 'to', accent: false },
  { text: 'operate', accent: false },
  { text: 'continuously.', accent: false },
];

const STATEMENT_AR: readonly StatementWord[] = [
  { text: 'شريك', accent: false },
  { text: 'هندسي', accent: false },
  { text: 'واحد', accent: false },
  { text: 'يجمع', accent: false },
  { text: 'البرمجيات', accent: true },
  { text: 'المؤسسية،', accent: true },
  { text: 'والأجهزة', accent: true },
  { text: 'الميدانية،', accent: true },
  { text: 'وأنظمة', accent: false },
  { text: 'التيار', accent: false },
  { text: 'الخفيف', accent: false },
  { text: 'لتشغيل', accent: false },
  { text: 'منشأتك', accent: false },
  { text: 'بثبات', accent: false },
  { text: 'واستمرارية.', accent: false },
];

@Component({
  selector: 'app-editorial-statement',
  template: `
    <section
      #sectionRoot
      class="statement-section"
      [attr.aria-label]="lang() === 'ar' ? 'فلسفة الهندسة والتكامل' : 'Engineering philosophy'"
    >
      <div class="site-container statement-inner">
        <span #topRule class="statement-rule" aria-hidden="true"></span>

        <div class="statement-layout">
          <p class="statement-meta">
            <span class="meta-dot" aria-hidden="true"></span>
            <span>
              {{
                lang() === 'ar'
                  ? 'تكامل كامل من التصميم للتشغيل'
                  : 'END-TO-END SYSTEMS INTEGRATION'
              }}
            </span>
          </p>

          <p #statementCopy class="statement-copy">
            @for (word of words(); track $index) {
              <span class="statement-word" [class.is-accent]="word.accent">{{ word.text }}</span>{{ ' ' }}
            }
          </p>

          <div class="statement-pillars" aria-hidden="true">
            <span>{{ lang() === 'ar' ? 'تطوير البرمجيات' : 'SOFTWARE PLATFORMS' }}</span>
            <span class="pillar-sep">/</span>
            <span>{{ lang() === 'ar' ? 'الأجهزة الميدانية' : 'FIELD HARDWARE' }}</span>
            <span class="pillar-sep">/</span>
            <span>{{ lang() === 'ar' ? 'التيار الخفيف والتكامل' : 'LOW-CURRENT & INTEGRATION' }}</span>
          </div>
        </div>

        <span #bottomRule class="statement-rule" aria-hidden="true"></span>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .statement-section {
      background-color: var(--nt-bg-main);
      color: var(--nt-text-primary);
      overflow-x: clip;
    }

    .statement-inner {
      padding-block: clamp(48px, 5vw, 84px);
    }

    .statement-rule {
      display: block;
      width: 100%;
      height: 1px;
      background-color: var(--nt-border);
    }

    .statement-layout {
      padding-block: clamp(2.5rem, 4.8vw, 4.5rem);
      display: flex;
      flex-direction: column;
      gap: clamp(1.35rem, 2.2vw, 2rem);
      max-width: 1080px;
    }

    .statement-meta {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      margin: 0;
      font-size: var(--nt-eyebrow-size);
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--nt-text-secondary);
    }

    :host-context([dir='rtl']) .statement-meta {
      letter-spacing: 0.02em;
      text-transform: none;
      font-size: 0.84375rem;
    }

    .meta-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--nt-brand-red);
      flex-shrink: 0;
    }

    .statement-copy {
      margin: 0;
      font-family: var(--nt-font-display);
      font-size: clamp(1.65rem, 3.25vw, 3.1rem);
      font-weight: 700;
      line-height: 1.22;
      letter-spacing: -0.026em;
      color: var(--nt-text-primary);
      text-wrap: balance;
    }

    :host-context([dir='rtl']) .statement-copy {
      letter-spacing: 0;
      line-height: 1.42;
      font-size: clamp(1.55rem, 2.95vw, 2.75rem);
    }

    .statement-word {
      display: inline;
      transition: color var(--nt-dur-fast) var(--nt-ease);
    }

    .statement-word.is-accent {
      color: var(--nt-navy);
      text-decoration: underline;
      text-decoration-color: rgba(231, 31, 53, 0.34);
      text-decoration-thickness: 2px;
      text-underline-offset: 0.2em;
    }

    .statement-pillars {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem 0.9rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--nt-text-secondary);
    }

    :host-context([dir='rtl']) .statement-pillars {
      letter-spacing: 0.01em;
      font-size: 0.84375rem;
    }

    .pillar-sep {
      color: var(--nt-brand-red);
      font-weight: 700;
    }

    @media (max-width: 767px) {
      .statement-inner {
        padding-block: 36px;
      }

      .statement-layout {
        padding-block: 2rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorialStatementComponent implements AfterViewInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('sectionRoot', { static: true }) private sectionRootRef!: ElementRef<HTMLElement>;
  @ViewChild('statementCopy') private statementCopyRef?: ElementRef<HTMLElement>;
  @ViewChild('topRule') private topRuleRef?: ElementRef<HTMLElement>;
  @ViewChild('bottomRule') private bottomRuleRef?: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly words = computed(() =>
    this.lang() === 'ar' ? STATEMENT_AR : STATEMENT_EN
  );

  private gsapCtx: gsap.Context | null = null;
  private viewReady = false;
  private destroyed = false;

  constructor() {
    effect(() => {
      this.lang();
      if (this.viewReady && this.isBrowser) {
        queueMicrotask(() => void this.setupScrollReveal());
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.isBrowser) {
      void this.setupScrollReveal();
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.gsapCtx?.revert();
    this.gsapCtx = null;
  }

  private async setupScrollReveal(): Promise<void> {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    if (this.destroyed) return;
    gsap.registerPlugin(ScrollTrigger);

    this.gsapCtx?.revert();

    const root = this.sectionRootRef.nativeElement;
    const isRtl = this.langService.isRtl();
    const origin = isRtl ? 'right center' : 'left center';

    this.gsapCtx = gsap.context(() => {
      const wordEls = this.statementCopyRef?.nativeElement.querySelectorAll('.statement-word');

      if (this.topRuleRef) {
        gsap.fromTo(
          this.topRuleRef.nativeElement,
          { scaleX: 0, transformOrigin: origin },
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: root,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      if (wordEls?.length) {
        gsap.fromTo(
          wordEls,
          { opacity: 0.22 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top 78%',
              end: 'center 48%',
              scrub: 0.45,
            },
          }
        );
      }

      if (this.bottomRuleRef) {
        gsap.fromTo(
          this.bottomRuleRef.nativeElement,
          { scaleX: 0, transformOrigin: origin },
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: root,
              start: 'bottom 95%',
              once: true,
            },
          }
        );
      }
    }, root);
  }
}
