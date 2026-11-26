import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NtIconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'close'
  | 'check'
  | 'check-circle'
  | 'copy'
  | 'grid'
  | 'rows'
  | 'zoom-in'
  | 'zoom-out'
  | 'rotate'
  | 'pin'
  | 'expand'
  | 'compress'
  | 'cube'
  | 'image'
  | 'mail'
  | 'headset'
  | 'globe'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'linkedin';

@Component({
  selector: 'app-nt-icon',
  template: `
    <svg
      class="nt-svg-icon"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name()) {
        @case ('arrow-right') {
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        }
        @case ('arrow-left') {
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        }
        @case ('arrow-up') {
          <path d="M12 19V5" />
          <path d="m6 11 6-6 6 6" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" />
        }
        @case ('chevron-left') {
          <path d="m15 6-6 6 6 6" />
        }
        @case ('chevron-right') {
          <path d="m9 6 6 6-6 6" />
        }
        @case ('menu') {
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        }
        @case ('close') {
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        }
        @case ('check') {
          <path d="M20 6 9 17l-5-5" />
        }
        @case ('check-circle') {
          <circle cx="12" cy="12" r="9.5" />
          <path d="m8.5 12.2 2.4 2.4 4.8-5.1" />
        }
        @case ('copy') {
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        }
        @case ('grid') {
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
        }
        @case ('rows') {
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        }
        @case ('zoom-in') {
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
          <path d="M11 8v6" />
          <path d="M8 11h6" />
        }
        @case ('zoom-out') {
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
          <path d="M8 11h6" />
        }
        @case ('rotate') {
          <path d="M20 12a8 8 0 1 1-2.34-5.66" />
          <path d="M20 4v4.5h-4.5" />
        }
        @case ('pin') {
          <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        }
        @case ('expand') {
          <path d="M15 4h5v5" />
          <path d="M9 20H4v-5" />
          <path d="M20 4 14 10" />
          <path d="M4 20l6-6" />
        }
        @case ('compress') {
          <path d="M4 14h6v6" />
          <path d="M20 10h-6V4" />
          <path d="M10 14 4 20" />
          <path d="M14 10 20 4" />
        }
        @case ('cube') {
          <path d="M12 3 4.5 7.3v9.4L12 21l7.5-4.3V7.3L12 3Z" />
          <path d="M12 12 4.5 7.3" />
          <path d="M12 12l7.5-4.7" />
          <path d="M12 12v9" />
        }
        @case ('image') {
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <circle cx="9" cy="9.5" r="1.4" />
          <path d="m20.5 15.5-4.5-4.5-6.5 6.5" />
        }
        @case ('mail') {
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m4.5 7 7.5 5.5L19.5 7" />
        }
        @case ('headset') {
          <path d="M4 13a8 8 0 0 1 16 0" />
          <rect x="3" y="13" width="3.5" height="6" rx="1.5" />
          <rect x="17.5" y="13" width="3.5" height="6" rx="1.5" />
          <path d="M20 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H14" />
        }
        @case ('globe') {
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8" />
          <path d="M3.6 15h16.8" />
          <path d="M12 3a13.5 13.5 0 0 0 0 18" />
          <path d="M12 3a13.5 13.5 0 0 1 0 18" />
        }
        @case ('whatsapp') {
          <path
            fill="currentColor"
            stroke="none"
            d="M12.04 2a9.9 9.9 0 0 0-8.56 14.88L2 22l5.28-1.38A9.92 9.92 0 1 0 12.04 2Zm5.79 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.15.11-1.85-.11-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.91-4.29-5.06-4.49-.15-.2-1.21-1.61-1.21-3.07s.77-2.18 1.04-2.48c.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.84 2.06.91 2.21.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.03 2.13 1.35 2.43 1.5.3.15.47.12.64-.08.18-.2.74-.87.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.12.07.72-.17 1.4Z"
          />
        }
        @case ('instagram') {
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke-width="1.8" />
          <circle cx="12" cy="12" r="4" stroke-width="1.8" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        }
        @case ('facebook') {
          <path
            fill="currentColor"
            stroke="none"
            d="M14.2 21v-7.8h2.6l.4-3.1h-3V8.2c0-.9.25-1.5 1.54-1.5H17.3V3.9c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.05v2.27H8.4v3.1h2.6V21h3.2Z"
          />
        }
        @case ('linkedin') {
          <path
            fill="currentColor"
            stroke="none"
            d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.55 19.5h2.78V10.1H5.55v9.4Zm4.5 0h2.77v-4.96c0-1.31.25-2.58 1.87-2.58 1.6 0 1.62 1.5 1.62 2.66v4.88h2.78v-5.43c0-2.66-.57-4.7-3.68-4.7-1.49 0-2.49.82-2.9 1.6h-.04v-1.35h-2.42v9.88Z"
          />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      flex-shrink: 0;
    }

    .nt-svg-icon {
      display: block;
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtIconComponent {
  readonly name = input.required<NtIconName>();
  readonly size = input<number>(16);
  readonly strokeWidth = input<number>(1.65);
}
