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
    {
      title: "Cars Serviced",
      value: "540",
      icon: <FaCarSide />,
      color: "from-[#1E90FF] to-[#000000]",
    },
    {
      title: "Revenue",
      value: "$82,000",
      icon: <LiaFileInvoiceDollarSolid />,
      color: "from-[#000000] to-[#1E90FF]",
    },
    {
      title: "Avg. Rating",
      value: "4.2 ★",
      icon: <VscFeedback />,
      color: "from-[#1E90FF] to-[#000000]",
    },
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
    <div className="p-6 space-y-8 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900">
        Branch Performance{" "}
        
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex items-center p-5 rounded-2xl shadow-lg text-white bg-[#1C0B7E] hover:scale-105 transform transition duration-300`}
          >
            <div className="text-4xl mr-4 drop-shadow-lg">{stat.icon}</div>
            <div>
              <p className="text-sm opacity-90">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cars Serviced Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">
          Cars Serviced Over Time
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
            <XAxis dataKey="month" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #1C0B7E",
              }}
            />
            <Line
              type="monotone"
              dataKey="cars"
              stroke="#1E90FF"
              strokeWidth={3}
              dot={{ r: 5, fill: "#000000" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Service Advisors Table */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">
          Service Advisor Performance
        </h3>
        <table className="w-full text-left border-collapse overflow-hidden rounded-lg">
          <thead>
            <tr className="bg-[#1C0B7E] text-white">
              <th className="p-3">Advisor</th>
              <th className="p-3">Bookings</th>
              <th className="p-3">Avg. Rating</th>
            </tr>
          </thead>
          <tbody>
            {advisors.map((advisor, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-[#E6F0FF] transition`}
              >
                <td className="p-3 font-medium text-gray-800">
                  {advisor.name}
                </td>
                <td className="p-3 text-gray-600">{advisor.bookings}</td>
                <td className="p-3 text-gray-600">{advisor.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
