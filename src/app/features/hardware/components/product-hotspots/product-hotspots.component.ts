import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { NtIconComponent } from '../../../../shared/ui/nt-icon.component';
import { LocalizedText } from '../../../solutions/models/solution.model';
import { HARDWARE_STUDIO_COPY } from '../../data/hardware-products.data';
import { ProductHotspot, ProjectedHotspot } from '../../models/product-hotspot.model';

@Component({
  selector: 'app-product-hotspots',
  imports: [NtIconComponent],
  template: `
    <div class="hotspots-layer" aria-live="polite">
      @for (item of projectedHotspots(); track item.hotspot.id) {
        @if (item.visible) {
          <button
            type="button"
            class="hotspot-pin"
            [class.is-selected]="selectedHotspotId() === item.hotspot.id"
            [style.left.%]="item.xPercent"
            [style.top.%]="item.yPercent"
            [attr.aria-label]="t(item.hotspot.title)"
            [attr.aria-expanded]="selectedHotspotId() === item.hotspot.id"
            (click)="hotspotSelected.emit(item.hotspot)"
          >
            <span class="pin-core" aria-hidden="true"></span>
          </button>
        }
      }

      @if (activeHotspot(); as hs) {
        <div class="hotspot-card" role="dialog" [attr.aria-label]="t(hs.title)">
          <div class="hotspot-card-head">
            <h4 class="hotspot-title">{{ t(hs.title) }}</h4>
            <button
              type="button"
              class="hotspot-close"
              [attr.aria-label]="t(copy.returnDefaultView)"
              (click)="dismissed.emit()"
            >
              <app-nt-icon name="close" [size]="15" />
            </button>
          </div>
          <p class="hotspot-desc">{{ t(hs.description) }}</p>
          <button type="button" class="hotspot-reset-link" (click)="dismissed.emit()">
            <app-nt-icon name="rotate" [size]="13" />
            <span>{{ t(copy.returnDefaultView) }}</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 4;
      overflow: hidden;
    }

    .hotspots-layer {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .hotspot-pin {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid var(--nt-bg-main);
      background-color: var(--nt-navy);
      box-shadow: var(--nt-shadow-sm);
      display: grid;
      place-items: center;
      cursor: pointer;
      pointer-events: auto;
      transition: transform var(--nt-dur-fast) var(--nt-ease), background-color var(--nt-dur-fast) var(--nt-ease);
    }

    .hotspot-pin:hover,
    .hotspot-pin.is-selected {
      transform: translate(-50%, -50%) scale(1.18);
      background-color: var(--nt-brand-red);
    }

    .pin-core {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: var(--nt-bg-main);
    }

    .hotspot-pin.is-selected .pin-core {
      background-color: var(--nt-bg-main);
    }

    .hotspot-card {
      position: absolute;
      inset-inline-start: 1rem;
      bottom: 4.5rem;
      max-width: min(300px, calc(100% - 2rem));
      padding: 0.9rem 1rem;
      background-color: var(--nt-bg-main);
      border: 1px solid var(--nt-border);
      border-radius: var(--nt-radius-md);
      box-shadow: var(--nt-shadow-md);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .hotspot-card-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .hotspot-icon {
      width: 26px;
      height: 26px;
      border-radius: var(--nt-radius-xs);
      background-color: var(--nt-surface-soft);
      border: 1px solid var(--nt-border);
      color: var(--nt-slate-icon);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      flex-shrink: 0;
    }

    .hotspot-title {
      margin: 0;
      flex: 1;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--nt-text-primary);
    }

    .hotspot-close {
      width: 26px;
      height: 26px;
      border: 0;
      border-radius: var(--nt-radius-xs);
      background: transparent;
      color: var(--nt-text-secondary);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .hotspot-close:hover {
      background-color: var(--nt-surface-soft);
      color: var(--nt-text-primary);
    }

    .hotspot-desc {
      margin: 0;
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--nt-text-secondary);
    }

    .hotspot-reset-link {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0;
      border: 0;
      background: transparent;
      color: var(--nt-navy);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }

    .hotspot-reset-link:hover {
      color: var(--nt-text-primary);
    }

    @media (max-width: 767px) {
      .hotspot-card {
        bottom: 5.75rem;
        inset-inline: 0.75rem;
        max-width: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductHotspotsComponent {
  private readonly lang = inject(LanguageService).lang;

  readonly projectedHotspots = input<readonly ProjectedHotspot[]>([]);
  readonly selectedHotspotId = input<string | null>(null);
  readonly activeHotspot = input<ProductHotspot | null>(null);

  readonly hotspotSelected = output<ProductHotspot>();
  readonly dismissed = output<void>();

  protected readonly copy = HARDWARE_STUDIO_COPY;

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }
}
