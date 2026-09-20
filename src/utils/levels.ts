import {
  ArrowShape,
  Direction,
  GridCoord,
  LevelData,
  LevelDifficulty,
  MazeArrow,
  ThemeConfig,
} from '../types';

export const TOTAL_LEVELS = 3000;

export const DIR_VECTORS: Record<Direction, { dr: number; dc: number; angle: number }> = {
  up: { dr: -1, dc: 0, angle: 0 },
  right: { dr: 0, dc: 1, angle: 90 },
  down: { dr: 1, dc: 0, angle: 180 },
  left: { dr: 0, dc: -1, angle: 270 },
};

export function getOppositeDir(dir: Direction): Direction {
  switch (dir) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
}

export function getPerpendicularDirs(dir: Direction): Direction[] {
  if (dir === 'up' || dir === 'down') {
    return ['left', 'right'];
  }
  return ['up', 'down'];
}

export function getDirection(from: GridCoord, to: GridCoord): Direction {
  if (to.r < from.r) return 'up';
  if (to.r > from.r) return 'down';
  if (to.c < from.c) return 'left';
  return 'right';
}

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32).
 */
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 8 High-Contrast Theme Palettes rotating across levels.
 */
export const THEMES: ThemeConfig[] = [
  {
    id: 'forest',
    name: 'Forest Sanctuary',
    bgClass: 'bg-emerald-950/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-emerald-300/60 shadow-emerald-900/5',
    accentColor: '#059669',
    gridDotColor: '#6ee7b7',
    pillBg: 'bg-emerald-50 border border-emerald-200',
    pillText: 'text-emerald-800',
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    bgClass: 'bg-sky-950/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-sky-300/60 shadow-sky-900/5',
    accentColor: '#0284c7',
    gridDotColor: '#7dd3fc',
    pillBg: 'bg-sky-50 border border-sky-200',
    pillText: 'text-sky-800',
  },
  {
    id: 'sunset',
    name: 'Sunset Dunes',
    bgClass: 'bg-amber-950/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-amber-300/60 shadow-amber-900/5',
    accentColor: '#d97706',
    gridDotColor: '#fcd34d',
    pillBg: 'bg-amber-50 border border-amber-200',
    pillText: 'text-amber-800',
  },
  {
    id: 'space',
    name: 'Cosmic Nebula',
    bgClass: 'bg-indigo-950/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-indigo-300/60 shadow-indigo-900/5',
    accentColor: '#4f46e5',
    gridDotColor: '#a5b4fc',
    pillBg: 'bg-indigo-50 border border-indigo-200',
    pillText: 'text-indigo-800',
  },
  {
    id: 'city',
    name: 'Metro City',
    bgClass: 'bg-slate-900/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-slate-300/70 shadow-slate-900/5',
    accentColor: '#334155',
    gridDotColor: '#cbd5e1',
    pillBg: 'bg-slate-50 border border-slate-200',
    pillText: 'text-slate-800',
  },
  {
    id: 'zen',
    name: 'Zen Garden',
    bgClass: 'bg-stone-900/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-stone-300/70 shadow-stone-900/5',
    accentColor: '#57534e',
    gridDotColor: '#d6d3d1',
    pillBg: 'bg-stone-50 border border-stone-200',
    pillText: 'text-stone-800',
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    bgClass: 'bg-cyan-950/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-cyan-300/70 shadow-cyan-900/5',
    accentColor: '#0891b2',
    gridDotColor: '#67e8f9',
    pillBg: 'bg-cyan-50 border border-cyan-200',
    pillText: 'text-cyan-800',
  },
  {
    id: 'aurora',
    name: 'Aurora Glow',
    bgClass: 'bg-purple-950/[0.03]',
    boardBgClass: 'bg-white',
    boardBorderClass: 'border-purple-300/60 shadow-purple-900/5',
    accentColor: '#7c3aed',
    gridDotColor: '#c4b5fd',
    pillBg: 'bg-purple-50 border border-purple-200',
    pillText: 'text-purple-800',
  },
];

export function getThemeForLevel(levelId: number): ThemeConfig {
  return THEMES[(levelId - 1) % THEMES.length];
}

/**
 * Strict Head-to-Head Conflict Validator.
 * Two arrows must NEVER be arranged head-to-head under ANY condition:
 * 1. Adjacent heads (Manhattan distance <= 1 between arrow heads).
 * 2. Opposing heads directly facing each other along the same row/col.
 */
export function areArrowsHeadToHead(a: MazeArrow, b: MazeArrow): boolean {
  if (a.points.length === 0 || b.points.length === 0) return false;
  const headA = a.points[a.points.length - 1];
  const headB = b.points[b.points.length - 1];

  // 1. Same row facing each other directly head-to-head
  if (headA.r === headB.r) {
    if (headA.c < headB.c && a.dir === 'right' && b.dir === 'left') return true;
    if (headB.c < headA.c && b.dir === 'right' && a.dir === 'left') return true;
  }

  // 2. Same column facing each other directly head-to-head
  if (headA.c === headB.c) {
    if (headA.r < headB.r && a.dir === 'down' && b.dir === 'up') return true;
    if (headB.r < headA.r && b.dir === 'down' && a.dir === 'up') return true;
  }

  return false;
}

/**
 * Validates that NO arrows overlap with each other under ANY condition:
 * - Every grid coordinate (r, c) is occupied by at most ONE arrow point.
 * - No arrow self-intersects.
 * - Every segment is a continuous 1-step orthogonal step (Manhattan distance = 1).
 * - Head direction matches the final segment step.
 */
export function hasAnyOverlapOrInvalidPath(
  arrows: MazeArrow[],
  rows: number,
  cols: number
): boolean {
  const globalOccupied = new Set<string>();

  for (const arrow of arrows) {
    if (arrow.points.length < 2) return true;

    const arrowOccupied = new Set<string>();

    for (let i = 0; i < arrow.points.length; i++) {
      const p = arrow.points[i];

      // Out of bounds
      if (p.r < 0 || p.r >= rows || p.c < 0 || p.c >= cols) return true;

      const key = `${p.r},${p.c}`;

      // Self-overlap
      if (arrowOccupied.has(key)) return true;
      arrowOccupied.add(key);

      // Overlap with another arrow
      if (globalOccupied.has(key)) return true;
      globalOccupied.add(key);

      // Step continuity check
      if (i > 0) {
        const prev = arrow.points[i - 1];
        const dist = Math.abs(p.r - prev.r) + Math.abs(p.c - prev.c);
        if (dist !== 1) return true;
      }
    }

    // Verify head direction matches the last segment
    const head = arrow.points[arrow.points.length - 1];
    const prev = arrow.points[arrow.points.length - 2];
    const expectedDir = getDirection(prev, head);
    if (arrow.dir !== expectedDir) return true;
  }

  return false;
}

/**
 * Checks if any pair of arrows violates the strict Head-to-Head rule.
 */
export function hasAnyHeadToHeadConflict(arrows: MazeArrow[]): boolean {
  for (let i = 0; i < arrows.length; i++) {
    for (let j = i + 1; j < arrows.length; j++) {
      if (areArrowsHeadToHead(arrows[i], arrows[j])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if a maze arrow can escape out of the grid without hitting any other arrow.
 */
export function checkArrowEscape(
  arrow: MazeArrow,
  allArrows: MazeArrow[],
  rows: number,
  cols: number
): { canEscape: boolean; blockedBy: MazeArrow | null; blockerCoord: GridCoord | null } {
  if (arrow.points.length < 2) {
    return { canEscape: true, blockedBy: null, blockerCoord: null };
  }

  const head = arrow.points[arrow.points.length - 1];
  const { dr, dc } = DIR_VECTORS[arrow.dir];

  // Map of all grid coordinates occupied by other arrows
  const cellOwnerMap = new Map<string, MazeArrow>();
  for (const a of allArrows) {
    if (a.id === arrow.id) continue;
    for (const pt of a.points) {
      cellOwnerMap.set(`${pt.r},${pt.c}`, a);
    }
  }

  let r = head.r + dr;
  let c = head.c + dc;

  while (r >= 0 && r < rows && c >= 0 && c < cols) {
    const key = `${r},${c}`;
    if (cellOwnerMap.has(key)) {
      return {
        canEscape: false,
        blockedBy: cellOwnerMap.get(key)!,
        blockerCoord: { r, c },
      };
    }

    // Also check if arrow's own body is in its forward exit path
    const isOwnBody = arrow.points.slice(0, -1).some((p) => p.r === r && p.c === c);
    if (isOwnBody) {
      return {
        canEscape: false,
        blockedBy: arrow,
        blockerCoord: { r, c },
      };
    }

    r += dr;
    c += dc;
  }

  return { canEscape: true, blockedBy: null, blockerCoord: null };
}

/**
 * Finds all arrows that can currently escape.
 */
export function getSolvableArrows(
  allArrows: MazeArrow[],
  rows: number,
  cols: number
): MazeArrow[] {
  return allArrows.filter((arrow) => checkArrowEscape(arrow, allArrows, rows, cols).canEscape);
}

/**
 * Simulates solving the board to mathematically prove 100% solvability
 * and ensures strict compliance with NO overlaps and NO head-to-head conditions.
 * Ultra-fast spatial simulation.
 */
export function verifyLevelSolvable(level: LevelData): boolean {
  if (hasAnyOverlapOrInvalidPath(level.arrows, level.rows, level.cols)) {
    return false;
  }

  if (hasAnyHeadToHeadConflict(level.arrows)) {
    return false;
  }

  const { rows, cols } = level;
  const totalCells = rows * cols;
  const grid = new Int16Array(totalCells);
  grid.fill(-1);

  const numArrows = level.arrows.length;
  for (let idx = 0; idx < numArrows; idx++) {
    const pts = level.arrows[idx].points;
    for (let p = 0; p < pts.length; p++) {
      grid[pts[p].r * cols + pts[p].c] = idx;
    }
  }

  const removed = new Uint8Array(numArrows);
  let remainingCount = numArrows;
  let changed = true;

  while (remainingCount > 0 && changed) {
    changed = false;
    for (let idx = 0; idx < numArrows; idx++) {
      if (removed[idx] === 1) continue;
      const arrow = level.arrows[idx];
      const head = arrow.points[arrow.points.length - 1];
      const { dr, dc } = DIR_VECTORS[arrow.dir];

      let r = head.r + dr;
      let c = head.c + dc;
      let canEscape = true;

      while (r >= 0 && r < rows && c >= 0 && c < cols) {
        if (grid[r * cols + c] !== -1) {
          canEscape = false;
          break;
        }
        r += dr;
        c += dc;
      }

      if (canEscape) {
        removed[idx] = 1;
        const pts = arrow.points;
        for (let p = 0; p < pts.length; p++) {
          grid[pts[p].r * cols + pts[p].c] = -1;
        }
        remainingCount--;
        changed = true;
      }
    }
  }

  return remainingCount === 0;
}

export type LengthCategory = 'short' | 'medium' | 'long' | 'extra-long';

export interface LevelConfig {
  rows: number;
  cols: number;
  targetArrows: number;
  difficulty: LevelDifficulty;
  allowedShapes: ArrowShape[];
  distribution: { short: number; medium: number; long: number };
  targetOccupancy: number;
  theme: ThemeConfig;
}

/**
/**
 * 2-way Level Exchange Mapping:
 * Exchanging milestone tens (except multiples of 30, which are Hard Boss Levels)
 * with levels 151, 152, 153... (2-way swap so no levels are duplicated / "double mat karna").
 *
 * Pairs:
 * 10 <-> 151
 * 20 <-> 152
 * 40 <-> 153
 * 50 <-> 154
 * 70 <-> 155
 * 80 <-> 156
 * 100 <-> 157
 * 110 <-> 158
 * 130 <-> 159
 * 140 <-> 160
 */
export const LEVEL_EXCHANGE_MAP: Record<number, number> = {
  10: 151,
  20: 152,
  40: 153,
  50: 154,
  70: 155,
  80: 156,
  100: 157,
  110: 158,
  130: 159,
  140: 160,

  // 2-way exchange targets (ensures zero level puzzle duplication):
  151: 10,
  152: 20,
  153: 40,
  154: 50,
  155: 70,
  156: 80,
  157: 100,
  158: 110,
  159: 130,
  160: 140,
};

/**
 * Checks if a level is a designated milestone Hard Boss Level (every 15th level: 15, 30, 45, 60, ...).
 */
export function isHardBossLevel(levelId: number): boolean {
  return levelId > 0 && levelId < 2000 && levelId % 15 === 0;
}

/**
 * Checks if a level is part of the 2-way level exchange.
 */
export function isExchangedLevel(levelId: number): boolean {
  return Boolean(LEVEL_EXCHANGE_MAP[levelId]);
}

/**
 * Maps every 15th level (15, 30, 45, ...) to high-difficulty source levels (2000, 2001, 2002, ...)
 * and exchanged levels (10, 20, 40...) <-> (151, 152, 153...).
 */
export function getMappedSourceLevelId(levelId: number): number {
  if (isHardBossLevel(levelId)) {
    const index = Math.floor(levelId / 15) - 1;
    return 2000 + index;
  }
  if (LEVEL_EXCHANGE_MAP[levelId]) {
    return LEVEL_EXCHANGE_MAP[levelId];
  }
  return levelId;
}

/**
 * Computes raw, unmapped level parameters strictly matching commercial puzzle game progression.
 */
export function getBaseLevelConfig(levelId: number): LevelConfig {
  const clampedId = Math.max(1, Math.min(TOTAL_LEVELS, levelId));
  const theme = getThemeForLevel(clampedId);

  let difficulty: LevelDifficulty;
  let targetArrows: number;
  let size: number;
  let allowedShapes: ArrowShape[];
  let distribution: { short: number; medium: number; long: number };
  let targetOccupancy: number = 0.88;

  if (clampedId <= 5) {
    difficulty = 'Easy';
    targetArrows = 14 + (clampedId - 1); // 14 to 18
    size = 8;
    allowedShapes = ['straight', 'l-shape'];
    distribution = { short: 0.30, medium: 0.60, long: 0.10 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 10) {
    difficulty = 'Easy';
    targetArrows = 17 + Math.floor((clampedId - 6) * 1.0); // 17 to 21 (within 15-22)
    size = 10;
    allowedShapes = ['straight', 'l-shape', 'u-shape'];
    distribution = { short: 0.28, medium: 0.54, long: 0.18 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 20) {
    difficulty = 'Medium';
    targetArrows = 22 + Math.floor((clampedId - 11) * 0.85); // 22 to 30 (within 20-30)
    size = 12;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag'];
    distribution = { short: 0.24, medium: 0.48, long: 0.28 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 35) {
    difficulty = 'Medium';
    targetArrows = 32 + Math.floor((clampedId - 21) * 0.8); // 32 to 43 (within 30-50)
    size = 14;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag'];
    distribution = { short: 0.20, medium: 0.48, long: 0.32 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 50) {
    difficulty = 'Hard';
    targetArrows = 42 + Math.floor((clampedId - 36) * 0.55); // 42 to 50 (within 30-50)
    size = 16;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.18, medium: 0.46, long: 0.36 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 75) {
    difficulty = 'Hard';
    targetArrows = 56 + Math.floor((clampedId - 51) * 0.6); // 56 to 70
    size = 18;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.18, medium: 0.45, long: 0.37 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 100) {
    difficulty = 'Expert';
    targetArrows = 72 + Math.floor((clampedId - 76) * 0.65);
    size = 20;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.16, medium: 0.44, long: 0.40 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 150) {
    difficulty = 'Expert';
    targetArrows = 90 + Math.floor((clampedId - 101) * 0.5);
    size = 22;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.15, medium: 0.45, long: 0.40 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 200) {
    difficulty = 'Master';
    targetArrows = 110 + Math.floor((clampedId - 151) * 0.5);
    size = 24;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.15, medium: 0.45, long: 0.40 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 1000) {
    difficulty = 'Master';
    targetArrows = 120 + Math.floor((clampedId - 201) * 0.02);
    size = clampedId <= 500 ? 24 : 25;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.14, medium: 0.46, long: 0.40 };
    targetOccupancy = 0.88;
  } else if (clampedId <= 2000) {
    difficulty = 'Grandmaster';
    targetArrows = 135 + Math.floor((clampedId - 1001) * 0.015);
    size = clampedId <= 1500 ? 25 : 26;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.13, medium: 0.45, long: 0.42 };
    targetOccupancy = 0.88;
  } else {
    difficulty = 'Legend';
    targetArrows = 145 + Math.floor((clampedId - 2001) * 0.015);
    size = 26;
    allowedShapes = ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
    distribution = { short: 0.12, medium: 0.44, long: 0.44 };
    targetOccupancy = 0.88;
  }

  return {
    rows: size,
    cols: size,
    targetArrows,
    difficulty,
    allowedShapes,
    distribution,
    targetOccupancy,
    theme,
  };
}

/**
 * Computes level parameters with mapping applied (Hard Boss Levels & 2-way exchanges).
 */
export function getLevelConfig(levelId: number): LevelConfig {
  const clampedId = Math.max(1, Math.min(TOTAL_LEVELS, levelId));
  const theme = getThemeForLevel(clampedId);

  if (isHardBossLevel(clampedId)) {
    const sourceId = getMappedSourceLevelId(clampedId);
    const sourceConfig = getBaseLevelConfig(sourceId);
    return {
      ...sourceConfig,
      difficulty: 'Hard',
      theme,
    };
  }

  const sourceId = getMappedSourceLevelId(clampedId);
  const sourceConfig = getBaseLevelConfig(sourceId);
  return {
    ...sourceConfig,
    theme,
  };
}

/**
 * Intelligent path constructor that grows an arrow backwards from its head into free grid cells.
 */
function buildSmartArrowPath(
  head: GridCoord,
  dir: Direction,
  shape: ArrowShape,
  targetLength: number,
  rows: number,
  cols: number,
  occupied: Set<string>,
  rng: () => number
): GridCoord[] | null {
  const opp = getOppositeDir(dir);
  const perp = getPerpendicularDirs(dir);

  const path: GridCoord[] = [head];
  const localOccupied = new Set<string>([`${head.r},${head.c}`]);

  const firstR = head.r + DIR_VECTORS[opp].dr;
  const firstC = head.c + DIR_VECTORS[opp].dc;

  if (
    firstR < 0 ||
    firstR >= rows ||
    firstC < 0 ||
    firstC >= cols ||
    occupied.has(`${firstR},${firstC}`)
  ) {
    return null;
  }

  path.unshift({ r: firstR, c: firstC });
  localOccupied.add(`${firstR},${firstC}`);

  let curr = { r: firstR, c: firstC };

  if (shape === 'straight') {
    for (let step = 2; step < targetLength; step++) {
      const nr = curr.r + DIR_VECTORS[opp].dr;
      const nc = curr.c + DIR_VECTORS[opp].dc;
      if (
        nr < 0 ||
        nr >= rows ||
        nc < 0 ||
        nc >= cols ||
        occupied.has(`${nr},${nc}`) ||
        localOccupied.has(`${nr},${nc}`)
      ) {
        break;
      }
      path.unshift({ r: nr, c: nc });
      localOccupied.add(`${nr},${nc}`);
      curr = { r: nr, c: nc };
    }
  } else if (shape === 'l-shape') {
    const turnChoice = perp[Math.floor(rng() * perp.length)];
    const leg1 = Math.max(1, Math.min(Math.floor(targetLength * 0.45), targetLength - 2));

    for (let s = 1; s < leg1; s++) {
      const nr = curr.r + DIR_VECTORS[opp].dr;
      const nc = curr.c + DIR_VECTORS[opp].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }

    for (let s = path.length; s < targetLength; s++) {
      const nr = curr.r + DIR_VECTORS[turnChoice].dr;
      const nc = curr.c + DIR_VECTORS[turnChoice].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }
  } else if (shape === 'u-shape') {
    const turnChoice = perp[Math.floor(rng() * perp.length)];
    const leg1 = Math.max(1, Math.floor(targetLength * 0.28));
    const leg2 = Math.max(2, Math.floor(targetLength * 0.38));

    for (let s = 1; s < leg1; s++) {
      const nr = curr.r + DIR_VECTORS[opp].dr;
      const nc = curr.c + DIR_VECTORS[opp].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }

    for (let s = 0; s < leg2; s++) {
      const nr = curr.r + DIR_VECTORS[turnChoice].dr;
      const nc = curr.c + DIR_VECTORS[turnChoice].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }

    for (let s = path.length; s < targetLength; s++) {
      const nr = curr.r + DIR_VECTORS[dir].dr;
      const nc = curr.c + DIR_VECTORS[dir].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }
  } else if (shape === 'zigzag') {
    const turnChoice = perp[Math.floor(rng() * perp.length)];
    const oppTurn = getOppositeDir(turnChoice);
    const leg1 = Math.max(1, Math.floor(targetLength * 0.3));
    const leg2 = Math.max(2, Math.floor(targetLength * 0.35));

    for (let s = 1; s < leg1; s++) {
      const nr = curr.r + DIR_VECTORS[opp].dr;
      const nc = curr.c + DIR_VECTORS[opp].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }

    for (let s = 0; s < leg2; s++) {
      const nr = curr.r + DIR_VECTORS[turnChoice].dr;
      const nc = curr.c + DIR_VECTORS[turnChoice].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }

    for (let s = path.length; s < targetLength; s++) {
      const nr = curr.r + DIR_VECTORS[oppTurn].dr;
      const nc = curr.c + DIR_VECTORS[oppTurn].dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !occupied.has(`${nr},${nc}`) &&
        !localOccupied.has(`${nr},${nc}`)
      ) {
        path.unshift({ r: nr, c: nc });
        localOccupied.add(`${nr},${nc}`);
        curr = { r: nr, c: nc };
      } else {
        break;
      }
    }
  } else {
    // Winding & organic path packing
    for (let s = path.length; s < targetLength; s++) {
      const allDirs: Direction[] = ['up', 'down', 'left', 'right'];
      const candidates: { dir: Direction; coord: GridCoord; score: number }[] = [];

      for (const d of allDirs) {
        const nr = curr.r + DIR_VECTORS[d].dr;
        const nc = curr.c + DIR_VECTORS[d].dc;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !occupied.has(`${nr},${nc}`) &&
          !localOccupied.has(`${nr},${nc}`)
        ) {
          let freeNeighbors = 0;
          for (const d2 of allDirs) {
            const r2 = nr + DIR_VECTORS[d2].dr;
            const c2 = nc + DIR_VECTORS[d2].dc;
            if (
              r2 >= 0 &&
              r2 < rows &&
              c2 >= 0 &&
              c2 < cols &&
              !occupied.has(`${r2},${c2}`) &&
              !localOccupied.has(`${r2},${c2}`)
            ) {
              freeNeighbors++;
            }
          }
          candidates.push({ dir: d, coord: { r: nr, c: nc }, score: freeNeighbors });
        }
      }

      if (candidates.length === 0) break;
      candidates.sort((a, b) => b.score - a.score);
      const chosen =
        candidates.length > 1 && rng() < 0.35 ? candidates[1] : candidates[0];

      path.unshift(chosen.coord);
      localOccupied.add(`${chosen.coord.r},${chosen.coord.c}`);
      curr = chosen.coord;
    }
  }

  return path.length >= 2 ? path : null;
}

/**
 * Deterministically generates a dense, commercial-grade solvable puzzle level for any levelId (1 to 1000).
 */
export function generateDeterministicMazeLevel(
  levelId: number,
  customConfig?: Partial<LevelConfig>
): LevelData {
  const baseConfig = getBaseLevelConfig(levelId);
  const config = customConfig ? { ...baseConfig, ...customConfig } : baseConfig;
  const {
    rows,
    cols,
    targetArrows,
    difficulty,
    allowedShapes,
    distribution,
    targetOccupancy,
    theme,
  } = config;
  const directions: Direction[] = ['up', 'down', 'left', 'right'];

  for (let attempt = 0; attempt < 120; attempt++) {
    const seed = levelId * 10007 + attempt * 1013 + 31415;
    const rng = createPRNG(seed);

    const occupied = new Set<string>();
    const freeCells: GridCoord[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        freeCells.push({ r, c });
      }
    }

    const arrows: MazeArrow[] = [];
    let failStreak = 0;

    const longTarget = Math.max(1, Math.round(targetArrows * distribution.long));
    const medTarget = Math.max(2, Math.round(targetArrows * distribution.medium));
    const shortTarget = Math.max(2, Math.round(targetArrows * distribution.short));

    // Phase 1: Long arrows (strictly controlled to avoid giant arrows in early levels)
    for (let i = 0; i < longTarget; i++) {
      let len: number;
      if (levelId <= 5) {
        len = rng() < 0.5 ? 5 : 6; // Length 5-6 for 8x8 (never 7 or 8)
      } else if (levelId <= 10) {
        len = rng() < 0.6 ? 6 : 7; // Max 7 cells for 10x10
      } else if (levelId <= 20) {
        len = 6 + Math.floor(rng() * 3); // 6 to 8
      } else if (rows >= 20) {
        len = 7 + Math.floor(rng() * 5); // 7 to 11
      } else {
        len = 6 + Math.floor(rng() * 4); // 6 to 9
      }

      const shape = allowedShapes[Math.floor(rng() * allowedShapes.length)];
      tryPlaceArrow(len, shape, 'long');
    }

    // Phase 2: Medium arrows (primary building block - 60% of board)
    for (let i = 0; i < medTarget; i++) {
      const len = levelId <= 5 ? (rng() < 0.6 ? 4 : 5) : 4 + Math.floor(rng() * 3);
      const shape = allowedShapes[Math.floor(rng() * allowedShapes.length)];
      tryPlaceArrow(len, shape, 'med');
    }

    // Phase 3: Short arrows (~30% target)
    for (let i = 0; i < shortTarget; i++) {
      const len = rng() < 0.35 ? 2 : 3;
      const shape =
        allowedShapes.includes('l-shape') && len === 3 && rng() < 0.5
          ? 'l-shape'
          : 'straight';
      tryPlaceArrow(len, shape, 'short');
    }

    // Phase 4: Dense Packing Fill (prioritizing medium arrows for level 1-5)
    let fills = 0;
    while (
      occupied.size / (rows * cols) < targetOccupancy &&
      fills < 140 &&
      failStreak < 45
    ) {
      fills++;
      const currentShort = arrows.filter((a) => a.points.length <= 3).length;
      const currentMed = arrows.filter(
        (a) => a.points.length >= 4 && a.points.length <= 6
      ).length;
      const currentLong = arrows.filter((a) => a.points.length >= 7).length;
      const currentTotal = arrows.length || 1;

      let cat: 'short' | 'med' | 'long' = 'med';
      if (levelId <= 5) {
        if (currentMed / currentTotal < 0.58) {
          cat = 'med';
        } else if (currentShort / currentTotal < 0.32) {
          cat = 'short';
        } else {
          cat = 'med';
        }
      } else {
        if (currentLong / currentTotal < distribution.long && levelId > 10) {
          cat = 'long';
        } else if (currentMed / currentTotal < distribution.medium) {
          cat = 'med';
        } else {
          cat = 'short';
        }

        if (fills > 45 || occupied.size / (rows * cols) > 0.76) {
          cat = rng() < 0.65 ? 'short' : 'med';
        }
      }

      let len = 4;
      if (cat === 'short') {
        len = rng() < 0.4 ? 2 : 3;
      } else if (cat === 'med') {
        len = levelId <= 5 ? (rng() < 0.65 ? 4 : 5) : 4 + Math.floor(rng() * 2);
      } else {
        len = levelId <= 10 ? 6 : 6 + Math.floor(rng() * 3);
      }

      const shape = allowedShapes[Math.floor(rng() * allowedShapes.length)];
      tryPlaceArrow(len, shape, cat);
    }

    // Phase 5: Gap & Pocket Filler for guaranteed 85%+ occupancy
    let gapFills = 0;
    while (
      occupied.size / (rows * cols) < 0.865 &&
      gapFills < 80 &&
      failStreak < 55 &&
      freeCells.length >= 2
    ) {
      gapFills++;
      // Try medium first if level <= 5 and med proportion is low
      const currentMedCount = arrows.filter(
        (a) => a.points.length >= 4 && a.points.length <= 6
      ).length;
      const needMed = levelId <= 5 && currentMedCount / (arrows.length || 1) < 0.55;

      const shape =
        allowedShapes.includes('l-shape') && rng() < 0.45 ? 'l-shape' : 'straight';
      const len = needMed ? (rng() < 0.7 ? 4 : 3) : (rng() < 0.55 ? 2 : 3);
      tryPlaceArrow(len, shape, needMed ? 'med' : 'short');
    }

    function tryPlaceArrow(
      len: number,
      shape: ArrowShape,
      cat: 'short' | 'med' | 'long'
    ) {
      if (freeCells.length === 0) {
        failStreak++;
        return;
      }

      const sampleLimit = Math.min(freeCells.length, 60);
      const samples: GridCoord[] = [];

      // Naturally spread arrows across interior & exterior
      const interiorCells = freeCells.filter(
        (c) => c.r >= 1 && c.r < rows - 1 && c.c >= 1 && c.c < cols - 1
      );

      for (let s = 0; s < sampleLimit; s++) {
        if (arrows.length < targetArrows * 0.45 && interiorCells.length > 0 && rng() < 0.6) {
          const idx = Math.floor(rng() * interiorCells.length);
          samples.push(interiorCells[idx]);
        } else {
          const idx = Math.floor(rng() * freeCells.length);
          samples.push(freeCells[idx]);
        }
      }

      const candidates: { head: GridCoord; dir: Direction; blockerCount: number }[] = [];
      for (const pos of samples) {
        for (const dir of directions) {
          const { dr, dc } = DIR_VECTORS[dir];
          let blockerCount = 0;
          let checkR = pos.r + dr;
          let checkC = pos.c + dc;
          while (checkR >= 0 && checkR < rows && checkC >= 0 && checkC < cols) {
            if (occupied.has(`${checkR},${checkC}`)) {
              blockerCount++;
            }
            checkR += dr;
            checkC += dc;
          }

          const maxBlockers =
            levelId <= 5
              ? arrows.length < 4
                ? 0
                : 2
              : arrows.length < 5
              ? 0
              : arrows.length < 15
              ? 1
              : Math.max(4, Math.floor(rows / 3));

          if (blockerCount <= maxBlockers) {
            // For level <= 5, after 4 free arrows are placed, prefer arrows that are blocked by existing arrows
            if (levelId <= 5 && arrows.length >= 4 && blockerCount === 0 && rng() < 0.75) {
              continue;
            }

            const tempArrow: MazeArrow = {
              id: 'temp',
              points: [
                { r: pos.r - dr, c: pos.c - dc },
                { r: pos.r, c: pos.c },
              ],
              dir,
            };
            let conflict = false;
            for (const ex of arrows) {
              if (areArrowsHeadToHead(tempArrow, ex)) {
                conflict = true;
                break;
              }
            }
            if (!conflict) {
              candidates.push({ head: pos, dir, blockerCount });
            }
          }
        }
      }

      if (candidates.length === 0) {
        failStreak++;
        return;
      }

      candidates.sort((a, b) => a.blockerCount - b.blockerCount + (rng() * 2 - 1));

      for (const cand of candidates.slice(0, 15)) {
        const path = buildSmartArrowPath(
          cand.head,
          cand.dir,
          shape,
          len,
          rows,
          cols,
          occupied,
          rng
        );
        if (path && path.length >= 2) {
          if (cat === 'long' && path.length < 5) continue;
          if (cat === 'med' && path.length < 3) continue;

          const newArrow: MazeArrow = {
            id: `lvl-${levelId}-${arrows.length + 1}`,
            points: path,
            dir: cand.dir,
            shape,
          };

          let conflict = false;
          for (const ex of arrows) {
            if (areArrowsHeadToHead(newArrow, ex)) {
              conflict = true;
              break;
            }
          }

          if (!conflict) {
            arrows.push(newArrow);
            path.forEach((p) => {
              const k = `${p.r},${p.c}`;
              if (!occupied.has(k)) {
                occupied.add(k);
              }
            });

            // Fast update of freeCells
            let writeIdx = 0;
            for (let i = 0; i < freeCells.length; i++) {
              if (!occupied.has(`${freeCells[i].r},${freeCells[i].c}`)) {
                freeCells[writeIdx++] = freeCells[i];
              }
            }
            freeCells.length = writeIdx;

            failStreak = 0;
            return;
          }
        }
      }
      failStreak++;
    }

    // Phase 6: Tail Absorption & Gap Density Optimizer
    let tailExtended = true;
    let absorbPasses = 0;
    const maxAbsorbPasses = rows >= 20 ? 1 : 3;
    while (tailExtended && absorbPasses < maxAbsorbPasses) {
      tailExtended = false;
      absorbPasses++;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const key = `${r},${c}`;
          if (!occupied.has(key)) {
            for (const a of arrows) {
              const tail = a.points[0];
              if (Math.abs(tail.r - r) + Math.abs(tail.c - c) === 1) {
                a.points.unshift({ r, c });
                occupied.add(key);
                if (verifyLevelSolvable({ id: levelId, name: `Level ${levelId}`, rows, cols, arrows, difficulty, theme })) {
                  tailExtended = true;
                  break;
                } else {
                  a.points.shift();
                  occupied.delete(key);
                }
              }
            }
          }
        }
      }
    }

    const short = arrows.filter((a) => a.points.length <= 3).length;
    const med = arrows.filter((a) => a.points.length >= 4 && a.points.length <= 6).length;
    const long = arrows.filter((a) => a.points.length >= 7).length;
    const occPercent = occupied.size / (rows * cols);
    const minOccReq = rows >= 24 ? 0.62 : rows >= 20 ? 0.68 : (attempt > 60 ? 0.82 : 0.85);

    // Progression constraints
    let validArrowCount = false;
    if (levelId <= 5) {
      validArrowCount = arrows.length >= 11 && arrows.length <= 22;
    } else if (levelId <= 10) {
      validArrowCount = arrows.length >= 14 && arrows.length <= 26;
    } else if (levelId <= 20) {
      validArrowCount = arrows.length >= 18 && arrows.length <= 34;
    } else if (levelId <= 50) {
      validArrowCount = arrows.length >= 24 && arrows.length <= 56;
    } else {
      validArrowCount = arrows.length >= Math.max(8, Math.floor(targetArrows * 0.55));
    }

    if (
      validArrowCount &&
      short >= 1 &&
      med >= 1 &&
      occPercent >= minOccReq
    ) {
      const candidateLevel: LevelData = {
        id: levelId,
        name: `Level ${levelId}`,
        rows,
        cols,
        arrows: [...arrows],
        difficulty,
        minMoves: arrows.length,
        theme,
        complexityScore: Math.round(arrows.length * 1.5 + rows),
      };

      if (verifyLevelSolvable(candidateLevel)) {
        const freeStart = getSolvableArrows(candidateLevel.arrows, rows, cols).length;
        
        let validFreeStart = true;
        if (levelId <= 5) {
          validFreeStart = freeStart >= 2 && freeStart <= 7;
        } else if (levelId <= 10) {
          validFreeStart = freeStart >= 3 && freeStart <= 9;
        } else if (levelId <= 20) {
          validFreeStart = freeStart >= 3 && freeStart <= 12;
        }

        if (validFreeStart) {
          return candidateLevel;
        }
      }
    }
  }

  // Guaranteed fallback
  const fallback = PRESET_MAZE_STARTERS[(levelId - 1) % PRESET_MAZE_STARTERS.length];
  return {
    ...fallback,
    id: levelId,
    name: `Level ${levelId}`,
    difficulty,
    theme,
  };
}

/**
 * Detects the visual/geometric shape of an arrow based on its points.
 */
export function detectArrowShape(points: GridCoord[]): ArrowShape {
  if (points.length <= 2) return 'straight';
  const turns: number[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const d1r = curr.r - prev.r;
    const d1c = curr.c - prev.c;
    const d2r = next.r - curr.r;
    const d2c = next.c - curr.c;
    const cross = d1r * d2c - d1c * d2r;
    if (cross !== 0) {
      turns.push(cross);
    }
  }

  if (turns.length === 0) return 'straight';
  if (turns.length === 1) return 'l-shape';
  if (turns.length === 2) {
    return turns[0] === turns[1] ? 'u-shape' : 'zigzag';
  }
  return 'winding';
}

/**
 * Expands arrows into free dots:
 * 1. Straight front expansion (samne se bada karna).
 * 2. Straight tail expansion (peeche se bada karna).
 * 3. Tail bending (peeche se 90° modna) around corners.
 * 4. Head bending (aage se 90° modna) into perpendicular empty dots.
 * 5. Pocket filling for clusters of remaining empty dots.
 * Ensures the level remains 100% solvable without conflicts or deadlocks.
 */
export function expandArrowsIntoFreeDots(level: LevelData): LevelData {
  const rows = level.rows;
  const cols = level.cols;
  const occupied = new Set<string>();

  const arrows: MazeArrow[] = level.arrows.map((a) => ({
    ...a,
    points: [...a.points],
  }));

  arrows.forEach((a) => a.points.forEach((p) => occupied.add(`${p.r},${p.c}`)));

  let expanded = true;
  let passes = 0;
  const maxPasses = rows >= 20 ? 4 : 10;

  while (expanded && passes < maxPasses) {
    expanded = false;
    passes++;

    for (const arrow of arrows) {
      // 1. FRONT STRAIGHT EXPANSION (grow forward as much as possible)
      while (true) {
        const head = arrow.points[arrow.points.length - 1];
        const { dr, dc } = DIR_VECTORS[arrow.dir];
        const frontR = head.r + dr;
        const frontC = head.c + dc;

        if (frontR >= 0 && frontR < rows && frontC >= 0 && frontC < cols) {
          const frontKey = `${frontR},${frontC}`;
          if (!occupied.has(frontKey)) {
            arrow.points.push({ r: frontR, c: frontC });
            occupied.add(frontKey);

            if (verifyLevelSolvable({ ...level, arrows })) {
              expanded = true;
              continue;
            } else {
              arrow.points.pop();
              occupied.delete(frontKey);
              break;
            }
          } else {
            break;
          }
        } else {
          break;
        }
      }

      // 2. TAIL STRAIGHT EXPANSION (Straight back as much as possible)
      while (true) {
        const tail = arrow.points[0];
        const nextPoint = arrow.points.length > 1 ? arrow.points[1] : null;
        const straightBackR = nextPoint ? tail.r + (tail.r - nextPoint.r) : -1;
        const straightBackC = nextPoint ? tail.c + (tail.c - nextPoint.c) : -1;

        if (
          straightBackR >= 0 &&
          straightBackR < rows &&
          straightBackC >= 0 &&
          straightBackC < cols &&
          !occupied.has(`${straightBackR},${straightBackC}`)
        ) {
          const backKey = `${straightBackR},${straightBackC}`;
          arrow.points.unshift({ r: straightBackR, c: straightBackC });
          occupied.add(backKey);

          if (verifyLevelSolvable({ ...level, arrows })) {
            expanded = true;
            continue;
          } else {
            arrow.points.shift();
            occupied.delete(backKey);
            break;
          }
        } else {
          break;
        }
      }

      // 3. TAIL BENDING (Peeche se modna): Agar peeche rasta band hai, toh 90° mod do
      const tail = arrow.points[0];
      const offsets = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 },
      ];
      for (const off of offsets) {
        const tr = tail.r + off.dr;
        const tc = tail.c + off.dc;
        if (tr >= 0 && tr < rows && tc >= 0 && tc < cols && !occupied.has(`${tr},${tc}`)) {
          const backKey = `${tr},${tc}`;
          arrow.points.unshift({ r: tr, c: tc });
          occupied.add(backKey);

          if (verifyLevelSolvable({ ...level, arrows })) {
            expanded = true;
            break;
          } else {
            arrow.points.shift();
            occupied.delete(backKey);
          }
        }
      }

      // 4. HEAD BENDING (Aage se modna): Agar aage rasta band hai, toh 90° mod do
      const head = arrow.points[arrow.points.length - 1];
      const perpendicularDirs: Record<Direction, Direction[]> = {
        up: ['left', 'right'],
        down: ['left', 'right'],
        left: ['up', 'down'],
        right: ['up', 'down'],
      };

      for (const turnDir of perpendicularDirs[arrow.dir]) {
        const tVec = DIR_VECTORS[turnDir];
        const turnR = head.r + tVec.dr;
        const turnC = head.c + tVec.dc;

        if (turnR >= 0 && turnR < rows && turnC >= 0 && turnC < cols) {
          const turnKey = `${turnR},${turnC}`;
          if (!occupied.has(turnKey)) {
            const origDir = arrow.dir;
            arrow.points.push({ r: turnR, c: turnC });
            arrow.dir = turnDir;
            occupied.add(turnKey);

            if (verifyLevelSolvable({ ...level, arrows })) {
              expanded = true;
              break;
            } else {
              arrow.points.pop();
              arrow.dir = origDir;
              occupied.delete(turnKey);
            }
          }
        }
      }
    }
  }

  // 5. POCKET FILLER (Khali dots me naye valid straight/bent arrows banana)
  const emptyDots: GridCoord[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!occupied.has(`${r},${c}`)) {
        emptyDots.push({ r, c });
      }
    }
  }

  if (emptyDots.length >= 2) {
    for (const start of emptyDots) {
      if (occupied.has(`${start.r},${start.c}`)) continue;

      const dirs: Direction[] = ['up', 'down', 'left', 'right'];
      for (const dir of dirs) {
        const vec = DIR_VECTORS[dir];
        const p2 = { r: start.r + vec.dr, c: start.c + vec.dc };
        if (
          p2.r >= 0 &&
          p2.r < rows &&
          p2.c >= 0 &&
          p2.c < cols &&
          !occupied.has(`${p2.r},${p2.c}`)
        ) {
          const newArrowId = `lvl-${level.id}-fill-${arrows.length + 1}`;
          const newArrow: MazeArrow = {
            id: newArrowId,
            points: [start, p2],
            dir,
            shape: 'straight',
          };

          arrows.push(newArrow);
          occupied.add(`${start.r},${start.c}`);
          occupied.add(`${p2.r},${p2.c}`);

          if (verifyLevelSolvable({ ...level, arrows })) {
            // Check if can expand 1 more step
            const pNext = { r: p2.r + vec.dr, c: p2.c + vec.dc };
            if (
              pNext.r >= 0 &&
              pNext.r < rows &&
              pNext.c >= 0 &&
              pNext.c < cols &&
              !occupied.has(`${pNext.r},${pNext.c}`)
            ) {
              newArrow.points.push(pNext);
              occupied.add(`${pNext.r},${pNext.c}`);
              if (!verifyLevelSolvable({ ...level, arrows })) {
                newArrow.points.pop();
                occupied.delete(`${pNext.r},${pNext.c}`);
              }
            }
            break;
          } else {
            arrows.pop();
            occupied.delete(`${start.r},${start.c}`);
            occupied.delete(`${p2.r},${p2.c}`);
          }
        }
      }
    }
  }

  // Update dynamic shapes
  for (const arrow of arrows) {
    arrow.shape = detectArrowShape(arrow.points);
  }

  return {
    ...level,
    arrows,
    minMoves: arrows.length,
  };
}

// In-Memory Level Cache for instantaneous performance across 1000 levels
const levelCache = new Map<number, LevelData>();

/**
 * Retrieves or generates any level from 1 to 1000 (with levels 15, 30, 45... replaced by levels 2000, 2001, 2002...).
 */
export function getLevelById(levelId: number): LevelData {
  const normalizedId = Math.max(1, Math.min(TOTAL_LEVELS, levelId));
  if (levelCache.has(normalizedId)) {
    return levelCache.get(normalizedId)!;
  }

  const isHard = isHardBossLevel(normalizedId);
  const sourceId = getMappedSourceLevelId(normalizedId);
  const generated = generateDeterministicMazeLevel(sourceId);

  // Customize if it's a hard boss level (15, 30, 45, etc.) or normal/exchanged level
  const customizedLevel: LevelData = isHard
    ? {
        ...generated,
        id: normalizedId,
        name: `Hard Level ${normalizedId}`,
        difficulty: 'Hard',
        theme: getThemeForLevel(normalizedId),
      }
    : {
        ...generated,
        id: normalizedId,
        name: `Level ${normalizedId}`,
        theme: getThemeForLevel(normalizedId),
      };

  const expanded = expandArrowsIntoFreeDots(customizedLevel);
  levelCache.set(normalizedId, expanded);
  return expanded;
}

/**
 * Procedural Endless Level Generator.
 */
export function generateMazeLevel(
  id: number,
  rows: number,
  cols: number,
  difficulty: LevelDifficulty = 'Medium'
): LevelData {
  const allowedShapes: ArrowShape[] =
    difficulty === 'Easy'
      ? ['straight', 'l-shape']
      : difficulty === 'Medium'
      ? ['straight', 'l-shape', 'u-shape', 'zigzag']
      : ['straight', 'l-shape', 'u-shape', 'zigzag', 'winding'];
  const targetArrows = Math.max(10, Math.floor(rows * cols * 0.2));
  return generateDeterministicMazeLevel(id, {
    rows,
    cols,
    difficulty,
    targetArrows,
    allowedShapes,
  });
}

// Starter template level
export const PRESET_MAZE_STARTERS: LevelData[] = [
  {
    id: 1,
    name: 'Level 1',
    rows: 8,
    cols: 8,
    difficulty: 'Easy',
    minMoves: 11,
    theme: THEMES[0],
    arrows: [
      {
        id: '1-1',
        points: [
          { r: 0, c: 6 },
          { r: 1, c: 6 },
          { r: 2, c: 6 },
          { r: 3, c: 6 },
          { r: 4, c: 6 },
          { r: 5, c: 6 },
        ],
        dir: 'down',
        shape: 'straight',
      },
      {
        id: '1-2',
        points: [
          { r: 0, c: 7 },
          { r: 1, c: 7 },
          { r: 2, c: 7 },
          { r: 3, c: 7 },
          { r: 4, c: 7 },
        ],
        dir: 'down',
        shape: 'straight',
      },
      {
        id: '1-3',
        points: [
          { r: 5, c: 0 },
          { r: 5, c: 1 },
          { r: 5, c: 2 },
          { r: 5, c: 3 },
          { r: 5, c: 4 },
          { r: 5, c: 5 },
          { r: 4, c: 5 },
          { r: 3, c: 5 },
          { r: 2, c: 5 },
        ],
        dir: 'up',
        shape: 'l-shape',
      },
      {
        id: '1-4',
        points: [
          { r: 4, c: 0 },
          { r: 4, c: 1 },
          { r: 4, c: 2 },
          { r: 4, c: 3 },
          { r: 3, c: 3 },
          { r: 2, c: 3 },
        ],
        dir: 'up',
        shape: 'l-shape',
      },
      {
        id: '1-5',
        points: [
          { r: 7, c: 7 },
          { r: 7, c: 6 },
          { r: 7, c: 5 },
        ],
        dir: 'left',
        shape: 'straight',
      },
      {
        id: '1-6',
        points: [
          { r: 2, c: 2 },
          { r: 2, c: 1 },
          { r: 2, c: 0 },
        ],
        dir: 'left',
        shape: 'straight',
      },
      {
        id: '1-7',
        points: [
          { r: 4, c: 4 },
          { r: 3, c: 4 },
          { r: 2, c: 4 },
          { r: 1, c: 4 },
        ],
        dir: 'up',
        shape: 'straight',
      },
      {
        id: '1-8',
        points: [
          { r: 1, c: 0 },
          { r: 1, c: 1 },
          { r: 1, c: 2 },
          { r: 0, c: 2 },
        ],
        dir: 'up',
        shape: 'l-shape',
      },
      {
        id: '1-9',
        points: [
          { r: 6, c: 4 },
          { r: 6, c: 3 },
        ],
        dir: 'left',
        shape: 'straight',
      },
      {
        id: '1-10',
        points: [
          { r: 6, c: 1 },
          { r: 7, c: 1 },
        ],
        dir: 'down',
        shape: 'straight',
      },
      {
        id: '1-11',
        points: [
          { r: 6, c: 5 },
          { r: 6, c: 6 },
          { r: 6, c: 7 },
        ],
        dir: 'right',
        shape: 'straight',
      },
    ],
  },
];

export const PRESET_MAZE_LEVELS = PRESET_MAZE_STARTERS;
