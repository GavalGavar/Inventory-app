'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      const { data } = await supabase
        .from('orders')
        .select()
        .eq('archived', false)
      if (data) setOrders(data)
      setLoading(false)
    }
    loadOrders()
  }, [])

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  function sumOrders(list) {
    return list.reduce((sum, o) => sum + o.total, 0)
  }

  const weekOrders = orders.filter((o) => new Date(o.created_at) >= startOfWeek)
  const monthOrders = orders.filter((o) => new Date(o.created_at) >= startOfMonth)
  const onlineOrders = orders.filter((o) => o.sale_type === 'online')
  const inShopOrders = orders.filter((o) => o.sale_type === 'in_shop')

  const stats = [
    { label: 'TOTAL SALES', value: '$' + sumOrders(orders).toFixed(2), sub: orders.length + ' orders' },
    { label: 'THIS WEEK', value: '$' + sumOrders(weekOrders).toFixed(2), sub: weekOrders.length + ' orders' },
    { label: 'THIS MONTH', value: '$' + sumOrders(monthOrders).toFixed(2), sub: monthOrders.length + ' orders' },
    { label: 'ONLINE SALES', value: '$' + sumOrders(onlineOrders).toFixed(2), sub: onlineOrders.length + ' orders' },
    { label: 'IN-SHOP SALES', value: '$' + sumOrders(inShopOrders).toFixed(2), sub: inShopOrders.length + ' orders' },
  ]

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    date.setHours(0, 0, 0, 0)
    return date
  })

  const chartData = last14Days.map((day) => {
    const nextDay = new Date(day)
    nextDay.setDate(day.getDate() + 1)
    const dayOrders = orders.filter((o) => {
      const created = new Date(o.created_at)
      return created >= day && created < nextDay
    })
    return {
      date: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      sales: sumOrders(dayOrders),
    }
  })

  return (
    <RequireAuth>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            DASHBOARD
          </h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
            Back to Admin
          </Link>
        </div>

        {loading && (
  <p style={{ color: 'var(--muted)' }}>Loading stats...</p>
)}



       {!loading && (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
    

            {stats.map(function (stat) {
              return (
                <div
                  key={stat.label}
                  className="rounded p-4"
                  style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-medium" style={{ color: 'var(--accent)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    {stat.sub}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {!loading && (
          <div
            className="rounded p-4 mt-6 max-w-4xl"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-xs font-medium mb-4" style={{ color: 'var(--muted)' }}>
              SALES - LAST 14 DAYS
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip
                  formatter={(value) => ['$' + value.toFixed(2), 'Sales']}
                  contentStyle={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
                />
                <Bar dataKey="sales" fill="#C2480A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
