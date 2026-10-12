import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { CheckCircle2, Trash2, Eye, ArrowLeft } from 'lucide-react';

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, claimId: null });

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getClaims({ page, size: 10 });
      setClaims(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load claims', err);
      setError('Failed to fetch claims list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [page]);

  const handleDeleteClaim = async () => {
    if (!deleteModal.claimId) return;
    setActionLoading(true);
    try {
      await adminApi.deleteClaim(deleteModal.claimId);
      setDeleteModal({ isOpen: false, claimId: null });
      fetchClaims();
    } catch (err) {
      console.error('Delete claim failed', err);
      setError('Failed to delete claim.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Link
        to="/admin"
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
        <ArrowLeft size={16} /> Back to Admin Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Claims Moderation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Review, supervise, and moderate all ownership claims across campus ({totalElements} claims)
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <LoadingSpinner size="lg" label="Loading claims registry..." />
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Target Item</th>
                  <th>Claimant</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Reviewer</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td><strong>#{claim.id}</strong></td>
                    <td>
                      <Link to={`/items/${claim.itemId}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {claim.itemTitle}
                      </Link>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{claim.claimantName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{claim.claimantEmail}</span>
                    </td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${claim.status.toLowerCase()}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>{claim.reviewedByName || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to={`/claims/${claim.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} /> Review
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, claimId: claim.id })}
                          className="btn btn-danger-outline btn-sm"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteModal.isOpen}
        title="Delete Ownership Claim"
        message="Are you sure you want to permanently delete this claim?"
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteClaim}
        onCancel={() => setDeleteModal({ isOpen: false, claimId: null })}
      />
    </div>
  );
}
