import React, { useState } from 'react';
import { ChevronLeft, Flame, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GemIcon from '../assets/GemIcon';

export const StreakHeader = ({ onOpenAuth, onOpenHistory }) => {
  const { user, wallet, logout, demoLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="d-flex align-items-center justify-content-between py-3 px-2 px-md-4 mb-3">
      {/* Left: Back button + Daily Streak title with fire icon */}
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="btn p-1 text-white border-0 bg-transparent d-flex align-items-center justify-content-center"
          aria-label="Go back"
          style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <ChevronLeft size={22} />
        </button>

        <div className="d-flex align-items-center gap-2">
          <h1 className="h5 mb-0 fw-bold text-white tracking-wide" style={{ letterSpacing: '0.3px' }}>
            Daily Streak
          </h1>
          <span className="d-inline-flex align-items-center text-warning" title="Streak active">
            <Flame size={20} fill="#F59E0B" color="#F59E0B" />
          </span>
        </div>
      </div>

      {/* Right: Gem Balance Pill + User profile */}
      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* Gem Balance Pill (matching the 120 Gem pill on Page 62 & 63) */}
        <div
          className="d-flex align-items-center gap-2 px-3 py-1"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.35)',
            borderRadius: '999px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)'
          }}
          title="Your Gem Balance (derived from backend)"
        >
          <GemIcon size={18} />
          <span className="fw-bold text-white small" style={{ fontSize: '0.95rem' }}>
            {wallet?.gemsBalance ?? 120}
          </span>
        </div>

        {/* User Profile / Account Switcher */}
        <div className="position-relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-sm d-flex align-items-center gap-1 text-white px-2 py-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '999px'
            }}
          >
            <User size={15} className="text-secondary" />
            <span className="small d-none d-sm-inline fw-semibold">
              {user ? user.username : 'Account'}
            </span>
          </button>

          {dropdownOpen && (
            <div
              className="position-absolute end-0 mt-2 py-2 shadow-lg"
              style={{
                backgroundColor: '#150f38',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                width: '200px',
                zIndex: 1000
              }}
            >
              <div className="px-3 py-1 mb-1 border-bottom border-secondary border-opacity-25">
                <p className="mb-0 small fw-bold text-white">{user?.name || user?.username || 'Guest'}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{user?.role || 'USER'}</p>
              </div>

              <button
                onClick={() => { demoLogin('new'); setDropdownOpen(false); }}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Sparkles size={14} className="text-info" /> Switch to Day 1 User
              </button>
              <button
                onClick={() => { demoLogin('day2'); setDropdownOpen(false); }}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Sparkles size={14} className="text-warning" /> Switch to Day 2 User
              </button>
              <button
                onClick={() => { demoLogin('vip'); setDropdownOpen(false); }}
                className="dropdown-item px-3 py-2 text-white small d-flex align-items-center gap-2 hover-bg"
              >
                <Sparkles size={14} className="text-success" /> Switch to VIP Day 7 User
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
