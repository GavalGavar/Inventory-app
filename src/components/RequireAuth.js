'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RequireAuth({ children, allowedRoles }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      if (allowedRoles) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = roleData ? roleData.role : 'sales_manager'

        if (!allowedRoles.includes(role)) {
          setDenied(true)
          setChecking(false)
          return
        }
      }

      setAuthed(true)
      setChecking(false)
    }
    checkAuth()
  }, [router, allowedRoles])

  if (checking) {
    return (
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <p style={{ color: 'var(--muted)' }}>Checking login...</p>
      </div>
    )
  }

  if (denied) {
    return (
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <p style={{ color: 'var(--soldout-text)' }}>
          You don't have permission to view this page.
        </p>
      </div>
    )
  }

  if (!authed) return null

  return children
}
