import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { soundManager } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as an installed PWA in standalone mode, hide
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If not installable and not iOS, don't show unless prompt is available
  if (!isInstallable && !isIOS && !justInstalled) {
    return null;
  }

  return (
    <>
      {justInstalled ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="odia-text text-[11px]">ଇନଷ୍ଟଲ୍ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା!</span>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-2xs"
          title="Install App"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="odia-text text-[11px]">ଆପ୍ ଇନଷ୍ଟଲ୍ (Install)</span>
        </button>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 text-left relative">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowIOSGuide(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 odia-text">
              iPhone / iPad ରେ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ
            </h3>
            <p className="text-xs text-slate-600 odia-text mt-1 leading-relaxed">
              ସଫାରି (Safari) ବ୍ରାଉଜର୍‌ରେ ନିମ୍ନଲିଖିତ ସରଳ ପଦକ୍ଷେପ ଅନୁସରଣ କରନ୍ତୁ:
            </p>

            <div className="mt-4 space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 odia-text">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="leading-snug">
                  ସଫାରି ବ୍ରାଉଜର ତଳେ ଥିବା <strong>Share</strong> (<Share2 className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" />) ବଟନ୍ ଦବାନ୍ତୁ।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  ତଳକୁ ସ୍କ୍ରୋଲ୍ କରି <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" />) ଚୟନ କରନ୍ତୁ।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  ଉପର ଡାହାଣ କୋଣରେ <strong>"Add"</strong> ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ। ଆପଣଙ୍କ ମୋବାଇଲ୍ ସ୍କ୍ରିନରେ ଆପ୍ ଯୋଡ଼ି ହୋଇଯିବ!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowIOSGuide(false);
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer odia-text"
            >
              ବୁଝିଲି (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
