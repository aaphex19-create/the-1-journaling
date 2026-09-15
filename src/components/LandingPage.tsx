import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Award,
  ChevronRight,
  BarChart2,
  Calendar,
  Download,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { AphexCapitalFooter } from './AphexCapitalFooter';
import { AndroidApkSection } from './AndroidApkSection';
import { ApkDownloadModal } from './ApkDownloadModal';
import { FreeOfferings3DShowcase } from './FreeOfferings3DShowcase';
import { EthiopianFlag } from './EthiopianFlag';
import { downloadApkDirect, APK_DETAILS } from '../utils/apkDownloader';

export const LandingPage: React.FC = () => {
  const { signInWithGoogle, loading, authError } = useAuth();
  const { isDark } = useTheme();
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const handleDownloadApk = () => {
    setIsApkModalOpen(true);
    downloadApkDirect();
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'dark-grid-canvas text-slate-100' : 'light-ivory-canvas text-slate-900'
      }`}
    >
      {/* Top Ambient Glow Orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[550px] rounded-full blur-[140px] opacity-35 transition-all duration-700 ${
            isDark ? 'bg-[#d4ff00]/15' : 'bg-[#e05333]/15'
          }`}
        />
        <div
          className={`absolute top-[40%] -right-20 w-[550px] h-[550px] rounded-full blur-[160px] opacity-25 transition-all duration-700 ${
            isDark ? 'bg-[#d4ff00]/10' : 'bg-[#e05333]/10'
          }`}
        />
      </div>

      {/* Top Navigation Bar */}
      <header
        id="landing-header"
        className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all duration-300 border-b ${
          isDark
            ? 'bg-[#070a12]/80 border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[#f7f7f5]/85 border-slate-200/90 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black tracking-tighter text-base shadow-md transition-all duration-300 ${
                isDark
                  ? 'bg-[#d4ff00] text-[#070a12] glow-lime-badge'
                  : 'bg-[#181e28] text-white shadow-md'
              }`}
            >
              1%
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`}>
                THE 1%
              </span>
              <span
                className={`text-[9px] tracking-[0.2em] font-black uppercase flex items-center gap-1 ${
                  isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'
                }`}
              >
                Made by APHEX CAPITAL
              </span>
            </div>

            {/* Glowing Ethiopian Flag in Header */}
            <div className="hidden sm:flex items-center pl-3 border-l border-white/10">
              <EthiopianFlag size="sm" />
            </div>
          </div>

          {/* Nav links & Top-Right Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
              <a
                href="#free-offerings"
                className={`transition-colors duration-200 flex items-center gap-1.5 ${
                  isDark ? 'text-[#d4ff00] hover:text-[#e4ff4d]' : 'text-[#e05333] hover:text-[#d04626]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>What's Free (3D)</span>
              </a>
              <a
                href="#journal-edge"
                className={`transition-colors duration-200 ${
                  isDark ? 'text-slate-300 hover:text-[#d4ff00]' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Journal Edge
              </a>
              <a
                href="#android-apk"
                className={`transition-colors duration-200 flex items-center gap-1.5 ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android APK</span>
              </a>
            </nav>

            {/* Direct Download APK Nav Action */}
            <button
              id="landing-download-apk-nav-button"
              onClick={handleDownloadApk}
              title="Directly download THE 1% Android APK package"
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border shadow-sm hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span className="hidden sm:inline">Download APK</span>
              <span className="sm:hidden">APK</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                v2.4
              </span>
            </button>

            {/* Color Changer Toggle Feature in top-right */}
            <ThemeToggle />

            {/* Prominent Google Sign-In Button */}
            <button
              id="landing-sign-in-nav-button"
              onClick={signInWithGoogle}
              disabled={loading}
              className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                  : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Sign In with Google</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {authError && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={signInWithGoogle}
              className="underline font-bold cursor-pointer hover:text-rose-100"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Prestige Tag & Glowing Ethiopian Flag Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-300 ${
              isDark
                ? 'bg-slate-900/80 border-[#d4ff00]/40 text-[#d4ff00] glow-lime-badge'
                : 'bg-white border-[#e05333]/30 text-[#e05333] shadow-sm'
            }`}
          >
            <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'}`} />
            <span>The Elite Trading Psychology & Journal Terminal</span>
          </div>

          {/* Glowing Ethiopian Flag Badge - Balanced Size & Radiant Tricolor Glow */}
          <div
            className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-slate-900/90 border-emerald-500/30 text-slate-200 shadow-[0_0_25px_rgba(254,209,0,0.25)]'
                : 'bg-white/95 border-emerald-600/20 text-slate-800 shadow-md'
            }`}
          >
            <EthiopianFlag size="md" />
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-emerald-400">
              ETHIOPIA
            </span>
          </div>
        </div>

        {/* Hero Title with High-Contrast Typography */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] max-w-5xl mx-auto">
          JOURNAL LIKE{' '}
          <span
            className={`underline decoration-2 ${
              isDark
                ? 'text-[#d4ff00] decoration-[#d4ff00]/50 text-glow-lime'
                : 'text-[#e05333] decoration-[#e05333]/50'
            }`}
          >
            THE 1%
          </span>
          . ELIMINATE EMOTIONAL LEAKS.
        </h1>

        <p
          className={`mt-6 text-base sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Raw market pair noise won't make you profitable. Deep execution analysis, asymmetric R-multiple tracking, and emotional leakage diagnostics will.
        </p>

        {/* Social Proof Stack inspired by Image 2 ("168K+ Realtime Users") */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces"
              alt="Trader"
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces"
              alt="Trader"
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=faces"
              alt="Trader"
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
            />
          </div>
          <div className="text-left text-xs">
            <span className="font-mono font-bold block">168K+ Disciplined Traders</span>
            <span className="text-[11px] text-slate-400">Systematic Journaling Protocol</span>
          </div>
        </div>

        {/* Hero Call To Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-primary-signin-button"
            onClick={signInWithGoogle}
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${
              isDark
                ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Open Dedicated Journal via Google</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* Direct Download APK Button */}
          <button
            id="hero-download-apk-button"
            onClick={handleDownloadApk}
            className={`w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border ${
              isDark
                ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-[0_0_25px_rgba(52,211,153,0.2)]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-md'
            }`}
          >
            <Download className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Download APK</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-bold border ${
              isDark 
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/30' 
                : 'bg-emerald-800 text-emerald-100 border-emerald-500/40'
            }`}>
              v{APK_DETAILS.version}
            </span>
          </button>

          <a
            href="#free-offerings"
            className={`w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer border flex items-center justify-center gap-2 shadow-sm hover:scale-105 ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 text-[#d4ff00] border-[#d4ff00]/40'
                : 'bg-white hover:bg-slate-50 text-[#e05333] border-[#e05333]/40 shadow-sm'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore What's Free (3D)</span>
          </a>
        </div>

        {/* Notice */}
        <p className="mt-4 text-xs font-mono text-slate-400">
          Clean private cloud sync with your authenticated Google Account. No public data leaked.
        </p>
      </section>

      {/* 3D Motion Interactive Free Offerings Exploration Showcase */}
      <FreeOfferings3DShowcase 
        onDownloadApk={handleDownloadApk}
        onSignIn={signInWithGoogle}
      />

      {/* 3 Pillar Cards Styled Exactly Like Image 2 (Numbered 01, 02, 03) */}
      <section id="journal-edge" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span
            className={`text-xs font-black tracking-widest uppercase mb-2 block ${
              isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'
            }`}
          >
            Systematic Outperformance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Why Only 1% Achieve Consistent Profitability
          </h2>
          <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Amateurs chase pair charts all day. Elite performers master their psychological state and execute high-expectancy setups with disciplined trade logging.
          </p>
        </div>

        {/* The 01, 02, 03 Grid referencing Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              isDark
                ? 'liquid-glass-card-dark hover:border-slate-600'
                : 'liquid-glass-card-light hover:border-slate-300'
            }`}
          >
            <div>
              <span className="text-3xl font-black font-mono text-slate-500/60 block mb-6">
                01.
              </span>
              <h3 className="text-xl font-bold mb-3">Extremely Helpful Analytics</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Gain immediate visibility into your Setup Edge Matrix, Profit Factor, Realized R-Multiple trajectory, and session win rates.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Quantitative Expectancy</span>
              <BarChart2 className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          {/* Card 02 (The Solid Accent Card, as in Image 2!) */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-2xl ${
              isDark
                ? 'bg-[#d4ff00] text-[#070a12] border-[#d4ff00] glow-lime'
                : 'bg-[#e05333] text-white border-[#e05333] glow-terracotta'
            }`}
          >
            <div>
              <span className="text-3xl font-black font-mono opacity-60 block mb-6">
                02.
              </span>
              <h3 className="text-xl font-black mb-3">Emotional Leakage Diagnostic</h3>
              <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                Calculate the exact dollar cost of FOMO, revenge trading, and premature stop moves. Eradicating psychological leaks produces an immediate +40% equity surge.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono font-bold">
              <span>Zero-FOMO Calibration</span>
              <Brain className="w-4 h-4" />
            </div>
          </div>

          {/* Card 03 */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              isDark
                ? 'liquid-glass-card-dark hover:border-slate-600'
                : 'liquid-glass-card-light hover:border-slate-300'
            }`}
          >
            <div>
              <span className="text-3xl font-black font-mono text-slate-500/60 block mb-6">
                03.
              </span>
              <h3 className="text-xl font-bold mb-3">Zero-Knowledge Private Cloud</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Protected by strict Google Auth & Firestore security rules. Your personal trade entries, private notes, and psychological reflections belong to you alone.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Firestore Security Rules</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Native Android APK Download Section */}
      <section id="android-apk" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AndroidApkSection onDownloadClick={handleDownloadApk} />
      </section>

      {/* Bottom Call To Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className={`relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden border ${
            isDark
              ? 'liquid-glass-dark border-[#d4ff00]/30 shadow-2xl'
              : 'liquid-glass-light border-[#e05333]/30 shadow-xl'
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black mb-4">
              Enter The 1% Journaling Terminal
            </h3>
            <p className={`text-sm mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              One click with Google Auth opens your private dashboard with advanced execution analytics, mental calibration tracking, or download the direct APK for Android.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="cta-bottom-signin-button"
                onClick={signInWithGoogle}
                disabled={loading}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl hover:scale-105 inline-flex items-center justify-center gap-3 ${
                  isDark
                    ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                    : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign In with Google</span>
              </button>

              <button
                id="cta-bottom-download-apk-button"
                onClick={handleDownloadApk}
                className={`w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2.5 border ${
                  isDark
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/25 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                    : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-md'
                }`}
              >
                <Download className="w-5 h-5 text-emerald-400" />
                <span>Download APK (v{APK_DETAILS.version})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Made by APHEX CAPITAL Footer */}
      <AphexCapitalFooter />

      {/* APK Direct Download Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        autoStart={true}
      />
    </div>
  );
};
