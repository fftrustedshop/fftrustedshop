import { useState, useEffect } from "react";

export default function AnnouncementBanner() {
  // Function to calculate seconds remaining until the next 12-hour block (12:00 AM or 12:00 PM)
  const getSecondsToNext12Hours = () => {
    const now = new Date();
    const currentHours = now.getHours();

    // Determine the next target hour threshold (12 or 24/0)
    const targetHours = currentHours < 12 ? 12 : 24;

    const targetTime = new Date(now);
    targetTime.setHours(targetHours, 0, 0, 0);

    const differenceInMs = targetTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(differenceInMs / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(getSecondsToNext12Hours());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getSecondsToNext12Hours());
    }, 1000);

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
    <div style={{ fontFamily: "Arial", width: "100%", padding: "20px 0 0 0", display: "flex", justifyContent: "center", background: "transparent" }}>
      <div
        className="w-full flex items-center justify-between gap-6 px-8 py-3 overflow-hidden"
        style={{
          maxWidth: "760px",
          background: "rgba(11, 12, 34, 0.75)",
          border: "1px solid rgba(0, 229, 255, 0.25)",
          borderRadius: "14px",
          boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
          minHeight: "72px",
          boxSizing: "border-box",
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
            flexShrink: 0,
            animation: "pulseGlow 2.5s ease-in-out infinite"
          }}
        >
          <div
            className="font-mono font-black text-lg sm:text-xl px-4 py-1.5 rounded-[9px] select-none"
            style={{
              background: "linear-gradient(180deg, #040a17 0%, #081226 100%)",
              color: "#00e5ff",
              letterSpacing: "0.08em",
              textShadow: "0 0 10px rgba(0, 229, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "125px",
              height: "40px",
              boxSizing: "border-box",
              boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
            }}
          >
            {hh}:{mm}:{ss}
          </div>
        </div>
      </div>
      <style>
        {`@keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 12px rgba(0,229,255,0.25);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.04);
            box-shadow: 0 0 20px rgba(0,229,255,0.45);
          }
        }`}
      </style>
    </div>
  );
}