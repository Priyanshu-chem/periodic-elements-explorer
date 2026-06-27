import { ElementCategory } from '@/types';

export interface CategoryInfo {
  id: ElementCategory;
  label: string;
  color: string;
  darkColor: string;
  textColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'alkali-metal',
    label: 'Alkali Metal',
    color: '#ff6b6b',
    darkColor: '#cc4444',
    textColor: '#ffffff',
  },
  {
    id: 'alkaline-earth-metal',
    label: 'Alkaline Earth Metal',
    color: '#ffa07a',
    darkColor: '#cc7a5a',
    textColor: '#1a1a2e',
  },
  {
    id: 'transition-metal',
    label: 'Transition Metal',
    color: '#ffd700',
    darkColor: '#cca800',
    textColor: '#1a1a2e',
  },
  {
    id: 'post-transition-metal',
    label: 'Post-Transition Metal',
    color: '#98fb98',
    darkColor: '#6bc46b',
    textColor: '#1a1a2e',
  },
  {
    id: 'metalloid',
    label: 'Metalloid',
    color: '#87ceeb',
    darkColor: '#5a9fbf',
    textColor: '#1a1a2e',
  },
  {
    id: 'nonmetal',
    label: 'Nonmetal',
    color: '#90ee90',
    darkColor: '#5ab85a',
    textColor: '#1a1a2e',
  },
  {
    id: 'halogen',
    label: 'Halogen',
    color: '#66cdaa',
    darkColor: '#3a9a7a',
    textColor: '#1a1a2e',
  },
  {
    id: 'noble-gas',
    label: 'Noble Gas',
    color: '#b39ddb',
    darkColor: '#8a6fba',
    textColor: '#1a1a2e',
  },
  {
    id: 'lanthanide',
    label: 'Lanthanide',
    color: '#ffb6c1',
    darkColor: '#cc8a94',
    textColor: '#1a1a2e',
  },
  {
    id: 'actinide',
    label: 'Actinide',
    color: '#e6a8d7',
    darkColor: '#b87aa9',
    textColor: '#1a1a2e',
  },
  {
    id: 'unknown',
    label: 'Unknown',
    color: '#cccccc',
    darkColor: '#999999',
    textColor: '#1a1a2e',
  },
];

export function getCategoryInfo(category: ElementCategory): CategoryInfo {
  return CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[10];
}

export const TREND_COLORS: Record<string, string> = {
  atomicRadius: '#4ecdc4',
  electronegativity: '#ff6b6b',
  ionizationEnergy: '#45b7d1',
  density: '#f9ca24',
  meltingPoint: '#e056a0',
};
