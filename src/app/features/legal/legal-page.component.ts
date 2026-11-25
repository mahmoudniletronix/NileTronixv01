import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-legal-page',
  imports: [RouterLink],
  template: `
    <section class="legal-page">
      <div class="nt-container legal-inner">
        <a class="back-link" routerLink="/">
          <i class="fa-solid fa-arrow-left nt-dir-icon" aria-hidden="true"></i>
          <span>{{ lang() === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home' }}</span>
        </a>

        @if (docType() === 'privacy') {
          <h1 class="legal-title">
            {{ lang() === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' }}
          </h1>
          <div class="legal-body">
            @if (lang() === 'ar') {
              <p>
                تحترم نايل ترونكس للحلول المتقدمة خصوصية بيانات العملاء والمؤسسات التي تتواصل معنا عبر الموقع. تُستخدم البيانات المقدمة في نموذج الاستشارة الفنية فقط للرد على طلبكم وإعداد التوصيات والعروض الفنية.
              </p>
              <p>
                لا نبيع أو نشارك بيانات التواصل مع أي أطراف خارجية لأغراض تسويقية. لطلب تعديل أو حذف بيانات التواصل الخاصة بمؤسستكم، يرجى مراسلتنا عبر البريد الإلكتروني info&#64;niletronix.com.
              </p>
            } @else {
              <p>
                Niletronix For Advanced Solutions respects the privacy of visitors and organizations that contact us through this website. Information submitted through the technical consultation form is used solely to review your request and prepare engineering recommendations.
              </p>
              <p>
                We do not sell or share your contact details with third parties for marketing purposes. To update or remove any inquiry information, contact our team at info&#64;niletronix.com.
              </p>
            }
          </div>
        } @else {
          <h1 class="legal-title">
            {{ lang() === 'ar' ? 'الشروط والأحكام' : 'Terms of Service' }}
          </h1>
          <div class="legal-body">
            @if (lang() === 'ar') {
              <p>
                يوفر هذا الموقع نبذة تعريفية عن الأنظمة البرمجية والأجهزة الميدانية التي تقدمها نايل ترونكس للحلول المتقدمة. تخضع جميع المواصفات الفنية ومواعيد التوريد والضمان واتفاقيات مستوى الخدمة للعقود الفنية الموقعة مع كل جهة.
              </p>
              <p>
                جميع العلامات التجارية وواجهات الأنظمة والصور المعروضة على هذا الموقع مملوكة لنايل ترونكس أو لشركائها المعنيين ولا يجوز إعادة استخدامها دون إذن كتابي مسبق.
              </p>
            } @else {
              <p>
                This website presents an overview of software platforms, field hardware, and integration services delivered by Niletronix For Advanced Solutions. Final technical specifications, delivery schedules, warranties, and maintenance terms are governed by signed project agreements.
              </p>
              <p>
                All product interfaces, brand marks, and materials displayed on this website remain the property of Niletronix For Advanced Solutions or their respective organizations and may not be reproduced without written permission.
              </p>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .legal-page {
      padding-block: clamp(3.5rem, 6vw, 5.5rem);
      background-color: var(--nt-white);
      color: var(--nt-ink);
      min-height: 65vh;
    }

    .legal-inner {
      max-width: 780px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
    }

    .legal-title {
      margin: 0;
      font-size: var(--nt-h2-size);
      font-weight: 800;
      color: var(--nt-dark-navy);
    }

    .legal-body {
      padding: 2rem;
      background-color: var(--nt-light-bg);
      border: 1px solid var(--nt-border-subtle);
      border-radius: var(--nt-radius-lg);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: var(--nt-ink-muted);
      line-height: 1.75;
    }

    .legal-body p {
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly lang = inject(LanguageService).lang;

  private readonly routeDoc = toSignal(
    this.route.data.pipe(map((d) => (d['doc'] as 'privacy' | 'terms') ?? 'privacy')),
    { initialValue: 'privacy' as const }
  );

  protected readonly docType = computed(() => this.routeDoc());
}
