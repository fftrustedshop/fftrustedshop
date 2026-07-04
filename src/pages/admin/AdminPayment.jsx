import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDirectImageLink, resizeAndCompressImage } from "../../utils/helpers";
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

export default function AdminPayment() {
  const [upiId, setUpiId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState(null);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "payment"));
      if (snap.exists()) {
        setUpiId(snap.data().upiId || "");
        setQrUrl(snap.data().qrUrl || "");
      }
    } catch (err) {
      console.error(err);
    }
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
    } catch (err) {
      console.error(err);
      setSettingsMsg({ text: "❌ Failed to save settings.", ok: false });
    }
    setSavingSettings(false);
    setTimeout(() => setSettingsMsg(null), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d2b", padding: "40px 24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>💳</span>
            <div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: 0 }}>Payment Configurations</h1>
              <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0 0" }}>Update shop UPI details and QR codes</p>
            </div>
          </div>
          <Link to="/admin" style={{ color: "#00bcd4", fontSize: 14, textDecoration: "none", fontWeight: 500, padding: "8px 16px", background: "rgba(0,188,212,0.08)", borderRadius: 8, border: "1px solid rgba(0,188,212,0.15)" }}>
            ← System Dashboard
          </Link>
        </div>

        {/* Configurations Box */}
        <div style={{ background: "#131338", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            
            {/* Current QR Code Preview */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 20, width: 160, minWidth: 160, justifyContent: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>QR Preview</div>
              {qrUrl ? (
                <img 
                  src={getDirectImageLink(qrUrl)} 
                  alt="QR Preview" 
                  style={{ width: 120, height: 120, objectFit: "contain", borderRadius: 8, background: "#fff", padding: 4 }} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 12, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>No QR Code</div>
              )}
            </div>

            {/* Form Controls */}
            <form onSubmit={savePaymentSettings} style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 20 }}>
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

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
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
            <div style={{ fontSize: 13, color: settingsMsg.ok ? "#00e676" : "#ef4444", fontWeight: 600, marginTop: 12 }}>
              {settingsMsg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
