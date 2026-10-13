import { GOOGLE_ADMOB_TEST_IDS } from './admob';

export interface AdMobShowResult {
  rewarded?: boolean;
  dismissed?: boolean;
  error?: string;
}

// Check if running in native Capacitor environment with AdMobPlugin
export function isNativeAdMobAvailable(): boolean {
  try {
    const w = typeof window !== 'undefined' ? (window as any) : null;
    return !!(w && w.Capacitor && w.Capacitor.isNativePlatform() && w.Capacitor.Plugins && w.Capacitor.Plugins.AdMob);
  } catch {
    return false;
  }
}

/**
 * Shows a rewarded video ad.
 * Tries native Google AdMob test ad on Android first.
 * If native is unavailable or fails, falls back to web simulation modal.
 * If Remove Ads is active, instantly grants reward without showing any ad.
 */
export async function showRewardedVideoAd(
  onReward: () => void,
  fallbackToModal: () => void
): Promise<void> {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('arrowgo_remove_ads') === 'true') {
      onReward();
      return;
    }
  } catch {}

  if (isNativeAdMobAvailable()) {
    try {
      const w = window as any;
      const res = await w.Capacitor.Plugins.AdMob.showRewardedVideo({
        adUnitId: GOOGLE_ADMOB_TEST_IDS.REWARDED_VIDEO,
      });
      if (res && res.rewarded) {
        onReward();
        return;
      }
    } catch (err) {
      console.warn('Native AdMob showRewardedVideo failed, using fallback modal:', err);
    }
  }

  // Fallback to web AdMob modal
  fallbackToModal();
}

/**
 * Shows an interstitial ad.
 * Tries native Google AdMob test ad on Android first.
 * If native is unavailable or fails, falls back to web simulation modal.
 * If Remove Ads is active, instantly skips without showing any ad.
 */
export async function showInterstitialAd(
  onDismiss: () => void,
  fallbackToModal: () => void
): Promise<void> {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('arrowgo_remove_ads') === 'true') {
      onDismiss();
      return;
    }
  } catch {}

  if (isNativeAdMobAvailable()) {
    try {
      const w = window as any;
      await w.Capacitor.Plugins.AdMob.showInterstitial({
        adUnitId: GOOGLE_ADMOB_TEST_IDS.INTERSTITIAL,
      });
      onDismiss();
      return;
    } catch (err) {
      console.warn('Native AdMob showInterstitial failed, using fallback modal:', err);
    }
  }

  // Fallback to web AdMob modal
  fallbackToModal();
}
