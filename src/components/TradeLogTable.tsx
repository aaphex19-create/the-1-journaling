import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  Camera,
  Video,
  ExternalLink,
  X
} from 'lucide-react';
import { TradeEntry, TradeAttachment } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TradeLogTableProps {
  trades: TradeEntry[];
  onDeleteTrade: (id: string) => void;
}

export const TradeLogTable: React.FC<TradeLogTableProps> = ({ trades, onDeleteTrade }) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<TradeAttachment | null>(null);

  const filteredTrades = trades.filter((t) => {
    const matchesSearch = 
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.setup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOutcome = outcomeFilter === 'ALL' || t.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`rounded-3xl border transition-all overflow-hidden ${
        isDark ? 'liquid-glass-dark' : 'liquid-glass-light'
      }`}
    >
      {/* Controls Bar */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black tracking-tight">Execution Journal History</h3>
          <p className="text-xs text-slate-400">
            {filteredTrades.length} recorded trade logs with complete setup confluence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticker, setup, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none ${
                isDark
                  ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Outcome Filter */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 p-0.5 bg-slate-900/30 text-xs">
            <button
              onClick={() => setOutcomeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                outcomeFilter === 'ALL'
                  ? isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                  : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setOutcomeFilter('WIN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                outcomeFilter === 'WIN'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400'
              }`}
            >
              Wins
            </button>
            <button
              onClick={() => setOutcomeFilter('LOSS')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                outcomeFilter === 'LOSS'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400'
              }`}
            >
              Losses
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              className={`border-b font-mono uppercase tracking-wider text-[10px] ${
                isDark ? 'border-slate-800 text-slate-400 bg-slate-900/40' : 'border-slate-200 text-slate-500 bg-slate-50'
              }`}
            >
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Asset / Pair</th>
              <th className="py-3 px-4">Direction</th>
              <th className="py-3 px-4">Setup</th>
              <th className="py-3 px-4">Realized PnL</th>
              <th className="py-3 px-4">R-Multiple</th>
              <th className="py-3 px-4">Psychology</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTrades.map((t) => {
              const isExpanded = expandedId === t.id;
              return (
                <React.Fragment key={t.id}>
                  <tr
                    onClick={() => toggleExpand(t.id)}
                    className={`transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {t.date}
                    </td>

                    <td className="py-3.5 px-4 font-bold font-mono">
                      {t.symbol}
                      <span className="text-[10px] font-normal text-slate-500 ml-1.5">
                        ({t.timeframe})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded ${
                          t.direction === 'LONG'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {t.direction === 'LONG' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{t.direction}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium">
                      <span>{t.setup}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {t.session}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-black">
                      <span
                        className={
                          t.pnl >= 0
                            ? isDark ? 'text-[#d4ff00]' : 'text-emerald-600'
                            : 'text-rose-500'
                        }
                      >
                        {t.pnl >= 0 ? `+$${t.pnl.toLocaleString()}` : `-$${Math.abs(t.pnl).toLocaleString()}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          t.rMultiple >= 0
                            ? isDark ? 'bg-[#d4ff00]/15 text-[#d4ff00]' : 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {t.rMultiple >= 0 ? `+${t.rMultiple.toFixed(1)}R` : `${t.rMultiple.toFixed(1)}R`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          t.emotionalState === 'Disciplined' || t.emotionalState === 'Confident'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}
                      >
                        {t.emotionalState}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-black">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          t.executionGrade === 'A+' || t.executionGrade === 'A'
                            ? isDark ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {t.executionGrade}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(t.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTrade(t.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                          title="Delete trade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Trade Reflection Drawer */}
                  {isExpanded && (
                    <tr className={isDark ? 'bg-slate-900/60' : 'bg-slate-50'}>
                      <td colSpan={9} className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div
                            className={`p-3.5 rounded-2xl border ${
                              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <span className="font-mono text-[10px] uppercase text-slate-400 block mb-1">
                              Execution Levels
                            </span>
                            <div className="space-y-1 font-mono">
                              <div>Entry: <strong>${t.entryPrice.toLocaleString()}</strong></div>
                              <div>Exit: <strong>${t.exitPrice.toLocaleString()}</strong></div>
                              <div>Stop Loss: <strong>${t.stopLoss.toLocaleString()}</strong></div>
                            </div>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl border ${
                              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <span className="font-mono text-[10px] uppercase text-slate-400 block mb-1">
                              Technical Notes
                            </span>
                            <p className="leading-relaxed">{t.notes || 'No notes logged for this entry.'}</p>
                            {t.mistakeTag && t.mistakeTag !== 'None' && (
                              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                                Leak: {t.mistakeTag}
                              </span>
                            )}
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl border ${
                              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <span className="font-mono text-[10px] uppercase text-slate-400 block mb-1">
                              Psychological Reflection
                            </span>
                            <p className="italic leading-relaxed text-slate-300">
                              "{t.lessons || 'Standard plan execution without emotional interference.'}"
                            </p>
                          </div>
                        </div>

                        {/* Trade Proof & Media Attachments */}
                        {t.attachments && t.attachments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/5">
                            <span className="font-mono text-[10px] uppercase text-slate-400 block mb-2">
                              Execution Proof & Media Attachments ({t.attachments.length})
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {t.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewAttachment(att);
                                  }}
                                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all hover:scale-102 ${
                                    isDark ? 'bg-slate-950/90 border-slate-800 hover:border-[#d4ff00]' : 'bg-white border-slate-300 hover:border-[#e05333]'
                                  }`}
                                >
                                  {att.type === 'video' ? (
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                      <Video className="w-5 h-5" />
                                    </div>
                                  ) : att.type === 'image' ? (
                                    <img
                                      src={att.url}
                                      alt={att.name}
                                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                      <ExternalLink className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="truncate text-left">
                                    <span className="font-bold block text-xs truncate">{att.name}</span>
                                    <span className="text-[10px] font-mono text-slate-400 block">Click to expand</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filteredTrades.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 text-xs font-mono">
                  No trades found matching query. Click "+ Log Trade" to record your execution.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] rounded-3xl p-6 border overflow-hidden flex flex-col ${
              isDark ? 'liquid-glass-dark border-[#d4ff00]/40 text-white' : 'liquid-glass-light border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="font-mono text-xs font-bold truncate">
                Attachment: {previewAttachment.name}
              </span>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-black/40 rounded-2xl p-2 min-h-[300px]">
              {previewAttachment.type === 'video' ? (
                <video
                  src={previewAttachment.url}
                  controls
                  className="max-h-[70vh] rounded-xl max-w-full"
                />
              ) : previewAttachment.type === 'link' ? (
                <div className="text-center p-8">
                  <ExternalLink className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                  <p className="text-sm font-bold mb-3">{previewAttachment.url}</p>
                  <a
                    href={previewAttachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white inline-block"
                  >
                    Open External Chart Link
                  </a>
                </div>
              ) : (
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-h-[70vh] object-contain rounded-xl max-w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
