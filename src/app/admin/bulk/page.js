'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

const CATEGORIES = [
  { number: 1, name: 'Хөнгөн цагаан тааз' },
  { number: 2, name: 'Гэрэл сэнс' },
  { number: 3, name: 'Ханын панел хавтан' },
  { number: 4, name: 'Хулсан хавтан' },
  { number: 5, name: 'Ханын гоёлын рейк' },
  { number: 6, name: 'Таазны рейк' },
  { number: 7, name: 'Плинтүс' },
  { number: 8, name: 'Хавтан таазны хүрээ' },
  { number: 9, name: 'Гипсэн тааз' },
  { number: 10, name: 'Сараалжин тааз' },
  { number: 11, name: 'Чулуун емульс' },
  { number: 12, name: 'TOR pinturas' },
  { number: 13, name: 'Бусад бараа' },
  { number: 14, name: 'Нэмэлт материал' },
]

export default function BulkEdit() {
  const [items, setItems] = useState([])
  const [photos, setPhotos] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    const { data } = await supabase.from('items').select()
    if (data) setItems(data.sort((a, b) => {
      const skuA = parseFloat(a.sku) || 9999
      const skuB = parseFloat(b.sku) || 9999
      return skuA - skuB
    }))
    setSelected([])
  }

  function formatPrice(value) {
    if (value === '' || value === null || value === undefined) return ''
    const num = String(value).replace(/,/g, '')
    if (isNaN(num)) return value
    return Number(num).toLocaleString('en-US')
  }

  function updateField(id, field, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  function updateCategory(id, categoryNumber) {
    const cat = CATEGORIES.find((c) => c.number === parseInt(categoryNumber))
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, category_number: cat ? cat.number : null, category_name: cat ? cat.name : null }
          : item
      )
    )
  }

  function handlePhotoChange(id, file) {
    setPhotos((prev) => ({ ...prev, [id]: file }))
  }

  function toggleSelect(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (selected.length === items.length) {
      setSelected([])
    } else {
      setSelected(items.map((item) => item.id))
    }
  }

  async function deleteSelected() {
    const confirmed = confirm(`${selected.length} бараа бүрмөсөн устгах уу?`)
    if (!confirmed) return
    setDeleting(true)
    const { error } = await supabase.from('items').delete().in('id', selected)
    if (error) {
      alert('Устгахад алдаа гарлаа: ' + error.message)
    } else {
      setMessage(`${selected.length} бараа устгагдлаа.`)
      loadItems()
    }
    setDeleting(false)
  }

  async function saveAll() {
    setSaving(true)
    setMessage('')
    for (const item of items) {
      let imageUrl = item.image_url
      const photo = photos[item.id]
      if (photo) {
        const fileName = `${Date.now()}-${photo.name}`
        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(fileName, photo)
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('item-photos')
            .getPublicUrl(fileName)
          imageUrl = publicUrlData.publicUrl
        }
      }
      await supabase
        .from('items')
        .update({
          name: item.name,
          sku: item.sku,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image_url: imageUrl,
          category_number: item.category_number,
          category_name: item.category_name,
        })
        .eq('id', item.id)
    }
    setSaving(false)
    setMessage('Бүх өөрчлөлт хадгалагдлаа!')
    setPhotos({})
    loadItems()
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase()
    return item.name.toLowerCase().includes(q) || (item.sku || '').toLowerCase().includes(q)
  })
  const allSelected = filteredItems.length > 0 && selected.length === filteredItems.length


  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            БАРАА ЗАСАХ
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
              ← Буцах
            </Link>
            {selected.length > 0 && (
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                style={{ background: 'var(--soldout-bg)', color: 'var(--soldout-text)' }}
              >
                {deleting ? 'Устгаж байна...' : `${selected.length} бараа устгах`}
              </button>
            )}
            <button
              onClick={saveAll}
              disabled={saving}
              className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              {saving ? 'Хадгалж байна...' : 'Бүгдийг хадгалах'}
            </button>
          </div>
        </div>
        <input
  type="text"
  placeholder="Нэр эсвэл SKU-аар хайх..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="p-2 rounded text-sm mb-6 w-full max-w-sm"
  style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
/>
        {message && (
          <p className="text-sm mb-4" style={{ color: 'var(--stock-text)' }}>{message}</p>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--accent)' }}>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>SKU</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Зураг</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Нэр</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Ангилал</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Үнэ</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Тоо ширхэг</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '0.5px solid var(--border)',
                    background: selected.includes(item.id) ? 'var(--soldout-bg)' : 'transparent',
                  }}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.sku || ''}
                      onChange={(e) => updateField(item.id, 'sku', e.target.value)}
                      className="p-1 rounded w-16"
                      style={inputStyle}
                    />
                  </td>
                  <td className="p-2">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded mb-1"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(item.id, e.target.files[0])}
                      className="text-xs w-24"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateField(item.id, 'name', e.target.value)}
                      className="p-1 rounded w-64"
                      style={inputStyle}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={item.category_number || ''}
                      onChange={(e) => updateCategory(item.id, e.target.value)}
                      className="p-1 rounded text-xs"
                      style={{ ...inputStyle, width: '160px' }}
                    >
                      <option value="">Сонгох...</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.number} value={c.number}>
                          {c.number}. {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formatPrice(item.price)}
                      onChange={(e) => updateField(item.id, 'price', e.target.value.replace(/,/g, ''))}
                      className="p-1 rounded w-24"
                      style={inputStyle}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateField(item.id, 'quantity', e.target.value)}
                      className="p-1 rounded w-20"
                      style={inputStyle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuth>
  )
}





