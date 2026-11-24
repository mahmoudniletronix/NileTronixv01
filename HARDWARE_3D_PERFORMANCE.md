# NileTronix — 3D Hardware Studio Performance & Testing Report

## 1. Production Bundle Analysis (`npm run build:gh-pages`)

All Three.js and 3D modeling dependencies are strictly code-split into lazy chunks loaded on demand via `IntersectionObserver` when the user approaches the `#hardware` section:

| Chunk | Raw Size | Estimated Transfer (Gzip) | Loading Strategy |
|---|---:|---:|---|
| Initial Homepage Total (`main` + `styles` + core chunks) | `709.21 kB` | `163.49 kB` | Initial load (zero Three.js) |
| `three` Core (`chunk-DQVOIVQH.js` + `three-module`) | `754.69 kB` | `157.56 kB` | Lazy (on `#hardware` viewport approach) |
| `GLTFLoader` | `46.71 kB` | `12.59 kB` | Lazy (only when a product defines `glbUrl`) |
| `gsap/ScrollTrigger` | `43.70 kB` | `16.40 kB` | Lazy (browser-only after view init) |
| `OrbitControls` | `20.14 kB` | `4.05 kB` | Lazy (on `#hardware` viewport approach) |
| `procedural-hardware-factory` (all 12 3D models) | `19.31 kB` | `4.83 kB` | Lazy (on first model load) |
| `RoomEnvironment` (studio IBL) | `2.09 kB` | `0.79 kB` | Lazy (on scene init) |

### Key Performance Safeguards Implemented
- **Render-on-Demand Loop**: `ThreeSceneService` stops `requestAnimationFrame` automatically once OrbitControls damping and GSAP transitions settle (unless Auto-Rotate is explicitly enabled), consuming 0% GPU when idle.
- **Viewport & Tab Pausing**: `IntersectionObserver` pauses rendering when `#hardware` scrolls out of view; `document.visibilitychange` pauses rendering when the browser tab is hidden.
- **Adaptive Resolution**: `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))` prevents excessive GPU fill-rate on 3x mobile displays.
- **Bounded GPU Cache**: `ModelCacheService` caps cached 3D models at 6 entries and disposes evicted geometries, textures, and materials while protecting the active model.
- **Deterministic Cleanup**: `ngOnDestroy` cancels `requestAnimationFrame`, kills GSAP timelines and ScrollTriggers, disconnects `ResizeObserver` and `IntersectionObserver`, disposes PMREM environment targets, shadow planes, OrbitControls, and the `WebGLRenderer`.
- **WebGL Fallback**: If WebGL is unavailable or context is lost, `<app-product-loading-state>` displays the real optimized WebP studio photograph with a Retry action while keeping all specs and navigation functional.

## 2. Automated Verification Results

- **Production Build (`npm run build:gh-pages`)**: Passed (`exit code 0`), `<base href="/NileTronixv01/">` verified.
- **Unit Tests (`npm test -- --watch=false`)**: **14 / 14 tests passed** across 4 test suites:
  - `src/app/app.spec.ts` (3/3 passed)
  - `src/app/features/home/components/site-products/site-products.component.spec.ts` (3/3 passed — flagship Q-KIOSK AIO 3D viewer render, category/model switching to QCT-101, Arabic localization)
  - `src/app/features/home/components/industries-serve/industries-serve.component.spec.ts` (4/4 passed)
  - `src/app/features/home/components/solutions-showcase/solutions-showcase.component.spec.ts` (4/4 passed)
