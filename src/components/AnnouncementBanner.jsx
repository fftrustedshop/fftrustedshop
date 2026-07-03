import { useState, useEffect } from "react";

export default function AnnouncementBanner() {
  // Countdown: 12 hours, 7 minutes, 36 seconds (matching the screenshot)
  const [timeLeft, setTimeLeft] = useState((12 * 3600) + (7 * 60) + 36);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const items = [
    "💎 Huge Discounts Available",
    "⚡ Instant Delivery",
    "🚀 Limited Time Offer",
    "⭐⭐⭐⭐⭐ 4.9/5 Customer Rating",
    "🔥 1000+ Happy Customers",
    "🛡️ 100% Secure Transactions",
    "💰 Lowest Prices Guaranteed",
  ];

  const text = items.join("   |   ");

  return (
    /* Top-level Layout Wrapper to replicate placement/inset from the screenshot */
    <div style={{ width: "100%", padding: "20px 0", display: "flex", justifyContent: "center", background: "transparent" }}>
      <div
        className="w-full flex items-center justify-between gap-6 px-8 py-3 overflow-hidden"
        style={{
          maxWidth: "760px", // Exact scale restraint relative to main content width
          background: "rgba(11, 12, 34, 0.75)",
          border: "1px solid rgba(0, 229, 255, 0.25)",
          borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.05)",
          minHeight: "72px",
          boxSizing: "border-box",
          margin: "0 16px"
        }}
      >
        {/* Scrolling Ticker with Glowing Text Effects */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div
            className="animate-marquee whitespace-nowrap font-black text-sm sm:text-base tracking-wider uppercase"
            style={{
              color: "#ffea00",
              textShadow: "0 0 10px rgba(255, 234, 0, 0.6), 0 0 2px rgba(255, 234, 0, 0.3)"
            }}
          >
            <span className="inline-block pr-16">{text}</span>
            <span className="inline-block pr-16">{text}</span>
          </div>
        </div>

        {/* Glowing Cyberpunk Digital Timer Panel */}
        <div
          style={{
            padding: "2px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(0, 229, 255, 0.6), rgba(0, 229, 255, 0.15))",
            boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
            flexShrink: 0
          }}
        >
          <div
            className="font-mono font-black text-xl sm:text-2xl px-5 py-2 rounded-xl select-none"
            style={{
              background: "#061329",
              color: "#00e5ff",
              letterSpacing: "0.06em",
              textShadow: "0 0 14px rgba(0, 229, 255, 0.95), 0 0 4px rgba(0, 229, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "140px",
              height: "46px",
              boxSizing: "border-box"
            }}
          >
            {hh}:{mm}:{ss}
          </div>
        </div>
      </div>
    </div>
  );
}