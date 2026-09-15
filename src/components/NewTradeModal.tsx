import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Upload, 
  Camera, 
  Video, 
  Link as LinkIcon, 
  Trash2,
  FileText,
  Eye
} from 'lucide-react';
import { 
  TradeEntry, 
  TradeDirection, 
  TradeOutcome, 
  EmotionalState, 
  TradeSession, 
  TradeSetup, 
  MistakeTag,
  TradeAttachment 
} from '../types';
import { useTheme } from '../context/ThemeContext';

interface NewTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrade: (trade: Omit<TradeEntry, 'id' | 'createdAt'>) => void;
}

export const NewTradeModal: React.FC<NewTradeModalProps> = ({ isOpen, onClose, onAddTrade }) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeframe, setTimeframe] = useState('15m');
  const [session, setSession] = useState<TradeSession>('New York AM');
  const [setup, setSetup] = useState<TradeSetup>('Liquidity Sweep');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [exitPrice, setExitPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [pnl, setPnl] = useState<string>('');
  const [rMultiple, setRMultiple] = useState<string>('');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('Disciplined');
  const [executionGrade, setExecutionGrade] = useState<'A+' | 'A' | 'B' | 'C' | 'F'>('A');
  const [mistakeTag, setMistakeTag] = useState<MistakeTag>('None');
  const [notes, setNotes] = useState('');
  const [lessons, setLessons] = useState('');

  // Document & Media Attachments state
  const [attachments, setAttachments] = useState<TradeAttachment[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  if (!isOpen) return null;

  // Handle local file uploads (screenshots, charts, videos)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      // Limit file size for data url storage
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 5MB. Please upload a smaller screenshot or link to an external video/chart.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        const isVideo = file.type.startsWith('video');
        const newAttachment: TradeAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: isVideo ? 'video' : 'image',
          url: resultUrl,
          size: `${(file.size / 1024).toFixed(0)} KB`,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const isVideo = linkInput.includes('loom.com') || linkInput.includes('youtube.com') || linkInput.includes('youtu.be') || linkInput.includes('.mp4');
    const newAttachment: TradeAttachment = {
      id: `att-link-${Date.now()}`,
      name: linkInput.trim().replace(/^https?:\/\//, '').slice(0, 30),
      type: isVideo ? 'video' : 'link',
      url: linkInput.trim(),
    };
    setAttachments((prev) => [...prev, newAttachment]);
    setLinkInput('');
    setIsAddingLink(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !entryPrice || !exitPrice) return;

    const parsedPnL = parseFloat(pnl) || 0;
    const parsedR = parseFloat(rMultiple) || (parsedPnL > 0 ? 2.0 : -1.0);
    const outcome: TradeOutcome = parsedPnL > 0 ? 'WIN' : parsedPnL < 0 ? 'LOSS' : 'BREAKEVEN';

    onAddTrade({
      userId: 'current-user',
      date,
      symbol: symbol.toUpperCase().trim(),
      direction,
      timeframe,
      session,
      setup,
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      stopLoss: parseFloat(stopLoss) || parseFloat(entryPrice) * 0.98,
      positionSize: 1,
      pnl: parsedPnL,
      rMultiple: parsedR,
      outcome,
      emotionalState,
      executionGrade,
      mistakeTag,
      notes: notes.trim(),
      lessons: lessons.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 border my-8 transition-all duration-300 ${
          isDark
            ? 'liquid-glass-dark border-[#d4ff00]/30 text-white shadow-2xl'
            : 'liquid-glass-light border-[#e05333]/30 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                isDark ? 'bg-[#d4ff00] text-[#070a12]' : 'bg-[#e05333] text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Log New Trade Execution</h3>
              <p className="text-xs text-slate-400">Record execution metrics, psychological state, and setup confluence.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Symbol, Direction, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Asset / Ticker
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BTC/USD, NQ, NVDA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Direction
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('LONG')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    direction === 'LONG'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-900 text-slate-400 border border-slate-700'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>LONG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SHORT')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    direction === 'SHORT'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-900 text-slate-400 border border-slate-700'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>SHORT</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Execution Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>
          </div>

          {/* Row 2: Setup, Session, Timeframe */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Strategy Setup
              </label>
              <select
                value={setup}
                onChange={(e) => setSetup(e.target.value as TradeSetup)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              >
                <option value="Liquidity Sweep">Liquidity Sweep</option>
                <option value="Fair Value Gap">Fair Value Gap</option>
                <option value="Breakout & Retest">Breakout & Retest</option>
                <option value="Order Block">Order Block</option>
                <option value="Mean Reversion">Mean Reversion</option>
                <option value="Range Deviation">Range Deviation</option>
                <option value="Trend Pullback">Trend Pullback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Trading Session
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as TradeSession)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              >
                <option value="London Open">London Open</option>
                <option value="New York AM">New York AM (9:30-12:00)</option>
                <option value="New York PM">New York PM (12:00-16:00)</option>
                <option value="Asia Session">Asia Session</option>
                <option value="All Day">All Day / Swing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Timeframe
              </label>
              <input
                type="text"
                placeholder="e.g. 5m, 15m, 1h, 4h"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>
          </div>

          {/* Row 3: Entry Price, Exit Price, Stop Loss */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Entry Price ($)
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="58400"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Exit Price ($)
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="60200"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Stop Loss ($)
              </label>
              <input
                type="number"
                step="any"
                placeholder="57800"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>
          </div>

          {/* Row 4: Net PnL, R-Multiple */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Net PnL ($)
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="+1440 or -400"
                value={pnl}
                onChange={(e) => setPnl(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Realized R-Multiple (e.g. +3.0R, -1.0R)
              </label>
              <input
                type="number"
                step="any"
                placeholder="+3.0 or -1.0"
                value={rMultiple}
                onChange={(e) => setRMultiple(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              />
            </div>
          </div>

          {/* Row 5: Emotional State & Execution Mistake Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Psychological State
              </label>
              <select
                value={emotionalState}
                onChange={(e) => setEmotionalState(e.target.value as EmotionalState)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              >
                <option value="Disciplined">Disciplined (Plan Followed)</option>
                <option value="Confident">Confident / Flow State</option>
                <option value="FOMO">FOMO / Impatience</option>
                <option value="Anxious">Anxious / Nervous</option>
                <option value="Revenge">Revenge / Tilted</option>
                <option value="Hesitant">Hesitant / Late Entry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Execution Grade
              </label>
              <select
                value={executionGrade}
                onChange={(e) => setExecutionGrade(e.target.value as any)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold font-mono focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              >
                <option value="A+">A+ (Flawless Discipline)</option>
                <option value="A">A (Adhered to Rules)</option>
                <option value="B">B (Minor Deviation)</option>
                <option value="C">C (Poor Execution)</option>
                <option value="F">F (Rule Breach / Revenge)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-400">
                Mistake / Leak Tag
              </label>
              <select
                value={mistakeTag}
                onChange={(e) => setMistakeTag(e.target.value as MistakeTag)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                  isDark
                    ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                    : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
                }`}
              >
                <option value="None">None (Zero Leaks)</option>
                <option value="Moved Stop Too Early">Moved Stop Too Early</option>
                <option value="Chased Entry">Chased Entry</option>
                <option value="Oversized Position">Oversized Position</option>
                <option value="Failed Plan Exit">Failed Plan Exit</option>
                <option value="FOMO Entry">FOMO Entry</option>
                <option value="Revenge Trading">Revenge Trading</option>
              </select>
            </div>
          </div>

          {/* Row 6: Notes & Lessons */}
          <div>
            <label className="block text-xs font-bold mb-1 text-slate-400">
              Technical Confluence & Trade Context
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Sweep of Asian range low at NY Open. Clean displacement candle on 5m."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                isDark
                  ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                  : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-slate-400">
              Psychological Takeaway / Lesson
            </label>
            <input
              type="text"
              placeholder="e.g. Waited patiently for setup. Zero urge to force trades during low liquidity."
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none ${
                isDark
                  ? 'bg-slate-900/90 border border-slate-700 text-white focus:border-[#d4ff00]'
                  : 'bg-white border border-slate-300 text-slate-900 focus:border-[#e05333]'
              }`}
            />
          </div>

          {/* Document / Media Inputer: Screenshots, Charts, Videos */}
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Camera className={`w-4 h-4 ${isDark ? 'text-[#d4ff00]' : 'text-[#e05333]'}`} />
                <span className="text-xs font-bold">Trade Proof / Documents (Screenshots & Videos)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {attachments.length} attached
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Upload execution screenshots, TradingView snapshots, or video recordings (MP4, Loom, or chart URLs) to review your edge.
            </p>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />

            {/* Attachment Actions */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-[#d4ff00] hover:text-[#d4ff00]'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-[#e05333] hover:text-[#e05333]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Screenshot / Video</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddingLink(!isAddingLink)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-[#d4ff00]'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-[#e05333]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Add Chart / Video URL</span>
              </button>
            </div>

            {/* Link Input Row */}
            {isAddingLink && (
              <div className="flex gap-2 mb-3 animate-fade-in">
                <input
                  type="url"
                  placeholder="Paste TradingView, Loom, or Image URL..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-mono focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white'
                      : 'bg-white border border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    isDark ? 'bg-[#d4ff00] text-black' : 'bg-[#e05333] text-white'
                  }`}
                >
                  Attach
                </button>
              </div>
            )}

            {/* Attached Thumbnails / Chips Preview */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs relative group ${
                      isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {att.type === 'video' ? (
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                      ) : att.type === 'image' ? (
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="font-bold truncate block text-[11px]">{att.name}</span>
                        {att.size && (
                          <span className="text-[9px] font-mono text-slate-400 block">{att.size}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="Remove attachment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-[#d4ff00] text-[#070a12] glow-lime'
                  : 'bg-[#e05333] text-white glow-terracotta'
              }`}
            >
              Save Trade to Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
