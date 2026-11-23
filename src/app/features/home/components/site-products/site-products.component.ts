import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
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
  PRODUCT_CATEGORIES,
  SITE_PRODUCTS_CATALOG,
  SITE_PRODUCTS_COPY,
} from '../../../site-products/data/site-products.data';
import {
  ProductCategoryId,
  SiteProductItem,
} from '../../../site-products/models/site-product.model';
import { LocalizedText } from '../../../solutions/models/solution.model';

@Component({
  selector: 'app-site-products',
  imports: [RouterLink],
  templateUrl: './site-products.component.html',
  styleUrl: './site-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteProductsComponent implements AfterViewInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('pedestalFigure') private pedestalFigureRef?: ElementRef<HTMLElement>;
  @ViewChild('pedestalImg') private pedestalImgRef?: ElementRef<HTMLImageElement>;
  @ViewChild('watermarkEl') private watermarkRef?: ElementRef<HTMLElement>;
  @ViewChild('dossierCopy') private dossierCopyRef?: ElementRef<HTMLElement>;
  @ViewChild('specRows') private specRowsRef?: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly isRtl = this.langService.isRtl;
  protected readonly copy = SITE_PRODUCTS_COPY;
  protected readonly categories = PRODUCT_CATEGORIES;

  protected readonly activeCategory = signal<ProductCategoryId>('kiosks');
  protected readonly activeModelIndex = signal<number>(0);
  protected readonly lightboxOpen = signal<boolean>(false);

  protected readonly categoryProducts = computed<readonly SiteProductItem[]>(() =>
    SITE_PRODUCTS_CATALOG.filter((item) => item.category === this.activeCategory())
  );

  protected readonly activeProduct = computed<SiteProductItem>(() => {
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
  private activeTimeline: gsap.core.Timeline | null = null;
  private tiltRotX: gsap.QuickToFunc | null = null;
  private tiltRotY: gsap.QuickToFunc | null = null;

  constructor() {
    effect(() => {
      this.activeCategory();
      this.activeModelIndex();
      if (this.viewReady && this.isBrowser) {
        queueMicrotask(() => this.animateDeviceSwap());
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (!this.isBrowser) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && this.pedestalFigureRef) {
      this.tiltRotX = gsap.quickTo(this.pedestalFigureRef.nativeElement, 'rotationX', {
        duration: 0.45,
        ease: 'power2.out',
      });
      this.tiltRotY = gsap.quickTo(this.pedestalFigureRef.nativeElement, 'rotationY', {
        duration: 0.45,
        ease: 'power2.out',
      });
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.activeTimeline?.kill();
    if (this.pedestalFigureRef) {
      gsap.killTweensOf(this.pedestalFigureRef.nativeElement);
    }
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

  protected onStagePointerMove(event: MouseEvent): void {
    if (!this.tiltRotX || !this.tiltRotY || !this.pedestalFigureRef) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    this.tiltRotY(relX * 14);
    this.tiltRotX(-relY * 10);
  }

  protected onStagePointerLeave(): void {
    if (!this.tiltRotX || !this.tiltRotY) return;
    this.tiltRotX(0);
    this.tiltRotY(0);
  }

  protected openLightbox(): void {
    this.lightboxOpen.set(true);
  }

  protected closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.lightboxOpen()) {
      this.closeLightbox();
    }
  }

  private animateDeviceSwap(): void {
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    this.activeTimeline?.kill();
    const dirSign = this.isRtl() ? -1 : 1;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
    this.activeTimeline = tl;

    if (this.watermarkRef) {
      tl.fromTo(
        this.watermarkRef.nativeElement,
        { opacity: 0, x: -24 * dirSign },
        { opacity: 1, x: 0, duration: 0.55, clearProps: 'transform' },
        0
      );
    }

    if (this.pedestalImgRef) {
      tl.fromTo(
        this.pedestalImgRef.nativeElement,
        { opacity: 0, y: 24, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.58, ease: 'power3.out', clearProps: 'transform' },
        0.02
      );
    }

    if (this.dossierCopyRef) {
      tl.fromTo(
        this.dossierCopyRef.nativeElement,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.36, clearProps: 'transform' },
        0.06
      );
    }

    if (this.specRowsRef?.nativeElement.children.length) {
      tl.fromTo(
        this.specRowsRef.nativeElement.children,
        { opacity: 0, x: 14 * dirSign },
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
