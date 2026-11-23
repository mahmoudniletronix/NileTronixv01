import { IndustriesSectionCopy, IndustryItem } from '../models/industry.model';

export const INDUSTRIES_SECTION_COPY: IndustriesSectionCopy = {
  eyebrowNum: '03 /',
  eyebrowText: {
    en: 'INDUSTRIES WE SERVE',
    ar: 'القطاعات التي نخدمها',
  },
  headline: {
    en: 'Technology that adapts to every environment',
    ar: 'تكنولوجيا تتكيّف مع كل بيئة عمل',
  },
  supportingText: {
    en: 'Integrated technology solutions for healthcare, finance, commercial facilities, mobility, and public services.',
    ar: 'حلول تكنولوجية متكاملة لقطاعات الرعاية الصحية، والمالية، والمنشآت التجارية، والمواقف، والخدمات الحكومية.',
  },
  capabilitiesLabel: {
    en: 'Applicable Solutions',
    ar: 'الحلول الملائمة للقطاع',
  },
  exploreCta: {
    en: 'Explore Solutions',
    ar: 'استكشف الحلول',
  },
  navAriaLabel: {
    en: 'Industries we serve',
    ar: 'قائمة القطاعات التي نخدمها',
  },
  prevIndustry: {
    en: 'Previous industry',
    ar: 'القطاع السابق',
  },
  nextIndustry: {
    en: 'Next industry',
    ar: 'القطاع التالي',
  },
  sectorBadge: {
    en: 'Enterprise Sector',
    ar: 'قطاع مؤسسي',
  },
};

export const INDUSTRIES_CATALOG: readonly IndustryItem[] = [
  {
    id: 'healthcare',
    indexLabel: '01',
    faIcon: 'fa-solid fa-hospital',
    name: {
      en: 'Healthcare',
      ar: 'الرعاية الصحية',
    },
    subtitle: {
      en: 'Hospitals & Medical Centers',
      ar: 'المستشفيات والمراكز الطبية',
    },
    description: {
      en: 'Improve patient flow and streamline service delivery across healthcare facilities.',
      ar: 'تحسين تدفق المرضى وتنظيم تقديم الخدمات عبر المستشفيات والمنشآت الصحية.',
    },
    capabilities: [
      {
        icon: 'fa-solid fa-users-line',
        label: {
          en: 'Queue & Patient Flow Management',
          ar: 'إدارة الانتظار وتدفق المرضى',
        },
      },
      {
        icon: 'fa-solid fa-tv',
        label: {
          en: 'Digital Calling & Information Displays',
          ar: 'شاشات النداء والمعلومات الرقمية',
        },
      },
      {
        icon: 'fa-solid fa-sitemap',
        label: {
          en: 'Multi-Branch Service Administration',
          ar: 'إدارة الخدمات عبر الفروع والعيادات',
        },
      },
    ],
    image: {
      src: 'industries/healthcare.webp',
      width: 1400,
      height: 1050,
      alt: {
        en: 'Modern healthcare reception environment equipped with self-service ticketing kiosk and digital queue display.',
        ar: 'بيئة استقبال حديثة في منشأة رعاية صحية مجهزة بكشك خدمة ذاتية وشاشة نداء رقمية.',
      },
    },
    ctaRoute: '/solutions/queue-management',
  },
  {
    id: 'banking',
    indexLabel: '02',
    faIcon: 'fa-solid fa-building-columns',
    name: {
      en: 'Banking & Finance',
      ar: 'البنوك والقطاع المالي',
    },
    subtitle: {
      en: 'Banks & Financial Institutions',
      ar: 'البنوك والمؤسسات المالية',
    },
    description: {
      en: 'Help organize customer visits, manage service queues, and improve branch operations.',
      ar: 'تنظيم زيارات العملاء، وإدارة طوابير الخدمة، ورفع كفاءة التشغيل داخل الفروع المصرفية.',
    },
    capabilities: [
      {
        icon: 'fa-solid fa-people-arrows',
        label: {
          en: 'Queue & Customer Flow Management',
          ar: 'إدارة الانتظار وتدفق العملاء',
        },
      },
      {
        icon: 'fa-solid fa-display',
        label: {
          en: 'Digital Service Displays',
          ar: 'شاشات عرض الخدمات والنداء الرقمي',
        },
      },
      {
        icon: 'fa-solid fa-network-wired',
        label: {
          en: 'Centralized Branch Operations',
          ar: 'إدارة وتشغيل الفروع مركزياً',
        },
      },
    ],
    image: {
      src: 'industries/banking.webp',
      width: 1400,
      height: 1050,
      alt: {
        en: 'Contemporary banking branch interior designed for organized customer queue flow and counter service.',
        ar: 'قاعة خدمة عملاء حديثة في فرع مصرفي مصممة لتنظيم تدفق المراجعين وشبابيك الخدمة.',
      },
    },
    ctaRoute: '/solutions/queue-management',
  },
  {
    id: 'commercial',
    indexLabel: '03',
    faIcon: 'fa-solid fa-city',
    name: {
      en: 'Commercial & Retail',
      ar: 'القطاع التجاري والتجزئة',
    },
    subtitle: {
      en: 'Malls & Commercial Buildings',
      ar: 'المراكز والمباني التجارية',
    },
    description: {
      en: 'Connect customer-facing services and facility operations within commercial spaces.',
      ar: 'ربط خدمات الزوار والعمليات التشغيلية للمرافق داخل المجمعات والمباني التجارية.',
    },
    capabilities: [
      {
        icon: 'fa-solid fa-square-parking',
        label: {
          en: 'Parking Management',
          ar: 'إدارة مواقف السيارات',
        },
      },
      {
        icon: 'fa-solid fa-comment-dots',
        label: {
          en: 'Customer Feedback',
          ar: 'منصات استبيان ورضا العملاء',
        },
      },
      {
        icon: 'fa-solid fa-shield-halved',
        label: {
          en: 'Security & Access Control',
          ar: 'أنظمة الأمن والتحكم بالدخول',
        },
      },
    ],
    image: {
      src: 'industries/commercial.webp',
      width: 1400,
      height: 1050,
      alt: {
        en: 'Modern commercial complex and retail atrium supporting integrated visitor, parking, and security systems.',
        ar: 'مجمع تجاري حديث يدعم تكامل أنظمة الزوار والمواقف والأمن.',
      },
    },
    ctaRoute: '/solutions/customer-feedback',
  },
  {
    id: 'parking',
    indexLabel: '04',
    faIcon: 'fa-solid fa-car-side',
    name: {
      en: 'Parking & Mobility',
      ar: 'المواقف والتنقل الذكي',
    },
    subtitle: {
      en: 'Parking Facilities & Campuses',
      ar: 'مرافق المواقف والمجمعات',
    },
    description: {
      en: 'Support efficient vehicle entry, exit, ticketing, and parking operations.',
      ar: 'دعم عمليات دخول وخروج المركبات، وإصدار التذاكر، وإدارة ساحات الوقوف بكفاءة.',
    },
    capabilities: [
      {
        icon: 'fa-solid fa-square-parking',
        label: {
          en: 'Smart Parking Management',
          ar: 'إدارة المواقف الذكية',
        },
      },
      {
        icon: 'fa-solid fa-road-barrier',
        label: {
          en: 'Vehicle Entry & Exit Control',
          ar: 'التحكم في بوابات دخول وخروج المركبات',
        },
      },
      {
        icon: 'fa-solid fa-chart-column',
        label: {
          en: 'Parking Operations Reporting',
          ar: 'تقارير التشغيل والإشغال للمواقف',
        },
      },
    ],
    image: {
      src: 'industries/parking.webp',
      width: 1400,
      height: 1050,
      alt: {
        en: 'Automated parking facility entrance equipped with barrier gate and ticketing terminal.',
        ar: 'مدخل منشأة مواقف سيارات آلي مجهز ببوابة تحكم ووحدة إصدار تذاكر.',
      },
    },
    ctaRoute: '/solutions/parking-management',
  },
  {
    id: 'government',
    indexLabel: '05',
    faIcon: 'fa-solid fa-landmark-dome',
    name: {
      en: 'Government & Public Services',
      ar: 'القطاع الحكومي والخدمات العامة',
    },
    subtitle: {
      en: 'Government Entities & Service Centers',
      ar: 'الجهات الحكومية ومراكز خدمة المواطنين',
    },
    description: {
      en: 'Improve visitor flow and organize service delivery in public-facing facilities.',
      ar: 'تنظيم حركة المراجعين ورفع كفاءة تقديم الخدمات في المراكز والهيئات الحكومية.',
    },
    capabilities: [
      {
        icon: 'fa-solid fa-ticket',
        label: {
          en: 'Queue & Visitor Management',
          ar: 'إدارة الانتظار وتدفق المراجعين',
        },
      },
      {
        icon: 'fa-solid fa-tv',
        label: {
          en: 'Digital Calling Displays',
          ar: 'شاشات النداء الرقمية لصالات الخدمة',
        },
      },
      {
        icon: 'fa-solid fa-building-shield',
        label: {
          en: 'Multi-Branch Administration',
          ar: 'الإدارة المركزية للمراكز والفروع',
        },
      },
    ],
    image: {
      src: 'industries/government.webp',
      width: 1400,
      height: 1050,
      alt: {
        en: 'Public service center hall engineered for high-volume citizen queue organization and counter service.',
        ar: 'صالة مركز خدمات حكومي مهيأة لتنظيم استقبال المراجعين وتقديم الخدمات بكفاءة.',
      },
    },
    ctaRoute: '/solutions/queue-management',
  },
];
