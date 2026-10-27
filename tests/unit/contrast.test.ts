import { describe, expect, it } from 'vitest';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RgbColor {
  const cleanHex = hex.replace('#', '').trim();
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex;
  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function relativeLuminance({ r, g, b }: RgbColor): number {
  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const DESIGN_TOKENS = {
  colors: {
    cream: '#F8F8FA',
    creamSubtle: '#FCF8F8',
    white: '#FFFFFF',
    ink: '#121314',
    inkSurface: '#17181A',
    inkMuted: '#6A6D72',
    inkOnDarkMuted: '#A0A2A6',
    inkOnDarkSubtle: '#8E9094',
    tomato: '#D2232A',
    tomatoDark: '#B51D23',
    tomatoOnDark: '#F03E45',
    galanaBlue: '#1A5FB4',
    borderUi: '#6A6D72',
    focusRing: '#D2232A',
  },
} as const;

export const TEXT_PAIRS: Array<{
  name: string;
  fg: string;
  bg: string;
  minRatio: number;
}> = [
  {
    name: 'ink on cream (#F8F8FA)',
    fg: DESIGN_TOKENS.colors.ink,
    bg: DESIGN_TOKENS.colors.cream,
    minRatio: 4.5,
  },
  {
    name: 'ink-muted on cream (#F8F8FA)',
    fg: DESIGN_TOKENS.colors.inkMuted,
    bg: DESIGN_TOKENS.colors.cream,
    minRatio: 4.5,
  },
  {
    name: 'tomato on cream (#F8F8FA)',
    fg: DESIGN_TOKENS.colors.tomato,
    bg: DESIGN_TOKENS.colors.cream,
    minRatio: 4.5,
  },
  {
    name: 'ink on cream-subtle (#FCF8F8)',
    fg: DESIGN_TOKENS.colors.ink,
    bg: DESIGN_TOKENS.colors.creamSubtle,
    minRatio: 4.5,
  },
  {
    name: 'ink-muted on cream-subtle (#FCF8F8)',
    fg: DESIGN_TOKENS.colors.inkMuted,
    bg: DESIGN_TOKENS.colors.creamSubtle,
    minRatio: 4.5,
  },
  {
    name: 'ink on white (cards)',
    fg: DESIGN_TOKENS.colors.ink,
    bg: DESIGN_TOKENS.colors.white,
    minRatio: 4.5,
  },
  {
    name: 'ink-muted on white',
    fg: DESIGN_TOKENS.colors.inkMuted,
    bg: DESIGN_TOKENS.colors.white,
    minRatio: 4.5,
  },
  {
    name: 'tomato on white',
    fg: DESIGN_TOKENS.colors.tomato,
    bg: DESIGN_TOKENS.colors.white,
    minRatio: 4.5,
  },
  {
    name: 'galana-blue on white',
    fg: DESIGN_TOKENS.colors.galanaBlue,
    bg: DESIGN_TOKENS.colors.white,
    minRatio: 4.5,
  },
  {
    name: 'white on tomato (CTA button)',
    fg: DESIGN_TOKENS.colors.white,
    bg: DESIGN_TOKENS.colors.tomato,
    minRatio: 4.5,
  },
  {
    name: 'white on tomato-dark (CTA hover)',
    fg: DESIGN_TOKENS.colors.white,
    bg: DESIGN_TOKENS.colors.tomatoDark,
    minRatio: 4.5,
  },
  {
    name: 'cream on ink (dark section)',
    fg: DESIGN_TOKENS.colors.cream,
    bg: DESIGN_TOKENS.colors.ink,
    minRatio: 4.5,
  },
  {
    name: 'ink-on-dark-muted (#A0A2A6) on ink (#121314)',
    fg: DESIGN_TOKENS.colors.inkOnDarkMuted,
    bg: DESIGN_TOKENS.colors.ink,
    minRatio: 4.5,
  },
  {
    name: 'ink-on-dark-subtle (#8E9094) on ink (#121314)',
    fg: DESIGN_TOKENS.colors.inkOnDarkSubtle,
    bg: DESIGN_TOKENS.colors.ink,
    minRatio: 4.5,
  },
  {
    name: 'tomato-on-dark (#F03E45) on ink (#121314)',
    fg: DESIGN_TOKENS.colors.tomatoOnDark,
    bg: DESIGN_TOKENS.colors.ink,
    minRatio: 4.5,
  },
];

export const UI_PAIRS: Array<{
  name: string;
  fg: string;
  bg: string;
  minRatio: number;
}> = [
  {
    name: 'focus-ring on cream',
    fg: DESIGN_TOKENS.colors.focusRing,
    bg: DESIGN_TOKENS.colors.cream,
    minRatio: 3.0,
  },
  {
    name: 'focus-ring on white',
    fg: DESIGN_TOKENS.colors.focusRing,
    bg: DESIGN_TOKENS.colors.white,
    minRatio: 3.0,
  },
  {
    name: 'border-ui on cream',
    fg: DESIGN_TOKENS.colors.borderUi,
    bg: DESIGN_TOKENS.colors.cream,
    minRatio: 3.0,
  },
  {
    name: 'border-ui on white',
    fg: DESIGN_TOKENS.colors.borderUi,
    bg: DESIGN_TOKENS.colors.white,
    minRatio: 3.0,
  },
];

describe('Design tokens contrast', () => {
  for (const pair of TEXT_PAIRS) {
    it(`guarantees text contrast >= ${pair.minRatio}:1 for ${pair.name}`, () => {
      const ratio = contrastRatio(pair.fg, pair.bg);
      expect(ratio).toBeGreaterThanOrEqual(pair.minRatio);
    });
  }

  for (const pair of UI_PAIRS) {
    it(`guarantees UI/focus contrast >= ${pair.minRatio}:1 for ${pair.name}`, () => {
      const ratio = contrastRatio(pair.fg, pair.bg);
      expect(ratio).toBeGreaterThanOrEqual(pair.minRatio);
    });
  }
});
