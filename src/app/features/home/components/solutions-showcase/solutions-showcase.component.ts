import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { LanguageService } from '../../../../core/i18n/language.service';
import {
  SOLUTIONS_CATALOG,
  SOLUTIONS_SECTION_COPY,
} from '../../../solutions/data/solutions.data';
import { LocalizedText, SolutionItem } from '../../../solutions/models/solution.model';

@Component({
  selector: 'app-solutions-showcase',
  imports: [RouterLink],
  templateUrl: './solutions-showcase.component.html',
  styleUrl: './solutions-showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionsShowcaseComponent implements AfterViewInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChildren('deckCard') private cardRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('infoPanel') private infoPanelRef?: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly isRtl = this.langService.isRtl;
  protected readonly copy = SOLUTIONS_SECTION_COPY;
  protected readonly solutions = SOLUTIONS_CATALOG;
  protected readonly total = SOLUTIONS_CATALOG.length;

  protected readonly activeIndex = signal<number>(0);

  protected readonly activeSolution = computed<SolutionItem>(
    () => this.solutions[this.activeIndex()] ?? this.solutions[0]
  );

  protected readonly formattedIndex = computed(() =>
    String(this.activeIndex() + 1).padStart(2, '0')
  );

  protected readonly formattedTotal = String(SOLUTIONS_CATALOG.length).padStart(2, '0');

  private viewReady = false;
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;

  constructor() {
    effect(() => {
      const idx = this.activeIndex();
      const rtl = this.isRtl();
      if (this.viewReady && this.isBrowser) {
        this.animateDeck(idx, rtl, false);
        this.animateInfoPanel();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.isBrowser) {
      this.animateDeck(this.activeIndex(), this.isRtl(), true);
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    if (this.cardRefs) {
      this.cardRefs.forEach((ref) => gsap.killTweensOf(ref.nativeElement));
    }
    if (this.infoPanelRef) {
      gsap.killTweensOf(this.infoPanelRef.nativeElement);
    }
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (this.viewReady && this.isBrowser) {
      this.animateDeck(this.activeIndex(), this.isRtl(), true);
    }
  }

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }

  protected formatNum(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  protected next(): void {
    this.activeIndex.update((i) => (i + 1) % this.total);
  }

  protected prev(): void {
    this.activeIndex.update((i) => (i - 1 + this.total) % this.total);
  }

  protected selectIndex(index: number): void {
    if (index >= 0 && index < this.total && index !== this.activeIndex()) {
      this.activeIndex.set(index);
    }
  }

  protected onCardClick(index: number): void {
    if (index !== this.activeIndex()) {
      this.selectIndex(index);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.isRtl() ? this.prev() : this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.isRtl() ? this.next() : this.prev();
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  protected onTouchEnd(event: TouchEvent): void {
    if (
      this.touchStartX === null ||
      this.touchStartY === null ||
      event.changedTouches.length !== 1
    ) {
      return;
    }
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const deltaY = event.changedTouches[0].clientY - this.touchStartY;
    this.touchStartX = null;
    this.touchStartY = null;

    if (Math.abs(deltaX) < 38 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    const rtl = this.isRtl();
    if ((deltaX < 0 && !rtl) || (deltaX > 0 && rtl)) {
      this.next();
    } else {
      this.prev();
    }
  }

  private getCircularOffset(cardIndex: number, active: number): number {
    let diff = cardIndex - active;
    if (diff > this.total / 2) diff -= this.total;
    if (diff < -this.total / 2) diff += this.total;
    return diff;
  }

  private animateDeck(active: number, isRtl: boolean, immediate: boolean): void {
    if (!this.cardRefs?.length) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const dirSign = isRtl ? -1 : 1;
    const duration = immediate || reducedMotion ? 0 : 0.62;

    const sideX = vw >= 1280 ? 60 : vw >= 1024 ? 54 : vw >= 768 ? 50 : 40;
    const outerX = vw >= 1280 ? 96 : 78;
    const showOuter = vw >= 1200;

    this.cardRefs.forEach((ref, i) => {
      const el = ref.nativeElement;
      const diff = this.getCircularOffset(i, active);
      const absDiff = Math.abs(diff);

      let xPercent = 0;
      let y = -6;
      let scale = 1;
      let rotationY = 0;
      let opacity = 1;
      let zIndex = 30;

      if (absDiff === 1) {
        xPercent = diff * dirSign * sideX;
        y = 14;
        scale = vw < 768 ? 0.84 : 0.8;
        rotationY = -diff * dirSign * (vw < 768 ? 8 : 13);
        opacity = vw < 768 ? 0.45 : 0.84;
        zIndex = 20;
      } else if (absDiff >= 2) {
        xPercent = Math.sign(diff) * dirSign * outerX;
        y = 28;
        scale = 0.64;
        rotationY = -Math.sign(diff) * dirSign * 20;
        opacity = showOuter ? 0.4 : 0;
        zIndex = 10;
      }

      gsap.to(el, {
        xPercent,
        y,
        scale,
        rotationY,
        opacity,
        zIndex,
        duration,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }

  private animateInfoPanel(): void {
    if (!this.infoPanelRef) return;
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    gsap.fromTo(
      this.infoPanelRef.nativeElement,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.36, ease: 'power2.out', overwrite: 'auto' }
    );
  }
}
