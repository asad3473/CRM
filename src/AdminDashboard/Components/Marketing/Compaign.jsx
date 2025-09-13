import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Compaign() {
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
        { id: "2", name: "Oil Change Reminder", channel: "WhatsApp (Twilio)", template: "Service Reminder", audience: "VIP Customers", status: "completed", delivered: 1200, opened: 900, clicked: 400, converted: 80 },
        { id: "3", name: "Oil Change Reminder", channel: "WhatsApp (Twilio)", template: "Service Reminder", audience: "VIP Customers", status: "draft", delivered: 1200, opened: 900, clicked: 400, converted: 80 },
        { id: "4", name: "Birthday Offer", channel: "Email (SendGrid)", template: "Birthday / Thank You", audience: "Branch A - Tags: High Spender", status: "scheduled", delivered: 0, opened: 0, clicked: 0, converted: 0 },
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold ">
            Campaigns
          </h1>
          <p className="text-slate-600 mt-1">Manage your marketing campaigns</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-5 py-3 rounded-xl bg-[#1C0B7E] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Campaign
        </button>
      </motion.div>

      {/* Stats Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: campaigns.length, color: "bg-indigo-500" },
          { label: "Running", value: campaigns.filter(c => c.status === "running").length, color: "bg-green-500" },
          { label: "Scheduled", value: campaigns.filter(c => c.status === "scheduled").length, color: "bg-yellow-500" },
          { label: "Draft", value: campaigns.filter(c => c.status === "draft").length, color: "bg-gray-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
            <div className="flex items-center">
              <div className={`w-4 h-4 ${stat.color} rounded-full mr-3`}></div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="overflow-x-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-slate-700">
            <tr>
              {["Name", "Channel", "Template", "Audience", "Status", "Delivered", "Opened", "Clicked", "Converted", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold first:rounded-tl-2xl last:rounded-tr-2xl">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr><td colSpan={10} className="px-5 py-8 text-center text-gray-500">
                <div className="flex justify-center">
                  <svg className="animate-spin h-6 w-6 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading campaigns.....
                </div>
              </td></tr>
            ) : (
              campaigns.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 hover:bg-indigo-50/50 transition-all">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 rounded-full px-3 py-1 text-xs font-medium">
                      {c.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.template}</td>
                  <td className="px-4 py-3">{c.audience}</td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[c.status]} cursor-pointer shadow-inner`}>
                      {Object.keys(statusColor).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 font-medium">{c.delivered.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{c.opened.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{c.clicked.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{c.converted.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Create New Campaign</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
                  <input type="text" placeholder="e.g. Summer Promotion" value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
                  <input type="text" placeholder="Branch, tags, or customer history" value={newCampaign.audience}
                    onChange={(e) => setNewCampaign({ ...newCampaign, audience: e.target.value })}
                    className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Channel</label>
                  <select value={newCampaign.channel}
                    onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                    className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none">
                    <option>Email (SMTP/SendGrid)</option>
                    <option>WhatsApp (Twilio/Meta/360Dialog)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                  <select value={newCampaign.template}
                    onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
                    className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none">
                    <option>Service Reminder..</option>
                    <option>Promotion / Offer.</option>
                    <option>Birthday / Thank You</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition">Cancel</button>
                <button onClick={handleAddCampaign} disabled={!newCampaign.name.trim()}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:scale-105 transition ${!newCampaign.name.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  Create Campaign here....
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 