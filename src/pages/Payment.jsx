import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getDirectImageLink } from "../utils/helpers";

const PAYMENT_APPS = [
  {
    name: "GPay",
    icon: (
      <img src="https://imgs.search.brave.com/e2rDvA2bO4YzZQEXNSqrKJpI8eeB5ib1Cw2CuYRQcY8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL2ZyZWUv/cG5nLTI1Ni9mcmVl/LWdvb2dsZS1wYXkt/bG9nby1pY29uLXN2/Zy1kb3dubG9hZC1w/bmctMTcyMTY3MC5w/bmc_Zj13ZWJwJnc9/MTI4" alt="" srcset="" />
    ),
    getLink: (upi, price, note) =>
      `upi://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "PhonePe",
    icon: (
      <img src="https://imgs.search.brave.com/WlndE9d0OPDWXVDxBONDU7Qj7DTuBZGyoyV1VZQh19Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91eHdp/bmcuY29tL3dwLWNv/bnRlbnQvdGhlbWVz/L3V4d2luZy9kb3du/bG9hZC9icmFuZHMt/YW5kLXNvY2lhbC1t/ZWRpYS9waG9uZXBl/LWljb24ucG5n" alt="" srcset="" />
    ),
    getLink: (upi, price, note) =>
      `phonepe://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "Paytm",
    icon: (
      <img src="https://imgs.search.brave.com/yQ2YM_gww6GDV-KrMOKATzrOgg_XrZY28ODUJYE7Hv8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaWNvbi1pY29u/cy5jb20vNzMwL1BO/Ry81MTIvcGF5dG1f/aWNvbi1pY29ucy5j/b21fNjI3NzgucG5n" alt="" srcset="" />
    ),
    getLink: (upi, price, note) =>
      `paytmmp://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "BHIM",
    icon: (
      <img src="https://imgs.search.brave.com/hdhU1Du46FSXPFf9Ohqn5aNDzMNuLjMBChSJZ2FFxd4/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvMjg5MTk2NWE2/ODhlZjVkOGU5OTk1/M2IyNzI2OTgzOTUx/ZjA1YzVlYjdkMTUx/MGI0ZGQyOTQwNThl/MjZhOWU4Yi93d3cu/YmhpbXVwaS5vcmcu/aW4v" alt="" srcset="" />),
    getLink: (upi, price, note) =>
      `upi://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "Navi",
    icon: (
      <img src="https://imgs.search.brave.com/pM8V6apkhN8_2kKjKtMxxoDO3HB5T4kvbF8SP7ThRCw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbmdo/ZHByby5jb20vd3At/Y29udGVudC90aGVt/ZXMvcG5naGRwcm8v/ZG93bmxvYWQvc29j/aWFsLW1lZGlhLWFu/ZC1icmFuZHMvbmF2/aS10ZWNobm9sb2dp/ZXMtYXBwLWljb24u/cG5n" alt="" srcset="" />
    ),
    getLink: (upi, price, note) =>
      `upi://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "CRED",
    icon: (
      <img src="https://imgs.search.brave.com/rvo5Kw4_b0CNoc23Og8logfkZPNvxnTnCI2dHgQzISA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDY5LzE0/Ni81MjQvbm9uXzJ4/L2NyZWQtYXBwLWlj/b24tb24tdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZC1mcmVlLXBu/Zy5wbmc" alt="" srcset="" />
    ),
    getLink: (upi, price, note) =>
      `upi://pay?pa=${upi}&pn=FF+Trusted+Shop&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
];

export default function Payment() {
  const [params, setParams] = useSearchParams();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s) countdown

  const title = params.get("title") || "Free Fire ID";
  const price = params.get("price") || "0";
  const phone = params.get("phone") || "";

  const [restartPhone, setRestartPhone] = useState(phone);
  const [restartError, setRestartError] = useState("");

  useEffect(() => {
    getDoc(doc(db, "settings", "payment"))
      .then(snap => { if (snap.exists()) setSettings(snap.data()); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setRestartPhone(phone);
  }, [phone]);

  const handleRestartPayment = (e) => {
    e.preventDefault();
    const cleaned = restartPhone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setRestartError("Please enter a valid 10-digit phone number.");
      return;
    }
    setParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("phone", cleaned);
      return next;
    });
    setRestartError("");
    setTimeLeft(300);
  };

  const upiId = settings?.upiId || "fftrustedshop@upi";
  const qrUrl = settings?.qrUrl || "";
  const orderNote = `FF ID - ${title} - ${phone}`;

  const copyUPI = () => {
    navigator.clipboard?.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadQR = async () => {
    if (!qrUrl) return;
    const directUrl = getDirectImageLink(qrUrl);

    if (directUrl.startsWith("data:") || directUrl.startsWith("blob:")) {
      const link = document.createElement("a");
      link.href = directUrl;
      link.download = `ff_payment_qr_${price}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    try {
      const res = await fetch(directUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ff_payment_qr_${price}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Direct download failed, opening in new tab:", err);
      window.open(directUrl, "_blank");
    }
  };

  const waMsg = encodeURIComponent(
    `Hello! I just paid for:\n\n*${title}*\nAmount: ₹${price}\nPhone: +91${phone}\n\nPlease find my payment screenshot attached.`
  );
  const waLink = `https://wa.me/917225023941?text=${waMsg}`;

  return (
    <div className="min-h-screen bg-[#080816] flex items-center justify-center px-4 py-8" style={{ background: "radial-gradient(circle at 50% 50%, #161638 0%, #080816 100%)" }}>
      <div className="w-full md:max-w-lg bg-[#11112e] border border-white/5 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative overflow-hidden">

        {timeLeft === 0 ? (
          /* Session Expired Screen */
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-4xl mb-5 animate-pulse text-red-500">
              ⏰
            </div>
            <h1 className="text-white font-black text-xl tracking-wide">Session Expired</h1>
            <p className="text-gray-400 text-xs mt-2.5 mb-6 max-w-sm mx-auto leading-relaxed">
              For security, payment sessions expire after 5 minutes.<br />
              Please restart the payment session or go back to the shop.
            </p>

            <form onSubmit={handleRestartPayment} className="w-full max-w-sm mb-4">
              <label className="block text-left text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                Confirm Phone Number
              </label>
              <input
                type="tel"
                value={restartPhone}
                onChange={e => { setRestartPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setRestartError(""); }}
                placeholder="10-digit phone number"
                className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00e5ff] transition-all mb-3 text-center tracking-wider font-extrabold"
              />
              {restartError && <p className="text-red-500 text-xs text-left mb-4 font-bold">⚠️ {restartError}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-sm text-[#080816] bg-[#00e5ff] hover:bg-[#00e5ff]/80 transition-all cursor-pointer shadow-lg active:scale-98 tracking-wide mb-3"
              >
                🔄 Restart Payment
              </button>
            </form>

            <a
              href="/"
              className="w-full max-w-sm py-3.5 rounded-xl font-black text-sm text-gray-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-center block active:scale-98 tracking-wide"
            >
              ← Go Back to Shop
            </a>
          </div>
        ) : (
          /* Regular Payment Flow */
          <>
            {/* Header Block */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-white font-black text-sm tracking-wide leading-tight">PAYMENT: {title}</h1>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">Secure UPI Payment</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 rounded-full px-3 py-1 text-xs font-black select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Instructions Panel */}
            <div className="bg-white/5 border border-white/5 rounded-2xl px-4.5 py-2.5 mb-2.5 text-left">
              <h2 className="text-orange-400 text-xs font-black uppercase tracking-wider mb-2.5">How To Pay</h2>
              <ol className="text-gray-300 text-xs list-decimal list-inside font-medium leading-relaxed">
                <li>Take a screenshot or download the QR code</li>
                <li>Open Paytm, PhonePe, GPay etc.</li>
                <li>Scan & pay <span className="text-[#00e5ff] font-black text-sm">₹{price}</span></li>
                <li>After payment, send screenshot on whatsapp</li>
              </ol>
            </div>

            {/* QR Code Container */}
            <div className="flex justify-center mb-2">
              <div className="bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100">
                {loading ? (
                  <div className="bg-gray-100 animate-pulse flex items-center justify-center rounded-xl">
                    <span className="text-gray-400 text-xs font-black">Generating QR...</span>
                  </div>
                ) : qrUrl ? (
                  <img
                    src={getDirectImageLink(qrUrl)}
                    alt="Payment QR Code"
                    className="rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-50 flex flex-col items-center justify-center gap-2 rounded-xl text-gray-400">
                    <span className="text-3xl">📱</span>
                    <p className="text-[10px] text-center leading-normal">QR Code not set<br />Use UPI ID below</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pay Directly app row */}
            <div className="text-center text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3.5">
              Pay Directly Via App
            </div>
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {PAYMENT_APPS.map(app => (
                <a
                  key={app.name}
                  href={app.getLink(upiId, price, orderNote)}
                  className="flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    {app.icon}
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold tracking-wide">{app.name}</span>
                </a>
              ))}
            </div>

            <div className="flex justify-between">
              {/* Download QR CTA Button */}
              <div className="flex justify-center mb-5">
                <button
                  onClick={downloadQR}
                  disabled={!qrUrl}
                  className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 active:scale-98 text-gray-300 hover:text-white px-6 py-3 rounded-xl text-xs font-black tracking-wide transition-all w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ⬇ Download QR
                </button>
              </div>

              {/* UPI ID copy box */}
              <div className="flex mb-5 items-center justify-between bg-white/5 border border-white/5 rounded-2xl px-4">
                <div className="text-left mr-2">
                  <p className="text-white font-extrabold text-xs tracking-wide">UPI ID: {upiId}</p>
                </div>
                <button
                  onClick={copyUPI}
                  className="bg-[#00e5ff] text-[#080816] font-black text-xs px-4 py-2 rounded-xl hover:bg-[#00e5ff]/80 transition-colors shadow-lg active:scale-95 cursor-pointer"
                >
                  {copied ? "✓ Copied" : "Copy ID"}
                </button>
              </div>
            </div>

            {/* After payment WhatsApp Notice */}
            <div className="bg-[#00c853]/10 border border-[#00c853]/20 rounded-2xl p-4.5 mb-4 text-left">
              <h3 className="text-white font-extrabold text-xs mb-1.5 flex items-center gap-1.5">
                ✅ Confirm Your Delivery
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-3.5 font-medium">
                Send your payment screenshot on WhatsApp. Your account details will be delivered instantly!
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs text-white w-full hover:opacity-90 active:scale-98 transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, #00c853, #00897b)" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send Screenshot on WhatsApp
              </a>
            </div>

            <p className="text-center text-gray-500 text-[10px] tracking-wide select-none">
              🔒 All transactions are 100% secure and encrypted
            </p>
          </>
        )}
      </div>
    </div>
  );
}
