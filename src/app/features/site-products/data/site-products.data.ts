import {
  ProductCategoryTab,
  SiteProductItem,
  SiteProductsCopy,
} from '../models/site-product.model';

export const SITE_PRODUCTS_COPY: SiteProductsCopy = {
  eyebrowNum: '04 /',
  eyebrowText: {
    en: 'HARDWARE & FIELD SYSTEMS',
    ar: 'الأجهزة والأنظمة الميدانية',
  },
  headline: {
    en: 'Engineered hardware built to perform',
    ar: 'أجهزة ميدانية مصممة للعمل المتواصل',
  },
  supportingText: {
    en: 'Self-service ticketing kiosks, LED and LCD calling displays, and counter terminals built for seamless integration with NileTronix software.',
    ar: 'أكشاك خدمة ذاتية، وشاشات نداء رقمية بتقنيتي LED وLCD، ووحدات استدعاء مصممة للتكامل الكامل مع برمجيات نايل ترونكس.',
  },
  filterAriaLabel: {
    en: 'Hardware categories',
    ar: 'فئات الأجهزة الميدانية',
  },
  zoomLabel: {
    en: 'Inspect hardware',
    ar: 'معاينة الجهاز بالحجم الكامل',
  },
  closeLightbox: {
    en: 'Close preview',
    ar: 'إغلاق المعاينة',
  },
  requestQuoteCta: {
    en: 'Request Technical Specs',
    ar: 'اطلب المواصفات الفنية',
  },
  modelsInCategory: {
    en: 'Available Models',
    ar: 'الموديلات المتاحة',
  },
  prevDevice: {
    en: 'Previous device',
    ar: 'الجهاز السابق',
  },
  nextDevice: {
    en: 'Next device',
    ar: 'الجهاز التالي',
  },
};

export const PRODUCT_CATEGORIES: readonly ProductCategoryTab[] = [
  {
    id: 'kiosks',
    icon: 'fa-solid fa-tablet-screen-button',
    label: { en: 'Self-Service Kiosks', ar: 'أكشاك الخدمة الذاتية' },
  },
  {
    id: 'lcd',
    icon: 'fa-solid fa-tv',
    label: { en: 'LCD Displays', ar: 'شاشات LCD الرقمية' },
  },
  {
    id: 'led',
    icon: 'fa-solid fa-display',
    label: { en: 'LED Calling Boards', ar: 'لوحات النداء LED' },
  },
  {
    id: 'terminals',
    icon: 'fa-solid fa-calculator',
    label: { en: 'Counter Terminals', ar: 'وحدات الاستدعاء' },
  },
];

export const SITE_PRODUCTS_CATALOG: readonly SiteProductItem[] = [
  {
    id: 'kiosk-curved-aio',
    category: 'kiosks',
    modelCode: 'Q-KIOSK AIO',
    categoryBadge: { en: 'Self-Service Kiosk', ar: 'كشك خدمة ذاتية' },
    name: {
      en: 'All-in-One Curved Floor Kiosk',
      ar: 'كشك خدمة ذاتية متكامل (Curved)',
    },
    summary: {
      en: 'Ergonomic floor-standing ticketing terminal with integrated thermal printer and responsive touch display.',
      ar: 'كشك أرضي بتصميم انسيابي مزود بشاشة لمس وطابعة تذاكر حرارية مدمجة للصالات الحديثة.',
    },
    specs: [
      {
        icon: 'fa-solid fa-print',
        label: { en: 'Ticketing', ar: 'إصدار التذاكر' },
        value: { en: 'Integrated Thermal Printer', ar: 'طابعة حرارية مدمجة' },
      },
      {
        icon: 'fa-solid fa-language',
        label: { en: 'Interface', ar: 'واجهة الاستخدام' },
        value: { en: 'Arabic & English Touch UI', ar: 'شاشة لمس عربية وإنجليزية' },
      },
      {
        icon: 'fa-solid fa-link',
        label: { en: 'Integration', ar: 'التكامل البرمجي' },
        value: { en: 'Native Q-Control Sync', ar: 'ربط مباشر مع نظام Q-Control' },
      },
    ],
    image: {
      src: 'site-products/kiosk-curved-aio.webp',
      width: 480,
      height: 720,
      alt: {
        en: 'NileTronix all-in-one curved floor-standing self-service ticketing kiosk.',
        ar: 'كشك خدمة ذاتية أرضي متكامل من نايل ترونكس لإصدار التذاكر.',
      },
    },
  },
  {
    id: 'kiosk-slim-dark',
    category: 'kiosks',
    modelCode: 'Q-KIOSK SLIM',
    categoryBadge: { en: 'Self-Service Kiosk', ar: 'كشك خدمة ذاتية' },
    name: {
      en: 'Slim Pedestal Kiosk Terminal',
      ar: 'كشك خدمة ذاتية نحيف (Slim)',
    },
    summary: {
      en: 'Compact dark-frame bilingual kiosk engineered for modern lobbies, banks, and narrow entrances.',
      ar: 'كشك نحيف بإطار داكن ثنائي اللغة مصمم للبنوك والصالات الحديثة والمداخل المحدودة.',
    },
    specs: [
      {
        icon: 'fa-solid fa-ruler-combined',
        label: { en: 'Footprint', ar: 'التصميم' },
        value: { en: 'Ultra-Slim Pedestal Frame', ar: 'هيكل نحيف موفر للمساحة' },
      },
      {
        icon: 'fa-solid fa-language',
        label: { en: 'Interface', ar: 'واجهة الاستخدام' },
        value: { en: 'Bilingual Service Selection', ar: 'اختيار الخدمات باللغتين' },
      },
      {
        icon: 'fa-solid fa-shield-halved',
        label: { en: 'Enclosure', ar: 'الهيكل' },
        value: { en: 'Heavy-Duty Steel Finish', ar: 'هيكل معدني للعمل المتواصل' },
      },
    ],
    image: {
      src: 'site-products/kiosk-slim-dark.webp',
      width: 480,
      height: 720,
      alt: {
        en: 'NileTronix slim pedestal dark-frame self-service ticketing kiosk.',
        ar: 'كشك خدمة ذاتية نحيف بإطار داكن من نايل ترونكس.',
      },
    },
  },
  {
    id: 'kiosk-angled-pro',
    category: 'kiosks',
    modelCode: 'Q-KIOSK PRO',
    categoryBadge: { en: 'Self-Service Kiosk', ar: 'كشك خدمة ذاتية' },
    name: {
      en: 'Angled Touch Ticketing Kiosk',
      ar: 'كشك تذاكر بشاشة لمس مائلة',
    },
    summary: {
      en: 'High-durability angled screen kiosk built for comfortable high-volume daily visitor traffic.',
      ar: 'كشك عملي بشاشة مائلة مريحة للاستخدام ومصمم للعمل الكثيف في المستشفيات والمراكز.',
    },
    specs: [
      {
        icon: 'fa-solid fa-hand-pointer',
        label: { en: 'Ergonomics', ar: 'زاوية الاستخدام' },
        value: { en: 'Angled Anti-Glare Touch', ar: 'شاشة لمس مائلة مريحة' },
      },
      {
        icon: 'fa-solid fa-ticket',
        label: { en: 'Output', ar: 'الإخراج' },
        value: { en: 'Front-Access Ticket Slot', ar: 'منفذ تذاكر أمامي سريع' },
      },
      {
        icon: 'fa-solid fa-link',
        label: { en: 'Integration', ar: 'التكامل' },
        value: { en: 'Multi-Service Queue Routing', ar: 'توجيه ذكي متعدد الخدمات' },
      },
    ],
    image: {
      src: 'site-products/kiosk-angled-pro.webp',
      width: 480,
      height: 720,
      alt: {
        en: 'NileTronix angled touch floor-standing ticketing kiosk.',
        ar: 'كشك إصدار تذاكر بشاشة لمس مائلة من نايل ترونكس.',
      },
    },
  },
  {
    id: 'kiosk-compact-white',
    category: 'kiosks',
    modelCode: 'Q-KIOSK WIDE',
    categoryBadge: { en: 'Self-Service Kiosk', ar: 'كشك خدمة ذاتية' },
    name: {
      en: 'Widescreen Multilingual Kiosk',
      ar: 'كشك خدمة ذاتية بشاشة عريضة',
    },
    summary: {
      en: 'Landscape widescreen self-service terminal supporting expansive multi-department service menus.',
      ar: 'وحدة خدمة ذاتية بشاشة أفقية عريضة لعرض قوائم خدمات متعددة الأقسام بوضوح.',
    },
    specs: [
      {
        icon: 'fa-solid fa-desktop',
        label: { en: 'Display', ar: 'الشاشة' },
        value: { en: 'Landscape Widescreen Panel', ar: 'شاشة أفقية عريضة' },
      },
      {
        icon: 'fa-solid fa-language',
        label: { en: 'Languages', ar: 'اللغات' },
        value: { en: 'Instant AR / EN Switching', ar: 'تبديل فوري عربي / إنجليزي' },
      },
      {
        icon: 'fa-solid fa-sitemap',
        label: { en: 'Workflow', ar: 'مسار العمل' },
        value: { en: 'Multi-Department Menus', ar: 'قوائم متعددة الأقسام' },
      },
    ],
    image: {
      src: 'site-products/kiosk-compact-white.webp',
      width: 658,
      height: 720,
      alt: {
        en: 'NileTronix landscape widescreen bilingual ticketing kiosk.',
        ar: 'كشك خدمة ذاتية بشاشة أفقية عريضة من نايل ترونكس.',
      },
    },
  },
  {
    id: 'lcd-ceiling-dual',
    category: 'lcd',
    modelCode: 'Q-LCD CEILING',
    categoryBadge: { en: 'LCD Display', ar: 'شاشة LCD' },
    name: {
      en: 'Ceiling-Mounted Counter LCD',
      ar: 'شاشة شباك LCD معلقة بالسقف',
    },
    summary: {
      en: 'Suspended counter signage displaying counter number, service title, and active ticket.',
      ar: 'شاشة معلقة تعرض رقم الشباك ونوع الخدمة ورقم التذكرة الحالية بوضوح عالٍ.',
    },
    specs: [
      {
        icon: 'fa-solid fa-arrows-up-to-line',
        label: { en: 'Mounting', ar: 'التثبيت' },
        value: { en: 'Overhead Ceiling Pole Mount', ar: 'تثبيت علوي معلق بالسقف' },
      },
      {
        icon: 'fa-solid fa-table-columns',
        label: { en: 'Layout', ar: 'العرض' },
        value: { en: 'Dual-Zone Counter & Ticket', ar: 'عرض مزدوج للشباك والتذكرة' },
      },
      {
        icon: 'fa-solid fa-bolt',
        label: { en: 'Updates', ar: 'التحديث' },
        value: { en: 'Real-Time Queue Sync', ar: 'تحديث لحظي متزامن' },
      },
    ],
    image: {
      src: 'site-products/lcd-ceiling-dual.webp',
      width: 960,
      height: 640,
      alt: {
        en: 'NileTronix ceiling-mounted dual-zone counter LCD display.',
        ar: 'شاشة LCD معلقة بالسقف لعرض رقم الشباك والتذكرة من نايل ترونكس.',
      },
    },
  },
  {
    id: 'lcd-clinic-display',
    category: 'lcd',
    modelCode: 'Q-LCD CLINIC',
    categoryBadge: { en: 'LCD Display', ar: 'شاشة LCD' },
    name: {
      en: 'Clinic & Room Queue LCD Display',
      ar: 'شاشة عيادة وغرف كشف رقمية',
    },
    summary: {
      en: 'Dedicated clinic entrance screen displaying room number, doctor branding, and live call status.',
      ar: 'شاشة مخصصة لمداخل العيادات تعرض رقم العيادة وهوية المستشفى وحالة النداء الحالية.',
    },
    specs: [
      {
        icon: 'fa-solid fa-hospital',
        label: { en: 'Environment', ar: 'البيئة' },
        value: { en: 'Hospitals & Outpatient Clinics', ar: 'المستشفيات والعيادات الخارجية' },
      },
      {
        icon: 'fa-solid fa-palette',
        label: { en: 'Branding', ar: 'الهوية' },
        value: { en: 'Custom Facility Logo & Theme', ar: 'دعم شعار وألوان المنشأة' },
      },
      {
        icon: 'fa-solid fa-volume-high',
        label: { en: 'Alerts', ar: 'التنبيه' },
        value: { en: 'Visual & Audio Call Sync', ar: 'تزامن النداء المرئي والصوتي' },
      },
    ],
    image: {
      src: 'site-products/lcd-clinic-display.webp',
      width: 788,
      height: 720,
      alt: {
        en: 'NileTronix clinic entrance queue LCD display.',
        ar: 'شاشة عيادة رقمية لعرض رقم العيادة وحالة النداء من نايل ترونكس.',
      },
    },
  },
  {
    id: 'lcd-counter-stand',
    category: 'lcd',
    modelCode: 'Q-LCD STAND',
    categoryBadge: { en: 'LCD Display', ar: 'شاشة LCD' },
    name: {
      en: 'Desktop Counter Pedestal LCD',
      ar: 'شاشة شباك مكتبية بقاعدة تثبيت',
    },
    summary: {
      en: 'Compact counter-mounted LCD screen engineered for reception desks and open service counters.',
      ar: 'شاشة مدمجة بقاعدة تثبيت لمكاتب الاستقبال وشبابيك خدمة العملاء المفتوحة.',
    },
    specs: [
      {
        icon: 'fa-solid fa-compress',
        label: { en: 'Mounting', ar: 'التثبيت' },
        value: { en: 'Desk Pedestal Base', ar: 'قاعدة تثبيت مكتبية ثابتة' },
      },
      {
        icon: 'fa-solid fa-eye',
        label: { en: 'Visibility', ar: 'الوضوح' },
        value: { en: 'Wide-Angle Crisp Readout', ar: 'زاوية رؤية عريضة وواضحة' },
      },
      {
        icon: 'fa-solid fa-link',
        label: { en: 'Control', ar: 'التحكم' },
        value: { en: 'Linked to Counter Agent', ar: 'مرتبطة مباشرة بموظف الشباك' },
      },
    ],
    image: {
      src: 'site-products/lcd-counter-stand.webp',
      width: 788,
      height: 720,
      alt: {
        en: 'NileTronix countertop pedestal LCD queue display.',
        ar: 'شاشة شباك مكتبية بقاعدة تثبيت من نايل ترونكس.',
      },
    },
  },
  {
    id: 'lcd-wall-signage',
    category: 'lcd',
    modelCode: 'Q-LCD WALL',
    categoryBadge: { en: 'LCD Display', ar: 'شاشة LCD' },
    name: {
      en: 'Wall-Mounted Hall Signage LCD',
      ar: 'شاشة جدارية لصالات الانتظار',
    },
    summary: {
      en: 'Flush wall-mounted display for waiting-area branding, announcements, and queue routing.',
      ar: 'شاشة جدارية لصالات الانتظار لعرض الهوية المؤسسية والإعلانات والتوجيه الرقمي.',
    },
    specs: [
      {
        icon: 'fa-solid fa-tv',
        label: { en: 'Mounting', ar: 'التثبيت' },
        value: { en: 'Flush Wall-Mount Enclosure', ar: 'تثبيت جداري مسطّح أنيق' },
      },
      {
        icon: 'fa-solid fa-bullhorn',
        label: { en: 'Content', ar: 'المحتوى' },
        value: { en: 'Signage & Queue Overlay', ar: 'عرض إعلاني مع قائمة الانتظار' },
      },
      {
        icon: 'fa-solid fa-network-wired',
        label: { en: 'Management', ar: 'الإدارة' },
        value: { en: 'Centralized Content Push', ar: 'إدارة مركزية للمحتوى' },
      },
    ],
    image: {
      src: 'site-products/lcd-wall-signage.webp',
      width: 960,
      height: 640,
      alt: {
        en: 'NileTronix wall-mounted waiting hall digital signage LCD display.',
        ar: 'شاشة جدارية رقمية لصالات الانتظار من نايل ترونكس.',
      },
    },
  },
  {
    id: 'led-main-hanging',
    category: 'led',
    modelCode: 'Q-LED MAIN',
    categoryBadge: { en: 'LED Board', ar: 'لوحة LED' },
    name: {
      en: 'Suspended Dual-Zone LED Board',
      ar: 'لوحة نداء رئيسية LED معلقة',
    },
    summary: {
      en: 'High-visibility suspended dot-matrix LED board showing counter and customer ticket numbers from afar.',
      ar: 'لوحة LED رئيسية عالية الوضوح تعرض رقم الشباك ورقم العميل بوضوح من مسافات بعيدة.',
    },
    specs: [
      {
        icon: 'fa-solid fa-sun',
        label: { en: 'Luminance', ar: 'السطوع' },
        value: { en: 'High-Contrast Red Dot-Matrix', ar: 'إضاءة LED حمراء فائقة الوضوح' },
      },
      {
        icon: 'fa-solid fa-table-columns',
        label: { en: 'Readout', ar: 'العرض' },
        value: { en: 'Counter + Ticket Dual Fields', ar: 'حقلان لرقم الشباك ورقم العميل' },
      },
      {
        icon: 'fa-solid fa-arrows-up-to-line',
        label: { en: 'Mounting', ar: 'التثبيت' },
        value: { en: 'Suspended Ceiling Chain Mount', ar: 'تعليق سقفي للصالات الكبيرة' },
      },
    ],
    image: {
      src: 'site-products/led-main-hanging.webp',
      width: 960,
      height: 480,
      alt: {
        en: 'Q-Control suspended dual-zone LED main queue calling board.',
        ar: 'لوحة نداء رئيسية LED معلقة من Q-Control.',
      },
    },
  },
  {
    id: 'led-dotmatrix-alpha',
    category: 'led',
    modelCode: 'Q-LED MATRIX',
    categoryBadge: { en: 'LED Board', ar: 'لوحة LED' },
    name: {
      en: 'Alphanumeric Dot-Matrix Counter LED',
      ar: 'شاشة شباك LED مصفوفة نقطية',
    },
    summary: {
      en: 'Compact dot-matrix LED counter unit supporting letter-prefixed ticket codes (e.g. A401).',
      ar: 'وحدة شباك LED نقطية تدعم عرض الحروف والأرقام معاً مثل A401 لتمييز الخدمات.',
    },
    specs: [
      {
        icon: 'fa-solid fa-font',
        label: { en: 'Characters', ar: 'الرموز' },
        value: { en: 'Full Alphanumeric Prefix', ar: 'دعم الحروف والأرقام معاً' },
      },
      {
        icon: 'fa-solid fa-bolt',
        label: { en: 'Response', ar: 'الاستجابة' },
        value: { en: 'Instant Flash on New Call', ar: 'وميض فوري عند النداء الجديد' },
      },
      {
        icon: 'fa-solid fa-plug',
        label: { en: 'Bus', ar: 'التوصيل' },
        value: { en: 'Industrial Low-Current Link', ar: 'توصيل تيار خفيف صناعي مستقر' },
      },
    ],
    image: {
      src: 'site-products/led-dotmatrix-alpha.webp',
      width: 960,
      height: 640,
      alt: {
        en: 'Q-Control alphanumeric dot-matrix LED counter display showing A401.',
        ar: 'شاشة شباك LED نقطية تعرض رمز التذكرة A401.',
      },
    },
  },
  {
    id: 'led-4digit-counter',
    category: 'led',
    modelCode: 'Q-LED 4D',
    categoryBadge: { en: 'LED Board', ar: 'لوحة LED' },
    name: {
      en: '4-Digit 7-Segment LED Display',
      ar: 'شاشة نداء LED رباعية الأرقام',
    },
    summary: {
      en: 'Ultra-bright 4-digit 7-segment LED display engineered for fast glanceability above service counters.',
      ar: 'شاشة LED ساطعة من 4 أرقام لقراءة سريعة وفورية فوق شبابيك الخدمة.',
    },
    specs: [
      {
        icon: 'fa-solid fa-hashtag',
        label: { en: 'Digits', ar: 'الأرقام' },
        value: { en: '4-Digit 7-Segment Array', ar: '4 خانات رقمية عالية السطوع' },
      },
      {
        icon: 'fa-solid fa-shield-halved',
        label: { en: 'Build', ar: 'الهيكل' },
        value: { en: 'Matte Anti-Glare Front', ar: 'واجهة غير عاكسة للضوء' },
      },
      {
        icon: 'fa-solid fa-link',
        label: { en: 'Compatibility', ar: 'التوافق' },
        value: { en: 'Q-Control Hardware Protocol', ar: 'متوافقة مع منظومة Q-Control' },
      },
    ],
    image: {
      src: 'site-products/led-4digit-counter.webp',
      width: 960,
      height: 640,
      alt: {
        en: 'Q-Control 4-digit 7-segment red LED counter display.',
        ar: 'شاشة شباك LED رباعية الأرقام من Q-Control.',
      },
    },
  },
  {
    id: 'terminal-qct101',
    category: 'terminals',
    modelCode: 'QCT-101',
    categoryBadge: { en: 'Counter Terminal', ar: 'وحدة استدعاء' },
    name: {
      en: 'QCT-101 Hardware Calling Keypad',
      ar: 'وحدة استدعاء الموظف QCT-101',
    },
    summary: {
      en: 'Dedicated physical counter terminal with backlit LCD readout and Next, Recall, and Transfer keys.',
      ar: 'جهاز استدعاء مادي للموظفين مزود بشاشة LCD وأزرار مخصصة للتالي وإعادة النداء والتحويل.',
    },
    specs: [
      {
        icon: 'fa-solid fa-keyboard',
        label: { en: 'Controls', ar: 'التحكم' },
        value: { en: 'Next, Recall, Transfer & Hold', ar: 'التالي، إعادة النداء، والتحويل' },
      },
      {
        icon: 'fa-solid fa-display',
        label: { en: 'Readout', ar: 'الشاشة' },
        value: { en: 'Backlit Ticket & Timer LCD', ar: 'شاشة مضيئة لرقم التذكرة والوقت' },
      },
      {
        icon: 'fa-solid fa-microchip',
        label: { en: 'Operation', ar: 'التشغيل' },
        value: { en: 'Standalone PC-Free Calling', ar: 'تشغيل مباشر بدون الحاجة لحاسوب' },
      },
    ],
    image: {
      src: 'site-products/terminal-qct101.webp',
      width: 658,
      height: 720,
      alt: {
        en: 'Q-Control QCT-101 physical counter calling keypad terminal.',
        ar: 'وحدة استدعاء الموظف QCT-101 من Q-Control.',
      },
    },
  },
];
