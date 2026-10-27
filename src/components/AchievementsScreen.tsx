import React, { useState } from 'react';
import { ArrowLeft, Trophy, Crown, Sun, Sparkles, Award, Star, Target, Zap, Lock, CheckCircle2, Volume2, VolumeX, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Badge } from '../utils/achievements';
import { soundManager } from '../utils/audio';
import { toOdiaNumber } from '../utils/odiaNumerals';
import { getWeeklyActivity, getActivityStats, DayActivity } from '../utils/activityTracker';

interface AchievementsScreenProps {
  badges: Badge[];
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: DayActivity }>;
}

const ActivityTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs text-left animate-in fade-in duration-150">
        <div className="font-bold odia-text text-amber-300">
          {data.dayFullOdia} {data.isToday ? '(ଆଜି)' : ''}
        </div>
        <div className="text-[11px] text-slate-300 font-mono mt-0.5">
          {data.date}
        </div>
        <div className="mt-1 font-semibold odia-text text-emerald-400">
          {toOdiaNumber(data.count)} ଟି କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ
        </div>
      </div>
    );
  }
  return null;
};

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  badges,
  onBack,
  soundEnabled,
  onToggleSound
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const weeklyData = getWeeklyActivity();
  const activityStats = getActivityStats(weeklyData);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-6 h-6 ${isUnlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (iconName) {
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'crown':
        return <Crown className={iconClass} />;
      case 'sun':
        return <Sun className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'target':
        return <Target className={iconClass} />;
      case 'zap':
        return <Zap className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const handleBack = () => {
    soundManager.playClick();
    onBack();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 max-w-lg mx-auto w-full">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="ପଛକୁ ଫେରନ୍ତୁ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 odia-text leading-tight">
              ପୁରସ୍କାର ଓ ବ୍ୟାଜ୍
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Achievements & Milestone Badges
            </p>
          </div>
        </div>

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
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-5 space-y-4 pb-10">
        {/* Overall Achievement Summary Banner */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 text-white shadow-lg shadow-amber-600/20 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 block">
                ଆପଣଙ୍କ ପ୍ରଗତି
              </span>
              <h2 className="text-xl font-black odia-text mt-0.5">
                {toOdiaNumber(unlockedCount)} / {toOdiaNumber(totalCount)} ଟି ବ୍ୟାଜ୍ ଅର୍ଜିତ
              </h2>
              <p className="text-xs text-amber-100/90 odia-text mt-1 max-w-[220px]">
                {unlockedCount === totalCount
                  ? 'ଅଦ୍ଭୁତ! ଆପଣ ସମସ୍ତ ମାଇଲଖୁଣ୍ଟ ସମ୍ପୂର୍ଣ୍ଣ କରିଛନ୍ତି!'
                  : 'ପ୍ରତିଦିନ ଅଭ୍ୟାସ ଜାରି ରଖି ନୂଆ ନୂଆ ବ୍ୟାଜ୍ ଅର୍ଜନ କରନ୍ତୁ।'}
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-100 mb-1.5">
              <span>ସାମଗ୍ରିକ ଅନଲକ୍ ହାର</span>
              <span className="font-mono">{overallPercent}%</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Learning Activity Section (Weekly Quiz Completion Bar Chart via recharts) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs text-left">
          <div className="flex items-center justify-between mb-2 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 odia-text leading-tight">
                  ଶିକ୍ଷା କାର୍ଯ୍ୟକଳାପ (Learning Activity)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  ଗତ ୭ ଦିନର କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣତା (Weekly Quiz Completions)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-indigo-700 font-mono">
                {toOdiaNumber(activityStats.weekTotal)}
              </span>
              <span className="text-xs text-slate-500 odia-text ml-1">କୁଇଜ୍</span>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="w-full h-44 pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <XAxis
                  dataKey="dayOdia"
                  tickLine={false}
                  axisLine={{ stroke: '#f1f5f9' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  width={30}
                />
                <Tooltip content={<ActivityTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="count" radius={[6, 6, 2, 2]} maxBarSize={36}>
                  {weeklyData.map((entry) => (
                    <Cell
                      key={entry.date}
                      fill={entry.isToday ? '#4f46e5' : entry.count > 0 ? '#818cf8' : '#e2e8f0'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 mt-1 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80">
              <div className="text-[10px] text-slate-500 font-medium odia-text">
                ସାପ୍ତାହିକ ମୋଟ
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                {toOdiaNumber(activityStats.weekTotal)}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-100/70">
              <div className="text-[10px] text-indigo-700 font-medium odia-text">
                ଦୈନିକ ହାରାହାରି
              </div>
              <div className="text-sm font-bold text-indigo-900 font-mono mt-0.5">
                {toOdiaNumber(activityStats.dailyAverage)}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100/70">
              <div className="text-[10px] text-amber-800 font-medium odia-text">
                ସର୍ବାଧିକ ଦିନ
              </div>
              <div className="text-xs font-bold text-amber-900 truncate mt-0.5 odia-text">
                {activityStats.mostActiveDay}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Segmented Control (Interactive buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('all');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ସମସ୍ତ ({toOdiaNumber(totalCount)})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('unlocked');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'unlocked'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ଅର୍ଜିତ ({toOdiaNumber(unlockedCount)})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('locked');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'locked'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ତାଲାବନ୍ଦ ({toOdiaNumber(totalCount - unlockedCount)})
          </button>
        </div>

        {/* Badges List */}
        <div className="space-y-3">
          {filteredBadges.map((badge) => {
            const progressPercent = Math.min(100, Math.round((badge.currentProgress / badge.maxProgress) * 100));

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  badge.isUnlocked
                    ? 'bg-white border-amber-200/90 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/70 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Badge Icon Box */}
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border ${
                      badge.isUnlocked
                        ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-xs'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    {badge.isUnlocked ? (
                      getBadgeIcon(badge.icon, true)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {/* Badge Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3
                        className={`text-sm font-bold truncate odia-text ${
                          badge.isUnlocked ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {badge.title}
                      </h3>
                      {badge.isUnlocked ? (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ଅର୍ଜିତ
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 font-mono">
                          {toOdiaNumber(badge.currentProgress)}/{toOdiaNumber(badge.maxProgress)}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-medium text-slate-500 mb-1.5">
                      {badge.englishTitle}
                    </div>

                    <p className="text-xs text-slate-600 odia-text leading-relaxed mb-2.5">
                      {badge.description}
                    </p>

                    {/* Progress Bar for Locked / In-Progress */}
                    {!badge.isUnlocked && (
                      <div>
                        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
