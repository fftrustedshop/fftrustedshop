import { useState } from "react";
import PhonePopup from "./PhonePopup";

const TAG_COLORS = [
  { bg: "#7b1fa2", text: "#fff" },
  { bg: "#c62828", text: "#fff" },
  { bg: "#e65100", text: "#fff" },
  { bg: "#1565c0", text: "#fff" },
  { bg: "#00695c", text: "#fff" },
  { bg: "#f57f17", text: "#000" },
  { bg: "#ad1457", text: "#fff" },
];
const TAG_ICONS = ["♦", "⚡", "🔥", "💎", "✦", "🎯", "🏆"];

function discount(price, oldPrice) {
  const p = parseFloat(price) || 0;
  const o = parseFloat(oldPrice) || 0;
  return o > 0 && p > 0 && o > p ? Math.round(((o - p) / o) * 100) : null;
}

export default function Card({ id, title, videoUrl, badge, price, oldPrice, features, sold }) {
  const [showPopup, setShowPopup] = useState(false);
  const disc = discount(price, oldPrice);
  const ribbon = badge ? badge.toUpperCase() : disc ? `${disc}% OFF` : "BUY NOW";

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-300 relative">

        {/* Red ribbon header */}
        <div
          className="py-2 px-3 text-center font-black text-sm text-white uppercase tracking-wider"
          style={{ background: "linear-gradient(135deg,#e53935,#c62828)" }}
        >
          {ribbon}
        </div>

        {/* Video / Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none", display: "block" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-900">🎮</div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Feature tag pills */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {features.map((feat, i) => {
                const c = TAG_COLORS[i % TAG_COLORS.length];
                return (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {TAG_ICONS[i % TAG_ICONS.length]} {feat}
                  </span>
                );
              })}
            </div>
          )}

          {/* Title */}
          {title && <p className="font-bold text-gray-900 text-sm mb-2 leading-snug line-clamp-2">{title}</p>}

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-3">
            {oldPrice && <span className="text-gray-400 line-through text-sm">₹{oldPrice}</span>}
            <span className="text-gray-900 font-black text-xl">₹{price}</span>
            {disc && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{disc}% OFF</span>}
          </div>

          {/* Button */}
          {sold ? (
            <button
              disabled
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider cursor-not-allowed bg-gray-600 text-gray-400"
            >
              SOLD OUT
            </button>
          ) : (
            <button
              onClick={() => setShowPopup(true)}
              className="w-full py-3 rounded-xl font-black text-sm text-white uppercase tracking-wider leading-tight hover:opacity-90 hover:scale-[1.02] transition-all"
              style={{ background: "linear-gradient(135deg,#1976d2,#1565c0)", boxShadow: "0 4px 16px rgba(25,118,210,0.4)" }}
            >
              BUY NOW
            </button>
          )}
        </div>
      </div>

      {/* Phone popup */}
      {showPopup && (
        <PhonePopup card={{ id, title, price }} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}