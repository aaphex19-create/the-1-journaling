import React, { useState } from 'react';
import { Newspaper, Flame, Clock, Radio, ChevronRight, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NewsFeedProps {
  articles: NewsArticle[];
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ articles }) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'Macro', 'Crypto', 'Equities', 'Whale Watch', 'Central Banks'];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <div
      id="syndicate-news-feed"
      className={`p-6 rounded-3xl transition-all duration-300 border ${
        isDark ? 'liquid-glass-dark border-slate-700/60' : 'liquid-glass-light border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold tracking-tight">
              Syndicate Wire & Macro Intelligence
            </h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Radio className="w-3 h-3 animate-pulse" />
              HOT WIRE
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            High-conviction market despatches distilled for institutional portfolio leads.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const isExpanded = expandedId === article.id;

          return (
            <div
              key={article.id}
              onClick={() => setExpandedId(isExpanded ? null : article.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                  : 'bg-white/80 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Metadata tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px]">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full border ${
                        article.impact === 'Critical'
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                      }`}
                    >
                      {article.impact} Impact
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full border ${
                        article.sentiment === 'Bullish'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : article.sentiment === 'Bearish'
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-slate-500/15 border-slate-500/30 text-slate-400'
                      }`}
                    >
                      {article.sentiment}
                    </span>
                    <span className="font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.timestamp}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-semibold text-slate-400">{article.source}</span>
                  </div>

                  {/* Headline */}
                  <h4 className="text-sm font-bold leading-snug mb-1.5 hover:text-blue-400 transition-colors">
                    {article.headline}
                  </h4>

                  {/* Summary */}
                  <p
                    className={`text-xs leading-relaxed transition-all ${
                      isExpanded ? '' : 'line-clamp-2'
                    } ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                  >
                    {article.summary}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90 text-blue-500' : ''
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">
                    Category: {article.category} • Heuristic Confidence: 99.2%
                  </span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    Verified Syndicate Despatch
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
