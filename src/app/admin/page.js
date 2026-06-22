'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import RequireAuth from '../../components/RequireAuth'
import Link from 'next/link'

export default function Admin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || String(item.category_number) === categoryFilter
    return matchesSearch && matchesCategory
  })

  useEffect(() => {

    async function loadItems() {
      const { data, error } = await supabase.from('items').select()
      if (error) setError(error)
      else setItems(data)
    }
    loadItems()
  }, [])

  return (
  <RequireAuth allowedRoles={['admin', 'sales_manager']}>
    {(role) => (
    

      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            MANAGE INVENTORY
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
  <Link
  href="/admin/orders"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Захиалга харах
</Link>
<Link
  href="/admin/bulk"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Бараа засах
</Link>
<Link

  href="/admin/dashboard"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Хянах самбар
</Link>

{role === 'admin' && (
<Link
  href="/admin/companies"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Компаниуд
</Link>
)}

<Link
  href="/admin/log-sale"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Борлуулалт бүртгэх
</Link>

<Link
  href="/admin/ledger"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Захиалгын түүх
</Link>



            <Link
              href="/admin/import"
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
            >
  Импортлох
</Link>

            <Link
              href="/admin/add"
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              + Бараа нэмэх
            </Link>
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded text-sm mb-4 mr-3"
          style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="">Бүх ангилал</option>
          <option value="1">1. Хөнгөн цагаан тааз</option>
          <option value="2">2. Гэрэл сэнс</option>
          <option value="3">3. Ханын панел хавтан</option>
          <option value="4">4. Хулсан хавтан</option>
          <option value="5">5. Ханын гоёлын рейк</option>
          <option value="6">6. Таазны рейк</option>
          <option value="7">7. Плинтүс</option>
          <option value="8">8. Хавтан таазны хүрээ</option>
          <option value="9">9. Гипсэн тааз</option>
          <option value="10">10. Сараалжин тааз</option>
          <option value="11">11. Чулуун емульс</option>
          <option value="12">12. TOR pinturas</option>
          <option value="13">13. Бусад бараа</option>
          <option value="14">14. Нэмэлт материал</option>
        </select>
        <input
          type="text"
  placeholder="Хайх..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="p-2 rounded text-sm mb-6 w-full max-w-xs"
  style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
/>

{error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}

{items.length === 0 && (

          <p style={{ color: 'var(--muted)' }}>No items yet. Time to add some!</p>
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
    )}
    </RequireAuth>
  )
}






























