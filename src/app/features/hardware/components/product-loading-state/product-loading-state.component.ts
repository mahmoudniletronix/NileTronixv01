import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { NtIconComponent } from '../../../../shared/ui/nt-icon.component';
import { LocalizedText } from '../../../solutions/models/solution.model';
import { HARDWARE_STUDIO_COPY } from '../../data/hardware-products.data';
import { HardwareProductItem } from '../../models/hardware-product.model';

@Component({
  selector: 'app-product-loading-state',
  imports: [NtIconComponent],
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
            <app-nt-icon name="rotate" [size]="13" />
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
      background-color: var(--nt-bg-main);
      border: 1px solid var(--nt-border);
      border-radius: var(--nt-radius-sm);
      box-shadow: var(--nt-shadow-sm);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--nt-text-primary);
      pointer-events: auto;
    }

    .spinner-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--nt-brand-red);
      animation: ntPulse 1.1s ease-in-out infinite;
    }

    .loading-pct {
      font-variant-numeric: tabular-nums;
      color: var(--nt-navy);
    }

    .progress-track {
      width: 56px;
      height: 3px;
      background-color: var(--nt-border);
      overflow: hidden;
    }

    .progress-fill {
      display: block;
      height: 100%;
      background-color: var(--nt-brand-red);
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
      background-color: var(--nt-bg-main);
      border: 1px solid var(--nt-border);
      border-radius: var(--nt-radius-sm);
      font-size: 0.8125rem;
      color: var(--nt-text-secondary);
      pointer-events: auto;
    }

    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      background-color: var(--nt-navy);
      color: var(--nt-text-on-dark);
      border: 0;
      border-radius: var(--nt-radius-xs);
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
