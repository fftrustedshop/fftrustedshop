import { useEffect, useState } from "react";

const TAG_COLORS = [
  { bg: "#7b1fa2", color: "#fff" },
  { bg: "#c62828", color: "#fff" },
  { bg: "#e65100", color: "#fff" },
  { bg: "#1565c0", color: "#fff" },
  { bg: "#00695c", color: "#fff" },
  { bg: "#f57f17", color: "#000" },
];
const TAG_ICONS = ["♦", "⚡", "🔥", "💎", "✦", "🎯"];

export default function PopupModal({ card, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so CSS transition plays
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!card) return null;

  const waMessage = encodeURIComponent(
    `Hello! I want to buy:\n\n*${card.title || "Free Fire ID"}*\nPrice: ₹${card.price}\n\nPlease confirm availability.`
  );
  const waLink = `https://wa.me/919999999999?text=${waMessage}`;

  const discount =
    card.oldPrice && card.price && parseFloat(card.oldPrice) > parseFloat(card.price)
      ? Math.round(((parseFloat(card.oldPrice) - parseFloat(card.price)) / parseFloat(card.oldPrice)) * 100)
      : null;

  const ribbonLabel = card.badge
    ? card.badge.toUpperCase()
    : discount
    ? `${discount}% OFF`
    : "HOT DEAL";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        className="animate-popup-in relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-lg"
          style={{ background: "rgba(0,0,0,0.6)" }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Red ribbon */}
        <div className="card-ribbon">{ribbonLabel}</div>

        {/* Image / iframe */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {card.videoUrl ? (
            <iframe
              src={card.videoUrl}
              title={card.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none", display: "block" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: "#111" }}>
              🎮
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Tags */}
          {card.features && card.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {card.features.map((feat, i) => {
                const c = TAG_COLORS[i % TAG_COLORS.length];
                return (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: c.bg, color: c.color }}>
                    {TAG_ICONS[i % TAG_ICONS.length]} {feat}
                  </span>
                );
              })}
            </div>
          )}

          {/* Title */}
          {card.title && (
            <p className="font-bold text-gray-900 text-sm mb-2">{card.title}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            {card.oldPrice && (
              <span className="text-gray-400 line-through text-sm">₹{card.oldPrice}</span>
            )}
            <span className="text-gray-900 font-black text-xl">₹{card.price}</span>
            {discount && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-buy" onClick={onClose}>
            WATCH COLLECTION<br />BUY NOW
          </a>

          <button
            onClick={onClose}
            className="mt-3 w-full text-center text-gray-400 text-sm hover:text-gray-600 transition-colors"
          >
            No thanks, continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
