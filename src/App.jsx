import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import CrudManager from './pages/CrudManager'

// All collection configs
const COLLECTIONS = [
  { name: 'courses', label: 'Courses', entity: 'Course', icon: 'BookOpen' },
  { name: 'flashcards', label: 'Flashcard Decks', entity: 'FlashcardDeck', icon: 'Layers' },
  { name: 'quizzes', label: 'Quizzes', entity: 'Quiz', icon: 'HelpCircle' },
  { name: 'documents', label: 'Documents', entity: 'Document', icon: 'FileText' },
  { name: 'plans', label: 'Subscription Plans', entity: 'Plan', icon: 'CreditCard' },
  { name: 'payments', label: 'Payments', entity: 'Payment', icon: 'DollarSign' },
  { name: 'coupons', label: 'Coupons', entity: 'Coupon', icon: 'Ticket' },
  { name: 'badges', label: 'Badges', entity: 'Badge', icon: 'Award' },
  { name: 'leaderboard', label: 'Leaderboard', entity: 'LeaderboardEntry', icon: 'Trophy' },
  { name: 'faqs', label: 'FAQs', entity: 'FAQ', icon: 'HelpCircle' },
  { name: 'testimonials', label: 'Testimonials', entity: 'Testimonial', icon: 'Star' },
  { name: 'announcements', label: 'Announcements', entity: 'Announcement', icon: 'Megaphone' },
  { name: 'notifications', label: 'Notifications', entity: 'AppNotification', icon: 'Bell' },
  { name: 'features', label: 'Feature Toggles', entity: 'FeatureToggle', icon: 'ToggleRight' },
  { name: 'messages', label: 'Contact Messages', entity: 'ContactMessage', icon: 'Mail' },
  { name: 'logs', label: 'System Logs', entity: 'SystemLog', icon: 'Activity' },
]

export default function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {COLLECTIONS.map(col => (
            <Route key={col.name} path={col.name} 
              element={<CrudManager collection={col.name} label={col.label} />} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AdminProvider>
  )
}
