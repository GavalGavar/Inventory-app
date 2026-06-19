import { supabase } from '../../lib/supabaseClient'
import DeleteButton from '../../components/DeleteButton'
import Link from 'next/link'

export default async function Admin() {
  const { data: items, error } = await supabase.from('items').select()

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Inventory</h1>
        <Link href="/admin/add" className="bg-black text-white px-4 py-2 rounded text-sm">
          + Add Item
        </Link>
      </div>

      {error && <p className="text-red-600 mt-4">Error: {error.message}</p>}

      {items && items.length === 0 && (
        <p className="mt-4 text-gray-600">No items yet. Time to add some!</p>
      )}

      {items && items.length > 0 && (
        <ul className="mt-6">
          {items.map((item) => (
            <li key={item.id} className="border-b py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <span>{item.name} — ${item.price} ({item.quantity} in stock)</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/edit/${item.id}`} className="text-blue-600 text-sm">
                  Edit
                </Link>
                <DeleteButton id={item.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
