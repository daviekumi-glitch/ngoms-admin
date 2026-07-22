import { useAdmin } from '../context/AdminContext'
import {
  BookOpen, Layers, HelpCircle, FileText, CreditCard, DollarSign,
  Users, Bell, Megaphone, TrendingUp, Activity, Star, ToggleLeft,
  MessageSquare, Award, Zap, RefreshCw, Plus, AlertTriangle,
  CheckCircle, Clock, BarChart2, Settings, Shield, Package, ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Dashboard() {
  const { courses, flashcardDecks, quizzes, documents, plans, payments,
          notifications, announcements, features, messages, logs, badges,
          leaderboard, coupons, testimonials, faqs, loading, refresh } = useAdmin()
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setTimeout(() => setRefreshing(false), 800)
  }

  const unreadMessages = messages?.filter(m => m.status === 'unread')?.length || 0
  const activeFeatures = features?.filter(f => f.enabled)?.length || 0
  const recentPayments = payments?.filter(p => p.status === 'completed')?.length || 0
  const pendingDocs = documents?.filter(d => d.status === 'Pending')?.length || 0

  const statCards = [
    { label: 'Courses', value: courses?.length || 0, icon: BookOpen, color: 'from-blue-500 to-blue-600', link: '/courses', sub: 'Study content' },
    { label: 'Flashcard Decks', value: flashcardDecks?.length || 0, icon: Layers, color: 'from-violet-500 to-purple-600', link: '/flashcards', sub: 'Memory cards' },
    { label: 'Quizzes', value: quizzes?.length || 0, icon: HelpCircle, color: 'from-amber-500 to-orange-500', link: '/quizzes', sub: 'Assessments' },
    { label: 'Documents', value: documents?.length || 0, icon: FileText, color: 'from-emerald-500 to-teal-600', link: '/documents', sub: `${pendingDocs} pending` },
    { label: 'Plans', value: plans?.length || 0, icon: Package, color: 'from-pink-500 to-rose-500', link: '/plans', sub: 'Subscriptions' },
    { label: 'Payments', value: payments?.length || 0, icon: DollarSign, color: 'from-green-500 to-emerald-600', link: '/payments', sub: `${recentPayments} completed` },
    { label: 'Notifications', value: notifications?.length || 0, icon: Bell, color: 'from-cyan-500 to-blue-500', link: '/notifications', sub: 'Sent' },
    { label: 'Messages', value: messages?.length || 0, icon: MessageSquare, color: 'from-indigo-500 to-violet-500', link: '/messages', sub: `${unreadMessages} unread`, alert: unreadMessages > 0 },
    { label: 'Badges', value: badges?.length || 0, icon: Award, color: 'from-yellow-500 to-amber-500', link: '/badges', sub: 'Achievements' },
    { label: 'Leaderboard', value: leaderboard?.length || 0, icon: TrendingUp, color: 'from-red-500 to-rose-600', link: '/leaderboard', sub: 'Top learners' },
    { label: 'Coupons', value: coupons?.length || 0, icon: Zap, color: 'from-fuchsia-500 to-pink-500', link: '/coupons', sub: 'Discount codes' },
    { label: 'FAQs', value: faqs?.length || 0, icon: MessageSquare, color: 'from-sky-500 to-cyan-600', link: '/faqs', sub: 'Help articles' },
  ]

  const quickActions = [
    { label: 'Add Course', icon: Plus, link: '/courses', color: 'bg-blue-500' },
    { label: 'Send Notification', icon: Bell, link: '/notifications', color: 'bg-cyan-500' },
    { label: 'New Announcement', icon: Megaphone, link: '/announcements', color: 'bg-orange-500' },
    { label: 'Manage Features', icon: ToggleLeft, link: '/features', color: 'bg-indigo-500' },
    { label: 'View Messages', icon: MessageSquare, link: '/messages', color: 'bg-violet-500' },
    { label: 'App Settings', icon: Settings, link: '/settings', color: 'bg-gray-500' },
  ]

  const recentLogs = logs?.slice(0, 5) || []
  const logColor = { info: 'text-blue-400', success: 'text-green-400', warning: 'text-amber-400', error: 'text-red-400' }
  const logIcon = { info: Activity, success: CheckCircle, warning: AlertTriangle, error: AlertTriangle }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Dashboard</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {currentTime.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}{currentTime.toLocaleTimeString()}
          </p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-white/60 hover:text-white text-sm font-semibold transition-all">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Alert row */}
      {unreadMessages > 0 && (
        <Link to="/messages" className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 transition-all">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <p className="text-amber-300 text-sm font-semibold">{unreadMessages} unread message{unreadMessages > 1 ? 's' : ''} waiting for your response</p>
          <ChevronRight size={15} className="text-amber-400 ml-auto" />
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {statCards.map(stat => (
          <Link key={stat.label} to={stat.link}
            className="glass p-4 rounded-2xl hover:border-white/25 transition-all group relative overflow-hidden">
            {stat.alert && <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
              <stat.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-white">{loading ? '...' : stat.value}</p>
            <p className="text-white/70 text-xs font-semibold">{stat.label}</p>
            <p className="text-white/30 text-xs mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="glass p-5 rounded-2xl">
          <h3 className="text-white font-bold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(a => (
              <Link key={a.label} to={a.link}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
                  <a.icon size={13} className="text-white" />
                </div>
                <span className="text-white/70 text-xs font-semibold leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Feature Toggles</h3>
            <Link to="/features" className="text-primary text-xs font-semibold">Manage →</Link>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>{activeFeatures} active</span>
              <span>{features?.length || 0} total</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all"
                style={{ width: `${features?.length ? (activeFeatures / features.length) * 100 : 0}%` }} />
            </div>
          </div>
          <div className="space-y-1.5">
            {features?.slice(0, 5).map(f => (
              <div key={f.id} className="flex items-center justify-between py-1">
                <span className="text-white/70 text-xs">{f.icon} {f.name}</span>
                <div className={`w-8 h-4 rounded-full transition-all ${
                  f.enabled ? 'bg-primary' : 'bg-white/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full bg-white m-0.5 transition-all ${
                    f.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Activity Log</h3>
            <Link to="/logs" className="text-primary text-xs font-semibold">View all →</Link>
          </div>
          {recentLogs.length > 0 ? (
            <div className="space-y-2">
              {recentLogs.map((log, i) => {
                const Icon = logIcon[log.level] || Activity
                return (
                  <div key={i} className="flex items-start gap-2">
                    <Icon size={13} className={`mt-0.5 shrink-0 ${logColor[log.level] || 'text-white/40'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs truncate">{log.action}</p>
                      <p className="text-white/30 text-[10px]">{log.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-white/30 text-xs text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Messages + Announcements row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Messages */}
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Recent Messages</h3>
            <Link to="/messages" className="text-primary text-xs font-semibold">View all →</Link>
          </div>
          {messages?.length > 0 ? (
            <div className="space-y-2">
              {messages.slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-black shrink-0">
                    {(m.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-semibold truncate">{m.name}</p>
                    <p className="text-white/40 text-xs truncate">{m.subject}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    m.status === 'unread' ? 'bg-amber-500/25 text-amber-300' : 'bg-white/10 text-white/30'
                  }`}>{m.status || 'read'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-4">No messages yet</p>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Announcements</h3>
            <Link to="/announcements" className="text-primary text-xs font-semibold">View all →</Link>
          </div>
          {announcements?.length > 0 ? (
            <div className="space-y-2">
              {announcements.slice(0, 4).map(a => (
                <div key={a.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white/80 text-sm font-semibold leading-snug">{a.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                      a.priority === 'critical' ? 'bg-red-500/25 text-red-400' :
                      a.priority === 'high' ? 'bg-orange-500/25 text-orange-400' :
                      a.priority === 'medium' ? 'bg-amber-500/25 text-amber-400' :
                      'bg-white/10 text-white/40'
                    }`}>{a.priority || 'low'}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-1 line-clamp-1">{a.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-4">No announcements yet</p>
          )}
        </div>
      </div>

      {/* Platform health */}
      <div className="glass p-5 rounded-2xl">
        <h3 className="text-white font-bold text-sm mb-4">Platform Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Content Coverage', value: (courses?.length || 0) + (documents?.length || 0), max: 50, color: 'bg-blue-400' },
            { label: 'Engagement Tools', value: (quizzes?.length || 0) + (flashcardDecks?.length || 0), max: 30, color: 'bg-violet-400' },
            { label: 'Active Features', value: activeFeatures, max: features?.length || 10, color: 'bg-green-400' },
            { label: 'Support Load', value: unreadMessages, max: Math.max(messages?.length || 1, 1), color: unreadMessages > 5 ? 'bg-red-400' : 'bg-amber-400' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span>{item.label}</span>
                <span className="font-bold text-white/70">{item.value}</span>
              </div>
              <MiniBar value={item.value} max={item.max} color={item.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}