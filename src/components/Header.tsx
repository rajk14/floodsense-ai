import { useEffect, useState } from 'react';
import { LayoutDashboard, Map as MapIcon, Siren, Settings, Wifi, WifiOff, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationInfo } from '../types';

interface HeaderProps {
  location: string;
  onOpenSettings: () => void;
}

export default function Header({ location, onOpenSettings }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="h-[58px] bg-transparent border-b border-border flex items-center justify-between px-5 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] bg-linear-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center text-lg text-white shadow-lg shadow-neon-blue/20">
          🌊
        </div>
        <div>
          <div className="font-extrabold text-lg text-white tracking-tight glow-text -mb-1">FloodSense AI</div>
          <div className="font-mono text-[9px] text-neon-blue tracking-[0.2em] uppercase">Disaster Intelligence</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenSettings}
          className="glass rounded-full px-4 py-1.5 font-mono text-xs text-white flex items-center gap-2 hover:border-neon-blue transition-colors group"
        >
          <MapPin size={14} className="text-neon-blue" />
          <span>{location || 'Detecting location...'}</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="font-mono text-xs text-[#94a3b8] tabular-nums bg-white/5 px-2 py-1 rounded border border-white/5">
          {time.toLocaleTimeString('en-IN', { hour12: false })}
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] border shadow-xs transition-colors",
          isOnline ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-neon-red/10 border-neon-red/30 text-neon-red"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full bg-current", isOnline && "animate-pulse")} />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>

        <button 
          onClick={onOpenSettings}
          className="glass rounded-lg px-3 py-1.5 text-[#94a3b8] font-mono text-[11px] flex items-center gap-2 hover:border-neon-blue hover:text-white transition-all"
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}

import { cn } from '../lib/utils';
