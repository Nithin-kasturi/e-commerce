import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, updateQty, removeItem, totalPrice, loading } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];

  const shipping = totalPrice > 100 ? 0 : 10;
  const tax = (totalPrice * 0.15).toFixed(2);
  const grandTotal = (totalPrice + shipping + parseFloat(tax)).toFixed(2);

  const handleRemove = async (itemId, name) => {
    await removeItem(itemId);
    toast.success(`${name} removed from cart`);
  };

  if (items.length === 0) return (
    <div style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div className="container">
        <div className="empty-state">
          <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p style={{ color: 'var(--text-2)', maxWidth: 380, margin: '0 auto 32px' }}>
            Looks like you haven't added anything to your cart yet. Start shopping to find something you love.
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-lg">Browse Products</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Review Your Order</p>
          <h1 style={{ fontSize: 40 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 8 }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map(item => (
              <div key={item._id} className="cart-item card" style={{ display: 'flex', gap: 0, overflow: 'hidden' }}>
                {/* Image */}
                <div className="cart-item-image" style={{ width: 160, height: 160, flexShrink: 0, background: 'var(--bg-3)' }}>
                  <img src={item.image} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => e.target.src = 'https://via.placeholder.com/160x160/1a1a1a/666?text=No+Image'} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Link to={`/products/${item.product}`}
                        style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                        {item.name}
                      </Link>
                      <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>${item.price.toFixed(2)} each</p>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Qty stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      <button
                        onClick={() => item.qty > 1 ? updateQty(item._id, item.qty - 1) : handleRemove(item._id, item.name)}
                        style={{ width: 36, height: 36, background: 'none', border: 'none', color: 'var(--text)', fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        {item.qty === 1 ? '🗑' : '−'}
                      </button>
                      <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        style={{ width: 36, height: 36, background: 'none', border: 'none', color: 'var(--text)', fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>+</button>
                    </div>

                    <button onClick={() => handleRemove(item._id, item.name)}
                      style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.7, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="card" style={{ padding: 28, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 20, marginBottom: 24 }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <SummaryRow label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
              <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                note={totalPrice <= 100 ? 'Free over $100' : null} />
              <SummaryRow label="Tax (15%)" value={`$${tax}`} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24 }}>
              <SummaryRow label="Total" value={`$${grandTotal}`} bold />
            </div>

            {totalPrice < 100 && (
              <div style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 6, padding: 14, marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: 'var(--accent)', textAlign: 'center' }}>
                  Add <strong>${(100 - totalPrice).toFixed(2)}</strong> more for free shipping
                </p>
              </div>
            )}

            <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 12 }}>
              Proceed to Checkout →
            </button>
            <Link to="/dashboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Shopping
            </Link>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16 }}>
              {['🔒 Secure', '🚚 Fast Delivery', '↩ Easy Returns'].map(t => (
                <span key={t} style={{ fontSize: 11, color: 'var(--text-3)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, note, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <div>
      <span style={{ color: bold ? 'var(--text)' : 'var(--text-2)', fontSize: bold ? 16 : 14, fontWeight: bold ? 700 : 400 }}>{label}</span>
      {note && <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 6 }}>({note})</span>}
    </div>
    <span style={{ fontWeight: bold ? 700 : 500, fontSize: bold ? 20 : 14, fontFamily: bold ? 'Fraunces, serif' : 'inherit', color: bold ? 'var(--accent)' : 'var(--text)' }}>
      {value}
    </span>
  </div>
);

export default Cart;
