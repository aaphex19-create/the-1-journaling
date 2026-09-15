import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BarChart3, 
  ListOrdered, 
  Sparkles, 
  Download, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  Brain,
  ShieldCheck,
  Calendar,
  CloudCheck,
  FolderOpen
} from 'lucide-react';
import { TradeEntry } from '../types';
import { INITIAL_JOURNAL_ENTRIES } from '../data/journalMockData';
import { TradeAnalyticsView } from './TradeAnalyticsView';
import { TradeLogTable } from './TradeLogTable';
import { CalendarPnLView } from './CalendarPnLView';
import { NewTradeModal } from './NewTradeModal';
import { QuoteBanner } from './QuoteBanner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

export const TradingJournal: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const storageKey = user ? `the1percent_trades_${user.uid}` : 'the1percent_trades_guest';

  // Start with clean user data - NO DEMO DATA by default
  const [trades, setTrades] = useState<TradeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading trades from storage:', e);
    }
    return []; // Empty by default
  });

  const [activeView, setActiveView] = useState<'analytics' | 'calendar' | 'history'>('calendar');
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!user || user.uid === 'guest_terminal_user') return;

    try {
      const tradesRef = collection(db, 'users', user.uid, 'trades');
      const unsubscribe = onSnapshot(tradesRef, (snapshot) => {
        const cloudTrades: TradeEntry[] = [];
        snapshot.forEach((d) => {
          cloudTrades.push({ ...d.data(), id: d.id } as TradeEntry);
        });

        // Sort by date descending
        cloudTrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (cloudTrades.length > 0) {
          setTrades(cloudTrades);
          localStorage.setItem(storageKey, JSON.stringify(cloudTrades));
        }
      }, (error) => {
        console.warn('Firestore snapshot listener notice:', error);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
    }
  }, [user, storageKey]);

  // Sync to local storage for instant offline / cache fallback
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(trades));
    } catch (e) {
      console.error('Error saving trades to localStorage:', e);
    }
  }, [trades, storageKey]);

  const handleAddTrade = async (newTradeData: Omit<TradeEntry, 'id' | 'createdAt'>) => {
    const newTradeId = `trade_${Date.now()}`;
    const newTrade: TradeEntry = {
      ...newTradeData,
      id: newTradeId,
      userId: user?.uid || 'guest',
      createdAt: new Date().toISOString(),
    };

    // Update local state immediately for zero-lag UI
    setTrades((prev) => [newTrade, ...prev]);

    // Persist to Firestore if user is authenticated with real account
    if (user && user.uid !== 'guest_terminal_user') {
      setIsSyncing(true);
      try {
        const tradeRef = doc(db, 'users', user.uid, 'trades', newTradeId);
        // Prepare clean payload (filter out undefined values)
        const payload: Record<string, any> = {
          id: newTrade.id,
          userId: user.uid,
          date: newTrade.date,
          symbol: newTrade.symbol,
          direction: newTrade.direction,
          timeframe: newTrade.timeframe,
          session: newTrade.session,
          setup: newTrade.setup,
          entryPrice: newTrade.entryPrice,
          exitPrice: newTrade.exitPrice,
          stopLoss: newTrade.stopLoss,
          positionSize: newTrade.positionSize,
          pnl: newTrade.pnl,
          rMultiple: newTrade.rMultiple,
          outcome: newTrade.outcome,
          emotionalState: newTrade.emotionalState,
          executionGrade: newTrade.executionGrade,
          mistakeTag: newTrade.mistakeTag,
          notes: newTrade.notes || '',
          lessons: newTrade.lessons || '',
          createdAt: newTrade.createdAt,
        };

        if (newTrade.attachments && newTrade.attachments.length > 0) {
          payload.attachments = newTrade.attachments;
        }

        await setDoc(tradeRef, payload);
      } catch (err) {
        console.error('Failed to persist trade to Firestore:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleDeleteTrade = async (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));

    if (user && user.uid !== 'guest_terminal_user') {
      try {
        const tradeRef = doc(db, 'users', user.uid, 'trades', id);
        await deleteDoc(tradeRef);
      } catch (err) {
        console.error('Failed to delete trade from Firestore:', err);
      }
    }
  };

  const handleLoadSampleData = () => {
    if (window.confirm('Load institutional sample trades to test analytics and calendar? You can clear them anytime.')) {
      setTrades(INITIAL_JOURNAL_ENTRIES);
    }
  };

  const handleClearAllTrades = () => {
    if (window.confirm('Are you sure you want to clear all trades? This cannot be undone.')) {
      setTrades([]);
      localStorage.removeItem(storageKey);
    }
  };

  const handleExportCSV = () => {
    if (trades.length === 0) {
      alert('No trades recorded yet to export.');
      return;
    }
    const headers = ['Date', 'Symbol', 'Direction', 'Setup', 'Session', 'Entry', 'Exit', 'StopLoss', 'PnL', 'RMultiple', 'Outcome', 'Emotion', 'Grade', 'MistakeTag', 'Notes'];
    const rows = trades.map((t) => [
      t.date,
      t.symbol,
      t.direction,
      t.setup,
      t.session,
      t.entryPrice,
      t.exitPrice,
      t.stopLoss,
      t.pnl,
      t.rMultiple,
      t.outcome,
      t.emotionalState,
      t.executionGrade,
      t.mistakeTag,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_1_percent_journal_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Daily Mindset Quote Banner */}
      <QuoteBanner />

      {/* Top Header & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30 glow-lime-badge'
                  : 'bg-[#e05333]/10 text-[#e05333] border-[#e05333]/30'
              }`}
            >
              Systematic Edge
            </span>
            <span className="text-xs font-mono text-slate-400">
              {trades.length} Closed Executions
            </span>
            {user && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cloud Saved
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            The 1% Quantitative Journal
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Extremely helpful execution analytics, asymmetric calendar PnL, and screenshot/video proof logging.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Toggle Tabs */}
          <div className="flex p-1 rounded-2xl border border-white/10 bg-slate-900/40 text-xs font-bold">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                activeView === 'calendar'
                  ? isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar PnL</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                activeView === 'analytics'
                  ? isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                activeView === 'history'
                  ? isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Logs ({trades.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            title="Export CSV"
            className={`p-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Download className="w-4 h-4" />
          </button>

          {trades.length === 0 ? (
            <button
              type="button"
              onClick={handleLoadSampleData}
              title="Load Sample Demo Trades"
              className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Demo Preview
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClearAllTrades}
              title="Clear All Trades"
              className={`p-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all text-slate-400 hover:text-rose-400 ${
                isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-300 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            id="log-new-trade-button"
            type="button"
            onClick={() => setIsNewTradeModalOpen(true)}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Log Trade</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {trades.length === 0 ? (
        <div
          className={`p-10 rounded-3xl border text-center space-y-4 ${
            isDark ? 'liquid-glass-dark border-slate-800' : 'liquid-glass-light border-slate-200'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-3xl mx-auto flex items-center justify-center font-bold ${
              isDark ? 'bg-[#d4ff00]/15 text-[#d4ff00]' : 'bg-[#e05333]/15 text-[#e05333]'
            }`}
          >
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Your Journal is Clean & Ready</h3>
            <p className={`text-xs max-w-md mx-auto mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Demo data has been removed. Every trade you log will be safely saved in your personal database with attached screenshot and video proof.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsNewTradeModalOpen(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                isDark
                  ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                  : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
              }`}
            >
              + Log Your First Trade
            </button>
            <button
              onClick={handleLoadSampleData}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Preview Sample Trades
            </button>
          </div>
        </div>
      ) : activeView === 'calendar' ? (
        <div className="space-y-8">
          <CalendarPnLView trades={trades} />
          <TradeLogTable trades={trades.slice(0, 5)} onDeleteTrade={handleDeleteTrade} />
        </div>
      ) : activeView === 'analytics' ? (
        <div className="space-y-8">
          <TradeAnalyticsView trades={trades} />
          <TradeLogTable trades={trades.slice(0, 5)} onDeleteTrade={handleDeleteTrade} />
        </div>
      ) : (
        <TradeLogTable trades={trades} onDeleteTrade={handleDeleteTrade} />
      )}

      {/* New Trade Modal */}
      <NewTradeModal
        isOpen={isNewTradeModalOpen}
        onClose={() => setIsNewTradeModalOpen(false)}
        onAddTrade={handleAddTrade}
      />
    </div>
  );
};

