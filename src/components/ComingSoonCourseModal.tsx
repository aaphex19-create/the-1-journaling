import React, { useState } from 'react';
import { X, Sparkles, Bell, CheckCircle2, PlayCircle, Clock, Award, BookOpen } from 'lucide-react';
import { FreeCourse } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ComingSoonCourseModalProps {
  course: FreeCourse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonCourseModal: React.FC<ComingSoonCourseModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen || !course) return null;

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with heavy blur */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Liquid Glass Modal with Glowing Color */}
      <div
        className={`relative w-full max-w-xl rounded-3xl p-6 sm:p-8 border transition-all duration-300 z-10 overflow-hidden shadow-2xl animate-fade-in ${
          isDark
            ? 'liquid-glass-dark border-[#d4ff00]/40 text-slate-100 shadow-[0_0_50px_rgba(212,255,0,0.2)]'
            : 'liquid-glass-light border-[#e05333]/40 text-slate-900 shadow-[0_0_50px_rgba(224,83,51,0.2)]'
        }`}
      >
        {/* Glowing Ambient Top Spotlight */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40 ${
            isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing COMING SOON Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`px-3.5 py-1 rounded-full text-[11px] font-black tracking-widest uppercase border flex items-center gap-1.5 ${
              isDark
                ? 'coming-soon-glow bg-[#d4ff00]/20 text-[#d4ff00] border-[#d4ff00]'
                : 'coming-soon-glow-terracotta bg-[#e05333]/20 text-[#e05333] border-[#e05333]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>FREE COURSE • COMING SOON</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {course.level} Level
          </span>
        </div>

        {/* Course Title & Subtitle */}
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
          {course.title}
        </h3>
        <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {course.subtitle}
        </p>

        {/* Course Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-mono">
          <div
            className={`p-3 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="text-[10px] text-slate-400 block uppercase mb-0.5">Instructor</span>
            <span className="font-bold truncate block">{course.instructor}</span>
          </div>
          <div
            className={`p-3 rounded-2xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className="text-[10px] text-slate-400 block uppercase mb-0.5">Duration</span>
            <span className="font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{course.duration}</span>
            </span>
          </div>
        </div>

        {/* Syllabus Preview */}
        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Curriculum Breakdown ({course.modulesCount} Video Lessons)
          </span>
          <div className="space-y-1.5">
            {course.topics.map((topic, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                  isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/80 border-slate-200'
                }`}
              >
                <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}`} />
                <span className="font-medium truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Early Access Notification Form */}
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 py-1">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>You are on the VIP early access roster! You'll receive instant unlock notice when modules drop.</span>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Get VIP Early Access (100% Free)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{course.enrolledCount}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    isDark
                      ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                      : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
                  }`}
                >
                  Notify Me
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
