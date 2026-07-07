'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function ProductGroups() {
  const [groups, setGroups] = useState([])
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupKeywords, setNewGroupKeywords] = useState('')
  const [editingGroup, setEditingGroup] = useState(null)
  const [relatedSearch, setRelatedSearch] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: groupsData } = await supabase.from('product_groups').select().order('name')
    const { data: itemsData } = await supabase.from('items').select('id, name, unit_type').order('name')
    if (groupsData) setGroups(groupsData)
    if (itemsData) setAllItems(itemsData)
    setLoading(false)
  }

  async function createGroup() {
    if (!newGroupName.trim()) return
    const keywords = newGroupKeywords.split(',').map(k => k.trim()).filter(Boolean)
    const { data } = await supabase.from('product_groups').insert({ name: newGroupName.trim(), keywords, related_items: [] }).select().single()
    if (data) {
      setGroups([...groups, data])
      setNewGroupName('')
      setNewGroupKeywords('')
      setEditingGroup(data)
    }
  }

  async function saveGroup(group) {
    const { error } = await supabase.from('product_groups').update({
      name: group.name,
      keywords: group.keywords,
      related_items: group.related_items,
    }).eq('id', group.id)
    if (!error) {
      setMessage('Хадгалагдлаа!')
      setTimeout(() => setMessage(''), 2000)
      loadData()
    }
  }

  async function deleteGroup(id) {
    if (!confirm('Устгах уу?')) return
    await supabase.from('product_groups').delete().eq('id', id)
    setGroups(groups.filter(g => g.id !== id))
    if (editingGroup?.id === id) setEditingGroup(null)
  }

  function addRelatedToGroup(item) {
    if (!editingGroup) return
    if (editingGroup.related_items.find(r => r.id === item.id)) return
    const updated = {
      ...editingGroup,
      related_items: [...editingGroup.related_items, { id: item.id, name: item.name, unit_type: item.unit_type || 'ширхэг', qty: 1 }]
    }
    setEditingGroup(updated)
    setRelatedSearch('')
  }

  function removeRelatedFromGroup(itemId) {
    setEditingGroup({ ...editingGroup, related_items: editingGroup.related_items.filter(r => r.id !== itemId) })
  }

  function updateRelatedQty(itemId, qty) {
    setEditingGroup({ ...editingGroup, related_items: editingGroup.related_items.map(r => r.id === itemId ? { ...r, qty } : r) })
  }

  const filteredItems = allItems.filter(i =>
    i.name.toLowerCase().includes(relatedSearch.toLowerCase()) &&
    !editingGroup?.related_items.find(r => r.id === i.id)
  )

  const inputStyle = { background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="flex justify-between items-baseline pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>Бүтээгдэхүүний бүлэг</h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>← Буцах</Link>
        </div>

        {message && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', backgroundColor: '#16a34a', color: '#fff', padding: '16px 24px', borderRadius: '10px', fontWeight: '700', zIndex: 9999 }}>
            ✅ {message}
          </div>
        )}

        <div className="flex gap-8">
          {/* Left: Groups list + create */}
          <div style={{ width: '280px' }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--foreground)' }}>Шинэ бүлэг үүсгэх</h2>
            <div className="flex flex-col gap-2 mb-6">
              <input
                type="text"
                placeholder="Бүлгийн нэр (жш: 30x30 бүлэг)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="p-2 rounded text-sm"
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Түлхүүр үгс (жш: 30x30, 30х30)"
                value={newGroupKeywords}
                onChange={(e) => setNewGroupKeywords(e.target.value)}
                className="p-2 rounded text-sm"
                style={inputStyle}
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Таслалаар тусгаарлана. Эдгээр үгтэй бараа автоматаар энэ бүлэгт орно.</p>
              <button onClick={createGroup} className="py-2 rounded text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
                + Бүлэг үүсгэх
              </button>
            </div>

            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--foreground)' }}>Бүлгүүд</h2>
            <div className="flex flex-col gap-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => { setEditingGroup(group); setRelatedSearch('') }}
                  className="p-3 rounded cursor-pointer"
                  style={{
                    background: editingGroup?.id === group.id ? 'var(--accent)' : 'var(--card)',
                    color: editingGroup?.id === group.id ? '#fff' : 'var(--foreground)',
                    border: '0.5px solid var(--border)'
                  }}
                >
                  <p className="text-sm font-medium">{group.name}</p>
                  <p className="text-xs opacity-70">{group.related_items.length} холбоотой бараа</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Edit group */}
          {editingGroup && (
            <div style={{ flex: 1 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{editingGroup.name}</h2>
                <div className="flex gap-2">
                  <button onClick={() => saveGroup(editingGroup)} className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
                    Хадгалах
                  </button>
                  <button onClick={() => deleteGroup(editingGroup.id)} className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--soldout-bg)', color: 'var(--soldout-text)' }}>
                    Устгах
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Түлхүүр үгс (таслалаар тусгаарлана)</label>
                <input
                  type="text"
                  value={editingGroup.keywordsText !== undefined ? editingGroup.keywordsText : (editingGroup.keywords?.join(', ') || '')}
                  onChange={(e) => setEditingGroup({ 
                    ...editingGroup, 
                    keywordsText: e.target.value,
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) 
                  })}
                  className="p-2 rounded text-sm w-full"
                  style={inputStyle}
                />
              </div>

              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>Хамт их авдаг бараа:</h3>

              {editingGroup.related_items.length > 0 && (
                <div className="flex flex-col gap-2 mb-4">
                  {editingGroup.related_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
                      <span className="text-sm flex-1" style={{ color: 'var(--foreground)' }}>{item.name}</span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>Тоо:</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.qty}
                        onChange={(e) => updateRelatedQty(item.id, e.target.value)}
                        className="p-1 rounded text-sm w-16"
                        style={inputStyle}
                      />
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.unit_type === 'м.кв' ? 'м²' : 'ш'}</span>
                      <button onClick={() => removeRelatedFromGroup(item.id)} style={{ color: 'var(--soldout-text)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Хайх..."
                value={relatedSearch}
                onChange={(e) => setRelatedSearch(e.target.value)}
                className="p-2 rounded text-sm w-full mb-3"
                style={inputStyle}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addRelatedToGroup(item)}
                    className="px-3 py-2 rounded text-xs font-medium"
                    style={{
                      background: 'var(--card)',
                      color: 'var(--foreground)',
                      border: '0.5px solid var(--border)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
}
