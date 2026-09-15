import React, { useState } from 'react';
import { Quote, RefreshCw, Bookmark, Sparkles } from 'lucide-react';
import { TRADING_QUOTES } from '../data/quotesAndBooksData';
import { useTheme } from '../context/ThemeContext';

export const QuoteBanner: React.FC = () => {
  const { isDark } = useTheme();
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = TRADING_QUOTES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % TRADING_QUOTES.length);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${current.quote}" - ${current.author}, ${current.bookOrRole}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      id="daily-mindset-quote-container"
      className={`relative p-6 sm:p-7 rounded-3xl transition-all duration-300 border overflow-hidden ${
        isDark
          ? 'liquid-glass-dark border-[#d4ff00]/20'
          : 'liquid-glass-light border-[#e05333]/20'
      }`}
    >
      {/* Background Accent Gradient */}
      <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20">
        <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'}`} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isDark
                ? 'bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/30'
                : 'bg-[#e05333]/15 text-[#e05333] border border-[#e05333]/30'
            }`}
          >
            <Quote className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-[#d4ff00]'
                    : 'bg-slate-100 border-slate-200 text-[#e05333]'
                }`}
              >
                1% MINDSET PRINCIPLE • {current.category}
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold italic leading-relaxed max-w-3xl mb-2">
              "{current.quote}"
            </p>

            <div className="text-xs font-mono text-slate-400">
              <span className="font-bold text-slate-300">{current.author}</span>
              <span className="mx-1.5">•</span>
              <span>{current.bookOrRole}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className={`p-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Copy Quote"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isDark
                ? 'bg-[#d4ff00]/15 hover:bg-[#d4ff00]/25 text-[#d4ff00] border border-[#d4ff00]/30'
                : 'bg-[#e05333]/15 hover:bg-[#e05333]/25 text-[#e05333] border border-[#e05333]/30'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
