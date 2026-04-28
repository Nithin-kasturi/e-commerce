import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', postalCode: '', country: '' });
  const [payment, setPayment] = useState('stripe');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  const items = cart?.items || [];
  const shippingFee = totalPrice > 100 ? 0 : 10;
  const tax = (totalPrice * 0.15).toFixed(2);
  const grandTotal = (totalPrice + shippingFee + parseFloat(tax)).toFixed(2);

  const handleShipping = (e) => {
    e.preventDefault();
    const { fullName, address, city, postalCode, country } = shipping;
    if (!fullName || !address || !city || !postalCode || !country) return toast.error('Please fill all shipping fields');
    setStep(1);
  };

  const handlePayment = (e) => { e.preventDefault(); setStep(2); };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await api.post('/orders', { shippingAddress: shipping, paymentMethod: payment });
      // Simulate payment success for demo
      await api.put(`/orders/${res.data._id}/pay`, {
        id: 'DEMO_' + Date.now(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/success?orderId=${res.data._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally { setLoading(false); }
  };

  if (items.length === 0) return (
    <div style={{ paddingTop: 150, textAlign: 'center' }}>
      <h2 style={{ marginBottom: 16 }}>No items to checkout</h2>
      <Link to="/dashboard" className="btn btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <p className="section-label">Almost There</p>
          <h1 style={{ fontSize: 40, marginBottom: 32 }}>Checkout</h1>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, maxWidth: 400 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: i <= step ? 'var(--accent)' : 'var(--surface)',
                    border: `2px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: i <= step ? '#0a0a0a' : 'var(--text-3)',
                    cursor: i < step ? 'pointer' : 'default',
                    transition: 'all 0.3s',
                  }} onClick={() => i < step && setStep(i)}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: i === step ? 'var(--accent)' : 'var(--text-3)', fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? 'var(--accent)' : 'var(--border)', margin: '0 8px', marginBottom: 24, transition: 'background 0.3s' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* Step content */}
          <div className="card" style={{ padding: 36 }}>
            {/* Step 0: Shipping */}
            {step === 0 && (
              <form onSubmit={handleShipping}>
                <h2 style={{ fontSize: 24, marginBottom: 28 }}>Shipping Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={shipping.fullName} onChange={e => setShipping(s => ({ ...s, fullName: e.target.value }))} placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input className="form-input" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} placeholder="123 Main Street" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} placeholder="New York" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input className="form-input" value={shipping.postalCode} onChange={e => setShipping(s => ({ ...s, postalCode: e.target.value }))} placeholder="10001" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select className="form-input" value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} required>
                      <option value="">Select country</option>
                      {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Japan', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 28, width: '100%' }}>Continue to Payment →</button>
              </form>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <form onSubmit={handlePayment}>
                <h2 style={{ fontSize: 24, marginBottom: 28 }}>Payment Method</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {[{ id: 'stripe', label: 'Credit / Debit Card', icon: '💳' }, { id: 'paypal', label: 'PayPal', icon: '🅿' }].map(m => (
                    <label key={m.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                      border: `2px solid ${payment === m.id ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                      background: payment === m.id ? 'rgba(200,169,110,0.06)' : 'transparent',
                    }}>
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} style={{ display: 'none' }} />
                      <span style={{ fontSize: 24 }}>{m.icon}</span>
                      <span style={{ fontWeight: 500, color: payment === m.id ? 'var(--accent)' : 'var(--text)' }}>{m.label}</span>
                      {payment === m.id && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>✓</span>}
                    </label>
                  ))}
                </div>

                {payment === 'stripe' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20, padding: 20, background: 'var(--bg-3)', borderRadius: 8 }}>
                    <p style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 4 }}>🔒 Demo mode — no real charges</p>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" type='number' required value={cardDetails.number} maxLength={12} minLength={12} onChange={e => setCardDetails(c => ({ ...c, number: e.target.value }))} placeholder="4242 4242 4242 4242" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">Expiry</label>
                        <input className="form-input" required type='date' maxLength={4} value={cardDetails.expiry} onChange={e => setCardDetails(c => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input" required type='number' maxLength={3} value={cardDetails.cvv} onChange={e => setCardDetails(c => ({ ...c, cvv: e.target.value }))} placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Review Order →</button>
              </form>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 28 }}>Review Your Order</h2>

                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Shipping To</h4>
                  <div style={{ padding: '14px 16px', background: 'var(--bg-3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 600 }}>{shipping.fullName}</p>
                    <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>{shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}</p>
                  </div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Items</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map(item => (
                      <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                        <span style={{ color: 'var(--text-2)' }}>{item.name} × {item.qty}</span>
                        <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Placing Order...</> : '✓ Place Order'}
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 16, marginBottom: 20, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 12 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} onError={e => e.target.src='https://via.placeholder.com/48/1a1a1a/666'} />
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: 'var(--accent)', borderRadius: '50%', fontSize: 10, fontWeight: 700, color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.qty}</span>
                  </div>
                  <span style={{ fontSize: 13, flex: 1, color: 'var(--text-2)' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Subtotal', `$${totalPrice.toFixed(2)}`], ['Shipping', shippingFee === 0 ? 'Free' : `$${shippingFee}`], ['Tax', `$${tax}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)' }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div className="divider" style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontFamily: 'Fraunces, serif' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)', fontSize: 20 }}>${grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
