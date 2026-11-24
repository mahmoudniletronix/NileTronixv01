# NileTronix — 3D Hardware Asset Manifest

## 1. Reference Audit Summary

- **Reference Pack Inspected**: `public/Site product/NileTronix-3D-Reference-Pack.zip` (19 original PNGs, 16 WebP previews, `README.txt`, `source-mapping.txt`, `contact-sheet.jpg`).
- **Manufacturer CAD / GLB Availability**: No `.glb`, `.gltf`, `.obj`, `.fbx`, `.step`, or `.blend` files exist in the repository.
- **External Modeling Tools**: Blender is not installed in the current build environment.
- **Resolution Strategy**: All 12 catalog products are rendered with **real multi-part Three.js procedural PBR 3D geometry** (`src/app/features/hardware/services/procedural-hardware-factory.ts`) modeled directly from the supplied front/angled reference photographs, preserving NileTronix / Q-Control visual identity, screen layouts, mounting stands, and visible openings. The `ModelLoaderService` is pre-wired with `GLTFLoader` so verified manufacturer `.glb` files can drop in per product without changing any component code.

## 2. Product-by-Product Asset Manifest

| Product ID | Model Code | Category | Active 3D Source | Reference Image Used | Approximation Notes (Missing Views) |
|---|---|---|---|---|---|
| `kiosk-curved-aio` | `Q-KIOSK AIO` | Self-Service Kiosks | `procedural-reference` | `originals/kiosks/curved-floor-kiosk.png` | Arched silver fascia, dark shield bezel, touch UI, printer slot, kickplate, and right-side fan vent modeled from front-angled photo; rear panel & port layout approximated. |
| `kiosk-slim-dark` | `Q-KIOSK SLIM` | Self-Service Kiosks | `procedural-reference` | `originals/kiosks/pedestal-kiosk.png` | Matte-black monolith, portrait touch UI, dispenser recess, twin steel columns, and base modeled from front photo; rear service panel approximated. |
| `kiosk-angled-pro` | `Q-KIOSK PRO` | Self-Service Kiosks | `procedural-reference` | `originals/kiosks/floor-kiosk-angled-view-a.png` | Light-grey tower, dark base, front ticket slot with paper lip, and tilted screen head modeled from angled/front photos; rear panel approximated. |
| `kiosk-compact-white` | `Q-KIOSK WIDE` | Self-Service Kiosks | `procedural-reference` | `originals/kiosks/wide-screen-kiosk.png` | Gloss-white flared base, tapered column, ticket slot, and widescreen tilted display modeled from front photo; rear contour approximated. |
| `lcd-ceiling-dual` | `Q-LCD CEILING` | LCD Displays | `procedural-reference` | `originals/lcd-displays/ceiling-display-queue.png` | Slim black LCD bezel, dual-zone queue screen, ceiling pole & flange modeled from front photo; rear VESA pack approximated. |
| `lcd-clinic-display` | `Q-LCD CLINIC` | LCD Displays | `procedural-reference` | `originals/lcd-displays/ceiling-display-green.png` | Slim black LCD bezel, green clinic room screen, ceiling mount modeled from front photo; rear VESA pack approximated. |
| `lcd-counter-stand` | `Q-LCD STAND` | LCD Displays | `procedural-reference` | `originals/lcd-displays/desktop-display.png` | Slim black LCD bezel, counter screen, vertical pole & circular desk base modeled from front photo; rear VESA pack approximated. |
| `lcd-wall-signage` | `Q-LCD WALL` | LCD Displays | `procedural-reference` | `originals/lcd-displays/wall-display.png` | Slim signage bezel, waiting-hall screen, and flush rear wall rail modeled from front photo; rear I/O bay approximated. |
| `led-main-hanging` | `Q-LED MAIN` | LED Calling Boards | `procedural-reference` | `originals/led-displays/dual-number-hanging-display.png` | Matte-black aluminum enclosure, dual suspension rings/rods, and red dot-matrix dual readout modeled from front photo; rear enclosure approximated. |
| `led-dotmatrix-alpha` | `Q-LED MATRIX` | LED Calling Boards | `procedural-reference` | `originals/led-displays/alphanumeric-display.png` | Compact rounded matte-black enclosure, top lug, and red alphanumeric matrix (`A401`) modeled from front photo; rear enclosure approximated. |
| `led-4digit-counter` | `Q-LED 4D` | LED Calling Boards | `procedural-reference` | `originals/led-displays/four-digit-display.png` | Compact rounded matte-black enclosure and red 7-segment readout (`1234`) modeled from front photo; rear enclosure approximated. |
| `terminal-qct101` | `QCT-101` | Counter Terminals | `procedural-reference` | `originals/counter-terminals/qct-101-keypad.png` | Angled desktop wedge, blue backlit LCD, Q-Control strip, and 16 color-coded 3D keys modeled from front photo; rear RJ/power port bay approximated. |

## 3. Requirements for Future Exact CAD / GLB Replacement

To upgrade any product from `procedural-reference` to verified `glb`:
- Obtain manufacturer STEP/IGES/FBX/GLB CAD files OR multi-angle photography (front, rear, left, right, top) plus confirmed millimeter dimensions.
- Only enable `supportsExplodedView: true` when separate verified internal sub-meshes exist.
- Only enable `hasConfirmedDimensions: true` when manufacturer datasheet dimensions are confirmed.
