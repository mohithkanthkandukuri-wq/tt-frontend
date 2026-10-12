import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { FileText, Trash2, Eye, ArrowLeft, Tag } from 'lucide-react';

export default function AdminReportsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null, itemTitle: '' });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getItems({ page, size: 10 });
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load items', err);
      setError('Failed to fetch system reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleDeleteItem = async () => {
    if (!deleteModal.itemId) return;
    setActionLoading(true);
    try {
      await adminApi.deleteItem(deleteModal.itemId);
      setDeleteModal({ isOpen: false, itemId: null, itemTitle: '' });
      fetchItems();
    } catch (err) {
      console.error('Delete item failed', err);
      setError('Failed to delete item.');
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
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Report Moderation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Moderate and manage all campus lost and found listings ({totalElements} reports)
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <LoadingSpinner size="lg" label="Loading reports catalog..." />
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Reporter</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><strong>#{item.id}</strong></td>
                    <td>
                      <Link to={`/items/${item.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${item.reportType === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                        {item.reportType}
                      </span>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.reporterName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{item.reporterEmail}</span>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} /> View
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, itemId: item.id, itemTitle: item.title })}
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
        title="Delete Item Report"
        message={`Are you sure you want to permanently delete report "${deleteModal.itemTitle}"?`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteModal({ isOpen: false, itemId: null, itemTitle: '' })}
      />
    </div>
  );
}
