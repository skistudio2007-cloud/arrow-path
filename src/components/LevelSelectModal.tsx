import React, { useState, useMemo, useEffect } from 'react';
import { X, Star, Play, Search, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelData, LevelDifficulty } from '../types';
import { TOTAL_LEVELS, getLevelById, getLevelConfig, isHardBossLevel } from '../utils/levels';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelId: number;
  completedLevels: Record<number, number>;
  onSelectLevel: (level: LevelData) => void;
  onClose: () => void;
}

interface TierInfo {
  name: LevelDifficulty;
  rangeStart: number;
  rangeEnd: number;
  arrowRange: string;
  color: string;
  bgLight: string;
}

const TIERS: TierInfo[] = [
  {
    name: 'Easy',
    rangeStart: 1,
    rangeEnd: 10,
    arrowRange: '10–20 Arrows',
    color: 'text-emerald-700 border-emerald-300',
    bgLight: 'bg-emerald-50 text-emerald-800',
  },
  {
    name: 'Medium',
    rangeStart: 11,
    rangeEnd: 35,
    arrowRange: '20–40 Arrows',
    color: 'text-blue-700 border-blue-300',
    bgLight: 'bg-blue-50 text-blue-800',
  },
  {
    name: 'Hard',
    rangeStart: 36,
    rangeEnd: 75,
    arrowRange: '40–75 Arrows',
    color: 'text-amber-700 border-amber-300',
    bgLight: 'bg-amber-50 text-amber-800',
  },
  {
    name: 'Expert',
    rangeStart: 76,
    rangeEnd: 150,
    arrowRange: '75–110 Arrows',
    color: 'text-rose-700 border-rose-300',
    bgLight: 'bg-rose-50 text-rose-800',
  },
  {
    name: 'Master',
    rangeStart: 151,
    rangeEnd: 1000,
    arrowRange: '110–130 Arrows',
    color: 'text-purple-700 border-purple-300',
    bgLight: 'bg-purple-50 text-purple-800',
  },
  {
    name: 'Grandmaster',
    rangeStart: 1001,
    rangeEnd: 2000,
    arrowRange: '130–145 Arrows',
    color: 'text-indigo-700 border-indigo-300',
    bgLight: 'bg-indigo-50 text-indigo-800',
  },
  {
    name: 'Legend',
    rangeStart: 2001,
    rangeEnd: 3000,
    arrowRange: '145–160+ Arrows',
    color: 'text-orange-700 border-orange-300',
    bgLight: 'bg-orange-50 text-orange-800',
  },
];

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  currentLevelId,
  completedLevels,
  onSelectLevel,
  onClose,
}) => {
  // Determine initial active tier based on current level ID
  const initialTierIndex = useMemo(() => {
    const idx = TIERS.findIndex(
      (t) => currentLevelId >= t.rangeStart && currentLevelId <= t.rangeEnd
    );
    return idx !== -1 ? idx : 0;
  }, [currentLevelId]);

  const [activeTierIdx, setActiveTierIdx] = useState<number>(initialTierIndex);
  const [jumpInput, setJumpInput] = useState<string>('');
  const [subPage, setSubPage] = useState<number>(0);

  // Sync active tier index and subpage when currentLevelId changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const idx = TIERS.findIndex(
        (t) => currentLevelId >= t.rangeStart && currentLevelId <= t.rangeEnd
      );
      if (idx !== -1) {
        setActiveTierIdx(idx);
        const tier = TIERS[idx];
        const offset = Math.max(0, currentLevelId - tier.rangeStart);
        setSubPage(Math.floor(offset / 25));
      }
    }
  }, [isOpen, currentLevelId]);

  const currentTier = TIERS[activeTierIdx] || TIERS[0];
  const tierTotal = currentTier.rangeEnd - currentTier.rangeStart + 1;
  const pageSize = 25;
  const totalSubPages = Math.ceil(tierTotal / pageSize);

  const displayedLevels = useMemo(() => {
    if (!isOpen) return [];
    const list: { id: number; config: ReturnType<typeof getLevelConfig> }[] = [];
    const start = currentTier.rangeStart + subPage * pageSize;
    const end = Math.min(currentTier.rangeEnd, start + pageSize - 1);

    for (let id = start; id <= end; id++) {
      list.push({ id, config: getLevelConfig(id) });
    }
    return list;
  }, [isOpen, currentTier, subPage]);

  const completedCount = useMemo(() => Object.keys(completedLevels).length, [completedLevels]);
  const progressPercent = Math.min(100, Math.round((completedCount / TOTAL_LEVELS) * 100));

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpInput.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_LEVELS) {
      const level = getLevelById(parsed);
      onSelectLevel(level);
      onClose();
    }
  };

  const handleLevelClick = (lvlId: number) => {
    const level = getLevelById(lvlId);
    onSelectLevel(level);
    onClose();
  };

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
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black">
                  3,000 Levels
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {completedCount} of {TOTAL_LEVELS} Completed ({progressPercent}%)
              </p>
            </div>
            <button
              type="button"
              id="btn-close-level-select"
              onClick={onClose}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden my-2.5">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${Math.max(1, progressPercent)}%` }}
            />
          </div>

          {/* Jump to level form */}
          <form onSubmit={handleJump} className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max={TOTAL_LEVELS}
                placeholder="Jump to Level (1 - 3000)..."
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              type="submit"
              id="btn-jump-level"
              disabled={!jumpInput}
              className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Go
            </button>
          </form>

          {/* Tier Difficulty Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {TIERS.map((tier, idx) => {
              const isActive = idx === activeTierIdx;
              return (
                <button
                  key={tier.name}
                  type="button"
                  id={`tab-tier-${tier.name.toLowerCase()}`}
                  onClick={() => {
                    setActiveTierIdx(idx);
                    setSubPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex flex-col items-center shrink-0 border ${
                    isActive
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <span>{tier.name}</span>
                  <span
                    className={`text-[9px] font-normal ${
                      isActive ? 'text-neutral-300' : 'text-neutral-400'
                    }`}
                  >
                    {tier.arrowRange}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-page pagination within tier */}
          {totalSubPages > 1 && (
            <div className="flex items-center justify-between text-xs text-neutral-500 py-1.5 px-1 border-b border-neutral-100 mb-1.5">
              <span>
                Showing {currentTier.rangeStart + subPage * pageSize} –{' '}
                {Math.min(currentTier.rangeEnd, currentTier.rangeStart + (subPage + 1) * pageSize - 1)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={subPage === 0}
                  onClick={() => setSubPage((p) => Math.max(0, p - 1))}
                  className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer font-bold text-[11px]"
                >
                  Prev
                </button>
                <span className="text-[11px] font-medium text-neutral-600 px-1">
                  {subPage + 1}/{totalSubPages}
                </span>
                <button
                  type="button"
                  disabled={subPage >= totalSubPages - 1}
                  onClick={() => setSubPage((p) => Math.min(totalSubPages - 1, p + 1))}
                  className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer font-bold text-[11px]"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Level Grid (5x5 per page) */}
          <div className="grid grid-cols-5 gap-2 py-2 overflow-y-auto flex-1 pr-1">
            {displayedLevels.map(({ id, config }) => {
              const isCurrent = id === currentLevelId;
              const stars = completedLevels[id] || 0;
              const isCleared = stars > 0;
              const isHard = isHardBossLevel(id);

              return (
                <button
                  key={id}
                  type="button"
                  id={`btn-select-level-${id}`}
                  onClick={() => handleLevelClick(id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer relative ${
                    isCurrent
                      ? isHard
                        ? 'border-rose-600 bg-neutral-900 text-white shadow-lg ring-2 ring-rose-500/50'
                        : 'border-black bg-neutral-900 text-white shadow-md ring-2 ring-black/20'
                      : isCleared
                      ? isHard
                        ? 'border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-rose-950 font-medium'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-black'
                      : isHard
                      ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300 text-rose-900 font-medium'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                  }`}
                >
                  {isHard && (
                    <span className="absolute -top-1.5 -right-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center">
                      🔥
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-bold">{id}</span>
                  <span
                    className={`text-[9px] truncate max-w-full ${
                      isCurrent
                        ? 'text-neutral-300'
                        : isHard
                        ? 'text-rose-600 font-semibold'
                        : 'text-neutral-400'
                    }`}
                  >
                    {isHard ? 'HARD' : `${config.targetArrows} arr`}
                  </span>

                  <div className="flex items-center gap-0.5 mt-0.5">
                    {isCleared ? (
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ) : isCurrent ? (
                      <Play className="w-2.5 h-2.5 fill-current" />
                    ) : (
                      <div className={`w-1 h-1 rounded-full my-0.5 ${isHard ? 'bg-rose-300' : 'bg-neutral-300'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
