import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, Eye, Sparkles, Trash2, Check, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { THEMES } from '../utils/levels';

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  showTrajectory: boolean;
  darkMode: boolean;
  themeOverride: string | null; // null = Auto-rotate per level
}

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const updateField = <K extends keyof GameSettings>(key: K, val: GameSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: val,
    });
  };

  const handleTriggerReset = () => {
    if (confirmReset) {
      onResetProgress();
      setConfirmReset(false);
      onClose();
    } else {
      setConfirmReset(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black">Settings</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(false);
                  onClose();
                }}
                aria-label="Close settings"
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Toggles List */}
            <div className="py-4 space-y-4">
              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    {settings.soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5 text-neutral-400" />}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-black">Sound Effects</div>
                    <div className="text-[11px] text-neutral-400">Audio feedback for escapes and bumps</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('soundEnabled', !settings.soundEnabled)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    settings.soundEnabled ? 'bg-black justify-end' : 'bg-neutral-200 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5.5 h-5.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>

              {/* Haptic Vibration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-black">Haptic Feedback</div>
                    <div className="text-[11px] text-neutral-400">Gentle vibration on tap & collision</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('hapticsEnabled', !settings.hapticsEnabled)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    settings.hapticsEnabled ? 'bg-black justify-end' : 'bg-neutral-200 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5.5 h-5.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>

              {/* Trajectory Guide Line */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Eye className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-black">Trajectory Line</div>
                    <div className="text-[11px] text-neutral-400">Preview path clearance on hover/tap</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('showTrajectory', !settings.showTrajectory)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    settings.showTrajectory ? 'bg-black justify-end' : 'bg-neutral-200 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5.5 h-5.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Moon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-black">Dark Mode</div>
                    <div className="text-[11px] text-neutral-400">Dim interface for night play</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('darkMode', !settings.darkMode)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    settings.darkMode ? 'bg-black justify-end' : 'bg-neutral-200 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-5.5 h-5.5 rounded-full bg-white shadow-xs"
                  />
                </button>
              </div>
            </div>

            {/* Custom Board Theme Palette Selector */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-bold text-black">Board Theme Style</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => updateField('themeOverride', null)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    settings.themeOverride === null
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Auto-Rotate
                </button>

                {THEMES.map((th) => {
                  const isSelected = settings.themeOverride === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => updateField('themeOverride', th.id)}
                      className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: th.accentColor }}
                      />
                      <span className="truncate text-[11px]">{th.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Progress Danger Zone */}
            <div className="pt-3 border-t border-neutral-100 mt-auto">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-red-200/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Saved Progress...</span>
                </button>
              ) : (
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200">
                  <div className="text-xs font-bold text-red-900 mb-1">
                    Are you sure? This resets all stars and completed levels.
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleTriggerReset}
                      className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="flex-1 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl border border-neutral-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
