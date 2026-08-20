'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomers() {
      const { data } = await supabase.from('customers').select().order('created_at', { ascending: false })
      if (data) setCustomers(data)
      setLoading(false)
    }
    loadCustomers()
  }, [])

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="flex justify-between items-baseline pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            Худалдан авагчид
          </h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>← Буцах</Link>
        </div>

        <input
          type="text"
          placeholder="Нэр эсвэл утасны дугаараар хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded text-sm mb-6 w-full max-w-md"
          style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
        />

        {loading && <p style={{ color: 'var(--muted)' }}>Уншиж байна...</p>}

        {!loading && filtered.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Худалдан авагч олдсонгүй.</p>
        )}

        <div className="flex flex-col gap-2 max-w-lg">
          {filtered.map((customer) => (
            <div key={customer.id} className="rounded p-4" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{customer.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{customer.phone}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{new Date(customer.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </RequireAuth>
  )
}