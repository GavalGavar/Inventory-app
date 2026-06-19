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
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center rounded p-3"
              style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
            >
              <div className="flex items-center gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    ${item.price} · {item.quantity} units
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
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
