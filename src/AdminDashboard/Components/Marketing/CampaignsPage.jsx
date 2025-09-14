import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "", channel: "Email (SMTP/SendGrid)", template: "Service Reminder",
    audience: "", status: "draft", delivered: 0, opened: 0, clicked: 0, converted: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setCampaigns([
        { id: "1", name: "Oil Change Reminder", channel: "WhatsApp (Twilio)", template: "Service Reminder", audience: "VIP Customers", status: "running", delivered: 1200, opened: 900, clicked: 400, converted: 80 },
        { id: "2", name: "Birthday Offer", channel: "Email (SendGrid)", template: "Birthday / Thank You", audience: "Branch A - Tags: High Spender", status: "scheduled", delivered: 0, opened: 0, clicked: 0, converted: 0 },
      ]);
    }, 600);
  }, []);

  const statusColor = {
    draft: "bg-gray-200 text-gray-700",
    scheduled: "bg-yellow-100 text-yellow-700",
    running: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const handleAddCampaign = () => {
    if (!newCampaign.name.trim()) return;
    setCampaigns([...campaigns, { id: Date.now().toString(), ...newCampaign }]);
    setNewCampaign({ name: "", channel: "Email (SMTP/SendGrid)", template: "Service Reminder", audience: "", status: "draft", delivered: 0, opened: 0, clicked: 0, converted: 0 });
    setShowForm(false);
  };

  const handleStatusChange = (id, status) =>
    setCampaigns(campaigns.map((c) => (c.id === id ? { ...c, status } : c)));

  const handleDelete = (id) =>
    setCampaigns(campaigns.filter((c) => c.id !== id));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Campaigns / الحملات
        </h1>
        <button onClick={() => setShowForm(true)}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:scale-105 transition">
          + New Campaign
        </button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="overflow-x-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {["Name", "Channel", "Template", "Audience", "Status", "Delivered", "Opened", "Clicked", "Converted", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr><td colSpan={10} className="px-5 py-6 text-center text-gray-500">Loading campaigns...</td></tr>
            ) : (
              campaigns.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.channel}</td>
                  <td className="px-4 py-3">{c.template}</td>
                  <td className="px-4 py-3">{c.audience}</td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[c.status]} cursor-pointer`}>
                      {Object.keys(statusColor).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">{c.delivered}</td>
                  <td className="px-4 py-3">{c.opened}</td>
                  <td className="px-4 py-3">{c.clicked}</td>
                  <td className="px-4 py-3">{c.converted}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:underline text-sm">Delete</button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-slate-900">New Campaign</h2>
              <input type="text" placeholder="Campaign Name" value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" />
              <input type="text" placeholder="Audience (branch, tags, history)" value={newCampaign.audience}
                onChange={(e) => setNewCampaign({ ...newCampaign, audience: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" />
              <select value={newCampaign.channel}
                onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none">
                <option>Email (SMTP/SendGrid)</option>
                <option>WhatsApp (Twilio/Meta/360Dialog)</option>
              </select>
              <select value={newCampaign.template}
                onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none">
                <option>Service Reminder</option>
                <option>Promotion / Offer</option>
                <option>Birthday / Thank You</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100 transition">Cancel</button>
                <button onClick={handleAddCampaign}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:scale-105 transition">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
