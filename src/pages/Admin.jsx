import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc,
} from "firebase/firestore";

// ── Password ──────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "fftrustedshop";

// ── Helpers ───────────────────────────────────────────────────────────────────
function Input({ label, type = "text", value, onChange, placeholder, min }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <input
        className="admin-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <textarea
        className="admin-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{ resize: "vertical", minHeight: 96, fontFamily: "inherit" }}
      />
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px" }}>
      <div>
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{label}</div>
        {sub && <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
      <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        <div style={{ width: 44, height: 24, borderRadius: 12, background: checked ? "#00c853" : "#334155", transition: "background 0.25s", position: "relative" }}>
          <div style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s" }} />
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

// ── Card Form ─────────────────────────────────────────────────────────────────
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
      price: form.price,
      oldPrice: form.oldPrice,
      videoUrl: form.videoUrl.trim(),
      features: parseFeatures(form.features),
      sold: !!form.sold,
      featured: !!form.featured,
      popupFeatured: !!form.popupFeatured,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Input label="Account Title *" value={form.title} onChange={set("title")} placeholder="e.g. Diamond Elite FF Account" />
      <Input label="Badge Text" value={form.badge} onChange={set("badge")} placeholder="e.g. 86% OFF, NEW, WEEK OFFER" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Price (₹) *" type="number" value={form.price} onChange={set("price")} placeholder="e.g. 599" min="0" />
        <Input label="Old Price (₹)" type="number" value={form.oldPrice} onChange={set("oldPrice")} placeholder="e.g. 1499" min="0" />
      </div>
      <Input label="YouTube Embed URL" value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://www.youtube.com/embed/xxxxx" />
      <Textarea
        label="Features (one per line)"
        value={typeof form.features === "string" ? form.features : stringifyFeatures(form.features)}
        onChange={set("features")}
        placeholder={"Level 60\nEVO Gun Max\n100+ Skins"}
      />
      <Toggle label="Sold Out" sub="Mark as sold — shows SOLD OUT button" checked={!!form.sold} onChange={set("sold")} />
      <Toggle label="⭐ Featured" sub="Highlight this card in the shop" checked={!!form.featured} onChange={set("featured")} />
      <Toggle label="🪟 Popup on Load" sub="Show this card as a popup when site opens" checked={!!form.popupFeatured} onChange={set("popupFeatured")} />

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button
          type="submit"
          disabled={saving}
          style={{ flex: 1, background: saving ? "#334155" : "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 900, fontSize: 15, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Saving…" : "💾 Save Card"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main Admin ────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // null = list view | "add" = add form | cardId = edit form
  const [mode, setMode] = useState(null);
  const [editCard, setEditCard] = useState(null);

  const [msg, setMsg] = useState(null); // { text, ok }

  // ── Payment Settings ──
  const [upiId, setUpiId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState(null);

  // ── Auth ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      fetchCards();
      fetchPaymentSettings();
    } else {
      setPwError("❌ Wrong password. Try again.");
    }
  };

  // ── Fetch Cards ──
  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const snap = await getDocs(collection(db, "Cards"));
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { }
    setLoadingCards(false);
  };

  // ── Fetch Payment Settings ──
  const fetchPaymentSettings = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "payment"));
      if (snap.exists()) { setUpiId(snap.data().upiId || ""); setQrUrl(snap.data().qrUrl || ""); }
    } catch { }
  };

  // ── Save Payment Settings ──
  const savePaymentSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await setDoc(doc(db, "settings", "payment"), { upiId: upiId.trim(), qrUrl: qrUrl.trim() });
      setSettingsMsg({ text: "✅ Payment settings saved!", ok: true });
    } catch {
      setSettingsMsg({ text: "❌ Failed to save settings.", ok: false });
    }
    setSavingSettings(false);
    setTimeout(() => setSettingsMsg(null), 3000);
  };

  // ── Add ──
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

  // ── Edit ──
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

  // ── Delete ──
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

  // Auto-clear message
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  // ── Password screen ──────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d2b", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 380, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: 18, padding: 36, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🛡️</div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Enter the password to continue</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              className="admin-input"
              type="password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(""); }}
              placeholder="Password"
              autoFocus
              style={{ textAlign: "center", fontSize: 16, letterSpacing: "0.15em" }}
            />
            {pwError && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: 0 }}>{pwError}</p>}
            <button
              type="submit"
              style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 900, fontSize: 15, cursor: "pointer" }}
            >
              🔓 Login
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 16, color: "#334155", fontSize: 12 }}>
            <a href="/" style={{ color: "#00bcd4", textDecoration: "none" }}>← Back to Shop</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ──────────────────────────────────────────────────────
  const panelStyle = { minHeight: "100vh", background: "#0d0d2b", padding: "24px 16px" };
  const containerStyle = { maxWidth: 900, margin: "0 auto" };

  return (
    <div style={panelStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🛡️</span>
            <div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0 }}>Admin Dashboard</h1>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Manage all Free Fire account listings</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {mode === null && (
              <button
                onClick={() => setMode("add")}
                style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
              >
                + Add Card
              </button>
            )}
            <a href="/" style={{ color: "#00bcd4", fontSize: 13, textDecoration: "none" }}>← Shop</a>
          </div>
        </div>

        {/* Toast message */}
        {msg && (
          <div style={{ background: msg.ok ? "rgba(0,200,83,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${msg.ok ? "#00c853" : "#ef4444"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: msg.ok ? "#00e676" : "#f87171", fontWeight: 700, fontSize: 14 }}>
            {msg.text}
          </div>
        )}

        {/* ── Add Form ── */}
        {mode === "add" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 28 }}>
            <h2 style={{ color: "#00e5ff", fontWeight: 800, fontSize: 17, marginTop: 0, marginBottom: 18 }}>➕ Add New Card</h2>
            <CardForm
              onSave={handleAdd}
              onCancel={() => setMode(null)}
              saving={saving}
            />
          </div>
        )}

        {/* ── Edit Form ── */}
        {mode === "edit" && editCard && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 28 }}>
            <h2 style={{ color: "#f9a825", fontWeight: 800, fontSize: 17, marginTop: 0, marginBottom: 18 }}>✏️ Edit Card</h2>
            <CardForm
              initial={{ ...editCard, features: stringifyFeatures(editCard.features) }}
              onSave={handleEdit}
              onCancel={() => { setMode(null); setEditCard(null); }}
              saving={saving}
            />
          </div>
        )}

        {/* ── Card list ── */}
        {mode === null && (
          <>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ color: "#94a3b8", fontWeight: 700, fontSize: 15, margin: 0 }}>
                All Cards ({cards.length})
              </h2>
              <button onClick={fetchCards} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                🔄 Refresh
              </button>
            </div>

            {loadingCards ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>Loading cards…</div>
            ) : cards.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No cards yet. Add your first one!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cards.map(card => (
                  <div
                    key={card.id}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}
                  >
                    {/* Thumbnail / placeholder */}
                    <div style={{ width: 80, height: 50, borderRadius: 8, background: "#1e1e4a", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {card.videoUrl ? "🎬" : "🎮"}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{card.title || "Untitled"}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {card.badge && <span style={{ background: "#c62828", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 7px" }}>{card.badge}</span>}
                        {card.sold && <span style={{ background: "#424242", color: "#9e9e9e", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 7px" }}>SOLD OUT</span>}
                        {card.featured && <span style={{ background: "#f9a825", color: "#000", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 7px" }}>⭐ FEATURED</span>}
                        {card.popupFeatured && <span style={{ background: "#7b1fa2", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 7px" }}>🪟 POPUP</span>}
                        <span style={{ color: "#00c853", fontWeight: 800, fontSize: 13 }}>₹{card.price}</span>
                        {card.oldPrice && <span style={{ color: "#64748b", textDecoration: "line-through", fontSize: 12 }}>₹{card.oldPrice}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => { setEditCard(card); setMode("edit"); }}
                        style={{ background: "linear-gradient(135deg,#1976d2,#1565c0)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        disabled={deletingId === card.id}
                        style={{ background: deletingId === card.id ? "#374151" : "linear-gradient(135deg,#c62828,#b71c1c)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: deletingId === card.id ? "not-allowed" : "pointer" }}
                      >
                        {deletingId === card.id ? "…" : "🗑 Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}