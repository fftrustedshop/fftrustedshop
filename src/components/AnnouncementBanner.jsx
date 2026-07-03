import { useState, useEffect } from "react";

export default function AnnouncementBanner() {
  // Countdown: 14 hours from mount
  const [timeLeft, setTimeLeft] = useState(14 * 3600);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const items = [
    "🔥 Huge Discounts Available",
    "⚡ Instant Delivery",
    "🚀 Limited Time Offer",
    "⭐⭐⭐⭐⭐ 4.9/5 Customer Rating",
    "🔥 1000+ Happy Customers",
    "🛡️ 100% Secure Transactions",
    "💰 Lowest Prices Guaranteed",
  ];
  const text = items.join("   •   ");

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-2 overflow-hidden"
      style={{
        background: "#0d0d2b",
        borderBottom: "1px solid rgba(0,229,255,0.2)",
      }}
    >
      {/* Scrolling Ticker */}
      <div className="flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-white text-xs sm:text-sm font-semibold tracking-wide">
          <span className="inline-block pr-16">{text}</span>
          <span className="inline-block pr-16">{text}</span>
        </div>
      </div>

      {/* Countdown */}
      <div
        className="flex-shrink-0 font-mono font-black text-lg sm:text-2xl px-4 py-2 rounded-lg"
        style={{
          background: "linear-gradient(135deg, #0d2244, #0a1a35)",
          border: "2px solid #00e5ff",
          color: "#00e5ff",
          letterSpacing: "0.08em",
          boxShadow:
            "0 0 18px rgba(0,229,255,0.3), inset 0 0 12px rgba(0,229,255,0.08)",
          textShadow: "0 0 10px rgba(0,229,255,0.8)",
        }}
      >
        {hh}:{mm}:{ss}
      </div>
    </div>
  );
}
