import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, Maximize2, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MarketChartProps {
  livePulse?: boolean;
}

export const MarketChart: React.FC<MarketChartProps> = ({ livePulse = true }) => {
  const { isDark } = useTheme();
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D' | '1Y'>('24H');
  const [metric, setMetric] = useState<'netFlow' | 'alphaScore' | 'volatility' | 'volume'>('netFlow');

  const baseData = [
    { time: '00:00', netFlow: 240, alphaScore: 91.2, volatility: 13.8, volume: 14.2 },
    { time: '04:00', netFlow: 410, alphaScore: 93.5, volatility: 14.5, volume: 21.0 },
    { time: '08:00', netFlow: 580, alphaScore: 95.1, volatility: 15.2, volume: 29.8 },
    { time: '12:00', netFlow: 790, alphaScore: 96.8, volatility: 13.9, volume: 38.4 },
    { time: '16:00', netFlow: 1120, alphaScore: 98.2, volatility: 16.4, volume: 49.6 },
    { time: '20:00', netFlow: 1340, alphaScore: 99.1, volatility: 15.8, volume: 56.1 },
    { time: 'Now', netFlow: 1482, alphaScore: 99.4, volatility: 15.1, volume: 64.8 },
  ];

  const metricConfig = {
    netFlow: {
      label: 'Institutional Net Flow ($M)',
      color: '#3b82f6',
      unit: '$M',
      fillId: 'colorFlow',
    },
    alphaScore: {
      label: 'The 1% Alpha Score (0-100)',
      color: '#10b981',
      unit: 'pts',
      fillId: 'colorAlpha',
    },
    volatility: {
      label: 'Implied Volatility Compression (%)',
      color: '#8b5cf6',
      unit: '%',
      fillId: 'colorVol',
    },
    volume: {
      label: 'Dark Pool Volume Aggregate ($B)',
      color: '#f59e0b',
      unit: '$B',
      fillId: 'colorVolm',
    },
  };

  const currentConfig = metricConfig[metric];

  return (
    <div
      id="market-analytics-chart-container"
      className={`p-6 rounded-3xl transition-all duration-300 border ${
        isDark ? 'liquid-glass-dark border-slate-700/60' : 'liquid-glass-light border-slate-200'
      }`}
    >
      {/* Header bar with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold tracking-tight">
              Institutional Order Flow & Capital Vectors
            </h3>
            {livePulse && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM
              </span>
            )}
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Cross-market aggregated prints filtered by algorithmic institutional identifiers.
          </p>
        </div>

        {/* Metric selection pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`p-1 rounded-xl flex items-center border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {(['netFlow', 'alphaScore', 'volatility', 'volume'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                type="button"
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  metric === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'netFlow' && 'Capital Flow'}
                {m === 'alphaScore' && 'Alpha Index'}
                {m === 'volatility' && 'Volatility'}
                {m === 'volume' && 'Dark Pool'}
              </button>
            ))}
          </div>

          {/* Timeframe pills */}
          <div
            className={`p-1 rounded-xl flex items-center border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {(['1H', '24H', '7D', '30D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                type="button"
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  timeframe === tf
                    ? 'bg-slate-700 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={baseData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#334155' : '#e2e8f0'}
              opacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `${val}${metric === 'volatility' ? '%' : ''}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#475569' : '#cbd5e1',
                borderRadius: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              }}
              formatter={(value: any) => [`${value} ${currentConfig.unit}`, currentConfig.label]}
              labelStyle={{ fontWeight: 'bold', color: currentConfig.color }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={currentConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats under the chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5 text-xs">
        <div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Session High:</span>
          <p className="font-mono font-bold text-sm text-emerald-400">+1,482 $M</p>
        </div>
        <div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Delta-Neutral Mean:</span>
          <p className="font-mono font-bold text-sm">+890 $M</p>
        </div>
        <div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Order Imbalance:</span>
          <p className="font-mono font-bold text-sm text-blue-400">76% Bid Dominance</p>
        </div>
        <div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Algorithmic Latency:</span>
          <p className="font-mono font-bold text-sm text-indigo-400">0.8 ms</p>
        </div>
      </div>
    </div>
  );
};
