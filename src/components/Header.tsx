import React from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Lightbulb,
} from 'lucide-react';
import { LevelData } from '../types';
import { isHardBossLevel } from '../utils/levels';
import { LanguageCode, t } from '../utils/translations';

interface HeaderProps {
  currentLevel: LevelData;
  lives: number;
  maxLives: number;
  moves: number;
  soundEnabled: boolean;
  canUndo: boolean;
  remainingArrowsCount?: number;
  comboCount?: number;
  hintsCount?: number;
  lang?: LanguageCode;
  onGoHome: () => void;
  onPreviousLevel?: () => void;
  onRestartLevel: () => void;
  onToggleSound: () => void;
  onHint: () => void;
  onWatchAdForHint?: () => void;
  onOpenSettings?: () => void;
  isDarkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  lives,
  maxLives,
  soundEnabled,
  remainingArrowsCount,
  hintsCount = 2,
  lang = 'en',
  onGoHome,
  onRestartLevel,
  onToggleSound,
  onHint,
  onWatchAdForHint,
  isDarkMode = false,
}) => {
  const totalArrows = currentLevel.arrows.length;
  const remaining = remainingArrowsCount ?? totalArrows;
  const progressPercent = Math.round(
    ((totalArrows - remaining) / Math.max(1, totalArrows)) * 100
  );

  return (
    <header className="w-full max-w-md sm:max-w-lg mx-auto px-3 sm:px-4 pt-[max(0.6rem,env(safe-area-inset-top))] pb-1 select-none shrink-0">
      {/* Top Subtle Level Progress Bar */}
      <div className={`w-full h-1 ${isDarkMode ? 'bg-slate-700/60' : 'bg-neutral-200/70'} rounded-full mb-3 overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Left: Back & Restart */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="btn-home"
            onClick={onGoHome}
            aria-label="Back to Menu"
            title="Menu"
            className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/60' : 'bg-neutral-100/90 hover:bg-neutral-200/90 border-neutral-200/60'} active:scale-95 flex items-center justify-center transition-all cursor-pointer border`}
          >
            <ArrowLeft className={`w-4.5 h-4.5 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-700'} stroke-[2.2]`} />
          </button>

          <button
            type="button"
            id="btn-restart-level"
            onClick={onRestartLevel}
            aria-label="Restart Level"
            title="Restart"
            className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/60' : 'bg-neutral-100/90 hover:bg-neutral-200/90 border-neutral-200/60'} active:scale-95 flex items-center justify-center transition-all cursor-pointer border`}
          >
            <RotateCcw className={`w-4 h-4 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-700'} stroke-[2.2]`} />
          </button>
        </div>

        {/* Center: Clean Level Title & Lives */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm sm:text-base font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'} tracking-tight`}>
              {t(lang, 'level')} {currentLevel.id}
            </span>
            {(isHardBossLevel(currentLevel.id) || currentLevel.name.includes('Hard')) && (
              <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-extrabold text-[9px] tracking-wider uppercase shadow-xs flex items-center gap-0.5 animate-pulse">
                <span>🔥</span>
                <span>{t(lang, 'hardLevel')}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span
                key={i}
                className={`text-xs inline-block transition-all duration-300 ${
                  i < lives
                    ? 'opacity-100 scale-100'
                    : 'opacity-25 grayscale scale-75'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Right: Hint & Sound */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="btn-hint"
            onClick={hintsCount > 0 ? onHint : (onWatchAdForHint ?? onHint)}
            aria-label={hintsCount > 0 ? `${t(lang, 'hint')} (${hintsCount})` : 'Watch Ad for +1 Hint'}
            title={hintsCount > 0 ? `${t(lang, 'hint')} (${hintsCount})` : 'Watch Ad for +1 Hint'}
            className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-700/60 text-amber-300' : 'bg-amber-50 hover:bg-amber-100 border-amber-200/70 text-amber-700'} active:scale-95 flex items-center justify-center transition-all cursor-pointer border relative`}
          >
            <Lightbulb className="w-4.5 h-4.5 stroke-[2.2]" />
            {hintsCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[9px] min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center shadow-xs">
                {hintsCount}
              </span>
            ) : (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-[8px] px-1 py-0.2 rounded-full flex items-center gap-0.5 shadow-xs animate-pulse">
                <span>📺</span>
                <span>+1</span>
              </span>
            )}
          </button>

          <button
            type="button"
            id="btn-toggle-sound"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute' : 'Unmute'}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/60 text-neutral-200' : 'bg-neutral-100/90 hover:bg-neutral-200/90 border-neutral-200/60 text-neutral-700'} active:scale-95 flex items-center justify-center transition-all cursor-pointer border`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 stroke-[2]" />
            ) : (
              <VolumeX className={`w-4 h-4 stroke-[2] ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
