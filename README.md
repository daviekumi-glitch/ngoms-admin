# Ngoms Admin — Control Panel

> Admin dashboard for the **Ngoms AI** education platform. Manage all content, settings, and users from one unified interface.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor)](https://capacitorjs.com)

---

## ✨ Features

- **Universal CRUD Manager** — One component manages all 18 Firestore collections
- **Live Banner Editor** — Edit app banners with real-time preview
- **Settings Manager** — Color pickers, toggles, and global app configuration
- **Dashboard Overview** — Stats at a glance across all collections
- **Feature Toggles** — Enable/disable platform features without deployment
- **Admin Authentication** — Secure login via Firebase Auth
- **Android APK** — Deployable as a native app via Capacitor

---

## 🗂 Managed Collections

| # | Collection | # | Collection |
|---|---|---|---|
| 1 | Courses | 10 | FAQs |
| 2 | Flashcard Decks | 11 | Testimonials |
| 3 | Quizzes | 12 | Announcements |
| 4 | Documents | 13 | Notifications |
| 5 | Subscription Plans | 14 | Feature Toggles |
| 6 | Payments | 15 | Contact Messages |
| 7 | Coupons | 16 | System Logs |
| 8 | Badges | 17 | App Banner |
| 9 | Leaderboard | 18 | App Settings |

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Auth & Database:** Firebase (Auth + Firestore)
- **Mobile:** Capacitor → Android APK
- **Icons:** Lucide React
- **Notifications:** react-hot-toast

---

## 📁 Project Structure

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
    CrudManager.jsx    # Universal CRUD for all 18 collections
    BannerManager.jsx  # Live banner editor with preview
    SettingsManager.jsx# App settings with color pickers
  components/
    Layout.jsx         # Sidebar nav + top bar
  styles/
    globals.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (same project as `ngoms-ai`)

### Installation

```bash
git clone https://github.com/daviekumi-glitch/ngoms-admin.git
cd ngoms-admin
npm install
```

### Environment Variables

```bash
cp .env.example .env
# Fill in your Firebase config values
```

### Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 🔥 Firebase Setup

> Uses the **same Firebase project** as `ngoms-ai`.

1. Ensure Firebase project is set up (see `ngoms-ai` README)
2. Add admin user email/password in Firebase Auth console
3. Copy Firebase config into `src/lib/firebase.js`

---

## 📱 Android APK Build

GitHub Actions automatically builds the APK on push to `main`.

For manual builds, see `APK_BUILD_INSTRUCTIONS.md`.

```bash
npm run build
npx cap sync android
npx cap open android
```

---

## 🔗 Related

- [Ngoms AI — Main Platform](https://github.com/daviekumi-glitch/ngoms-ai)

---

## 📄 License

This project is private. All rights reserved.

---

*Built with ❤️ by [Davie Kuminga](https://github.com/daviekumi-glitch)*
