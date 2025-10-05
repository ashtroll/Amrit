export interface WaterSample {
  id: string;
  sampleId: string;
  latitude: number;
  longitude: number;
  pH: number;
  Fe: number;
  Mn: number;
  Zn: number;
  Cu: number;
  Cr: number;
  Cd: number;
  Pb: number;
  As: number;
  Hg: number;
  Ni: number;
  collectionDate?: string;
  location?: string;
}

export interface MetalStandard {
  metal: string;
  symbol: string;
  whoLimit: number;
  bisLimit: number;
  weight: number;
  unit: string;
}

export interface ComputedIndices {
  sampleId: string;
  hpi: number;
  hei: number;
  cd: number;
  classification: 'Safe' | 'Moderate Risk' | 'High Risk' | 'Critical';
  criticalMetals: string[];
}

export interface DashboardStats {
  totalSamples: number;
  averageHPI: number;
  averageHEI: number;
  safeSamples: number;
  moderateRiskSamples: number;
  highRiskSamples: number;
  criticalSamples: number;
  mostContaminatedMetal: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'researcher' | 'public';
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
