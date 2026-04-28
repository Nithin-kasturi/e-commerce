import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const statusColors = {
  pending:    { bg: 'rgba(200,169,110,0.12)', color: 'var(--accent)',  label: '⏳ Pending' },
  processing: { bg: 'rgba(100,149,237,0.12)', color: '#6495ed',        label: '⚙️ Processing' },
  shipped:    { bg: 'rgba(76,175,125,0.12)',  color: 'var(--green)',   label: '🚚 Shipped' },
  delivered:  { bg: 'rgba(76,175,125,0.2)',   color: 'var(--green)',   label: '✓ Delivered' },
  cancelled:  { bg: 'rgba(224,85,85,0.12)',   color: 'var(--red)',     label: '✕ Cancelled' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loader" style={{ paddingTop: 100 }}>
      <div className="spinner" />
      <span style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8 }}>Loading your orders...</span>
    </div>
  );

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Link to="/myorders" style={{ color: 'var(--text-3)', fontSize: 13, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>Home</Link>
            <span style={{ color: 'var(--text-3)', fontSize: 13 }}>›</span>
            <span style={{ color: 'var(--text-2)', fontSize: 13 }}>My Orders</span>
          </div>
          <p className="section-label">Order History</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1 }}>My Orders</h1>
            {orders.length > 0 && (
              <span style={{ color: 'var(--text-3)', fontSize: 14 }}>
                {orders.length} order{orders.length !== 1 ? 's' : ''} total
              </span>
            )}
          </div>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 64, marginBottom: 20 }}>📦</div>
            <h3>No orders yet</h3>
            <p style={{ color: 'var(--text-2)', maxWidth: 360, margin: '0 auto 32px' }}>
              You haven't placed any orders yet. Start browsing our curated collection.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => {
              const status = statusColors[order.status] || statusColors.pending;
              const isOpen = expanded === order._id;

              return (
                <div key={order._id} className="card" style={{ overflow: 'hidden', transition: 'all 0.2s' }}>

                  {/* Order header row */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : order._id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto auto',
                      gap: 24,
                      alignItems: 'center',
                      padding: '20px 24px',
                      cursor: 'pointer',
                      background: isOpen ? 'var(--surface-2)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Order info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 600 }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
                          background: status.bg, color: status.color,
                        }}>{status.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        &nbsp;·&nbsp;
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Item thumbnails */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} style={{
                          width: 44, height: 44, borderRadius: 4, overflow: 'hidden',
                          border: '1px solid var(--border)', background: 'var(--bg-3)', flexShrink: 0,
                        }}>
                          <img src={item.image} alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => e.target.src = 'https://via.placeholder.com/44/1a1a1a/666'} />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div style={{
                          width: 44, height: 44, borderRadius: 4, background: 'var(--surface-2)',
                          border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 11, color: 'var(--text-3)', fontWeight: 600,
                        }}>+{order.items.length - 3}</div>
                      )}
                    </div>

                    {/* Total */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
                        ${order.totalPrice?.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 11, color: order.isPaid ? 'var(--green)' : 'var(--red)', marginTop: 3, fontWeight: 600 }}>
                        {order.isPaid ? '✓ Paid' : '✕ Unpaid'}
                      </div>
                    </div>

                    {/* Chevron */}
                    <div style={{
                      color: 'var(--text-3)', fontSize: 12,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}>▾</div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 24 }}>

                        {/* Shipping */}
                        <div>
                          <h4 style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Shipping Address</h4>
                          <div style={{ padding: '14px 16px', background: 'var(--bg-3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{order.shippingAddress?.fullName}</p>
                            <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
                              {order.shippingAddress?.address}<br />
                              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                              {order.shippingAddress?.country}
                            </p>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h4 style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Order Summary</h4>
                          <div style={{ padding: '14px 16px', background: 'var(--bg-3)', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                              ['Subtotal', `$${order.itemsPrice?.toFixed(2)}`],
                              ['Shipping', order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`],
                              ['Tax', `$${order.taxPrice?.toFixed(2)}`],
                            ].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)' }}>
                                <span>{l}</span><span>{v}</span>
                              </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                              <span>Total</span>
                              <span style={{ color: 'var(--accent)' }}>${order.totalPrice?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items list */}
                      <h4 style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Items Ordered</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px',
                            background: 'var(--bg-3)', borderRadius: 6, border: '1px solid var(--border)',
                          }}>
                            <div style={{ width: 56, height: 56, borderRadius: 4, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                              <img src={item.image} alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => e.target.src = 'https://via.placeholder.com/56/1a1a1a/666'} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <Link to={`/products/${item.product}`}
                                style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                                {item.name}
                              </Link>
                              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                                ${item.price?.toFixed(2)} × {item.qty}
                              </p>
                            </div>
                            <span style={{ fontWeight: 700, fontFamily: 'Fraunces, serif', fontSize: 16, color: 'var(--accent)' }}>
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery status bar */}
                      <div style={{ marginTop: 24 }}>
                        <h4 style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Delivery Progress</h4>
                        <StatusTracker status={order.status} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Back to shop */}
        {orders.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/dashboard" className="btn btn-outline">← Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

const STAGES = ['pending', 'processing', 'shipped', 'delivered'];

const StatusTracker = ({ status }) => {
  const isCancelled = status === 'cancelled';
  const currentIdx = isCancelled ? -1 : STAGES.indexOf(status);

  if (isCancelled) return (
    <div style={{ padding: '12px 16px', background: 'rgba(224,85,85,0.08)', border: '1px solid rgba(224,85,85,0.2)', borderRadius: 6, color: 'var(--red)', fontSize: 13, fontWeight: 500 }}>
      ✕ This order was cancelled
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {STAGES.map((stage, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: i < STAGES.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? 'var(--accent)' : 'var(--surface-2)',
                border: `2px solid ${done ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: done ? '#0a0a0a' : 'var(--text-3)',
                fontWeight: 700,
                boxShadow: active ? '0 0 0 4px rgba(200,169,110,0.15)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent)' : done ? 'var(--text-2)' : 'var(--text-3)',
                textTransform: 'capitalize', whiteSpace: 'nowrap',
              }}>{stage}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: i < currentIdx ? 'var(--accent)' : 'var(--border)',
                margin: '0 6px', marginBottom: 22,
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;