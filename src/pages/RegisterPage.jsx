import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { UserPlus, User, Mail, Phone, Lock } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed', err);
      if (!err.response) {
        setError('Unable to connect to the backend server. Please verify the server is running or check your connection.');
      } else if (err.response.status === 409) {
        setError(err.response.data?.message || 'An account with this email already exists. Please sign in or use a different email.');
      } else if (err.response.status === 400) {
        if (err.response.data?.fieldErrors && Object.keys(err.response.data.fieldErrors).length > 0) {
          const firstErrorMessage = Object.values(err.response.data.fieldErrors)[0];
          setError(firstErrorMessage);
        } else {
          setError(err.response.data?.message || 'Invalid registration details provided. Please check the form.');
        }
      } else if (err.response.status >= 500) {
        setError('A server error occurred while processing your registration. Please try again later.');
      } else {
        setError(err.response.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '1rem',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <UserPlus size={26} />
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Create Your Account</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Join FindIt+ to report items and submit recovery claims
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="card" style={{ backgroundColor: '#ffffff' }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Maya Chen"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Campus Email *</label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g. maya.chen@findit.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number (Optional)</label>
          <input
            type="tel"
            className="form-input"
            placeholder="e.g. +1 (555) 012-3456"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <input
            type="password"
            className="form-input"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password *</label>
          <input
            type="password"
            className="form-input"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Register Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Already registered?{' '}
        <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}
