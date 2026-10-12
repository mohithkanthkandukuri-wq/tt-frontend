import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { claimsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield, User, MapPin } from 'lucide-react';

export default function ClaimDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, action: null, message: '' });

  const fetchClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await claimsApi.getClaimById(id);
      setClaim(res.data);
    } catch (err) {
      console.error('Failed to load claim', err);
      setError('Claim not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const handleCancelClaim = async () => {
    setActionLoading(true);
    try {
      await claimsApi.cancelClaim(id);
      setCancelModalOpen(false);
      fetchClaim();
    } catch (err) {
      console.error('Cancel failed', err);
      setError('Failed to cancel claim.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewClaim = async () => {
    setActionLoading(true);
    try {
      if (reviewModal.action === 'APPROVE') {
        await claimsApi.approveClaim(id, { reviewMessage: reviewModal.message });
      } else {
        await claimsApi.rejectClaim(id, { reviewMessage: reviewModal.message });
      }
      setReviewModal({ isOpen: false, action: null, message: '' });
      fetchClaim();
    } catch (err) {
      console.error('Review failed', err);
      setError('Review failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <LoadingSpinner size="lg" label="Loading claim record..." />
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="page-container" style={{ maxWidth: '600px' }}>
        <ErrorMessage message={error || 'Claim not found'} onRetry={fetchClaim} />
        <Link to="/my-claims" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to My Claims
        </Link>
      </div>
    );
  }

  const isClaimant = user?.id === claim.claimantId;
  const isPending = claim.status === 'PENDING';

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <Link
        to={isClaimant ? "/my-claims" : `/items/${claim.itemId}`}
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
        <ArrowLeft size={16} /> Back
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Claim #{claim.id}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Submitted on {new Date(claim.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className={`badge badge-${claim.status.toLowerCase()}`} style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
          {claim.status}
        </span>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Item info banner */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Target Item
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>
              <Link to={`/items/${claim.itemId}`} style={{ color: 'inherit' }}>
                {claim.itemTitle}
              </Link>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Category: {claim.itemCategory}
            </p>
          </div>

          <Link to={`/items/${claim.itemId}`} className="btn btn-secondary btn-sm">
            View Full Report
          </Link>
        </div>
      </div>

      {/* Claimant Details */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Claimant Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Name:</span>
            <span style={{ fontWeight: 600 }}>{claim.claimantName}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Email:</span>
            <span style={{ fontWeight: 600 }}>{claim.claimantEmail}</span>
          </div>
          {claim.claimantPhone && (
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Phone:</span>
              <span style={{ fontWeight: 600 }}>{claim.claimantPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Identifying Description */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Ownership Proof & Identifying Description
        </h3>
        <p style={{
          backgroundColor: 'var(--bg-page)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-main)',
          fontSize: '0.9375rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-line'
        }}>
          {claim.message}
        </p>
      </div>

      {/* Review details if reviewed */}
      {claim.reviewedByName && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Review Outcome
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Reviewed by: <strong>{claim.reviewedByName}</strong>
          </p>
          {claim.reviewMessage && (
            <p style={{ fontSize: '0.9375rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
              Note: {claim.reviewMessage}
            </p>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {isClaimant && isPending && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="btn btn-danger-outline"
          >
            Cancel My Claim
          </button>
        )}

        {(!isClaimant || isAdmin) && isPending && (
          <>
            <button
              onClick={() => setReviewModal({ isOpen: true, action: 'REJECT', message: '' })}
              className="btn btn-outline"
              style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
            >
              <XCircle size={16} /> Reject Claim
            </button>
            <button
              onClick={() => setReviewModal({ isOpen: true, action: 'APPROVE', message: '' })}
              className="btn btn-success"
            >
              <CheckCircle size={16} /> Approve Claim
            </button>
          </>
        )}
      </div>

      {/* Cancel modal */}
      <ConfirmationDialog
        isOpen={cancelModalOpen}
        title="Cancel Claim"
        message="Are you sure you want to cancel this pending claim?"
        confirmText="Yes, Cancel Claim"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleCancelClaim}
        onCancel={() => setCancelModalOpen(false)}
      />

      {/* Review modal */}
      {reviewModal.isOpen && (
        <div className="modal-overlay" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                {reviewModal.action === 'APPROVE' ? 'Approve Claim' : 'Reject Claim'}
              </h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Review Note (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={reviewModal.message}
                  onChange={(e) => setReviewModal({ ...reviewModal, message: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className={`btn ${reviewModal.action === 'APPROVE' ? 'btn-success' : 'btn-danger'}`}
                onClick={handleReviewClaim}
                disabled={actionLoading}
              >
                {actionLoading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
