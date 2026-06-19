'use client'

import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function OrderDeleteButton({ id }) {
  const router = useRouter()

  async function handleArchive() {
    const confirmed = confirm('Move this order to archive?')
    if (!confirmed) return

    const { error } = await supabase
      .from('orders')
      .update({ archived: true })
      .eq('id', id)

    if (error) {
      alert('Error archiving order: ' + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleArchive}
      className="text-xs font-medium"
      style={{ color: 'var(--soldout-text)' }}
    >
      Archive
    </button>
  )
}
