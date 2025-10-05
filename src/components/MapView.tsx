import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WaterSample, ComputedIndices } from '../types';

interface MapViewProps {
  samples: WaterSample[];
  computedIndices: ComputedIndices[];
}

const MapView: React.FC<MapViewProps> = ({ samples, computedIndices }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const getMarkerColor = (classification: string): string => {
    switch (classification) {
      case 'Safe':
        return '#10b981';
      case 'Moderate Risk':
        return '#f59e0b';
      case 'High Risk':
        return '#ef4444';
      case 'Critical':
        return '#7f1d1d';
      default:
        return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20, 78], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (samples.length === 0) return;

    const bounds: L.LatLngBoundsExpression = [];

    samples.forEach((sample, index) => {
      const indices = computedIndices[index];
      if (!indices) return;

      const color = getMarkerColor(indices.classification);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([sample.latitude, sample.longitude], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${color};">${sample.sampleId}</h3>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Location:</strong> ${sample.location || 'N/A'}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Classification:</strong> ${indices.classification}</p>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="margin: 4px 0; font-size: 12px;"><strong>HPI:</strong> ${indices.hpi.toFixed(2)}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>HEI:</strong> ${indices.hei.toFixed(2)}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Cd:</strong> ${indices.cd.toFixed(2)}</p>
          ${indices.criticalMetals.length > 0 ? `<p style="margin: 4px 0; font-size: 12px; color: #dc2626;"><strong>Critical:</strong> ${indices.criticalMetals.join(', ')}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      bounds.push([sample.latitude, sample.longitude]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [samples, computedIndices]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[600px] rounded-lg shadow-lg border border-gray-200" />
      {samples.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg">
          <p className="text-gray-500 text-lg">No samples to display. Upload data to see map visualization.</p>
        </div>
      )}
      <div className="mt-4 flex gap-6 justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-700">Safe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-sm text-gray-700">Moderate Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-700">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-900"></div>
          <span className="text-sm text-gray-700">Critical</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
