import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const TrustFooter = () => {
  return (
    <div className="pt-2 pb-5 mb-5">
      <div
        className="d-flex align-items-center justify-content-between p-3"
        style={{
          background: 'linear-gradient(90deg, #130d32 0%, #0d0822 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '14px'
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <span className="fw-bold text-warning" style={{ fontSize: '0.75rem' }}>VR</span>
          </div>
          <div>
            <span className="d-block text-white small fw-semibold" style={{ fontSize: '0.8rem' }}>
              Official rewards only on VeloopRewards.in
            </span>
            <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
              Stay active, stay rewarded! 100% verified payout system.
            </span>
          </div>
        </div>

        <div className="text-secondary">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default TrustFooter;
