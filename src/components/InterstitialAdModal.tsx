import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { GOOGLE_ADMOB_TEST_IDS } from '../utils/admob';

interface InterstitialAdModalProps {
  isOpen: boolean;
  levelNumber: number;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  levelNumber,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const [adSound, setAdSound] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setCanSkip(false);

      timerRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setCanSkip(true);
            return 0;
          }
          if (prev === 3) {
            // Allow skip after 2 seconds
            setCanSkip(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm bg-neutral-900 border border-neutral-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative text-white"
          >
            {/* Top Ad Identification Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Ad
                </span>
                <span className="text-xs font-semibold text-neutral-300">
                  Google AdMob Test
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdSound(!adSound)}
                  className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors cursor-pointer"
                  aria-label="Toggle sound"
                >
                  {adSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {canSkip ? (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Skip</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                    Skip in {countdown}s
                  </div>
                )}
              </div>
            </div>

            {/* Test Ad Unit Info Strip */}
            <div className="px-4 py-1.5 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400 font-mono truncate">
              <span className="truncate">Unit: {GOOGLE_ADMOB_TEST_IDS.INTERSTITIAL}</span>
              <span className="text-emerald-400 shrink-0 flex items-center gap-1 font-sans font-semibold">
                <ShieldCheck className="w-3 h-3" /> Test Mode
              </span>
            </div>

            {/* Ad Creative Visual Area */}
            <div className="relative aspect-4/3 w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-neutral-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {/* Decorative background glows */}
              <div className="absolute -top-8 -right-8 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-indigo-400">
                    Milestone Level {levelNumber} Cleared!
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                    Arrow Go: Master Class
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 max-w-[240px] leading-relaxed">
                    Great job on completing Level {levelNumber}. Next puzzle awaits with new twists & turns!
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${Math.min(100, ((5 - countdown) / 5) * 100)}%` }}
                />
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 bg-neutral-950 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Level {levelNumber + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
