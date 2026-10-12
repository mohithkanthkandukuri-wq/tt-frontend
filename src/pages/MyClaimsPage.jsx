import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimsApi } from '../services/api';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { CheckCircle2, Eye, XCircle, ArrowRight } from 'lucide-react';

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cancelModal, setCancelModal] = useState({ isOpen: false, claimId: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await claimsApi.getMyClaims({ page, size: 10 });
      setClaims(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching claims', err);
      setError('Failed to load your claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClaims();
  }, [page]);

  const handleCancelClaim = async () => {
    if (!cancelModal.claimId) return;
    setActionLoading(true);
    try {
      await claimsApi.cancelClaim(cancelModal.claimId);
      setCancelModal({ isOpen: false, claimId: null });
      fetchMyClaims();
    } catch (err) {
      console.error('Cancel claim failed', err);
      setError('Failed to cancel claim.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Ownership Claims</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Track the status of claims you submitted for found items ({totalElements} total)
          </p>
        </div>

        <Link to="/browse?reportType=FOUND" className="btn btn-primary btn-sm">
          Browse Found Items
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <LoadingSpinner size="lg" label="Loading your claims..." />
        </div>
      ) : claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Claims Submitted Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9375rem' }}>
            If you see an item in the directory that belongs to you, open its page and submit an ownership claim.
          </p>
          <Link to="/browse?reportType=FOUND" className="btn btn-secondary">
            Search Found Items
          </Link>
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Item Title</th>
                  <th>Category</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Review Note</th>
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
                    <td>{claim.itemCategory}</td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${claim.status.toLowerCase()}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: claim.reviewMessage ? 'var(--text-main)' : 'var(--text-light)' }}>
                        {claim.reviewMessage || 'Awaiting review'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to={`/claims/${claim.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} /> View
                        </Link>
                        {claim.status === 'PENDING' && (
                          <button
                            onClick={() => setCancelModal({ isOpen: true, claimId: claim.id })}
                            className="btn btn-danger-outline btn-sm"
                            title="Cancel claim"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
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

      {/* Cancel dialog */}
      <ConfirmationDialog
        isOpen={cancelModal.isOpen}
        title="Cancel Claim"
        message="Are you sure you want to cancel this pending claim?"
        confirmText="Cancel Claim"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleCancelClaim}
        onCancel={() => setCancelModal({ isOpen: false, claimId: null })}
      />
    </div>
  );
}
