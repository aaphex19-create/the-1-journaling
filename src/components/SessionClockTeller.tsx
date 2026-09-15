import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Globe2, 
  Zap, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MarketSession {
  id: string;
  name: string;
  city: string;
  flag: string;
  startHourUtc: number; // 0-24
  endHourUtc: number;   // 0-24
  timeZoneName: string;
  color: string;
  description: string;
}

const SESSIONS: MarketSession[] = [
  {
    id: 'sydney',
    name: 'Sydney Session',
    city: 'Sydney, Australia',
    flag: '🇦🇺',
    startHourUtc: 21,
    endHourUtc: 6,
    timeZoneName: 'AEST (UTC+10)',
    color: '#a855f7', // Purple
    description: 'Pacific liquidity initialization. AUD, NZD high participation.',
  },
  {
    id: 'tokyo',
    name: 'Asian / Tokyo',
    city: 'Tokyo, Japan',
    flag: '🇯🇵',
    startHourUtc: 0,
    endHourUtc: 9,
    timeZoneName: 'JST (UTC+9)',
    color: '#38bdf8', // Sky Blue
    description: 'Range establishment, JPY pairs, Nikkei correlation.',
  },
  {
    id: 'london',
    name: 'London Session',
    city: 'London, United Kingdom',
    flag: '🇬🇧',
    startHourUtc: 7,
    endHourUtc: 16,
    timeZoneName: 'BST / GMT (UTC+1)',
    color: '#10b981', // Emerald
    description: 'Massive European liquidity rush, trend initiation, Judastwists.',
  },
  {
    id: 'newyork',
    name: 'New York Session',
    city: 'New York, United States',
    flag: '🇺🇸',
    startHourUtc: 12,
    endHourUtc: 21,
    timeZoneName: 'EDT (UTC-4)',
    color: '#f59e0b', // Amber / Gold
    description: 'Peak institutional volume, US macro news, indices volatility.',
  },
];

export const SessionClockTeller: React.FC = () => {
  const { isDark } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute UTC hours, minutes, seconds as decimals
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  const utcDecimalTime = utcHours + utcMinutes / 60 + utcSeconds / 3600;

  // Check if a session is currently active
  const isSessionActive = (session: MarketSession) => {
    if (session.startHourUtc <= session.endHourUtc) {
      return utcDecimalTime >= session.startHourUtc && utcDecimalTime < session.endHourUtc;
    } else {
      // Over midnight (e.g. Sydney 21:00 -> 06:00)
      return utcDecimalTime >= session.startHourUtc || utcDecimalTime < session.endHourUtc;
    }
  };

  // Calculate session progress (0% to 100%)
  const getSessionProgress = (session: MarketSession) => {
    if (!isSessionActive(session)) return 0;
    let duration = session.endHourUtc - session.startHourUtc;
    if (duration <= 0) duration += 24;

    let elapsed = utcDecimalTime - session.startHourUtc;
    if (elapsed < 0) elapsed += 24;

    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  };

  // Find remaining time until session close or open
  const getRemainingTimeText = (session: MarketSession) => {
    const active = isSessionActive(session);
    let targetHour = active ? session.endHourUtc : session.startHourUtc;
    let diffHours = targetHour - utcDecimalTime;
    if (diffHours < 0) diffHours += 24;

    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);

    if (active) {
      return `Closes in ${hours}h ${minutes}m`;
    } else {
      return `Opens in ${hours}h ${minutes}m`;
    }
  };

  const activeSessions = SESSIONS.filter(isSessionActive);
  const isLondonNyOverlap = isSessionActive(SESSIONS[2]) && isSessionActive(SESSIONS[3]);

  // Clock angle for 24h dial (360 degrees / 24 hours = 15 deg/hr)
  // 00:00 UTC at top (270 deg / -90 deg from 3 o'clock)
  const clockHandAngle = (utcDecimalTime / 24) * 360;

  // Format digital string
  const formatTime = (date: Date) => {
    return date.toUTCString().slice(17, 25) + ' UTC';
  };

  const localTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div
      id="market-session-teller"
      className={`rounded-3xl border p-6 sm:p-8 transition-all duration-500 shadow-2xl relative overflow-hidden ${
        isDark
          ? 'liquid-glass-dark border-slate-700/80 text-slate-100'
          : 'liquid-glass-light border-slate-200/90 text-slate-900 shadow-xl'
      }`}
    >
      {/* Background ambient glow according to active overlap */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-16 -right-16 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-all duration-700 ${
            isLondonNyOverlap ? 'bg-[#d4ff00]' : isDark ? 'bg-blue-500' : 'bg-[#e05333]'
          }`}
        />
      </div>

      {/* Header bar of the Teller */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/30 glow-lime-badge'
                  : 'bg-[#e05333]/10 text-[#e05333] border-[#e05333]/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Market Session Teller
            </span>

            {isLondonNyOverlap ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                LONDON / NY OVERLAP (MAX LIQUIDITY)
              </span>
            ) : activeSessions.length > 0 ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {activeSessions.map((s) => s.name).join(' & ')} ACTIVE
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-400">
                Low Volume Transition
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
            Institutional Global Clock & Session Teller
          </h3>
          <p className={`text-xs mt-1 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time synchronization across London, New York, Tokyo, and Sydney financial centers. Monitor killzones and liquidity waves with precision.
          </p>
        </div>

        {/* Real-time Time Badges */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2.5 rounded-2xl border text-right font-mono ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="text-[10px] uppercase text-slate-400 flex items-center justify-end gap-1 font-sans font-bold">
              <Globe2 className="w-3 h-3 text-blue-400" />
              <span>Universal UTC</span>
            </div>
            <div className="text-sm sm:text-base font-black tracking-wider text-emerald-400">
              {formatTime(now)}
            </div>
          </div>

          <div
            className={`px-4 py-2.5 rounded-2xl border text-right font-mono ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="text-[10px] uppercase text-slate-400 flex items-center justify-end gap-1 font-sans font-bold">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Local System</span>
            </div>
            <div className="text-sm sm:text-base font-black tracking-wider">
              {localTimeStr}
            </div>
          </div>
        </div>
      </div>

      {/* Main Teller Display: Glassy 24h Radial Clock Dial + Session Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center relative z-10">
        {/* Left Column: Glassy Circular 24h Session Dial */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2 sm:p-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
            {/* Outer Glowing Ring */}
            <div
              className={`absolute inset-0 rounded-full blur-xl opacity-30 ${
                isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'
              }`}
            />

            {/* Glassy Clock Surface */}
            <div
              className={`w-full h-full rounded-full border relative flex items-center justify-center backdrop-blur-2xl transition-all duration-300 ${
                isDark
                  ? 'bg-slate-950/85 border-slate-700/90 shadow-[inset_0_0_50px_rgba(0,0,0,0.85)]'
                  : 'bg-white/85 border-slate-200 shadow-[inset_0_0_30px_rgba(0,0,0,0.06)]'
              }`}
            >
              {/* SVG 24-Hour Dial Arcs for Sessions */}
              <svg className="w-full h-full" viewBox="0 0 240 240">
                <defs>
                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Dial background ring tracks */}
                <circle
                  cx="120"
                  cy="120"
                  r="104"
                  fill="none"
                  stroke={isDark ? '#0f172a' : '#f1f5f9'}
                  strokeWidth="12"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="104"
                  fill="none"
                  stroke={isDark ? '#1e293b' : '#e2e8f0'}
                  strokeWidth="2"
                />

                {/* 24-Hour Ticks & Labels */}
                {Array.from({ length: 24 }).map((_, i) => {
                  // 0h is at top (-90 deg), each hour is 15 deg
                  const angleDeg = i * 15 - 90;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const isMajor = i % 3 === 0;
                  const rInner = isMajor ? 96 : 100;
                  const rOuter = 104;
                  const x1 = 120 + rInner * Math.cos(angleRad);
                  const y1 = 120 + rInner * Math.sin(angleRad);
                  const x2 = 120 + rOuter * Math.cos(angleRad);
                  const y2 = 120 + rOuter * Math.sin(angleRad);

                  return (
                    <g key={`tick-${i}`}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isDark ? (isMajor ? '#94a3b8' : '#334155') : isMajor ? '#475569' : '#cbd5e1'}
                        strokeWidth={isMajor ? '2' : '1'}
                      />
                      {isMajor && (
                        <text
                          x={120 + 88 * Math.cos(angleRad)}
                          y={120 + 88 * Math.sin(angleRad) + 3}
                          fill={isDark ? '#94a3b8' : '#64748b'}
                          fontSize="7"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {String(i).padStart(2, '0')}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Session Arcs - Group with -90 rotation so 0h starts at 12 o'clock */}
                <g transform="rotate(-90 120 120)">
                  {/* Asian / Tokyo: 0 to 9 UTC = 9 hours (Circumference 2*PI*76 = 477.5) */}
                  <circle
                    cx="120"
                    cy="120"
                    r="76"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={isSessionActive(SESSIONS[1]) ? '8' : '5'}
                    strokeDasharray={`${9 * 19.9} 478`}
                    strokeDashoffset="0"
                    opacity={isSessionActive(SESSIONS[1]) ? '0.95' : '0.3'}
                    filter={isSessionActive(SESSIONS[1]) ? 'url(#glow-filter)' : undefined}
                    className="transition-all duration-500"
                  />

                  {/* London: 7 to 16 UTC = 9 hours (Circumference 2*PI*66 = 414.7) */}
                  <circle
                    cx="120"
                    cy="120"
                    r="66"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={isSessionActive(SESSIONS[2]) ? '8' : '5'}
                    strokeDasharray={`${9 * 17.28} 415`}
                    strokeDashoffset={`-${7 * 17.28}`}
                    opacity={isSessionActive(SESSIONS[2]) ? '0.95' : '0.3'}
                    filter={isSessionActive(SESSIONS[2]) ? 'url(#glow-filter)' : undefined}
                    className="transition-all duration-500"
                  />

                  {/* New York: 12 to 21 UTC = 9 hours (Circumference 2*PI*56 = 351.8) */}
                  <circle
                    cx="120"
                    cy="120"
                    r="56"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={isSessionActive(SESSIONS[3]) ? '8' : '5'}
                    strokeDasharray={`${9 * 14.66} 352`}
                    strokeDashoffset={`-${12 * 14.66}`}
                    opacity={isSessionActive(SESSIONS[3]) ? '0.95' : '0.3'}
                    filter={isSessionActive(SESSIONS[3]) ? 'url(#glow-filter)' : undefined}
                    className="transition-all duration-500"
                  />

                  {/* Sydney: 21 to 6 UTC = 9 hours (Circumference 2*PI*46 = 289.0) */}
                  <circle
                    cx="120"
                    cy="120"
                    r="46"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth={isSessionActive(SESSIONS[0]) ? '8' : '5'}
                    strokeDasharray={`${9 * 12.04} 289`}
                    strokeDashoffset={`-${21 * 12.04}`}
                    opacity={isSessionActive(SESSIONS[0]) ? '0.95' : '0.3'}
                    filter={isSessionActive(SESSIONS[0]) ? 'url(#glow-filter)' : undefined}
                    className="transition-all duration-500"
                  />
                </g>

                {/* Sweep Hand Vector rendered in SVG */}
                {(() => {
                  const handAngleDeg = (utcDecimalTime / 24) * 360 - 90;
                  const handRad = (handAngleDeg * Math.PI) / 180;
                  const xHand = 120 + 98 * Math.cos(handRad);
                  const yHand = 120 + 98 * Math.sin(handRad);
                  const xTail = 120 - 18 * Math.cos(handRad);
                  const yTail = 120 - 18 * Math.sin(handRad);

                  return (
                    <g>
                      {/* Tail */}
                      <line
                        x1={xTail}
                        y1={yTail}
                        x2={120}
                        y2={120}
                        stroke={isDark ? '#d4ff00' : '#e05333'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                      {/* Main Hand */}
                      <line
                        x1={120}
                        y1={120}
                        x2={xHand}
                        y2={yHand}
                        stroke={isDark ? '#d4ff00' : '#e05333'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Hand Pointer Tip Bulb */}
                      <circle
                        cx={xHand}
                        cy={yHand}
                        r="4"
                        fill={isDark ? '#d4ff00' : '#e05333'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })()}

                {/* Center Core */}
                <circle
                  cx="120"
                  cy="120"
                  r="24"
                  fill={isDark ? '#0b0f19' : '#ffffff'}
                  stroke={isDark ? '#334155' : '#e2e8f0'}
                  strokeWidth="2"
                />
                <text
                  x="120"
                  y="116"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  UTC
                </text>
                <text
                  x="120"
                  y="126"
                  fill={isDark ? '#ffffff' : '#0f172a'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {String(utcHours).padStart(2, '0')}:{String(utcMinutes).padStart(2, '0')}
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-mono text-slate-400 block font-bold">
              24-Hour Radial World Session Clock Dial
            </span>
            <div className="flex items-center justify-center gap-3 mt-2 text-[10px] font-mono text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> Tokyo
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" /> London
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> New York
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Sydney
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Market Session Real-Time Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SESSIONS.map((session) => {
            const active = isSessionActive(session);
            const progress = getSessionProgress(session);
            const remainingText = getRemainingTimeText(session);

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  active
                    ? isDark
                      ? 'bg-slate-900/90 border-[#d4ff00]/40 shadow-[0_0_20px_rgba(212,255,0,0.08)]'
                      : 'bg-white border-[#e05333]/40 shadow-md'
                    : isDark
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-95'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: session.color }}
                  />
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{session.flag}</span>
                      <div>
                        <h4 className="font-black text-sm tracking-tight leading-tight">
                          {session.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {session.city} • {session.timeZoneName}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {active ? '● LIVE' : 'CLOSED'}
                    </span>
                  </div>

                  <p className={`text-[11px] leading-relaxed my-2 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {session.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">
                      Hours: {String(session.startHourUtc).padStart(2, '0')}:00 - {String(session.endHourUtc).padStart(2, '0')}:00 UTC
                    </span>
                    <span className={active ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {remainingText}
                    </span>
                  </div>

                  {/* Session Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: session.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
