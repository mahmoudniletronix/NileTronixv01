import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
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
    <section class="solution-wrap">
      <div class="nt-container solution-inner">
        <a class="back-link" routerLink="/" fragment="solutions">
          <i class="fa-solid fa-arrow-left nt-dir-icon" aria-hidden="true"></i>
          <span>{{ t(copy.backToSolutions) }}</span>
        </a>

        <header class="solution-header">
          <p class="solution-badge">{{ solution().productCode }}</p>
          <h1 class="solution-title">{{ t(solution().title) }}</h1>
          <p class="solution-value">{{ t(solution().valueStatement) }}</p>
        </header>

        <figure class="solution-media">
          <img
            [src]="activeShot().src"
            [alt]="t(activeShot().alt)"
            [width]="activeShot().width"
            [height]="activeShot().height"
          />
          <figcaption>{{ t(activeShot().caption) }}</figcaption>
        </figure>

        @if (solution().screenshots.length > 1) {
          <div class="shot-thumbs" role="tablist" [attr.aria-label]="t(copy.galleryLabel)">
            @for (shot of solution().screenshots; track shot.id; let idx = $index) {
              <button
                type="button"
                role="tab"
                class="shot-thumb"
                [class.is-active]="idx === activeShotIndex()"
                [attr.aria-selected]="idx === activeShotIndex()"
                (click)="selectShot(idx)"
              >
                <img [src]="shot.src" [alt]="t(shot.alt)" width="240" height="150" loading="lazy" />
              </button>
            }
          </div>
        }

        <div class="solution-bottom">
          <div class="capabilities-panel">
            <h2 class="panel-heading">{{ t(copy.capabilitiesHeading) }}</h2>
            <ul class="capabilities-list">
              @for (cap of solution().capabilities; track cap.en) {
                <li>
                  <i class="fa-solid fa-check" aria-hidden="true"></i>
                  <span>{{ t(cap) }}</span>
                </li>
              }
            </ul>
          </div>

          <aside class="cta-panel">
            <h2 class="panel-heading">
              {{ lang() === 'ar' ? 'اطلب استشارة لهذا النظام' : 'Request a Tailored Consultation' }}
            </h2>
            <p class="cta-desc">
              @if (lang() === 'ar') {
                تواصل مع فريقنا الهندسي لمعرفة متطلبات التوريد والتركيب والتكامل المناسبة لمنشأتك.
              } @else {
                Connect with our engineering team to review hardware, integration, and deployment plans for your facility.
              }
            </p>
            <a class="cta-btn" routerLink="/" fragment="contact">
              <span>{{ lang() === 'ar' ? 'اطلب استشارة فنية' : 'Request a Consultation' }}</span>
              <i class="fa-solid fa-arrow-right nt-dir-icon" aria-hidden="true"></i>
            </a>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    .solution-wrap {
      padding-block: clamp(3rem, 5.5vw, 5rem);
      background-color: var(--nt-white);
      color: var(--nt-ink);
    }

    .solution-inner {
      max-width: 1040px;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .back-link {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--nt-nile-blue);
      text-decoration: none;
      transition: color var(--nt-dur-fast) var(--nt-ease);
    }

    .back-link:hover {
      color: var(--nt-dark-navy);
    }

    .solution-badge {
      margin: 0 0 0.5rem;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--nt-nile-blue);
    }

    .solution-title {
      margin: 0 0 0.75rem;
      font-size: clamp(1.85rem, 3.2vw, 2.75rem);
      font-weight: 800;
      color: var(--nt-dark-navy);
      line-height: 1.15;
    }

    .solution-value {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.65;
      color: var(--nt-ink-muted);
      max-width: 65ch;
    }

    .solution-media {
      margin: 0;
      border: 1px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-lg);
      overflow: hidden;
      background-color: var(--nt-light-bg);
    }

    .solution-media img {
      width: 100%;
      height: auto;
    }

    .solution-media figcaption {
      padding: 0.9rem 1.15rem;
      font-size: 0.875rem;
      color: var(--nt-ink-muted);
      background-color: var(--nt-white);
      border-block-start: 1px solid var(--nt-border-subtle);
    }

    .shot-thumbs {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
      gap: 0.75rem;
    }

    .shot-thumb {
      padding: 0.25rem;
      background-color: var(--nt-white);
      border: 2px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-md);
      cursor: pointer;
      opacity: 0.7;
      transition: opacity var(--nt-dur-fast) var(--nt-ease), border-color var(--nt-dur-fast) var(--nt-ease);
    }

    .shot-thumb:hover,
    .shot-thumb.is-active {
      opacity: 1;
      border-color: var(--nt-nile-blue);
    }

    .shot-thumb img {
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      border-radius: var(--nt-radius-sm);
    }

    .solution-bottom {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
      gap: 1.5rem;
      align-items: start;
    }

    .capabilities-panel,
    .cta-panel {
      padding: 1.75rem;
      background-color: var(--nt-light-bg);
      border: 1px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-lg);
    }

    .panel-heading {
      margin: 0 0 1rem;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--nt-dark-navy);
    }

    .capabilities-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .capabilities-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      font-size: 0.95rem;
      line-height: 1.55;
      color: var(--nt-ink);
    }

    .capabilities-list i {
      color: var(--nt-nile-blue);
      margin-block-start: 0.25rem;
      flex-shrink: 0;
    }

    .cta-desc {
      margin: 0 0 1.25rem;
      font-size: 0.92rem;
      line-height: 1.6;
      color: var(--nt-ink-muted);
    }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      width: 100%;
      min-height: 46px;
      padding: 0.65rem 1.25rem;
      background-color: var(--nt-dark-navy);
      color: var(--nt-white);
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: var(--nt-radius-sm);
      transition: background-color var(--nt-dur-fast) var(--nt-ease);
    }

    .cta-btn:hover {
      background-color: var(--nt-nile-blue);
    }

    @media (max-width: 767px) {
      .solution-bottom {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionDetailPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly lang = inject(LanguageService).lang;

  protected readonly copy = SOLUTIONS_SECTION_COPY;
  protected readonly activeShotIndex = signal<number>(0);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: '' }
  );

  protected readonly solution = computed(
    () =>
      SOLUTIONS_CATALOG.find((item) => item.slug === this.slug()) ??
      SOLUTIONS_CATALOG[0]
  );

  protected readonly activeShot = computed(() => {
    const shots = this.solution().screenshots;
    return shots[this.activeShotIndex()] ?? shots[0];
  });

  constructor() {
    effect(() => {
      this.slug();
      this.activeShotIndex.set(0);
    });
  }

  protected selectShot(idx: number): void {
    this.activeShotIndex.set(idx);
  }

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }
}
