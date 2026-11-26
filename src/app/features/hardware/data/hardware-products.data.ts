import { SITE_PRODUCTS_CATALOG } from '../../site-products/data/site-products.data';
import {
  Hardware3DConfig,
  HardwareProductItem,
  HardwareStudioCopy,
} from '../models/hardware-product.model';

export const HARDWARE_STUDIO_COPY: HardwareStudioCopy = {
  badge360: {
    en: 'Interactive 3D',
    ar: 'عرض ثلاثي الأبعاد',
  },
  dragHintDesktop: {
    en: 'Drag to orbit · Scroll to zoom',
    ar: 'اسحب للتدوير · مرّر للتقريب',
  },
  dragHintMobile: {
    en: 'Drag to rotate · Pinch to zoom',
    ar: 'اسحب للتدوير · قرّب بإصبعين',
  },
  loadingLabel: {
    en: 'Preparing 3D model',
    ar: 'جاري تجهيز المجسّم ثلاثي الأبعاد',
  },
  fallbackNotice: {
    en: 'Showing studio product photo',
    ar: 'عرض صورة الاستوديو للجهاز',
  },
  webglUnavailable: {
    en: '3D preview requires WebGL. Displaying high-resolution hardware photo.',
    ar: 'العرض ثلاثي الأبعاد يتطلب WebGL. يتم عرض صورة الجهاز عالية الدقة.',
  },
  retryLabel: {
    en: 'Retry 3D View',
    ar: 'إعادة تحميل العرض ثلاثي الأبعاد',
  },
  resetView: {
    en: 'Reset View',
    ar: 'إعادة ضبط المنظور',
  },
  zoomIn: {
    en: 'Zoom In',
    ar: 'تقريب',
  },
  zoomOut: {
    en: 'Zoom Out',
    ar: 'تبعيد',
  },
  autoRotate: {
    en: 'Auto Rotate',
    ar: 'تدوير تلقائي',
  },
  fullscreenEnter: {
    en: 'Fullscreen',
    ar: 'ملء الشاشة',
  },
  fullscreenExit: {
    en: 'Exit Fullscreen',
    ar: 'إنهاء ملء الشاشة',
  },
  hotspotsToggle: {
    en: 'Feature Pins',
    ar: 'نقاط التفاصيل',
  },
  returnDefaultView: {
    en: 'Back to full view',
    ar: 'العودة للمنظور الكامل',
  },
  controlsAriaLabel: {
    en: '3D camera controls',
    ar: 'أدوات التحكم في الكاميرا ثلاثية الأبعاد',
  },
  interactiveModeLabel: {
    en: '3D Studio',
    ar: 'استوديو 3D',
  },
  posterModeLabel: {
    en: 'Photo',
    ar: 'صورة',
  },
};

const HARDWARE_3D_CONFIG_MAP: Readonly<Record<string, Hardware3DConfig>> = {
  'kiosk-curved-aio': {
    glbUrl: 'models/kiosk-curved-aio.glb',
    proceduralId: 'kiosk-curved-aio',
    sourceType: 'glb',
    referenceImage: 'originals/kiosks/curved-floor-kiosk.png',
    defaultYawDeg: 22,
    defaultPitchDeg: 10,
    distanceScale: 1.12,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'touchscreen',
        anchor: { x: 0.28, y: 0.34, z: 0.14 },
        normal: { x: 0, y: 0.15, z: 1 },
        cameraOffset: { x: 0.14, y: 0.12, z: 0.95 },
        icon: 'fa-solid fa-hand-pointer',
        title: { en: 'Bilingual Touch Display', ar: 'شاشة لمس ثنائية اللغة' },
        description: {
          en: 'Recessed touch panel running Arabic and English Q-Control service selection UI.',
          ar: 'شاشة لمس مدمجة تعرض واجهة اختيار الخدمات باللغتين العربية والإنجليزية.',
        },
      },
      {
        id: 'printer-slot',
        anchor: { x: 0.18, y: -0.02, z: 0.16 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.2, y: 0.05, z: 0.85 },
        icon: 'fa-solid fa-print',
        title: { en: 'Thermal Printer Output', ar: 'منفذ الطابعة الحرارية' },
        description: {
          en: 'Front-facing integrated thermal ticket dispensing slot for fast visitor turnaround.',
          ar: 'منفذ أمامي مدمج لإصدار تذاكر الانتظار الحرارية بسرعة وسهولة.',
        },
      },
      {
        id: 'enclosure',
        anchor: { x: 0.34, y: -0.24, z: -0.04 },
        normal: { x: 1, y: 0, z: 0.1 },
        cameraOffset: { x: 1.0, y: 0.08, z: 0.45 },
        icon: 'fa-solid fa-shield-halved',
        title: { en: 'Ventilated Steel Chassis', ar: 'هيكل معدني مزود بتهوية' },
        description: {
          en: 'Curved floor-standing metallic enclosure with side ventilation grille for continuous daily operation.',
          ar: 'هيكل أرضي معدني انسيابي مزود بفتحة تهوية جانبية للعمل المتواصل.',
        },
      },
    ],
  },
  'kiosk-slim-dark': {
    proceduralId: 'kiosk-slim-dark',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/kiosks/pedestal-kiosk.png',
    defaultYawDeg: 20,
    defaultPitchDeg: 10,
    distanceScale: 1.1,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'portrait-screen',
        anchor: { x: 0, y: 0.28, z: 0.09 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.15, y: 0.08, z: 0.9 },
        icon: 'fa-solid fa-tablet-screen-button',
        title: { en: 'Portrait Touch Interface', ar: 'شاشة لمس رأسية' },
        description: {
          en: 'Vertical bilingual service display set inside a slim dark-finish frame.',
          ar: 'شاشة لمس رأسية ثنائية اللغة مدمجة في إطار داكن نحيف.',
        },
      },
      {
        id: 'pedestal-frame',
        anchor: { x: 0, y: -0.3, z: 0.08 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.45, y: 0.05, z: 0.85 },
        icon: 'fa-solid fa-ruler-combined',
        title: { en: 'Twin-Column Pedestal', ar: 'قاعدة مزدوجة نحيفة' },
        description: {
          en: 'Space-saving dual-column steel stand anchored to a weighted floor base.',
          ar: 'هيكل معدني نحيف بعمودين وقاعدة أرضية ثابتة للمداخل المحدودة.',
        },
      },
    ],
  },
  'kiosk-angled-pro': {
    proceduralId: 'kiosk-angled-pro',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/kiosks/floor-kiosk-angled-view-a.png',
    defaultYawDeg: 24,
    defaultPitchDeg: 12,
    distanceScale: 1.1,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'angled-head',
        anchor: { x: 0, y: 0.34, z: 0.09 },
        normal: { x: 0, y: 0.4, z: 0.9 },
        cameraOffset: { x: 0.25, y: 0.25, z: 0.85 },
        icon: 'fa-solid fa-hand-pointer',
        title: { en: 'Angled Touch Console', ar: 'شاشة لمس مائلة' },
        description: {
          en: 'Ergonomically tilted anti-glare touch display designed for high-traffic lobbies.',
          ar: 'شاشة لمس مائلة بزاوية مريحة للعمل الكثيف في الصالات والمستشفيات.',
        },
      },
      {
        id: 'front-ticket',
        anchor: { x: 0, y: 0.06, z: 0.14 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.15, y: 0.05, z: 0.8 },
        icon: 'fa-solid fa-ticket',
        title: { en: 'Front-Access Ticket Slot', ar: 'منفذ تذاكر أمامي' },
        description: {
          en: 'Direct front ticket dispenser positioned below the angled display console.',
          ar: 'منفذ إخراج تذاكر أمامي مباشر أسفل وحدة الشاشة المائلة.',
        },
      },
    ],
  },
  'kiosk-compact-white': {
    proceduralId: 'kiosk-compact-white',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/kiosks/wide-screen-kiosk.png',
    defaultYawDeg: 20,
    defaultPitchDeg: 11,
    distanceScale: 1.12,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'wide-panel',
        anchor: { x: 0, y: 0.3, z: 0.1 },
        normal: { x: 0, y: 0.35, z: 0.9 },
        cameraOffset: { x: 0.15, y: 0.2, z: 0.9 },
        icon: 'fa-solid fa-desktop',
        title: { en: 'Widescreen Touch Panel', ar: 'شاشة لمس أفقية عريضة' },
        description: {
          en: 'Landscape widescreen display accommodating multi-department service menus.',
          ar: 'شاشة أفقية عريضة لعرض قوائم الخدمات متعددة الأقسام بوضوح.',
        },
      },
      {
        id: 'wide-ticket',
        anchor: { x: 0, y: 0.02, z: 0.12 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.2, y: 0.05, z: 0.85 },
        icon: 'fa-solid fa-print',
        title: { en: 'Integrated Ticket Slot', ar: 'منفذ إصدار التذاكر' },
        description: {
          en: 'Centered front ticket exit seamlessly built into the sculpted white stand.',
          ar: 'منفذ إصدار تذاكر أمامي مدمج في الجسم الأبيض الانسيابي.',
        },
      },
    ],
  },
  'lcd-ceiling-dual': {
    proceduralId: 'lcd-ceiling-dual',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/lcd-displays/ceiling-display-queue.png',
    defaultYawDeg: 18,
    defaultPitchDeg: 8,
    distanceScale: 1.15,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'ceiling-mount',
        anchor: { x: 0, y: 0.36, z: 0 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.4, y: 0.15, z: 0.85 },
        icon: 'fa-solid fa-arrows-up-to-line',
        title: { en: 'Ceiling Pole Mount', ar: 'عمود التثبيت السقفي' },
        description: {
          en: 'Overhead steel suspension pole with ceiling mounting flange for clear hall visibility.',
          ar: 'عمود تثبيت علوي مع قاعدة سقفية لتعليق الشاشة فوق شبابيك الخدمة.',
        },
      },
      {
        id: 'dual-zone-lcd',
        anchor: { x: 0, y: -0.1, z: 0.06 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.1, y: 0, z: 0.9 },
        icon: 'fa-solid fa-table-columns',
        title: { en: 'Dual-Zone Counter Readout', ar: 'عرض مزدوج للشباك والتذكرة' },
        description: {
          en: 'Displays service title, counter number, and active ticket synced live with Q-Control.',
          ar: 'يعرض اسم الخدمة ورقم الشباك والتذكرة الحالية بتزامن لحظي.',
        },
      },
    ],
  },
  'lcd-clinic-display': {
    proceduralId: 'lcd-clinic-display',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/lcd-displays/ceiling-display-green.png',
    defaultYawDeg: 18,
    defaultPitchDeg: 8,
    distanceScale: 1.15,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'clinic-screen',
        anchor: { x: 0, y: -0.08, z: 0.06 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.1, y: 0.05, z: 0.9 },
        icon: 'fa-solid fa-hospital',
        title: { en: 'Clinic Status Interface', ar: 'واجهة عرض العيادة' },
        description: {
          en: 'Displays clinic room number, facility branding, and live patient call status.',
          ar: 'تعرض رقم العيادة وهوية المستشفى وحالة استدعاء المريض الحالية.',
        },
      },
    ],
  },
  'lcd-counter-stand': {
    proceduralId: 'lcd-counter-stand',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/lcd-displays/desktop-display.png',
    defaultYawDeg: 20,
    defaultPitchDeg: 10,
    distanceScale: 1.15,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'desk-base',
        anchor: { x: 0, y: -0.34, z: 0.05 },
        normal: { x: 0, y: 0.2, z: 1 },
        cameraOffset: { x: 0.35, y: 0.15, z: 0.85 },
        icon: 'fa-solid fa-compress',
        title: { en: 'Desk Pedestal Base', ar: 'قاعدة التثبيت المكتبية' },
        description: {
          en: 'Circular desk-mount flange and pole stand built for open reception counters.',
          ar: 'قاعدة تثبيت مكتبية دائرية ثابتة لمكاتب الاستقبال والشبابيك المفتوحة.',
        },
      },
    ],
  },
  'lcd-wall-signage': {
    proceduralId: 'lcd-wall-signage',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/lcd-displays/wall-display.png',
    defaultYawDeg: 20,
    defaultPitchDeg: 8,
    distanceScale: 1.18,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'wall-bracket',
        anchor: { x: 0, y: 0, z: -0.06 },
        normal: { x: 0, y: 0, z: -1 },
        cameraOffset: { x: 0.35, y: 0.1, z: -0.95 },
        icon: 'fa-solid fa-tv',
        title: { en: 'Flush Wall-Mount Enclosure', ar: 'تثبيت جداري مسطّح' },
        description: {
          en: 'Slim commercial signage chassis with rear mounting profile for waiting halls.',
          ar: 'هيكل شاشة نحيف بتثبيت جداري خلفي لصالات الانتظار.',
        },
      },
    ],
  },
  'led-main-hanging': {
    proceduralId: 'led-main-hanging',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/led-displays/dual-number-hanging-display.png',
    defaultYawDeg: 16,
    defaultPitchDeg: 8,
    distanceScale: 1.18,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'led-dual-matrix',
        anchor: { x: 0.08, y: -0.05, z: 0.08 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.1, y: 0.05, z: 0.9 },
        icon: 'fa-solid fa-sun',
        title: { en: 'Dual-Zone Red LED Matrix', ar: 'مصفوفة LED مزدوجة' },
        description: {
          en: 'High-contrast red dot-matrix digits showing counter and customer ticket numbers.',
          ar: 'أرقام LED حمراء عالية التباين لعرض رقم الشباك ورقم العميل من مسافات بعيدة.',
        },
      },
    ],
  },
  'led-dotmatrix-alpha': {
    proceduralId: 'led-dotmatrix-alpha',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/led-displays/alphanumeric-display.png',
    defaultYawDeg: 18,
    defaultPitchDeg: 8,
    distanceScale: 1.2,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'alpha-matrix',
        anchor: { x: 0.08, y: 0, z: 0.08 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.12, y: 0.05, z: 0.9 },
        icon: 'fa-solid fa-font',
        title: { en: 'Alphanumeric Dot-Matrix', ar: 'عرض نقطي للحروف والأرقام' },
        description: {
          en: 'Supports letter-prefixed ticket numbers (such as A401) with instant call flash.',
          ar: 'يدعم عرض الرموز المكونة من حروف وأرقام مثل A401 مع وميض فوري عند النداء.',
        },
      },
    ],
  },
  'led-4digit-counter': {
    proceduralId: 'led-4digit-counter',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/led-displays/four-digit-display.png',
    defaultYawDeg: 18,
    defaultPitchDeg: 8,
    distanceScale: 1.2,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'seven-seg',
        anchor: { x: 0.08, y: 0, z: 0.08 },
        normal: { x: 0, y: 0, z: 1 },
        cameraOffset: { x: 0.12, y: 0.05, z: 0.9 },
        icon: 'fa-solid fa-hashtag',
        title: { en: '4-Digit 7-Segment Array', ar: '4 خانات رقمية ساطعة' },
        description: {
          en: 'Ultra-bright 7-segment red LED readout behind a matte anti-glare front face.',
          ar: 'أرقام LED حمراء عالية السطوع خلف واجهة غير عاكسة للضوء.',
        },
      },
    ],
  },
  'terminal-qct101': {
    proceduralId: 'terminal-qct101',
    sourceType: 'procedural-reference',
    referenceImage: 'originals/counter-terminals/qct-101-keypad.png',
    defaultYawDeg: 18,
    defaultPitchDeg: 38,
    distanceScale: 1.18,
    supportsExplodedView: false,
    hasConfirmedDimensions: false,
    hotspots: [
      {
        id: 'qct-lcd',
        anchor: { x: 0, y: 0.34, z: -0.24 },
        normal: { x: 0, y: 0.9, z: 0.42 },
        cameraOffset: { x: 0.1, y: 0.72, z: 0.65 },
        icon: 'fa-solid fa-display',
        title: { en: 'Backlit Status LCD', ar: 'شاشة LCD مضيئة' },
        description: {
          en: 'Displays active ticket number, counter status, and elapsed service timer.',
          ar: 'تعرض رقم التذكرة الحالية وحالة الشباك وعداد وقت الخدمة.',
        },
      },
      {
        id: 'qct-keypad',
        anchor: { x: 0.04, y: 0.1, z: 0.14 },
        normal: { x: 0, y: 0.9, z: 0.42 },
        cameraOffset: { x: 0.25, y: 0.75, z: 0.65 },
        icon: 'fa-solid fa-keyboard',
        title: { en: 'Dedicated Tactile Keys', ar: 'أزرار استدعاء مخصصة' },
        description: {
          en: 'Physical numeric keypad with color-coded Next, Call/Recall, Transfer, and Save keys.',
          ar: 'لوحة مفاتيح مادية بأزرار مخصصة للتالي وإعادة النداء والتحويل والحفظ.',
        },
      },
    ],
  },
};

export const HARDWARE_PRODUCTS_CATALOG: readonly HardwareProductItem[] = SITE_PRODUCTS_CATALOG.map(
  (item) => ({
    ...item,
    model3d: HARDWARE_3D_CONFIG_MAP[item.id] ?? HARDWARE_3D_CONFIG_MAP['kiosk-curved-aio'],
  })
);
