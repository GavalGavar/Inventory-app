'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import RequireAuth from '../../../components/RequireAuth'

const SIZE_GROUPS = [
  { label: '30x30', min: 0.01, max: 0.30 },
  { label: '30x60', min: 0.31, max: 0.65 },
  { label: '60x60', min: 0.66, max: 0.99 },
  { label: '45x90', min: 1.01, max: 1.40 },
  { label: '120x60', min: 1.41, max: 1.85 },
  { label: '1.22x2.44', min: 1.86, max: 2.30 },
]

export default function AddItem() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [photo, setPhoto] = useState(null)
  const [sizeGroup, setSizeGroup] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function generateSKU(group) {
    const { data: existingItems } = await supabase
      .from('items')
      .select('sku')
      .not('sku', 'is', null)

    const skusInRange = (existingItems || [])
      .map((i) => parseFloat(i.sku))
      .filter((s) => !isNaN(s) && s >= group.min && s <= group.max)

    const nextSKU = skusInRange.length === 0
      ? group.min
      : Math.max(...skusInRange) + 0.01

    if (nextSKU > group.max) return null
    return nextSKU.toFixed(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!sizeGroup) {
      setError('Хэмжээний бүлэг сонгоно уу.')
      return
    }

    const group = SIZE_GROUPS.find((g) => g.label === sizeGroup)
    const sku = await generateSKU(group)

    if (!sku) {
      setError(`${sizeGroup} бүлгийн SKU дүүрсэн байна.`)
      return
    }

    setUploading(true)
    let imageUrl = null

    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`
      const { error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(fileName, photo)
      if (uploadError) {
        setError('Зураг оруулахад алдаа гарлаа: ' + uploadError.message)
        setUploading(false)
        return
      }
      const { data: publicUrlData } = supabase.storage
        .from('item-photos')
        .getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    }

    const { error: insertError } = await supabase.from('items').insert({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: imageUrl,
      sku,
    })

    setUploading(false)
    if (insertError) {
      setError('Бараа нэмэхэд алдаа гарлаа: ' + insertError.message)
    } else {
      router.push('/admin')
    }
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            БАРАА НЭМЭХ
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
          {error && <p className="text-xs" style={{ color: 'var(--soldout-text)' }}>{error}</p>}
          <input
            type="text"
            placeholder="Барааны нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Үнэ"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Тоо ширхэг"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          />
          <select
            value={sizeGroup}
            onChange={(e) => setSizeGroup(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          >
            <option value="">Хэмжээний бүлэг сонгох...</option>
            {SIZE_GROUPS.map((g) => (
              <option key={g.label} value={g.label}>{g.label}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="p-2 rounded text-sm"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={uploading}
            className="py-2 rounded text-sm font-medium disabled:opacity-50"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            {uploading ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
        </form>
      </div>
    </RequireAuth>
  )
}
