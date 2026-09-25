package com.arrowgo.puzzle;

import android.app.Activity;
import android.util.Log;
import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

@CapacitorPlugin(name = "AdMob")
public class AdMobPlugin extends Plugin {

    private static final String TAG = "AdMobPlugin";
    private static final String TEST_REWARDED_ID = "ca-app-pub-3940256099942544/5224354917";
    private static final String TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";

    private boolean isInitialized = false;

    @PluginMethod
    public void initialize(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        MobileAds.initialize(activity, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(@NonNull InitializationStatus initializationStatus) {
                isInitialized = true;
                Log.d(TAG, "Google Mobile Ads initialized successfully");
                JSObject ret = new JSObject();
                ret.put("initialized", true);
                call.resolve(ret);
            }
        });
    }

    @PluginMethod
    public void showRewardedVideo(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        String adUnitId = call.getString("adUnitId", TEST_REWARDED_ID);
        AdRequest adRequest = new AdRequest.Builder().build();

        activity.runOnUiThread(() -> {
            RewardedAd.load(activity, adUnitId, adRequest, new RewardedAdLoadCallback() {
                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                    Log.e(TAG, "Rewarded ad failed to load: " + loadAdError.getMessage());
                    call.reject("Failed to load rewarded ad: " + loadAdError.getMessage(), String.valueOf(loadAdError.getCode()));
                }

                @Override
                public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                    Log.d(TAG, "Rewarded ad loaded successfully");
                    final boolean[] rewardEarned = {false};

                    rewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                        @Override
                        public void onAdShowedFullScreenContent() {
                            Log.d(TAG, "Rewarded ad displayed full screen");
                        }

                        @Override
                        public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                            Log.e(TAG, "Rewarded ad failed to show: " + adError.getMessage());
                            call.reject("Failed to show rewarded ad: " + adError.getMessage());
                        }

                        @Override
                        public void onAdDismissedFullScreenContent() {
                            Log.d(TAG, "Rewarded ad dismissed");
                            JSObject ret = new JSObject();
                            ret.put("rewarded", rewardEarned[0]);
                            call.resolve(ret);
                        }
                    });

                    rewardedAd.show(activity, rewardItem -> {
                        Log.d(TAG, "User earned reward: " + rewardItem.getAmount() + " " + rewardItem.getType());
                        rewardEarned[0] = true;
                    });
                }
            });
        });
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        String adUnitId = call.getString("adUnitId", TEST_INTERSTITIAL_ID);
        AdRequest adRequest = new AdRequest.Builder().build();

        activity.runOnUiThread(() -> {
            InterstitialAd.load(activity, adUnitId, adRequest, new InterstitialAdLoadCallback() {
                @Override
                public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                    Log.d(TAG, "Interstitial ad loaded successfully");
                    interstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                        @Override
                        public void onAdDismissedFullScreenContent() {
                            Log.d(TAG, "Interstitial ad dismissed");
                            JSObject ret = new JSObject();
                            ret.put("dismissed", true);
                            call.resolve(ret);
                        }

                        @Override
                        public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                            Log.e(TAG, "Interstitial ad failed to show: " + adError.getMessage());
                            call.reject("Failed to show interstitial: " + adError.getMessage());
                        }
                    });

                    interstitialAd.show(activity);
                }

                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                    Log.e(TAG, "Interstitial ad failed to load: " + loadAdError.getMessage());
                    call.reject("Failed to load interstitial: " + loadAdError.getMessage(), String.valueOf(loadAdError.getCode()));
                }
            });
        });
    }
}
