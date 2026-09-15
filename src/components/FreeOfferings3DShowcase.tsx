import React, { useState, useRef } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  useSpring 
} from 'motion/react';
import { 
  Smartphone, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Lock, 
  Unlock,
  ExternalLink,
  Flame,
  Brain
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { APK_DETAILS } from '../utils/apkDownloader';

interface FreeOfferingItem {
  id: string;
  category: 'apk' | 'courses' | 'books' | 'sessions' | 'journal' | 'cloud';
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  description: string;
  valueProposition: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  primaryActionLabel: string;
  actionType: 'download_apk' | 'sign_in' | 'view_details';
  previewStats: { label: string; value: string }[];
}

const FREE_OFFERINGS: FreeOfferingItem[] = [
  {
    id: 'free-apk',
    category: 'apk',
    badge: '100% FREE DIRECT DOWNLOAD',
    badgeColor: 'emerald',
    title: 'Native Android Terminal (APK)',
    tagline: 'Trade Execution & Discipline In Your Pocket',
    description: 'A dedicated, featherlight native Android package engineered by APHEX CAPITAL. Log trade entries on the go with zero subscription paywalls, offline caching, and instant biometric security.',
    valueProposition: 'Completely free standalone Android APK. No Play Store billing, zero ads, zero recurring fees.',
    highlights: [
      'Instant order execution logging with R-multiple calculator',
      'True offline buffering — logs auto-sync when connection returns',
      'Session bell notifications for Tokyo, London & NY Open',
      'Ultra-light 18.4 MB install with minimal battery drain'
    ],
    icon: Smartphone,
    accentColor: '#10b981',
    primaryActionLabel: `Direct Download APK (${APK_DETAILS.fileSize})`,
    actionType: 'download_apk',
    previewStats: [
      { label: 'File Size', value: '18.4 MB' },
      { label: 'Release', value: `v${APK_DETAILS.version}` },
      { label: 'License', value: '100% Free' }
    ]
  },
  {
    id: 'free-courses',
    category: 'courses',
    badge: 'UNLOCKED FREE UPON SIGN-IN',
    badgeColor: 'blue',
    title: '4 Institutional Trading Masterclasses',
    tagline: 'From Retail Guesswork to Quantitative Discipline',
    description: 'Get immediate access to 4 comprehensive video and structural courses detailing order flow, liquidity sweeps, psychological leakage diagnostics, and asymmetric position sizing.',
    valueProposition: 'Worth $1,200+ in private prop firm materials — offered 100% free to all signed-in users.',
    highlights: [
      'Mastering Liquidity Sweeps & Institutional Imbalances',
      'The Psychological Leakage Diagnostic Blueprint',
      'Execution Timing: London & NY Open Killzones',
      'Asymmetric Risk-to-Reward & Trailing Stop Math'
    ],
    icon: GraduationCap,
    accentColor: '#3b82f6',
    primaryActionLabel: 'Unlock 4 Free Courses with Google',
    actionType: 'sign_in',
    previewStats: [
      { label: 'Masterclasses', value: '4 Complete' },
      { label: 'Modules', value: '28 Lessons' },
      { label: 'Access', value: 'Lifelong Free' }
    ]
  },
  {
    id: 'free-books',
    category: 'books',
    badge: 'FREE DIGITAL BOOK TRILOGY',
    badgeColor: 'amber',
    title: 'Elite Quantitative Trading Books',
    tagline: 'The Definitive Literature on Systematic Execution',
    description: 'Three complete, high-impact trading books written specifically for serious quantitative traders. Read online or reference chapters immediately after logging in.',
    valueProposition: 'No email paywalls, no upsells. Complete reading material provided for community growth.',
    highlights: [
      'Book I: The 1% Execution Protocol & Edge Identification',
      'Book II: Eradicating Emotional Leakage & FOMO Disasters',
      'Book III: Institutional Volume Profile & Overlap Dynamics',
      'Interactive Chapter Navigation & Bookmarking'
    ],
    icon: BookOpen,
    accentColor: '#f59e0b',
    primaryActionLabel: 'Read All 3 Free Books with Google',
    actionType: 'sign_in',
    previewStats: [
      { label: 'Books', value: '3 Titles' },
      { label: 'Format', value: 'Digital E-Book' },
      { label: 'Cost', value: '$0.00 Free' }
    ]
  },
  {
    id: 'free-clock',
    category: 'sessions',
    badge: 'REAL-TIME UTC MARKET CLOCK',
    badgeColor: 'purple',
    title: 'Global Market Session Clock Teller',
    tagline: 'Zero-Lag Asian, London, and NY Overlap Visualizer',
    description: 'Never get caught trading during low-liquidity dead zones. The session teller dynamically maps Tokyo, London, and New York market openings, active killzones, and overlap volume waves in real time.',
    valueProposition: 'Institutional timezone synchronization built directly into your trading desk.',
    highlights: [
      'Live synchronized UTC countdown timers to every major open',
      'Dynamic visual status badges (Asian, London, NY Overlap)',
      'High-volatility London-NY overlap alert tracker',
      'Glassy liquid-neon visual indicators'
    ],
    icon: Clock,
    accentColor: '#8b5cf6',
    primaryActionLabel: 'Access Live Session Teller',
    actionType: 'sign_in',
    previewStats: [
      { label: 'Sessions', value: '4 Global Hubs' },
      { label: 'Accuracy', value: 'UTC Synchronized' },
      { label: 'Availability', value: '24/5 Live' }
    ]
  },
  {
    id: 'free-journal',
    category: 'journal',
    badge: 'ZERO-SUBSCRIPTION ANALYTICS',
    badgeColor: 'emerald',
    title: 'Deep Execution Journal & Analytics',
    tagline: 'Quantitative Metrics, Calendar PnL, & Emotional Diagnostics',
    description: 'Track every order with precision. Calculate your Setup Edge Matrix, Realized R-Multiple curve, profit factor, and session-by-session win rate without costly SaaS subscriptions.',
    valueProposition: 'Competitors charge $49/month for trading journals. THE 1% provides it completely free.',
    highlights: [
      'Visual Calendar PnL heatmaps matching your trading rhythm',
      'Emotional leak calculator revealing the exact dollar cost of mistakes',
      'R-multiple trajectory graphing with asymmetric setup filters',
      'Fast trade logger with entry, stop, target, and screenshot tags'
    ],
    icon: BarChart3,
    accentColor: '#10b981',
    primaryActionLabel: 'Launch Free Journal Terminal',
    actionType: 'sign_in',
    previewStats: [
      { label: 'Monthly Cost', value: '$0 / Month' },
      { label: 'Trade Capacity', value: 'Unlimited' },
      { label: 'Export', value: 'CSV & Cloud' }
    ]
  },
  {
    id: 'free-cloud',
    category: 'cloud',
    badge: 'PRIVATE & ZERO-KNOWLEDGE',
    badgeColor: 'cyan',
    title: 'Private Encrypted Google Cloud Sync',
    tagline: 'Your Edge Stays 100% Yours. No Public Leaks.',
    description: 'Your trading history, psychological notes, and execution setups are securely partitioned under Firestore user-level security rules. Only your authenticated Google account can read or write your logs.',
    valueProposition: 'Enterprise-grade cloud storage provided at zero cost with no telemetry tracking.',
    highlights: [
      'Strict Firestore security rules restricting access exclusively to your UID',
      'Instant cross-device synchronization between web browser and Android APK',
      'One-click Google authentication with no passwords to remember',
      'Instant account wipe and data ownership control'
    ],
    icon: ShieldCheck,
    accentColor: '#06b6d4',
    primaryActionLabel: 'Connect Private Cloud via Google',
    actionType: 'sign_in',
    previewStats: [
      { label: 'Encryption', value: 'At-Rest & Transit' },
      { label: 'Privacy', value: 'Private UID' },
      { label: 'Setup Time', value: '< 5 Seconds' }
    ]
  }
];

// Interactive 3D Card with Mouse-Tracking Perspective Tilt
const Interactive3DCard: React.FC<{
  item: FreeOfferingItem;
  isDark: boolean;
  onAction: (item: FreeOfferingItem) => void;
}> = ({ item, isDark, onAction }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for natural organic tilt physics
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const normX = clientX / rect.width - 0.5;
    const normY = clientY / rect.height - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const IconComponent = item.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative h-full rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
          isDark
            ? 'bg-[#0d1322]/90 border-slate-800/90 hover:border-slate-600/90 shadow-[0_20px_40px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 border-slate-200/90 hover:border-slate-300 shadow-[0_15px_35px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Dynamic Holographic Shine Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${item.accentColor}18 0%, transparent 70%)`,
          }}
        />

        {/* Ambient Corner Accent */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: item.accentColor }}
        />

        <div>
          {/* Top Bar: Icon + Badge */}
          <div className="flex items-center justify-between gap-3 mb-5" style={{ transform: 'translateZ(30px)' }}>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
              style={{
                backgroundColor: `${item.accentColor}20`,
                color: item.accentColor,
                border: `1px solid ${item.accentColor}40`,
              }}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            <span
              className="text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm"
              style={{
                backgroundColor: `${item.accentColor}15`,
                color: item.accentColor,
                borderColor: `${item.accentColor}35`,
              }}
            >
              {item.badge}
            </span>
          </div>

          {/* Title and Tagline */}
          <div style={{ transform: 'translateZ(25px)' }}>
            <h3 className={`text-xl sm:text-2xl font-black tracking-tight mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {item.title}
            </h3>
            <p
              className="text-xs font-mono font-bold uppercase tracking-wide mb-3"
              style={{ color: item.accentColor }}
            >
              {item.tagline}
            </p>
            <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {item.description}
            </p>
          </div>

          {/* Value Proposition Pill */}
          <div
            className={`p-3 rounded-2xl border mb-5 text-[11px] font-medium leading-tight flex items-start gap-2.5 ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
            style={{ transform: 'translateZ(20px)' }}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{item.valueProposition}</span>
          </div>

          {/* Key Feature Bullet points */}
          <div className="space-y-2 mb-6" style={{ transform: 'translateZ(20px)' }}>
            {item.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Preview Stats Bar */}
          <div
            className={`grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl border mb-5 font-mono text-center ${
              isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-100/60 border-slate-200'
            }`}
            style={{ transform: 'translateZ(15px)' }}
          >
            {item.previewStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">{stat.label}</span>
                <span className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onAction(item)}
            style={{ transform: 'translateZ(35px)' }}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
              item.category === 'apk'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : isDark
                ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
            }`}
          >
            {item.category === 'apk' ? (
              <Download className="w-4 h-4 animate-bounce" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
            <span>{item.primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const FreeOfferings3DShowcase: React.FC<{
  onDownloadApk: () => void;
  onSignIn: () => void;
}> = ({ onDownloadApk, onSignIn }) => {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'apk' | 'education' | 'tools'>('all');

  const filteredItems = FREE_OFFERINGS.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'apk') return item.category === 'apk';
    if (activeFilter === 'education') return item.category === 'courses' || item.category === 'books';
    if (activeFilter === 'tools') return item.category === 'sessions' || item.category === 'journal' || item.category === 'cloud';
    return true;
  });

  const handleAction = (item: FreeOfferingItem) => {
    if (item.actionType === 'download_apk') {
      onDownloadApk();
    } else {
      onSignIn();
    }
  };

  return (
    <section id="free-offerings" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Decorative Grid and Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25 ${
            isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'
          }`}
        />
      </div>

      {/* Section Header */}
      <div className="text-center max-w-4xl mx-auto mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-widest mb-4 border shadow-sm"
          style={{
            backgroundColor: isDark ? 'rgba(212,255,0,0.1)' : 'rgba(224,83,51,0.1)',
            borderColor: isDark ? 'rgba(212,255,0,0.3)' : 'rgba(224,83,51,0.3)',
            color: isDark ? '#d4ff00' : '#e05333',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>ZERO PAYWALLS • 100% FREE FOR DISCIPLINED TRADERS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
        >
          EXPLORE WHAT{' '}
          <span
            className={
              isDark
                ? 'text-[#d4ff00] text-glow-lime'
                : 'text-[#e05333]'
            }
          >
            THE 1% OFFERS FOR FREE
          </span>
          .
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-5 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          We do not charge subscriptions for trader discipline. Download the standalone Android APK directly, or sign in with Google to unlock our entire institutional library, live session clock, and execution journal without paying a single cent.
        </motion.p>

        {/* 3D Category Switcher Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: 'All Free Offerings (6)' },
            { id: 'apk', label: 'Android APK Terminal' },
            { id: 'education', label: 'Free Academy & Books' },
            { id: 'tools', label: 'Journal & Session Clocks' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-[#d4ff00] text-[#070a12] font-black shadow-[0_0_20px_rgba(212,255,0,0.3)]'
                      : 'bg-[#e05333] text-white font-black shadow-md'
                    : isDark
                    ? 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Cards Grid with Animated Spring Transitions */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
              }}
              className="h-full"
            >
              <Interactive3DCard
                item={item}
                isDark={isDark}
                onAction={handleAction}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Trust & Transparency Guarantee Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`mt-14 p-6 sm:p-8 rounded-3xl border text-center max-w-4xl mx-auto ${
          isDark
            ? 'liquid-glass-dark border-[#d4ff00]/20'
            : 'liquid-glass-light border-[#e05333]/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'bg-[#e05333]/20 text-[#e05333]'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black">
                The APHEX CAPITAL Zero-Paywall Protocol
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No credit card required. No trial expiration. The books, courses, session clock, and APK are lifelong free resources.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onDownloadApk}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-transform hover:scale-105 flex items-center gap-2 border ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get APK Free</span>
            </button>

            <button
              onClick={onSignIn}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-transform hover:scale-105 flex items-center gap-2 ${
                isDark
                  ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                  : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock Everything</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
