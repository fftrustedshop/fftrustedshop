export default function HeroSection() {
  const handleShopNow = () => {
    document.getElementById("accounts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-4">

      {/* ── Animated Background Blobs ── */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full animate-blob"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "0s",
        }}
      />
      <div
        className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full animate-blob animation-delay-2000"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full animate-blob animation-delay-4000"
        style={{
          background: "radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">

        {/* Live indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in-up"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-live-pulse inline-block" />
          <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
            Store Live • Free Fire Max IDs
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6 animate-fade-in-up-delay-1"
          style={{
            background: "linear-gradient(135deg, #facc15 0%, #f97316 50%, #ef4444 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          FREE FIRE<br />
          <span className="text-white" style={{ WebkitTextFillColor: "white" }}>ID </span>
          SHOP
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up-delay-2">
          Premium Free Fire accounts at unbeatable prices.{" "}
          <span className="text-orange-400 font-semibold">Secure transactions</span>,{" "}
          instant delivery and fully verified accounts.
        </p>

        {/* CTA Buttons */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up-delay-3">
          <button
            onClick={handleShopNow}
            className="btn-cta px-8 py-4 rounded-2xl font-bold text-base text-white animate-glow-pulse"
            style={{
              boxShadow: "0 0 24px rgba(249,115,22,0.5)",
            }}
          >
            <span>🛒 Shop Now</span>
          </button>

          <a
            href="https://wa.me/919999999999?text=Hello!%20I%20want%20to%20buy%20a%20Free%20Fire%20ID"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white border border-white/10 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10"
          >
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #020617)",
        }}
      />
    </section>
  );
}
