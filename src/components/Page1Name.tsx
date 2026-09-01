import React, { useState } from 'react';
import { Sparkles, Heart, Baby, ArrowRight, UserCheck } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface Page1NameProps {
  onNext: (name: string, relationship: string, message: string) => void;
  initialName?: string;
  initialRelationship?: string;
  initialMessage?: string;
  lang: Language;
}

export const Page1Name: React.FC<Page1NameProps> = ({
  onNext,
  initialName = '',
  initialRelationship = '',
  initialMessage = '',
  lang,
}) => {
  const t = translations[lang].page1;

  const [name, setName] = useState(initialName);
  const [relationship, setRelationship] = useState(initialRelationship);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.nameError);
      return;
    }
    sounds.playPop();
    onNext(name.trim(), relationship.trim(), message.trim());
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-300">
      {/* Subtle top indicator */}
      <div className="text-center mb-6">
        <div className="text-orange-400 font-mono text-[11px] tracking-[0.25em] uppercase mb-2">
          {t.stageTag}
        </div>
        <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-white font-display">
          {t.titleStart} <span className="font-bold text-orange-400">{t.titleHighlight}</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          {t.desc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name input */}
        <div>
          <label htmlFor="participant-name" className="block text-xs font-mono tracking-wider uppercase text-slate-300 mb-2">
            {t.nameLabel} <span className="text-orange-400">*</span>
          </label>
          <div className="relative">
            <input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-white/15 bg-white/[0.03] text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-400/80 focus:ring-1 focus:ring-orange-400/80 text-sm font-medium transition-all"
              autoFocus
            />
            <UserCheck className="w-4 h-4 text-orange-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {error && <p className="text-rose-400 text-xs font-mono mt-2">{error}</p>}
        </div>

        {/* Relationship tags */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2.5">
            {t.relationLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {t.relationTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setRelationship(relationship === tag ? '' : tag);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all border cursor-pointer ${
                  relationship === tag
                    ? 'bg-orange-500/20 text-orange-300 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 border-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Optional wish/note */}
        <div>
          <label htmlFor="participant-message" className="block text-xs font-mono tracking-wider uppercase text-slate-400 mb-2">
            {t.messageLabel}
          </label>
          <textarea
            id="participant-message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            className="w-full px-4 py-3 rounded-2xl border border-white/15 bg-white/[0.03] text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-400/80 focus:ring-1 focus:ring-orange-400/80 text-xs transition-all resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          id="btn-start-quiz"
          className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase transition-all border border-orange-400/40 shadow-[0_0_25px_rgba(249,115,22,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <span>{t.nextBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
