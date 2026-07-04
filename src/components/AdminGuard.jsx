import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("admin_authed") === "true";
    if (!isAuthed) {
      navigate("/admin");
    } else {
      setAuthed(true);
    }
  }, [navigate]);

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d2b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ color: "#64748b", fontSize: 14 }}>Verifying Authorization...</div>
        </div>
      </div>
    );
  }

  return children;
}
