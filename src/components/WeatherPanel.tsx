import { Thermometer, Droplets, Wind, CloudFog, CloudRain } from 'lucide-react';
import { WeatherData } from '../types';
import { getWmoInfo, cn } from '../lib/utils';

interface WeatherPanelProps {
  weather: WeatherData;
}

export default function WeatherPanel({ weather }: WeatherPanelProps) {
  const current = weather.current;
  const wmo = getWmoInfo(current.weather_code);
  const now = new Date().getHours();
  const precipProb = weather.hourly.precipitation_probability[now] || 0;

  const metrics = [
    { label: 'Temperature', val: Math.round(current.temperature_2m), unit: '°C', sub: `Feels: ${Math.round(current.apparent_temperature)}°`, icon: <Thermometer size={18} className="text-amber" />, key: 'temp' },
    { label: 'Precipitation', val: current.precipitation.toFixed(1), unit: 'mm', sub: `Prob: ${precipProb}%`, icon: <Droplets size={18} className="text-blue-400" />, key: 'precip' },
    { label: 'Wind Speed', val: Math.round(current.wind_speed_10m), unit: 'km/h', sub: `Dir: ${getWindDirection(current.wind_direction_10m)}`, icon: <Wind size={18} className="text-white/60" />, key: 'wind' },
    { label: 'Humidity', val: current.relative_humidity_2m, unit: '%', sub: `${Math.round(current.surface_pressure)} hPa`, icon: <CloudFog size={18} className="text-[#94a3b8]" />, key: 'hum' },
  ];

  return (
    <div className="w-[270px] p-[14px] border-r border-white/10 overflow-y-auto flex flex-col gap-3 shrink-0">
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-blue pb-2 border-b border-white/10">
        Live Weather Metrics
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map(m => (
          <div key={m.key} className="glass neon-border-blue rounded-lg p-2.5 hover:border-white/20 transition-colors">
            <div className="mb-1">{m.icon}</div>
            <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-[#94a3b8] mb-0.5">{m.label}</div>
            <div className="font-mono text-lg font-bold text-white glow-text">
              {m.val}<span className="text-[10px] text-[#94a3b8] font-normal ml-0.5 uppercase tracking-tighter">{m.unit}</span>
            </div>
            <div className="font-mono text-[10px] text-[#94a3b8] mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-blue mt-1 pb-2 border-b border-white/10">
        Current Condition
      </div>
      <div className="glass rounded-lg p-3.5 text-center">
        <div className="text-4xl mb-1.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{wmo.icon}</div>
        <div className="font-mono text-[13px] text-white font-bold">{wmo.en}</div>
        <div className="font-sans text-[12px] text-[#94a3b8] mt-0.5">{wmo.hi}</div>
      </div>

      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-blue mt-1 pb-2 border-b border-white/10">
        3-Day Outlook
      </div>
      <div className="flex flex-col gap-1.5 font-mono">
        {weather.daily.time.map((time, i) => {
          const dwmo = getWmoInfo(weather.daily.weather_code[i]);
          const labels = ['Today', 'Tomorrow', 'Day 3'];
          return (
            <div key={time} className="glass border-white/5 rounded-md p-2 flex items-center justify-between">
              <span className="text-[10px] text-[#94a3b8] w-14 uppercase tracking-tighter">{labels[i]}</span>
              <span className="text-lg">{dwmo.icon}</span>
              <span className="text-[11px] text-white">
                {Math.round(weather.daily.temperature_2m_max[i])}°<span className="text-[#94a3b8]">/</span>{Math.round(weather.daily.temperature_2m_min[i])}°
              </span>
              <span className="text-[10px] text-neon-blue font-bold">
                💧 {weather.daily.precipitation_sum[i].toFixed(1)}MM
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getWindDirection(deg: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}
