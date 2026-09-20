// Badges & Achievements Collection System for Arrow Go

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  target: number;
  current: number;
  unlocked: boolean;
  category: 'progress' | 'mastery' | 'streak' | 'perfection';
}

export interface PlayerStats {
  completedCount: number;
  totalStars: number;
  currentStreak: number;
  maxStreak: number;
  perfectClears: number; // Levels cleared with 3 lives remaining
  highestLevel: number;
}

export function computeCollectionBadges(stats: PlayerStats): Badge[] {
  const { completedCount, totalStars, currentStreak, perfectClears, highestLevel } = stats;

  return [
    {
      id: 'first_flight',
      name: 'First Flight',
      description: 'Clear your very first puzzle level.',
      icon: '🚀',
      tier: 'bronze',
      target: 1,
      current: Math.min(1, completedCount),
      unlocked: completedCount >= 1,
      category: 'progress',
    },
    {
      id: 'sharp_shooter',
      name: 'Sharp Shooter',
      description: 'Solve 10 puzzle levels successfully.',
      icon: '🎯',
      tier: 'bronze',
      target: 10,
      current: Math.min(10, completedCount),
      unlocked: completedCount >= 10,
      category: 'progress',
    },
    {
      id: 'pathfinder',
      name: 'Pathfinder',
      description: 'Reach and solve 50 puzzle levels.',
      icon: '🧭',
      tier: 'silver',
      target: 50,
      current: Math.min(50, completedCount),
      unlocked: completedCount >= 50,
      category: 'progress',
    },
    {
      id: 'centurion',
      name: 'Centurion',
      description: 'Conquer 100 maze puzzle levels.',
      icon: '🏛️',
      tier: 'silver',
      target: 100,
      current: Math.min(100, completedCount),
      unlocked: completedCount >= 100,
      category: 'progress',
    },
    {
      id: 'flawless_mind',
      name: 'Flawless Mind',
      description: 'Earn a 3-star rating on 25 levels.',
      icon: '⭐',
      tier: 'silver',
      target: 25,
      current: Math.min(25, Math.floor(totalStars / 3)),
      unlocked: totalStars >= 75,
      category: 'mastery',
    },
    {
      id: 'untouchable',
      name: 'Untouchable',
      description: 'Complete 10 levels with all 3 hearts intact.',
      icon: '🛡️',
      tier: 'silver',
      target: 10,
      current: Math.min(10, perfectClears),
      unlocked: perfectClears >= 10,
      category: 'perfection',
    },
    {
      id: 'streak_starter',
      name: 'Flame Starter',
      description: 'Maintain a 3-day daily streak.',
      icon: '🔥',
      tier: 'bronze',
      target: 3,
      current: Math.min(3, currentStreak),
      unlocked: currentStreak >= 3,
      category: 'streak',
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      description: 'Reach an unbroken 7-day daily streak.',
      icon: '⚡',
      tier: 'gold',
      target: 7,
      current: Math.min(7, currentStreak),
      unlocked: currentStreak >= 7,
      category: 'streak',
    },
    {
      id: 'half_thousand',
      name: 'Maze Maestro',
      description: 'Clear 500 hand-crafted puzzles.',
      icon: '👑',
      tier: 'gold',
      target: 500,
      current: Math.min(500, completedCount),
      unlocked: completedCount >= 500,
      category: 'progress',
    },
    {
      id: 'grandmaster',
      name: 'Grandmaster',
      description: 'Conquer 1,000 levels & unlock Grandmaster tier.',
      icon: '🔮',
      tier: 'gold',
      target: 1000,
      current: Math.min(1000, completedCount),
      unlocked: completedCount >= 1000,
      category: 'mastery',
    },
    {
      id: 'legend_tier',
      name: 'Living Legend',
      description: 'Reach Level 2,001 (Legendary Tier).',
      icon: '🌟',
      tier: 'diamond',
      target: 2001,
      current: Math.min(2001, highestLevel),
      unlocked: highestLevel >= 2001,
      category: 'mastery',
    },
    {
      id: 'arrow_god',
      name: 'Arrow Deity',
      description: 'Clear all 3,000 levels of Arrow Go!',
      icon: '🏆',
      tier: 'diamond',
      target: 3000,
      current: Math.min(3000, completedCount),
      unlocked: completedCount >= 3000,
      category: 'progress',
    },
  ];
}
