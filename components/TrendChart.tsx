import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartDataPoint } from '../types';

interface TrendChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper/95 border border-ink-light/30 p-4 shadow-xl backdrop-blur-sm">
        <div className="font-serif text-ink-dark border-b border-ink-light/20 pb-2 mb-2 text-sm text-center font-bold">
           {label} 时
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs font-serif text-ink-light tracking-wide">{entry.name}</span>
            <span className="font-mono text-xs font-bold" style={{ color: entry.stroke }}>
              {(entry.value / 10000).toFixed(1)}万
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px] relative bg-paper/50">
      
      {/* Background decoration */}
      <div className="absolute top-4 right-4 z-0 opacity-10 pointer-events-none font-calligraphy text-8xl text-ink-base select-none">
        山水
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* Ink Wash Gradients */}
            <linearGradient id="inkWeibo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="inkDouyin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="inkKuaishou" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b48a60" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#b48a60" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="time" 
            stroke="#888" 
            tick={{fill: '#4a4a4a', fontSize: 10, fontFamily: 'Noto Serif SC'}} 
            tickLine={false}
            axisLine={{ stroke: '#cccccc', strokeWidth: 1 }}
            interval={4}
          />
          <YAxis 
            stroke="#888" 
            tick={{fill: '#4a4a4a', fontSize: 10, fontFamily: 'Noto Serif SC'}} 
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#888', strokeWidth: 0.5, strokeDasharray: '4 4' }} />
          
          <Area 
            type="monotone" 
            dataKey="kuaishou" 
            name="快手"
            stroke="#b48a60" 
            strokeWidth={1.5}
            fill="url(#inkKuaishou)" 
            animationDuration={2500}
            stackId="1" // Stacking creates the mountain range effect
          />
          <Area 
            type="monotone" 
            dataKey="douyin" 
            name="抖音"
            stroke="#2d2d2d" 
            strokeWidth={1.5}
            fill="url(#inkDouyin)" 
            animationDuration={2000}
            stackId="1"
          />
          <Area 
            type="monotone" 
            dataKey="weibo" 
            name="微博"
            stroke="#b91c1c" 
            strokeWidth={1.5}
            fill="url(#inkWeibo)" 
            animationDuration={1500}
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};