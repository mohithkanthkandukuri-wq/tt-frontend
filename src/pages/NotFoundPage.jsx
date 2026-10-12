import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <div style={{
        width: '5rem',
        height: '5rem',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem'
      }}>
        <Search size={36} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-light)', maxWidth: '450px', margin: '0 auto 2rem', fontSize: '1rem' }}>
        The page you are looking for might have been moved, deleted, or does not exist on FindIt+.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Return Home
        </Link>
        <Link to="/browse" className="btn btn-outline">
          <ArrowLeft size={18} /> Browse Items
        </Link>
      </div>
    </div>
  );
}
