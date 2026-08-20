'use client'

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Checkout() {
  const { cart, total, clearCart, removeFromCart, updateQty } = useCart()
  const noatAmount = Math.round(total * 0.1)
  const totalWithNoat = total + noatAmount
  const router = useRouter()

  const [buyerType, setBuyerType] = useState('individual')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyReg, setCompanyReg] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
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
      unit_type: item.unit_type || 'ширхэг',
    }))

    const customerName = buyerType === 'company' ? companyName : name
    const customerContact = buyerType === 'company'
      ? `${companyPhone} | Рег: ${companyReg}`
      : contact
    // Save customer
    await supabase.from('customers').upsert({
      name: buyerType === 'company' ? companyName : name,
      phone: buyerType === 'company' ? companyPhone : contact,
    }, { onConflict: 'phone' })
    const { error } = await supabase.from('orders').insert({
      customer_name: customerName,
      customer_contact: customerContact,
      items: orderItems,
      total,
    })

    if (error) {
      setSubmitting(false)
      alert('Захиалга илгээхэд алдаа гарлаа: ' + error.message)
      return
    }
    // Send email notification
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: buyerType === 'company' ? companyName : name,
        customerContact: buyerType === 'company' ? companyPhone : contact,
        items: orderItems,
        total,
      }),
    })

    for (const item of cart) {
      await supabase.rpc('decrement_stock', { item_id: item.id, amount: item.qty })
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
        <div className="p-4 rounded max-w-sm" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>ТӨЛБӨРИЙН МЭДЭЭЛЭЛ</p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Банк: Хаан банк</p>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>Данс: 57000500 5301660856</p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Гүйлгээний утга: Нэрээ бичнэ үү</p>
        </div>
        <Link href="/products" style={{ display: 'inline-block', marginTop: '24px', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Бүтээгдэхүүн үзэх
        </Link>
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
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Эхлээд бараа нэмнэ үү!</p>
        <Link href="/products" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Бүтээгдэхүүн үзэх
        </Link>
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

      {/* Cart items */}
      <div className="rounded mb-6 max-w-lg" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
            <div>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item.name}</span>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {item.unit_type === 'м.кв' ? '1м² = ' : '1ш = '}{item.price.toLocaleString()} MNT
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={item.qty}
                onChange={(e) => updateQty(item.id, parseFloat(e.target.value) || 1)}
                className="text-sm w-16 text-center rounded p-1"
                style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)', background: 'var(--background)' }}
              />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {item.unit_type === 'м.кв' ? 'м²' : 'ш'}
              </span>
              <span className="text-sm font-medium w-28 text-right" style={{ color: 'var(--accent)' }}>
                {(item.price * item.qty).toLocaleString()} MNT
              </span>
              <button onClick={() => removeFromCart(item.id)} className="text-xs" style={{ color: 'var(--soldout-text)' }}>
                Хасах
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>
        Дүн: <span>{total.toLocaleString()} MNT</span>
      </p>
      <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>
        НӨАТ 10%: <span>{noatAmount.toLocaleString()} MNT</span>
      </p>
      <p className="text-sm font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        Нийт дүн: <span style={{ color: 'var(--accent)' }}>{totalWithNoat.toLocaleString()} MNT</span>
      </p>

      {/* Buyer type */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setBuyerType('individual')}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{
            background: buyerType === 'individual' ? 'var(--accent)' : 'var(--card)',
            color: buyerType === 'individual' ? '#fff' : 'var(--foreground)',
            border: '0.5px solid var(--border)',
          }}
        >
          Хувь хүн
        </button>
        <button
          onClick={() => setBuyerType('company')}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{
            background: buyerType === 'company' ? 'var(--accent)' : 'var(--card)',
            color: buyerType === 'company' ? '#fff' : 'var(--foreground)',
            border: '0.5px solid var(--border)',
          }}
        >
          Компани
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        {buyerType === 'individual' && (
          <>
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
          </>
        )}

        {buyerType === 'company' && (
          <>
            <input
              type="text"
              placeholder="Компанийн нэр"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="p-2 rounded text-sm"
              style={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="Регистрийн дугаар"
              value={companyReg}
              onChange={(e) => setCompanyReg(e.target.value)}
              className="p-2 rounded text-sm"
              style={inputStyle}
              required
            />
            <input
              type="text"
              placeholder="Утасны дугаар"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="p-2 rounded text-sm"
              style={inputStyle}
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="py-2 rounded text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {submitting ? 'Захиалж байна...' : 'Захиалах'}
        </button>
      </form>
    </div>
  )
}
