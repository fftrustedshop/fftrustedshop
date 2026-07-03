import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const PAYMENT_APPS = [
  {
    name: "GPay",
    emoji: "📱",
    color: "#1a73e8",
    getLink: (upi, price, note) =>
      `upi://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "PhonePe",
    emoji: "💜",
    color: "#5f259f",
    getLink: (upi, price, note) =>
      `phonepe://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "Paytm",
    emoji: "🔵",
    color: "#002970",
    getLink: (upi, price, note) =>
      `paytmmp://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "BHIM UPI",
    emoji: "🟢",
    color: "#138808",
    getLink: (upi, price, note) =>
      `upi://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
];

export default function Payment() {
  const [params] = useSearchParams();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const title = params.get("title") || "Free Fire ID";
  const price = params.get("price") || "0";
  const phone = params.get("phone") || "";

  useEffect(() => {
    getDoc(doc(db, "settings", "payment"))
      .then(snap => { if (snap.exists()) setSettings(snap.data()); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upiId = settings?.upiId || "fftrustedshop@upi";
  const qrUrl = settings?.qrUrl || "";
  const orderNote = `FF ID - ${title} - ${phone}`;

  const copyUPI = () => {
    navigator.clipboard?.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const waMsg = encodeURIComponent(
    `Hello! I just paid for:\n\n*${title}*\nAmount: ₹${price}\nPhone: +91${phone}\n\nPlease find my payment screenshot attached.`
  );
  const waLink = `https://wa.me/918368905639?text=${waMsg}`;

  return (
    <div className="min-h-screen bg-[#1a1a3e] px-4 py-8">
      <div className="max-w-md mx-auto">

        {/* Back + heading */}
        <div className="text-center mb-6">
          <a href="/" className="text-[#00e5ff] text-sm hover:underline inline-block mb-4">
            ← Back to Shop
          </a>
          <div className="text-5xl mb-2">💳</div>
          <h1 className="text-white font-black text-2xl">Complete Payment</h1>
          <p className="text-gray-400 text-sm mt-1">Secure & Instant Delivery</p>
        </div>

        {/* Order summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <h2 className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest mb-3">Order Summary</h2>
          <p className="text-white font-bold text-base mb-1 leading-snug">{title}</p>
          {phone && <p className="text-gray-400 text-sm mb-3">📱 +91 {phone}</p>}
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-gray-300 font-medium text-sm">Total Amount</span>
            <span className="text-green-400 font-black text-2xl">₹{price}</span>
          </div>
        </div>

        {/* Payment card */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-xl">
          <h2 className="text-gray-900 font-black text-lg text-center mb-5">Scan & Pay</h2>

          {/* QR */}
          <div className="flex justify-center mb-4">
            {loading ? (
              <div className="w-48 h-48 rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 text-sm">Loading…</span>
              </div>
            ) : qrUrl ? (
              <img
                src={qrUrl}
                alt="Payment QR Code"
                className="w-48 h-48 rounded-xl object-contain border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-48 h-48 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                <span className="text-4xl">📱</span>
                <p className="text-gray-400 text-xs text-center">QR not configured<br />Use UPI ID below</p>
              </div>
            )}
          </div>

          {/* Amount badge */}
          <div className="text-center mb-4">
            <span className="inline-block bg-green-50 text-green-700 font-black text-2xl px-6 py-2 rounded-full border border-green-100">
              ₹{price}
            </span>
          </div>

          {/* UPI ID row */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5 border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">UPI ID</p>
              <p className="text-gray-900 font-bold text-sm mt-0.5">{upiId}</p>
            </div>
            <button
              onClick={copyUPI}
              className="bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>

          {/* Payment app buttons */}
          <p className="text-xs text-gray-400 text-center font-medium mb-3">
            Pay using your preferred app (works on mobile)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_APPS.map(app => (
              <a
                key={app.name}
                href={app.getLink(upiId, price, orderNote)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: app.color }}
              >
                {app.emoji} {app.name}
              </a>
            ))}
          </div>
        </div>

        {/* After payment notice */}
        <div className="bg-[#00897b]/20 border border-[#00897b]/30 rounded-2xl p-4 mb-4">
          <h3 className="text-white font-bold text-sm mb-2">✅ After Payment</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Send your payment screenshot on WhatsApp. We'll deliver your account details instantly!
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white w-full hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#00c853,#00897b)" }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Screenshot on WhatsApp
          </a>
        </div>

        <p className="text-center text-gray-500 text-xs">
          🔒 All transactions are 100% secure and encrypted
        </p>
      </div>
    </div>
  );
}
