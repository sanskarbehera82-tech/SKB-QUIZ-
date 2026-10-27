import React from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Calculator, 
  Shapes, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  CheckCircle2, 
  Atom, 
  Dna, 
  Globe, 
  TrendingUp, 
  Landmark, 
  Scale, 
  PenTool, 
  Languages 
} from 'lucide-react';
import { Subject, Branch } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { toOdiaNumber } from '../utils/odiaNumerals';

interface BranchListScreenProps {
  subject: Subject;
  branches: Branch[];
  onSelectBranch: (branch: Branch) => void;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedChaptersMap: Record<string, boolean>;
}

export const BranchListScreen: React.FC<BranchListScreenProps> = ({
  subject,
  branches,
  onSelectBranch,
  onBack,
  soundEnabled,
  onToggleSound,
  completedChaptersMap
}) => {
  const handleSelect = (branch: Branch) => {
    soundManager.playClick();
    onSelectBranch(branch);
  };

  const handleBack = () => {
    soundManager.playClick();
    onBack();
  };

  const getBranchIcon = (branchId: string) => {
    switch (branchId) {
      case 'physical_science':
        return <Atom className="w-6 h-6 text-cyan-600" />;
      case 'life_science':
        return <Dna className="w-6 h-6 text-emerald-600" />;
      case 'algebra':
        return <Calculator className="w-6 h-6 text-emerald-600" />;
      case 'geometry':
        return <Shapes className="w-6 h-6 text-teal-600" />;
      case 'odia_literature':
        return <BookOpen className="w-6 h-6 text-amber-600" />;
      case 'odia_grammar':
        return <PenTool className="w-6 h-6 text-orange-600" />;
      case 'english_literature':
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      case 'english_grammar':
        return <Languages className="w-6 h-6 text-indigo-600" />;
      case 'hindi_literature':
        return <BookOpen className="w-6 h-6 text-rose-600" />;
      case 'hindi_grammar':
        return <Languages className="w-6 h-6 text-pink-600" />;
      case 'geography':
        return <Globe className="w-6 h-6 text-emerald-600" />;
      case 'economics':
        return <TrendingUp className="w-6 h-6 text-teal-600" />;
      case 'history':
        return <Landmark className="w-6 h-6 text-rose-600" />;
      case 'political_science':
        return <Scale className="w-6 h-6 text-amber-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-indigo-600" />;
    }
  };

  const getBranchColorStyles = (branchId: string) => {
    switch (branchId) {
      case 'physical_science':
        return {
          stripe: 'bg-cyan-500',
          iconBox: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          hoverBorder: 'hover:border-cyan-500',
          hoverText: 'group-hover:text-cyan-600',
          activeBg: 'group-hover:bg-cyan-50 group-hover:text-cyan-600',
          actionText: 'text-cyan-600'
        };
      case 'life_science':
        return {
          stripe: 'bg-emerald-500',
          iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          hoverBorder: 'hover:border-emerald-500',
          hoverText: 'group-hover:text-emerald-600',
          activeBg: 'group-hover:bg-emerald-50 group-hover:text-emerald-600',
          actionText: 'text-emerald-600'
        };
      case 'algebra':
        return {
          stripe: 'bg-emerald-500',
          iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          hoverBorder: 'hover:border-emerald-500',
          hoverText: 'group-hover:text-emerald-600',
          activeBg: 'group-hover:bg-emerald-50 group-hover:text-emerald-600',
          actionText: 'text-emerald-600'
        };
      case 'geometry':
        return {
          stripe: 'bg-teal-500',
          iconBox: 'bg-teal-50 text-teal-700 border-teal-200',
          hoverBorder: 'hover:border-teal-500',
          hoverText: 'group-hover:text-teal-600',
          activeBg: 'group-hover:bg-teal-50 group-hover:text-teal-600',
          actionText: 'text-teal-600'
        };
      case 'odia_literature':
        return {
          stripe: 'bg-amber-500',
          iconBox: 'bg-amber-50 text-amber-700 border-amber-200',
          hoverBorder: 'hover:border-amber-500',
          hoverText: 'group-hover:text-amber-600',
          activeBg: 'group-hover:bg-amber-50 group-hover:text-amber-600',
          actionText: 'text-amber-600'
        };
      case 'odia_grammar':
        return {
          stripe: 'bg-orange-500',
          iconBox: 'bg-orange-50 text-orange-700 border-orange-200',
          hoverBorder: 'hover:border-orange-500',
          hoverText: 'group-hover:text-orange-600',
          activeBg: 'group-hover:bg-orange-50 group-hover:text-orange-600',
          actionText: 'text-orange-600'
        };
      case 'english_literature':
        return {
          stripe: 'bg-blue-500',
          iconBox: 'bg-blue-50 text-blue-700 border-blue-200',
          hoverBorder: 'hover:border-blue-500',
          hoverText: 'group-hover:text-blue-600',
          activeBg: 'group-hover:bg-blue-50 group-hover:text-blue-600',
          actionText: 'text-blue-600'
        };
      case 'english_grammar':
        return {
          stripe: 'bg-indigo-500',
          iconBox: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          hoverBorder: 'hover:border-indigo-500',
          hoverText: 'group-hover:text-indigo-600',
          activeBg: 'group-hover:bg-indigo-50 group-hover:text-indigo-600',
          actionText: 'text-indigo-600'
        };
      case 'hindi_literature':
        return {
          stripe: 'bg-rose-500',
          iconBox: 'bg-rose-50 text-rose-700 border-rose-200',
          hoverBorder: 'hover:border-rose-500',
          hoverText: 'group-hover:text-rose-600',
          activeBg: 'group-hover:bg-rose-50 group-hover:text-rose-600',
          actionText: 'text-rose-600'
        };
      case 'hindi_grammar':
        return {
          stripe: 'bg-pink-500',
          iconBox: 'bg-pink-50 text-pink-700 border-pink-200',
          hoverBorder: 'hover:border-pink-500',
          hoverText: 'group-hover:text-pink-600',
          activeBg: 'group-hover:bg-pink-50 group-hover:text-pink-600',
          actionText: 'text-pink-600'
        };
      case 'geography':
        return {
          stripe: 'bg-emerald-500',
          iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          hoverBorder: 'hover:border-emerald-500',
          hoverText: 'group-hover:text-emerald-600',
          activeBg: 'group-hover:bg-emerald-50 group-hover:text-emerald-600',
          actionText: 'text-emerald-600'
        };
      case 'economics':
        return {
          stripe: 'bg-teal-500',
          iconBox: 'bg-teal-50 text-teal-700 border-teal-200',
          hoverBorder: 'hover:border-teal-500',
          hoverText: 'group-hover:text-teal-600',
          activeBg: 'group-hover:bg-teal-50 group-hover:text-teal-600',
          actionText: 'text-teal-600'
        };
      case 'history':
        return {
          stripe: 'bg-rose-500',
          iconBox: 'bg-rose-50 text-rose-700 border-rose-200',
          hoverBorder: 'hover:border-rose-500',
          hoverText: 'group-hover:text-rose-600',
          activeBg: 'group-hover:bg-rose-50 group-hover:text-rose-600',
          actionText: 'text-rose-600'
        };
      case 'political_science':
        return {
          stripe: 'bg-amber-500',
          iconBox: 'bg-amber-50 text-amber-700 border-amber-200',
          hoverBorder: 'hover:border-amber-500',
          hoverText: 'group-hover:text-amber-600',
          activeBg: 'group-hover:bg-amber-50 group-hover:text-amber-600',
          actionText: 'text-amber-600'
        };
      default:
        return {
          stripe: 'bg-indigo-500',
          iconBox: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          hoverBorder: 'hover:border-indigo-500',
          hoverText: 'group-hover:text-indigo-600',
          activeBg: 'group-hover:bg-indigo-50 group-hover:text-indigo-600',
          actionText: 'text-indigo-600'
        };
    }
  };

  const branchNamesText = branches.map((b) => b.name).join(' କିମ୍ବା ');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="ପଛକୁ ଫେରନ୍ତୁ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 odia-text leading-tight">
              {subject.name} - ଶାଖା ଚୟନ
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              {branchNamesText} ବାଛନ୍ତୁ
            </p>
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
      <main className="flex-1 p-4 sm:p-5 space-y-4 pb-8">
        {/* Banner */}
        <div
          className={`p-4 rounded-2xl bg-gradient-to-r ${subject.colorTheme.gradient} text-white shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
              ଦଶମ ଶ୍ରେଣୀ {subject.name} (BSE Odisha)
            </span>
          </div>
          <h2 className="text-lg font-bold odia-text mb-1">
            {subject.name}ର {toOdiaNumber(branches.length)} ଟି ମୁଖ୍ୟ ବିଭାଗ
          </h2>
          <p className="text-xs text-white/90 leading-relaxed odia-text">
            {branchNamesText} ଉପରେ କ୍ଲିକ୍ କରି ସମସ୍ତ ଅଧ୍ୟାୟ ଦେଖନ୍ତୁ ଓ ପ୍ରଶ୍ନୋତ୍ତର ଅଭ୍ୟାସ କରନ୍ତୁ।
          </p>
        </div>

        <div className="text-xs text-slate-500 px-1 font-medium flex items-center justify-between">
          <span>{subject.name} ବିଭାଗ ବାଛନ୍ତୁ:</span>
          <span>{toOdiaNumber(branches.length)} ଟି ଶାଖା</span>
        </div>

        {/* Branch Cards */}
        <div className="space-y-3.5">
          {branches.map((branch) => {
            const completedInBranch = branch.chapters.filter((ch) => completedChaptersMap[ch.id]).length;
            const totalInBranch = branch.chapters.length;
            const totalQuestionsInBranch = branch.chapters.reduce((sum, c) => sum + c.questions.length, 0);

            const styles = getBranchColorStyles(branch.id);

            return (
              <button
                key={branch.id}
                onClick={() => handleSelect(branch)}
                className={`w-full text-left bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs ${styles.hoverBorder} hover:shadow-md active:scale-[0.99] transition-all cursor-pointer group flex flex-col gap-3 relative overflow-hidden`}
              >
                {/* Accent top stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${styles.stripe}`} />

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${styles.iconBox} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      {getBranchIcon(branch.id)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-bold text-slate-900 ${styles.hoverText} transition-colors odia-text leading-tight`}>
                          {branch.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {branch.englishName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {toOdiaNumber(totalInBranch)} ଟି ଅଧ୍ୟାୟ · {toOdiaNumber(totalQuestionsInBranch)} ପ୍ରଶ୍ନ
                      </p>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 ${styles.activeBg} transition-colors shrink-0`}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Subtitle / Description */}
                <p className="text-xs text-slate-600 odia-text leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {branch.description}
                </p>

                {/* Chapter preview pill chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {branch.chapters.slice(0, 4).map((ch, idx) => (
                    <span
                      key={ch.id}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100/80 text-slate-700 odia-text"
                    >
                      {toOdiaNumber(idx + 1)}. {ch.title}
                    </span>
                  ))}
                  {branch.chapters.length > 4 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 font-medium">
                      +{toOdiaNumber(branch.chapters.length - 4)} ଅନ୍ୟାନ୍ୟ
                    </span>
                  )}
                </div>

                {/* Progress / Action bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  {completedInBranch > 0 ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{toOdiaNumber(completedInBranch)}/{toOdiaNumber(totalInBranch)} ଅଧ୍ୟାୟ ସମାପ୍ତ</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      କୌଣସି ଅଧ୍ୟାୟ ଆରମ୍ଭ ହୋଇନାହିଁ
                    </span>
                  )}

                  <span className={`${styles.actionText} font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1`}>
                    <span>ଅଧ୍ୟାୟ ଖୋଲନ୍ତୁ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
