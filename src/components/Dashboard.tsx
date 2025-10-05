import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useData } from '../context/DataContext';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { samples, computedIndices, stats } = useData();

  const classificationData = [
    { name: 'Safe', value: stats.safeSamples, color: '#10b981' },
    { name: 'Moderate', value: stats.moderateRiskSamples, color: '#f59e0b' },
    { name: 'High Risk', value: stats.highRiskSamples, color: '#ef4444' },
    { name: 'Critical', value: stats.criticalSamples, color: '#7f1d1d' },
  ];

  const metalAverages = samples.length > 0 ? [
    { metal: 'Fe', avg: samples.reduce((sum, s) => sum + s.Fe, 0) / samples.length },
    { metal: 'Mn', avg: samples.reduce((sum, s) => sum + s.Mn, 0) / samples.length },
    { metal: 'Zn', avg: samples.reduce((sum, s) => sum + s.Zn, 0) / samples.length },
    { metal: 'Cu', avg: samples.reduce((sum, s) => sum + s.Cu, 0) / samples.length },
    { metal: 'Cr', avg: samples.reduce((sum, s) => sum + s.Cr, 0) / samples.length },
    { metal: 'Cd', avg: samples.reduce((sum, s) => sum + s.Cd, 0) / samples.length },
    { metal: 'Pb', avg: samples.reduce((sum, s) => sum + s.Pb, 0) / samples.length },
    { metal: 'As', avg: samples.reduce((sum, s) => sum + s.As, 0) / samples.length },
    { metal: 'Hg', avg: samples.reduce((sum, s) => sum + s.Hg, 0) / samples.length },
    { metal: 'Ni', avg: samples.reduce((sum, s) => sum + s.Ni, 0) / samples.length },
  ] : [];

  const indexTrends = computedIndices.slice(0, 20).map((idx, i) => ({
    sample: `S${i + 1}`,
    HPI: idx.hpi,
    HEI: idx.hei,
    Cd: idx.cd,
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
        </div>
      </div>

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
              <Tooltip formatter={(value: number) => value.toFixed(4)} />
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
