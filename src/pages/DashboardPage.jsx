import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsApi, claimsApi, notificationsApi } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FileText, 
  CheckCircle2, 
  Bell, 
  PlusCircle, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    myReportsCount: 0,
    myClaimsCount: 0,
    unreadNotifications: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [reportsRes, claimsRes, notifRes] = await Promise.all([
          itemsApi.getMyItems({ page: 0, size: 4 }),
          claimsApi.getMyClaims({ page: 0, size: 4 }),
          notificationsApi.getUnreadCount()
        ]);

        setStats({
          myReportsCount: reportsRes.data.totalElements || 0,
          myClaimsCount: claimsRes.data.totalElements || 0,
          unreadNotifications: notifRes.data?.count || 0
        });

        setRecentReports(reportsRes.data.content || []);
        setRecentClaims(claimsRes.data.content || []);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <LoadingSpinner size="lg" label="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Profile Greeting */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: isAdmin ? '#fdf2f8' : 'var(--primary-light)',
            color: isAdmin ? '#db2777' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, {user?.name}</h1>
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                {user?.role}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              {user?.email} {user?.phone ? `• ${user?.phone}` : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn btn-danger btn-sm">
            <PlusCircle size={16} /> Report Lost
          </Link>
          <Link to="/report-found" className="btn btn-success btn-sm">
            <PlusCircle size={16} /> Report Found
          </Link>
          {isAdmin && (
            <Link to="/admin" className="btn btn-secondary btn-sm" style={{ borderColor: '#db2777', color: '#db2777' }}>
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-stats" style={{ marginBottom: '2.5rem' }}>
        <DashboardStats
          icon={FileText}
          title="My Reports"
          value={stats.myReportsCount}
          color="var(--primary)"
          bgColor="var(--primary-light)"
          subtitle="Items you posted"
        />
        <DashboardStats
          icon={CheckCircle2}
          title="My Claims"
          value={stats.myClaimsCount}
          color="#059669"
          bgColor="#d1fae5"
          subtitle="Claims you filed"
        />
        <DashboardStats
          icon={Bell}
          title="Unread Alerts"
          value={stats.unreadNotifications}
          color="#d97706"
          bgColor="#fef3c7"
          subtitle="Notifications pending"
        />
      </div>

      {/* Two columns: Recent Reports and Recent Claims */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem'
      }}>
        {/* Recent reports list */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Recent Reports</h2>
            <Link to="/my-reports" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              You haven't reported any lost or found items yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentReports.map((item) => (
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
                      {item.category} • {item.location}
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
          )}
        </div>

        {/* Recent claims list */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Recovery Claims</h2>
            <Link to="/my-claims" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentClaims.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              You haven't submitted any recovery claims yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentClaims.map((claim) => (
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
                      Submitted: {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge badge-${claim.status.toLowerCase()}`}>
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
