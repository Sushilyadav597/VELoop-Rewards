import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ErrorState from '../components/ErrorState';
import crownImg from '../assets/images/Top_right.png';
import coinsImg from '../assets/images/VEs_Coin.png';
import styles from '../styles/globals.module.css';

/**
 * Register Page:
 * Clean registration form with official VELoop 3D assets,
 * input validation, loading state, and 1-click test setup.
 */
export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [apiError, setApiError] = useState(null);

  const { register, isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect immediately to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        className={styles.glassCard}
        style={{
          maxWidth: '440px',
          width: '100%',
          margin: 'auto',
          padding: '2.5rem 2rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <img
              src={crownImg}
              alt="VIP Crown"
              style={{
                width: '62px',
                height: '62px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 18px rgba(245, 158, 11, 0.8))'
              }}
              className="anim-float"
            />
            <img
              src={coinsImg}
              alt="VEs Coins"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.7))'
              }}
              className="anim-float"
            />
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
            title="Registration Failed"
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
              placeholder="At least 6 characters"
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

        {/* Instant 1-Click Evaluator Personas */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px dashed rgba(139, 92, 246, 0.4)',
            fontSize: '0.82rem',
            textAlign: 'center'
          }}
        >
          <div style={{ color: '#C4B5FD', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.78rem' }}>
            ⚡ Instant 1-Click Evaluator Personas:
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={async () => {
                await demoLogin('new');
                navigate('/dashboard');
              }}
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid #8B5CF6',
                color: '#C4B5FD',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Day 1 New
            </button>
            <button
              type="button"
              onClick={async () => {
                await demoLogin('day2');
                navigate('/dashboard');
              }}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid #F59E0B',
                color: '#FBBF24',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Day 2 Active
            </button>
            <button
              type="button"
              onClick={async () => {
                await demoLogin('vip');
                navigate('/dashboard');
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10B981',
                color: '#34D399',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Day 7 VIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
