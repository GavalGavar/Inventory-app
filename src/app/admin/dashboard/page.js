'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: ordersData } = await supabase
        .from('orders')
        .select()
        .eq('archived', false)
      const { data: companiesData } = await supabase
        .from('companies')
        .select()
        .order('name')

      if (ordersData) setOrders(ordersData)
      if (companiesData) setCompanies(companiesData)
      setLoading(false)
    }
    loadData()
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

  function buildCharts(orderList) {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      date.setHours(0, 0, 0, 0)
      return date
    })
    const chart14Days = last14Days.map((day) => {
      const nextDay = new Date(day)
      nextDay.setDate(day.getDate() + 1)
      const dayOrders = orderList.filter((o) => {
        const created = new Date(o.created_at)
        return created >= day && created < nextDay
      })
      return {
        date: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        sales: sumOrders(dayOrders),
      }
    })

    const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const chartWeek = weekDayNames.map((name, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      const nextDay = new Date(day)
      nextDay.setDate(day.getDate() + 1)
      const dayOrders = orderList.filter((o) => {
        const created = new Date(o.created_at)
        return created >= day && created < nextDay
      })
      return { date: name, sales: sumOrders(dayOrders) }
    })

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const chartMonth = Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(now.getFullYear(), now.getMonth(), i + 1)
      const nextDay = new Date(now.getFullYear(), now.getMonth(), i + 2)
      const dayOrders = orderList.filter((o) => {
        const created = new Date(o.created_at)
        return created >= day && created < nextDay
      })
      return { date: String(i + 1), sales: sumOrders(dayOrders) }
    })

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const chartYear = monthNames.map((name, i) => {
      const monthStart = new Date(now.getFullYear(), i, 1)
      const monthEnd = new Date(now.getFullYear(), i + 1, 1)
      const monthOrdersList = orderList.filter((o) => {
        const created = new Date(o.created_at)
        return created >= monthStart && created < monthEnd
      })
      return { date: name, sales: sumOrders(monthOrdersList) }
    })

    return { chart14Days, chartWeek, chartMonth, chartYear }
  }

  function ChartCard({ title, data }) {
    return (
      <div
        className="rounded p-4 mt-4"
        style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
      >
        <p className="text-xs font-medium mb-4" style={{ color: 'var(--muted)' }}>
          {title}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--muted)' }}
              axisLine={{ stroke: 'var(--border)' }}
              interval={data.length > 20 ? 2 : 0}
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
    )
  }

  function CompanySection({ label, companyIds }) {
    const [open, setOpen] = useState(false)
    const companyOrders = orders.filter((o) => companyIds.includes(o.company_id))
    const charts = buildCharts(companyOrders)
    const companyTotal = sumOrders(companyOrders)

    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center p-3 rounded text-left"
          style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              {label}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Total: {companyTotal.toFixed(2)} MNT ({companyOrders.length} sales)
            </p>
          </div>
          <span className="text-sm" style={{ color: 'var(--accent)' }}>
            {open ? '-' : '+'}
          </span>
        </button>

       {open && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
    <ChartCard title="LAST 14 DAYS" data={charts.chart14Days} />
    <ChartCard title="THIS WEEK" data={charts.chartWeek} />
    <ChartCard title="THIS MONTH" data={charts.chartMonth} />
    <ChartCard title="THIS YEAR" data={charts.chartYear} />
  </div>
)}

      </div>
    )
  }

  const sorted = [...companies].sort((a, b) => a.name.localeCompare(b.name))

  const sections = [
    { label: 'Нийт', companyIds: companies.map((c) => c.id).concat([null]) },
    { label: 'Агуулах', companyIds: [sorted[0], sorted[2]].filter(Boolean).map((c) => c.id) },
    { label: 'Tor Pinturas', companyIds: [sorted[1]].filter(Boolean).map((c) => c.id) },
    { label: 'Одкон', companyIds: [sorted[3], sorted[4]].filter(Boolean).map((c) => c.id) },
    { label: 'Онлайн', companyIds: [sorted[5], sorted[6]].filter(Boolean).map((c) => c.id) },
    { label: 'Прогресс', companyIds: [sorted[7], sorted[8]].filter(Boolean).map((c) => c.id) },
  ]

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
  <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
    
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            Taaz.mn | DASHBOARD
            
          </h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
            Back to Admin
          </Link>
        </div>

        {loading && (
          <p style={{ color: 'var(--muted)' }}>Loading stats...</p>
        )}

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', maxWidth: '1100px' }}>

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

        {!loading && companies.length >= 9 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {sections.map((section) => (
              <CompanySection
                key={section.label}
                label={section.label}
                companyIds={section.companyIds}
              />
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  )
}

