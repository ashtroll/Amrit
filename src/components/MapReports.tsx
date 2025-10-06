import React, { useMemo, useState } from 'react';
import { Search, FileDown, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import MapView from './MapView';
import { exportSamplesToCSV } from '../utils/csvProcessor';
import { generatePDFReport } from '../utils/pdfGenerator';

const MapReports: React.FC = () => {
  const { samples, computedIndices, stats } = useData();
  const [query, setQuery] = useState('');
  const [focusedId, setFocusedId] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return samples.map((s, i) => ({ sample: s, idx: computedIndices[i] }));
    return samples
      .map((s, i) => ({ sample: s, idx: computedIndices[i] }))
      .filter(({ sample, idx }) => {
        return (
          sample.sampleId.toLowerCase().includes(q) ||
          (sample.location || '').toLowerCase().includes(q) ||
          idx.classification.toLowerCase().includes(q)
        );
      });
  }, [samples, computedIndices, query]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    // Find best match by sampleId first
    const direct = samples.find((s) => s.sampleId.toLowerCase() === query.trim().toLowerCase());
    const target = direct || filtered[0]?.sample;
    if (target) setFocusedId(target.sampleId);
  };

  const handleCSVExport = () => {
    exportSamplesToCSV(samples, computedIndices);
  };

  const handlePDFExport = () => {
    generatePDFReport(samples, computedIndices, stats);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-3">
        <form className="flex-1 flex items-center gap-2" onSubmit={onSearchSubmit}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Sample ID, location or classification..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Find on Map
          </button>
        </form>
        <div className="flex items-center gap-2">
          <button onClick={handleCSVExport} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FileDown size={18} /> CSV
          </button>
          <button onClick={handlePDFExport} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView samples={samples} computedIndices={computedIndices} selectedSampleId={focusedId} />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Samples ({filtered.length}/{samples.length})</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map(({ sample, idx }) => (
                    <tr key={sample.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setFocusedId(sample.sampleId)}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{sample.sampleId}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{sample.location || 'N/A'}</td>
                      <td className="px-3 py-2 text-xs">
                        <span
                          className={
                            'px-2 py-1 rounded-full font-semibold ' +
                            (idx.classification === 'Safe'
                              ? 'bg-green-100 text-green-800'
                              : idx.classification === 'Moderate Risk'
                              ? 'bg-amber-100 text-amber-800'
                              : idx.classification === 'High Risk'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-red-900 text-white')
                          }
                        >
                          {idx.classification}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapReports;
