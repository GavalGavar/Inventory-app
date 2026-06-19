'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RequireAuth({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
      } else {
        setAuthed(true)
      }
      setChecking(false)
    }
    checkAuth()
  }, [router])

  if (checking) {
    return (
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <p style={{ color: 'var(--muted)' }}>Checking login...</p>
      </div>
    )
  }

  if (!authed) return null

  return children
}
