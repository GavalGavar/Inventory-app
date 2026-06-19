'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function Home() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const { cart, addToCart, total } = useCart()

  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase.from('items').select()
      if (error) setError(error)
      else setItems(data)
    }
    loadItems()
  }, [])

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome to My Shop</h1>
        <Link href="/checkout" className="bg-black text-white px-4 py-2 rounded text-sm">
          Cart ({cart.length}) — ${total.toFixed(2)}
        </Link>
      </div>

      {error && <p className="text-red-600 mt-4">Error: {error.message}</p>}

      {items.length === 0 && (
        <p className="mt-4 text-gray-600">No items available right now.</p>
      )}

      {items.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded p-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h2 className="mt-2 font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 w-full bg-black text-white py-2 rounded text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
