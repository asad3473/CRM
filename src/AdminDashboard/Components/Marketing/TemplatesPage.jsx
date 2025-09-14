import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: "", content: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTemplates([
        {
          id: "1",
          title: "Oil Change Reminder",
          content: "Remind customers about timely oil changes to extend vehicle life.",
        },
        {
          id: "2",
          title: "Maintenance Reminder",
          content: "Notify users when their scheduled maintenance is due.",
        },
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTemplate = () => {
    if (!newTemplate.title.trim()) return;
    setTemplates([...templates, { id: Date.now().toString(), ...newTemplate }]);
    setNewTemplate({ title: "", content: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => setTemplates(templates.filter((t) => t.id !== id));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
          Templates / القوالب
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition"
        >
          + New Template
        </button>
      </motion.div>

      {/* Templates List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {templates.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Loading templates...
          </div>
        ) : (
          templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-lg border border-slate-100 p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{t.title}</h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {t.content}
                </p>
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="mt-4 text-red-500 hover:underline text-sm self-end"
              >
                Delete
              </button>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Add Template Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-900">New Service Reminder</h2>
              <input
                type="text"
                placeholder="Template Title"
                value={newTemplate.title}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, title: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <textarea
                rows={4}
                placeholder="Template Content"
                value={newTemplate.content}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, content: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTemplate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:scale-105 transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
