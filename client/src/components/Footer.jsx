import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-2)',
    marginTop: 120,
    padding: '60px 0 32px',
  }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16, color: '#0a0a0a' }}>✦</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700 }}>
              Luxe<span style={{ color: 'var(--accent)' }}>Shop</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
            Curated products for the discerning buyer. Quality, authenticity, and service you can trust.
          </p>
        </div>

        <FooterCol title="Shop" links={[
          { label: 'All Products', to: '/dashboard' },
          { label: 'Electronics', to: '/dashboard?category=Electronics' },
          { label: 'Fashion', to: '/dashboard?category=Fashion' },
          { label: 'Sports', to: '/dashboard?category=Sports' },
        ]} />

        <FooterCol title="Account" links={[
          { label: 'My Orders', to: '/dashboard' },
          { label: 'Cart', to: '/cart' },
          { label: 'Sign In', to: '/login' },
          { label: 'Register', to: '/register' },
        ]} />

        <FooterCol title="Support" links={[
          { label: 'Contact Us', to: '/' },
          { label: 'FAQ', to: '/' },
          { label: 'Returns', to: '/' },
          { label: 'Shipping', to: '/' },
        ]} />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ color: 'var(--text-3)', fontSize: 13 }}>© {new Date().getFullYear()} LuxeShop. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Cookies'].map(l => (
            <Link key={l} to="/" style={{ color: 'var(--text-3)', fontSize: 13, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const FooterCol = ({ title, links }) => (
  <div>
    <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 16 }}>{title}</h4>
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {links.map(l => (
        <li key={l.label}>
          <Link to={l.to} style={{ color: 'var(--text-3)', fontSize: 14, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
