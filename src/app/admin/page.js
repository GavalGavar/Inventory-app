'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import RequireAuth from '../../components/RequireAuth'
import Link from 'next/link'

const CATEGORIES = [
  { number: 1, name: 'Хөнгөн цагаан тааз', icon: '⬜' },
  { number: 2, name: 'Гэрэл сэнс', icon: '💡' },
  { number: 3, name: 'Ханын панел хавтан', icon: '🏠' },
  { number: 4, name: 'Хулсан хавтан', icon: '🎋' },
  { number: 5, name: 'Ханын гоёлын рейк', icon: '✨' },
  { number: 6, name: 'Таазны рейк', icon: '📐' },
  { number: 7, name: 'Плинтүс', icon: '📏' },
  { number: 8, name: 'Хавтан таазны хүрээ', icon: '🔲' },
  { number: 9, name: 'Гипсэн тааз', icon: '🏛️' },
  { number: 10, name: 'Сараалжин тааз', icon: '🔳' },
  { number: 11, name: 'Чулуун емульс', icon: '🪨' },
  { number: 12, name: 'TOR pinturas', icon: '🎨' },
  { number: 13, name: 'Бусад бараа', icon: '📦' },
  { number: 14, name: 'Нэмэлт материал', icon: '➕' },
]

const SIZE_KEYWORDS = {
  '30x30 Хөнгөн цагаан тааз': ['30x30', '30х30'],
  '30x60 Хөнгөн цагаан тааз': ['30x60', '30х60'],
  '60x60 Хөнгөн цагаан тааз': ['60x60', '60х60'],
  '45x90 Хөнгөн цагаан тааз': ['45x90', '45х90'],
  '60x120 Хөнгөн цагаан тааз': ['60x120', '60х120', '120x60', '120х60'],
  '1.22x2.44 Хөнгөн цагаан тааз': ['1.22x2.44', '1.22х2.44', '122x244', '122х244'],
  '20x20 Гэрэл/Сэнс': ['20x20', '20х20'],
  '30x30 Гэрэл/Сэнс': ['30x30', '30х30'],
  '30x60 Гэрэл/Сэнс': ['30x60', '30х60'],
  '45x90 Гэрэл': ['45x90', '45х90'],
  '60x60 Гэрэл/Сэнс': ['60x60', '60х60'],
  'Рейкэн таазны гэрэл': ['Рейкэн'],
}

const ALL_CEILING_KEYWORDS = ['30x30','30х30','30x60','30х60','60x60','60х60','45x90','45х90','60x120','60х120','120x60','120х60','1.22x2.44','1.22х2.44','122x244','122х244']

const CEILING_SIZES = [
  '30x30 Хөнгөн цагаан тааз',
  '30x60 Хөнгөн цагаан тааз',
  '60x60 Хөнгөн цагаан тааз',
  '45x90 Хөнгөн цагаан тааз',
  '60x120 Хөнгөн цагаан тааз',
  '1.22x2.44 Хөнгөн цагаан тааз',
  'Нэмэлт материал',
]

const LIGHT_SIZES = [
  '20x20 Гэрэл/Сэнс',
  '30x30 Гэрэл/Сэнс',
  '30x60 Гэрэл/Сэнс',
  '45x90 Гэрэл',
  '60x60 Гэрэл/Сэнс',
  'Рейкэн таазны гэрэл',
]

export default function Admin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [sizeFilter, setSizeFilter] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [buyerType, setBuyerType] = useState('individual')
  const [branch, setBranch] = useState('')
  const [branchReg, setBranchReg] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyReg, setCompanyReg] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [receiptNumber, setReceiptNumber] = useState('')
  const [companies, setCompanies] = useState([])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || item.category_number === categoryFilter
    let matchesSize = true
    if (sizeFilter) {
      if (sizeFilter === 'Нэмэлт материал') {
        matchesSize = !ALL_CEILING_KEYWORDS.some((kw) =>
          item.name.toLowerCase().includes(kw.toLowerCase())
        )
      } else {
        const keywords = SIZE_KEYWORDS[sizeFilter] || []
        matchesSize = keywords.some((kw) =>
          item.name.toLowerCase().includes(kw.toLowerCase())
        )
      }
    }
    return matchesSearch && matchesCategory && matchesSize
  })

  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase.from('items').select()
      if (error) setError(error)
      else setItems(data.sort((a, b) => {
        const skuA = parseFloat(a.sku) || 9999
        const skuB = parseFloat(b.sku) || 9999
        return skuA - skuB
      }))
    }
    loadItems()
  }, [])

  useEffect(() => {
    async function loadCompanies() {
      const { data } = await supabase.from('companies').select().order('name')
      if (data) setCompanies(data)
    }
    loadCompanies()
  }, [])

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        if (existing.qty >= item.quantity) {
          alert('Нөөц хүрэлцэхгүй байна.')
          return prev
        }
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...item, qty: 1 }]
    })
    setShowCart(true)
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 0.01) return
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Number(qty) } : i)))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  async function handleSell() {
    if (!branch) { alert('Салбар сонгоно уу.'); return }
    if (buyerType === 'individual' && !customerName.trim()) { alert('Худалдан авагчийн нэр оруулна уу.'); return }
    if (buyerType === 'company' && !companyName.trim()) { alert('Компанийн нэр оруулна уу.'); return }
    if (cart.length === 0) { alert('Бараа нэмнэ үү.'); return }
    const { data: counterData } = await supabase.from('receipt_counter').select('last_number').eq('id', 1).single()
    const newNumber = (counterData?.last_number || 0) + 1
    await supabase.from('receipt_counter').update({ last_number: newNumber }).eq('id', 1)
    setSaving(true)

    const orderItems = cart.map((item) => ({
      id: item.id, name: item.name, price: item.price, qty: item.qty, unit_type: item.unit_type || 'ширхэг',
    }))

    const customerNameFinal = buyerType === 'company' ? companyName : customerName
    const customerContactFinal = buyerType === 'company' ? `${companyPhone} | Рег: ${companyReg}` : customerPhone

    const { error } = await supabase.from('orders').insert({
      customer_name: customerNameFinal,
      customer_contact: customerContactFinal,
      items: orderItems,
      total: cartTotal,
      sale_type: 'in_shop',
      status: 'completed',
      branch: branch,
    })

    if (error) { setSaving(false); alert('Алдаа гарлаа: ' + error.message); return }

    for (const item of cart) {
      await supabase.rpc('decrement_stock', { item_id: item.id, amount: item.qty })
    }

    setReceipt({
      buyerName: customerNameFinal,
      buyerReg: companyReg,
      buyerPhone: buyerType === 'company' ? companyPhone : customerPhone,
      branch,
      branchReg,
      items: orderItems,
      total: cartTotal,
      date: new Date(),
      receiptNumber: newNumber,
    })

    setCart([])
    setShowCart(false)
    setBranch('')
    setBranchReg('')
    setCustomerName('')
    setCustomerPhone('')
    setCompanyName('')
    setCompanyReg('')
    setCompanyPhone('')
    setSaving(false)
  }

  function handleCategoryClick(catNumber) {
    setCategoryFilter(catNumber)
    setSizeFilter(null)
    setTimeout(() => { document.getElementById('items-section')?.scrollIntoView({ behavior: 'smooth' }) }, 100)
  }

  const currentSizes = categoryFilter === 1 ? CEILING_SIZES : categoryFilter === 2 ? LIGHT_SIZES : null

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      {(role) => (
        <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

          {/* Top nav */}
          <div className="flex justify-between items-baseline px-6 py-4" style={{ borderBottom: '2px solid var(--accent)' }}>
            <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>
              Taaz.mn | БАРАА УДИРДЛАГА
            </h1>
            <div className="flex gap-3 items-center">
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} className="text-xs" style={{ color: 'var(--muted)' }}>Log Out</button>
              <Link href="/admin/orders" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Захиалга харах</Link>
              <Link href="/admin/bulk" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Бүтээгдэхүүн засах</Link>
              <Link href="/admin/dashboard" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Хянах самбар</Link>
              {role === 'admin' && (
                <Link href="/admin/companies" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Компаниуд</Link>
              )}
              <Link href="/admin/ledger" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Захиалгын түүх</Link>
              <Link href="/admin/import" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Импортлох</Link>
              <Link href="/admin/add" className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>+ Бүтээгдэхүүн нэмэх</Link>
            </div>
          </div>

          {/* Hero */}
          <section style={{ backgroundColor: '#111', color: '#fff', padding: '60px 48px', textAlign: 'center', borderBottom: '4px solid #e81c1c' }}>
            <p style={{ color: '#e81c1c', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Since 2012</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              Таны хүссэн хэв маягын<br /><span style={{ color: '#e81c1c' }}>Ханын хавтан & Тааз</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '32px' }}>Чанартай дотор засалын материал — тааз, ханын хавтан болон бусад бүтээгдэхүүн</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[{ number: '12+', label: 'Жилийн туршлага' }, { number: '3', label: 'Салбар дэлгүүр' }, { number: '1000+', label: 'Хэрэглэгч' }].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#e81c1c' }}>{stat.number}</div>
                  <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
              {[
                { name: 'Салбар 1', address: '100айл Прогресс төв Б1 давхарт', phone: '95589855' },
                { name: 'Салбар 2', address: '100айл ОДКОН ТӨВ-н хойд талаас тусдаа хаалгатай Б1 давхар', phone: '95026615' },
                { name: 'Салбар 3 — TOR PINTURAS', address: '100 айл 100 ресидэнс 1 давхарт', phone: '94569156' },
                { name: 'Агуулах', address: '100 айл 9-р дэлгүүрийн ард', phone: '99976884' },
              ].map((b) => (
                <div key={b.name} style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#1a1a1a', border: '2px solid #333', textAlign: 'left' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>📍</div>
                  <h3 style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', marginBottom: '6px' }}>{b.name}</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '8px' }}>{b.address}</p>
                  <a href={`tel:${b.phone}`} style={{ color: '#e81c1c', fontWeight: '700', fontSize: '0.95rem', textDecoration: 'none' }}>📞 {b.phone}</a>
                </div>
              ))}
            </div>
          </section>

          {/* Items Section */}
          <div id="items-section">
            <div className="px-6 py-3 sticky top-0 z-10" style={{ borderBottom: '0.5px solid var(--border)', background: 'var(--card)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <input type="text" placeholder="Хайх..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 rounded text-sm" style={{ background: 'var(--background)', border: '0.5px solid var(--border)', color: 'var(--foreground)', width: '300px' }} />
                <button onClick={() => { setCategoryFilter(null); setSizeFilter(null) }} className="px-4 py-2 rounded text-sm font-bold" style={{ background: !categoryFilter ? 'var(--accent)' : 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)' }}>Бүгд</button>
                {CATEGORIES.map((cat) => (
                  <button key={cat.number} onClick={() => handleCategoryClick(cat.number)} className="px-4 py-2 rounded text-sm font-bold" style={{ background: categoryFilter === cat.number ? 'var(--accent)' : 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)' }}>{cat.name}</button>
                ))}
              </div>
              {currentSizes && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {currentSizes.map((size) => (
                    <button key={size} onClick={() => setSizeFilter(size === sizeFilter ? null : size)} className="px-4 py-2 rounded text-sm font-bold" style={{ background: sizeFilter === size ? 'var(--accent)' : 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)' }}>{size}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}
              {items.length === 0 && <p style={{ color: 'var(--muted)' }}>No items yet.</p>}
              {filteredItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="rounded p-2 relative" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', opacity: item.quantity > 0 ? 1 : 0.6 }}>
                      <span className="absolute top-2 right-2 text-sm font-medium px-2 py-1 rounded" style={{ background: item.quantity > 0 ? 'var(--stock-bg)' : 'var(--soldout-bg)', color: item.quantity > 0 ? 'var(--stock-text)' : 'var(--soldout-text)', transform: item.quantity > 0 ? 'none' : 'rotate(-4deg)' }}>
                        {item.quantity > 0 ? 'Бэлэн бараа' : 'Дууссан'}
                      </span>
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover rounded mb-2" />}
                      {item.category_name && <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{item.category_number}. {item.category_name}</p>}
                      <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{item.name}</h2>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                        {item.unit_type === 'м.кв' ? `1м² = ${item.price.toLocaleString()} MNT` : `1ш = ${item.price.toLocaleString()} MNT`} · {item.quantity}{item.unit_type === 'м.кв' ? 'м²' : 'ш'} үлдэгдэл
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <Link href={`/admin/edit/${item.id}`} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Edit</Link>
                        {item.quantity > 0 && (
                          <button onClick={() => addToCart(item)} className="text-xs px-2 py-1 rounded font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>+ Нэмэх</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Floating Cart Button */}
          {cart.length > 0 && !showCart && (
            <button onClick={() => setShowCart(true)} style={{ position: 'fixed', bottom: '32px', right: '32px', background: 'var(--accent)', color: '#fff', padding: '16px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 999, border: 'none', cursor: 'pointer' }}>
              🛒 Сагс ({cart.length}) — {cartTotal.toLocaleString()} MNT
            </button>
          )}

          {/* Cart Sidebar */}
          {showCart && (
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'var(--background)', borderLeft: '2px solid var(--accent)', zIndex: 1000, overflowY: 'auto', padding: '24px', boxShadow: '-4px 0 20px rgba(0,0,0,0.2)' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>🛒 Сагс</h2>
                <button onClick={() => setShowCart(false)} style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>✕</button>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="rounded p-3" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                    <div className="flex items-center gap-2">
                      <input type="number" min="0.01" step="0.01" value={item.qty} onChange={(e) => setCart((prev) => prev.map((i) => i.id === item.id ? { ...i, qty: e.target.value === '' ? '' : Number(e.target.value) } : i))} onBlur={(e) => { if (!e.target.value || Number(e.target.value) < 0.01) updateQty(item.id, 1) }} className="p-1 rounded text-sm w-16" style={{ background: 'var(--background)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.unit_type === 'м.кв' ? 'м²' : 'ш'} x {item.price.toLocaleString()} = {(item.price * item.qty).toLocaleString()} MNT</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs ml-auto" style={{ color: 'var(--soldout-text)' }}>x</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold mb-4" style={{ color: 'var(--foreground)' }}>Нийт: <span style={{ color: 'var(--accent)' }}>{cartTotal.toLocaleString()} MNT</span></p>
              <div className="mb-4">
                <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Борлуулсан салбар</label>
                <select value={branch} onChange={(e) => { setBranch(e.target.value); const sel = companies.find((c) => c.name === e.target.value); setBranchReg(sel?.registration_number || '') }} className="p-2 rounded text-sm w-full" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>
                  <option value="">Салбар сонгох...</option>
                  {companies.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setBuyerType('individual')} className="flex-1 py-2 rounded text-sm font-medium" style={{ background: buyerType === 'individual' ? 'var(--accent)' : 'var(--card)', color: buyerType === 'individual' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Хувь хүн</button>
                <button onClick={() => setBuyerType('company')} className="flex-1 py-2 rounded text-sm font-medium" style={{ background: buyerType === 'company' ? 'var(--accent)' : 'var(--card)', color: buyerType === 'company' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Компани</button>
              </div>
              {buyerType === 'individual' && (
                <div className="flex flex-col gap-2 mb-4">
                  <input type="text" placeholder="Худалдан авагчийн нэр" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="p-2 rounded text-sm" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }} />
                  <input type="text" placeholder="Утасны дугаар" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="p-2 rounded text-sm" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              )}
              {buyerType === 'company' && (
                <div className="flex flex-col gap-2 mb-4">
                  <input type="text" placeholder="Компанийн нэр" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="p-2 rounded text-sm" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }} />
                  <input type="text" placeholder="Регистрийн дугаар" value={companyReg} onChange={(e) => setCompanyReg(e.target.value)} className="p-2 rounded text-sm" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }} />
                  <input type="text" placeholder="Утасны дугаар" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="p-2 rounded text-sm" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              )}
              <button onClick={handleSell} disabled={saving} className="w-full py-3 rounded text-sm font-bold disabled:opacity-50" style={{ background: 'var(--accent)', color: '#fff' }}>
                {saving ? 'Хадгалж байна...' : 'Худалдах & Баримт хэвлэх'}
              </button>
            </div>
          )}

          {/* Receipt Modal */}
          {receipt && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'white', padding: '32px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '8px' }}>
               <style>{`
                  @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body > * { display: none !important; }
                    #receipt-print { display: block !important; position: static !important; }
                  }
                  @media screen {
                    .print-only { display: none !important; }
                  }
                `}</style>

                <div className="no-print flex gap-3 mb-4">
                  <button onClick={() => window.print()} className="px-6 py-2 rounded text-sm font-medium" style={{ background: '#111', color: '#fff' }}>Хэвлэх</button>
                  <button onClick={() => setReceipt(null)} className="px-6 py-2 rounded text-sm font-medium" style={{ background: '#eee', color: '#111' }}>Хаах</button>
                </div>
                <div id="receipt-print" style={{ fontFamily: 'Arial, sans-serif', color: 'black', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                    <span>НХМаягт БМ-3</span>
                    <span style={{ textAlign: 'right' }}>Сангийн сайдын 2017 оны 12 дугаар сарын<br />5-ны өдрийн 347 тоот тушаалын хавсралт</span>
                  </div>
                 <h2 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', margin: '8px 0', letterSpacing: '1px' }}>ЗАРЛАГЫН БАРИМТ №{receipt.receiptNumber}</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                    <div style={{ width: '45%' }}>
                      <input className="no-print" value={receipt.branch} onChange={(e) => setReceipt({...receipt, branch: e.target.value})} style={{ borderBottom: '1px solid black', marginBottom: '2px', width: '100%', border: 'none', borderBottom: '1px solid black', outline: 'none', fontSize: '0.8rem' }} />
                      <div style={{ fontSize: '0.7rem', marginBottom: '8px' }}>(байгууллагын нэр)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Регистрийн №</span>
                        <input className="no-print" value={receipt.branchReg || ''} onChange={(e) => setReceipt({...receipt, branchReg: e.target.value})} style={{ width: '80px', border: 'none', borderBottom: '1px solid black', outline: 'none', fontSize: '0.8rem' }} />
                        <div className="print-only" style={{ display: 'none' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {(receipt.branchReg || '       ').toString().padEnd(7).split('').slice(0, 7).map((d, i) => (
                              <div key={i} style={{ width: '18px', height: '20px', border: '1px solid black', textAlign: 'center', lineHeight: '20px', fontSize: '0.75rem' }}>{d.trim()}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: '45%' }}>
                      <input className="no-print" value={receipt.buyerName} onChange={(e) => setReceipt({...receipt, buyerName: e.target.value})} style={{ borderBottom: '1px solid black', marginBottom: '2px', width: '100%', border: 'none', borderBottom: '1px solid black', outline: 'none', fontSize: '0.8rem' }} />
                      <div style={{ fontSize: '0.7rem', marginBottom: '8px' }}>(худалдан авагчийн нэр)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Регистрийн №</span>
                        <input className="no-print" value={receipt.buyerReg || ''} onChange={(e) => setReceipt({...receipt, buyerReg: e.target.value})} style={{ width: '80px', border: 'none', borderBottom: '1px solid black', outline: 'none', fontSize: '0.8rem' }} />
                        <div className="print-only" style={{ display: 'none' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {(receipt.buyerReg || '       ').toString().padEnd(7).split('').slice(0, 7).map((d, i) => (
                              <div key={i} style={{ width: '18px', height: '20px', border: '1px solid black', textAlign: 'center', lineHeight: '20px', fontSize: '0.75rem' }}>{d.trim()}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: '0.8rem' }}>
                    <span>20{String(receipt.date.getFullYear()).slice(2)} оны <u>{receipt.date.getMonth() + 1}</u> сарын <u>{receipt.date.getDate()}</u> өдөр</span>
                    <span>(тээвэрлэгчийн хаяг, албан тушаал, нэр)</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: '8px' }}>
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ border: '1px solid black', padding: '3px', textAlign: 'center', width: '25px' }}>№</th>
                        <th rowSpan={2} style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>Материалын үнэт зүйлийн нэр, зэрэг, дугаар</th>
                        <th rowSpan={2} style={{ border: '1px solid black', padding: '3px', textAlign: 'center', width: '30px' }}>Код</th>
                        <th rowSpan={2} style={{ border: '1px solid black', padding: '3px', textAlign: 'center', width: '40px' }}>Хэм-жих нэгж</th>
                        <th colSpan={3} style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>Худалдах</th>
                      </tr>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '3px', textAlign: 'center', width: '35px' }}>Тоо</th>
                        <th style={{ border: '1px solid black', padding: '3px', textAlign: 'center', width: '65px' }}>Нэгжийн үнэ</th>
                        <th style={{ border: '1px solid black', padding: '3px', textAlign: 'center', width: '65px' }}>Нийт дүн</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{i + 1}</td>
                          <td style={{ border: '1px solid black', padding: '3px' }}>{item.name}</td>
                          <td style={{ border: '1px solid black', padding: '3px' }}></td>
                          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{item.unit_type || 'ш'}</td>
                          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>
                            <input value={item.qty} onChange={(e) => setReceipt({...receipt, items: receipt.items.map((it, idx) => idx === i ? {...it, qty: e.target.value} : it)})} style={{ width: '40px', border: 'none', outline: 'none', textAlign: 'center', fontSize: '0.75rem' }} />
                          </td>
                          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'right' }}>
                            <input value={item.price} onChange={(e) => setReceipt({...receipt, items: receipt.items.map((it, idx) => idx === i ? {...it, price: e.target.value} : it)})} style={{ width: '60px', border: 'none', outline: 'none', textAlign: 'right', fontSize: '0.75rem' }} />
                          </td>
                          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'right' }}>{(item.price * item.qty).toLocaleString()}</td>
                        </tr>
                      ))}
                     {[...Array(Math.max(0, 16 - receipt.items.length))].map((_, i) => (
                        <tr key={`e-${i}`}>
                          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{receipt.items.length + i + 1}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}></td>
                          <td style={{ border: '1px solid black', padding: '8px' }}></td>
                          <td style={{ border: '1px solid black', padding: '8px' }}></td>
                          <td style={{ border: '1px solid black', padding: '8px' }}></td>
                          <td style={{ border: '1px solid black', padding: '8px' }}></td>
                          <td style={{ border: '1px solid black', padding: '8px' }}></td>
                        </tr>
                      ))}
                     
                        {(() => {
                        const sqmItems = receipt.items.filter(item => item.unit_type === 'м.кв')
                        let totalSquare = 0, totalT = 0, totalL = 0, totalX = 0
                        sqmItems.forEach(item => {
                          const qty = Number(item.qty)
                          const name = item.name.toLowerCase()
                          let square = 0, t = 0, l = 0, x = 0
                          if (name.includes('30x30') || name.includes('30х30')) {
                            square = Math.ceil(qty / 0.09); t = Math.ceil(qty); l = 0; x = t * 3
                          } else if (name.includes('30x60') || name.includes('30х60')) {
                            square = Math.ceil(qty / 0.18); t = Math.ceil(qty * 0.54); l = Math.ceil(qty * 0.2); x = t * 3
                          } else if (name.includes('60x60') || name.includes('60х60')) {
                            square = Math.ceil(qty / 0.36); t = Math.ceil(qty * 0.54); l = Math.ceil(qty * 0.2); x = t * 3
                          }
                          totalSquare += square; totalT += t; totalL += l; totalX += x
                        })
                      
                        const startRow = Math.max(receipt.items.length, 16) + 1
                        return (
                          <>
                            {[
                              { symbol: '\u25A1', qty: totalSquare },
                              { symbol: 'T', qty: totalT },
                              { symbol: 'L', qty: totalL },
                              { symbol: 'X', qty: totalX },
                            ].map((row, i) => (
                              <tr key={`sqm-${i}`}>
                                <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{startRow + i}</td>
                                <td style={{ border: '1px solid black', padding: '3px', fontWeight: 'bold' }}>{row.symbol}-{row.qty}ш</td>
                                <td style={{ border: '1px solid black', padding: '3px' }}></td>
                                <td style={{ border: '1px solid black', padding: '3px' }}></td>
                                <td style={{ border: '1px solid black', padding: '3px' }}></td>
                                <td style={{ border: '1px solid black', padding: '3px' }}></td>
                                <td style={{ border: '1px solid black', padding: '3px' }}></td>
                              </tr>
                            ))}
                          </>
                        )
                      })()}
                     <tr>
                        <td colSpan={6} style={{ border: '1px solid black', padding: '3px', textAlign: 'center', fontWeight: 'bold' }}>Дүн</td>
                        <td style={{ border: '1px solid black', padding: '3px', textAlign: 'right', fontWeight: 'bold' }}>{receipt.total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: '32px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Тэмдэг</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '220px' }}>Хүлээлгэн өгсөн эд хариуцагч:</span>
                          <span style={{ flex: 1, borderBottom: '1px dotted black', marginLeft: '8px' }}>&nbsp;</span>
                          <span style={{ margin: '0 4px' }}>/</span>
                          <span style={{ width: '80px', borderBottom: '1px dotted black' }}>&nbsp;</span>
                          <span>/</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '220px' }}>Хүлээн авагч:</span>
                          <span style={{ flex: 1, borderBottom: '1px dotted black', marginLeft: '8px' }}>&nbsp;</span>
                          <span style={{ margin: '0 4px' }}>/</span>
                          <span style={{ width: '80px', borderBottom: '1px dotted black' }}>&nbsp;</span>
                          <span>/</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ whiteSpace: 'nowrap', minWidth: '220px' }}>Шалгасан нягтлан бодогч:</span>
                          <span style={{ flex: 1, borderBottom: '1px dotted black', marginLeft: '8px' }}>&nbsp;</span>
                          <span style={{ margin: '0 4px' }}>/</span>
                          <span style={{ width: '80px', borderBottom: '1px dotted black' }}>&nbsp;</span>
                          <span>/</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </RequireAuth>
  )
}
