import { useState } from 'react';
import { Seaweed, Coral, Shell, Fish, Jellyfish } from './DecorElements';

export default function CoverPage({ onPlayClick }) {
  const [clickCount, setClickCount] = useState(0);
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 75 }); // Start at center, below text

  // Random positions for the button (as percentages)
  const randomPositions = [
    { x: 20, y: 30 },
    { x: 75, y: 25 },
    { x: 15, y: 70 },
    { x: 80, y: 75 },
    { x: 50, y: 65 },
  ];

  const handlePlayClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount < 5) {
      // Move to next random position
      const nextPos = randomPositions[newCount];
      setButtonPos({ x: nextPos.x, y: nextPos.y });
    } else if (newCount === 5) {
      // After 5th click, return to center
      setButtonPos({ x: 50, y: 50 });
      // Delay slightly so user sees it return to center, then go to game
      setTimeout(() => {
        onPlayClick();
      }, 400);
    }
  };

  return (
    <div className="cover-page">
      <div className="paper-texture" />
      
      {/* floating hearts and stars */}
      <div className="floating-heart heart-1" />
      <div className="floating-star star-1" />
      <div className="floating-heart heart-2" />
      <div className="floating-star star-2" />
      <div className="floating-heart heart-3" />
      <div className="floating-star star-3" />
      <div className="floating-heart heart-4" />
      <div className="floating-star star-4" />
      
      {/* seabed - bottom decorations */}
      <Seaweed x={8}  height={70} color="#b8d8c0" delay={0}   />
      <Seaweed x={12} height={55} color="#c8e0b8" delay={1.2} />
      <Seaweed x={22} height={75} color="#b8d8c0" delay={0.8} />
      <Seaweed x={32} height={60} color="#c8e0c0" delay={1.6} />
      <Seaweed x={42} height={65} color="#b8d8c0" delay={0.4} />
      <Seaweed x={62} height={70} color="#c8e0b8" delay={2.2} />
      <Seaweed x={72} height={55} color="#b8d8c0" delay={1.0} />
      <Seaweed x={82} height={65} color="#b8d8c0" delay={0.6} />
      <Seaweed x={88} height={50} color="#c8e0c0" delay={2}   />
      
      <Coral x={4}  color="#f7b8d1" />
      <Coral x={18} color="#f0c8d8" />
      <Coral x={35} color="#d4b8f7" />
      <Coral x={55} color="#f7b8d1" />
      <Coral x={70} color="#f0c8d8" />
      <Coral x={90} color="#d4b8f7" />
      
      <Shell x={10} color="#f7d0d8" />
      <Shell x={16} color="#f7e6b8" />
      <Shell x={28} color="#f7d0d8" />
      <Shell x={40} color="#f7e6b8" />
      <Shell x={52} color="#f7d0d8" />
      <Shell x={64} color="#f7e6b8" />
      <Shell x={74} color="#f7d0d8" />
      <Shell x={86} color="#f7e6b8" />

      <Fish x={6}  y={28} flipped={false} color="#c8d8f0" size={0.85} delay={0}   />
      <Fish x={20} y={35} flipped={true}  color="#f0d0c8" size={0.75} delay={2.5} />
      <Fish x={38} y={22} flipped={false} color="#e0d0f4" size={0.8}  delay={1.2} />
      <Fish x={55} y={40} flipped={true}  color="#c8d8f0" size={0.7}  delay={3.2} />
      <Fish x={72} y={18} flipped={true}  color="#e0d0f4" size={0.7}  delay={1.5} />
      <Fish x={14} y={55} flipped={false} color="#f0d0c8" size={0.65} delay={3}   />
      <Fish x={84} y={48} flipped={false} color="#d8c8f0" size={0.75} delay={0.9} />
      
      <Jellyfish x={12} y={20} color="#f7d0e0" size={0.65} delay={1.8} />
      <Jellyfish x={28} y={45} color="#d4b8f7" size={0.75} delay={1.2} />
      <Jellyfish x={45} y={15} color="#f0d0e8" size={0.7}  delay={2.6} />
      <Jellyfish x={58} y={25} color="#e8c8f0" size={0.75} delay={1.6} />
      <Jellyfish x={65} y={35} color="#d4b8f7" size={0.8}  delay={0.3} />
      <Jellyfish x={75} y={55} color="#f7d0e0" size={0.7}  delay={2.9} />
      <Jellyfish x={78} y={30} color="#d4b8f7" size={0.8}  delay={0.5} />
      <Jellyfish x={5}  y={40} color="#f7d0e0" size={0.7}  delay={2}   />
      <Jellyfish x={92} y={25} color="#e8c8f0" size={0.65} delay={1.4} />

      <div className="cover-content">
        <h1 className="cover-title">MemeFest</h1>
        
        <div className="cover-about">
          <p>Click the jar to release memes, then drag them to the teabag to see more memes!</p>
          <p>Can you handle the chaos and become a meme master?</p>
        </div>
        
        <button
          className="play-button"
          onClick={handlePlayClick}
          style={{
            left: `${buttonPos.x}%`,
            top: `${buttonPos.y}%`,
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
