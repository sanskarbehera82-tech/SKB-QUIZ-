import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Clock, Target, Zap, Lightbulb, Compass, Award, Check, Share2 } from 'lucide-react';
import { STUDY_TIPS, StudyTip } from '../data/studyTips';
import { soundManager } from '../utils/audio';

interface StudyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TipFilter = 'all' | 'motivation' | 'subject' | 'exam' | 'routine';

export const StudyTipsModal: React.FC<StudyTipsModalProps> = ({ isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState<TipFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTips = STUDY_TIPS.filter((tip) => {
    if (selectedFilter === 'all') return true;
    return tip.category === selectedFilter;
  });

  const getTipIcon = (icon: StudyTip['icon']) => {
    switch (icon) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'target':
        return <Target className="w-5 h-5 text-rose-500" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'book':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-emerald-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleShareQuote = async (tip: StudyTip) => {
    soundManager.playClick();
    const textToShare = `📚 *${tip.title}*\n"${tip.quote}"\n\n${tip.detail}\n\n- SKV Quiz (Odisha Matric Prep)\n${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SKV Quiz - ${tip.title}`,
          text: textToShare
        });
        return;
      } catch {
        // user cancelled or fallback
      }
    }
    navigator.clipboard?.writeText(textToShare);
    setCopiedId(tip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-white relative">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
            aria-label="ବନ୍ଦ କରନ୍ତୁ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              BSE ଓଡ଼ିଶା ମାଟ୍ରିକ୍ ପରୀକ୍ଷା
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black odia-text flex items-center gap-2">
            💡 ପାଠପଢ଼ା ଟିପ୍ସ ଓ ପ୍ରେରଣା
          </h2>
          <p className="text-xs text-amber-100 mt-1 odia-text leading-relaxed">
            ପ୍ରତିଦିନ ସଠିକ୍ ପଦ୍ଧତିରେ ପଢ଼ି ବୋର୍ଡ ପରୀକ୍ଷାରେ A1 ଗ୍ରେଡ୍ ହାସଲ କରିବାର ଉପାୟ
          </p>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'ସବୁ (All)' },
            { id: 'motivation', label: 'ଦୈନିକ ପ୍ରେରଣା' },
            { id: 'subject', label: 'ବିଷୟ ରଣନୀତି' },
            { id: 'exam', label: 'ପରୀକ୍ଷା ହଲ୍' },
            { id: 'routine', label: 'ଅଧ୍ୟୟନ ନିୟମ' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter(tab.id as TipFilter);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tips List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="pt-3.5 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    {getTipIcon(tip.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                        {tip.categoryOdia}
                      </span>
                      {tip.subjectTag && (
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                          {tip.subjectTag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 odia-text mt-1">
                      {tip.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleShareQuote(tip)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 active:scale-95 transition-all shrink-0 cursor-pointer text-xs flex items-center gap-1"
                  title="Share Tip"
                >
                  {copiedId === tip.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] text-emerald-600 font-bold">କପି ହେଲା!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[11px] text-slate-500">ସେୟାର</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quote highlighted box */}
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-slate-800 text-xs sm:text-[13px] font-medium odia-text italic">
                "{tip.quote}"
              </div>

              {/* Detail guidance */}
              <p className="mt-2 text-xs sm:text-[13px] text-slate-600 odia-text leading-relaxed">
                {tip.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Award className="w-4 h-4 text-amber-500" />
            <span>ମୋଟ {filteredTips.length} ଟି ଟିପ୍ସ ଉପଲବ୍ଧ</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            ବୁଝିଲି (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
