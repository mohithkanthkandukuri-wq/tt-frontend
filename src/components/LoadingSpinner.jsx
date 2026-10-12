import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', label = null }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      color: 'var(--primary)'
    }}>
      <Loader2 size={sizeMap[size] || 24} className="animate-spin" />
      {label && (
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
}
