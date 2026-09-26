import React from 'react';
import styles from '../styles/globals.module.css';

/**
 * LoadingState Component (Step 9 Polish):
 * Premium loader with purple accent glow and accessible status role.
 */
export const LoadingState = ({ message = 'Synchronizing with rewards engine...', fullPage = false }) => {
  const containerStyle = fullPage
    ? { minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }
    : { padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' };

  return (
    <div style={containerStyle} role="status" aria-live="polite">
      <div
        style={{
          width: '52px',
          height: '52px',
          border: '4px solid rgba(139, 92, 246, 0.2)',
          borderTop: '4px solid var(--primary-accent)',
          borderRight: '4px solid var(--reward-gold)',
          borderRadius: '50%',
          animation: 'spinLoader 0.75s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite',
          boxShadow: '0 0 16px rgba(139, 92, 246, 0.35)'
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
          {message}
        </p>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: '0.2rem', display: 'block' }}>
          VELoop Rewards Daily Streak System
        </span>
      </div>
      <style>{`
        @keyframes spinLoader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
