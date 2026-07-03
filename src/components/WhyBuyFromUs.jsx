const WHY_ITEMS = [
  { icon: "✅", iconBg: "bg-green-50", title: "1200+ Happy Customers", desc: "Join hundreds of satisfied gamers who trust us for premium Free Fire accounts" },
  { icon: "⚡", iconBg: "bg-yellow-50", title: "Instant Delivery", desc: "Get your account details within minutes of purchase - no waiting!" },
  { icon: "💰", iconBg: "bg-orange-50", title: "Best Prices Guaranteed", desc: "Up to 85% OFF on premium accounts - unbeatable deals you won't find elsewhere" },
  { icon: "🛡️", iconBg: "bg-blue-50", title: "100% Secure Transactions", desc: "Safe payment methods and verified accounts - your security is our priority" },
  { icon: "🎮", iconBg: "bg-purple-50", title: "Verified Premium Accounts", desc: "All accounts are genuine with rare skins, emotes, and EVO guns" },
  { icon: "🏆", iconBg: "bg-yellow-50", title: "Premium Collection", desc: "Exclusive accounts with S1, S2 bundles, golden profiles, and rare items" },
];

export default function WhyBuyFromUs() {
  return (
    <section className="bg-[#1a1a3e] pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center text-[#00e5ff] mb-8">
          Why Buy From Us? 🎯
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WHY_ITEMS.map(item => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 flex items-start gap-4 shadow-md hover:-translate-y-1 transition-transform duration-300"
              style={{
                textShadow: "0 0 25px rgba(0, 229, 255, 0.45)",
                boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
              }}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.iconBg}`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
