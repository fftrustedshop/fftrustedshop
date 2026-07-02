import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── Simple labelled input helper ──
function Field({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        <span>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "rgba(2,6,23,0.7)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f1f5f9",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

function StyledInput({ onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? "rgba(249,115,22,0.6)" : "rgba(255,255,255,0.08)",
        boxShadow: focused ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function StyledTextarea({ ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? "rgba(249,115,22,0.6)" : "rgba(255,255,255,0.08)",
        boxShadow: focused ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
        resize: "vertical",
        minHeight: "120px",
        fontFamily: "inherit",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function Admin() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [badge, setBadge] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [features, setFeatures] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [errors, setErrors] = useState({});

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!price || isNaN(price) || Number(price) <= 0) e.price = "Enter a valid price";
    if (oldPrice && (isNaN(oldPrice) || Number(oldPrice) <= 0)) e.oldPrice = "Enter a valid old price";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // ── Firebase write (collection name and fields preserved exactly) ──
      await addDoc(collection(db, "Cards"), {
        title,
        badge,
        price,
        oldPrice,
        videoUrl,
        features: features.split("\n").filter((item) => item.trim() !== ""),
        sold: false,
        featured,
      });

      setToast({ message: "Account added successfully! Redirecting to shop...", type: "success" });

      // Reset form
      setTitle("");
      setBadge("");
      setPrice("");
      setOldPrice("");
      setVideoUrl("");
      setFeatures("");

      // Navigate after toast is visible
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.log(err);
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Back link */}
      <a
        href="/"
        className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm mb-8 self-start max-w-xl w-full mx-auto"
      >
        ← Back to Shop
      </a>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ background: "#020617" }}
      >
        {/* Background blobs */}
        <div
          className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full animate-blob pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full animate-blob animation-delay-4000 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* ── Dashboard Card ── */}
        <div
          className="w-full max-w-xl rounded-3xl overflow-hidden animate-fade-in-up"
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(249,115,22,0.15)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08)",
          }}
        >
          {/* Header band */}
          <div
            className="px-8 py-5 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.1))",
              borderBottom: "1px solid rgba(249,115,22,0.12)",
            }}
          >
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-white font-black text-xl">Admin Dashboard</h1>
              <p className="text-slate-400 text-xs mt-0.5">Add new Free Fire account to the marketplace</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

            <Field label="Account Title" icon="🎮">
              <StyledInput
                id="admin-title"
                placeholder="e.g. Diamond Elite FF Account"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1.5">⚠ {errors.title}</p>
              )}
            </Field>

            <Field label="Badge Text" icon="🏷️">
              <StyledInput
                id="admin-badge"
                placeholder="e.g. HOT, NEW, RARE"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)" icon="💰">
                <StyledInput
                  id="admin-price"
                  type="number"
                  placeholder="e.g. 499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                />
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1.5">⚠ {errors.price}</p>
                )}
              </Field>
              <Field label="Old Price (₹)" icon="🔖">
                <StyledInput
                  id="admin-old-price"
                  type="number"
                  placeholder="e.g. 799"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  min="0"
                />
                {errors.oldPrice && (
                  <p className="text-red-400 text-xs mt-1.5">⚠ {errors.oldPrice}</p>
                )}
              </Field>
            </div>

            <Field label="YouTube Embed URL" icon="🎬">
              <StyledInput
                id="admin-video-url"
                placeholder="e.g. https://www.youtube.com/embed/xxxxx"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </Field>

            <Field label="Features (one per line)" icon="✨">
              <StyledTextarea
                id="admin-features"
                rows={6}
                placeholder={"Level 60+ account\nDiamond Royale items\nCustom HUD\n100+ skins"}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
              <p className="text-slate-600 text-xs mt-1.5">Each line will be shown as a separate feature bullet.</p>
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3">
              <div>
                <h3 className="text-white font-semibold">Featured Account</h3>
                <p className="text-slate-400 text-sm">
                  Show this account in the Featured section.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only peer"
                />

                <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:bg-orange-500 transition-all"></div>

                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cta w-full py-4 rounded-xl font-black text-base text-white flex items-center justify-center gap-3 mt-2 transition-all duration-300"
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 20px rgba(249,115,22,0.4)",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="animate-spin-slow inline-block w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                  <span>Adding Account...</span>
                </>
              ) : (
                <span>🚀 Add Account</span>
              )}
            </button>

          </form>
        </div>

        {/* Toast notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </div>
      <Footer />
    </>
  );
}