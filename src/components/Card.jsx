/**
 * Card component — Premium gaming marketplace card
 * Firebase fields preserved: title, badge, price, oldPrice, videoUrl, features, sold, featured
 */
export default function Card({
  title,
  videoUrl,
  badge,
  price,
  oldPrice,
  features,
  sold,
  featured,
}) {
  // ── Auto-calculate discount ──
  const numPrice = parseFloat(price) || 0;
  const numOld = parseFloat(oldPrice) || 0;
  const discount =
    numOld > 0 && numPrice > 0
      ? Math.round(((numOld - numPrice) / numOld) * 100)
      : null;

  // ── WhatsApp pre-filled message ──
  const waMessage = encodeURIComponent(
    `Hello! I want to buy:\n\n*${title || "Free Fire ID"}*\nPrice: ₹${price}\n\nPlease confirm availability.`
  );
  const waLink = `https://wa.me/919999999999?text=${waMessage}`;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-400 card-hover-glow"
      style={{
        background: "rgba(15,23,42,0.85)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transform: "translateY(0)",
        transition: "transform 0.35s cubic-bezier(.22,.61,.36,1), box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* ── Featured Ribbon ── */}
      {featured && (
        <div
          className="absolute top-4 right-[-28px] z-20 px-10 py-1 text-xs font-black tracking-widest uppercase rotate-45"
          style={{
            background: "linear-gradient(135deg, #facc15, #f97316)",
            color: "#020617",
          }}
        >
          ⭐ Featured
        </div>
      )}

      {/* ── Video / Iframe ── */}
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
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: "rgba(15,23,42,0.6)" }}
          >
            🎮
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-3 right-3 z-10 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide"
            style={{
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(249,115,22,0.4)",
            }}
          >
            {badge}
          </span>
        )}

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(15,23,42,0.9))" }}
        />
      </div>

      {/* ── Card Body ── */}
      <div className="p-5">

        {/* Title */}
        <h2 className="text-white font-bold text-lg leading-tight mb-3 line-clamp-2">
          {title || "Free Fire Account"}
        </h2>

        {/* Pricing */}
        <div className="flex items-end gap-3 mb-4">
          <span
            className="text-3xl font-black"
            style={{
              background: "linear-gradient(135deg, #facc15, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ₹{price}
          </span>

          {oldPrice && (
            <span className="text-slate-500 line-through text-base mb-0.5">
              ₹{oldPrice}
            </span>
          )}

          {discount !== null && discount > 0 && (
            <span className="text-green-400 text-sm font-bold mb-0.5">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Features list */}
        {features && features.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-orange-400 flex-shrink-0 mt-0.5">✦</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* ── BUY NOW Button ── */}
        {sold ? (
          <button
            disabled
            className="w-full py-3.5 rounded-xl font-bold text-base cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#475569",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            🚫 SOLD OUT
          </button>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta block w-full py-3.5 rounded-xl font-bold text-base text-white text-center transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
            }}
          >
            <span>🛒 BUY NOW</span>
          </a>
        )}
      </div>

      {/* ── Sold Out Overlay ── */}
      {sold && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{
            background: "rgba(2,6,23,0.78)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="text-center px-6 py-4 rounded-2xl"
            style={{
              background: "rgba(15,23,42,0.9)",
              border: "2px solid rgba(239,68,68,0.4)",
            }}
          >
            <div className="text-4xl mb-2">🚫</div>
            <p className="text-red-400 font-black text-xl uppercase tracking-widest">Sold Out</p>
            <p className="text-slate-400 text-xs mt-1">This account has been sold</p>
          </div>
        </div>
      )}
    </div>
  );
}