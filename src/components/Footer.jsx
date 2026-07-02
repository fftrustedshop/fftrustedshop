import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Admin Panel", to: "/admin" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="relative mt-20 pt-16 pb-8 px-4 overflow-hidden"
      style={{
        borderTop: "1px solid rgba(249,115,22,0.12)",
        background: "linear-gradient(180deg, #020617 0%, #050d1f 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔥</span>
              <span
                className="font-extrabold text-xl"
                style={{
                  background: "linear-gradient(135deg, #facc15, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FF Trusted Shop
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The most trusted marketplace for premium Free Fire account IDs. Fast, secure, and guaranteed.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 text-sm hover:text-orange-400 transition-colors duration-200"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={scrollToContact}
                  className="text-slate-400 text-sm hover:text-orange-400 transition-colors duration-200"
                >
                  → Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 text-sm hover:text-green-400 transition-colors duration-200"
              >
                <span className="text-green-400">📱</span>
                WhatsApp Support
              </a>
              <p className="text-slate-400 text-sm flex items-center gap-3">
                <span className="text-orange-400">⏰</span>
                Available 24/7
              </p>
              <p className="text-slate-400 text-sm flex items-center gap-3">
                <span className="text-yellow-400">🌍</span>
                Worldwide Delivery
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-slate-500 text-sm">
            © {year} FF Trusted Shop. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Made with 🔥 for the Free Fire community
          </p>
        </div>
      </div>
    </footer>
  );
}
