import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Users, Trash2, ArrowLeft, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUsers({ page, size: 10 });
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(true);
    try {
      await adminApi.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      console.error('Failed to change role', err);
      setError(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;
    setActionLoading(true);
    try {
      await adminApi.deleteUser(deleteModal.userId);
      setDeleteModal({ isOpen: false, userId: null, userName: '' });
      fetchUsers();
    } catch (err) {
      console.error('Delete user failed', err);
      setError(err.response?.data?.message || 'Failed to delete user.');
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
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Inspect accounts, manage privileges, and review student activity ({totalElements} users)
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <LoadingSpinner size="lg" label="Loading users directory..." />
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentAdmin?.id;
                  return (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700 }}>{u.name}</span>
                          {isSelf && (
                            <span style={{ fontSize: '0.6875rem', backgroundColor: '#e2e8f0', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={actionLoading || isSelf}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            backgroundColor: u.role === 'ADMIN' ? '#fdf2f8' : '#ffffff',
                            color: u.role === 'ADMIN' ? '#db2777' : 'var(--text-main)',
                            cursor: isSelf ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, userId: u.id, userName: u.name })}
                          className="btn btn-danger-outline btn-sm"
                          disabled={isSelf || actionLoading}
                          title={isSelf ? "Cannot delete own account" : "Delete account"}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
        title="Delete User Account"
        message={`Are you sure you want to permanently delete account "${deleteModal.userName}"? All items and claims posted by this user will also be removed.`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
      />
    </div>
  );
}
