import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { MazeArrow, ArrowTheme } from '../types';
import { DIR_VECTORS } from '../utils/levels';
import {
  buildArrowHeadAtPoint,
  buildExtendedSnakePath,
  buildFilletedPixelPath,
  buildPolylinePixelPath,
  getPolylineLengths,
  gridToPixelPoints,
  slicePolyline,
} from '../utils/snakeGeometry';
import { getArrowFlightPalette, FLIGHT_PALETTES } from '../utils/flightThemes';

interface MazeArrowRendererProps {
  arrow: MazeArrow;
  index?: number;
  cellSize: number;
  boardWidth?: number;
  boardHeight?: number;
  zoomScale?: number;
  pan?: { x: number; y: number };
  isHinted: boolean;
  isShaking: boolean;
  isBlocked: boolean;
  isFlying: boolean;
  isHovered: boolean;
  onClick: (arrow: MazeArrow) => void;
  onHoverStart?: (arrow: MazeArrow) => void;
  onHoverEnd?: () => void;
  onFlightComplete?: (arrowId: string) => void;
  isDarkMode?: boolean;
  arrowTheme?: ArrowTheme;
}

// Beautiful vibrant multi-color arrow theme palette with distinct harmonious shades
const MULTICOLOR_PALETTE = [
  '#3b82f6', // Vivid Royal Blue
  '#10b981', // Emerald Green
  '#f59e0b', // Amber Orange
  '#ec4899', // Hot Pink
  '#8b5cf6', // Violet Purple
  '#06b6d4', // Bright Cyan
  '#f97316', // Coral Orange
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#e11d48', // Ruby Rose
];

// Vibrant multi-color rainbow gradients inside each individual arrow!
const GRADIENT_PALETTES = [
  // Rainbow Spectrum: Pink -> Violet -> Cyan -> Emerald -> Amber
  ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  // Neon Sunset: Purple -> Rose -> Orange -> Amber
  ['#7c3aed', '#f43f5e', '#fb923c', '#facc15'],
  // Cosmic Aurora: Electric Indigo -> Cyan -> Teal -> Lime
  ['#4f46e5', '#06b6d4', '#14b8a6', '#84cc16'],
  // Fire Blossom: Crimson -> Coral -> Gold -> Lemon
  ['#e11d48', '#f97316', '#f59e0b', '#fde047'],
  // Tropical Lagoon: Teal -> Cyan -> Sky Blue -> Violet
  ['#0d9488', '#06b6d4', '#38bdf8', '#818cf8'],
];

// Extract stable numeric index from arrow.id so colors NEVER shift when other arrows exit
function getArrowStablePaletteIndex(arrowId: string, fallbackIndex = 0): number {
  const match = arrowId.match(/\d+$/);
  if (match) {
    return Math.abs(parseInt(match[0], 10) - 1) % MULTICOLOR_PALETTE.length;
  }
  let hash = 0;
  for (let i = 0; i < arrowId.length; i++) {
    hash = (hash * 31 + arrowId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash + fallbackIndex) % MULTICOLOR_PALETTE.length;
}

export const MazeArrowRenderer: React.FC<MazeArrowRendererProps> = React.memo(({
  arrow,
  index = 0,
  cellSize,
  boardWidth,
  boardHeight,
  zoomScale,
  pan,
  isHinted,
  isShaking,
  isBlocked,
  isFlying,
  isHovered,
  onClick,
  onHoverStart,
  onHoverEnd,
  onFlightComplete,
  isDarkMode = false,
  arrowTheme = 'classic',
}) => {
  const groupRef = useRef<SVGGElement>(null);
  const hitPathRef = useRef<SVGPathElement>(null);
  const bodyPathRef = useRef<SVGPathElement>(null);
  const headPathRef = useRef<SVGPathElement>(null);
  const flightGradRef = useRef<SVGLinearGradientElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Direction vectors
  const { dr, dc } = DIR_VECTORS[arrow.dir];

  // Stable palette index tied permanently to this arrow's ID
  const stablePaletteIdx = useMemo(() => {
    return getArrowStablePaletteIndex(arrow.id, index);
  }, [arrow.id, index]);

  // Flight palette for this arrow:
  // In multicolor theme, match arrow's assigned color perfectly; otherwise use curated palette
  const flightGradientId = useMemo(() => `flight-grad-${arrow.id}`, [arrow.id]);
  const flightPalette = useMemo(() => {
    if (arrowTheme === 'multicolor') {
      const paletteMap = [0, 3, 5, 2, 1, 4, 5, 7, 6, 2];
      const pIdx = paletteMap[stablePaletteIdx % paletteMap.length];
      return FLIGHT_PALETTES[pIdx];
    }
    return getArrowFlightPalette(arrow.id, stablePaletteIdx);
  }, [arrow.id, stablePaletteIdx, arrowTheme]);

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

  // Flight data (extended path & cumulative lengths) computed lazily ONLY when this arrow flies.
  // Calculates dynamic distance ensuring the arrow's entire body & tail travel 100% past the screen viewport!
  const flightData = useMemo(() => {
    if (!isFlying) return null;
    const tip = basePixelPoints[basePixelPoints.length - 1];
    if (!tip) return null;

    const bWidth = boardWidth ?? 1000;
    const bHeight = boardHeight ?? 1000;
    const zScale = Math.max(0.1, zoomScale || 1);
    const px = pan?.x || 0;
    const py = pan?.y || 0;

    const winW = typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 800;
    const winH = typeof window !== 'undefined' && window.innerHeight > 0 ? window.innerHeight : 1200;

    // Viewport boundaries projected into SVG coordinate space
    const screenLeftSvg = bWidth / 2 - (winW / 2 + px) / zScale;
    const screenRightSvg = bWidth / 2 + (winW / 2 - px) / zScale;
    const screenTopSvg = bHeight / 2 - (winH / 2 + py) / zScale;
    const screenBottomSvg = bHeight / 2 + (winH / 2 - py) / zScale;

    // Generous margin (250px) past the screen edge ensuring the arrow's entire tail is well past the visible screen
    const margin = 250;

    let distToEdge = 1000;
    const dirLower = String(arrow.dir).toLowerCase();
    switch (dirLower) {
      case 'up':
        distToEdge = (tip.y - screenTopSvg) + margin;
        break;
      case 'down':
        distToEdge = (screenBottomSvg - tip.y) + margin;
        break;
      case 'left':
        distToEdge = (tip.x - screenLeftSvg) + margin;
        break;
      case 'right':
      default:
        distToEdge = (screenRightSvg - tip.x) + margin;
        break;
    }

    const exitDist = Math.max(Math.ceil(distToEdge), cellSize * 25, 1000);
    const pts = buildExtendedSnakePath(arrow.points, arrow.dir, cellSize, exitDist, cornerRadius);
    const lengths = getPolylineLengths(pts);
    return { pts, lengths, exitDistance: exitDist };
  }, [isFlying, arrow.points, arrow.dir, cellSize, cornerRadius, basePixelPoints, boardWidth, boardHeight, zoomScale, pan]);

  const centerPoint = useMemo(() => ({
    x: basePixelPoints.reduce((acc, p) => acc + p.x, 0) / Math.max(1, basePixelPoints.length),
    y: basePixelPoints.reduce((acc, p) => acc + p.y, 0) / Math.max(1, basePixelPoints.length),
  }), [basePixelPoints]);

  // High-performance direct-DOM parametric Snake slithering animation loop
  // Zero React state updates / zero React re-renders during flight!
  // Exact uniform physical velocity across all arrows (1600 px/sec) with linear smooth slithering
  useEffect(() => {
    if (isFlying && flightData) {
      const startTime = performance.now();
      // Constant uniform speed: 1600 px/sec (1.6 px/ms) for all arrows!
      const SPEED_PX_PER_SEC = 1600;
      const totalTravelDistance = originalLength + flightData.exitDistance;
      const duration = Math.max(250, Math.round((totalTravelDistance / SPEED_PX_PER_SEC) * 1000));

      const step = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // Linear constant velocity: every arrow moves at the exact same uniform speed with 0 jerk
        const eased = rawProgress;

        const travelDist = eased * totalTravelDistance;
        const startDist = travelDist;
        const endDist = Math.min(travelDist + originalLength, flightData.lengths.total);

        const sliced = slicePolyline(flightData.pts, startDist, endDist, flightData.lengths);
        if (sliced.points.length >= 2) {
          const newBodyPath = buildPolylinePixelPath(sliced.points);
          const newHeadTip = sliced.points[sliced.points.length - 1];
          const newTail = sliced.points[0];
          const newHeadPath = buildArrowHeadAtPoint(newHeadTip, sliced.headTangent, arrowHeadSize);

          if (bodyPathRef.current) {
            bodyPathRef.current.setAttribute('d', newBodyPath);
          }
          if (hitPathRef.current) {
            hitPathRef.current.setAttribute('d', newBodyPath);
          }
          if (headPathRef.current) {
            headPathRef.current.setAttribute('d', newHeadPath);
            headPathRef.current.style.transformOrigin = `${newHeadTip.x}px ${newHeadTip.y}px`;
          }

          // Dynamically track flight gradient from tail (light) to head (dark)!
          if (flightGradRef.current) {
            flightGradRef.current.setAttribute('x1', `${newTail.x}`);
            flightGradRef.current.setAttribute('y1', `${newTail.y}`);
            flightGradRef.current.setAttribute('x2', `${newHeadTip.x}`);
            flightGradRef.current.setAttribute('y2', `${newHeadTip.y}`);
          }
        }

        // Arrow remains completely visible, connected and solid until fully exiting off-screen
        if (rawProgress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          // When 100% past screen boundary, notify parent to safely clean up
          onFlightComplete?.(arrow.id);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);

      return () => {
        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }
  }, [isFlying, flightData, originalLength, cornerRadius, arrowHeadSize, arrow.id, onFlightComplete]);

  // Bounce-back recoil translations when collision occurs:
  // Smooth backward movement away from obstacle (prevents penetrating or overlapping into other arrows)
  const shakeX = isShaking ? [0, dc * 2.5, -dc * 9, -dc * 5, -dc * 1.5, 0] : 0;
  const shakeY = isShaking ? [0, dr * 2.5, -dr * 9, -dr * 5, -dr * 1.5, 0] : 0;

  const bodyPath = staticBodyPath;
  const headPath = staticHeadPath;
  const headTip = basePixelPoints[basePixelPoints.length - 1];

  // Multi-color gradient per individual arrow (flows from tail to head)
  const gradientId = useMemo(() => `arrow-grad-${arrow.id}`, [arrow.id]);
  const gradientPalette = useMemo(() => {
    return GRADIENT_PALETTES[index % GRADIENT_PALETTES.length];
  }, [index]);

  const gradientCoords = useMemo(() => {
    const tail = basePixelPoints[0];
    const head = basePixelPoints[basePixelPoints.length - 1];
    let x1 = tail.x;
    let y1 = tail.y;
    let x2 = head.x;
    let y2 = head.y;

    const dist = Math.hypot(x2 - x1, y2 - y1);
    // If tail and head are close (e.g. U-turn or tight bend), span bounding box in arrow direction
    if (dist < cellSize * 1.2) {
      let minX = tail.x, maxX = tail.x, minY = tail.y, maxY = tail.y;
      basePixelPoints.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
      const dirLower = String(arrow.dir).toLowerCase();
      if (dirLower === 'up') {
        x1 = (minX + maxX) / 2; y1 = maxY; x2 = (minX + maxX) / 2; y2 = minY;
      } else if (dirLower === 'down') {
        x1 = (minX + maxX) / 2; y1 = minY; x2 = (minX + maxX) / 2; y2 = maxY;
      } else if (dirLower === 'left') {
        x1 = maxX; y1 = (minY + maxY) / 2; x2 = minX; y2 = (minY + maxY) / 2;
      } else {
        x1 = minX; y1 = (minY + maxY) / 2; x2 = maxX; y2 = (minY + maxY) / 2;
      }
    }
    return { x1, y1, x2, y2 };
  }, [basePixelPoints, cellSize, arrow.dir]);

  // Multi-color palette assignment per arrow (stable across level progression)
  const multiColorStroke = MULTICOLOR_PALETTE[stablePaletteIdx];
  const gradientStroke = `url(#${gradientId})`;

  const defaultStrokeColor = arrowTheme === 'gradient'
    ? gradientStroke
    : arrowTheme === 'multicolor'
    ? multiColorStroke
    : (isDarkMode ? '#f8fafc' : '#0f172a');

  const hoverStrokeColor = arrowTheme === 'gradient'
    ? gradientStroke
    : arrowTheme === 'multicolor'
    ? multiColorStroke
    : (isDarkMode ? '#ffffff' : '#000000');

  const hintStrokeColor = isDarkMode ? '#38bdf8' : '#2563eb';
  const blockedStrokeColor = isDarkMode ? '#ef4444' : '#dc2626'; // Vibrant tactile Red on collision
  
  // In Palette mode, arrow keeps its solid palette stroke during flight
  const flyingStrokeColor = arrowTheme === 'multicolor'
    ? multiColorStroke
    : `url(#${flightGradientId})`;

  // Tip stop color for gradient theme ensures arrowhead is 100% solid, crisp, and matches the tip stop
  const gradientTipColor = gradientPalette[gradientPalette.length - 1];

  const defaultHeadColor = arrowTheme === 'gradient'
    ? gradientTipColor
    : arrowTheme === 'multicolor'
    ? multiColorStroke
    : (isDarkMode ? '#f8fafc' : '#0f172a');

  const hoverHeadColor = arrowTheme === 'gradient'
    ? gradientTipColor
    : arrowTheme === 'multicolor'
    ? multiColorStroke
    : (isDarkMode ? '#ffffff' : '#000000');

  const flightHeadColor = arrowTheme === 'gradient'
    ? gradientTipColor
    : arrowTheme === 'multicolor'
    ? multiColorStroke
    : flightPalette.dark;

  // When tapped:
  // - If successful and escaping: dynamic flight gradient (tail light, head dark)!
  // - If collision / wrong move: bounce back and flash red!
  const strokeColor = isFlying
    ? flyingStrokeColor
    : isBlocked
    ? blockedStrokeColor
    : isHinted
    ? hintStrokeColor
    : isHovered
    ? hoverStrokeColor
    : defaultStrokeColor;

  const headColor = isFlying
    ? flightHeadColor
    : isBlocked
    ? blockedStrokeColor
    : isHinted
    ? hintStrokeColor
    : isHovered
    ? hoverHeadColor
    : defaultHeadColor;

  // Press-and-hold: Trajectory guide appears when tapped & held down!
  const holdTimeoutRef = useRef<number | null>(null);
  const pointerStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearHold = useCallback(() => {
    if (holdTimeoutRef.current !== null) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    pointerStartPosRef.current = null;
    onHoverEnd?.();
  }, [onHoverEnd]);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current !== null) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isFlying) return;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    // Reveal transparent trajectory guide after 120ms of continuous hold
    holdTimeoutRef.current = window.setTimeout(() => {
      onHoverStart?.(arrow);
    }, 120);
  }, [isFlying, arrow, onHoverStart]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerStartPosRef.current) {
      const dist = Math.hypot(e.clientX - pointerStartPosRef.current.x, e.clientY - pointerStartPosRef.current.y);
      if (dist > 14) {
        clearHold();
      }
    }
  }, [clearHold]);

  const arrangeDelay = Math.min(0.45, (index || 0) * 0.028);

  const isDense = cellSize < 26;

  return (
    <motion.g
      ref={groupRef}
      id={`maze-arrow-${arrow.id}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearHold}
      onPointerCancel={clearHold}
      onPointerLeave={clearHold}
      onClick={(e) => {
        if (isFlying) return;
        e.stopPropagation();
        clearHold();
        onClick(arrow);
      }}
      initial={isDense ? false : {
        opacity: 0,
        scale: 0.35,
        y: -10,
      }}
      animate={{
        opacity: 1,
        scale: isFlying ? [1, 1.12, 1.04] : (isShaking ? [1, 0.94, 1.05, 1] : 1),
        x: isFlying ? 0 : (isShaking ? shakeX : 0),
        y: isFlying ? 0 : (isShaking ? shakeY : 0),
      }}
      transition={{
        opacity: { duration: 0.2, delay: isDense ? 0 : arrangeDelay },
        scale: isFlying
          ? { duration: 0.25, ease: 'easeOut' }
          : isShaking
          ? { duration: 0.42, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 450, damping: 22, delay: isDense ? 0 : arrangeDelay },
        y: isShaking
          ? { duration: 0.36, ease: [0.25, 1, 0.5, 1] }
          : { type: 'spring', stiffness: 450, damping: 22, delay: isDense ? 0 : arrangeDelay },
        x: isShaking
          ? { duration: 0.36, ease: [0.25, 1, 0.5, 1] }
          : { duration: 0.1 },
      }}
      style={{
        transformOrigin: `${centerPoint.x}px ${centerPoint.y}px`,
        // Clean borderless exit: zero drop-shadow during flight!
        filter: isFlying
          ? 'none'
          : isBlocked
          ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.65))'
          : isHovered
          ? (isDarkMode ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.45))' : 'drop-shadow(0 2px 4px rgba(15, 23, 42, 0.25))')
          : (isDarkMode ? 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7))' : 'none'),
        willChange: isFlying || isShaking ? 'transform, opacity' : 'auto',
      }}
      className={isFlying ? "pointer-events-none select-none" : "cursor-pointer select-none"}
    >
      {/* SVG linear gradient definitions */}
      <defs>
        {/* Dynamic Flight Gradient: Tail is LIGHT, Head is DARK, or Rainbow if gradient theme */}
        <linearGradient
          ref={flightGradRef}
          id={flightGradientId}
          x1={basePixelPoints[0]?.x ?? 0}
          y1={basePixelPoints[0]?.y ?? 0}
          x2={headTip.x}
          y2={headTip.y}
          gradientUnits="userSpaceOnUse"
        >
          {arrowTheme === 'gradient' ? (
            gradientPalette.map((col, sIdx) => (
              <stop
                key={sIdx}
                offset={`${(sIdx / (gradientPalette.length - 1)) * 100}%`}
                stopColor={col}
              />
            ))
          ) : (
            <>
              <stop offset="0%" stopColor={flightPalette.light} />
              <stop offset="45%" stopColor={flightPalette.mid} />
              <stop offset="100%" stopColor={flightPalette.dark} />
            </>
          )}
        </linearGradient>

        {/* SVG linear gradient definition when in multi-color gradient theme */}
        {arrowTheme === 'gradient' && (
          <linearGradient
            id={gradientId}
            x1={gradientCoords.x1}
            y1={gradientCoords.y1}
            x2={gradientCoords.x2}
            y2={gradientCoords.y2}
            gradientUnits="userSpaceOnUse"
          >
            {gradientPalette.map((col, sIdx) => (
              <stop
                key={sIdx}
                offset={`${(sIdx / (gradientPalette.length - 1)) * 100}%`}
                stopColor={col}
              />
            ))}
          </linearGradient>
        )}
      </defs>

      {/* Generous invisible stroke area for easy tap & click interaction */}
      <path
        ref={hitPathRef}
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
          ref={bodyPathRef}
          d={bodyPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <motion.path
          ref={bodyPathRef}
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
          ref={headPathRef}
          d={headPath}
          fill={headColor}
          stroke={headColor}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      ) : (
        <motion.path
          ref={headPathRef}
          d={headPath}
          fill={headColor}
          stroke={headColor}
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
