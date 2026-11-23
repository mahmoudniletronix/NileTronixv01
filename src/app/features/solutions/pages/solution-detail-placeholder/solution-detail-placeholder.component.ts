import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LanguageService } from '../../../../core/i18n/language.service';
import { SOLUTIONS_CATALOG, SOLUTIONS_SECTION_COPY } from '../../data/solutions.data';
import { LocalizedText } from '../../models/solution.model';

@Component({
  selector: 'app-solution-detail-placeholder',
  imports: [RouterLink],
  template: `
    <section class="placeholder-wrap">
      <div class="nt-container placeholder-inner">
        <a class="back-link" routerLink="/" fragment="solutions">
          <i class="fa-solid fa-arrow-left nt-dir-icon" aria-hidden="true"></i>
          <span>{{ t(copy.backToSolutions) }}</span>
        </a>

        <p class="placeholder-badge">{{ solution().productCode }}</p>
        <h1 class="placeholder-title">{{ t(solution().title) }}</h1>
        <p class="placeholder-value">{{ t(solution().valueStatement) }}</p>

        <p class="placeholder-notice" role="status">
          {{ t(copy.placeholderNotice) }}
        </p>

        <figure class="placeholder-media">
          <img
            [src]="solution().screenshots[0].src"
            [alt]="t(solution().screenshots[0].alt)"
            [width]="solution().screenshots[0].width"
            [height]="solution().screenshots[0].height"
          />
          <figcaption>{{ t(solution().screenshots[0].caption) }}</figcaption>
        </figure>
      </div>
    </section>
  `,
  styles: `
    .placeholder-wrap {
      padding-block: clamp(3rem, 6vw, 5rem);
      background-color: var(--nt-white);
    }
    .placeholder-inner { max-width: 960px; }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      margin-block-end: 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--nt-nile-blue);
      text-decoration: none;
    }
    .placeholder-badge {
      margin: 0 0 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--nt-nile-blue);
    }
    .placeholder-title {
      margin: 0 0 0.75rem;
      font-size: clamp(1.85rem, 3.2vw, 2.75rem);
      color: var(--nt-dark-navy);
      line-height: 1.15;
    }
    .placeholder-value {
      margin: 0 0 1.5rem;
      font-size: 1.05rem;
      color: var(--nt-ink-muted);
      max-width: 65ch;
    }
    .placeholder-notice {
      margin: 0 0 2rem;
      padding: 0.95rem 1.15rem;
      background-color: var(--nt-surface-hover);
      border: 1px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-sm);
      font-size: 0.9rem;
      color: var(--nt-deep-navy);
    }
    .placeholder-media {
      margin: 0;
      border: 1px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-md);
      overflow: hidden;
      background-color: var(--nt-light-bg);
    }
    .placeholder-media img { width: 100%; height: auto; }
    .placeholder-media figcaption {
      padding: 0.85rem 1rem;
      font-size: 0.875rem;
      color: var(--nt-ink-muted);
      border-block-start: 1px solid var(--nt-border-subtle);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionDetailPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly lang = inject(LanguageService).lang;

  protected readonly copy = SOLUTIONS_SECTION_COPY;

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: '' }
  );

  protected readonly solution = computed(
    () =>
      SOLUTIONS_CATALOG.find((item) => item.slug === this.slug()) ??
      SOLUTIONS_CATALOG[0]
  );

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }
}
