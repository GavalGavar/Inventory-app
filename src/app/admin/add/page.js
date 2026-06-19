'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

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
      router.push('/')
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Add New Item</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Saving...' : 'Save Item'}
        </button>
      </form>
    </div>
  )
}
