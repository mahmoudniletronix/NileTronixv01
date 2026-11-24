import { LocalizedText } from '../../solutions/models/solution.model';

export type CameraPresetId =
  | 'perspective'
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top';

export interface CameraPresetOption {
  readonly id: CameraPresetId;
  readonly icon: string;
  readonly label: LocalizedText;
  readonly shortLabel: LocalizedText;
}

export const CAMERA_PRESETS: readonly CameraPresetOption[] = [
  {
    id: 'perspective',
    icon: 'fa-solid fa-cube',
    label: { en: 'Perspective View', ar: 'منظور ثلاثي الأبعاد' },
    shortLabel: { en: '3D', ar: '3D' },
  },
  {
    id: 'front',
    icon: 'fa-solid fa-square',
    label: { en: 'Front View', ar: 'المنظور الأمامي' },
    shortLabel: { en: 'Front', ar: 'أمام' },
  },
  {
    id: 'back',
    icon: 'fa-solid fa-clone',
    label: { en: 'Back View', ar: 'المنظور الخلفي' },
    shortLabel: { en: 'Back', ar: 'خلف' },
  },
  {
    id: 'left',
    icon: 'fa-solid fa-arrow-left',
    label: { en: 'Left View', ar: 'المنظور الأيسر' },
    shortLabel: { en: 'Left', ar: 'يسار' },
  },
  {
    id: 'right',
    icon: 'fa-solid fa-arrow-right',
    label: { en: 'Right View', ar: 'المنظور الأيمن' },
    shortLabel: { en: 'Right', ar: 'يمين' },
  },
  {
    id: 'top',
    icon: 'fa-solid fa-arrow-down',
    label: { en: 'Top View', ar: 'المنظور العلوي' },
    shortLabel: { en: 'Top', ar: 'أعلى' },
  },
];
