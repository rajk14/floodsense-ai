import { GoogleGenAI } from "@google/genai";
import { WeatherData, RiskLevel } from "../types";
import { getRiskInfo } from "./utils";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function analyzeFloodRisk(
  weather: WeatherData,
  locationName: string,
  riskScore: number,
  lang: 'en' | 'hi'
) {
  const ai = getAI();
  if (!ai) return null;

  const current = weather.current;
  const riskInfo = getRiskInfo(riskScore);

  const prompt = lang === 'hi'
    ? `आप एक आपदा प्रबंधन AI विशेषज्ञ हैं। निम्नलिखित मौसम डेटा के आधार पर बाढ़ जोखिम विश्लेषण दें:
स्थान: ${locationName} | तापमान: ${Math.round(current.temperature_2m)}°C | वर्षा: ${current.precipitation}mm | हवा: ${Math.round(current.wind_speed_10m)} km/h | आर्द्रता: ${current.relative_humidity_2m}% | जोखिम: ${riskScore}/100 (${riskInfo.label})
60 शब्दों में स्पष्ट, व्यावहारिक सलाह दें। लोगों को क्या करना चाहिए?`
    : `You are a disaster management AI expert. Based on:
Location: ${locationName} | Temp: ${Math.round(current.temperature_2m)}°C | Precipitation: ${current.precipitation}mm | Wind: ${Math.round(current.wind_speed_10m)} km/h | Humidity: ${current.relative_humidity_2m}% | Risk Score: ${riskScore}/100 (${riskInfo.label})
Provide a clear 60-word flood risk assessment with specific actionable advice. Be direct about the actual risk level.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Analysis failed:", error);
    return null;
  }
}
