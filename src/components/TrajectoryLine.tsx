import React from 'react';
import { motion } from 'motion/react';
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

  // Neutral refined translucent guide (no blue colors, no unwanted endpoint dots)
  const guideColor = canEscape ? '#64748b' : '#ef4444';

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="pointer-events-none"
    >
      {/* Translucent refined dashed trajectory guide */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={guideColor}
        strokeWidth="1.8"
        strokeDasharray="3 4"
        strokeOpacity={canEscape ? 0.38 : 0.44}
      />
    </motion.g>
  );
};

export const TrajectoryLine = React.memo(TrajectoryLineComponent);
