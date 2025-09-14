import React from "react";

export default function HQDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">HQ Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Cars Serviced (MTD)</p>
          <h2 className="text-xl font-semibold">1,245</h2>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Revenue (MTD)</p>
          <h2 className="text-xl font-semibold">$82,450</h2>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Avg CSAT (30d)</p>
          <h2 className="text-xl font-semibold">4.6 ⭐</h2>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">NPS Score</p>
          <h2 className="text-xl font-semibold">72</h2>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Open Jobs</p>
          <h2 className="text-xl font-semibold">38</h2>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Negative Alerts (7d)</p>
          <h2 className="text-xl font-semibold">5</h2>
        </div>
      </div>

      {/* Branch Leaderboard */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-2">Branch Leaderboard</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-2">Branch</th>
              <th className="p-2">Cars Serviced</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">CSAT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Branch A</td>
              <td className="p-2">420</td>
              <td className="p-2">$28,000</td>
              <td className="p-2">4.7</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Branch B</td>
              <td className="p-2">310</td>
              <td className="p-2">$20,400</td>
              <td className="p-2">4.5</td>
            </tr>
            <tr>
              <td className="p-2">Branch C</td>
              <td className="p-2">210</td>
              <td className="p-2">$15,700</td>
              <td className="p-2">4.4</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Feedback & Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-2">Recent Feedback</h2>
          <ul className="space-y-2 text-sm">
            <li>⭐ 5 – “Great service, fast delivery!”</li>
            <li>⭐ 4 – “Good, but waiting time was long.”</li>
            <li>⭐ 2 – “Not satisfied, issue not fixed.”</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-2">Active Campaigns</h2>
          <ul className="space-y-2 text-sm">
            <li>Oil Change Promo – 1,200 delivered, 300 opened</li>
            <li>Warranty Expiry Reminder – 800 delivered, 120 clicked</li>
            <li>Birthday Greetings – 95 delivered, 60 opened</li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            New Booking
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            New Customer
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
            Create Campaign
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
