import "./Decorations.css";

const Star = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
      fill={color} stroke={color} strokeWidth="0.4" strokeLinejoin="round" />
  </svg>
);

const Bubble = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="none" stroke="#b8d8f0" strokeWidth="1.6" opacity="0.75" />
    <circle cx="8" cy="8" r="2.5" fill="white" opacity="0.4" />
    <circle cx="15" cy="10" r="1.2" fill="white" opacity="0.25" />
  </svg>
);

const Sparkle = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Drop = ({ size }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 10 14">
    <path d="M5 1 C5 1 1 6 1 9 a4 4 0 0 0 8 0 C9 6 5 1 5 1z"
      fill="#b8d8f7" fillOpacity="0.65" stroke="#9abde0" strokeWidth="0.8" />
  </svg>
);

const Heart = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"
      fill={color} stroke={color} strokeWidth="0.4" />
  </svg>
);

const PARTICLE_DEFS = [
  { type: "star",    color: "#b8c5f7", size: 18 },
  { type: "star",    color: "#d4b8f7", size: 14 },
  { type: "star",    color: "#f7e6b8", size: 16 },
  { type: "star",    color: "#f7b8d1", size: 12 },
  { type: "bubble",  color: null,      size: 22 },
  { type: "bubble",  color: null,      size: 16 },
  { type: "bubble",  color: null,      size: 28 },
  { type: "sparkle", color: "#f0d898", size: 13 },
  { type: "sparkle", color: "#d4b8f7", size: 11 },
  { type: "drop",    color: null,      size: 11 },
  { type: "drop",    color: null,      size: 9  },
  { type: "heart",   color: "#f7b8d1", size: 13 },
  { type: "heart",   color: "#d4b8f7", size: 11 },
  { type: "star",    color: "#b8c5f7", size: 10 },
  { type: "star",    color: "#f7e6b8", size: 20 },
  { type: "bubble",  color: null,      size: 20 },
  { type: "sparkle", color: "#f7b8d1", size: 14 },
  { type: "star",    color: "#d4b8f7", size: 16 },
  { type: "drop",    color: null,      size: 13 },
  { type: "heart",   color: "#f7d8b8", size: 15 },
  { type: "bubble",  color: null,      size: 18 },
  { type: "star",    color: "#f7b8d1", size: 12 },
  { type: "sparkle", color: "#b8c5f7", size: 12 },
  { type: "star",    color: "#f7e6b8", size: 14 },
  { type: "bubble",  color: null,      size: 24 },
  { type: "drop",    color: null,      size: 10 },
  { type: "heart",   color: "#f7b8d1", size: 12 },
  { type: "star",    color: "#d4b8f7", size: 18 },
  { type: "sparkle", color: "#f0d898", size: 10 },
  { type: "bubble",  color: null,      size: 14 },
  { type: "star",    color: "#b8c5f7", size: 16 },
  { type: "heart",   color: "#d4b8f7", size: 14 },
];

// Deterministic positions & timings from index so server/client match
const particles = PARTICLE_DEFS.map((def, i) => ({
  ...def,
  id: i,
  // spread across the full viewport in a scattered but deterministic way
  startX: ((i * 97 + 13) % 94) + 3,       // 3–97% horizontal
  startY: ((i * 61 + 7)  % 94) + 3,       // 3–97% vertical
  // each particle drifts to a unique second position
  driftX:  (((i * 41 + 29) % 30) - 15),   // -15 to +15 vw
  driftY:  (((i * 53 + 11) % 30) - 15),   // -15 to +15 vh
  duration: 5 + (i % 7) * 1.3,            // 5–14 s
  delay:    (i * 0.44) % 9,               // stagger
  rot:      (i * 37) % 360,
  rotEnd:   ((i * 37) + (i % 2 === 0 ? 25 : -20)) % 360,
}));

function ParticleEl({ p }) {
  let el;
  if (p.type === "star")    el = <Star    size={p.size} color={p.color} />;
  if (p.type === "bubble")  el = <Bubble  size={p.size} />;
  if (p.type === "sparkle") el = <Sparkle size={p.size} color={p.color} />;
  if (p.type === "drop")    el = <Drop    size={p.size} />;
  if (p.type === "heart")   el = <Heart   size={p.size} color={p.color} />;

  return (
    <div
      className="deco-particle"
      style={{
        left: `${p.startX}%`,
        top:  `${p.startY}%`,
        "--dx": `${p.driftX}vw`,
        "--dy": `${p.driftY}vh`,
        "--r0": `${p.rot}deg`,
        "--r1": `${p.rotEnd}deg`,
        animationDuration:  `${p.duration}s`,
        animationDelay:     `${p.delay}s`,
      }}
    >
      {el}
    </div>
  );
}

export default function Decorations() {
  return (
    <div className="decorations-layer" aria-hidden="true">
      {particles.map(p => <ParticleEl key={p.id} p={p} />)}
    </div>
  );
}