'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LogSale() {
  const router = useRouter()
  const [companies, setCompanies] = useState([])
  const [items, setItems] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('Walk-in customer')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: companiesData } = await supabase.from('companies').select().order('name')
      const { data: itemsData } = await supabase.from('items').select().order('name')
      if (companiesData) setCompanies(companiesData)
      if (itemsData) setItems(itemsData)
    }
    load()
  }, [])

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        if (existing.qty >= item.quantity) {
          alert('No more stock available for this item.')
          return prev
        }
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  async function handleSubmit() {
    if (!companyId) {
      alert('Please select a company.')
      return
    }
    if (cart.length === 0) {
      alert('Please add at least one item.')
      return
    }

    setSaving(true)

    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }))

    const { error } = await supabase.from('orders').insert({
      customer_name: customerName,
      customer_contact: 'In-shop sale',
      items: orderItems,
      total: total,
      sale_type: 'in_shop',
      company_id: companyId,
      status: 'completed',
    })

    if (error) {
      setSaving(false)
      alert('Error logging sale: ' + error.message)
      return
    }

    for (const item of cart) {
      await supabase.rpc('decrement_stock', {
        item_id: item.id,
        amount: item.qty,
      })
    }

    setSaving(false)
    router.push('/admin')
  }

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
            LOG IN-SHOP SALE
          </h1>
          <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>
            Back to Admin
          </Link>
        </div>

        <div className="flex flex-col gap-4 max-w-md mb-6">
          <div>
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>
              Company / Branch
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="p-2 rounded text-sm w-full"
              style={inputStyle}
            >
              <option value="">Select a company...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>
              Customer name (optional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="p-2 rounded text-sm w-full"
              style={inputStyle}
            />
          </div>
        </div>

        <p className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
          Select items sold:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mb-6">
         {items.map((item) => (
  <button
    key={item.id}
    onClick={() => addToCart(item)}
    disabled={item.quantity === 0}
    className="text-left rounded p-3 text-sm disabled:opacity-40"
    style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
  >
    {item.image_url && (
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full aspect-square object-cover rounded mb-2"
      />
    )}
    <p className="font-medium">{item.name}</p>
    <p className="text-xs" style={{ color: 'var(--muted)' }}>
      ${item.price} · {item.quantity} in stock
    </p>
  </button>
))}

        </div>

        {cart.length > 0 && (
          <div className="max-w-md mb-6">
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Sale items:
            </p>
            <div className="rounded" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3"
                  style={{ borderBottom: '0.5px solid var(--border)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {item.name} x{item.qty}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs"
                      style={{ color: 'var(--soldout-text)' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm font-medium mt-2" style={{ color: 'var(--foreground)' }}>
              Total: <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 rounded text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          {saving ? 'Saving...' : 'Log Sale'}
        </button>
      </div>
    </RequireAuth>
  )
}
