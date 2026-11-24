import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { LocalizedText } from '../../../solutions/models/solution.model';
import { HARDWARE_STUDIO_COPY } from '../../data/hardware-products.data';
import { CAMERA_PRESETS, CameraPresetId } from '../../models/camera-preset.model';

@Component({
  selector: 'app-product-controls',
  template: `
    <div
      class="controls-bar"
      role="toolbar"
      [attr.aria-label]="t(copy.controlsAriaLabel)"
    >
      <div class="controls-group presets-group">
        @for (preset of presets; track preset.id) {
          <button
            type="button"
            class="ctrl-btn preset-btn"
            [class.is-active]="activePreset() === preset.id"
            [attr.aria-label]="t(preset.label)"
            [attr.title]="t(preset.label)"
            [attr.aria-pressed]="activePreset() === preset.id"
            (click)="presetSelected.emit(preset.id)"
          >
            <span>{{ t(preset.shortLabel) }}</span>
          </button>
        }
      </div>

      <span class="ctrl-divider" aria-hidden="true"></span>

      <div class="controls-group actions-group">
        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="t(copy.zoomIn)"
          [attr.title]="t(copy.zoomIn)"
          (click)="zoomInClicked.emit()"
        >
          <i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="t(copy.zoomOut)"
          [attr.title]="t(copy.zoomOut)"
          (click)="zoomOutClicked.emit()"
        >
          <i class="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [class.is-active]="autoRotate()"
          [attr.aria-label]="t(copy.autoRotate)"
          [attr.title]="t(copy.autoRotate)"
          [attr.aria-pressed]="autoRotate()"
          (click)="autoRotateToggled.emit()"
        >
          <i class="fa-solid fa-rotate" aria-hidden="true"></i>
        </button>

        @if (hasHotspots()) {
          <button
            type="button"
            class="ctrl-btn icon-btn"
            [class.is-active]="hotspotsVisible()"
            [attr.aria-label]="t(copy.hotspotsToggle)"
            [attr.title]="t(copy.hotspotsToggle)"
            [attr.aria-pressed]="hotspotsVisible()"
            (click)="hotspotsToggled.emit()"
          >
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          </button>
        }

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="t(copy.resetView)"
          [attr.title]="t(copy.resetView)"
          (click)="resetClicked.emit()"
        >
          <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="isFullscreen() ? t(copy.fullscreenExit) : t(copy.fullscreenEnter)"
          [attr.title]="isFullscreen() ? t(copy.fullscreenExit) : t(copy.fullscreenEnter)"
          (click)="fullscreenToggled.emit()"
        >
          <i
            [class]="isFullscreen() ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .controls-bar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.35rem;
      max-width: 100%;
      padding: 0.32rem 0.45rem;
      background-color: rgba(255, 255, 255, 0.84);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(8, 47, 67, 0.1);
    }

    .controls-group {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: nowrap;
    }

    .presets-group {
      overflow-x: auto;
      scrollbar-width: none;
    }

    .presets-group::-webkit-scrollbar {
      display: none;
    }

    .ctrl-divider {
      width: 1px;
      height: 20px;
      background-color: var(--nt-border-subtle);
      flex-shrink: 0;
    }

    .ctrl-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 32px;
      padding: 0 0.55rem;
      border: 0;
      border-radius: 6px;
      background-color: transparent;
      color: var(--nt-ink-muted);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 160ms var(--nt-ease), color 160ms var(--nt-ease);
    }

    .ctrl-btn:hover {
      background-color: #edf3f6;
      color: var(--nt-dark-navy);
    }

    .ctrl-btn.is-active {
      background-color: var(--nt-dark-navy);
      color: #ffffff;
    }

    .icon-btn {
      width: 32px;
      padding: 0;
      font-size: 0.8rem;
    }

    .ctrl-btn:focus-visible {
      outline: 2px solid var(--nt-focus-ring);
      outline-offset: 1px;
    }

    @media (max-width: 767px) {
      .controls-bar {
        padding: 0.3rem;
        gap: 0.3rem;
      }

      .ctrl-divider {
        display: none;
      }

      .presets-group,
      .actions-group {
        width: 100%;
        justify-content: space-between;
      }

      .ctrl-btn {
        min-height: 36px;
        font-size: 0.75rem;
      }

      .icon-btn {
        width: 36px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductControlsComponent {
  private readonly lang = inject(LanguageService).lang;

  readonly activePreset = input<CameraPresetId | null>('perspective');
  readonly autoRotate = input<boolean>(false);
  readonly isFullscreen = input<boolean>(false);
  readonly hotspotsVisible = input<boolean>(true);
  readonly hasHotspots = input<boolean>(false);

  readonly presetSelected = output<CameraPresetId>();
  readonly zoomInClicked = output<void>();
  readonly zoomOutClicked = output<void>();
  readonly autoRotateToggled = output<void>();
  readonly hotspotsToggled = output<void>();
  readonly resetClicked = output<void>();
  readonly fullscreenToggled = output<void>();

  protected readonly presets = CAMERA_PRESETS;
  protected readonly copy = HARDWARE_STUDIO_COPY;

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }
}
