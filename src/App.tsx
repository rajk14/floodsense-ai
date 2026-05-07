import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import RiskBanner from './components/RiskBanner';
import WeatherPanel from './components/WeatherPanel';
import MapArea from './components/MapArea';
import AIPanel from './components/AIPanel';
import ForecastChart from './components/ForecastChart';
import SettingsModal from './components/SettingsModal';
import SMSModal from './components/SMSModal';
import { WeatherData, LocationInfo, RiskLevel } from './types';
import { calculateRisk, getRiskInfo } from './lib/utils';
import { analyzeFloodRisk } from './lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { sendSMSAlert } from './lib/sms';

const INITIAL_LOCATION: LocationInfo = {
  lat: 25.5941,
  lon: 85.1376,
  name: 'Patna, Bihar, India'
};

export default function App() {
  const [location, setLocation] = useState<LocationInfo>(INITIAL_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [riskScore, setRiskScore] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [smsLogs, setSmsLogs] = useState<string[]>([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSMSOpen, setIsSMSOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' | 'info' } | null>(null);

  const showToast = useCallback((msg: string, type: 'ok' | 'err' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      showToast('Fetching live weather data...', 'info');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=precipitation_probability,precipitation,temperature_2m,weather_code&daily=precipitation_sum,weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API failed');
      const data: WeatherData = await res.json();
      
      setWeather(data);
      const score = calculateRisk(data);
      setRiskScore(score);
      showToast('Data refreshed successfully', 'ok');
      
      // Trigger AI analysis
      fetchAI(data, location.name, score, lang);
    } catch (error) {
      showToast('Weather fetch failed. Check connection.', 'err');
      console.error(error);
    }
  }, [showToast, location.name, lang]);

  const fetchAI = useCallback(async (w: WeatherData, loc: string, score: number, l: 'en' | 'hi') => {
    setAiLoading(true);
    const result = await analyzeFloodRisk(w, loc, score, l);
    setAiAnalysis(result);
    setAiLoading(false);
  }, []);

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
    
    // Auto-refresh every 10 min
    const interval = setInterval(() => fetchWeather(location.lat, location.lon), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location.lat, location.lon, fetchWeather]);

  const handleSearch = async (q: string) => {
    try {
      showToast('Searching location...', 'info');
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`);
      const data = await res.json();
      if (!data[0]) throw new Error('Location not found');
      
      const newLoc = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name.split(',').slice(0, 2).join(', ')
      };
      
      setLocation(newLoc);
      showToast('Location updated!', 'ok');
    } catch (error) {
      showToast('Location not found.', 'err');
    }
  };

  const handleBroadcast = async () => {
    showToast('Initiating broadcast...', 'info');
    
    // In a real app, this would loop through registered numbers
    const result = await sendSMSAlert('+910000000000', `Flood Alert: ${location.name} - Risk Score: ${riskScore}`);
    
    if (result.simulated) {
      setSmsLogs(prev => [`Simulation: Alert queued at ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 5));
      showToast('Simulation broadcast complete!', 'ok');
    } else if (result.success) {
      setSmsLogs(prev => [`Success: Live alert sent at ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 5));
      showToast('Live alert broadcast successfully!', 'ok');
    } else {
      showToast('Broadcast failed. Check logs.', 'err');
    }
    
    setIsSMSOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-bg overflow-hidden select-none">
      <Header 
        location={location.name} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />

      <RiskBanner 
        score={riskScore} 
        onRefresh={() => fetchWeather(location.lat, location.lon)} 
        onBroadcast={() => setIsSMSOpen(true)}
      />

      <main className="flex-1 flex min-h-0">
        {weather && <WeatherPanel weather={weather} />}
        <MapArea 
          location={location} 
          onRefresh={() => fetchWeather(location.lat, location.lon)} 
        />
        {weather && (
          <AIPanel 
            analysis={aiAnalysis}
            loading={aiLoading}
            score={riskScore}
            weather={weather}
            lang={lang}
            onSetLang={(l) => {
              setLang(l);
              if (weather) fetchAI(weather, location.name, riskScore, l);
            }}
            onBroadcast={() => setIsSMSOpen(true)}
            smsLogs={smsLogs}
          />
        )}
      </main>

      {weather && <ForecastChart weather={weather} />}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSearch}
        currentLocation={location.name}
      />

      <SMSModal 
        isOpen={isSMSOpen}
        onClose={() => setIsSMSOpen(false)}
        onConfirm={handleBroadcast}
        location={location.name}
        score={riskScore}
        riskLevel={getRiskInfo(riskScore).level}
      />

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed bottom-4 right-4 z-[2000] flex flex-col gap-2 pointer-events-none"
          >
            <div className={cn(
              "glass border-white/20 rounded-lg px-4 py-2.5 font-mono text-[10px] text-white min-w-[200px] border-l-4 shadow-2xl backdrop-blur-xl uppercase tracking-tighter",
              toast.type === 'ok' && "border-l-green-500",
              toast.type === 'err' && "border-l-neon-red",
              toast.type === 'info' && "border-l-neon-blue"
            )}>
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
