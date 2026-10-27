/**
 * Daily Streak Tracking Utility
 * Stores consecutive days a user completes at least one quiz chapter.
 */

export interface StreakData {
  count: number;
  lastDate: string | null; // Format: YYYY-MM-DD
  completedToday: boolean;
}

const STORAGE_KEY = 'skv_daily_streak';

/**
 * Returns current local date as YYYY-MM-DD string
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates day difference between two YYYY-MM-DD dates
 */
function getDayDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d1.getTime() - d2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Loads and validates current streak from localStorage
 */
export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { count: 0, lastDate: null, completedToday: false };
    }

    const parsed = JSON.parse(raw);
    const lastDate = parsed.lastDate;
    const storedCount = typeof parsed.count === 'number' ? parsed.count : 0;
    const today = getLocalDateString();

    if (!lastDate) {
      return { count: 0, lastDate: null, completedToday: false };
    }

    const diff = getDayDifference(today, lastDate);

    if (diff === 0) {
      // Completed today
      return {
        count: storedCount,
        lastDate,
        completedToday: true
      };
    } else if (diff === 1) {
      // Completed yesterday, streak intact, waiting for today's completion
      return {
        count: storedCount,
        lastDate,
        completedToday: false
      };
    } else {
      // 2 or more days missed: streak broken
      const resetData = { count: 0, lastDate: null, completedToday: false };
      saveStreak(resetData);
      return resetData;
    }
  } catch {
    return { count: 0, lastDate: null, completedToday: false };
  }
}

/**
 * Records a quiz completion and updates streak if applicable
 * Returns the updated streak data and a boolean indicating if streak increased
 */
export function recordQuizCompletion(): { streak: StreakData; streakIncreased: boolean } {
  const current = loadStreak();
  const today = getLocalDateString();

  if (current.completedToday && current.lastDate === today) {
    // Already counted today
    return { streak: current, streakIncreased: false };
  }

  let newCount = 1;
  if (current.lastDate) {
    const diff = getDayDifference(today, current.lastDate);
    if (diff === 1) {
      // Consecutive day!
      newCount = current.count + 1;
    } else if (diff === 0) {
      newCount = current.count;
    }
  }

  const updatedStreak: StreakData = {
    count: newCount,
    lastDate: today,
    completedToday: true
  };

  saveStreak(updatedStreak);
  return { streak: updatedStreak, streakIncreased: true };
}

export function saveStreak(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota/access errors
  }
}
