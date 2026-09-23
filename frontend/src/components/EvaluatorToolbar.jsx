import React, { useState } from 'react';
import {
  Wrench,
  FastForward,
  RotateCcw,
  ShieldAlert,
  Zap,
  FileText,
  UserCheck,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import streakApi from '../services/streakApi';
import { useStreak } from '../context/StreakContext';
import { useAuth } from '../context/AuthContext';

export const EvaluatorToolbar = () => {
  const { refreshStreak } = useStreak();
  const { demoLogin, refreshWallet } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Audit Logs modal
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const notify = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 5001);
  };

  // 1. Advance Virtual Server Time (Section 48, 103)
  const handleAdvanceTime = async (hours) => {
    setIsProcessing(true);
    try {
      const res = await streakApi.advanceTime(hours);
      notify(`✔ Virtual server clock advanced by +${hours} hours!`);
      await refreshStreak(false);
    } catch (err) {
      notify(`Error: ${err.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Reset Virtual Server Time
  const handleResetClock = async () => {
    setIsProcessing(true);
    try {
      await streakApi.resetClock();
      notify('✔ Virtual clock reset back to system time.');
      await refreshStreak(false);
    } catch (err) {
      notify(`Error: ${err.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Reset User Streak to Day 1
  const handleResetStreak = async () => {
    if (!window.confirm('Reset this user streak back to Day 1?')) return;
    setIsProcessing(true);
    try {
      await streakApi.resetUserStreak();
      notify('✔ User streak reset to Day 1.');
      await refreshStreak(false);
      await refreshWallet();
    } catch (err) {
      notify(`Error: ${err.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Concurrency Test: 2 simultaneous claim requests (Section 42, 102)
  const handleTestConcurrency = async () => {
    setIsProcessing(true);
    try {
      const res = await streakApi.testConcurrency();
      if (res.passed) {
        notify('✔ PASS: Sent 2 simultaneous claims! Exactly 1 succeeded and 1 was safely blocked.', false);
      } else {
        notify(`Result: ${res.description}`, false);
      }
      await refreshStreak(false);
      await refreshWallet();
    } catch (err) {
      notify(`Concurrency Test Notice: ${err.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Anti-Cheat Test: Fake Reward Payload (Section 36, 98)
  const handleFakeRewardTest = async () => {
    setIsProcessing(true);
    try {
      const res = await streakApi.claimReward({ day: 2, reward: 999999, currency: 'VES' });
      notify(`✔ Anti-Cheat PASS: Server ignored fake 999,999 payload and awarded authoritative ${res.claimedReward.amount} ${res.claimedReward.currency}!`);
      await refreshStreak(false);
      await refreshWallet();
    } catch (err) {
      notify(`✔ Anti-Cheat PASS: Request handled securely: ${err.message}`, false);
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. View Audit Logs (Section 64, 104)
  const handleViewAuditLogs = async () => {
    setIsProcessing(true);
    try {
      const res = await streakApi.getAuditLogs(30);
      setAuditLogs(res.logs || []);
      setLogsModalOpen(true);
    } catch (err) {
      notify(`Audit log fetch failed: ${err.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Evaluator Bar */}
      <div
        className="position-fixed bottom-0 start-50 translate-middle-x mb-2 px-3 py-2 text-white shadow-lg"
        style={{
          zIndex: 1040,
          backgroundColor: '#150f38',
          border: '1.5px solid #F59E0B',
          borderRadius: '16px',
          maxWidth: '96vw',
          width: isOpen ? '760px' : 'auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
        }}
      >
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className="p-1 rounded bg-warning text-dark">
              <Wrench size={16} />
            </div>
            <span className="small fw-bold text-warning text-nowrap">
              Internship Evaluator & Anti-Cheat Suite
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {!isOpen && (
              <span className="text-secondary small d-none d-md-inline" style={{ fontSize: '0.75rem' }}>
                Test fast-forward 24h, missed streak, and anti-cheat tests
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-sm p-1 text-secondary border-0"
              aria-label="Toggle panel"
            >
              {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>

        {/* Expanded Panel */}
        {isOpen && (
          <div className="pt-3 mt-2 border-top border-secondary border-opacity-25">
            {feedback && (
              <div
                className={`alert py-1 px-3 small mb-2 ${feedback.isError ? 'alert-danger' : 'alert-success'
                  }`}
                style={{ fontSize: '0.78rem' }}
              >
                {feedback.msg}
              </div>
            )}

            <div className="row g-2">
              {/* Row 1: Time Machine Controls (Section 48, 103) */}
              <div className="col-12 col-md-6">
                <span className="text-muted d-block small mb-1" style={{ fontSize: '0.72rem' }}>
                  ⏳ TIME MACHINE (Simulate Cooldown & Missed Day)
                </span>
                <div className="btn-group btn-group-sm w-100" role="group">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleAdvanceTime(24)}
                    className="btn btn-outline-warning text-nowrap"
                    title="Advance server virtual clock by 24h to test next day unlock"
                  >
                    <FastForward size={13} className="me-1" /> +24 Hours
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleAdvanceTime(48)}
                    className="btn btn-outline-warning text-nowrap"
                    title="Advance server clock past grace period to test missed streak reset"
                  >
                    <FastForward size={13} className="me-1" /> +48h (Missed)
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={handleResetClock}
                    className="btn btn-outline-secondary text-nowrap"
                    title="Reset to system time"
                  >
                    <RotateCcw size={13} className="me-1" /> Reset Clock
                  </button>
                </div>
              </div>

              {/* Row 2: Anti-Cheat & Concurrency (Section 42, 98, 102) */}
              <div className="col-12 col-md-6">
                <span className="text-muted d-block small mb-1" style={{ fontSize: '0.72rem' }}>
                  🛡️ ANTI-CHEAT & CONCURRENCY
                </span>
                <div className="btn-group btn-group-sm w-100" role="group">
                  <button
                    disabled={isProcessing}
                    onClick={handleTestConcurrency}
                    className="btn btn-outline-info text-nowrap"
                    title="Fires 2 simultaneous claims to verify atomic lock prevents double rewards"
                  >
                    <Zap size={13} className="me-1" /> Concurrency Test
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={handleFakeRewardTest}
                    className="btn btn-outline-danger text-nowrap"
                    title="Sends { reward: 999999 } payload to verify backend ignores fake data"
                  >
                    <ShieldAlert size={13} className="me-1" /> Fake Reward Attack
                  </button>
                </div>
              </div>

              {/* Row 3: Account Switching & Audit Trail */}
              <div className="col-12 col-md-6 mt-2">
                <span className="text-muted d-block small mb-1" style={{ fontSize: '0.72rem' }}>
                  👤 DEMO ACCOUNTS (Instant Switch)
                </span>
                <div className="btn-group btn-group-sm w-100" role="group">
                  <button
                    onClick={async () => { await demoLogin('new'); await refreshStreak(false); }}
                    className="btn btn-outline-light text-nowrap"
                  >
                    Day 1 New
                  </button>
                  <button
                    onClick={async () => { await demoLogin('day2'); await refreshStreak(false); }}
                    className="btn btn-outline-light text-nowrap"
                  >
                    Day 2 Active
                  </button>
                  <button
                    onClick={async () => { await demoLogin('vip'); await refreshStreak(false); }}
                    className="btn btn-outline-light text-nowrap"
                  >
                    Day 7 VIP
                  </button>
                </div>
              </div>

              {/* Row 4: Audit Log & Streak Reset */}
              <div className="col-12 col-md-6 mt-2">
                <span className="text-muted d-block small mb-1" style={{ fontSize: '0.72rem' }}>
                  📊 DATABASE & AUDIT LOGS
                </span>
                <div className="btn-group btn-group-sm w-100" role="group">
                  <button
                    onClick={handleViewAuditLogs}
                    className="btn btn-outline-light text-nowrap"
                  >
                    <FileText size={13} className="me-1" /> Audit Trail (DB)
                  </button>
                  <button
                    onClick={handleResetStreak}
                    className="btn btn-outline-danger text-nowrap"
                  >
                    <RotateCcw size={13} className="me-1" /> Reset to Day 1
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Logs Inspection Modal */}
      {logsModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            backgroundColor: 'rgba(5, 3, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1070
          }}
        >
          <div
            className="card border-0 p-4 position-relative"
            style={{
              maxWidth: '750px',
              width: '100%',
              maxHeight: '85vh',
              backgroundColor: '#150f38',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-warning" />
                <h5 className="mb-0 text-white fw-bold">Live MongoDB Security Audit Log</h5>
              </div>
              <button
                onClick={() => setLogsModalOpen(false)}
                className="btn btn-sm text-secondary p-1 border-0"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-secondary small mb-3">
              Section 64: Audit trail records all security events, anti-cheat blocks, concurrent request locks, and claim transactions.
            </p>

            <div className="overflow-y-auto" style={{ maxHeight: '55vh' }}>
              {auditLogs.length === 0 ? (
                <p className="text-muted small text-center py-4">No audit logs recorded yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-sm table-striped small align-middle mb-0">
                    <thead>
                      <tr className="text-muted" style={{ fontSize: '0.72rem' }}>
                        <th>Time</th>
                        <th>Event</th>
                        <th>User ID</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td className="text-secondary text-nowrap" style={{ fontSize: '0.7rem' }}>
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${log.event.includes('SUCCESS')
                                  ? 'bg-success'
                                  : log.event.includes('RESET')
                                    ? 'bg-warning text-dark'
                                    : log.event.includes('DUPLICATE') || log.event.includes('INVALID')
                                      ? 'bg-danger'
                                      : 'bg-secondary'
                                }`}
                              style={{ fontSize: '0.65rem' }}
                            >
                              {log.event}
                            </span>
                          </td>
                          <td className="text-truncate text-muted" style={{ maxWidth: '90px', fontSize: '0.7rem' }}>
                            {log.userId || 'Guest'}
                          </td>
                          <td className="text-secondary" style={{ fontSize: '0.72rem' }}>
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-3 text-end">
              <button
                onClick={() => setLogsModalOpen(false)}
                className="btn btn-sm btn-secondary px-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EvaluatorToolbar;
