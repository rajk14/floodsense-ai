import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationInfo, RiskLevel } from '../types';
import { RefreshCcw, Target } from 'lucide-react';

interface MapAreaProps {
  location: LocationInfo;
  onRefresh: () => void;
}

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PULSING_ICON = L.divIcon({
  html: `<div class="w-[18px] h-[18px] rounded-full bg-amber border-[2.5px] border-white shadow-[0_0_0_0_rgba(245,158,11,0.5)] animate-[mPulse_2s_infinite]"></div>
  <style>
    @keyframes mPulse {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
      70% { box-shadow: 0 0 0 14px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
  </style>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const RISK_ZONES = [
  { dy: 0.10, dx: 0.06, risk: 'high' as RiskLevel, r: 5500, name: 'River Flood Plain' },
  { dy: -0.07, dx: 0.13, risk: 'crit' as RiskLevel, r: 7000, name: 'Low-lying Basin' },
  { dy: 0.05, dx: -0.09, risk: 'mod' as RiskLevel, r: 4000, name: 'Urban Drainage Zone' },
  { dy: -0.11, dx: -0.05, risk: 'low' as RiskLevel, r: 6000, name: 'Agricultural Zone' },
  { dy: 0.00, dx: 0.19, risk: 'mod' as RiskLevel, r: 3500, name: 'Suburban Area' },
  { dy: 0.14, dx: -0.03, risk: 'low' as RiskLevel, r: 4500, name: 'Highland Reserve' },
];

const COLORS = {
  crit: '#ef4444',
  high: '#f97316',
  mod: '#f59e0b',
  low: '#22c55e',
};

const LABELS = {
  crit: 'CRITICAL',
  high: 'HIGH',
  mod: 'MODERATE',
  low: 'LOW',
};

export default function MapArea({ location, onRefresh }: MapAreaProps) {
  return (
    <div className="flex-1 relative">
      <MapContainer
        key={`${location.lat}-${location.lon}`}
        center={[location.lat, location.lon]}
        zoom={11}
        className="w-full h-full z-0"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        />
        
        <Marker position={[location.lat, location.lon]} icon={PULSING_ICON}>
          <Popup>
            <div className="font-sans">
              <div className="font-bold">📍 {location.name}</div>
              <div className="text-xs text-gray-500">Current monitoring point</div>
            </div>
          </Popup>
        </Marker>

        {RISK_ZONES.map((z, i) => (
          <Circle
            key={i}
            center={[location.lat + z.dy, location.lon + z.dx]}
            radius={z.r}
            pathOptions={{
              fillColor: COLORS[z.risk],
              fillOpacity: 0.14,
              color: COLORS[z.risk],
              weight: 1.5,
              opacity: 0.55,
            }}
          >
            <Popup>
              <div className="font-sans">
                <div className="font-bold">{z.name}</div>
                <div className="text-xs">
                  Flood Risk: <span style={{ color: COLORS[z.risk] }} className="font-bold">{LABELS[z.risk]}</span>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-[400] glass px-4 py-1.5 rounded-full font-mono text-xs text-white pointer-events-none flex items-center gap-2 glow-text shadow-lg shadow-neon-blue/10">
        <Target size={14} className="text-neon-blue" />
        <span>{location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E</span>
      </div>

      <div className="absolute bottom-[30px] left-[10px] z-[400] glass border-white/10 rounded-lg p-3 font-mono text-[10px]">
        <div className="text-[9px] tracking-wider uppercase text-neon-blue mb-1.5">Tactical Overlay</div>
        {Object.entries(LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ backgroundColor: COLORS[key as RiskLevel] }} />
            <span className="text-white/70 uppercase tracking-tighter">{label}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onRefresh}
        className="absolute bottom-[10px] right-[10px] z-[400] glass border-white/20 rounded-md px-3 py-1.5 font-mono text-[10px] text-white hover:border-neon-blue hover:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all uppercase tracking-wider"
      >
        ↺ Reload Grid
      </button>
    </div>
  );
}
