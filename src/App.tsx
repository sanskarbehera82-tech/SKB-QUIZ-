/**
 * SKV Quiz - Mobile-First Odia Language Educational Quiz App
 * Designed for Odia-medium school students
 */

import React, { useState, useEffect } from 'react';
import { SUBJECTS, Subject, Chapter, Question, Branch } from './data/quizData';
import { HomeScreen } from './components/HomeScreen';
import { SubjectListScreen } from './components/SubjectListScreen';
import { BranchListScreen } from './components/BranchListScreen';
import { ChapterListScreen } from './components/ChapterListScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { GamesHubScreen } from './components/games/GamesHubScreen';
import { SubwaySurfersGame } from './components/games/SubwaySurfersGame';
import { TempleRunGame } from './components/games/TempleRunGame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { soundManager } from './utils/audio';
import { loadStreak, recordQuizCompletion, StreakData } from './utils/streak';
import { loadDailyGoal, incrementDailyGoalProgress, setDailyGoalTarget, DailyGoalData } from './utils/dailyGoal';
import { evaluateBadges } from './utils/achievements';
import { recordActivityQuiz } from './utils/activityTracker';

type Screen = 'home' | 'subjects' | 'branches' | 'chapters' | 'quiz' | 'results' | 'achievements' | 'games' | 'game_subway' | 'game_temple';

interface QuizResultData {
  total: number;
  correct: number;
  wrong: number;
  score: number;
  percentage: number;
  userAnswers: { question: Question; selectedOption: number; isCorrect: boolean }[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [results, setResults] = useState<QuizResultData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.enabled);
  const [streak, setStreak] = useState<StreakData>(() => loadStreak());
  const [streakIncreased, setStreakIncreased] = useState<boolean>(false);
  const [dailyGoal, setDailyGoal] = useState<DailyGoalData>(() => loadDailyGoal());

  // Refresh streak and daily goal on mount in case the calendar day changed
  useEffect(() => {
    setStreak(loadStreak());
    setDailyGoal(loadDailyGoal());
  }, []);

  // Guard against navigating directly to runner games before daily goal is completed
  const isGoalCompleted = dailyGoal.completedToday >= dailyGoal.target;
  useEffect(() => {
    if ((currentScreen === 'game_subway' || currentScreen === 'game_temple') && !isGoalCompleted) {
      setCurrentScreen('home');
    }
  }, [currentScreen, isGoalCompleted]);

  // Persistence for completed chapters and best scores in localStorage
  const [completedChaptersMap, setCompletedChaptersMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('skv_completed_chapters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [chapterScores, setChapterScores] = useState<
    Record<string, { score: number; total: number; percentage: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('skv_chapter_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sound toggle handler
  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  // Navigation handlers
  const handleStartFromHome = () => {
    setCurrentScreen('subjects');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    if (subject.branches && subject.branches.length > 0) {
      setSelectedBranch(null);
      setCurrentScreen('branches');
    } else {
      setSelectedBranch(null);
      setCurrentScreen('chapters');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setCurrentScreen('chapters');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleFinishQuiz = (quizResults: QuizResultData) => {
    setResults(quizResults);

    // Record daily streak
    const { streak: updatedStreak, streakIncreased: increased } = recordQuizCompletion();
    setStreak(updatedStreak);
    setStreakIncreased(increased);

    // Record daily learning goal progress
    const { goal: updatedGoal } = incrementDailyGoalProgress();
    setDailyGoal(updatedGoal);

    // Record weekly activity completion for Recharts
    recordActivityQuiz();

    if (selectedChapter) {
      // Record completed chapter
      const newCompleted = { ...completedChaptersMap, [selectedChapter.id]: true };
      setCompletedChaptersMap(newCompleted);

      // Record best score
      const existing = chapterScores[selectedChapter.id];
      const newScore = (!existing || quizResults.score > existing.score)
        ? { score: quizResults.score, total: quizResults.total, percentage: quizResults.percentage }
        : existing;

      const newScores = { ...chapterScores, [selectedChapter.id]: newScore };
      setChapterScores(newScores);

      try {
        localStorage.setItem('skv_completed_chapters', JSON.stringify(newCompleted));
        localStorage.setItem('skv_chapter_scores', JSON.stringify(newScores));
      } catch {
        // ignore localStorage errors
      }
    }

    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateGoalTarget = (target: number) => {
    const updated = setDailyGoalTarget(target);
    setDailyGoal(updated);
  };

  const handleRetryQuiz = () => {
    if (selectedChapter) {
      setCurrentScreen('quiz');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleBackToChapters = () => {
    setCurrentScreen('chapters');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleChooseSubject = () => {
    setSelectedChapter(null);
    setSelectedBranch(null);
    setCurrentScreen('subjects');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoHome = () => {
    setSelectedSubject(null);
    setSelectedBranch(null);
    setSelectedChapter(null);
    setResults(null);
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const completedCount = Object.keys(completedChaptersMap).length;

  const badges = evaluateBadges({
    completedChaptersMap,
    chapterScores,
    streak,
    dailyGoal,
    subjects: SUBJECTS
  });
  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center sm:py-6 sm:px-4">
      {/* Phone canvas frame: full screen on mobile, elegant centered mobile container on desktop */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-white sm:rounded-[36px] sm:shadow-2xl sm:shadow-slate-300/60 border-x sm:border border-slate-200/90 overflow-hidden flex flex-col relative">
        {currentScreen === 'home' && (
          <HomeScreen
            onStart={handleStartFromHome}
            subjects={SUBJECTS}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            completedQuizzesCount={completedCount}
            streak={streak}
            dailyGoal={dailyGoal}
            onUpdateGoalTarget={handleUpdateGoalTarget}
            onOpenAchievements={() => {
              setCurrentScreen('achievements');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            unlockedBadgesCount={unlockedBadgesCount}
            onOpenGamesHub={() => {
              setCurrentScreen('games');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onPlaySubwaySurfers={() => {
              setCurrentScreen('game_subway');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onPlayTempleRun={() => {
              setCurrentScreen('game_temple');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        )}

        {currentScreen === 'achievements' && (
          <AchievementsScreen
            badges={badges}
            onBack={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentScreen === 'subjects' && (
          <SubjectListScreen
            subjects={SUBJECTS}
            onSelectSubject={handleSelectSubject}
            onBack={handleGoHome}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            completedChaptersMap={completedChaptersMap}
          />
        )}

        {currentScreen === 'branches' && selectedSubject && selectedSubject.branches && (
          <BranchListScreen
            subject={selectedSubject}
            branches={selectedSubject.branches}
            onSelectBranch={handleSelectBranch}
            onBack={() => {
              setSelectedBranch(null);
              setCurrentScreen('subjects');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            completedChaptersMap={completedChaptersMap}
          />
        )}

        {currentScreen === 'chapters' && selectedSubject && (
          <ChapterListScreen
            subject={selectedSubject}
            selectedBranch={selectedBranch}
            onSelectBranch={(branch) => {
              setSelectedBranch(branch);
            }}
            onSelectChapter={handleSelectChapter}
            onBack={() => {
              if (selectedSubject.branches && selectedSubject.branches.length > 0) {
                setSelectedBranch(null);
                setCurrentScreen('branches');
              } else {
                setCurrentScreen('subjects');
              }
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            chapterScores={chapterScores}
          />
        )}

        {currentScreen === 'quiz' && selectedSubject && selectedChapter && (
          <QuizScreen
            subject={selectedSubject}
            chapter={selectedChapter}
            onFinishQuiz={handleFinishQuiz}
            onExitQuiz={() => setCurrentScreen('chapters')}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentScreen === 'results' && selectedSubject && selectedChapter && results && (
          <ResultScreen
            subject={selectedSubject}
            chapter={selectedChapter}
            results={results}
            streak={streak}
            streakIncreased={streakIncreased}
            dailyGoal={dailyGoal}
            onRetry={handleRetryQuiz}
            onBackToChapters={handleBackToChapters}
            onChooseSubject={handleChooseSubject}
            onGoHome={handleGoHome}
            onPlayGames={() => {
              setCurrentScreen('games');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        )}

        {currentScreen === 'games' && (
          <GamesHubScreen
            onBack={handleGoHome}
            dailyGoal={dailyGoal}
            onStartQuiz={handleStartFromHome}
            onPlaySubwaySurfers={() => {
              if (dailyGoal.completedToday >= dailyGoal.target) {
                setCurrentScreen('game_subway');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
            onPlayTempleRun={() => {
              if (dailyGoal.completedToday >= dailyGoal.target) {
                setCurrentScreen('game_temple');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentScreen === 'game_subway' && (
          <SubwaySurfersGame
            onBack={() => {
              setCurrentScreen('games');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentScreen === 'game_temple' && (
          <TempleRunGame
            onBack={() => {
              setCurrentScreen('games');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </div>

      {/* Global Offline Status Indicator Toast */}
      <OfflineIndicator />
    </div>
  );
}
