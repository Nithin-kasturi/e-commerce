import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ value, onChange, onSearch, placeholder = 'Search products...' }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
    else navigate(`/dashboard?search=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
        <SearchIcon />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{ paddingLeft: 44, paddingRight: value ? 44 : 16 }}
      />
      {value && (
        <button type="button" onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 16,
            cursor: 'pointer', transition: 'color 0.2s', lineHeight: 1,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
          ✕
        </button>
      )}
    </form>
  );
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

export default SearchBar;
