import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserInsight } from '../types';

export const AlphaJournal: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [title, setTitle] = useState('');
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Firestore Real-time synchronization
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const path = `users/${user.uid}/insights`;
    const q = query(collection(db, path));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: UserInsight[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...(d.data() as Omit<UserInsight, 'id'>) });
        });
        // Sort descending by createdAt
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setInsights(list);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, path);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleCreateInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !symbol || !title) return;

    setSubmitError(null);
    try {
      const insightId = `insight_${Date.now()}`;
      const path = `users/${user.uid}/insights/${insightId}`;
      const docRef = doc(db, 'users', user.uid, 'insights', insightId);

      const newInsight: Omit<UserInsight, 'id'> = {
        userId: user.uid,
        symbol: symbol.toUpperCase().trim(),
        title: title.trim(),
        sentiment,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(docRef, newInsight);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }

      setSymbol('');
      setTitle('');
      setNotes('');
      setIsAdding(false);
    } catch (err: unknown) {
      console.error('Failed to create insight:', err);
      setSubmitError(err instanceof Error ? err.message : 'Error creating insight');
    }
  };

  const handleDeleteInsight = async (id: string) => {
    if (!user) return;
    try {
      const path = `users/${user.uid}/insights/${id}`;
      const docRef = doc(db, 'users', user.uid, 'insights', id);
      try {
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    } catch (err) {
      console.error('Failed to delete insight:', err);
    }
  };

  return (
    <div
      id="alpha-journal-container"
      className={`p-6 rounded-3xl transition-all duration-300 border ${
        isDark ? 'liquid-glass-dark border-slate-700/60' : 'liquid-glass-light border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold tracking-tight">
              My Proprietary Alpha Journal & Trade Notes
            </h3>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Private encrypted research log stored in your dedicated Firestore instance.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel Entry' : 'New Research Note'}</span>
        </button>
      </div>

      {/* New Note Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateInsight}
          className={`mb-6 p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-400">
                Asset Symbol (e.g., BTC, NVDA)
              </label>
              <input
                type="text"
                required
                maxLength={20}
                placeholder="BTC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-bold focus:outline-none uppercase ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-white focus:border-blue-500'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-slate-400">
                Thesis / Strategy Headline
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Dark pool accumulation into quarterly expiry"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-white focus:border-blue-500'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-2 text-slate-400">
              Conviction Bias
            </label>
            <div className="flex items-center gap-3">
              {(['bullish', 'neutral', 'bearish'] as const).map((sent) => (
                <button
                  key={sent}
                  type="button"
                  onClick={() => setSentiment(sent)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize flex items-center gap-1.5 transition-all cursor-pointer ${
                    sentiment === sent
                      ? sent === 'bullish'
                        ? 'bg-emerald-600 text-white'
                        : sent === 'bearish'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-600 text-white'
                      : isDark
                      ? 'bg-slate-900 text-slate-400 border border-slate-700'
                      : 'bg-white text-slate-600 border border-slate-300'
                  }`}
                >
                  {sent === 'bullish' && <TrendingUp className="w-3.5 h-3.5" />}
                  {sent === 'bearish' && <TrendingDown className="w-3.5 h-3.5" />}
                  {sent === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                  <span>{sent}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1 text-slate-400">
              Quantitative Observations & Risk Parameters
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="Observed order book skew favoring 94k calls. Stop target at 91.2k, invalidation upon gamma flip."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                isDark
                  ? 'bg-slate-900 border border-slate-700 text-white focus:border-blue-500'
                  : 'bg-white border border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>

          {submitError && (
            <div className="text-xs text-rose-400 mb-3 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
            >
              Save to Private Cloud
            </button>
          </div>
        </form>
      )}

      {/* List of Insights */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : insights.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-dashed border-slate-700/60 p-6">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-300 mb-1">
            No Private Journal Entries Yet
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Document your high-conviction trade setups, options greeks, and order book insights. Persisted securely to your account.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
          >
            Create First Alpha Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white/80 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.symbol}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      item.sentiment === 'bullish'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : item.sentiment === 'bearish'
                        ? 'bg-rose-500/15 text-rose-400'
                        : 'bg-slate-500/15 text-slate-400'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteInsight(item.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-sm font-bold mb-1">{item.title}</h4>

              {item.notes && (
                <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.notes}
                </p>
              )}

              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>Recorded: {new Date(item.createdAt).toLocaleDateString()}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Cloud Synced
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
