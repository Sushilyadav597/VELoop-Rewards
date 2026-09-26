import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ErrorState from '../components/ErrorState';
import styles from '../styles/globals.module.css';

/**
 * Register Page (Step 9 Polish):
 * Clean registration form with password visibility toggle,
 * input validation, loading state, and auto-login redirection.
 */
export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [apiError, setApiError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setApiError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(trimmedName, trimmedEmail, password);
      navigate('/dashboard', { replace: true });
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
          maxWidth: '440px',
          width: '100%',
          padding: '2.75rem 2.25rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: '0.4rem', filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' }}>
            🌟
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Join VELoop Rewards
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Start your daily streak journey today and unlock VEs coins and Amazon Gift Vouchers!
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
              htmlFor="register-name"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              required
              className={styles.formInput}
              autoComplete="name"
            />
          </div>

          <div style={{ marginBottom: '1.35rem' }}>
            <label
              htmlFor="register-email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              Email Address
            </label>
            <input
              id="register-email"
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
                htmlFor="register-password"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Password (min. 6 characters)
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
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.formInput}
              autoComplete="new-password"
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
            {loading ? 'Creating Account...' : 'Create Account 🚀'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.85rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-glow)', fontWeight: 700, textDecoration: 'none' }}>
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
