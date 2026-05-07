/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    precipitation: number[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    precipitation_sum: number[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export type RiskLevel = 'low' | 'mod' | 'high' | 'crit';

export interface LocationInfo {
  lat: number;
  lon: number;
  name: string;
}

export interface WMOInfo {
  en: string;
  hi: string;
  icon: string;
}
