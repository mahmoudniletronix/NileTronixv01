import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { NtIconComponent } from '../../../../shared/ui/nt-icon.component';
import { LocalizedText } from '../../../solutions/models/solution.model';
import { HARDWARE_STUDIO_COPY } from '../../data/hardware-products.data';
import { CameraPresetId } from '../../models/camera-preset.model';
import { HardwareProductItem } from '../../models/hardware-product.model';
import { ProductHotspot, ProjectedHotspot } from '../../models/product-hotspot.model';
import { CameraControllerService } from '../../services/camera-controller.service';
import { ProductAnimationService } from '../../services/product-animation.service';
import { ThreeSceneService } from '../../services/three-scene.service';
import { ProductControlsComponent } from '../product-controls/product-controls.component';
import { ProductHotspotsComponent } from '../product-hotspots/product-hotspots.component';
import { ProductLoadingStateComponent } from '../product-loading-state/product-loading-state.component';

type ViewerState = 'idle' | 'loading' | 'ready' | 'error' | 'webgl-unavailable';

@Component({
  selector: 'app-product-3d-viewer',
  imports: [
    ProductControlsComponent,
    ProductHotspotsComponent,
    ProductLoadingStateComponent,
    NtIconComponent,
  ],
  providers: [ThreeSceneService, CameraControllerService, ProductAnimationService],
  templateUrl: './product-3d-viewer.component.html',
  styleUrl: './product-3d-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Product3DViewerComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly langService = inject(LanguageService);
  private readonly sceneService = inject(ThreeSceneService);

  @ViewChild('viewerShell', { static: true }) private viewerShellRef!: ElementRef<HTMLElement>;
  @ViewChild('canvasHost', { static: true }) private canvasHostRef!: ElementRef<HTMLElement>;

  readonly product = input.required<HardwareProductItem>();

  protected readonly copy = HARDWARE_STUDIO_COPY;
  protected readonly lang = this.langService.lang;

  protected readonly viewerState = signal<ViewerState>('idle');
  protected readonly loadProgress = signal<number>(0);
  protected readonly activePreset = signal<CameraPresetId | null>('perspective');
  protected readonly autoRotate = signal<boolean>(false);
  protected readonly isFullscreen = signal<boolean>(false);
  protected readonly hotspotsVisible = signal<boolean>(true);
  protected readonly selectedHotspotId = signal<string | null>(null);
  protected readonly projectedHotspots = signal<readonly ProjectedHotspot[]>([]);
  protected readonly viewMode = signal<'3d' | 'photo'>('3d');
  protected readonly hasInteracted = signal<boolean>(false);

  protected readonly activeHotspot = computed<ProductHotspot | null>(() => {
    const id = this.selectedHotspotId();
    if (!id) return null;
    return this.product().model3d.hotspots.find((h) => h.id === id) ?? null;
  });

  protected readonly hasHotspots = computed<boolean>(
    () => this.product().model3d.hotspots.length > 0
  );

  protected readonly showPosterFallback = computed<boolean>(() => {
    if (this.viewMode() === 'photo') return true;
    const state = this.viewerState();
    return state !== 'ready';
  });

  protected readonly posterMode = computed<'loading' | 'poster' | 'error' | 'webgl-unavailable'>(
    () => {
      if (this.viewMode() === 'photo') return 'poster';
      const state = this.viewerState();
      if (state === 'idle') return 'poster';
      if (state === 'error') return 'error';
      if (state === 'webgl-unavailable') return 'webgl-unavailable';
      return 'loading';
    }
  );

  private intersectionObserver: IntersectionObserver | null = null;
  private sceneInitialized = false;
  private sceneInitializing = false;
  private renderedProductId: string | null = null;
  private reducedMotion = false;

  private readonly boundFullscreenChange = () => {
    this.ngZone.run(() => {
      const fsEl = document.fullscreenElement;
      const isFs = fsEl === this.viewerShellRef.nativeElement;
      this.isFullscreen.set(isFs);
      this.sceneService.handleResize();
    });
  };

  constructor() {
    effect(() => {
      const current = this.product();
      this.selectedHotspotId.set(null);
      this.activePreset.set('perspective');

      if (this.sceneInitialized && current.id !== this.renderedProductId) {
        void this.loadActiveProduct(current, true);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('fullscreenchange', this.boundFullscreenChange);

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          const inView = entry.isIntersecting;
          if (inView && !this.sceneInitialized && !this.sceneInitializing) {
            void this.initializeScene();
          } else if (this.sceneInitialized) {
            this.sceneService.setViewportVisibility(inView);
          }
        },
        { rootMargin: '100px 0px' }
      );
      this.intersectionObserver.observe(this.viewerShellRef.nativeElement);
    } else {
      void this.initializeScene();
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    document.removeEventListener('fullscreenchange', this.boundFullscreenChange);
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
    this.sceneService.destroy();
  }

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }

  protected setViewMode(mode: '3d' | 'photo'): void {
    this.viewMode.set(mode);
    if (mode === '3d') {
      this.sceneService.setViewportVisibility(true);
      this.sceneService.requestRender();
    } else {
      this.selectedHotspotId.set(null);
      this.sceneService.setViewportVisibility(false);
    }
  }

  protected onPresetSelected(preset: CameraPresetId): void {
    this.selectedHotspotId.set(null);
    this.activePreset.set(preset);
    this.viewMode.set('3d');
    this.sceneService.setCameraPreset(preset);
  }

  protected onZoomIn(): void {
    this.sceneService.zoomIn();
  }

  protected onZoomOut(): void {
    this.sceneService.zoomOut();
  }

  protected onToggleAutoRotate(): void {
    const next = !this.autoRotate();
    this.autoRotate.set(next);
    this.sceneService.setAutoRotate(next);
  }

  protected onToggleHotspots(): void {
    const next = !this.hotspotsVisible();
    this.hotspotsVisible.set(next);
    if (!next) {
      this.selectedHotspotId.set(null);
    }
  }

  protected onResetView(): void {
    this.selectedHotspotId.set(null);
    this.activePreset.set('perspective');
    this.sceneService.setCameraPreset('perspective');
  }

  protected onHotspotSelected(hotspot: ProductHotspot): void {
    this.selectedHotspotId.set(hotspot.id);
    this.activePreset.set(null);
    this.autoRotate.set(false);
    this.sceneService.setAutoRotate(false);
    this.sceneService.focusHotspot(hotspot);
  }

  protected onHotspotDismissed(): void {
    this.selectedHotspotId.set(null);
    this.activePreset.set('perspective');
    this.sceneService.setCameraPreset('perspective');
  }

  protected async onToggleFullscreen(): Promise<void> {
    if (!this.isBrowser) return;
    const el = this.viewerShellRef.nativeElement;

    if (document.fullscreenElement === el) {
      await document.exitFullscreen?.();
      return;
    }

    if (typeof el.requestFullscreen === 'function') {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        // Fallback to CSS overlay fullscreen
      }
    }

    this.isFullscreen.update((v) => !v);
    queueMicrotask(() => this.sceneService.handleResize());
  }

  protected onRetry(): void {
    if (!this.sceneInitialized) {
      void this.initializeScene();
    } else {
      void this.loadActiveProduct(this.product(), false);
    }
  }

  @HostListener('keydown', ['$event'])
  protected onViewerKeydown(event: KeyboardEvent): void {
    if (this.viewerState() !== 'ready' || this.viewMode() !== '3d') return;
    const key = event.key.toLowerCase();

    if (key === 'escape') {
      if (this.selectedHotspotId()) {
        this.onHotspotDismissed();
      } else if (this.isFullscreen()) {
        void this.onToggleFullscreen();
      }
    } else if (key === 'r') {
      this.onResetView();
    } else if (key === '+' || key === '=') {
      this.onZoomIn();
    } else if (key === '-') {
      this.onZoomOut();
    } else if (key === '1') {
      this.onPresetSelected('perspective');
    } else if (key === '2') {
      this.onPresetSelected('front');
    } else if (key === '3') {
      this.onPresetSelected('back');
    } else if (key === '4') {
      this.onPresetSelected('left');
    } else if (key === '5') {
      this.onPresetSelected('right');
    } else if (key === '6') {
      this.onPresetSelected('top');
    }
  }

  private async initializeScene(): Promise<void> {
    this.sceneInitializing = true;
    this.viewerState.set('loading');
    this.loadProgress.set(10);

    const ok = await this.sceneService.init(
      this.canvasHostRef.nativeElement,
      {
        onLoadProgress: (pct) => this.ngZone.run(() => this.loadProgress.set(pct)),
        onModelReady: (id) =>
          this.ngZone.run(() => {
            this.renderedProductId = id;
            this.viewerState.set('ready');
          }),
        onModelError: () => this.ngZone.run(() => this.viewerState.set('error')),
        onContextLost: () => this.ngZone.run(() => this.viewerState.set('error')),
        onHotspotsProjected: (projected) => {
          if (this.hotspotsVisible()) {
            // Update local viewer subtree only (avoids full-app NgZone CD during 3D orbit)
            this.projectedHotspots.set(projected);
            this.cdr.detectChanges();
          }
        },
        onUserInteract: () =>
          this.ngZone.run(() => {
            this.hasInteracted.set(true);
            this.activePreset.set(null);
            if (this.autoRotate()) {
              this.autoRotate.set(false);
              this.sceneService.setAutoRotate(false);
            }
          }),
      },
      this.reducedMotion
    );

    this.sceneInitializing = false;

    if (!ok) {
      this.viewerState.set('webgl-unavailable');
      return;
    }

    this.sceneInitialized = true;
    await this.loadActiveProduct(this.product(), false);
  }

  private async loadActiveProduct(product: HardwareProductItem, animateSwap: boolean): Promise<void> {
    if (!animateSwap) {
      this.viewerState.set('loading');
    }
    this.loadProgress.set(15);
    await this.sceneService.showProduct(product, animateSwap);
  }
}
