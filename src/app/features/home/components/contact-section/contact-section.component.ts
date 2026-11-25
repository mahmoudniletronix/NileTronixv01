import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../../../../core/i18n/language.service';
import { LocalizedText } from '../../../solutions/models/solution.model';

interface InquiryTopic {
  readonly id: string;
  readonly icon: string;
  readonly label: LocalizedText;
}

const INQUIRY_TOPICS: readonly InquiryTopic[] = [
  { id: 'queue', icon: 'fa-solid fa-users-line', label: { en: 'Queue Management', ar: 'إدارة الانتظار' } },
  { id: 'parking', icon: 'fa-solid fa-square-parking', label: { en: 'Parking Systems', ar: 'أنظمة المواقف' } },
  { id: 'feedback', icon: 'fa-solid fa-comment-dots', label: { en: 'Customer Survey', ar: 'استبيانات العملاء' } },
  { id: 'traffic', icon: 'fa-solid fa-traffic-light', label: { en: 'Traffic Control', ar: 'إدارة المرور' } },
  { id: 'security', icon: 'fa-solid fa-shield-halved', label: { en: 'AI Vision & Security', ar: 'الأمن والرؤية الذكية' } },
  { id: 'hardware', icon: 'fa-solid fa-tablet-screen-button', label: { en: 'Kiosks & Displays', ar: 'الأكشاك والشاشات' } },
];

@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly langService = inject(LanguageService);

  protected readonly lang = this.langService.lang;
  protected readonly topics = INQUIRY_TOPICS;
  protected readonly mapsLink = 'https://maps.app.goo.gl/wRaZuHYx6UQc4bCj9';
  protected readonly mapEmbedUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps?q=Niletronix+For+Advanced+Solutions@30.10099,31.3179473&z=16&output=embed'
    );

  protected readonly selectedTopic = signal<string>('queue');
  protected readonly submitted = signal<boolean>(false);
  protected readonly mapActive = signal<boolean>(false);
  protected readonly emailCopied = signal<boolean>(false);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly contactForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    organization: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected t(text: LocalizedText): string {
    return this.lang() === 'ar' ? text.ar : text.en;
  }

  protected selectTopic(id: string): void {
    this.selectedTopic.set(id);
  }

  protected activateMap(): void {
    this.mapActive.set(true);
  }

  protected deactivateMap(): void {
    this.mapActive.set(false);
  }

  protected copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText('info@niletronix.com');
    }
    this.emailCopied.set(true);
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.emailCopied.set(false), 2000);
  }

  protected onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.submitted.set(true);
  }

  protected resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
  }

  protected hasError(controlName: 'fullName' | 'organization' | 'email' | 'phone' | 'message'): boolean {
    const ctrl = this.contactForm.controls[controlName];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  protected getErrorMessage(
    controlName: 'fullName' | 'organization' | 'email' | 'phone' | 'message'
  ): string {
    const ctrl = this.contactForm.controls[controlName];
    if (!ctrl.errors) return '';
    const isAr = this.lang() === 'ar';

    if (ctrl.errors['required']) {
      switch (controlName) {
        case 'fullName':
          return isAr ? 'الاسم الكامل مطلوب.' : 'Full name is required.';
        case 'organization':
          return isAr ? 'اسم الشركة أو المنشأة مطلوب.' : 'Company or facility name is required.';
        case 'email':
          return isAr ? 'البريد الإلكتروني مطلوب.' : 'Work email is required.';
        case 'phone':
          return isAr ? 'رقم الهاتف مطلوب.' : 'Phone number is required.';
        case 'message':
          return isAr ? 'تفاصيل المشروع مطلوبة.' : 'Project details are required.';
      }
    }

    if (ctrl.errors['email']) {
      return isAr ? 'أدخل بريداً إلكترونياً صالحاً.' : 'Enter a valid email address.';
    }

    if (ctrl.errors['minlength']) {
      if (controlName === 'phone') {
        return isAr ? 'أدخل رقم هاتف صحيحاً.' : 'Enter a valid phone number.';
      }
      if (controlName === 'message') {
        return isAr
          ? 'أضف تفاصيل مختصرة لا تقل عن 10 أحرف.'
          : 'Please share at least 10 characters about your project.';
      }
      return isAr ? 'القيمة المدخلة قصيرة جداً.' : 'Value is too short.';
    }

    return '';
  }
}
