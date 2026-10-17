import React from 'react';
import giftBoxClosedImg from './images/Top_Left.png';
import giftBoxOpenImg from './images/Day-4.png';

/**
 * GiftBox Component:
 * Official high-impact 3D VELoop Rewards Gift Box asset.
 * Replaces simple flat SVG with the rich 3D illustrated artwork:
 * - 'closed': 3D glossy purple gift box with golden bow & floating coins (Top_Left.png)
 * - 'open': 3D open purple gift box with Amazon card, coins, and golden confetti (Day-4.png)
 */
export const GiftBox = ({
  size = 140,
  variant = 'closed', // 'closed' | 'open'
  className = '',
  style = {},
  withGlow = true,
  animate = true,
  alt = 'VELoop Rewards 3D Gift Box'
}) => {
  const imgSrc = variant === 'open' ? giftBoxOpenImg : giftBoxClosedImg;

  const glowFilter = withGlow
    ? 'drop-shadow(0 14px 28px rgba(139, 92, 246, 0.55)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.45))'
    : 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.5))';

  return (
    <div
      className={`d-inline-flex align-items-center justify-content-center position-relative ${animate ? 'anim-float' : ''} ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        transformOrigin: 'center bottom',
        ...style
      }}
    >
      {withGlow && (
        <div
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(139, 92, 246, 0.25) 45%, transparent 75%)',
            filter: 'blur(16px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: glowFilter,
          position: 'relative',
          zIndex: 1,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease'
        }}
        loading="lazy"
      />
    </div>
  );
};

export default GiftBox;
