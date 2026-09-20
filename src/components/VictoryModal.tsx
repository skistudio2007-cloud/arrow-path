import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Home, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelData } from '../types';
import { isHardBossLevel } from '../utils/levels';
import { LanguageCode, t } from '../utils/translations';

interface VictoryModalProps {
  isOpen: boolean;
  level: LevelData;
  moves: number;
  hasNextLevel: boolean;
  lang?: LanguageCode;
  onNextLevel: () => void;
  onReplay: () => void;
  onGoHome?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  level,
  moves,
  hasNextLevel,
  lang = 'en',
  onNextLevel,
  onReplay,
  onGoHome,
}) => {
  const isHard = isHardBossLevel(level.id) || level.name.includes('Hard');

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.58 },
          colors: isHard
            ? ['#ef4444', '#f59e0b', '#dc2626', '#f97316', '#fbbf24']
            : ['#4361ee', '#f59e0b', '#10b981', '#6366f1', '#ec4899'],
        });
      } catch {
        // Ignore if canvas-confetti fails
      }
    }
  }, [isOpen, isHard]);

  const minMoves = level.minMoves || level.arrows.length;
  let stars = 1;
  if (moves <= minMoves) {
    stars = 3;
  } else if (moves <= Math.ceil(minMoves * 1.35)) {
    stars = 2;
  }

  const ratingLabel =
    stars === 3
      ? t(lang, 'flawless')
      : stars === 2
      ? t(lang, 'greatJob')
      : t(lang, 'cleared');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-[2px] select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="w-full max-w-[340px] sm:max-w-sm bg-white rounded-[32px] p-6 sm:p-7 shadow-2xl shadow-slate-900/15 border border-slate-100 text-center relative max-h-[92dvh] overflow-y-auto"
          >
            {/* Top Emblem Badge - Clean White & Gold Circle */}
            <div className="relative z-10 flex justify-center mb-3">
              {isHard ? (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.08, type: 'spring', stiffness: 420, damping: 22 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-b from-rose-50 to-rose-100/90 flex items-center justify-center shadow-md shadow-rose-500/15 border-2 border-rose-200"
                >
                  <Flame className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-xs" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.08, type: 'spring', stiffness: 420, damping: 22 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-50 to-amber-100/90 flex items-center justify-center shadow-md shadow-amber-500/15 border-2 border-amber-200"
                >
                  <Sparkles className="w-8 h-8 text-amber-500 fill-amber-400 drop-shadow-xs" />
                </motion.div>
              )}
            </div>

            {/* Level Cleared Title */}
            <div className="relative z-10">
              <span className="font-outfit text-[11px] font-bold tracking-[0.22em] uppercase text-slate-400">
                {t(lang, 'level')} {level.id}
              </span>
              <h2 className="font-classic text-2xl sm:text-[26px] font-bold tracking-wide text-slate-900 mt-0.5 uppercase">
                {isHard ? t(lang, 'hardLevelCleared') : t(lang, 'levelCleared')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto leading-relaxed">
                {isHard ? t(lang, 'hardLevelClearedDesc') : t(lang, 'allArrowsClearedDesc')}
              </p>
            </div>

            {/* Crisp Animated Stars Row */}
            <div className="relative z-10 flex justify-center items-center gap-2.5 my-4">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= stars;
                const isCenter = starIdx === 2;
                return (
                  <motion.div
                    key={starIdx}
                    initial={{ scale: 0, y: 10 }}
                    animate={{
                      scale: isEarned ? (isCenter ? 1.15 : 1) : isCenter ? 1.05 : 0.9,
                      y: isCenter ? -4 : 0,
                    }}
                    transition={{
                      delay: 0.12 + starIdx * 0.1,
                      type: 'spring',
                      stiffness: 450,
                      damping: 18,
                    }}
                    className={`relative p-2 rounded-2xl transition-all duration-300 ${
                      isEarned
                        ? 'bg-amber-50/90 text-amber-500 shadow-xs border border-amber-200/80'
                        : 'bg-slate-50 text-slate-300 border border-slate-100'
                    }`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        isEarned
                          ? 'fill-amber-400 stroke-amber-500 filter drop-shadow-xs'
                          : 'stroke-slate-300 fill-slate-100/50'
                      }`}
                      strokeWidth="2"
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Rating Tag */}
            <div className="relative z-10 flex justify-center mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/70 shadow-2xs">
                {ratingLabel}
              </span>
            </div>

            {/* Clean White Stats Pill */}
            <div className="relative z-10 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 mb-5 grid grid-cols-2 divide-x divide-slate-200/60">
              <div className="px-2">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {t(lang, 'moves')}
                </div>
                <div className="text-xl font-black text-slate-900 tabular-nums font-outfit">
                  {moves}
                </div>
              </div>
              <div className="px-2">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {t(lang, 'parTarget')}
                </div>
                <div className="text-xl font-black text-slate-900 tabular-nums font-outfit">
                  {minMoves}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col gap-2.5">
              {hasNextLevel ? (
                <button
                  type="button"
                  id="btn-next-level"
                  onClick={onNextLevel}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-[#5367fc] to-[#475bf7] hover:from-[#4659eb] hover:to-[#3b4de0] text-white text-sm font-extrabold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5367fc]/25 cursor-pointer"
                >
                  <span>{t(lang, 'nextLevel')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">
                  {t(lang, 'allLevelsCelebration')}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-replay-level"
                  onClick={onReplay}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{t(lang, 'replayLevel')}</span>
                </button>

                {onGoHome && (
                  <button
                    type="button"
                    id="btn-home-victory"
                    onClick={onGoHome}
                    className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs border border-slate-200"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{t(lang, 'home')}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
