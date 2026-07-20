import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDeNJkAj-KwnoYp0danbKjR64M9RIV9Oho",
  authDomain: "ngoms-ai-edfa5.firebaseapp.com",
  projectId: "ngoms-ai-edfa5",
  storageBucket: "ngoms-ai-edfa5.firebasestorage.app",
  messagingSenderId: "271468761263",
  appId: "1:271468761263:web:82e8bf0b4bd66403fcc45a",
  measurementId: "G-C075J4HC5N"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Analytics only in browser, not in Capacitor
try {
  if (typeof window !== 'undefined' && !window.Capacitor?.isNative) {
    getAnalytics(app)
  }
} catch {}

export { app }

export const COLLECTION_MAP = {
  courses: 'courses',
  flashcardDecks: 'flashcard_decks',
  flashcards: 'flashcard_decks',
  quizzes: 'quizzes',
  documents: 'documents',
  plans: 'plans',
  payments: 'payments',
  coupons: 'coupons',
  badges: 'badges',
  leaderboard: 'leaderboard',
  faqs: 'faqs',
  testimonials: 'testimonials',
  announcements: 'announcements',
  notifications: 'notifications',
  features: 'features',
  messages: 'contact_messages',
  logs: 'system_logs',
  banner: 'app_banner',
  settings: 'app_settings',
}
