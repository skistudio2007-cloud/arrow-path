import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Shield, ChevronUp, Flame, Star, Sparkles } from 'lucide-react';
import { BronzeShieldIcon } from './ThreeDIcons';

interface LeaguesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
  completedCount: number;
  totalStars: number;
}

export const LeaguesModal: React.FC<LeaguesModalProps> = ({
  isOpen,
  onClose,
  onPlay,
  completedCount,
  totalStars,
}) => {
  const userScore = completedCount * 25 + totalStars * 10 + 120;

  const competitors = [
    { rank: 1, name: 'ApexArrow', score: Math.max(userScore + 280, 780), avatar: '👑', isUser: false },
    { rank: 2, name: 'ZenMaster', score: Math.max(userScore + 95, 620), avatar: '⚡', isUser: false },
    { rank: 3, name: 'You (Player)', score: userScore, avatar: '🏹', isUser: true },
    { rank: 4, name: 'PathFinder', score: Math.max(userScore - 60, 410), avatar: '🧭', isUser: false },
    { rank: 5, name: 'ShadowMove', score: Math.max(userScore - 140, 330), avatar: '🥷', isUser: false },
    { rank: 6, name: 'EchoPuzzler', score: Math.max(userScore - 210, 260), avatar: '🦊', isUser: false },
    { rank: 7, name: 'LuckyStrike', score: Math.max(userScore - 300, 190), avatar: '🍀', isUser: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="w-full max-w-sm bg-gradient-to-b from-white via-[#f8faff] to-[#edf2fb] rounded-3xl p-5 shadow-2xl border border-neutral-200 relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Bronze League Banner */}
            <div className="text-center pt-2 pb-3">
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex justify-center mb-1"
              >
                <BronzeShieldIcon className="w-16 h-18" />
              </motion.div>

              <span className="text-[10px] font-black uppercase tracking-wider text-[#b85e3d] bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                Division 1 • Weekly Season
              </span>
              <h2 className="text-2xl font-black text-[#1e2746] tracking-tight mt-1">
                Bronze League
              </h2>
              <p className="text-[11px] font-semibold text-[#7684a3] mt-0.5">
                Top 3 advance to Silver League • Ends in 2d 14h
              </p>
            </div>

            {/* Promotion Zone Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs font-bold text-emerald-800 mb-2">
              <span className="flex items-center gap-1.5">
                <ChevronUp className="w-4 h-4 text-emerald-600 stroke-[3]" />
                Promotion Zone (Top 3)
              </span>
              <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded-md">
                Rank #3 • Advancing!
              </span>
            </div>

            {/* Leaderboard Table */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 my-1 scrollbar-thin">
              {competitors.map((c) => (
                <div
                  key={c.name}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                    c.isUser
                      ? 'bg-gradient-to-r from-[#5067ff] to-[#4357ee] text-white shadow-md ring-2 ring-blue-300'
                      : 'bg-white border border-[#e4ebf7] text-[#2c3858]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge */}
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                        c.rank === 1
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : c.rank === 2
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : c.rank === 3
                          ? 'bg-amber-200/60 text-amber-900 border border-amber-300'
                          : c.isUser
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {c.rank}
                    </span>

                    <span className="text-base">{c.avatar}</span>

                    <div className="flex flex-col">
                      <span className={`text-xs font-extrabold truncate max-w-[110px] ${c.isUser ? 'text-white' : 'text-[#1e2746]'}`}>
                        {c.name}
                      </span>
                      {c.isUser && (
                        <span className="text-[9px] text-blue-100 font-semibold">
                          Your Active Standing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1 font-mono font-black text-xs">
                    <Star className={`w-3.5 h-3.5 ${c.isUser ? 'text-yellow-200 fill-yellow-200' : 'text-amber-500 fill-amber-500'}`} />
                    <span>{c.score} pts</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Play Action */}
            <div className="pt-3 border-t border-[#e2e8f5] mt-1">
              <button
                type="button"
                id="btn-league-compete-now"
                onClick={() => {
                  onClose();
                  onPlay();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#5367fc] to-[#4357ee] text-white font-extrabold text-sm shadow-md hover:shadow-lg active:scale-96 transition-all cursor-pointer text-center tracking-wide"
              >
                Play & Climb Leaderboard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
