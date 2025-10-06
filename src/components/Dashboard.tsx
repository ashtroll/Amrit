import React, { useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useData } from '../context/DataContext';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, List, X, Copy } from 'lucide-react';
// ...existing code...

const Dashboard: React.FC = () => {
  const { samples, computedIndices, stats } = useData();

  const [showAttention, setShowAttention] = useState(false);
  const attentionList = useMemo(() => {
    return computedIndices
      .map((idx, i) => ({ sample: samples[i], idx }))
      .filter((row) => row && (row.idx.classification === 'High Risk' || row.idx.classification === 'Critical'));
  }, [samples, computedIndices]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // no-op fallback
    }
  };

  const classificationData = [
    { name: 'Safe', value: stats.safeSamples, color: '#10b981' },
    { name: 'Moderate', value: stats.moderateRiskSamples, color: '#f59e0b' },
    { name: 'High Risk', value: stats.highRiskSamples, color: '#ef4444' },
    { name: 'Critical', value: stats.criticalSamples, color: '#7f1d1d' },
  ];

  const metalAverages = samples.length > 0 ? [
    { metal: 'Fe', values: samples.map(s => s.Fe).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Mn', values: samples.map(s => s.Mn).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Zn', values: samples.map(s => s.Zn).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Cu', values: samples.map(s => s.Cu).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Cr', values: samples.map(s => s.Cr).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Cd', values: samples.map(s => s.Cd).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Pb', values: samples.map(s => s.Pb).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'As', values: samples.map(s => s.As).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Hg', values: samples.map(s => s.Hg).filter(v => !isNaN(v) && isFinite(v)) },
    { metal: 'Ni', values: samples.map(s => s.Ni).filter(v => !isNaN(v) && isFinite(v)) },
  ].map(item => ({
    metal: item.metal,
    avg: item.values.length > 0 ? item.values.reduce((sum, v) => sum + v, 0) / item.values.length : 0,
    count: item.values.length
  })).filter(item => item.count > 0) : []; // Only show metals with valid data

  const indexTrends = computedIndices.slice(0, 20).map((idx, i) => ({
    sample: `S${i + 1}`,
    HPI: isNaN(idx.hpi) ? 0 : idx.hpi,
    HEI: isNaN(idx.hei) ? 0 : idx.hei,
    Cd: isNaN(idx.cd) ? 0 : idx.cd,
  }));

  if (samples.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Activity size={64} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
        <p className="text-gray-500 text-center max-w-md">
          Upload water sample data to view comprehensive analytics and visualizations on the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  {/* HPITest removed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Samples</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalSamples}</p>
            </div>
            <Activity size={40} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Safe Samples</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.safeSamples}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats.totalSamples > 0 ? ((stats.safeSamples / stats.totalSamples) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <CheckCircle size={40} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average HPI</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.averageHPI.toFixed(1)}</p>
            </div>
            <TrendingUp size={40} className="text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Risk</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.highRiskSamples + stats.criticalSamples}</p>
              <p className="text-xs text-red-600 mt-1">Requires attention</p>
            </div>
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowAttention(true)}
              disabled={attentionList.length === 0}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border ${attentionList.length === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-red-700 border-red-200 hover:bg-red-50'}`}
            >
              <List size={16} /> View samples
            </button>
          </div>
        </div>
      </div>

      {/* Attention Modal */}
      {showAttention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAttention(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">High Risk & Critical Samples ({attentionList.length})</h3>
              <button onClick={() => setShowAttention(false)} className="p-1 rounded hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-auto">
              {attentionList.length === 0 ? (
                <p className="text-sm text-gray-600">No samples require attention right now.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Sample ID</th>
                        <th className="px-3 py-2 text-left">Classification</th>
                        <th className="px-3 py-2 text-left">HPI</th>
                        <th className="px-3 py-2 text-left">Location</th>
                        <th className="px-3 py-2 text-left">Critical metals</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attentionList.map(({ sample, idx }) => (
                        <tr key={sample.id}>
                          <td className="px-3 py-2 font-medium text-gray-900">{sample.sampleId}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${idx.classification === 'Critical' ? 'bg-red-900 text-white' : 'bg-red-100 text-red-800'}`}>
                              {idx.classification}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-700">{idx.hpi.toFixed(2)}</td>
                          <td className="px-3 py-2 text-gray-700">{sample.location || 'N/A'}</td>
                          <td className="px-3 py-2 text-gray-700">{idx.criticalMetals && idx.criticalMetals.length > 0 ? idx.criticalMetals.join(', ') : '—'}</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => copyToClipboard(sample.sampleId)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
                              title="Copy Sample ID"
                            >
                              <Copy size={14} /> Copy ID
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">Tip: Use Marked on map and search by Sample ID to locate the sample on the map.</p>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowAttention(false)} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contamination Classification</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classificationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {classificationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Metal Concentrations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metalAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metal" />
              <YAxis />
              <Tooltip formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(4)} mg/L`, 
                `${name} (${props.payload.count}/${samples.length} samples)`
              ]} />
              <Bar dataKey="avg" fill="#3b82f6" name="Concentration (mg/L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pollution Index Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={indexTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sample" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="HPI" stroke="#3b82f6" strokeWidth={2} name="Heavy Metal Pollution Index" />
            <Line type="monotone" dataKey="HEI" stroke="#10b981" strokeWidth={2} name="Heavy Metal Evaluation Index" />
            <Line type="monotone" dataKey="Cd" stroke="#f59e0b" strokeWidth={2} name="Contamination Degree" />
          </LineChart>
        </ResponsiveContainer>
        {computedIndices.length > 20 && (
          <p className="text-sm text-gray-500 mt-2 text-center">Showing first 20 samples</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Most contaminated metal: <strong>{stats.mostContaminatedMetal}</strong>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              Average HEI: <strong>{stats.averageHEI.toFixed(2)}</strong> {stats.averageHEI > 20 ? '(High contamination)' : stats.averageHEI > 10 ? '(Moderate contamination)' : '(Low contamination)'}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              {stats.criticalSamples > 0 && (
                <span className="text-red-600 font-semibold">
                  {stats.criticalSamples} critical sample{stats.criticalSamples > 1 ? 's' : ''} require immediate attention
                </span>
              )}
              {stats.criticalSamples === 0 && stats.highRiskSamples > 0 && (
                <span className="text-amber-600 font-semibold">
                  {stats.highRiskSamples} sample{stats.highRiskSamples > 1 ? 's' : ''} classified as high risk
                </span>
              )}
              {stats.criticalSamples === 0 && stats.highRiskSamples === 0 && (
                <span className="text-green-600 font-semibold">All samples within acceptable contamination levels</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
