import React, { useEffect, useMemo, useState } from "react";
import {
  fetchFeedbacks,
  createFeedback,
  fetchStats
} from "./services/api.js";
import { FeedbackForm } from "./components/FeedbackForm.jsx";
import { FeedbackTable } from "./components/FeedbackTable.jsx";
import { AnalyticsCards } from "./components/AnalyticsCards.jsx";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    positiveCount: 0,
    negativeCount: 0
  });
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const loadFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const res = await fetchFeedbacks();
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetchStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
    loadStats();
  }, []);

  const handleSubmitFeedback = async (data) => {
    setSubmitting(true);
    try {
      await createFeedback(data);
      await Promise.all([loadFeedbacks(), loadStats()]);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return feedbacks.filter((fb) => {
      let matchesSearch = true;
      if (q) {
        const combined = `${fb.name ?? ""} ${fb.email ?? ""} ${
          fb.message ?? ""
        }`.toLowerCase();
        matchesSearch = combined.includes(q);
      }

      let matchesRating = true;
      if (ratingFilter === "5") matchesRating = fb.rating === 5;
      else if (ratingFilter === "4plus") matchesRating = fb.rating >= 4;
      else if (ratingFilter === "3") matchesRating = fb.rating === 3;
      else if (ratingFilter === "2minus") matchesRating = fb.rating <= 2;
      else if (ratingFilter === "1") matchesRating = fb.rating === 1;

      return matchesSearch && matchesRating;
    });
  }, [feedbacks, search, ratingFilter]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            Feedback Dashboard
          </h1>
          <span className="text-xs text-slate-500">
            React + Vite + Tailwind · Node + Express + MongoDB
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <AnalyticsCards stats={stats} loading={loadingStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FeedbackForm onSubmit={handleSubmitFeedback} loading={submitting} />
          </div>
          <div className="lg:col-span-2">
            <FeedbackTable
              feedbacks={filteredFeedbacks}
              search={search}
              onSearchChange={setSearch}
              ratingFilter={ratingFilter}
              onRatingFilterChange={setRatingFilter}
              loading={loadingFeedbacks}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
