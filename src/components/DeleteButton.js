'use client'

import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }) {
  const router = useRouter()

  async function handleDelete() {
    const confirmed = confirm('Delete this item?')
    if (!confirmed) return

    const { error } = await supabase.from('items').delete().eq('id', id)

    if (error) {
      alert('Error deleting item: ' + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 text-sm ml-4"
    >
      Delete
    </button>
  )
}
