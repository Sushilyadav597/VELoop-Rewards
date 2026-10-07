import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Flame, User, LogOut, ChevronDown, Trophy, Target, Gift, Award, LayoutDashboard, Menu, X, Coins } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useStreak } from '../context/StreakContext';
import NotificationCenter from './NotificationCenter';
import AnimatedCounter from './AnimatedCounter';

export const Navbar = () => {
  const { user, wallet, isAuthenticated, logout, demoLogin } = useAuth();
  const { streak, refreshStreak } = useStreak();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleDemoSwitch = async (type) => {
    setProfileDropdownOpen(false);
    try {
      await demoLogin(type);
      if (refreshStreak) await refreshStreak(true);
    } catch (e) {
      console.warn('Demo switch failed:', e.message);
    }
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    borderRadius: '10px',
    fontSize: '0.86rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#FFFFFF' : '#94A3B8',
    background: isActive ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
    border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.18s ease'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(8, 5, 22, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <NavLink
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#FFFFFF'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(139, 92, 246, 0.45)'
              }}
            >
              <Sparkles size={18} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              VELoop<span style={{ color: '#F59E0B' }}>Rewards</span>
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-1">
            <NavLink to="/dashboard" style={navLinkStyle}>
              <LayoutDashboard size={15} /> Dashboard
            </NavLink>
            <NavLink to="/daily-streak" style={navLinkStyle}>
              <Flame size={15} color="#F59E0B" /> Daily Streak
            </NavLink>
            <NavLink to="/tasks" style={navLinkStyle}>
              <Target size={15} color="#10B981" /> Tasks
            </NavLink>
            <NavLink to="/leaderboard" style={navLinkStyle}>
              <Trophy size={15} color="#FBBF24" /> Leaderboard
            </NavLink>
            <NavLink to="/wallet" style={navLinkStyle}>
              <Gift size={15} color="#A78BFA" /> Wallet
            </NavLink>
            <NavLink to="/badges" style={navLinkStyle}>
              <Award size={15} color="#38BDF8" /> Badges
            </NavLink>
          </nav>
        </div>

        {/* Right Section: Stats Pills, Notifications, Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Animated Total Points Counter Pill */}
          <div
            onClick={() => navigate('/wallet')}
            className="hover-lift"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.1) 100%)',
              border: '1.2px solid rgba(245, 158, 11, 0.45)',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.15)'
            }}
            title="Total Rewards Points Vault"
          >
            <span style={{ fontSize: '13px' }}>🪙</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FBBF24' }}>
              <AnimatedCounter value={wallet?.vesBalance ?? 2450} suffix=" VEs" />
            </span>
          </div>

          {/* Streak Flame Counter Pill */}
          <div
            onClick={() => navigate('/daily-streak')}
            className="d-none d-sm-flex hover-lift"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.12) 100%)',
              border: '1.2px solid rgba(139, 92, 246, 0.45)'
            }}
            title="Current Streak"
          >
            <Flame size={15} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>
              {streak?.currentStreak ?? 7}d
            </span>
          </div>

          {/* Elegant Notification Center */}
          <NotificationCenter />

          {/* User Account / Persona Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="btn-press"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
              aria-label="User Account Menu"
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="d-none d-md-inline" style={{ fontSize: '0.84rem', fontWeight: 700, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Explorer'}
              </span>
              <ChevronDown size={14} color="#94A3B8" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#120D2E',
                  border: '1.5px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.65)',
                  padding: '8px 0',
                  zIndex: 1050,
                  animation: 'toastSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
              >
                <div style={{ padding: '8px 16px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem' }}>
                    {user?.name || user?.email?.split('@')[0] || 'Explorer User'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>
                    {user?.email || 'authenticated member'}
                  </div>
                </div>

                <div style={{ padding: '6px 0' }}>
                  <button
                    onClick={() => { setProfileDropdownOpen(false); navigate('/wallet'); }}
                    style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: '#E2E8F0', textAlign: 'left', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    className="hover-bg"
                  >
                    <Gift size={15} color="#A78BFA" /> Rewards Vault
                  </button>
                  <button
                    onClick={() => { setProfileDropdownOpen(false); navigate('/streak-history'); }}
                    style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: '#E2E8F0', textAlign: 'left', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    className="hover-bg"
                  >
                    <Flame size={15} color="#F59E0B" /> Streak History
                  </button>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '6px 16px 4px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Quick Test Personas
                  </span>
                </div>
                <button
                  onClick={() => handleDemoSwitch('new')}
                  style={{ width: '100%', padding: '6px 16px', background: 'transparent', border: 'none', color: '#38BDF8', textAlign: 'left', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Sparkles size={13} /> Day 1 New User
                </button>
                <button
                  onClick={() => handleDemoSwitch('day2')}
                  style={{ width: '100%', padding: '6px 16px', background: 'transparent', border: 'none', color: '#FBBF24', textAlign: 'left', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Sparkles size={13} /> Day 2 Active User
                </button>
                <button
                  onClick={() => handleDemoSwitch('vip')}
                  style={{ width: '100%', padding: '6px 16px', background: 'transparent', border: 'none', color: '#34D399', textAlign: 'left', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Sparkles size={13} /> Day 7 VIP User
                </button>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); navigate('/login'); }}
                    style={{ width: '100%', padding: '8px 16px', background: 'transparent', border: 'none', color: '#EF4444', textAlign: 'left', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="d-flex d-lg-none btn-press"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0F0926',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
          className="d-lg-none"
        >
          <NavLink to="/dashboard" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/daily-streak" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Flame size={16} color="#F59E0B" /> Daily Streak
          </NavLink>
          <NavLink to="/tasks" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Target size={16} color="#10B981" /> Tasks & Earn
          </NavLink>
          <NavLink to="/leaderboard" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Trophy size={16} color="#FBBF24" /> Leaderboard
          </NavLink>
          <NavLink to="/wallet" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Gift size={16} color="#A78BFA" /> Rewards Wallet
          </NavLink>
          <NavLink to="/badges" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            <Award size={16} color="#38BDF8" /> Badges & Achievements
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
