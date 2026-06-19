'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'

export default function EditItem() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(true)

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
      }
      setLoading(false)
    }
    loadItem()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('items')
      .update({
        name: name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      })
      .eq('id', id)

    if (error) {
      alert('Error updating item: ' + error.message)
    } else {
      router.push('/')
    }
  }

  if (loading) return <p className="p-10">Loading...</p>

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Edit Item</h1>

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

        <button type="submit" className="bg-black text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  )
}
