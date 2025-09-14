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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ServiceAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Service Analytics / تحليلات الخدمات
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Total Services Completed</h2>
          <p className="text-xl font-bold">1,200</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Most Popular Service</h2>
          <p className="text-xl font-bold">Oil Change</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Avg. Service Duration</h2>
          <p className="text-xl font-bold">45 mins</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-sm text-gray-500">Avg. Customer Rating</h2>
          <p className="text-xl font-bold">4.5 ⭐</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Breakdown (Pie Chart) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Service Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
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
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trends Over Time (Line Chart) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Service Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={serviceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="services"
                stroke="#0088FE"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Car Model vs Service Table */}
      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Car Model vs. Services</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2">Car Model</th>
              <th className="p-2">Oil Change</th>
              <th className="p-2">Repairs</th>
              <th className="p-2">Maintenance</th>
            </tr>
          </thead>
          <tbody>
            {carModelServices.map((row, index) => (
              <tr key={index} className="border-b">
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
        <h2 className="text-lg font-semibold mb-4">Workflow Time Analysis</h2>
        <p className="text-gray-600">
          Average duration from scheduling to completion:{" "}
          <span className="font-semibold">45 minutes</span>.
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
