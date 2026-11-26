import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { NtIconComponent } from '../../shared/ui/nt-icon.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, NtIconComponent],
  template: `
    <section class="not-found-page" aria-labelledby="not-found-heading">
      <div class="nt-container not-found-inner">
        <span class="status-badge">404</span>
        <h1 id="not-found-heading" class="not-found-title">
          {{ lang() === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found' }}
        </h1>
        <p class="not-found-desc">
          @if (lang() === 'ar') {
            الرابط الذي طلبته غير متاح أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية لاستعراض أنظمة وأجهزة نايل ترونكس.
          } @else {
            The page you requested is unavailable or has moved. Return to the homepage to explore NileTronix solutions and hardware.
          }
        </p>
        <a class="home-cta" routerLink="/">
          <app-nt-icon name="arrow-left" class="nt-dir-icon" [size]="15" />
          <span>{{ lang() === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home' }}</span>
        </a>
      </div>
    </section>
  `,
  styles: `
    .not-found-page {
      padding-block: clamp(4.5rem, 8vw, 7rem);
      background-color: var(--nt-white);
      color: var(--nt-ink);
      min-height: 65vh;
      display: flex;
      align-items: center;
    }

    .not-found-inner {
      max-width: 640px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.15rem;
    }

    .status-badge {
      padding: 0.3rem 0.75rem;
      background-color: var(--nt-surface-hover);
      border: 1px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-sm);
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--nt-brand-red-ink);
    }

    .not-found-title {
      margin: 0;
      font-size: var(--nt-h1-size);
      font-weight: 800;
      color: var(--nt-dark-navy);
      line-height: 1.12;
    }

    .not-found-desc {
      margin: 0;
      font-size: 1.02rem;
      line-height: 1.65;
      color: var(--nt-ink-muted);
    }

    .home-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      margin-block-start: 0.5rem;
      min-height: 46px;
      padding: 0.65rem 1.4rem;
      background-color: var(--nt-dark-navy);
      color: var(--nt-white);
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: var(--nt-radius-sm);
      transition: background-color var(--nt-dur-fast) var(--nt-ease);
    }

    .home-cta:hover {
      background-color: var(--nt-brand-red);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  protected readonly lang = inject(LanguageService).lang;
}
