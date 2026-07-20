import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import {
  LayoutDashboard, BookOpen, Layers, HelpCircle, FileText, CreditCard,
  DollarSign, Ticket, Award, Trophy, Star, Megaphone, Bell, ToggleRight,
  Mail, Activity, LogOut, Menu, X, Settings, ChevronRight, Image, Sliders
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/flashcards', label: 'Flashcards', icon: Layers },
  { path: '/quizzes', label: 'Quizzes', icon: HelpCircle },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/plans', label: 'Plans', icon: CreditCard },
  { path: '/payments', label: 'Payments', icon: DollarSign },
  { path: '/coupons', label: 'Coupons', icon: Ticket },
  { path: '/badges', label: 'Badges', icon: Award },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/faqs', label: 'FAQs', icon: HelpCircle },
  { path: '/testimonials', label: 'Testimonials', icon: Star },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/features', label: 'Features', icon: ToggleRight },
  { path: '/banner', label: 'App Banner', icon: Image },
  { path: '/settings', label: 'App Settings', icon: Sliders },
  { path: '/messages', label: 'Messages', icon: Mail },
  { path: '/logs', label: 'System Logs', icon: Activity },
]

export default function Layout() {
  const { admin, logout } = useAdmin()
  const nav = useNavigate()
  const loc = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!admin) {
    nav('/login')
    return null
  }

  const handleNav = (path) => {
    nav(path)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-navy-800/80 backdrop-blur-xl border-r border-white/10 z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-white font-black text-lg">N</div>
            <div>
              <p className="text-white font-bold text-sm">Ngoms Admin</p>
              <p className="text-white/40 text-xs">Control Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-3 overflow-y-auto h-[calc(100vh-180px)] space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = loc.pathname === item.path
            return (
              <button key={item.path} onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active ? 'bg-primary/20 text-primary font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                }`}>
                <item.icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {active && <ChevronRight size={14} />}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button onClick={() => { logout(); nav('/login') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-navy-900/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/60">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet flex items-center justify-center text-white text-sm font-bold">
              {(admin?.email || 'A')[0].toUpperCase()}
            </div>
            <span className="text-white/60 text-xs hidden sm:block">{admin?.email || 'admin'}</span>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
