import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsApi, claimsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  ShieldAlert, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  FileCheck2,
  XCircle
} from 'lucide-react';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, claimId: null, action: null, message: '' });

  const fetchItemData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemsApi.getItemById(id);
      setItem(res.data);

      // If user is owner or admin, fetch claims for this item
      if (isAuthenticated && (res.data.reporterId === user?.id || isAdmin)) {
        try {
          const claimsRes = await claimsApi.getItemClaims(id);
          setClaims(claimsRes.data || []);
        } catch (ignored) {}
      }
    } catch (err) {
      console.error('Error fetching item details', err);
      setError('Item not found or failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id, isAuthenticated, user?.id]);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await itemsApi.deleteItem(id);
      navigate('/browse');
    } catch (err) {
      console.error('Delete failed', err);
      setError('Failed to delete report. You might not have permission.');
      setDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkReturned = async () => {
    setActionLoading(true);
    try {
      await itemsApi.markReturned(id);
      setReturnModalOpen(false);
      fetchItemData();
    } catch (err) {
      console.error('Mark returned failed', err);
      setError('Failed to mark item returned.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewClaim = async () => {
    if (!reviewModal.claimId) return;
    setActionLoading(true);
    try {
      if (reviewModal.action === 'APPROVE') {
        await claimsApi.approveClaim(reviewModal.claimId, { reviewMessage: reviewModal.message });
      } else {
        await claimsApi.rejectClaim(reviewModal.claimId, { reviewMessage: reviewModal.message });
      }
      setReviewModal({ isOpen: false, claimId: null, action: null, message: '' });
      fetchItemData();
    } catch (err) {
      console.error('Review failed', err);
      setError('Failed to review claim: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <LoadingSpinner size="lg" label="Loading item report..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container" style={{ maxWidth: '600px' }}>
        <ErrorMessage message={error || 'Item not found'} onRetry={fetchItemData} />
        <Link to="/browse" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.reporterId;
  const canManage = isOwner || isAdmin;
  const isFound = item.reportType === 'FOUND';
  const canClaim = isAuthenticated && !isOwner && isFound && (item.status === 'OPEN' || item.status === 'CLAIM_PENDING');
  const imageUrl = item.imagePath ? `/api/items/images/${item.imagePath}` : null;

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Back link */}
      <Link
        to="/browse"
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
        <ArrowLeft size={16} /> Back to all listings
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Left Column: Image */}
        <div>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            height: '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0f172a' }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                <Tag size={64} strokeWidth={1.5} style={{ margin: '0 auto 1rem', display: 'block' }} />
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>No photograph attached</p>
                <p style={{ fontSize: '0.8125rem' }}>The reporter did not upload an image for this item</p>
              </div>
            )}

            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
              <span className={`badge ${item.reportType === 'LOST' ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
                {item.reportType} ITEM
              </span>
            </div>

            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
                {item.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Item Information & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              padding: '0.25rem 0.625rem',
              borderRadius: '4px'
            }}>
              {item.category}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.2' }}>
            {item.title}
          </h1>

          {/* Location & Date */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem',
            fontSize: '0.9375rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <MapPin size={18} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>Location:</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Calendar size={18} color="var(--text-muted)" />
              <span style={{ fontWeight: 600 }}>Incident Date:</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.incidentDate}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Clock size={18} color="var(--text-muted)" />
              <span style={{ fontWeight: 600 }}>Posted On:</span>
              <span style={{ color: 'var(--text-muted)' }}>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Description</h3>
            <p style={{
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              fontSize: '0.9375rem',
              whiteSpace: 'pre-line'
            }}>
              {item.description}
            </p>
          </div>

          {/* Reporter Contact Info Card */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.025em' }}>
              Reported By
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <User size={16} color="var(--primary)" /> {item.reporterName}
              </div>
              {isAuthenticated ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Mail size={16} /> {item.reporterEmail}
                  </div>
                  {item.reporterPhone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <Phone size={16} /> {item.reporterPhone}
                    </div>
                  )}
                </>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link> to view verified contact details.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {canClaim && (
              <Link to={`/items/${item.id}/claim`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                <FileCheck2 size={20} /> Claim This Item
              </Link>
            )}

            {canManage && (
              <>
                <Link to={`/items/${item.id}/edit`} className="btn btn-secondary">
                  <Edit3 size={16} /> Edit Report
                </Link>

                {item.status !== 'RETURNED' && (
                  <button onClick={() => setReturnModalOpen(true)} className="btn btn-success">
                    <CheckCircle size={16} /> Mark as Returned
                  </button>
                )}

                <button onClick={() => setDeleteModalOpen(true)} className="btn btn-danger-outline">
                  <Trash2 size={16} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Claims Management Section (Visible to owner or admin) */}
      {canManage && isFound && (
        <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Submitted Ownership Claims</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Review identifying descriptions provided by potential owners
              </p>
            </div>
            <span className="badge badge-primary">{claims.length} Claim{claims.length === 1 ? '' : 's'}</span>
          </div>

          {claims.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              No claims have been submitted for this found item yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claims.map((claim) => (
                <div key={claim.id} className="card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1rem' }}>Claim from: {claim.claimantName}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {claim.claimantEmail} {claim.claimantPhone ? `• ${claim.claimantPhone}` : ''}
                      </p>
                    </div>
                    <span className={`badge badge-${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-page)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Identifying Proof / Details:
                    </p>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                      {claim.message}
                    </p>
                  </div>

                  {claim.reviewMessage && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <strong>Review Note:</strong> {claim.reviewMessage}
                    </div>
                  )}

                  {claim.status === 'PENDING' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        onClick={() => setReviewModal({ isOpen: true, claimId: claim.id, action: 'REJECT', message: '' })}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
                      >
                        <XCircle size={15} /> Reject Claim
                      </button>
                      <button
                        onClick={() => setReviewModal({ isOpen: true, claimId: claim.id, action: 'APPROVE', message: '' })}
                        className="btn btn-success btn-sm"
                      >
                        <CheckCircle size={15} /> Approve Claim
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title="Delete Item Report"
        message="Are you sure you want to permanently delete this report? This will also remove any associated claims and uploaded pictures."
        confirmText="Delete Report"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Return Confirmation Modal */}
      <ConfirmationDialog
        isOpen={returnModalOpen}
        title="Mark Item as Returned"
        message="This will officially mark the item as RETURNED to its owner. Confirm if the item has been recovered."
        confirmText="Confirm Returned"
        confirmVariant="primary"
        loading={actionLoading}
        onConfirm={handleMarkReturned}
        onCancel={() => setReturnModalOpen(false)}
      />

      {/* Claim Review Modal */}
      {reviewModal.isOpen && (
        <div className="modal-overlay" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                {reviewModal.action === 'APPROVE' ? 'Approve Ownership Claim' : 'Reject Ownership Claim'}
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {reviewModal.action === 'APPROVE'
                  ? 'Approving will notify the student and mark the item as CLAIMED. Any other conflicting pending claims will be rejected automatically.'
                  : 'Rejecting will inform the student that the provided description did not verify ownership.'}
              </p>
              <div className="form-group">
                <label className="form-label">Review Note / Instructions (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={reviewModal.action === 'APPROVE' ? "e.g. Please meet at Science Hall Security Desk with photo ID..." : "e.g. The color and model did not match the recovered item."}
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
                {actionLoading ? 'Saving...' : (reviewModal.action === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
