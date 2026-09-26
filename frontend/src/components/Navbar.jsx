import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from '../styles/globals.module.css';

/**
 * Navbar Component (Step 9 Polish):
 * Premium header with VELoop branding, responsive navigation links,
 * authenticated user profile pill, and secure logout.
 */
export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;

  return (
    <header className={styles.navbarContainer} role="banner">
      <div className={styles.navbarInner}>
        {/* Brand / Logo */}
        <NavLink to="/dashboard" className={styles.navBrand} aria-label="VELoop Rewards Home">
          <span className={styles.brandIcon}>⚡</span>
          <span>VELoop<span style={{ color: 'var(--reward-gold)' }}>Rewards</span></span>
        </NavLink>

        {/* Mobile menu toggle button */}
        <button
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Links and User Actions */}
        <nav
          className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksMobileOpen : ''}`}
          role="navigation"
          aria-label="Main Navigation"
        >
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>⚡</span> Dashboard
              </NavLink>
              <NavLink
                to="/streak-history"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>📜</span> Streak History
              </NavLink>
              <NavLink
                to="/wallet"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>💳</span> Wallet
              </NavLink>

              <div className={styles.navUserSection}>
                <span className={styles.navUserName}>
                  👤 {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className={styles.navUserSection} style={{ borderLeft: 'none', marginLeft: 0, paddingLeft: 0 }}>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className={styles.primaryButton}
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
