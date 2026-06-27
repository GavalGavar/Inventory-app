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

    const uploads = await Promise.all(
      items.map(async (item) => {
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
        return {
          id: item.id,
          name: item.name,
          sku: item.sku,
          price: parseFloat(item.price),
          quantity: parseFloat(item.quantity),
          image_url: imageUrl,
          category_number: item.category_number,
          category_name: item.category_name,
          unit_type: item.unit_type || 'ширхэг',
        }
      })
    )

    const { error } = await supabase.from('items').upsert(uploads)

    setSaving(false)
    if (error) {
      setMessage('error: ' + error.message)
    } else {
      setMessage('success')
      setPhotos({})
      loadItems()
      setTimeout(() => setMessage(''), 3000)
    }
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
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: message === 'success' ? '#16a34a' : '#e81c1c',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '1rem',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {message === 'success' ? '✅ Хадгалагдлаа!' : message}
          </div>
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
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}></th>
                
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Нэр</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Ангилал</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Үнэ</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Тоо ширхэг</th>
<th className="text-left p-2" style={{ color: 'var(--muted)' }}>Нэгж</th>

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
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const file = e.dataTransfer.files[0]
                        if (file) handlePhotoChange(item.id, file)
                      }}
                      onClick={() => document.getElementById(`file-${item.id}`).click()}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        border: photos[item.id] ? '2px solid var(--accent)' : '2px dashed var(--border)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--card)',
                        position: 'relative',
                      }}
                    >
                      {photos[item.id] ? (
                        <img src={URL.createObjectURL(photos[item.id])} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>📷</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    {item.image_url && (
                      <button
                        onClick={() => updateField(item.id, 'image_url', null)}
                        style={{ fontSize: '0.75rem', color: 'var(--soldout-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        🗑️ Устгах
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    <input
                      id={`file-${item.id}`}


                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoChange(item.id, e.target.files[0])}
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
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateField(item.id, 'quantity', e.target.value)}
                      className="p-1 rounded w-20"
                      style={inputStyle}
                    />

                  </td>
                 <td className="p-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => updateField(item.id, 'unit_type', 'ширхэг')}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: (item.unit_type || 'ширхэг') === 'ширхэг' ? 'var(--accent)' : 'var(--card)',
                          color: (item.unit_type || 'ширхэг') === 'ширхэг' ? '#fff' : 'var(--foreground)',
                          border: '0.5px solid var(--border)',
                        }}
                      >
                        Ширхэг
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField(item.id, 'unit_type', 'м.кв')}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: item.unit_type === 'м.кв' ? 'var(--accent)' : 'var(--card)',
                          color: item.unit_type === 'м.кв' ? '#fff' : 'var(--foreground)',
                          border: '0.5px solid var(--border)',
                        }}
                      >
                        м.кв
                      </button>
                    </div>
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





