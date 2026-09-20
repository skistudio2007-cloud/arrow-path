import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { MazeArrow } from '../types';
import { DIR_VECTORS } from '../utils/levels';
import {
  buildArrowHeadAtPoint,
  buildExtendedSnakePath,
  buildFilletedPixelPath,
  getPolylineLengths,
  gridToPixelPoints,
  slicePolyline,
} from '../utils/snakeGeometry';

interface MazeArrowRendererProps {
  arrow: MazeArrow;
  index?: number;
  cellSize: number;
  isHinted: boolean;
  isShaking: boolean;
  isBlocked: boolean;
  isFlying: boolean;
  isHovered: boolean;
  onClick: (arrow: MazeArrow) => void;
  onHoverStart?: (arrow: MazeArrow) => void;
  onHoverEnd?: () => void;
}

export const MazeArrowRenderer: React.FC<MazeArrowRendererProps> = React.memo(({
  arrow,
  index = 0,
  cellSize,
  isHinted,
  isShaking,
  isBlocked,
  isFlying,
  isHovered,
  onClick,
  onHoverStart,
  onHoverEnd,
}) => {
  const [flightProgress, setFlightProgress] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Direction vectors
  const { dr, dc } = DIR_VECTORS[arrow.dir];

  // Precompute static base points & lengths (memoized per arrow + cellSize)
  const basePixelPoints = useMemo(() => {
    return gridToPixelPoints(arrow.points, cellSize);
  }, [arrow.points, cellSize]);

  const { total: originalLength } = useMemo(() => {
    return getPolylineLengths(basePixelPoints);
  }, [basePixelPoints]);

  const cornerRadius = useMemo(() => Math.max(7, cellSize * 0.28), [cellSize]);
  const arrowHeadSize = useMemo(() => Math.max(11, cellSize * 0.38), [cellSize]);
  const strokeWidth = useMemo(() => Math.max(3.6, Math.min(5.2, cellSize * 0.12)), [cellSize]);

  // Precompute static body & head paths so they are NEVER recalculated during idle/hover
  const staticBodyPath = useMemo(() => {
    return buildFilletedPixelPath(basePixelPoints, cornerRadius);
  }, [basePixelPoints, cornerRadius]);

  const staticHeadPath = useMemo(() => {
    const tip = basePixelPoints[basePixelPoints.length - 1];
    return buildArrowHeadAtPoint(tip, { x: dc, y: dr }, arrowHeadSize);
  }, [basePixelPoints, dc, dr, arrowHeadSize]);

  // Precompute extended path for smooth flight animation
  const exitDistance = useMemo(() => Math.max(900, cellSize * 25), [cellSize]);
  const extendedPixelPoints = useMemo(() => {
    return buildExtendedSnakePath(arrow.points, arrow.dir, cellSize, exitDistance);
  }, [arrow.points, arrow.dir, cellSize, exitDistance]);

  const { total: extendedLength } = useMemo(() => {
    return getPolylineLengths(extendedPixelPoints);
  }, [extendedPixelPoints]);

  const centerPoint = useMemo(() => ({
    x: basePixelPoints.reduce((acc, p) => acc + p.x, 0) / Math.max(1, basePixelPoints.length),
    y: basePixelPoints.reduce((acc, p) => acc + p.y, 0) / Math.max(1, basePixelPoints.length),
  }), [basePixelPoints]);

  // High-performance parametric Snake slithering animation loop
  useEffect(() => {
    if (isFlying) {
      const startTime = performance.now();
      const duration = 480; // 480ms ultra-smooth slither

      const step = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // Premium Apple-smooth ease curve: [0.25, 1, 0.5, 1]
        const eased =
          rawProgress < 0.5
            ? 2 * rawProgress * rawProgress
            : -1 + (4 - 2 * rawProgress) * rawProgress;

        setFlightProgress(eased);

        if (rawProgress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);

      return () => {
        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    } else {
      setFlightProgress(0);
    }
  }, [isFlying]);

  // Shake recoil translations
  const shakeX = isShaking ? [0, dc * 9, -dc * 6, dc * 3, 0] : 0;
  const shakeY = isShaking ? [0, dr * 9, -dr * 6, dr * 3, 0] : 0;

  // Determine current active snake path (only slices when actually in flight)
  let bodyPath = staticBodyPath;
  let headPath = staticHeadPath;
  let headTip = basePixelPoints[basePixelPoints.length - 1];

  if (isFlying && flightProgress > 0) {
    const totalTravelDistance = originalLength + exitDistance;
    const travelDist = flightProgress * totalTravelDistance;
    const startDist = travelDist;
    const endDist = Math.min(travelDist + originalLength, extendedLength);

    const sliced = slicePolyline(extendedPixelPoints, startDist, endDist);
    if (sliced.points.length < 2) {
      return null;
    }
    bodyPath = buildFilletedPixelPath(sliced.points, cornerRadius);
    headTip = sliced.points[sliced.points.length - 1];
    headPath = buildArrowHeadAtPoint(headTip, sliced.headTangent, arrowHeadSize);
  }

  const strokeColor = isBlocked
    ? '#ef4444' // Red warning flash
    : isHinted
    ? '#2563eb' // Blue pulse on hint
    : isHovered
    ? '#000000'
    : '#0f172a'; // Bold deep slate black

  const arrangeDelay = Math.min(0.45, (index || 0) * 0.028);

  const isDense = cellSize < 26;

  return (
    <motion.g
      id={`maze-arrow-${arrow.id}`}
      onClick={(e) => {
        if (isFlying) return;
        e.stopPropagation();
        onClick(arrow);
      }}
      onMouseEnter={() => !isFlying && onHoverStart?.(arrow)}
      onMouseLeave={() => onHoverEnd?.()}
      initial={isDense ? false : {
        opacity: 0,
        scale: 0.35,
        y: -10,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isFlying ? 0 : (isShaking ? shakeX : 0),
        y: isFlying ? 0 : (isShaking ? shakeY : 0),
      }}
      transition={{
        opacity: { duration: 0.2, delay: isDense ? 0 : arrangeDelay },
        scale: { type: 'spring', stiffness: 450, damping: 22, delay: isDense ? 0 : arrangeDelay },
        y: isShaking
          ? { duration: 0.28, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 450, damping: 22, delay: isDense ? 0 : arrangeDelay },
        x: isShaking
          ? { duration: 0.28, ease: 'easeInOut' }
          : { duration: 0.1 },
      }}
      style={{
        transformOrigin: `${centerPoint.x}px ${centerPoint.y}px`,
        filter: isHovered ? 'drop-shadow(0 2px 4px rgba(15, 23, 42, 0.25))' : 'none',
        willChange: isFlying || isShaking ? 'transform, opacity' : 'auto',
        opacity: isFlying && flightProgress > 0.7 ? Math.max(0, 1 - (flightProgress - 0.7) / 0.3) : 1,
      }}
      className={isFlying ? "pointer-events-none select-none" : "cursor-pointer select-none"}
    >
      {/* Generous invisible stroke area for easy tap & click interaction */}
      <path
        d={bodyPath}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(34, cellSize * 0.95)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pulsing glow if Hint is triggered */}
      {isHinted && !isFlying && (
        <motion.path
          d={bodyPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.4}
          animate={{
            strokeOpacity: [0.2, 0.7, 0.2],
            strokeWidth: [strokeWidth + 4, strokeWidth + 10, strokeWidth + 4],
          }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}

      {/* Hover visual feedback glow */}
      {isHovered && !isFlying && !isBlocked && !isHinted && (
        <path
          d={bodyPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={strokeWidth + 5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.35}
        />
      )}

      {/* Main Snake Body Polyline */}
      {isDense ? (
        <path
          d={bodyPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <motion.path
          d={bodyPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.28,
            delay: arrangeDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      )}

      {/* Sleek Aerodynamic Arrowhead */}
      {isDense ? (
        <path
          d={headPath}
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      ) : (
        <motion.path
          d={headPath}
          fill={strokeColor}
          stroke={strokeColor}
          strokeWidth={1}
          strokeLinejoin="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: arrangeDelay + 0.06,
            type: 'spring',
            stiffness: 480,
            damping: 20,
          }}
          style={{
            transformOrigin: `${headTip.x}px ${headTip.y}px`,
          }}
        />
      )}
    </motion.g>
  );
});
