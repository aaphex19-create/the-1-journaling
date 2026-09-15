import React, { useState } from 'react';
import { Quote, Sparkles, Bookmark, Share2, Check } from 'lucide-react';
import { TRADING_QUOTES } from '../data/quotesAndBooksData';
import { TradingQuote } from '../types';
import { useTheme } from '../context/ThemeContext';

export const MindsetQuotesSection: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['ALL', 'Market Psychology', 'Discipline', 'Risk Management', 'Patience', 'Execution'];

  const filteredQuotes = selectedCategory === 'ALL'
    ? TRADING_QUOTES
    : TRADING_QUOTES.filter((q) => q.category === selectedCategory);

  const handleCopy = (quote: TradingQuote) => {
    navigator.clipboard.writeText(`"${quote.quote}" — ${quote.author}, ${quote.bookOrRole}`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30 glow-lime-badge'
                  : 'bg-[#e05333]/10 text-[#e05333] border-[#e05333]/30'
              }`}
            >
              Mental Capital
            </span>
            <span className="text-xs font-mono text-slate-400">
              {TRADING_QUOTES.length} Curated Principles
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            1% Trader Mindset & Stoic Philosophy
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Wisdom from legendary market operators, cognitive psychologists, and stoic philosophers.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border border-white/10 bg-slate-900/40 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                selectedCategory === cat
                  ? isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuotes.map((q) => {
          const isCopied = copiedId === q.id;
          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative group ${
                isDark
                  ? 'liquid-glass-dark hover:border-[#d4ff00]/40'
                  : 'liquid-glass-light hover:border-[#e05333]/40 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-[#d4ff00]'
                        : 'bg-slate-100 border-slate-200 text-[#e05333]'
                    }`}
                  >
                    {q.category}
                  </span>

                  <button
                    onClick={() => handleCopy(q)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Quote"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-base sm:text-lg font-semibold italic leading-relaxed mb-6">
                  "{q.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">{q.author}</h4>
                  <span className="text-xs text-slate-400 font-mono">{q.bookOrRole}</span>
                </div>
                <Quote className={`w-6 h-6 opacity-20 ${isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
