import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

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

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
      page: 0 // reset page on filter change
    });
  };

  return (
    <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
          <Filter size={18} color="var(--primary)" />
          <span>Filters & Sorting</span>
        </div>

        <button
          onClick={onReset}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.75rem', gap: '0.25rem' }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        {/* Report Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={filters.reportType || ''}
            onChange={(e) => handleChange('reportType', e.target.value || null)}
          >
            <option value="">All Types (Lost & Found)</option>
            <option value="LOST">Lost Belongings</option>
            <option value="FOUND">Found Belongings</option>
          </select>
        </div>

        {/* Category */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value || null)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value || null)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLAIM_PENDING">Claim Pending</option>
            <option value="CLAIMED">Claimed</option>
            <option value="RETURNED">Returned</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Library, Cafeteria"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sort By</label>
          <select
            className="form-select"
            value={filters.sort || 'createdAt,desc'}
            onChange={(e) => handleChange('sort', e.target.value)}
          >
            <option value="createdAt,desc">Newest First</option>
            <option value="createdAt,asc">Oldest First</option>
            <option value="title,asc">Title (A - Z)</option>
            <option value="title,desc">Title (Z - A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
