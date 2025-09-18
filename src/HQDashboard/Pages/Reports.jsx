// File: ReportsExportsAligned.jsx
import React, { useMemo, useState } from "react";

const BRAND = "#1C0B7E";
const GRAD = "linear-gradient(135deg,#1C0B7E 0%,#2D1BA3 100%)";
// kept for compatibility; header no longer uses an image
const HERO_IMG = "/reports-hero.png";

const Card = ({ title, right, children, className = "" }) => (
  <section className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}>
    <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
      <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
      {right}
    </header>
    <div className="p-6">{children}</div>
  </section>
);

const Toast = ({ msg, onHide }) => {
  React.useEffect(() => {
    if (msg) {
      const t = setTimeout(onHide, 1400);
      return () => clearTimeout(t);
    }
  }, [msg, onHide]);
  return msg ? (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg font-medium">{msg}</div>
    </div>
  ) : null;
};

const MOCK = {
  customers: [
    { id: 1, name: "Omar Farouk", phone: "+971501234567", created: "2025-05-02" },
    { id: 2, name: "Huda Z.", phone: "+971558882221", created: "2025-06-10" },
    { id: 3, name: "Ahmed M.", phone: "+971501112223", created: "2025-06-15" },
    { id: 4, name: "Lina K.", phone: "+971502223334", created: "2025-06-20" }
  ],
  services: [
    { id: 101, car: "Civic 2021", type: "Oil Change", revenue: 120, date: "2025-06-12" },
    { id: 102, car: "Camry 2020", type: "General Service", revenue: 340, date: "2025-06-18" },
    { id: 103, car: "Accord 2022", type: "AC Service", revenue: 220, date: "2025-06-22" },
    { id: 104, car: "Corolla 2019", type: "Brake Service", revenue: 180, date: "2025-06-25" }
  ],
  feedback: [
    { id: "f1", name: "Omar", stars: 2, date: "2025-06-12", comment: "Oil leak after service" },
    { id: "f2", name: "Kareem", stars: 5, date: "2025-06-20", comment: "Great service! Very professional" },
    { id: "f3", name: "Amna", stars: 4, date: "2025-06-22", comment: "Quick and efficient service" },
    { id: "f4", name: "Sarah", stars: 3, date: "2025-06-25", comment: "Good but a bit delayed" }
  ]
};

const inRange = (d, f, t) => (!f || d >= f) && (!t || d <= t);
const csv = rows => rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
const dl = (name, mime, content) => {
  const b = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
};
const printHTML = (title, html) => {
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>${title}</title><style>
    body{font-family:ui-sans-serif,system-ui;margin:24px;color:#333}
    h1{color:${BRAND};margin-bottom:8px}
    .meta{margin-bottom:16px;color:#666;font-size:14px}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th{background:#f8f9fa;text-align:left;padding:10px;border:1px solid #ddd}
    td{padding:10px;border:1px solid #ddd;font-size:13px}
    .f{margin-top:20px;font-size:12px;color:#666;text-align:right}
  </style></head><body>${html}</body></html>`);
  w.document.close();
  w.print();
};

export default function ReportsExportsAligned() {
  const [branch] = useState("Downtown Service Center");
  const [from, setFrom] = useState("2025-06-01");
  const [to, setTo] = useState("2025-06-30");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(null);
  const [heroOk, setHeroOk] = useState(true); // kept for compatibility

  const setDate = (k, v) => {
    if (k === "from") { if (to && v > to) setTo(v); setFrom(v); }
    else { if (from && v < from) setFrom(v); setTo(v); }
  };

  const data = useMemo(() => ({
    customers: MOCK.customers.filter(c => inRange(c.created, from, to)),
    services: MOCK.services.filter(s => inRange(s.date, from, to)),
    feedback: MOCK.feedback.filter(f => inRange(f.date, from, to))
  }), [from, to]);

  const build = t => {
    switch (t) {
      case "Branch Performance": {
        const rev = data.services.reduce((a, b) => a + b.revenue, 0);
        const cnt = data.services.length;
        const csat = data.feedback.length ? (data.feedback.reduce((a, b) => a + b.stars, 0) / data.feedback.length).toFixed(1) : "—";
        return { rows: [
          { Metric: "Services Count", Value: cnt },
          { Metric: "Revenue", Value: `$${rev}` },
          { Metric: "Avg Rating (CSAT)", Value: csat },
          { Metric: "New Customers", Value: data.customers.length }
        ]};
      }
      case "Feedback Summary":  return { rows: data.feedback.map(f => ({ Date: f.date, Customer: f.name, Stars: f.stars, Comment: f.comment })) };
      case "Customer List":     return { rows: data.customers.map(c => ({ ID: c.id, Name: c.name, Phone: c.phone, Created: c.created })) };
      case "Service Summary":   return { rows: data.services.map(s => ({ ID: s.id, Car: s.car, Type: s.type, Revenue: `$${s.revenue}`, Date: s.date })) };
      default: return { rows: [] };
    }
  };

  const toCSV = t => {
    setBusy(t);
    setTimeout(() => {
      const { rows } = build(t);
      if (!rows.length) { setToast("Nothing to export"); return setBusy(null); }
      dl(`${t.replace(/\s+/g, "_")}_${from || "all"}_to_${to || "all"}.csv`, "text/csv;charset=utf-8", [Object.keys(rows[0]).join(","), csv(rows)].join("\n"));
      setToast("Excel (CSV) exported");
      setBusy(null);
    }, 500);
  };

  const toPDF = t => {
    setBusy(t);
    setTimeout(() => {
      const { rows } = build(t);
      if (!rows.length) { setToast("Nothing to export"); return setBusy(null); }
      const head = `<h1>${t}</h1><div class="meta">
        <p><b>Branch:</b> ${branch}</p>
        <p><b>Date Range:</b> ${from || "All time"} → ${to || "All time"}</p>
        <p><b>Generated:</b> ${new Date().toLocaleDateString()}</p>
      </div>`;
      const table = `<table><thead><tr>${Object.keys(rows[0]).map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(r => `<tr>${Object.values(r).map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>
        <div class="f">Generated by Automotive CRM</div>`;
      printHTML(t, head + table);
      setToast("PDF generated");
      setBusy(null);
    }, 500);
  };

  const tiles = [
    { k: "Branch Performance", d: "Revenue, services, CSAT", emo: "💼", bg: "from-blue-500/10 to-blue-600/10", badge: data.services.length },
    { k: "Feedback Summary",   d: "Ratings + comments",      emo: "📝", bg: "from-green-500/10 to-green-600/10", badge: data.feedback.length },
    { k: "Customer List",      d: "All customers in range",  emo: "👥", bg: "from-purple-500/10 to-purple-600/10", badge: data.customers.length },
    { k: "Service Summary",    d: "Jobs & revenue",          emo: "🛠️", bg: "from-amber-500/10 to-amber-600/10", badge: data.services.length }
  ];

  const rev = data.services.reduce((a, b) => a + b.revenue, 0);
  const cnt = data.services.length;
  const avg = data.feedback.length ? (data.feedback.reduce((a, b) => a + b.stars, 0) / data.feedback.length).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`.animate-fade-in-up{animation:fadeInUp .3s ease-out forwards}
      @keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .hover-lift:hover{transform:translateY(-2px);box-shadow:0 10px 25px -5px rgba(0,0,0,.1)}
      .pulse{animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}`}</style>

      {/* compact header chip with file name (no big background, no top space) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-indigo-100 shadow-md">
          <span className="text-base">📄</span>
          <span className="font-semibold text-indigo-700">ReportsExportsAligned.jsx</span>
        </span>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card title="Date Range" right={
            <div className="flex gap-2">
              <button
                onClick={() => ["Branch Performance","Feedback Summary","Customer List","Service Summary"].forEach(toPDF)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                style={{ background: GRAD }}
              >Export All PDF</button>
              <button
                onClick={() => ["Branch Performance","Feedback Summary","Customer List","Service Summary"].forEach(toCSV)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:border-[#1C0B7E] hover:text-[#1C0B7E] transition-all"
              >Export All Excel</button>
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input type="date" value={from} onChange={e => setDate("from", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1C0B7E]/30 focus:border-[#1C0B7E] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input type="date" value={to} onChange={e => setDate("to", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1C0B7E]/30 focus:border-[#1C0B7E] transition-all" />
              </div>
              <button onClick={() => { setFrom(""); setTo(""); }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:border-[#1C0B7E] hover:text-[#1C0B7E] transition-all">
                Clear Dates
              </button>
            </div>
          </Card>

          <Card title="One-Click Exports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tiles.map(t => (
                <div key={t.k} className={`rounded-xl border border-gray-200 p-5 relative overflow-hidden transition-all duration-300 hover-lift bg-gradient-to-br ${t.bg}`}>
                  <span className="absolute top-3 right-3 text-xs bg-white/80 border border-gray-200 rounded-full px-2 py-1 font-medium">{t.badge}</span>
                  <div className="text-3xl mb-3">{t.emo}</div>
                  <h3 className="font-semibold text-gray-800 text-base mb-1">{t.k}</h3>
                  <p className="text-xs text-gray-600">{t.d}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => toPDF(t.k)} disabled={busy === t.k}
                      className="flex-1 px-3 py-2 rounded-lg text-white text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
                      style={{ background: GRAD }}>
                      {busy === t.k ? <span className="pulse">Generating…</span> : "PDF"}
                    </button>
                    <button onClick={() => toCSV(t.k)} disabled={busy === t.k}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium hover:border-[#1C0B7E] hover:text-[#1C0B7E] transition-all disabled:opacity-50">
                      {busy === t.k ? <span className="pulse">Exporting…</span> : "Excel"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Services Preview">
              <div className="flex justify-between mb-3"><span className="text-sm text-gray-600">Services Count</span><b className="text-[#1C0B7E]">{cnt}</b></div>
              <div className="flex justify-between mb-4"><span className="text-sm text-gray-600">Total Revenue</span><b className="text-green-600">${rev}</b></div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#1C0B7E] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (cnt / 10) * 100)}%` }} />
              </div>
            </Card>

            <Card title="Feedback Preview">
              <div className="flex justify-between mb-3"><span className="text-sm text-gray-600">Survey Count</span><b className="text-[#1C0B7E]">{data.feedback.length}</b></div>
              <div className="flex justify-between mb-4"><span className="text-sm text-gray-600">Average Rating</span><b className="text-amber-600">{avg}★</b></div>
              <div className="space-y-2 max-h-32 overflow-auto pr-2">
                {data.feedback.slice(0, 3).map(f => (
                  <div key={f.id} className="text-xs p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{f.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${f.stars <= 2 ? "bg-red-100 text-red-700" : f.stars <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{f.stars}★</span>
                    </div>
                    <div className="text-gray-600 truncate">{f.comment}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Customers Preview">
              <div className="flex justify-between mb-3"><span className="text-sm text-gray-600">New Customers</span><b className="text-[#1C0B7E]">{data.customers.length}</b></div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {data.customers.slice(0, 4).map(c => (
                  <div key={c.id} className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-[#1C0B7E] rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto mb-1">{c.name.charAt(0)}</div>
                    <div className="text-xs font-medium truncate">{c.name.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Toast msg={toast} onHide={() => setToast("")} />
    </div>
  );
}
