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

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setApiError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedEmail, password);
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
            onDismiss={() => setApiError(null)}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.35rem' }}>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={styles.formInput}
              autoComplete="email"
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
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.85rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-glow)', fontWeight: 700, textDecoration: 'none' }}>
            Create one now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
