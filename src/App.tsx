import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { LayoutGrid, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Board, SinkingDotEvent } from './components/Board';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CollectionScreen } from './components/CollectionScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { RewardedAdModal, RewardType } from './components/RewardedAdModal';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { shouldTriggerInterstitial } from './utils/admob';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DailyStreakModal } from './components/DailyStreakModal';
import { SplashScreen } from './components/SplashScreen';
import { LeaguesModal } from './components/LeaguesModal';
import { GameSettings } from './components/SettingsModal';
import { LevelData, MazeArrow } from './types';
import { soundManager } from './utils/audio';
import { LanguageCode, resolveLanguageCode, t } from './utils/translations';
import {
  TOTAL_LEVELS,
  getLevelById,
  checkArrowEscape,
  getSolvableArrows,
  THEMES,
  DIR_VECTORS,
} from './utils/levels';
import {
  StreakData,
  loadStreakData,
  recordDailyActivity,
  saveStreakData,
} from './utils/streak';
import {
  PlayerStats,
  computeCollectionBadges,
} from './utils/collection';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  showTrajectory: true,
  darkMode: false,
  themeOverride: null,
};

export default function App() {
  // Screen & Navigation States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<'tabs' | 'game'>('tabs');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const [completedLevels, setCompletedLevels] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('arrowmaze_completed_levels');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arrowmaze_current_level_id');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= TOTAL_LEVELS) return parsed;
      }
    } catch {
      // Fallback
    }
    return 1;
  });

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('arrowgo_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Language State
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('arrowgo_language');
      return resolveLanguageCode(saved);
    } catch {
      return 'en';
    }
  });

  const handleSelectLanguage = useCallback((lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('arrowgo_language', lang);
    } catch {
      // Ignore
    }
  }, []);

  // Daily Streak State
  const [streakData, setStreakData] = useState<StreakData>(() => loadStreakData());

  // Record daily activity once on app launch
  useEffect(() => {
    const res = recordDailyActivity();
    setStreakData(res.data);
  }, []);

  // Perfect Clears State (clearing a level with 3 lives intact)
  const [perfectClears, setPerfectClears] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arrowgo_perfect_clears');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [currentLevel, setCurrentLevel] = useState<LevelData>(() => {
    let id = 1;
    try {
      const saved = localStorage.getItem('arrowmaze_current_level_id');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= TOTAL_LEVELS) id = parsed;
      }
    } catch {
      // Fallback
    }
    return getLevelById(id);
  });
  const [activeArrows, setActiveArrows] = useState<MazeArrow[]>(() => [...currentLevel.arrows]);
  const [lives, setLives] = useState<number>(3);
  const maxLives = 3;
  const [moves, setMoves] = useState<number>(0);
  const movesRef = useRef<number>(0);
  const [history, setHistory] = useState<{ arrows: MazeArrow[]; lives: number }[]>([]);
  const [flyingArrowIds, setFlyingArrowIds] = useState<Set<string>>(new Set());
  const [shakingArrowId, setShakingArrowId] = useState<string | null>(null);
  const [blockedTargetId, setBlockedTargetId] = useState<string | null>(null);
  const [hintArrowId, setHintArrowId] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showWinningAnimation, setShowWinningAnimation] = useState<boolean>(false);
  const winningAnimTimeoutRef = useRef<number | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.enabled);
  const [isLoadingLevel, setIsLoadingLevel] = useState<boolean>(false);

  // Modals & In-Game Features
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isStreakOpen, setIsStreakOpen] = useState<boolean>(false);
  const [isLeaguesOpen, setIsLeaguesOpen] = useState<boolean>(false);

  // Dynamic In-Game Combo Tracking
  const [comboCount, setComboCount] = useState<number>(0);
  const lastEscapeTimeRef = useRef<number>(0);
  const comboTimerRef = useRef<number | null>(null);

  // 25%, 50%, 75% Round Shape Smiley Emoji Milestones
  const [activeMilestone, setActiveMilestone] = useState<{
    percent: 25 | 50 | 75;
    emoji: string;
    gradient: string;
    glow: string;
  } | null>(null);
  const [achievedMilestones, setAchievedMilestones] = useState<Set<number>>(new Set());
  const milestoneTimeoutRef = useRef<number | null>(null);

  // Tactile Sinking Grid Dots when arrow leaves
  const [sinkingEvents, setSinkingEvents] = useState<SinkingDotEvent[]>([]);

  // Hint Banking & Rewarded Video Ads
  const [hintsCount, setHintsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('arrowgo_hints_count');
      return saved !== null ? Math.max(0, parseInt(saved, 10)) : 3;
    } catch {
      return 3;
    }
  });
  const [activeAdReward, setActiveAdReward] = useState<RewardType | null>(null);
  const [activeInterstitialLevel, setActiveInterstitialLevel] = useState<number | null>(null);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  // Sync sound manager enabled state with settings
  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('arrowgo_settings', JSON.stringify(newSettings));
    } catch {
      // Ignore
    }
    soundManager.enabled = newSettings.soundEnabled;
    setSoundEnabled(newSettings.soundEnabled);
  }, []);

  // Initialize sound manager from settings
  useEffect(() => {
    soundManager.enabled = settings.soundEnabled;
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Dark mode effect on root document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Compute player stats for Collection / Records
  const playerStats: PlayerStats = useMemo(() => {
    let completedCount = 0;
    let totalStars = 0;
    let highestLevel = currentLevelId;

    for (const key of Object.keys(completedLevels)) {
      completedCount++;
      const val = completedLevels[key];
      if (typeof val === 'number') totalStars += val;
      const numKey = Number(key);
      if (numKey > highestLevel) highestLevel = numKey;
    }

    return {
      completedCount,
      totalStars,
      currentStreak: streakData.currentStreak,
      maxStreak: streakData.maxStreak,
      perfectClears,
      highestLevel,
    };
  }, [completedLevels, currentLevelId, streakData, perfectClears]);

  // Reset all progress
  const handleResetProgress = useCallback(() => {
    try {
      localStorage.removeItem('arrowmaze_completed_levels');
      localStorage.setItem('arrowmaze_current_level_id', '1');
      localStorage.removeItem('arrowgo_perfect_clears');
    } catch {
      // Ignore
    }
    setCompletedLevels({});
    setCurrentLevelId(1);
    setPerfectClears(0);
    const lvl1 = getLevelById(1);
    setCurrentLevel(lvl1);
    setActiveArrows([...lvl1.arrows]);
    setLives(3);
    setMoves(0);
    movesRef.current = 0;
    setHistory([]);
    setFlyingArrowIds(new Set());
    setIsVictory(false);
    setIsGameOver(false);
    setCurrentScreen('tabs');
    setActiveTab('home');
  }, []);

  // Initialize or load a level
  const triggerMilestone = useCallback((percent: 25 | 50 | 75) => {
    setAchievedMilestones((prev) => {
      if (prev.has(percent)) return prev;
      const next = new Set(prev);
      next.add(percent);

      const milestoneConfig = {
        25: {
          percent: 25 as const,
          emoji: '😊',
          gradient: 'from-amber-100 via-yellow-200 to-amber-300 border-amber-300/90',
          glow: 'rgba(245, 158, 11, 0.45)',
        },
        50: {
          percent: 50 as const,
          emoji: '😄',
          gradient: 'from-orange-100 via-amber-200 to-orange-400 border-orange-300/90',
          glow: 'rgba(249, 115, 22, 0.5)',
        },
        75: {
          percent: 75 as const,
          emoji: '🥳',
          gradient: 'from-pink-100 via-rose-200 to-amber-300 border-rose-300/90',
          glow: 'rgba(236, 72, 153, 0.5)',
        },
      }[percent];

      setActiveMilestone(milestoneConfig);

      // Celebratory micro-confetti around round smiley
      try {
        confetti({
          particleCount: 18,
          spread: 60,
          origin: { y: 0.26 },
          colors:
            percent === 25
              ? ['#f59e0b', '#fbbf24', '#fcd34d']
              : percent === 50
              ? ['#f97316', '#fb923c', '#fdba74']
              : ['#ec4899', '#f43f5e', '#a855f7'],
          disableForReducedMotion: true,
        });
      } catch {
        // Ignore
      }

      if (milestoneTimeoutRef.current) {
        clearTimeout(milestoneTimeoutRef.current);
      }
      milestoneTimeoutRef.current = window.setTimeout(() => {
        setActiveMilestone(null);
      }, 1600);

      return next;
    });
  }, []);

  // Initialize or load a level
  const loadLevel = useCallback((level: LevelData, playSound = false) => {
    setCurrentLevel(level);
    setActiveArrows([...level.arrows]);
    setLives(3);
    setMoves(0);
    movesRef.current = 0;
    setHistory([]);
    setFlyingArrowIds(new Set());
    setShakingArrowId(null);
    setBlockedTargetId(null);
    setHintArrowId(null);
    setIsVictory(false);
    setShowWinningAnimation(false);
    if (winningAnimTimeoutRef.current) {
      clearTimeout(winningAnimTimeoutRef.current);
      winningAnimTimeoutRef.current = null;
    }
    setIsGameOver(false);
    setAchievedMilestones(new Set());
    setActiveMilestone(null);
    if (milestoneTimeoutRef.current) {
      clearTimeout(milestoneTimeoutRef.current);
      milestoneTimeoutRef.current = null;
    }
    if (playSound) {
      soundManager.playArrange();
    }
  }, []);

  // When currentLevelId changes in 3000 level campaign
  useEffect(() => {
    if (currentLevel.id === currentLevelId) {
      return;
    }
    const targetLevel = getLevelById(currentLevelId);
    loadLevel(targetLevel, false);
    try {
      localStorage.setItem('arrowmaze_current_level_id', String(targetLevel.id));
    } catch {
      // Ignore
    }
  }, [currentLevelId, currentLevel.id, loadLevel]);

  // Background Preloader: Preloads next level & upcoming Hard Level in idle time for instant 0ms transitions!
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      if (currentLevelId < TOTAL_LEVELS) {
        // Preload next level
        getLevelById(currentLevelId + 1);
        // Preload milestone hard levels (15, 30, 45, etc.) if close
        const nextHardLevel = Math.ceil((currentLevelId + 1) / 15) * 15;
        if (nextHardLevel <= TOTAL_LEVELS && nextHardLevel - currentLevelId <= 3) {
          getLevelById(nextHardLevel);
        }
      }
    }, 800);
    return () => clearTimeout(idleTimer);
  }, [currentLevelId]);

  // Handle arrow click/tap
  const handleArrowClick = (arrow: MazeArrow) => {
    if (isVictory || isGameOver || flyingArrowIds.has(arrow.id)) return;

    // Filter out arrows that are currently in flight so they don't block subsequent moves
    const nonFlyingArrows = activeArrows.filter((a) => !flyingArrowIds.has(a.id));

    const { canEscape, blockedBy } = checkArrowEscape(
      arrow,
      nonFlyingArrows,
      currentLevel.rows,
      currentLevel.cols
    );

    if (!canEscape) {
      // Collision / Blocked - play muted mechanical key bottom-out sound
      setComboCount(0);
      soundManager.playKeyboardSound(true);
      if (settings.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      setShakingArrowId(arrow.id);
      setBlockedTargetId(blockedBy ? blockedBy.id : null);

      // Deduct a heart
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => setIsGameOver(true), 350);
        }
        return Math.max(0, next);
      });

      setTimeout(() => {
        setShakingArrowId(null);
        setBlockedTargetId(null);
      }, 350);
      return;
    }

    // Success: Pure crisp premium mechanical keyboard click sound!
    soundManager.playKeyboardSound(false);
    if (settings.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    const now = Date.now();
    const timeSinceLast = now - lastEscapeTimeRef.current;
    lastEscapeTimeRef.current = now;

    let nextCombo = 1;
    if (timeSinceLast < 1800) {
      nextCombo = comboCount + 1;
    }
    setComboCount(nextCombo);

    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
    }
    comboTimerRef.current = window.setTimeout(() => {
      setComboCount(0);
    }, 1800);

    setHistory((prev) => [
      ...prev,
      { arrows: activeArrows.filter((a) => !flyingArrowIds.has(a.id)), lives },
    ]);
    setMoves((prev) => {
      const next = prev + 1;
      movesRef.current = next;
      return next;
    });
    setHintArrowId(null);

    // Trigger flight animation
    setFlyingArrowIds((prev) => new Set(prev).add(arrow.id));

    // Arrow jaise hi niklega, uske neeche ke dots sink hokar phir same size me aa jayenge!
    const sinkEventId = `sink-${arrow.id}-${Date.now()}`;
    const sinkEvent: SinkingDotEvent = {
      id: sinkEventId,
      points: [...arrow.points],
    };
    setSinkingEvents((prev) => [...prev, sinkEvent]);
    const cleanupMs = arrow.points.length * 60 + 550;
    setTimeout(() => {
      setSinkingEvents((prev) => prev.filter((e) => e.id !== sinkEventId));
    }, cleanupMs);

    setTimeout(() => {
      let isCompleted = false;
      // Remove escaped arrow from active grid
      setActiveArrows((prev) => {
        const next = prev.filter((a) => a.id !== arrow.id);
        if (next.length === 0) {
          isCompleted = true;
        } else {
          // Check 25%, 50%, 75% progress milestones with emojis
          const total = currentLevel.arrows.length;
          const cleared = total - next.length;
          if (total >= 4 && next.length > 0) {
            if (cleared >= Math.ceil(total * 0.75)) {
              triggerMilestone(75);
            } else if (cleared >= Math.ceil(total * 0.50)) {
              triggerMilestone(50);
            } else if (cleared >= Math.ceil(total * 0.25)) {
              triggerMilestone(25);
            }
          }
        }
        return next;
      });

      setFlyingArrowIds((prev) => {
        const next = new Set(prev);
        next.delete(arrow.id);
        return next;
      });

      if (isCompleted) {
        handleLevelComplete(movesRef.current);
      }
    }, 480);
  };

  const proceedToNextLevel = useCallback(() => {
    soundManager.playTap();
    setIsVictory(false);
    setShowWinningAnimation(false);
    setActiveInterstitialLevel(null);
    if (currentLevelId < TOTAL_LEVELS) {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
      const nextLevel = getLevelById(nextId);
      loadLevel(nextLevel, true);
      try {
        localStorage.setItem('arrowmaze_current_level_id', String(nextId));
      } catch {
        // Ignore
      }
    } else {
      setCurrentScreen('tabs');
      setActiveTab('home');
    }
  }, [currentLevelId, loadLevel]);

  const handleNextLevel = useCallback(() => {
    try {
      const isAdRemoved = localStorage.getItem('arrowgo_remove_ads') === 'true';
      if (!isAdRemoved && shouldTriggerInterstitial(currentLevelId)) {
        setIsVictory(false);
        setActiveInterstitialLevel(currentLevelId);
        return;
      }
    } catch {
      // Ignore
    }
    proceedToNextLevel();
  }, [currentLevelId, proceedToNextLevel]);

  const handleLevelComplete = (finalMoves: number) => {
    soundManager.playSuccess();

    // Trigger polished winning animation on the completed level
    setShowWinningAnimation(true);
    try {
      confetti({
        particleCount: 26,
        angle: 60,
        spread: 45,
        origin: { x: 0.08, y: 0.65 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 26,
        angle: 120,
        spread: 45,
        origin: { x: 0.92, y: 0.65 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore
    }

    if (winningAnimTimeoutRef.current) {
      clearTimeout(winningAnimTimeoutRef.current);
    }

    // After animation finishes (~750ms), continue existing level-complete flow
    winningAnimTimeoutRef.current = window.setTimeout(() => {
      setShowWinningAnimation(false);
      setIsVictory(true);
    }, 750);

    // Check perfect clear (3 lives intact)
    if (lives === 3) {
      setPerfectClears((prev) => {
        const updated = prev + 1;
        try {
          localStorage.setItem('arrowgo_perfect_clears', String(updated));
        } catch {
          // Ignore
        }
        return updated;
      });
    }

    // Update streak activity
    const streakRes = recordDailyActivity();
    setStreakData(streakRes.data);
    saveStreakData(streakRes.data);

    const minMoves = currentLevel.minMoves || currentLevel.arrows.length;
    let stars = 1;
    if (finalMoves <= minMoves) {
      stars = 3;
    } else if (finalMoves <= Math.ceil(minMoves * 1.35)) {
      stars = 2;
    }

    setCompletedLevels((prev) => {
      const prevStars = prev[currentLevel.id] || 0;
      const updated = {
        ...prev,
        [currentLevel.id]: Math.max(prevStars, stars),
      };
      try {
        localStorage.setItem('arrowmaze_completed_levels', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleUndo = () => {
    if (history.length === 0 || isVictory || isGameOver || flyingArrowIds.size > 0) return;
    soundManager.playTap();
    const previous = history[history.length - 1];
    setActiveArrows(previous.arrows);
    setLives(previous.lives);
    setHistory((prev) => prev.slice(0, -1));
    setMoves((prev) => {
      const next = Math.max(0, prev - 1);
      movesRef.current = next;
      return next;
    });
    setHintArrowId(null);
    const restoredCleared = currentLevel.arrows.length - previous.arrows.length;
    setAchievedMilestones((prev) => {
      const next = new Set(prev);
      if (restoredCleared < Math.ceil(currentLevel.arrows.length * 0.75)) next.delete(75);
      if (restoredCleared < Math.ceil(currentLevel.arrows.length * 0.50)) next.delete(50);
      if (restoredCleared < Math.ceil(currentLevel.arrows.length * 0.25)) next.delete(25);
      return next;
    });
  };

  const handleRestart = () => {
    soundManager.playTap();
    setIsVictory(false);
    loadLevel(currentLevel, true);
  };

  const handleRevive = () => {
    soundManager.playTap();
    setLives(3);
    setIsGameOver(false);
  };

  const handlePreviousLevel = () => {
    soundManager.playTap();
    setIsVictory(false);
    if (currentLevelId > 1) {
      const prevId = currentLevelId - 1;
      setCurrentLevelId(prevId);
      const prevLevel = getLevelById(prevId);
      loadLevel(prevLevel, false);
      try {
        localStorage.setItem('arrowmaze_current_level_id', String(prevId));
      } catch {
        // Ignore
      }
    } else {
      handleRestart();
    }
  };

  const handleHint = () => {
    if (hintsCount <= 0) {
      setActiveAdReward('hint');
      return;
    }

    soundManager.playHint();
    setHintsCount((prev) => {
      const next = Math.max(0, prev - 1);
      try {
        localStorage.setItem('arrowgo_hints_count', String(next));
      } catch {
        // Ignore
      }
      return next;
    });

    const staticArrows = activeArrows.filter((a) => !flyingArrowIds.has(a.id));
    const escapable = getSolvableArrows(staticArrows, currentLevel.rows, currentLevel.cols);
    if (escapable.length > 0) {
      setHintArrowId(escapable[0].id);
      setTimeout(() => {
        setHintArrowId((curr) => (curr === escapable[0].id ? null : curr));
      }, 3500);
    }
  };

  const handleWatchAdForLife = () => {
    try {
      if (localStorage.getItem('arrowgo_remove_ads') === 'true') {
        handleRewardGranted('life');
        return;
      }
    } catch {}
    setActiveAdReward('life');
  };

  const handleWatchAdForHint = () => {
    try {
      if (localStorage.getItem('arrowgo_remove_ads') === 'true') {
        handleRewardGranted('hint');
        return;
      }
    } catch {}
    setActiveAdReward('hint');
  };

  const handleRewardGranted = (type: RewardType) => {
    if (type === 'life') {
      setLives((prev) => Math.max(1, prev + 1));
      setIsGameOver(false);
      soundManager.playReward();
      setRewardToast('❤️ +1 Extra Life Granted!');
      setTimeout(() => setRewardToast(null), 3000);
    } else if (type === 'hint') {
      setHintsCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('arrowgo_hints_count', String(next));
        } catch {
          // Ignore
        }
        return next;
      });
      soundManager.playReward();
      setRewardToast('💡 +1 Free Hint Granted!');
      setTimeout(() => setRewardToast(null), 3000);

      // Automatically reveal a solvable arrow!
      const staticArrows = activeArrows.filter((a) => !flyingArrowIds.has(a.id));
      const escapable = getSolvableArrows(staticArrows, currentLevel.rows, currentLevel.cols);
      if (escapable.length > 0) {
        setHintArrowId(escapable[0].id);
        setTimeout(() => {
          setHintArrowId((curr) => (curr === escapable[0].id ? null : curr));
        }, 3500);
      }
    }
  };

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
    handleUpdateSettings({
      ...settings,
      soundEnabled: newState,
    });
  };

  const handlePlayLevel = (lvlId: number) => {
    soundManager.playTap();
    setIsVictory(false);
    if (currentLevelId !== lvlId || currentLevel.id !== lvlId) {
      setCurrentLevelId(lvlId);
      const targetLevel = getLevelById(lvlId);
      loadLevel(targetLevel, false);
    }
    setCurrentScreen('game');
  };

  // Determine active theme (overridden theme or current level's theme)
  const activeTheme = useMemo(() => {
    if (settings.themeOverride) {
      const matched = THEMES.find((t) => t.id === settings.themeOverride);
      if (matched) return matched;
    }
    return currentLevel.theme;
  }, [settings.themeOverride, currentLevel.theme]);

  const themeBg = activeTheme?.bgClass || 'bg-white';

  return (
    <div className="w-full h-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-[#edf1fa] flex flex-col items-center justify-start antialiased text-neutral-900 font-sans">
      {/* App Opening Animation (Splash Screen) */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {currentScreen === 'tabs' ? (
        /* MAIN TABS CONTAINER (Mobile app frame) */
        <div className="w-full max-w-md sm:max-w-lg min-h-screen min-h-[100dvh] h-[100dvh] mx-auto flex flex-col justify-between relative bg-[#edf1fa] overflow-hidden">
          {/* Active Tab Screen with AnimatePresence */}
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <HomeScreen
                key="tab-home"
                currentLevelId={currentLevelId}
                streakData={streakData}
                lang={currentLanguage}
                onPlayLevel={handlePlayLevel}
                onOpenStreak={() => setIsStreakOpen(true)}
                onOpenLeagues={() => {
                  soundManager.playTap();
                  setIsLeaguesOpen(true);
                }}
              />
            )}

            {activeTab === 'collection' && (
              <CollectionScreen key="tab-collection" stats={playerStats} lang={currentLanguage} />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                key="tab-settings"
                settings={settings}
                currentLanguage={currentLanguage}
                onSelectLanguage={handleSelectLanguage}
                onUpdateSettings={handleUpdateSettings}
                onResetProgress={handleResetProgress}
                onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
              />
            )}
          </AnimatePresence>

          {/* Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={activeTab}
            lang={currentLanguage}
            onSelectTab={(tab) => {
              soundManager.playTap();
              setActiveTab(tab);
            }}
          />
        </div>
      ) : (
        /* ACTIVE LEVEL GAMEPLAY SCREEN */
        <main
          className={`min-h-screen min-h-[100dvh] h-[100dvh] w-full max-w-md sm:max-w-lg mx-auto ${themeBg} text-black flex flex-col justify-between antialiased selection:bg-neutral-200 relative overflow-hidden transition-colors duration-500 shadow-xl`}
        >
          {/* Top Header */}
          <Header
            currentLevel={{
              ...currentLevel,
              theme: activeTheme,
            }}
            lives={lives}
            maxLives={maxLives}
            moves={moves}
            soundEnabled={soundEnabled}
            canUndo={history.length > 0}
            remainingArrowsCount={activeArrows.filter((a) => !flyingArrowIds.has(a.id)).length}
            comboCount={comboCount}
            hintsCount={hintsCount}
            lang={currentLanguage}
            onGoHome={() => setCurrentScreen('tabs')}
            onPreviousLevel={handlePreviousLevel}
            onRestartLevel={handleRestart}
            onToggleSound={handleToggleSound}
            onHint={handleHint}
            onWatchAdForHint={handleWatchAdForHint}
            onOpenSettings={() => {
              setCurrentScreen('tabs');
              setActiveTab('settings');
            }}
          />

          {/* Main Board Arena */}
          <section className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 w-full min-h-0 relative overflow-hidden">
            {/* Compact Round Shape Animated Smiley Emoji with % Display Below */}
            <AnimatePresence>
              {activeMilestone && (
                <motion.div
                  key={`milestone-smiley-${activeMilestone.percent}`}
                  initial={{ opacity: 0, scale: 0.3, y: 15 }}
                  animate={{
                    opacity: 1,
                    scale: [0.3, 1.15, 1],
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.4,
                    y: -15,
                    transition: { duration: 0.22 },
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute top-2 sm:top-3 z-50 pointer-events-none flex flex-col items-center justify-center select-none"
                >
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${activeMilestone.gradient} shadow-lg border-2 border-white/95 backdrop-blur-md relative`}
                    style={{
                      boxShadow: `0 6px 18px -2px ${activeMilestone.glow}, inset 0 2px 6px rgba(255,255,255,0.7)`,
                    }}
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.18, 1],
                      }}
                      transition={{ duration: 0.55, ease: 'easeInOut', repeat: Infinity }}
                      className="text-xl sm:text-2xl select-none filter drop-shadow-xs leading-none inline-block"
                    >
                      {activeMilestone.emoji}
                    </motion.span>
                  </div>
                  {/* 25%, 50%, 75% Percentage Display Below Emoji */}
                  <span className="mt-1 font-outfit font-black text-[10px] sm:text-[11px] tracking-wider text-neutral-800 bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-neutral-200/80 tabular-nums leading-none">
                    {activeMilestone.percent}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoadingLevel ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 animate-pulse">
                <div className="w-9 h-9 rounded-full border-3 border-neutral-200 border-t-neutral-800 animate-spin" />
                <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase">
                  {t(currentLanguage, 'loadingPuzzle')}
                </span>
              </div>
            ) : (
              <Board
                levelId={currentLevel.id}
                rows={currentLevel.rows}
                cols={currentLevel.cols}
                arrows={activeArrows}
                theme={activeTheme}
                flyingArrowIds={flyingArrowIds}
                shakingArrowId={shakingArrowId}
                blockedTargetId={blockedTargetId}
                hintArrowId={hintArrowId}
                sinkingEvents={sinkingEvents}
                showTrajectory={settings.showTrajectory}
                onArrowClick={handleArrowClick}
              />
            )}

            {/* Polished Winning Celebration Animation Overlay */}
            <AnimatePresence>
              {showWinningAnimation && (
                <motion.div
                  key="winning-celebration"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
                >
                  {/* Concentric expanding success burst rings */}
                  <motion.div
                    initial={{ scale: 0.35, opacity: 0.9 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute w-44 h-44 rounded-full border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  />
                  <motion.div
                    initial={{ scale: 0.25, opacity: 0.85 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.62, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute w-36 h-36 rounded-full border-2 border-amber-300/80 shadow-[0_0_18px_rgba(245,158,11,0.3)]"
                  />

                  {/* Soft ambient center glow */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [0.4, 1.15, 0.9], opacity: [0, 0.45, 0] }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-blue-400/25 via-emerald-300/25 to-amber-200/25 blur-2xl"
                  />

                  {/* Shimmering celebration sparkles floating upward */}
                  {[
                    { x: -55, y: -45, delay: 0.04, size: 20, char: '✨' },
                    { x: 58, y: -38, delay: 0.1, size: 18, char: '⭐' },
                    { x: -42, y: 38, delay: 0.06, size: 16, char: '✨' },
                    { x: 48, y: 42, delay: 0.14, size: 20, char: '✨' },
                    { x: 0, y: -62, delay: 0.02, size: 22, char: '🌟' },
                  ].map((sparkle, idx) => (
                    <motion.span
                      key={idx}
                      initial={{
                        opacity: 0,
                        scale: 0.2,
                        x: sparkle.x * 0.4,
                        y: sparkle.y * 0.4,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0.2, 1.15, 1, 0.3],
                        x: sparkle.x,
                        y: sparkle.y - 18,
                      }}
                      transition={{
                        duration: 0.68,
                        delay: sparkle.delay,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute select-none filter drop-shadow-md leading-none"
                      style={{ fontSize: sparkle.size }}
                    >
                      {sparkle.char}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Clean, Minimal Bottom Action Bar */}
          <footer className="w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between z-20 border-t border-neutral-100/80 bg-white/40 backdrop-blur-xs shrink-0">
            {/* Level Select */}
            <button
              type="button"
              id="btn-level-select"
              onClick={() => setIsLevelSelectOpen(true)}
              title="All 3,000 Levels"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 active:scale-95 transition-all text-xs font-semibold cursor-pointer border border-neutral-200/60"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-neutral-600 stroke-[2.2]" />
              <span>{t(currentLanguage, 'levels')}</span>
            </button>

            {/* Remaining Arrows Count */}
            <span className="text-xs font-semibold text-neutral-500 tabular-nums">
              {activeArrows.filter((a) => !flyingArrowIds.has(a.id)).length} {t(currentLanguage, 'arrowsLeft')}
            </span>

            {/* Undo */}
            <button
              type="button"
              id="btn-undo"
              onClick={handleUndo}
              disabled={history.length === 0 || flyingArrowIds.size > 0}
              title="Undo Move"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 active:scale-95 transition-all text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none cursor-pointer border border-neutral-200/60"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-600 stroke-[2.2]" />
              <span>{t(currentLanguage, 'undo')}</span>
            </button>
          </footer>

          {/* Gameplay Modals */}
          <VictoryModal
            isOpen={isVictory}
            level={currentLevel}
            moves={moves}
            hasNextLevel={currentLevelId < TOTAL_LEVELS}
            lang={currentLanguage}
            onNextLevel={handleNextLevel}
            onReplay={handleRestart}
            onGoHome={() => {
              setIsVictory(false);
              setCurrentScreen('tabs');
              setActiveTab('home');
            }}
          />

          <GameOverModal
            isOpen={isGameOver}
            lang={currentLanguage}
            onRestart={handleRestart}
            onWatchAdForLife={handleWatchAdForLife}
          />

          {/* Rewarded Video Ad Modal */}
          <RewardedAdModal
            isOpen={activeAdReward !== null}
            rewardType={activeAdReward || 'life'}
            onClose={() => setActiveAdReward(null)}
            onRewardGranted={handleRewardGranted}
          />

          {/* Interstitial Ad Modal for Level 15, 20, 25, 30... */}
          <InterstitialAdModal
            isOpen={activeInterstitialLevel !== null}
            levelNumber={activeInterstitialLevel || 15}
            onClose={() => {
              setActiveInterstitialLevel(null);
              proceedToNextLevel();
            }}
          />

          {/* Floating Reward Toast */}
          <AnimatePresence>
            {rewardToast && (
              <motion.div
                initial={{ opacity: 0, y: -24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.9 }}
                className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border border-neutral-700/80 pointer-events-none"
              >
                <span>{rewardToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Global Modals */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        currentLevelId={currentLevel.id}
        completedLevels={completedLevels}
        onSelectLevel={(lvl) => {
          handlePlayLevel(lvl.id);
          setIsLevelSelectOpen(false);
        }}
        onClose={() => setIsLevelSelectOpen(false)}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <DailyStreakModal
        isOpen={isStreakOpen}
        streakData={streakData}
        onClose={() => setIsStreakOpen(false)}
      />

      <LeaguesModal
        isOpen={isLeaguesOpen}
        onClose={() => setIsLeaguesOpen(false)}
        onPlay={() => {
          setIsLeaguesOpen(false);
          handlePlayLevel(currentLevelId);
        }}
        completedCount={Object.keys(completedLevels).length}
        totalStars={playerStats.totalStars}
      />
    </div>
  );
}
