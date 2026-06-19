'use client'

import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function OrderStatusButton({ id, status }) {
  const router = useRouter()

  async function toggleStatus() {
    const newStatus = status === 'pending' ? 'completed' : 'pending'

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={toggleStatus}
      className="text-xs font-medium px-2 py-1 rounded"
      style={{
        background: status === 'pending' ? 'var(--soldout-bg)' : 'var(--stock-bg)',
        color: status === 'pending' ? 'var(--soldout-text)' : 'var(--stock-text)',
      }}
    >
      {status.toUpperCase()}
    </button>
  )
}