import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Award, 
  Volume2, 
  VolumeX, 
  Calculator, 
  Shapes, 
  Search, 
  X, 
  Atom, 
  Dna, 
  BookOpen, 
  Globe, 
  TrendingUp, 
  Landmark, 
  Scale, 
  PenTool, 
  Languages 
} from 'lucide-react';
import { Subject, Chapter, Branch } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { toOdiaNumber } from '../utils/odiaNumerals';

interface ChapterListScreenProps {
  subject: Subject;
  selectedBranch?: Branch | null;
  onSelectBranch?: (branch: Branch) => void;
  onSelectChapter: (chapter: Chapter) => void;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  chapterScores: Record<string, { score: number; total: number; percentage: number }>;
}

export const ChapterListScreen: React.FC<ChapterListScreenProps> = ({
  subject,
  selectedBranch,
  onSelectBranch,
  onSelectChapter,
  onBack,
  soundEnabled,
  onToggleSound,
  chapterScores
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (chapter: Chapter) => {
    soundManager.playClick();
    onSelectChapter(chapter);
  };

  const handleBack = () => {
    soundManager.playClick();
    onBack();
  };

  const handleBranchTab = (branch: Branch) => {
    soundManager.playClick();
    if (onSelectBranch) {
      onSelectBranch(branch);
    }
  };

  const getBranchIcon = (branchId: string, isSelected: boolean) => {
    switch (branchId) {
      case 'algebra':
        return <Calculator className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />;
      case 'geometry':
        return <Shapes className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />;
      case 'physical_science':
        return <Atom className={`w-4 h-4 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`} />;
      case 'life_science':
        return <Dna className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />;
      case 'odia_literature':
        return <BookOpen className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />;
      case 'odia_grammar':
        return <PenTool className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-slate-400'}`} />;
      case 'english_literature':
        return <BookOpen className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />;
      case 'english_grammar':
        return <Languages className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />;
      case 'hindi_literature':
        return <BookOpen className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />;
      case 'hindi_grammar':
        return <Languages className={`w-4 h-4 ${isSelected ? 'text-pink-600' : 'text-slate-400'}`} />;
      case 'geography':
        return <Globe className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />;
      case 'economics':
        return <TrendingUp className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />;
      case 'history':
        return <Landmark className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />;
      case 'political_science':
        return <Scale className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />;
      default:
        return <BookOpen className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />;
    }
  };

  // Determine active chapters and theme
  const activeChapters = selectedBranch ? selectedBranch.chapters : subject.chapters;
  const currentTitle = selectedBranch ? `${subject.name} - ${selectedBranch.name}` : subject.name;
  const currentEnglish = selectedBranch ? selectedBranch.englishName : subject.englishName;
  const currentDescription = selectedBranch ? selectedBranch.description : subject.description;
  const theme = selectedBranch ? selectedBranch.colorTheme : subject.colorTheme;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredChapters = activeChapters.filter((chapter, index) => {
    if (!normalizedQuery) return true;

    const odiaNum = toOdiaNumber(index + 1);
    const engNum = String(index + 1);

    return (
      chapter.title.toLowerCase().includes(normalizedQuery) ||
      (chapter.subtitle && chapter.subtitle.toLowerCase().includes(normalizedQuery)) ||
      odiaNum.includes(normalizedQuery) ||
      engNum.includes(normalizedQuery)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="ପଛକୁ ଫେରନ୍ତୁ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 odia-text truncate leading-tight">
              {currentTitle}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              ଅଧ୍ୟାୟ ତାଲିକା ({toOdiaNumber(activeChapters.length)} ଟି ଅଧ୍ୟାୟ)
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

      {/* Chapter List Body */}
      <main className="flex-1 p-4 sm:p-5 space-y-3 pb-8">
        {/* Branch Quick Switcher Tabs (if subject has branches) */}
        {subject.branches && subject.branches.length > 0 && onSelectBranch && (
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1">
            {subject.branches.map((b) => {
              const isSelected = selectedBranch?.id === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => handleBranchTab(b)}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {getBranchIcon(b.id, isSelected)}
                  <span className="odia-text text-[13px] truncate">{b.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Subject / Branch Header Banner */}
        <div
          className={`p-4 rounded-2xl ${theme.bgLight} border ${theme.border} text-slate-800`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate mr-2">
              {currentEnglish}
            </span>
            <span className="text-xs font-medium text-slate-600 shrink-0">
              {toOdiaNumber(activeChapters.length)} ଟି ଅଧ୍ୟାୟ
            </span>
          </div>
          <p className="text-sm font-medium odia-text text-slate-700">
            {currentDescription}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ଅଧ୍ୟାୟ ଖୋଜନ୍ତୁ... (Search chapters)"
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="ଖୋଜା ସଫା କରନ୍ତୁ"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 px-1 font-medium flex items-center justify-between">
          {searchQuery ? (
            <>
              <span>
                ମିଳିଥିବା ଅଧ୍ୟାୟ: <strong className="text-indigo-600">{toOdiaNumber(filteredChapters.length)}</strong> / {toOdiaNumber(activeChapters.length)}
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                ସମସ୍ତ ଦେଖନ୍ତୁ
              </button>
            </>
          ) : (
            <span>ଅଧ୍ୟାୟ ଚୟନ କରି କୁଇଜ୍ ଆରମ୍ଭ କରନ୍ତୁ:</span>
          )}
        </div>

        {/* Empty state when search query doesn't match */}
        {filteredChapters.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 odia-text">
                କୌଣସି ଅଧ୍ୟାୟ ମିଳିଲା ନାହିଁ
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                "{searchQuery}" ସହ ମେଳ ଖାଉଥିବା କୌଣସି ଅଧ୍ୟାୟ ମିଳିଲା ନାହିଁ।
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              ସମସ୍ତ ଅଧ୍ୟାୟ ଦେଖନ୍ତୁ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChapters.map((chapter, index) => {
              const previousScore = chapterScores[chapter.id];

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleSelect(chapter)}
                  className="w-full text-left bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer group flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                        {toOdiaNumber(index + 1)}
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors odia-text leading-snug">
                          {chapter.title}
                        </h2>
                      </div>
                    </div>

                    {/* Play pill button */}
                    <span className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>ଖେଳନ୍ତୁ</span>
                    </span>
                  </div>

                  {chapter.subtitle && (
                    <p className="text-xs text-slate-500 odia-text pl-9">
                      {chapter.subtitle}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 pl-9">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{toOdiaNumber(chapter.estimatedMinutes)} ମିନିଟ୍</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{toOdiaNumber(chapter.questionCount)} ଟି ପ୍ରଶ୍ନ</span>
                    </div>

                    {previousScore && (
                      <div className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <Award className="w-3.5 h-3.5" />
                        <span>ସର୍ବୋଚ୍ଚ: {toOdiaNumber(previousScore.score)}/{toOdiaNumber(previousScore.total)}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
