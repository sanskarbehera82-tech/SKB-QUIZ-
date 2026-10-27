import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Gamepad2, Play, Sparkles, BrainCircuit, Flame, Trophy, Compass, Lock, Target, BookOpen, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { toOdiaNumber } from '../../utils/odiaNumerals';
import { DailyGoalData } from '../../utils/dailyGoal';
import { DailyGoalLockModal } from '../DailyGoalLockModal';

interface GamesHubScreenProps {
  onBack: () => void;
  onPlaySubwaySurfers: () => void;
  onPlayTempleRun: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  dailyGoal: DailyGoalData;
  onStartQuiz: () => void;
}

export const GamesHubScreen: React.FC<GamesHubScreenProps> = ({
  onBack,
  onPlaySubwaySurfers,
  onPlayTempleRun,
  soundEnabled,
  onToggleSound,
  dailyGoal,
  onStartQuiz
}) => {
  const [subwayHighScore, setSubwayHighScore] = useState<number>(0);
  const [templeHighScore, setTempleHighScore] = useState<number>(0);
  const [showLockModal, setShowLockModal] = useState<boolean>(false);

  const isGoalCompleted = dailyGoal.completedToday >= dailyGoal.target;
  const remaining = Math.max(0, dailyGoal.target - dailyGoal.completedToday);
  const progressPercent = Math.min(100, Math.round((dailyGoal.completedToday / dailyGoal.target) * 100));

  useEffect(() => {
    try {
      const subScore = localStorage.getItem('skv_subwaysurfers_highscore');
      const tempScore = localStorage.getItem('skv_templerun_highscore');
      if (subScore) setSubwayHighScore(parseInt(subScore, 10));
      if (tempScore) setTempleHighScore(parseInt(tempScore, 10));
    } catch {
      // ignore
    }
  }, []);

  const handleLaunchGame = (launchFn: () => void) => {
    if (!isGoalCompleted) {
      soundManager.playClick();
      setShowLockModal(true);
    } else {
      soundManager.playClick();
      launchFn();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
              ଶିକ୍ଷଣୀୟ ମିନି ଗେମ୍ସ
            </span>
            <h1 className="text-base font-bold text-slate-900 odia-text flex items-center gap-1.5">
              <span>କୁଇଜ୍ ରନର୍ ଗେମ୍ସ (Mini Games)</span>
              <Gamepad2 className="w-4 h-4 text-indigo-600" />
            </h1>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          title="Toggle Sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-indigo-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-5 space-y-4">
        {/* Daily Goal Status Unlock Banner */}
        <div
          className={`rounded-2xl p-4 border transition-all ${
            isGoalCompleted
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200 text-emerald-950 shadow-2xs'
              : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-200 text-amber-950 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                  isGoalCompleted ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              >
                {isGoalCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold odia-text flex items-center gap-1.5">
                  <span>
                    {isGoalCompleted
                      ? '🎉 ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂର୍ଣ୍ଣ! ଗେମ୍ସ ଅନଲକ୍ ହୋଇଛି!'
                      : '🔒 ଖେଳ ଲକ୍ ଅଛି — ଆଗେ ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂରଣ କରନ୍ତୁ'}
                  </span>
                </h3>
                <p className="text-[11px] opacity-85 odia-text mt-0.5">
                  {isGoalCompleted
                    ? `ଆଜିର ଲକ୍ଷ୍ୟ ${toOdiaNumber(dailyGoal.completedToday)}/${toOdiaNumber(dailyGoal.target)} କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ। ଏବେ ଅସୀମିତ ଖେଳନ୍ତୁ!`
                    : `ପ୍ରଗତି: ${toOdiaNumber(dailyGoal.completedToday)}/${toOdiaNumber(dailyGoal.target)} କୁଇଜ୍ (ଆଉ ${toOdiaNumber(remaining)} ଟି ବାକି)`}
                </p>
              </div>
            </div>

            {!isGoalCompleted && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartQuiz();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs active:scale-95 transition-all shadow-xs shrink-0 odia-text flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>କୁଇଜ୍ ଖେଳନ୍ତୁ</span>
              </button>
            )}
          </div>

          {/* Goal Progress bar inside banner */}
          <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isGoalCompleted ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-mono">
              <Sparkles className="w-3 h-3" />
              <span>TEMPLE RUN & SUBWAY SURFERS</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black odia-text leading-tight">
              ଦୌଡ଼ନ୍ତୁ, ବାଧକ ଏଡ଼ାନ୍ତୁ, କୁଇଜ୍ ଜିତନ୍ତୁ! 🏃‍♂️⚡
            </h2>
            <p className="text-xs text-slate-300 odia-text leading-relaxed">
              ସବୱେ ସର୍ଫର୍ସ ଓ ଟେମ୍ପଲ୍ ରନ୍‌ର ୩-ଲେନ୍ ଅନନ୍ତ ଦୌଡ଼! ବାଧକ ଉପରେ ଡିଅନ୍ତୁ (Jump), ତଳେ ଗଡ଼ନ୍ତୁ (Slide), ଏବଂ ସଠିକ୍ କୁଇଜ୍ ଫାଟକ ଚୟନ କରି ବିଶାଳ ସ୍କୋର କରନ୍ତୁ!
            </p>
          </div>
        </div>

        {/* Game 1: Subway Surfers */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0 text-2xl">
                🚇
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-mono">
                    GAME 1 • SUBWAY SURFERS
                  </span>
                  {!isGoalCompleted && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md font-mono flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 odia-text mt-0.5">
                  ସବୱେ ସର୍ଫର୍ସ (Subway Surfers)
                </h3>
              </div>
            </div>

            {subwayHighScore > 0 && (
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">ହାଇସ୍କୋର</span>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  {toOdiaNumber(subwayHighScore)}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 odia-text leading-relaxed">
            ରେଲୱେ ଟ୍ରାକ୍‌ରେ ୩ଟି ଲେନ୍‌ରେ ଦୌଡ଼ନ୍ତୁ! ଟ୍ରାକ୍ ବାଧକ ଉପରେ ଡିଅନ୍ତୁ (Jump), ସଙ୍କେତ ବୋର୍ଡ ତଳେ ଗଡ଼ନ୍ତୁ (Slide), ମୁଦ୍ରା ଓ ଚୁମ୍ବକ ସଂଗ୍ରହ କରନ୍ତୁ, ଏବଂ ରେଲୱେ କୁଇଜ୍ ଫାଟକରେ ସଠିକ୍ ଟ୍ରାକ୍ ବାଛି ୨x ବୋନସ୍ ଜିତନ୍ତୁ!
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>୩ ଜୀବନ (3 Lives)</span>
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>ଚୁମ୍ବକ ଓ ଢାଲ</span>
              </span>
            </div>

            <button
              onClick={() => handleLaunchGame(onPlaySubwaySurfers)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all odia-text ${
                isGoalCompleted
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-slate-300/30'
              }`}
            >
              {isGoalCompleted ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>ଖେଳନ୍ତୁ (Play)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>ଲକ୍ (ଆଉ {toOdiaNumber(remaining)})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Game 2: Temple Run */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-700 to-yellow-600 flex items-center justify-center text-white shadow-md shadow-amber-700/25 shrink-0 text-2xl">
                🛕
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-mono">
                    GAME 2 • TEMPLE RUN
                  </span>
                  {!isGoalCompleted && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md font-mono flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 odia-text mt-0.5">
                  ଟେମ୍ପଲ୍ ରନ୍ (Temple Run: Escape)
                </h3>
              </div>
            </div>

            {templeHighScore > 0 && (
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">ହାଇସ୍କୋର</span>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  {toOdiaNumber(templeHighScore)}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 odia-text leading-relaxed">
            ପ୍ରାଚୀନ କୋଣାର୍କ ମନ୍ଦିର ପଥରେ ଦୌଡ଼ନ୍ତୁ! ଅଗ୍ନିକୁଣ୍ଡ ଉପରେ ଡିଅନ୍ତୁ, ପ୍ରସ୍ତର ତୋରଣ ତଳେ ଗଡ଼ନ୍ତୁ, ବହୁମୂଲ୍ୟ ରତ୍ନ ସଂଗ୍ରହ କରନ୍ତୁ, ଏବଂ ପ୍ରାଚୀନ ମନ୍ଦିର ଜ୍ଞାନ ଦ୍ୱାରରେ ସଠିକ୍ ପଥ ବାଛି ଆଶୀର୍ବାଦ ଓ ପଏଣ୍ଟସ ପାଆନ୍ତୁ!
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>ପ୍ରାଚୀନ ମନ୍ଦିର ପଥ</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                <span>ମଣିରତ୍ନ ବୋନସ୍</span>
              </span>
            </div>

            <button
              onClick={() => handleLaunchGame(onPlayTempleRun)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all odia-text ${
                isGoalCompleted
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-slate-300/30'
              }`}
            >
              {isGoalCompleted ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>ଖେଳନ୍ତୁ (Play)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>ଲକ୍ (ଆଉ {toOdiaNumber(remaining)})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Benefits Box */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 text-xs space-y-1.5 text-indigo-950 odia-text">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-sm">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span>ଏହି ରନର୍ ଗେମ୍ସ କିପରି ସାହାଯ୍ୟ କରେ?</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[12px]">
            ଦ୍ରୁତ ଗତିରେ ଚାଲୁଥିବା ସମୟରେ ପ୍ରଶ୍ନ ପଢ଼ି ସଠିକ୍ ଲେନ୍ ବାଛିବା ଦ୍ୱାରା ଛାତ୍ରଛାତ୍ରୀଙ୍କ ଏକାଗ୍ରତା, ଶୀଘ୍ର ନିଷ୍ପତ୍ତି ନେବାର ଦକ୍ଷତା ଏବଂ ପରୀକ୍ଷା ଭୟ ଦୂର ହୁଏ।
          </p>
        </div>
      </main>

      {/* Daily Goal Lock Modal */}
      <DailyGoalLockModal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        dailyGoal={dailyGoal}
        onStartQuiz={onStartQuiz}
      />
    </div>
  );
};
