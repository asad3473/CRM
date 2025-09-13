import React, { useMemo, useState, useEffect, useRef } from "react";

const BR = [
  { id: "ALL", n: "All" },
  { id: "DXB", n: "Dubai" },
  { id: "AUH", n: "Abu Dhabi" },
  { id: "SHJ", n: "Sharjah" },
];

const seed = [
  { id:"c1", img:"https://images.unsplash.com/photo-1517940310602-26535839fe5a?auto=format&fit=crop&w=1400&q=70", clr:"Grey", model:"Camry", year:2022, plate:"WST-552", vin:"4T1B11HK8NU123456", owner:"R.Omar", phone:"+971504444444", branch:"DXB", wExp:"2026-12-11", iExp:"2025-11-01", lastSrv:"2025-07-12" },
  { id:"c2", img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=70", clr:"White", model:"Corolla", year:2019, plate:"RBD-123", vin:"JTDBR32E3Y0123456", owner:"A.Khan", phone:"+971502222222", branch:"AUH", wExp:"2025-11-20", iExp:"2025-10-05", lastSrv:"2025-05-11" },
  { id:"c3", img:"https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=70", clr:"Blue", model:"Civic", year:2021, plate:"KSA-777", vin:"1HGCM82633A004352", owner:"M.Ali", phone:"+971501111111", branch:"SHJ", wExp:"2026-04-01", iExp:"2025-09-26", lastSrv:"2025-08-30" },
  { id:"c4", img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=70", clr:"Red", model:"Sportage", year:2018, plate:"EAS-991", vin:"KNDPB3A26H7123456", owner:"S.Noor", phone:"+971503333333", branch:"DXB", wExp:"2024-12-01", iExp:"2025-12-30", lastSrv:"2025-02-22" },
];


const dLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
const dSince = (d) => Math.max(0, Math.ceil((new Date() - new Date(d)) / 86400000));
const tone = (d) => (d <= 0 ? "danger" : d <= 30 ? "warn" : "ok");
const bName = (id) => BR.find((x) => x.id === id)?.n || id;

/* ======= Small UI bits ======= */
const Chip = ({ tone, children }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs ring-1 transition ${
      tone === "danger"
        ? "bg-rose-50 text-rose-700 ring-rose-100"
        : tone === "warn"
        ? "bg-amber-50 text-amber-800 ring-amber-100"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100"
    } hover:-translate-y-0.5`}
  >
    {children}
  </span>
);

const Ring = ({ percent }) => {
  const R = 18, C = 2 * Math.PI * R, off = C * (1 - percent);
  return (
    <svg viewBox="0 0 44 44" className="h-10 w-10">
      <circle cx="22" cy="22" r={R} className="fill-none stroke-slate-200" strokeWidth="4" />
      <circle cx="22" cy="22" r={R} className="fill-none stroke-indigo-500 transition-[stroke-dashoffset] duration-500"
        strokeWidth="4" strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round" />
    </svg>
  );
};

/* ======= Charts (Canvas, animated) ======= */
function Pie({ counts }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const cx = 55, cy = 55, R = 48, inner = 28;
    const series = [["DXB", "#6366f1"], ["AUH", "#22c55e"], ["SHJ", "#f59e0b"]];
    const total = series.reduce((t, [k]) => t + (counts[k] || 0), 0) || 1;

    let start;
    function draw(t = 0) {
      ctx.clearRect(0, 0, 110, 110);
      let a = -Math.PI / 2;
      series.forEach(([k, col]) => {
        const v = ((counts[k] || 0) / total) * 2 * Math.PI * t;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.fillStyle = col; ctx.arc(cx, cy, R, a, a + v); ctx.fill(); a += v;
      });
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0f172a"; ctx.font = "600 14px system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(total, cx, cy);
    }
    let raf; const step = (ts) => { if (!start) start = ts; const t = Math.min(1, (ts - start) / 800); draw(t); if (t < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [JSON.stringify(counts)]);
  return <canvas ref={ref} width={110} height={110} className="transition-transform duration-300 group-hover:scale-105" />;
}
function Spark({ points }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const W = 220, H = 70, m = 6, max = Math.max(...points, 1);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.beginPath();
    points.forEach((v, i) => {
      const x = m + i * ((W - 2 * m) / (points.length - 1));
      const y = H - m - (v / max) * (H - 2 * m);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke(); ctx.fillStyle = "#c7d2fe";
    points.forEach((v, i) => { const x = m + i * ((W - 2 * m) / (points.length - 1));
      const y = H - m - (v / max) * (H - 2 * m); ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); });
  }, [JSON.stringify(points)]);
  return <canvas ref={ref} width={220} height={70} className="group-hover:opacity-90 transition-opacity duration-300" />;
}

/* ======= Form bits ======= */
function Input({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-300 focus:outline-none"
      />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-300 focus:outline-none"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/* ======= KPI tile ======= */
const Tile = ({ label, val }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50">
    <div className="text-sm text-slate-500 group-hover:text-indigo-700 transition">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-slate-900">{val}</div>
    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className="h-1.5 w-1/3 rounded-full bg-slate-800/80 transition-[width] duration-500 group-hover:bg-indigo-600" />
    </div>
  </div>
);

/* ======= CSV ======= */
function exportCSV(rows) {
  const cols = ["id","model","year","plate","vin","owner","branch","wExp","iExp","lastSrv"];
  const csv = [cols.join(","), ...rows.map(r => cols.map(k => `"${String(r[k] ?? "").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = "cars.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* ======= Main Component ======= */
export default function Cars() {
  const [cars, setCars] = useState(seed);
  const [q, setQ] = useState(""); const [b, setB] = useState("ALL");
  const [sort, setSort] = useState("recent"); const [exp, setExp] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [editId, setEditId] = useState(null); // null = adding, id = editing
  const [form, setForm] = useState({ model:"", year:"", plate:"", vin:"", owner:"", phone:"", branch:"DXB", clr:"Grey", img:"", wExp:"", iExp:"", lastSrv:"" });

  const list = useMemo(() => {
    let L = [...cars]; const n = q.toLowerCase();
    if (q) L = L.filter(v => [v.plate,v.vin,v.model,v.owner].join(" ").toLowerCase().includes(n));
    if (b !== "ALL") L = L.filter(v => v.branch === b);
    if (exp) L = L.filter(v => dLeft(v.wExp) <= 45 || dLeft(v.iExp) <= 45);
    L.sort((a,c) => (sort === "model" ? a.model.localeCompare(c.model) : dLeft(a.iExp) - dLeft(c.iExp)));
    return L;
  }, [cars, q, b, sort, exp]);

  const kpi = {
    total: cars.length,
    wSoon: cars.filter(v => dLeft(v.wExp) <= 30).length,
    iSoon: cars.filter(v => dLeft(v.iExp) <= 30).length,
    serviced30: cars.filter(v => dSince(v.lastSrv) <= 30).length,
  };
  const branchCounts = cars.reduce((a,v)=>(a[v.branch]=(a[v.branch]||0)+1,a),{});
  const trend = Array.from({length:8},(_,i)=>cars.filter(v=>dLeft(v.iExp)<=i*15+15 && dLeft(v.iExp)>i*15).length);

  function startAdd() {
    setEditId(null);
    setForm({ model:"", year:"", plate:"", vin:"", owner:"", phone:"", branch:b==="ALL"?"DXB":b, clr:"Grey", img:"", wExp:"", iExp:"", lastSrv:"" });
    setOpenAdd(true);
  }
  function startEdit(car){
    setEditId(car.id);
    setForm({ ...car });
    setOpenAdd(true);
  }
  function handleDelete(id){
    if (window.confirm("Delete this car?")) {
      setCars(p => p.filter(x => x.id !== id));
    }
  }

  function handleSave(e){
    e?.preventDefault();
    if(!(form.model&&form.year&&form.plate&&form.vin&&form.owner&&form.branch)) return alert("Please fill required fields.");
    if (editId){
      setCars(p => p.map(x => x.id===editId ? { ...x, ...form, year:Number(form.year)||x.year } : x));
    } else {
      const row = {
        id:`c${Date.now()}`, img: form.img || seed[0].img, clr: form.clr || "Grey",
        model:form.model, year:Number(form.year)||new Date().getFullYear(),
        plate:form.plate, vin:form.vin, owner:form.owner, phone:form.phone||"",
        branch:form.branch, wExp:form.wExp||"", iExp:form.iExp||"", lastSrv:form.lastSrv||""
      };
      setCars(p=>[row,...p]);
    }
    setOpenAdd(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 overflow-x-hidden">
      {/* Toolbar */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-11">
        <div className="sm:col-span-3 flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition hover:shadow-md overflow-hidden">
       
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search VIN, plate, model, owner…" className="w-full py-2 text-sm outline-none" />
        </div>
        <select value={b} onChange={(e)=>setB(e.target.value)} className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow-md">
          {BR.map(x => <option key={x.id} value={x.id}>{x.n}</option>)}
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow-md">
          <option value="recent">Recent</option><option value="model">Model A–Z</option>
        </select>
        <label className="sm:col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow-md">
          <input type="checkbox" checked={exp} onChange={(e)=>setExp(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          Expiring ≤45d
        </label>
        <div className="sm:col-span-2 flex gap-2">
          <button onClick={startAdd} className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">Add Cart</button>
          <button onClick={()=>exportCSV(list)} className="hidden sm:block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">Export</button>
        </div>
      </div>

      {/* KPIs + Charts */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Total Cars" val={kpi.total} />
        <Tile label="Warranty ≤30d" val={kpi.wSoon} />
        <Tile label="Insurance ≤30d" val={kpi.iSoon} />
        <Tile label="Serviced (30d)" val={kpi.serviced30} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:bg-indigo-50 hover:border-indigo-200 overflow-hidden">
          <div>
            <div className="text-sm text-slate-500 group-hover:text-indigo-700 transition">Cars by Branch</div>
            <div className="mt-1 text-slate-900">Distribution</div>
          </div>
          <Pie counts={branchCounts} />
        </div>
        <div className="group md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:bg-indigo-50 hover:border-indigo-200 overflow-hidden">
          <div>
            <div className="text-sm text-slate-500 group-hover:text-indigo-700 transition">Insurance Expiry Trend</div>
            <div className="mt-1 text-slate-900">Next 4 months</div>
          </div>
          <Spark points={trend} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c,i)=>{
          const w=dLeft(c.wExp), ins=dLeft(c.iExp), since=dSince(c.lastSrv), sincePct=Math.min(1,since/180);
          return (
            <div key={c.id} style={{animationDelay:`${i*30}ms`}}
              className="animate-card group rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition">{c.clr}</span>
                <div className="flex items-center gap-2">
                  <Ring percent={sincePct} />
                  <span className="text-xs text-slate-500 group-hover:text-indigo-700 transition">Since svc {since}d</span>
                </div>
              </div>
              <div className="mt-2 overflow-hidden rounded-2xl">
                <img src={c.img} alt="" className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:opacity-95 will-change-transform" />
              </div>
              <div className="mt-3 text-lg font-semibold text-slate-900">{c.model} {c.year}</div>
              <div className="truncate text-slate-600">{c.plate}</div>
              <div className="text-sm text-slate-500">Owner: {c.owner} • {bName(c.branch)}</div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone={tone(w)}>Warranty {Math.max(w,0)}d</Chip>
                <Chip tone={tone(ins)}>Insurance {Math.max(ins,0)}d</Chip>
              </div>

              {/* Actions: Edit / Delete */}
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  aria-label="Edit"
                  onClick={()=>startEdit(c)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
                  title="Edit"
                >
                  {/* pencil icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.04a1.004 1.004 0 0 0 0-1.42l-2.5-2.5a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z"/></svg>
                </button>
                <button
                  aria-label="Delete"
                  onClick={()=>handleDelete(c.id)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-700"
                  title="Delete"
                >
                  {/* trash icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7zm3-4h6l1 1h4v2H4V4h4l1-1z"/></svg>
                </button>
              </div>
            </div>
          );
        })}
        {list.length===0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No cars match your filters.</div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {openAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-3" onClick={()=>setOpenAdd(false)}>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl transition sm:animate-[a_.25s_ease-out]" onClick={(e)=>e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{editId ? "Edit Car" : "Add Car"}</h3>
              <button onClick={()=>setOpenAdd(false)} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">✕</button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Model*" value={form.model} onChange={(v)=>setForm(p=>({...p,model:v}))}/>
              <Input label="Year*" type="number" value={form.year} onChange={(v)=>setForm(p=>({...p,year:v}))}/>
              <Input label="Plate*" value={form.plate} onChange={(v)=>setForm(p=>({...p,plate:v}))}/>
              <Input label="VIN*" value={form.vin} onChange={(v)=>setForm(p=>({...p,vin:v}))}/>
              <Input label="Owner*" value={form.owner} onChange={(v)=>setForm(p=>({...p,owner:v}))}/>
              <Input label="Phone" value={form.phone} onChange={(v)=>setForm(p=>({...p,phone:v}))}/>
              <Select label="Branch*" value={form.branch} onChange={(v)=>setForm(p=>({...p,branch:v}))}
                options={BR.filter(x=>x.id!=="ALL").map(x=>({value:x.id,label:x.n}))}/>
              <Input label="Color" value={form.clr} onChange={(v)=>setForm(p=>({...p,clr:v}))}/>
              <Input label="Image URL" value={form.img} onChange={(v)=>setForm(p=>({...p,img:v}))}/>
              <Input label="Warranty Expiry" type="date" value={form.wExp} onChange={(v)=>setForm(p=>({...p,wExp:v}))}/>
              <Input label="Insurance Expiry" type="date" value={form.iExp} onChange={(v)=>setForm(p=>({...p,iExp:v}))}/>
              <Input label="Last Service" type="date" value={form.lastSrv} onChange={(v)=>setForm(p=>({...p,lastSrv:v}))}/>
              <div className="sm:col-span-2 mt-1 flex justify-end gap-2">
                <button type="button" onClick={()=>setOpenAdd(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:border-slate-300">Cancel</button>
                <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes a{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
        .animate-card{animation:a .35s ease-out both}
      `}</style>
    </div>
  );
}