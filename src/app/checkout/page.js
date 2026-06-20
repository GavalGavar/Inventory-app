'use client'

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Checkout() {
  const { cart, total, clearCart, removeFromCart } = useCart()
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
      alert('Error placing order: ' + error.message)
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
        <div
          className="pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            ORDER RECEIVED
          </h1>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Thanks for your order. Please complete payment using the details below,
          and we'll confirm once received.
        </p>

        <div
          className="p-4 rounded max-w-sm"
          style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
            PAYMENT DETAILS
          </p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Bank: Khanbank</p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Account: 57000500 5301660856</p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
            Reference: Please include your name
          </p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div
          className="pb-4 mb-6"
          style={{ borderBottom: '2px solid var(--accent)' }}
        >
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            YOUR CART IS EMPTY
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Add some items first!</p>
      </div>
    )
  }

  return (
    <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <div
        className="pb-4 mb-6"
        style={{ borderBottom: '2px solid var(--accent)' }}
      >
        <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
          CHECKOUT
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

      <p className="text-sm font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        Total: <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded text-sm"
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Phone or email"
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
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
