import { WaterSample, ComputedIndices } from '../types';
import { METAL_STANDARDS, getStandardForMetal } from './metalStandards';

export const calculateHPI = (sample: WaterSample): number => {
  let weightedSum = 0;
  let totalWeight = 0;

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { whoLimit, weight } = standard;

    const subIndex = (metalValue / whoLimit) * 100;
    weightedSum += weight * subIndex;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

export const calculateHEI = (sample: WaterSample): number => {
  let sumRatio = 0;

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { whoLimit } = standard;

    sumRatio += metalValue / whoLimit;
  });

  return sumRatio;
};

export const calculateCd = (sample: WaterSample): number => {
  let sumRatio = 0;

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { bisLimit } = standard;

    sumRatio += metalValue / bisLimit;
  });

  return sumRatio;
};

export const classifyWaterQuality = (hpi: number, hei: number, cd: number): ComputedIndices['classification'] => {
  if (hpi > 150 || hei > 40 || cd > 3) return 'Critical';
  if (hpi > 100 || hei > 20 || cd > 2) return 'High Risk';
  if (hpi > 50 || hei > 10 || cd > 1) return 'Moderate Risk';
  return 'Safe';
};

export const identifyCriticalMetals = (sample: WaterSample): string[] => {
  const critical: string[] = [];

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { whoLimit, symbol } = standard;

    if (metalValue > whoLimit * 2) {
      critical.push(symbol);
    }
  });

  return critical;
};

export const computeAllIndices = (sample: WaterSample): ComputedIndices => {
  const hpi = calculateHPI(sample);
  const hei = calculateHEI(sample);
  const cd = calculateCd(sample);
  const classification = classifyWaterQuality(hpi, hei, cd);
  const criticalMetals = identifyCriticalMetals(sample);

  return {
    sampleId: sample.sampleId,
    hpi: parseFloat(hpi.toFixed(2)),
    hei: parseFloat(hei.toFixed(2)),
    cd: parseFloat(cd.toFixed(2)),
    classification,
    criticalMetals,
  };
};

export const validateSample = (sample: Partial<WaterSample>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!sample.sampleId) errors.push('Sample ID is required');
  if (sample.latitude === undefined || sample.latitude < -90 || sample.latitude > 90) {
    errors.push('Valid latitude (-90 to 90) is required');
  }
  if (sample.longitude === undefined || sample.longitude < -180 || sample.longitude > 180) {
    errors.push('Valid longitude (-180 to 180) is required');
  }
  if (sample.pH === undefined || sample.pH < 0 || sample.pH > 14) {
    errors.push('Valid pH (0 to 14) is required');
  }

  METAL_STANDARDS.forEach(standard => {
    const value = sample[standard.symbol as keyof WaterSample];
    if (value === undefined || value === null || (value as number) < 0) {
      errors.push(`Valid ${standard.metal} concentration (>= 0) is required`);
    }
  });

  return { valid: errors.length === 0, errors };
};
