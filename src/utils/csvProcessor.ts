import Papa from 'papaparse';
import { WaterSample } from '../types';
import { validateSample } from './computationEngine';

export const generateCSVTemplate = (): string => {
  const headers = [
    'Sample_ID',
    'Latitude',
    'Longitude',
    'pH',
    'Fe',
    'Mn',
    'Zn',
    'Cu',
    'Cr',
    'Cd',
    'Pb',
    'As',
    'Hg',
    'Ni',
    'Collection_Date',
    'Location'
  ];

  const exampleRow = [
    'SAMPLE001',
    '28.6139',
    '77.2090',
    '7.2',
    '0.25',
    '0.08',
    '2.5',
    '0.04',
    '0.03',
    '0.002',
    '0.008',
    '0.009',
    '0.004',
    '0.05',
    '2025-10-05',
    'New Delhi'
  ];

  return headers.join(',') + '\n' + exampleRow.join(',');
};

export const downloadCSVTemplate = (): void => {
  const template = generateCSVTemplate();
  const blob = new Blob([template], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'water_sample_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const parseCSVFile = (file: File): Promise<{ samples: WaterSample[]; errors: string[] }> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const samples: WaterSample[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          // Helper function to safely parse numbers
          const parseNumber = (value: any): number => {
            if (value === null || value === undefined) return NaN;
            if (typeof value === 'number') return value;
            
            const strValue = String(value).trim();
            if (strValue === '' || strValue === 'null' || strValue === 'undefined') return NaN;
            
            const num = Number(strValue);
            return isNaN(num) ? NaN : num;
          };



          const sample: Partial<WaterSample> = {
            id: crypto.randomUUID(),
            sampleId: row.Sample_ID || row.sample_id || row.SampleID || '',
            latitude: parseNumber(row.Latitude || row.latitude),
            longitude: parseNumber(row.Longitude || row.longitude),
            pH: parseNumber(row.pH || row.ph),
            Fe: parseNumber(row.Fe || row.fe || row.Iron || row.iron_mg_per_l),
            Mn: parseNumber(row.Mn || row.mn || row.Manganese || row.manganese_mg_per_l),
            Zn: parseNumber(row.Zn || row.zn || row.Zinc || row.zinc_mg_per_l),
            Cu: parseNumber(row.Cu || row.cu || row.Copper || row.copper_mg_per_l),
            Cr: parseNumber(row.Cr || row.cr || row.Chromium || row.chromium_mg_per_l),
            Cd: parseNumber(row.Cd || row.cd || row.Cadmium || row.cadmium_mg_per_l),
            Pb: parseNumber(row.Pb || row.pb || row.Lead || row.lead_mg_per_l),
            As: parseNumber(row.As || row.as || row.Arsenic || row.arsenic_mg_per_l),
            Hg: parseNumber(row.Hg || row.hg || row.Mercury || row.mercury_mg_per_l),
            Ni: parseNumber(row.Ni || row.ni || row.Nickel || row.nickel_mg_per_l),
            collectionDate: row.Collection_Date || row.collection_date || row.Date || '',
            location:
              row.Location ||
              row.location ||
              ((row.region_name || row.Region_Name || row.region || '') && (row.land_use_type || row.Land_Use_Type || row.landuse || '')
                ? `${row.region_name || row.Region_Name || row.region || ''}${(row.region_name || row.Region_Name || row.region || '') && (row.land_use_type || row.Land_Use_Type || row.landuse || '') ? ', ' : ''}${row.land_use_type || row.Land_Use_Type || row.landuse || ''}`.trim()
                : (row.region_name || row.Region_Name || row.region || row.land_use_type || row.Land_Use_Type || row.landuse || '')),
          };



          const validation = validateSample(sample);
          
          if (validation.valid) {
            samples.push(sample as WaterSample);
          } else {
            errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
          }
        });

        resolve({ samples, errors });
      },
      error: (error) => {
        resolve({ samples: [], errors: [error.message] });
      },
    });
  });
};

export const exportSamplesToCSV = (samples: WaterSample[], computedIndices: any[]): void => {
  const data = samples.map((sample, index) => {
    const indices = computedIndices[index];
    return {
      Sample_ID: sample.sampleId,
      Location: sample.location || '',
      Latitude: sample.latitude,
      Longitude: sample.longitude,
      pH: sample.pH,
      Fe: sample.Fe,
      Mn: sample.Mn,
      Zn: sample.Zn,
      Cu: sample.Cu,
      Cr: sample.Cr,
      Cd: sample.Cd,
      Pb: sample.Pb,
      As: sample.As,
      Hg: sample.Hg,
      Ni: sample.Ni,
      HPI: indices?.hpi || 0,
      HEI: indices?.hei || 0,
      Cd_Index: indices?.cd || 0,
      Classification: indices?.classification || 'Unknown',
      Critical_Metals: indices?.criticalMetals?.join(';') || 'None',
      Collection_Date: sample.collectionDate || '',
    };
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `water_analysis_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
