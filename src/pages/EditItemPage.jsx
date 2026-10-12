import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsApi } from '../services/api';
import ItemForm from '../components/ItemForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Edit3, ArrowLeft } from 'lucide-react';

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
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
        setError('Failed to load item report.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (formData, newImageFile, deleteExistingImage) => {
    setSubmitting(true);
    setError(null);
    try {
      // 1. Update details
      await itemsApi.updateItem(id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        reportType: formData.reportType,
        location: formData.location,
        incidentDate: formData.incidentDate,
        status: formData.status
      });

      // 2. Handle image updates
      if (newImageFile) {
        await itemsApi.uploadImage(id, newImageFile);
      } else if (deleteExistingImage) {
        await itemsApi.deleteImage(id);
      }

      navigate(`/items/${id}`);
    } catch (err) {
      console.error('Update failed', err);
      setError(err.response?.data?.message || 'Failed to update report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <LoadingSpinner size="lg" label="Loading report data..." />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
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
        <ArrowLeft size={16} /> Back to Item Details
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
          <Edit3 size={16} /> Modify Report
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Edit Item Report</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Update item description, campus location, or status
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {item && (
        <ItemForm
          initialData={item}
          isEdit={true}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      )}
    </div>
  );
}
