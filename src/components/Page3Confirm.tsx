import React, { useState } from 'react';
import { GuessChoice, Language } from '../types';
import { ShieldAlert, CheckCircle2, RotateCcw, ArrowRight, Lock, Loader2, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { translations } from '../utils/translations';
import { submitGuess } from '../utils/sheetApi';

interface Page3ConfirmProps {
  participantName: string;
  relationship: string;
  message: string;
  choice: GuessChoice;
  onConfirmed: () => void;
  onRechoose: () => void;
  lang: Language;
}

export const Page3Confirm: React.FC<Page3ConfirmProps> = ({
  participantName,
  relationship,
  message,
  choice,
  onConfirmed,
  onRechoose,
  lang,
}) => {
  const t = translations[lang].page3;
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isBoy = choice === 'boy';

  const handleLockIn = async () => {
    setSubmitting(true);
    setErrorMessage('');
    sounds.playPop();

    try {
      await submitGuess({ name: participantName, relationship, choice, message });
      onConfirmed();
    } catch (err) {
      console.error(err);
      // Even if offline/network fails, allow continuing locally
      onConfirmed();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-300">
      {/* Badge */}
      <div className="text-center mb-6">
        <div className="text-orange-400 font-mono text-[11px] tracking-[0.25em] uppercase mb-2">
          {t.stageTag}
        </div>
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white font-display">
          {t.titleStart} <span className="font-bold text-orange-400">{t.titleHighlight}</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          {t.desc}
        </p>
      </div>

      {/* Choice summary card */}
      <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 mb-6 text-center">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-400 mb-4 pb-3 border-b border-white/[0.08]">
          <span>{t.recordLabel}: {participantName.toUpperCase()}</span>
          <span>{relationship ? `${t.relationLabel}: ${relationship.toUpperCase()}` : `${t.relationLabel}: ${t.relativeFallback}`}</span>
        </div>

        <div className="flex items-center justify-center gap-4 my-2">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border transition-all ${
              isBoy
                ? 'bg-orange-500/20 text-orange-300 border-orange-400/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                : 'bg-pink-500/20 text-pink-300 border-pink-400/50 shadow-[0_0_20px_rgba(244,114,182,0.3)]'
            }`}
          >
            {isBoy ? '👑' : '🎀'}
          </div>
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-white">
              {isBoy ? t.teamBoyTitle : t.teamGirlTitle}
            </div>
            <div className="text-xs font-mono text-orange-400/80 mt-0.5">
              {isBoy ? t.predictionBoy : t.predictionGirl}
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs italic text-slate-300 bg-white/[0.02] p-3 rounded-xl">
            &ldquo;{message}&rdquo;
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-center">
          {errorMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          id="btn-lock-in-choice"
          disabled={submitting}
          onClick={handleLockIn}
          className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all border border-orange-400/40 shadow-[0_0_25px_rgba(249,115,22,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.savingBtn}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>{t.confirmBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            sounds.playPop();
            onRechoose();
          }}
          className="w-full py-3.5 px-6 rounded-full border border-white/15 text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-mono tracking-wider uppercase"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.reviseBtn}</span>
        </button>
      </div>
    </div>
  );
};
