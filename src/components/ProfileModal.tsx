import React, { useState } from 'react';
import { User, Shield, Check, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { isDark } = useTheme();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [tier, setTier] = useState(userProfile?.tier || 'Elite Syndicate Member');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        tier: tier.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all duration-300 ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">Terminal Profile Customization</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-400">
              Strategist Display Name
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 border border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-400">
              Syndicate Allocation Tier
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 border border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            >
              <option value="Elite Syndicate Member">Elite Syndicate Member</option>
              <option value="Sovereign Macro Lead">Sovereign Macro Lead</option>
              <option value="Quantitative Volatility Arbitrageur">Quantitative Volatility Arbitrageur</option>
              <option value="Institutional Family Office">Institutional Family Office</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-400">
              Research Focus & Bio
            </label>
            <textarea
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Primary focus: Delta-neutral options flow and institutional liquidity imbalances."
              className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 border border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Profile updated and synchronized to Firestore.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
