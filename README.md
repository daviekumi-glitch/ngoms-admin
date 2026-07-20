# Ngoms Admin — Control Panel

Admin panel for the Ngoms AI education platform.

## Tech Stack
- React 18 + Vite + Tailwind CSS
- Firebase (Auth + Firestore)
- Capacitor — Android APK wrapper
- react-hot-toast — Notifications

## Project Structure
```
src/
  App.jsx              # Routes for all CRUD managers
  context/
    AdminContext.jsx   # Admin auth + state + CRUD
  lib/
    firebase.js        # Firebase config (shared with main app)
    firebaseApi.js     # API layer (Firebase + Base44)
    seedData.js        # First-run seeding
  pages/
    Login.jsx          # Admin authentication
    Dashboard.jsx      # Overview stats
    CrudManager.jsx    # Universal CRUD for all 19 collections
    BannerManager.jsx  # Live banner editor with preview
    SettingsManager.jsx# App settings with color pickers
  components/
    Layout.jsx         # Sidebar nav + top bar
  styles/
    globals.css
```

## Managed Collections
1. Courses
2. Flashcard Decks
3. Quizzes
4. Documents
5. Subscription Plans
6. Payments
7. Coupons
8. Badges
9. Leaderboard
10. FAQs
11. Testimonials
12. Announcements
13. Notifications
14. Feature Toggles
15. Contact Messages
16. System Logs
17. App Banner
18. App Settings

## Development
```bash
npm install
npm run dev
npm run build
```

## Firebase
- Project: ngoms-ai-edfa5 (shared with main app)
- Login: Email/Password auth
- Same Firestore database

## APK Build
Add `.github/workflows/build-apk.yml` — see APK_BUILD_INSTRUCTIONS.md
