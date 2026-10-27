import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 text-white px-4 py-2.5 shadow-2xl backdrop-blur-md border border-amber-500/40 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </span>
        <div>
          <div className="font-bold text-amber-300 odia-text text-[12px] flex items-center gap-1.5">
            <span>ଅଫ୍‌ଲାଇନ୍ ମୋଡ୍ (Offline Mode)</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="text-[11px] text-slate-300 odia-text">
            ଇଣ୍ଟରନେଟ୍ ବିନା ସମସ୍ତ ଅଧ୍ୟାୟ, କୁଇଜ୍ ଓ ଗେମ୍ସ ଖେଳିପାରିବେ
          </div>
        </div>
      </div>
    </div>
  );
};
