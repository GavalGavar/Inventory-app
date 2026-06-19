'use client'

import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function OrderDeleteButton({ id }) {
  const router = useRouter()

  async function handleDelete() {
    const confirmed = confirm('Delete this order?')
    if (!confirmed) return

    const { error } = await supabase.from('orders').delete().eq('id', id)

    if (error) {
      alert('Error deleting order: ' + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs font-medium"
      style={{ color: 'var(--soldout-text)' }}
    >
      Delete
    </button>
  )
}
