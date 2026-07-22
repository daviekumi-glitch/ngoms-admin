import { useState, useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'
import {
  Plus, Search, Trash2, Edit3, X, Save, Copy, Download,
  ChevronDown, ChevronUp, CheckSquare, Square, Filter,
  ArrowUpDown, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const SCHEMAS = {
  courses: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'lessons', label: 'Lessons', type: 'text' },
    { key: 'students', label: 'Students', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Archived'] },
  ],
  flashcards: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'views', label: 'Views', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Archived'] },
    { key: 'cards', label: 'Cards (JSON)', type: 'json', placeholder: '[{"front":"Q","back":"A"}]' },
  ],
  quizzes: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
    { key: 'passRate', label: 'Pass Rate', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Archived'] },
    { key: 'questions', label: 'Questions (JSON)', type: 'json' },
  ],
  documents: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'Image', 'Video'] },
    { key: 'size', label: 'Size', type: 'text' },
    { key: 'uploadedBy', label: 'Uploaded By', type: 'text' },
    { key: 'fileUrl', label: 'File URL', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Approved', 'Pending', 'Rejected'] },
  ],
  plans: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'price', label: 'Price (MWK)', type: 'text' },
    { key: 'period', label: 'Period', type: 'select', options: ['month', 'year'] },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { key: 'features', label: 'Features (JSON)', type: 'json' },
  ],
  payments: [
    { key: 'user', label: 'User', type: 'text', required: true },
    { key: 'amount', label: 'Amount', type: 'text' },
    { key: 'method', label: 'Method', type: 'text' },
    { key: 'plan', label: 'Plan', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['completed', 'pending', 'failed', 'refunded'] },
  ],
  coupons: [
    { key: 'code', label: 'Code', type: 'text', required: true },
    { key: 'discount', label: 'Discount %', type: 'text' },
    { key: 'expiry', label: 'Expiry', type: 'text' },
    { key: 'maxUses', label: 'Max Uses', type: 'number' },
    { key: 'uses', label: 'Uses', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'expired', 'disabled'] },
  ],
  badges: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'desc', label: 'Description', type: 'text' },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
    { key: 'earners', label: 'Earners', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ],
  leaderboard: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'xp', label: 'XP', type: 'number' },
    { key: 'rank', label: 'Rank', type: 'number' },
    { key: 'badge', label: 'Badge', type: 'select', options: ['Diamond', 'Gold', 'Silver', 'Bronze'] },
  ],
  faqs: [
    { key: 'question', label: 'Question', type: 'text', required: true },
    { key: 'answer', label: 'Answer', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['General', 'Billing', 'Technical', 'Account'] },
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
    { key: 'type', label: 'Type', type: 'select', options: ['course', 'system', 'promo', 'update', 'warning'] },
    { key: 'status', label: 'Status', type: 'select', options: ['sent', 'draft'] },
  ],
  features: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'key', label: 'Key', type: 'text', required: true },
    { key: 'icon', label: 'Icon', type: 'text' },
    { key: 'enabled', label: 'Enabled', type: 'boolean' },
  ],
  messages: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'select', options: ['unread', 'open', 'resolved', 'closed'] },
  ],
  logs: [
    { key: 'action', label: 'Action', type: 'text', required: true },
    { key: 'level', label: 'Level', type: 'select', options: ['info', 'success', 'warning', 'error'] },
    { key: 'time', label: 'Time', type: 'text' },
    { key: 'user', label: 'User', type: 'text' },
  ],
}

const STATUS_COLORS = {
  Active: 'bg-green-500/20 text-green-400',
  active: 'bg-green-500/20 text-green-400',
  published: 'bg-green-500/20 text-green-400',
  completed: 'bg-green-500/20 text-green-400',
  sent: 'bg-green-500/20 text-green-400',
  Approved: 'bg-green-500/20 text-green-400',
  Draft: 'bg-white/10 text-white/50',
  draft: 'bg-white/10 text-white/50',
  Inactive: 'bg-white/10 text-white/50',
  inactive: 'bg-white/10 text-white/50',
  pending: 'bg-amber-500/20 text-amber-400',
  Pending: 'bg-amber-500/20 text-amber-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
  Archived: 'bg-red-500/20 text-red-400',
  failed: 'bg-red-500/20 text-red-400',
  Rejected: 'bg-red-500/20 text-red-400',
  expired: 'bg-red-500/20 text-red-400',
  unread: 'bg-amber-500/20 text-amber-400',
  open: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
  closed: 'bg-white/10 text-white/50',
  Diamond: 'bg-cyan-500/20 text-cyan-300',
  Gold: 'bg-yellow-500/20 text-yellow-400',
  Silver: 'bg-gray-400/20 text-gray-300',
  Bronze: 'bg-orange-700/20 text-orange-400',
  Easy: 'bg-green-500/20 text-green-400',
  Medium: 'bg-amber-500/20 text-amber-400',
  Hard: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-amber-500/20 text-amber-400',
  error: 'bg-red-500/20 text-red-400',
  low: 'bg-white/10 text-white/40',
}

const PAGE_SIZE = 10

export default function CrudManager({ collection, label }) {
  const admin = useAdmin()
  const { create, update, remove, loading } = admin
  const stateKey = collection === 'flashcards' ? 'flashcardDecks' : collection
  const records = admin[stateKey] || []
  const schema = SCHEMAS[collection] || []
  const statusField = schema.find(f => f.key === 'status')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [selected, setSelected] = useState(new Set())
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    let r = [...records]
    if (search) { const q = search.toLowerCase(); r = r.filter(rec => JSON.stringify(rec).toLowerCase().includes(q)) }
    if (statusFilter) r = r.filter(rec => rec.status === statusFilter)
    const firstKey = schema[0]?.key
    if (firstKey) r.sort((a, b) => {
      const av = String(a[firstKey] || '').toLowerCase()
      const bv = String(b[firstKey] || '').toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return r
  }, [records, search, statusFilter, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const startNew = () => {
    const f = {}; schema.forEach(s => { f[s.key] = s.type === 'boolean' ? false : s.type === 'number' ? 0 : '' })
    setForm(f); setEditing('new')
  }

  const startEdit = (rec) => {
    const f = {}; schema.forEach(s => { f[s.key] = rec[s.key] ?? (s.type === 'boolean' ? false : '') })
    setForm(f); setEditing(rec)
  }

  const handleDuplicate = async (rec) => {
    const { id, created_date, updated_date, ...rest } = rec
    const firstKey = schema[0]?.key
    if (firstKey && rest[firstKey]) rest[firstKey] = rest[firstKey] + ' (copy)'
    await create(collection, rest)
    toast.success('Duplicated!')
  }

  const handleSave = async () => {
    setSaving(true)
    const clean = { ...form }
    schema.forEach(f => {
      if (f.type === 'number' && clean[f.key] !== '') clean[f.key] = Number(clean[f.key])
      if (f.type === 'boolean') clean[f.key] = !!clean[f.key]
      if (f.type === 'json' && typeof clean[f.key] === 'string') { try { clean[f.key] = JSON.parse(clean[f.key]) } catch {} }
      if (clean[f.key] === '' && !f.required) delete clean[f.key]
    })
    if (editing === 'new') {
      const ok = await create(collection, clean)
      ok ? toast.success('Created!') : toast.error('Failed to create')
    } else {
      await update(collection, editing.id, clean)
      toast.success('Saved!')
    }
    setSaving(false); setEditing(null); setForm({})
  }

  const handleDelete = async (rec) => {
    if (!confirm(`Delete this record?`)) return
    await remove(collection, rec.id); toast.success('Deleted')
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} records?`)) return
    for (const id of selected) await remove(collection, id)
    setSelected(new Set()); toast.success(`${selected.size} records deleted`)
  }

  const exportCSV = () => {
    if (!records.length) { toast.error('No data to export'); return }
    const keys = schema.map(s => s.key)
    const rows = [keys.join(','), ...records.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))]
    const blob = new Blob([rows.join('
')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `${collection}-${Date.now()}.csv`; a.click()
    toast.success('CSV exported!')
  }

  const copyId = (id) => {
    navigator.clipboard.writeText(id).then(() => toast.success('ID copied!'))
  }

  const toggleSelect = (id) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set())
    else setSelected(new Set(paged.map(r => r.id)))
  }

  const renderField = (field) => {
    const val = form[field.key] ?? ''
    if (field.type === 'boolean') return (
      <button onClick={() => setForm({ ...form, [field.key]: !val })}
        className={`relative w-12 h-6 rounded-full transition-all ${val ? 'bg-primary' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${val ? 'left-6' : 'left-0.5'}`} />
      </button>
    )
    if (field.type === 'select') return (
      <select value={val} onChange={e => setForm({ ...form, [field.key]: e.target.value })} className="input-field">
        <option value="" className="bg-gray-900">Select...</option>
        {field.options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
      </select>
    )
    if (field.type === 'textarea' || field.type === 'json') return (
      <textarea value={typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
        rows={3} className="input-field font-mono text-xs" placeholder={field.placeholder || field.label} />
    )
    return <input type={field.type === 'number' ? 'number' : 'text'} value={val}
      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
      className="input-field" placeholder={field.label} />
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h2 className="text-xl font-black text-white">{label}</h2>
        <span className="glass px-2.5 py-1 rounded-full text-white/50 text-xs">{filtered.length} records</span>
        <div className="flex-1" />
        {selected.size > 0 && (
          <button onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-all">
            <Trash2 size={14} /> Delete {selected.size}
          </button>
        )}
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-white/60 hover:text-white text-sm font-semibold transition-all">
          <Download size={14} /> CSV
        </button>
        <button onClick={startNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder={`Search ${label}...`} className="input-field pl-9 w-full" />
        </div>
        {statusField && (
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="input-field w-auto">
            <option value="" className="bg-gray-900">All Status</option>
            {statusField.options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
          </select>
        )}
        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-white/60 hover:text-white text-sm font-semibold transition-all">
          <ArrowUpDown size={14} /> {sortDir === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>

      {/* Bulk select bar */}
      {paged.length > 0 && (
        <div className="flex items-center gap-3 mb-2 px-1">
          <button onClick={toggleAll} className="text-white/40 hover:text-white transition-colors">
            {selected.size === paged.length && paged.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
          </button>
          <span className="text-white/30 text-xs">
            {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
          </span>
        </div>
      )}

      {/* Records list */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      ) : paged.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <AlertCircle size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm font-semibold">No records found</p>
          <p className="text-white/20 text-xs mt-1">{search || statusFilter ? 'Try adjusting your filters' : `Click "Add New" to create your first ${label.toLowerCase().slice(0,-1)}`}</p>
          {!search && !statusFilter && <button onClick={startNew} className="btn-primary mt-4 text-sm">+ Add New</button>}
        </div>
      ) : (
        <div className="space-y-2">
          {paged.map(rec => {
            const primaryVal = String(rec[schema[0]?.key] || 'Untitled')
            const secondaryVal = schema[1] ? String(rec[schema[1].key] || '') : ''
            const statusVal = rec.status
            return (
              <div key={rec.id} className={`glass p-3.5 rounded-xl flex items-center gap-3 transition-all ${
                selected.has(rec.id) ? 'border-primary/40 bg-primary/5' : 'hover:border-white/15'
              }`}>
                <button onClick={() => toggleSelect(rec.id)} className="text-white/40 hover:text-white/70 shrink-0">
                  {selected.has(rec.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{primaryVal}</p>
                  {secondaryVal && <p className="text-white/40 text-xs truncate mt-0.5">{secondaryVal}</p>}
                </div>
                {statusVal && (
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
                    STATUS_COLORS[statusVal] || 'bg-white/10 text-white/50'
                  }`}>{statusVal}</span>
                )}
                <button onClick={() => copyId(rec.id)} title="Copy ID"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-all shrink-0">
                  <Copy size={13} />
                </button>
                <button onClick={() => handleDuplicate(rec)} title="Duplicate"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-all shrink-0">
                  <span className="text-xs font-bold">⧉</span>
                </button>
                <button onClick={() => startEdit(rec)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all shrink-0">
                  <Edit3 size={15} />
                </button>
                <button onClick={() => handleDelete(rec)}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded-lg glass text-white/60 text-sm font-semibold disabled:opacity-30 hover:text-white transition-all">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                page === p ? 'bg-primary text-white' : 'glass text-white/50 hover:text-white'
              }`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg glass text-white/60 text-sm font-semibold disabled:opacity-30 hover:text-white transition-all">→</button>
        </div>
      )}

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-white font-black text-lg flex-1">
                {editing === 'new' ? 'Create' : 'Edit'} {label.endsWith('s') ? label.slice(0,-1) : label}
              </h3>
              <button onClick={() => { setEditing(null); setForm({}) }}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {schema.map(field => (
                <div key={field.key}>
                  <label className="block text-white/50 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                    {field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setEditing(null); setForm({}) }}
                className="flex-1 px-4 py-3 rounded-xl glass text-white/60 font-semibold text-sm hover:text-white transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 btn-primary flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}