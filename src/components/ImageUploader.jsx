import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ onFileSelect, initialImageUrl = null, onClear }) {
  const [preview, setPreview] = useState(initialImageUrl);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid image format. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) {
      onClear();
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
      />

      {preview ? (
        <div style={{
          position: 'relative',
          width: '100%',
          maxHeight: '260px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          backgroundColor: '#0f172a'
        }}>
          <img
            src={preview}
            alt="Upload preview"
            style={{ width: '100%', height: '260px', objectFit: 'contain' }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.85)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-focus)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            backgroundColor: '#f8faff',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <Upload size={22} />
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Click to upload an image
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            JPEG, PNG, or WebP up to 5MB
          </p>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
