import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { Lock, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAdmin()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, pass)
    setLoading(false)
    if (ok) {
      toast.success('Welcome back!')
      nav('/')
    } else {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center text-white font-black text-3xl mx-auto mb-3">N</div>
          <h1 className="text-2xl font-black text-white">Ngoms Admin</h1>
          <p className="text-white/40 text-sm mt-1">Control Panel Access</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="glass p-6 rounded-2xl space-y-4">
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@ngoms.ai" required
                className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••" required
                className="input-field pl-10" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/30 text-xs flex items-center justify-center gap-1.5">
            <Shield size={12} /> Secured by Ngoms AI
          </p>
        </div>
      </div>
    </div>
  )
}
