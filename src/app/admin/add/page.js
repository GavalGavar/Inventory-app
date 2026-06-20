'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import RequireAuth from '../../../components/RequireAuth'


export default function AddItem() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [photo, setPhoto] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)

    let imageUrl = null

    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`

      const { error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(fileName, photo)

      if (uploadError) {
        alert('Error uploading photo: ' + uploadError.message)
        setUploading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('item-photos')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('items').insert({
      name: name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: imageUrl,
    })

    setUploading(false)

    if (error) {
      alert('Error adding item: ' + error.message)
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
  <RequireAuth allowedRoles={['admin']}>


  <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>

      <div
        className="pb-4 mb-6"
        style={{ borderBottom: '2px solid var(--accent)' }}
      >
        <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
          ADD NEW ITEM
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />

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
          {uploading ? 'Saving...' : 'Save Item'}
        </button>
     </form>
    </div>
  </RequireAuth>
  )
}
