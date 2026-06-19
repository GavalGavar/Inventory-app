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
    <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div
        className="flex justify-between items-baseline pb-4 mb-6"
        style={{ borderBottom: '2px solid var(--accent)' }}
      >
        <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
          GAVAL SUPPLY CO.
        </h1>
        <Link
          href="/checkout"
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          Cart ({cart.length}) — ${total.toFixed(2)}
        </Link>
      </div>

      {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}

      {items.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>No items available right now.</p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded p-3 relative"
              style={{
                background: 'var(--card)',
                border: '0.5px solid var(--border)',
                opacity: item.quantity > 0 ? 1 : 0.6,
              }}
            >
              <span
                className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded"
                style={{
                  background: item.quantity > 0 ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                  color: item.quantity > 0 ? 'var(--stock-text)' : 'var(--soldout-text)',
                  transform: item.quantity > 0 ? 'none' : 'rotate(-4deg)',
                }}
              >
                {item.quantity > 0 ? 'IN STOCK' : 'SOLD OUT'}
              </span>

              {item.image_url && (
  <img
    src={item.image_url}
    alt={item.name}
    className="w-full aspect-square object-cover rounded mb-2"
  />
)}

              <h2 className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {item.name}
              </h2>
              <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
                {item.quantity} units
              </p>

              <div className="flex justify-between items-center">
                <span
                  className="text-base font-medium"
                  style={{ color: item.quantity > 0 ? 'var(--accent)' : 'var(--muted)' }}
                >
                  ${item.price}
                </span>

                {item.quantity > 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ border: '0.5px solid var(--border)', color: 'var(--muted)' }}
                  >
                    ADD
                  </button>
                ) : (
                  <span className="text-xs px-3 py-1" style={{ color: 'var(--muted)' }}>
                    —
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}