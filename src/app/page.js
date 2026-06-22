'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function Home() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const { cart, addToCart, total } = useCart()

  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase.from('items').select()
      if (error) setError(error)
      else setItems(data.sort((a, b) => {
        const skuA = parseFloat(a.sku) || 9999
        const skuB = parseFloat(b.sku) || 9999
        return skuA - skuB
      }))
    }
    loadItems()
  }, [])

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

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
          Сагс ({cart.length}) — {total.toLocaleString()} MNT
        </Link>
      </div>

      <input
        type="text"
        placeholder="Хайх..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded text-sm mb-6 w-full max-w-xs"
        style={{
          background: 'var(--card)',
          border: '0.5px solid var(--border)',
          color: 'var(--foreground)',
        }}
      />

      {error && <p style={{ color: 'var(--soldout-text)' }}>Алдаа: {error.message}</p>}

      {items.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>Бараа байхгүй байна.</p>
      )}

      {items.length > 0 && filteredItems.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>"{search}" хайлтад тохирох бараа олдсонгүй.</p>
      )}

      {filteredItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded p-2 relative"
              style={{
                background: 'var(--card)',
                border: '0.5px solid var(--border)',
                opacity: item.quantity > 0 ? 1 : 0.6,
              }}
            >
              <span
                className="absolute top-2 right-2 text-sm font-medium px-2 py-1 rounded"
                style={{
                  background: item.quantity > 0 ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                  color: item.quantity > 0 ? 'var(--stock-text)' : 'var(--soldout-text)',
                  transform: item.quantity > 0 ? 'none' : 'rotate(-4deg)',
                }}
              >
                {item.quantity > 0 ? 'Бэлэн бараа' : 'Дууссан'}
              </span>
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded mb-2"
                />
              )}
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                {item.name}
              </h2>
              <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                {item.price.toLocaleString()} MNT · {item.quantity} Үлдэгдэл
              </p>
              <div className="flex justify-between items-center">
                {item.quantity > 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="text-sm font-medium px-3 py-1 rounded"
                    style={{ border: '0.5px solid var(--border)', color: 'var(--accent)' }}
                  >
                    Сагсанд нэмэх
                  </button>
                ) : (
                  <span className="text-sm px-3 py-1" style={{ color: 'var(--muted)' }}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}