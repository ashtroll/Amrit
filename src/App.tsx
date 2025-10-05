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
import About from './components/About';
import { useData } from './context/DataContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const { samples, computedIndices } = useData();

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
              <h3 className="text-lg font-semibold mb-3">HMPI Analyzer</h3>
              <p className="text-sm text-gray-400">
                Advanced environmental monitoring platform for groundwater quality assessment using scientifically validated heavy metal pollution indices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setCurrentPage('upload')} className="hover:text-white">Upload Data</button></li>
                <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-white">Dashboard</button></li>
                <li><button onClick={() => setCurrentPage('map')} className="hover:text-white">Map View</button></li>
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
            <p>&copy; 2025 HMPI Analyzer. Built for environmental science and public health.</p>
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
