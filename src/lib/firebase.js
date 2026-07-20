import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCph1U2V2GNevaEYup77OCYIzXanDBul4k",
  authDomain: "gen-lang-client-0092159423.firebaseapp.com",
  projectId: "gen-lang-client-0092159423",
  storageBucket: "gen-lang-client-0092159423.firebasestorage.app",
  messagingSenderId: "413712477068",
  appId: "1:413712477068:web:60e829c06c26b8921c04a9",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
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
