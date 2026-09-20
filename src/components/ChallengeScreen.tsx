import React from 'react';
import { Trophy, Calendar, Zap, Award, Flame, CheckCircle2 } from 'lucide-react';
import { BronzeShieldIcon, WhiteTrophyIcon } from './ThreeDIcons';
import { StreakData, getStreakWeekStatus } from '../utils/streak';

interface ChallengeScreenProps {
  streakData: StreakData;
  onPlayDailyChallenge: () => void;
  onPlayLeague: () => void;
}

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({
  streakData,
  onPlayDailyChallenge,
  onPlayLeague,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const weekDays = getStreakWeekStatus(streakData);

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-5 pt-3 pb-24 select-none overflow-y-auto min-h-[calc(100vh-68px)]">
      {/* 1. Today's Daily Challenge Card */}
      <div className="bg-gradient-to-b from-[#eef4ff] to-[#f8faff] rounded-3xl p-5 border border-[#dce6f8] shadow-xs text-center relative overflow-hidden mt-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#5066f5]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> DAILY PUZZLE
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#dbe6fd] text-[#3448bd] text-[10px]">
            ACTIVE
          </span>
        </div>

        <h2 className="text-xl font-extrabold text-[#1d2745] mt-2">
          Daily Challenge
        </h2>
        <p className="text-xs font-semibold text-[#7684a3] mt-0.5">
          {todayFormatted}
        </p>

        <div className="my-4 flex justify-center">
          <WhiteTrophyIcon className="w-24 h-24" />
        </div>

        <button
          type="button"
          id="btn-play-daily-challenge"
          onClick={onPlayDailyChallenge}
          className="w-full py-3.5 rounded-full bg-[#5266fc] hover:bg-[#4357ee] active:scale-96 text-white font-extrabold text-base transition-all shadow-md cursor-pointer"
        >
          Play Challenge
        </button>
      </div>

      {/* 2. 7-Day Streak Calendar Tracker */}
      <div className="bg-[#f8faff] rounded-2xl p-4 border border-[#e5ebf7] shadow-2xs mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-500" />
            <span className="font-extrabold text-sm text-[#263150]">
              7-Day Streak Goal
            </span>
          </div>
          <span className="text-xs font-bold text-[#5066f5]">
            {streakData.currentStreak} Days
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((d, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all ${
                d.isToday
                  ? 'bg-[#5266fc] text-white border-[#5266fc] shadow-xs'
                  : d.isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-400 border-slate-200/70'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{d.dayName}</span>
              <div className="w-5 h-5 mt-1 flex items-center justify-center">
                {d.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                ) : (
                  <span className="text-xs font-bold">{d.dayNumber}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bronze League Card */}
      <div className="bg-[#f8faff] rounded-2xl p-4 border border-[#e5ebf7] shadow-2xs mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <BronzeShieldIcon className="w-14 h-16" />
          <div>
            <span className="text-[10px] font-bold text-[#c27052] uppercase tracking-wider">
              Current Division
            </span>
            <h3 className="text-base font-extrabold text-[#263150] leading-tight">
              Bronze League
            </h3>
            <p className="text-xs font-medium text-[#7d8ba8] mt-0.5">
              Rank #12 • Top 10%
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayLeague}
          className="px-4 py-2 rounded-full bg-[#5266fc] hover:bg-[#4357ee] active:scale-95 text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          Compete
        </button>
      </div>
    </div>
  );
};
