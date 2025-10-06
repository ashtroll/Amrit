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
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: 'admin' | 'researcher' | 'public';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  loading: boolean;
}
