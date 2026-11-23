import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type SupportedLang = 'en' | 'ar';

export interface SolutionMenuItem {
  readonly id: string;
  readonly route: string;
  readonly title: string;
  readonly summary: string;
}

export interface HeroIndicatorItem {
  readonly id: 'software' | 'hardware' | 'integration';
  readonly line1: string;
  readonly line2: string;
}

export interface SiteContent {
  readonly skipToContent: string;
  readonly brand: {
    readonly name: string;
    readonly tagline: string;
    readonly homeAriaLabel: string;
  };
  readonly nav: {
    readonly primaryAriaLabel: string;
    readonly mobileAriaLabel: string;
    readonly home: string;
    readonly solutions: string;
    readonly industries: string;
    readonly projects: string;
    readonly about: string;
    readonly contact: string;
    readonly consultationCta: string;
    readonly languageSwitchLabel: string;
    readonly languageCode: string;
    readonly openMenuLabel: string;
    readonly closeMenuLabel: string;
    readonly megaMenuHeading: string;
    readonly megaMenuSubheading: string;
    readonly viewAllSolutions: string;
    readonly solutionsList: readonly SolutionMenuItem[];
  };
  readonly hero: {
    readonly regionLabel: string;
    readonly eyebrow: string;
    readonly headlineLine1: string;
    readonly headlineAccent: string;
    readonly headlineLine2End: string;
    readonly description: string;
    readonly primaryCta: string;
    readonly secondaryCta: string;
    readonly imageAlt: string;
    readonly indicatorsLabel: string;
    readonly indicators: readonly HeroIndicatorItem[];
  };
}

const CONTENT_EN: SiteContent = {
  skipToContent: 'Skip to main content',
  brand: {
    name: 'NileTronix',
    tagline: 'Technology, Solutions & Systems Integration',
    homeAriaLabel: 'NileTronix — Home',
  },
  nav: {
    primaryAriaLabel: 'Primary navigation',
    mobileAriaLabel: 'Mobile navigation',
    home: 'Home',
    solutions: 'Solutions',
    industries: 'Industries',
    projects: 'Hardware',
    about: 'Clients',
    contact: 'Contact',
    consultationCta: 'Request a Consultation',
    languageSwitchLabel: 'Switch language to Arabic',
    languageCode: 'EN',
    openMenuLabel: 'Open navigation menu',
    closeMenuLabel: 'Close navigation menu',
    megaMenuHeading: 'Enterprise Solutions',
    megaMenuSubheading:
      'Integrated hardware, software, and infrastructure tailored for high-traffic facilities.',
    viewAllSolutions: 'Explore All Solutions',
    solutionsList: [
      {
        id: 'queue',
        route: '/solutions/queue-management',
        title: 'Queue Management (Q-Control)',
        summary: 'Self-service ticketing kiosks, digital signage, and real-time service flow.',
      },
      {
        id: 'parking',
        route: '/solutions/parking-management',
        title: 'Parking Management (NPark)',
        summary: 'Automated access control, ticketing, tariffs, and smart parking operations.',
      },
      {
        id: 'feedback',
        route: '/solutions/customer-feedback',
        title: 'Customer Feedback & Survey Platform',
        summary: 'Instant point-of-service sentiment capture and actionable executive analytics.',
      },
      {
        id: 'traffic',
        route: '/solutions/traffic-management',
        title: 'Traffic Signal & Corridor Control',
        summary: 'Bilingual traffic controller panels, intersection monitoring, and signal templates.',
      },
      {
        id: 'security',
        route: '/solutions/security-low-current',
        title: 'AI Vision, Security & Low Current',
        summary: 'Camera analytics, floor polygon zone mapping, alerts, and low-current systems.',
      },
    ],
  },
  hero: {
    regionLabel: 'NileTronix Enterprise Technology Overview',
    eyebrow: 'ENTERPRISE TECHNOLOGY · SYSTEMS INTEGRATION · SMART OPERATIONS',
    headlineLine1: 'Engineering',
    headlineAccent: 'Smarter',
    headlineLine2End: 'Operations.',
    description:
      'Integrated software, intelligent systems, and reliable infrastructure — engineered to simplify business operations across your facilities.',
    primaryCta: 'Explore Solutions',
    secondaryCta: 'View Our Projects',
    imageAlt:
      'Modern enterprise service lobby equipped with a NileTronix self-service ticketing kiosk, overhead digital queue display, and organized service counters.',
    indicatorsLabel: 'Core integrated capabilities',
    indicators: [
      { id: 'software', line1: 'Software', line2: 'Solutions' },
      { id: 'hardware', line1: 'Hardware', line2: '& Devices' },
      { id: 'integration', line1: 'Systems', line2: 'Integration' },
    ],
  },
};

const CONTENT_AR: SiteContent = {
  skipToContent: 'الانتقال إلى المحتوى الرئيسي',
  brand: {
    name: 'نايل ترونكس',
    tagline: 'التكنولوجيا والحلول وتكامل الأنظمة',
    homeAriaLabel: 'نايل ترونكس — الصفحة الرئيسية',
  },
  nav: {
    primaryAriaLabel: 'التنقل الرئيسي',
    mobileAriaLabel: 'قائمة التنقل للجوال',
    home: 'الرئيسية',
    solutions: 'الحلول',
    industries: 'القطاعات',
    projects: 'الأجهزة',
    about: 'عملاؤنا',
    contact: 'تواصل معنا',
    consultationCta: 'اطلب استشارة',
    languageSwitchLabel: 'التبديل إلى اللغة الإنجليزية',
    languageCode: 'AR',
    openMenuLabel: 'فتح قائمة التنقل',
    closeMenuLabel: 'إغلاق قائمة التنقل',
    megaMenuHeading: 'الحلول المؤسسية',
    megaMenuSubheading:
      'أجهزة وبرمجيات وبنية تحتية متكاملة مصممة للمنشآت عالية الكثافة التشغيلية.',
    viewAllSolutions: 'استكشف جميع الحلول',
    solutionsList: [
      {
        id: 'queue',
        route: '/solutions/queue-management',
        title: 'أنظمة إدارة الانتظار (Q-Control)',
        summary: 'أكشاك حجز التذاكر الذاتية، وشاشات العرض الرقمية، وتنظيم تدفق العملاء.',
      },
      {
        id: 'parking',
        route: '/solutions/parking-management',
        title: 'أنظمة إدارة المواقف (NPark)',
        summary: 'التحكم الآلي في الدخول والخروج والتعريفات وإدارة مواقف السيارات الذكية.',
      },
      {
        id: 'feedback',
        route: '/solutions/customer-feedback',
        title: 'منصة قياس رضا العملاء والاستبيانات',
        summary: 'جمع آراء المستفيدين فورياً وتحليلات دقيقة لدعم قرارات الإدارة.',
      },
      {
        id: 'traffic',
        route: '/solutions/traffic-management',
        title: 'أنظمة التحكم في الإشارات والمرور',
        summary: 'لوحات تحكم ثنائية اللغة لإشارات المرور ومراقبة التقاطعات والمسارات.',
      },
      {
        id: 'security',
        route: '/solutions/security-low-current',
        title: 'الرؤية الذكية والأمن والتيار الخفيف',
        summary: 'تحليلات الكاميرات، وتخطيط مناطق الطوابق، والتنبيهات الأمنية الذكية.',
      },
    ],
  },
  hero: {
    regionLabel: 'نبذة عن حلول نايل ترونكس المؤسسية',
    eyebrow: 'التكنولوجيا المؤسسية · تكامل الأنظمة · العمليات الذكية',
    headlineLine1: 'نهندس',
    headlineAccent: 'عمليات أذكى',
    headlineLine2End: 'لمنشآتك.',
    description:
      'برمجيات متكاملة، وأنظمة ذكية، وبنية تحتية موثوقة — مُصممة لتبسيط العمليات التشغيلية ورفع كفاءة منشآتك.',
    primaryCta: 'استكشف الحلول',
    secondaryCta: 'استعرض مشاريعنا',
    imageAlt:
      'ردهة خدمة مؤسسية حديثة مجهزة بكشك خدمة ذاتية لإصدار التذاكر من نايل ترونكس وشاشة رقمية لإدارة الانتظار ومكاتب استقبال منظمة.',
    indicatorsLabel: 'القدرات المتكاملة الأساسية',
    indicators: [
      { id: 'software', line1: 'الحلول', line2: 'البرمجية' },
      { id: 'hardware', line1: 'الأجهزة', line2: 'والمعدات' },
      { id: 'integration', line1: 'تكامل', line2: 'الأنظمة' },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<SupportedLang>('en');
  readonly dir = computed<'ltr' | 'rtl'>(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this.lang() === 'ar');
  readonly content = computed<SiteContent>(() =>
    this.lang() === 'ar' ? CONTENT_AR : CONTENT_EN
  );

  constructor() {
    effect(() => {
      const currentLang = this.lang();
      const currentDir = this.dir();
      const htmlEl = this.document.documentElement;
      if (htmlEl) {
        htmlEl.lang = currentLang;
        htmlEl.dir = currentDir;
      }
    });
  }

  toggleLanguage(): void {
    this.lang.update((current) => (current === 'en' ? 'ar' : 'en'));
  }

  setLanguage(lang: SupportedLang): void {
    this.lang.set(lang);
  }
}
