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
          <div className="flex gap-3 items-center">
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
            <Link
              href="/admin/log-sale"
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              + Log Sale
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          <Link
            href="/admin/log-sale"
            className="rounded p-4"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Log Sale
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Record an in-shop sale
            </p>
          </Link>

          <Link
            href="/admin/ledger"
            className="rounded p-4"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Stock Ledger
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              View sales history
            </p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="rounded p-4"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Dashboard
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              View sales stats
            </p>
          </Link>
        </div>
      </div>
    </RequireAuth>
  )
}
