'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import OrderDeleteButton from '../../../components/OrderDeleteButton'
import OrderStatusButton from '../../../components/OrderStatusButton'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [returning, setReturning] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select()
        .eq('archived', false)
        .order('created_at', { ascending: false })
      if (error) setError(error)
      else setOrders(data)
    }
    loadOrders()
  }, [])

  async function handleReturn(order) {
    const confirmed = confirm(`"${order.customer_name}" захиалгын бараануудыг агуулахад буцаах уу?`)
    if (!confirmed) return
    setReturning(order.id)

    for (const item of order.items) {
      const { data: existing } = await supabase
        .from('items')
        .select('id, quantity')
        .eq('name', item.name)
        .single()

      if (existing) {
        await supabase
          .from('items')
          .update({ quantity: existing.quantity + item.qty })
          .eq('id', existing.id)
      }
    }

    await supabase.from('orders').delete().eq('id', order.id)
    setOrders((prev) => prev.filter((o) => o.id !== order.id))
    await supabase.from('orders').delete().eq('id', order.id)
    setOrders((prev) => prev.filter((o) => o.id !== order.id))
    setReturning(null)
    setMessage(`✅ ${order.customer_name} захиалгын бараа буцаагдлаа!`)
    setTimeout(() => setMessage(''), 3000)
    

  }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            Taaz.mn | ЗАХИАЛГА
          </h1>
          <Link href="/admin/archive" className="text-xs" style={{ color: 'var(--muted)' }}>
            Архив харах
          </Link>
        </div>

        {message && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px',
            backgroundColor: '#16a34a', color: '#fff',
            padding: '16px 24px', borderRadius: '10px',
            fontWeight: '700', fontSize: '1rem', zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {message}
          </div>
        )}

        {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}
        {orders.length === 0 && <p style={{ color: 'var(--muted)' }}>No orders yet.</p>}

        {orders.length > 0 && (
          <div className="flex flex-col gap-3 max-w-2xl">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded p-4"
                style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
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
                      onClick={() => handleReturn(order)}
                      disabled={returning === order.id}
                      className="text-xs font-medium px-3 py-1 rounded"
                      style={{
                        border: '0.5px solid var(--border)',
                        color: returning === order.id ? 'var(--muted)' : 'var(--stock-text)',
                        background: 'var(--card)'
                      }}
                    >
                      {returning === order.id ? 'Буцааж байна...' : '↩ Буцаах'}
                    </button>
                    <OrderStatusButton id={order.id} status={order.status} />
                    <OrderDeleteButton id={order.id} />
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
                  <span className="font-medium" style={{ color: 'var(--accent)' }}>
                    Нийт: {order.total.toFixed(2)} MNT
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
