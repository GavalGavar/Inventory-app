'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RequireAuth({ children, allowedRoles }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [denied, setDenied] = useState(false)
  const [role, setRole] = useState(null)

  const allowedRolesKey = allowedRoles ? allowedRoles.join(',') : ''
useEffect(() => {
  let cancelled = false

  async function checkAuth() {
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (cancelled) return

   const { data } = await supabase.auth.getSession()
if (cancelled) return
console.log('RequireAuth session check:', data.session ? 'FOUND SESSION for ' + data.session.user.email : 'NO SESSION')
if (!data.session) {
  router.push('/login')
  return
}


const userId = data.session.user.id

     const { data: roleData } = await supabase
  .from('user_roles')
  .select('role')
  .eq('id', userId)
  .single()

      if (cancelled) return

      const userRole = roleData ? roleData.role : 'sales_manager'
      setRole(userRole)

      const rolesList = allowedRolesKey ? allowedRolesKey.split(',') : null

      if (rolesList && !rolesList.includes(userRole)) {
        setDenied(true)
        setChecking(false)
        return
      }

      setAuthed(true)
      setChecking(false)
    }

    checkAuth()

    return () => {
      cancelled = true
    }
  }, [router, allowedRolesKey])

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

  if (typeof children === 'function') {
    return children(role)
  }

  return children
}
