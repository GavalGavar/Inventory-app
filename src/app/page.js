'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

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
  { number: 14, name: 'Нэмэлт материал' },
]

const SIZE_KEYWORDS = {
  '30x30 Хөнгөн цагаан тааз': ['30x30', '30х30'],
  '30x60 Хөнгөн цагаан тааз': ['30x60', '30х60'],
  '60x60 Хөнгөн цагаан тааз': ['60x60', '60х60'],
  '45x90 Хөнгөн цагаан тааз': ['45x90', '45х90'],
  '60x120 Хөнгөн цагаан тааз': ['60x120', '60х120', '120x60', '120х60'],
  '1.22x2.44 Хөнгөн цагаан тааз': ['1.22x2.44', '1.22х2.44', '122x244', '122х244'],
}

const ALL_SIZE_KEYWORDS = Object.values(SIZE_KEYWORDS).flat()

const CEILING_SIZES = [
  '30x30 Хөнгөн цагаан тааз',
  '30x60 Хөнгөн цагаан тааз',
  '60x60 Хөнгөн цагаан тааз',
  '45x90 Хөнгөн цагаан тааз',
  '60x120 Хөнгөн цагаан тааз',
  '1.22x2.44 Хөнгөн цагаан тааз',
  'Нэмэлт материал',
]

export default function Home() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [sizeFilter, setSizeFilter] = useState(null)
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

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || item.category_number === categoryFilter
    let matchesSize = true
    if (sizeFilter && categoryFilter === 1) {
      if (sizeFilter === 'Нэмэлт материал') {
        matchesSize = !ALL_SIZE_KEYWORDS.some((kw) =>
          item.name.toLowerCase().includes(kw.toLowerCase())
        )
      } else {
        const keywords = SIZE_KEYWORDS[sizeFilter] || []
        matchesSize = keywords.some((kw) =>
          item.name.toLowerCase().includes(kw.toLowerCase())
        )
      }
    }
    return matchesSearch && matchesCategory && matchesSize
  })

  function handleCategoryClick(catNumber) {
    setCategoryFilter(catNumber)
    setSizeFilter(null)
  }

  function handleAllClick() {
    setCategoryFilter(null)
    setSizeFilter(null)
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div
        className="flex justify-between items-baseline px-6 py-4"
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

      <div className="flex">
        <div
          className="w-52 shrink-0 p-4 sticky top-0 h-screen overflow-y-auto"
          style={{ borderRight: '0.5px solid var(--border)', background: 'var(--card)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3 px-2" style={{ color: 'var(--muted)' }}>
            АНГИЛАЛ
          </p>
          <button
            onClick={handleAllClick}
            className="w-full text-left text-base font-medium px-2 py-1.5 rounded mb-1"
            style={{
              background: !categoryFilter ? 'var(--accent)' : 'transparent',
              color: !categoryFilter ? 'var(--background)' : 'var(--foreground)',
            }}
          >
            Бүгд
          </button>
          {CATEGORIES.map((cat) => (
            <div key={cat.number}>
              <button
                onClick={() => handleCategoryClick(cat.number)}
                className="w-full text-left text-sm font-medium px-2 py-1.5 rounded mb-1"
                style={{
                  background: categoryFilter === cat.number ? 'var(--accent)' : 'transparent',
                  color: categoryFilter === cat.number ? 'var(--background)' : 'var(--foreground)',
                }}
              >
                {cat.name}
              </button>
              {categoryFilter === 1 && cat.number === 1 && (
                <div className="ml-2 mb-2">
                  {CEILING_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSizeFilter(size === sizeFilter ? null : size)}
                      className="w-full text-left text-xs px-2 py-1 rounded mb-1"
                      style={{
                        background: sizeFilter === size ? 'var(--foreground)' : 'var(--soldout-bg)',
                        color: sizeFilter === size ? 'var(--background)' : 'var(--foreground)',
                        border: '0.5px solid var(--border)',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 p-6">
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
          {items.length === 0 && <p style={{ color: 'var(--muted)' }}>Бараа байхгүй байна.</p>}
          {items.length > 0 && filteredItems.length === 0 && (
            <p style={{ color: 'var(--muted)' }}>Тохирох бараа олдсонгүй.</p>
          )}

          {filteredItems.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
                  {item.category_name && (
                    <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
                      {item.category_name}
                    </p>
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
      </div>
    </div>
  )
}
