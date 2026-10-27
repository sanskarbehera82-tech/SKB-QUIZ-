import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, BookOpen, Calculator, Atom, Landmark, Globe, Languages, Volume2, VolumeX, Search, X } from 'lucide-react';
import { Subject } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { toOdiaNumber } from '../utils/odiaNumerals';

interface SubjectListScreenProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedChaptersMap: Record<string, boolean>;
}

export const SubjectListScreen: React.FC<SubjectListScreenProps> = ({
  subjects,
  onSelectSubject,
  onBack,
  soundEnabled,
  onToggleSound,
  completedChaptersMap
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open':
        return <BookOpen className="w-6 h-6 text-amber-600" />;
      case 'languages':
        return <Languages className="w-6 h-6 text-indigo-600" />;
      case 'calculator':
        return <Calculator className="w-6 h-6 text-emerald-600" />;
      case 'atom':
        return <Atom className="w-6 h-6 text-cyan-600" />;
      case 'landmark':
        return <Landmark className="w-6 h-6 text-rose-600" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-teal-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-slate-600" />;
    }
  };

  const handleSelect = (subject: Subject) => {
    soundManager.playClick();
    onSelectSubject(subject);
  };

  const handleBack = () => {
    soundManager.playClick();
    onBack();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter subjects based on subject name, English name, branches, or chapter titles
  const filteredSubjects = subjects.filter((subject) => {
    if (!normalizedQuery) return true;

    if (
      subject.name.toLowerCase().includes(normalizedQuery) ||
      subject.englishName.toLowerCase().includes(normalizedQuery) ||
      subject.description.toLowerCase().includes(normalizedQuery)
    ) {
      return true;
    }

    if (
      subject.branches?.some(
        (b) =>
          b.name.toLowerCase().includes(normalizedQuery) ||
          b.englishName.toLowerCase().includes(normalizedQuery) ||
          b.chapters.some(
            (ch) =>
              ch.title.toLowerCase().includes(normalizedQuery) ||
              ch.subtitle?.toLowerCase().includes(normalizedQuery)
          )
      )
    ) {
      return true;
    }

    return subject.chapters.some(
      (ch) =>
        ch.title.toLowerCase().includes(normalizedQuery) ||
        ch.subtitle?.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full">
      {/* Sticky Top Bar (Height ~56px) */}
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
              ବିଷୟ ଚୟନ କରନ୍ତୁ
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Select School Subject ({toOdiaNumber(subjects.length)} ଟି ବିଷୟ)
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
      <main className="flex-1 p-4 sm:p-5 space-y-3.5 pb-8">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ବିଷୟ ବା ଅଧ୍ୟାୟ ଖୋଜନ୍ତୁ... (Search subjects/chapters)"
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
                ମିଳିଥିବା ବିଷୟ: <strong className="text-indigo-600">{toOdiaNumber(filteredSubjects.length)}</strong> ଟି
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                ସମସ୍ତ ଦେଖନ୍ତୁ
              </button>
            </>
          ) : (
            <>
              <span>ଆପଣ ପଢ଼ିବାକୁ ଚାହୁଁଥିବା ବିଷୟ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ:</span>
              <span>{toOdiaNumber(subjects.length)} ଟି ବିଷୟ</span>
            </>
          )}
        </div>

        {/* Subjects List */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 odia-text">
                କୌଣସି ବିଷୟ ବା ଅଧ୍ୟାୟ ମିଳିଲା ନାହିଁ
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                "{searchQuery}" ସହ ମେଳ ଖାଉଥିବା କୌଣସି ବିଷୟ ମିଳିଲା ନାହିଁ।
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              ସମସ୍ତ ବିଷୟ ଦେଖନ୍ତୁ
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredSubjects.map((subject, index) => {
              const completedCount = subject.chapters.filter((ch) => completedChaptersMap[ch.id]).length;
              const totalCh = subject.chapters.length;

              // Find matching chapter names if user searched
              const matchingChapters = normalizedQuery
                ? subject.chapters.filter(
                    (ch) =>
                      ch.title.toLowerCase().includes(normalizedQuery) ||
                      ch.subtitle?.toLowerCase().includes(normalizedQuery)
                  )
                : [];

              return (
                <button
                  key={subject.id}
                  onClick={() => handleSelect(subject)}
                  className="w-full text-left bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex items-center gap-4 group"
                >
                  {/* Subject Icon Box */}
                  <div
                    className={`w-13 h-13 rounded-2xl ${subject.colorTheme.bgLight} border ${subject.colorTheme.border} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    {getSubjectIcon(subject.iconName)}
                  </div>

                  {/* Subject Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate odia-text">
                        {subject.name}
                      </h2>
                      <span className="text-xs text-slate-400 font-mono">
                        {toOdiaNumber(index + 1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <p className="text-xs text-slate-500 truncate">
                        {subject.englishName}
                      </p>
                      {subject.branches && subject.branches.length > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {subject.branches.map((b) => b.name).join(' ଓ ')}
                        </span>
                      )}
                    </div>

                    {/* Show matching chapters hint if query matched specific chapter */}
                    {matchingChapters.length > 0 && (
                      <div className="mb-1.5 p-1.5 bg-indigo-50/70 rounded-lg text-[11px] text-indigo-800 odia-text truncate">
                        <span className="font-semibold">ମିଳିଥିବା ଅଧ୍ୟାୟ: </span>
                        {matchingChapters.slice(0, 2).map((c) => c.title).join(', ')}
                        {matchingChapters.length > 2 && ` (+${matchingChapters.length - 2})`}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="text-slate-600 font-medium">
                        {toOdiaNumber(totalCh)} ଅଧ୍ୟାୟ
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="truncate">
                        {subject.chapters.reduce((acc, c) => acc + c.questions.length, 0)} ପ୍ରଶ୍ନ
                      </span>
                      {completedCount > 0 && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-emerald-600 font-semibold">
                            {toOdiaNumber(completedCount)}/{toOdiaNumber(totalCh)} ସମାପ୍ତ
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Helpful Tip */}
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
          <span className="text-base">💡</span>
          <p className="odia-text text-[13px] leading-relaxed">
            ପ୍ରତ୍ୟେକ ବିଷୟରେ ଓଡ଼ିଶା ବୋର୍ଡ ପାଠ୍ୟକ୍ରମର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅଧ୍ୟାୟ ଓ ପ୍ରଶ୍ନୋତ୍ତର ଅନ୍ତର୍ଭୁକ୍ତ କରାଯାଇଛି।
          </p>
        </div>
      </main>
    </div>
  );
};
