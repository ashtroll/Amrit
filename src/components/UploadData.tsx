import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X, Plus, Save, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { parseCSVFile, downloadCSVTemplate } from '../utils/csvProcessor';
import { validateSample } from '../utils/computationEngine';
import { WaterSample } from '../types';

const UploadData: React.FC = () => {
  const { addSamples } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
    errors: string[];
  } | null>(null);

  // Manual entry state
  const [manual, setManual] = useState<{ [k: string]: string | undefined }>(
    {
      sampleId: '',
      latitude: '',
      longitude: '',
      pH: '',
      Fe: '', Mn: '', Zn: '', Cu: '', Cr: '', Cd: '', Pb: '', As: '', Hg: '', Ni: '',
      collectionDate: '',
      location: '',
    }
  );
  const [manualErrors, setManualErrors] = useState<string[]>([]);
  const [staged, setStaged] = useState<WaterSample[]>([]);
  const [manualStatus, setManualStatus] = useState<{ success: boolean; message: string } | null>(null);

  const parseNumber = (s?: string): number => {
    if (s === undefined) return NaN;
    const v = String(s).trim();
    if (v === '') return NaN;
    const n = Number(v);
    return isNaN(n) ? NaN : n;
  };

  const makeSampleFromManual = (): Partial<WaterSample> => {
    return {
      id: crypto.randomUUID(),
      sampleId: (manual.sampleId || '').trim() || `MANUAL-${Date.now()}`,
      latitude: parseNumber(manual.latitude as string),
      longitude: parseNumber(manual.longitude as string),
      pH: parseNumber(manual.pH as string),
      Fe: parseNumber(manual.Fe as string),
      Mn: parseNumber(manual.Mn as string),
      Zn: parseNumber(manual.Zn as string),
      Cu: parseNumber(manual.Cu as string),
      Cr: parseNumber(manual.Cr as string),
      Cd: parseNumber(manual.Cd as string),
      Pb: parseNumber(manual.Pb as string),
      As: parseNumber(manual.As as string),
      Hg: parseNumber(manual.Hg as string),
      Ni: parseNumber(manual.Ni as string),
      collectionDate: manual.collectionDate as string,
      location: manual.location as string,
    };
  };

  const handleManualAddToList = () => {
    setManualStatus(null);
    const candidate = makeSampleFromManual();
    const validation = validateSample(candidate);
    if (!validation.valid) {
      setManualErrors(validation.errors);
      return;
    }
    setManualErrors([]);
    setStaged((prev) => [...prev, candidate as WaterSample]);
    // Keep sampleId but clear numeric fields for faster consecutive entries
    setManual((m) => ({
      ...m,
      latitude: '', longitude: '', pH: '',
      Fe: '', Mn: '', Zn: '', Cu: '', Cr: '', Cd: '', Pb: '', As: '', Hg: '', Ni: '',
      collectionDate: '', location: '',
    }));
    setManualStatus({ success: true, message: 'Sample added to list (not yet saved).' });
  };

  const handleManualSaveNow = () => {
    setManualStatus(null);
    const candidate = makeSampleFromManual();
    const validation = validateSample(candidate);
    if (!validation.valid) {
      setManualErrors(validation.errors);
      return;
    }
    setManualErrors([]);
    addSamples([candidate as WaterSample]);
    setManualStatus({ success: true, message: 'Sample saved.' });
    // Reset form after save
    setManual({ sampleId: '', latitude: '', longitude: '', pH: '', Fe: '', Mn: '', Zn: '', Cu: '', Cr: '', Cd: '', Pb: '', As: '', Hg: '', Ni: '', collectionDate: '', location: '' });
  };

  const handleManualSaveAll = () => {
    if (staged.length === 0) return;
    addSamples(staged);
    setStaged([]);
    setManualStatus({ success: true, message: 'All staged samples saved.' });
  };

  const removeStaged = (id: string) => {
    setStaged((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        success: false,
        message: 'Please upload a CSV file',
        errors: [],
      });
      return;
    }

    setIsProcessing(true);
    setUploadStatus(null);

    try {
      const { samples, errors } = await parseCSVFile(file);

      if (samples.length === 0) {
        setUploadStatus({
          success: false,
          message: 'No valid samples found in the file',
          errors,
        });
      } else {
        addSamples(samples);
        setUploadStatus({
          success: true,
          message: `Successfully uploaded ${samples.length} sample${samples.length > 1 ? 's' : ''}`,
          errors,
        });
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Error processing file',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Upload Water Sample Data</h2>
          <button
            onClick={downloadCSVTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Download Template
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Processing file...</p>
            </div>
          ) : (
            <>
              <Upload size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-700 mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-colors">
                  Browse Files
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported format: CSV (Max 10MB)
              </p>
            </>
          )}
        </div>

        {uploadStatus && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              uploadStatus.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {uploadStatus.success ? (
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    uploadStatus.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {uploadStatus.message}
                </p>
                {uploadStatus.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 font-medium mb-1">
                      Issues found ({uploadStatus.errors.length}):
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 max-h-40 overflow-y-auto">
                      {uploadStatus.errors.slice(0, 10).map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <X size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </li>
                      ))}
                      {uploadStatus.errors.length > 10 && (
                        <li className="text-gray-500 italic">
                          ... and {uploadStatus.errors.length - 10} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Entry Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Manual Data Entry</h2>
          <div className="flex gap-2">
            <button onClick={handleManualAddToList} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              <Plus size={18} /> Add to List
            </button>
            <button onClick={handleManualSaveNow} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Save size={18} /> Save Now
            </button>
          </div>
        </div>

        {manualStatus && (
          <div className={`mb-4 p-3 rounded ${manualStatus.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {manualStatus.message}
          </div>
        )}

        {manualErrors.length > 0 && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">
            <p className="font-medium mb-1">Please fix the following:</p>
            <ul className="list-disc pl-5 text-sm">
              {manualErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sample ID</label>
            <input value={manual.sampleId || ''} onChange={(e) => setManual({ ...manual, sampleId: e.target.value })} placeholder="e.g., S001" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
            <input type="date" value={manual.collectionDate || ''} onChange={(e) => setManual({ ...manual, collectionDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="number" step="any" value={manual.latitude || ''} onChange={(e) => setManual({ ...manual, latitude: e.target.value })} placeholder="e.g., 26.91" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="any" value={manual.longitude || ''} onChange={(e) => setManual({ ...manual, longitude: e.target.value })} placeholder="e.g., 75.78" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
            <input value={manual.location || ''} onChange={(e) => setManual({ ...manual, location: e.target.value })} placeholder="e.g., Jaipur" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">pH</label>
            <input type="number" step="any" value={manual.pH || ''} onChange={(e) => setManual({ ...manual, pH: e.target.value })} placeholder="0 - 14" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Metals (mg/L)</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['Fe','Mn','Zn','Cu','Cr','Cd','Pb','As','Hg','Ni'].map((m) => (
              <div key={m}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{m}</label>
                <input type="number" step="any" value={(manual as any)[m] || ''} onChange={(e) => setManual({ ...manual, [m]: e.target.value })} placeholder="0.0" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm" />
              </div>
            ))}
          </div>
        </div>

        {staged.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">Staged Samples ({staged.length})</h4>
              <button onClick={handleManualSaveAll} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                <Save size={16} /> Save All
              </button>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Sample ID</th>
                    <th className="px-3 py-2 text-left">Location</th>
                    <th className="px-3 py-2 text-left">Lat</th>
                    <th className="px-3 py-2 text-left">Lng</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staged.map((s) => (
                    <tr key={s.id}>
                      <td className="px-3 py-2 font-medium text-gray-900">{s.sampleId}</td>
                      <td className="px-3 py-2 text-gray-700">{s.location || 'N/A'}</td>
                      <td className="px-3 py-2 text-gray-700">{s.latitude}</td>
                      <td className="px-3 py-2 text-gray-700">{s.longitude}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => removeStaged(s.id)} className="inline-flex items-center gap-1 px-2 py-1 text-red-700 hover:text-red-800">
                          <Trash2 size={16} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={24} className="text-blue-600" />
          CSV File Requirements
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>
              <strong>Required columns:</strong> Sample_ID, Latitude, Longitude, pH, Fe, Mn, Zn, Cu, Cr, Cd, Pb, As, Hg, Ni
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>
              <strong>Optional columns:</strong> Collection_Date, Location
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>
              <strong>Coordinates:</strong> Latitude (-90 to 90), Longitude (-180 to 180)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>
              <strong>pH Range:</strong> 0 to 14
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>
              <strong>Metal concentrations:</strong> Non-negative values in mg/L
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <p>
              <strong>Format:</strong> Use comma-separated values, first row must contain headers
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Scientific Methodology</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>HPI (Heavy Metal Pollution Index):</strong> Weighted arithmetic mean method evaluating overall contamination severity based on WHO standards.
          </p>
          <p>
            <strong>HEI (Heavy Metal Evaluation Index):</strong> Sum of ratios between measured concentrations and WHO permissible limits.
          </p>
          <p>
            <strong>Cd (Contamination Degree):</strong> Aggregate measure comparing concentrations against BIS standards.
          </p>
          <p className="pt-2 text-xs text-gray-600 italic">
            Classification: Safe (HPI &lt; 50), Moderate Risk (50-100), High Risk (100-150), Critical (&gt; 150)
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
