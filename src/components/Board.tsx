import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { GridCoord, MazeArrow, ThemeConfig } from '../types';
import { MazeArrowRenderer } from './MazeArrowRenderer';
import { TrajectoryLine } from './TrajectoryLine';

export interface SinkingDotEvent {
  id: string;
  points: GridCoord[];
}



interface BoardProps {
  levelId?: number;
  rows: number;
  cols: number;
  arrows: MazeArrow[];
  theme?: ThemeConfig;
  flyingArrowIds: Set<string>;
  shakingArrowId: string | null;
  blockedTargetId: string | null;
  hintArrowId: string | null;
  sinkingEvents?: SinkingDotEvent[];
  showTrajectory?: boolean;
  onArrowClick: (arrow: MazeArrow) => void;
}

const MIN_ZOOM = 0.9; // In-zoom / Out-zoom minimum: 90%
const MAX_ZOOM = 1.5; // Out-zoom / In-zoom maximum: 150%

interface StaticGridDotsProps {
  rows: number;
  cols: number;
  baseCellSize: number;
  gridDotColor: string;
}

const StaticGridDots: React.FC<StaticGridDotsProps> = React.memo(({
  rows,
  cols,
  baseCellSize,
  gridDotColor,
}) => {
  const dotRadius = Math.max(1.8, Math.min(3, baseCellSize * 0.06));
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const cy = r * baseCellSize + baseCellSize / 2;
    for (let c = 0; c < cols; c++) {
      const cx = c * baseCellSize + baseCellSize / 2;
      dots.push(
        <circle
          key={`sdot-${r}-${c}`}
          cx={cx}
          cy={cy}
          r={dotRadius}
          fill={gridDotColor}
          opacity="0.30"
        />
      );
    }
  }
  return <>{dots}</>;
});

export const Board: React.FC<BoardProps> = ({
  levelId,
  rows,
  cols,
  arrows,
  theme,
  flyingArrowIds,
  shakingArrowId,
  blockedTargetId,
  hintArrowId,
  sinkingEvents = [],
  showTrajectory = true,
  onArrowClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [hoveredArrow, setHoveredArrow] = useState<MazeArrow | null>(null);
  const [baseCellSize, setBaseCellSize] = useState<number>(36);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [isActivelyDragging, setIsActivelyDragging] = useState<boolean>(false);

  const handleHoverStart = useCallback((a: MazeArrow) => {
    setHoveredArrow(a);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredArrow(null);
  }, []);

  const zoomScaleRef = useRef<number>(1);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(1);
  const touchStartMidRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1-Finger drag tracking & tap vs scroll discrimination
  const isDraggingRef = useRef<boolean>(false);
  const singleTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const lastScrollEndTimeRef = useRef<number>(0);

  // Keep refs synced with state
  useEffect(() => {
    zoomScaleRef.current = zoomScale;
  }, [zoomScale]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  // Responsive base cell size calculation adapting dynamically to available dimensions
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Available dimensions: dynamically measure parent arena or fallback to responsive window ratios
      const parentRect = container?.parentElement?.getBoundingClientRect();
      const availW = parentRect ? Math.max(250, parentRect.width - 24) : Math.min(screenW - 24, 560);
      const availH = parentRect ? Math.max(260, parentRect.height - 20) : Math.min(screenH * 0.64, 660);

      const maxCellW = Math.floor(availW / cols);
      const maxCellH = Math.floor(availH / rows);

      // Adaptive cell sizing:
      // Smaller boards (3-4 cols) get comfortable larger cells (up to 68px) so they don't look tiny with excessive empty space.
      // Larger dense boards scale down proportionally to fit screen bounds without clipping.
      const targetMaxCell = Math.min(68, Math.max(36, Math.floor(availW / Math.max(cols, 4.2))));
      const computed = Math.min(maxCellW, maxCellH, targetMaxCell);

      setBaseCellSize(Math.max(18, computed));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [rows, cols]);

  // Reset zoom scale and pan when level changes
  useEffect(() => {
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
    setIsPinching(false);
    setIsActivelyDragging(false);
  }, [rows, cols, levelId]);

  const boardWidth = cols * baseCellSize;
  const boardHeight = rows * baseCellSize;

  const boardWidthRef = useRef<number>(boardWidth);
  const boardHeightRef = useRef<number>(boardHeight);

  useEffect(() => {
    boardWidthRef.current = boardWidth;
    boardHeightRef.current = boardHeight;
  }, [boardWidth, boardHeight]);

  // Scrolling boundaries: gives comfortable sliding space around the level content
  // so the user can smoothly slide and inspect the board, while preventing it from flying into empty space.
  const getScrollBounds = useCallback((scale = zoomScaleRef.current) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    const viewportW = viewport.clientWidth;
    const viewportH = viewport.clientHeight;
    const contentW = boardWidthRef.current * scale;
    const contentH = boardHeightRef.current * scale;

    // Extra room so the level screen can be slid comfortably in all directions
    const baseSlackX = Math.max(75, Math.round(viewportW * 0.18));
    const baseSlackY = Math.max(85, Math.round(viewportH * 0.18));

    const maxDiffX = Math.max(0, (contentW - viewportW) / 2) + baseSlackX;
    const maxDiffY = Math.max(0, (contentH - viewportH) / 2) + baseSlackY;

    return {
      minX: -maxDiffX,
      maxX: maxDiffX,
      minY: -maxDiffY,
      maxY: maxDiffY,
    };
  }, []);

  const clampPanToBounds = useCallback((p: { x: number; y: number }, scale = zoomScaleRef.current) => {
    const { minX, maxX, minY, maxY } = getScrollBounds(scale);
    return {
      x: +Math.min(maxX, Math.max(minX, p.x)).toFixed(1),
      y: +Math.min(maxY, Math.max(minY, p.y)).toFixed(1),
    };
  }, [getScrollBounds]);

  const applyDragWithDamping = useCallback((raw: { x: number; y: number }, scale = zoomScaleRef.current) => {
    const { minX, maxX, minY, maxY } = getScrollBounds(scale);
    let x = raw.x;
    let y = raw.y;
    const maxOverscroll = 45; // Smooth natural overscroll elasticity

    if (x > maxX) {
      const over = x - maxX;
      x = maxX + Math.min(maxOverscroll, over * 0.35);
    } else if (x < minX) {
      const over = minX - x;
      x = minX - Math.min(maxOverscroll, over * 0.35);
    }

    if (y > maxY) {
      const over = y - maxY;
      y = maxY + Math.min(maxOverscroll, over * 0.35);
    } else if (y < minY) {
      const over = minY - y;
      y = minY - Math.min(maxOverscroll, over * 0.35);
    }

    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  }, [getScrollBounds]);

  const clampPanRef = useRef(clampPanToBounds);
  const applyDragRef = useRef(applyDragWithDamping);
  useEffect(() => {
    clampPanRef.current = clampPanToBounds;
    applyDragRef.current = applyDragWithDamping;
  }, [clampPanToBounds, applyDragWithDamping]);

  // Safe arrow click: prevents clicks if user was scrolling/swiping
  const handleSafeArrowClick = useCallback(
    (arrow: MazeArrow) => {
      if (hasMovedRef.current || Date.now() - lastScrollEndTimeRef.current < 250) {
        return; // User was scrolling, ignore click!
      }
      onArrowClick(arrow);
    },
    [onArrowClick]
  );

  // 1-Finger Scroll and 2-Finger Pinch Zoom & Slide Gestures
  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Two-Finger Gesture: Pinch Zoom & Slide
        if (e.cancelable) e.preventDefault();

        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        touchStartDistRef.current = dist;
        touchStartScaleRef.current = zoomScaleRef.current;
        touchStartMidRef.current = { x: midX, y: midY };
        touchStartPanRef.current = panRef.current;

        isDraggingRef.current = false;
        singleTouchStartRef.current = null;
        hasMovedRef.current = true; // Two fingers is never an arrow tap
        setIsPinching(true);
        setIsActivelyDragging(true);
      } else if (e.touches.length === 1) {
        // One-Finger Gesture: can be either tap OR scroll/slide
        isDraggingRef.current = true;
        hasMovedRef.current = false;
        singleTouchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        touchStartPanRef.current = panRef.current;
      }
    };

    let rafId: number | null = null;
    let pendingPan: { x: number; y: number } | null = null;
    let pendingZoom: number | null = null;

    const flushPending = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (pendingZoom !== null) {
        setZoomScale(pendingZoom);
        pendingZoom = null;
      }
      if (pendingPan !== null) {
        setPan(pendingPan);
        pendingPan = null;
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (pendingZoom !== null) {
          setZoomScale(pendingZoom);
          pendingZoom = null;
        }
        if (pendingPan !== null) {
          setPan(pendingPan);
          pendingPan = null;
        }
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 1. Two-Finger Zoom & Slide
      if (
        e.touches.length === 2 &&
        touchStartDistRef.current &&
        touchStartDistRef.current > 0 &&
        touchStartMidRef.current
      ) {
        if (e.cancelable) e.preventDefault();

        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scaleFactor = currentDist / touchStartDistRef.current;
        const newScale = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, +(touchStartScaleRef.current * scaleFactor).toFixed(2))
        );

        const currentMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const currentMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const deltaX = currentMidX - touchStartMidRef.current.x;
        const deltaY = currentMidY - touchStartMidRef.current.y;

        const rawPan = {
          x: +(touchStartPanRef.current.x + deltaX).toFixed(1),
          y: +(touchStartPanRef.current.y + deltaY).toFixed(1),
        };
        pendingZoom = newScale;
        pendingPan = applyDragRef.current(rawPan, newScale);
        scheduleUpdate();
      } else if (
        e.touches.length === 1 &&
        isDraggingRef.current &&
        singleTouchStartRef.current
      ) {
        // 2. One-Finger Smooth Scroll / Slide anywhere (even on arrows!)
        const deltaX = e.touches[0].clientX - singleTouchStartRef.current.x;
        const deltaY = e.touches[0].clientY - singleTouchStartRef.current.y;
        const moveDist = Math.hypot(deltaX, deltaY);

        // If moved more than 5px, it is definitely a scroll, not an accidental tap!
        if (moveDist > 5 || hasMovedRef.current) {
          if (!hasMovedRef.current) {
            hasMovedRef.current = true;
            setIsActivelyDragging(true);
          }
          if (e.cancelable) e.preventDefault();

          const rawPan = {
            x: +(touchStartPanRef.current.x + deltaX).toFixed(1),
            y: +(touchStartPanRef.current.y + deltaY).toFixed(1),
          };
          pendingPan = applyDragRef.current(rawPan, zoomScaleRef.current);
          scheduleUpdate();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchStartDistRef.current = null;
        touchStartMidRef.current = null;
        setIsPinching(false);
      }
      if (e.touches.length === 0) {
        flushPending();
        if (hasMovedRef.current) {
          lastScrollEndTimeRef.current = Date.now();
        }
        isDraggingRef.current = false;
        singleTouchStartRef.current = null;
        setIsActivelyDragging(false);

        // Return smoothly within valid boundaries if overscrolled
        setPan((prev) => clampPanRef.current(prev, zoomScaleRef.current));

        // Keep hasMovedRef for 200ms so synthetic click is safely suppressed
        setTimeout(() => {
          hasMovedRef.current = false;
        }, 220);
      }
    };

    // Desktop Mouse Drag / Scroll Support
    let isMouseDown = false;
    let mouseStartPos = { x: 0, y: 0 };
    let mouseStartPan = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      // Only left click
      if (e.button !== 0) return;
      isMouseDown = true;
      mouseStartPos = { x: e.clientX, y: e.clientY };
      mouseStartPan = panRef.current;
      hasMovedRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - mouseStartPos.x;
      const deltaY = e.clientY - mouseStartPos.y;
      if (Math.hypot(deltaX, deltaY) > 5 || hasMovedRef.current) {
        if (!hasMovedRef.current) {
          hasMovedRef.current = true;
          setIsActivelyDragging(true);
        }
        const rawPan = {
          x: +(mouseStartPan.x + deltaX).toFixed(1),
          y: +(mouseStartPan.y + deltaY).toFixed(1),
        };
        pendingPan = applyDragRef.current(rawPan, zoomScaleRef.current);
        scheduleUpdate();
      }
    };

    const handleMouseUp = () => {
      if (isMouseDown) {
        isMouseDown = false;
        flushPending();
        setIsActivelyDragging(false);
        if (hasMovedRef.current) {
          lastScrollEndTimeRef.current = Date.now();
        }
        // Return smoothly within valid boundaries if overscrolled
        setPan((prev) => clampPanRef.current(prev, zoomScaleRef.current));
        setTimeout(() => {
          hasMovedRef.current = false;
        }, 220);
      }
    };

    const targetElements = [container, viewport].filter(Boolean) as HTMLElement[];
    targetElements.forEach((el) => {
      el.addEventListener('touchstart', handleTouchStart, { passive: false });
      el.addEventListener('touchmove', handleTouchMove, { passive: false });
      el.addEventListener('touchend', handleTouchEnd);
      el.addEventListener('touchcancel', handleTouchEnd);
      el.addEventListener('mousedown', handleMouseDown);
    });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      targetElements.forEach((el) => {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
        el.removeEventListener('touchcancel', handleTouchEnd);
        el.removeEventListener('mousedown', handleMouseDown);
      });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const gridDotColor = theme?.gridDotColor || '#94a3b8';

  // Sinking dots overlay: ONLY renders and animates the 3-8 dots that are actually sinking!
  const sinkingDotsOverlay = useMemo(() => {
    if (!sinkingEvents || sinkingEvents.length === 0) return null;
    const dotRadius = Math.max(1.8, Math.min(3, baseCellSize * 0.06));

    return sinkingEvents.flatMap((event) =>
      event.points.map((pt, idx) => {
        const cx = pt.c * baseCellSize + baseCellSize / 2;
        const cy = pt.r * baseCellSize + baseCellSize / 2;
        return (
          <motion.circle
            key={`${event.id}-${pt.r}-${pt.c}`}
            cx={cx}
            cy={cy}
            r={dotRadius}
            fill={gridDotColor}
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{
              scale: [1, 0.15, 1.35, 1],
              opacity: [0.3, 0.85, 0.5, 0.3],
            }}
            transition={{
              duration: 0.44,
              delay: idx * 0.055,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        );
      })
    );
  }, [sinkingEvents, baseCellSize, gridDotColor]);

  // Memoize active non-flying arrows for trajectory calculations
  const nonFlyingArrows = useMemo(
    () => arrows.filter((a) => !flyingArrowIds.has(a.id)),
    [arrows, flyingArrowIds]
  );

  return (
    <div
      ref={containerRef}
      onWheel={(e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = -e.deltaY * 0.003;
          setZoomScale((prev) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(prev + delta).toFixed(2))));
        } else {
          // Regular wheel scrolls the board strictly within boundaries
          setPan((prev) => {
            const rawPan = {
              x: +(prev.x - e.deltaX * 0.8).toFixed(1),
              y: +(prev.y - e.deltaY * 0.8).toFixed(1),
            };
            return clampPanRef.current(rawPan, zoomScaleRef.current);
          });
        }
      }}
      className="w-full flex-1 flex flex-col items-center justify-center select-none py-1 relative touch-none min-h-0"
    >
      {/* Scrollable & Pannable Viewport */}
      <div
        ref={viewportRef}
        className="w-full flex-1 max-h-full overflow-visible flex items-center justify-center p-1.5 sm:p-2 relative touch-none select-none cursor-grab active:cursor-grabbing"
      >
        {/* CSS Hardware Transform: Smooth 1-finger scroll & 2-finger zoom/slide */}
        <div
          className={`relative ${isActivelyDragging ? 'transition-none' : 'transition-transform duration-200 ease-out'}`}
          style={{
            width: `${boardWidth}px`,
            height: `${boardHeight}px`,
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <svg
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
            className="w-full h-full overflow-visible"
            style={{ overflow: 'visible' }}
          >
            {/* Clean minimal grid dots with isolated animated overlay */}
            <g className="pointer-events-none">
              <StaticGridDots
                rows={rows}
                cols={cols}
                baseCellSize={baseCellSize}
                gridDotColor={gridDotColor}
              />
              {sinkingDotsOverlay}
            </g>

            {/* Trajectory Guide for hovered arrow */}
            {showTrajectory && hoveredArrow && arrows.some((a) => a.id === hoveredArrow.id) && (
              <TrajectoryLine
                arrow={hoveredArrow}
                allArrows={nonFlyingArrows}
                rows={rows}
                cols={cols}
                cellSize={baseCellSize}
              />
            )}

            {/* Render all maze arrows */}
            {arrows.map((arrow, index) => (
              <MazeArrowRenderer
                key={`${levelId ?? 0}-${arrow.id}`}
                arrow={arrow}
                index={index}
                cellSize={baseCellSize}
                isHinted={hintArrowId === arrow.id}
                isShaking={shakingArrowId === arrow.id}
                isBlocked={blockedTargetId === arrow.id || shakingArrowId === arrow.id}
                isFlying={flyingArrowIds.has(arrow.id)}
                isHovered={hoveredArrow?.id === arrow.id}
                onClick={handleSafeArrowClick}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
