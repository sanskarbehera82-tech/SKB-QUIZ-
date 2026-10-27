import React, { useState } from 'react';
import { RotateCcw, ListFilter, LayoutGrid, Award, CheckCircle2, XCircle, ChevronDown, ChevronUp, Share2, Sparkles, Home, Flame, Gamepad2, Play, Target } from 'lucide-react';
import { Chapter, Subject, Question } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { toOdiaNumber, OPTION_PREFIXES } from '../utils/odiaNumerals';
import { StreakData } from '../utils/streak';
import { DailyGoalData } from '../utils/dailyGoal';

interface ResultScreenProps {
  subject: Subject;
  chapter: Chapter;
  results: {
    total: number;
    correct: number;
    wrong: number;
    score: number;
    percentage: number;
    userAnswers: { question: Question; selectedOption: number; isCorrect: boolean }[];
  };
  streak: StreakData;
  streakIncreased: boolean;
  dailyGoal: DailyGoalData;
  onRetry: () => void;
  onBackToChapters: () => void;
  onChooseSubject: () => void;
  onGoHome: () => void;
  onPlayGames?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  subject,
  chapter,
  results,
  streak,
  streakIncreased,
  dailyGoal,
  onRetry,
  onBackToChapters,
  onChooseSubject,
  onGoHome,
  onPlayGames
}) => {
  const [showReview, setShowReview] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const { total, correct, wrong, score, percentage, userAnswers } = results;

  // Feedback tier
  let celebrationTitle = 'ଅଭ୍ୟାସ ଜାରି ରଖନ୍ତୁ!';
  let celebrationMessage = 'ପୁଣି ଥରେ ଚେଷ୍ଟା କରି ନିଜ ସ୍କୋର ଉନ୍ନତ କରନ୍ତୁ।';
  let badgeColor = 'bg-amber-100 text-amber-900 border-amber-200';
  let emoji = '💪';

  if (percentage === 100) {
    celebrationTitle = 'ଅଦ୍ଭୁତ! ସମ୍ପୂର୍ଣ୍ଣ ସଠିକ୍!';
    celebrationMessage = 'ଆପଣ ସମସ୍ତ ପ୍ରଶ୍ନର ସଠିକ୍ ଉତ୍ତର ଦେଇଛନ୍ତି। ବହୁତ ବଢ଼ିଆ!';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-200';
    emoji = '🏆';
  } else if (percentage >= 80) {
    celebrationTitle = 'ଚମତ୍କାର ପ୍ରଦର୍ଶନ!';
    celebrationMessage = 'ଆପଣ ଉତ୍କୃଷ୍ଟ ପ୍ରଦର୍ଶନ କରିଛନ୍ତି। ବହୁତ ଭଲ!';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
    emoji = '🌟';
  } else if (percentage >= 60) {
    celebrationTitle = 'ଉତ୍ତମ ପ୍ରୟାସ!';
    celebrationMessage = 'ଆପଣ ଭଲ କରିଛନ୍ତି, ଆଉ ଟିକିଏ ପଢ଼ିଲେ ପୂର୍ଣ୍ଣ ସ୍କୋର କରିପାରିବେ।';
    badgeColor = 'bg-indigo-100 text-indigo-900 border-indigo-200';
    emoji = '👍';
  }

  const handleShare = () => {
    soundManager.playClick();
    const text = `ମୁଁ SKV Quiz ରେ ${subject.name} ବିଷୟର '${chapter.title}' ଅଧ୍ୟାୟରେ ${total} ରୁ ${score} (${percentage}%) ସ୍କୋର କରିଛି!`;
    if (navigator.share) {
      navigator.share({
        title: 'SKV Quiz Results',
        text
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full p-4 sm:p-5 pb-12">
      {/* Top Breadcrumb Header */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {subject.name}
          </span>
          <h1 className="text-base font-bold text-slate-900 odia-text truncate">
            {chapter.title}
          </h1>
        </div>

        <button
          onClick={onGoHome}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
          title="ମୁଖ୍ୟ ପୃଷ୍ଠା"
        >
          <Home className="w-4 h-4" />
        </button>
      </header>

      {/* Main Score Celebration Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm text-center mb-5">
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-extrabold text-slate-900 odia-text mb-1">
          {celebrationTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 odia-text max-w-xs mx-auto mb-6">
          {celebrationMessage}
        </p>

        {/* Circular / Large Score Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-indigo-800 p-1 shadow-lg shadow-indigo-600/20">
            <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-indigo-700 tracking-tight font-mono">
                {toOdiaNumber(score)}<span className="text-xl text-slate-400">/{toOdiaNumber(total)}</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 odia-text">
                ଚୂଡ଼ାନ୍ତ ସ୍କୋର
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 bg-indigo-600 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-md font-mono">
            {toOdiaNumber(percentage)}%
          </div>
        </div>

        {/* Streak Achievement Banner */}
        {streak.count > 0 && (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/80 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-orange-950 odia-text">
                  {streakIncreased ? '🔥 ନୂଆ ଷ୍ଟ୍ରିକ୍ ଲକ୍ଷ୍ୟ ହାସଲ!' : '🔥 ଦୈନିକ ଷ୍ଟ୍ରିକ୍ ସୁରକ୍ଷିତ!'}
                </div>
                <div className="text-[11px] text-orange-800 odia-text">
                  ଆପଣ କ୍ରମାଗତ {toOdiaNumber(streak.count)} ଦିନ ଅଭ୍ୟାସ କରିଛନ୍ତି
                </div>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-lg font-black text-orange-600 font-mono">
                {toOdiaNumber(streak.count)}
              </span>
              <span className="text-[11px] text-orange-700 font-medium ml-0.5 odia-text">ଦିନ</span>
            </div>
          </div>
        )}

        {/* Daily Goal & Runner Games Status Banner */}
        {(() => {
          const isGoalCompleted = dailyGoal.completedToday >= dailyGoal.target;
          const remaining = Math.max(0, dailyGoal.target - dailyGoal.completedToday);

          if (isGoalCompleted) {
            return (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 flex flex-col gap-2.5 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full font-mono text-amber-200">
                        GAMES UNLOCKED 🏃‍♂️
                      </span>
                      <h4 className="text-sm font-black odia-text leading-tight mt-0.5">
                        ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂରଣ ହୋଇଛି! ଗେମ୍ସ ଅନଲକ୍!
                      </h4>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-200 shrink-0" />
                </div>

                <p className="text-xs text-white/90 odia-text leading-relaxed">
                  ଆପଣ ଆଜିର {toOdiaNumber(dailyGoal.target)} ଟି କୁଇଜ୍ ଲକ୍ଷ୍ୟ ପୂରଣ କରିଛନ୍ତି। ଏବେ <strong>ସବୱେ ସର୍ଫର୍ସ</strong> ଓ <strong>ଟେମ୍ପଲ୍ ରନ୍</strong> ଖେଳିପାରିବେ!
                </p>

                {onPlayGames && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onPlayGames();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-amber-50 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer odia-text"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>ଏବେ ରନର୍ ଗେମ୍ସ ଖେଳନ୍ତୁ (Play Games Now)</span>
                  </button>
                )}
              </div>
            );
          } else {
            return (
              <div className="mb-5 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-950 odia-text">
                      ଦୈନିକ ଶିକ୍ଷା ଲକ୍ଷ୍ୟ: {toOdiaNumber(dailyGoal.completedToday)} / {toOdiaNumber(dailyGoal.target)} କୁଇଜ୍
                    </div>
                    <div className="text-[11px] text-indigo-800 odia-text">
                      ଆଉ {toOdiaNumber(remaining)} ଟି କୁଇଜ୍ ପରେ ରନର୍ ଗେମ୍ସ ଅନଲକ୍ ହେବ!
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-800 bg-white border border-indigo-200 px-2 py-0.5 rounded-lg shrink-0 font-mono">
                  🔒 LOCKED
                </span>
              </div>
            );
          }
        })()}

        {/* 4 Metrics Grid (Total, Correct, Wrong, Percentage) */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-left">
          {/* Total Questions */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium odia-text">
              ମୋଟ ପ୍ରଶ୍ନ (Total)
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
              {toOdiaNumber(total)}
            </div>
          </div>

          {/* Final Percentage */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="text-[11px] text-indigo-700 font-medium odia-text">
              ପ୍ରତିଶତ (Percentage)
            </div>
            <div className="text-lg font-bold text-indigo-900 mt-0.5 font-mono">
              {toOdiaNumber(percentage)}%
            </div>
          </div>

          {/* Correct Answers */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100">
            <div className="text-[11px] text-emerald-700 font-medium odia-text flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ସଠିକ୍ (Correct)</span>
            </div>
            <div className="text-lg font-bold text-emerald-800 mt-0.5 font-mono">
              {toOdiaNumber(correct)}
            </div>
          </div>

          {/* Wrong Answers */}
          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-100">
            <div className="text-[11px] text-rose-700 font-medium odia-text flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>ଭୁଲ୍ (Wrong)</span>
            </div>
            <div className="text-lg font-bold text-rose-800 mt-0.5 font-mono">
              {toOdiaNumber(wrong)}
            </div>
          </div>
        </div>
      </div>

      {/* Review Answers Toggle Button */}
      <div className="mb-5">
        <button
          onClick={() => {
            soundManager.playClick();
            setShowReview(!showReview);
          }}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-left hover:border-indigo-300 active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 odia-text block">
                ପ୍ରଶ୍ନୋତ୍ତର ସମୀକ୍ଷା (Review Answers)
              </span>
              <span className="text-xs text-slate-500">
                ପ୍ରତ୍ୟେକ ପ୍ରଶ୍ନର ଉତ୍ତର ଓ ବ୍ୟାଖ୍ୟା ଦେଖନ୍ତୁ
              </span>
            </div>
          </div>
          {showReview ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Detailed Review Section */}
        {showReview && (
          <div className="mt-3 space-y-3 animate-in fade-in duration-200">
            {userAnswers.map((item, idx) => {
              const q = item.question;
              const userOpt = item.selectedOption;
              const correctOpt = q.correctIndex;
              const prefixUser = OPTION_PREFIXES[userOpt] || { odia: '?' };
              const prefixCorrect = OPTION_PREFIXES[correctOpt] || { odia: '?' };

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border bg-white ${
                    item.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      #{toOdiaNumber(idx + 1)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ସଠିକ୍</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>ଭୁଲ୍</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 odia-text mb-3">
                    {q.question}
                  </h3>

                  {/* Answers summary */}
                  <div className="space-y-1.5 text-xs odia-text">
                    <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-500 shrink-0">ଆପଣଙ୍କ ଉତ୍ତର:</span>
                      <span className={item.isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                        ({prefixUser.odia}) {q.options[userOpt]}
                      </span>
                    </div>

                    {!item.isCorrect && (
                      <div className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-900">
                        <span className="font-semibold text-emerald-700 shrink-0">ସଠିକ୍ ଉତ୍ତର:</span>
                        <span className="font-semibold">
                          ({prefixCorrect.odia}) {q.options[correctOpt]}
                        </span>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100/70 text-slate-700 text-[12px] leading-relaxed mt-2">
                      <span className="font-semibold text-blue-900">ସ୍ପଷ୍ଟୀକରଣ: </span>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons as requested:
          1. Retry (ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ)
          2. Back to Chapters (ଅଧ୍ୟାୟ ତାଲିକା)
          3. Choose Another Subject (ଅନ୍ୟ ବିଷୟ ବାଛନ୍ତୁ)
      */}
      <div className="space-y-2.5 pt-1">
        {/* Button 1: Retry */}
        <button
          onClick={() => {
            soundManager.playClick();
            onRetry();
          }}
          className="w-full h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-base shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="odia-text">ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ (Retry)</span>
        </button>

        {/* Button 2: Back to Chapters */}
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToChapters();
          }}
          className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-transform"
        >
          <ListFilter className="w-4 h-4 text-indigo-600" />
          <span className="odia-text">ଅଧ୍ୟାୟ ତାଲିକା (Back to Chapters)</span>
        </button>

        {/* Button 3: Choose Another Subject */}
        <button
          onClick={() => {
            soundManager.playClick();
            onChooseSubject();
          }}
          className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-transform"
        >
          <LayoutGrid className="w-4 h-4 text-indigo-600" />
          <span className="odia-text">ଅନ୍ୟ ବିଷୟ ବାଛନ୍ତୁ (Choose Another Subject)</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedNotice ? 'କପି ହୋଇଗଲା! (Copied)' : 'ଫଳାଫଳ ସେୟାର କରନ୍ତୁ (Share Score)'}</span>
        </button>
      </div>
    </div>
  );
};
