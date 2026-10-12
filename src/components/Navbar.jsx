import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { 
  Search, 
  PlusCircle, 
  Compass, 
  User, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X,
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.25rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#ffffff',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.35)'
          }}>
            <Search size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
              FindIt<span style={{ color: '#4f46e5' }}>+</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, marginTop: '-3px' }}>
              CAMPUS RECOVERY PORTAL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', md: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
          <Link 
            to="/browse" 
            style={{ 
              fontWeight: 600, 
              color: isActive('/browse') ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive('/browse') ? 'var(--primary-light)' : 'transparent'
            }}
          >
            <Compass size={18} /> Browse Items
          </Link>

          <Link 
            to="/report-lost" 
            style={{ 
              fontWeight: 600, 
              color: isActive('/report-lost') ? '#dc2626' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive('/report-lost') ? '#fee2e2' : 'transparent'
            }}
          >
            <PlusCircle size={18} /> Report Lost
          </Link>

          <Link 
            to="/report-found" 
            style={{ 
              fontWeight: 600, 
              color: isActive('/report-found') ? '#059669' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive('/report-found') ? '#d1fae5' : 'transparent'
            }}
          >
            <PlusCircle size={18} /> Report Found
          </Link>
        </div>

        {/* Desktop Action Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Dropdown Component */}
              <NotificationDropdown />

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '1.875rem',
                    height: '1.875rem',
                    borderRadius: '50%',
                    backgroundColor: isAdmin ? '#fdf2f8' : 'var(--primary-light)',
                    color: isAdmin ? '#db2777' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div 
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 0.5rem)',
                      width: '220px',
                      background: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.5rem',
                      zIndex: 60
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                      {isAdmin && (
                        <span className="badge badge-admin" style={{ marginTop: '0.375rem' }}>ADMINISTRATOR</span>
                      )}
                    </div>

                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)' }}>
                      <Compass size={16} /> User Dashboard
                    </Link>

                    <Link to="/my-reports" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)' }}>
                      <FileText size={16} /> My Reports
                    </Link>

                    <Link to="/my-claims" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)' }}>
                      <CheckCircle2 size={16} /> My Claims
                    </Link>

                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: 'var(--text-main)', borderRadius: 'var(--radius-sm)' }}>
                      <User size={16} /> Profile Settings
                    </Link>

                    {isAdmin && (
                      <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', color: '#db2777', fontWeight: 600, borderRadius: 'var(--radius-sm)' }}>
                        <ShieldAlert size={16} /> Admin Portal
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          color: 'var(--danger)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              color: 'var(--text-main)'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border)',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link 
              to="/browse" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}
            >
              Browse All Items
            </Link>
            <Link 
              to="/report-lost" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem', fontWeight: 600, color: '#dc2626' }}
            >
              Report a Lost Item
            </Link>
            <Link 
              to="/report-found" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem', fontWeight: 600, color: '#059669' }}
            >
              Report a Found Item
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem', color: 'var(--text-main)' }}>
                  User Dashboard
                </Link>
                <Link to="/my-reports" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem', color: 'var(--text-main)' }}>
                  My Reports
                </Link>
                <Link to="/my-claims" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem', color: 'var(--text-main)' }}>
                  My Claims
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem', color: 'var(--text-main)' }}>
                  Profile Settings
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem', color: '#db2777', fontWeight: 700 }}>
                    Admin Portal
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--danger)', background: 'none', border: 'none', fontWeight: 600 }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
