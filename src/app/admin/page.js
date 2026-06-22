'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import RequireAuth from '../../components/RequireAuth'
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

export default function Admin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || item.category_number === categoryFilter
    return matchesSearch && matchesCategory
  })

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

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      {(role) => (
        <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

          {/* Top nav */}
          <div
            className="flex justify-between items-baseline px-6 py-4"
            style={{ borderBottom: '2px solid var(--accent)' }}
          >
            <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
              БАРАА УДИРДЛАГА
            </h1>
            <div className="flex gap-3 items-center">
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = '/login'
                }}
                className="text-xs"
                style={{ color: 'var(--muted)' }}
              >
                Log Out
              </button>
              <Link href="/admin/orders" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Захиалга харах</Link>
              <Link href="/admin/bulk" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Бараа засах</Link>
              <Link href="/admin/dashboard" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Хянах самбар</Link>
              {role === 'admin' && (
                <Link href="/admin/companies" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Компаниуд</Link>
              )}
              <Link href="/admin/log-sale" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Борлуулалт бүртгэх</Link>
              <Link href="/admin/ledger" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Захиалгын түүх</Link>
              <Link href="/admin/import" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Импортлох</Link>
              <Link href="/admin/add" className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>+ Бараа нэмэх</Link>
            </div>
          </div>

          {/* Sticky category nav + search */}
          <div
            className="px-6 py-3 sticky top-0 z-10"
            style={{ borderBottom: '0.5px solid var(--border)', background: 'var(--card)' }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Хайх..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded text-sm"
                style={{
                  background: 'var(--background)',
                  border: '0.5px solid var(--border)',
                  color: 'var(--foreground)',
                  width: '180px',
                }}
              />
              <button
                onClick={() => setCategoryFilter(null)}
                className="px-4 py-2 rounded text-sm font-bold"
                style={{
                  background: !categoryFilter ? 'var(--accent)' : 'var(--foreground)',
                  color: 'var(--background)',
                  border: '0.5px solid var(--border)',
                }}
              >
                Бүгд
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.number}
                  onClick={() => setCategoryFilter(cat.number)}
                  className="px-4 py-2 rounded text-sm font-bold"
                  style={{
                    background: categoryFilter === cat.number ? 'var(--accent)' : 'var(--foreground)',
                    color: 'var(--background)',
                    border: '0.5px solid var(--border)',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items grid */}
          <div className="p-6">
            {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}
            {items.length === 0 && <p style={{ color: 'var(--muted)' }}>No items yet. Time to add some!</p>}

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
                    {item.category_name && (
                      <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{item.category_number}. {item.category_name}</p>
                    )}
                    <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                      {item.name}
                    </h2>
                    <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                      {item.price.toLocaleString()} MNT · {item.quantity} Үлдэгдэл
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/admin/edit/${item.id}`}
                        className="text-sm font-medium"
                        style={{ color: 'var(--accent)' }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </RequireAuth>
  )
}
