# MemeFest 🎪

An interactive ocean-themed jar experience where clicking pops out memes from Imgflip. Drag memes to the trash logo to recycle them back into the jar's collection counter.

## Features

- **Interactive Jar** — Click to peek inside and watch memes pop out with smooth animations.
- **Physics Simulation** — Memes fall with realistic gravity, friction, and collision avoidance.
- **Drag & Drop** — Grab any meme and drag it to the trash logo to delete it (and increment the jar counter).
- **Responsive Design** — Beautiful ocean-themed UI with seaweed, coral, fish, and jellyfish decorations.
- **Dynamic Memes** — Fetches random memes from the Imgflip public API.
- **Bubble Trail** — Mouse cursor leaves a trail of animated bubbles.
- **Paper Texture** — Subtle noise overlay for a tactile, artisanal feel.

## Tech Stack

### Frontend
- **React 19** — Component-based UI with hooks (useState, useEffect, useRef, createRef)
- **Vite 7** — Fast build tool and dev server
- **CSS3** — Keyframe animations, gradients, flexbox, and drop-shadow filters

### Styling & Animation
- **Google Fonts** — Zen Maru Gothic (UI) & Playfair Display (title)
- **CSS Animations** — Fade-in, wiggle, cap opening, bubble float, sway
- **SVG Graphics** — All decorative elements (jar, fish, jellyfish, coral, seaweed)

### External APIs
- **Imgflip Public API** — GET `/get_memes` endpoint for meme sourcing

### Dev Tools
- **ESLint 9** — Code quality and style checking
- **React Refresh** — Fast module hot-reloading during development

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm 

### Installation

```bash
cd memefest
npm install
```

### Development

Start the local dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (adjust port if needed).

### Build for Production

```bash
npm run build
```

Output is written to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## How to Play

1. **Click the Jar** — Click the ocean jar in the center to open the cap and spawn a random meme.
2. **Watch It Fall** — Memes pop out from the top, fade in, and fall with gravity.
3. **Grab a Meme** — Click and drag any meme floating on screen.
4. **Recycle It** — Drag a meme over the logo in the top-right. It will highlight as a drop target.
5. **Drop & Increment** — Release the meme over the logo to delete it and increment the jar's collection counter.
6. **Reset** — Click the "Reset" button in the top-left to clear all memes and restart.

## File Structure

```
memefest/
├── public/
│   └── images/
│       ├── cursor-memefest.png
│       └── logo.png
├── src/
│   ├── components/
│   │   ├── DecorElements.jsx   # Seaweed, Coral, Shell, Fish, Jellyfish
│   │   └── OceanJar.jsx        # Main jar SVG component
│   ├── App.jsx                  # Main app logic, physics, drag & drop
│   ├── App.css                  # Animations and styling
│   ├── Decorations.jsx          # Background decorative components
│   ├── Decorations.css
│   ├── index.css                # Global styles
│   └── main.jsx                 # React DOM entry point
├── vite.config.js
├── eslint.config.js
├── package.json
├── index.html
└── README.md
```

## Physics Engine

The app includes a simplified 2D physics system:

- **Gravity** — 0.5 px/frame²
- **Friction** — 0.98x velocity per frame
- **Collision Avoidance** — Characters push apart if within ~80px (pairwise repulsion)
- **Landing Zone** — Memes settle ~180px above the window bottom
- **No Bounce** — Bottom collision is inelastic (velocity zeroed)

## Animations

- **Pop-out Spawn** — 1.2s fade-in and Y-position interpol from top
- **Jar Wiggle** — 0.55s ease on click
- **Cap Opening** — 1.5s rotate and fade-out on jar open
- **Bubble Trail** — 0.8s float and fade following the mouse
- **Fade-Up Entrance** — Title, jar, and hint fade in on page load

## Future Ideas

- Sound effects on jar open, meme pop, and trash drop
- Leaderboard or counter persistence (localStorage/backend)
- Meme search/filter by category
- Difficulty levels (faster falling, more collision)
- Mobile touch support for drag & drop
- Custom meme upload
- Multiplayer / real-time sharing

## License

See [LICENSE](./LICENSE) file.

---

**Made with ❤️ at HopperHacks**
