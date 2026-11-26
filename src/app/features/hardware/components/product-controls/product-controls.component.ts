import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';
import { NtIconComponent } from '../../../../shared/ui/nt-icon.component';
import { LocalizedText } from '../../../solutions/models/solution.model';
import { HARDWARE_STUDIO_COPY } from '../../data/hardware-products.data';
import { CAMERA_PRESETS, CameraPresetId } from '../../models/camera-preset.model';

@Component({
  selector: 'app-product-controls',
  imports: [NtIconComponent],
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
          <app-nt-icon name="zoom-in" [size]="15" />
        </button>

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="t(copy.zoomOut)"
          [attr.title]="t(copy.zoomOut)"
          (click)="zoomOutClicked.emit()"
        >
          <app-nt-icon name="zoom-out" [size]="15" />
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
          <app-nt-icon name="rotate" [size]="15" />
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
            <app-nt-icon name="pin" [size]="15" />
          </button>
        }

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="t(copy.resetView)"
          [attr.title]="t(copy.resetView)"
          (click)="resetClicked.emit()"
        >
          <app-nt-icon name="rotate" [size]="15" />
        </button>

        <button
          type="button"
          class="ctrl-btn icon-btn"
          [attr.aria-label]="isFullscreen() ? t(copy.fullscreenExit) : t(copy.fullscreenEnter)"
          [attr.title]="isFullscreen() ? t(copy.fullscreenExit) : t(copy.fullscreenEnter)"
          (click)="fullscreenToggled.emit()"
        >
          <app-nt-icon [name]="isFullscreen() ? 'compress' : 'expand'" [size]="15" />
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
      padding: 0.3rem 0.4rem;
      background-color: var(--nt-bg-main);
      border: 1px solid var(--nt-border);
      border-radius: var(--nt-radius-md);
      box-shadow: var(--nt-shadow-sm);
    }

    .controls-group {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
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
      background-color: var(--nt-border);
      flex-shrink: 0;
    }

    .ctrl-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 32px;
      padding: 0 0.55rem;
      border: 0;
      border-radius: var(--nt-radius-xs);
      background-color: transparent;
      color: var(--nt-text-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color var(--nt-dur-fast) var(--nt-ease), color var(--nt-dur-fast) var(--nt-ease);
    }

    .ctrl-btn:hover {
      background-color: var(--nt-surface-soft);
      color: var(--nt-text-primary);
    }

    .ctrl-btn.is-active {
      background-color: var(--nt-navy);
      color: var(--nt-text-on-dark);
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
        width: 100%;
        padding: 0.3rem;
        gap: 0.3rem;
      }

      .ctrl-divider {
        display: none;
      }

      .presets-group {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        width: 100%;
        gap: 0.15rem;
        overflow: visible;
      }

      .actions-group {
        width: 100%;
        justify-content: space-between;
      }

      .ctrl-btn {
        min-height: 36px;
        font-size: 0.72rem;
      }

      .preset-btn {
        padding: 0 0.2rem;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
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
