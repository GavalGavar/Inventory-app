'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import RequireAuth from '../../../components/RequireAuth'

const CATEGORIES = [
  { number: 1, name: 'Ð¥Ó©Ð½Ð³Ó©Ð½ Ñ†Ð°Ð³Ð°Ð°Ð½ Ñ‚Ð°Ð°Ð·' },
  { number: 2, name: 'Ð“ÑÑ€ÑÐ» ÑÑÐ½Ñ' },
  { number: 3, name: 'Ð¥Ð°Ð½Ñ‹Ð½ Ð¿Ð°Ð½ÐµÐ» Ñ…Ð°Ð²Ñ‚Ð°Ð½' },
  { number: 4, name: 'Ð¥ÑƒÐ»ÑÐ°Ð½ Ñ…Ð°Ð²Ñ‚Ð°Ð½' },
  { number: 5, name: 'Ð¥Ð°Ð½Ñ‹Ð½ Ð³Ð¾Ñ‘Ð»Ñ‹Ð½ Ñ€ÐµÐ¹Ðº' },
  { number: 6, name: 'Ð¢Ð°Ð°Ð·Ð½Ñ‹ Ñ€ÐµÐ¹Ðº' },
  { number: 7, name: 'ÐŸÐ»Ð¸Ð½Ñ‚Ò¯Ñ' },
  { number: 8, name: 'Ð¥Ð°Ð²Ñ‚Ð°Ð½ Ñ‚Ð°Ð°Ð·Ð½Ñ‹ Ñ…Ò¯Ñ€ÑÑ' },
  { number: 9, name: 'Ð“Ð¸Ð¿ÑÑÐ½ Ñ‚Ð°Ð°Ð·' },
  { number: 10, name: 'Ð¡Ð°Ñ€Ð°Ð°Ð»Ð¶Ð¸Ð½ Ñ‚Ð°Ð°Ð·' },
  { number: 11, name: 'Ð§ÑƒÐ»ÑƒÑƒÐ½ ÐµÐ¼ÑƒÐ»ÑŒÑ' },
  { number: 12, name: 'TOR pinturas' },
  { number: 13, name: 'Ð‘ÑƒÑÐ°Ð´ Ð±Ð°Ñ€Ð°Ð°' },
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
        setError('Ð—ÑƒÑ€Ð°Ð³ Ð¾Ñ€ÑƒÑƒÐ»Ð°Ñ…Ð°Ð´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°: ' + uploadError.message)
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
      setError('Ð‘Ð°Ñ€Ð°Ð° Ð½ÑÐ¼ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°: ' + insertError.message)
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
            Ð‘ÐÐ ÐÐ ÐÐ­ÐœÐ­Ð¥
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
          {error && <p className="text-xs" style={{ color: 'var(--soldout-text)' }}>{error}</p>}
          <input
            type="text"
            placeholder="Ð‘Ð°Ñ€Ð°Ð°Ð½Ñ‹ Ð½ÑÑ€"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Ò®Ð½Ñ"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Ð¢Ð¾Ð¾ ÑˆÐ¸Ñ€Ñ…ÑÐ³"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 rounded text-sm"
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="SKU (Ð·Ð°Ð°Ð²Ð°Ð» Ð±Ð¸Ñˆ)"
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
            <option value="">ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑÐ¾Ð½Ð³Ð¾Ñ…...</option>
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
            {uploading ? 'Ð¥Ð°Ð´Ð³Ð°Ð»Ð¶ Ð±Ð°Ð¹Ð½Ð°...' : 'Ð¥Ð°Ð´Ð³Ð°Ð»Ð°Ñ…'}
          </button>
        </form>
      </div>
    </RequireAuth>
  )
}


