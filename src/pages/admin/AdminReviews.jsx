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

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [mode, setMode] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

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

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d2b", padding: "40px 24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>💬</span>
            <div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: 0 }}>Customer Reviews</h1>
              <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0 0" }}>Manage customer comments, stars, and time info</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {mode === null && (
              <button
                onClick={() => setMode("add")}
                style={{ background: "linear-gradient(135deg,#00c853,#00897b)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 200, 83, 0.2)" }}
              >
                ＋ Add New Review
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
            <h2 style={{ color: "#00e5ff", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>➕ Create Customer Review</h2>
            <ReviewForm onSave={handleAddReview} onCancel={() => setMode(null)} saving={saving} />
          </div>
        )}

        {/* Edit Form */}
        {mode === "edit" && editReview && (
          <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 8, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            <h2 style={{ color: "#f9a825", fontWeight: 800, fontSize: 18, marginTop: 0, marginBottom: 24 }}>✏️ Update Customer Review</h2>
            <ReviewForm initial={editReview} onSave={handleEditReview} onCancel={() => { setMode(null); setEditReview(null); }} saving={saving} />
          </div>
        )}

        {/* Main List */}
        {mode === null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                    style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 12, justifySelf: "stretch" }}
                  >
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{rev.name}</div>
                      <span style={{ fontSize: 14, borderRadius: 12, background: "#0d0d2b", border: "1px solid rgba(255,255,255,0.05)", padding: "4px 10px", fontWeight: 700, color: "yellow" }}>★ {rev.stars}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                      <div style={{ flex: "1 1 240px" }}>
                        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6, fontStyle: "italic" }}>"{rev.text}"</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>⏰ {rev.time}</div>
                      </div>

                      <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
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
