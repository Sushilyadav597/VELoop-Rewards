import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Loader2, CheckCircle2, X } from 'lucide-react';

export const CpaDemo = ({
  isOpen,
  day,
  onComplete,
  onCancel,
  isClaiming,
  error
}) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('verifying'); // 'verifying', 'ad', 'submitting'

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStage('verifying');
      return;
    }

    // Realistic multi-stage verification demo simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 40 && currentProgress < 85) {
        setStage('ad');
      } else if (currentProgress >= 85) {
        setStage('submitting');
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Triggers the authoritative backend claim
        onComplete();
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(5, 3, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1050
      }}
    >
      <div
        className="card border-0 text-center p-4 position-relative overflow-hidden"
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#130d33',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Glow ambient */}
        <div
          className="position-absolute"
          style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        />

        {/* Close button if not submitting */}
        {!isClaiming && (
          <button
            onClick={onCancel}
            className="btn btn-sm text-secondary position-absolute top-0 end-0 m-3 p-1 border-0"
            aria-label="Cancel"
          >
            <X size={18} />
          </button>
        )}

        {/* Icon */}
        <div className="d-flex justify-content-center mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.4)'
            }}
          >
            {stage === 'submitting' ? (
              <Loader2 size={30} className="text-warning spinner-border spinner-border-sm" style={{ borderWidth: '3px' }} />
            ) : (
              <Sparkles size={30} className="text-warning" />
            )}
          </div>
        </div>

        {/* Main Title */}
        <h4 className="fw-bold text-white mb-1">
          {stage === 'submitting' ? 'Finalizing Claim with Server...' : 'Preparing your reward...'}
        </h4>

        {/* Subtitle text matching Section 7 & 68 of PDF */}
        <p className="text-secondary small mb-3">
          {stage === 'ad' ? (
            <span className="text-warning">Advertisement / Reward Verification Demo</span>
          ) : (
            'Verifying check-in with VELoop backend security...'
          )}
        </p>

        {/* CPA Demo Ad Container (Section 7, 68) */}
        <div
          className="p-3 my-2 text-start"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '14px'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge bg-secondary bg-opacity-25 text-light" style={{ fontSize: '0.65rem' }}>
              SPONSORED DEMO
            </span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
              Day {day} Check-In
            </span>
          </div>
          <p className="text-white small mb-1 fw-semibold">
            VELoop Exclusive Deals & VEs
          </p>
          <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
            Earn gift cards & reward coins every day you return. Daily logins guarantee bigger reward multipliers!
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="my-3">
          <div
            className="progress"
            style={{
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px'
            }}
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8B5CF6 0%, #F59E0B 100%)'
              }}
            />
          </div>
          <div className="d-flex justify-content-between text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
            <span>Please wait...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-0 text-start" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CpaDemo;
