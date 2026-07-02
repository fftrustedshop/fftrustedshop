import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 hover:scale-110 animate-bounce-soft"
      style={{
        background: "linear-gradient(135deg, #f97316, #ef4444)",
        boxShadow: "0 0 20px rgba(249,115,22,0.5), 0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      ↑
    </button>
  );
}
