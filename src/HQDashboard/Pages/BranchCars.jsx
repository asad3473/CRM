// File: CarsPro.jsx
import React, { useMemo, useState, useEffect } from "react";

/* THEME + MOCKS */
const GRAD = "linear-gradient(135deg,#1C0B7E 0%,#2D1BA3 100%)";
const HERO_IMG = "/cars-hero.png"; // (kept for compatibility; not used now)
const CUSTOMERS = [
  { id: 1, name: "Omar Farouk" },
  { id: 2, name: "Huda Z." },
  { id: 3, name: "Ahmed M." },
  { id: 4, name: "Lina K." }
];
const START = [
  { img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600", vin: "1HGCM82633A004352", plate: "D-12345", model: "Civic", year: 2021, color: "Blue", mileage: 42000, warranty: "2026-06-30", insurance: "2025-12-31", customer_id: 1 },
  { img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600", vin: "JHMCM56557C404453", plate: "K-11223", model: "Camry", year: 2020, color: "Gray", mileage: 88000, warranty: "2024-07-01", insurance: "2025-07-01", customer_id: 3 },
  { img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600", vin: "WBA8E1G59GNU12345", plate: "M-99110", model: "Corolla", year: 2019, color: "Yellow", mileage: 105200, warranty: "2023-01-01", insurance: "2024-11-20", customer_id: 4 }
];
const HISTORY = {
  "1HGCM82633A004352": [{ d: "2025-06-12", t: "Oil Change", amt: 120 }, { d: "2025-03-08", t: "Brake Pads", amt: 260 }],
  "JHMCM56557C404453": [{ d: "2025-06-18", t: "General Service", amt: 340 }],
  "WBA8E1G59GNU12345": [{ d: "2025-06-25", t: "AC Service", amt: 180 }]
};

/* UTILS + ATOMS */
const isVIN = v => /^[A-HJ-NPR-Z0-9]{17}$/i.test(v);
const alive = d => d && new Date(d) >= new Date();
const pct = (d) => {
  if (!d) return 0;
  const start = new Date();
  const end = new Date(d);
  const total = 365 * 1000 * 60 * 60 * 24 * 2; // approx 2y
  return Math.max(0, Math.min(100, 100 - (end - start) / total * 100));
};
const Dot = ({ c }) => <span className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-middle" style={{ background: c?.toLowerCase?.() || "#999" }} />;
const Badge = ({ ok, children }) => (<span className={`px-2 py-0.5 rounded-full text-[11px] border transition-all duration-300 ${ok ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>{children}</span>);
const RowImg = ({ src }) => (<img src={src} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-black/5 transition-transform duration-300 hover:scale-105" />);

export default function CarsPro() {
  const [cars, setCars] = useState(START);
  const [q, setQ] = useState(""), [m, setM] = useState("All"), [y, setY] = useState("All"), [w, setW] = useState("All");
  const [open, setOpen] = useState(""); const [show, setShow] = useState(false); const [edit, setEdit] = useState(null);
  const empty = { img: "", vin: "", plate: "", model: "", year: "", color: "", mileage: "", warranty: "", insurance: "", customer_id: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const cname = id => CUSTOMERS.find(c => c.id == id)?.name || "—";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const models = useMemo(() => ["All", ...new Set(cars.map(c => c.model))], [cars]);
  const years = useMemo(() => ["All", ...new Set(cars.map(c => c.year))], [cars]);

  const filtered = useMemo(() => cars.filter(c => {
    const s = (c.vin + c.plate).toLowerCase().includes(q.toLowerCase());
    const mOK = m === "All" || c.model === m, yOK = y === "All" || String(c.year) === String(y);
    const ws = alive(c.warranty) ? "Active" : "Expired", wOK = w === "All" || w === ws;
    return s && mOK && yOK && wOK;
  }), [cars, q, m, y, w]);

  const startAdd = () => { setForm(empty); setEdit(null); setShow(true); };
  const startEdit = c => { setForm({ ...c }); setEdit(c.vin); setShow(true); };
  const save = () => {
    if (!isVIN(form.vin)) return alert("VIN must be 17 (no I,O,Q).");
    if (!form.plate || !form.model || !form.year || !form.customer_id) return alert("Plate, model, year, customer required.");
    if (!edit && cars.some(c => c.vin === form.vin)) return alert("VIN already exists.");
    const f = { ...form, year: +form.year, mileage: +(form.mileage || 0) };
    setCars(s => edit ? s.map(c => c.vin === edit ? f : c) : [f, ...s]); setShow(false);
  };
  const del = vin => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      setCars(s => s.filter(c => c.vin !== vin));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg md:text-xl font-semibold text-indigo-800">Loading Car Management System</h2>
          <p className="text-indigo-600 mt-2 text-sm md:text-base">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Compact file-name chip (no background banner, no top space) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2">
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 border border-indigo-100 shadow-md">
          <span className="text-base">📄</span>
          <span className="font-semibold text-indigo-700">CarsPro.jsx</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-800">{cars.length}</div>
            <div className="text-xs sm:text-sm text-indigo-600 mt-1">Total Cars</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{cars.filter(c => alive(c.warranty)).length}</div>
            <div className="text-xs sm:text-sm text-emerald-600 mt-1">Active Warranties</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-amber-800">
              {Math.round(cars.reduce((acc, car) => acc + (car.mileage || 0), 0) / (cars.length || 1)).toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-amber-600 mt-1">Avg. Mileage</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-purple-800">{CUSTOMERS.length}</div>
            <div className="text-xs sm:text-sm text-purple-600 mt-1">Total Customers</div>
          </div>
        </div>

        {/* Search + Filters */}
        <section className="rounded-2xl border border-white bg-white/90 backdrop-blur-md p-4 sm:p-5 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 className="text-base sm:text-lg font-semibold text-indigo-800 mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-lg sm:text-xl">🔍</span> Search & Filter Cars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by VIN or plate…"
              className="md:col-span-6 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-200 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm sm:text-base"
            />
            <select
              value={m}
              onChange={e => setM(e.target.value)}
              className="md:col-span-2 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-200 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm sm:text-base"
            >
              {["All", ...new Set(cars.map(c => c.model))].map(x => <option key={x}>{x}</option>)}
            </select>
            <select
              value={y}
              onChange={e => setY(e.target.value)}
              className="md:col-span-2 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-200 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm sm:text-base"
            >
              {["All", ...new Set(cars.map(c => c.year))].map(x => <option key={x}>{x}</option>)}
            </select>
            <select
              value={w}
              onChange={e => setW(e.target.value)}
              className="md:col-span-2 h-11 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-200 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm sm:text-base"
            >
              {["All", "Active", "Expired"].map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </section>

        {/* Cars Section (unchanged) */}
        <section className="rounded-3xl border border-white bg-white/95 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-300">
          <header className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🏁</span> Car Garage
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1">Manage your vehicle inventory with ease</p>
          </header>

          {/* Mobile cards */}
          <div className="block lg:hidden p-3 sm:p-4 space-y-4 sm:space-y-5">
            {filtered.length ? filtered.map((c, index) => {
              const wOK = alive(c.warranty), p = pct(c.warranty);
              return (
                <div
                  key={c.vin}
                  className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="relative shrink-0">
                      <RowImg src={c.img || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600"} />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white" style={{ background: c.color?.toLowerCase?.() || "#999" }}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base sm:text-lg truncate">{c.model} · {c.plate}</div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center"><Dot c={c.color} />{c.color} • {c.year}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
                    <div>
                      <div className="text-gray-500 font-medium">VIN</div>
                      <div className="font-mono truncate text-indigo-700">{c.vin}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 font-medium">Mileage</div>
                      <div className="text-indigo-700">{(c.mileage || 0).toLocaleString()} km</div>
                    </div>
                    <div>
                      <div className="text-gray-500 font-medium">Warranty</div>
                      <div className="flex items-center gap-1">
                        <Badge ok={wOK}>{wOK ? "Active" : "Expired"}</Badge>
                        <span className="text-[11px] sm:text-xs text-gray-500">({c.warranty || "—"})</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 font-medium">Customer</div>
                      <div className="text-indigo-700">{cname(c.customer_id)}</div>
                    </div>
                  </div>

                  {/* Warranty bar */}
                  <div className="mb-3 sm:mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${wOK ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => setOpen(o => o === c.vin ? "" : c.vin)}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors duration-300 flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <span>👁️</span> {open === c.vin ? "Hide" : "View"} History
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="p-2.5 sm:p-3 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-300 transform active:scale-95"
                        title="Edit"
                        aria-label="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => del(c.vin)}
                        className="p-2.5 sm:p-3 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors duration-300 transform active:scale-95"
                        title="Delete"
                        aria-label="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {open === c.vin && (
                    <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 animate-fade-in">
                      <div className="text-sm sm:text-md font-semibold text-indigo-800 mb-2 sm:mb-3 flex items-center gap-2">
                        <span>🛠️</span> Service History
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {(HISTORY[c.vin] || []).map((h, i) => (
                          <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="text-sm font-medium text-indigo-800">{h.t}</div>
                            <div className="text-xs text-gray-500 mt-1">{h.d} • ${h.amt}</div>
                          </div>
                        ))}
                        {!HISTORY[c.vin]?.length && (
                          <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-xl">
                            No service history recorded
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center text-gray-500 py-10 sm:py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔍</div>
                <div className="text-base sm:text-lg font-medium">No cars found</div>
                <p className="mt-1 sm:mt-2 text-sm">Try adjusting your search filters</p>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-200">
                  {["Car", "VIN", "Spec", "Mileage", "Warranty", "Customer", "Actions"].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-indigo-800 font-semibold text-xs xl:text-sm uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((c, index) => {
                  const wOK = alive(c.warranty), p = pct(c.warranty);
                  return (
                    <React.Fragment key={c.vin}>
                      <tr className="border-b border-gray-100 hover:bg-indigo-50/40 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <RowImg src={c.img || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600"} />
                            <div className="min-w-0">
                              <div className="font-bold text-indigo-900 truncate max-w-[220px] xl:max-w-xs">{c.model} · {c.plate}</div>
                              <div className="text-xs text-gray-500 flex items-center"><Dot c={c.color} />{c.color} • {c.year}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-indigo-700 whitespace-nowrap">{c.vin}</td>
                        <td className="px-5 py-4 text-indigo-700">{c.color || "—"}</td>
                        <td className="px-5 py-4">
                          <span className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 transition-all duration-300 hover:bg-indigo-200 whitespace-nowrap">
                            {(c.mileage || 0).toLocaleString()} km
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Badge ok={wOK}>{wOK ? "Active" : "Expired"}</Badge>
                            <span className="text-xs text-gray-500 whitespace-nowrap">({c.warranty || "—"})</span>
                          </div>
                          <div className="h-1.5 mt-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${wOK ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`}
                              style={{ width: `${p}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-indigo-700 whitespace-nowrap">{cname(c.customer_id)}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setOpen(o => o === c.vin ? "" : c.vin)} className="p-2.5 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300 transform hover:scale-105" title="History" aria-label="History">👁️</button>
                            <button onClick={() => startEdit(c)} className="p-2.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-300 transform hover:scale-105" title="Edit" aria-label="Edit">✏️</button>
                            <button onClick={() => del(c.vin)} className="p-2.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 transform hover:scale-105" title="Delete" aria-label="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                      {open === c.vin && (
                        <tr className="bg-indigo-50/30 animate-fade-in">
                          <td colSpan={7} className="px-6 pb-5">
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                              {(HISTORY[c.vin] || []).map((h, i) => (
                                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                                  <div className="text-sm font-medium text-indigo-800">{h.t}</div>
                                  <div className="text-xs text-gray-500 mt-1">{h.d} • ${h.amt}</div>
                                </div>
                              ))}
                              {!HISTORY[c.vin]?.length && (
                                <div className="text-sm text-gray-500 col-span-full text-center py-4 bg-white rounded-xl border border-gray-200">
                                  No service history recorded for this vehicle
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500 bg-white rounded-b-xl">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <div className="text-lg font-medium">No cars found</div>
                        <p className="mt-2">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal for Add/Edit Car */}
      {show && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300" onClick={() => setShow(false)} />
          <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:w-[90%] md:w-full max-w-none md:max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden transform transition-all duration-300 sm:scale-95 animate-scale-in max-h-[92vh] sm:max-h-[80vh]">
              <header className="px-4 sm:px-6 py-3 sm:py-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                <b className="text-lg sm:text-xl">{edit ? "Edit Car" : "Add New Car"}</b>
              </header>
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto">
                {[
                  ["Image URL", "img"], ["VIN", "vin"], ["Plate", "plate"], ["Model", "model"], ["Year", "year", "number"],
                  ["Color", "color"], ["Mileage", "mileage", "number"], ["Warranty Exp.", "warranty", "date"], ["Insurance Exp.", "insurance", "date"]
                ].map(([l, k, t]) => (
                  <label key={k} className="text-xs sm:text-sm">
                    {l}
                    <input
                      type={t || "text"}
                      value={form[k] || ""}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      className={`w-full mt-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm ${k === "vin" && !isVIN(form.vin) && form.vin ? "border-rose-300" : "border-gray-300"}`}
                    />
                  </label>
                ))}
                <label className="text-xs sm:text-sm sm:col-span-2">
                  Customer (required)
                  <select
                    value={form.customer_id || ""}
                    onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}
                    className={`w-full mt-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm ${!form.customer_id ? "border-rose-300" : "border-gray-300"}`}
                  >
                    <option value="">Select customer…</option>
                    {CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <footer className="px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-2 sm:gap-3 border-t border-gray-200">
                <button onClick={() => setShow(false)} className="px-4 sm:px-5 py-2.5 rounded-xl border border-gray-300 transition-all duration-300 hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={save} className="px-4 sm:px-5 py-2.5 rounded-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm">
                  {edit ? "Update" : "Add"} Car
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { .animate-fade-in, .animate-fade-in-up, .animate-scale-in { animation: none !important; } }
      `}</style>
    </div>
  );
}
