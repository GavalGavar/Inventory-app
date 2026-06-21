'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import DeleteButton from '../../components/DeleteButton'
import RequireAuth from '../../components/RequireAuth'
import Link from 'next/link'

export default function Admin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

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
  View Orders
</Link>
<Link
  href="/admin/bulk"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Bulk Edit
</Link>
<Link

  href="/admin/dashboard"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Dashboard
</Link>

{role === 'admin' && (
<Link
  href="/admin/companies"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Companies
</Link>
)}

<Link
  href="/admin/log-sale"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Log Sale
</Link>

<Link
  href="/admin/ledger"
  className="px-4 py-2 rounded text-sm font-medium"
  style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
>
  Ledger
</Link>



            <Link
              href="/admin/add"
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              + Add Item
            </Link>
          </div>
        </div>

        <input
          type="text"

  placeholder="Search items..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="p-2 rounded text-sm mb-6 w-full max-w-xs"
  style={{
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }}
/>

{error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}

{items.length === 0 && (

          <p style={{ color: 'var(--muted)' }}>No items yet. Time to add some!</p>
        )}

        {filteredItems.length > 0 && (
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
    {filteredItems.map((item) => (
      
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
                  ${item.price} · {item.quantity} units
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/admin/edit/${item.id}`}
                    className="text-xs font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Edit
                  </Link>
                  <DeleteButton id={item.id} />
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


