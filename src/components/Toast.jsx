import { useEffect, useState } from "react";

/**
 * Toast notification component.
 * Usage: <Toast message="..." type="success|error" onDone={() => {}} />
 * Auto-dismisses after 3 seconds.
 */
export default function Toast({ message, type = "success", onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const isSuccess = type === "success";

  return (
    <div
      className="fixed bottom-6 right-6 z-[999] max-w-sm w-full transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
    >
      <div
        className="animate-slide-in-right flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl"
        style={{
          background: isSuccess ? "rgba(15,23,42,0.96)" : "rgba(15,23,42,0.96)",
          border: `1px solid ${isSuccess ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
          backdropFilter: "blur(16px)",
        }}
      >
        <span className="text-xl flex-shrink-0 mt-0.5">
          {isSuccess ? "✅" : "❌"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">
            {isSuccess ? "Success!" : "Error"}
          </p>
          <p className="text-sm text-slate-400 mt-0.5 leading-snug">{message}</p>
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(onDone, 300); }}
          className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="h-0.5 rounded-full mt-1 mx-1"
        style={{
          background: isSuccess
            ? "linear-gradient(90deg, #22c55e, #16a34a)"
            : "linear-gradient(90deg, #ef4444, #dc2626)",
          animation: "progress-shrink 3s linear forwards",
        }}
      />
    </div>
  );
}
