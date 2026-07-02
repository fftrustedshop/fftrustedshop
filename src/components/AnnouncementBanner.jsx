export default function AnnouncementBanner() {
  const items = [
    "🔥 Huge Discounts Available",
    "💎 Instant Delivery",
    "⚡ Trusted Seller",
    "⭐ 1000+ Happy Customers",
    "🚀 Premium Free Fire IDs",
    "🛡️ 100% Secure Transactions",
    "🎮 Verified Accounts Only",
    "💰 Lowest Prices Guaranteed",
  ];

  const text = items.join("  •  ");

  return (
    <div className="overflow-hidden py-2.5 text-sm font-semibold tracking-wide"
      style={{
        background: "linear-gradient(90deg, #7c3aed, #f97316, #ef4444, #7c3aed)",
        backgroundSize: "200% 100%",
      }}
    >
      <div className="animate-marquee whitespace-nowrap">
        <span className="inline-block px-8">{text}</span>
        <span className="inline-block px-8">{text}</span>
      </div>
    </div>
  );
}
