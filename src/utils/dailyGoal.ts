/**
 * Daily Learning Goal Utility
 * Tracks daily quiz completion targets and progress.
 */

import { getLocalDateString } from './streak';

export interface DailyGoalData {
  target: number;
  completedToday: number;
  date: string; // YYYY-MM-DD
}

const STORAGE_KEY = 'skv_daily_goal';
export const DEFAULT_DAILY_TARGET = 3;
export const GOAL_OPTIONS = [1, 2, 3, 5, 8];

/**
 * Loads current daily goal data from localStorage, resetting daily count if date has changed
 */
export function loadDailyGoal(): DailyGoalData {
  const today = getLocalDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        target: DEFAULT_DAILY_TARGET,
        completedToday: 0,
        date: today
      };
    }

    const parsed = JSON.parse(raw);
    const target = typeof parsed.target === 'number' && parsed.target > 0 ? parsed.target : DEFAULT_DAILY_TARGET;
    const storedDate = parsed.date;

    if (storedDate === today) {
      return {
        target,
        completedToday: typeof parsed.completedToday === 'number' ? parsed.completedToday : 0,
        date: today
      };
    } else {
      // New day: keep target, reset completedToday
      const refreshed: DailyGoalData = {
        target,
        completedToday: 0,
        date: today
      };
      saveDailyGoal(refreshed);
      return refreshed;
    }
  } catch {
    return {
      target: DEFAULT_DAILY_TARGET,
      completedToday: 0,
      date: today
    };
  }
}

/**
 * Saves daily goal data to localStorage
 */
export function saveDailyGoal(data: DailyGoalData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Updates the target number of daily quizzes
 */
export function setDailyGoalTarget(newTarget: number): DailyGoalData {
  const current = loadDailyGoal();
  const validTarget = Math.max(1, Math.min(newTarget, 20));
  const updated: DailyGoalData = {
    ...current,
    target: validTarget
  };
  saveDailyGoal(updated);
  return updated;
}

/**
 * Increments today's completed quiz count when a quiz is completed
 */
export function incrementDailyGoalProgress(): { goal: DailyGoalData; goalReachedNow: boolean } {
  const current = loadDailyGoal();
  const wasBelowTarget = current.completedToday < current.target;
  const newCompleted = current.completedToday + 1;
  const goalReachedNow = wasBelowTarget && newCompleted >= current.target;

  const updated: DailyGoalData = {
    ...current,
    completedToday: newCompleted
  };

  saveDailyGoal(updated);
  return { goal: updated, goalReachedNow };
}
