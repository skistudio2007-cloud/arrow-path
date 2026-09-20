import React, { useState, useMemo } from 'react';
import { X, Trophy, CheckCircle2, Lock, Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { computeCollectionBadges, Badge, PlayerStats, BadgeTier } from '../utils/collection';

interface CollectionModalProps {
  isOpen: boolean;
  stats: PlayerStats;
  onClose: () => void;
}

const TIER_STYLES: Record<BadgeTier, { border: string; bg: string; text: string; badgeBg: string }> = {
  bronze: {
    border: 'border-amber-700/30',
    bg: 'bg-amber-50/50',
    text: 'text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-900',
  },
  silver: {
    border: 'border-slate-300',
    bg: 'bg-slate-50/80',
    text: 'text-slate-800',
    badgeBg: 'bg-slate-200 text-slate-800',
  },
  gold: {
    border: 'border-yellow-400/50',
    bg: 'bg-yellow-50/60',
    text: 'text-yellow-900',
    badgeBg: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
  },
  diamond: {
    border: 'border-cyan-400/60',
    bg: 'bg-cyan-50/60',
    text: 'text-cyan-900',
    badgeBg: 'bg-cyan-100 text-cyan-900 border border-cyan-300',
  },
};

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  stats,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const badges = useMemo(() => computeCollectionBadges(stats), [stats]);

  const unlockedCount = useMemo(() => badges.filter((b) => b.unlocked).length, [badges]);

  const displayedBadges = useMemo(() => {
    if (activeFilter === 'unlocked') return badges.filter((b) => b.unlocked);
    if (activeFilter === 'locked') return badges.filter((b) => !b.unlocked);
    return badges;
  }, [badges, activeFilter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black">
                    Trophies & Badges
                  </h2>
                  <div className="text-xs text-neutral-500">
                    {unlockedCount} of {badges.length} Badges Unlocked
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close collection"
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden my-3">
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${Math.max(4, Math.round((unlockedCount / badges.length) * 100))}%` }}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-3">
              {(['all', 'unlocked', 'locked'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
              {displayedBadges.map((badge) => {
                const style = TIER_STYLES[badge.tier];
                const progressPct = Math.min(100, Math.round((badge.current / badge.target) * 100));

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      badge.unlocked
                        ? `${style.bg} ${style.border} shadow-2xs`
                        : 'bg-neutral-50/60 border-neutral-200/80 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Top badge row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl select-none">{badge.icon}</span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-black flex items-center gap-1.5">
                              <span>{badge.name}</span>
                              {badge.unlocked && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <span
                              className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-md ${style.badgeBg}`}
                            >
                              {badge.tier}
                            </span>
                          </div>
                        </div>

                        {!badge.unlocked && <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-1" />}
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-neutral-500 mt-2 leading-tight">
                        {badge.description}
                      </p>
                    </div>

                    {/* Progress Bar inside Card */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 mb-1">
                        <span>{badge.unlocked ? 'Complete' : 'Progress'}</span>
                        <span className="tabular-nums">
                          {badge.current} / {badge.target}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200/70 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            badge.unlocked ? 'bg-emerald-500' : 'bg-black'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
