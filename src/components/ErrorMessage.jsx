import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry = null }) {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      color: '#b91c1c',
      margin: '1rem 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} color="#dc2626" />
        <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{message}</span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline btn-sm"
          style={{ borderColor: '#fca5a5', color: '#b91c1c', backgroundColor: '#ffffff' }}
        >
          <RotateCcw size={14} /> Retry
        </button>
      )}
    </div>
  );
}
