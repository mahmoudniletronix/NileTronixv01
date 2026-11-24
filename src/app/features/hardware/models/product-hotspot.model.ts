import { LocalizedText } from '../../solutions/models/solution.model';

export interface Vec3Tuple {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface ProductHotspot {
  readonly id: string;
  /** Local-space position relative to the normalized model bounding box ([-0.5..0.5] * size) */
  readonly anchor: Vec3Tuple;
  /** Outward surface normal for occlusion / backface visibility check */
  readonly normal: Vec3Tuple;
  /** Relative camera offset direction when focusing this hotspot */
  readonly cameraOffset: Vec3Tuple;
  readonly icon: string;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
}

export interface ProjectedHotspot {
  readonly hotspot: ProductHotspot;
  /** Percentage [0..100] from left edge of canvas */
  readonly xPercent: number;
  /** Percentage [0..100] from top edge of canvas */
  readonly yPercent: number;
  /** True when facing the camera and inside viewport bounds */
  readonly visible: boolean;
}
