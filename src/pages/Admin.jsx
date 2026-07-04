import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ADMIN_PASSWORD = "fftrustedshop";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
    } else {
      setPwError("❌ Wrong password. Try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setPwInput("");
    setPwError("");
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d2b", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#131338", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 20, padding: 40, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: 0, fontFamily: "sans-serif" }}>Admin Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 8, fontFamily: "sans-serif" }}>Enter the password to access system controls</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(""); }}
              placeholder="••••••••••••"
              autoFocus
              style={{ textAlign: "center", fontSize: 16, letterSpacing: "0.15em", width: "100%", padding: "14px", background: "#0d0d2b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", outline: "none" }}
            />
            {pwError && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: 0, fontFamily: "sans-serif" }}>{pwError}</p>}
            <button
              type="submit"
              style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)", fontFamily: "sans-serif" }}
            >
              🔓 Access Dashboard
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, margin: 0 }}>
            <Link to="/" style={{ color: "#00bcd4", textDecoration: "none", fontSize: 13, fontFamily: "sans-serif" }}>← Back to Shop</Link>
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "💳 Payment Configuration",
      desc: "Manage shop merchant UPI ID, QR Code uploads, and verification setups.",
      path: "/admin/payment",
      color: "linear-gradient(135deg, #00b4db, #0083b0)",
      shadow: "rgba(0, 180, 219, 0.3)",
    },
    {
      title: "🎮 Shop Listings",
      desc: "Add, update, or remove marketplace accounts, prices, badges, and videos.",
      path: "/admin/accounts",
      color: "linear-gradient(135deg, #11998e, #38ef7d)",
      shadow: "rgba(56, 239, 125, 0.3)",
    },
    {
      title: "💬 Customer Reviews",
      desc: "Create and edit user testimonials, stars, text comments, and timestamps.",
      path: "/admin/reviews",
      color: "linear-gradient(135deg, #f857a6, #ff5858)",
      shadow: "rgba(255, 88, 88, 0.3)",
    },
    {
      title: "📢 Announcement Ticker",
      desc: "Dynamically customize the scrolling marquee announcements seen on the shop banner.",
      path: "/admin/announcements",
      color: "linear-gradient(135deg, #f9d423, #ff4e50)",
      shadow: "rgba(255, 78, 80, 0.3)",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d2b", padding: "60px 24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 28, margin: 0 }}>🛡️ System Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: 15, margin: "6px 0 0 0" }}>Choose a system panel to manage store content configurations</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/" style={{ color: "#00bcd4", fontSize: 14, textDecoration: "none", fontWeight: 600, padding: "10px 20px", background: "rgba(0,188,212,0.08)", borderRadius: 10, border: "1px solid rgba(0,188,212,0.15)" }}>
              ← Shop landing
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="dashboard-card"
              style={{
                textDecoration: "none",
                background: "#131338",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: item.color,
                  boxShadow: `0 8px 20px ${item.shadow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#fff"
                }}
              >
                {item.title.substring(0, 2)}
              </div>
              <div>
                <h3 style={{ color: "#fff", margin: "12px 0 6px 0", fontSize: 18, fontWeight: 700 }}>
                  {item.title.substring(3)}
                </h3>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: 14, lineHeight: "1.5" }}>
                  {item.desc}
                </p>
              </div>
              
              {/* Dynamic hover overlay border */}
              <div className="card-hover-border" />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Styles for hover effect */}
      <style>
        {`
          .dashboard-card:hover {
            transform: translateY(-5px);
            border-color: rgba(0, 229, 255, 0.3) !important;
            box-shadow: 0 12px 40px rgba(0, 229, 255, 0.15) !important;
          }
        `}
      </style>
    </div>
  );
}