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
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { LanguageService } from '../../../../core/i18n/language.service';
import { Product3DViewerComponent } from '../../../hardware/components/product-3d-viewer/product-3d-viewer.component';
import { HARDWARE_PRODUCTS_CATALOG } from '../../../hardware/data/hardware-products.data';
import { HardwareProductItem } from '../../../hardware/models/hardware-product.model';
import {
  PRODUCT_CATEGORIES,
  SITE_PRODUCTS_COPY,
} from '../../../site-products/data/site-products.data';
import { ProductCategoryId } from '../../../site-products/models/site-product.model';
import { LocalizedText } from '../../../solutions/models/solution.model';

@Component({
  selector: 'app-site-products',
  imports: [RouterLink, Product3DViewerComponent],
  templateUrl: './site-products.component.html',
  styleUrl: './site-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteProductsComponent implements AfterViewInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('sectionRoot', { static: true }) private sectionRootRef!: ElementRef<HTMLElement>;
  @ViewChild('sectionHeader') private sectionHeaderRef?: ElementRef<HTMLElement>;
  @ViewChild('techDivider') private techDividerRef?: ElementRef<HTMLElement>;
  @ViewChild('studioCol') private studioColRef?: ElementRef<HTMLElement>;
  @ViewChild('dossierCopy') private dossierCopyRef?: ElementRef<HTMLElement>;
  @ViewChild('specRows') private specRowsRef?: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly isRtl = this.langService.isRtl;
  protected readonly copy = SITE_PRODUCTS_COPY;
  protected readonly categories = PRODUCT_CATEGORIES;

  protected readonly activeCategory = signal<ProductCategoryId>('kiosks');
  protected readonly activeModelIndex = signal<number>(0);

  protected readonly categoryProducts = computed<readonly HardwareProductItem[]>(() =>
    HARDWARE_PRODUCTS_CATALOG.filter((item) => item.category === this.activeCategory())
  );

  protected readonly activeProduct = computed<HardwareProductItem>(() => {
    const list = this.categoryProducts();
    return list[this.activeModelIndex()] ?? list[0];
  });

  protected readonly formattedIndex = computed(() =>
    String(this.activeModelIndex() + 1).padStart(2, '0')
  );

  protected readonly formattedTotal = computed(() =>
    String(this.categoryProducts().length).padStart(2, '0')
  );

  private viewReady = false;
  private swapTimeline: gsap.core.Timeline | null = null;
  private entranceTimeline: gsap.core.Timeline | null = null;
  private entranceTrigger: ScrollTriggerType | null = null;
  private destroyed = false;

  constructor() {
    effect(() => {
      this.activeCategory();
      this.activeModelIndex();
      if (this.viewReady && this.isBrowser) {
        queueMicrotask(() => this.animateDossierSwap());
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (!this.isBrowser || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (this.destroyed) return;
      gsap.registerPlugin(ScrollTrigger);
      this.entranceTrigger = ScrollTrigger.create({
        trigger: this.sectionRootRef.nativeElement,
        start: 'top 80%',
        once: true,
        onEnter: () => this.playSectionEntrance(),
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (!this.isBrowser) return;
    this.swapTimeline?.kill();
    this.entranceTimeline?.kill();
    this.entranceTrigger?.kill();
  }

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }

  protected formatNum(idx: number): string {
    return String(idx + 1).padStart(2, '0');
  }

  protected selectCategory(category: ProductCategoryId): void {
    if (this.activeCategory() !== category) {
      this.activeCategory.set(category);
      this.activeModelIndex.set(0);
    }
  }

  protected selectModel(index: number): void {
    if (index >= 0 && index < this.categoryProducts().length && index !== this.activeModelIndex()) {
      this.activeModelIndex.set(index);
    }
  }

  protected nextModel(): void {
    const total = this.categoryProducts().length;
    if (total <= 1) return;
    this.activeModelIndex.update((i) => (i + 1) % total);
  }

  protected prevModel(): void {
    const total = this.categoryProducts().length;
    if (total <= 1) return;
    this.activeModelIndex.update((i) => (i - 1 + total) % total);
  }

  private playSectionEntrance(): void {
    this.entranceTimeline?.kill();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
    this.entranceTimeline = tl;

    if (this.sectionHeaderRef) {
      tl.fromTo(
        this.sectionHeaderRef.nativeElement,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, clearProps: 'transform' },
        0
      );
    }

    if (this.techDividerRef) {
      tl.fromTo(
        this.techDividerRef.nativeElement,
        { scaleX: 0, transformOrigin: this.isRtl() ? 'right center' : 'left center' },
        { scaleX: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform' },
        0.08
      );
    }

    if (this.studioColRef) {
      tl.fromTo(
        this.studioColRef.nativeElement,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, clearProps: 'transform' },
        0.14
      );
    }

    if (this.specRowsRef?.nativeElement.children.length) {
      tl.fromTo(
        this.specRowsRef.nativeElement.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.36, stagger: 0.06, clearProps: 'transform' },
        0.22
      );
    }
  }

  private animateDossierSwap(): void {
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    this.swapTimeline?.kill();
    const dirSign = this.isRtl() ? -1 : 1;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
    this.swapTimeline = tl;

    if (this.dossierCopyRef) {
      tl.fromTo(
        this.dossierCopyRef.nativeElement,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.34, clearProps: 'transform' },
        0
      );
    }

    if (this.specRowsRef?.nativeElement.children.length) {
      tl.fromTo(
        this.specRowsRef.nativeElement.children,
        { opacity: 0, x: 12 * dirSign },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.055,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        0.06
      );
    }
  }
}
