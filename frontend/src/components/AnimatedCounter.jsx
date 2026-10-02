import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * AnimatedCounter Component
 * Animates number transitions smoothly (e.g. 2,450 -> 2,500 -> 2,550)
 * Displays a subtle celebration badge "+100 Points Earned" on point gains.
 */
export const AnimatedCounter = ({
  value = 0,
  duration = 900,
  prefix = '',
  suffix = '',
  showIncreaseBadge = true,
  className = '',
  style = {}
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [pointDelta, setPointDelta] = useState(null);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prev = prevValueRef.current;
    const next = Number(value) || 0;

    if (prev !== next) {
      const delta = next - prev;

      if (delta > 0 && showIncreaseBadge) {
        setPointDelta(delta);
        setBadgeVisible(true);

        // Micro confetti burst on point gain
        try {
          confetti({
            particleCount: 28,
            spread: 55,
            origin: { y: 0.75 },
            colors: ['#F59E0B', '#8B5CF6', '#10B981', '#FBBF24']
          });
        } catch {
          // ignore if canvas-confetti unsupported
        }

        const timer = setTimeout(() => {
          setBadgeVisible(false);
        }, 3200);

        // Number count-up animation steps
        const startTime = performance.now();
        const startValue = prev;
        const endValue = next;

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.round(startValue + (endValue - startValue) * easeProgress);

          setDisplayValue(currentVal);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(endValue);
          }
        };

        requestAnimationFrame(animate);
        prevValueRef.current = next;

        return () => clearTimeout(timer);
      } else {
        setDisplayValue(next);
        prevValueRef.current = next;
      }
    }
  }, [value, duration, showIncreaseBadge]);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...style }} className={className}>
      <span>
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </span>

      {/* Floating "+X Points Earned" pill badge */}
      {badgeVisible && pointDelta && (
        <span
          style={{
            position: 'absolute',
            top: '-26px',
            right: '-10px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            fontSize: '0.74rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.45)',
            whiteSpace: 'nowrap',
            animation: 'pointPillFloat 3s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          🎉 +{pointDelta.toLocaleString()} Earned
        </span>
      )}
    </span>
  );
};

export default AnimatedCounter;
