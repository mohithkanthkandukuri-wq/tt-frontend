import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemsApi } from '../services/api';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await itemsApi.getRecentItems();
        setRecentItems(res.data || []);
      } catch (err) {
        console.error('Error fetching recent items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleHeroSearch = (query) => {
    navigate(`/browse?query=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #f0fdf4 100%)',
        padding: '5rem 1.5rem 4rem',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--primary-border)',
            borderRadius: '9999px',
            padding: '0.375rem 1rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} /> Campus Lost & Found Network
          </div>

          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.03em',
            lineHeight: '1.15',
            marginBottom: '1.25rem'
          }}>
            Lost something on campus?<br />
            <span style={{ color: 'var(--primary)' }}>FindIt+</span> gets it back.
          </h1>

          <p style={{
            fontSize: '1.1875rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '2.5rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem'
          }}>
            A secure campus recovery portal connecting students and faculty. Report missing valuables, identify found items, verify ownership, and restore belongings safely.
          </p>

          {/* Prominent Search Bar */}
          <div style={{ maxWidth: '640px', margin: '0 auto 2rem' }}>
            <SearchBar onSearch={handleHeroSearch} placeholder="Search by title, brand, location (e.g. AirPods, Library)..." />
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/report-lost" className="btn btn-primary btn-lg" style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}>
              <PlusCircle size={20} /> I Lost An Item
            </Link>
            <Link to="/report-found" className="btn btn-primary btn-lg" style={{ backgroundColor: '#059669', borderColor: '#059669' }}>
              <PlusCircle size={20} /> I Found An Item
            </Link>
            <Link to="/browse" className="btn btn-outline btn-lg">
              Browse All Listings <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="page-container" style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Recent Lost & Found Reports
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Latest items reported by students, staff, and campus security
            </p>
          </div>

          <Link to="/browse" className="btn btn-secondary">
            View All Reports <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <LoadingSpinner size="lg" label="Loading recent reports..." />
          </div>
        ) : recentItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
              No items reported yet. Be the first to report a lost or found item!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/report-lost" className="btn btn-danger">Report Lost</Link>
              <Link to="/report-found" className="btn btn-success">Report Found</Link>
            </div>
          </div>
        ) : (
          <div className="grid-cards">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            How FindIt+ Works
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1rem' }}>
            Three simple steps to safely recover your belongings on campus
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            <div className="card" style={{ backgroundColor: 'var(--bg-page)', border: 'none' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Post a Report</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                Quickly submit details about what you lost or found. Add photos, location, and key identifiers.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-page)', border: 'none' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Submit a Claim</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                Spot your found item? Submit an ownership claim describing private matching marks to verify authentic ownership.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--bg-page)', border: 'none' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Secure Recovery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                Once verified, coordinate handoff safely on campus or via Central Campus Security and mark the item returned.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
