# NileTronix — Interactive 3D Hardware Studio Implementation

## 1. Architecture Overview

The `#hardware` (**Engineered hardware built to perform**) section has been upgraded into a production-ready, lazy-loaded **Three.js + Angular 21 + GSAP** interactive 3D hardware showroom while preserving all existing NileTronix branding, design tokens, bilingual localization (English LTR / Arabic RTL), and product specifications.

### Module Structure

```text
src/app/features/hardware/
├── models/
│   ├── camera-preset.model.ts         # CameraPresetId & localized toolbar preset definitions
│   ├── product-hotspot.model.ts       # Normalized 3D hotspot anchors, normals & 2D projections
│   └── hardware-product.model.ts      # HardwareProductItem & Hardware3DConfig interfaces
├── data/
│   └── hardware-products.data.ts      # Enriches existing 12-product catalog with 3D configs & hotspots
├── services/
│   ├── procedural-hardware-factory.ts # Reference-based Three.js PBR 3D geometry builders (all 12 models)
│   ├── model-cache.service.ts         # Bounded LRU GPU cache (max 6 entries) with active-model protection
│   ├── model-loader.service.ts        # Lazy-loads Three.js, GLTFLoader (when GLB exists), or procedural geometry
│   ├── camera-controller.service.ts   # Bounding-box-relative camera presets & GSAP-OrbitControls coordination
│   ├── product-animation.service.ts   # GSAP 3D model entrance & rapid-switch-safe swap transitions
│   └── three-scene.service.ts         # Single WebGLRenderer, studio lighting, IBL, resize/visibility/context-loss
└── components/
    ├── product-3d-viewer/             # Reusable <app-product-3d-viewer> studio component
    ├── product-controls/              # Compact camera preset & utility toolbar (keyboard + touch accessible)
    ├── product-hotspots/              # Occlusion-aware 3D-to-2D projected feature pins & popover card
    └── product-loading-state/         # Poster-backed loading progress + error/WebGL-unavailable fallback
```

## 2. Key Engineering Decisions

- **Single Reused WebGLRenderer**: `SiteProductsComponent` mounts one `<app-product-3d-viewer>` instance across all 4 categories and 12 products, avoiding WebGL context exhaustion.
- **Zero Three.js on Initial Page Load**: `three`, `OrbitControls`, `GLTFLoader`, `RoomEnvironment`, `procedural-hardware-factory`, and `gsap/ScrollTrigger` are dynamically imported only when the hardware section enters the viewport (`IntersectionObserver`, `rootMargin: 220px`).
- **GSAP + OrbitControls Harmony**: Any active GSAP camera transition is immediately cancelled on `controls.addEventListener('start', ...)`, preventing animation conflicts when the user drags or zooms.
- **Race-Condition Safety**: Rapid product switching uses a monotonically increasing `loadGeneration` counter so stale async loads are discarded cleanly while the current model remains visible until the next model is ready.
- **Studio Lighting & Color Management**: `ACESFilmicToneMapping`, `SRGBColorSpace`, procedural `RoomEnvironment` PMREM reflections, 3-point directional lighting (key + cool fill + cyan-white rim), and a soft `ShadowMaterial` ground contact shadow.
- **RTL Integrity**: The Three.js canvas host is explicitly `dir="ltr"` so 3D hardware geometry and OrbitControls drag directions are never mirrored when switching to Arabic, while all UI controls, labels, specs, and hotspot cards localize cleanly in `Cairo` (AR) / `Space Grotesk + Outfit` (EN).
- **Reduced Motion**: `prefers-reduced-motion: reduce` disables automatic rotation, entrance tweens, and camera swoops, snapping cleanly to target angles.

## 3. Adding Future Hardware Models or Verified Manufacturer GLBs

1. **Add product metadata** in `src/app/features/site-products/data/site-products.data.ts` (id, category, modelCode, localized name/summary/specs, and poster WebP image in `public/site-products/`).
2. **Drop the optimized `.glb` file** into `public/models/<category>/<product-id>.glb` (recommended 1–3 MB, Draco/Meshopt compressed, Y-up, meters).
3. **Register the 3D config** in `src/app/features/hardware/data/hardware-products.data.ts`:
   ```ts
   'my-new-kiosk': {
     glbUrl: 'models/kiosks/my-new-kiosk.glb', // Automatically loaded via GLTFLoader
     proceduralId: 'kiosk-curved-aio',         // Automatic fallback if GLB fails
     sourceType: 'glb',
     referenceImage: 'originals/kiosks/my-new-kiosk.png',
     defaultYawDeg: 22,
     defaultPitchDeg: 10,
     distanceScale: 1.1,
     supportsExplodedView: false,              // Set true only if GLB has verified separate sub-meshes
     hasConfirmedDimensions: false,            // Set true only with verified manufacturer CAD dimensions
     hotspots: [ /* verified visible features only */ ],
   }
   ```
4. **Automatic Normalization**: `ModelLoaderService` automatically centers, grounds (`y = 0`), and scales any loaded GLB via `normalizeHardwareRoot()`, and `CameraControllerService` computes all 6 camera presets relative to the model's live bounding box.
