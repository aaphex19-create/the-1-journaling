import React from 'react';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Bell, 
  Fingerprint, 
  Clock, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APK_DETAILS } from '../utils/apkDownloader';

interface AndroidApkSectionProps {
  onDownloadClick: () => void;
}

export const AndroidApkSection: React.FC<AndroidApkSectionProps> = ({ onDownloadClick }) => {
  const { isDark } = useTheme();

  return (
    <div id="android-apk-section" className="relative">
      <div
        className={`relative rounded-3xl p-8 sm:p-12 md:p-16 border overflow-hidden transition-all duration-300 ${
          isDark
            ? 'liquid-glass-dark border-[#d4ff00]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
            : 'liquid-glass-light border-[#e05333]/30 shadow-xl'
        }`}
      >
        {/* Background Ambient Glow */}
        <div
          className={`absolute -right-20 -bottom-20 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-30 ${
            isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Mobile App Information & Direct Download */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider border ${
                  isDark
                    ? 'bg-[#d4ff00]/10 border-[#d4ff00]/30 text-[#d4ff00]'
                    : 'bg-[#e05333]/10 border-[#e05333]/30 text-[#e05333]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Native Android Build (APK)</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                v{APK_DETAILS.version} • Official Release
              </span>

              <span className="text-xs font-mono text-slate-400">
                {APK_DETAILS.fileSize}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                TRADE DISCIPLINE IN YOUR POCKET.{' '}
                <span
                  className={
                    isDark
                      ? 'text-[#d4ff00] text-glow-lime'
                      : 'text-[#e05333]'
                  }
                >
                  DOWNLOAD APK.
                </span>
              </h2>
              <p
                className={`mt-4 text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Never miss an execution log or session transition. Install THE 1% Mobile Terminal directly to your Android device without app store delays. Direct download, full cloud sync, and instant offline trade capture.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Offline-First Execution</span>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    Log trades on airplanes or low reception; auto-syncs to Firestore.
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Session Bell Alerts</span>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    Live London, NY, & Asian market overlap session notifications.
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 shrink-0">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Biometric Security</span>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    Quick fingerprint/Face unlock keeps your PnL strictly private.
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-[#d4ff00]/15 text-[#d4ff00]' : 'bg-[#e05333]/15 text-[#e05333]'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Zero Bloatware</span>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    Featherlight 18.4 MB APK. Rapid startup and minimal battery drain.
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Download Action Button */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="section-direct-download-apk-button"
                onClick={onDownloadClick}
                className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${
                  isDark
                    ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                    : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
                }`}
              >
                <Download className="w-5 h-5" />
                <span>Download APK Directly ({APK_DETAILS.fileSize})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-slate-400 flex items-center gap-2 justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Direct .apk file • No Play Store required</span>
              </div>
            </div>
          </div>

          {/* Right: Modern Mobile Terminal Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[300px]">
              {/* Outer Phone Shell */}
              <div
                className={`relative rounded-[40px] p-4 border-4 shadow-2xl overflow-hidden ${
                  isDark
                    ? 'bg-[#0b0f19] border-slate-700 shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
                    : 'bg-slate-900 border-slate-300 shadow-2xl'
                }`}
              >
                {/* Speaker Grill & Dynamic Island */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Screen Preview */}
                <div
                  className={`rounded-[28px] p-4 font-mono text-[11px] overflow-hidden ${
                    isDark ? 'bg-[#070a12] text-slate-200' : 'bg-[#0c121e] text-slate-100'
                  }`}
                >
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-3 border-b border-white/5 pb-2">
                    <span className="font-bold">THE 1% Terminal</span>
                    <span className="text-emerald-400 font-bold">5G • 100%</span>
                  </div>

                  {/* App Mini Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Realized Trajectory</span>
                      <span className="text-base font-black text-emerald-400">+$14,890.00</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                      +18.4R
                    </span>
                  </div>

                  {/* Mock Execution Log */}
                  <div className="space-y-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-100 block">NQ 100 E-mini</span>
                        <span className="text-[9px] text-emerald-400">London Open Sweep</span>
                      </div>
                      <span className="text-emerald-400 font-bold">+$1,450.00</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-100 block">EUR/USD Long</span>
                        <span className="text-[9px] text-slate-400">Asia Low Sweep</span>
                      </div>
                      <span className="text-emerald-400 font-bold">+$980.00</span>
                    </div>
                  </div>

                  {/* Mobile Quick Action Button inside mockup */}
                  <div 
                    onClick={onDownloadClick}
                    className={`w-full py-2 rounded-xl text-center font-bold text-[10px] uppercase cursor-pointer transition-transform hover:scale-95 ${
                      isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                    }`}
                  >
                    Tap to Download APK
                  </div>
                </div>

                {/* Home Indicator bar */}
                <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
