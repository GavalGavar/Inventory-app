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
  const [photo, setPhoto] = useState(null)
  const [sku, setSku] = useState('')
  const [categoryNumber, setCategoryNumber] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
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

    const selectedCategory = CATEGORIES.find((c) => c.number === parseInt(categoryNumber))

    const { error: insertError } = await supabase.from('items').insert({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: imageUrl,
      sku: sku || null,
      category_number: selectedCategory ? selectedCategory.number : null,
      category_name: selectedCategory ? selectedCategory.name : null,
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
          <input
            type="text"
            placeholder="SKU (заавал биш)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
          />
          <select
            value={categoryNumber}
            onChange={(e) => setCategoryNumber(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
          >
            <option value="">Ангилал сонгох...</option>
            {CATEGORIES.map((c) => (
              <option key={c.number} value={c.number}>
                {c.number}. {c.name}
              </option>
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
