import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < full ? 'var(--accent)' : (i === full && half ? 'var(--accent)' : 'var(--border-2)'), opacity: i === full && half ? 0.6 : 1 }}>★</span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const discountedPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error('Please sign in to add items to cart');
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? 'var(--shadow)' : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-3)' }}>
          <img
            src={imgError ? 'https://via.placeholder.com/400x300/1a1a1a/666?text=No+Image' : product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.discount > 0 && (
              <span className="badge badge-gold">−{product.discount}%</span>
            )}
            {product.featured && (
              <span className="badge badge-green">Featured</span>
            )}
            {product.countInStock === 0 && (
              <span className="badge badge-red">Sold Out</span>
            )}
          </div>
          {/* Quick add overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '32px 16px 16px',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.25s ease',
          }}>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.countInStock === 0}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: 13 }}
            >
              {adding ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : null}
              {product.countInStock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            {product.brand}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, lineHeight: 1.4, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Stars rating={product.rating || 0} />
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>({product.numReviews || 0})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Fraunces, serif' }}>
              ${discountedPrice || product.price.toFixed(2)}
            </span>
            {discountedPrice && (
              <span style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'line-through' }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
