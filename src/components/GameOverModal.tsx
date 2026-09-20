import React from 'react';
import { RotateCcw, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageCode, t } from '../utils/translations';

interface GameOverModalProps {
  isOpen: boolean;
  lang?: LanguageCode;
  onRestart: () => void;
  onWatchAdForLife: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  lang = 'en',
  onRestart,
  onWatchAdForLife,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 360 }}
            className="w-full max-w-sm bg-white dark:bg-[#151d2f] rounded-[28px] p-6 shadow-2xl border border-neutral-200 dark:border-[#222e46] text-center max-h-[92dvh] overflow-y-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-3 border border-red-100 dark:border-red-900/40 shadow-inner">
              <span className="text-3xl">💔</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t(lang, 'outOfLives')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              {t(lang, 'outOfLivesDesc')}
            </p>

            <div className="flex flex-col gap-2.5 mt-6">
              {/* Primary: Watch Ad for +1 Life */}
              <button
                type="button"
                id="btn-watch-ad-life"
                onClick={onWatchAdForLife}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-bold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-500/25"
              >
                <span className="text-base">📺</span>
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>{t(lang, 'watchAdLife')}</span>
                <span className="ml-1 text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-1.5 py-0.5 rounded-full">
                  {t(lang, 'free')}
                </span>
              </button>

              {/* Secondary: Restart Level */}
              <button
                type="button"
                id="btn-restart-gameover"
                onClick={onRestart}
                className="w-full py-3 px-4 bg-white dark:bg-[#1a243b] text-neutral-700 dark:text-neutral-200 text-sm font-semibold rounded-2xl border border-neutral-200 dark:border-[#222e46] hover:bg-neutral-50 dark:hover:bg-[#202c46] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span>{t(lang, 'restartLevel')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
