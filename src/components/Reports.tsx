import React from 'react';
import { FileDown, FileText, Table as TableIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { exportSamplesToCSV } from '../utils/csvProcessor';
import { generatePDFReport } from '../utils/pdfGenerator';

const Reports: React.FC = () => {
  const { samples, computedIndices, stats } = useData();

  const handleCSVExport = () => {
    exportSamplesToCSV(samples, computedIndices);
  };

  const handlePDFExport = () => {
    generatePDFReport(samples, computedIndices, stats);
  };

  if (samples.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <FileText size={64} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
        <p className="text-gray-500 text-center max-w-md">
          Upload water sample data to generate comprehensive reports.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <TableIcon size={32} className="text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">CSV Report</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Export all sample data, computed indices, and classifications in CSV format for further analysis in spreadsheet applications.
            </p>
            <button
              onClick={handleCSVExport}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <FileDown size={20} />
              Export CSV Report
            </button>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={32} className="text-red-600" />
              <h3 className="text-xl font-semibold text-gray-800">PDF Report</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Generate a professional PDF report with summary statistics, sample details, and classification results.
            </p>
            <button
              onClick={handlePDFExport}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <FileDown size={20} />
              Export PDF Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total Samples</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalSamples}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Safe Samples</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{stats.safeSamples}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">High Risk + Critical</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.highRiskSamples + stats.criticalSamples}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Sample Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sample ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">HPI</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">HEI</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Cd</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {samples.slice(0, 10).map((sample, index) => {
                const indices = computedIndices[index];
                const classificationColors = {
                  Safe: 'bg-green-100 text-green-800',
                  'Moderate Risk': 'bg-amber-100 text-amber-800',
                  'High Risk': 'bg-red-100 text-red-800',
                  Critical: 'bg-red-900 text-white',
                };
                return (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{sample.sampleId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{sample.location || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{indices?.hpi.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{indices?.hei.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{indices?.cd.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classificationColors[indices?.classification || 'Safe']}`}>
                        {indices?.classification}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {samples.length > 10 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Showing 10 of {samples.length} samples. Export full report for complete data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
