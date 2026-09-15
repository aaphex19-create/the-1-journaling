import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      id="theme-toggle-button"
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'} (Click to switch)`}
      className={`relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 select-none ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 shadow-inner'
          : 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-300/80 shadow-sm'
      } ${className}`}
    >
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-300 ${
          isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-600'
        }`}
      >
        {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </div>
      <span className="tracking-wide">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isDark ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-blue-600'
        }`}
      />
    </button>
  );
};
