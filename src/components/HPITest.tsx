import React from 'react';
import { computeAllIndices } from '../utils/computationEngine';
import { WaterSample } from '../types';

const HPITest: React.FC = () => {
  // Create a test sample based on SAMPLE001 from demo data
  const testSample: WaterSample = {
    id: 'test1',
    sampleId: 'TEST001',
    latitude: 28.6139,
    longitude: 77.2090,
    pH: 7.2,
    Fe: 0.25,
    Mn: 0.08,
    Zn: 2.5,
    Cu: 0.04,
    Cr: 0.03,
    Cd: 0.002,
    Pb: 0.008,
    As: 0.009,
    Hg: 0.004,
    Ni: 0.05,
    collectionDate: '2025-10-05',
    location: 'Test Location'
  };

  const runTest = () => {
    console.log('=== Direct HPI Test ===');
    console.log('Test sample:', testSample);
    
    const indices = computeAllIndices(testSample);
    console.log('Computed indices:', indices);
    
    // Manual calculation check
    const expectedHPI = 69.39; // From manual calculation
    console.log(`Expected HPI: ~${expectedHPI}`);
    console.log(`Actual HPI: ${indices.hpi}`);
    console.log(`Difference: ${Math.abs(indices.hpi - expectedHPI)}`);
    
    if (indices.hpi === 0) {
      console.error('ERROR: HPI is 0 when it should be ~69.39!');
    } else if (Math.abs(indices.hpi - expectedHPI) < 5) {
      console.log('SUCCESS: HPI calculation is working correctly!');
    } else {
      console.warn('WARNING: HPI value differs significantly from expected');
    }
  };

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">HPI Test Component</h3>
      <button 
        onClick={runTest}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Run HPI Test
      </button>
      <p className="text-sm text-yellow-700 mt-2">
        Check browser console for test results
      </p>
    </div>
  );
};

export default HPITest;