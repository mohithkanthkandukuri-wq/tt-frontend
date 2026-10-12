import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsApi } from '../services/api';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusCircle, Edit3, Trash2, Eye, CheckCircle, Tag, ArrowRight } from 'lucide-react';

export default function MyReportsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemsApi.getMyItems({ page, size: 10 });
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching my reports', err);
      setError('Failed to load your reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, [page]);

  const handleDelete = async () => {
    if (!deleteModal.itemId) return;
    setActionLoading(true);
    try {
      await itemsApi.deleteItem(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null });
      fetchMyReports();
    } catch (err) {
      console.error('Delete failed', err);
      setError('Failed to delete report.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Reported Items</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Manage the lost and found items you have posted ({totalElements} total)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/report-lost" className="btn btn-danger btn-sm">
            <PlusCircle size={16} /> Report Lost
          </Link>
          <Link to="/report-found" className="btn btn-success btn-sm">
            <PlusCircle size={16} /> Report Found
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <LoadingSpinner size="lg" label="Loading your reports..." />
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>You haven't reported any items yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9375rem' }}>
            If you lost or found something on campus, file a quick report to help reconnect with the owner.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/report-lost" className="btn btn-danger">Report Lost</Link>
            <Link to="/report-found" className="btn btn-success">Report Found</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Location & Date</th>
                  <th>Status</th>
                  <th>Claims</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '6px',
                          backgroundColor: '#f1f5f9',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.imagePath ? (
                            <img
                              src={`/api/items/images/${item.imagePath}`}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Tag size={18} color="#94a3b8" />
                          )}
                        </div>
                        <div>
                          <Link to={`/items/${item.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.title}
                          </Link>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.reportType === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                        {item.reportType}
                      </span>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span style={{ display: 'block', fontWeight: 600 }}>{item.location}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.incidentDate}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.reportType === 'FOUND' ? (
                        <span style={{ fontWeight: item.claimCount > 0 ? 700 : 400, color: item.claimCount > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {item.claimCount} claim{item.claimCount === 1 ? '' : 's'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm" title="View details">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/items/${item.id}/edit`} className="btn btn-outline btn-sm" title="Edit report">
                          <Edit3 size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, itemId: item.id })}
                          className="btn btn-danger-outline btn-sm"
                          title="Delete report"
                        >
                          <Trash2 size={14} />
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

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        isOpen={deleteModal.isOpen}
        title="Delete Report"
        message="Are you sure you want to permanently delete this report?"
        confirmText="Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, itemId: null })}
      />
    </div>
  );
}
