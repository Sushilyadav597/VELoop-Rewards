import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Flame, User, LogOut, Sparkles, History, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStreak } from '../context/StreakContext';
import GemIcon from '../assets/GemIcon';

export const StreakHeader = ({ onOpenAuth, onOpenHistory }) => {
  const { user, wallet, logout, demoLogin } = useAuth();
  const { refreshStreak } = useStreak();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDemoSwitch = async (type) => {
    setDropdownOpen(false);
    try {
      await demoLogin(type);
      await refreshStreak(true);
    } catch (e) {
      console.warn('Demo switch failed:', e.message);
    }
  };

  return (
    <header className="d-flex align-items-center justify-content-between py-2.5 py-md-3 mb-2 mb-md-3">
      {/* Left: Back button + Daily Streak title with fire icon (Section 82 & 84) */}
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate('/');
            }
          }}
          className="btn p-0 text-white border-0 d-flex align-items-center justify-content-center hover-lift"
          aria-label="Go back"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          <ChevronLeft size={22} color="#E2E8F0" />
        </button>

        <div className="d-flex align-items-center gap-1.5">
          <h1
            className="h5 mb-0 fw-extrabold text-white"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.15rem, 3vw, 1.45rem)',
              letterSpacing: '0.3px'
            }}
          >
            Daily Streak
          </h1>
          <span className="d-inline-flex align-items-center" title="Daily Streak Active">
            <Flame
              size={22}
              fill="#F59E0B"
              color="#F59E0B"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }}
            />
          </span>
        </div>
      </div>

      {/* Right: Gem Balance Pill & Account Menu (Section 83) */}
      <div className="d-flex align-items-center gap-2">
        {/* VEs Coin Balance Pill (Desktop) */}
        <div
          className="d-none d-sm-flex align-items-center gap-1.5 px-3 py-1.5 hover-lift"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.12) 100%)',
            border: '1.2px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '999px',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.15)'
          }}
          title="VEs Balance"
        >
          <span style={{ fontSize: '13px' }}>🪙</span>
          <span
            className="fw-bold"
            style={{ color: '#FBBF24', fontFamily: 'var(--font-heading)', fontSize: '0.92rem' }}
          >
            {wallet?.vesBalance ?? 105} VEs
          </span>
        </div>

        {/* Gem Balance Pill (matching the 💎 120 pill in reference Page 62 & 63) */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          role="button"
          tabIndex={0}
          className="d-flex align-items-center gap-2 px-3 py-1.5 hover-lift"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.18) 100%)',
            border: '1.2px solid rgba(167, 139, 250, 0.5)',
            borderRadius: '999px',
            boxShadow: '0 0 16px rgba(139, 92, 246, 0.3)',
            cursor: 'pointer'
          }}
          title="Account & Gem Balance"
        >
          <GemIcon size={18} />
          <span
            className="fw-extrabold text-white"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem' }}
          >
            {wallet?.gemsBalance ?? 120}
          </span>
        </div>

        {/* User Profile / Quick Account Switcher */}
        <div className="position-relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-sm d-flex align-items-center gap-1.5 text-white px-2.5 py-1.5 hover-lift"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '999px'
            }}
            aria-label="User Account Menu"
          >
            <User size={15} className="text-secondary" />
            <span className="small d-none d-md-inline fw-semibold text-truncate" style={{ maxWidth: '100px' }}>
              {user ? (user.name || user.username) : 'Account'}
            </span>
          </button>

          {dropdownOpen && (
            <div
              className="position-absolute end-0 mt-2 py-2 shadow-lg"
              style={{
                backgroundColor: '#140c34',
                border: '1.2px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '16px',
                width: '230px',
                zIndex: 1050,
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)'
              }}
            >
              <div className="px-3 py-1.5 mb-1 border-bottom border-secondary border-opacity-25">
                <p className="mb-0 small fw-bold text-white text-truncate">{user?.name || user?.username || 'Guest'}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{user?.role || 'TESTER'}</p>
              </div>

              {/* Navigation Links */}
              <button
                onClick={() => { setDropdownOpen(false); onOpenHistory ? onOpenHistory() : navigate('/streak-history'); }}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <History size={14} className="text-purple-300" /> View Check-In History
              </button>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/wallet'); }}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Wallet size={14} className="text-warning" /> Open Wallet Ledger
              </button>

              <div className="dropdown-divider my-1 border-secondary border-opacity-25" />

              {/* Quick Persona Switcher for Evaluation */}
              <div className="px-3 py-1 text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quick Test Personas
              </div>
              <button
                onClick={() => handleDemoSwitch('new')}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Sparkles size={14} className="text-info" /> Day 1 New User
              </button>
              <button
                onClick={() => handleDemoSwitch('day2')}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Sparkles size={14} className="text-warning" /> Day 2 Active User
              </button>
              <button
                onClick={() => handleDemoSwitch('vip')}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Sparkles size={14} className="text-success" /> Day 7 VIP User
              </button>

              <div className="dropdown-divider my-1 border-secondary border-opacity-25" />

              {user ? (
                <button
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  className="dropdown-item px-3 py-2 text-danger small d-flex align-items-center gap-2"
                >
                  <LogOut size={14} /> Log out
                </button>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setDropdownOpen(false); }}
                  className="dropdown-item px-3 py-2 text-info small d-flex align-items-center gap-2"
                >
                  <User size={14} /> Log In / Register
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StreakHeader;
