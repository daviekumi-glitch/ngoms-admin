import { useState, useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Plus, Search, Trash2, Edit3, X, Save, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CrudManager({ collection, label }) {
  const { data, create, update, remove, loading } = useAdmin()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | record
  const [form, setForm] = useState({})

  const stateKey = collection === 'flashcards' ? 'flashcardDecks' : collection
  const records = data[stateKey] || []

  const filtered = useMemo(() => {
    if (!search) return records
    const q = search.toLowerCase()
    return records.filter(r => JSON.stringify(r).toLowerCase().includes(q))
  }, [records, search])

  // Get fields from first record (or known schema)
  const fields = useMemo(() => {
    if (records.length > 0) {
      const sample = records[0]
      return Object.keys(sample)
        .filter(k => !['id', 'created_date', 'updated_date', 'created_by'].includes(k))
        .map(k => ({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: typeof sample[k] }))
    }
    return []
  }, [records])

  const startNew = () => {
    const emptyForm = {}
    fields.forEach(f => { emptyForm[f.key] = '' })
    setForm(emptyForm)
    setEditing('new')
  }

  const startEdit = (record) => {
    const editForm = {}
    fields.forEach(f => { editForm[f.key] = record[f.key] ?? '' })
    setForm(editForm)
    setEditing(record)
  }

  const handleSave = async () => {
    // Clean empty strings
    const cleanForm = { ...form }
    fields.forEach(f => {
      if (f.type === 'number' && cleanForm[f.key]) {
        cleanForm[f.key] = Number(cleanForm[f.key])
      }
      if (cleanForm[f.key] === '') {
        delete cleanForm[f.key]
      }
    })

    if (editing === 'new') {
      const created = await create(collection, cleanForm)
      if (created) toast.success(`${label.slice(0, -1)} created`)
      else toast.error('Failed to create')
    } else {
      await update(collection, editing.id, cleanForm)
      toast.success(`${label.slice(0, -1)} updated`)
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
    const isLong = field.type === 'object' || field.key === 'questions' || field.key === 'cards' ||
                   field.key === 'features' || field.key === 'limits' || field.key === 'lessons' ||
                   field.key === 'body' || field.key === 'answer' || field.key === 'desc' ||
                   field.key === 'bio' || field.key === 'text' || field.key === 'messages'

    if (isLong) {
      return (
        <textarea
          value={typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
          onChange={e => {
            let v = e.target.value
            try { v = JSON.parse(v) } catch {}
            setForm({ ...form, [field.key]: v })
          }}
          rows={4}
          className="input-field font-mono text-xs"
          placeholder={field.label}
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xl font-black text-white">{label}</h2>
        <span className="text-white/40 text-sm">({records.length})</span>
        <div className="flex-1" />
        <button onClick={startNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search..." className="input-field pl-10" />
      </div>

      {/* Records table */}
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
                {fields.slice(0, 3).map(f => (
                  <div key={f.key} className="min-w-0">
                    {f.key === fields[0].key && (
                      <p className="text-white font-medium text-sm truncate">
                        {typeof record[f.key] === 'object' ? JSON.stringify(record[f.key]) : String(record[f.key] || 'Untitled')}
                      </p>
                    )}
                    {f.key !== fields[0].key && (
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

      {/* Edit/Create modal */}
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

            {fields.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">
                No existing records to infer fields from. Try creating from the main platform first.
              </p>
            ) : (
              <div className="space-y-3">
                {fields.map(field => (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs font-semibold mb-1 block uppercase tracking-wide">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            )}

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
