import React from "react";

function OceanJar({ count = 1 }) {
  const getCircledNumber = (num) => {
    if (num < 0) return "⊕";
    return String(num);
  };

  return (
    <div className="ocean-jar-wrap">
      <svg viewBox="0 0 200 240" className="ocean-jar-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dce8f8" />
            <stop offset="100%" stopColor="#c8d8f4" />
          </linearGradient>
          <linearGradient id="seaG" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#b8d0f0" />
            <stop offset="40%" stopColor="#c8d0f4" />
            <stop offset="100%" stopColor="#d4c8f0" />
          </linearGradient>
          <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0e4c8" />
            <stop offset="100%" stopColor="#e8d8b8" />
          </linearGradient>
          <clipPath id="jarClip">
            <path d="M30 50 Q28 35 42 32 L158 32 Q172 35 170 50 L176 185 Q178 202 158 206 L42 206 Q22 202 24 185 Z" />
          </clipPath>
        </defs>

        {/* lid */}
        <rect id="jar-cap" x="58" y="16" width="84" height="20" rx="6" fill="#e8d8c8" stroke="#d0c0b0" strokeWidth="1.5" />
        <rect id="jar-cap-inner" x="70" y="10" width="60" height="12" rx="4" fill="#ddd0c0" stroke="#c8b8a8" strokeWidth="1.2" />
        <line x1="80"  y1="12" x2="80"  y2="36" stroke="#c8b8a8" strokeWidth="0.8" opacity="0.5" />
        <line id="jar-cap-line-2" x1="100" y1="12" x2="100" y2="36" stroke="#c8b8a8" strokeWidth="0.8" opacity="0.5" />
        <line id="jar-cap-line-3" x1="120" y1="12" x2="120" y2="36" stroke="#c8b8a8" strokeWidth="0.8" opacity="0.5" />

        {/* jar body */}
        <path d="M30 50 Q28 35 42 32 L158 32 Q172 35 170 50 L176 185 Q178 202 158 206 L42 206 Q22 202 24 185 Z"
          fill="white" fillOpacity="0.88" stroke="#d0c0b8" strokeWidth="2" />

        <g clipPath="url(#jarClip)">
          {/* sky */}
          <rect x="20" y="28" width="165" height="80" fill="url(#skyG)" />
          <ellipse cx="60"  cy="52" rx="18" ry="8"  fill="white" opacity="0.55" />
          <ellipse cx="50"  cy="54" rx="12" ry="6"  fill="white" opacity="0.45" />
          <ellipse cx="140" cy="48" rx="16" ry="7"  fill="white" opacity="0.5"  />
          <circle  cx="155" cy="45" r="8"            fill="#f7e6b8" opacity="0.85" />

          {/* water */}
          <path d="M20 108 Q60 100 100 108 Q140 116 180 108" fill="url(#seaG)" />
          <rect x="20" y="106" width="165" height="110" fill="url(#seaG)" opacity="0.88" />
          <path d="M30 120 Q80 115 160 122"  stroke="white" strokeWidth="2.2" fill="none" opacity="0.4"  strokeLinecap="round" />
          <path d="M25 135 Q75 130 165 138"  stroke="white" strokeWidth="1.5" fill="none" opacity="0.28" strokeLinecap="round" />

          {/* cat-fish left — blue */}
          <g transform="translate(48,140)">
            <path d="M38 13 L46 6 L46 20 Z" fill="#b8c8ee" opacity="0.85" />
            <ellipse cx="22" cy="13" rx="22" ry="13" fill="#b8c8ee" opacity="0.88" />
            <ellipse cx="18" cy="10" rx="12" ry="6" fill="white" opacity="0.2" />
            <polygon points="6,2 10,10 2,10"  fill="#a0b4e0" />
            <polygon points="14,0 18,8 10,8"  fill="#a0b4e0" />
            <circle cx="10" cy="12" r="3"   fill="white" opacity="0.9" />
            <circle cx="9.5" cy="12" r="1.8" fill="#5060a0" opacity="0.8" />
            <circle cx="9" cy="11.5" r="0.7" fill="white" />
            <path d="M7 16 Q10 18.5 13 16" stroke="#7888b8" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>

          {/* cat-fish right — purple */}
          <g transform="translate(106,148)">
            <path d="M38 11 L46 5 L46 17 Z" fill="#d4b8f0" opacity="0.85" />
            <ellipse cx="22" cy="11" rx="22" ry="12" fill="#d4b8f0" opacity="0.88" />
            <ellipse cx="18" cy="8"  rx="12" ry="6"  fill="white" opacity="0.2" />
            <polygon points="6,1 10,9 2,9"   fill="#c0a0e0" />
            <polygon points="14,-1 18,7 10,7" fill="#c0a0e0" />
            <circle cx="10" cy="10" r="3"   fill="white" opacity="0.9" />
            <circle cx="9.5" cy="10" r="1.8" fill="#6050a0" opacity="0.8" />
            <circle cx="9" cy="9.5" r="0.7"  fill="white" />
            <path d="M7 14 Q10 16.5 13 14" stroke="#9878c0" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>

          {/* seaweed */}
          <path d="M38 210 Q30 190 40 175 Q48 162 36 148" stroke="#b8d8c0" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M155 210 Q162 192 152 178 Q144 164 155 150" stroke="#c8e0b8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* sand */}
          <path d="M20 196 Q100 190 180 196 L180 215 L20 215 Z" fill="url(#sandG)" opacity="0.8" />
          <ellipse cx="55"  cy="207" rx="7" ry="4"   fill="#e8d8b8" opacity="0.7"  />
          <ellipse cx="100" cy="209" rx="5" ry="3"   fill="#f0c8b8" opacity="0.65" />
          <ellipse cx="142" cy="206" rx="6" ry="3.5" fill="#e8c8d8" opacity="0.7"  />

          {/* floating stars inside */}
          <path d="M70 130 l1.4 4.2h4.4l-3.6 2.6 1.4 4.2-3.6-2.6-3.6 2.6 1.4-4.2-3.6-2.6h4.4z" fill="#f7e0b0" opacity="0.9" />
          <path d="M130 122 l1.2 3.6h3.8l-3 2.2 1.2 3.6-3.2-2.3-3.2 2.3 1.2-3.6-3-2.2h3.8z" fill="#f7b8d1" opacity="0.9" />

          {/* bubbles */}
          <circle cx="65"  cy="160" r="4"   fill="none" stroke="#b8d0f0" strokeWidth="1.2" opacity="0.6"  />
          <circle cx="78"  cy="148" r="2.5" fill="none" stroke="#c8d8f4" strokeWidth="1"   opacity="0.6"  />
          <circle cx="120" cy="155" r="3.5" fill="none" stroke="#b8d0f0" strokeWidth="1.2" opacity="0.55" />
          <circle cx="108" cy="136" r="2"   fill="none" stroke="#c8d8f4" strokeWidth="1"   opacity="0.55" />
        </g>

        {/* glass highlight */}
        <path d="M38 50 Q36 80 34 130" stroke="white" strokeWidth="6" fill="none" opacity="0.22" strokeLinecap="round" />
        {/* jar outline */}
        <path d="M30 50 Q28 35 42 32 L158 32 Q172 35 170 50 L176 185 Q178 202 158 206 L42 206 Q22 202 24 185 Z"
          fill="none" stroke="#c8b4ac" strokeWidth="2" />

        {/* number badge */}
        <circle cx="168" cy="54" r="11" fill="white" stroke="#d0c0b8" strokeWidth="1.4" opacity="0.92" />
        <text x="168.2" y="57" textAnchor="middle" fontSize="11" fill="#a89888" fontFamily="Georgia, serif">{getCircledNumber(count)}</text>
      </svg>
    </div>
  );
}

export default OceanJar;