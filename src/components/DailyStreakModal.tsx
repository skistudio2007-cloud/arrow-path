import React from 'react';
import { X, Flame, Check, Calendar, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StreakData, getStreakWeekStatus } from '../utils/streak';

interface DailyStreakModalProps {
  isOpen: boolean;
  streakData: StreakData;
  onClose: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  streakData,
  onClose,
}) => {
  const weekDays = getStreakWeekStatus(streakData);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 text-center relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close streak modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Flaming Icon Animation */}
            <div className="relative mx-auto w-20 h-20 mb-3 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  rotate: [-3, 3, -3],
                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/25 text-white"
              >
                <Flame className="w-10 h-10 fill-current" />
              </motion.div>
            </div>

            {/* Streak Counter Header */}
            <h2 className="text-3xl font-extrabold tracking-tight text-black flex items-center justify-center gap-1.5">
              <span>{streakData.currentStreak}</span>
              <span className="text-orange-600">Day Streak!</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Solve at least 1 puzzle every day to keep your streak glowing.
            </p>

            {/* 7-Day Calendar Streak Track */}
            <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 my-5">
              <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  Last 7 Days
                </span>
                <span className="text-neutral-500">
                  Best: <strong className="text-black">{streakData.maxStreak} Days</strong>
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {weekDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center py-2 rounded-xl border transition-all ${
                      day.isCompleted
                        ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                        : day.isToday
                        ? 'bg-white border-orange-400 text-orange-600 ring-2 ring-orange-200'
                        : 'bg-white border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{day.dayName}</span>
                    <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center mt-1">
                      {day.isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : day.isToday ? (
                        <Flame className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Encouragement */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-left flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Zap className="w-4.5 h-4.5 fill-amber-500" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-amber-950">Daily Habit Active</div>
                <div className="text-amber-800/80 text-[11px] leading-tight mt-0.5">
                  Play tomorrow to reach{' '}
                  <strong className="text-amber-950">{streakData.currentStreak + 1} days</strong>!
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-neutral-800 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              Keep It Going!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
