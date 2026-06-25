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

  function handleCategoryClick(catNumber) {
    setCategoryFilter(catNumber)
    setSizeFilter(null)
    setTimeout(() => {
      document.getElementById('items-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
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
              <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
                className="text-xs" style={{ color: 'var(--muted)' }}
              >
                Log Out
              </button>
              <Link href="/admin/orders" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Захиалга харах</Link>
              <Link href="/admin/bulk" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Бүтээгдэхүүн засах</Link>
              <Link href="/admin/dashboard" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Хянах самбар</Link>
              {role === 'admin' && (
                <Link href="/admin/companies" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Компаниуд</Link>
              )}
              <Link href="/admin/log-sale" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Борлуулалт бүртгэх</Link>
              <Link href="/admin/ledger" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Захиалгын түүх</Link>
              <Link href="/admin/import" className="px-4 py-2 rounded text-sm font-medium" style={{ border: '0.5px solid var(--border)', color: 'var(--foreground)' }}>Импортлох</Link>
              <Link href="/admin/add" className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>+ Бүтээгдэхүүн нэмэх</Link>
            </div>
          </div>

          {/* Hero */}
          <section style={{ backgroundColor: '#111', color: '#fff', padding: '60px 48px', textAlign: 'center', borderBottom: '4px solid #e81c1c' }}>
            <p style={{ color: '#e81c1c', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Since 2012
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              Таны хүссэн хэв маягын<br />
              <span style={{ color: '#e81c1c' }}>Ханын хавтан & Тааз</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '32px' }}>
              Чанартай дотор засалын материал — тааз, ханын хавтан болон бусад бүтээгдэхүүн
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[
                { number: '12+', label: 'Жилийн туршлага' },
                { number: '3', label: 'Салбар дэлгүүр' },
                { number: '1000+', label: 'Хэрэглэгч' },
              ].map((stat) => (
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
              ].map((branch) => (
                <div key={branch.name} style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#1a1a1a', border: '2px solid #333', textAlign: 'left' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>📍</div>
                  <h3 style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', marginBottom: '6px' }}>{branch.name}</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '8px' }}>{branch.address}</p>
                  <a href={`tel:${branch.phone}`} style={{ color: '#e81c1c', fontWeight: '700', fontSize: '0.95rem', textDecoration: 'none' }}>
                    📞 {branch.phone}
                  </a>
                </div>
              ))}
            </div>
          </section>

         

          {/* Items Section */}
          <div id="items-section">
            {/* Search + size filters */}
            <div className="px-6 py-3 sticky top-0 z-10" style={{ borderBottom: '0.5px solid var(--border)', background: 'var(--card)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Хайх..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-2 rounded text-sm"
                  style={{ background: 'var(--background)', border: '0.5px solid var(--border)', color: 'var(--foreground)', width: '300px' }}
                />
                <button
                  onClick={() => { setCategoryFilter(null); setSizeFilter(null) }}
                  className="px-4 py-2 rounded text-sm font-bold"
                  style={{ background: !categoryFilter ? 'var(--accent)' : 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)' }}
                >
                  Бүгд
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.number}
                    onClick={() => handleCategoryClick(cat.number)}
                    className="px-4 py-2 rounded text-sm font-bold"
                    style={{ background: categoryFilter === cat.number ? 'var(--accent)' : 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)' }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {currentSizes && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {currentSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSizeFilter(size === sizeFilter ? null : size)}
                      className="px-4 py-2 rounded text-sm font-bold"
                      style={{ background: sizeFilter === size ? 'var(--accent)' : 'var(--foreground)', color: 'var(--background)', border: '0.5px solid var(--border)' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items grid */}
            <div className="p-6">
              {error && <p style={{ color: 'var(--soldout-text)' }}>Error: {error.message}</p>}
              {items.length === 0 && <p style={{ color: 'var(--muted)' }}>No items yet. Time to add some!</p>}
              {filteredItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="rounded p-2 relative" style={{ background: 'var(--card)', border: '0.5px solid var(--border)', opacity: item.quantity > 0 ? 1 : 0.6 }}>
                      <span className="absolute top-2 right-2 text-sm font-medium px-2 py-1 rounded" style={{
                        background: item.quantity > 0 ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                        color: item.quantity > 0 ? 'var(--stock-text)' : 'var(--soldout-text)',
                        transform: item.quantity > 0 ? 'none' : 'rotate(-4deg)',
                      }}>
                        {item.quantity > 0 ? 'Бэлэн бараа' : 'Дууссан'}
                      </span>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover rounded mb-2" />
                      )}
                      {item.category_name && (
                        <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{item.category_number}. {item.category_name}</p>
                      )}
                      <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{item.name}</h2>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{item.unit_type === 'м.кв' ? `1м² = ${item.price.toLocaleString()} MNT` : `1ш = ${item.price.toLocaleString()} MNT`} · {item.quantity}{item.unit_type === 'м.кв' ? 'м²' : 'ш'} үлдэгдэл
                        
                      </p>
                      <div className="flex justify-between items-center">
                        <Link href={`/admin/edit/${item.id}`} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </RequireAuth>
  )
}
