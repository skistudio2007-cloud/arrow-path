// Daily Streak Management & Tracking for Arrow Go

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  history: string[]; // List of unique ISO date strings played
}

const STREAK_KEY = 'arrowgo_streak_data';

function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return {
    currentStreak: 1,
    maxStreak: 1,
    lastPlayedDate: getTodayDateStr(),
    history: [getTodayDateStr()],
  };
}

export function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage issues
  }
}

/**
 * Checks and advances the streak when the user plays today.
 * Returns the updated streak data and a boolean indicating if a new streak day was recorded.
 */
export function recordDailyActivity(): { data: StreakData; isNewDay: boolean } {
  const current = loadStreakData();
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();

  if (current.lastPlayedDate === today) {
    // Already recorded today
    return { data: current, isNewDay: false };
  }

  let nextStreak = 1;
  if (current.lastPlayedDate === yesterday) {
    // Consecutive day
    nextStreak = current.currentStreak + 1;
  } else {
    // Missed at least one day, reset to 1
    nextStreak = 1;
  }

  const updatedHistory = Array.from(new Set([...current.history, today])).slice(-30);
  const updatedData: StreakData = {
    currentStreak: nextStreak,
    maxStreak: Math.max(current.maxStreak, nextStreak),
    lastPlayedDate: today,
    history: updatedHistory,
  };

  saveStreakData(updatedData);
  return { data: updatedData, isNewDay: true };
}

/**
 * Returns a 7-day window representation of the streak for calendar rendering.
 */
export function getStreakWeekStatus(streakData: StreakData): { dayName: string; dayNumber: number; isCompleted: boolean; isToday: boolean }[] {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const todayStr = getTodayDateStr();
  const playedSet = new Set(streakData.history);

  const result = [];
  // Show 7 days ending today or centered on this week
  for (let i = 6; i >= 0; i--) {
    const target = new Date();
    target.setDate(today.getDate() - i);
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    result.push({
      dayName: daysOfWeek[target.getDay()],
      dayNumber: target.getDate(),
      isCompleted: playedSet.has(dateStr),
      isToday: dateStr === todayStr,
    });
  }

  return result;
}
