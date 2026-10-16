import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from '../styles/globals.module.css';

/**
 * NotFound (404 Page):
 * Clean, modern 404 error page preventing redirect loops
 * and providing direct navigation back to Dashboard or Register.
 */
export const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        className={styles.glassCard}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '3rem 2.25rem',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.8rem',
            letterSpacing: '-0.03em'
          }}
        >
          404
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.85rem',
            borderRadius: '999px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.25rem'
          }}
        >
          Page Not Found
        </div>

        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}
        >
          Lost in Space?
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.94rem',
            lineHeight: 1.55,
            marginBottom: '2rem'
          }}
        >
          The page or resource you are looking for does not exist, has been moved, or the link may be broken.
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            &larr; Go Back
          </button>

          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className={styles.primaryButton}
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.92rem', textDecoration: 'none' }}
          >
            {isAuthenticated ? 'Dashboard ⚡' : 'Go to Register 🚀'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
