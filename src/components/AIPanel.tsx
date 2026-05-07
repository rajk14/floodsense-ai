import { Bot, AlertCircle, Radio, Languages, Phone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WeatherData, RiskLevel } from '../types';
import { cn } from '../lib/utils';

interface AIPanelProps {
  analysis: string | null;
  loading: boolean;
  score: number;
  weather: WeatherData;
  lang: 'en' | 'hi';
  onSetLang: (lang: 'en' | 'hi') => void;
  onBroadcast: () => void;
  smsLogs: string[];
}

export default function AIPanel({ 
  analysis, loading, score, weather, lang, onSetLang, onBroadcast, smsLogs 
}: AIPanelProps) {
  
  const alerts = getAlerts(score, weather.current);

  return (
    <div className="w-[290px] p-[14px] border-l border-white/10 overflow-y-auto flex flex-col gap-4 shrink-0">
      
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-purple pb-2 border-b border-white/10">
        AI Risk Analysis
      </div>
      <div className="glass neon-border-purple rounded-lg p-3">
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-neon-purple mb-2 flex items-center gap-2">
          {loading ? (
            <div className="w-3 h-3 border-2 border-white/10 border-t-neon-purple rounded-full animate-spin" />
          ) : (
            <Bot size={12} />
          )}
          <span>{loading ? 'Analysing conditions...' : 'Gemini AI Analysis'}</span>
        </div>
        <div className="text-[12px] leading-relaxed text-[#94a3b8]">
          {analysis || (loading ? "Generating intelligent risk assessment based on live satellite and sensor data..." : "AI analysis unavailable.")}
        </div>
      </div>

      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-purple pb-2 border-b border-white/10">
        Active Alerts
      </div>
      <div className="flex flex-col gap-2">
        {alerts.map((a, i) => (
          <div key={i} className={cn(
            "rounded-md p-2.5 glass border-l-4 flex gap-2.5 items-start",
            a.level === 'crit' && "border-l-neon-red",
            a.level === 'high' && "border-l-orange-500",
            a.level === 'mod' && "border-l-amber",
            a.level === 'low' && "border-l-green-500"
          )}>
            <div className="text-sm shrink-0">{a.icon}</div>
            <div>
              <div className="text-[11px] font-semibold text-white glow-text">{a.title}</div>
              <div className="font-mono text-[9px] text-[#94a3b8] mt-0.5 leading-normal">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-purple pb-2 border-b border-white/10">
        Community Broadcast
      </div>
      <div className="glass rounded-lg p-3">
        <div className="font-mono text-[10px] text-[#94a3b8] mb-2.5 leading-normal">
          Simulates SMS-based emergency broadcast to low-connectivity communities.
        </div>
        <button 
          onClick={onBroadcast}
          className="w-full bg-linear-to-br from-neon-blue to-neon-purple text-white border-none rounded-lg p-2.5 font-mono text-[11px] font-bold tracking-wider uppercase hover:opacity-90 transition-opacity shadow-lg shadow-neon-purple/20"
        >
          📡 Broadcast SMS Alert
        </button>
        {smsLogs.length > 0 && (
          <div className="mt-2 text-green-500 font-mono text-[9px] flex flex-col gap-1">
            {smsLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-1.5 uppercase">
                <CheckCircle2 size={10} />
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-purple pb-2 border-b border-white/10">
        Language / भाषा
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onSetLang('en')}
          className={cn(
            "flex-1 p-2 rounded-lg font-mono text-xs font-bold border transition-all",
            lang === 'en' ? "bg-neon-purple text-white border-neon-purple shadow-lg shadow-neon-purple/20" : "glass text-[#94a3b8] hover:border-neon-purple"
          )}
        >
          English
        </button>
        <button 
          onClick={() => onSetLang('hi')}
          className={cn(
            "flex-1 p-2 rounded-lg font-mono text-xs font-bold border transition-all",
            lang === 'hi' ? "bg-neon-purple text-white border-neon-purple shadow-lg shadow-neon-purple/20" : "glass text-[#94a3b8] hover:border-neon-purple"
          )}
        >
          हिंदी
        </button>
      </div>

      <div className="glass rounded-lg p-3 mt-auto">
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-neon-purple mb-2">Emergency Contacts</div>
        <div className="font-mono text-[10px] leading-loose text-[#94a3b8]">
          🆘 NDRF: <span className="text-white">1078</span><br />
          🚒 Fire: <span className="text-white">101</span><br />
          🚑 Ambulance: <span className="text-white">108</span><br />
          👮 Police: <span className="text-white">100</span><br />
          🌊 Flood Control: <span className="text-white font-bold">1800-180-1551</span>
        </div>
      </div>
    </div>
  );
}

function getAlerts(score: number, current: any) {
  const list: { level: RiskLevel; icon: string; title: string; desc: string }[] = [];
  
  if (score >= 75) {
    list.push({ level: 'crit', icon: '🆘', title: 'Flood Emergency — Evacuate', desc: 'Move to higher ground immediately. Call NDRF: 1078' });
  }
  if (score >= 50) {
    list.push({ level: 'high', icon: '⚠️', title: 'Heavy Rainfall Warning', desc: '50-100mm expected in next 6 hours — avoid low-lying areas' });
  }
  if (current.wind_speed_10m > 50) {
    list.push({ level: 'high', icon: '💨', title: 'High Wind Alert', desc: `Winds ${Math.round(current.wind_speed_10m)} km/h — secure outdoor objects` });
  }
  if (current.weather_code >= 95) {
    list.push({ level: 'crit', icon: '⛈️', title: 'Thunderstorm Active', desc: 'Lightning risk — remain indoors away from windows' });
  }
  if (score >= 25 && score < 75) {
    list.push({ level: 'mod', icon: '👀', title: 'Enhanced Monitoring', desc: 'Check grid conditions every 30 minutes' });
  }
  
  list.push({ level: 'low', icon: '✅', title: 'Emergency Services Active', desc: 'NDRF 1078 · Ambulance 108 · Police 100' });
  
  return list;
}
