'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function BulkEdit() {
  const [items, setItems] = useState([])
  const [photos, setPhotos] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    const { data } = await supabase.from('items').select().order('name')
    if (data) setItems(data)
  }

  function updateField(id, field, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  function handlePhotoChange(id, file) {
    setPhotos((prev) => ({ ...prev, [id]: file }))
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
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image_url: imageUrl,
        })
        .eq('id', item.id)
    }

    setSaving(false)
    setMessage('All changes saved!')
    setPhotos({})
    loadItems()
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }


    return (
  <RequireAuth allowedRoles={['admin']}>

      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            BULK EDIT
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
              ← Back to Admin
            </Link>
            <button
              onClick={saveAll}
              disabled={saving}
              className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>

        {message && (
          <p className="text-sm mb-4" style={{ color: 'var(--stock-text)' }}>{message}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--accent)' }}>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Photo</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Name</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Price</th>
                <th className="text-left p-2" style={{ color: 'var(--muted)' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '0.5px solid var(--border)' }}>
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
                      className="p-1 rounded w-32"
                      style={inputStyle}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateField(item.id, 'price', e.target.value)}
                      className="p-1 rounded w-20"
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
