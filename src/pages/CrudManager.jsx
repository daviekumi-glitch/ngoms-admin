import { useState, useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Plus, Search, Trash2, Edit3, X, Save, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'

// Predefined field schemas per collection (so you can create records even when collection is empty)
const SCHEMAS = {
  courses: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
    { key: 'color', label: 'Color (gradient)', type: 'text' },
    { key: 'lessons', label: 'Lessons', type: 'text' },
    { key: 'students', label: 'Students', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Archived'] },
  ],
  flashcards: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'views', label: 'Views', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Archived'] },
    { key: 'cards', label: 'Cards (JSON array)', type: 'json', placeholder: '[{"front":"Q","back":"A"}]' },
  ],
  quizzes: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
    { key: 'passRate', label: 'Pass Rate', type: 'text' },
    { key: 'attempts', label: 'Attempts', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Archived'] },
    { key: 'questions', label: 'Questions (JSON array)', type: 'json', placeholder: '[{"q":"Q?","options":["A","B"],"answer":0}]' },
  ],
  documents: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'Image', 'Video', 'Audio'] },
    { key: 'size', label: 'File Size', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'uploadedBy', label: 'Uploaded By', type: 'text' },
    { key: 'fileUrl', label: 'File URL', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Approved', 'Pending', 'Rejected'] },
  ],
  plans: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'price', label: 'Price (MWK)', type: 'text' },
    { key: 'period', label: 'Period', type: 'select', options: ['month', 'year'] },
    { key: 'color', label: 'Color (gradient)', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { key: 'features', label: 'Features (JSON array)', type: 'json', placeholder: '["Feature 1","Feature 2"]' },
    { key: 'limits', label: 'Limits (JSON object)', type: 'json', placeholder: '{"aiQueries":"5"}' },
  ],
  payments: [
    { key: 'user', label: 'User', type: 'text', required: true },
    { key: 'amount', label: 'Amount', type: 'text' },
    { key: 'method', label: 'Method', type: 'text' },
    { key: 'plan', label: 'Plan', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['completed', 'pending', 'failed', 'refunded', 'free'] },
  ],
  coupons: [
    { key: 'code', label: 'Code', type: 'text', required: true },
    { key: 'discount', label: 'Discount %', type: 'text' },
    { key: 'expiry', label: 'Expiry Date', type: 'text' },
    { key: 'maxUses', label: 'Max Uses', type: 'number' },
    { key: 'uses', label: 'Current Uses', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'expired', 'disabled'] },
  ],
  badges: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'desc', label: 'Description', type: 'text' },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
    { key: 'color', label: 'Color (gradient)', type: 'text' },
    { key: 'earners', label: 'Earners', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ],
  leaderboard: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'xp', label: 'XP', type: 'number' },
    { key: 'rank', label: 'Rank', type: 'number' },
    { key: 'avatar', label: 'Avatar (letter)', type: 'text' },
    { key: 'badge', label: 'Badge', type: 'select', options: ['Diamond', 'Gold', 'Silver', 'Bronze'] },
  ],
  faqs: [
    { key: 'question', label: 'Question', type: 'text', required: true },
    { key: 'answer', label: 'Answer', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['General', 'Billing', 'Technical', 'Account', 'Content'] },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
  ],
  testimonials: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number' },
    { key: 'text', label: 'Testimonial', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
  ],
  announcements: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'critical'] },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
  ],
  notifications: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['course', 'system', 'promo', 'update', 'warning'] },
    { key: 'sent', label: 'Sent', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['sent', 'draft'] },
  ],
  features: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'key', label: 'Key', type: 'text', required: true },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
    { key: 'enabled', label: 'Enabled', type: 'boolean' },
  ],
  messages: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['open', 'resolved', 'closed'] },
  ],
  logs: [
    { key: 'action', label: 'Action', type: 'text', required: true },
    { key: 'level', label: 'Level', type: 'select', options: ['info', 'success', 'warning', 'error'] },
    { key: 'time', label: 'Time', type: 'text' },
    { key: 'user', label: 'User', type: 'text' },
  ],
  banner: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'icon', label: 'Icon', type: 'text' },
    { key: 'bgColor', label: 'BG Color (gradient)', type: 'text' },
    { key: 'actionText', label: 'Action Text', type: 'text' },
    { key: 'actionRoute', label: 'Action Route', type: 'text' },
    { key: 'active', label: 'Active', type: 'boolean' },
  ],
  settings: [
    { key: 'appName', label: 'App Name', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'primaryColor', label: 'Primary Color', type: 'text' },
    { key: 'accentColor', label: 'Accent Color', type: 'text' },
    { key: 'version', label: 'Version', type: 'text' },
    { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'boolean' },
    { key: 'maintenanceMessage', label: 'Maintenance Message', type: 'text' },
    { key: 'supportEmail', label: 'Support Email', type: 'text' },
    { key: 'aiQueryLimit', label: 'AI Query Limit', type: 'text' },
    { key: 'maxFileSize', label: 'Max File Size (MB)', type: 'text' },
  ],
}

export default function CrudManager({ collection, label }) {
  const admin = useAdmin()
  const { create, update, remove, loading } = admin
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  const stateKey = collection === 'flashcards' ? 'flashcardDecks' : collection
  const records = admin[stateKey] || []

  const filtered = useMemo(() => {
    if (!search) return records
    const q = search.toLowerCase()
    return records.filter(r => JSON.stringify(r).toLowerCase().includes(q))
  }, [records, search])

  const schema = SCHEMAS[collection] || SCHEMAS[collection.replace(/s$/, '')] || []

  const startNew = () => {
    const emptyForm = {}
    schema.forEach(f => { emptyForm[f.key] = f.type === 'boolean' ? false : f.type === 'number' ? 0 : '' })
    setForm(emptyForm)
    setEditing('new')
  }

  const startEdit = (record) => {
    const editForm = {}
    schema.forEach(f => { editForm[f.key] = record[f.key] ?? '' })
    setForm(editForm)
    setEditing(record)
  }

  const handleSave = async () => {
    const cleanForm = { ...form }
    schema.forEach(f => {
      if (f.type === 'number' && cleanForm[f.key] !== '') cleanForm[f.key] = Number(cleanForm[f.key])
      if (f.type === 'boolean') cleanForm[f.key] = !!cleanForm[f.key]
      if (f.type === 'json' && cleanForm[f.key]) {
        try { cleanForm[f.key] = JSON.parse(cleanForm[f.key]) } catch {}
      }
      if (cleanForm[f.key] === '' && !f.required) delete cleanForm[f.key]
    })

    if (editing === 'new') {
      const created = await create(collection, cleanForm)
      if (created) toast.success('Created successfully')
      else toast.error('Failed to create')
    } else {
      await update(collection, editing.id, cleanForm)
      toast.success('Updated successfully')
    }
    setEditing(null)
    setForm({})
  }

  const handleDelete = async (record) => {
    if (!confirm(`Delete this ${label.toLowerCase().replace(/s$/, '')}?`)) return
    await remove(collection, record.id)
    toast.success('Deleted')
  }

  const renderField = (field) => {
    const val = form[field.key] ?? ''
    const isLong = field.type === 'textarea' || field.type === 'json'
    const isBool = field.type === 'boolean'
    const isSelect = field.type === 'select'

    if (isBool) {
      return (
        <button onClick={() => setForm({ ...form, [field.key]: !val })}
          className={`relative w-12 h-6 rounded-full transition-all ${val ? 'bg-primary' : 'bg-white/10'}`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${val ? 'left-6' : 'left-0.5'}`} />
        </button>
      )
    }

    if (isSelect) {
      return (
        <select value={val} onChange={e => setForm({ ...form, [field.key]: e.target.value })} className="input-field">
          <option value="" className="bg-navy-800">Select...</option>
          {field.options.map(o => <option key={o} value={o} className="bg-navy-800">{o}</option>)}
        </select>
      )
    }

    if (isLong) {
      return (
        <textarea
          value={typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
          onChange={e => {
            let v = e.target.value
            if (field.type === 'json') { try { v = JSON.parse(v) } catch {} }
            setForm({ ...form, [field.key]: v })
          }}
          rows={4}
          className="input-field font-mono text-xs"
          placeholder={field.placeholder || field.label}
        />
      )
    }

    return (
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={val}
        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
        className="input-field"
        placeholder={field.label}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xl font-black text-white">{label}</h2>
        <span className="text-white/40 text-sm">({records.length})</span>
        <div className="flex-1" />
        <button onClick={startNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search..." className="input-field pl-10" />
      </div>

      {loading ? (
        <div className="glass p-8 rounded-2xl text-center text-white/40">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="glass p-8 rounded-2xl text-center">
          <p className="text-white/30 text-sm">No records found. Click "Add New" to create one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(record => (
            <div key={record.id} className="glass p-3.5 rounded-xl flex items-center gap-3">
              <div className="flex-1 min-w-0">
                {schema.slice(0, 3).map(f => (
                  <div key={f.key}>
                    {f.key === schema[0].key && (
                      <p className="text-white font-medium text-sm truncate">
                        {typeof record[f.key] === 'object' ? JSON.stringify(record[f.key]).slice(0, 50) : String(record[f.key] || 'Untitled')}
                      </p>
                    )}
                    {f.key !== schema[0].key && (
                      <p className="text-white/40 text-xs truncate">
                        {typeof record[f.key] === 'object' ? '' : String(record[f.key] || '')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => startEdit(record)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
                <Edit3 size={15} />
              </button>
              <button onClick={() => handleDelete(record)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-white font-bold text-lg flex-1">
                {editing === 'new' ? 'Create New' : 'Edit'} {label.replace(/s$/, '')}
              </h3>
              <button onClick={() => { setEditing(null); setForm({}) }}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {schema.map(field => (
                <div key={field.key}>
                  <label className="text-white/50 text-xs font-semibold mb-1 block uppercase tracking-wide">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            <button onClick={handleSave}
              className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm flex items-center justify-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
