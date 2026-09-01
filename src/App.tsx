import React, { useState } from 'react';
import { QuizStage, GuessChoice, Language } from './types';
import { StageProgressBar } from './components/StageProgressBar';
import { HeaderNav } from './components/HeaderNav';
import { Page1Name } from './components/Page1Name';
import { Page2Choice } from './components/Page2Choice';
import { Page3Confirm } from './components/Page3Confirm';
import { Page4Ready } from './components/Page4Ready';
import { Page5Reveal } from './components/Page5Reveal';
import { SmokeAndFireworks } from './components/SmokeAndFireworks';
import { sounds } from './utils/audio';
import { getStoredLanguage, saveStoredLanguage, translations } from './utils/translations';

export default function App() {
  const [lang, setLang] = useState<Language>(() => getStoredLanguage());
  const [stage, setStage] = useState<QuizStage>('welcome');
  const [participantName, setParticipantName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [userChoice, setUserChoice] = useState<GuessChoice | null>(null);

  const isRevealed = stage === 'reveal';

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    saveStoredLanguage(newLang);
  };

  const handlePage1Next = (name: string, rel: string, msg: string) => {
    setParticipantName(name);
    setRelationship(rel);
    setMessage(msg);
    setStage('choice');
  };

  const handlePage2Select = (choice: GuessChoice) => {
    setUserChoice(choice);
    setStage('confirm');
  };

  const handlePage3Confirm = () => {
    setStage('ready');
  };

  const handlePage3Rechoose = () => {
    setStage('choice');
  };

  const handlePage4Reveal = () => {
    setStage('reveal');
  };

  const handlePlayAgain = () => {
    sounds.playPop();
    setStage('welcome');
    setParticipantName('');
    setRelationship('');
    setMessage('');
    setUserChoice(null);
  };

  const tFooter = translations[lang].footer;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-1000 relative overflow-x-hidden font-sans ${
        isRevealed
          ? 'bg-[#0B132B] text-slate-100'
          : 'bg-[#0F172A] text-slate-100'
      }`}
    >
      {/* Blue Smoke and Fireworks Animation Layer when revealed */}
      <SmokeAndFireworks active={isRevealed} />

      {/* Decorative ambient lighting nodes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {isRevealed ? (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[130px]" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* Header Bar */}
      <HeaderNav
        isRevealed={isRevealed}
        onReset={handlePlayAgain}
        lang={lang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-4 sm:py-6 z-10 w-full max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full mb-6">
          <StageProgressBar
            currentStage={stage}
            isRevealed={isRevealed}
            lang={lang}
          />
        </div>

        {/* Current Quiz Page */}
        <div className="w-full">
          {stage === 'welcome' && (
            <Page1Name
              onNext={handlePage1Next}
              initialName={participantName}
              initialRelationship={relationship}
              initialMessage={message}
              lang={lang}
            />
          )}

          {stage === 'choice' && (
            <Page2Choice
              participantName={participantName}
              initialChoice={userChoice}
              onSelect={handlePage2Select}
              onBack={() => setStage('welcome')}
              lang={lang}
            />
          )}

          {stage === 'confirm' && userChoice && (
            <Page3Confirm
              participantName={participantName}
              relationship={relationship}
              message={message}
              choice={userChoice}
              onConfirmed={handlePage3Confirm}
              onRechoose={handlePage3Rechoose}
              lang={lang}
            />
          )}

          {stage === 'ready' && (
            <Page4Ready
              participantName={participantName}
              onReveal={handlePage4Reveal}
              lang={lang}
            />
          )}

          {stage === 'reveal' && (
            <Page5Reveal
              participantName={participantName}
              userChoice={userChoice}
              onPlayAgain={handlePlayAgain}
              lang={lang}
            />
          )}
        </div>
      </main>

      {/* Telemetry Footer */}
      <footer className="w-full py-5 px-6 border-t border-white/[0.06] bg-black/20 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isRevealed ? 'bg-blue-400 shadow-[0_0_8px_#60A5FA]' : 'bg-orange-400 shadow-[0_0_8px_#FB923C]'}`} />
            <span>{tFooter.engineOnline}</span>
          </div>
          <p className={isRevealed ? 'text-blue-300/80' : 'text-orange-300/80'}>
            {tFooter.celebratingBoy}
          </p>
        </div>
      </footer>
    </div>
  );
}
