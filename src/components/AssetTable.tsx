import React, { useState } from 'react';
import { Search, Star, ArrowUpRight, ArrowDownRight, Filter, ExternalLink } from 'lucide-react';
import { MarketAsset } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AssetTableProps {
  assets: MarketAsset[];
  onSelectAsset?: (asset: MarketAsset) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onSelectAsset }) => {
  const { userProfile, toggleWatchlistSymbol } = useAuth();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'crypto' | 'equity' | 'commodity' | 'watchlist'>('all');

  const watchlist = userProfile?.watchlist || [];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'watchlist') {
      return watchlist.includes(asset.symbol);
    }
    if (filterCategory !== 'all') {
      return asset.category === filterCategory;
    }
    return true;
  });

  return (
    <div
      id="asset-terminal-table"
      className={`p-6 rounded-3xl transition-all duration-300 border ${
        isDark ? 'liquid-glass-dark border-slate-700/60' : 'liquid-glass-light border-slate-200'
      }`}
    >
      {/* Top search & category filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Institutional Cross-Market Watch
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time multi-asset terminal quotes with institutional flow telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter asset or ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500'
                  : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div
            className={`p-1 rounded-xl flex items-center border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {(['all', 'watchlist', 'crypto', 'equity', 'commodity'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                type="button"
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'watchlist' ? `★ Watch (${watchlist.length})` : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`text-[11px] font-semibold uppercase tracking-wider border-b ${
                isDark ? 'border-slate-700/60 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <th className="py-3 px-3 w-10">★</th>
              <th className="py-3 px-3">Asset</th>
              <th className="py-3 px-3 text-right">Price (USD)</th>
              <th className="py-3 px-3 text-right">24h Delta</th>
              <th className="py-3 px-3 text-right hidden md:table-cell">24h Range</th>
              <th className="py-3 px-3 text-right hidden sm:table-cell">Volume (24h)</th>
              <th className="py-3 px-3 text-right">Institutional Flow</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-medium">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                  No assets found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isFavorite = watchlist.includes(asset.symbol);
                const isPositive = asset.change24h >= 0;

                return (
                  <tr
                    key={asset.symbol}
                    className={`transition-colors duration-150 cursor-pointer ${
                      isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => onSelectAsset?.(asset)}
                  >
                    {/* Star favorite toggle button */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlistSymbol(asset.symbol);
                        }}
                        className="p-1 rounded-md cursor-pointer hover:scale-110 transition-transform"
                        title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isFavorite
                              ? 'text-amber-400 fill-amber-400'
                              : isDark
                              ? 'text-slate-600 hover:text-slate-400'
                              : 'text-slate-300 hover:text-slate-500'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                            isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{asset.symbol}</span>
                            <span className="text-[10px] font-mono font-normal opacity-60 uppercase">
                              {asset.category}
                            </span>
                          </div>
                          <div className={`text-[11px] truncate max-w-[120px] sm:max-w-none ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-sm">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h Range */}
                    <td className="py-3 px-3 text-right font-mono text-[11px] hidden md:table-cell text-slate-400">
                      <div>${asset.high24h.toLocaleString()} H</div>
                      <div>${asset.low24h.toLocaleString()} L</div>
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3 px-3 text-right font-mono hidden sm:table-cell">
                      {asset.volume24h}
                    </td>

                    {/* Institutional Flow Status */}
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          asset.institutionalFlow === 'Strong Inflow'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : asset.institutionalFlow === 'Mild Inflow'
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                            : asset.institutionalFlow === 'Outflow'
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            : 'bg-slate-500/15 border-slate-500/30 text-slate-400'
                        }`}
                      >
                        {asset.institutionalFlow}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
