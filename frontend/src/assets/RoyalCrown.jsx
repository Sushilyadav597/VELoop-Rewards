import React from 'react';

export const RoyalCrown = ({ size = 72, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="gemRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="gemBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="velvetBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>
        <filter id="crownAura" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Radiant Glow Behind Crown */}
      <circle cx="50" cy="50" r="32" fill="#F59E0B" opacity="0.18" filter="url(#crownAura)" />

      <g filter="url(#crownAura)">
        {/* Inner Velvet Cushion */}
        <path
          d="M26 62 C26 42 74 42 74 62 Z"
          fill="url(#velvetBase)"
          opacity="0.85"
        />

        {/* Crown Spikes & Body */}
        <path
          d="M20 64 L25 36 L38 48 L50 24 L62 48 L75 36 L80 64 Z"
          fill="url(#crownGold)"
          stroke="#FFFBEB"
          strokeWidth="1.2"
        />

        {/* Golden Base Band */}
        <rect
          x="18"
          y="62"
          width="64"
          height="12"
          rx="4"
          fill="url(#crownGold)"
          stroke="#FDE68A"
          strokeWidth="1"
        />

        {/* Jewels on Spikes (Pearls / Diamonds) */}
        <circle cx="25" cy="35" r="3.5" fill="#FFFBEB" />
        <circle cx="50" cy="23" r="4.5" fill="#FFFBEB" />
        <circle cx="75" cy="35" r="3.5" fill="#FFFBEB" />
        <circle cx="38" cy="48" r="2.5" fill="#FDE68A" />
        <circle cx="62" cy="48" r="2.5" fill="#FDE68A" />

        {/* Gemstones on Base Band */}
        <ellipse cx="50" cy="68" rx="4" ry="3.5" fill="url(#gemRed)" stroke="#FFFBEB" strokeWidth="0.8" />
        <ellipse cx="32" cy="68" rx="3.5" ry="3" fill="url(#gemBlue)" stroke="#FFFBEB" strokeWidth="0.6" />
        <ellipse cx="68" cy="68" rx="3.5" ry="3" fill="url(#gemBlue)" stroke="#FFFBEB" strokeWidth="0.6" />
      </g>

      {/* Sparkling Stars */}
      <path d="M48 10 L50 14 L54 15 L50 16 L48 20 L46 16 L42 15 L46 14 Z" fill="#FFFFFF" />
      <path d="M16 26 L17.5 29 L21 30 L17.5 31 L16 34 L14.5 31 L11 30 L14.5 29 Z" fill="#FDE68A" />
      <path d="M82 26 L83.5 29 L87 30 L83.5 31 L82 34 L80.5 31 L77 30 L80.5 29 Z" fill="#FDE68A" />
    </svg>
  );
};

export default RoyalCrown;
