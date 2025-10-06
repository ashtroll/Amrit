import { WaterSample, ComputedIndices } from '../types';
import { METAL_STANDARDS } from './metalStandards';

export const calculateHPI = (sample: WaterSample): number => {
  let weightedSum = 0;
  let totalWeight = 0;
  let validMetalsCount = 0;

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { whoLimit, weight } = standard;

    // Only include metals with valid numeric values
    if (typeof metalValue === 'number' && !isNaN(metalValue) && isFinite(metalValue) && metalValue >= 0) {
      const subIndex = (metalValue / whoLimit) * 100;
      if (!isNaN(subIndex) && isFinite(subIndex)) {
        weightedSum += weight * subIndex;
        totalWeight += weight;
        validMetalsCount++;
      }
    }
  });

  // Return 0 if no valid metals found, otherwise calculate weighted average
  return totalWeight > 0 && validMetalsCount > 0 ? weightedSum / totalWeight : 0;
};

export const calculateHEI = (sample: WaterSample): number => {
  let sumRatio = 0;
  let validMetalsCount = 0;

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { whoLimit } = standard;

    // Only include metals with valid numeric values
    if (typeof metalValue === 'number' && !isNaN(metalValue) && isFinite(metalValue) && metalValue >= 0) {
      const ratio = metalValue / whoLimit;
      if (!isNaN(ratio) && isFinite(ratio)) {
        sumRatio += ratio;
        validMetalsCount++;
      }
    }
  });

  return validMetalsCount > 0 ? sumRatio : 0;
};

export const calculateCd = (sample: WaterSample): number => {
  let sumRatio = 0;
  let validMetalsCount = 0;

  METAL_STANDARDS.forEach(standard => {
    const metalValue = sample[standard.symbol as keyof WaterSample] as number;
    const { bisLimit } = standard;

    // Only include metals with valid numeric values
    if (typeof metalValue === 'number' && !isNaN(metalValue) && isFinite(metalValue) && metalValue >= 0) {
      const ratio = metalValue / bisLimit;
      if (!isNaN(ratio) && isFinite(ratio)) {
        sumRatio += ratio;
        validMetalsCount++;
      }
    }
  });

  return validMetalsCount > 0 ? sumRatio : 0;
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

    // Only check metals with valid numeric values
    if (typeof metalValue === 'number' && !isNaN(metalValue) && isFinite(metalValue) && metalValue >= 0) {
      if (metalValue > whoLimit * 2) {
        critical.push(symbol);
      }
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
    hpi: isNaN(hpi) ? 0 : parseFloat(hpi.toFixed(2)),
    hei: isNaN(hei) ? 0 : parseFloat(hei.toFixed(2)),
    cd: isNaN(cd) ? 0 : parseFloat(cd.toFixed(2)),
    classification,
    criticalMetals,
  };
};

export const validateSample = (sample: Partial<WaterSample>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!sample.sampleId || sample.sampleId.trim() === '') {
    errors.push('Sample ID is required');
  }
  
  // Validate coordinates (more permissive)
  if (typeof sample.latitude !== 'number' || isNaN(sample.latitude)) {
    errors.push('Valid latitude is required');
  } else if (sample.latitude < -90 || sample.latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  }
  
  if (typeof sample.longitude !== 'number' || isNaN(sample.longitude)) {
    errors.push('Valid longitude is required');
  } else if (sample.longitude < -180 || sample.longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  // Validate pH (more permissive)
  if (typeof sample.pH !== 'number' || isNaN(sample.pH)) {
    errors.push('Valid pH is required');
  } else if (sample.pH < 0 || sample.pH > 14) {
    errors.push('pH must be between 0 and 14');
  }

  // Count valid metals - be very explicit
  let validMetalsCount = 0;
  const metalSymbols = ['Fe', 'Mn', 'Zn', 'Cu', 'Cr', 'Cd', 'Pb', 'As', 'Hg', 'Ni'];
  const validMetals: string[] = [];
  
  metalSymbols.forEach(symbol => {
    const value = sample[symbol as keyof WaterSample] as number;
    
    // Very explicit validation
    if (value !== null && 
        value !== undefined && 
        typeof value === 'number' && 
        !isNaN(value) && 
        isFinite(value) && 
        value >= 0) {
      validMetalsCount++;
      validMetals.push(symbol);
    }
  });

  if (validMetalsCount === 0) {
    errors.push(`At least 1 valid metal concentration is required for analysis. Found valid metals: ${validMetals.join(', ') || 'none'}`);
  }

  return { valid: errors.length === 0, errors };
};
