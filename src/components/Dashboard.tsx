import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  BarChart3, 
  Quote, 
  LogOut, 
  User, 
  ChevronDown, 
  Shield, 
  Sparkles, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { TradingJournal } from './TradingJournal';
import { FreeBooksSection } from './FreeBooksSection';
import { FreeCoursesSection } from './FreeCoursesSection';
import { MindsetQuotesSection } from './MindsetQuotesSection';
import { SessionClockTeller } from './SessionClockTeller';
import { AphexCapitalFooter } from './AphexCapitalFooter';
import { ProfileModal } from './ProfileModal';
import { GraduationCap, Clock } from 'lucide-react';

type DashboardTab = 'journal' | 'sessions' | 'courses' | 'books' | 'quotes';

export const Dashboard: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<DashboardTab>('journal');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live Terminal Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'journal', label: 'Journal & Calendar', icon: BarChart3 },
    { id: 'sessions', label: 'Session Clock', icon: Clock },
    { id: 'courses', label: 'Free Courses', icon: GraduationCap },
    { id: 'books', label: 'Free Books', icon: BookOpen },
    { id: 'quotes', label: '1% Mindset Quotes', icon: Quote },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? 'dark-grid-canvas text-slate-100' : 'light-ivory-canvas text-slate-900'
      }`}
    >
      {/* Sticky Top Header */}
      <header
        id="dashboard-header"
        className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all duration-300 border-b ${
          isDark
            ? 'bg-[#070a12]/80 border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-[#f7f7f5]/85 border-slate-200/90 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => setActiveTab('journal')}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black tracking-tighter text-sm sm:text-base cursor-pointer shadow-md transition-all duration-300 ${
                  isDark
                    ? 'bg-[#d4ff00] text-[#070a12] glow-lime-badge'
                    : 'bg-[#181e28] text-white'
                }`}
              >
                1%
              </div>
              <div className="hidden sm:flex flex-col cursor-pointer" onClick={() => setActiveTab('journal')}>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-black tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    THE 1%
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase ${
                      isDark ? 'bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/30' : 'bg-[#e05333]/15 text-[#e05333]'
                    }`}
                  >
                    JOURNAL TERMINAL
                  </span>
                </div>
                <span
                  className={`text-[9px] tracking-[0.15em] font-bold uppercase flex items-center gap-1 ${
                    isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'
                  }`}
                >
                  <span>Made by APHEX CAPITAL</span>
                </span>
              </div>
            </div>

            {/* Middle: Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl border border-white/10 backdrop-blur-md bg-slate-900/40">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? 'bg-[#d4ff00] text-[#070a12] glow-lime-badge'
                          : 'bg-[#e05333] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Clock, Theme Toggle, Profile Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Terminal Clock */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
                <span
                  className={`px-2.5 py-1 rounded-lg border ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {currentTime}
                </span>
              </div>

              {/* Color Changer Toggle in top-right */}
              <ThemeToggle />

              {/* User Menu */}
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  type="button"
                  className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#d4ff00]"
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#181e28] text-white'
                      }`}
                    >
                      {userProfile?.displayName?.[0] || user?.email?.[0] || '1'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
                    {userProfile?.displayName || 'Trader'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-64 rounded-3xl p-2 border shadow-2xl z-50 animate-fade-in ${
                      isDark
                        ? 'liquid-glass-dark border-slate-700 text-slate-200'
                        : 'liquid-glass-light border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="p-3 border-b border-white/10">
                      <div className="font-bold text-sm truncate">
                        {userProfile?.displayName || user?.displayName || 'The 1% Strategist'}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Shield className="w-3 h-3" />
                        <span>{userProfile?.tier || 'Disciplined Trader'}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsProfileOpen(true);
                        }}
                        type="button"
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        }`}
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('books');
                        }}
                        type="button"
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Free Books Library</span>
                      </button>

                      <div className="my-1 border-t border-white/10" />

                      <button
                        id="logout-button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        type="button"
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile nav hamburger */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                type="button"
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileNavOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-white/10 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    type="button"
                    className={`w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      isActive
                        ? isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
                        : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Trading Journal & Analytics (Primary Focus) */}
        {activeTab === 'journal' && (
          <TradingJournal />
        )}

        {/* Tab 2: Dedicated Session Clock & Teller */}
        {activeTab === 'sessions' && (
          <div className="space-y-8 animate-fade-in">
            <SessionClockTeller />
          </div>
        )}

        {/* Tab 3: Free Courses Academy */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            <FreeCoursesSection />
          </div>
        )}

        {/* Tab 4: Free Books Library */}
        {activeTab === 'books' && (
          <div className="space-y-8 animate-fade-in">
            <FreeBooksSection />
          </div>
        )}

        {/* Tab 5: Mindset Quotes */}
        {activeTab === 'quotes' && (
          <div className="space-y-8 animate-fade-in">
            <MindsetQuotesSection />
          </div>
        )}
      </main>

      {/* Made by APHEX CAPITAL Institutional Footer */}
      <AphexCapitalFooter />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};
