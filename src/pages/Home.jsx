import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import Card from "../components/Card";
import Navbar from "../components/Navbar";
import AnnouncementBanner from "../components/AnnouncementBanner";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Cards"));

        console.log(querySnapshot.docs);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(data);

        setAccounts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#020617" }}
    >
      {/* ── Announcement Banner ── */}
      <AnnouncementBanner />

      {/* ── Sticky Navbar ── */}
      <Navbar />

      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── Stats Section ── */}
      <StatsSection />

      {/* Decorative line */}
      <div id="accounts" className="flex items-center justify-center gap-3 mt-6">
        <div
          className="h-px w-16"
          style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5))" }}
        />
        <span className="text-orange-500 text-sm">◆</span>
        <div
          className="h-px w-16"
          style={{ background: "linear-gradient(90deg, rgba(249,115,22,0.5), transparent)" }}
        />
      </div>

      {/* ── Cards Section ── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18"
      >
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            <span
              style={{
                background: "linear-gradient(135deg, #facc15, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Accounts
            </span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto">
            Hand-picked premium Free Fire IDs ready for instant transfer.
          </p>

        </div>

        {/* ── Loading state: skeleton grid ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && accounts.length === 0 && <EmptyState />}

        {/* ── Cards grid ── */}
        {!loading && accounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Scroll to top ── */}
      <ScrollToTop />
    </div>
  );
}