const REVIEWS = [
  { name: "Ana Mehta", stars: 5, text: "JULY Mega Sale mein best bundles mile! Smooth delivery, loved it!", time: "Today | 2:45 PM" },
  { name: "Ravinder Sharma", stars: 5, text: "First time purchase during JULY Mega Offer. Totally paisa vasool!", time: "Today | 1:30 PM" },
  { name: "Manish Verma", stars: 5, text: "JULY Sale mein jo ID mili, wo behtareen thi. Shukriya bhai 🙏", time: "Today | 12:15 PM" },
  { name: "Sunil Yadav", stars: 5, text: "Rare items + Fast delivery – JULY Mega Deal 🔥🔥🔥", time: "Today | 11:20 AM" },
  { name: "Vikram Choudhary", stars: 5, text: "Superb collection during JULY offer. Ab main hamesha yahi se lunga!", time: "Today | 10:55 AM" },
  { name: "Ram Malhotra", stars: 4, text: "Good deal overall. ID verified, delivery fast. Recommended! ✅", time: "Today | 10:05 AM" },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 mb-1.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-base ${i <= count ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="bg-[#1a1a3e] px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="rounded-xl px-6 py-5 text-center mb-5"
          style={{ background: "linear-gradient(135deg,#00897b,#00695c)" }}
        >
          <h2 className="text-white font-black text-xl md:text-2xl mb-1">
            🔥 Today's Latest Reviews (Updated Live) 🔥
          </h2>
          <p className="text-white/80 text-sm">Verified Customer Feedback</p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REVIEWS.map(r => (
            <div key={r.name + r.time} className="bg-white rounded-xl px-5 py-4 shadow-md">
              <p className="font-bold text-gray-900 text-sm mb-1">{r.name} ✓</p>
              <Stars count={r.stars} />
              <p className="text-gray-700 text-sm leading-relaxed mb-1.5">{r.text}</p>
              <p className="text-gray-400 text-xs">{r.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
