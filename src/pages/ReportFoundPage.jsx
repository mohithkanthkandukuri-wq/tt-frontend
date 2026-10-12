import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { itemsApi } from '../services/api';
import ItemForm from '../components/ItemForm';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle, ArrowLeft } from 'lucide-react';

export default function ReportFoundPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData, imageFile) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create found item
      const res = await itemsApi.createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        reportType: 'FOUND',
        location: formData.location,
        incidentDate: formData.incidentDate
      });

      const newItem = res.data;

      // 2. Upload image if selected
      if (imageFile) {
        try {
          await itemsApi.uploadImage(newItem.id, imageFile);
        } catch (imgErr) {
          console.error('Image upload failed', imgErr);
        }
      }

      navigate(`/items/${newItem.id}`);
    } catch (err) {
      console.error('Failed to report found item', err);
      setError(err.response?.data?.message || 'Failed to submit report. Please check input fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
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
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: '#059669',
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.25rem'
        }}>
          <PlusCircle size={16} /> Found Property
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Report a Found Item</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Thank you for helping our campus community! Report what you found so the rightful owner can submit a claim.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <ItemForm
        forcedReportType="FOUND"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
