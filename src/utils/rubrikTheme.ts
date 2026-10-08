import { CapaianRubrik } from '../types/akreditasi';

export interface RubrikLevelTheme {
  level: number;
  kategori: CapaianRubrik;
  label: string;
  colorName: string;
  // Card styles
  selectedCard: string;
  unselectedCard: string;
  disabledCard: string;
  // Badge pill inside rubric card
  selectedBadge: string;
  unselectedBadge: string;
  // Header / Summary Pills
  pillBg: string;
  pillText: string;
  pillBorder: string;
  pillFull: string;
  // Solid badge
  solidBadge: string;
  // Accent & Check icon
  accentColor: string;
  accentText: string;
  skorText: string;
  dotColor: string;
  hex: string;
}

export const RUBRIK_THEMES: Record<number, RubrikLevelTheme> = {
  1: {
    level: 1,
    kategori: 'Kurang',
    label: 'Level 1: Kurang',
    colorName: 'Merah (Kurang)',
    selectedCard: 'border-red-500 bg-red-50/70 ring-2 ring-red-500 shadow-sm',
    unselectedCard: 'border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/30',
    disabledCard: 'border-slate-200 bg-slate-50/50 opacity-70 cursor-default',
    selectedBadge: 'bg-red-600 text-white shadow-xs',
    unselectedBadge: 'bg-red-50 text-red-700 border border-red-200',
    pillBg: 'bg-red-50',
    pillText: 'text-red-700',
    pillBorder: 'border-red-200',
    pillFull: 'bg-red-50 text-red-700 border border-red-200',
    solidBadge: 'bg-red-600 text-white',
    accentColor: '#DC2626',
    accentText: 'text-red-600',
    skorText: 'text-red-700',
    dotColor: 'bg-red-500',
    hex: '#EF4444',
  },
  2: {
    level: 2,
    kategori: 'Cukup Baik',
    label: 'Level 2: Cukup Baik',
    colorName: 'Oranye / Kuning (Cukup)',
    selectedCard: 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500 shadow-sm',
    unselectedCard: 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30',
    disabledCard: 'border-slate-200 bg-slate-50/50 opacity-70 cursor-default',
    selectedBadge: 'bg-amber-500 text-white shadow-xs',
    unselectedBadge: 'bg-amber-50 text-amber-800 border border-amber-200',
    pillBg: 'bg-amber-50',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200',
    pillFull: 'bg-amber-50 text-amber-800 border border-amber-200',
    solidBadge: 'bg-amber-500 text-white',
    accentColor: '#D97706',
    accentText: 'text-amber-600',
    skorText: 'text-amber-700',
    dotColor: 'bg-amber-500',
    hex: '#F59E0B',
  },
  3: {
    level: 3,
    kategori: 'Baik',
    label: 'Level 3: Baik',
    colorName: 'Biru (Baik)',
    selectedCard: 'border-[#0084FF] bg-blue-50/70 ring-2 ring-[#0084FF] shadow-sm',
    unselectedCard: 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30',
    disabledCard: 'border-slate-200 bg-slate-50/50 opacity-70 cursor-default',
    selectedBadge: 'bg-[#0084FF] text-white shadow-xs',
    unselectedBadge: 'bg-blue-50 text-blue-700 border border-blue-200',
    pillBg: 'bg-blue-50',
    pillText: 'text-blue-700',
    pillBorder: 'border-blue-200',
    pillFull: 'bg-blue-50 text-blue-700 border border-blue-200',
    solidBadge: 'bg-[#0084FF] text-white',
    accentColor: '#0084FF',
    accentText: 'text-[#0084FF]',
    skorText: 'text-blue-700',
    dotColor: 'bg-[#0084FF]',
    hex: '#0084FF',
  },
  4: {
    level: 4,
    kategori: 'Sangat Baik',
    label: 'Level 4: Sangat Baik',
    colorName: 'Hijau (Sangat Baik)',
    selectedCard: 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600 shadow-sm',
    unselectedCard: 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30',
    disabledCard: 'border-slate-200 bg-slate-50/50 opacity-70 cursor-default',
    selectedBadge: 'bg-emerald-600 text-white shadow-xs',
    unselectedBadge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    pillBg: 'bg-emerald-50',
    pillText: 'text-emerald-700',
    pillBorder: 'border-emerald-200',
    pillFull: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    solidBadge: 'bg-emerald-600 text-white',
    accentColor: '#059669',
    accentText: 'text-emerald-600',
    skorText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    hex: '#10B981',
  },
};

export const getRubrikThemeByLevel = (level?: number): RubrikLevelTheme => {
  if (!level || level < 1 || level > 4) {
    return RUBRIK_THEMES[4]; // Default fallback Level 4
  }
  return RUBRIK_THEMES[level];
};

export const getRubrikThemeByKategori = (kategori?: string): RubrikLevelTheme => {
  if (!kategori) return RUBRIK_THEMES[4];
  const normalized = kategori.trim().toLowerCase();
  if (normalized.includes('sangat baik')) return RUBRIK_THEMES[4];
  if (normalized.includes('cukup')) return RUBRIK_THEMES[2];
  if (normalized.includes('baik')) return RUBRIK_THEMES[3];
  if (normalized.includes('kurang')) return RUBRIK_THEMES[1];
  return RUBRIK_THEMES[4];
};

export const getLevelFromKategori = (kategori?: string): number => {
  if (!kategori) return 4;
  const theme = getRubrikThemeByKategori(kategori);
  return theme.level;
};
