import React from 'react';
import { Droplet, TrendingUp, Map, FileText, Upload, BarChart3, Shield } from 'lucide-react';
// ...existing code...

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Upload,
      title: 'Data Upload',
      description: 'Upload water sample data via CSV with automated validation and quality checks',
      color: 'blue',
    },
    {
      icon: BarChart3,
      title: 'Scientific Analysis',
      description: 'Automated calculation of HPI, HEI, and Cd indices using WHO and BIS standards',
      color: 'green',
    },
    {
      icon: Map,
      title: 'GIS Mapping',
      description: 'Interactive spatial visualization with color-coded contamination levels',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'Dashboard Analytics',
      description: 'Real-time statistics, trends, and classification distribution',
      color: 'amber',
    },
    {
      icon: FileText,
      title: 'Report Generation',
      description: 'Export comprehensive reports in PDF and CSV formats',
      color: 'red',
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Secure authentication with role-based access control',
      color: 'indigo',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-300' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-300' },
  };

  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 rounded-2xl shadow-2xl p-12 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <Droplet size={48} />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">AMRIT</h1>
            <p className="text-blue-100 text-xl">Heavy Metal Pollution Index Assessment System</p>
          </div>
        </div>
        <p className="text-lg text-blue-50 max-w-3xl">
          Analysis of Metals for Risk in Indian Terrain. Automate heavy metal contamination analysis using scientifically validated indices and real-time spatial visualization.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => onNavigate('upload')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Upload Data
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-blue-700 bg-opacity-50 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-70 transition-colors border-2 border-white border-opacity-30"
          >
            View Dashboard
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border-t-4"
                style={{ borderTopColor: colors.border.replace('border-', '#') }}
              >
                <div className={`${colors.bg} rounded-lg p-3 inline-block mb-4`}>
                  <Icon size={32} className={colors.text} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Scientific Indices Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">HPI</h3>
            <p className="text-sm text-gray-600 mb-2">Heavy Metal Pollution Index</p>
            <p className="text-xs text-gray-500">
              Weighted arithmetic mean evaluating overall contamination severity based on WHO standards
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">HEI</h3>
            <p className="text-sm text-gray-600 mb-2">Heavy Metal Evaluation Index</p>
            <p className="text-xs text-gray-500">
              Sum of concentration ratios comparing measured values to permissible WHO limits
            </p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cd</h3>
            <p className="text-sm text-gray-600 mb-2">Contamination Degree</p>
            <p className="text-xs text-gray-500">
              Aggregate measure comparing concentrations against BIS drinking water standards
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-8 border border-green-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose AMRIT?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">For Researchers</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <span>Standardized methodology following international guidelines</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <span>Reproducible results with validated computation algorithms</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <span>Export-ready data for academic publications</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">For Policymakers</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Clear visual indicators of contamination severity</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Geographic insights for targeted intervention planning</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Professional reports for stakeholder communication</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-blue-600 mb-2">10+</p>
          <p className="text-sm text-gray-600">Heavy Metals Analyzed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-green-600 mb-2">3</p>
          <p className="text-sm text-gray-600">Pollution Indices</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-amber-600 mb-2">2</p>
          <p className="text-sm text-gray-600">Reference Standards</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-red-600 mb-2">100%</p>
          <p className="text-sm text-gray-600">Automated Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
