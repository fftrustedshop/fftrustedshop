const FAQS = [
  { q: "How long does delivery take?", a: "Instant delivery within 1 minute after payment confirmation." },
  { q: "Are the accounts safe and genuine?", a: "Yes, all accounts are 100% verified and genuine with full access." },
  { q: "What payment methods do you accept?", a: "UPI, Paytm, PhonePe, Google Pay, and all major payment methods." },
  { q: "Can I get a refund if I'm not satisfied?", a: "Yes, refunds available within 24 hours if account details are incorrect or not as described." },
  { q: "How do I contact support?", a: "Chat with us on WhatsApp at +91 7225023941, available 24/7." },
];

export default function CustomerSupport() {
  const waLink = "https://wa.me/917225023941";

  return (
    <section
      className="py-12 px-4"
      style={{ background: "linear-gradient(135deg,#00897b,#00695c)", boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-8">
          Customer Support 💬
        </h2>

        {/* 3 support cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10" style={{
          boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
        }}>
          {[
            { icon: "📞", title: "24/7 Support", sub: "Available Round the Clock", value: "+91 7225023941", href: "tel:+917225023941" },
            { icon: "💬", title: "WhatsApp Support", sub: "Quick Response Guaranteed", value: "Chat Now", href: waLink, target: "_blank" },
            { icon: "⏰", title: "Response Time", sub: "Average Response", value: "Within 24 Hours", href: null },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{c.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{c.sub}</p>
              {c.href ? (
                <a href={c.href} target={c.target} rel="noopener noreferrer" className="font-bold text-[#00897b] text-sm hover:underline">
                  {c.value}
                </a>
              ) : (
                <span className="font-bold text-[#00897b] text-sm">{c.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-black text-center text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto bg-white p-3 rounded-xl">
          {FAQS.map(faq => (
            <div key={faq.q} className="py-2 px-3">
              <p className="font-bold text-sm text-[#00695c] mb-1">Q: {faq.q}</p>
              <p className="text-gray-700 text-sm">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
