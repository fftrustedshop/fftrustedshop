import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";

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
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getSecondsToNext12Hours());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const q = query(collection(db, "Announcements"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        if (snap.empty) {
          const seeded = [];
          const now = Date.now();
          const STATIC_ANNOUNCEMENTS = [
            "💎 Huge Discounts Available",
            "⚡ Instant Delivery",
            "🚀 Limited Time Offer",
            "⭐⭐⭐⭐⭐ 4.9/5 Customer Rating",
            "🔥 1000+ Happy Customers",
            "🛡️ 100% Secure Transactions",
            "💰 Lowest Prices Guaranteed",
          ];
          for (let i = 0; i < STATIC_ANNOUNCEMENTS.length; i++) {
            const textVal = STATIC_ANNOUNCEMENTS[i];
            const data = {
              text: textVal,
              createdAt: now + i * 1000
            };
            await addDoc(collection(db, "Announcements"), data);
            seeded.push(textVal);
          }
          setAnnouncements(seeded);
        } else {
          setAnnouncements(snap.docs.map(d => d.data().text));
        }
      } catch (e) {
        console.error("Firestore announcements error:", e);
        setAnnouncements([
          "💎 Huge Discounts Available",
          "⚡ Instant Delivery",
          "🚀 Limited Time Offer",
          "⭐⭐⭐⭐⭐ 4.9/5 Customer Rating",
          "🔥 1000+ Happy Customers",
          "🛡️ 100% Secure Transactions",
          "💰 Lowest Prices Guaranteed",
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const text = announcements.join("   |   ");

  return (
    <div style={{ fontFamily: "Tiro Devanagari Hindi", width: "100%", padding: "20px 0 0 0", display: "flex", justifyContent: "center", background: "transparent" }}>
      <div
        className="w-full max-w-4xl flex items-center justify-between mx-1 pr-2 py-3 overflow-hidden"
        style={{
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
          {loading ? (
            <div className="text-white/60 text-sm pl-4">Loading updates...</div>
          ) : (
            <div
              className="animate-marquee whitespace-nowrap text-[18px] uppercase"
              style={{
                color: "#e8d502ff",
                textShadow: "0 0 25px rgba(255, 234, 0, 0.6), 0 0 25px rgba(255, 234, 0, 0.3)",
                backgroundColor: "rgba(255, 234, 0, 0.23)",
              }}
            >
              <span className="inline-block font-semibold">{text}</span>
              <span className="inline-block font-semibold">{text}</span>
            </div>
          )}
        </div>

        {/* Glowing Cyberpunk Digital Timer Panel */}
        <div
          style={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b87ebff,#194da1ff)",
            boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
            flexShrink: 0,
            animation: "pulseGlow 2.5s ease-in-out infinite"
          }}
        >
          <div
            className="font-black text-2xl rounded-[9px] select-none"
            style={{
              background: "linear-gradient(200deg, #13398aff 0%, #091832ff 100%)",
              border: "1px solid #17cdffff",
              color: "#00e5ff",
              textShadow: "0 0 25px rgba(0, 229, 255, 0.69)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "125px",
              height: "46px",
              boxSizing: "border-box",
              fontFamily: "monospace",
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