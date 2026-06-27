export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementPhase = 'gas' | 'liquid' | 'solid' | 'unknown';

export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface ElementIsotope {
  massNumber: number;
  mass: number;
  abundance: number;
  halfLife?: string;
  decayMode?: string;
  isRadioactive: boolean;
}

export interface ElementCrystalStructure {
  type: string;
  parameters?: {
    a?: number;
    b?: number;
    c?: number;
    alpha?: number;
    beta?: number;
    gamma?: number;
  };
  spaceGroup?: string;
  coordinationNumber?: number;
}

export interface ElementProperties {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicWeight: number;
  atomicMass: string;
  group: number | null;
  period: number;
  block: ElementBlock;
  category: ElementCategory;
  categoryName: string;
  electronConfiguration: string;
  electronConfigurationSemantic: string;
  valenceElectrons: number;
  oxidationStates: string[];
  commonOxidationStates: string[];
  electronegativity?: number;
  electronAffinity?: number;
  ionizationEnergy?: number;
  atomicRadius?: number;
  covalentRadius?: number;
  ionicRadius?: number;
  vanDerWaalsRadius?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  phase: ElementPhase;
  thermalConductivity?: number;
  electricalConductivity?: number;
  heatCapacity?: number;
  crystalStructure?: ElementCrystalStructure;
  magneticProperties?: string;
  bandStructure?: string;
  youngModulus?: number;
  bulkModulus?: number;
  hardness?: number;
  isotopes: ElementIsotope[];
  stableIsotopes: number;
  radioactiveIsotopes: number;
  discoverer?: string;
  yearDiscovered?: number;
  nameOrigin?: string;
  commonCompounds?: string[];
  industrialApplications?: string[];
  biologicalImportance?: string;
  hazards?: string;
  safetyInformation?: string;
  abundanceCrust?: number;
  abundanceUniverse?: number;
  naturalOccurrence?: string;
  facts: string[];
  imageUrl?: string;
  electronShellImage?: string;
  emissionSpectrum?: string;
  bohrModelImage?: string;
  shellModel?: number[];
}

export interface ComparisonProperty {
  label: string;
  key: string;
  getValue: (el: ElementProperties) => string | number | undefined;
}

export type TrendType = 'atomicRadius' | 'electronegativity' | 'ionizationEnergy' | 'density' | 'meltingPoint';

export interface TrendConfig {
  type: TrendType;
  label: string;
  unit: string;
  getValue: (el: ElementProperties) => number | undefined;
  color: string;
}
