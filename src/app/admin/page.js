import { supabase } from '../../lib/supabaseClient'
import DeleteButton from '../../components/DeleteButton'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const { data: items, error } = await supabase.from('items').select()

  return (
    <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div
        className="flex justify-between items-baseline pb-4 mb-6"
        style={{ borderBottom: '2px solid var(--accent)' }}
      >
        <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
          MANAGE INVENTORY
        </h1>
        <Link
          href="/admin/add"
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          + Add Item
        </Link>
      </div>

      {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}

      {items && items.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>No items yet. Time to add some!</p>
      )}

      {items && items.length > 0 && (
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
  )
}
