'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomers() {
      const { data } = await supabase.from('customers').select()
      const { data: orders } = await supabase.from('orders').select('customer_name, customer_contact, total')
      if (data) {
        const enriched = data.map(c => {
          const customerOrders = orders?.filter(o => o.customer_contact === c.phone || o.customer_name === c.name) || []
          return { ...c, orderCount: customerOrders.length, totalSpent: customerOrders.reduce((sum, o) => sum + (o.total || 0), 0) }
        })
        setCustomers(enriched)
      }
      setLoading(false)
    }
    loadCustomers()
  }, [])
  const sorted = [...customers].sort((a, b) => {
    if (sortBy === 'total') return (b.totalSpent || 0) - (a.totalSpent || 0)
    if (sortBy === 'orders') return (b.orderCount || 0) - (a.orderCount || 0)
    return new Date(b.created_at) - new Date(a.created_at)
  })
  const filtered = sorted.filter(c =>
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

        <div className="flex gap-2 mb-4">
          <button onClick={() => setSortBy('date')} className="px-3 py-1 rounded text-xs font-medium" style={{ background: sortBy === 'date' ? 'var(--accent)' : 'var(--card)', color: sortBy === 'date' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Огноогоор</button>
          <button onClick={() => setSortBy('total')} className="px-3 py-1 rounded text-xs font-medium" style={{ background: sortBy === 'total' ? 'var(--accent)' : 'var(--card)', color: sortBy === 'total' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Нийт дүнгээр</button>
          <button onClick={() => setSortBy('orders')} className="px-3 py-1 rounded text-xs font-medium" style={{ background: sortBy === 'orders' ? 'var(--accent)' : 'var(--card)', color: sortBy === 'orders' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Захиалгын тоогоор</button>
        </div>
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