import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, PartyPopper, Play, Volume2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface Page4ReadyProps {
  participantName: string;
  onReveal: () => void;
  lang: Language;
}

export const Page4Ready: React.FC<Page4ReadyProps> = ({
  participantName,
  onReveal,
  lang,
}) => {
  const t = translations[lang].page4;
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);

  const startReveal = () => {
    if (isTriggered) return;
    setIsTriggered(true);
    sounds.playDrumroll();
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        sounds.playPop();
        setCountdown((c) => (c !== null ? c - 1 : 0));
      }, 900);
      return () => clearTimeout(timer);
    } else {
      // Countdown hit 0 -> Trigger reveal!
      const timer = setTimeout(() => {
        sounds.playRevealFanfare();
        onReveal();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, onReveal]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-300 text-center">
      {/* Badge */}
      <div className="text-center mb-6">
        <div className="text-orange-400 font-mono text-[11px] tracking-[0.25em] uppercase mb-2">
          {t.stageTag}
        </div>
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white font-display">
          {t.titleStart} <span className="font-bold text-orange-400">{t.titleHighlight}</span>?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          {t.desc.replace('{name}', participantName)}
        </p>
      </div>

      {countdown !== null ? (
        /* Countdown Active View */
        <div className="py-8 space-y-6">
          <div className="relative inline-flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="w-36 h-36 rounded-full bg-orange-500/20 animate-ping absolute inset-0 m-auto" />
            <div className="w-28 h-28 rounded-full bg-orange-600/90 text-white border-2 border-orange-400/80 flex items-center justify-center text-5xl font-mono font-black shadow-[0_0_40px_rgba(249,115,22,0.6)] z-10 scale-110 transition-transform">
              {countdown > 0 ? countdown : '✨'}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-mono tracking-wider text-orange-400 uppercase animate-pulse">
              {countdown === 3 && t.count3}
              {countdown === 2 && t.count2}
              {countdown === 1 && t.count1}
              {countdown === 0 && t.count0}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {t.awaitingSensor}
            </p>
          </div>
        </div>
      ) : (
        /* Ready to click view */
        <div className="space-y-6">
          {/* Mystery Core Visual */}
          <div className="relative mx-auto w-32 h-32 rounded-3xl bg-white/[0.03] border border-orange-400/40 flex items-center justify-center shadow-[0_0_35px_rgba(249,115,22,0.25)] animate-float">
            <span className="text-5xl select-none">🎁</span>
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-[0_0_10px_#EA580C]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Reveal button */}
          <button
            type="button"
            id="btn-trigger-reveal"
            onClick={startReveal}
            className="w-full py-5 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-sm sm:text-base tracking-widest uppercase transition-all border border-orange-400/50 shadow-[0_0_35px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99]"
          >
            <PartyPopper className="w-5 h-5 text-orange-200 animate-pulse" />
            <span>{t.clickToReveal}</span>
            <Sparkles className="w-5 h-5 text-orange-200" />
          </button>

          <p className="text-xs font-mono text-orange-400/80">
            {t.audioProtocol}
          </p>
        </div>
      )}
    </div>
  );
};
