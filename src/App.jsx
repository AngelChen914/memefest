import { useState, useEffect, useRef, createRef } from "react";
import Decorations from "./components/Decorations";
import CoverPage from "./components/CoverPage";
import "./App.css";
import { Seaweed, Coral, Shell, Fish, Jellyfish } from "./components/DecorElements";
import OceanJar from "./components/OceanJar";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('cover'); // 'cover' | 'game'
  const [wiggle, setWiggle] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [memes, setMemes] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const bubbleIdRef = useRef(0);
  
  // Active floating characters
  const [activeCharacters, setActiveCharacters] = useState([]);
  const characterIdRef = useRef(0);
  const charactersRef = useRef({});
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingCharId, setDraggingCharId] = useState(null);
  const [isStopped, setIsStopped] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [sixtySevenActive, setSixtySevenActive] = useState(false)
  
  // Fetch memes from Imgflip API on mount
  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.memes) {
          setMemes(data.data.memes);
        }
      })
      .catch((err) => console.error('Failed to fetch memes:', err));
  }, []);

  // Trigger 67 image when count reaches 6
  useEffect(() => {
    if (clickCount === 6) {
      setSixtySevenActive(true);
      const timer = setTimeout(() => {
        setSixtySevenActive(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  useEffect(() => {
    let lastTime = 0;
    const handleMouseMoveGlobal = (e) => {
      // Bubble trail
      const now = Date.now();
      if (now - lastTime < 50) return;
      lastTime = now;

      const bubble = {
        id: bubbleIdRef.current++,
        x: e.clientX,
        y: e.clientY + (Math.random() - 0.5) * 50,
      };
      setBubbles((prev) => [...prev, bubble]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      }, 800);

      // Character dragging (disabled during 67 overlay)
      if (!sixtySevenActive && dragging && draggingCharId !== null && charactersRef.current[draggingCharId]) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        const char = charactersRef.current[draggingCharId];
        char.pos = { x: newX, y: newY };
        char.vel = { x: 0, y: 0 };
        setActiveCharacters([...activeCharacters]);
      }
    };

    window.addEventListener("mousemove", handleMouseMoveGlobal);
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal);
  }, [dragging, dragOffset, draggingCharId, activeCharacters]);

  // Check for 20 memes and stop functionality
  useEffect(() => {
    if (activeCharacters.length >= 20 && !showStop) {
      setShowStop(true);
      setIsStopped(true);
    } else if (activeCharacters.length < 20 && showStop) {
      setShowStop(false);
      setIsStopped(false);
    }
  }, [activeCharacters.length, showStop]);

  // Physics effect for all active characters
  useEffect(() => {
    if (activeCharacters.length === 0) return;

    let animationFrameId;
    const gravity = 0.5;
    const friction = 0.98;
    const bounce = 0.6;

    const updatePhysics = () => {
      let updated = false;
      const characters = Object.values(charactersRef.current);

      characters.forEach((char) => {
        if (char.isDragging) return;

        // Handle pop-out animation
        if (char.isAnimating) {
          const elapsed = Date.now() - char.animationStartTime;
          const duration = 1200; // 1.2 seconds for pop-out animation
          const progress = Math.min(elapsed / duration, 1);
          
          // Animate Y position from -150 to landing Y (bottom area)
          const startY = -150;
          const endY = window.innerHeight - 180;
          char.pos.y = startY + (endY - startY) * progress;
          
          // End animation and start physics when complete
          if (progress >= 1) {
            char.isAnimating = false;
            char.pos.y = endY;
            char.vel = { x: 0, y: 0 };
          }
        } else {
          char.pos.y += char.vel.y;
          char.vel.y += gravity;
          char.vel.x *= friction;
          char.vel.y *= friction;

          // Boundaries
          const minX = 50;
          const maxX = window.innerWidth - 50;
          const maxY = window.innerHeight - 180;

          if (char.pos.y > maxY) {
            char.pos.y = maxY;
            char.vel.y = 0;
          }

          if (char.pos.x < minX) {
            char.pos.x = minX;
            char.vel.x *= -bounce;
          } else if (char.pos.x > maxX) {
            char.pos.x = maxX;
            char.vel.x *= -bounce;
          }
        }

        updated = true;
      });

      // Collision detection - prevent characters from stacking
      const minDistance = 80;
      for (let i = 0; i < characters.length; i++) {
        for (let j = i + 1; j < characters.length; j++) {
          const char1 = characters[i];
          const char2 = characters[j];
          const dx = char2.pos.x - char1.pos.x;
          const dy = char2.pos.y - char1.pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance && distance > 0) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDistance - distance;
            const pushForce = overlap / 5;

            // Push characters apart horizontally
            char1.pos.x -= Math.cos(angle) * pushForce;
            char2.pos.x += Math.cos(angle) * pushForce;

            updated = true;
          }
        }
      }

      if (updated) {
        setActiveCharacters([...activeCharacters]);
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeCharacters]);

  const handleCharacterMouseDown = (charId, e) => {
    if (sixtySevenActive) return; // Disable dragging during 67 overlay
    setDragging(true);
    setDraggingCharId(charId);
    if (charactersRef.current[charId]) {
      charactersRef.current[charId].isDragging = true;
    }
    const rect = charactersRef.current[charId]?.ref?.current?.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    });
    // If there are many characters, indicate the logo can accept drops
    const logo = document.querySelector('.top-logo');
    if (logo) {
      logo.classList.add('trash-target');
    }
  };

  const handleReset = () => {
    setActiveCharacters([]);
    charactersRef.current = {};
    setClickCount(0);
    characterIdRef.current = 0;
    setSixtySevenActive(false);
  };

  const handleHome = () => {
    handleReset();
    setCurrentScreen('cover');
  };

  useEffect(() => {
    const handleMouseUp = (e) => {
      if (!dragging) return;

      // If dropped over logo while there are 15+ active characters, delete the dragged one
      try {
        const logo = document.querySelector('.top-logo');
        if (logo && draggingCharId !== null) {
          const rect = logo.getBoundingClientRect();
          const mx = e.clientX;
          const my = e.clientY;
          if (mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom) {
            // remove the character and decrement the jar count
            const idToRemove = draggingCharId;
            delete charactersRef.current[idToRemove];
            setActiveCharacters((prev) => prev.filter((c) => c.id !== idToRemove));
            setClickCount((prev) => prev - 1);
            setShowStop(false);
            setIsStopped(false);
          }
        }
      } catch (err) {
        // ignore
      }

      // cleanup drag state
      setDragging(false);
      if (charactersRef.current[draggingCharId]) {
        charactersRef.current[draggingCharId].isDragging = false;
        charactersRef.current[draggingCharId].vel = { x: 0, y: 0 };
      }
      setDraggingCharId(null);

      // remove visual indicator on logo
      const logo = document.querySelector('.top-logo');
      if (logo) logo.classList.remove('trash-target');
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [dragging, draggingCharId, activeCharacters]);

  // If on cover screen, show cover page
  if (currentScreen === 'cover') {
    return <CoverPage onPlayClick={() => setCurrentScreen('game')} />;
  }

  // Otherwise show game screen
  return (
    <div className="page">
      <div className="paper-texture" />

      {/* home and reset buttons */}
      <button className="home-button" onClick={handleHome}>Home</button>
      <button className="reset-top" onClick={handleReset}>Reset</button>

      {/* logo */}
      <img src="./images/logo.png" alt="logo" className="top-logo" />

      {/* bubble trail */}
      <div className="bubble-trail-container" aria-hidden="true">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble-trail"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#a2c2db" strokeWidth="1.6" opacity="0.75" />
              <circle cx="8" cy="8" r="2.5" fill="white" opacity="0.4" />
              <circle cx="15" cy="10" r="1.2" fill="white" opacity="0.25" />
            </svg>
          </div>
        ))}
      </div>

      <Decorations />

      {/* 67 image overlay */}
      {sixtySevenActive && (
        <div className="sixty-seven-overlay">
          <img src="./images/67-sixty-seven.gif" alt="67" className="sixty-seven-image" />
        </div>
      )}

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

      {/* swimmers - upper middle area */}
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
      <Jellyfish x={65} y={35} color="#d4b8f7" size={0.8}  delay={0.3} />
      <Jellyfish x={78} y={30} color="#d4b8f7" size={0.8}  delay={0.5} />
      <Jellyfish x={5}  y={40} color="#f7d0e0" size={0.7}  delay={2}   />
      <Jellyfish x={92} y={25} color="#e8c8f0" size={0.65} delay={1.4} />

      {/* content */}
      <div className="center-layout">
        <div className="title-block">
          <h1 className="main-title">MemeFest</h1>
        </div>
        <div className="jar-container" style={{ position: 'relative' }}>
          <div
            className={`card ${clickCount >= 20 ? "disabled" : ""}`}
            onClick={() => {
              if (memes.length === 0 || sixtySevenActive) return; // Don't allow clicking if memes haven't loaded
              if (isStopped) return; // Can't add more memes when stopped
              setWiggle(true);
              setClickCount((prev) => prev + 1);

              // pick a meme that isn't already active to avoid duplicates
              const usedIds = new Set(
                Object.values(charactersRef.current)
                  .map((c) => c.memeId)
                  .filter(Boolean)
              );
              const availableMemes = memes.filter(
                (m) => !usedIds.has(typeof m.id === "number" ? m.id : parseInt(m.id, 10))
              );
              if (availableMemes.length === 0) {
                // no unused memes left — show stop overlay and prevent adding
                setIsStopped(true);
                setShowStop(true);
                return;
              }
              const randomMeme =
                availableMemes[Math.floor(Math.random() * availableMemes.length)];
              const charId = characterIdRef.current++;

              const positions = [
                window.innerWidth * 0.25,
                window.innerWidth * 0.42,
                window.innerWidth * 0.5,
                window.innerWidth * 0.58,
                window.innerWidth * 0.75
              ];

              const landingX =
                positions[Math.floor(Math.random() * positions.length)];

              const newChar = {
                id: charId,
                memeId: typeof randomMeme.id === "number" ? randomMeme.id : parseInt(randomMeme.id, 10),
                name: randomMeme.name,
                imageUrl: randomMeme.url,
                pos: { x: landingX, y: -150 },
                vel: { x: 0, y: 0 },
                ref: createRef(),
                isDragging: false,
                isAnimating: true,
                animationStartTime: Date.now(),
              };

              charactersRef.current[charId] = newChar;
              setActiveCharacters((prev) => [...prev, newChar]);

              setTimeout(() => setWiggle(false), 600);
            }}
          >
            <div className={wiggle ? "wiggle" : ""}>
              <OceanJar count={clickCount} />
            </div>
          </div>
          {showStop && (
            <img
              src="./images/stop.png"
              alt="Stop"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 100,
              }}
            />
          )}
          <p className="card-hint">✦ Click the jar to peek inside ✦</p>
        </div>
        <div>
          {showStop && (
            <p className="card-hint">Drag a meme to the teabag to toss it away or reset</p>
          )}
        </div>

        {activeCharacters.map((char) => (
          <div
            key={char.id}
            className="popup-character"
            ref={char.ref}
            style={{
              position: "fixed",
              left: `${char.pos.x}px`,
              bottom: "auto",
              top: `${char.pos.y}px`,
              transform: "translateX(-50%)",
              zIndex: 30,
              opacity: char.isAnimating ? Math.min((Date.now() - char.animationStartTime) / 1200, 1) : 1,
            }}
            onMouseDown={(e) => handleCharacterMouseDown(char.id, e)}
          >
            <img
              src={char.imageUrl}
              alt={char.name}
              className="nailong-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}