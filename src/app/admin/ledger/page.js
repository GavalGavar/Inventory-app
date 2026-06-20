'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function StockLedger() {
  const [sales, setSales] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: orders } = await supabase
        .from('orders')
        .select()
        .order('created_at', { ascending: false })

      const { data: companies } = await supabase.from('companies').select()

      if (orders) {
        const companyMap = {}
        if (companies) {
          companies.forEach((c) => {
            companyMap[c.id] = c.name
          })
        }

        const salesList = orders.map((order) => ({
          id: order.id,
          date: order.created_at,
          customer: order.customer_name,
          saleType: order.sale_type,
          company: order.company_id ? companyMap[order.company_id] || 'Unknown' : null,
          archived: order.archived,
          total: order.total,
          items: order.items,
        }))

        setSales(salesList)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filteredSales = sales.filter((sale) =>
    sale.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  )

  const totalUnits = filteredSales.reduce(
    (sum, sale) => sum + sale.items.reduce((s, i) => s + i.qty, 0),
    0
  )
  const totalValue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }

  return (
    <RequireAuth>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="flex justify-between items-baseline pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            STOCK LEDGER
          </h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
            Back to Admin
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded text-sm mb-4 w-full max-w-xs"
          style={inputStyle}
        />

        {!loading && (
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            {filteredSales.length} sales - {totalUnits} units - ${totalValue.toFixed(2)} total
          </p>
        )}

        {loading && <p style={{ color: 'var(--muted)' }}>Loading...</p>}

        {!loading && filteredSales.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No sales recorded yet.</p>
        )}

        {!loading && filteredSales.length > 0 && (
          <div className="flex flex-col gap-3 max-w-2xl">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="rounded p-4"
                style={{
                  background: 'var(--card)',
                  border: '0.5px solid var(--border)',
                  opacity: sale.archived ? 0.6 : 1,
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {sale.customer}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(sale.date).toLocaleString()}
                      {sale.company ? ' - ' + sale.company : ''}
                      {sale.saleType === 'online' ? ' - Online' : ' - In-Shop'}
                    </p>
                  </div>
                  {sale.archived && (
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ background: 'var(--soldout-bg)', color: 'var(--soldout-text)' }}
                    >
                      Archived
                    </span>
                  )}
                </div>

                <ul className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  {sale.items.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.name} x{item.qty}</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <p
                  className="text-sm font-medium text-right"
                  style={{ color: 'var(--accent)', borderTop: '0.5px solid var(--border)', paddingTop: '8px' }}
                >
                  Total: ${sale.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
