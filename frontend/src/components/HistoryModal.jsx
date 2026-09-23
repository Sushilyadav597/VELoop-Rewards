import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, History } from 'lucide-react';
import streakApi from '../services/streakApi';

export const HistoryModal = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await streakApi.getHistory();
        if (res.success) {
          setHistory(res.history || []);
        }
      } catch (err) {
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(5, 3, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1075
      }}
    >
      <div
        className="card border-0 p-4 position-relative"
        style={{
          maxWidth: '520px',
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
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="d-flex align-items-center gap-2 mb-2">
          <History size={20} className="text-warning" />
          <h5 className="mb-0 fw-bold text-white">Daily Streak Check-In History</h5>
        </div>
        <p className="text-secondary small mb-3">
          Authoritative record of completed claims saved in MongoDB.
        </p>

        <div className="overflow-y-auto pe-1" style={{ maxHeight: '380px' }}>
          {loading ? (
            <p className="text-muted small text-center py-4">Loading history...</p>
          ) : history.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              <Calendar size={32} className="mb-2 opacity-50" />
              <p className="mb-0">No check-ins recorded yet in this cycle.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {history.map((claim, idx) => (
                <div
                  key={idx}
                  className="p-3 d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px'
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={18} className="text-success" />
                    <div>
                      <div className="fw-bold text-white small">
                        Day {claim.day} Check-In
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Ref: {claim.transactionId || claim.claimId}
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="badge bg-warning text-dark fw-bold">
                      {claim.rewardSnapshot?.currency === 'INR' ? `₹${claim.rewardSnapshot?.amount}` : `+${claim.rewardSnapshot?.amount} VEs`}
                    </span>
                    <div className="text-muted mt-1" style={{ fontSize: '0.68rem' }}>
                      {new Date(claim.claimedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="btn btn-sm btn-secondary w-100 mt-3 py-2"
        >
          Close History
        </button>
      </div>
    </div>
  );
};

export default HistoryModal;
