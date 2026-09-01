import React, { useState } from 'react';
import { Lock, Unlock, X, KeyRound, ShieldAlert, Check, Loader2, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { verifyParentPinApi, changeParentPinApi } from '../utils/parentAuth';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface ParentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  lang?: Language;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang = 'en',
}) => {
  const t = translations[lang].pinModal;

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleKeyClick = (val: string) => {
    sounds.playPop();
    if (pin.length < 8) {
      const next = pin + val;
      setPin(next);
      setError('');
    }
  };

  const handleBackspace = () => {
    sounds.playPop();
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    sounds.playPop();
    setPin('');
    setError('');
  };

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError(t.pinEmptyError);
      return;
    }

    setLoading(true);
    setError('');

    const res = await verifyParentPinApi(pin.trim());
    setLoading(false);

    if (res.success) {
      sounds.playSuccess();
      onSuccess(pin.trim());
      onClose();
    } else {
      sounds.playError();
      setError(res.error || t.incorrectPinError);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPinInput || !newPinInput) {
      setError(t.bothPinsRequiredError);
      return;
    }
    if (newPinInput.length < 4) {
      setError(t.newPinLengthError);
      return;
    }

    setLoading(true);
    setError('');

    const res = await changeParentPinApi(currentPinInput, newPinInput);
    setLoading(false);

    if (res.success) {
      sounds.playSuccess();
      setChangeSuccess(true);
      setTimeout(() => {
        setChangeSuccess(false);
        setIsChangingPin(false);
        onSuccess(newPinInput);
        onClose();
      }, 1200);
    } else {
      sounds.playError();
      setError(res.error || 'Failed to update PIN');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 text-orange-400 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-orange-400 font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
          {t.accessOnly}
        </div>

        <h3 className="text-xl font-bold font-display text-white mb-1">
          {isChangingPin ? t.changePinTitle : t.passcodeTitle}
        </h3>
        <p className="text-slate-400 text-xs mb-5">
          {isChangingPin ? t.changePinDesc : t.passcodeDesc}
        </p>

        {!isChangingPin ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            {/* PIN Display Input */}
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.enterPinPlaceholder}
                className="w-full text-center tracking-[0.4em] text-xl font-mono py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                autoFocus
              />
            </div>

            {/* Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  className="py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-orange-500/20 text-white font-mono text-base border border-white/10 transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 font-mono text-[11px] border border-white/10 transition-colors cursor-pointer uppercase"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                className="py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-orange-500/20 text-white font-mono text-base border border-white/10 transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 font-mono text-[11px] border border-white/10 transition-colors cursor-pointer uppercase"
              >
                ⌫
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-xs font-mono tracking-widest uppercase transition-all border border-orange-400/40 shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.verifying}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{t.unlockBtn}</span>
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>{t.defaultPinLabel} <span className="text-orange-400/90 font-bold">1234</span></span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsChangingPin(true);
                }}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                {t.customizePinLink}
              </button>
            </div>
          </form>
        ) : (
          /* Change PIN Form */
          <form onSubmit={handleChangePin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {t.currentPinLabel}
              </label>
              <input
                type="password"
                maxLength={8}
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder={t.currentPinPlaceholder}
                className="w-full text-sm font-mono py-2.5 px-3.5 rounded-xl bg-white/[0.04] border border-white/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {t.newPinLabel}
              </label>
              <input
                type="password"
                maxLength={8}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder={t.newPinPlaceholder}
                className="w-full text-sm font-mono py-2.5 px-3.5 rounded-xl bg-white/[0.04] border border-white/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-400"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {error}
              </div>
            )}

            {changeSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{t.pinUpdatedSuccess}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsChangingPin(false);
                }}
                className="flex-1 py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded-full font-mono text-xs uppercase border border-white/10 cursor-pointer"
              >
                {t.backBtn}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-mono text-xs font-bold uppercase border border-orange-400/40 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>{t.saveNewPinBtn}</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
