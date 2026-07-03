const REVIEWS = [
  {
    name: "Aman Singh",
    stars: 5,
    text: "Received my account within minutes. Everything was exactly as described. Great experience!",
    time: "Today | 3:42 PM",
  },
  {
    name: "Priyanshu Kumar",
    stars: 5,
    text: "Amazing seller! Login worked perfectly and support replied instantly. Highly recommended.",
    time: "Today | 2:18 PM",
  },
  {
    name: "Rohit Patel",
    stars: 5,
    text: "Bought a premium account at a very good price. Delivery was super fast.",
    time: "Today | 1:07 PM",
  },
  {
    name: "Aditya Sharma",
    stars: 5,
    text: "Everything went smoothly. Secure payment and genuine account. Will buy again.",
    time: "Today | 12:26 PM",
  },
  {
    name: "Harsh Gupta",
    stars: 4,
    text: "Delivery took a few extra minutes but the account was exactly as promised.",
    time: "Today | 11:54 AM",
  },
  {
    name: "Nikhil Verma",
    stars: 5,
    text: "Best prices I've found so far. Genuine seller and quick response on WhatsApp.",
    time: "Today | 10:39 AM",
  },
  {
    name: "Deepak Yadav",
    stars: 5,
    text: "Account had all the listed items. Very satisfied with the purchase.",
    time: "Today | 9:58 AM",
  },
  {
    name: "Arjun Mehta",
    stars: 4,
    text: "Excellent service! The account was delivered almost instantly after payment.",
    time: "Yesterday | 8:41 PM",
  },
  {
    name: "Vivek Mishra",
    stars: 5,
    text: "Customer support was very helpful and guided me through the login process.",
    time: "Yesterday | 6:15 PM",
  },
  {
    name: "Karan Joshi",
    stars: 4,
    text: "Trusted seller. This was my second purchase and both orders were perfect.",
    time: "Yesterday | 4:33 PM",
  },
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
          style={{
            background: "linear-gradient(135deg,#00897b,#00695c)",
            boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
          }}
        >
          <h2 className="text-white font-black text-xl md:text-2xl mb-1">
            🔥 Today's Latest Reviews (Updated Live) 🔥
          </h2>
          <p className="text-white/80 text-sm">Verified Customer Feedback</p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REVIEWS.map(r => (
            <div key={r.name + r.time} className="bg-white rounded-xl px-5 py-4 shadow-md" style={{
              boxShadow: "0 0 25px rgba(0, 229, 255, 0.45), inset 0 0 10px rgba(0, 229, 255, 0.2)",
            }}>
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
