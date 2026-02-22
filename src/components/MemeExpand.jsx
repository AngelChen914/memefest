import "./MemeExpand.css";

export default function MemeExpand({ char, onClose }) {
  if (!char) return null;
  return (
    <div className="meme-expand-backdrop" onClick={onClose}>
      <div className="meme-expand-card" onClick={(e) => e.stopPropagation()}>
        <button className="meme-expand-close" onClick={onClose}>✕</button>
        <img src={char.imageUrl} alt={char.name} className="meme-expand-image" />
        <p className="meme-expand-name">{char.name}</p>
      </div>
    </div>
  );
}