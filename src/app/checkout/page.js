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

    setSubmitting(false)

    if (error) {
      alert('Error placing order: ' + error.message)
    } else {
      setSubmitted(true)
      clearCart()
    }
  }

  if (submitted) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">Order Received!</h1>
        <p className="mt-4 text-gray-600">
          Thanks for your order. Please complete payment using the details below,
          and we'll confirm once received.
        </p>
        <div className="mt-4 p-4 border rounded bg-gray-50 text-black">
          
          <p className="font-semibold">Payment details:</p>
          <p>Bank: Khanbank</p>
          <p>Account: 57000500 5301660856</p>
          <p>Reference: Please include your name</p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-4 text-gray-600">Add some items first!</p>
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <ul className="mt-6 max-w-md">
        {cart.map((item) => (
          <li key={item.id} className="border-b py-2 flex justify-between items-center">
            <span>{item.name} x{item.qty}</span>
            <div className="flex items-center gap-3">
              <span>${(item.price * item.qty).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-semibold">Total: ${total.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Phone or email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
