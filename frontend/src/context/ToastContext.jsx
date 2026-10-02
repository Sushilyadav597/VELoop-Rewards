import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000, rewardAmount = null, rewardCurrency = 'VES' }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type, rewardAmount, rewardCurrency }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, title = 'Success') => {
    addToast({ title, message, type: 'success' });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    addToast({ title, message, type: 'error' });
  }, [addToast]);

  const info = useCallback((message, title = 'Notice') => {
    addToast({ title, message, type: 'info' });
  }, [addToast]);

  const reward = useCallback((amount, currency = 'VES', message = 'Reward claimed successfully!') => {
    addToast({
      title: 'Reward Earned',
      message: `${message} (+${amount} ${currency})`,
      type: 'reward',
      rewardAmount: amount,
      rewardCurrency: currency,
      duration: 5000
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, reward }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isReward = toast.type === 'reward';
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        const borderColor = isReward
          ? 'rgba(245, 158, 11, 0.6)'
          : isSuccess
          ? 'rgba(16, 185, 129, 0.6)'
          : isError
          ? 'rgba(239, 68, 68, 0.6)'
          : 'rgba(139, 92, 246, 0.5)';

        const glowColor = isReward
          ? 'rgba(245, 158, 11, 0.25)'
          : isSuccess
          ? 'rgba(16, 185, 129, 0.25)'
          : isError
          ? 'rgba(239, 68, 68, 0.25)'
          : 'rgba(139, 92, 246, 0.25)';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              background: 'linear-gradient(135deg, rgba(20, 15, 45, 0.95) 0%, rgba(12, 8, 30, 0.98) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1.5px solid ${borderColor}`,
              borderRadius: '14px',
              boxShadow: `0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}`,
              color: '#f8fafc',
              animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              position: 'relative'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {isReward && <Sparkles size={20} color="#F59E0B" />}
              {isSuccess && <CheckCircle2 size={20} color="#10B981" />}
              {isError && <AlertCircle size={20} color="#EF4444" />}
              {!isReward && !isSuccess && !isError && <Info size={20} color="#8B5CF6" />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isReward ? '#FBBF24' : '#F8FAFC', marginBottom: '2px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContext;
