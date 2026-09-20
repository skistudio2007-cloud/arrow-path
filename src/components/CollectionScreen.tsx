import React from 'react';
import { motion } from 'motion/react';
import { PlayerStats } from '../utils/collection';
import {
  FlamePedestalIcon,
  CrownPedestalIcon,
  WingedArrowIcon,
  ClayAwardBadge,
  WhiteTrophyIcon,
} from './ThreeDIcons';
import { LanguageCode, t } from '../utils/translations';

interface CollectionScreenProps {
  stats: PlayerStats;
  lang?: LanguageCode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 24 },
  },
};

export const CollectionScreen: React.FC<CollectionScreenProps> = ({ stats, lang = 'en' }) => {
  const currentYear = new Date().getFullYear();

  // Format today / record dates
  const todayFormatted = new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : lang === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const levelMilestoneTier = Math.min(10, Math.floor(stats.completedCount / 25) + 1);
  const perfectMilestoneTier = Math.min(10, Math.floor(stats.perfectClears / 5) + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex-1 min-h-0 h-full w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(6rem,calc(5.25rem+env(safe-area-inset-bottom)))] scroll-touch"
    >
      {/* 1. Records Section */}
      <section className="mt-2">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-extrabold text-[#4f67eb] tracking-tight whitespace-nowrap">
            {t(lang, 'records')}
          </h2>
          <div className="flex-1 h-[1.5px] bg-[#e2e8f5]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2.5"
        >
          {/* Card 1: Longest Streak */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[148px] cursor-pointer"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FlamePedestalIcon value={stats.maxStreak || 5} />
            </motion.div>
            <div className="mt-2">
              <p className="text-xs font-extrabold text-[#2e3a59] leading-tight">
                {t(lang, 'longestStreak')}
              </p>
              <p className="text-[10px] text-[#8694b2] mt-0.5 font-medium">
                {todayFormatted}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Highest Win Streak */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[148px] cursor-pointer"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              <CrownPedestalIcon value={Math.max(stats.maxStreak * 2, 40)} />
            </motion.div>
            <div className="mt-2">
              <p className="text-xs font-extrabold text-[#2e3a59] leading-tight">
                {t(lang, 'highestWinStreak')}
              </p>
              <p className="text-[10px] text-[#8694b2] mt-0.5 font-medium">
                {todayFormatted}
              </p>
            </div>
          </motion.div>

          {/* Card 3: Most Wins */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[148px] cursor-pointer"
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <WingedArrowIcon value={stats.completedCount > 0 ? stats.completedCount : 26} />
            </motion.div>
            <div className="mt-2">
              <p className="text-xs font-extrabold text-[#2e3a59] leading-tight">
                {t(lang, 'perfectSolves')}
              </p>
              <p className="text-[10px] text-[#8694b2] mt-0.5 font-medium">
                {todayFormatted}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Awards Section */}
      <section className="mt-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-extrabold text-[#4f67eb] tracking-tight whitespace-nowrap">
            {t(lang, 'milestones')}
          </h2>
          <div className="flex-1 h-[1.5px] bg-[#e2e8f5]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2.5"
        >
          {/* Award 1: Level Legend */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[135px] cursor-pointer"
          >
            <ClayAwardBadge type="star" value={50} isUnlocked={stats.completedCount >= 50} />
            <div className="mt-1">
              <p className="text-xs font-extrabold text-[#2e3a59] leading-tight">
                {t(lang, 'levelMilestones')}
              </p>
              <p className="text-[10px] font-semibold text-[#8694b2] mt-0.5">
                {levelMilestoneTier} of 10
              </p>
            </div>
          </motion.div>

          {/* Award 2: Perfect Play */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[135px] cursor-pointer"
          >
            <ClayAwardBadge type="target" value={50} isUnlocked={stats.perfectClears >= 10} />
            <div className="mt-1">
              <p className="text-xs font-extrabold text-[#2e3a59] leading-tight">
                {t(lang, 'flawlessMilestones')}
              </p>
              <p className="text-[10px] font-semibold text-[#8694b2] mt-0.5">
                {perfectMilestoneTier} of 10
              </p>
            </div>
          </motion.div>

          {/* Award 3: Unstoppable */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[135px] cursor-pointer"
          >
            <ClayAwardBadge type="skull" isUnlocked={false} />
            <div className="mt-1">
              <p className="text-xs font-extrabold text-[#8694b2] leading-tight">
                Unstoppable
              </p>
            </div>
          </motion.div>

          {/* Award 4: League Climber */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[135px] cursor-pointer"
          >
            <ClayAwardBadge type="shield" isUnlocked={false} />
            <div className="mt-1">
              <p className="text-xs font-extrabold text-[#8694b2] leading-tight">
                League Climber
              </p>
            </div>
          </motion.div>

          {/* Award 5: League Fighter */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[135px] cursor-pointer"
          >
            <ClayAwardBadge type="glove" isUnlocked={false} />
            <div className="mt-1">
              <p className="text-xs font-extrabold text-[#8694b2] leading-tight">
                League Fighter
              </p>
            </div>
          </motion.div>

          {/* Award 6: League Winner */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f8faff] rounded-2xl p-2.5 flex flex-col items-center justify-between border border-[#e7edf8] shadow-2xs text-center min-h-[135px] cursor-pointer"
          >
            <ClayAwardBadge type="ring" isUnlocked={false} />
            <div className="mt-1">
              <p className="text-xs font-extrabold text-[#8694b2] leading-tight">
                League Winner
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Trophies Showcase Section */}
      <section className="mt-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-lg font-extrabold text-[#4f67eb] tracking-tight whitespace-nowrap">
            Trophies
          </h2>
          <div className="flex-1 h-[1.5px] bg-[#e2e8f5]" />
        </div>
        <p className="text-xs font-black text-[#2e3a59] mb-3">{currentYear}</p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2.5"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.04 }}
            className="bg-[#f8faff] rounded-2xl p-3 flex flex-col items-center justify-center border border-[#e7edf8] shadow-2xs h-28 cursor-pointer"
          >
            <WhiteTrophyIcon className="w-16 h-16 opacity-85" />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.04 }}
            className="bg-[#f8faff] rounded-2xl p-3 flex flex-col items-center justify-center border border-[#e7edf8] shadow-2xs h-28 cursor-pointer"
          >
            <WhiteTrophyIcon className="w-16 h-16 opacity-85" />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.04 }}
            className="bg-[#f8faff] rounded-2xl p-3 flex flex-col items-center justify-center border border-[#e7edf8] shadow-2xs h-28 cursor-pointer"
          >
            <WhiteTrophyIcon className="w-16 h-16 opacity-85" />
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};
