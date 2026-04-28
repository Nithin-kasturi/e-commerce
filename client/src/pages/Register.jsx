import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to LuxeShop.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingTop: '100px' }}>
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(200,169,110,0.03) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, color: '#0a0a0a' }}>✦</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700 }}>
              Luxe<span style={{ color: 'var(--accent)' }}>Shop</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 32, marginBottom: 10 }}>Create account</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Join LuxeShop for exclusive access to curated products</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" className="form-input" required autoComplete="name" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="form-input" required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" className="form-input" required autoComplete="new-password" />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat your password" className="form-input" required />
              {form.confirm && form.password !== form.confirm && (
                <span style={{ fontSize: 12, color: 'var(--red)' }}>Passwords don't match</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
