import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Check, Lock, Unlock, Baby, Sparkles, X, Trash2, KeyRound, Search, RefreshCw, ShieldCheck, Globe } from 'lucide-react';
import { sounds } from '../utils/audio';
import { QuizStats, ParticipantSubmission, Language } from '../types';
import { getStoredParentPin, removeParentPinFromStorage } from '../utils/parentAuth';
import { translations } from '../utils/translations';
import { getScoreboard, deleteSubmission, clearAllSubmissions } from '../utils/sheetApi';
import { ParentPinModal } from './ParentPinModal';

interface HeaderNavProps {
  isRevealed: boolean;
  onReset: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isRevealed,
  onReset,
  lang,
  onLanguageChange,
}) => {
  const tHeader = translations[lang].header;
  const tAdmin = translations[lang].adminModal;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [adminSubmissions, setAdminSubmissions] = useState<ParticipantSubmission[]>([]);
  const [adminStats, setAdminStats] = useState<QuizStats | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState<'all' | 'boy' | 'girl'>('all');

  useEffect(() => {
    const pin = getStoredParentPin();
    if (pin) {
      setIsParentUnlocked(true);
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playPop();
  };

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

  const toggleLang = () => {
    sounds.playPop();
    const nextLang: Language = lang === 'en' ? 'sq' : 'en';
    onLanguageChange(nextLang);
  };

  const fetchAdminData = async (pin?: string) => {
    const activePin = pin || getStoredParentPin() || '';
    try {
      setAdminLoading(true);
      const data = await getScoreboard(activePin);
      if (data.authorized) {
        setIsParentUnlocked(true);
        setAdminSubmissions(data.submissions || []);
        setAdminStats(data.stats || null);
      } else {
        setIsParentUnlocked(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleOpenParentPortal = () => {
    sounds.playPop();
    const storedPin = getStoredParentPin();
    if (storedPin) {
      setShowAdminModal(true);
      fetchAdminData(storedPin);
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = (pin: string) => {
    setIsParentUnlocked(true);
    setShowAdminModal(true);
    fetchAdminData(pin);
  };

  const handleLockParentSession = () => {
    sounds.playPop();
    removeParentPinFromStorage();
    setIsParentUnlocked(false);
    setShowAdminModal(false);
  };

  const handleDeleteItem = async (id: string) => {
    const pin = getStoredParentPin() || '';
    try {
      await deleteSubmission(id, pin);
      setAdminSubmissions((prev) => prev.filter((s) => s.id !== id));
      fetchAdminData(pin);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm(tAdmin.resetConfirm)) return;
    const pin = getStoredParentPin() || '';
    try {
      await clearAllSubmissions(pin);
      setAdminSubmissions([]);
      setAdminStats({
        total: 0,
        boyVotes: 0,
        girlVotes: 0,
        boyPercentage: 0,
        girlPercentage: 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSubmissions = adminSubmissions.filter((s) => {
    const matchesFilter =
      tabFilter === 'all' ? true : tabFilter === 'boy' ? s.choice === 'boy' : s.choice === 'girl';
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.relationship && s.relationship.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.message && s.message.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <header className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between z-20 relative border-b border-white/[0.06]">
        {/* Brand */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
              isRevealed
                ? 'bg-blue-600/30 text-blue-300 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-orange-500/20 text-orange-300 border border-orange-400/30 shadow-[0_0_15px_rgba(249,115,22,0.25)]'
            }`}
          >
            🎁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-white group-hover:text-slate-200 transition-colors">
                {tHeader.appTitle}
              </span>
              <span
                className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded tracking-widest ${
                  isRevealed
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                }`}
              >
                {isRevealed ? tHeader.revealedTag : tHeader.quizTag}
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 tracking-wider">
              {tHeader.appSubtitle}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Language Selector Button */}
          <button
            type="button"
            id="btn-language-toggle"
            onClick={toggleLang}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all border cursor-pointer ${
              lang === 'sq'
                ? 'bg-red-950/50 text-red-200 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                : 'bg-blue-950/50 text-blue-200 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.25)]'
            }`}
            title="Switch Language / Ndrysho Gjuhën"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-bold">{lang === 'en' ? '🇬🇧 EN' : '🇦🇱 SQ'}</span>
          </button>

          {/* Parents Only Scoreboard Button */}
          <button
            type="button"
            id="btn-parents-portal"
            onClick={handleOpenParentPortal}
            className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all border cursor-pointer ${
              isParentUnlocked
                ? 'bg-orange-500/20 text-orange-300 border-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                : isRevealed
                ? 'bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border-blue-500/30'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/10 hover:border-orange-500/40'
            }`}
            title={tHeader.parentsPortal}
          >
            {isParentUnlocked ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">{tHeader.parentsPortal}</span>
                <span className="sm:hidden">PARENTS</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">{tHeader.parentsOnly}</span>
                <span className="sm:hidden">PARENTS</span>
              </>
            )}
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={handleShare}
            className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all border cursor-pointer ${
              isRevealed
                ? 'bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border-blue-500/30'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/10 hover:border-orange-500/40'
            }`}
            title="Copy Game Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400">{tHeader.copied}</span>
              </>
            ) : (
              <>
                <Share2 className={`w-3.5 h-3.5 ${isRevealed ? 'text-blue-400' : 'text-orange-400'}`} />
                <span className="hidden sm:inline">{tHeader.share}</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2 rounded-full text-xs transition-all border cursor-pointer ${
              isRevealed
                ? 'bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border-blue-500/30'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/10 hover:border-orange-500/40'
            }`}
            title={soundEnabled ? tHeader.muteAudio : tHeader.enableAudio}
          >
            {soundEnabled ? (
              <Volume2 className={`w-3.5 h-3.5 ${isRevealed ? 'text-blue-400' : 'text-orange-400'}`} />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* Parent PIN Prompt Modal */}
      <ParentPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        lang={lang}
      />

      {/* Parents Dashboard Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-orange-400 uppercase">
                    {tAdmin.confidentialTag}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                    {tAdmin.unlockedBadge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  {tAdmin.modalTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchAdminData()}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={tAdmin.refreshTitle}
                >
                  <RefreshCw className={`w-4 h-4 ${adminLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick summary numbers */}
            {adminStats && (
              <div className="grid grid-cols-3 gap-3 text-center mb-5">
                <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-mono uppercase text-slate-400">{tAdmin.totalParticipants}</div>
                  <div className="text-2xl font-bold text-white font-mono mt-1">{adminStats.total}</div>
                </div>
                <div className="bg-blue-500/10 p-3.5 rounded-2xl border border-blue-500/30">
                  <div className="text-[10px] font-mono uppercase text-blue-400">{tAdmin.teamBoy}</div>
                  <div className="text-xl font-bold text-blue-300 font-mono mt-1">
                    {adminStats.boyVotes} <span className="text-xs text-blue-400/80">({adminStats.boyPercentage}%)</span>
                  </div>
                </div>
                <div className="bg-pink-500/10 p-3.5 rounded-2xl border border-pink-500/30">
                  <div className="text-[10px] font-mono uppercase text-pink-400">{tAdmin.teamGirl}</div>
                  <div className="text-xl font-bold text-pink-300 font-mono mt-1">
                    {adminStats.girlVotes} <span className="text-xs text-pink-400/80">({adminStats.girlPercentage}%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={tAdmin.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-orange-400"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTabFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border cursor-pointer ${
                    tabFilter === 'all'
                      ? 'bg-white/15 text-white border-white/30'
                      : 'bg-white/[0.02] text-slate-400 border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  {tAdmin.allTab} ({adminSubmissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTabFilter('boy')}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border cursor-pointer ${
                    tabFilter === 'boy'
                      ? 'bg-blue-500/30 text-blue-300 border-blue-400'
                      : 'bg-white/[0.02] text-slate-400 border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  {tAdmin.boyTab}
                </button>
                <button
                  type="button"
                  onClick={() => setTabFilter('girl')}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border cursor-pointer ${
                    tabFilter === 'girl'
                      ? 'bg-pink-500/30 text-pink-300 border-pink-400'
                      : 'bg-white/[0.02] text-slate-400 border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  {tAdmin.girlTab}
                </button>
              </div>
            </div>

            {/* Submissions Roster */}
            <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-1">
              {adminLoading ? (
                <p className="text-center py-8 text-xs font-mono text-slate-400">{tAdmin.loadingDb}</p>
              ) : filteredSubmissions.length === 0 ? (
                <p className="text-center py-8 text-xs font-mono text-slate-500">{tAdmin.noMatches}</p>
              ) : (
                filteredSubmissions.map((sub) => {
                  const dateFormatted = new Date(sub.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/10 flex items-start justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white font-mono">{sub.name}</span>
                          {sub.relationship && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                              {sub.relationship}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">
                            {dateFormatted}
                          </span>
                        </div>
                        {sub.message && (
                          <div className="text-slate-300 italic text-[11px] bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
                            &ldquo;{sub.message}&rdquo;
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full border ${
                            sub.choice === 'boy'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                          }`}
                        >
                          {sub.choice === 'boy' ? tAdmin.boyCorrectBadge : tAdmin.girlBadge}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(sub.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLockParentSession}
                  className="px-3.5 py-2 text-xs font-mono text-amber-400 hover:bg-amber-500/10 rounded-full flex items-center gap-1.5 transition-colors border border-amber-500/20 cursor-pointer"
                  title="Lock when passing phone to others"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{tAdmin.lockParentView}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3.5 py-2 text-xs font-mono text-rose-400 hover:bg-rose-500/10 rounded-full flex items-center gap-1.5 transition-colors border border-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{tAdmin.resetAll}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-mono tracking-wider transition-colors cursor-pointer border border-white/15"
              >
                {tAdmin.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


