export default function HeroSection() {
  const badges = [
    { icon: "✓", text: "VERIFIED SELLER" },
    { icon: "🛡", text: "100% SECURE" },
    { icon: "₹", text: "LOWEST PRICES" },
    { icon: "⚡", text: "INSTANT DELIVERY" },
  ];

  return (
    <section className="px-4 pt-4 bg-[#1a1a3e]">
      <div className="mx-auto text-center ">

        {/* NOW LIVE pill */}
        <div
          className="inline-flex items-center gap-2 mb-5 px-6 py-2.5 rounded-full font-bold text-sm"
          style={{
            background: "linear-gradient(90deg, #00c9a7, #00b894)",
            boxShadow: "0 4px 20px rgba(0,185,130,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"
            style={{
              boxShadow: "0 0 10px #ff2d55",
              animation: "blink 1s infinite",
            }}
          />
          <span>FREE FIRE MAX ACCOUNT - NOW LIVE!</span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6"
          style={{ lineHeight: 1.3, textShadow: "0 0 25px rgba(0, 229, 255, 0.45)" }}
        >
          🚨 Exclusive Deals – Hurry Before Stock Ends! 🛍️
        </h1>

        {/* Badges */}
        <div className="grid grid-cols-2 gap-3 max-w-full lg:max-w-[60%] mx-auto">
          {badges.map((b, index) => (
            <button
              key={b.text}
              className="flex items-center justify-center gap-2
                         py-3 sm:py-3.5
                         px-3 sm:px-4
                         rounded-xl
                         font-bold
                         text-[13px] sm:text-md
                         text-white
                         transition-all
                         duration-300"
              style={{
                background: "linear-gradient(135deg, #00a693, #007a6e)",
                boxShadow: "0 0 025px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
                animation: "floatX 2.8s ease-in-out infinite",
                animationDelay: `${index * 0.25}s`,
              }}
            >
              <span className="text-sm sm:text-base">{b.icon}</span>
              <span>{b.text}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Animations */}
      <style>{`
        @keyframes blink {
          0%,100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: .3;
            transform: scale(.8);
          }
        }

        @keyframes floatX {
          0%,100% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </section >
  );
}