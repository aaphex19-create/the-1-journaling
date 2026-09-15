import React from 'react';
import { TrendingUp, ShieldAlert, Zap, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const KPICards: React.FC = () => {
  const { isDark } = useTheme();

  const stats = [
    {
      id: 'kpi-flow',
      title: 'Institutional Net Flow (24h)',
      value: '+$4.82 Billion',
      change: '+18.4%',
      positive: true,
      sublabel: 'Aggregated Dark Pool & Block ATS',
      icon: TrendingUp,
      accentColor: 'text-emerald-400',
      badge: 'Bullish Imbalance',
    },
    {
      id: 'kpi-alpha',
      title: 'The 1% Alpha Index',
      value: '99.4 / 100',
      change: '+2.8 pts',
      positive: true,
      sublabel: 'Top 0.6% Historical Decile',
      icon: Zap,
      accentColor: 'text-blue-400',
      badge: 'High Conviction',
    },
    {
      id: 'kpi-darkpool',
      title: 'Dark Pool Volume Dominance',
      value: '64.8%',
      change: '+5.2%',
      positive: true,
      sublabel: 'Non-displayed off-exchange prints',
      icon: Layers,
      accentColor: 'text-indigo-400',
      badge: 'Institutional Dominance',
    },
    {
      id: 'kpi-whales',
      title: 'Whale Accumulation Ratio',
      value: '82.3%',
      change: '+3.1%',
      positive: true,
      sublabel: 'Wallets > $50M in Accumulation',
      icon: ShieldAlert,
      accentColor: 'text-purple-400',
      badge: 'Low Retail Absorption',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            id={stat.id}
            className={`p-6 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
              isDark
                ? 'liquid-glass-card-dark hover:border-slate-600/80 hover:shadow-lg hover:shadow-blue-500/5'
                : 'liquid-glass-card-light hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {/* Ambient indicator accent */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {stat.title}
              </span>
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${stat.accentColor}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
                {stat.value}
              </span>
              <div
                className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                  stat.positive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {stat.sublabel}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/70 text-slate-700'
              }`}>
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
