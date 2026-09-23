import React, { useState } from 'react';
import { X, Lock, User, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStreak } from '../context/StreakContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, demoLogin } = useAuth();
  const { refreshStreak } = useStreak();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
      } else {
        await register(formData);
      }
      await refreshStreak(true);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSwitch = async (type) => {
    setLoading(true);
    try {
      await demoLogin(type);
      await refreshStreak(true);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(5, 3, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1080
      }}
    >
      <div
        className="card border-0 p-4 position-relative"
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: '#150f38',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
        }}
      >
        <button
          onClick={onClose}
          className="btn btn-sm text-secondary position-absolute top-0 end-0 m-3 p-1 border-0"
        >
          <X size={18} />
        </button>

        <h4 className="fw-bold text-white mb-1">
          {mode === 'login' ? 'Sign In to VELoop' : 'Create Member Account'}
        </h4>
        <p className="text-secondary small mb-3">
          Daily Streak progress is securely saved to your account in MongoDB.
        </p>

        {error && (
          <div className="alert alert-danger py-2 small mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-2">
              <label className="text-muted small mb-1">Full Name</label>
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white border-secondary border-opacity-50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Mercer"
              />
            </div>
          )}

          <div className="mb-2">
            <label className="text-muted small mb-1">Username</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                <User size={14} />
              </span>
              <input
                type="text"
                required
                className="form-control bg-dark text-white border-secondary border-opacity-50"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="mb-2">
              <label className="text-muted small mb-1">Email</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  className="form-control bg-dark text-white border-secondary border-opacity-50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@veloop.io"
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="text-muted small mb-1">Password</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-dark border-secondary border-opacity-50 text-muted">
                <Lock size={14} />
              </span>
              <input
                type="password"
                required
                className="form-control bg-dark text-white border-secondary border-opacity-50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 py-2 fw-bold text-dark border-0 mb-2"
            style={{
              background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: '12px'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-2">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
          <span className="text-muted d-block small mb-2" style={{ fontSize: '0.72rem' }}>
            OR TEST WITH INSTANT PRE-SEEDED ACCOUNTS
          </span>
          <div className="d-flex justify-content-center gap-2">
            <button
              onClick={() => handleDemoSwitch('new')}
              className="btn btn-sm btn-outline-secondary small px-2 py-1"
            >
              Day 1 New
            </button>
            <button
              onClick={() => handleDemoSwitch('day2')}
              className="btn btn-sm btn-outline-warning small px-2 py-1"
            >
              Day 2 Active
            </button>
            <button
              onClick={() => handleDemoSwitch('vip')}
              className="btn btn-sm btn-outline-info small px-2 py-1"
            >
              Day 7 VIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
