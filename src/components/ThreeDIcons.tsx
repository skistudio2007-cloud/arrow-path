import React from 'react';

/**
 * 3D Clay & Metallic Aesthetic Icons matching the mobile game screenshots
 */

export const BronzeShieldIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 115" className={`drop-shadow-md ${className}`} fill="none">
    <defs>
      <linearGradient id="bronzeFace" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#f3baa0" />
        <stop offset="35%" stopColor="#d28669" />
        <stop offset="70%" stopColor="#ab5e42" />
        <stop offset="100%" stopColor="#813c24" />
      </linearGradient>
      <linearGradient id="bronzeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd8c5" />
        <stop offset="50%" stopColor="#c37557" />
        <stop offset="100%" stopColor="#5a220f" />
      </linearGradient>
      <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#813c24" floodOpacity="0.25" />
      </filter>
    </defs>
    {/* Outer Rim Bevel */}
    <path
      d="M50 8 C68 8, 88 18, 88 40 C88 78, 62 100, 50 108 C38 100, 12 78, 12 40 C12 18, 32 8, 50 8 Z"
      fill="url(#bronzeBevel)"
      filter="url(#shieldShadow)"
    />
    {/* Inner Shield Body */}
    <path
      d="M50 14 C65 14, 82 22, 82 41 C82 74, 59 94, 50 101 C41 94, 18 74, 18 41 C18 22, 35 14, 50 14 Z"
      fill="url(#bronzeFace)"
    />
    {/* Center Spine highlight */}
    <path
      d="M50 16 L50 99"
      stroke="#ffe5d6"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.45"
    />
    {/* Glossy top-left highlight */}
    <path
      d="M24 36 C24 24, 36 18, 48 16 C34 22, 26 34, 26 50 C26 65, 34 80, 44 88 C34 78, 24 62, 24 36 Z"
      fill="#ffffff"
      opacity="0.3"
    />
  </svg>
);

export const WhiteTrophyIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={`drop-shadow-md ${className}`} fill="none">
    <defs>
      <linearGradient id="clayBody" x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f3f6fc" />
        <stop offset="75%" stopColor="#dce3f2" />
        <stop offset="100%" stopColor="#b6c2de" />
      </linearGradient>
      <linearGradient id="clayShadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a9b8d9" />
        <stop offset="100%" stopColor="#7a8ba8" />
      </linearGradient>
    </defs>
    {/* Base Stand */}
    <ellipse cx="50" cy="90" rx="22" ry="6" fill="url(#clayShadow)" />
    <path d="M38 80 L32 88 C32 88 50 92 68 88 L62 80 Z" fill="url(#clayBody)" />
    {/* Cup Stem */}
    <rect x="46" y="66" width="8" height="15" rx="3" fill="url(#clayShadow)" />
    {/* Handles */}
    <path
      d="M26 32 C12 32 14 56 30 58 L32 50 C22 49 22 39 30 39 Z"
      fill="url(#clayBody)"
    />
    <path
      d="M74 32 C88 32 86 56 70 58 L68 50 C78 49 78 39 70 39 Z"
      fill="url(#clayBody)"
    />
    {/* Main Cup Body */}
    <path
      d="M30 26 C30 24 70 24 70 26 L66 54 C63 68 37 68 34 54 Z"
      fill="url(#clayBody)"
    />
    {/* Cup Rim */}
    <ellipse cx="50" cy="26" rx="20" ry="5" fill="#e8eef8" />
    <ellipse cx="50" cy="26" rx="17" ry="3" fill="#b9c6df" />
  </svg>
);

export const FlamePedestalIcon: React.FC<{ value: number | string; className?: string }> = ({
  value,
  className = 'w-16 h-20',
}) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    {/* 3D Flame */}
    <svg viewBox="0 0 70 70" className="w-13 h-13 drop-shadow-sm" fill="none">
      <defs>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
      </defs>
      <path
        d="M35 5 C35 5 44 20 44 28 C44 32 40 35 40 40 C40 48 55 45 55 35 C55 52 42 63 35 63 C24 63 15 52 15 38 C15 24 28 14 35 5 Z"
        fill="url(#flameGrad)"
      />
      <path
        d="M35 22 C35 22 40 32 40 37 C40 40 37 42 37 45 C37 51 46 50 46 43 C46 54 39 58 35 58 C28 58 23 51 23 42 C23 33 31 27 35 22 Z"
        fill="url(#flameInner)"
      />
    </svg>

    {/* Pedestal with Number Badge */}
    <div className="relative -mt-2.5">
      <div className="w-12 h-6.5 rounded-lg bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300/80 shadow-xs flex items-center justify-center">
        <span className="text-[13px] font-black text-slate-700 tracking-tight">{value}</span>
      </div>
    </div>
  </div>
);

export const CrownPedestalIcon: React.FC<{ value: number | string; className?: string }> = ({
  value,
  className = 'w-16 h-20',
}) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    {/* 3D Gold Crown on pillow */}
    <svg viewBox="0 0 70 65" className="w-13 h-13 drop-shadow-sm" fill="none">
      <defs>
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="pillowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eef2fb" />
          <stop offset="100%" stopColor="#c5d3ea" />
        </linearGradient>
      </defs>
      {/* Soft Pillow under crown */}
      <ellipse cx="35" cy="50" rx="26" ry="9" fill="url(#pillowGrad)" />
      {/* Crown */}
      <path
        d="M17 44 L15 22 L26 31 L35 15 L44 31 L55 22 L53 44 Z"
        fill="url(#crownGrad)"
        stroke="#a16207"
        strokeWidth="1"
      />
      {/* Jewels */}
      <circle cx="15" cy="21" r="2.5" fill="#fef08a" />
      <circle cx="35" cy="14" r="3" fill="#fef08a" />
      <circle cx="55" cy="21" r="2.5" fill="#fef08a" />
    </svg>

    {/* Pedestal with Number Badge */}
    <div className="relative -mt-2.5">
      <div className="w-12 h-6.5 rounded-lg bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300/80 shadow-xs flex items-center justify-center">
        <span className="text-[13px] font-black text-slate-700 tracking-tight">{value}</span>
      </div>
    </div>
  </div>
);

export const WingedArrowIcon: React.FC<{ value: number | string; className?: string }> = ({
  value,
  className = 'w-16 h-20',
}) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    {/* Upward Arrow with Soft Wings */}
    <svg viewBox="0 0 70 65" className="w-13 h-13 drop-shadow-sm" fill="none">
      <defs>
        <linearGradient id="arrowUp" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      {/* Left Wing */}
      <path
        d="M30 35 C15 30 8 20 8 16 C8 25 18 42 30 45 Z"
        fill="url(#wingGrad)"
      />
      {/* Right Wing */}
      <path
        d="M40 35 C55 30 62 20 62 16 C62 25 52 42 40 45 Z"
        fill="url(#wingGrad)"
      />
      {/* Orange Arrow Up */}
      <path
        d="M35 12 L47 28 H39 V46 H31 V28 H23 Z"
        fill="url(#arrowUp)"
      />
    </svg>

    {/* Pedestal with Number Badge */}
    <div className="relative -mt-2.5">
      <div className="w-12 h-6.5 rounded-lg bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300/80 shadow-xs flex items-center justify-center">
        <span className="text-[13px] font-black text-slate-700 tracking-tight">{value}</span>
      </div>
    </div>
  </div>
);

/**
 * 3D Clay Badges for Awards Section
 */
export const ClayAwardBadge: React.FC<{
  type: 'star' | 'target' | 'skull' | 'shield' | 'glove' | 'ring';
  value?: number | string;
  isUnlocked?: boolean;
}> = ({ type, value, isUnlocked = false }) => {
  if (type === 'star') {
    return (
      <div className="relative w-18 h-18 mx-auto flex items-center justify-center">
        {/* Soft Circular Clay Base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 shadow-sm border border-slate-300/60" />
        <div className="absolute inset-1.5 rounded-full bg-slate-50" />
        {/* 3D Star */}
        <svg viewBox="0 0 50 50" className="w-10 h-10 drop-shadow-sm z-10" fill="none">
          <defs>
            <linearGradient id="starBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path
            d="M25 4 L31 16 L45 18 L34 28 L37 42 L25 35 L13 42 L16 28 L5 18 L19 16 Z"
            fill="url(#starBlue)"
          />
        </svg>
        {/* Number Pill */}
        {value !== undefined && (
          <div className="absolute -bottom-1 z-20 px-2 py-0.5 rounded-full bg-slate-200/90 border border-slate-300 shadow-2xs">
            <span className="text-[10px] font-black text-slate-800">{value}</span>
          </div>
        )}
      </div>
    );
  }

  if (type === 'target') {
    return (
      <div className="relative w-18 h-18 mx-auto flex items-center justify-center">
        {/* Soft Hexagonal/Circular Base */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 shadow-sm border border-slate-300/60" />
        <div className="absolute inset-1.5 rounded-xl bg-slate-50" />
        {/* Target */}
        <svg viewBox="0 0 50 50" className="w-10 h-10 drop-shadow-sm z-10" fill="none">
          <circle cx="25" cy="25" r="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="25" cy="25" r="13" fill="#ef4444" />
          <circle cx="25" cy="25" r="8" fill="#ffffff" />
          <circle cx="25" cy="25" r="4" fill="#ef4444" />
          {/* Darts/Arrows */}
          <path d="M35 15 L26 24" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {/* Number Pill */}
        {value !== undefined && (
          <div className="absolute -bottom-1 z-20 px-2 py-0.5 rounded-full bg-slate-200/90 border border-slate-300 shadow-2xs">
            <span className="text-[10px] font-black text-slate-800">{value}</span>
          </div>
        )}
      </div>
    );
  }

  // Silver / Monochrome 3D Clay Locked/Embossed Badges
  return (
    <div className="relative w-18 h-18 mx-auto flex items-center justify-center opacity-85">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#e8ecf4] to-[#cfd7e6] shadow-2xs border border-[#bac6db]" />
      <div className="absolute inset-1.5 rounded-xl bg-[#e3e9f4]" />

      {type === 'skull' && (
        <svg viewBox="0 0 50 50" className="w-9 h-9 drop-shadow-2xs z-10" fill="none">
          {/* Shield outline */}
          <path d="M25 6 C35 6, 42 12, 42 22 C42 37, 28 44, 25 46 C22 44, 8 37, 8 22 C8 12, 15 6, 25 6 Z" fill="#cfd8e8" />
          {/* Skull face */}
          <circle cx="25" cy="23" r="8" fill="#bac7dc" />
          <rect x="21" y="27" width="8" height="6" rx="2" fill="#bac7dc" />
          <circle cx="22" cy="22" r="1.5" fill="#95a5c1" />
          <circle cx="28" cy="22" r="1.5" fill="#95a5c1" />
        </svg>
      )}

      {type === 'shield' && (
        <svg viewBox="0 0 50 50" className="w-9 h-9 drop-shadow-2xs z-10" fill="none">
          <circle cx="25" cy="25" r="16" fill="#cfd8e8" />
          <path d="M25 12 C31 12, 36 16, 36 24 C36 34, 27 38, 25 40 C23 38, 14 34, 14 24 C14 16, 19 12, 25 12 Z" fill="#bac7dc" />
        </svg>
      )}

      {type === 'glove' && (
        <svg viewBox="0 0 50 50" className="w-9 h-9 drop-shadow-2xs z-10" fill="none">
          {/* Boxing glove shape */}
          <rect x="14" y="27" width="10" height="9" rx="3" fill="#bac7dc" />
          <rect x="26" y="27" width="10" height="9" rx="3" fill="#bac7dc" />
          <path d="M15 28 C13 22, 16 16, 22 15 C26 15, 29 18, 28 28 Z" fill="#cfd8e8" />
          <path d="M35 28 C37 22, 34 16, 28 15 C24 15, 21 18, 22 28 Z" fill="#cfd8e8" />
        </svg>
      )}

      {type === 'ring' && (
        <svg viewBox="0 0 50 50" className="w-9 h-9 drop-shadow-2xs z-10" fill="none">
          {/* Hexagon ring/trophy */}
          <polygon points="25,10 38,18 38,32 25,40 12,32 12,18" fill="#cfd8e8" />
          <circle cx="25" cy="25" r="7" fill="#bac7dc" />
          <circle cx="25" cy="25" r="4" fill="#e3e9f4" />
        </svg>
      )}
    </div>
  );
};
