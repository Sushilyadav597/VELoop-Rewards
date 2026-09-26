import React from 'react';
import styles from '../styles/globals.module.css';

/**
 * ErrorState Component (Step 9 Polish):
 * Context-aware error alerts handling 401, 403, 404, 409 conflict, and 500 server errors.
 */
export const ErrorState = ({
  error,
  status,
  onRetry,
  onDismiss,
  title = 'System Notice'
}) => {
  let displayTitle = title;
  let displayMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';

  const statusCode = status || error?.status || error?.statusCode;

  // Contextual title and messaging based on HTTP status codes
  if (statusCode === 401) {
    displayTitle = 'Session Expired';
    displayMessage = 'Your authentication session has expired or is invalid. Please log in again to continue.';
  } else if (statusCode === 403) {
    displayTitle = 'Action Restricted';
    displayMessage = 'You do not have authorization to perform this operation.';
  } else if (statusCode === 404) {
    displayTitle = 'Resource Unavailable';
    displayMessage = 'The requested streak or wallet record could not be found.';
  } else if (statusCode === 409) {
    displayTitle = 'Claim Conflict';
    displayMessage = error?.message || 'This reward has already been claimed or another claim request is currently processing.';
  } else if (statusCode >= 500) {
    displayTitle = 'Rewards Engine Temporarily Unavailable';
    displayMessage = 'The server encountered an error processing your request. Please try again in a few moments.';
  } else if (displayMessage.toLowerCase().includes('network') || displayMessage.toLowerCase().includes('failed to fetch')) {
    displayTitle = 'Network Connection Issue';
    displayMessage = 'Unable to reach the VELoop Rewards API. Please verify your internet connection.';
  }

  return (
    <div
      className={styles.glassCard}
      style={{
        borderLeft: '4px solid var(--danger-color)',
        padding: '1.25rem 1.6rem',
        margin: '1.25rem 0',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderRadius: '12px'
      }}
      role="alert"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h4 style={{ color: 'var(--danger-color)', fontSize: '1.05rem', margin: '0 0 0.35rem 0', fontWeight: 700 }}>
            ⚠️ {displayTitle}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            {displayMessage}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.35rem',
              padding: '0 0.4rem',
              lineHeight: 1
            }}
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            &times;
          </button>
        )}
      </div>

      {onRetry && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={onRetry}
            style={{
              padding: '0.45rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid var(--danger-color)',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
