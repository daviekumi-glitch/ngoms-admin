import { useAdmin } from '../context/AdminContext'
import {
  BookOpen, Layers, HelpCircle, FileText, CreditCard, DollarSign,
  Users, Bell, Megaphone, TrendingUp, Activity, Star
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { courses, flashcardDecks, quizzes, documents, plans, payments,
          notifications, announcements, features, messages, loading } = useAdmin()

  const stats = [
    { label: 'Courses', value: courses?.length || 0, icon: BookOpen, color: 'from-blue-500 to-primary', link: '/courses' },
    { label: 'Flashcard Decks', value: flashcardDecks?.length || 0, icon: Layers, color: 'from-violet to-purple-500', link: '/flashcards' },
    { label: 'Quizzes', value: quizzes?.length || 0, icon: HelpCircle, color: 'from-amber-500 to-orange-500', link: '/quizzes' },
    { label: 'Documents', value: documents?.length || 0, icon: FileText, color: 'from-emerald-500 to-teal-500', link: '/documents' },
    { label: 'Plans', value: plans?.length || 0, icon: CreditCard, color: 'from-pink-500 to-rose-500', link: '/plans' },
    { label: 'Payments', value: payments?.length || 0, icon: DollarSign, color: 'from-green-500 to-emerald-500', link: '/payments' },
    { label: 'Notifications', value: notifications?.length || 0, icon: Bell, color: 'from-cyan-500 to-blue-500', link: '/notifications' },
    { label: 'Messages', value: messages?.length || 0, icon: Users, color: 'from-indigo-500 to-violet', link: '/messages' },
  ]

  const activeFeatures = features?.filter(f => f.enabled)?.length || 0

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Dashboard</h2>
        <p className="text-white/40 text-sm mt-0.5">Overview of your Ngoms AI platform</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(stat => (
          <Link key={stat.label} to={stat.link}
            className="glass p-4 rounded-2xl hover:border-white/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-white/40 text-xs">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Feature toggles summary */}
      <div className="glass p-5 rounded-2xl mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Feature Toggles</h3>
          <Link to="/features" className="text-primary text-xs font-semibold">Manage →</Link>
        </div>
        <p className="text-white/60 text-sm">{activeFeatures} of {features?.length || 0} features enabled</p>
        <div className="mt-3 flex gap-1">
          {features?.slice(0, 10).map(f => (
            <div key={f.id} className={`h-2 flex-1 rounded-full ${f.enabled ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <div className="glass p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Recent Messages</h3>
          <Link to="/messages" className="text-primary text-xs font-semibold">View all →</Link>
        </div>
        {messages?.length > 0 ? (
          <div className="space-y-2">
            {messages.slice(0, 3).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {(m.name || '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{m.name}</p>
                  <p className="text-white/40 text-xs truncate">{m.subject}</p>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                  m.status === 'unread' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/40'
                }`}>{m.status || 'read'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm text-center py-4">No messages yet</p>
        )}
      </div>
    </div>
  )
}
