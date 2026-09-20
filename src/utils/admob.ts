// Official Google AdMob Android Test Ad Unit IDs
// Documentation: https://developers.google.com/admob/android/test-ads

export const GOOGLE_ADMOB_TEST_IDS = {
  // Sample AdMob App ID for Android
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',

  // Rewarded Video Ad Unit ID (Used for Hints and Extra Lives)
  REWARDED_VIDEO: 'ca-app-pub-3940256099942544/5224354917',

  // Interstitial Ad Unit ID (Used for Level 15, 20, 25, 30, ...)
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',

  // Standard Banner Ad Unit ID
  BANNER: 'ca-app-pub-3940256099942544/6300978111',

  // Rewarded Interstitial Ad Unit ID
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
} as const;

/**
 * Checks whether an interstitial ad should be triggered for a completed level.
 * Triggers on level 15, 20, 25, 30, 35, 40, ... (multiples of 5 starting from 15).
 */
export function shouldTriggerInterstitial(levelId: number): boolean {
  return levelId >= 15 && levelId % 5 === 0;
}
