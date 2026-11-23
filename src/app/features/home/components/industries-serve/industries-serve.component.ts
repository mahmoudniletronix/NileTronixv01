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
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { LanguageService } from '../../../../core/i18n/language.service';
import {
  INDUSTRIES_CATALOG,
  INDUSTRIES_SECTION_COPY,
} from '../../../industries/data/industries.data';
import { IndustryId, IndustryItem } from '../../../industries/models/industry.model';
import { LocalizedText } from '../../../solutions/models/solution.model';

@Component({
  selector: 'app-industries-serve',
  imports: [RouterLink],
  templateUrl: './industries-serve.component.html',
  styleUrl: './industries-serve.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndustriesServeComponent implements AfterViewInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('stageImg') private stageImgRef?: ElementRef<HTMLImageElement>;
  @ViewChild('stageCopy') private stageCopyRef?: ElementRef<HTMLElement>;
  @ViewChild('stageList') private stageListRef?: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly isRtl = this.langService.isRtl;
  protected readonly copy = INDUSTRIES_SECTION_COPY;
  protected readonly industries = INDUSTRIES_CATALOG;
  protected readonly total = INDUSTRIES_CATALOG.length;

  protected readonly selectedId = signal<IndustryId>('healthcare');

  protected readonly activeIndex = computed(() => {
    const idx = this.industries.findIndex((item) => item.id === this.selectedId());
    return idx >= 0 ? idx : 0;
  });

  protected readonly activeIndustry = computed<IndustryItem>(
    () => this.industries[this.activeIndex()] ?? this.industries[0]
  );

  protected readonly formattedIndex = computed(() =>
    String(this.activeIndex() + 1).padStart(2, '0')
  );

  protected readonly formattedTotal = String(INDUSTRIES_CATALOG.length).padStart(2, '0');

  private viewReady = false;
  private activeTimeline: gsap.core.Timeline | null = null;

  constructor() {
    effect(() => {
      this.selectedId();
      if (this.viewReady && this.isBrowser) {
        queueMicrotask(() => this.animateStageTransition());
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.activeTimeline?.kill();
  }

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }

  protected selectIndustry(id: IndustryId): void {
    if (this.selectedId() !== id) {
      this.selectedId.set(id);
    }
  }

  protected selectByIndex(index: number): void {
    const target = this.industries[index];
    if (target && target.id !== this.selectedId()) {
      this.selectedId.set(target.id);
    }
  }

  protected next(): void {
    this.selectByIndex((this.activeIndex() + 1) % this.total);
  }

  protected prev(): void {
    this.selectByIndex((this.activeIndex() - 1 + this.total) % this.total);
  }

  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    let targetIdx: number | null = null;
    if (event.key === 'ArrowRight') {
      targetIdx = this.isRtl()
        ? (index - 1 + this.total) % this.total
        : (index + 1) % this.total;
    } else if (event.key === 'ArrowLeft') {
      targetIdx = this.isRtl()
        ? (index + 1) % this.total
        : (index - 1 + this.total) % this.total;
    } else if (event.key === 'Home') {
      targetIdx = 0;
    } else if (event.key === 'End') {
      targetIdx = this.total - 1;
    }

    if (targetIdx !== null) {
      event.preventDefault();
      this.selectByIndex(targetIdx);
      document.getElementById(`industry-tab-${this.industries[targetIdx].id}`)?.focus();
    }
  }

  private animateStageTransition(): void {
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    this.activeTimeline?.kill();
    const dirSign = this.isRtl() ? -1 : 1;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
    this.activeTimeline = tl;

    if (this.stageImgRef) {
      tl.fromTo(
        this.stageImgRef.nativeElement,
        { opacity: 0.35, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform' },
        0
      );
    }

    if (this.stageCopyRef) {
      tl.fromTo(
        this.stageCopyRef.nativeElement,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.36, clearProps: 'transform' },
        0.04
      );
    }

    if (this.stageListRef?.nativeElement.children.length) {
      tl.fromTo(
        this.stageListRef.nativeElement.children,
        { opacity: 0, x: -12 * dirSign },
        {
          opacity: 1,
          x: 0,
          duration: 0.32,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        0.12
      );
    }
  }
}
