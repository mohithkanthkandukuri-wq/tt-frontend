import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, defaultValue = '', placeholder = "Search lost or found items by keyword..." }) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '2px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease'
      }}>
        <div style={{ padding: '0 1rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
          <Search size={20} />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: '0.875rem 0',
            fontSize: '1rem',
            color: 'var(--text-main)',
            fontFamily: 'inherit'
          }}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 0.75rem',
              color: 'var(--text-light)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            borderRadius: '0',
            padding: '0.875rem 1.75rem',
            boxShadow: 'none'
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
