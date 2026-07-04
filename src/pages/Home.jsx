import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import AnnouncementBanner from "../components/AnnouncementBanner";
import HeroSection from "../components/HeroSection";
import Card from "../components/Card";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import ReviewsSection from "../components/ReviewsSection";
import WhyBuyFromUs from "../components/WhyBuyFromUs";
import GuaranteesSection from "../components/GuaranteesSection";
import CustomerSupport from "../components/CustomerSupport";
import PopupModal from "../components/PopupModal";
import FloatingButtons from "../components/ScrollToTop";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupCard, setPopupCard] = useState(null);
  const [popupDone, setPopupDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "Cards"));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAccounts(data);

        if (!sessionStorage.getItem("popup_seen")) {
          const popup = data.find(c => c.popupFeatured && !c.sold);
          if (popup) setTimeout(() => setPopupCard(popup), 800);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("popup_seen", "1");
    setPopupCard(null);
    setPopupDone(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a3e]">

      {/* Popup */}
      {popupCard && !popupDone && <PopupModal card={popupCard} onClose={closePopup} />}

      <AnnouncementBanner />
      <HeroSection />

      {/* Cards */}
      <section id="accounts" className="px-4 py-8 max-w-6xl mx-auto">

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {!loading && accounts.length === 0 && <EmptyState />}
        {!loading && accounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map(card => <Card key={card.id} {...card} />)}
          </div>
        )}
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* Why Buy From Us */}
      <WhyBuyFromUs />

      {/* Our Guarantees + Policies */}
      <GuaranteesSection />

      {/* Customer Support + FAQ */}
      <section id="support">
        <CustomerSupport />
      </section>
      <FloatingButtons />
    </div>
  );
}