import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { LocalizedText } from '../../../solutions/models/solution.model';
import { HARDWARE_STUDIO_COPY } from '../../data/hardware-products.data';
import { HardwareProductItem } from '../../models/hardware-product.model';

@Component({
  selector: 'app-product-loading-state',
  template: `
    <div class="poster-stage" [class.is-overlay]="mode() === 'loading'">
      <img
        class="poster-img"
        [src]="product().image.src"
        [alt]="t(product().image.alt)"
        [width]="product().image.width"
        [height]="product().image.height"
        loading="lazy"
        decoding="async"
      />

      @if (mode() === 'loading') {
        <div class="loading-pill" role="status" aria-live="polite">
          <span class="spinner-dot" aria-hidden="true"></span>
          <span class="loading-text">{{ t(copy.loadingLabel) }}</span>
          <span class="loading-pct">{{ progress() }}%</span>
          <span class="progress-track" aria-hidden="true">
            <span class="progress-fill" [style.width.%]="progress()"></span>
          </span>
        </div>
      }

      @if (mode() === 'error') {
        <div class="fallback-bar" role="alert">
          <span class="fallback-msg">{{ t(copy.fallbackNotice) }}</span>
          <button type="button" class="retry-btn" (click)="retryClicked.emit()">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
            <span>{{ t(copy.retryLabel) }}</span>
          </button>
        </div>
      }

      @if (mode() === 'webgl-unavailable') {
        <div class="fallback-bar" role="status">
          <span class="fallback-msg">{{ t(copy.webglUnavailable) }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .poster-stage {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.25rem 1.5rem 2.5rem;
    }

    .poster-img {
      max-height: clamp(300px, 34vw, 430px);
      width: auto;
      max-width: 86%;
      object-fit: contain;
      filter: drop-shadow(0 24px 30px rgba(8, 47, 67, 0.16));
    }

    .loading-pill {
      position: absolute;
      bottom: 4.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 0.9rem;
      background-color: rgba(255, 255, 255, 0.94);
      border: 1px solid var(--nt-border-subtle);
      border-radius: 999px;
      box-shadow: 0 6px 18px rgba(8, 47, 67, 0.08);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--nt-dark-navy);
      pointer-events: auto;
    }

    .spinner-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--nt-cyan-accent);
      animation: ntPulse 1.1s ease-in-out infinite;
    }

    .loading-pct {
      font-variant-numeric: tabular-nums;
      color: var(--nt-nile-blue);
    }

    .progress-track {
      width: 56px;
      height: 4px;
      border-radius: 999px;
      background-color: #dce5ea;
      overflow: hidden;
    }

    .progress-fill {
      display: block;
      height: 100%;
      background-color: var(--nt-cyan-accent);
      transition: width 180ms ease;
    }

    .fallback-bar {
      position: absolute;
      bottom: 1rem;
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.65rem;
      padding: 0.5rem 0.9rem;
      background-color: rgba(255, 255, 255, 0.94);
      border: 1px solid var(--nt-border-subtle);
      border-radius: 8px;
      font-size: 0.8125rem;
      color: var(--nt-ink-muted);
      pointer-events: auto;
    }

    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      background-color: var(--nt-dark-navy);
      color: #ffffff;
      border: 0;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }

    @keyframes ntPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.45; transform: scale(0.8); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLoadingStateComponent {
  private readonly lang = inject(LanguageService).lang;

  readonly product = input.required<HardwareProductItem>();
  readonly mode = input<'loading' | 'poster' | 'error' | 'webgl-unavailable'>('loading');
  readonly progress = input<number>(0);

  readonly retryClicked = output<void>();

  protected readonly copy = HARDWARE_STUDIO_COPY;

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }
}
