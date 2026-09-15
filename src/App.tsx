import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

const MainContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-slate-100">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-400 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20 animate-pulse">
            1%
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-400 blur opacity-40 animate-spin" />
        </div>
        <div className="font-mono text-xs tracking-[0.25em] text-slate-400 uppercase">
          THE 1% // INITIALIZING SECURE LINK...
        </div>
      </div>
    );
  }

  // If user is authenticated, render the full Dashboard.
  // If not authenticated, render the clean landing page with NO dashboard visible.
  return user ? <Dashboard /> : <LandingPage />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
