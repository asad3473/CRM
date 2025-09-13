import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy Data
const ratingTrends = [
  { month: "Jan", rating: 4.2 },
  { month: "Feb", rating: 4.3 },
  { month: "Mar", rating: 4.0 },
  { month: "Apr", rating: 4.5 },
  { month: "May", rating: 4.6 },
  { month: "Jun", rating: 4.4 },
];

const feedbackSplit = [
  { name: "Positive", value: 320 },
  { name: "Negative", value: 80 },
];

const branchFeedback = [
  { branch: "HQ", rating: 4.5 },
  { branch: "Branch A", rating: 4.2 },
  { branch: "Branch B", rating: 3.9 },
  { branch: "Branch C", rating: 4.3 },
];

const FeedbackReports = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Feedback Reports 
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Avg. Rating", value: "4.3 ⭐" },
          { title: "Total Feedbacks", value: "400" },
          { title: "Response Time", value: "2 hrs" },
          { title: "Resolution Rate", value: "92%" },
        ].map((kpi, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
          >
            <h2 className="text-sm text-gray-500">{kpi.title}</h2>
            <p className="text-xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Trends */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Rating Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingTrends}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#34D399" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Positive vs Negative */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Positive vs Negative Feedback
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
              </defs>
              <Pie
                data={feedbackSplit}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                <defs>
                  {/* Positive Feedback Gradient */}
                  <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#008537" />
                  </linearGradient>

                  {/* Negative Feedback Gradient (lighter green) */}
                  <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="##00C04D" />   {/* light green */}
                    <stop offset="100%" stopColor="#1C0B7E" /> {/* mint green */}
                  </linearGradient>
                </defs>

                <Cell fill="url(#positiveGradient)" />
                <Cell fill="url(#negativeGradient)" />
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Feedback Comparison */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Branch Feedback Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={branchFeedback}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Compliments & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Top Compliments</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Quick service turnaround</li>
            <li>Friendly and helpful staff</li>
            <li>Transparent pricing</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Top Complaints</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Occasional service delays</li>
            <li>High repair costs</li>
            <li>Lack of available slots on weekends</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReports;
