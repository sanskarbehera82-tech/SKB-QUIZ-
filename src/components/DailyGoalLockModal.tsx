import React from 'react';
import { X, Lock, Target, BookOpen, ArrowRight, Gamepad2, Sparkles, CheckCircle2 } from 'lucide-react';
import { DailyGoalData } from '../utils/dailyGoal';
import { toOdiaNumber } from '../utils/odiaNumerals';
import { soundManager } from '../utils/audio';

interface DailyGoalLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: DailyGoalData;
  onStartQuiz: () => void;
  onEditGoal?: () => void;
}

export const DailyGoalLockModal: React.FC<DailyGoalLockModalProps> = ({
  isOpen,
  onClose,
  dailyGoal,
  onStartQuiz,
  onEditGoal
}) => {
  if (!isOpen) return null;

  const remaining = Math.max(0, dailyGoal.target - dailyGoal.completedToday);
  const percentage = Math.min(100, Math.round((dailyGoal.completedToday / dailyGoal.target) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 transform transition-all animate-scale-in">
        {/* Header with lock artwork */}
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-5 text-white relative text-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Lock Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3 border border-white/20">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider mb-1.5">
            <Gamepad2 className="w-3 h-3" />
            <span>DAILY GOAL LOCKED</span>
          </span>

          <h3 className="text-lg font-black odia-text leading-tight">
            ଖେଳ ପୂର୍ବରୁ ଦୈନିକ ଲକ୍ଷ୍ୟ ପୂରଣ କରନ୍ତୁ! 🎯
          </h3>
          <p className="text-xs text-slate-300 odia-text mt-1">
            ପ୍ରଥମେ ଅଧ୍ୟୟନ, ତା'ପରେ ମନୋରଞ୍ଜନ!
          </p>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-4">
          {/* Progress Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-600 odia-text flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>ଆଜିର ପ୍ରଗତି (Today's Progress)</span>
              </span>
              <span className="font-mono font-bold text-indigo-600">
                {toOdiaNumber(dailyGoal.completedToday)} / {toOdiaNumber(dailyGoal.target)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-amber-700 odia-text">
                {remaining > 0
                  ? `ଆଉ ମାତ୍ର ${toOdiaNumber(remaining)} ଟି କୁଇଜ୍ ବାକି ଅଛି!`
                  : 'ସବୁ କୁଇଜ୍ ସରିଯାଇଛି!'}
              </span>
              <span className="font-mono font-bold">{percentage}%</span>
            </div>
          </div>

          {/* Motivational Advice */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 text-xs text-amber-950 odia-text space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ଏହା କାହିଁକି ଜରୁରୀ?</span>
            </div>
            <p className="text-[12px] text-amber-900/90 leading-relaxed">
              ଦୈନିକ ଲକ୍ଷ୍ୟ ଅନୁସାରେ {toOdiaNumber(dailyGoal.target)} ଟି ଅଧ୍ୟାୟ କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ କଲେ <strong>ସବୱେ ସର୍ଫର୍ସ</strong> ଏବଂ <strong>ଟେମ୍ପଲ୍ ରନ୍</strong> ସ୍ୱୟଂଚାଳିତ ଭାବେ ଅନଲକ୍ ହୋଇଯିବ।
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
                onStartQuiz();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer odia-text"
            >
              <BookOpen className="w-4 h-4" />
              <span>କୁଇଜ୍ ଆରମ୍ଭ କରନ୍ତୁ (Start Quiz)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-1">
              {onEditGoal ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                    onEditGoal();
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold odia-text underline cursor-pointer"
                >
                  ଲକ୍ଷ୍ୟ ପରିମାଣ ବଦଳାନ୍ତୁ
                </button>
              ) : <div />}

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer px-2 py-1"
              >
                ପରେ ଦେଖିବି (Close)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
