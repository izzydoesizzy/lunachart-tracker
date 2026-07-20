import SwiftUI
import WebKit

// NOTE: Swift changes in this commit were written without access to Xcode
// (Linux build environment) — review by compiling before release.
struct WebView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        config.defaultWebpagePreferences.allowsContentJavaScript = true
        // The app posts { filename, mime, base64 } here for exports (backup
        // JSON, practitioner chart PNG) → presented via the native share sheet.
        config.userContentController.add(context.coordinator, name: "share")

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.isOpaque = false
        // Lunar night ground (#12142B) so overscroll/launch never flashes white
        webView.backgroundColor = UIColor(red: 0x12/255, green: 0x14/255, blue: 0x2B/255, alpha: 1)

        // Allow links in articles to open in Safari
        webView.navigationDelegate = context.coordinator

        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "WebAssets") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url {
                // External links (http/https) open in Safari; local file:// loads stay in-app
                if url.scheme == "http" || url.scheme == "https" {
                    UIApplication.shared.open(url)
                    decisionHandler(.cancel)
                    return
                }
            }
            decisionHandler(.allow)
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.name == "share",
                  let body = message.body as? [String: Any],
                  let filename = body["filename"] as? String,
                  let base64 = body["base64"] as? String,
                  let data = Data(base64Encoded: base64) else { return }
            let url = FileManager.default.temporaryDirectory.appendingPathComponent(filename)
            do { try data.write(to: url) } catch { return }
            DispatchQueue.main.async {
                guard let scene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
                      let root = scene.windows.first(where: { $0.isKeyWindow })?.rootViewController else { return }
                let activity = UIActivityViewController(activityItems: [url], applicationActivities: nil)
                activity.popoverPresentationController?.sourceView = root.view
                root.present(activity, animated: true)
            }
        }
    }
}

struct ContentView: View {
    var body: some View {
        WebView()
            .ignoresSafeArea()
            .persistentSystemOverlays(.hidden)
    }
}
