import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PhonePopup({ card, onClose }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    onClose();
    navigate(
      `/payment?title=${encodeURIComponent(card.title || "Free Fire ID")}&price=${card.price}&cardId=${card.id || ""}&phone=${cleaned}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-popup-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900 text-lg">Enter Your Number</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Card info */}
        <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
          <p className="text-gray-500 text-xs font-medium mb-1">You're buying:</p>
          <p className="text-gray-900 font-bold text-sm leading-snug">{card.title || "Free Fire ID"}</p>
          <p className="text-green-600 font-black text-lg mt-1">₹{card.price}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Phone Number
          </label>
          <div className="flex gap-2 mb-2">
            <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm flex-shrink-0">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
              placeholder="10-digit mobile number"
              autoFocus
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00897b] focus:ring-2 focus:ring-[#00897b]/20 transition-all"
            />
          </div>
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <p className="text-gray-400 text-xs mb-4">
            We'll deliver your account details to this number via WhatsApp.
          </p>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-black text-white text-sm tracking-wide hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#1976d2,#1565c0)" }}
          >
            Continue to Payment →
          </button>
        </form>
      </div>
    </div>
  );
}
