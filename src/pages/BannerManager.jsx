import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Save, Sparkles, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BannerManager() {
  const { banner, setBanner } = useAdmin()
  const [form, setForm] = useState({
    title: '', subtitle: '', icon: 'Sparkles', bgColor: 'from-primary to-violet',
    actionText: '', actionRoute: '/settings', active: false,
  })

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title || '', subtitle: banner.subtitle || '',
        icon: banner.icon || 'Sparkles', bgColor: banner.bgColor || 'from-primary to-violet',
        actionText: banner.actionText || '', actionRoute: banner.actionRoute || '/settings',
        active: banner.active ?? false,
      })
    }
  }, [banner])

  const handleSave = async () => {
    await setBanner(form)
    toast.success('Banner updated! It will reflect instantly in the user app.')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-white mb-1">App Banner</h2>
      <p className="text-white/40 text-sm mb-5">Manage the promotional banner shown to users</p>

      {/* Live preview */}
      <div className={`bg-gradient-to-r ${form.bgColor} rounded-2xl p-4 mb-5 cursor-pointer shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">{form.title || 'Banner Title'}</p>
            <p className="text-white/70 text-xs truncate">{form.subtitle || 'Banner subtitle'}</p>
          </div>
          {form.actionText && <span className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg text-white text-xs font-semibold whitespace-nowrap">{form.actionText}</span>}
        </div>
      </div>

      <div className="glass p-5 rounded-2xl space-y-4">
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Welcome to Ngoms AI Premium" className="input-field" />
        </div>
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Subtitle</label>
          <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Unlock unlimited AI tutoring" className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Action Text</label>
            <input value={form.actionText} onChange={e => setForm({ ...form, actionText: e.target.value })}
              placeholder="Upgrade Now" className="input-field" />
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Action Route</label>
            <input value={form.actionRoute} onChange={e => setForm({ ...form, actionRoute: e.target.value })}
              placeholder="/settings" className="input-field" />
          </div>
        </div>
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Background Gradient</label>
          <select value={form.bgColor} onChange={e => setForm({ ...form, bgColor: e.target.value })} className="input-field">
            <option value="from-primary to-violet" className="bg-navy-800">Blue to Violet</option>
            <option value="from-emerald-500 to-teal-500" className="bg-navy-800">Green to Teal</option>
            <option value="from-amber-500 to-orange-500" className="bg-navy-800">Amber to Orange</option>
            <option value="from-pink-500 to-rose-500" className="bg-navy-800">Pink to Rose</option>
            <option value="from-cyan-500 to-blue-500" className="bg-navy-800">Cyan to Blue</option>
          </select>
        </div>
        <div className="flex items-center justify-between glass p-3 rounded-xl">
          <div className="flex items-center gap-2">
            {form.active ? <Eye size={16} className="text-primary" /> : <EyeOff size={16} className="text-white/40" />}
            <span className="text-white/80 text-sm font-semibold">Banner Visible to Users</span>
          </div>
          <button onClick={() => setForm({ ...form, active: !form.active })}
            className={`relative w-12 h-6 rounded-full transition-all ${form.active ? 'bg-primary' : 'bg-white/10'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${form.active ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <button onClick={handleSave}
        className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <Save size={16} /> Save Banner
      </button>
    </div>
  )
}
