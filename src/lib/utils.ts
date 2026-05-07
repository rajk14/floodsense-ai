import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WMO_CODES: Record<number, { en: string; hi: string; icon: string }> = {
  0: { en: 'Clear Sky', hi: 'साफ आकाश', icon: '☀️' },
  1: { en: 'Mainly Clear', hi: 'मुख्यतः साफ', icon: '🌤️' },
  2: { en: 'Partly Cloudy', hi: 'आंशिक बादल', icon: '⛅' },
  3: { en: 'Overcast', hi: 'बादल छाए हुए', icon: '☁️' },
  45: { en: 'Foggy', hi: 'कोहरा', icon: '🌫️' },
  51: { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', icon: '🌦️' },
  53: { en: 'Moderate Drizzle', hi: 'मध्यम बूंदाबांदी', icon: '🌦️' },
  55: { en: 'Dense Drizzle', hi: 'घनी बूंदाबांदी', icon: '🌧️' },
  61: { en: 'Slight Rain', hi: 'हल्की वर्षा', icon: '🌧️' },
  63: { en: 'Moderate Rain', hi: 'मध्यम वर्षा', icon: '🌧️' },
  65: { en: 'Heavy Rain', hi: 'भारी वर्षा', icon: '⛈️' },
  80: { en: 'Rain Showers', hi: 'बारिश की फुहारें', icon: '🌦️' },
  82: { en: 'Heavy Showers', hi: 'भारी फुहारें', icon: '⛈️' },
  95: { en: 'Thunderstorm', hi: 'आंधी-तूफान', icon: '⛈️' },
  96: { en: 'Thunderstorm+Hail', hi: 'ओलावृष्टि तूफान', icon: '🌩️' },
  99: { en: 'Severe Thunderstorm', hi: 'भारी आंधी-तूफान', icon: '🌩️' },
};

export function getWmoInfo(code: number) {
  return WMO_CODES[code] || WMO_CODES[Math.floor(code / 10) * 10] || { en: 'Unknown', hi: 'अज्ञात', icon: '🌡️' };
}

export function calculateRisk(weather: any) {
  let score = 0;
  const current = weather.current;
  const p = current.precipitation || 0;
  if (p > 15) score += 35; else if (p > 8) score += 25; else if (p > 3) score += 15; else if (p > 0) score += 8;

  const c = current.weather_code || 0;
  if (c >= 95) score += 25; else if (c >= 80) score += 18; else if (c >= 61) score += 12; else if (c >= 51) score += 6;

  if (weather.hourly?.precipitation_probability?.length) {
    const avg = weather.hourly.precipitation_probability.slice(0, 6).reduce((a: number, b: number) => a + b, 0) / 6;
    score += Math.round(avg * 0.2);
  }
  const w = current.wind_speed_10m || 0;
  if (w > 70) score += 15; else if (w > 50) score += 10; else if (w > 30) score += 5;
  if ((current.relative_humidity_2m || 0) > 92) score += 5;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getRiskInfo(score: number): { level: 'low' | 'mod' | 'high' | 'crit'; label: string; color: string; desc: string } {
  if (score >= 75) return { level: 'crit', label: 'CRITICAL FLOOD RISK', color: 'text-red-500', desc: '⚠️ CRITICAL: Severe flooding imminent. Evacuate low-lying areas immediately.' };
  if (score >= 50) return { level: 'high', label: 'HIGH FLOOD RISK', color: 'text-orange-500', desc: 'Significant flood threat. Avoid water bodies and low-lying roads.' };
  if (score >= 25) return { level: 'mod', label: 'MODERATE RISK', color: 'text-amber', desc: 'Elevated risk. Monitor drainage systems and stay updated on forecasts.' };
  return { level: 'low', label: 'LOW RISK — SAFE', color: 'text-green-500', desc: 'Conditions stable. Good time to review your emergency preparedness.' };
}
