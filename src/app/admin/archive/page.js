'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function Archive() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function loadArchived() {
      const { data } = await supabase
        .from('orders')
        .select()
        .eq('archived', true)
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    }
    loadArchived()
  }, [])

  async function restore(id) {
    await supabase.from('orders').update({ archived: false }).eq('id', id)
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  async function permanentlyDelete(id) {
    const confirmed = confirm('Permanently delete this order? This cannot be undone.')
    if (!confirmed) return
    await supabase.from('orders').delete().eq('id', id)
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  return (
  <RequireAuth allowedRoles={['admin', 'sales_manager']}>
    

      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            АРХИВЛАСАН ЗАХИАЛГА
          </h1>
          <Link
            href="/admin/orders"
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
← Захиалга руу буцах
          </Link>
        </div>

        {orders.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Архивлагдсан захиалга алга байна.</p>
        )}

        {orders.length > 0 && (
          <div className="flex flex-col gap-3 max-w-2xl">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded p-4"
                style={{ background: 'var(--card)', border: '0.5px solid var(--border)', opacity: 0.75 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {order.customer_name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {order.customer_contact}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => restore(order.id)}
                      className="text-xs font-medium"
                      style={{ color: 'var(--stock-text)' }}
                    >
                      Сэргээх
                    </button>
                    <button
                      onClick={() => permanentlyDelete(order.id)}
                      className="text-xs font-medium"
                      style={{ color: 'var(--soldout-text)' }}
                    >
                      Устах
                    </button>
                  </div>
                </div>

                <ul className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.qty} — {(item.price * item.qty).toFixed(2)} MNT
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--muted)' }}>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                  <span className="font-medium">Нийт: {order.total.toFixed(2)} MNT</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  )
}





