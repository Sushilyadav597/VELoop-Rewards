import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ErrorState from '../components/ErrorState';
import styles from '../styles/globals.module.css';

/**
 * Login Page (Step 9 Polish):
 * Production-ready authentication form with password visibility toggle,
 * input validation, loading state, and error handling.
 */
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [apiError, setApiError] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // If already logged in, redirect immediately to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setApiError(null);

    const trimmedIdentifier = email.trim();
    if (!trimmedIdentifier) {
      setFormError('Please enter your email address or username.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedIdentifier, password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantSushilLogin = async () => {
    setLoading(true);
    setFormError('');
    setApiError(null);
    try {
      await login('sushilyadav0622@gmail.com', 'password123');
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 90px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className={styles.glassCard}
        style={{
          maxWidth: '430px',
          width: '100%',
          padding: '2.75rem 2.25rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: '0.4rem', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' }}>
            ⚡
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Sign in to claim today's streak reward and maintain your active streak.
          </p>
        </div>

        {formError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.14)',
              border: '1px solid var(--danger-color)',
              color: '#fca5a5',
              borderRadius: '8px',
              fontSize: '0.88rem',
              marginBottom: '1.4rem'
            }}
            role="alert"
          >
            {formError}
          </div>
        )}

        {apiError && (
          <ErrorState
            error={apiError}
            status={apiError.status}
            title="Sign In Failed"
            onDismiss={() => setApiError(null)}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.35rem' }}>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              Email Address, Name, or Username
            </label>
            <input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sushilyadav0622@gmail.com or Sushil Yadav"
              required
              className={styles.formInput}
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label
                htmlFor="login-password"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-glow)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
                tabIndex="-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.formInput}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            {loading ? 'Signing In...' : 'Sign In ⚡'}
          </button>

          {/* 1-Click Instant Sign In Button for Sushil */}
          <button
            type="button"
            onClick={handleInstantSushilLogin}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.75rem',
              padding: '0.75rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              color: '#fbbf24',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ⚡ 1-Click Sign In as Sushil Yadav
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-glow)', fontWeight: 700, textDecoration: 'none' }}>
            Create one now &rarr;
          </Link>
        </div>

        {/* Quick Demo Test Accounts */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.9rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px dashed var(--border-subtle)',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>💡 Quick Autofill Accounts:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setEmail('Sushil Yadav');
                setPassword('password123');
                setFormError('');
                setApiError(null);
              }}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fcd34d',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Sushil Yadav
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('new@veloop.io');
                setPassword('password123');
                setFormError('');
                setApiError(null);
              }}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#a5b4fc',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              demo_new (new@veloop.io)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('day2@veloop.io');
                setPassword('password123');
                setFormError('');
                setApiError(null);
              }}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#93c5fd',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              demo_day2 (day2@veloop.io)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
