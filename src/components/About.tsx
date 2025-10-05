import React from 'react';
import { Beaker, BookOpen, Users, Target } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Heavy Metal Pollution Index Analyzer</h1>
        <p className="text-xl text-blue-50">
          Advanced scientific tool for groundwater contamination assessment and environmental monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target size={32} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To provide researchers, environmental scientists, and policymakers with a powerful, accessible platform for assessing groundwater quality through standardized heavy metal pollution indices, enabling data-driven decisions for public health and environmental protection.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={32} className="text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Target Users</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Environmental researchers and scientists</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Government agencies and policymakers</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Water quality testing laboratories</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Academic institutions and students</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <Beaker size={32} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Scientific Methodology</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Heavy Metal Pollution Index (HPI)</h3>
            <p className="text-gray-700 mb-2">
              The HPI is calculated using the weighted arithmetic mean method:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm">
              HPI = Σ(Wi × Qi) / ΣWi
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Where Wi is the weight of each metal based on toxicity, and Qi is the sub-index calculated from measured concentration relative to WHO standards.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Heavy Metal Evaluation Index (HEI)</h3>
            <p className="text-gray-700 mb-2">
              The HEI represents the sum of concentration ratios:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm">
              HEI = Σ(Ci / Si)
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Where Ci is the measured concentration and Si is the WHO permissible limit for each metal.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Contamination Degree (Cd)</h3>
            <p className="text-gray-700 mb-2">
              The Cd index evaluates overall contamination against BIS standards:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm">
              Cd = Σ(Ci / BISi)
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Where Ci is the measured concentration and BISi is the Bureau of Indian Standards permissible limit.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={32} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Classification Criteria</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Safe</h4>
            <p className="text-sm text-gray-700">HPI &lt; 50, HEI &lt; 10, Cd &lt; 1</p>
            <p className="text-xs text-gray-600 mt-1">Water meets quality standards for consumption</p>
          </div>

          <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
            <h4 className="font-semibold text-amber-800 mb-2">Moderate Risk</h4>
            <p className="text-sm text-gray-700">HPI 50-100, HEI 10-20, Cd 1-2</p>
            <p className="text-xs text-gray-600 mt-1">Requires monitoring and treatment consideration</p>
          </div>

          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
            <h4 className="font-semibold text-red-800 mb-2">High Risk</h4>
            <p className="text-sm text-gray-700">HPI 100-150, HEI 20-40, Cd 2-3</p>
            <p className="text-xs text-gray-600 mt-1">Not suitable for direct consumption without treatment</p>
          </div>

          <div className="border-l-4 border-red-900 bg-red-100 p-4 rounded">
            <h4 className="font-semibold text-red-900 mb-2">Critical</h4>
            <p className="text-sm text-gray-700">HPI &gt; 150, HEI &gt; 40, Cd &gt; 3</p>
            <p className="text-xs text-gray-600 mt-1">Severe contamination requiring immediate action</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Data Management</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>CSV upload with validation</li>
              <li>Real-time computation</li>
              <li>Secure data storage</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Visualization</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Interactive GIS mapping</li>
              <li>Statistical dashboards</li>
              <li>Trend analysis charts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Reporting</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>PDF report generation</li>
              <li>CSV data export</li>
              <li>Classification summaries</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Reference Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-2">World Health Organization (WHO)</p>
            <p className="text-xs text-gray-600">International drinking water quality guidelines</p>
          </div>
          <div>
            <p className="font-medium mb-2">Bureau of Indian Standards (BIS)</p>
            <p className="text-xs text-gray-600">IS 10500:2012 drinking water specifications</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 text-center">
        <p className="text-sm">
          Developed for environmental monitoring and public health protection
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Version 1.0 | 2025 | Built with React, TypeScript, and Tailwind CSS
        </p>
      </div>
    </div>
  );
};

export default About;
