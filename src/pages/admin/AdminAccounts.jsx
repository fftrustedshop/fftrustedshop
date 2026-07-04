import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
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

function Textarea({ label, value, onChange, placeholder, gridSpan = "span 2" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: gridSpan }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
      <textarea
        className="admin-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "#161b3d",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 10,
          color: "#fff",
          fontSize: 14,
          lineHeight: "1.5",
          outline: "none",
          resize: "vertical",
          minHeight: 120,
          fontFamily: "inherit",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "16px 20px",
      transition: "background 0.2s"
    }}>
      <div>
        <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{label}</div>
        {sub && <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{sub}</div>}
      </div>
      <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        <div style={{ width: 46, height: 24, borderRadius: 12, background: checked ? "#00c853" : "#334155", transition: "background 0.2s", position: "relative" }}>
          <div style={{ position: "absolute", top: 3, left: checked ? 25 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
        </div>
      </label>
    </div>
  );
}

const EMPTY_FORM = { title: "", badge: "", price: "", oldPrice: "", videoUrl: "", features: "", sold: false, featured: false, popupFeatured: false };

function parseFeatures(str) {
  return str.split("\n").map(s => s.trim()).filter(Boolean);
}
function stringifyFeatures(arr) {
  return Array.isArray(arr) ? arr.join("\n") : (arr || "");
}

function CardForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    if (!form.price || isNaN(form.price)) return alert("Enter a valid price");
    onSave({
      title: form.title.trim(),
      badge: form.badge.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : "",
      videoUrl: form.videoUrl.trim(),
      features: parseFeatures(form.features),
      sold: !!form.sold,
      featured: !!form.featured,
      popupFeatured: !!form.popupFeatured,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Input label="Account Title *" value={form.title} onChange={set("title")} placeholder="e.g. Diamond Elite FF Account" />
        </div>
        <Input label="Badge Text" value={form.badge} onChange={set("badge")} placeholder="e.g. 86% OFF, NEW, WEEK OFFER" />
        <Input label="Price (₹) *" type="number" value={form.price} onChange={set("price")} placeholder="e.g. 599" min="0" />
        <Input label="Old Price (₹)" type="number" value={form.oldPrice} onChange={set("oldPrice")} placeholder="e.g. 1499" min="0" />
        <div style={{ gridColumn: "1 / -1" }}>
          <Input label="YouTube Embed URL" value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://www.youtube.com/embed/xxxxx" fullWidth />
        </div>
        <Textarea
          label="Features (one per line)"
          value={typeof form.features === "string" ? form.features : stringifyFeatures(form.features)}
          onChange={set("features")}
          placeholder={"Level 60\nEVO Gun Max\n100+ Skins"}
          gridSpan="1 / -1"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
        <Toggle label="Sold Out" sub="Mark as sold — shows SOLD OUT button" checked={!!form.sold} onChange={set("sold")} />
        <Toggle label="🪟 Popup on Load" sub="Show this card as a popup on entry" checked={!!form.popupFeatured} onChange={set("popupFeatured")} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 28px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{ background: saving ? "#334155" : "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
        >
          {saving ? "Saving…" : "💾 Save Card"}
        </button>
      </div>
    </form>
  );
}

export default function AdminAccounts() {
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [mode, setMode] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const snap = await getDocs(collection(db, "Cards"));
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoadingCards(false);
  };

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await addDoc(collection(db, "Cards"), data);
      setMsg({ text: "✅ Card added!", ok: true });
      setMode(null);
      fetchCards();
    } catch {
      setMsg({ text: "❌ Failed to add card.", ok: false });
    }
    setSaving(false);
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "Cards", editCard.id), data);
      setMsg({ text: "✅ Card updated!", ok: true });
      setMode(null);
      setEditCard(null);
      fetchCards();
    } catch {
      setMsg({ text: "❌ Failed to update card.", ok: false });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "Cards", id));
      setMsg({ text: "✅ Card deleted!", ok: true });
      setCards(prev => prev.filter(c => c.id !== id));
    } catch {
      setMsg({ text: "❌ Failed to delete card.", ok: false });
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
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>🎮</span>
            <div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: 0 }}>Shop Accounts</h1>
              <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0 0" }}>Manage account listings, statuses, and configurations</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {mode === null && (
              <button
                onClick={() => setMode("add")}
                style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
              >
                ＋ Add New Account
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
            <h2 style={{ color: "#00e5ff", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>➕ Create Listing Card</h2>
            <CardForm onSave={handleAdd} onCancel={() => setMode(null)} saving={saving} />
          </div>
        )}

        {/* Edit Form */}
        {mode === "edit" && editCard && (
          <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ color: "#f9a825", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>✏️ Update Existing Card</h2>
            <CardForm initial={{ ...editCard, features: stringifyFeatures(editCard.features) }} onSave={handleEdit} onCancel={() => { setMode(null); setEditCard(null); }} saving={saving} />
          </div>
        )}

        {/* Main List */}
        {mode === null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ color: "#94a3b8", fontWeight: 700, fontSize: 16, margin: 0 }}>
                Account Management
              </h2>
              <button onClick={fetchCards} style={{ background: "rgba(12, 114, 187, 1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "white", fontSize: 15, cursor: "pointer", fontWeight: 500 }}>
                🔄 Refresh
              </button>
            </div>

            {loadingCards ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 60, background: "#131338", borderRadius: 16 }}>Syncing dataset collections...</div>
            ) : cards.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 60, background: "#131338", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>No listing cards configured yet. Launch your first marketplace instance!</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                {cards.map(card => (
                  <div
                    key={card.id}
                    style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifySelf: "stretch" }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: "#0d0d2b", border: "1px solid rgba(255,255,255,0.05)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                      {card.videoUrl ? "🎬" : "🎮"}
                    </div>

                    <div style={{ flex: "1 1 240px" }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{card.title || "Untitled Card Component"}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#00c853", fontWeight: 800, fontSize: 15 }}>₹{card.price}</span>
                        {card.oldPrice && <span style={{ color: "#64748b", textDecoration: "line-through", fontSize: 13, marginRight: 4 }}>₹{card.oldPrice}</span>}
                        {card.badge && <span style={{ background: "#c62828", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "3px 8px", textTransform: "uppercase" }}>{card.badge}</span>}
                        {card.sold && <span style={{ background: "#334155", color: "#94a3b8", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "3px 8px" }}>SOLD</span>}
                        {card.featured && <span style={{ background: "rgba(249,168,37,0.15)", color: "#f9a825", border: "1px solid rgba(249,168,37,0.3)", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>⭐ FEATURED</span>}
                        {card.popupFeatured && <span style={{ background: "rgba(123,31,162,0.15)", color: "#ba68c8", border: "1px solid rgba(123,31,162,0.3)", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>🪟 POPUP</span>}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: "auto" }}>
                      <button
                        onClick={() => { setEditCard(card); setMode("edit"); }}
                        style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}
                      >
                        ✏️ Edit Data
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        disabled={deletingId === card.id}
                        style={{ background: deletingId === card.id ? "#374151" : "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: deletingId === card.id ? "not-allowed" : "pointer" }}
                      >
                        {deletingId === card.id ? "Removing..." : "🗑 Remove"}
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
