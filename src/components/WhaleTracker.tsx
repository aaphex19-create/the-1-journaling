import React, { useState } from 'react';
import { Shield, ArrowUpRight, ArrowDownRight, RefreshCw, Hash, DollarSign } from 'lucide-react';
import { WhaleTransaction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface WhaleTrackerProps {
  transactions: WhaleTransaction[];
}

export const WhaleTracker: React.FC<WhaleTrackerProps> = ({ transactions }) => {
  const { isDark } = useTheme();
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = filterType === 'All'
    ? transactions
    : transactions.filter((t) => t.type === filterType);

  return (
    <div
      id="whale-radar-container"
      className={`p-6 rounded-3xl transition-all duration-300 border ${
        isDark ? 'liquid-glass-dark border-slate-700/60' : 'liquid-glass-light border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold tracking-tight">
              Institutional Whale Radar & Dark Blocks
            </h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              BLOCK TICKER
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Direct telemetry from sovereign custody clusters, OTC desks, and prime brokerage flows.
          </p>
        </div>

        {/* Filter */}
        <div
          className={`p-1 rounded-xl flex items-center border ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(['All', 'Accumulation', 'Distribution', 'OTC Swap'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              type="button"
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filterType === type
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tx) => {
          const isAccumulation = tx.type === 'Accumulation';
          return (
            <div
              key={tx.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                isDark
                  ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                  : 'bg-white/80 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{tx.asset}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isAccumulation
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {tx.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {tx.entity} ({tx.entityType})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black font-mono text-emerald-400">
                    ${(tx.amountUsd / 1000000).toFixed(1)}M USD
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {tx.amountToken}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5 font-mono">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {tx.txHash}
                </span>
                <span>{tx.timestamp} • {tx.network}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
