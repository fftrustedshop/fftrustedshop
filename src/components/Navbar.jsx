import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Accounts", to: "#accounts" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleContactClick = () => {
    setMenuOpen(false);
    // Scroll to footer contact section
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(2, 6, 23, 0.92)"
          : "rgba(2, 6, 23, 0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(249,115,22,0.18)"
          : "1px solid rgba(255,255,255,0.04)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-2xl">🔥</span>
            <span
              className="font-extrabold text-lg tracking-tight"
              style={{
                background: "linear-gradient(135deg, #facc15, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FF Trusted Shop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.to.startsWith("#") ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f1f5f9";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: location.pathname === link.to ? "#f97316" : "#94a3b8",
                    background:
                      location.pathname === link.to
                        ? "rgba(249,115,22,0.1)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.to) {
                      e.currentTarget.style.color = "#f1f5f9";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.to) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              onClick={handleContactClick}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f1f5f9";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Contact
            </button>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919999999999?text=Hello!%20I%20want%20to%20buy%20a%20Free%20Fire%20ID"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                boxShadow: "0 0 16px rgba(22,163,74,0.35)",
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: "#f1f5f9" }}
          >
            <span
              className="block w-5 h-0.5 bg-current transition-all duration-300"
              style={{
                transform: menuOpen ? "rotate(45deg) translate(3px, 5px)" : "none",
              }}
            />
            <span
              className="block w-5 h-0.5 bg-current transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-current transition-all duration-300"
              style={{
                transform: menuOpen ? "rotate(-45deg) translate(3px, -5px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          borderTop: menuOpen ? "1px solid rgba(249,115,22,0.12)" : "none",
        }}
      >
        <div className="px-4 py-4 space-y-1" style={{ background: "rgba(2,6,23,0.97)" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color: location.pathname === link.to ? "#f97316" : "#cbd5e1",
                background:
                  location.pathname === link.to
                    ? "rgba(249,115,22,0.1)"
                    : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleContactClick}
            className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-300 transition-all"
          >
            Contact
          </button>
          <a
            href="https://wa.me/919999999999?text=Hello!%20I%20want%20to%20buy%20a%20Free%20Fire%20ID"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white mt-2"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
