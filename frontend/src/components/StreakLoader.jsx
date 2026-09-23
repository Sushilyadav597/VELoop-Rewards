import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

export const StreakLoader = ({ onRetry, onContinue, error }) => {
  const [showTimeoutControls, setShowTimeoutControls] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutControls(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center p-5 min-vh-50"
      style={{ minHeight: '60vh' }}
    >
      {/* Glowing animated orb with fire flame */}
      <div className="position-relative mb-4">
        <div
          className="rounded-circle anim-glow-purple d-flex align-items-center justify-content-center"
          style={{
            width: '90px',
            height: '90px',
            background: 'linear-gradient(135deg, #1C134E 0%, #0F092A 100%)',
            border: '2px solid rgba(139, 92, 246, 0.5)'
          }}
        >
          <div className="anim-float">
            <Flame size={44} fill="#F59E0B" color="#F59E0B" />
          </div>
        </div>

        {/* Orbiting sparkle */}
        <div
          className="position-absolute top-0 end-0"
          style={{ animation: 'floatAnimation 2s infinite ease-in-out' }}
        >
          <Sparkles size={20} className="text-warning" />
        </div>
      </div>

      {/* Brand title */}
      <h3 className="h5 fw-bold text-white mb-2 tracking-wide">
        VELoop <span className="text-warning">Rewards</span>
      </h3>
      <p className="text-secondary small mb-3">
        {error ? 'Unable to connect to rewards server' : 'Loading your streak...'}
      </p>

      {/* Sleek animated progress track */}
      {!error && (
        <div
          style={{
            width: '180px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6 0%, #F59E0B 100%)',
              borderRadius: '999px',
              animation: 'shimmerEffect 1.5s infinite linear',
              backgroundSize: '200% 100%'
            }}
          />
        </div>
      )}

      {/* Timeout / Recovery Controls (shows if server is waking up from cold start) */}
      {(showTimeoutControls || error) && (
        <div className="mt-4 d-flex align-items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-sm text-white d-flex align-items-center gap-2 px-3 py-1"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.25)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '8px'
              }}
            >
              <RefreshCw size={14} /> Retry
            </button>
          )}
          {onContinue && (
            <button
              onClick={onContinue}
              className="btn btn-sm btn-warning d-flex align-items-center gap-2 px-3 py-1 fw-semibold text-dark"
              style={{ borderRadius: '8px' }}
            >
              Continue to Demo <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StreakLoader;
