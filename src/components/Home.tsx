import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Map, FileText, Upload, BarChart3, Shield } from 'lucide-react';
// ...existing code...

interface HomeProps {
  onNavigate: (page: string) => void;
}

// Tiny animated counter for the stats section
const useCountUp = (end: number, durationMs = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, durationMs]);
  return value;
};

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

  const statValues = useMemo(() => ({
    metals: 10,
    indices: 3,
    standards: 2,
    automation: 100,
  }), []);
  const metals = useCountUp(statValues.metals);
  const indices = useCountUp(statValues.indices);
  const standards = useCountUp(statValues.standards);
  const automation = useCountUp(statValues.automation);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl text-white bg-animated-gradient">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-16 -left-20 w-72 h-72 rounded-full bg-white/10 blur-2xl float-slow" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-white/10 blur-2xl float-slow delay-300" />

        <div className="relative p-10 md:p-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 shadow-inner">
              <img src="/logo.png" alt="AMRIT Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">AMRIT</h1>
              <p className="text-blue-50 md:text-lg">Analysis of Metals for Risk in Indian Terrain</p>
            </div>
          </div>
          <p className="text-base md:text-lg text-blue-50/95 max-w-3xl">
            Automate heavy metal contamination analysis using scientifically validated indices and real-time spatial visualization.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => onNavigate('upload')}
              className="group relative overflow-hidden bg-white text-blue-700 px-7 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span className="relative z-10">Upload Data</span>
              <span className="absolute inset-0 bg-white/60 translate-y-full group-hover:translate-y-0 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="backdrop-blur-md bg-white/10 text-white px-7 py-3 rounded-lg font-semibold border border-white/30 hover:bg-white/15 transition-all hover:-translate-y-0.5"
            >
              View Dashboard
            </button>
            <button
              onClick={() => onNavigate('map-reports')}
              className="backdrop-blur-md bg-white/10 text-white px-7 py-3 rounded-lg font-semibold border border-white/30 hover:bg-white/15 transition-all hover:-translate-y-0.5"
            >
              Marked on Map
            </button>
          </div>
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
                className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className={`${colors.bg} ${colors.text} rounded-lg p-3 inline-flex items-center justify-center mb-4 ring-1 ring-black/5`}> 
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-sm text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-lg shadow-md p-8">
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

      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-8 border border-green-200">
        <div className="absolute -top-10 right-10 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl" />
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
          <p className="text-4xl font-bold text-blue-600 mb-2">{metals}+</p>
          <p className="text-sm text-gray-600">Heavy Metals Analyzed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-green-600 mb-2">{indices}</p>
          <p className="text-sm text-gray-600">Pollution Indices</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-amber-600 mb-2">{standards}</p>
          <p className="text-sm text-gray-600">Reference Standards</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-4xl font-bold text-red-600 mb-2">{automation}%</p>
          <p className="text-sm text-gray-600">Automated Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
