import React, { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  FileCode, 
  ExternalLink,
  Sparkles,
  ArrowDownToLine,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APK_DETAILS, downloadApkDirect } from '../utils/apkDownloader';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoStart?: boolean;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  autoStart = true
}) => {
  const { isDark } = useTheme();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparing package...');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startDownload = async () => {
    setIsDownloading(true);
    setIsCompleted(false);
    setDownloadProgress(10);
    setStatusMessage('Connecting to secure package distribution...');

    await downloadApkDirect((percent, status) => {
      setDownloadProgress(percent);
      setStatusMessage(status);
    });

    setIsDownloading(false);
    setIsCompleted(true);
  };

  useEffect(() => {
    if (isOpen && autoStart) {
      startDownload();
    } else if (isOpen) {
      setDownloadProgress(0);
      setIsCompleted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/70 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div
        id="apk-download-modal-dialog"
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl z-10 overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#0d1321] border-[#d4ff00]/40 text-slate-100 shadow-[0_0_50px_rgba(212,255,0,0.15)]'
            : 'bg-white border-[#e05333]/30 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Ambient Top Glow */}
        <div 
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-40 ${
            isDark ? 'bg-[#d4ff00]' : 'bg-[#e05333]'
          }`} 
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isDark
                ? 'bg-[#d4ff00] text-[#070a12] glow-lime-badge'
                : 'bg-[#e05333] text-white shadow-md'
            }`}
          >
            <Smartphone className="w-7 h-7" />
          </div>
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase font-black tracking-widest px-2 py-0.5 rounded-md ${
                isDark ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'bg-[#e05333]/15 text-[#e05333]'
              }`}>
                Android APK // Direct Install
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3" /> Signed & Verified
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              THE 1% Terminal APK
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Build {APK_DETAILS.buildNumber} • Version {APK_DETAILS.version} • {APK_DETAILS.fileSize}
            </p>
          </div>
        </div>

        {/* Download Status Card */}
        <div
          className={`p-4 rounded-2xl border mb-6 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : isDownloading ? (
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4 text-slate-400" />
              )}
              {statusMessage}
            </span>
            <span className={isCompleted ? 'text-emerald-400' : isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}>
              {downloadProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isCompleted
                  ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : isDark
                  ? 'bg-gradient-to-r from-emerald-400 via-blue-400 to-[#d4ff00]'
                  : 'bg-gradient-to-r from-orange-400 to-[#e05333]'
              }`}
              style={{ width: `${downloadProgress}%` }}
            />
          </div>

          {isCompleted && (
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold">
                ✓ Package received: {APK_DETAILS.fileName}
              </span>
              <button
                onClick={startDownload}
                className="text-slate-400 hover:text-white underline cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Download again
              </button>
            </div>
          )}
        </div>

        {/* 3 Step Android Installation Guide */}
        <div className="space-y-3 mb-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
            Easy Installation in 3 Steps:
          </span>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
              }`}>
                1
              </span>
              <div>
                <span className="font-bold block text-slate-200">
                  Tap the Download Notification
                </span>
                <span className="text-[11px] text-slate-400 leading-tight block">
                  Pull down your Android notification drawer or open your device's <b>Downloads</b> folder.
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
              }`}>
                2
              </span>
              <div>
                <span className="font-bold block text-slate-200">
                  Allow "Install Unknown Apps"
                </span>
                <span className="text-[11px] text-slate-400 leading-tight block">
                  If prompted by Android security, toggle <b>Allow from this source</b> for your browser.
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
              }`}>
                3
              </span>
              <div>
                <span className="font-bold block text-slate-200">
                  Launch THE 1% Terminal
                </span>
                <span className="text-[11px] text-slate-400 leading-tight block">
                  Tap <b>Install</b>, then open the app. Log in to sync all trade executions in real-time.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Verification Box */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <div className="truncate">
            <span className="font-bold">SHA-256 Checksum:</span> {APK_DETAILS.sha256.slice(0, 24)}...
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            id="modal-direct-redownload-button"
            onClick={startDownload}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 ${
              isDark
                ? 'bg-[#d4ff00] text-[#070a12] glow-lime hover:bg-[#bbf426]'
                : 'bg-[#e05333] text-white glow-terracotta hover:bg-[#d04626]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Direct APK Download</span>
          </button>

          <button
            onClick={onClose}
            className="py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider border border-slate-700 hover:bg-white/5 transition-colors cursor-pointer text-slate-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
