import React, { useState } from 'react';
import { ShieldAlert, ExternalLink, Copy, Check, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawError?: string | null;
}

export const AuthDomainModal: React.FC<AuthDomainModalProps> = ({
  isOpen,
  onClose,
  rawError,
}) => {
  const { signInAsGuest } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'github.io';
  const projectId = 'gen-lang-client-0556616496';
  const firebaseSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentHostname);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleGuestEnter = () => {
    signInAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0b0f19] border border-amber-500/30 text-slate-100 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400">
              Firebase Security Notice
            </div>
            <h2 className="text-xl font-black text-white">
              Authorize Your GitHub Pages Domain
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          Google OAuth requires every deployment domain to be explicitly listed under{' '}
          <strong className="text-white">Authorized domains</strong> in your Firebase project.
          Because this domain isn't added yet, Google blocked the sign-in request.
        </p>

        {/* Current Domain Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-5">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">
            Your Current Domain to Whitelist:
          </div>
          <div className="flex items-center justify-between gap-3 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-300">
            <span className="truncate select-all font-bold">{currentHostname}</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-bold transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Domain</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Simple Steps */}
        <div className="space-y-2.5 mb-6 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
              1
            </span>
            <span>
              Click the button below to open your{' '}
              <strong className="text-white">Firebase Console &rarr; Authorized domains</strong>.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
              2
            </span>
            <span>
              Click <strong className="text-white">Add domain</strong> and paste{' '}
              <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono">{currentHostname}</code>.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
              3
            </span>
            <span>
              Click <strong className="text-white">Add</strong>. Changes take effect within 10 seconds!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={firebaseSettingsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Open Firebase Settings</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleGuestEnter}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <span>Continue as Guest Mode</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {rawError && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 truncate">
            Raw Error: {rawError}
          </div>
        )}
      </div>
    </div>
  );
};
