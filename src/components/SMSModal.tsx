import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, CheckCircle2 } from 'lucide-react';
import { LocationInfo, RiskLevel } from '../types';

interface SMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  location: string;
  score: number;
  riskLevel: RiskLevel;
}

export default function SMSModal({ isOpen, onClose, onConfirm, location, score, riskLevel }: SMSModalProps) {
  const getMessage = () => {
    const levelName = riskLevel.toUpperCase();
    if (riskLevel === 'crit') {
      return `🆘 EMERGENCY ALERT — FloodSense AI\nLocation: ${location}\nFLOOD RISK: CRITICAL (${score}/100)\n\n⚠️ EVACUATE IMMEDIATELY\nMove to higher ground now.\nDo NOT cross flooded roads.\n\nHelp: NDRF 1078 | Police 100`;
    }
    if (riskLevel === 'high') {
      return `⚠️ FLOOD WARNING — FloodSense AI\nLocation: ${location}\nFLOOD RISK: HIGH (${score}/100)\n\nAvoid low-lying areas.\nPrepare emergency kit.\nStay indoors if possible.\n\nNDRF: 1078`;
    }
    if (riskLevel === 'mod') {
      return `🟡 WEATHER ALERT — FloodSense AI\nLocation: ${location}\nFLOOD RISK: MODERATE (${score}/100)\n\nMonitor local conditions.\nStay away from water bodies.\nKeep phones charged.\n\nHelpline: 1078`;
    }
    return `ℹ️ WEATHER UPDATE — FloodSense AI\nLocation: ${location}\nFLOOD RISK: LOW (${score}/100)\n\nConditions stable. Stay prepared.\nEmergency: 1078`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative glass border-neon-purple/20 rounded-xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2 glow-text">
                <Radio size={20} className="text-neon-purple animate-pulse" />
                TACTICAL BROADCAST
              </h3>
              <button 
                onClick={onClose}
                className="text-[#94a3b8] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="glass border-neon-purple/30 rounded-lg p-3.5 font-mono text-[11px] text-white whitespace-pre-wrap leading-relaxed mb-4 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]">
              {getMessage()}
            </div>

            <p className="text-[10px] text-[#94a3b8] mb-5 font-mono uppercase tracking-tighter">
              Simulated broadcast to 3,847 registered devices in a 15km radius (LOW FREQUENCY).
            </p>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 glass border-white/10 rounded-lg py-2.5 text-[#94a3b8] font-mono text-xs font-bold hover:border-white/30 transition-all"
              >
                ABORT
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 bg-linear-to-br from-neon-blue to-neon-purple border-none rounded-lg py-2.5 text-white font-mono text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/30"
              >
                <CheckCircle2 size={14} />
                <span>INITIATE SEND</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
