# EKIII Teacher Hub (Android APK)

Offline exam system wrapped as an Android app with Capacitor.
Every push to `main` builds a new APK automatically via GitHub Actions.

Get the APK: **Releases -> Latest APK -> EKIII-Teacher-Hub.apk**
(or Actions -> latest run -> Artifacts).

To update the app: replace `www/index.html` (keep the line
`<script src="capacitor-bridge.js"></script>` right after `<head>`) and commit.
