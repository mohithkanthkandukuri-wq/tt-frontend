import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      padding: '3rem 1.5rem 1.5rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              width: '2rem',
              height: '2rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Search size={16} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              FindIt<span style={{ color: '#4f46e5' }}>+</span>
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            The official university portal for lost and found property recovery. Connects finders with rightful owners swiftly, securely, and transparently.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li><Link to="/browse" style={{ color: 'var(--text-muted)' }}>Browse All Listings</Link></li>
            <li><Link to="/report-lost" style={{ color: 'var(--text-muted)' }}>Report a Lost Item</Link></li>
            <li><Link to="/report-found" style={{ color: 'var(--text-muted)' }}>Report a Found Item</Link></li>
            <li><Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Student Dashboard</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Top Categories
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li><Link to="/browse?category=Electronics" style={{ color: 'var(--text-muted)' }}>Electronics & Gadgets</Link></li>
            <li><Link to="/browse?category=Documents and ID cards" style={{ color: 'var(--text-muted)' }}>Student IDs & Cards</Link></li>
            <li><Link to="/browse?category=Bags" style={{ color: 'var(--text-muted)' }}>Backpacks & Wallets</Link></li>
            <li><Link to="/browse?category=Keys" style={{ color: 'var(--text-muted)' }}>Keys & Lanyards</Link></li>
          </ul>
        </div>

        {/* Campus Support */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Campus Desk
          </h4>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            <strong>Central Security Office</strong><br />
            Student Union Building, Room 102<br />
            Mon – Fri: 8:00 AM – 6:00 PM<br />
            Email: <span style={{ color: 'var(--primary)' }}>helpdesk@findit.edu</span>
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.8125rem'
      }}>
        <p>© {new Date().getFullYear()} FindIt+ Campus Portal. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          Designed with <Heart size={14} color="#ef4444" fill="#ef4444" /> for College Campus Life
        </p>
      </div>
    </footer>
  );
}
