import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, CheckCircle2, Heart, Lightbulb, Volume2, VolumeX, Sparkles, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { GOOGLE_ADMOB_TEST_IDS } from '../utils/admob';

export type RewardType = 'life' | 'hint';

interface RewardedAdModalProps {
  isOpen: boolean;
  rewardType: RewardType;
  onClose: () => void;
  onRewardGranted: (type: RewardType) => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  rewardType,
  onClose,
  onRewardGranted,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [adSound, setAdSound] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(5);
      setIsCompleted(false);

      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsCompleted(true);
            soundManager.playReward();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([30, 50, 40]);
            }
            return 0;
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

  const handleClaimReward = () => {
    onRewardGranted(rewardType);
    onClose();
  };

  const rewardLabel = rewardType === 'life' ? '+1 Extra Life' : '+1 Free Hint';
  const progressPercent = Math.min(100, Math.round(((5 - secondsLeft) / 5) * 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="w-full max-w-sm bg-neutral-900 border border-neutral-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative text-white"
          >
            {/* Top Ad Banner Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950/90 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Ad
                </span>
                <span className="text-xs font-semibold text-neutral-300">
                  Google AdMob Test
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAdSound(!adSound)}
                  className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors"
                  aria-label="Toggle Ad Sound"
                >
                  {adSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {isCompleted ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors cursor-pointer"
                    aria-label="Close Ad"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-[11px] font-mono text-neutral-500 px-1.5">
                    {secondsLeft}s
                  </div>
                )}
              </div>
            </div>

            {/* Google AdMob Test Ad Unit Strip */}
            <div className="px-4 py-1.5 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400 font-mono truncate">
              <span className="truncate">Unit: {GOOGLE_ADMOB_TEST_IDS.REWARDED_VIDEO}</span>
              <span className="text-emerald-400 shrink-0 flex items-center gap-1 font-sans font-semibold">
                <ShieldCheck className="w-3 h-3" /> Test Mode
              </span>
            </div>

            {/* Video Simulation Canvas */}
            <div className="relative aspect-4/3 w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {/* Background ambient glowing circles */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

              {!isCompleted ? (
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
                      <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Arrow Go: VIP Club
                    </h3>
                    <p className="text-xs text-neutral-300 mt-0.5 max-w-[220px]">
                      Unlock premium sleek arrow skins and infinite daily maze challenges!
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Watch full ad for {rewardLabel}</span>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-3 relative z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">
                      Reward Unlocked!
                    </h3>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      You earned {rewardLabel}. Claim it below to continue!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Bottom Video Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Bottom Reward Call-to-Action */}
            <div className="p-4 bg-neutral-950 flex flex-col gap-2.5">
              {isCompleted ? (
                <button
                  type="button"
                  onClick={handleClaimReward}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {rewardType === 'life' ? (
                    <Heart className="w-4 h-4 fill-white" />
                  ) : (
                    <Lightbulb className="w-4 h-4 fill-white" />
                  )}
                  <span>Claim {rewardLabel}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 bg-neutral-800/80 text-neutral-400 font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 border border-neutral-700/50 cursor-not-allowed"
                >
                  <span>Reward available in {secondsLeft} seconds...</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
