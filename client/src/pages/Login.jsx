import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError(''); // Clear inline error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingTop: '100px' }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, color: '#0a0a0a' }}>✦</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700 }}>
              Luxe<span style={{ color: 'var(--accent)' }}>Shop</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 32, marginBottom: 10 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Sign in to your account to continue</p>
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: 36 }}>

          {/* Inline error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'rgba(224,85,85,0.08)',
              border: '1px solid rgba(224,85,85,0.3)',
              borderRadius: 6, padding: '12px 14px',
              marginBottom: 20,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
              <p style={{ fontSize: 13, color: 'var(--red)', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
                required
                autoComplete="email"
                style={{ borderColor: error ? 'rgba(224,85,85,0.5)' : '' }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <Link to="/" style={{ fontSize: 12, color: 'var(--accent)' }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
                autoComplete="current-password"
                style={{ borderColor: error ? 'rgba(224,85,85,0.5)' : '' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          {/* Demo credentials */}
          <div style={{ background: 'var(--bg-3)', borderRadius: 6, padding: 16, marginBottom: 20, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Email: <span style={{ color: 'var(--accent)', userSelect: 'all' }}>demo@luxeshop.com</span>
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Password: <span style={{ color: 'var(--accent)', userSelect: 'all' }}>demo123</span>
            </p>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;