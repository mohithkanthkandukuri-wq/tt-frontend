import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { LogIn, Lock, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);
    try {
      await login({ email: demoEmail, password: demoPassword });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Demo login error', err);
      setError('Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '440px', padding: '3.5rem 1.5rem' }}>
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
          <LogIn size={26} />
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Sign in to your FindIt+ campus account
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="card" style={{ backgroundColor: '#ffffff' }}>
        <div className="form-group">
          <label className="form-label">Campus Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. student@findit.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
          </div>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
        </button>

        {/* Quick Demo Logins for reviewers & testing */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
            Quick Demo Logins
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('student@findit.edu', 'Student@123')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
              disabled={loading}
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@findit.edu', 'Admin@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
              disabled={loading}
            >
              Demo Admin
            </button>
          </div>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Don't have an account yet?{' '}
        <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>
          Register Now
        </Link>
      </p>
    </div>
  );
}
