import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  Camera, 
  Video, 
  ExternalLink, 
  Award,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { TradeEntry } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CalendarPnLViewProps {
  trades: TradeEntry[];
  onSelectTrade?: (trade: TradeEntry) => void;
}

export const CalendarPnLView: React.FC<CalendarPnLViewProps> = ({ trades }) => {
  const { isDark } = useTheme();

  // Selected Year & Month (default to current or latest trade's date)
  const [currentDate, setCurrentDate] = useState(() => {
    if (trades.length > 0) {
      // Find latest trade date
      const latestDateStr = trades[0].date;
      const parsed = new Date(latestDateStr);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });

  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string; type: string } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayStr(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayStr(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDayStr(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group trades by date string YYYY-MM-DD
  const tradesByDate = useMemo(() => {
    const map = new Map<string, TradeEntry[]>();
    trades.forEach((t) => {
      // Standardize date to YYYY-MM-DD
      let dateKey = t.date;
      if (t.date.includes('T')) {
        dateKey = t.date.split('T')[0];
      }
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(t);
    });
    return map;
  }, [trades]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
    // Adjust so week starts on Monday (0 = Mon, 6 = Sun)
    const adjustedFirstDay = (firstDayIndex + 6) % 7;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      trades: TradeEntry[];
      netPnL: number;
      netR: number;
      wins: number;
      losses: number;
      hasMedia: boolean;
    }[] = [];

    // Previous month padding days
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        trades: [],
        netPnL: 0,
        netR: 0,
        wins: 0,
        losses: 0,
        hasMedia: false,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayTrades = tradesByDate.get(dateStr) || [];
      const netPnL = dayTrades.reduce((acc, t) => acc + t.pnl, 0);
      const netR = dayTrades.reduce((acc, t) => acc + t.rMultiple, 0);
      const wins = dayTrades.filter((t) => t.outcome === 'WIN').length;
      const losses = dayTrades.filter((t) => t.outcome === 'LOSS').length;
      const hasMedia = dayTrades.some((t) => t.attachments && t.attachments.length > 0);

      days.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: true,
        trades: dayTrades,
        netPnL,
        netR,
        wins,
        losses,
        hasMedia,
      });
    }

    // Next month padding to fill complete grid of 35 or 42 cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        trades: [],
        netPnL: 0,
        netR: 0,
        wins: 0,
        losses: 0,
        hasMedia: false,
      });
    }

    return days;
  }, [year, month, tradesByDate]);

  // Monthly aggregated statistics
  const monthStats = useMemo(() => {
    const currentMonthDays = calendarDays.filter((d) => d.isCurrentMonth && d.trades.length > 0);
    const totalTrades = currentMonthDays.reduce((acc, d) => acc + d.trades.length, 0);
    const netPnL = currentMonthDays.reduce((acc, d) => acc + d.netPnL, 0);
    const netR = currentMonthDays.reduce((acc, d) => acc + d.netR, 0);
    const totalWins = currentMonthDays.reduce((acc, d) => acc + d.wins, 0);
    const totalLosses = currentMonthDays.reduce((acc, d) => acc + d.losses, 0);
    const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;
    const greenDays = currentMonthDays.filter((d) => d.netPnL > 0).length;
    const redDays = currentMonthDays.filter((d) => d.netPnL < 0).length;

    let bestDay = currentMonthDays.length > 0 ? currentMonthDays[0] : null;
    let worstDay = currentMonthDays.length > 0 ? currentMonthDays[0] : null;

    currentMonthDays.forEach((d) => {
      if (!bestDay || d.netPnL > bestDay.netPnL) bestDay = d;
      if (!worstDay || d.netPnL < worstDay.netPnL) worstDay = d;
    });

    return {
      totalTrades,
      netPnL,
      netR,
      winRate,
      greenDays,
      redDays,
      tradingDays: currentMonthDays.length,
      bestDay,
      worstDay,
    };
  }, [calendarDays]);

  const selectedDayData = useMemo(() => {
    if (!selectedDayStr) return null;
    return calendarDays.find((d) => d.dateStr === selectedDayStr) || null;
  }, [selectedDayStr, calendarDays]);

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 p-6 sm:p-8 space-y-6 ${
        isDark ? 'liquid-glass-dark border-slate-700/60' : 'liquid-glass-light border-slate-200 shadow-xl'
      }`}
    >
      {/* Calendar Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className={`w-5 h-5 ${isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}`} />
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Calendar PnL Analyzer
            </h3>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track daily expectancy, win consistency, and document confluences across calendar trading sessions.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Today
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono font-black text-sm sm:text-base px-2 min-w-[140px] text-center">
              {monthNames[month].toUpperCase()} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Monthly PnL</span>
          <span
            className={`text-lg font-black font-mono ${
              monthStats.netPnL >= 0
                ? isDark ? 'text-[#d4ff00]' : 'text-emerald-600'
                : 'text-rose-500'
            }`}
          >
            {monthStats.netPnL >= 0 ? `+$${monthStats.netPnL.toLocaleString()}` : `-$${Math.abs(monthStats.netPnL).toLocaleString()}`}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Realized Edge</span>
          <span
            className={`text-lg font-black font-mono ${
              monthStats.netR >= 0 ? isDark ? 'text-[#d4ff00]' : 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {monthStats.netR >= 0 ? `+${monthStats.netR.toFixed(1)}R` : `${monthStats.netR.toFixed(1)}R`}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Month Win Rate</span>
          <span className="text-lg font-black font-mono">
            {monthStats.winRate.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {monthStats.totalTrades} Executions
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Green / Red Days</span>
          <div className="flex items-center gap-2 font-mono font-bold text-sm mt-1">
            <span className="text-emerald-400">{monthStats.greenDays}W</span>
            <span className="text-slate-500">/</span>
            <span className="text-rose-400">{monthStats.redDays}L</span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Best Day</span>
          <span className="text-sm font-bold font-mono text-emerald-400 truncate block">
            {monthStats.bestDay && monthStats.bestDay.netPnL > 0
              ? `+$${monthStats.bestDay.netPnL.toLocaleString()}`
              : '—'}
          </span>
          <span className="text-[9px] text-slate-500 block font-mono">
            {monthStats.bestDay ? monthStats.bestDay.dateStr : ''}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Worst Day</span>
          <span className="text-sm font-bold font-mono text-rose-400 truncate block">
            {monthStats.worstDay && monthStats.worstDay.netPnL < 0
              ? `-$${Math.abs(monthStats.worstDay.netPnL).toLocaleString()}`
              : '—'}
          </span>
          <span className="text-[9px] text-slate-500 block font-mono">
            {monthStats.worstDay ? monthStats.worstDay.dateStr : ''}
          </span>
        </div>
      </div>

      {/* Weekday Table Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div className="text-slate-500">Sat</div>
        <div className="text-slate-500">Sun</div>
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((d, index) => {
          const hasTrades = d.trades.length > 0;
          const isGreen = d.netPnL > 0;
          const isRed = d.netPnL < 0;
          const isSelected = selectedDayStr === d.dateStr;

          return (
            <div
              key={index}
              onClick={() => {
                if (hasTrades) {
                  setSelectedDayStr(isSelected ? null : d.dateStr);
                }
              }}
              className={`min-h-[78px] sm:min-h-[96px] rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 border relative ${
                !d.isCurrentMonth
                  ? 'opacity-25 pointer-events-none border-transparent'
                  : hasTrades
                  ? isSelected
                    ? isDark
                      ? 'border-[#d4ff00] bg-[#d4ff00]/15 shadow-[0_0_20px_rgba(212,255,0,0.25)]'
                      : 'border-[#e05333] bg-[#e05333]/10 shadow-md'
                    : isGreen
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-[#d4ff00]/60 cursor-pointer'
                      : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 cursor-pointer'
                    : isRed
                    ? isDark
                      ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400 cursor-pointer'
                      : 'bg-rose-50 border-rose-200 hover:border-rose-400 cursor-pointer'
                    : isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                  : isDark
                  ? 'bg-slate-900/20 border-white/5 text-slate-500'
                  : 'bg-slate-50 border-slate-200/60 text-slate-400'
              }`}
            >
              {/* Day Number and Media indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isSelected
                      ? isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'
                      : d.isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {d.dayNumber}
                </span>

                {d.hasMedia && (
                  <span
                    className="p-0.5 rounded bg-blue-500/20 text-blue-400"
                    title="Trade screenshot/video attached"
                  >
                    <Camera className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Day Metrics */}
              {hasTrades ? (
                <div className="mt-1 space-y-0.5">
                  <div
                    className={`font-mono font-black text-xs sm:text-sm tracking-tight ${
                      isGreen
                        ? isDark ? 'text-[#d4ff00]' : 'text-emerald-700'
                        : isRed
                        ? 'text-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {d.netPnL >= 0 ? `+$${d.netPnL.toLocaleString()}` : `-$${Math.abs(d.netPnL).toLocaleString()}`}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{d.netR >= 0 ? `+${d.netR.toFixed(1)}R` : `${d.netR.toFixed(1)}R`}</span>
                    <span className="hidden sm:inline">
                      {d.wins}W • {d.losses}L
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Drilldown Drawer */}
      {selectedDayData && selectedDayData.trades.length > 0 && (
        <div
          className={`p-5 rounded-3xl border transition-all animate-fade-in ${
            isDark ? 'bg-slate-900/90 border-[#d4ff00]/30' : 'bg-white border-[#e05333]/30 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedDayData.netPnL >= 0 ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <h4 className="font-bold text-sm">
                Execution Logs for {selectedDayData.dateStr}
              </h4>
              <span className="text-xs font-mono text-slate-400">
                ({selectedDayData.trades.length} trades • Net{' '}
                {selectedDayData.netPnL >= 0 ? `+$${selectedDayData.netPnL.toLocaleString()}` : `-$${Math.abs(selectedDayData.netPnL).toLocaleString()}`})
              </span>
            </div>
            <button
              onClick={() => setSelectedDayStr(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {selectedDayData.trades.map((trade) => (
              <div
                key={trade.id}
                className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`font-mono font-black text-xs px-2.5 py-1 rounded-xl ${
                      trade.direction === 'LONG'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {trade.direction} {trade.symbol}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{trade.setup}</span>
                      <span className="text-[10px] font-mono text-slate-400">({trade.session})</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 font-mono">
                        Grade {trade.executionGrade}
                      </span>
                    </div>
                    {trade.notes && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{trade.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* PnL & R-Multiple */}
                  <div className="text-right font-mono">
                    <span
                      className={`font-black text-sm block ${
                        trade.pnl >= 0 ? isDark ? 'text-[#d4ff00]' : 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {trade.pnl >= 0 ? `+$${trade.pnl.toLocaleString()}` : `-$${Math.abs(trade.pnl).toLocaleString()}`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {trade.rMultiple >= 0 ? `+${trade.rMultiple.toFixed(1)}R` : `${trade.rMultiple.toFixed(1)}R`}
                    </span>
                  </div>

                  {/* Document / Screenshot Attachments Preview */}
                  {trade.attachments && trade.attachments.length > 0 && (
                    <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                      {trade.attachments.map((att) => (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => setPreviewAttachment(att)}
                          className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 cursor-pointer transition-all hover:scale-105 ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-[#d4ff00]'
                              : 'bg-white border-slate-300 text-[#e05333]'
                          }`}
                          title={`View ${att.name}`}
                        >
                          {att.type === 'video' ? (
                            <Video className="w-3.5 h-3.5" />
                          ) : att.type === 'link' ? (
                            <ExternalLink className="w-3.5 h-3.5" />
                          ) : (
                            <Camera className="w-3.5 h-3.5" />
                          )}
                          <span className="hidden sm:inline text-[10px] font-mono">Proof</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
