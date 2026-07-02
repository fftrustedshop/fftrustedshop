import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
          style={{
            background: "rgba(249,115,22,0.08)",
            border: "2px dashed rgba(249,115,22,0.25)",
          }}
        >
          🎮
        </div>
        <div
          className="absolute inset-0 rounded-full animate-glow-pulse pointer-events-none"
          style={{ boxShadow: "0 0 30px rgba(249,115,22,0.15)" }}
        />
      </div>

      <h3 className="text-2xl font-bold text-white mb-3">No Accounts Listed Yet</h3>
      <p className="text-slate-400 text-base max-w-sm leading-relaxed mb-8">
        The shop is getting stocked with premium Free Fire IDs. Check back soon or add some accounts now!
      </p>

      <Link
        to="/admin"
        className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          boxShadow: "0 0 20px rgba(249,115,22,0.3)",
        }}
      >
        ➕ Add First Account
      </Link>
    </div>
  );
}
