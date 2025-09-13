
import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#1E90FF", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

const branchData = [
  { branch: "HQ", cars: 320, revenue: 150000, csat: 88 },
  { branch: "Branch A", cars: 200, revenue: 92000, csat: 82 },
  { branch: "Branch B", cars: 150, revenue: 68000, csat: 79 },
];

const hqTrend = [
  { month: "Jan", cars: 300, revenue: 120000 },
  { month: "Feb", cars: 340, revenue: 135000 },
  { month: "Mar", cars: 380, revenue: 152000 },
  { month: "Apr", cars: 360, revenue: 148000 },
];

const serviceBreakdown = [
  { name: "Oil Change", value: 400 },
  { name: "Maintenance", value: 280 },
  { name: "Repairs", value: 180 },
  { name: "Inspections", value: 140 },
];

const carModelServices = [
  { model: "Toyota Corolla", OilChange: 120, Maintenance: 80, Repairs: 40 },
  { model: "Honda Civic", OilChange: 100, Maintenance: 60, Repairs: 30 },
  { model: "Kia Sportage", OilChange: 60, Maintenance: 50, Repairs: 20 },
];

const feedbackStats = { csat: 84, nps: 62 };
const topComplaints = [
  { issue: "Long wait time", count: 35 },
  { issue: "High pricing", count: 22 },
  { issue: "Parts unavailable", count: 15 },
];

const marketingData = [
  { campaign: "Facebook Ads", reach: 5000, conversions: 350 },
  { campaign: "Google Ads", reach: 4200, conversions: 310 },
  { campaign: "Email", reach: 2500, conversions: 200 },
];

export default function AnalyticsReports() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Reports / التحليلات والتقارير</h1>

      {/* 1. Branch Reports */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Branch Reports</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={branchData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cars" fill="#1E90FF" name="Cars Serviced" />
            <Bar dataKey="revenue" fill="#22C55E" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. HQ Reports */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">HQ Reports</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Total Cars</div>
            <div className="text-xl font-bold">670</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-xl font-bold">$310,000</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Avg. CSAT</div>
            <div className="text-xl font-bold">83%</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hqTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cars" stroke="#1E90FF" />
            <Line type="monotone" dataKey="revenue" stroke="#22C55E" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Service Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={serviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {serviceBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Car Model</th>
                  <th className="p-2">Oil Change</th>
                  <th className="p-2">Maintenance</th>
                  <th className="p-2">Repairs</th>
                </tr>
              </thead>
              <tbody>
                {carModelServices.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{row.model}</td>
                    <td className="p-2">{row.OilChange}</td>
                    <td className="p-2">{row.Maintenance}</td>
                    <td className="p-2">{row.Repairs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Feedback Reports */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Feedback Reports</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">CSAT</div>
            <div className="text-xl font-bold">{feedbackStats.csat}%</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">NPS</div>
            <div className="text-xl font-bold">{feedbackStats.nps}</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Complaint</th>
                <th className="p-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {topComplaints.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{c.issue}</td>
                  <td className="p-2">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Marketing Reports */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Marketing Reports</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={marketingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="campaign" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reach" fill="#1E90FF" />
            <Bar dataKey="conversions" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 6. Export Options */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Export Options</h2>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Export PDF</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Export Excel</button>
        </div>
      </div>
    </div>
  );
}
