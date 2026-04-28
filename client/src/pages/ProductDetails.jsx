import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Stars = ({ rating, interactive, onRate }) => (
  <div className="stars" style={{ gap: 4 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i}
        onClick={() => interactive && onRate && onRate(i)}
        style={{
          fontSize: interactive ? 24 : 16,
          color: i <= rating ? 'var(--accent)' : 'var(--border-2)',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'transform 0.1s',
        }}
        onMouseEnter={e => interactive && (e.target.style.transform = 'scale(1.2)')}
        onMouseLeave={e => interactive && (e.target.style.transform = 'scale(1)')}>★</span>
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch { toast.error('Product not found'); }
    finally { setLoading(false); }
  };

  const handleAddToCart = async () => {
    if (!user) return toast.error('Please sign in to add to cart');
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      toast.success(`${qty} item${qty > 1 ? 's' : ''} added to cart!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally { setAdding(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!review.comment.trim()) return toast.error('Please write a comment');
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="page-loader" style={{ paddingTop: 100 }}>
      <div className="spinner" />
      <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Loading product...</span>
    </div>
  );

  if (!product) return (
    <div className="empty-state" style={{ paddingTop: 150 }}>
      <h3>Product not found</h3>
      <Link to="/dashboard" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const finalPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 40, fontSize: 13, color: 'var(--text-3)' }}>
          <Link to="/" style={{ color: 'var(--text-3)' }} onMouseEnter={e => e.currentTarget.style.color='var(--text)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>Home</Link>
          <span>›</span>
          <Link to="/dashboard" style={{ color: 'var(--text-3)' }} onMouseEnter={e => e.currentTarget.style.color='var(--text)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>Shop</Link>
          <span>›</span>
          <Link to={`/dashboard?category=${product.category}`} style={{ color: 'var(--text-3)' }} onMouseEnter={e => e.currentTarget.style.color='var(--text)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>{product.category}</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-2)' }}>{product.name}</span>
        </div>

        {/* Main product grid */}
        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 80 }}>
          {/* Images */}
          <div>
            <div style={{ aspectRatio: '1', background: 'var(--bg-3)', borderRadius: 8, overflow: 'hidden', marginBottom: 16, border: '1px solid var(--border)' }}>
              <img src={images[activeImg]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.src = 'https://via.placeholder.com/600x600/1a1a1a/666?text=No+Image'} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 72, borderRadius: 4, overflow: 'hidden',
                      border: `2px solid ${activeImg === i ? 'var(--accent)' : 'var(--border)'}`,
                      background: 'none', cursor: 'pointer', padding: 0,
                    }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {product.brand}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Stars rating={Math.round(product.rating)} />
              <span style={{ color: 'var(--text-2)', fontSize: 14 }}>
                {product.rating?.toFixed(1)} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--accent)' }}>
                ${finalPrice || product.price.toFixed(2)}
              </span>
              {finalPrice && (
                <>
                  <span style={{ fontSize: 20, color: 'var(--text-3)', textDecoration: 'line-through' }}>${product.price.toFixed(2)}</span>
                  <span className="badge badge-gold">Save {product.discount}%</span>
                </>
              )}
            </div>

            <div className="divider" />

            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>{product.description}</p>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.countInStock > 0 ? 'var(--green)' : 'var(--red)' }} />
              <span style={{ fontSize: 14, color: product.countInStock > 0 ? 'var(--green)' : 'var(--red)' }}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty + Add to cart */}
            {product.countInStock > 0 && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 40, height: 48, background: 'none', border: 'none', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>−</button>
                  <span style={{ width: 48, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                    style={{ width: 40, height: 48, background: 'none', border: 'none', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  {adding ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Adding...</> : '🛒 Add to Cart'}
                </button>
              </div>
            )}

            {/* Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Category', product.category], ['Brand', product.brand], ['SKU', product._id?.slice(-8).toUpperCase()]].map(([k, v]) => (
                <div key={k} style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 40 }}>Customer Reviews</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {/* Review list */}
            <div>
              {product.reviews?.length === 0 ? (
                <p style={{ color: 'var(--text-2)', fontSize: 15 }}>No reviews yet. Be the first to review this product.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {product.reviews.map(r => (
                    <div key={r._id} style={{ padding: 20, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0a0a0a' }}>
                            {r.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write review */}
            {user ? (
              <div>
                <h3 style={{ fontSize: 20, marginBottom: 20 }}>Write a Review</h3>
                <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <Stars rating={review.rating} interactive onRate={r => setReview(v => ({ ...v, rating: r }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      value={review.comment}
                      onChange={e => setReview(v => ({ ...v, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ padding: 32, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-2)', marginBottom: 16 }}>Sign in to write a review</p>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
