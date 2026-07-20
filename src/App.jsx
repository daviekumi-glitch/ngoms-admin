import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import CrudManager from './pages/CrudManager'
import BannerManager from './pages/BannerManager'
import SettingsManager from './pages/SettingsManager'

export default function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<CrudManager collection="courses" label="Courses" />} />
          <Route path="flashcards" element={<CrudManager collection="flashcards" label="Flashcard Decks" />} />
          <Route path="quizzes" element={<CrudManager collection="quizzes" label="Quizzes" />} />
          <Route path="documents" element={<CrudManager collection="documents" label="Documents" />} />
          <Route path="plans" element={<CrudManager collection="plans" label="Subscription Plans" />} />
          <Route path="payments" element={<CrudManager collection="payments" label="Payments" />} />
          <Route path="coupons" element={<CrudManager collection="coupons" label="Coupons" />} />
          <Route path="badges" element={<CrudManager collection="badges" label="Badges" />} />
          <Route path="leaderboard" element={<CrudManager collection="leaderboard" label="Leaderboard" />} />
          <Route path="faqs" element={<CrudManager collection="faqs" label="FAQs" />} />
          <Route path="testimonials" element={<CrudManager collection="testimonials" label="Testimonials" />} />
          <Route path="announcements" element={<CrudManager collection="announcements" label="Announcements" />} />
          <Route path="notifications" element={<CrudManager collection="notifications" label="Notifications" />} />
          <Route path="features" element={<CrudManager collection="features" label="Feature Toggles" />} />
          <Route path="messages" element={<CrudManager collection="messages" label="Contact Messages" />} />
          <Route path="logs" element={<CrudManager collection="logs" label="System Logs" />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AdminProvider>
  )
}
