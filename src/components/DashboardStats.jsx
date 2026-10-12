import React from 'react';

export default function DashboardStats({ icon: Icon, title, value, color = 'var(--primary)', bgColor = 'var(--primary-light)', subtitle = null }) {
  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        width: '3.25rem',
        height: '3.25rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: bgColor,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {Icon && <Icon size={26} strokeWidth={2.2} />}
      </div>

      <div>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
          {title}
        </p>
        <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.2' }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
