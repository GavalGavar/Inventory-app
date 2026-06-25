'use client';
import Link from 'next/link';

export default function About() {
  return (
    <main style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1a1a1a', backgroundColor: '#fff' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 48px', backgroundColor: '#111', borderBottom: '3px solid #e81c1c',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link href="/">
          <img src="/logo.jpg" alt="Taaz.mn" style={{ height: '160px', objectFit: 'contain', cursor: 'pointer' }} />
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'Нүүр', href: '/' },
            { label: 'Бүтээгдэхүүн', href: '/products' },
            { label: 'Бидний тухай', href: '/about' },
{ label: 'Холбоо барих', href: '/contact' },
            { label: 'Админ', href: '/admin' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '600',
              letterSpacing: '0.5px', padding: '8px 0', borderBottom: '2px solid transparent',
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
      <section style={{ backgroundColor: '#111', color: '#fff', padding: '80px 48px', textAlign: 'center', borderBottom: '4px solid #e81c1c' }}>
        <p style={{ color: '#e81c1c', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Since 2012
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
          Бидний тухай
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Taaz.mn — Гурван Сайхан Билэг ХХК</p>
      </section>

      {/* About Content */}
      <section style={{ padding: '80px 48px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', lineHeight: '1.9', fontSize: '1.05rem', color: '#333' }}>
          <p style={{ marginBottom: '24px' }}>
            Манай <strong>Гурван Сайхан Билэг ХХК</strong> нь 2012 оноос эхлэн дотор засалын материал,
            тэр дундаа бүх төрлийн тааз, ханын материалуудыг худалдан борлуулах чиглэлээр үйл ажиллагаагаа эхэлсэн.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Улмаар 2024 оноос <strong>"Тааз Эм Эн Групп"</strong> группыг үүсгэн байгуулж БНХАУ-д өөрийн нэрийн
            бараа бүтээгдэхүүнийг бий болгон чанар стандартыг дээд зэргээр чухалчлан үйлдвэрлэж
            хэрэглэгч, захиалагч нартаа хүргэж байна.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Одоогоор <strong>Улаанбаатар хотод 3 салбар дэлгүүртэй</strong> үйл ажиллагаагаа явуулж байна.
          </p>
          <p style={{ marginBottom: '48px' }}>
            Цаашдын хөгжлийн хүрээнд 2025 онд бид <strong>Испанийн алдарт TOR PINTURAS</strong> брэндийн
            дотор болон гадна эмульсийг Монголд албан ёсны эрхтэйгээр оруулан ирж, хэрэглэгчиддээ
            олон улсын чанарын бүтээгдэхүүнийг санал болгож байна.
          </p>

          {/* Branches */}
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#111' }}>Салбарууд</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', marginBottom: '32px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
             { name: 'Салбар 1', address: '100айл Прогресс төв Б1 давхарт', phone: '95589855', map: 'https://maps.app.goo.gl/wk1srjqk5Wj4L2jq6' },
{ name: 'Салбар 2', address: '100айл ОДКОН ТӨВ-н хойд талаас тусдаа хаалгатай Б1 давхар', phone: '95026615', map: 'https://maps.app.goo.gl/nF6GPgsp46FPwtXSA' },
{ name: 'Салбар 3 — TOR PINTURAS', address: '100 айл 100 ресидэнс 1 давхарт', phone: '94569156', map: 'https://maps.app.goo.gl/u2k5ukE6YaPKXNZt6' },
{ name: 'Агуулах', address: '100 айл 9-р дэлгүүрийн ард', phone: '99976884', map: 'https://maps.app.goo.gl/NScMVUwGMEXXwbfR6' },

            ].map((branch) => (
              <div key={branch.name} style={{
                padding: '24px', borderRadius: '10px', backgroundColor: '#f9f9f9',
                border: '2px solid #eee', transition: 'border-color 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e81c1c'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📍</div>
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: '#111', marginBottom: '6px' }}>{branch.name}</h3>
                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '10px' }}>{branch.address}</p>
               <a href={`tel:${branch.phone}`} style={{ color: '#e81c1c', fontWeight: '700', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
                  📞 {branch.phone}
                </a>
                <a href={branch.map} target="_blank" rel="noopener noreferrer" style={{ color: '#111', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>
                  🗺️ Google Maps
                </a>
                
              </div>
            ))}
          </div>
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
