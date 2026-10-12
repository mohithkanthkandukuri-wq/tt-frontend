import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';

const CATEGORIES = [
  'Electronics',
  'Bags',
  'Documents and ID cards',
  'Books and stationery',
  'Clothing',
  'Accessories',
  'Keys',
  'Other'
];

export default function ItemForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  forcedReportType = null,
  loading = false
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || 'Electronics',
    reportType: forcedReportType || initialData.reportType || 'LOST',
    location: initialData.location || '',
    incidentDate: initialData.incidentDate || new Date().toISOString().split('T')[0],
    description: initialData.description || '',
    status: initialData.status || 'OPEN',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteExistingImage, setDeleteExistingImage] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData, selectedFile, deleteExistingImage);
  };

  const existingImageUrl = initialData.imagePath && !deleteExistingImage
    ? `/api/items/images/${initialData.imagePath}`
    : null;

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '750px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Title */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Item Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. TI-84 Plus Calculator, Blue North Face Backpack"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        {/* Report Type */}
        <div className="form-group">
          <label className="form-label">Report Type *</label>
          {forcedReportType ? (
            <input
              type="text"
              className="form-input"
              value={forcedReportType === 'LOST' ? 'Lost Item' : 'Found Item'}
              disabled
              style={{ backgroundColor: '#f1f5f9', fontWeight: 600 }}
            />
          ) : (
            <select
              className="form-select"
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
            >
              <option value="LOST">Lost Item (I lost this)</option>
              <option value="FOUND">Found Item (I found this)</option>
            </select>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">Campus Location *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Science Hall Rm 204, Library 2nd Fl"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        {/* Incident Date */}
        <div className="form-group">
          <label className="form-label">Date Lost / Found *</label>
          <input
            type="date"
            className="form-input"
            value={formData.incidentDate}
            onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
          />
          {errors.incidentDate && <p className="form-error">{errors.incidentDate}</p>}
        </div>

        {/* Status (If Edit mode) */}
        {isEdit && (
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Report Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="OPEN">OPEN (Actively searching / unclaimed)</option>
              <option value="CLAIM_PENDING">CLAIM PENDING (Under review)</option>
              <option value="CLAIMED">CLAIMED (Claim approved)</option>
              <option value="RETURNED">RETURNED (Successfully restored to owner)</option>
              <option value="CLOSED">CLOSED (Resolved / archived)</option>
            </select>
          </div>
        )}

        {/* Description */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Detailed Description *</label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Provide distinguishing features, color, brand, condition, stickers, markings, or contents..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>

        {/* Image Uploader */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Item Photograph (Optional)</label>
          <ImageUploader
            initialImageUrl={existingImageUrl}
            onFileSelect={(file) => {
              setSelectedFile(file);
              setDeleteExistingImage(false);
            }}
            onClear={() => {
              setSelectedFile(null);
              setDeleteExistingImage(true);
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%', maxWidth: '240px' }}
        >
          {loading ? <LoadingSpinner size="sm" /> : (isEdit ? 'Save Changes' : 'Submit Report')}
        </button>
      </div>
    </form>
  );
}
