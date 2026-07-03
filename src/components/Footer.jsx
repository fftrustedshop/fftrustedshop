import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  const waLink = "https://wa.me/918368905639?text=Hello!%20I%20want%20to%20buy%20a%20Free%20Fire%20ID";

  return (
    <footer
      style={{
        background: "#0d0d2b",
        borderTop: "1px solid rgba(0,229,255,0.1)",
        padding: "40px 16px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 32, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>🔥</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>FF Trusted Shop</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
              The most trusted marketplace for premium Free Fire account IDs. Fast, secure, and guaranteed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "🏠 Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                { label: "🎮 Accounts", action: () => document.getElementById("accounts")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "💬 Support", action: () => document.getElementById("support")?.scrollIntoView({ behavior: "smooth" }) },
              ].map(l => (
                <button key={l.label} onClick={l.action} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, textAlign: "left", cursor: "pointer", padding: 0 }} className="hover:text-cyan-400">
                  {l.label}
                </button>
              ))}
              <Link to="/admin" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>🛡️ Admin</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: "#00c853", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                📱 WhatsApp Support
              </a>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>⏰ Available 24/7</p>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>🌍 India-wide Delivery</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>© {year} FF Trusted Shop. All rights reserved.</p>
          <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>Made with 🔥 for the Free Fire community</p>
        </div>
      </div>
    </footer>
  );
}
