import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy,
} from "firebase/firestore";
import { getDirectImageLink, resizeAndCompressImage } from "../utils/helpers";

// ── Password ──────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "fftrustedshop";

// ── Shared UI Sub-Components ───────────────────────────────────────────────────
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

const EMPTY_REVIEW = { name: "", stars: 5, text: "", time: "" };

function formatReviewTime(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `Today | ${displayHours}:${displayMinutes} ${ampm}`;
}

function ReviewForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => {
    if (initial) return initial;
    return { ...EMPTY_REVIEW, time: formatReviewTime() };
  });

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");
    if (!form.text.trim()) return alert("Review text is required");
    onSave({
      name: form.name.trim(),
      stars: Number(form.stars),
      text: form.text.trim(),
      time: form.time.trim() || formatReviewTime(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Input label="Customer Name *" value={form.name} onChange={set("name")} placeholder="e.g. Aman Singh" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Rating (Stars) *
          </label>
          <select
            value={form.stars}
            onChange={e => set("stars")(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#161b3d",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box"
            }}
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n} style={{ background: "#131338", color: "#fff" }}>
                {n} ★
              </option>
            ))}
          </select>
        </div>

        <Input label="Display Time (e.g. 'Today | 3:42 PM')" value={form.time} onChange={set("time")} placeholder="e.g. Today | 3:42 PM" />

        <Textarea
          label="Review Text *"
          value={form.text}
          onChange={set("text")}
          placeholder="Enter what customer said..."
          gridSpan="1 / -1"
        />
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
          {saving ? "Saving…" : "💾 Save Review"}
        </button>
      </div>
    </form>
  );
}

// ── Card Form Component ────────────────────────────────────────────────────────
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
      {/* Input Grid Grid */}
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

      {/* Toggles Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
        <Toggle label="Sold Out" sub="Mark as sold — shows SOLD OUT button" checked={!!form.sold} onChange={set("sold")} />
        {/* <Toggle label="⭐ Featured" sub="Highlight this card in the shop" checked={!!form.featured} onChange={set("featured")} /> */}
        <Toggle label="🪟 Popup on Load" sub="Show this card as a popup on entry" checked={!!form.popupFeatured} onChange={set("popupFeatured")} />
      </div>

      {/* Actions */}
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

// ── Main Admin Component ──────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");

  const [activeTab, setActiveTab] = useState("listings"); // "listings" or "reviews"

  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editReview, setEditReview] = useState(null);

  const [mode, setMode] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [msg, setMsg] = useState(null);

  const [upiId, setUpiId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState(null);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      fetchCards();
      fetchPaymentSettings();
      fetchReviews();
    } else {
      setPwError("❌ Wrong password. Try again.");
    }
  };

  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const snap = await getDocs(collection(db, "Cards"));
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { }
    setLoadingCards(false);
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const q = query(collection(db, "Reviews"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (snap.empty) {
        const seeded = [];
        const now = Date.now();
        const STATIC_REVIEWS = [
          { name: "Aman Singh", stars: 5, text: "Received my account within minutes. Everything was exactly as described. Great experience!", time: "Today | 3:42 PM" },
          { name: "Priyanshu Kumar", stars: 5, text: "Amazing seller! Login worked perfectly and support replied instantly. Highly recommended.", time: "Today | 2:18 PM" },
          { name: "Rohit Patel", stars: 5, text: "Bought a premium account at a very good price. Delivery was super fast.", time: "Today | 1:07 PM" },
          { name: "Aditya Sharma", stars: 5, text: "Everything went smoothly. Secure payment and genuine account. Will buy again.", time: "Today | 12:26 PM" },
          { name: "Harsh Gupta", stars: 4, text: "Delivery took a few extra minutes but the account was exactly as promised.", time: "Today | 11:54 AM" },
          { name: "Nikhil Verma", stars: 5, text: "Best prices I've found so far. Genuine seller and quick response on WhatsApp.", time: "Today | 10:39 AM" },
          { name: "Deepak Yadav", stars: 5, text: "Account had all the listed items. Very satisfied with the purchase.", time: "Today | 9:58 AM" },
          { name: "Arjun Mehta", stars: 4, text: "Excellent service! The account was delivered almost instantly after payment.", time: "Yesterday | 8:41 PM" },
          { name: "Vivek Mishra", stars: 5, text: "Customer support was very helpful and guided me through the login process.", time: "Yesterday | 6:15 PM" },
          { name: "Karan Joshi", stars: 4, text: "Trusted seller. This was my second purchase and both orders were perfect.", time: "Yesterday | 4:33 PM" }
        ];
        for (let i = 0; i < STATIC_REVIEWS.length; i++) {
          const r = STATIC_REVIEWS[i];
          const data = {
            name: r.name,
            stars: r.stars,
            text: r.text,
            time: r.time,
            createdAt: now - i * 60000
          };
          const docRef = await addDoc(collection(db, "Reviews"), data);
          seeded.push({ id: docRef.id, ...data });
        }
        setReviews(seeded);
      } else {
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingReviews(false);
  };

  const fetchPaymentSettings = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "payment"));
      if (snap.exists()) { setUpiId(snap.data().upiId || ""); setQrUrl(snap.data().qrUrl || ""); }
    } catch { }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      const base64Data = await resizeAndCompressImage(file, 300, 300);
      setUploadProgress(75);
      setQrUrl(base64Data);
      setUploadProgress(100);
      setSettingsMsg({ text: "✅ QR Code optimized & loaded! Click 'Save Payment Config' to save changes.", ok: true });
    } catch (err) {
      console.error("QR Code processing error:", err);
      setSettingsMsg({ text: `❌ Processing failed: ${err.message || err}`, ok: false });
    } finally {
      setUploadingQr(false);
    }
  };

  const savePaymentSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const cleanedQrUrl = getDirectImageLink(qrUrl);
      await setDoc(doc(db, "settings", "payment"), { upiId: upiId.trim(), qrUrl: cleanedQrUrl });
      setQrUrl(cleanedQrUrl);
      setSettingsMsg({ text: "✅ Payment settings saved!", ok: true });
    } catch {
      setSettingsMsg({ text: "❌ Failed to save settings.", ok: false });
    }
    setSavingSettings(false);
    setTimeout(() => setSettingsMsg(null), 3000);
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

  const handleAddReview = async (data) => {
    setSaving(true);
    try {
      await addDoc(collection(db, "Reviews"), { ...data, createdAt: Date.now() });
      setMsg({ text: "✅ Review added!", ok: true });
      setMode(null);
      fetchReviews();
    } catch {
      setMsg({ text: "❌ Failed to add review.", ok: false });
    }
    setSaving(false);
  };

  const handleEditReview = async (data) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "Reviews", editReview.id), data);
      setMsg({ text: "✅ Review updated!", ok: true });
      setMode(null);
      setEditReview(null);
      fetchReviews();
    } catch {
      setMsg({ text: "❌ Failed to update review.", ok: false });
    }
    setSaving(false);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "Reviews", id));
      setMsg({ text: "✅ Review deleted!", ok: true });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      setMsg({ text: "❌ Failed to delete review.", ok: false });
    }
    setDeletingId(null);
  };

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d2b", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 400, background: "#131338", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 20, padding: 40, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>Enter the password to access system controls</p>
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
            {pwError && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: 0 }}>{pwError}</p>}
            <button
              type="submit"
              style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
            >
              🔓 Access Dashboard
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, margin: 0 }}>
            <a href="/" style={{ color: "#00bcd4", textDecoration: "none", fontSize: 13 }}>← Back to Shop</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d2b", padding: "40px 24px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Header Section */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 36 }}>🛡️</span>
            <div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 26, margin: 0 }}>Admin Panel</h1>
              <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0 0" }}>Manage listings, statuses, and pricing configurations</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {mode === null && activeTab === "listings" && (
              <button
                onClick={() => setMode("add")}
                style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
              >
                ＋ Add New Account
              </button>
            )}
            {mode === null && activeTab === "reviews" && (
              <button
                onClick={() => setMode("add")}
                style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
              >
                ＋ Add New Review
              </button>
            )}
            <a href="/" style={{ color: "#00bcd4", fontSize: 14, textDecoration: "none", fontWeight: 500, padding: "8px 16px", background: "rgba(0,188,212,0.08)", borderRadius: 8, border: "1px solid rgba(0,188,212,0.15)" }}>← View Shop</a>
          </div>
        </div>

        {/* Dynamic Toast Messages */}
        {msg && (
          <div style={{ background: msg.ok ? "rgba(0,200,83,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${msg.ok ? "#00c853" : "#ef4444"}`, borderRadius: 10, padding: "14px 20px", color: msg.ok ? "#00e676" : "#f87171", fontWeight: 600, fontSize: 14 }}>
            {msg.text}
          </div>
        )}

        {/* Tab Selector */}
        {mode === null && (
          <div style={{ display: "flex", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}>
            <button
              onClick={() => setActiveTab("listings")}
              style={{
                background: activeTab === "listings" ? "rgba(0,188,212,0.15)" : "transparent",
                color: activeTab === "listings" ? "#00e5ff" : "#94a3b8",
                border: activeTab === "listings" ? "1px solid rgba(0,188,212,0.3)" : "1px solid transparent",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              📦 Shop Listings
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              style={{
                background: activeTab === "reviews" ? "rgba(0,188,212,0.15)" : "transparent",
                color: activeTab === "reviews" ? "#00e5ff" : "#94a3b8",
                border: activeTab === "reviews" ? "1px solid rgba(0,188,212,0.3)" : "1px solid transparent",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              💬 Customer Reviews
            </button>
          </div>
        )}

        {/* ── Add Workspace ── */}
        {mode === "add" && (
          <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            {activeTab === "listings" ? (
              <>
                <h2 style={{ color: "#00e5ff", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>➕ Create Listing Card</h2>
                <CardForm onSave={handleAdd} onCancel={() => setMode(null)} saving={saving} />
              </>
            ) : (
              <>
                <h2 style={{ color: "#00e5ff", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>➕ Create Customer Review</h2>
                <ReviewForm onSave={handleAddReview} onCancel={() => setMode(null)} saving={saving} />
              </>
            )}
          </div>
        )}

        {/* ── Edit Workspace ── */}
        {mode === "edit" && (
          <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            {activeTab === "listings" && editCard ? (
              <>
                <h2 style={{ color: "#f9a825", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>✏️ Update Existing Card</h2>
                <CardForm initial={{ ...editCard, features: stringifyFeatures(editCard.features) }} onSave={handleEdit} onCancel={() => { setMode(null); setEditCard(null); }} saving={saving} />
              </>
            ) : editReview ? (
              <>
                <h2 style={{ color: "#f9a825", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>✏️ Update Customer Review</h2>
                <ReviewForm initial={editReview} onSave={handleEditReview} onCancel={() => { setMode(null); setEditReview(null); }} saving={saving} />
              </>
            ) : null}
          </div>
        )}

        {/* ── Main Workspace List ── */}
        {mode === null && activeTab === "listings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Payment Sub-settings section built beautifully inside row spacing */}
            <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: 16 }}>💳 Payment Configurations</h3>
              </div>

              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {/* Current QR Code Preview */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, width: 150, minWidth: 150, justifyContent: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>QR Preview</div>
                  {qrUrl ? (
                    <img
                      src={getDirectImageLink(qrUrl)}
                      alt="QR Preview"
                      style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 8, background: "#fff", padding: 4 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div style={{ width: 100, height: 100, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 12, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>No QR Code</div>
                  )}
                </div>

                {/* Form Controls */}
                <form onSubmit={savePaymentSettings} style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                    <Input label="Shop Merchant UPI ID" value={upiId} onChange={setUpiId} placeholder="merchant@upi" />

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        QR Code URL (or upload below)
                      </label>
                      <input
                        className="admin-input"
                        type="text"
                        value={qrUrl}
                        onChange={e => setQrUrl(e.target.value)}
                        placeholder="https://image-link-here.com/qr.png"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "#161b3d",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: 10,
                          color: "#fff",
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    {/* File Upload Trigger */}
                    <div style={{ flex: "1 1 200px" }}>
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          padding: "12px 16px",
                          background: uploadingQr ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: uploadingQr ? "#64748b" : "#fff",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: uploadingQr ? "not-allowed" : "pointer",
                          textAlign: "center",
                          width: "100%",
                          boxSizing: "border-box"
                        }}
                      >
                        📁 {uploadingQr ? `Uploading (${uploadProgress}%)` : "Upload QR Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          disabled={uploadingQr}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings || uploadingQr}
                      style={{
                        flex: "1 1 200px",
                        height: 42,
                        background: (savingSettings || uploadingQr) ? "#334155" : "#00bcd4",
                        color: "#000",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: (savingSettings || uploadingQr) ? "not-allowed" : "pointer",
                        transition: "background 0.2s"
                      }}
                    >
                      {savingSettings ? "Saving Settings..." : "💾 Save Payment Config"}
                    </button>
                  </div>
                </form>
              </div>

              {settingsMsg && (
                <div style={{ fontSize: 13, color: settingsMsg.ok ? "#00e676" : "#ef4444", fontWeight: 600 }}>{settingsMsg.text}</div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
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
                    {/* Media Type indicator icon container */}
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: "#0d0d2b", border: "1px solid rgba(255,255,255,0.05)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                      {card.videoUrl ? "🎬" : "🎮"}
                    </div>

                    {/* Metadata summary context stack */}
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

                    {/* Modification Trigger layout CTA element alignment panel */}
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

        {/* ── Reviews Main Workspace List ── */}
        {mode === null && activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <h2 style={{ color: "#94a3b8", fontWeight: 700, fontSize: 16, margin: 0 }}>
                Review Management
              </h2>
              <button onClick={fetchReviews} style={{ background: "rgba(12, 114, 187, 1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "white", fontSize: 15, cursor: "pointer", fontWeight: 500 }}>
                🔄 Refresh
              </button>
            </div>

            {loadingReviews ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 60, background: "#131338", borderRadius: 16 }}>Syncing review dataset...</div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: "center", color: "#64748b", padding: 60, background: "#131338", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>No customer reviews found. Create your first review to show client testimonials!</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                {reviews.map(rev => (
                  <div
                    key={rev.id}
                    style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifySelf: "stretch" }}
                  >
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{rev.name}</div>
                      <span style={{ fontSize: 14, borderRadius: 12, background: "#0d0d2b", border: "1px solid rgba(255,255,255,0.05)", fontWeight: 700, color: "yellow" }}>★ {rev.stars}</span>
                    </div>

                    <div style={{ flex: "1 1 240px" }}>
                      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6, fontStyle: "italic" }}>"{rev.text}"</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>⏰ {rev.time}</div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: "auto" }}>
                      <button
                        onClick={() => { setEditReview(rev); setMode("edit"); }}
                        style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}
                      >
                        ✏️ Edit Data
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        disabled={deletingId === rev.id}
                        style={{ background: deletingId === rev.id ? "#374151" : "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: deletingId === rev.id ? "not-allowed" : "pointer" }}
                      >
                        {deletingId === rev.id ? "Removing..." : "🗑 Remove"}
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