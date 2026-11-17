package com.arrowgo.puzzle;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AdMobPlugin.class);
        super.onCreate(savedInstanceState);
        MobileAds.initialize(this, initializationStatus -> {});

        // Enable standard smooth native Chromium GPU rendering
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                WebView webView = getBridge().getWebView();
                // Use default layer type so Chromium renders directly without off-screen GPU texture thrashing
                webView.setLayerType(View.LAYER_TYPE_NONE, null);
                WebSettings settings = webView.getSettings();
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
            }
        } catch (Exception e) {
            // Safe fallback
        }
    }
}
