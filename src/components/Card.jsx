import { useState } from "react";
import PhonePopup from "./PhonePopup";

const TAG_COLORS = [
  { bg: "rgba(123, 31, 162, 0.15)", text: "#ba68c8", border: "rgba(123, 31, 162, 0.4)" },
  { bg: "rgba(229, 57, 53, 0.15)", text: "#ef5350", border: "rgba(229, 57, 53, 0.4)" },
  { bg: "rgba(230, 81, 0, 0.15)", text: "#ff9800", border: "rgba(230, 81, 0, 0.4)" },
  { bg: "rgba(21, 101, 192, 0.15)", text: "#42a5f5", border: "rgba(21, 101, 192, 0.4)" },
  { bg: "rgba(0, 150, 136, 0.15)", text: "#26a69a", border: "rgba(0, 150, 136, 0.4)" },
  { bg: "rgba(255, 234, 0, 0.1)", text: "#ffea00", border: "rgba(255, 234, 0, 0.3)" },
  { bg: "rgba(173, 20, 87, 0.15)", text: "#ec407a", border: "rgba(173, 20, 87, 0.4)" },
];

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
      {/* 
        - Removed all dynamic JavaScript mouse listeners.
        - Changed background to matching premium cyber dark.
        - Fixed with static classes to completely eliminate the iframe half-width bug.
      */}
      <div
        className="w-full flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#11122b] to-[#07081a] relative transition-transform duration-300 ease-out hover:-translate-y-2 layout-fixed-card"
        style={{
          border: "2px solid #ff1744",
          boxShadow: `
      0 12px 30px rgba(0,0,0,0.7),
      0 0 20px rgba(255,23,68,0.75),
      0 0 40px rgba(255,23,68,0.55),
      0 0 70px rgba(255,23,68,0.35),
      inset 0 0 12px rgba(255,23,68,0.25)
    `,
          animation: "cyberPulse 3s ease-in-out infinite",
        }}
      >
        {/* Neon Red Ribbon Header */}
        <div
          className="w-full py-2.5 px-4 text-center font-black text-sm text-white uppercase tracking-widest relative z-10 flex-shrink-0"
          style={{
            background: "linear-gradient(90deg, #ff1744, #b71c1c, #ff1744)",
            textShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
          }}
        >
          {ribbon}
        </div>

        {/* Video / Image Asset Frame */}
        <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9", borderBottom: "1px solid rgba(255, 23, 68, 0.2)" }}>
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={title}
              className="w-full h-full absolute inset-0 block"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-b from-gray-900 to-black select-none">
              🎮
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07081a]/50 to-transparent z-10" />
        </div>

        {/* Card Body Info Wrapper */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4 w-full">
          <div>
            {/* Feature pill lists configured as neon micro badges */}
            {features && features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {features.map((feat, i) => {
                  const c = TAG_COLORS[i % TAG_COLORS.length];
                  return (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-black tracking-wide uppercase border whitespace-nowrap"
                      style={{ background: c.bg, color: c.text, borderColor: c.border, boxShadow: `0 0 25px ${c.border}, inset 0 0 10px ${c.border}` }}
                    >
                      {feat}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Account Description Title */}
            {title && (
              <p className="font-bold text-sm leading-snug line-clamp-2 uppercase tracking-wide text-white" style={{ textShadow: "0 0 25px rgba(0, 229, 255, 0.45)" }}>
                {title}
              </p>
            )}
          </div>

          <div>
            {/* Pricing Panel */}
            <div className="flex bg-transparent items-center gap-3 mb-4 flex-wrap bg-black/40 p-3 rounded-xl border border-white/5 w-full">
              <div className="flex flex-col">
                {oldPrice && <span className="text-gray-500 line-through text-xs font-semibold">₹{oldPrice}</span>}
                <span className="text-white font-black text-2xl tracking-tight">
                  ₹{price}
                </span>
              </div>
              {disc && (
                <span
                  className="ml-auto text-xs font-black px-2.5 py-1 rounded border"
                  style={{
                    background: "rgba(0, 200, 83, 0.1)",
                    color: "#00e676",
                    borderColor: "rgba(0, 200, 83, 0.3)",
                    textShadow: "0 0 6px rgba(0, 230, 118, 0.4)"
                  }}
                >
                  {disc}% OFF
                </span>
              )}
            </div>

            {/* Main Action CTA Button */}
            {sold ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest bg-[#222] text-gray-600 border border-gray-800 cursor-not-allowed"
              >
                SOLD OUT
              </button>
            ) : (
              <button
                onClick={() => setShowPopup(true)}
                className="w-full py-3.5 rounded-xl font-black text-sm text-white uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #ff1744, #b71c1c)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 14px rgba(255, 23, 68, 0.4)"
                }}
              >
                BUY NOW!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Global Style Keyframe block */}
      <style>{`
        .layout-fixed-card {
          min-width: 100% !important;
          max-width: 100% !important;
        }
        @keyframes cyberPulse {
          0%, 100% {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 12px rgba(255, 23, 68, 0.2);
            border-color: #ff1744;
          }
          50% {
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 22px rgba(255, 23, 68, 0.45);
            border-color: #ff5252;
          }
        }
      `}</style>

      {/* Phone activation popup window */}
      {showPopup && (
        <PhonePopup card={{ id, title, price }} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}