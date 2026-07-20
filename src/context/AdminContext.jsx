import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AdminCtx = createContext(null)
export const useAdmin = () => useContext(AdminCtx)

// Backend API (Base44 for now, Firebase will be added)
const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

async function api(action, extra = {}) {
  try {
    const res = await fetch(API_URL, {
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

  const refresh = useCallback(async () => {
    setLoading(true)
    const res = await api('get_app_config')
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
    const res = await api('admin_login', { payload: { email, password: pass } })
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

  // CRUD operations
  const create = useCallback(async (col, item) => {
    const res = await api('create', { collection: col, data: item })
    if (res.success) {
      const key = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [key]: [...(s[key] || []), res.data] }))
      return res.data
    }
    return null
  }, [])

  const update = useCallback(async (col, id, patch) => {
    const res = await api('update', { collection: col, id, data: patch })
    if (res.success) {
      const key = col === 'flashcards' ? 'flashcardDecks' : col
      setData(s => ({ ...s, [key]: (s[key] || []).map(x => x.id === id ? { ...x, ...patch } : x) }))
    }
  }, [])

  const remove = useCallback(async (col, id) => {
    const res = await api('delete', { collection: col, id })
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
      ...data, loading, admin,
      login, logout, refresh,
      create, update, remove,
      setBanner, setSettings, pushNotification, toggleFeature,
    }}>
      {children}
    </AdminCtx.Provider>
  )
}
