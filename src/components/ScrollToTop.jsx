import { useEffect, useState } from "react";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const supportMessage = encodeURIComponent(
    "Hi! I need some help regarding a Free Fire account. Could you please assist me?"
  );

  const waLink = `https://wa.me/917225023941?text=${supportMessage}`;

  return (
    <>
      {/* Customer Support Floating Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Customer Support"
      >
        <div
          className="flex items-center overflow-hidden rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: "58px",
            height: "58px",
            backgroundColor: "white",
          }}
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: "58px",
              height: "58px",
            }}
          >
            <img src="https://imgs.search.brave.com/QCaMfveLCfbE9aadY4YhljVogZ-LXozLc6FfZvxXm7E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS9h/cmNhZGUvMTIwMC9j/dXN0b21lci1zdXBw/b3J0LmpwZw" alt="" srcset="" />
          </div>

          {/* Text */}
          <span
            className="font-bold whitespace-nowrap"
            style={{
              color: "black",
              opacity: 0,
              maxWidth: 0,
              overflow: "hidden",
              transition: "all .3s ease",
              fontSize: "15px",
            }}
          >
            Customer Support
          </span>
        </div>
      </a>

      {/* Scroll to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg hover:scale-110 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg,#f9a825,#e65100)",
            boxShadow: "0 0 18px rgba(249,168,37,0.5)",
          }}
        >
          ↑
        </button>
      )}

      {/* CSS */}
      <style>{`
        .group:hover > div {
          width: 220px !important;
        }

        .group:hover span {
          opacity: 1 !important;
          max-width: 160px !important;
          margin-right: 18px;
        }

        .group:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .group:hover > div {
            width: 58px !important;
          }

          .group:hover span {
            opacity: 0 !important;
            max-width: 0 !important;
            margin-right: 0;
          }
        }
      `}</style>
    </>
  );
}