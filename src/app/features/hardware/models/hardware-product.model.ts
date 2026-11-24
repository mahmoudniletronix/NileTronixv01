import { SiteProductItem } from '../../site-products/models/site-product.model';
import { LocalizedText } from '../../solutions/models/solution.model';
import { ProductHotspot } from './product-hotspot.model';

export type ModelGeometrySource = 'glb' | 'procedural-reference';

export interface Hardware3DConfig {
  /** Optional future path to a verified manufacturer GLB asset under public/models/ */
  readonly glbUrl?: string;
  /** Procedural Three.js geometry template id matching the physical reference */
  readonly proceduralId: string;
  /** Documents whether the active 3D geometry is a manufacturer GLB or reference-based approximation */
  readonly sourceType: ModelGeometrySource;
  /** Reference image from NileTronix-3D-Reference-Pack.zip used to model proportions */
  readonly referenceImage: string;
  /** Initial camera azimuth/polar multiplier for best hero angle */
  readonly defaultYawDeg: number;
  readonly defaultPitchDeg: number;
  readonly distanceScale?: number;
  /** Optional verified hotspots tied to real visible hardware features */
  readonly hotspots: readonly ProductHotspot[];
  /** Future-ready flags: only enabled when verified separate CAD parts / dimensions exist */
  readonly supportsExplodedView: boolean;
  readonly hasConfirmedDimensions: boolean;
}

export interface HardwareProductItem extends SiteProductItem {
  readonly model3d: Hardware3DConfig;
}

export interface HardwareStudioCopy {
  readonly badge360: LocalizedText;
  readonly dragHintDesktop: LocalizedText;
  readonly dragHintMobile: LocalizedText;
  readonly loadingLabel: LocalizedText;
  readonly fallbackNotice: LocalizedText;
  readonly webglUnavailable: LocalizedText;
  readonly retryLabel: LocalizedText;
  readonly resetView: LocalizedText;
  readonly zoomIn: LocalizedText;
  readonly zoomOut: LocalizedText;
  readonly autoRotate: LocalizedText;
  readonly fullscreenEnter: LocalizedText;
  readonly fullscreenExit: LocalizedText;
  readonly hotspotsToggle: LocalizedText;
  readonly returnDefaultView: LocalizedText;
  readonly controlsAriaLabel: LocalizedText;
  readonly interactiveModeLabel: LocalizedText;
  readonly posterModeLabel: LocalizedText;
}
