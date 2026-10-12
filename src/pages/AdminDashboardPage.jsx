import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  ShieldAlert, 
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
      setError('Failed to fetch administrator statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <LoadingSpinner size="lg" label="Loading system dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '1rem',
            backgroundColor: '#fdf2f8',
            color: '#db2777',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Administration Portal</h1>
              <span className="badge badge-admin">SUPER ADMIN</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              System health, community reports, recovery claims, and role management
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn btn-outline btn-sm">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/reports" className="btn btn-outline btn-sm">
            <FileText size={16} /> Manage Reports
          </Link>
          <Link to="/admin/claims" className="btn btn-outline btn-sm">
            <CheckCircle2 size={16} /> Manage Claims
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboard} />}

      {/* Primary Metrics Grid */}
      <div className="grid-stats" style={{ marginBottom: '2.5rem' }}>
        <DashboardStats
          icon={Users}
          title="Total Users"
          value={data?.totalUsers || 0}
          color="#3b82f6"
          bgColor="#eff6ff"
          subtitle="Registered accounts"
        />
        <DashboardStats
          icon={FileText}
          title="Lost Reports"
          value={data?.totalLostReports || 0}
          color="#ef4444"
          bgColor="#fee2e2"
          subtitle="Items reported missing"
        />
        <DashboardStats
          icon={Search}
          title="Found Reports"
          value={data?.totalFoundReports || 0}
          color="#10b981"
          bgColor="#d1fae5"
          subtitle="Items found on campus"
        />
        <DashboardStats
          icon={Clock}
          title="Open Items"
          value={data?.openReports || 0}
          color="#f59e0b"
          bgColor="#fef3c7"
          subtitle="Active reports"
        />
        <DashboardStats
          icon={RotateCcw}
          title="Returned Items"
          value={data?.returnedItems || 0}
          color="#8b5cf6"
          bgColor="#f5f3ff"
          subtitle="Successfully restored"
        />
        <DashboardStats
          icon={CheckCircle2}
          title="Pending Claims"
          value={data?.pendingClaims || 0}
          color="#db2777"
          bgColor="#fdf2f8"
          subtitle="Awaiting review"
        />
      </div>

      {/* Two columns: Recent Reports and Recent Claims */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem'
      }}>
        {/* Recent reports */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Reports</h2>
            <Link to="/admin/reports" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data?.recentReports?.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <Link to={`/items/${item.id}`} style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </Link>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {item.category} • by {item.reporterName}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span className={`badge ${item.reportType === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                    {item.reportType}
                  </span>
                  <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '0.6875rem' }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent claims */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Claims</h2>
            <Link to="/admin/claims" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data?.recentClaims?.map((claim) => (
              <div
                key={claim.id}
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <Link to={`/claims/${claim.id}`} style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                    {claim.itemTitle}
                  </Link>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Claimant: {claim.claimantName}
                  </p>
                </div>
                <span className={`badge badge-${claim.status.toLowerCase()}`}>
                  {claim.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
