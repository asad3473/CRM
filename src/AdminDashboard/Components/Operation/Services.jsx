// service.jsx — aligned table + more rows + animated pie chart
// React + TailwindCSS only (no libs). Mobile gets horizontal scroll.
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ------------ Data dictionaries ------------ */
const BRANCHES = [
  { id: "DXB", name: "Dubai" },
  { id: "AUH", name: "Abu Dhabi" },
  { id: "SHJ", name: "Sharjah" },
];
const TYPES = [
  { id: "oil", name: "Oil Change", cl: ["Drain oil", "Replace filter", "Refill", "Reset meter"] },
  { id: "maint", name: "Maintenance 10k", cl: ["Inspect brakes", "Rotate tires", "Fluids top-up", "OBD scan"] },
  { id: "ac", name: "A/C Service", cl: ["Check gas", "Clean cabin filter", "Leak test", "Compressor test"] },
];
const FLOW = ["Scheduled", "In Progress", "Completed", "Closed"];
const branchName = (id) => BRANCHES.find((b) => b.id === id)?.name || id;
const typeName = (id) => TYPES.find((t) => t.id === id)?.name || id;

/* ------------ Image helpers (fix broken URLs) ------------ */
const AVATAR_FALLBACK =
  "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?auto=format&fit=crop&w=200&q=60";
const CAR_FALLBACK =
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=70";
function Img({ src, alt, className }) {
  const [ok, setOk] = useState(true);
  return (
    <img
      loading="lazy"
      src={ok ? src : alt?.includes("avatar") ? AVATAR_FALLBACK : CAR_FALLBACK}
      onError={() => setOk(false)}
      alt={alt || ""}
      className={className}
    />
  );
}

/* ------------ Seed (new car photos + more rows) ------------ */
const seed = [
  { id: "SRV-2025-001", branch: "AUH", customer: "Maya Singh", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=70", phone: "+971507654321", model: "Honda Civic", plate: "H-77821", carImg: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=70", type: "maint", status: "Closed", at: "2025-09-16T09:30", advisor: "Rami", check: { 0: 1, 1: 1, 2: 1, 3: 1 } },
  { id: "SRV-2025-002", branch: "DXB", customer: "Ahmed Khan", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=70", phone: "+971501234567", model: "Toyota Camry", plate: "A-12345", carImg: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=70", type: "oil", status: "In Progress", at: "2025-09-18T10:00", advisor: "Ali", check: { 0: 1, 1: 0 } },
  { id: "SRV-2025-003", branch: "SHJ", customer: "Omar Hassan", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=70", phone: "+971504443333", model: "Nissan Patrol", plate: "B-33112", carImg: "https://images.unsplash.com/photo-1518692010331-2c83ebf6bb43?auto=format&fit=crop&w=900&q=70", type: "ac", status: "Scheduled", at: "2025-09-20T12:00", advisor: "Lina", check: {} },
  { id: "SRV-2025-004", branch: "DXB", customer: "Fatima Noor", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=70", phone: "+971508888888", model: "Kia Sportage", plate: "D-55421", carImg: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=70", type: "maint", status: "Completed", at: "2025-09-17T14:15", advisor: "Zed", check: { 0: 1, 1: 1 } },
  { id: "SRV-2025-005", branch: "AUH", customer: "Sara Ali", avatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&q=70", phone: "+971507000111", model: "Hyundai Tucson", plate: "F-90871", carImg: "https://images.unsplash.com/photo-1517940310602-26535839fe5a?auto=format&fit=crop&w=900&q=70", type: "oil", status: "Scheduled", at: "2025-09-21T09:00", advisor: "Rami", check: {} },
  { id: "SRV-2025-006", branch: "SHJ", customer: "Bilal Raza", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=70", phone: "+971506660000", model: "Lexus RX350", plate: "C-66221", carImg: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=70", type: "ac", status: "Completed", at: "2025-09-15T16:40", advisor: "Ola", check: { 0: 1, 1: 1, 2: 1 } },
];

/* ======================= Page ======================= */
export default function Services() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState(""), [branch, setBranch] = useState("ALL"), [stat, setStat] = useState("ALL"), [type, setType] = useState("ALL");
  const [open, setOpen] = useState(false), [edit, setEdit] = useState(null);

  const flowIdx = (s) => Math.max(0, FLOW.indexOf(s.status));
  const checklistPct = (s) => {
    const total = TYPES.find(t => t.id === s.type)?.cl.length || 0;
    const done = Object.values(s.check || {}).filter(Boolean).length;
    return total ? Math.round((done / total) * 100) : 0;
  };

  const list = useMemo(() => {
    let L = [...items];
    const n = q.toLowerCase();
    if (q) L = L.filter(s => [s.customer, s.phone, s.model, s.plate, s.id].join(" ").toLowerCase().includes(n));
    if (branch !== "ALL") L = L.filter(s => s.branch === branch);
    if (stat !== "ALL") L = L.filter(s => s.status === stat);
    if (type !== "ALL") L = L.filter(s => s.type === type);
    return L.sort((a, b) => new Date(a.at) - new Date(b.at));
  }, [items, q, branch, stat, type]);

  const save = (v) => { setItems(x => v.id ? x.map(i => i.id === v.id ? v : i) : [{ ...v, id: `SRV-${Date.now()}` }, ...x]); setOpen(false); };
  const up = (s) => { const i = flowIdx(s); if (i < FLOW.length - 1) save({ ...s, status: FLOW[i + 1] }); };
  const del = (id) => setItems(x => x.filter(i => i.id !== id));

  const statusCounts = list.reduce((a, s) => ((a[s.status] = (a[s.status] || 0) + 1), a), {});

  return (
    <div className="mx-auto max-w-7xl px-3 py-6">
      {/* Header + animated Pie */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Services</h1>
          <p className="text-sm text-slate-500">Book, track workflow, checklist, close & invoice.</p>
        </div>

      </div>
      <div className="mb-3 mt-2 w-full  justify-between items-end flex ">
        <Pie data={statusCounts} />
        <div className="flex items-center gap-4">

          <button onClick={() => { setEdit(null); setOpen(true) }} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow">New Service</button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-12">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name/phone/model/plate/ID…" className="sm:col-span-6 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500" />
        <select value={branch} onChange={e => setBranch(e.target.value)} className="sm:col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500"><option value="ALL">All Branches</option>{BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
        <select value={stat} onChange={e => setStat(e.target.value)} className="sm:col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500"><option>ALL</option>{FLOW.map(s => <option key={s}>{s}</option>)}</select>
        <select value={type} onChange={e => setType(e.target.value)} className="sm:col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500"><option value="ALL">All Types</option>{TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
      </div>

      {/* Table (mobile: horizontal scroll) */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1280px] w-full text-sm">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur">
              <tr>{["When", "Service ID", "Customer", "Vehicle", "Branch", "Type", "Status", "Progress", "Checklist", "Advisor", "Actions"].map(h =>
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((s, i) => (
                <tr key={s.id} style={{ animationDelay: `${i * 35}ms` }} className="animate-row align-top transition hover:-translate-y-[1px] hover:bg-white hover:shadow-sm">
                  <td className="px-4 py-3">{new Date(s.at).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{s.id}</td>
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <Img src={s.avatar} alt="avatar" className="h-12 w-12 flex-none rounded-lg object-cover shadow-sm" />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-900">{s.customer}</div>
                        <div className="text-[11px] text-slate-500">{s.phone}</div>
                      </div>
                    </div>
                  </td>
                  {/* Vehicle (aligned text + thumbnail) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-slate-800">{s.model}</div>
                        <div className="text-xs font-medium text-slate-600">{s.plate}</div>
                      </div>
                      <Img src={s.carImg} alt="car" className="h-16 w-28 flex-none rounded-md object-cover ring-1 ring-slate-100" />
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200">{branchName(s.branch)}</span></td>
                  <td className="px-4 py-3">{typeName(s.type)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-xs ring-1 ${s.status === "Closed" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" :
                        s.status === "In Progress" ? "bg-amber-50 text-amber-800 ring-amber-100" :
                          s.status === "Completed" ? "bg-sky-50 text-sky-700 ring-sky-100" : "bg-slate-50 text-slate-700 ring-slate-200"}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-28 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(FLOW.indexOf(s.status) / (FLOW.length - 1)) * 100}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">{FLOW[Math.max(0, FLOW.indexOf(s.status))]}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-20 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${checklistPct(s)}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">{checklistPct(s)}%</div>
                  </td>
                  <td className="px-4 py-3">{s.advisor || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => up(s)} disabled={s.status === "Closed"} className="mr-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs transition hover:-translate-y-0.5 hover:border-slate-300 disabled:opacity-40">Next</button>
                    <button onClick={() => { setEdit(s); setOpen(true) }} className="mr-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs transition hover:-translate-y-0.5 hover:border-slate-300">Edit</button>
                    <button onClick={() => del(s.id)} className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs text-rose-700 transition hover:-translate-y-0.5 hover:border-rose-300">Delete</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (<tr><td colSpan={11} className="px-4 py-10 text-center text-slate-500">No services.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (<div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => setOpen(false)}>
        <div className="animate-modal w-[95%] max-w-2xl rounded-xl bg-white p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
          <h3 className="mb-2 text-base font-semibold">{edit ? "Edit Service" : "New Service"}</h3>
          <ServiceForm initial={edit} onSave={save} onCancel={() => setOpen(false)} />
        </div>
      </div>)}

      {/* Keyframes */}
      <style>{`
        @keyframes row{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
        .animate-row{animation:row .35s ease-out both}
        @keyframes modal{0%{opacity:0;transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
        .animate-modal{animation:modal .2s ease-out both}
      `}</style>
    </div>
  );
}

/* ------------ Animated donut pie (canvas) ------------ */
function Pie({ data }) {
  const ref = useRef(null);
  const series = [
    { k: "Scheduled", c: "#94a3b8" },
    { k: "In Progress", c: "#f59e0b" },
    { k: "Completed", c: "#38bdf8" },
    { k: "Closed", c: "#10b981" },
  ];
  const total = series.reduce((t, s) => t + (data[s.k] || 0), 0) || 1;

  useEffect(() => {
    const ctx = ref.current.getContext("2d");
    const W = 110, H = 110, cx = W / 2, cy = H / 2, R = 46, inner = 26;
    let startAngles = [], targetAngles = [], sum = 0;
    series.forEach(s => { const v = (data[s.k] || 0) / total * 2 * Math.PI; startAngles.push(0); targetAngles.push(v); sum += v; });
    let raf, start;

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.08)"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill(); ctx.restore();
      let a0 = -Math.PI / 2;
      series.forEach((s, i) => {
        const ang = startAngles[i] + (targetAngles[i] - startAngles[i]) * t;
        if (ang <= 0) return;
        const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
        grad.addColorStop(0, s.c); grad.addColorStop(1, s.c);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.fillStyle = grad; ctx.arc(cx, cy, R, a0, a0 + ang); ctx.closePath(); ctx.fill(); a0 += ang;
      });
      // hole
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = "source-over";
      // center label
      ctx.fillStyle = "#0f172a"; ctx.font = "600 14px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(total, cx, cy);
    };

    const step = (ts) => { if (!start) start = ts; const t = Math.min(1, (ts - start) / 700); draw(t); if (t < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [JSON.stringify(data)]);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
      <canvas ref={ref} width={110} height={110} className="transition-transform duration-300 hover:scale-105" />
      <div className="grid grid-cols-1 gap-y-1 text-xs">
        {series.map(s => (
          <div key={s.k} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded" style={{ background: s.c }} />
            <span className="text-slate-700">{s.k}: <b>{data[s.k] || 0}</b></span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------ Form ------------ */
function ServiceForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || {
    id: "", branch: "DXB", customer: "", avatar: "", phone: "", model: "", plate: "",
    carImg: "", type: "oil", status: "Scheduled", at: new Date().toISOString().slice(0, 16), advisor: "", notes: "", check: {}
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f.id ? f : { ...f, id: `SRV-${Date.now()}` }); }} className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input placeholder="Service ID (auto if empty)" value={f.id} onChange={e => setF({ ...f, id: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={f.branch} onChange={e => setF({ ...f, branch: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">{BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
        <input required placeholder="Customer Name" value={f.customer} onChange={e => setF({ ...f, customer: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Avatar URL" value={f.avatar} onChange={e => setF({ ...f, avatar: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input required placeholder="+9715XXXXXXXX" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input required placeholder="Model" value={f.model} onChange={e => setF({ ...f, model: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input required placeholder="Plate" value={f.plate} onChange={e => setF({ ...f, plate: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input placeholder="Car Image URL" value={f.carImg} onChange={e => setF({ ...f, carImg: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={f.type} onChange={e => setF({ ...f, type: e.target.value, check: {} })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">{TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <input type="datetime-local" value={f.at} onChange={e => setF({ ...f, at: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" required />
        <select value={f.status} onChange={e => setF({ ...f, status: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">{FLOW.map(s => <option key={s}>{s}</option>)}</select>
        <input placeholder="Advisor" value={f.advisor} onChange={e => setF({ ...f, advisor: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <textarea placeholder="Notes" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} className="h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">Cancel</button>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
      </div>
    </form>
  );
}