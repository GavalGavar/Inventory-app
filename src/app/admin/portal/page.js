'use client'

import RequireAuth from '../../../components/RequireAuth'
import { supabase } from '../../../lib/supabaseClient'
import Link from 'next/link'

export default function Portal() {
  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            SALES PORTAL
          </h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Log Out
          </button>
        </div>

        <div className="flex flex-col gap-3 max-w-sm">
          <Link
            href="/admin/log-sale"
            className="p-4 rounded text-sm font-medium"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            Log Sale
          </Link>
          <Link
            href="/admin/ledger"
            className="p-4 rounded text-sm font-medium"
            style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
          >
            Stock Ledger
          </Link>
          <Link
            href="/admin/dashboard"
            className="p-4 rounded text-sm font-medium"
            style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </RequireAuth>
  )
}
