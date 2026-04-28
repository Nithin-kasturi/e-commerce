import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 72, gap: 32 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)',
            borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 18, color: '#0a0a0a' }}>✦</span>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Luxe<span style={{ color: 'var(--accent)' }}>Shop</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          {menuOpen && (
            <button onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: 'var(--text)', fontSize: 24 }}>✕</button>
          )}
          <NavLink to="/" label="Home" />
          <NavLink to="/dashboard" label="Shop" />
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', padding: 10, borderRadius: 4, transition: 'background 0.2s', color: 'var(--text-2)' }}
            className="icon-btn">
            <CartIcon />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                background: 'var(--accent)', color: '#0a0a0a',
                width: 18, height: 18, borderRadius: '50%',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{totalItems > 9 ? '9+' : totalItems}</span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 4, padding: '8px 14px', color: 'var(--text)',
                  fontSize: 14, transition: 'all 0.2s',
                }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#0a0a0a',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>▾</span>
              </button>

              {dropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, minWidth: 180, overflow: 'hidden',
                  boxShadow: 'var(--shadow)', zIndex: 200,
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{user.email}</div>
                  </div>
                  <DropItem to="/myorders" label="My Orders" />
                  {user.role === 'admin' && <DropItem to="/dashboard" label="Admin Panel" />}
                  <button onClick={handleLogout} style={{
                    display: 'block', width: '100%', padding: '10px 16px',
                    background: 'none', border: 'none', color: 'var(--red)',
                    textAlign: 'left', fontSize: 14, cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22, padding: 8 }}
            className="mobile-menu-btn">☰</button>
        </div>
      </div>

      <style>{`
        .icon-btn:hover { background: var(--surface) !important; color: var(--text) !important; }
        @media (max-width: 768px) { .mobile-menu-btn { display: block !important; } }
      `}</style>
    </header>
  );
};

const NavLink = ({ to, label }) => (
  <Link to={to} style={{ padding: '8px 14px', borderRadius: 4, fontSize: 14, color: 'var(--text-2)', transition: 'color 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}>
    {label}
  </Link>
);

const DropItem = ({ to, label }) => (
  <Link to={to} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--text)', transition: 'background 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
    {label}
  </Link>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

export default Header;
