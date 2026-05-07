import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Radio } from 'lucide-react';
import { getRiskInfo, cn } from '../lib/utils';
import { RiskLevel } from '../types';

interface RiskBannerProps {
  score: number;
  onRefresh: () => void;
  onBroadcast: () => void;
}

export default function RiskBanner({ score, onRefresh, onBroadcast }: RiskBannerProps) {
  const risk = getRiskInfo(score);
  
  return (
    <div className={cn(
      "h-[76px] border-b border-white/10 border-l-4 flex items-center px-5 gap-5 shrink-0 transition-all duration-500 glass !bg-white/[0.02]",
      risk.level === 'low' && "border-l-green-500",
      risk.level === 'mod' && "border-l-amber",
      risk.level === 'high' && "border-l-orange-500",
      risk.level === 'crit' && "border-l-neon-red animate-pulse shadow-[inset_10px_0_20px_-10px_rgba(244,63,94,0.3)]"
    )}>
      <div className={cn(
        "font-mono text-5xl font-semibold leading-none min-w-[90px] text-center glow-text",
        risk.level === 'crit' ? 'text-neon-red' : risk.color
      )}>
        {score}
      </div>

      <div className="flex-1">
        <div className="font-bold text-lg text-white leading-tight glow-text">{risk.label}</div>
        <div className="font-mono text-[11px] text-[#94a3b8] mt-0.5 uppercase tracking-wider">{risk.desc}</div>
      </div>

      <div className="w-[380px]">
        <div className="flex justify-between font-mono text-[9px] mb-1.5 tracking-wider uppercase">
          <span className="text-green-500">Low</span>
          <span className="text-amber">Mod</span>
          <span className="text-orange-500">High</span>
          <span className="text-neon-red">Crit</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-green-500 via-amber via-orange-500 to-neon-red opacity-50" />
        </div>
        <div className="h-0 relative">
          <motion.div 
            className="absolute -top-3 w-4 h-4 bg-white border-2 border-bg rounded-full shadow-[0_0_15px_#fff]"
            animate={{ left: `${score}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ x: '-50%' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <button 
          onClick={onBroadcast}
          className="bg-neon-red text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-neon-red/20"
        >
          <Radio size={12} />
          <span>BROADCAST ALERT</span>
        </button>
        <button 
          onClick={onRefresh}
          className="bg-transparent border border-white/20 text-[#94a3b8] font-mono text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center justify-center gap-2 hover:border-neon-blue hover:text-white transition-all whitespace-nowrap"
        >
          <RefreshCcw size={12} />
          <span>REFRESH DATA</span>
        </button>
      </div>
    </div>
  );
}
