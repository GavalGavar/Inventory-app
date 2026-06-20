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


  
    return (
  <RequireAuth allowedRoles={['admin']}>

      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
       <div
  className="flex justify-between items-baseline pb-4 mb-6"
  style={{ borderBottom: '2px solid var(--accent)' }}
>
  <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
    ORDERS
  </h1>
  <Link
    href="/admin/archive"
    className="text-xs"
    style={{ color: 'var(--muted)' }}
  >
    View Archive
  </Link>
</div>


        {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}

        {orders.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No orders yet.</p>
        )}

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
                    <OrderStatusButton id={order.id} status={order.status} />
                    <OrderDeleteButton id={order.id} />
                  </div>
                </div>

                <ul className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.qty} — ${(item.price * item.qty).toFixed(2)}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--muted)' }}>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                  <span className="font-medium" style={{ color: 'var(--accent)' }}>
                    Total: ${order.total.toFixed(2)}
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
