import React from "react";
import { FaCarSide, FaUsers } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { VscFeedback } from "react-icons/vsc";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function HQoverview() {
  // Dummy Data – Replace with API later
  const stats = [
    { title: "Total Cars Serviced", value: "12,430", icon: <FaCarSide />, color: "bg-blue-500" },
    { title: "Active Customers", value: "5,672", icon: <FaUsers />, color: "bg-green-500" },
    { title: "Revenue", value: "$1.2M", icon: <LiaFileInvoiceDollarSolid />, color: "bg-yellow-500" },
    { title: "Avg. Rating", value: "4.3 ★", icon: <VscFeedback />, color: "bg-purple-500" },
  ];

  const chartData = [
    { month: "Jan", services: 1200, revenue: 20000 },
    { month: "Feb", services: 1400, revenue: 25000 },
    { month: "Mar", services: 1800, revenue: 30000 },
    { month: "Apr", services: 1600, revenue: 28000 },
    { month: "May", services: 2000, revenue: 35000 },
  ];



  return (
    <div className="p-4 space-y-6  ">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">
        HQ Overview / <span className="text-gray-500">نظرة عامة للمقر</span>
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-700 mb-4">Monthly Services & Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="services" fill="#3b82f6" name="Services" />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

     
    </div>
  );
}
