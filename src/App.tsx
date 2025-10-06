import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Home from './components/Home';
import UploadData from './components/UploadData';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import Reports from './components/Reports';
import MapReports from './components/MapReports';
import About from './components/About';
import { useData } from './context/DataContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const { samples, computedIndices } = useData();



  if (loading) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {

    return <Login />;
  }



  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'upload':
        return <UploadData />;
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <MapView samples={samples} computedIndices={computedIndices} />;
      case 'map-reports':
        return <MapReports />;
      case 'reports':
        return <Reports />;
      case 'about':
        return <About />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">AMRIT: Analysis of Metals for Risk in Indian Terrain</h3>
              <p className="text-sm text-gray-400">
                Analysis of Metals for Risk in Indian Terrain. Scientifically validated heavy metal pollution indices for groundwater quality assessment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setCurrentPage('upload')} className="hover:text-white">Upload Data</button></li>
                <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white">Dashboard</button></li>
                <li><button onClick={() => setCurrentPage('map-reports')} className="hover:text-white">Marked on map</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">About</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <p className="text-sm text-gray-400">
                For research collaborations and inquiries about environmental monitoring projects.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2025 AMRIT. Built for environmental science and public health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
