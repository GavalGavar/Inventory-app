'use client'

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Checkout() {
  const { cart, total, clearCart, removeFromCart, updateQty } = useCart()

  const router = useRouter()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }))

    const { error } = await supabase.from('orders').insert({
      customer_name: name,
      customer_contact: contact,
      items: orderItems,
      total: total,
    })

    if (error) {
      setSubmitting(false)
      alert('Захиалга илгээхэд алдаа гарлаа: ' + error.message)
      return
    }

    for (const item of cart) {
      await supabase.rpc('decrement_stock', {
        item_id: item.id,
        amount: item.qty,
      })
    }

    setSubmitting(false)
    setSubmitted(true)
    clearCart()
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '0.5px solid var(--border)',
    color: 'var(--foreground)',
  }

  if (submitted) {
    return (
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            ЗАХИАЛГА ХҮЛЭЭН АВЛАА
          </h1>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Захиалгын төлбөрийг доорх дансанд шилжүүлнэ үү. Төлбөр хүлээн авсны дараа баталгаажуулах болно.
        </p>
        <div
          className="p-4 rounded max-w-sm"
          style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
            ТӨЛБӨРИЙН МЭДЭЭЛЭЛ
          </p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Банк: Хаан банк</p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Данс: 57000500 5301660856</p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
            Гүйлгээний утга: Нэрээ бичнэ үү
          </p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            ТАНЫ САГС ХООСОН БАЙНА
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Эхлээд бараа нэмнэ үү!</p>
      </div>
    )
  }

  return (
    <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
        <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
          ЗАХИАЛГА
        </h1>
      </div>

      <div
        className="rounded mb-6 max-w-md"
        style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
      >
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-3"
            style={{ borderBottom: '0.5px solid var(--border)' }}
          >
            <div>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                {item.name}
              </span>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {item.quantity} үлдэгдэл
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                className="text-sm w-12 text-center rounded"
                style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}
              />
              <span className="text-sm font-medium w-24 text-right" style={{ color: 'var(--accent)' }}>
                {(item.price * item.qty).toLocaleString()} MNT
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-xs"
                style={{ color: 'var(--soldout-text)' }}
              >
                Хасах
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        Нийт: <span style={{ color: 'var(--accent)' }}>{total.toLocaleString()} MNT</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Таны нэр"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />
        <input
          type="text"
          placeholder="Утас эсвэл имэйл"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="py-2 rounded text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          {submitting ? 'Захиалж байна...' : 'Захиалах'}
        </button>
      </form>
    </div>
  )
}
