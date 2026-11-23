import { LocalizedText } from '../../solutions/models/solution.model';

export type ProductCategoryId = 'kiosks' | 'lcd' | 'led' | 'terminals';

export interface ProductCategoryTab {
  readonly id: ProductCategoryId;
  readonly icon: string;
  readonly label: LocalizedText;
}

export interface HardwareSpec {
  readonly icon: string;
  readonly label: LocalizedText;
  readonly value: LocalizedText;
}

export interface SiteProductItem {
  readonly id: string;
  readonly category: ProductCategoryId;
  readonly modelCode: string;
  readonly categoryBadge: LocalizedText;
  readonly name: LocalizedText;
  readonly summary: LocalizedText;
  readonly specs: readonly HardwareSpec[];
  readonly image: {
    readonly src: string;
    readonly width: number;
    readonly height: number;
    readonly alt: LocalizedText;
  };
}

export interface SiteProductsCopy {
  readonly eyebrowNum: string;
  readonly eyebrowText: LocalizedText;
  readonly headline: LocalizedText;
  readonly supportingText: LocalizedText;
  readonly filterAriaLabel: LocalizedText;
  readonly zoomLabel: LocalizedText;
  readonly closeLightbox: LocalizedText;
  readonly requestQuoteCta: LocalizedText;
  readonly modelsInCategory: LocalizedText;
  readonly prevDevice: LocalizedText;
  readonly nextDevice: LocalizedText;
}
