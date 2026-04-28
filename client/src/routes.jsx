import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';

// Lazy home page inline
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './services/api';
import ProductCard from './components/ProductCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true&limit=4')
      .then(r => setFeatured(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(200,169,110,0.07) 0%, transparent 60%)',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(200,169,110,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div className="container" style={{ paddingTop: 100, position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <p className="section-label" style={{ marginBottom: 20 }}>Premium E-Commerce Experience</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 7vw, 96px)', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Curated for the <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>discerning</em> buyer.
            </h1>
            <p className="hero-subtitle" style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
              Discover handpicked products across electronics, fashion, home, and sports. Quality you can trust, delivered fast.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg">Shop Collection →</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Create Account</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, marginTop: 64 }}>
              {[['500+', 'Products'], ['50K+', 'Happy Customers'], ['4.8★', 'Avg. Rating']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative orb */}
        <div style={{
          position: 'absolute', right: '-5%', top: '10%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: '↩', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '🔒', title: 'Secure Checkout', desc: '256-bit SSL encrypted' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Curated products only' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{f.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <p className="section-label">Hand Picked</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>Featured Products</h2>
            </div>
            <Link to="/dashboard" className="btn btn-outline">View All →</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-2)' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              Loading...
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ margin: '0 auto 16px' }}>Join The Community</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.2 }}>
            Start your premium shopping journey today
          </h2>
          <p style={{ color: 'var(--text-2)', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Create a free account and get access to exclusive deals, early releases, and personalized recommendations.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started — It's Free</Link>
        </div>
      </section>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
    <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
    <Route path="*" element={
      <div className="empty-state" style={{ paddingTop: 150 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>404</div>
        <h3>Page Not Found</h3>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Go Home</Link>
      </div>
    } />
  </Routes>
);

export default AppRoutes;
