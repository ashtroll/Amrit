import { MetalStandard } from '../types';

export const METAL_STANDARDS: MetalStandard[] = [
  { metal: 'Iron', symbol: 'Fe', whoLimit: 0.3, bisLimit: 0.3, weight: 3, unit: 'mg/L' },
  { metal: 'Manganese', symbol: 'Mn', whoLimit: 0.1, bisLimit: 0.3, weight: 4, unit: 'mg/L' },
  { metal: 'Zinc', symbol: 'Zn', whoLimit: 3.0, bisLimit: 5.0, weight: 2, unit: 'mg/L' },
  { metal: 'Copper', symbol: 'Cu', whoLimit: 2.0, bisLimit: 0.05, weight: 3, unit: 'mg/L' },
  { metal: 'Chromium', symbol: 'Cr', whoLimit: 0.05, bisLimit: 0.05, weight: 5, unit: 'mg/L' },
  { metal: 'Cadmium', symbol: 'Cd', whoLimit: 0.003, bisLimit: 0.003, weight: 5, unit: 'mg/L' },
  { metal: 'Lead', symbol: 'Pb', whoLimit: 0.01, bisLimit: 0.01, weight: 5, unit: 'mg/L' },
  { metal: 'Arsenic', symbol: 'As', whoLimit: 0.01, bisLimit: 0.01, weight: 5, unit: 'mg/L' },
  { metal: 'Mercury', symbol: 'Hg', whoLimit: 0.006, bisLimit: 0.001, weight: 5, unit: 'mg/L' },
  { metal: 'Nickel', symbol: 'Ni', whoLimit: 0.07, bisLimit: 0.02, weight: 4, unit: 'mg/L' },
];

export const getStandardForMetal = (symbol: string): MetalStandard | undefined => {
  return METAL_STANDARDS.find(std => std.symbol === symbol);
};

export const getAllMetalSymbols = (): string[] => {
  return METAL_STANDARDS.map(std => std.symbol);
};
