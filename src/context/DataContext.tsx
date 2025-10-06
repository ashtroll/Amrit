import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WaterSample, ComputedIndices, DashboardStats } from '../types';
import { computeAllIndices } from '../utils/computationEngine';

interface DataContextType {
  samples: WaterSample[];
  computedIndices: ComputedIndices[];
  stats: DashboardStats;
  addSamples: (newSamples: WaterSample[]) => void;
  clearSamples: () => void;
  removeSample: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [samples, setSamples] = useState<WaterSample[]>([]);
  const [computedIndices, setComputedIndices] = useState<ComputedIndices[]>([]);

  const calculateStats = (samples: WaterSample[], indices: ComputedIndices[]): DashboardStats => {
    if (samples.length === 0) {
      return {
        totalSamples: 0,
        averageHPI: 0,
        averageHEI: 0,
        safeSamples: 0,
        moderateRiskSamples: 0,
        highRiskSamples: 0,
        criticalSamples: 0,
        mostContaminatedMetal: 'None',
      };
    }

    // Filter out any NaN values before calculating averages (allow 0 values)
    const validHPIs = indices.filter(idx => typeof idx.hpi === 'number' && !isNaN(idx.hpi) && isFinite(idx.hpi)).map(idx => idx.hpi);
    const validHEIs = indices.filter(idx => typeof idx.hei === 'number' && !isNaN(idx.hei) && isFinite(idx.hei)).map(idx => idx.hei);
    
    const avgHPI = validHPIs.length > 0 ? validHPIs.reduce((sum, hpi) => sum + hpi, 0) / validHPIs.length : 0;
    const avgHEI = validHEIs.length > 0 ? validHEIs.reduce((sum, hei) => sum + hei, 0) / validHEIs.length : 0;

    const classifications = indices.reduce(
      (acc, idx) => {
        acc[idx.classification]++;
        return acc;
      },
      { Safe: 0, 'Moderate Risk': 0, 'High Risk': 0, Critical: 0 }
    );

    const metalExceedances: Record<string, number> = {};
    samples.forEach((sample) => {
      ['Fe', 'Mn', 'Zn', 'Cu', 'Cr', 'Cd', 'Pb', 'As', 'Hg', 'Ni'].forEach((metal) => {
        const value = sample[metal as keyof WaterSample] as number;
        // Only count metals with valid, positive values
        if (!isNaN(value) && isFinite(value) && value > 0) {
          metalExceedances[metal] = (metalExceedances[metal] || 0) + value;
        }
      });
    });

    const mostContaminatedMetal = Object.keys(metalExceedances).length > 0 
      ? Object.keys(metalExceedances).reduce((a, b) =>
          metalExceedances[a] > metalExceedances[b] ? a : b
        )
      : 'None';

    return {
      totalSamples: samples.length,
      averageHPI: parseFloat(avgHPI.toFixed(2)),
      averageHEI: parseFloat(avgHEI.toFixed(2)),
      safeSamples: classifications.Safe,
      moderateRiskSamples: classifications['Moderate Risk'],
      highRiskSamples: classifications['High Risk'],
      criticalSamples: classifications.Critical,
      mostContaminatedMetal,
    };
  };

  const addSamples = (newSamples: WaterSample[]) => {
    const updatedSamples = [...samples, ...newSamples];
    const indices = updatedSamples.map(computeAllIndices);
    setSamples(updatedSamples);
    setComputedIndices(indices);
  };

  const clearSamples = () => {
    setSamples([]);
    setComputedIndices([]);
  };

  const removeSample = (id: string) => {
    const updatedSamples = samples.filter((s) => s.id !== id);
    const indices = updatedSamples.map(computeAllIndices);
    setSamples(updatedSamples);
    setComputedIndices(indices);
  };

  const stats = calculateStats(samples, computedIndices);

  return (
    <DataContext.Provider value={{ samples, computedIndices, stats, addSamples, clearSamples, removeSample }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
