import React, { useState } from 'react';
import {
  Globe,
  Waves,
  Volume2,
  Moon,
  User,
  Ban,
  RotateCcw,
  Star,
  Edit3,
  FileText,
  Info,
  ChevronRight,
  Sparkles,
  Eye,
  Trash2,
  Check,
  HelpCircle,
  Tv,
} from 'lucide-react';
import { GameSettings } from './SettingsModal';
import { THEMES } from '../utils/levels';
import { soundManager } from '../utils/audio';
import { LANGUAGES, LanguageCode, t } from '../utils/translations';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  settings: GameSettings;
  currentLanguage: LanguageCode;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onResetProgress: () => void;
  onOpenHowToPlay: () => void;
  onTestRewardedAd?: () => void;
  onTestInterstitialAd?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  currentLanguage,
  onUpdateSettings,
  onSelectLanguage,
  onResetProgress,
  onOpenHowToPlay,
  onTestRewardedAd,
  onTestInterstitialAd,
}) => {
  const [accountConnected, setAccountConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('arrowgo_account_connected') === 'true';
    } catch {
      return false;
    }
  });
  const [removeAds, setRemoveAds] = useState<boolean>(() => {
    try {
      return localStorage.getItem('arrowgo_remove_ads') === 'true';
    } catch {
      return false;
    }
  });

  const [showLanguagePicker, setShowLanguagePicker] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  const activeLangObj = LANGUAGES.find((l) => l.id === currentLanguage) || LANGUAGES[0];

  // Toggle switch helper component with fluid spring animation
  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; id?: string }> = ({
    checked,
    onChange,
    id,
  }) => (
    <motion.button
      type="button"
      id={id}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      whileTap={{ scale: 0.9 }}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
        checked ? 'bg-[#5266fc]' : 'bg-[#c4cfdf]'
      }`}
    >
      <motion.span
        animate={{
          x: checked ? 22 : 3,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-sm ring-0 mt-[3px]"
      />
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex-1 min-h-0 h-full w-full max-w-md sm:max-w-lg mx-auto px-4 sm:px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(6rem,calc(5.25rem+env(safe-area-inset-bottom)))] scroll-touch"
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#1e2746] text-white text-xs font-semibold rounded-full shadow-lg transition-all animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="space-y-3.5 mt-2">
        {/* Card 1: Main Controls (Language, Vibrations, Sounds, Dark mode) */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs divide-y divide-[#edf1f9] overflow-hidden">
          {/* Language */}
          <div
            onClick={() => setShowLanguagePicker(!showLanguagePicker)}
            className="flex items-center justify-between p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Globe className="w-5 h-5 text-[#425070]" />
              <span className="font-bold text-sm">{t(currentLanguage, 'language')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-[#8a98b4]">
              <span>{activeLangObj.nativeName}</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  showLanguagePicker ? 'rotate-90' : ''
                }`}
              />
            </div>
          </div>

          {/* Language Picker Dropdown */}
          {showLanguagePicker && (
            <div className="p-3 bg-[#edf2fb] grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      onSelectLanguage(lang.id);
                      setShowLanguagePicker(false);
                      showToast(`${t(lang.id, 'language')}: ${lang.nativeName}`);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left truncate flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#5266fc] border-[#5266fc] shadow-2xs'
                        : 'bg-white/60 text-[#3d4a6b] border-transparent hover:bg-white'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#5266fc]" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Vibrations */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Waves className="w-5 h-5 text-[#425070]" />
              <span className="font-bold text-sm">{t(currentLanguage, 'vibrations')}</span>
            </div>
            <ToggleSwitch
              id="switch-vibrations"
              checked={settings.hapticsEnabled}
              onChange={() => {
                const next = !settings.hapticsEnabled;
                updateSetting('hapticsEnabled', next);
                if (next && typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(30);
                }
                showToast(next ? t(currentLanguage, 'vibrationsEnabled') : t(currentLanguage, 'vibrationsDisabled'));
              }}
            />
          </div>

          {/* Sounds */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Volume2 className="w-5 h-5 text-[#425070]" />
              <span className="font-bold text-sm">{t(currentLanguage, 'sounds')}</span>
            </div>
            <ToggleSwitch
              id="switch-sounds"
              checked={settings.soundEnabled}
              onChange={() => {
                const next = !settings.soundEnabled;
                updateSetting('soundEnabled', next);
                if (next) {
                  soundManager.playTap();
                }
                showToast(next ? t(currentLanguage, 'soundsEnabled') : t(currentLanguage, 'soundsDisabled'));
              }}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Moon className="w-5 h-5 text-[#425070]" />
              <span className="font-bold text-sm">{t(currentLanguage, 'darkMode')}</span>
            </div>
            <ToggleSwitch
              id="switch-dark-mode"
              checked={settings.darkMode}
              onChange={() => {
                const next = !settings.darkMode;
                updateSetting('darkMode', next);
                showToast(next ? t(currentLanguage, 'darkModeEnabled') : t(currentLanguage, 'lightModeEnabled'));
              }}
            />
          </div>
        </div>

        {/* Card 2: Gameplay Settings (Trajectory, Theme) */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs divide-y divide-[#edf1f9] overflow-hidden">
          {/* Trajectory Guide */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Eye className="w-5 h-5 text-[#425070]" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">{t(currentLanguage, 'trajectoryGuide')}</span>
                <span className="text-[11px] text-[#8694b2] font-medium">
                  {t(currentLanguage, 'trajectoryDesc')}
                </span>
              </div>
            </div>
            <ToggleSwitch
              id="switch-trajectory"
              checked={settings.showTrajectory}
              onChange={() => {
                const next = !settings.showTrajectory;
                updateSetting('showTrajectory', next);
                showToast(next ? t(currentLanguage, 'trajectoryEnabled') : t(currentLanguage, 'trajectoryDisabled'));
              }}
            />
          </div>

          {/* Board Theme */}
          <div
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="flex items-center justify-between p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Sparkles className="w-5 h-5 text-[#5067ee]" />
              <span className="font-bold text-sm">{t(currentLanguage, 'boardTheme')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-[#8a98b4]">
              <span>
                {settings.themeOverride
                  ? THEMES.find((t) => t.id === settings.themeOverride)?.name || 'Custom'
                  : t(currentLanguage, 'autoRotate')}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  showThemePicker ? 'rotate-90' : ''
                }`}
              />
            </div>
          </div>

          {/* Theme Picker Dropdown */}
          {showThemePicker && (
            <div className="p-3 bg-[#edf2fb] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  updateSetting('themeOverride', null);
                  showToast(`${t(currentLanguage, 'boardTheme')}: ${t(currentLanguage, 'autoRotate')}`);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  settings.themeOverride === null
                    ? 'bg-white text-[#5266fc] border-[#5266fc] shadow-2xs'
                    : 'bg-white/60 text-[#3d4a6b] border-transparent hover:bg-white'
                }`}
              >
                🔄 {t(currentLanguage, 'autoRotate')}
              </button>
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    updateSetting('themeOverride', th.id);
                    showToast(`${t(currentLanguage, 'boardTheme')}: ${th.name}`);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left truncate cursor-pointer ${
                    settings.themeOverride === th.id
                      ? 'bg-white text-[#5266fc] border-[#5266fc] shadow-2xs'
                      : 'bg-white/60 text-[#3d4a6b] border-transparent hover:bg-white'
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Account Connection */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#2c3858]">
            <User className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'accountConnection')}</span>
          </div>
          <ToggleSwitch
            id="switch-account"
            checked={accountConnected}
            onChange={() => {
              const next = !accountConnected;
              setAccountConnected(next);
              try {
                localStorage.setItem('arrowgo_account_connected', String(next));
              } catch {}
              showToast(next ? t(currentLanguage, 'guestConnected') : t(currentLanguage, 'accountDisconnected'));
            }}
          />
        </div>

        {/* Card 4: Purchases */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs divide-y divide-[#edf1f9] overflow-hidden">
          {/* Remove Ads */}
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-3 text-[#2c3858]">
              <Ban className="w-5 h-5 text-[#425070]" />
              <span className="font-bold text-sm">{t(currentLanguage, 'removeAds')}</span>
            </div>
            <ToggleSwitch
              id="switch-remove-ads"
              checked={removeAds}
              onChange={() => {
                const next = !removeAds;
                setRemoveAds(next);
                try {
                  localStorage.setItem('arrowgo_remove_ads', String(next));
                } catch {}
                showToast(next ? t(currentLanguage, 'adsRemoved') : t(currentLanguage, 'adsEnabled'));
              }}
            />
          </div>

          {/* Restore Purchases */}
          <div
            onClick={() => showToast(t(currentLanguage, 'purchasesUpToDate'))}
            className="flex items-center gap-3 p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <RotateCcw className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'restorePurchases')}</span>
          </div>
        </div>

        {/* Card: Google AdMob Test Ads */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs divide-y divide-[#edf1f9] overflow-hidden">
          <div className="px-3.5 py-2.5 bg-[#eef4ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 border border-amber-500/30">
                AdMob
              </span>
              <span className="font-extrabold text-xs text-[#2c3858]">Google AdMob Test Ads</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>

          {/* Test Rewarded Video */}
          <div
            onClick={onTestRewardedAd}
            className="flex items-center justify-between p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <div className="flex items-center gap-3">
              <Tv className="w-5 h-5 text-[#425070]" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">Test Rewarded Video</span>
                <span className="text-[11px] text-[#8694b2] font-medium">Watch test ad to earn +1 Hint</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8694b2]" />
          </div>

          {/* Test Interstitial Ad */}
          <div
            onClick={onTestInterstitialAd}
            className="flex items-center justify-between p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#425070]" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">Test Interstitial Ad</span>
                <span className="text-[11px] text-[#8694b2] font-medium">Full-screen test ad (Level 15, 20, 25...)</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8694b2]" />
          </div>
        </div>

        {/* Card 5: Feedback & Help */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs divide-y divide-[#edf1f9] overflow-hidden">
          <div
            onClick={() => showToast(t(currentLanguage, 'ratingThanks'))}
            className="flex items-center gap-3 p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <Star className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'rateUs')}</span>
          </div>

          <div
            onClick={() => showToast(t(currentLanguage, 'supportContact'))}
            className="flex items-center gap-3 p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <Edit3 className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'writeUs')}</span>
          </div>

          <div
            onClick={onOpenHowToPlay}
            className="flex items-center gap-3 p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <HelpCircle className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'howToPlay')}</span>
          </div>
        </div>

        {/* Card 6: Legal & Danger Zone */}
        <div className="bg-[#f8faff] rounded-2xl border border-[#e5ebf7] shadow-2xs divide-y divide-[#edf1f9] overflow-hidden">
          <div
            onClick={() => showToast(t(currentLanguage, 'privacyNotice'))}
            className="flex items-center gap-3 p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <FileText className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'privacy')}</span>
          </div>

          <div
            onClick={() => showToast(t(currentLanguage, 'termsNotice'))}
            className="flex items-center gap-3 p-3.5 hover:bg-[#f1f5fc] transition-colors cursor-pointer text-[#2c3858]"
          >
            <Info className="w-5 h-5 text-[#425070]" />
            <span className="font-bold text-sm">{t(currentLanguage, 'termsOfService')}</span>
          </div>

          {/* Reset Progress */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-5 h-5" />
              <span className="font-bold text-sm">{t(currentLanguage, 'resetProgress')}</span>
            </div>

            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-200 text-neutral-700 cursor-pointer"
                >
                  {t(currentLanguage, 'cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                    showToast(t(currentLanguage, 'progressResetDone'));
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white cursor-pointer shadow-xs"
                >
                  {t(currentLanguage, 'confirmReset')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                {t(currentLanguage, 'clearData')}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
