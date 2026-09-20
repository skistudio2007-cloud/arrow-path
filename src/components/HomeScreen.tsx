import React from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { StreakData } from '../utils/streak';
import { isHardBossLevel } from '../utils/levels';
import { LanguageCode, t } from '../utils/translations';

interface HomeScreenProps {
  currentLevelId: number;
  streakData: StreakData;
  lang?: LanguageCode;
  onPlayLevel: (levelId: number) => void;
  onOpenStreak: () => void;
  onOpenLeagues: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLevelId,
  streakData,
  lang = 'en',
  onPlayLevel,
  onOpenStreak,
  onOpenLeagues,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex-1 w-full h-full max-h-full max-w-md sm:max-w-lg mx-auto flex flex-col justify-between items-center px-4 sm:px-5 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(5.25rem,calc(4.5rem+env(safe-area-inset-bottom)))] select-none overflow-hidden touch-none overscroll-none"
    >
      {/* Top Bar: Streak on Left, Compact Trophy League on Right */}
      <div className="w-full shrink-0 flex items-center justify-between pt-2">
        {/* Left: Streak Pill */}
        <motion.button
          type="button"
          id="btn-home-streak"
          onClick={onOpenStreak}
          title="Daily Streak Tracker"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f0f3fa] hover:bg-[#e4ebf7] text-[#4b5978] transition-colors cursor-pointer shadow-2xs border border-[#e1e7f5]"
        >
          {/* Animated Flame */}
          <motion.span
            animate={{
              scale: [1, 1.22, 1],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-base leading-none inline-block"
          >
            🔥
          </motion.span>
          <span className="font-semibold text-xs sm:text-sm text-[#384461]">
            {streakData.currentStreak || 1} {t(lang, 'dayStreak')}
          </span>
        </motion.button>

        {/* Right: Compact Trophy-Shaped League Button */}
        <motion.button
          type="button"
          id="btn-home-leagues-trophy"
          onClick={onOpenLeagues}
          title="Leagues Arena (Bronze Rank #12)"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/80 shadow-2xs cursor-pointer transition-all"
        >
          {/* Animated Trophy Shape */}
          <motion.div
            animate={{
              rotate: [-4, 4, -4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center justify-center"
          >
            <Trophy className="w-4 h-4 text-amber-600 fill-amber-400 stroke-[2.2]" />
          </motion.div>
          <span className="font-extrabold text-xs text-amber-950 tracking-tight">
            #12
          </span>
          {/* Pulsing indicator dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        </motion.button>
      </div>

      {/* Center Branding & Level Indicator */}
      <div className="flex-1 min-h-0 my-auto py-2 flex flex-col items-center justify-center text-center">
        {/* Cool & Classic Typography (Cinzel Roman Chiseled Display) */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="flex flex-col items-center"
        >
          <h1
            className="font-classic text-4xl sm:text-5xl font-semibold tracking-[0.22em] text-[#0f172a] uppercase select-none"
            style={{
              letterSpacing: '0.22em',
            }}
          >
            ARROW
          </h1>
          <div className="flex items-center gap-2 mt-1.5 opacity-80">
            <span className="w-4 h-[1px] bg-[#94a3b8]" />
            <span className="font-outfit text-[10px] sm:text-[11px] font-medium tracking-[0.28em] text-[#475569] uppercase">
              {t(lang, 'pathPuzzle')}
            </span>
            <span className="w-4 h-[1px] bg-[#94a3b8]" />
          </div>
        </motion.div>

        {/* Level Number */}
        <motion.div
          key={currentLevelId}
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center mt-6"
        >
          <p className="font-outfit text-xl sm:text-2xl font-semibold text-[#4f46e5] tracking-wide">
            {t(lang, 'level')} {currentLevelId}
          </p>
          {isHardBossLevel(currentLevelId) && (
            <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium text-[11px] tracking-wider uppercase shadow-sm flex items-center gap-1 animate-pulse">
              <span>🔥</span>
              <span>{t(lang, 'hardLevel')}</span>
            </span>
          )}
        </motion.div>
      </div>

      {/* Big Continue Button with Breathing Glow & Spring Tap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.3 }}
        className="w-full shrink-0 flex justify-center pb-3 sm:pb-5 mb-1"
      >
        <motion.button
          type="button"
          id="btn-continue-level"
          onClick={() => onPlayLevel(currentLevelId)}
          whileHover={{ scale: 1.04, boxShadow: '0 10px 25px -4px rgba(83, 103, 252, 0.4)' }}
          whileTap={{ scale: 0.94 }}
          animate={{
            boxShadow: [
              '0 4px 14px 0 rgba(83, 103, 252, 0.25)',
              '0 6px 20px 2px rgba(83, 103, 252, 0.38)',
              '0 4px 14px 0 rgba(83, 103, 252, 0.25)',
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="w-full max-w-[280px] py-4 px-8 rounded-full bg-gradient-to-r from-[#5367fc] to-[#475bf7] text-white font-extrabold text-lg shadow-md cursor-pointer text-center tracking-wide"
        >
          {t(lang, 'continueBtn')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
