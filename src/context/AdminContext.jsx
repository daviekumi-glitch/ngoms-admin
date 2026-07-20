import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  fetchAll, createRecord, updateRecord, deleteRecord,
  adminLoginFirebase, useFirebase
} from '../lib/firebaseApi'

const AdminCtx = createContext(null)
export const useAdmin = () => useContext(AdminCtx)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = sessionStorage.getItem('ngoms_admin')
    return saved ? JSON.parse(saved) : null
  })
  const [data, setData] = useState({
    banner: null, appSettings: null, features: [], announcements: [],
    notifications: [], plans: [], leaderboard: [], badges: [],
    courses: [], quizzes: [], flashcardDecks: [], documents: [],
    payments: [], coupons: [], faqs: [], testimonials: [],
    logs: [], messages: [], users: [],
  })
  const [loading, setLoading] = useState(true)
  const [isFirebase] = useState(useFirebase)

  const refresh = useCallback(async () => {
    setLoading(true)
    const res = await fetchAll()
    if (res.success) {
      setData({
        banner: res.banner, appSettings: res.appSettings,
        features: res.features, announcements: res.announcements,
        notifications: res.notifications, plans: res.plans,
        leaderboard: res.leaderboard, badges: res.badges,
        courses: res.courses, quizzes: res.quizzes,
        flashcardDecks: res.flashcardDecks, documents: res.documents,
        payments: res.payments, coupons: res.coupons,
        faqs: res.faqs, testimonials: res.testimonials,
        logs: res.logs, messages: res.messages, users: res.users || [],
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => { if (admin) refresh() }, [admin, refresh])

  const login = useCallback(async (email, pass) => {
    const res = await adminLoginFirebase(email, pass)
    if (res.success) {
      sessionStorage.setItem('ngoms_admin', JSON.stringify(res.session))
      setAdmin(res.session)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('ngoms_admin')
    setAdmin(null)
  }, [])

  const create = useCallback(async (col, item) => {
    const res = await createRecord(col, item)
    if (res.success) {
      const key = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [key]: [...(s[key] || []), res.data] }))
      return res.data
    }
    return null
  }, [])

  const update = useCallback(async (col, id, patch) => {
    const res = await updateRecord(col, id, patch)
    if (res.success) {
      const key = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [key]: (s[key] || []).map(x => x.id === id ? { ...x, ...patch } : x) }))
    }
  }, [])

  const remove = useCallback(async (col, id) => {
    const res = await deleteRecord(col, id)
    if (res.success) {
      const key = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [key]: (s[key] || []).filter(x => x.id !== id) }))
    }
  }, [])

  const pushNotification = useCallback(async (n) => {
    await create('notifications', { ...n, date: new Date().toISOString().split('T')[0], sent: 1, status: 'sent' })
  }, [create])

  const toggleFeature = useCallback(async (id) => {
    const f = data.features.find(ft => ft.id === id)
    if (f) await update('features', id, { enabled: !f.enabled })
  }, [data.features, update])

  const setBanner = useCallback(async (b) => {
    if (data.banner?.id) {
      await update('banner', data.banner.id, b)
      setData(s => ({ ...s, banner: { ...s.banner, ...b } }))
    } else {
      const created = await create('banner', b)
      setData(s => ({ ...s, banner: created }))
    }
  }, [data.banner, update, create])

  const setSettings = useCallback(async (p) => {
    if (data.appSettings?.id) {
      await update('settings', data.appSettings.id, p)
      setData(s => ({ ...s, appSettings: { ...s.appSettings, ...p } }))
    } else {
      const created = await create('settings', p)
      setData(s => ({ ...s, appSettings: created }))
    }
  }, [data.appSettings, update, create])

  return (
    <AdminCtx.Provider value={{
      ...data, loading, admin, isFirebase,
      login, logout, refresh,
      create, update, remove,
      setBanner, setSettings, pushNotification, toggleFeature,
    }}>
      {children}
    </AdminCtx.Provider>
  )
}
