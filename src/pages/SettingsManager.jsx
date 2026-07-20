import { useState, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Save, Settings as SettingsIcon, ToggleLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsManager() {
  const { appSettings, setSettings } = useAdmin()
  const [form, setForm] = useState({
    appName: '', tagline: '', primaryColor: '#3B82F6', accentColor: '#7C3AED',
    version: '1.0.0', maintenanceMode: false, maintenanceMessage: '',
    supportEmail: '', aiQueryLimit: '50', maxFileSize: '10',
  })

  useEffect(() => {
    if (appSettings) {
      setForm({
        appName: appSettings.appName || '', tagline: appSettings.tagline || '',
        primaryColor: appSettings.primaryColor || '#3B82F6', accentColor: appSettings.accentColor || '#7C3AED',
        version: appSettings.version || '1.0.0', maintenanceMode: appSettings.maintenanceMode ?? false,
        maintenanceMessage: appSettings.maintenanceMessage || '', supportEmail: appSettings.supportEmail || '',
        aiQueryLimit: appSettings.aiQueryLimit || '50', maxFileSize: appSettings.maxFileSize || '10',
      })
    }
  }, [appSettings])

  const handleSave = async () => {
    await setSettings(form)
    toast.success('Settings updated! Changes will reflect instantly in the user app.')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-white mb-1">App Settings</h2>
      <p className="text-white/40 text-sm mb-5">Configure global app settings that apply to all users</p>

      <div className="glass p-5 rounded-2xl space-y-4">
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">App Name</label>
          <input value={form.appName} onChange={e => setForm({ ...form, appName: e.target.value })}
            placeholder="Ngoms AI" className="input-field" />
        </div>
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Tagline</label>
          <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
            placeholder="Learn Smarter. Not Harder." className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                className="w-12 h-10 rounded-lg bg-transparent border border-white/10" />
              <input value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                className="w-12 h-10 rounded-lg bg-transparent border border-white/10" />
              <input value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                className="input-field flex-1" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Version</label>
            <input value={form.version} onChange={e => setForm({ ...form, version: e.target.value })}
              placeholder="1.0.0" className="input-field" />
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Support Email</label>
            <input value={form.supportEmail} onChange={e => setForm({ ...form, supportEmail: e.target.value })}
              placeholder="support@ngoms.ai" className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">AI Query Limit</label>
            <input value={form.aiQueryLimit} onChange={e => setForm({ ...form, aiQueryLimit: e.target.value })}
              placeholder="50" className="input-field" />
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Max File Size (MB)</label>
            <input value={form.maxFileSize} onChange={e => setForm({ ...form, maxFileSize: e.target.value })}
              placeholder="10" className="input-field" />
          </div>
        </div>
        <div>
          <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Maintenance Message</label>
          <input value={form.maintenanceMessage} onChange={e => setForm({ ...form, maintenanceMessage: e.target.value })}
            placeholder="We are upgrading Ngoms AI. Back soon!" className="input-field" />
        </div>
        <div className="flex items-center justify-between glass p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <ToggleLeft size={16} className={form.maintenanceMode ? 'text-amber-400' : 'text-white/40'} />
            <span className="text-white/80 text-sm font-semibold">Maintenance Mode</span>
          </div>
          <button onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
            className={`relative w-12 h-6 rounded-full transition-all ${form.maintenanceMode ? 'bg-amber-500' : 'bg-white/10'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${form.maintenanceMode ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        {form.maintenanceMode && (
          <p className="text-amber-400/60 text-xs">⚠ Users will see the maintenance message instead of the app.</p>
        )}
      </div>

      <button onClick={handleSave}
        className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <Save size={16} /> Save Settings
      </button>
    </div>
  )
}
