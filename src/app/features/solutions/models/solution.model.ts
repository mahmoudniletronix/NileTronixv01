export type SolutionSlug =
  | 'queue-management'
  | 'parking-management'
  | 'customer-feedback'
  | 'traffic-management'
  | 'security-low-current';

export interface LocalizedText {
  readonly en: string;
  readonly ar: string;
}

export interface SolutionScreenshot {
  readonly id: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: LocalizedText;
  readonly caption: LocalizedText;
  readonly addressBar: string;
}

export interface SolutionItem {
  readonly slug: SolutionSlug;
  readonly route: string;
  readonly productCode: string;
  readonly navLabel: LocalizedText;
  readonly title: LocalizedText;
  readonly valueStatement: LocalizedText;
  readonly capabilities: readonly LocalizedText[];
  readonly screenshots: readonly SolutionScreenshot[];
}

export interface SolutionsSectionCopy {
  readonly eyebrow: LocalizedText;
  readonly headline: LocalizedText;
  readonly supportingText: LocalizedText;
  readonly exploreCta: LocalizedText;
  readonly prevScreenshot: LocalizedText;
  readonly nextScreenshot: LocalizedText;
  readonly openFullscreen: LocalizedText;
  readonly closeFullscreen: LocalizedText;
  readonly capabilitiesHeading: LocalizedText;
  readonly tablistLabel: LocalizedText;
  readonly galleryLabel: LocalizedText;
  readonly placeholderNotice: LocalizedText;
  readonly backToSolutions: LocalizedText;
}
