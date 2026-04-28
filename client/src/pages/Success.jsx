import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      api.get(`/orders/${orderId}`).then(res => setOrder(res.data)).catch(() => {});
    }
  }, [orderId]);

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80, minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        {/* Success animation */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(76,175,125,0.12)',
            border: '2px solid var(--green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'scaleIn 0.4s ease',
          }}>
            <span style={{ fontSize: 48 }}>✓</span>
          </div>
          <h1 style={{ fontSize: 40, marginBottom: 12 }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 16, lineHeight: 1.7 }}>
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        {/* Order details */}
        {order && (
          <div className="card" style={{ padding: 32, textAlign: 'left', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 4 }}>Order Confirmation</h3>
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>#{order._id?.slice(-8).toUpperCase()}</p>
              </div>
              <span className="badge badge-green">✓ Paid</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {order.items?.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-2)' }}>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Ship To</p>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{order.shippingAddress?.fullName}</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Total Charged</p>
                <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}>
                  ${order.totalPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* What's next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '📧', title: 'Confirmation Email', desc: 'Sent to your inbox' },
            { icon: '📦', title: 'Preparing Order', desc: '1–2 business days' },
            { icon: '🚚', title: 'Delivery', desc: '3–5 business days' },
          ].map(s => (
            <div key={s.title} style={{ padding: '20px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-primary btn-lg">Continue Shopping</Link>
          <Link to="/dashboard" className="btn btn-outline btn-lg">View Orders</Link>
        </div>
      </div>

      <style>{`@keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

export default Success;
