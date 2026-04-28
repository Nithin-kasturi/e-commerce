import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory, sortBy]);

  useEffect(() => { fetchProducts(page); }, [page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data);
    } catch {}
  };

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 12 });
      if (search) params.append('search', search);
      if (activeCategory) params.append('category', activeCategory);
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {} finally { setLoading(false); }
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Our Collection</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1 }}>
              {activeCategory || 'All Products'}
              {total > 0 && <span style={{ fontSize: 16, color: 'var(--text-3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 16 }}>{total} items</span>}
            </h1>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: 'auto', paddingRight: 40, minWidth: 160 }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 90 }}>
            <div style={{ marginBottom: 28 }}>
              <SearchBar value={search} onChange={setSearch} onSearch={() => {}} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 14 }}>Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <CategoryItem label="All" active={!activeCategory} onClick={() => handleCategory('')} />
                {categories.map(c => (
                  <CategoryItem key={c} label={c} active={activeCategory === c} onClick={() => handleCategory(c)} />
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3>No products found</h3>
                <p>Try a different search term or category</p>
                <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveCategory(''); }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        style={{
                          width: 40, height: 40, border: '1px solid',
                          borderColor: page === i + 1 ? 'var(--accent)' : 'var(--border)',
                          borderRadius: 4,
                          background: page === i + 1 ? 'var(--accent)' : 'transparent',
                          color: page === i + 1 ? '#0a0a0a' : 'var(--text)',
                          fontSize: 14, fontWeight: page === i + 1 ? 600 : 400,
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >{i + 1}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 4,
      background: active ? 'rgba(200,169,110,0.12)' : 'transparent',
      border: 'none',
      color: active ? 'var(--accent)' : 'var(--text-2)',
      fontSize: 14, fontWeight: active ? 600 : 400,
      cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.2s', width: '100%',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface)'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
    {label}
  </button>
);

const SkeletonCard = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div style={{ aspectRatio: '4/3', background: 'var(--surface-2)' }} className="skeleton" />
    <div style={{ padding: 16 }}>
      <div style={{ height: 10, background: 'var(--surface-2)', borderRadius: 4, width: '40%', marginBottom: 10 }} className="skeleton" />
      <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 4, marginBottom: 8 }} className="skeleton" />
      <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 4, width: '70%', marginBottom: 14 }} className="skeleton" />
      <div style={{ height: 22, background: 'var(--surface-2)', borderRadius: 4, width: '35%' }} className="skeleton" />
    </div>
    <style>{`@keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} } .skeleton{animation:shimmer 1.5s ease infinite;}`}</style>
  </div>
);

export default Dashboard;
