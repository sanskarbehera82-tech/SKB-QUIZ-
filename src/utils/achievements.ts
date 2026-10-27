/**
 * Achievements and Badges System for SKV Quiz
 */

import { Subject } from '../data/quizData';
import { StreakData } from './streak';
import { DailyGoalData } from './dailyGoal';

export interface Badge {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  icon: 'trophy' | 'sun' | 'crown' | 'sparkles' | 'award' | 'zap' | 'target' | 'star';
  category: 'completion' | 'streak' | 'accuracy' | 'special';
  currentProgress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

export interface AchievementContext {
  completedChaptersMap: Record<string, boolean>;
  chapterScores: Record<string, { score: number; total: number; percentage: number }>;
  streak: StreakData;
  dailyGoal: DailyGoalData;
  subjects: Subject[];
}

const STORAGE_KEY = 'skv_unlocked_badges';

export function getUnlockedTimestamps(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUnlockedBadge(badgeId: string): void {
  try {
    const current = getUnlockedTimestamps();
    if (!current[badgeId]) {
      current[badgeId] = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // Ignore storage errors
  }
}

export function evaluateBadges(context: AchievementContext): Badge[] {
  const timestamps = getUnlockedTimestamps();
  const completedChaptersCount = Object.keys(context.completedChaptersMap).length;
  const streakDays = context.streak.count;

  // Perfect scores count (100%)
  const perfectScores = Object.values(context.chapterScores).filter((s) => s.percentage === 100).length;

  // Distinct subjects with at least one chapter completed
  const attemptedSubjectIds = new Set<string>();
  context.subjects.forEach((sub) => {
    const hasAny = sub.chapters.some((ch) => context.completedChaptersMap[ch.id]);
    if (hasAny) {
      attemptedSubjectIds.add(sub.id);
    }
  });
  const subjectsWithCompletions = attemptedSubjectIds.size;

  // Check if any subject has all its chapters completed
  const hasCompletedFullSubject = context.subjects.some((sub) => {
    return sub.chapters.length > 0 && sub.chapters.every((ch) => context.completedChaptersMap[ch.id]);
  });

  // Check if daily goal reached
  const dailyGoalReached = context.dailyGoal.completedToday >= context.dailyGoal.target;

  const rawBadges: Omit<Badge, 'isUnlocked' | 'unlockedAt'>[] = [
    {
      id: 'first_step',
      title: 'ପ୍ରଥମ ପଦକ୍ଷେପ',
      englishTitle: 'First Step',
      description: 'ଯେକୌଣସି ବିଷୟର ପ୍ରଥମ କୁଇଜ୍ ଅଧ୍ୟାୟ ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
      icon: 'sparkles',
      category: 'completion',
      currentProgress: Math.min(1, completedChaptersCount),
      maxProgress: 1
    },
    {
      id: 'quiz_master',
      title: 'କୁଇଜ୍ ମାଷ୍ଟର',
      englishTitle: 'Quiz Master',
      description: 'ମୋଟ ୧୦ ଟି କୁଇଜ୍ ଅଧ୍ୟାୟ ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
      icon: 'trophy',
      category: 'completion',
      currentProgress: Math.min(10, completedChaptersCount),
      maxProgress: 10
    },
    {
      id: 'consistency_king',
      title: 'ନିରନ୍ତରତା ବିଜେତା',
      englishTitle: 'Consistency King',
      description: 'କ୍ରମାଗତ ୭ ଦିନ ଦୈନିକ କୁଇଜ୍ ଷ୍ଟ୍ରିକ୍ ବଜାୟ ରଖନ୍ତୁ।',
      icon: 'crown',
      category: 'streak',
      currentProgress: Math.min(7, streakDays),
      maxProgress: 7
    },
    {
      id: 'early_bird',
      title: 'ପ୍ରାତଃ ଅଧ୍ୟୟନୀ',
      englishTitle: 'Early Bird',
      description: 'ସକାଳ ସମୟରେ ଅଧ୍ୟୟନ ଆରମ୍ଭ କରି କୁଇଜ୍ ଅଭ୍ୟାସ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
      icon: 'sun',
      category: 'special',
      currentProgress: completedChaptersCount > 0 ? 1 : 0,
      maxProgress: 1
    },
    {
      id: 'perfect_score',
      title: 'ଶତପ୍ରତିଶତ ଜ୍ଞାନ',
      englishTitle: 'Perfect 100%',
      description: 'କୌଣସି ଅଧ୍ୟାୟ କୁଇଜ୍‌ରେ ୧୦୦% (ସମସ୍ତ ପ୍ରଶ୍ନର ସଠିକ୍ ଉତ୍ତର) ହାସଲ କରନ୍ତୁ।',
      icon: 'award',
      category: 'accuracy',
      currentProgress: Math.min(1, perfectScores),
      maxProgress: 1
    },
    {
      id: 'all_rounder',
      title: 'ସର୍ବଗୁଣ ସମ୍ପନ୍ନ',
      englishTitle: 'All-Rounder',
      description: 'ସମସ୍ତ ୬ଟି ବିଷୟ (ଓଡ଼ିଆ, ଇଂରାଜୀ, ଗଣିତ, ବିଜ୍ଞାନ, ଇତିହାସ, ଭୂଗୋଳ) ରେ ଅନ୍ତତଃ ଗୋଟିଏ ଲେଖାଏଁ ଅଧ୍ୟାୟ ସାରନ୍ତୁ।',
      icon: 'star',
      category: 'completion',
      currentProgress: subjectsWithCompletions,
      maxProgress: 6
    },
    {
      id: 'daily_champion',
      title: 'ଲକ୍ଷ୍ୟ ବିଜେତା',
      englishTitle: 'Daily Goal Crusher',
      description: 'ଆପଣଙ୍କ ଦୈନିକ ଶିକ୍ଷା ଲକ୍ଷ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
      icon: 'target',
      category: 'special',
      currentProgress: dailyGoalReached ? 1 : 0,
      maxProgress: 1
    },
    {
      id: 'subject_champion',
      title: 'ବିଷୟ ଚାମ୍ପିଅନ୍',
      englishTitle: 'Subject Champion',
      description: 'କୌଣସି ଗୋଟିଏ ବିଷୟର ସମସ୍ତ ଅଧ୍ୟାୟ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
      icon: 'zap',
      category: 'completion',
      currentProgress: hasCompletedFullSubject ? 1 : 0,
      maxProgress: 1
    }
  ];

  return rawBadges.map((b) => {
    const isUnlocked = b.currentProgress >= b.maxProgress;
    let unlockedAt = timestamps[b.id] || null;

    if (isUnlocked && !unlockedAt) {
      unlockedAt = new Date().toISOString();
      saveUnlockedBadge(b.id);
    }

    return {
      ...b,
      isUnlocked,
      unlockedAt
    };
  });
}
