import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import gsap from 'gsap';
import { LanguageService } from '../../../../core/i18n/language.service';
import { NtIconComponent } from '../../../../shared/ui/nt-icon.component';

export interface ReferenceLogo {
  readonly id: string;
  readonly src: string;
  readonly altEn: string;
  readonly altAr: string;
}

const ALL_LOGOS: readonly ReferenceLogo[] = Array.from({ length: 19 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return {
    id: `ref-${num}`,
    src: `reference/${num}.webp`,
    altEn: `NileTronix client and partner reference ${num}`,
    altAr: `شعار أحد عملاء وشركاء نايل ترونكس ${num}`,
  };
});

@Component({
  selector: 'app-references',
  imports: [NtIconComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesComponent implements AfterViewInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('gridContainer') private gridRef?: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly allLogos = ALL_LOGOS;
  protected readonly rowOne = ALL_LOGOS.slice(0, 10);
  protected readonly rowTwo = ALL_LOGOS.slice(10);

  protected readonly viewMode = signal<'marquee' | 'grid'>('marquee');
  protected readonly logosReady = signal<boolean>(
    !this.isBrowser || typeof IntersectionObserver === 'undefined'
  );
  private visibilityObserver: IntersectionObserver | null = null;
  private preloadObserver: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const mode = this.viewMode();
      if (mode === 'grid' && this.isBrowser) {
        queueMicrotask(() => this.animateGridReveal());
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;
    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        this.hostEl.nativeElement.classList.toggle('is-offscreen', !entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    this.visibilityObserver.observe(this.hostEl.nativeElement);

    if (!this.logosReady()) {
      this.preloadObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.logosReady.set(true);
            this.preloadObserver?.disconnect();
            this.preloadObserver = null;
          }
        },
        { rootMargin: '550px 0px', threshold: 0 }
      );
      this.preloadObserver.observe(this.hostEl.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
    this.preloadObserver?.disconnect();
    this.preloadObserver = null;
    if (this.isBrowser && this.gridRef) {
      gsap.killTweensOf(this.gridRef.nativeElement.children);
    }
  }

  protected toggleViewMode(): void {
    this.logosReady.set(true);
    this.viewMode.update((m) => (m === 'marquee' ? 'grid' : 'marquee'));
  }

  private animateGridReveal(): void {
    if (!this.gridRef?.nativeElement.children.length) return;
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const items = this.gridRef.nativeElement.children;
    gsap.killTweensOf(items);
    gsap.fromTo(
      items,
      { opacity: 0, y: 14, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.36,
        stagger: 0.03,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      }
    );
  }
}
