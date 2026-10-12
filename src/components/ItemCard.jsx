import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ItemCard({ item }) {
  if (!item) return null;

  const isLost = item.reportType === 'LOST';
  const imageUrl = item.imagePath ? `/api/items/images/${item.imagePath}` : null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge-open">Open</span>;
      case 'CLAIM_PENDING':
        return <span className="badge badge-claim-pending">Claim Pending</span>;
      case 'CLAIMED':
        return <span className="badge badge-claimed">Claimed</span>;
      case 'RETURNED':
        return <span className="badge badge-returned">Returned</span>;
      case 'CLOSED':
        return <span className="badge badge-closed">Closed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="card card-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* Image container */}
      <div style={{
        position: 'relative',
        height: '180px',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('fallback-bg');
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#94a3b8'
          }}>
            <Tag size={36} strokeWidth={1.5} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>No Image Provided</span>
          </div>
        )}

        {/* Report Type Pill */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {item.reportType}
          </span>
        </div>

        {/* Status Pill */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          {getStatusBadge(item.status)}
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-light)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px'
          }}>
            {item.category}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: 'var(--text-main)',
          lineHeight: '1.3'
        }}>
          <Link to={`/items/${item.id}`} style={{ color: 'inherit' }}>
            {item.title}
          </Link>
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.description}
        </p>

        {/* Meta Info */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <MapPin size={15} color="var(--primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.location}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={15} color="#64748b" />
              <span>{item.incidentDate || 'Recently'}</span>
            </div>

            <Link
              to={`/items/${item.id}`}
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
