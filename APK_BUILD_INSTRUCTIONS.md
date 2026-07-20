# APK Build Instructions

The GitHub Actions workflow file cannot be pushed automatically due to token limitations.
Please create this file manually in your GitHub repo:

## Steps:
1. Go to https://github.com/daviekumi-glitch/ngoms-admin
2. Click "Add file" > "Create new file"
3. Name it: `.github/workflows/build-apk.yml`
4. Paste the content below:

```yaml
name: Build Android APK
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: android-actions/setup-android@v3
      - run: npm ci || npm install
      - run: npm run build
      - run: npx cap add android || true
      - run: npx cap sync android
      - working-directory: android
        run: ./gradlew assembleDebug --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: ngoms-admin-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

5. Click "Commit new file"
6. The APK build will trigger automatically on every push to main
7. Download the APK from the "Actions" tab > latest run > Artifacts
