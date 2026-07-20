import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  deleteDoc, onSnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore'
import { db, COLLECTION_MAP } from './firebase'
import { seedFirestore } from './seedData'

const isNative = typeof window !== 'undefined' && window.Capacitor?.isNative
const BASE44_API = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

async function base44Api(action, extra = {}) {
  try {
    const res = await fetch(BASE44_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    })
    return await res.json()
  } catch (err) {
    console.error('API error:', err)
    return { success: false, error: err.message }
  }
}

const useFirebase = isNative || import.meta.env.VITE_USE_FIREBASE === 'true'

function docToObject(d) {
  if (!d.exists()) return null
  const data = d.data()
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString()
    }
  })
  return { id: d.id, ...data }
}

export async function fetchAll() {
  if (useFirebase) {
    await seedFirestore()

    const result = {}
    const collections = [
      'app_settings', 'app_banner', 'courses', 'flashcard_decks',
      'quizzes', 'documents', 'plans', 'payments', 'coupons',
      'badges', 'leaderboard', 'faqs', 'testimonials',
      'announcements', 'notifications', 'features',
      'contact_messages', 'system_logs',
    ]

    await Promise.all(collections.map(async (colName) => {
      try {
        const snap = await getDocs(collection(db, colName))
        result[colName] = snap.docs.map(docToObject)
      } catch {
        result[colName] = []
      }
    }))

    return {
      success: true,
      appSettings: result.app_settings?.[0] || null,
      banner: result.app_banner?.[0] || null,
      courses: result.courses || [],
      flashcardDecks: result.flashcard_decks || [],
      quizzes: result.quizzes || [],
      documents: result.documents || [],
      plans: result.plans || [],
      payments: result.payments || [],
      coupons: result.coupons || [],
      badges: result.badges || [],
      leaderboard: result.leaderboard || [],
      faqs: result.faqs || [],
      testimonials: result.testimonials || [],
      announcements: result.announcements || [],
      notifications: result.notifications || [],
      features: result.features || [],
      messages: result.contact_messages || [],
      logs: result.system_logs || [],
      users: [],
    }
  }
  return base44Api('get_app_config')
}

export async function createRecord(collectionKey, data) {
  if (useFirebase) {
    const colName = COLLECTION_MAP[collectionKey] || collectionKey
    const docRef = await addDoc(collection(db, colName), {
      ...data,
      created_date: serverTimestamp(),
      updated_date: serverTimestamp(),
    })
    const newDoc = await getDoc(docRef)
    return { success: true, data: docToObject(newDoc) }
  }
  return base44Api('create', { collection: collectionKey, data })
}

export async function updateRecord(collectionKey, id, patch) {
  if (useFirebase) {
    const colName = COLLECTION_MAP[collectionKey] || collectionKey
    await updateDoc(doc(db, colName, id), { ...patch, updated_date: serverTimestamp() })
    return { success: true }
  }
  return base44Api('update', { collection: collectionKey, id, data: patch })
}

export async function deleteRecord(collectionKey, id) {
  if (useFirebase) {
    const colName = COLLECTION_MAP[collectionKey] || collectionKey
    await deleteDoc(doc(db, colName, id))
    return { success: true }
  }
  return base44Api('delete', { collection: collectionKey, id })
}

export function subscribeToCollection(collectionKey, callback) {
  if (!useFirebase) return () => {}
  const colName = COLLECTION_MAP[collectionKey] || collectionKey
  return onSnapshot(collection(db, colName), (snap) => {
    callback(snap.docs.map(docToObject))
  })
}

export async function adminLoginFirebase(email, password) {
  if (useFirebase) {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('./firebase')
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, session: { email: userCred.user.email, uid: userCred.user.uid } }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
  return base44Api('admin_login', { payload: { email, password } })
}

export { useFirebase, seedFirestore }
