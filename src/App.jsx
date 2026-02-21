import { useState, useEffect, useRef, createRef } from "react";
import Decorations from "./Decorations";
import "./App.css";
import { Seaweed, Coral, Shell, Fish, Jellyfish } from "./components/DecorElements";
import OceanJar from "./components/OceanJar";

export default function App() {
  const [wiggle, setWiggle] = useState(false);
  const [jarOpening, setJarOpening] = useState(false);
  const [clickCount, setClickCount] = useState(1);
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

  useEffect(() => {
    let lastTime = 0;
    const handleMouseMoveGlobal = (e) => {
      // Bubble trail
      const now = Date.now();
      if (now - lastTime < 30) return;
      lastTime = now;

      const bubble = {
        id: bubbleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      };
      setBubbles((prev) => [...prev, bubble]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      }, 800);

      // Character dragging
      if (dragging && draggingCharId !== null && charactersRef.current[draggingCharId]) {
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
    // Indicate the logo can accept drops while dragging
    const logo = document.querySelector('.top-logo');
    if (logo) {
      logo.classList.add('trash-target');
    }
  };

  const handleReset = () => {
    setActiveCharacters([]);
    charactersRef.current = {};
    setClickCount(1);
    characterIdRef.current = 0;
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
            // remove the character and increment the jar count
            const idToRemove = draggingCharId;
            delete charactersRef.current[idToRemove];
            setActiveCharacters((prev) => prev.filter((c) => c.id !== idToRemove));
            setClickCount((prev) => prev + 1);
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

  return (
    <div className="page">
      <div className="paper-texture" />

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
              <circle cx="12" cy="12" r="10" fill="none" stroke="#b8d8f0" strokeWidth="1.6" opacity="0.75" />
              <circle cx="8" cy="8" r="2.5" fill="white" opacity="0.4" />
              <circle cx="15" cy="10" r="1.2" fill="white" opacity="0.25" />
            </svg>
          </div>
        ))}
      </div>

      <Decorations />

      {/* seabed */}
      <Seaweed x={8}  height={70} color="#b8d8c0" delay={0}   />
      <Seaweed x={12} height={55} color="#c8e0b8" delay={1.2} />
      <Seaweed x={82} height={65} color="#b8d8c0" delay={0.6} />
      <Seaweed x={88} height={50} color="#c8e0c0" delay={2}   />
      <Coral x={4}  color="#f7b8d1" />
      <Coral x={90} color="#d4b8f7" />
      <Shell x={16} color="#f7e6b8" />
      <Shell x={74} color="#f7d0d8" />

      {/* swimmers */}
      <Fish x={6}  y={28} flipped={false} color="#c8d8f0" size={0.85} delay={0}   />
      <Fish x={72} y={18} flipped={true}  color="#e0d0f4" size={0.7}  delay={1.5} />
      <Fish x={14} y={55} flipped={false} color="#f0d0c8" size={0.65} delay={3}   />
      <Jellyfish x={78} y={30} color="#d4b8f7" size={0.8} delay={0.5} />
      <Jellyfish x={5}  y={40} color="#f7d0e0" size={0.7} delay={2}   />

      {/* content */}
      <div className="center-layout">
        <div className="title-block">
          <h1 className="main-title">MemeFest</h1>
        </div>
        <div className="jar-container">
          <div
            className={`card ${wiggle ? "wiggle" : ""} ${jarOpening ? "opening" : ""}`}
            onClick={() => {
              if (memes.length === 0) return; // Don't allow clicking if memes haven't loaded
              setWiggle(true);
              setJarOpening(true);
              setClickCount((prev) => prev + 1);
              
              // Pick a random meme from Imgflip
              const randomMeme = memes[Math.floor(Math.random() * memes.length)];
              const charId = characterIdRef.current++;
              
              // Vary the landing X position so memes don't land at the same spot
              const positions = [
                window.innerWidth * 0.25,
                window.innerWidth * 0.42,
                window.innerWidth * 0.5,
                window.innerWidth * 0.58,
                window.innerWidth * 0.75
              ];
              const landingX = positions[Math.floor(Math.random() * positions.length)];
              
              const newChar = {
                id: charId,
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
              setActiveCharacters([...activeCharacters, newChar]);
              
              // Close jar after animation (1.5s for cap opening)
              setTimeout(() => setJarOpening(false), 1500);
              setTimeout(() => setWiggle(false), 600);
            }}
          >
            <OceanJar count={clickCount} />
          </div>
          <p className="card-hint">✦ click the jar to peek inside ✦</p>
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
              cursor: draggingCharId === char.id ? "grabbing" : "grab",
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