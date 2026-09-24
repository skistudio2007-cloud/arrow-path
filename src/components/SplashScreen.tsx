import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/audio';
import { buildArrowHeadAtPoint, buildFilletedPixelPath, PixelPoint } from '../utils/snakeGeometry';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'puzzle' | 'arrange' | 'settle'>('puzzle');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // 1. Arrows finish escaping -> Letters of ARROW PATH PUZZLE arrange in center
    const timerArrange = setTimeout(() => {
      setStage('arrange');
      soundManager.playArrange();
    }, 780);

    // 2. Letters settle and status line shows
    const timerSettle = setTimeout(() => {
      setStage('settle');
    }, 1150);

    // 3. Smooth exit fade into the main screen
    const timerOutro = setTimeout(() => {
      setIsVisible(false);
    }, 1700);

    const timerFinish = setTimeout(() => {
      onComplete();
    }, 2080);

    return () => {
      clearTimeout(timerArrange);
      clearTimeout(timerSettle);
      clearTimeout(timerOutro);
      clearTimeout(timerFinish);
    };
  }, [onComplete]);

  // Exact in-game level arrow geometry
  // Arrow 1: Facing UP (↑) from (80, 72) to (80, 32)
  const arrow1Points: PixelPoint[] = [
    { x: 80, y: 72 },
    { x: 80, y: 32 },
  ];
  const arrow1Body = buildFilletedPixelPath(arrow1Points, 8);
  const arrow1Head = buildArrowHeadAtPoint({ x: 80, y: 32 }, { x: 0, y: -1 }, 13);

  // Arrow 2: Facing RIGHT (→) from (80, 72) to (126, 72)
  const arrow2Points: PixelPoint[] = [
    { x: 80, y: 72 },
    { x: 126, y: 72 },
  ];
  const arrow2Body = buildFilletedPixelPath(arrow2Points, 8);
  const arrow2Head = buildArrowHeadAtPoint({ x: 126, y: 72 }, { x: 1, y: 0 }, 13);

  // Arrow 3: Behind Arrow 2, Facing RIGHT (→) from (34, 72) to (76, 72) - follows Arrow 2
  const arrow3Points: PixelPoint[] = [
    { x: 34, y: 72 },
    { x: 76, y: 72 },
  ];
  const arrow3Body = buildFilletedPixelPath(arrow3Points, 8);
  const arrow3Head = buildArrowHeadAtPoint({ x: 76, y: 72 }, { x: 1, y: 0 }, 13);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const arrowMainColor = isDark ? '#f8fafc' : '#0f172a';
  const arrowAccentColor = isDark ? '#818cf8' : '#4f46e5';

  const arrowLetters = ['A', 'R', 'R', 'O', 'W'];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="app-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-[#ffffff] dark:bg-[#0d111c] text-[#0f172a] dark:text-white flex flex-col items-center justify-center select-none overflow-hidden"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 50% 48%, #151d2f 0%, #0d111c 60%, #080b12 100%)'
              : 'radial-gradient(circle at 50% 48%, #ffffff 0%, #f8faff 50%, #eef4fc 100%)',
          }}
        >
          {/* Clean soft ambient lighting blooms - Completely dot-free! */}
          <div className="absolute w-96 h-96 rounded-full bg-blue-100/40 dark:bg-blue-900/20 blur-3xl pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full bg-indigo-50/50 dark:bg-indigo-950/30 blur-2xl pointer-events-none" />

          {/* Main Stage */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Center Container: 3 Level Arrows Escaping (Borderless Arrow Area) */}
            <div className="relative w-48 h-36 flex items-center justify-center">
              {/* Sleek Floating Board Card without any box border */}
              <motion.div
                animate={{
                  opacity: stage === 'puzzle' ? 1 : 0,
                  scale: stage === 'puzzle' ? 1 : 0.88,
                  y: stage === 'puzzle' ? 0 : -8,
                }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-42 h-34 rounded-3xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl shadow-blue-500/8 border-none p-2 flex items-center justify-center overflow-visible"
              >
                {/* Soft pulse glow inside the board */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{ scale: [0.8, 1.2, 0.9], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-28 h-20 rounded-full bg-blue-50/70 dark:bg-blue-950/50 blur-xl pointer-events-none"
                />

                <svg
                  viewBox="0 0 160 144"
                  className="w-full h-full overflow-visible"
                  style={{ filter: isDark ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6))' : 'drop-shadow(0 2px 6px rgba(15, 23, 42, 0.12))' }}
                >
                  {/* ARROW 1: Facing UP (↑) - Escapes first with snappy acceleration */}
                  <motion.g
                    initial={{ y: 0, opacity: 1, scaleY: 1 }}
                    animate={{
                      y: [0, -6, -145],
                      opacity: [1, 1, 0],
                      scaleY: [1, 0.95, 1.2],
                    }}
                    transition={{
                      duration: 0.54,
                      delay: 0.16,
                      ease: [0.25, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: '80px 32px' }}
                  >
                    <path
                      d={arrow1Body}
                      fill="none"
                      stroke={arrowMainColor}
                      strokeWidth="4.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={arrow1Head}
                      fill={arrowMainColor}
                      stroke={arrowMainColor}
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  </motion.g>

                  {/* ARROW 2: Facing RIGHT (→) - Escapes second, clearing the row */}
                  <motion.g
                    initial={{ x: 0, opacity: 1, scaleX: 1 }}
                    animate={{
                      x: [0, -4, 155],
                      opacity: [1, 1, 0],
                      scaleX: [1, 0.96, 1.22],
                    }}
                    transition={{
                      duration: 0.54,
                      delay: 0.34,
                      ease: [0.25, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: '126px 72px' }}
                  >
                    <path
                      d={arrow2Body}
                      fill="none"
                      stroke={arrowMainColor}
                      strokeWidth="4.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={arrow2Head}
                      fill={arrowMainColor}
                      stroke={arrowMainColor}
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  </motion.g>

                  {/* ARROW 3: Follows Arrow 2 along cleared row with sapphire blue accent */}
                  <motion.g
                    initial={{ x: 0, opacity: 1, scaleX: 1 }}
                    animate={{
                      x: [0, -3, 195],
                      opacity: [1, 1, 0],
                      scaleX: [1, 0.96, 1.25],
                    }}
                    transition={{
                      duration: 0.58,
                      delay: 0.5,
                      ease: [0.25, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: '76px 72px' }}
                  >
                    <path
                      d={arrow3Body}
                      fill="none"
                      stroke={arrowAccentColor}
                      strokeWidth="4.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={arrow3Head}
                      fill={arrowAccentColor}
                      stroke={arrowAccentColor}
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  </motion.g>
                </svg>

                {/* Subtle success pulse bloom right as Arrow 3 clears */}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{
                    scale: stage !== 'puzzle' ? [0.6, 1.5] : 0.4,
                    opacity: stage !== 'puzzle' ? [0.35, 0] : 0,
                  }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute w-24 h-24 rounded-full bg-indigo-400/20 blur-sm pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Typography: ARROW Letters Arrange Seamlessly (Exact Match with Home Screen) */}
            <div className="flex flex-col items-center text-center mt-3 min-h-[90px] justify-center">
              {/* Animated Letters: A R R O W arranging in place with spring physics */}
              <div className="flex items-center justify-center select-none overflow-hidden">
                {arrowLetters.map((letter, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 18, scale: 0.82 }}
                    animate={{
                      opacity: stage !== 'puzzle' ? 1 : 0,
                      y: stage !== 'puzzle' ? 0 : 18,
                      scale: stage !== 'puzzle' ? 1 : 0.82,
                    }}
                    transition={{
                      delay: 0.04 + idx * 0.05,
                      type: 'spring',
                      stiffness: 440,
                      damping: 22,
                    }}
                    className="font-classic text-4xl sm:text-5xl font-semibold text-[#0f172a] dark:text-white uppercase inline-block"
                    style={{
                      letterSpacing: idx === arrowLetters.length - 1 ? '0' : '0.22em',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Subtitle: — PATH PUZZLE — matching the exact Home screen typography */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: stage !== 'puzzle' ? 0.8 : 0,
                  y: stage !== 'puzzle' ? 0 : 8,
                }}
                transition={{ delay: 0.35, duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-2 mt-2"
              >
                <span className="w-4 h-[1px] bg-[#94a3b8] dark:bg-slate-600" />
                <span className="font-outfit text-[10px] sm:text-[11px] font-medium tracking-[0.28em] text-[#475569] dark:text-slate-400 uppercase">
                  PATH PUZZLE
                </span>
                <span className="w-4 h-[1px] bg-[#94a3b8] dark:bg-slate-600" />
              </motion.div>
            </div>

            {/* Subtitle Tag */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{
                opacity: stage === 'settle' ? 0.75 : 0,
                y: stage === 'settle' ? 0 : 4,
              }}
              transition={{ duration: 0.3 }}
              className="text-[10px] font-semibold tracking-wider text-[#818ea8] mt-3 uppercase"
            >
              3,000 Levels • Pure Puzzle
            </motion.p>

            {/* Modern Minimalist Laser Capsule Loading Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: stage !== 'puzzle' ? 1 : 0,
                width: stage !== 'puzzle' ? 120 : 0,
              }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="h-1 bg-[#e2e8f5] rounded-full mt-6 overflow-hidden relative"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 0.85,
                  ease: 'easeInOut',
                }}
                className="h-full w-14 bg-gradient-to-r from-transparent via-[#4f46e5] to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
