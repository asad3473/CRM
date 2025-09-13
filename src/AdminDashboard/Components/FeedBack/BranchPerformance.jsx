import React from "react";
import { FaCarSide } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { VscFeedback } from "react-icons/vsc";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BranchPerformance() {
  // Dummy Data – replace with API later
  const stats = [
    { title: "Cars Serviced", value: "540", icon: <FaCarSide />, color: "bg-blue-500" },
    { title: "Revenue", value: "$82,000", icon: <LiaFileInvoiceDollarSolid />, color: "bg-green-500" },
    { title: "Avg. Rating", value: "4.2 ★", icon: <VscFeedback />, color: "bg-purple-500" },
  ];

  const monthlyData = [
    { month: "Jan", cars: 120 },
    { month: "Feb", cars: 140 },
    { month: "Mar", cars: 180 },
    { month: "Apr", cars: 160 },
    { month: "May", cars: 200 },
  ];

  const advisors = [
    { name: "Ahmed Ali", bookings: 120, rating: "4.6" },
    { name: "Sara Khan", bookings: 95, rating: "4.4" },
    { name: "Bilal Raza", bookings: 85, rating: "3.9" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">
        Branch Performance /{" "}
        <span className="text-gray-500">أداء الفروع</span>
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex items-center p-4 rounded-lg shadow-md text-white ${stat.color}`}
          >
            <div className="text-3xl mr-4">{stat.icon}</div>
            <div>
              <p className="text-sm">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cars Serviced Chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-700 mb-4">Cars Serviced Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cars" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Service Advisors Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-700 mb-4">Service Advisor Performance</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2">Advisor</th>
              <th className="p-2">Bookings</th>
              <th className="p-2">Avg. Rating</th>
            </tr>
          </thead>
          <tbody>
            {advisors.map((advisor, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{advisor.name}</td>
                <td className="p-2">{advisor.bookings}</td>
                <td className="p-2">{advisor.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
