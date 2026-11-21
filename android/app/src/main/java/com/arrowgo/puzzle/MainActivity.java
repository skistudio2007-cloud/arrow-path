package com.arrowgo.puzzle;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AdMobPlugin.class);
        super.onCreate(savedInstanceState);
        MobileAds.initialize(this, initializationStatus -> {});

        // Enable standard smooth native Chromium GPU rendering with crash resilience
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                WebView webView = getBridge().getWebView();
                // Match game background so white screen never flashes
                webView.setBackgroundColor(0xFFedf1fa);
                // Use default layer type so Chromium renders directly without off-screen GPU texture thrashing
                webView.setLayerType(View.LAYER_TYPE_NONE, null);
                WebSettings settings = webView.getSettings();
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);

                // Auto-recover from WebView renderer process termination (prevents permanent white screen of death)
                getBridge().addWebViewListener(new WebViewListener() {
                    @Override
                    public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                        Log.w(TAG, "WebView render process gone (didCrash: " + (detail != null && detail.didCrash()) + "). Auto-recovering...");
                        try {
                            if (view != null) {
                                view.destroy();
                            }
                        } catch (Exception ignored) {}
                        recreate();
                        return true;
                    }
                });
            }
        } catch (Exception e) {
            Log.e(TAG, "Error configuring WebView", e);
        }
    }
}
