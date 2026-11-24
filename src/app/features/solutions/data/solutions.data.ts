import { SolutionItem, SolutionsSectionCopy } from '../models/solution.model';

export const SOLUTIONS_SECTION_COPY: SolutionsSectionCopy = {
  eyebrow: {
    en: 'OUR SOLUTIONS',
    ar: 'حلولنا',
  },
  headline: {
    en: 'Complete Operational Solutions.',
    ar: 'حلول تشغيلية متكاملة.',
  },
  supportingText: {
    en: 'Technology built around the way your business operates.',
    ar: 'تكنولوجيا مُصممة لتتوافق مع أسلوب تشغيل أعمالك.',
  },
  exploreCta: {
    en: 'Explore Solution',
    ar: 'استكشف الحل',
  },
  prevScreenshot: {
    en: 'Previous screen',
    ar: 'الشاشة السابقة',
  },
  nextScreenshot: {
    en: 'Next screen',
    ar: 'الشاشة التالية',
  },
  openFullscreen: {
    en: 'View full-size screen',
    ar: 'عرض الشاشة بالحجم الكامل',
  },
  closeFullscreen: {
    en: 'Close full-size viewer',
    ar: 'إغلاق العرض الكامل',
  },
  capabilitiesHeading: {
    en: 'Core capabilities',
    ar: 'القدرات الأساسية',
  },
  tablistLabel: {
    en: 'NileTronix enterprise solutions',
    ar: 'حلول نايل ترونكس المؤسسية',
  },
  galleryLabel: {
    en: 'Product interface gallery',
    ar: 'معرض واجهات النظام',
  },
  placeholderNotice: {
    en: 'Solution detail page placeholder — full technical specifications and deployment documentation will be added in the next phase.',
    ar: 'صفحة مبدئية لتفاصيل الحل — سيتم إضافة المواصفات الفنية الكاملة وتفاصيل التشغيل في المرحلة القادمة.',
  },
  backToSolutions: {
    en: 'Back to Our Solutions',
    ar: 'العودة إلى حلولنا',
  },
};

export const SOLUTIONS_CATALOG: readonly SolutionItem[] = [
  {
    slug: 'queue-management',
    route: '/solutions/queue-management',
    productCode: 'Q-Control',
    navLabel: {
      en: 'Queue Management',
      ar: 'إدارة الانتظار',
    },
    title: {
      en: 'Q-Control Queue Management System',
      ar: 'نظام إدارة الانتظار Q-Control',
    },
    valueStatement: {
      en: 'Centralized patient and visitor flow orchestration connecting service counters, calling displays, and multi-branch administration.',
      ar: 'إدارة مركزية لتدفق المرضى والزوار تربط بين شبابيك الخدمة، وشاشات النداء الرقمية، وإدارة الفروع.',
    },
    capabilities: [
      {
        en: 'Real-time main hall and individual service-window digital calling displays',
        ar: 'شاشات نداء رقمية لحظية للصالة الرئيسية ولكل شباك أو عيادة خدمة',
      },
      {
        en: 'Multi-branch, service category, and counter terminal administration',
        ar: 'إدارة مركزية للفروع وفئات الخدمات ونقاط تقديم الخدمة',
      },
      {
        en: 'Role-based operational console with Arabic and English interface support',
        ar: 'لوحة تحكم تشغيلية بصلاحيات متعددة ودعم كامل للغتين العربية والإنجليزية',
      },
    ],
    screenshots: [
      {
        id: 'q-main-display',
        src: 'solutions/queue-management/display.webp',
        width: 1440,
        height: 900,
        addressBar: 'q-control / display / main',
        alt: {
          en: 'Q-Control main waiting hall digital queue display showing active ticket numbers and clinic assignments.',
          ar: 'شاشة النداء الرئيسية لنظام Q-Control تعرض أرقام التذاكر النشطة وتوزيع العيادات والشبابيك.',
        },
        caption: {
          en: 'Main Waiting Hall Calling Display — live ticket routing across clinics and service counters.',
          ar: 'شاشة النداء الرئيسية — عرض لحظي لأرقام التذاكر وتوجيهها إلى العيادات والشبابيك.',
        },
      },
      {
        id: 'q-window-display',
        src: 'solutions/queue-management/window-display.webp',
        width: 1440,
        height: 900,
        addressBar: 'q-control / display / window',
        alt: {
          en: 'Q-Control dedicated service window calling screen displaying current ticket number and active service status.',
          ar: 'شاشة شباك الخدمة في نظام Q-Control تعرض رقم التذكرة الحالي وحالة تقديم الخدمة.',
        },
        caption: {
          en: 'Counter Window Display — clear active-ticket indicator mounted above each clinic or counter.',
          ar: 'شاشة شباك الخدمة — عرض واضح لرقم التذكرة الجاري خدمتها فوق كل عيادة أو شباك.',
        },
      },
      {
        id: 'q-portal',
        src: 'solutions/queue-management/portal.webp',
        width: 1440,
        height: 900,
        addressBar: 'q-control / auth / login',
        alt: {
          en: 'Q-Control central management portal sign-in interface with bilingual switcher.',
          ar: 'واجهة الدخول إلى لوحة التحكم المركزية لنظام Q-Control مع دعم تبديل اللغة.',
        },
        caption: {
          en: 'Central Management Console — unified access for branch supervisors and system administrators.',
          ar: 'بوابة الإدارة المركزية — وصول موحّد لمشرفي الفروع ومديري النظام.',
        },
      },
    ],
  },
  {
    slug: 'parking-management',
    route: '/solutions/parking-management',
    productCode: 'NPark',
    navLabel: {
      en: 'Parking Management',
      ar: 'إدارة المواقف',
    },
    title: {
      en: 'NPark Smart Parking Management',
      ar: 'نظام إدارة مواقف السيارات NPark',
    },
    valueStatement: {
      en: 'End-to-end vehicle entry, exit, ticketing, and tariff control engineered for high-volume commercial and hospital parking facilities.',
      ar: 'إدارة متكاملة لدخول وخروج المركبات، وإصدار التذاكر، والتعريفات للمواقف التجارية والمستشفيات.',
    },
    capabilities: [
      {
        en: 'Dedicated entrance and exit gate cashier workflows with integrated ticket printing',
        ar: 'مسارات عمل مخصصة لبوابات الدخول والخروج مع طباعة التذاكر آلياً',
      },
      {
        en: 'Configurable parking tariffs, visitor passes, and role-based shift management',
        ar: 'إعداد مرن لتعريفات الوقوف وتصاريح الزوار وإدارة الورديات حسب الصلاحيات',
      },
      {
        en: 'Operational overview and real-time revenue and occupancy reporting',
        ar: 'لوحة متابعة تشغيلية وتقارير لحظية للإشغال والإيرادات',
      },
    ],
    screenshots: [
      {
        id: 'npark-portal',
        src: 'solutions/parking-management/overview.webp',
        width: 1440,
        height: 900,
        addressBar: 'npark / portal',
        alt: {
          en: 'NPark parking management platform portal highlighting vehicle entry/exit, parking control, and live reporting.',
          ar: 'بوابة منصة NPark لإدارة مواقف السيارات وتنظيم الدخول والخروج والتقارير اللحظية.',
        },
        caption: {
          en: 'NPark Management Portal — role-protected gateway for gate cashiers, supervisors, and administrators.',
          ar: 'بوابة إدارة NPark — نقطة دخول آمنة لمشغلي البوابات والمشرفين ومديري المواقف.',
        },
      },
    ],
  },
  {
    slug: 'customer-feedback',
    route: '/solutions/customer-feedback',
    productCode: 'Feedback & Surveys',
    navLabel: {
      en: 'Customer Feedback',
      ar: 'استبيانات ورضا العملاء',
    },
    title: {
      en: 'Customer Feedback & Survey Platform',
      ar: 'منصة قياس رضا العملاء والاستبيانات',
    },
    valueStatement: {
      en: 'Enterprise survey authoring, anonymous point-of-service collection, and multi-branch satisfaction analytics for service organizations.',
      ar: 'تصميم الاستبيانات المؤسسية، وجمع آراء المستفيدين الفوري، وتحليل مؤشرات الرضا عبر الفروع والأقسام.',
    },
    capabilities: [
      {
        en: 'Hierarchical conditional survey builder supporting global and branch-specific templates',
        ar: 'منشئ استبيانات هرمي بشروط ذكية يدعم النماذج العامة ونماذج الفروع',
      },
      {
        en: 'Unified executive and branch dashboards tracking satisfaction scores and critical complaints',
        ar: 'لوحات تحكم موحّدة للإدارة العليا والفروع لمتابعة نسب الرضا والشكاوى الحرجة',
      },
      {
        en: 'Bilingual PDF and Excel analytical report export across custom date ranges and departments',
        ar: 'تصدير تقارير تحليلية بصيغتي PDF وExcel باللغتين حسب الفترات والأقسام',
      },
    ],
    screenshots: [
      {
        id: 'cf-system-dashboard',
        src: 'solutions/customer-feedback/overview.webp',
        width: 1440,
        height: 900,
        addressBar: 'feedback / super-admin / system-dashboard',
        alt: {
          en: 'Customer Feedback executive system dashboard showing satisfaction trends, branch performance, and department activity.',
          ar: 'لوحة النظام الرئيسية لمنصة استبيان العملاء تعرض اتجاهات الرضا وأداء الفروع ونشاط الأقسام.',
        },
        caption: {
          en: 'Executive System Dashboard — cross-branch satisfaction trends, response quality, and department activity.',
          ar: 'لوحة النظام التنفيذية — متابعة اتجاهات الرضا وجودة الردود وأداء الفروع والأقسام.',
        },
      },
      {
        id: 'cf-branch-dashboard',
        src: 'solutions/customer-feedback/branch-dashboard.webp',
        width: 1440,
        height: 900,
        addressBar: 'feedback / branch-admin / dashboard',
        alt: {
          en: 'Unified branch survey dashboard showing protected and anonymous survey response breakdowns and complaint counters.',
          ar: 'لوحة الاستبيانات الموحّدة لإدارة الفرع تعرض توزيع الردود ومؤشرات الشكاوى والرضا.',
        },
        caption: {
          en: 'Unified Branch Dashboard — combined analytics for operator-assisted and anonymous public surveys.',
          ar: 'لوحة الفرع الموحّدة — تحليلات مجمّعة لنماذج المشغلين والاستبيانات العامة.',
        },
      },
      {
        id: 'cf-survey-builder',
        src: 'solutions/customer-feedback/survey-builder.webp',
        width: 1440,
        height: 900,
        addressBar: 'feedback / templates / conditional-hierarchy',
        alt: {
          en: 'Conditional survey hierarchy builder mapping follow-up questions to specific satisfaction rating choices.',
          ar: 'منشئ هيكل الأسئلة الشرطية لربط الأسئلة الفرعية بدرجات تقييم محددة.',
        },
        caption: {
          en: 'Conditional Survey Builder — branch follow-up questions automatically based on respondent ratings.',
          ar: 'منشئ الاستبيانات الشرطية — توجيه الأسئلة الفرعية تلقائياً بناءً على تقييم المستفيد.',
        },
      },
      {
        id: 'cf-reports',
        src: 'solutions/customer-feedback/analytics.webp',
        width: 1440,
        height: 900,
        addressBar: 'feedback / reports / pdf-excel',
        alt: {
          en: 'PDF and Excel survey reporting screen with date range, threshold, and report language filters.',
          ar: 'شاشة تصدير تقارير PDF وExcel مع فلاتر الفترة الزمنية واللغة وحدود التقييم.',
        },
        caption: {
          en: 'Executive Report Export — configurable PDF and Excel exports with bilingual layout control.',
          ar: 'تصدير التقارير التنفيذية — تقارير PDF وExcel قابلة للتخصيص باللغتين العربية والإنجليزية.',
        },
      },
      {
        id: 'cf-anonymous-survey',
        src: 'solutions/customer-feedback/anonymous-survey.webp',
        width: 1024,
        height: 508,
        addressBar: 'feedback / public / anonymous-survey',
        alt: {
          en: 'NileTronix standalone anonymous patient feedback and complaints survey interface.',
          ar: 'واجهة استبيان الشكاوى والمقترحات المستقل لقياس رضا العملاء من نايل ترونكس.',
        },
        caption: {
          en: 'Anonymous Public Survey — streamlined multi-step bilingual feedback collection powered by NileTronix.',
          ar: 'استبيان المستفيدين المستقل — جمع آراء ومقترحات العملاء بخطوات بسيطة ثنائية اللغة.',
        },
      },
      {
        id: 'cf-branches',
        src: 'solutions/customer-feedback/branches.webp',
        width: 1440,
        height: 900,
        addressBar: 'feedback / super-admin / branches',
        alt: {
          en: 'Multi-branch administration interface managing facility codes, branch managers, and departments.',
          ar: 'واجهة إدارة الفروع والأقسام ومديري الفروع في منصة استبيان العملاء.',
        },
        caption: {
          en: 'Branch & Department Administration — centralized onboarding for facilities, managers, and departments.',
          ar: 'إدارة الفروع والأقسام — تهيئة مركزية للمنشآت ومديري الفروع والأقسام التشغيلية.',
        },
      },
    ],
  },
  {
    slug: 'traffic-management',
    route: '/solutions/traffic-management',
    productCode: 'Traffic Control',
    navLabel: {
      en: 'Traffic Management',
      ar: 'إدارة المرور والإشارات',
    },
    title: {
      en: 'Traffic Signal & Corridor Control',
      ar: 'أنظمة التحكم في الإشارات والمرور',
    },
    valueStatement: {
      en: 'Software interfaces for traffic signal controllers, intersection timing templates, and corridor synchronization.',
      ar: 'واجهات برمجية للتحكم في إشارات المرور، وتوقيتات التقاطعات، ومزامنة المسارات المرورية.',
    },
    capabilities: [
      {
        en: 'Dedicated bilingual traffic controller panel for signal configuration and timing control',
        ar: 'لوحة تحكم ثنائية اللغة لإعدادات وحدة التحكم وضبط توقيتات الإشارات المرورية',
      },
      {
        en: 'Intersection signal box monitoring, greenway corridor maps, and point configuration modules',
        ar: 'وحدات مراقبة صناديق الإشارات وخرائط المسار الأخضر وتهيئة نقاط التقاطع',
      },
      {
        en: 'Real-time signal state communication architecture built on SignalR and .NET services',
        ar: 'بنية اتصال لحظية لحالة الإشارات تعتمد على SignalR وخدمات .NET',
      },
    ],
    screenshots: [
      {
        id: 'traffic-dashboard-map',
        src: 'solutions/projects/traffic-signal.webp',
        width: 1440,
        height: 900,
        addressBar: 'traffic-signals / map-view / green-way',
        alt: {
          en: 'NileTronix Traffic Signals Dashboard showing interactive intersection map view and greenway corridor control.',
          ar: 'لوحة تحكم إشارات المرور من نايل ترونكس تعرض خريطة التقاطعات التفاعلية والمسار الأخضر.',
        },
        caption: {
          en: 'Traffic Signals Map & Green Way — interactive intersection monitoring, marker placement, and corridor synchronization.',
          ar: 'خريطة إشارات المرور والمسار الأخضر — مراقبة التقاطعات التفاعلية ومزامنة المسارات المرورية.',
        },
      },
      {
        id: 'traffic-controller',
        src: 'solutions/traffic-management/controller.webp',
        width: 1440,
        height: 900,
        addressBar: 'traffic-controller / panel',
        alt: {
          en: 'NileTronix Traffic Controller bilingual control panel access interface.',
          ar: 'واجهة الدخول إلى لوحة التحكم في إشارات المرور ثنائية اللغة من نايل ترونكس.',
        },
        caption: {
          en: 'Traffic Controller Panel — bilingual configuration gateway for field signal controllers.',
          ar: 'لوحة وحدة التحكم المروري — واجهة إعداد ثنائية اللغة لوحدات التحكم الميدانية.',
        },
      },
    ],
  },
  {
    slug: 'security-low-current',
    route: '/solutions/security-low-current',
    productCode: 'AI Vision & Security',
    navLabel: {
      en: 'Security & Low Current',
      ar: 'الأمن والتيار الخفيف',
    },
    title: {
      en: 'AI Vision, Security & Low Current Systems',
      ar: 'أنظمة الرؤية الحاسوبية والأمن والتيار الخفيف',
    },
    valueStatement: {
      en: 'Intelligent camera analytics, multi-floor zone mapping, and automated operational alerting for secure enterprise facilities.',
      ar: 'تحليلات ذكية للكاميرات، وخرائط مناطق الطوابق، وتنبيهات تشغيلية آلية لتأمين المنشآت المؤسسية.',
    },
    capabilities: [
      {
        en: 'Multi-site camera catalog, floor-plan polygon zone editor, and spatial occupancy heatmaps',
        ar: 'إدارة الكاميرات والمواقع، ومحرر مضلعات المناطق على مخططات الطوابق والخرائط الحرارية',
      },
      {
        en: 'Configurable security alert rules, incident investigation workspace, and live monitoring',
        ar: 'قواعد تنبيهات أمنية قابلة للتخصيص، ومساحة متابعة للحوادث والمراقبة الحية',
      },
      {
        en: 'Real-time system health telemetry monitoring server readiness, database status, and MQTT streams',
        ar: 'متابعة لحظية لسلامة النظام وجاهزية الخوادم وقواعد البيانات وتدفقات MQTT',
      },
    ],
    screenshots: [
      {
        id: 'vision-floors',
        src: 'solutions/security-low-current/floors.webp',
        width: 1440,
        height: 900,
        addressBar: 'ai-vision / floors',
        alt: {
          en: 'NileTronix AI Vision console showing floor polygon zone management and full camera analytics navigation.',
          ar: 'واجهة نظام نايل ترونكس لتحليلات الكاميرات وإدارة مضلعات المناطق والخرائط الحرارية للطوابق.',
        },
        caption: {
          en: 'AI Vision Floor & Zone Management — polygon zone mapping and heatmap administration per facility floor.',
          ar: 'إدارة الطوابق والمناطق في AI Vision — تخطيط مضلعات المناطق والخرائط الحرارية لكل طابق.',
        },
      },
      {
        id: 'vision-alerts',
        src: 'solutions/security-low-current/alerts.webp',
        width: 1440,
        height: 900,
        addressBar: 'ai-vision / alerts',
        alt: {
          en: 'NileTronix AI Vision security alerts and alert rules management workspace.',
          ar: 'مساحة إدارة التنبيهات الأمنية وقواعد التنبيه في نظام نايل ترونكس لتحليلات الكاميرات.',
        },
        caption: {
          en: 'Security Alerts & Rules — centralized triage for automated camera-analytics events and alert policies.',
          ar: 'التنبيهات وقواعد المراقبة — متابعة مركزية لأحداث تحليلات الكاميرات وسياسات التنبيه.',
        },
      },
    ],
  },
];
