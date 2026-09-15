import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  Award,
  Download,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AphexCapitalFooter: React.FC = () => {
  const { isDark } = useTheme();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const email = 'aaphex19@gmail.com';
  const phone = '+251993129934';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  return (
    <footer
      id="aphex-capital-footer"
      className={`border-t transition-colors duration-500 relative overflow-hidden ${
        isDark
          ? 'border-slate-800 bg-[#070a12]/90 text-slate-300'
          : 'border-slate-200 bg-[#f7f7f5]/90 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          {/* Left: Branding "Made by APHEX CAPITAL" */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${
                  isDark
                    ? 'bg-[#d4ff00] text-[#070a12] glow-lime-badge'
                    : 'bg-[#181e28] text-white'
                }`}
              >
                AC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Proprietary Architecture
                  </span>
                </div>
                <h4 className="text-xl font-black tracking-tight flex items-center gap-2">
                  Made by <span className={isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}>APHEX CAPITAL</span>
                </h4>
              </div>
            </div>

            <p className={`text-xs max-w-md leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineering elite asymmetric quantitative journals, live session clocks, and psychological risk calibration tools for the world's disciplined 1%.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Shield className="w-3 h-3" />
                Institutional Standard
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Award className="w-3 h-3" />
                The 1% Quantitative Terminal
              </span>
              <a
                href="/THE_1_PERCENT_v2.4.0.apk"
                download="THE_1_PERCENT_v2.4.0.apk"
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                  isDark
                    ? 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30 hover:bg-[#d4ff00]/20'
                    : 'bg-[#e05333]/10 text-[#e05333] border-[#e05333]/30 hover:bg-[#e05333]/20'
                }`}
              >
                <Download className="w-3 h-3 animate-bounce" />
                <span>Download APK (Android)</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Information (Email & Phone) */}
          <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
            {/* Email Card */}
            <div
              className={`p-4 rounded-2xl border transition-all flex-1 max-w-sm ${
                isDark
                  ? 'liquid-glass-card-dark hover:border-[#d4ff00]/40'
                  : 'liquid-glass-card-light hover:border-[#e05333]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-400" />
                  Direct Inquiries
                </span>
                <button
                  onClick={() => handleCopy(email, 'email')}
                  title="Copy email address"
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  {copiedItem === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <a
                href={`mailto:${email}`}
                className={`font-mono text-xs sm:text-sm font-bold block truncate transition-colors hover:underline ${
                  isDark ? 'text-slate-100 hover:text-[#d4ff00]' : 'text-slate-900 hover:text-[#e05333]'
                }`}
              >
                {email}
              </a>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {copiedItem === 'email' ? '✓ Copied to clipboard' : 'Click to send email'}
              </span>
            </div>

            {/* Phone Card */}
            <div
              className={`p-4 rounded-2xl border transition-all flex-1 max-w-sm ${
                isDark
                  ? 'liquid-glass-card-dark hover:border-[#d4ff00]/40'
                  : 'liquid-glass-card-light hover:border-[#e05333]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  Official Contact
                </span>
                <button
                  onClick={() => handleCopy(phone, 'phone')}
                  title="Copy phone number"
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  {copiedItem === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <a
                href={`tel:${phone}`}
                className={`font-mono text-xs sm:text-sm font-bold block truncate transition-colors hover:underline ${
                  isDark ? 'text-slate-100 hover:text-[#d4ff00]' : 'text-slate-900 hover:text-[#e05333]'
                }`}
              >
                {phone}
              </a>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {copiedItem === 'phone' ? '✓ Copied to clipboard' : 'Click to call / WhatsApp'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} THE 1%</span>
            <span>•</span>
            <span className="font-bold">APHEX CAPITAL</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400">● Global Real-Time Sessions</span>
            <span>Zero Emotional Leaks</span>
            <span>Private Google Auth Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
