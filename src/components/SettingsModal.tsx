import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Settings } from 'lucide-react';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: string) => void;
  currentLocation: string;
}

export default function SettingsModal({ isOpen, onClose, onSave, currentLocation }: SettingsModalProps) {
  const [locInp, setLocInp] = useState('');

  const handleSave = () => {
    onSave(locInp || currentLocation);
    onClose();
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
            className="relative glass border-white/20 rounded-xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg glow-text flex items-center gap-2">
                <Settings size={18} className="text-neon-blue" />
                SYSTEM CONFIG
              </h3>
              <button 
                onClick={onClose}
                className="text-[#94a3b8] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-neon-blue mb-1.5">
                  Target Coordinate / Location
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={locInp}
                    onChange={(e) => setLocInp(e.target.value)}
                    placeholder="e.g. Patna, Varanasi, Mumbai..."
                    className="w-full glass border-white/20 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-neon-blue transition-colors pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-blue/40" size={16} />
                </div>
                <p className="text-[10px] text-[#94a3b8] mt-1.5 font-mono uppercase tracking-tighter">
                  Active: {currentLocation}
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 glass border-white/10 rounded-lg py-2.5 text-[#94a3b8] font-mono text-xs font-bold hover:border-white/30 transition-all uppercase"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-neon-blue border-none rounded-lg py-2.5 text-black font-mono text-xs font-bold hover:opacity-90 transition-opacity uppercase shadow-lg shadow-neon-blue/20"
                >
                  Update Stream
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
