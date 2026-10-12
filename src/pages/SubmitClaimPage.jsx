import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsApi, claimsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ShieldCheck, ArrowLeft, Info, FileCheck2 } from 'lucide-react';

export default function SubmitClaimPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemsApi.getItemById(id);
        setItem(res.data);
      } catch (err) {
        console.error('Failed to load item', err);
        setError('Failed to load item for claim submission.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide at least 10 characters describing identifying details.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await claimsApi.createClaim(id, { message: message.trim() });
      navigate('/my-claims');
    } catch (err) {
      console.error('Claim submission failed', err);
      setError(err.response?.data?.message || 'Failed to submit claim. You may already have a pending claim.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <LoadingSpinner size="lg" label="Loading item for claim..." />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <Link
        to={`/items/${id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Item
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: 'var(--primary)',
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.25rem'
        }}>
          <ShieldCheck size={16} /> Verification Protocol
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Submit Ownership Claim</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Verify your ownership by describing private distinguishing marks, contents, or serial numbers.
        </p>
      </div>

      {item && (
        <div className="card" style={{
          marginBottom: '1.5rem',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
              CLAIMING FOUND ITEM
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Found at: {item.location} • {item.incidentDate}
            </p>
          </div>
          <span className="badge badge-found">Found Property</span>
        </div>
      )}

      {/* Fraud prevention tips */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '0.75rem',
        color: '#92400e',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        <Info size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Privacy & Security Notice:</strong>
          <p style={{ marginTop: '0.25rem' }}>
            Do not copy the public description above. Provide private details only known to the real owner, such as stickers on the case, wallpaper on the screen, unique scratch locations, or specific items in the compartments.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="card" style={{ backgroundColor: '#ffffff' }}>
        <div className="form-group">
          <label className="form-label">
            Identifying Details & Proof of Ownership *
          </label>
          <textarea
            className="form-textarea"
            rows={6}
            placeholder="Describe private marks, engravings, exact contents, receipts, serial digits, keychain tags..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner size="sm" /> : (
              <>
                <FileCheck2 size={18} /> Submit Claim for Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
