import React, { useState } from "react";
import { FaCarSide, FaUsers, FaChartLine } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { VscFeedback } from "react-icons/vsc";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";

export default function HQoverview() {
  const [timeRange, setTimeRange] = useState("monthly");

  // Dummy Data – Replace with API later
  const stats = [
    {
      title: "Total Cars Serviced",
      value: "12,430",
      change: "+12%",
      isPositive: true,
      icon: <FaCarSide className="text-white" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      title: "Active Customers",
      value: "5,672",
      change: "+8%",
      isPositive: true,
      icon: <FaUsers className="text-white" />,
      color: "bg-gradient-to-r from-green-500 to-green-700",
    },
    {
      title: "Revenue",
      value: "$1.2M",
      change: "+15%",
      isPositive: true,
      icon: <LiaFileInvoiceDollarSolid className="text-white" />,
      color: "bg-gradient-to-r from-amber-500 to-amber-700",
    },
    {
      title: "Avg. Rating",
      value: "4.3",
      change: "+0.2",
      isPositive: true,
      icon: <VscFeedback className="text-white" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-700",
    },
  ];

  const chartData = [
    { month: "Jan", services: 1200, revenue: 20000 },
    { month: "Feb", services: 1400, revenue: 25000 },
    { month: "Mar", services: 1800, revenue: 30000 },
    { month: "Apr", services: 1600, revenue: 28000 },
    { month: "May", services: 2000, revenue: 35000 },
    { month: "Jun", services: 2400, revenue: 42000 },
  ];

  const branchPerformance = [
    { name: "Branch A", services: 3200, revenue: 120000, efficiency: 85 },
    { name: "Branch B", services: 2800, revenue: 105000, efficiency: 78 },
    { name: "Branch C", services: 1950, revenue: 85000, efficiency: 72 },
    { name: "Branch D", services: 2450, revenue: 95000, efficiency: 80 },
    { name: "Branch E", services: 1750, revenue: 75000, efficiency: 70 },
  ];

  const feedbackData = [
    { name: "5 Stars", value: 65, color: "#10b981" },
    { name: "4 Stars", value: 20, color: "#8b5cf6" },
    { name: "3 Stars", value: 8, color: "#f59e0b" },
    { name: "2 Stars", value: 4, color: "#f97316" },
    { name: "1 Star", value: 3, color: "#ef4444" },
  ];

  const serviceTypes = [
    { name: "Oil Change", value: 35, color: "#3b82f6" },
    { name: "Maintenance", value: 25, color: "#10b981" },
    { name: "Repairs", value: 20, color: "#f59e0b" },
    { name: "Tire Service", value: 12, color: "#8b5cf6" },
    { name: "Other", value: 8, color: "#6366f1" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 space-y-6 min-h-screen ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold">HQ Overview</h2>
          <p className="opacity-80 mt-1">Performance metrics across all branches</p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 shadow-sm">
          <span className="text-sm opacity-80">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border border-white/40 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-white outline-none"
          >
            <option value="weekly" className="text-black">Weekly</option>
            <option value="monthly" className="text-black">Monthly</option>
            <option value="quarterly" className="text-black">Quarterly</option>
            <option value="yearly" className="text-black">Yearly</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between p-5 rounded-2xl shadow-lg text-white ${stat.color} transition-transform hover:scale-105 duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center text-sm ${stat.isPositive ? 'text-green-100' : 'text-red-100'}`}>
                {stat.isPositive ? <IoIosArrowUp className="mr-1" /> : <IoIosArrowDown className="mr-1" />}
                {stat.change}
              </span>
              <span className="text-white/70 text-sm ml-2">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services & Revenue */}
        <div className="bg-white/10 rounded-2xl shadow-lg p-5">
          <h3 className="font-semibold text-lg mb-5">Monthly Services & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00BF4D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#008837" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#888" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />

              <Bar dataKey="services" fill="#3b82f6" name="Services" />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white/10 rounded-2xl shadow-lg p-5">
          <h3 className="font-semibold text-lg mb-5">Customer Satisfaction</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <linearGradient id="star5" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="star4" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
                <linearGradient id="star3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="star2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#C2410C" />
                </linearGradient>
                <linearGradient id="star1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
              </defs>

              <Pie
                data={feedbackData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                dataKey="value"
              >
                {feedbackData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#star${index + 1})`} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>


        </div>

        {/* Branch Performance */}
        <div className="bg-white/10 rounded-2xl shadow-lg p-5">
          <h3 className="font-semibold text-lg mb-5">Branch Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchPerformance} layout="vertical">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00BF4D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#008837" stopOpacity={1} />
                </linearGradient>

                <linearGradient id="servicesGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#888" />
              <XAxis type="number" stroke="#fff" />
              <YAxis dataKey="name" type="category" stroke="#fff" />
              <Tooltip />
              <Legend />

              <Bar dataKey="services" fill="url(#servicesGradient)" name="Services" radius={[0, 4, 4, 0]} />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" name="Revenue" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Service Distribution */}
        <div className="bg-white/10 rounded-2xl shadow-lg p-5">
          <h3 className="font-semibold text-lg mb-5">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                dataKey="value"
              >
                {serviceTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 rounded-2xl shadow-lg p-5">
        <h3 className="font-semibold text-lg mb-5">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Service Completed", details: "BMW X5 - Oil Change", branch: "Branch A", time: "2 hours ago" },
            { action: "New Customer", details: "Ahmed Mohammed", branch: "Branch C", time: "5 hours ago" },
            { action: "Appointment Booked", details: "Toyota Camry - Annual Service", branch: "Branch B", time: "Yesterday" },
            { action: "Feedback Received", details: "5 Stars - Excellent Service!", branch: "Branch D", time: "Yesterday" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-3">
                <FaChartLine />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm opacity-80 truncate">{activity.details} • {activity.branch}</p>
              </div>
              <div className="text-xs opacity-70 whitespace-nowrap">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
