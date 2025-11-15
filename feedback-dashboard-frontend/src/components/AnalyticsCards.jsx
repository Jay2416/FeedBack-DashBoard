import React from "react";

const StatCard = ({ label, value, accent }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-2xl font-semibold ${accent}`}>{value}</span>
    </div>
  );
};

export function AnalyticsCards({ stats, loading }) {
  const { totalFeedbacks, averageRating, positiveCount, negativeCount } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Feedbacks"
        value={loading ? "..." : totalFeedbacks ?? 0}
        accent="text-slate-800"
      />
      <StatCard
        label="Average Rating"
        value={loading ? "..." : averageRating ?? 0}
        accent="text-amber-500"
      />
      <StatCard
        label="Positive (>= 4)"
        value={loading ? "..." : positiveCount ?? 0}
        accent="text-emerald-600"
      />
      <StatCard
        label="Negative (<= 2)"
        value={loading ? "..." : negativeCount ?? 0}
        accent="text-rose-600"
      />
    </div>
  );
}
