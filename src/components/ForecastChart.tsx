import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Bar, ComposedChart, Legend 
} from 'recharts';
import { WeatherData } from '../types';

interface ForecastChartProps {
  weather: WeatherData;
}

export default function ForecastChart({ weather }: ForecastChartProps) {
  const now = new Date().getHours();
  const data = Array.from({ length: 24 }).map((_, i) => {
    const idx = (now + i) % weather.hourly.time.length;
    return {
      time: `${new Date(weather.hourly.time[idx]).getHours()}:00`,
      precip: +(weather.hourly.precipitation[idx] || 0).toFixed(2),
      prob: weather.hourly.precipitation_probability[idx] || 0,
    };
  });

  return (
    <div className="h-[148px] bg-white/[0.02] backdrop-blur-md border-t border-white/10 p-3 px-5 shrink-0 flex flex-col">
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-neon-blue mb-1.5 flex justify-between items-center">
        <span>📈 24-Hour Precipitation Forecast (MM) & Probability (%)</span>
        <span className="text-white/30 text-[7px] tracking-widest">AETHER-7 LINK ACTIVE</span>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              interval={1}
            />
            <YAxis 
              yAxisId="left"
              stroke="#94a3b8" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `${v}MM`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '10px',
                fontFamily: 'IBM Plex Mono',
                borderRadius: '6px'
              }}
              cursor={{ stroke: 'rgba(56, 189, 248, 0.3)', strokeWidth: 2 }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '9px', fontFamily: 'IBM Plex Mono', marginTop: '-30px' }}
            />
            <Bar 
              yAxisId="left"
              dataKey="precip" 
              name="Precipitation" 
              fill="#38bdf8" 
              fillOpacity={0.4} 
              radius={[2, 2, 0, 0]}
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="prob" 
              name="Probability" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.05} 
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
