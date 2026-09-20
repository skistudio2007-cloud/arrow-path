import React from 'react';
import { MazeArrow } from '../types';
import { checkArrowEscape, DIR_VECTORS } from '../utils/levels';

interface TrajectoryLineProps {
  arrow: MazeArrow;
  allArrows: MazeArrow[];
  rows: number;
  cols: number;
  cellSize: number;
}

const TrajectoryLineComponent: React.FC<TrajectoryLineProps> = ({
  arrow,
  allArrows,
  rows,
  cols,
  cellSize,
}) => {
  if (arrow.points.length === 0) return null;
  const head = arrow.points[arrow.points.length - 1];
  const { dr, dc } = DIR_VECTORS[arrow.dir];
  const { canEscape, blockerCoord } = checkArrowEscape(arrow, allArrows, rows, cols);

  const startX = head.c * cellSize + cellSize / 2;
  const startY = head.r * cellSize + cellSize / 2;

  let endX = startX;
  let endY = startY;

  if (canEscape) {
    let r = head.r;
    let c = head.c;
    while (r >= 0 && r < rows && c >= 0 && c < cols) {
      r += dr;
      c += dc;
    }
    endX = c * cellSize + cellSize / 2;
    endY = r * cellSize + cellSize / 2;
  } else if (blockerCoord) {
    endX = blockerCoord.c * cellSize + cellSize / 2;
    endY = blockerCoord.r * cellSize + cellSize / 2;
  }

  return (
    <g className="pointer-events-none">
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={canEscape ? '#3b82f6' : '#ef4444'}
        strokeWidth="2.5"
        strokeDasharray="4 4"
        strokeOpacity={canEscape ? 0.6 : 0.75}
      />
      <circle
        cx={endX}
        cy={endY}
        r={canEscape ? 3.5 : 5}
        fill={canEscape ? '#3b82f6' : '#ef4444'}
        opacity={0.8}
      />
    </g>
  );
};

export const TrajectoryLine = React.memo(TrajectoryLineComponent);
