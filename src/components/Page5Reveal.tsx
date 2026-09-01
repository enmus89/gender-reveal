import React, { useEffect, useState } from 'react';
import { GuessChoice, ParticipantSubmission, QuizStats, Language } from '../types';
import {
  PartyPopper,
  Sparkles,
  Trophy,
  Users,
  Share2,
  Check,
  RotateCcw,
  Volume2,
  Heart,
  Baby,
  RefreshCw,
  Crown,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { getStoredParentPin, removeParentPinFromStorage } from '../utils/parentAuth';
import { ParentPinModal } from './ParentPinModal';
import { translations } from '../utils/translations';
import { getScoreboard } from '../utils/sheetApi';

interface Page5RevealProps {
  participantName: string;
  userChoice: GuessChoice | null;
  onPlayAgain: () => void;
  lang: Language;
}

export const Page5Reveal: React.FC<Page5RevealProps> = ({
  participantName,
  userChoice,
  onPlayAgain,
  lang,
}) => {
  const t = translations[lang].page5;
  const [submissions, setSubmissions] = useState<ParticipantSubmission[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    total: 0,
    boyVotes: 0,
    girlVotes: 0,
    boyPercentage: 0,
    girlPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'boy' | 'girl'>('all');
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const isGuessedBoy = userChoice === 'boy';

  const fetchScoreboard = async (pinOverride?: string) => {
    const activePin = pinOverride || getStoredParentPin() || '';
    try {
      setLoading(true);
      const data = await getScoreboard(activePin);
      setStats(data.stats);
      if (data.authorized) {
        setIsParentUnlocked(true);
        setSubmissions(data.submissions || []);
      } else {
        setIsParentUnlocked(false);
        setSubmissions([]);
      }
    } catch (err) {
      console.error('Error fetching scoreboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreboard();
    const interval = setInterval(() => {
      const pin = getStoredParentPin();
      if (pin) fetchScoreboard(pin);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    sounds.playPop();
    const shareUrl = window.location.href.split('#')[0].split('?')[0];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handlePinUnlockSuccess = (pin: string) => {
    setIsParentUnlocked(true);
    fetchScoreboard(pin);
  };

  const handleLockScoreboard = () => {
    sounds.playPop();
    removeParentPinFromStorage();
    setIsParentUnlocked(false);
    setSubmissions([]);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === 'boy') return s.choice === 'boy';
    if (activeTab === 'girl') return s.choice === 'girl';
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Big Headline Hero Card */}
      <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-400/30 relative overflow-hidden transition-all duration-300">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/40 text-blue-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
            <span>{t.protocolBadge}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
          </div>

          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl select-none animate-bounce">
              👶💙👑
            </div>
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-100 to-cyan-300 drop-shadow-[0_0_35px_rgba(59,130,246,0.8)]">
              {t.revealTitle}
            </h1>
            <p className="text-blue-200/90 text-xs sm:text-sm max-w-md mx-auto">
              {t.revealSubtitle}
            </p>
          </div>

          {/* User's personal result badge */}
          <div className="pt-2">
            {isGuessedBoy ? (
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-emerald-500/10 border border-emerald-400/40 p-4 rounded-2xl text-left max-w-md mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 text-xl">
                  🏆
                </div>
                <div>
                  <div className="text-emerald-300 font-mono font-bold text-xs sm:text-sm flex items-center gap-1.5 uppercase tracking-wider">
                    <span>{t.correctScoreTitle}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t.correctMsg.replace('{name}', participantName)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-pink-500/10 border border-pink-400/30 p-4 rounded-2xl text-left max-w-md mx-auto shadow-[0_0_20px_rgba(244,114,182,0.15)]">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 text-xl">
                  💖
                </div>
                <div>
                  <div className="text-pink-300 font-mono font-bold text-xs sm:text-sm flex items-center gap-1.5 uppercase tracking-wider">
                    <span>{t.incorrectScoreTitle}</span>
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t.incorrectMsg.replace('{name}', participantName)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="btn-fanfare-replay"
              onClick={() => sounds.playRevealFanfare()}
              className="px-4 py-2.5 rounded-full bg-blue-600/60 hover:bg-blue-600 text-white text-xs font-mono tracking-wider uppercase flex items-center gap-2 border border-blue-400/40 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.replaySound}</span>
            </button>

            <button
              type="button"
              id="btn-share-quiz"
              onClick={handleShare}
              className="px-4 py-2.5 rounded-full bg-cyan-600/70 hover:bg-cyan-600 text-white text-xs font-mono tracking-wider uppercase flex items-center gap-2 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.shareBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-play-again"
              onClick={onPlayAgain}
              className="px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-mono tracking-wider uppercase flex items-center gap-2 border border-white/10 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.playAgainBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parents-Only PIN Modal */}
      <ParentPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinUnlockSuccess}
        lang={lang}
      />

      {/* Scoreboard Section */}
      {!isParentUnlocked ? (
        /* Regular Player View: Guarded / Hidden Scoreboard */
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-orange-400 mx-auto flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <div className="text-orange-400 font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
                {t.guardedTag}
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                {t.guardedTitle}
              </h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                {t.guardedDesc}
              </p>
            </div>

            {/* Quick stats preview */}
            <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/10 flex items-center justify-around text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">{t.totalParticipants}</span>
                <span className="text-lg font-bold text-white">{stats.total}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-500 block text-[10px]">{t.predictionsRoster}</span>
                <span className="text-xs text-orange-300 font-bold">{t.momDadVault} 🔒</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="btn-unlock-parents-view"
                onClick={() => {
                  sounds.playPop();
                  setShowPinModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600/80 hover:bg-orange-500 text-white font-mono text-xs font-bold tracking-wider uppercase border border-orange-400/40 shadow-[0_0_20px_rgba(249,115,22,0.25)] transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t.parentsPinBtn}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked View for Parents */
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-xs font-mono tracking-wider uppercase mb-1 border border-orange-400/20">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.parentsDashboard}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                {t.whoGuessedWhat}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchScoreboard()}
                className="p-2 rounded-xl bg-white/[0.04] text-blue-400 hover:bg-white/[0.08] transition-colors border border-white/10 cursor-pointer"
                title="Refresh submissions"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleLockScoreboard}
                className="px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-1.5 border border-amber-500/30 transition-colors cursor-pointer"
                title="Lock when passing phone"
              >
                <Lock className="w-3 h-3" />
                <span>{t.lockView}</span>
              </button>
            </div>
          </div>

          {/* Stats Ratio Bar */}
          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/10 mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-blue-400">
                <span>👑</span>
                <span>{t.teamBoyCorrect}: {stats.boyVotes}</span>
                <span className="bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 rounded-full text-blue-300">
                  {stats.boyPercentage}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-pink-400">
                <span className="bg-pink-500/20 border border-pink-400/30 px-2 py-0.5 rounded-full text-pink-300">
                  {stats.girlPercentage}%
                </span>
                <span>{t.teamGirl}: {stats.girlVotes}</span>
                <span>🎀</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-white/[0.05] rounded-full overflow-hidden flex border border-white/10">
              <div
                className="h-full bg-blue-500 transition-all duration-700 relative shadow-[0_0_12px_#3B82F6]"
                style={{ width: `${stats.total > 0 ? stats.boyPercentage : 50}%` }}
              />
              <div
                className="h-full bg-pink-500 transition-all duration-700 shadow-[0_0_12px_#EC4899]"
                style={{ width: `${stats.total > 0 ? stats.girlPercentage : 50}%` }}
              />
            </div>

            <p className="text-center text-[11px] font-mono text-slate-400">
              {t.totalSubmissions}: <span className="font-bold text-white">{stats.total}</span>
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600/40 text-blue-300 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              {t.allGuesses} ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('boy')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer ${
                activeTab === 'boy'
                  ? 'bg-blue-600/40 text-blue-300 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              {t.tabBoy} ({stats.boyVotes})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('girl')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer ${
                activeTab === 'girl'
                  ? 'bg-pink-600/40 text-pink-300 border-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.3)]'
                  : 'bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              {t.tabGirl} ({stats.girlVotes})
            </button>
          </div>

          {/* Submissions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-white/[0.01] rounded-2xl border border-dashed border-white/10 font-mono text-xs">
                <Baby className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>{t.noPredictions}</p>
              </div>
            ) : (
              filteredSubmissions.map((item) => {
                const guessedBoy = item.choice === 'boy';
                const formattedDate = new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      guessedBoy
                        ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
                        : 'bg-pink-500/5 border-pink-500/20 hover:border-pink-500/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm font-mono">
                          {item.name}
                        </span>
                        {item.relationship && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                            {item.relationship}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          {formattedDate}
                        </span>
                      </div>

                      {item.message && (
                        <p className="text-xs italic text-slate-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06] mt-1">
                          &ldquo;{item.message}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Badge */}
                    <div className="shrink-0 flex items-center gap-2">
                      {guessedBoy ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
                          <span>{t.teamBoyBadge}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-mono font-bold">
                          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                          <span>{t.teamGirlBadge}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
