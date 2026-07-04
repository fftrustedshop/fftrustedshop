import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

function Input({ label, type = "text", value, onChange, placeholder, min, fullWidth = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: fullWidth ? "1fr" : "span 1" }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
      <input
        className="admin-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#161b3d",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 10,
          color: "#fff",
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}

function AnnouncementForm({ initial, onSave, onCancel, saving }) {
  const [text, setText] = useState(initial ? initial.text : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Announcement text is required");
    onSave({ text: text.trim() });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input
        label="Announcement Text *"
        value={text}
        onChange={setText}
        placeholder="e.g. 💎 Huge Discounts Available"
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 24px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{ background: saving ? "#334155" : "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
        >
          {saving ? "Saving…" : "💾 Save Announcement"}
        </button>
      </div>
    </form>
  );
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [mode, setMode] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
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
          const docRef = await addDoc(collection(db, "Announcements"), data);
          seeded.push({ id: docRef.id, ...data });
        }
        setAnnouncements(seeded);
      } else {
        setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (e) {
      console.error("Firestore fetch error:", e);
    }
    setLoading(false);
  };

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await addDoc(collection(db, "Announcements"), { ...data, createdAt: Date.now() });
      setMsg({ text: "✅ Announcement added!", ok: true });
      setMode(null);
      fetchAnnouncements();
    } catch {
      setMsg({ text: "❌ Failed to add announcement.", ok: false });
    }
    setSaving(false);
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "Announcements", editItem.id), data);
      setMsg({ text: "✅ Announcement updated!", ok: true });
      setMode(null);
      setEditItem(null);
      fetchAnnouncements();
    } catch {
      setMsg({ text: "❌ Failed to update announcement.", ok: false });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "Announcements", id));
      setMsg({ text: "✅ Announcement deleted!", ok: true });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch {
      setMsg({ text: "❌ Failed to delete announcement.", ok: false });
    }
    setDeletingId(null);
  };

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d2b", padding: "40px 24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>📢</span>
            <div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: 0 }}>Announcement Ticker</h1>
              <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0 0" }}>Manage marquee texts shown at the top of the landing page</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {mode === null && (
              <button
                onClick={() => setMode("add")}
                style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
              >
                ＋ Add New Text
              </button>
            )}
            <Link to="/admin" style={{ color: "#00bcd4", fontSize: 14, textDecoration: "none", fontWeight: 500, padding: "8px 16px", background: "rgba(0,188,212,0.08)", borderRadius: 8, border: "1px solid rgba(0,188,212,0.15)" }}>
              ← System Dashboard
            </Link>
          </div>
        </div>

        {/* Dynamic Toast Messages */}
        {msg && (
          <div style={{ background: msg.ok ? "rgba(0,200,83,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${msg.ok ? "#00c853" : "#ef4444"}`, borderRadius: 10, padding: "14px 20px", color: msg.ok ? "#00e676" : "#f87171", fontWeight: 600, fontSize: 14 }}>
            {msg.text}
          </div>
        )}

        {/* Create Form */}
        {mode === "add" && (
          <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ color: "#00e5ff", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>➕ Add Banner Announcement</h2>
            <AnnouncementForm onSave={handleAdd} onCancel={() => setMode(null)} saving={saving} />
          </div>
        )}

        {/* Edit Form */}
        {mode === "edit" && editItem && (
          <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ color: "#f9a825", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>✏️ Update Banner Announcement</h2>
            <AnnouncementForm initial={editItem} onSave={handleEdit} onCancel={() => { setMode(null); setEditItem(null); }} saving={saving} />
          </div>
        )}

        {/* Main List */}
        {mode === null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ color: "#94a3b8", fontWeight: 700, fontSize: 16, margin: 0 }}>
                Announcements
              </h2>
              <button onClick={fetchAnnouncements} style={{ background: "rgba(12, 114, 187, 1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "white", fontSize: 15, cursor: "pointer", fontWeight: 500 }}>
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 60, background: "#131338", borderRadius: 16 }}>Syncing banner texts queue...</div>
            ) : announcements.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 60, background: "#131338", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>No custom banner ticker texts loaded. Create one to start!</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                {announcements.map((item, index) => (
                  <div
                    key={item.id}
                    style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px", display: "flex", alignItems: "center", justifySelf: "stretch" }}
                  >

                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, flexGrow: 1, marginRight: 16 }}>
                      {item.text}
                    </div>

                    <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                      <button
                        onClick={() => { setEditItem(item); setMode("edit"); }}
                        style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "background 0.2s" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        style={{ background: deletingId === item.id ? "#374151" : "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 12, cursor: deletingId === item.id ? "not-allowed" : "pointer" }}
                      >
                        {deletingId === item.id ? "Removing..." : "🗑 Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
