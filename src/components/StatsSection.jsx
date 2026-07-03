const stats = [
  {
    icon: "✅",
    title: "Verified Seller",
    desc: "Fully authenticated seller with proven track record",
    color: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.3)",
    glow: "rgba(34,197,94,0.2)",
  },
  {
    icon: "🔒",
    title: "100% Secure",
    desc: "Safe & encrypted payment methods, zero fraud risk",
    color: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.3)",
    glow: "rgba(59,130,246,0.2)",
  },
  {
    icon: "💰",
    title: "Lowest Prices",
    desc: "We guarantee the best prices in the market",
    color: "rgba(250,204,21,0.12)",
    border: "rgba(250,204,21,0.3)",
    glow: "rgba(250,204,21,0.2)",
  },
  {
    icon: "⚡",
    title: "Instant Delivery",
    desc: "Receive account credentials within minutes",
    color: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.3)",
    glow: "rgba(249,115,22,0.2)",
  },
];

export default function StatsSection() {
  return (
    <section className="pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="relative group rounded-2xl p-6 transition-all duration-300 cursor-default"
              style={{
                background: stat.color,
                border: `1px solid ${stat.border}`,
                boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${stat.glow}, 0 0 0 1px ${stat.border}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{stat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{stat.desc}</p>

              {/* Decorative corner glow */}
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-30 blur-2xl pointer-events-none"
                style={{ background: stat.glow }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
