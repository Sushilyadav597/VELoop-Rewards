import React, { useState } from 'react';
import { Check, Loader2, Sparkles, ArrowUpRight } from 'lucide-react';

export const TaskCard = ({ task, onComplete, isCompact = false }) => {
  const [loading, setLoading] = useState(false);

  const isCompleted = task.isCompleted || (task.progress >= task.target && task.target > 0);
  const percent = task.target > 0 ? Math.min(100, Math.round((task.progress / task.target) * 100)) : 0;

  const handleClick = async () => {
    if (isCompleted || loading) return;
    setLoading(true);
    try {
      if (onComplete) {
        await onComplete(task.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card-lift"
      style={{
        background: isCompleted
          ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.08) 0%, rgba(12, 10, 32, 0.7) 100%)'
          : 'linear-gradient(145deg, rgba(25, 18, 60, 0.65) 0%, rgba(13, 9, 34, 0.8) 100%)',
        border: isCompleted
          ? '1.2px solid rgba(16, 185, 129, 0.45)'
          : '1.2px solid rgba(139, 92, 246, 0.22)',
        borderRadius: '18px',
        padding: isCompact ? '1.25rem 1.25rem' : '1.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: isCompleted
          ? '0 8px 24px rgba(16, 185, 129, 0.12)'
          : '0 8px 24px rgba(0, 0, 0, 0.25)',
        minHeight: isCompact ? '240px' : '270px'
      }}
    >
      {/* Top row: Icon & Reward Badge */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}
          >
            {task.icon || '🎯'}
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.14)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#FBBF24',
              fontWeight: 800,
              fontSize: '0.85rem',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            +{task.reward} 🪙
          </div>
        </div>

        {/* Task Title & Description */}
        <h4
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 0.35rem',
            letterSpacing: '-0.01em'
          }}
        >
          {task.title}
        </h4>

        <p
          style={{
            fontSize: '0.84rem',
            color: '#94A3B8',
            margin: 0,
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {task.description}
        </p>
      </div>

      {/* Bottom section: Progress bar & Action button */}
      <div style={{ marginTop: '1.25rem' }}>
        {/* Progress Bar & percentage */}
        <div style={{ marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600 }}>{isCompleted ? 'Complete' : 'Progress'}</span>
            <span style={{ fontWeight: 700, color: isCompleted ? '#34D399' : '#A78BFA' }}>
              {isCompleted ? '100%' : `${percent}%`}
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '7px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: '100%',
                borderRadius: '999px',
                background: isCompleted
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button
            disabled
            style={{
              width: '100%',
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.16)',
              color: '#34D399',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'default'
            }}
          >
            <Check size={16} /> Completed (+{task.reward} VEs)
          </button>
        ) : (
          <button
            onClick={handleClick}
            disabled={loading}
            className="btn-press"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner-border spinner-border-sm" /> Claiming Task...
              </>
            ) : (
              <>
                Complete Task <ArrowUpRight size={15} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
