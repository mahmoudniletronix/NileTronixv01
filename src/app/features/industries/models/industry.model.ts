import { LocalizedText } from '../../solutions/models/solution.model';

export type IndustryId =
  | 'healthcare'
  | 'banking'
  | 'commercial'
  | 'parking'
  | 'government';

export interface IndustryCapability {
  readonly icon: string;
  readonly label: LocalizedText;
}

export interface IndustryItem {
  readonly id: IndustryId;
  readonly indexLabel: string;
  readonly faIcon: string;
  readonly name: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly description: LocalizedText;
  readonly capabilities: readonly IndustryCapability[];
  readonly image: {
    readonly src: string;
    readonly width: number;
    readonly height: number;
    readonly alt: LocalizedText;
  };
  readonly ctaRoute: string;
}

export interface IndustriesSectionCopy {
  readonly eyebrowNum: string;
  readonly eyebrowText: LocalizedText;
  readonly headline: LocalizedText;
  readonly supportingText: LocalizedText;
  readonly capabilitiesLabel: LocalizedText;
  readonly exploreCta: LocalizedText;
  readonly navAriaLabel: LocalizedText;
  readonly prevIndustry: LocalizedText;
  readonly nextIndustry: LocalizedText;
  readonly sectorBadge: LocalizedText;
}
