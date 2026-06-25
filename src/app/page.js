'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1a1a1a', backgroundColor: '#fff' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 48px',
        backgroundColor: '#111',
        borderBottom: '3px solid #e81c1c',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link href="/">
          <img src="/logo.jpg" alt="Taaz.mn" style={{ height: '160px', objectFit: 'contain', cursor: 'pointer' }} />
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'Нүүр', href: '/' },
            { label: 'Бараа', href: '/products' },
            { label: 'Бидний тухай', href: '/about' },
            { label: 'Холбоо барих', href: '/contact' },
            { label: 'Админ', href: '/admin' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              padding: '8px 0',
              borderBottom: '2px solid transparent',
            }}
              onMouseEnter={e => e.target.style.borderBottomColor = '#e81c1c'}
              onMouseLeave={e => e.target.style.borderBottomColor = 'transparent'}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        backgroundColor: '#111',
        color: '#fff',
        padding: '100px 48px',
        textAlign: 'center',
        borderBottom: '4px solid #e81c1c'
      }}>
        <p style={{ color: '#e81c1c', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Since 2012
        </p>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px' }}>
          Таны хүссэн хэв маягын<br />
          <span style={{ color: '#e81c1c' }}>Ханын хавтан & Тааз</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#aaa', maxWidth: '560px', margin: '0 auto 40px' }}>
          Чанартай дотор засалын материал — тааз, ханын хавтан болон бусад бүтээгдэхүүн
        </p>
        <Link href="/products" style={{
          backgroundColor: '#e81c1c', color: '#fff', padding: '14px 40px',
          borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', display: 'inline-block'
        }}>
          Бараа үзэх →
        </Link>
      </section>

      {/* Stats */}
      <section style={{
        backgroundColor: '#e81c1c', padding: '28px 48px',
        display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap'
      }}>
        {[
          { number: '12+', label: 'Жилийн туршлага' },
          { number: '3', label: 'Салбар дэлгүүр' },
          { number: '1000+', label: 'Хэрэглэгч' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stat.number}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Branches */}
      <section style={{ padding: '80px 48px', backgroundColor: '#fff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: '#111' }}>
          Салбарууд
        </h2>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', margin: '0 auto 48px' }} />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px', maxWidth: '1100px', margin: '0 auto'
        }}>
          {[
            { name: 'Салбар 1', address: '100айл Прогресс төв Б1 давхарт', phone: '95589855' },
            { name: 'Салбар 2', address: '100айл ОДКОН ТӨВ-н хойд талаас тусдаа хаалгатай Б1 давхар', phone: '95026615' },
            { name: 'Салбар 3 — TOR PINTURAS', address: '100 айл 100 ресидэнс 1 давхарт', phone: '94569156' },
            { name: 'Агуулах', address: '100 айл 9-р дэлгүүрийн ард', phone: '99976884' },
          ].map((branch) => (
            <div key={branch.name} style={{
              padding: '28px 24px', borderRadius: '10px', backgroundColor: '#f9f9f9',
              border: '2px solid #eee', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e81c1c'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>📍</div>
              <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#111', marginBottom: '8px' }}>{branch.name}</h3>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '12px' }}>{branch.address}</p>
              <a href={`tel:${branch.phone}`} style={{ color: '#e81c1c', fontWeight: '700', fontSize: '1rem', textDecoration: 'none' }}>
                📞 {branch.phone}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Product Categories */}
      <section style={{ padding: '80px 48px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: '#111' }}>
          Бүтээгдэхүүний ангилал
        </h2>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', margin: '0 auto 48px' }} />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px', maxWidth: '1100px', margin: '0 auto'
        }}>
          {[
            { name: 'Ханын панел хавтан', icon: '🏠', cat: 3 },
            { name: 'Хулсан хавтан', icon: '🎋', cat: 4 },
            { name: 'Ханын гоёлын рейк', icon: '✨', cat: 5 },
            { name: 'Сараалжин тааз', icon: '🔲', cat: 10 },
            { name: 'Хөнгөн цагаан тааз', icon: '⬜', cat: 1 },
            { name: 'Гипсэн тааз', icon: '🏛️', cat: 9 },
            { name: 'Таазны рейк', icon: '📐', cat: 6 },
            { name: 'Бусад бараа', icon: '⬛', cat: 13 },
            { name: 'Гадна фасад', icon: '🏗️', cat: 14 },
          ].map((item) => (
            <Link key={item.name} href={`/products?category=${item.cat}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '28px 20px', borderRadius: '10px', backgroundColor: '#fff',
                border: '2px solid #eee', textAlign: 'center', fontWeight: '600',
                fontSize: '0.95rem', color: '#111', cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e81c1c'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                {item.name}
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/products" style={{
            backgroundColor: '#111', color: '#fff', padding: '14px 40px',
            borderRadius: '6px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', display: 'inline-block'
          }}>
            Бүх бараа үзэх →
          </Link>
        </div>
      </section>

     

      {/* Footer */}
      <footer style={{
        padding: '32px 48px', textAlign: 'center', backgroundColor: '#111',
        borderTop: '3px solid #e81c1c', color: '#888', fontSize: '0.9rem'
      }}>
        © 2026 Taaz.mn. Бүх эрх хуулиар хамгаалагдсан.
      </footer>

    </main>
  );
}
