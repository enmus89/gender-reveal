import React, { useState } from 'react';
import { GuessChoice, Language } from '../types';
import { Crown, Heart, Sparkles, ArrowRight, ArrowLeft, Check, Compass } from 'lucide-react';
import { sounds } from '../utils/audio';
import { translations } from '../utils/translations';

interface Page2ChoiceProps {
  participantName: string;
  initialChoice: GuessChoice | null;
  onSelect: (choice: GuessChoice) => void;
  onBack: () => void;
  lang: Language;
}

export const Page2Choice: React.FC<Page2ChoiceProps> = ({
  participantName,
  initialChoice,
  onSelect,
  onBack,
  lang,
}) => {
  const t = translations[lang].page2;
  const [selected, setSelected] = useState<GuessChoice | null>(initialChoice);

  const handlePick = (choice: GuessChoice) => {
    setSelected(choice);
    sounds.playSelect();
  };

  const handleProceed = () => {
    if (!selected) return;
    sounds.playPop();
    onSelect(selected);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-300">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="text-orange-400 font-mono text-[11px] tracking-[0.25em] uppercase mb-2">
          {t.stageTag}
        </div>
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white font-display">
          {t.title} <span className="font-bold text-orange-400">{participantName}</span>?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          {t.desc}
        </p>
      </div>

      {/* Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* BOY OPTION */}
        <div
          id="choice-boy-card"
          onClick={() => handlePick('boy')}
          className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 text-center flex flex-col items-center justify-between group ${
            selected === 'boy'
              ? 'border-orange-400 bg-orange-500/15 shadow-[0_0_30px_rgba(249,115,22,0.3)] ring-1 ring-orange-400'
              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
          }`}
        >
          {selected === 'boy' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}

          {/* Icon Container */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-all ${
              selected === 'boy'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                : 'bg-white/[0.04] border border-white/10'
            }`}
          >
            👑
          </div>

          <div className="space-y-1 mb-3">
            <h3 className="text-lg font-bold font-mono tracking-wider text-white">
              {t.teamBoy}
            </h3>
            <p className="text-[11px] font-mono text-orange-400/90">
              {t.teamBoySub}
            </p>
          </div>

          {/* Sub-icons */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-white/[0.03] py-1 px-3 rounded-full border border-white/10">
            <span>🧢</span>
            <span>🚀</span>
            <span>⚽</span>
            <span>🍼</span>
          </div>

          <div
            className={`mt-4 w-full py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors ${
              selected === 'boy'
                ? 'bg-orange-500 text-white shadow-sm font-bold'
                : 'bg-white/[0.05] text-slate-400 group-hover:text-slate-200'
            }`}
          >
            {selected === 'boy' ? t.selectedCheck : t.selectBoy}
          </div>
        </div>

        {/* GIRL OPTION */}
        <div
          id="choice-girl-card"
          onClick={() => handlePick('girl')}
          className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 text-center flex flex-col items-center justify-between group ${
            selected === 'girl'
              ? 'border-pink-400 bg-pink-500/15 shadow-[0_0_30px_rgba(244,114,182,0.3)] ring-1 ring-pink-400'
              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
          }`}
        >
          {selected === 'girl' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}

          {/* Icon Container */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-all ${
              selected === 'girl'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/50 shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : 'bg-white/[0.04] border border-white/10'
            }`}
          >
            🎀
          </div>

          <div className="space-y-1 mb-3">
            <h3 className="text-lg font-bold font-mono tracking-wider text-white">
              {t.teamGirl}
            </h3>
            <p className="text-[11px] font-mono text-pink-400/90">
              {t.teamGirlSub}
            </p>
          </div>

          {/* Sub-icons */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-white/[0.03] py-1 px-3 rounded-full border border-white/10">
            <span>🌸</span>
            <span>💖</span>
            <span>👗</span>
            <span>✨</span>
          </div>

          <div
            className={`mt-4 w-full py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors ${
              selected === 'girl'
                ? 'bg-pink-500 text-white shadow-sm font-bold'
                : 'bg-white/[0.05] text-slate-400 group-hover:text-slate-200'
            }`}
          >
            {selected === 'girl' ? t.selectedCheck : t.selectGirl}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-6 rounded-full border border-white/15 text-slate-300 font-mono text-xs tracking-wider uppercase hover:bg-white/[0.06] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          type="button"
          id="btn-confirm-choice"
          disabled={!selected}
          onClick={handleProceed}
          className={`flex-1 py-4 px-6 rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selected
              ? 'bg-orange-600 hover:bg-orange-500 text-white border border-orange-400/40 shadow-[0_0_25px_rgba(249,115,22,0.35)] active:scale-[0.99]'
              : 'bg-white/[0.05] text-slate-600 border border-white/5 cursor-not-allowed'
          }`}
        >
          <span>{t.proceedBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
