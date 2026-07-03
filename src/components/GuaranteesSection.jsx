const GUARANTEES = [
  { icon: "✅", title: "100% Genuine", desc: "All accounts are verified and authentic", color: "text-green-600" },
  { icon: "🔒", title: "Secure Payment", desc: "Your transactions are completely safe", color: "text-yellow-600" },
  { icon: "⚡", title: "Instant Delivery", desc: "Get your account within minutes", color: "text-orange-500" },
];

const POLICIES = [
  {
    icon: "🔒", title: "Privacy Policy",
    desc: "Your privacy is important to us. We collect only necessary information for account delivery. Your personal data is encrypted and never shared with third parties. All transactions are secure and confidential.",
  },
  {
    icon: "📋", title: "Terms & Conditions",
    desc: "By purchasing from us, you agree to use accounts responsibly. All sales are final once account details are delivered. Accounts are verified and genuine. Misuse of accounts may result in ban by game developers.",
  },
  {
    icon: "💰", title: "Refund Policy",
    desc: "Refunds are available only if account details are incorrect or not as described. Request refund within 24 hours of purchase. Once you login to the account, refunds cannot be processed. Contact support for any issues.",
  },
  {
    icon: "🚚", title: "Delivery Policy",
    desc: "Instant delivery within 1 minute after payment confirmation. Account details sent via WhatsApp or email. In case of delay, contact our 24/7 support team. We guarantee delivery or full refund.",
  },
];

export default function GuaranteesSection() {
  return (
    <>
      {/* ── Our Guarantees ── */}
      <section className="bg-[#1a1a3e] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-center text-[#00e5ff] mb-8">
            Our Guarantees 🛡️
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GUARANTEES.map(g => (
              <div
                key={g.title}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className={`font-bold text-lg mb-2 ${g.color}`}>{g.icon} {g.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Policies ── */}
      <section className="bg-[#12122e] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-center text-[#00e5ff] mb-8">
            Our Policies 📋
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POLICIES.map(p => (
              <div
                key={p.title}
                className="bg-white rounded-xl p-5 shadow-md hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className="font-bold text-gray-900 text-base mb-2">{p.icon} {p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
