import React from 'react';
import Navbar from '../components/Navbar';
import LuckySpinWheel from '../components/LuckySpinWheel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LuckySpinPage = () => {
  const { wallet, refreshWallet } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%, #1e1346 0%, #0c0822 45%, #070514 100%)' }}>
      <Navbar />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        <LuckySpinWheel
          onPointsEarned={() => {
            refreshWallet();
          }}
          onOpenWallet={() => navigate('/wallet')}
        />

        {/* Feature Highlights Grid underneath */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'rgba(20, 14, 46, 0.5)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🛡️</div>
            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>Fair Probability</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              RNG outcomes are securely verified and ledger-backed on the backend.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'rgba(20, 14, 46, 0.5)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🎟️</div>
            <div style={{ fontWeight: 800, color: '#FBBF24', fontSize: '0.92rem' }}>Amazon Gift Cards</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              Win direct ₹10 and ₹25 digital voucher codes for Amazon purchases.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'rgba(20, 14, 46, 0.5)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>⚡</div>
            <div style={{ fontWeight: 800, color: '#34D399', fontSize: '0.92rem' }}>Instant Vault Credit</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0' }}>
              No claim delays. Points and vouchers are credited directly to your wallet.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LuckySpinPage;
