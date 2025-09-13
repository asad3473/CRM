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

const COLORS = ["#00C49F", "#FF4C4C"];

const FeedbackReports = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Feedback Reports / تقارير التقييم
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Avg. Rating</h2>
          <p className="text-xl font-bold">4.3 ⭐</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Total Feedbacks</h2>
          <p className="text-xl font-bold">400</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Response Time</h2>
          <p className="text-xl font-bold">2 hrs</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Resolution Rate</h2>
          <p className="text-xl font-bold">92%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Trends */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Rating Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#0088FE"
                strokeWidth={2}
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
              <Pie
                data={feedbackSplit}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {feedbackSplit.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Feedback Comparison */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Branch Feedback Comparison
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={branchFeedback}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Compliments & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Top Compliments</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Quick service turnaround</li>
            <li>Friendly and helpful staff</li>
            <li>Transparent pricing</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Top Complaints</h2>
          <ul className="list-disc list-inside text-gray-700">
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
