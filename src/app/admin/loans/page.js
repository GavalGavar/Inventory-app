'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import RequireAuth from '../../../components/RequireAuth'
import Link from 'next/link'

export default function Loans() {
  const [loans, setLoans] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [companies, setCompanies] = useState([])
  const [items, setItems] = useState([])
  
  // New loan form
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [note, setNote] = useState('')
  const [branch, setBranch] = useState('')
  const [cart, setCart] = useState([])
  const [itemSearch, setItemSearch] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadLoans()
    async function loadData() {
      const { data: companiesData } = await supabase.from('companies').select().order('name')
      const { data: itemsData } = await supabase.from('items').select('id, name, price, unit_type').order('name')
      if (companiesData) setCompanies(companiesData)
      if (itemsData) setItems(itemsData)
    }
    loadData()
  }, [])

  async function loadLoans() {
    const { data } = await supabase.from('loans').select().order('created_at', { ascending: false })
    if (data) setLoans(data)
    setLoading(false)
  }

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1 }]
    })
    setItemSearch('')
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id, qty) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Number(qty) } : i))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  async function handleAddLoan() {
    if (!customerName.trim()) { alert('Нэр оруулна уу'); return }
    if (cart.length === 0) { alert('Бараа нэмнэ үү'); return }
    setSaving(true)

    const { error } = await supabase.from('loans').insert({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, unit_type: i.unit_type })),
      total: cartTotal,
      paid: 0,
      note: note.trim(),
      branch,
      status: 'unpaid',
    })

    setSaving(false)
    if (error) { alert('Алдаа: ' + error.message); return }
    setMessage('✅ Зээл бүртгэгдлээ!')
    setTimeout(() => setMessage(''), 3000)
    setShowAdd(false)
    setCustomerName('')
    setCustomerPhone('')
    setNote('')
    setBranch('')
    setCart([])
    loadLoans()
  }

  async function handlePay(loan, amount) {
    const newPaid = Number(loan.paid) + Number(amount)
    const status = newPaid >= loan.total ? 'paid' : 'partial'
    await supabase.from('loans').update({ paid: newPaid, status }).eq('id', loan.id)
    loadLoans()
    setMessage('✅ Төлбөр бүртгэгдлээ!')
    setTimeout(() => setMessage(''), 3000)
  }

  async function deleteLoan(id) {
    if (!confirm('Устгах уу?')) return
    await supabase.from('loans').delete().eq('id', id)
    setLoans(prev => prev.filter(l => l.id !== id))
  }

  const filtered = loans.filter(l =>
    l.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.customer_phone?.includes(search)
  )

  const totalDebt = loans.filter(l => l.status !== 'paid').reduce((sum, l) => sum + (l.total - l.paid), 0)

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()))

  const inputStyle = { background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        
        {message && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', backgroundColor: '#16a34a', color: '#fff', padding: '16px 24px', borderRadius: '10px', fontWeight: '700', zIndex: 9999 }}>
            {message}
          </div>
        )}

        <div className="flex justify-between items-baseline pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
            Зээл / Өр
          </h1>
          <div className="flex gap-3 items-center">
            <Link href="/admin" className="text-xs" style={{ color: 'var(--muted)' }}>← Буцах</Link>
            <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
              + Зээл нэмэх
            </button>
          </div>
        </div>

        {/* Total debt summary */}
        <div className="mb-6 p-4 rounded" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', maxWidth: '400px' }}>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Нийт төлөгдөөгүй өр</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{totalDebt.toLocaleString()} MNT</p>
        </div>

        {/* Add loan form */}
        {showAdd && (
          <div className="mb-6 p-6 rounded" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', maxWidth: '700px' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Шинэ зээл</h2>
            <div className="flex gap-4 mb-4">
              <input type="text" placeholder="Худалдан авагчийн нэр" value={customerName} onChange={e => setCustomerName(e.target.value)} className="p-2 rounded text-sm flex-1" style={inputStyle} />
              <input type="text" placeholder="Утас" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="p-2 rounded text-sm flex-1" style={inputStyle} />
            </div>
            <div className="flex gap-4 mb-4">
              <select value={branch} onChange={e => setBranch(e.target.value)} className="p-2 rounded text-sm flex-1" style={inputStyle}>
                <option value="">Салбар сонгох...</option>
                {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Тэмдэглэл" value={note} onChange={e => setNote(e.target.value)} className="p-2 rounded text-sm flex-1" style={inputStyle} />
            </div>

            {/* Item search */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input type="text" placeholder="Бараа хайх..." value={itemSearch} onChange={e => setItemSearch(e.target.value)} className="p-2 rounded text-sm w-full" style={inputStyle} />
              {itemSearch && filteredItems.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '6px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredItems.slice(0, 10).map(item => (
                    <div key={item.id} onClick={() => addToCart(item)} className="p-2 text-sm cursor-pointer" style={{ color: 'var(--foreground)', borderBottom: '0.5px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {item.name} — {item.price.toLocaleString()} MNT
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            {cart.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--background)', border: '0.5px solid var(--border)' }}>
                    <span className="text-sm flex-1" style={{ color: 'var(--foreground)' }}>{item.name}</span>
                    <input type="number" min="0.01" step="0.01" value={item.qty} onChange={e => updateQty(item.id, e.target.value)} className="p-1 rounded text-sm w-16" style={inputStyle} />
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.unit_type === 'м.кв' ? 'м²' : 'ш'} × {item.price.toLocaleString()} = {(item.price * item.qty).toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--soldout-text)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Нийт: <span style={{ color: 'var(--accent)' }}>{cartTotal.toLocaleString()} MNT</span></p>
              </div>
            )}

            <button onClick={handleAddLoan} disabled={saving} className="py-2 px-6 rounded text-sm font-bold disabled:opacity-50" style={{ background: 'var(--accent)', color: '#fff' }}>
              {saving ? 'Хадгалж байна...' : 'Зээл бүртгэх'}
            </button>
          </div>
        )}

        {/* Search */}
        <input type="text" placeholder="Нэр эсвэл утасаар хайх..." value={search} onChange={e => setSearch(e.target.value)} className="p-2 rounded text-sm mb-4" style={{ ...inputStyle, width: '100%', maxWidth: '400px' }} />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'unpaid', 'partial', 'paid'].map(s => (
            <button key={s} className="px-3 py-1 rounded text-xs font-medium" style={{ background: 'var(--card)', color: 'var(--foreground)', border: '0.5px solid var(--border)' }}
              onClick={() => setSearch('')}>
              {s === 'all' ? 'Бүгд' : s === 'unpaid' ? 'Төлөгдөөгүй' : s === 'partial' ? 'Хэсэгчлэн' : 'Төлөгдсөн'}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--muted)' }}>Уншиж байна...</p>}

        <div className="flex flex-col gap-3 max-w-2xl">
          {filtered.map(loan => (
            <div key={loan.id} className="rounded p-4" style={{ background: 'var(--card)', border: `0.5px solid ${loan.status === 'paid' ? 'var(--stock-text)' : loan.status === 'partial' ? '#f59e0b' : 'var(--soldout-text)'}` }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{loan.customer_name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{loan.customer_phone} {loan.branch && `· ${loan.branch}`}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{new Date(loan.created_at).toLocaleDateString()}</p>
                  {loan.note && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{loan.note}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>Нийт: {loan.total.toLocaleString()} MNT</p>
                  <p className="text-xs" style={{ color: 'var(--stock-text)' }}>Төлсөн: {loan.paid.toLocaleString()} MNT</p>
                  <p className="text-xs font-bold" style={{ color: loan.status === 'paid' ? 'var(--stock-text)' : 'var(--soldout-text)' }}>
                    Үлдэгдэл: {(loan.total - loan.paid).toLocaleString()} MNT
                  </p>
                </div>
              </div>

              <ul className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                {loan.items.map((item, i) => (
                  <li key={i}>{item.name} x{item.qty} — {(item.price * item.qty).toLocaleString()} MNT</li>
                ))}
              </ul>

              {loan.status !== 'paid' && (
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Төлсөн дүн" id={`pay-${loan.id}`} className="p-1 rounded text-sm w-32" style={inputStyle} />
                  <button onClick={() => {
                    const amt = document.getElementById(`pay-${loan.id}`).value
                    if (amt) handlePay(loan, amt)
                  }} className="px-3 py-1 rounded text-xs font-medium" style={{ background: 'var(--stock-bg)', color: 'var(--stock-text)' }}>
                    Төлбөр бүртгэх
                  </button>
                  <button onClick={() => deleteLoan(loan.id)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: 'var(--soldout-bg)', color: 'var(--soldout-text)' }}>
                    Устгах
                  </button>
                </div>
              )}
              {loan.status === 'paid' && (
                <div className="flex gap-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--stock-text)' }}>✓ Бүрэн төлөгдсөн</span>
                  <button onClick={() => deleteLoan(loan.id)} className="px-3 py-1 rounded text-xs font-medium" style={{ background: 'var(--soldout-bg)', color: 'var(--soldout-text)' }}>Устгах</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </RequireAuth>
  )
}