import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain, 
  Award, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Compass,
  Zap
} from 'lucide-react';
import { TradeEntry } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TradeAnalyticsViewProps {
  trades: TradeEntry[];
}

export const TradeAnalyticsView: React.FC<TradeAnalyticsViewProps> = ({ trades }) => {
  const { isDark } = useTheme();

  // Compute Comprehensive Analytics
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        wins: 0,
        losses: 0,
        breakevens: 0,
        netPnL: 0,
        totalR: 0,
        profitFactor: 0,
        avgWinR: 0,
        avgLossR: 0,
        disciplineRate: 0,
        emotionalLeakagePnL: 0,
        disciplinedPnL: 0,
        bestSetup: 'None',
        worstSetup: 'None',
      };
    }

    const wins = trades.filter((t) => t.outcome === 'WIN');
    const losses = trades.filter((t) => t.outcome === 'LOSS');
    const breakevens = trades.filter((t) => t.outcome === 'BREAKEVEN');

    const netPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
    const totalR = trades.reduce((acc, t) => acc + t.rMultiple, 0);

    const grossProfit = wins.reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));
    const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

    const avgWinR = wins.length > 0 ? wins.reduce((acc, t) => acc + t.rMultiple, 0) / wins.length : 0;
    const avgLossR = losses.length > 0 ? Math.abs(losses.reduce((acc, t) => acc + t.rMultiple, 0)) / losses.length : 0;

    // Discipline & Emotional Leakage
    const disciplinedTrades = trades.filter(
      (t) => t.emotionalState === 'Disciplined' || t.emotionalState === 'Confident'
    );
    const emotionalTrades = trades.filter(
      (t) => t.emotionalState === 'FOMO' || t.emotionalState === 'Revenge' || t.emotionalState === 'Anxious'
    );

    const disciplinedPnL = disciplinedTrades.reduce((acc, t) => acc + t.pnl, 0);
    const emotionalLeakagePnL = emotionalTrades.reduce((acc, t) => acc + t.pnl, 0);

    const disciplineRate = (disciplinedTrades.length / trades.length) * 100;

    // Setup Performance
    const setupMap: Record<string, { wins: number; total: number; r: number }> = {};
    trades.forEach((t) => {
      if (!setupMap[t.setup]) setupMap[t.setup] = { wins: 0, total: 0, r: 0 };
      setupMap[t.setup].total += 1;
      setupMap[t.setup].r += t.rMultiple;
      if (t.outcome === 'WIN') setupMap[t.setup].wins += 1;
    });

    const setupList = Object.entries(setupMap).map(([setup, data]) => ({
      setup,
      winRate: (data.wins / data.total) * 100,
      totalR: data.r,
      total: data.total,
    }));

    setupList.sort((a, b) => b.totalR - a.totalR);
    const bestSetup = setupList[0]?.setup || 'None';
    const worstSetup = setupList[setupList.length - 1]?.setup || 'None';

    return {
      totalTrades: trades.length,
      winRate: (wins.length / trades.length) * 100,
      wins: wins.length,
      losses: losses.length,
      breakevens: breakevens.length,
      netPnL,
      totalR,
      profitFactor,
      avgWinR,
      avgLossR,
      disciplineRate,
      disciplinedPnL,
      emotionalLeakagePnL,
      bestSetup,
      worstSetup,
      setupList,
    };
  }, [trades]);

  // Generate Cumulative Equity Curve data
  const equityCurveData = useMemo(() => {
    // Chronological order
    const sorted = [...trades].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativePnL = 0;
    let cumulativeR = 0;

    return sorted.map((t, idx) => {
      cumulativePnL += t.pnl;
      cumulativeR += t.rMultiple;
      return {
        tradeIndex: `T${idx + 1}`,
        symbol: t.symbol,
        date: t.date,
        pnl: cumulativePnL,
        rMultiple: parseFloat(cumulativeR.toFixed(2)),
        tradePnl: t.pnl,
        setup: t.setup,
      };
    });
  }, [trades]);

  // Setup comparison chart data
  const setupChartData = useMemo(() => {
    if (!stats.setupList) return [];
    return stats.setupList.map((item) => ({
      name: item.setup,
      rMultiple: parseFloat(item.totalR.toFixed(1)),
      winRate: Math.round(item.winRate),
      trades: item.total,
    }));
  }, [stats]);

  // Mistakes count
  const mistakeCounts = useMemo(() => {
    const map: Record<string, { count: number; loss: number }> = {};
    trades.forEach((t) => {
      if (t.mistakeTag && t.mistakeTag !== 'None') {
        if (!map[t.mistakeTag]) map[t.mistakeTag] = { count: 0, loss: 0 };
        map[t.mistakeTag].count += 1;
        if (t.pnl < 0) map[t.mistakeTag].loss += Math.abs(t.pnl);
      }
    });
    return Object.entries(map).map(([tag, data]) => ({ tag, ...data }));
  }, [trades]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Net PnL */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-400 block mb-1">TOTAL NET PNL</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                stats.netPnL >= 0
                  ? isDark ? 'text-[#d4ff00]' : 'text-emerald-600'
                  : 'text-rose-500'
              }`}
            >
              {stats.netPnL >= 0 ? `+$${stats.netPnL.toLocaleString()}` : `-$${Math.abs(stats.netPnL).toLocaleString()}`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Account cumulative cash</span>
        </div>

        {/* 2. Cumulative R-Multiple */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-400 block mb-1">TOTAL R-MULTIPLE</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                stats.totalR >= 0 ? (isDark ? 'text-[#d4ff00]' : 'text-emerald-600') : 'text-rose-500'
              }`}
            >
              {stats.totalR >= 0 ? `+${stats.totalR.toFixed(1)}R` : `${stats.totalR.toFixed(1)}R`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Asymmetric risk units</span>
        </div>

        {/* 3. Win Rate */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-400 block mb-1">STRIKE RATE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono tracking-tight">
              {stats.winRate.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">({stats.wins}W / {stats.losses}L)</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Of {stats.totalTrades} logged trades</span>
        </div>

        {/* 4. Profit Factor */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-400 block mb-1">PROFIT FACTOR</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                stats.profitFactor >= 2.0 ? (isDark ? 'text-[#d4ff00]' : 'text-emerald-600') : 'text-amber-500'
              }`}
            >
              {stats.profitFactor.toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Gross Win / Gross Loss</span>
        </div>

        {/* 5. Avg Win / Loss Realized R */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-400 block mb-1">REWARD TO RISK</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black font-mono tracking-tight text-emerald-400">
              +{stats.avgWinR.toFixed(1)}R
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
            <span className="text-xl font-black font-mono tracking-tight text-rose-400">
              -{stats.avgLossR.toFixed(1)}R
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Average realization</span>
        </div>

        {/* 6. Discipline Score */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-card-dark' : 'liquid-glass-card-light'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-400 block mb-1">1% DISCIPLINE INDEX</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                stats.disciplineRate >= 80 ? (isDark ? 'text-[#d4ff00]' : 'text-emerald-600') : 'text-rose-400'
              }`}
            >
              {stats.disciplineRate.toFixed(0)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Zero FOMO adherence</span>
        </div>
      </div>

      {/* Chart 1: Cumulative Equity & R-Multiple Trajectory */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark ? 'liquid-glass-dark border-[#d4ff00]/20' : 'liquid-glass-light border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'}`} />
              <h3 className="text-lg font-black tracking-tight">Cumulative R-Multiple & Account Growth Curve</h3>
            </div>
            <p className="text-xs text-slate-400">
              Mathematical performance trajectory across closed executions. Eliminates random noise and tracks compound expectancy.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#d4ff00]' : 'bg-emerald-500'}`} />
              <span>Cumulative PnL ($)</span>
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurveData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? '#d4ff00' : '#10b981'} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={isDark ? '#d4ff00' : '#10b981'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 
                vertical={false} 
              />
              <XAxis 
                dataKey="tradeIndex" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                stroke={isDark ? '#334155' : '#cbd5e1'}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                stroke={isDark ? '#334155' : '#cbd5e1'}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0b101d' : '#ffffff',
                  borderColor: isDark ? '#d4ff00' : '#cbd5e1',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
                formatter={(val: any, name: any, item: any) => [
                  `$${Number(val).toLocaleString()} (${item.payload.rMultiple}R)`,
                  `${item.payload.symbol} (${item.payload.setup})`,
                ]}
                labelFormatter={(label) => `Trade Execution: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="pnl"
                stroke={isDark ? '#d4ff00' : '#10b981'}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#equityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row: Setup Edge Matrix + Emotional Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Setup Edge Matrix */}
        <div
          className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'liquid-glass-dark' : 'liquid-glass-light'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold flex items-center gap-2">
                <Target className={`w-4 h-4 ${isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}`} />
                Setup Edge Matrix (Expectancy by Strategy)
              </h4>
              <p className="text-xs text-slate-400">Total R-Multiples delivered by each playbook setup.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Best: {stats.bestSetup}
            </span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={setupChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `${val}R`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0b101d' : '#ffffff',
                    borderRadius: '12px',
                    borderColor: '#475569',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val}R generated`, 'Total Edge']}
                />
                <Bar dataKey="rMultiple" radius={[6, 6, 0, 0]}>
                  {setupChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rMultiple >= 0 ? (isDark ? '#d4ff00' : '#10b981') : '#f43f5e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Psychological Leakage & Emotional Cost Analyzer */}
        <div
          className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
            isDark ? 'liquid-glass-dark border-rose-500/20' : 'liquid-glass-light border-rose-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Emotional Cost Analyzer
                </h4>
                <p className="text-xs text-slate-400">
                  Direct dollar impact of trading with discipline vs. FOMO / Revenge.
                </p>
              </div>
            </div>

            {/* Disciplined vs Emotional Comparison Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  DISCIPLINED TRADES
                </span>
                <span className="text-xl font-black font-mono text-emerald-400 block">
                  +${stats.disciplinedPnL.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Strict system executions</span>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <span className="text-[11px] font-bold text-rose-400 block mb-1">
                  EMOTIONAL LEAKAGE
                </span>
                <span className="text-xl font-black font-mono text-rose-400 block">
                  {stats.emotionalLeakagePnL <= 0 ? `-$${Math.abs(stats.emotionalLeakagePnL).toLocaleString()}` : `+$${stats.emotionalLeakagePnL.toLocaleString()}`}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">FOMO & Revenge drain</span>
              </div>
            </div>

            {/* Calculated Psychological Tax */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-900/80 border-slate-700/70' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">1% Psychological Diagnosis:</span>
                <span className="text-slate-400">
                  {stats.emotionalLeakagePnL < 0
                    ? `Eliminating emotional impulse entries would immediately boost your bottom line by $${Math.abs(stats.emotionalLeakagePnL).toLocaleString()}.`
                    : 'Flawless mental equilibrium maintained. Zero emotional leakage detected across current session sample.'}
                </span>
              </div>
            </div>
          </div>

          {/* Top execution leaks */}
          {mistakeCounts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                Active Leaks Identified:
              </span>
              <div className="flex flex-wrap gap-2">
                {mistakeCounts.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono"
                  >
                    {m.tag}: {m.count}x (${m.loss.toLocaleString()} lost)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Algorithmic 1% Coach Advice Section */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all ${
          isDark ? 'liquid-glass-dark border-[#d4ff00]/30' : 'liquid-glass-light border-[#e05333]/30'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-black tracking-tight">The 1% Quantitative Execution Protocol</h4>
            <p className="text-xs text-slate-400">System recommendations mathematically inferred from your trade logs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Primary Profit Engine</span>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Your highest-expectancy setup is <strong>{stats.bestSetup}</strong>. Allocate 75% of your risk capital to this setup and decline lower-grade setups.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Asymmetric R Invariance</span>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Your average winning trade produces <strong>+{stats.avgWinR.toFixed(1)}R</strong> while your average loss is kept strictly to <strong>-{stats.avgLossR.toFixed(1)}R</strong>. Never risk more than 1.0R on any single execution.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1 text-purple-400">
              <Brain className="w-4 h-4" />
              <span>Session Invalidation</span>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Trading outside high-volume London/New York liquidity sweeps accounts for 80% of mental fatigue. Close all terminal tabs after 12:30 PM EST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
