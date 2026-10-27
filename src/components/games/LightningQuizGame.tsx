import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Volume2, VolumeX, Flame, Zap, Shield, Clock, SkipForward, RotateCcw, Trophy, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { LIGHTNING_QUESTIONS, LightningQuestion } from '../../data/miniGamesData';
import { soundManager } from '../../utils/audio';
import { toOdiaNumber } from '../../utils/odiaNumerals';

interface LightningQuizGameProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const LightningQuizGame: React.FC<LightningQuizGameProps> = ({
  onBack,
  soundEnabled,
  onToggleSound
}) => {
  const TOTAL_SECONDS = 60;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [questions, setQuestions] = useState<LightningQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  // Lifelines state
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [shieldUsed, setShieldUsed] = useState<boolean>(false);
  const [timeFrozenUsed, setTimeFrozenUsed] = useState<boolean>(false);
  const [skipUsed, setSkipUsed] = useState<boolean>(false);

  // Quick feedback flash
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('skv_lightning_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Multiplier logic based on streak
  const getMultiplier = (currentStreak: number): number => {
    if (currentStreak >= 10) return 5;
    if (currentStreak >= 6) return 3;
    if (currentStreak >= 3) return 2;
    return 1;
  };

  const startGame = useCallback(() => {
    const shuffled = [...LIGHTNING_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setTimeLeft(TOTAL_SECONDS);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setHasShield(false);
    setShieldUsed(false);
    setTimeFrozenUsed(false);
    setSkipUsed(false);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // High score check
  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('skv_lightning_highscore', score.toString());
      } catch {
        // ignore
      }
    }
  }, [isGameOver, score, highScore]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleAnswer = (optionIdx: number) => {
    if (!isPlaying || !currentQ) return;

    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      soundManager.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);

      const mult = getMultiplier(newStreak);
      const points = 100 * mult;
      setScore((prev) => prev + points);

      setFeedback('correct');
      setTimeout(() => setFeedback(null), 300);
    } else {
      if (hasShield) {
        // Shield protected!
        soundManager.playCorrect();
        setHasShield(false);
        setFeedback(null);
      } else {
        soundManager.playWrong();
        setStreak(0);
        setWrongCount((prev) => prev + 1);
        setFeedback('wrong');
        setTimeout(() => setFeedback(null), 300);
      }
    }

    // Move to next question or reshuffle
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
    }
  };

  // Lifeline handlers
  const handleUseFreezeTime = () => {
    if (timeFrozenUsed || !isPlaying) return;
    soundManager.playClick();
    setTimeFrozenUsed(true);
    setTimeLeft((prev) => Math.min(TOTAL_SECONDS, prev + 15));
  };

  const handleUseShield = () => {
    if (shieldUsed || !isPlaying) return;
    soundManager.playClick();
    setShieldUsed(true);
    setHasShield(true);
  };

  const handleUseSkip = () => {
    if (skipUsed || !isPlaying) return;
    soundManager.playClick();
    setSkipUsed(true);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const multiplier = getMultiplier(streak);
  const timerPercent = Math.round((timeLeft / TOTAL_SECONDS) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white max-w-lg mx-auto w-full select-none">
      {/* Top Bar */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5 odia-text">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>ବିଜୁଳି କୁଇଜ୍</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-md font-mono">
                RAPID STRIKE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 odia-text">
              ତ୍ୱରିତ ଉତ୍ତର ଦିଅନ୍ତୁ ଓ ମଲ୍ଟିପ୍ଲାୟର୍ ବଢ଼ାନ୍ତୁ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ହାଇସ୍କୋର</span>
            <span className="text-xs font-mono font-bold text-amber-400">{toOdiaNumber(highScore)}</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">ସମୟ ବାକି</span>
            <span className={`text-base font-black font-mono leading-none ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
              {toOdiaNumber(timeLeft)} ସେ.
            </span>
          </div>
        </div>

        {/* Streak & Multiplier */}
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
            multiplier > 1
              ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/50 text-orange-400 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${multiplier > 1 ? 'fill-orange-400 text-orange-400' : 'text-slate-500'}`} />
            <span>{toOdiaNumber(multiplier)}x ବୋନସ୍</span>
          </div>

          {hasShield && (
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/60 flex items-center justify-center text-blue-400" title="ସୁରକ୍ଷା ଢାଲ ସକ୍ରିୟ">
              <Shield className="w-3.5 h-3.5 fill-blue-400" />
            </div>
          )}
        </div>

        {/* Score */}
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-medium">ସ୍କୋର</span>
          <span className="text-lg font-black font-mono text-amber-400 leading-none">
            {toOdiaNumber(score)}
          </span>
        </div>
      </div>

      {/* Timer Progress Track */}
      <div className="w-full h-1.5 bg-slate-800">
        <div
          className={`h-full transition-all duration-300 ease-linear ${
            timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400'
          }`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Main Game Container */}
      <main className="flex-1 p-4 flex flex-col justify-between relative overflow-hidden">
        {/* Flash Feedback overlay */}
        {feedback === 'correct' && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none transition-opacity duration-200 z-10" />
        )}
        {feedback === 'wrong' && (
          <div className="absolute inset-0 bg-rose-500/15 pointer-events-none transition-opacity duration-200 z-10" />
        )}

        {!isPlaying && !isGameOver ? (
          /* Start Screen */
          <div className="text-center py-6 px-3 space-y-5 my-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/20 text-3xl">
              ⚡
            </div>
            <div>
              <h2 className="text-2xl font-black odia-text text-white">
                ବିଜୁଳି କୁଇଜ୍ ଷ୍ଟ୍ରାଇକ୍
              </h2>
              <p className="text-xs text-slate-300 odia-text mt-2 leading-relaxed max-w-xs mx-auto">
                ୬୦ ସେକେଣ୍ଡରେ ଦ୍ରୁତ ଗତିରେ "ସତ କି ମିଛ" ନିର୍ଣ୍ଣୟ କରନ୍ତୁ। ଲଗାତାର ଠିକ୍ ଉତ୍ତର ଦେଇ ୫x ଗୁଣା ସ୍କୋର ମଲ୍ଟିପ୍ଲାୟର୍ ଅନଲକ୍ କରନ୍ତୁ!
              </p>
            </div>

            {/* Lifelines Explainer */}
            <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 max-w-xs mx-auto text-left text-xs space-y-2 text-slate-300 odia-text">
              <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">
                ୩ ଟି ଶକ୍ତିଶାଳୀ ଲାଇଫ୍‌ଲାଇନ୍:
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+୧୫ ସେକେଣ୍ଡ ଫ୍ରିଜ୍ ଟାଇମ୍</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>୧ ଟି ଭୁଲ୍‌ରୁ ରକ୍ଷା କରୁଥିବା ଶକ୍ତିଶାଳୀ ଢାଲ</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <SkipForward className="w-4 h-4 text-purple-400 shrink-0" />
                <span>କଠିନ ପ୍ରଶ୍ନ ବିନା ନମ୍ବର କାଟି ସ୍କିପ୍ (Skip)</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full max-w-xs h-13 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:brightness-110 active:scale-98 text-slate-950 font-black text-base shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all odia-text"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>ବିଜୁଳି ରନ୍ ଆରମ୍ଭ (Start Rapid Strike)</span>
            </button>
          </div>
        ) : (
          /* Active Rapid Quiz View */
          <div className="flex flex-col justify-between h-full py-2">
            {/* Lifeline buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              <button
                onClick={handleUseFreezeTime}
                disabled={timeFrozenUsed}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  timeFrozenUsed
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 active:scale-95'
                }`}
                title="+15s Freeze"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>+୧୫ ସେ.</span>
              </button>

              <button
                onClick={handleUseShield}
                disabled={shieldUsed || hasShield}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  shieldUsed || hasShield
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-blue-500/15 border-blue-500/40 text-blue-400 hover:bg-blue-500/25 active:scale-95'
                }`}
                title="Shield"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>ସୁରକ୍ଷା ଢାଲ</span>
              </button>

              <button
                onClick={handleUseSkip}
                disabled={skipUsed}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  skipUsed
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-purple-500/15 border-purple-500/40 text-purple-400 hover:bg-purple-500/25 active:scale-95'
                }`}
                title="Skip"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>ସ୍କିପ୍ (Skip)</span>
              </button>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl my-auto text-center space-y-3">
              <span className="inline-block text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
                {currentQ.categoryOdia}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-white odia-text leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* 2 Big Punchy Answer Buttons (True vs False) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
              <button
                onClick={() => handleAnswer(0)}
                className="h-20 sm:h-22 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 active:scale-95 text-white font-black text-lg shadow-lg shadow-emerald-900/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all odia-text border border-emerald-400/40"
              >
                <span className="flex items-center gap-1.5 text-base sm:text-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>{currentQ.options[0]}</span>
                </span>
                <span className="text-[11px] text-emerald-200/90 font-medium">ଠିକ୍ ଅଟେ</span>
              </button>

              <button
                onClick={() => handleAnswer(1)}
                className="h-20 sm:h-22 rounded-2xl bg-gradient-to-tr from-rose-700 to-rose-500 hover:from-rose-600 hover:to-rose-400 active:scale-95 text-white font-black text-lg shadow-lg shadow-rose-900/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all odia-text border border-rose-400/40"
              >
                <span className="flex items-center gap-1.5 text-base sm:text-lg">
                  <XCircle className="w-5 h-5 text-rose-200" />
                  <span>{currentQ.options[1]}</span>
                </span>
                <span className="text-[11px] text-rose-200/90 font-medium">ଭୁଲ୍ ଅଟେ</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-xs w-full text-center border border-slate-700 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30 text-3xl">
              ⚡
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">
                ସମୟ ସମାପ୍ତ!
              </span>
              <h3 className="text-2xl font-black text-white odia-text mt-1">
                ବିଜୁଳି ରନ୍ ଶେଷ!
              </h3>
            </div>

            <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ମୋଟ ସ୍କୋର:</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {toOdiaNumber(score)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ସଠିକ୍ ଉତ୍ତର:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {toOdiaNumber(correctCount)} ଟି
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ଭୁଲ୍ ଉତ୍ତର:</span>
                <span className="font-mono font-bold text-rose-400">
                  {toOdiaNumber(wrongCount)} ଟି
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 odia-text">ସର୍ବାଧିକ ଷ୍ଟ୍ରିକ୍:</span>
                <span className="font-mono font-bold text-orange-400">
                  {toOdiaNumber(maxStreak)}x 🔥
                </span>
              </div>
              {score >= highScore && score > 0 && (
                <div className="pt-2 text-amber-300 font-bold text-center border-t border-slate-700 odia-text">
                  🎉 ନୂଆ ବ୍ୟକ୍ତିଗତ ରେକର୍ଡ (New Record)!
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={startGame}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer odia-text"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ପୁଣି ଥରେ ଚେଷ୍ଟା କରନ୍ତୁ (Retry)</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 active:scale-95 text-xs font-semibold cursor-pointer odia-text"
              >
                ଗେମ୍ସ ମେନୁକୁ ଫେରନ୍ତୁ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
