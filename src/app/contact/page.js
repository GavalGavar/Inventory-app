'use client';
import Link from 'next/link';
import Image from 'next/image';


export default function Contact() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
          Холбоо барих
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Бидэнтэй холбогдоорой</p>
      </section>

      {/* Contact Info */}
      <section style={{ padding: '80px 48px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#111' }}>Салбарууд</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', marginBottom: '40px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Салбар 1', address: '100айл Прогресс төв Б1 давхарт', phone: '95589855' },
              { name: 'Салбар 2', address: '100айл ОДКОН ТӨВ-н хойд талаас тусдаа хаалгатай Б1 давхар', phone: '95026615' },
              { name: 'Салбар 3 — TOR PINTURAS', address: '100 айл 100 ресидэнс 1 давхарт', phone: '94569156' },
              { name: 'Агуулах', address: '100 айл 9-р дэлгүүрийн ард', phone: '99976884' },
            ].map((branch) => (
              <div key={branch.name} style={{
                padding: '28px 24px', borderRadius: '10px', backgroundColor: '#f9f9f9',
                border: '2px solid #eee', transition: 'border-color 0.2s, transform 0.2s'
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

          {/* Social Media */}
          {/* Email */}
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#111', marginTop: '60px' }}>Имэйл</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', marginBottom: '40px' }} />
          <a href="mailto:Info@taaz.mn" style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '16px 24px', borderRadius: '10px', backgroundColor: '#f9f9f9',
            border: '2px solid #eee', textDecoration: 'none', color: '#111',
            fontWeight: '700', fontSize: '1rem', transition: 'border-color 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e81c1c'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
          >
            <span style={{ fontSize: '1.5rem' }}>✉️</span>
            Info@taaz.mn
          </a>
          
          {/* Other Contacts */}
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#111', marginTop: '60px' }}>Бусад холбоо барих</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', marginBottom: '40px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Маркетинг', phone: '99065520' },
              { label: 'Санхүү', phone: '88090856' },
              { label: 'Гэрээт борлуулалт', phone: '99110180' },
            ].map((contact) => (
              <div key={contact.label} style={{
                padding: '24px', borderRadius: '10px', backgroundColor: '#f9f9f9',
                border: '2px solid #eee', transition: 'border-color 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e81c1c'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>📞</div>
                <h3 style={{ fontWeight: '800', fontSize: '1rem', color: '#111', marginBottom: '8px' }}>{contact.label}</h3>
                <a href={`tel:${contact.phone}`} style={{ color: '#e81c1c', fontWeight: '700', fontSize: '1rem', textDecoration: 'none' }}>
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#111', marginTop: '60px' }}>Сошиал медиа</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#e81c1c', marginBottom: '40px' }} />
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100064250521344', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg', color: '#1877F2' },
              { name: 'Instagram', url: 'https://www.instagram.com/taazzmn/', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg', color: '#E1306C' },


            ].map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '16px 24px', borderRadius: '10px', backgroundColor: '#f9f9f9',
                border: '2px solid #eee', textDecoration: 'none', color: '#111',
                fontWeight: '700', fontSize: '1rem', transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#e81c1c'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: social.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img src={social.icon} alt={social.name} style={{ width: '20px', height: '20px', filter: 'invert(1)' }} />
                </div>

                {social.name}
              </a>
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
