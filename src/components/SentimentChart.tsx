import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SentimentPoint } from '../types';

interface Props {
  data: SentimentPoint[];
}

export const SentimentChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-black/5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <YAxis 
            domain={[-1, 1]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <ReferenceLine y={0} stroke="#ccc" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
