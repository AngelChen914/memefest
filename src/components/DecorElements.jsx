import React from "react";

export function Seaweed({ x, height = 80, color = "#b8d8c0", delay = 0 }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const y = height - i * (height / 5);
    const xOff = i % 2 === 0 ? 0 : 12;
    return `${10 + xOff},${y}`;
  }).join(" ");
  return (
    <div className="seaweed" style={{ left: `${x}%`, animationDelay: `${delay}s` }}>
      <svg width="24" height={height} viewBox={`0 0 24 ${height}`}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      </svg>
    </div>
  );
}

export function Coral({ x, color = "#f7b8d1" }) {
  return (
    <div className="coral" style={{ left: `${x}%` }}>
      <svg width="36" height="52" viewBox="0 0 36 52">
        <line x1="18" y1="52" x2="18" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <line x1="18" y1="38" x2="6"  y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <line x1="18" y1="32" x2="30" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="18" cy="18" r="5" fill={color} opacity="0.75" />
        <circle cx="6"  cy="24" r="4" fill={color} opacity="0.7" />
        <circle cx="30" cy="18" r="4" fill={color} opacity="0.7" />
      </svg>
    </div>
  );
}

export function Shell({ x, color = "#f7e6b8" }) {
  return (
    <div className="shell" style={{ left: `${x}%` }}>
      <svg width="28" height="22" viewBox="0 0 28 22">
        <path d="M14 20 Q2 18 2 10 Q2 2 14 2 Q26 2 26 10 Q26 18 14 20Z"
          fill={color} opacity="0.75" stroke="#e0c890" strokeWidth="0.8" />
        <path d="M14 2 Q10 8 8 14"  stroke="#e0c890" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M14 2 Q18 8 20 14" stroke="#e0c890" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M14 2 Q14 10 14 18" stroke="#e0c890" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}

export function Fish({ x, y, flipped, color, size = 1, delay = 0 }) {
  return (
    <div className="fish" style={{
      left: `${x}%`, top: `${y}%`,
      transform: flipped ? "scaleX(-1)" : "scaleX(1)",
      animationDelay: `${delay}s`,
    }}>
      <svg width={52 * size} height={34 * size} viewBox="0 0 52 34">
        <path d="M42 17 L52 8 L52 26 Z" fill={color} opacity="0.8" />
        <ellipse cx="24" cy="17" rx="22" ry="13" fill={color} opacity="0.85" />
        <ellipse cx="20" cy="14" rx="12" ry="6" fill="white" opacity="0.2" />
        <circle cx="10" cy="14" r="3.5" fill="white" opacity="0.9" />
        <circle cx="9.5" cy="14" r="2" fill="#5868a0" opacity="0.8" />
        <circle cx="8.8" cy="13.2" r="0.7" fill="white" />
        <path d="M24 4 Q28 9 22 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
        <path d="M7 17 Q9 19 11 17" stroke="#7888b8" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Jellyfish({ x, y, color, size = 1, delay = 0 }) {
  return (
    <div className="jellyfish" style={{
      left: `${x}%`, top: `${y}%`,
      animationDelay: `${delay}s`,
    }}>
      <svg width={44 * size} height={58 * size} viewBox="0 0 44 58">
        <path d="M4 22 Q4 4 22 4 Q40 4 40 22 Q40 30 22 32 Q4 30 4 22Z"
          fill={color} opacity="0.78" />
        <path d="M10 14 Q16 8 28 12" stroke="white" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
        <circle cx="17" cy="20" r="2.2" fill="white" opacity="0.9" />
        <circle cx="16.5" cy="20" r="1.2" fill="#6858a0" opacity="0.8" />
        <circle cx="16" cy="19.4" r="0.5" fill="white" />
        <circle cx="27" cy="20" r="2.2" fill="white" opacity="0.9" />
        <circle cx="26.5" cy="20" r="1.2" fill="#6858a0" opacity="0.8" />
        <circle cx="26" cy="19.4" r="0.5" fill="white" />
        <path d="M19 24 Q22 27 25 24" stroke="#8878b8" strokeWidth="1" fill="none" strokeLinecap="round" />
        {[8, 14, 20, 26, 32, 38].map((tx, i) => (
          <path key={i}
            d={`M${tx} 32 Q${tx + (i % 2 === 0 ? -3 : 3)} ${38 + i} ${tx + (i % 2 === 0 ? 2 : -2)} ${48 + i}`}
            stroke={color} strokeWidth="1.4" fill="none" opacity="0.55" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}