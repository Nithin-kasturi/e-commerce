import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
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

  // Re-fetch when search / category / sort changes (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts(1, search, activeCategory, sortBy);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory, sortBy]);

  // Re-fetch when page changes (but not when other deps change — those reset page to 1 above)
  useEffect(() => {
    if (page !== 1) fetchProducts(page, search, activeCategory, sortBy);
  }, [page]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data);
    } catch {}
  };

  // Client-side sort applied after every fetch so all options work regardless of backend support
  const sortProducts = (list, sort) => {
    const arr = [...list];
    switch (sort) {
      case 'price_asc':  return arr.sort((a, b) => a.price - b.price);
      case 'price_desc': return arr.sort((a, b) => b.price - a.price);
      case 'rating':     return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:           return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const fetchProducts = async (p = 1, currentSearch = '', currentCategory = '', currentSort = 'newest') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 12 });
      if (currentSearch) params.append('search', currentSearch);
      if (currentCategory) params.append('category', currentCategory);
      const res = await api.get(`/products?${params}`);
      const sorted = sortProducts(res.data.products, currentSort);
      setProducts(sorted);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {} finally { setLoading(false); }
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    // Also immediately sort the already-loaded products for instant feedback
    setProducts(prev => sortProducts(prev, newSort));
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
              {total > 0 && (
                <span style={{ fontSize: 16, color: 'var(--text-3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 16 }}>
                  {total} items
                </span>
              )}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="form-input"
                style={{ width: 'auto', minWidth: 180 }}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 90 }}>
            <div style={{ marginBottom: 28 }}>
              <SearchBar value={search} onChange={setSearch} onSearch={() => {}} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 14 }}>
                Category
              </h4>
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
            {/* Active filter pills */}
            {(search || activeCategory) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Filters:</span>
                {search && (
                  <FilterPill label={`"${search}"`} onRemove={() => setSearch('')} />
                )}
                {activeCategory && (
                  <FilterPill label={activeCategory} onRemove={() => handleCategory('')} />
                )}
                <button
                  onClick={() => { setSearch(''); handleCategory(''); }}
                  style={{ fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>
                  Clear all
                </button>
              </div>
            )}

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
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{ ...pageBtnStyle, opacity: page === 1 ? 0.3 : 1 }}>
                      ‹
                    </button>
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        style={{
                          ...pageBtnStyle,
                          borderColor: page === i + 1 ? 'var(--accent)' : 'var(--border)',
                          background: page === i + 1 ? 'var(--accent)' : 'transparent',
                          color: page === i + 1 ? '#0a0a0a' : 'var(--text)',
                          fontWeight: page === i + 1 ? 700 : 400,
                        }}>
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      style={{ ...pageBtnStyle, opacity: page === pages ? 0.3 : 1 }}>
                      ›
                    </button>
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

const pageBtnStyle = {
  width: 40, height: 40,
  border: '1px solid var(--border)',
  borderRadius: 4,
  background: 'transparent',
  color: 'var(--text)',
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const FilterPill = ({ label, onRemove }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 100,
    background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)',
    color: 'var(--accent)', fontSize: 12, fontWeight: 500,
  }}>
    {label}
    <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, lineHeight: 1, padding: 0 }}>✕</button>
  </span>
);

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
    <style>{`@keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}.skeleton{animation:shimmer 1.5s ease infinite;}`}</style>
  </div>
);

export default Dashboard;