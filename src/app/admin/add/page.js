'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import RequireAuth from '../../../components/RequireAuth'

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
]

export default function AddItem() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [sku, setSku] = useState('')
  const [categoryNumber, setCategoryNumber] = useState(1)
  const [photo, setPhoto] = useState(null)
  const [unitType, setUnitType] = useState('ширхэг')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let imageUrl = null
    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`
      const { error: uploadError } = await supabase.storage.from('item-photos').upload(fileName, photo, {
        cacheControl: '3600', upsert: true, contentType: photo.type,
      })
      if (uploadError) { alert('Error uploading photo: ' + uploadError.message); setSaving(false); return }
      const { data: publicUrlData } = supabase.storage.from('item-photos').getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    }

    const selectedCategory = CATEGORIES.find(c => c.number === Number(categoryNumber))
    const { error } = await supabase.from('items').insert({
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      sku: sku.trim() || null,
      category_number: Number(categoryNumber),
      category_name: selectedCategory?.name || '',
      image_url: imageUrl,
      unit_type: unitType,
    })

    setSaving(false)
    if (error) { alert('Error: ' + error.message) }
    else { router.push('/admin') }
  }

  const inputStyle = { background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            Бүтээгдэхүүн нэмэх
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
          <input type="text" placeholder="Барааны нэр" value={name} onChange={(e) => setName(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />
          <input type="number" step="0.01" placeholder="Үнэ" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />
          <input type="number" step="0.01" placeholder="Тоо ширхэг" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />
          <input type="text" placeholder="SKU (дугаар, дараалал)" value={sku} onChange={(e) => setSku(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} />

          <select value={categoryNumber} onChange={(e) => setCategoryNumber(e.target.value)} className="p-2 rounded text-sm" style={inputStyle}>
            {CATEGORIES.map(cat => (
              <option key={cat.number} value={cat.number}>{cat.name}</option>
            ))}
          </select>

          <div>
            <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>Борлуулалтын нэгж</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setUnitType('ширхэг')} className="flex-1 py-2 rounded text-sm font-medium" style={{ background: unitType === 'ширхэг' ? 'var(--accent)' : 'var(--card)', color: unitType === 'ширхэг' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Ширхэгээр</button>
              <button type="button" onClick={() => setUnitType('м.кв')} className="flex-1 py-2 rounded text-sm font-medium" style={{ background: unitType === 'м.кв' ? 'var(--accent)' : 'var(--card)', color: unitType === 'м.кв' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Метр квадратаар</button>
            </div>
          </div>

          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="p-2 rounded text-sm" style={inputStyle} />

          <button type="submit" disabled={saving} className="py-2 rounded text-sm font-medium disabled:opacity-50" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
            {saving ? 'Хадгалж байна...' : 'Нэмэх'}
          </button>
        </form>
      </div>
    </RequireAuth>
  )
}
