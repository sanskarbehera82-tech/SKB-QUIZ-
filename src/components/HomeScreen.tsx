import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Sparkles, BookOpen, Calculator, Atom, Landmark, Globe, Languages, Flame, Check, Target, Settings2, CheckCircle2, X, Trophy, ChevronRight, Gamepad2, Zap, Lightbulb, RefreshCw, Lock, Share2 } from 'lucide-react';
import { Subject, getTotalStats } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { toOdiaNumber } from '../utils/odiaNumerals';
import { StreakData } from '../utils/streak';
import { DailyGoalData } from '../utils/dailyGoal';
import { StudyTip, getRandomTip } from '../data/studyTips';
import { StudyTipsModal } from './StudyTipsModal';
import { DailyGoalLockModal } from './DailyGoalLockModal';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeScreenProps {
  onStart: () => void;
  subjects: Subject[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedQuizzesCount: number;
  streak: StreakData;
  dailyGoal: DailyGoalData;
  onUpdateGoalTarget: (target: number) => void;
  onOpenAchievements: () => void;
  unlockedBadgesCount: number;
  onOpenGamesHub: () => void;
  onPlaySubwaySurfers: () => void;
  onPlayTempleRun: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStart,
  subjects,
  soundEnabled,
  onToggleSound,
  completedQuizzesCount,
  streak,
  dailyGoal,
  onUpdateGoalTarget,
  onOpenAchievements,
  unlockedBadgesCount,
  onOpenGamesHub,
  onPlaySubwaySurfers,
  onPlayTempleRun
}) => {
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [showGoalLockModal, setShowGoalLockModal] = useState<boolean>(false);
  const [tempTarget, setTempTarget] = useState<number>(dailyGoal.target);
  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [copiedShareNotice, setCopiedShareNotice] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<StudyTip>(() => getRandomTip());
  const stats = getTotalStats();

  const isGoalCompleted = dailyGoal.completedToday >= dailyGoal.target;
  const remainingQuizzesForGoal = Math.max(0, dailyGoal.target - dailyGoal.completedToday);

  const handleShareApp = async () => {
    soundManager.playClick();
    const shareData = {
      title: 'SKV Quiz - Odisha Matric Class 10 Exam Preparation',
      text: '🎯 SKV Quiz: BSE Odisha Class 10 (ଦଶମ ଶ୍ରେଣୀ) ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି କୁଇଜ୍, ୭ଟି ବିଷୟ, ଦୈନିକ ଲକ୍ଷ୍ୟ ଓ ରନର୍ ଗେମ୍ସ! ଏବେ ହିଁ ଅଭ୍ୟାସ ଆରମ୍ଭ କରନ୍ତୁ:',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user dismissed or share cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setCopiedShareNotice(true);
        setTimeout(() => setCopiedShareNotice(false), 2500);
      } catch {
        // clipboard fallback
      }
    }
  };

  const handleOpenGamesHub = () => {
    soundManager.playClick();
    if (!isGoalCompleted) {
      setShowGoalLockModal(true);
    } else {
      onOpenGamesHub();
    }
  };

  const handlePlaySubwaySurfers = () => {
    soundManager.playClick();
    if (!isGoalCompleted) {
      setShowGoalLockModal(true);
    } else {
      onPlaySubwaySurfers();
    }
  };

  const handlePlayTempleRun = () => {
    soundManager.playClick();
    if (!isGoalCompleted) {
      setShowGoalLockModal(true);
    } else {
      onPlayTempleRun();
    }
  };

  const handlePlayClick = () => {
    soundManager.playClick();
    onStart();
  };

  const subjectIconMap: Record<string, React.ReactNode> = {
    'book-open': <BookOpen className="w-4 h-4 text-amber-600" />,
    'languages': <Languages className="w-4 h-4 text-indigo-600" />,
    'calculator': <Calculator className="w-4 h-4 text-emerald-600" />,
    'atom': <Atom className="w-4 h-4 text-cyan-600" />,
    'landmark': <Landmark className="w-4 h-4 text-rose-600" />,
    'globe': <Globe className="w-4 h-4 text-teal-600" />
  };

  return (
    <div className="flex flex-col min-h-screen justify-between p-4 sm:p-6 max-w-lg mx-auto w-full">
      {/* Top Bar with Brand, Badges & Sound */}
      <header className="flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-lg">
            SKV
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              SKV Quiz
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ଏସ.କେ.ଭି. କୁଇଜ୍
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* In-app PWA Install Button */}
          <PWAInstallButton />

          {/* Mini Games Hub Button */}
          <button
            onClick={handleOpenGamesHub}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition-all cursor-pointer ${
              isGoalCompleted
                ? 'border-indigo-200/90 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 shadow-2xs'
                : 'border-slate-200 bg-slate-50/90 hover:bg-slate-100 text-slate-600'
            }`}
            title={isGoalCompleted ? 'ମିନି ଗେମ୍ସ (Mini Games - Unlocked)' : 'ମିନି ଗେମ୍ସ (ଲକ୍ଷ୍ୟ ପୂରଣ କରନ୍ତୁ)'}
            aria-label="Mini Games"
          >
            {isGoalCompleted ? (
              <Gamepad2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="odia-text text-[11px]">ଗେମ୍ସ</span>
          </button>

          {/* Achievements Trophy Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-200/90 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            title="ପୁରସ୍କାର ଓ ବ୍ୟାଜ୍ (Achievements)"
            aria-label="Achievements"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="font-mono">{toOdiaNumber(unlockedBadgesCount)}</span>
          </button>

          {/* Quick Streak Header Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${
              streak.count > 0
                ? 'bg-orange-50/80 border-orange-200/80 text-orange-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="ଦୈନିକ ଷ୍ଟ୍ରିକ୍"
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                streak.count > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'
              }`}
            />
            <span className="font-mono">{toOdiaNumber(streak.count)}</span>
          </div>

          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
            title={soundEnabled ? 'ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ (Mute)' : 'ଶବ୍ଦ ଚାଲୁ କରନ୍ତୁ (Sound On)'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Share App Button */}
          <button
            onClick={handleShareApp}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 transition-all cursor-pointer"
            title="ସାଙ୍ଗମାନଙ୍କ ସହ ସେୟାର କରନ୍ତୁ (Share App)"
            aria-label="Share App"
          >
            {copiedShareNotice ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col justify-center py-4 text-center">
        {/* Animated Emblem / Mascot Icon */}
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-indigo-500 to-blue-700 p-0.5 shadow-lg shadow-indigo-600/25 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-900/10 backdrop-blur-xs rounded-[22px] flex flex-col items-center justify-center text-white">
              <span className="text-3xl">📖</span>
              <span className="text-[10px] font-bold tracking-widest uppercase mt-0.5 text-amber-300">
                ODIA QUIZ
              </span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight odia-text mb-1">
          ଓଡ଼ିଆ ବିଦ୍ୟାଳୟ କୁଇଜ୍
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 odia-text max-w-sm mx-auto mb-4">
          {toOdiaNumber(subjects.length)} ଟି ବିଷୟ ଓ ଅଧ୍ୟାୟ ଭିତ୍ତିକ ପ୍ରଶ୍ନୋତ୍ତର ମାଧ୍ୟମରେ ନିଜ ଜ୍ଞାନ ପରୀକ୍ଷା କରନ୍ତୁ।
        </p>

        {/* Daily Streak Card */}
        <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-white rounded-2xl p-4 border border-orange-200/80 shadow-xs mb-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  streak.count > 0 ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Flame className={`w-5 h-5 ${streak.count > 0 ? 'fill-white' : ''}`} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 odia-text flex items-center gap-1.5">
                  <span>ଦୈନିକ ଷ୍ଟ୍ରିକ୍ (Daily Streak)</span>
                  {streak.completedToday && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      ଆଜି ସମ୍ପୂର୍ଣ୍ଣ
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {streak.count > 0 ? (
                    <span>କ୍ରମାଗତ {toOdiaNumber(streak.count)} ଦିନ କୁଇଜ୍ ଅଭ୍ୟାସ</span>
                  ) : (
                    <span>ଆଜିଠାରୁ ଦୈନିକ ଅଭ୍ୟାସ ଆରମ୍ଭ କରନ୍ତୁ</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-orange-600 font-mono tracking-tight">
                {toOdiaNumber(streak.count)}
              </span>
              <span className="text-xs font-semibold text-slate-500 odia-text ml-1">ଦିନ</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 odia-text pt-2 border-t border-orange-100/80">
            {streak.completedToday
              ? '✨ ଆଜିର ଲକ୍ଷ୍ୟ ପୂରଣ ହୋଇଛି! କାଲି ପୁଣି ଖେଳି ନିଜ ଷ୍ଟ୍ରିକ୍ ବୃଦ୍ଧି କରନ୍ତୁ।'
              : streak.count > 0
              ? `🔥 ଆଜି ଅନ୍ତତଃ ଗୋଟିଏ ଅଧ୍ୟାୟ କୁଇଜ୍ ଖେଳି ଆପଣଙ୍କ ${toOdiaNumber(streak.count)} ଦିନର ଷ୍ଟ୍ରିକ୍ ବଜାୟ ରଖନ୍ତୁ!`
              : '🎯 ପ୍ରତିଦିନ ଅନ୍ତତଃ ଗୋଟିଏ କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ କରି ନିଜ ଦୈନିକ ଷ୍ଟ୍ରିକ୍ ଗଠନ କରନ୍ତୁ!'}
          </p>
        </div>

        {/* Daily Learning Goal Card */}
        {(() => {
          const goalPercent = Math.min(100, Math.round((dailyGoal.completedToday / dailyGoal.target) * 100));
          const goalReached = dailyGoal.completedToday >= dailyGoal.target;
          const remaining = Math.max(0, dailyGoal.target - dailyGoal.completedToday);

          return (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs mb-4 text-left">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      goalReached ? 'bg-emerald-500 text-white shadow-xs' : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    {goalReached ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 odia-text">
                      ଦୈନିକ ଶିକ୍ଷା ଲକ୍ଷ୍ୟ (Daily Goal)
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                      ଲକ୍ଷ୍ୟ: ଦିନକୁ {toOdiaNumber(dailyGoal.target)} ଟି କୁଇଜ୍
                    </div>
                  </div>
                </div>

                {/* Edit Goal Target Button */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setTempTarget(dailyGoal.target);
                    setShowGoalModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  title="ଲକ୍ଷ୍ୟ ବଦଳାନ୍ତୁ"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span className="odia-text text-[11px]">ବଦଳାନ୍ତୁ</span>
                </button>
              </div>

              {/* Progress Count & Percentage */}
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 odia-text">
                  ପ୍ରଗତି: <strong className="text-slate-900 font-mono">{toOdiaNumber(dailyGoal.completedToday)}</strong> / {toOdiaNumber(dailyGoal.target)} ସମ୍ପୂର୍ଣ୍ଣ
                </span>
                <span className={`font-mono text-xs font-bold ${goalReached ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  {goalPercent}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    goalReached
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  }`}
                  style={{ width: `${goalPercent}%` }}
                />
              </div>

              {/* Goal Status Note & Runner Unlock Status */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <p className="text-slate-600 odia-text truncate mr-1">
                  {goalReached
                    ? '🎉 ବହୁତ ବଢ଼ିଆ! ଆପଣ ଆଜିର ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂରଣ କରିଛନ୍ତି।'
                    : `ଆଜି ଆଉ ${toOdiaNumber(remaining)} ଟି କୁଇଜ୍ ସାରି ନିଜ ଲକ୍ଷ୍ୟ ପୂରଣ କରନ୍ତୁ!`}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                    goalReached
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {goalReached ? '🏃‍♂️ ଗେମ୍ସ ଅନଲକ୍' : '🔒 ଗେମ୍ସ ଲକ୍'}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Achievements Quick Bar */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAchievements();
          }}
          className="w-full bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 rounded-2xl p-3.5 border border-amber-200/90 shadow-xs mb-4 flex items-center justify-between text-left hover:border-amber-300 active:scale-[0.99] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 odia-text flex items-center gap-1.5">
                <span>ପୁରସ୍କାର ଓ ବ୍ୟାଜ୍ (Achievements)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {toOdiaNumber(unlockedBadgesCount)} ଟି ବ୍ୟାଜ୍ ଅର୍ଜିତ · ମାଇଲଖୁଣ୍ଟ ଦେଖନ୍ତୁ
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            <span className="odia-text text-[11px]">ଦେଖନ୍ତୁ</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Educational Mini Games Hub Banner with Daily Goal Lock */}
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 border border-indigo-900/50 text-white shadow-xs mb-4 text-left relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 ${
                  isGoalCompleted
                    ? 'bg-gradient-to-tr from-amber-500 to-rose-500'
                    : 'bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600'
                }`}
              >
                {isGoalCompleted ? (
                  <Gamepad2 className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white odia-text flex items-center gap-1.5">
                  <span>କୁଇଜ୍ ରନର୍ ଗେମ୍ସ (Runner Games)</span>
                  {isGoalCompleted ? (
                    <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded font-black font-mono">
                      UNLOCKED ✨
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-bold font-mono">
                      🔒 ଲକ୍ ({toOdiaNumber(dailyGoal.completedToday)}/{toOdiaNumber(dailyGoal.target)})
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-300 odia-text">
                  {isGoalCompleted
                    ? 'ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂରଣ ହୋଇଛି! ଏବେ ମଜାରେ ଖେଳନ୍ତୁ'
                    : `ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂରଣ କଲେ ଖେଳିପାରିବେ (ବାକି: ${toOdiaNumber(remainingQuizzesForGoal)})`}
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenGamesHub}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer odia-text px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition-all"
            >
              <span>{isGoalCompleted ? 'ହବ୍' : 'ଦେଖନ୍ତୁ'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800">
            <button
              onClick={handlePlaySubwaySurfers}
              className={`p-2.5 rounded-xl border text-left active:scale-95 transition-all cursor-pointer flex items-center justify-between ${
                isGoalCompleted
                  ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 shadow-2xs'
                  : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-sm">
                  🚇
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-white odia-text truncate">
                    ସବୱେ ସର୍ଫର୍ସ
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {isGoalCompleted ? 'ରେଲୱେ ରନର୍' : 'ଲକ୍ ଅଛି'}
                  </span>
                </div>
              </div>
              {!isGoalCompleted && (
                <Lock className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
              )}
            </button>

            <button
              onClick={handlePlayTempleRun}
              className={`p-2.5 rounded-xl border text-left active:scale-95 transition-all cursor-pointer flex items-center justify-between ${
                isGoalCompleted
                  ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 shadow-2xs'
                  : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 text-sm">
                  🛕
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-white odia-text truncate">
                    ଟେମ୍ପଲ୍ ରନ୍
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {isGoalCompleted ? 'ମନ୍ଦିର ରନର୍' : 'ଲକ୍ ଅଛି'}
                  </span>
                </div>
              </div>
              {!isGoalCompleted && (
                <Lock className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Daily Study Tips & Motivation Card */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-2xl p-4 border border-amber-200/90 shadow-xs mb-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 odia-text">
                    ଆଜିର ବୋର୍ଡ ପରୀକ୍ଷା ଟିପ୍ସ
                  </h3>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    {currentTip.categoryOdia}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  ମାଟ୍ରିକ୍ ସଫଳତା ପାଇଁ ବିଶେଷ ପରାମର୍ଶ
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setCurrentTip(getRandomTip());
              }}
              className="w-8 h-8 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 text-amber-700 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              title="ଅନ୍ୟ ଏକ ଟିପ୍ସ ଦେଖନ୍ତୁ"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2.5 p-3 rounded-xl bg-white border border-amber-200/70 shadow-2xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 odia-text flex items-center justify-between">
              <span>{currentTip.title}</span>
              {currentTip.subjectTag && (
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                  {currentTip.subjectTag}
                </span>
              )}
            </h4>
            <p className="text-xs text-amber-900/90 odia-text mt-1 italic font-medium">
              "{currentTip.quote}"
            </p>
            <p className="text-[11px] text-slate-600 odia-text mt-1.5 leading-relaxed line-clamp-2">
              {currentTip.detail}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowTipsModal(true);
            }}
            className="w-full mt-2.5 py-2 px-3 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 active:scale-98 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer odia-text"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ସମସ୍ତ ପାଠପଢ଼ା ଟିପ୍ସ ଦେଖନ୍ତୁ (View All Tips)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Highlights / Subject Grid Preview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-4 text-left">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3 pb-2 border-b border-slate-100">
            <span>ପାଠ୍ୟକ୍ରମ ବିଷୟସମୂହ ({toOdiaNumber(subjects.length)} ଟି)</span>
            <span>{toOdiaNumber(stats.totalQuestions)} ଟି ପ୍ରଶ୍ନ</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-100"
              >
                <div className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0">
                  {subjectIconMap[sub.iconName]}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-800 truncate odia-text text-[13px]">
                    {sub.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {toOdiaNumber(sub.chapters.length)} ଅଧ୍ୟାୟ
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completedQuizzesCount > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-indigo-700 font-medium flex items-center justify-between">
              <span>ଆପଣ ସମ୍ପୂର୍ଣ୍ଣ କରିଥିବା କୁଇଜ୍:</span>
              <span className="font-bold">{toOdiaNumber(completedQuizzesCount)} ଟି</span>
            </div>
          )}
        </div>

        {/* Share App with Classmates Card */}
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-blue-50/90 rounded-2xl p-4 border border-indigo-100/90 shadow-2xs mb-4 text-left flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-indigo-950 odia-text truncate">
                ସାଙ୍ଗମାନଙ୍କ ସହ ସେୟାର କରନ୍ତୁ (Share App)
              </h4>
              <p className="text-[11px] text-indigo-700 odia-text truncate">
                ଦଶମ ଶ୍ରେଣୀ ମାଟ୍ରିକ୍ ବୋର୍ଡ ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି
              </p>
            </div>
          </div>

          <button
            onClick={handleShareApp}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs odia-text"
          >
            {copiedShareNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>କପି ହେଲା!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>ସେୟାର</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* Bottom Sticky Action Area (Natural Thumb Zone) */}
      <footer className="pt-2 pb-6">
        <button
          onClick={handlePlayClick}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 text-white font-bold text-lg sm:text-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
          <span className="odia-text tracking-wide">ଖେଳନ୍ତୁ (Play Quiz)</span>
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">
          ଓଡ଼ିଶା ବିଦ୍ୟାଳୟ ଶିକ୍ଷା ପାଠ୍ୟକ୍ରମ ଆଧାରିତ • ସରଳ ଓ ସହଜ
        </p>
      </footer>
      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 odia-text">
                  ଦୈନିକ ଲକ୍ଷ୍ୟ ସ୍ଥିର କରନ୍ତୁ
                </h3>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 odia-text">
              ପ୍ରତିଦିନ ଆପଣ କେତୋଟି କୁଇଜ୍ ଅଧ୍ୟାୟ ସମ୍ପୂର୍ଣ୍ଣ କରିବାକୁ ଲକ୍ଷ୍ୟ ରଖିବାକୁ ଚାହାଁନ୍ତି?
            </p>

            {/* Stepper Display */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTempTarget((prev) => Math.max(1, prev - 1));
                }}
                disabled={tempTarget <= 1}
                className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
              >
                -
              </button>
              <div className="text-center min-w-[80px]">
                <span className="text-3xl font-black text-indigo-700 font-mono">
                  {toOdiaNumber(tempTarget)}
                </span>
                <span className="block text-xs font-semibold text-slate-500 odia-text">
                  କୁଇଜ୍ / ଦିନ
                </span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTempTarget((prev) => Math.min(15, prev + 1));
                }}
                disabled={tempTarget >= 15}
                className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Preset quick selection buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[1, 2, 3, 5].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    soundManager.playClick();
                    setTempTarget(preset);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                    tempTarget === preset
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono text-sm">{toOdiaNumber(preset)}</span>
                  <span className="block text-[10px] font-normal odia-text">
                    {preset === 3 ? 'ସୁପାରିଶ' : preset === 1 ? 'ସହଜ' : `${toOdiaNumber(preset)} ଟି`}
                  </span>
                </button>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all"
              >
                ବାତିଲ୍
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateGoalTarget(tempTarget);
                  setShowGoalModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-xs"
              >
                ସଂରକ୍ଷଣ କରନ୍ତୁ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Tips Modal */}
      <StudyTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />

      {/* Daily Goal Runner Games Lock Modal */}
      <DailyGoalLockModal
        isOpen={showGoalLockModal}
        onClose={() => setShowGoalLockModal(false)}
        dailyGoal={dailyGoal}
        onStartQuiz={onStart}
        onEditGoal={() => {
          setTempTarget(dailyGoal.target);
          setShowGoalModal(true);
        }}
      />

      {/* Share Copied Toast */}
      {copiedShareNotice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in pointer-events-none">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="odia-text">ଲିଙ୍କ୍ କପି ହୋଇଗଲା! ସାଙ୍ଗମାନଙ୍କୁ ପଠାନ୍ତୁ।</span>
        </div>
      )}
    </div>
  );
};


