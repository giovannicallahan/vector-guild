package com.vectorguild.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.graphics.Insets;
import android.view.WindowInsets;
import android.speech.tts.TextToSpeech;
import java.util.Locale;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final int OPEN_FILE = 1, SAVE_FILE = 2;
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private byte[] pendingSave;
    private TextToSpeech speech;
    private boolean speechReady;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        webView = new WebView(this);
        FrameLayout container = new FrameLayout(this);
        container.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        // Android 15+ enforces edge-to-edge for apps targeting API 35 or later.
        // Inset the WebView so its controls remain clear of system bars and cutouts.
        if (Build.VERSION.SDK_INT >= 35) {
            getWindow().setDecorFitsSystemWindows(false);
            container.setOnApplyWindowInsetsListener((view, windowInsets) -> {
                Insets safe = windowInsets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return windowInsets;
            });
        }
        setContentView(container);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        webView.addJavascriptInterface(new SaveBridge(), "AndroidSave");
        speech = new TextToSpeech(this, status -> {
            speechReady = status == TextToSpeech.SUCCESS;
            if (speechReady) speech.setLanguage(Locale.US);
        });
        webView.addJavascriptInterface(new SpeechBridge(), "AndroidSpeech");
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("file:///android_asset/game/")) return null;
                return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri.toString().startsWith("file:///android_asset/game/")) return false;
                if ("https".equalsIgnoreCase(uri.getScheme()) && request.hasGesture()) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (Exception e) { Toast.makeText(MainActivity.this, "No browser available", Toast.LENGTH_SHORT).show(); }
                }
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                // Intercept the game's Blob download and let the system save picker write it.
                view.evaluateJavascript("(function(){if(window.__vgSaveHook)return;window.__vgSaveHook=true;var old=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download&&this.href.startsWith('blob:')){fetch(this.href).then(r=>r.blob()).then(b=>{var f=new FileReader();f.onload=()=>AndroidSave.exportFile(this.download||'mathcosmos-save.json',f.result.split(',')[1]);f.readAsDataURL(b)});return}return old.call(this)}})()", null);
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json");
                try { startActivityForResult(intent, OPEN_FILE); }
                catch (Exception e) { fileCallback.onReceiveValue(null); fileCallback = null; return false; }
                return true;
            }
            @Override public boolean onJsAlert(WebView view, String url, String message, android.webkit.JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("OK", (d,w)->result.confirm()).setOnCancelListener(d->result.cancel()).show(); return true;
            }
            @Override public boolean onJsConfirm(WebView view, String url, String message, android.webkit.JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton("OK", (d,w)->result.confirm()).setNegativeButton("Cancel", (d,w)->result.cancel()).setOnCancelListener(d->result.cancel()).show(); return true;
            }
        });
        webView.loadUrl("file:///android_asset/game/index.html");
    }
    private class SpeechBridge {
        @JavascriptInterface public void speak(String text) {
            runOnUiThread(() -> {
                if (speechReady) speech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "mira");
                else Toast.makeText(MainActivity.this, "Speech is not available on this device", Toast.LENGTH_LONG).show();
            });
        }
        @JavascriptInterface public void stop() { runOnUiThread(() -> { if (speech != null) speech.stop(); }); }
    }
    private class SaveBridge {
        @JavascriptInterface public void exportFile(String name, String encoded) {
            try {
                byte[] data = Base64.decode(encoded, Base64.DEFAULT);
                runOnUiThread(() -> {
                    pendingSave = data;
                    String title = name == null ? "" : name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "").trim();
                    if (title.isEmpty() || title.length() > 80 || !title.endsWith(".json")) title = "mathcosmos-save.json";
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json").putExtra(Intent.EXTRA_TITLE, title);
                    try { startActivityForResult(intent, SAVE_FILE); }
                    catch (Exception e) { pendingSave = null; Toast.makeText(MainActivity.this, "No app available to save the file", Toast.LENGTH_LONG).show(); }
                });
            } catch (Exception e) { runOnUiThread(() -> Toast.makeText(MainActivity.this, "Could not export save", Toast.LENGTH_LONG).show()); }
        }
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == OPEN_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(result == RESULT_OK && data != null && data.getData() != null ? new Uri[]{data.getData()} : null);
            fileCallback = null;
        } else if (request == SAVE_FILE) {
            if (result == RESULT_OK && data != null && data.getData() != null && pendingSave != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                    if (out == null) throw new Exception("Cannot open destination");
                    out.write(pendingSave);
                    Toast.makeText(this, "Save exported", Toast.LENGTH_SHORT).show();
                } catch (Exception e) { Toast.makeText(this, "Could not export save", Toast.LENGTH_LONG).show(); }
            }
            pendingSave = null;
        }
    }
    @Override public void onBackPressed() {
        // The page handles Back first: close an open dialog, else return to the campaign tab.
        // It answers false only on the campaign with nothing open; then the host leaves the app.
        webView.evaluateJavascript("(function(){if(typeof window.VectorGuildBack==='function')return !!window.VectorGuildBack();var d=document.querySelector('dialog[open]');if(d){d.close();return true}return false})()", result -> {
            if (!"true".equals(result)) {
                finish();
            }
        });
    }
    @Override protected void onDestroy() {
        if (speech != null) { speech.stop(); speech.shutdown(); }
        if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        webView.destroy();
        super.onDestroy();
    }
}
