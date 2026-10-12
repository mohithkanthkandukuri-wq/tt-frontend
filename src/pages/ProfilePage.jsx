import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { User, Mail, Phone, Shield, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, isAdmin } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await authApi.updateProfile({
        name: name.trim(),
        phone: phone.trim() || null
      });
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Update profile failed', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Profile & Account Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Manage your personal information and contact preferences
        </p>
      </div>

      {success && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#065f46',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle size={20} color="#059669" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="card" style={{ backgroundColor: '#ffffff' }}>
        {/* Account Details Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            backgroundColor: isAdmin ? '#fdf2f8' : 'var(--primary-light)',
            color: isAdmin ? '#db2777' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{user?.name}</span>
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                {user?.role}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Campus Email (Fixed)</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ''}
            disabled
            style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            To change your verified university email, please contact IT administration.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            placeholder="e.g. +1 (555) 019-9234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            Only shared with verified owners or finders of items you report.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
