'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import RequireAuth from '../../../../components/RequireAuth'


export default function EditItem() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadItem() {
      const { data, error } = await supabase
        .from('items')
        .select()
        .eq('id', id)
        .single()

      if (data) {
        setName(data.name)
        setPrice(data.price)
        setQuantity(data.quantity)
        setImageUrl(data.image_url)
      }
      setLoading(false)
    }
    loadItem()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let newImageUrl = imageUrl

    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`

      const { error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(fileName, photo)

      if (uploadError) {
        alert('Error uploading photo: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('item-photos')
        .getPublicUrl(fileName)

      newImageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase
      .from('items')
      .update({
        name: name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image_url: newImageUrl,
      })
      .eq('id', id)

    setSaving(false)

    if (error) {
      alert('Error updating item: ' + error.message)
    } else {
      router.push('/admin')
    }
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }

  if (loading) {
  return (
    <RequireAuth>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      </div>
    </RequireAuth>
  )
}


  return (
  <RequireAuth>
  <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
    <div
      className="pb-4 mb-6"

        style={{ borderBottom: '2px solid var(--accent)' }}
      >
        <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
          EDIT ITEM
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-full aspect-square object-cover rounded"
          />
        )}

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

        <div>
          <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>
            Replace photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="p-2 rounded text-sm w-full"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-2 rounded text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  </RequireAuth>
  )
}
