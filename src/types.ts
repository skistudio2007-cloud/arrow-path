export type Direction = 'up' | 'down' | 'left' | 'right';

export type ArrowShape = 'straight' | 'l-shape' | 'u-shape' | 'zigzag' | 'winding' | 'complex';

export interface GridCoord {
  r: number;
  c: number;
}

export interface MazeArrow {
  id: string;
  // Sequence of grid points from tail points[0] to head points[points.length - 1]
  points: GridCoord[];
  // Direction the head points (derived from second-to-last point to last point)
  dir: Direction;
  shape?: ArrowShape;
  color?: string;
}

export type LevelDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master' | 'Grandmaster' | 'Legend';

export interface ThemeConfig {
  id: string;
  name: string;
  bgClass: string;
  boardBgClass: string;
  boardBorderClass: string;
  accentColor: string;
  gridDotColor: string;
  pillBg: string;
  pillText: string;
}

export interface LevelData {
  id: number;
  name: string;
  rows: number;
  cols: number;
  arrows: MazeArrow[];
  difficulty: LevelDifficulty;
  minMoves?: number;
  theme?: ThemeConfig;
  complexityScore?: number;
}
