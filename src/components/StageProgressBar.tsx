import React from 'react';
import { QuizStage, Language } from '../types';
import { translations } from '../utils/translations';
import { Sparkles, User, HelpCircle, CheckCircle2, Flame, PartyPopper } from 'lucide-react';

interface StageProgressBarProps {
  currentStage: QuizStage;
  isRevealed: boolean;
  lang: Language;
}

export const StageProgressBar: React.FC<StageProgressBarProps> = ({ currentStage, isRevealed, lang }) => {
  const t = translations[lang].stages;

  const STAGES: { key: QuizStage; label: string; code: string; stepNumber: number }[] = [
    { key: 'welcome', label: t.identity, code: '01', stepNumber: 1 },
    { key: 'choice', label: t.guess, code: '02', stepNumber: 2 },
    { key: 'confirm', label: t.confirm, code: '03', stepNumber: 3 },
    { key: 'ready', label: t.ignition, code: '04', stepNumber: 4 },
    { key: 'reveal', label: t.reveal, code: '05', stepNumber: 5 },
  ];

  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 py-2">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0" />
        
        {/* Active track line */}
        <div
          className={`absolute left-6 top-1/2 -translate-y-1/2 h-[2px] z-0 transition-all duration-700 ${
            isRevealed
              ? 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_#60A5FA]'
              : 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_#FB923C]'
          }`}
          style={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (STAGES.length - 1)) * 92))}%`,
          }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          let badgeClasses = 'bg-[#0F172A] text-slate-400 border border-white/15';
          if (isRevealed && idx === 4) {
            badgeClasses = 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_15px_#3B82F6] scale-110';
          } else if (isCurrent) {
            badgeClasses = isRevealed
              ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_15px_#3B82F6] scale-110'
              : 'bg-orange-600 text-white border border-orange-400 shadow-[0_0_15px_#EA580C] scale-110';
          } else if (isCompleted) {
            badgeClasses = isRevealed
              ? 'bg-blue-950 text-blue-300 border border-blue-500/50'
              : 'bg-orange-950 text-orange-300 border border-orange-500/50';
          }

          return (
            <div key={stage.key} className="flex flex-col items-center relative z-10 select-none">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${badgeClasses}`}
              >
                {isCompleted ? '✓' : stage.code}
              </div>
              <span
                className={`text-[10px] font-mono tracking-wider uppercase mt-1.5 hidden sm:block whitespace-nowrap transition-colors ${
                  isRevealed
                    ? isCurrent
                      ? 'text-blue-300 font-bold'
                      : 'text-slate-400'
                    : isCurrent
                    ? 'text-orange-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
