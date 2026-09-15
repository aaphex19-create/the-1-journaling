import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, X, CheckCircle2, Bell, Shield, ArrowRight } from 'lucide-react';
import { FreeBook } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ComingSoonBookModalProps {
  book: FreeBook | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonBookModal: React.FC<ComingSoonBookModalProps> = ({ book, isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);

  if (!isOpen || !book) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setRegistered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      {/* Liquid Glass Modal Box with Glowing Aura */}
      <div
        id="coming-soon-book-modal"
        className={`relative w-full max-w-xl rounded-3xl p-6 sm:p-8 border transition-all duration-500 overflow-hidden ${
          isDark
            ? 'liquid-glass-dark border-[#d4ff00]/40 coming-soon-glow text-white'
            : 'liquid-glass-light border-[#e05333]/40 shadow-2xl text-slate-900'
        }`}
      >
        {/* Radiant Ambient Backlight inside the modal */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40 transition-all">
          <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#d4ff00]/30' : 'bg-[#e05333]/30'}`} />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200 z-10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing "COMING SOON" Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border shadow-lg ${
              isDark
                ? 'bg-[#d4ff00]/15 text-[#d4ff00] border-[#d4ff00]/40 glow-lime-badge'
                : 'bg-[#e05333]/15 text-[#e05333] border-[#e05333]/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'}`} />
            <span>COMING SOON</span>
          </div>

          <span className="text-xs font-mono opacity-60 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {book.releaseDate}
          </span>
        </div>

        {/* Book Title & Subtitle */}
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
          {book.title}
        </h3>
        <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {book.subtitle}
        </p>

        {/* Liquid Glass Inner Synopsis Card */}
        <div
          className={`p-4 rounded-2xl border mb-6 ${
            isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="font-mono text-slate-400">Author: {book.author}</span>
            <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
              isDark ? 'bg-[#d4ff00]/10 text-[#d4ff00]' : 'bg-[#e05333]/10 text-[#e05333]'
            }`}>
              {book.pages} Pages • Digital + Audio
            </span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {book.description}
          </p>

          {/* Chapter Sneak Peek */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-slate-400">
              Curriculum Preview:
            </span>
            <ul className="space-y-1 text-xs">
              {book.chapters.slice(0, 3).map((ch, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className={isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}>•</span>
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Waitlist / Claim Free Notification Form */}
        {!registered ? (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter email to get notified first..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#e05333]'
                }`}
              />
              <button
                type="submit"
                className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
                  isDark
                    ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                    : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notify Me</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>100% Free Syndicate Book. Zero spam. Instant download link upon public drop.</span>
            </p>
          </form>
        ) : (
          <div
            className={`p-4 rounded-2xl border text-center animate-fade-in ${
              isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-bold text-sm mb-1">
              <CheckCircle2 className="w-5 h-5" />
              <span>You Are On The 1% VIP Early Access List!</span>
            </div>
            <p className="text-xs opacity-90">
              We will send the complete PDF & Audio edition to <strong>{email}</strong> the moment release unlocks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
