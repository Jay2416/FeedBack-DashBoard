import React from "react";

export function FeedbackTable({
  feedbacks,
  search,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  loading
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Feedback List</h2>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            placeholder="Search by name, email, or message"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:w-64 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={ratingFilter}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            className="w-full md:w-40 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All ratings</option>
            <option value="5">5 only</option>
            <option value="4plus">&gt;= 4 (Positive)</option>
            <option value="3">3 only</option>
            <option value="2minus">&lt;= 2 (Negative)</option>
            <option value="1">1 only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Rating</th>
              <th className="px-3 py-2 text-left font-medium">Message</th>
              <th className="px-3 py-2 text-left font-medium">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                  Loading feedback...
                </td>
              </tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr
                  key={fb._id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2 font-medium text-slate-800">
                    {fb.name}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {fb.email || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                      {fb.rating}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-700 max-w-xs">
                    <div className="line-clamp-2">{fb.message}</div>
                  </td>
                  <td className="px-3 py-2 text-slate-500 text-xs">
                    {new Date(fb.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
