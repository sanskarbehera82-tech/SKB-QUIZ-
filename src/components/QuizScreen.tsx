import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Volume2, VolumeX, AlertCircle, HelpCircle } from 'lucide-react';
import { Chapter, Subject, Question } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { toOdiaNumber, OPTION_PREFIXES } from '../utils/odiaNumerals';

interface QuizScreenProps {
  subject: Subject;
  chapter: Chapter;
  onFinishQuiz: (results: {
    total: number;
    correct: number;
    wrong: number;
    score: number;
    percentage: number;
    userAnswers: { question: Question; selectedOption: number; isCorrect: boolean }[];
  }) => void;
  onExitQuiz: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  subject,
  chapter,
  onFinishQuiz,
  onExitQuiz,
  soundEnabled,
  onToggleSound
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Store history of answers for final review
  const [answersHistory, setAnswersHistory] = useState<
    { question: Question; selectedOption: number; isCorrect: boolean }[]
  >([]);

  // Dynamically shuffle options for every quiz session so the answer is never predictable
  const [quizQuestions] = useState<Question[]>(() => {
    return chapter.questions.map((q) => {
      const items = q.options.map((opt, idx) => ({
        opt,
        isCorrect: idx === q.correctIndex
      }));
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      const newCorrectIndex = items.findIndex((item) => item.isCorrect);
      return {
        ...q,
        options: items.map((item) => item.opt) as [string, string, string, string],
        correctIndex: newCorrectIndex
      };
    });
  });

  const questions = quizQuestions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return; // Allow only one submission per question

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setCorrectCount((prev) => prev + 1);
    } else {
      soundManager.playWrong();
      setWrongCount((prev) => prev + 1);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedOption: index,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Calculate final results
      const total = totalQuestions;
      const finalCorrect = selectedOption === currentQuestion.correctIndex ? correctCount : correctCount;
      const finalWrong = total - finalCorrect;
      const percentage = Math.round((finalCorrect / total) * 100);

      onFinishQuiz({
        total,
        correct: finalCorrect,
        wrong: finalWrong,
        score: finalCorrect,
        percentage,
        userAnswers: answersHistory
      });
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full">
      {/* Quiz Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="କୁଇଜ୍ ବନ୍ଦ କରନ୍ତୁ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
              {subject.name}
            </span>
            <h1 className="text-sm font-bold text-slate-900 truncate odia-text">
              {chapter.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
            title="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Quick Score indicator */}
          <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100">
            ସ୍କୋର: {toOdiaNumber(correctCount)}
          </div>
        </div>
      </header>

      {/* Progress Bar & Question Count Header */}
      <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 odia-text text-sm">
              ପ୍ରଶ୍ନ {toOdiaNumber(currentIndex + 1)}
            </span>
            <span className="text-slate-400">/ {toOdiaNumber(totalQuestions)}</span>
          </div>
          <span className="text-indigo-600 font-semibold font-mono text-xs">
            {progressPercent}%
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Area */}
      <main className="flex-1 p-4 sm:p-5 flex flex-col justify-between pb-28">
        <div className="space-y-4">
          {/* Question Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>ପ୍ରଶ୍ନ ନମ୍ବର {toOdiaNumber(currentIndex + 1)}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 odia-text leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Four Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const prefix = OPTION_PREFIXES[idx] || { odia: `${idx + 1}`, en: `${idx + 1}` };
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              // Styling states
              let buttonStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 active:scale-[0.99]';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
              let iconFeedback: React.ReactNode = null;

              if (isAnswered) {
                if (isCorrect) {
                  // Always show correct answer in green
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500/30';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  iconFeedback = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                } else if (isSelected && !isCorrect) {
                  // User chose wrong answer, show in red
                  buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs ring-1 ring-rose-500/30';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                  iconFeedback = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                } else {
                  // Other unselected wrong answers dim down
                  buttonStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-70';
                  badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between gap-3 min-h-[58px] ${buttonStyle} ${
                    !isAnswered ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Odia Prefix badge (କ, ଖ, ଗ, ଘ) */}
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-semibold shrink-0 odia-text ${badgeStyle}`}
                    >
                      {prefix.odia}
                    </div>
                    {/* Option Text */}
                    <span className="text-[15px] sm:text-base font-medium odia-text leading-snug">
                      {option}
                    </span>
                  </div>

                  {/* Feedback Icon (Check or Cross) */}
                  {iconFeedback}
                </button>
              );
            })}
          </div>

          {/* Feedback Card after user taps an answer */}
          {isAnswered && (
            <div
              className={`rounded-2xl p-4 border animate-in fade-in duration-200 ${
                selectedOption === currentQuestion.correctIndex
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1 odia-text">
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>ସଠିକ୍ ଉତ୍ତର! ବହୁତ ବଢ଼ିଆ!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>ଭୁଲ୍ ଉତ୍ତର! ସଠିକ୍ ଉତ୍ତରଟି ସବୁଜ ରଙ୍ଗରେ ଦର୍ଶାଯାଇଛି।</span>
                  </>
                )}
              </div>

              {/* Clear explanation in Odia */}
              <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700 mt-2 pt-2 border-t border-slate-200/60 odia-text">
                <span className="font-semibold text-slate-900">ସ୍ପଷ୍ଟୀକରଣ: </span>
                {currentQuestion.explanation}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Next/Finish Action (Natural Thumb Zone) */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-gradient-to-t from-white via-white/95 to-white/0 backdrop-blur-xs z-20">
        {isAnswered ? (
          <button
            onClick={handleNext}
            className="w-full h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-transform"
          >
            <span className="odia-text">
              {isLastQuestion ? 'କୁଇଜ୍ ସମାପ୍ତ କରନ୍ତୁ (View Results)' : 'ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ (Next)'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-full h-13 rounded-2xl bg-slate-100 text-slate-400 font-medium text-sm flex items-center justify-center odia-text border border-slate-200">
            ଏକ ବିକଳ୍ପ ଚୟନ କରନ୍ତୁ
          </div>
        )}
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 odia-text">
                କୁଇଜ୍ ଛାଡ଼ିବାକୁ ଚାହାଁନ୍ତି କି?
              </h3>
              <p className="text-xs text-slate-500 odia-text mt-1">
                ବର୍ତ୍ତମାନ ବାହାରିଲେ ଆପଣଙ୍କ ଏହି କୁଇଜ୍ ସ୍କୋର ସଂରକ୍ଷିତ ହେବ ନାହିଁ।
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all"
              >
                ନାହିଁ, ଜାରି ରଖନ୍ତୁ
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitQuiz();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 active:scale-95 transition-all"
              >
                ହଁ, ବାହାରନ୍ତୁ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
