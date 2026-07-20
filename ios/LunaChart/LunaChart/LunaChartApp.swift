import SwiftUI

@main
struct LunaChartApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
            // Follows the system appearance; the web app's Night/Day setting
            // governs its own theme inside the WKWebView.
        }
    }
}
