import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Tag, PlusCircle, Trash2, Search } from "lucide-react";

export default function Audience() {
  const [audiences, setAudiences] = useState([]);
  const [tags, setTags] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("audience");
  const [newItem, setNewItem] = useState({ name: "", description: "", count: 0 });
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAudiences([
        { id: "1", name: "VIP Customers", description: "High-value loyal customers", count: 234 },
        { id: "2", name: "Warranty Expired", description: "Clients with expired warranties", count: 7 },
        { id: "1", name: "VIP Customers", description: "High-value loyal customers", count: 56 },
        { id: "2", name: "Standard Customers", description: "Clients with expired warranties", count: 54 },
      ]);
      setTags([
        { id: "t1", name: "Frequent Service", description: "Customers who visit often" },
        { id: "t2", name: "High Spender", description: "Top 10% spenders" },
      ]);
    }, 400);
  }, []);

  const handleAdd = () => {
    if (!newItem.name.trim()) return;
    const newObj = { id: Date.now().toString(), ...newItem };
    type === "audience"
      ? setAudiences([...audiences, newObj])
      : setTags([...tags, newObj]);
    setNewItem({ name: "", description: "", count: 0 });
    setShowForm(false);
  };

  const handleDelete = (id, kind) => {
    kind === "audience"
      ? setAudiences(audiences.filter((a) => a.id !== id))
      : setTags(tags.filter((t) => t.id !== id));
  };

  const Card = ({ item, kind, i }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="group bg-white/95 backdrop-blur border p-5 rounded-2xl shadow hover:shadow-xl transition relative"
    >
      <div className="flex items-start gap-3">
        {kind === "audience" ? (
          <Users className="w-6 h-6 text-indigo-600" />
        ) : (
          <Tag className="w-6 h-6 text-purple-600" />
        )}
        <div>
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
          {kind === "audience" && (
            <span className="mt-2 inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {item.count} Members
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => handleDelete(item.id, kind)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );

  const filterItems = (items) =>
    items.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-3xl font-extrabold text-slate-900">
          Audiences & Tags / الجماهير والوسوم
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 flex items-center gap-2 rounded-xl bg-[#1C0B7E ] text-white shadow hover:scale-105 transition"
          >
            <PlusCircle size={18} /> New
          </button>
        </div>
      </motion.div>

      {/* Audiences */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-2">🎯 Audiences</h2>
        <p className="text-gray-500 text-sm mb-4">
          Segment your customers into meaningful groups (VIPs, warranty expired, frequent service visitors).
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filterItems(audiences).length > 0 ? (
            filterItems(audiences).map((a, i) => (
              <Card key={a.id} item={a} kind="audience" i={i} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No audiences found.</p>
          )}
        </div>
      </section>

      {/* Tags */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-2">🏷️ Tags</h2>
        <p className="text-gray-500 text-sm mb-4">
          Use tags to label customers based on behaviors and spending habits.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filterItems(tags).length > 0 ? (
            filterItems(tags).map((t, i) => (
              <Card key={t.id} item={t} kind="tag" i={i} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No tags found.</p>
          )}
        </div>
      </section>

      {/* Add Form */}
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
              className="bg-white/95 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
            >
              <h2 className="text-xl font-bold">New {type}</h2>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="audience">Audience</option>
                <option value="tag">Tag</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <textarea
                rows={3}
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              {type === "audience" && (
                <input
                  type="number"
                  placeholder="Member Count"
                  value={newItem.count}
                  onChange={(e) =>
                    setNewItem({ ...newItem, count: Number(e.target.value) })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:scale-105"
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
