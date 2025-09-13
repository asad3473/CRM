import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Dummy data for charts
const serviceBreakdown = [
  { name: "Oil Change", value: 400 },
  { name: "Maintenance", value: 300 },
  { name: "Repairs", value: 200 },
  { name: "Inspections", value: 100 },
];

const serviceTrends = [
  { month: "Jan", services: 200 },
  { month: "Feb", services: 250 },
  { month: "Mar", services: 300 },
  { month: "Apr", services: 270 },
  { month: "May", services: 350 },
  { month: "Jun", services: 400 },
];

const carModelServices = [
  { model: "Toyota Corolla", oilChange: 120, repairs: 50, maintenance: 70 },
  { model: "Honda Civic", oilChange: 100, repairs: 40, maintenance: 60 },
  { model: "Ford Focus", oilChange: 80, repairs: 30, maintenance: 50 },
  { model: "Hyundai Elantra", oilChange: 90, repairs: 35, maintenance: 55 },
];

const COLORS = ["#00C04D", "#008537", "#FFD700", "#FF8042"];

const ServiceAnalytics = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Title */}
      <h1 className="text-3xl font-bold  mb-6">
        Service Analytics 
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Services Completed", value: "1,200" },
          { label: "Most Popular Service", value: "Oil Change" },
          { label: "Avg. Service Duration", value: "45 mins" },
          { label: "Avg. Customer Rating", value: "4.5 ⭐" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-xl p-4 border-[#1C0B7E] border-t-4"
            
          >
            <h2 className="text-sm text-gray-500">{card.label}</h2>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Breakdown (Pie Chart) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Service Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00C04D" />
                  <stop offset="100%" stopColor="#008537" />
                </linearGradient>
              </defs>
              <Pie
                data={serviceBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {serviceBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "url(#greenGradient)" : COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trends Over Time (Line Chart) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Service Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={serviceTrends}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00C04D" />
                  <stop offset="100%" stopColor="#008537" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="services"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#00C04D" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Car Model vs Service Table */}
      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Car Model vs. Services</h2>
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr  className="bg-[#1C0B7E] text-white">
              <th className="p-2">Car Model</th>
              <th className="p-2">Oil Change</th>
              <th className="p-2">Repairs</th>
              <th className="p-2">Maintenance</th>
            </tr>
          </thead>
          <tbody>
            {carModelServices.map((row, index) => (
              <tr key={index} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition`}>
                <td className="p-2">{row.model}</td>
                <td className="p-2">{row.oilChange}</td>
                <td className="p-2">{row.repairs}</td>
                <td className="p-2">{row.maintenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workflow Time Analysis */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Workflow Time Analysis</h2>
        <p className="text-gray-600">
          Average duration from scheduling to completion:{" "}
          <span className="font-semibold text-green-700">45 minutes</span>.
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Scheduled → In Progress: 15 mins</li>
          <li>In Progress → Completed: 30 mins</li>
        </ul>
      </div>
    </div>
  );
};

export default ServiceAnalytics;
