import React, { useMemo, useState } from "react";

/* THEME + MINI UTILS */
const BRAND = "#1C0B7E";
const BRAND_GRADIENT = "linear-gradient(135deg, #1C0B7E 0%, #2D1BA3 100%)";
const Icon = ({ d, cls = "w-5 h-5" }) => <svg viewBox="0 0 24 24" className={`${cls} fill-current`}><path d={d}/></svg>;
const uid = () => (Math.random().toString(36).slice(2, 7)).toUpperCase();
const jc = () => `JC-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${uid()}`;
const CHECKS = {
  "Oil Change": ["Drain oil", "Replace filter", "Refill oil", "Reset indicator"],
  "General Service": ["Inspect brakes", "Top-up fluids", "Battery test", "Road test"],
  "AC Service": ["Check leaks", "Replace cabin filter", "Refill gas", "Pressure test"]
};

/* PRIMITIVES */
const Card = ({ title, right, children, className = "" }) => (
  <section className={`rounded-3xl border border-gray-200 bg-white/90 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
    <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {right}
    </header>
    <div className="p-5">{children}</div>
  </section>
);

const Modal = ({ open, title, onClose, onSave, children }) => !open ? null : (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
    <div className="relative w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[pop_.22s_ease-out]">
      <style>{`@keyframes pop{from{opacity:.4;transform:translateY(8px) scale(.98)}to{opacity:1}}`}</style>
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">✕</button>
      </div>
      <div className="p-5">{children}</div>
      <div className="px-5 pb-5 flex gap-3 justify-end">
        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium" onClick={onClose}>Cancel</button>
        {onSave && <button className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition-all font-medium" style={{background: BRAND_GRADIENT}} onClick={onSave}>Save</button>}
      </div>
    </div>
  </div>
);

const Toast = ({ msg, onHide }) => msg ? (
  <div className="fixed bottom-6 right-6 z-50 translate-y-2 opacity-0 animate-[toast_.25s_ease-out_forwards]">
    <style>{`@keyframes toast{to{transform:none;opacity:1}}`}</style>
    <div className="rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg font-medium">{msg}</div>
    {setTimeout(onHide, 1500) && null}
  </div>
) : null;

/* APP */
export default function ServicesElite() {
  const [branch] = useState("Downtown Service Center");
  const [toast, setToast] = useState("");
  /* Appointments + filters */
  const [appts, setAppts] = useState([{id: uid(), customer: "Omar F.", type: "Oil Change", advisor: "Sara", when: "2025-09-22 10:00", branch}]);
  const [q, setQ] = useState(""); const [fType, setFType] = useState("All"); const [fAdv, setFAdv] = useState("All");
  const types = ["Oil Change", "General Service", "AC Service"]; const advisors = ["Sara", "Ahmed", "Lina"];
  const filtered = appts.filter(a => (!q || a.customer.toLowerCase().includes(q.toLowerCase())) && (fType === "All" || a.type === fType) && (fAdv === "All" || a.advisor === fAdv));
  /* Jobs + card */
  const [jobs, setJobs] = useState([{id: uid(), car: "Civic 2021", type: "General Service", status: "Scheduled"}]);
  const cols = useMemo(() => ["Scheduled", "In Progress", "Completed", "Closed"], []);
  const [card, setCard] = useState({open: false, job: null, checks: [], num: ""});
  /* Modal for appt */
  const [mod, setMod] = useState({open: false, mode: "new", data: {customer: "", type: "Oil Change", advisor: "", when: ""}});

  /* ACTIONS */
  const openAppt = (m, d) => setMod({open: true, mode: m, data: d || {customer: "", type: "Oil Change", advisor: "", when: ""}});
  const saveAppt = () => {const d = {...mod.data, branch}; setAppts(a => mod.mode === "new" ? [...a, {...d, id: uid()}] : a.map(x => x.id === d.id ? d : x)); setToast(mod.mode === "new" ? "Appointment booked" : "Appointment updated"); setMod({open: false, mode: "new", data: {}});}
  const cancelAppt = id => {setAppts(a => a.filter(x => x.id !== id)); setToast("Appointment cancelled");};
  const createJobFrom = a => {setJobs(j => [...j, {id: uid(), car: `${a.customer} • ${a.type}`, type: a.type, status: "Scheduled"}]); setToast("Job created");};
  const move = (id, dir) => setJobs(l => l.map(j => j.id !== id ? j : {...j, status: cols[Math.min(Math.max(cols.indexOf(j.status) + dir, 0), 3)]}));
  const openCard = j => setCard({open: true, job: j, checks: (CHECKS[j.type] || []).map(t => ({t, done: false})), num: jc()});
  const toggleChk = i => setCard(c => ({...c, checks: c.checks.map((x, ix) => ix === i ? {...x, done: !x.done} : x)}));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 px-4 lg:px-8 py-3 text-white flex items-center justify-between shadow-md" style={{background: BRAND_GRADIENT}}>
        <div className="flex items-center gap-3">
          <Icon d="M3 6h18M3 12h18M3 18h18" cls="w-5 h-5 opacity-90"/>
          <span className="font-bold tracking-wide text-lg">Services Dashboard</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden sm:flex items-center bg-white/20 rounded-lg px-3 py-1">
            <Icon d="M10 18l6-6-6-6" cls="w-4 h-4 opacity-90"/>
            <input placeholder="Search appointments…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent placeholder-white/80 text-white px-2 py-1 outline-none w-40"/>
          </div>
          <span className="bg-white/15 py-1 px-3 rounded-full">Branch: <b>{branch}</b></span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Appointments */}
        <Card 
          title="Appointments" 
          right={
            <button 
              onClick={() => openAppt("new")} 
              className="px-4 py-2 rounded-lg text-white hover:opacity-90 active:scale-95 transition-all shadow-sm hover:shadow font-medium" 
              style={{background: BRAND_GRADIENT}}
            >
              New Appointment
            </button>
          }
        >
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <select value={fType} onChange={e => setFType(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 hover:border-[#1C0B7E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30">
              <option>All Types</option>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={fAdv} onChange={e => setFAdv(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 hover:border-[#1C0B7E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30">
              <option>All Advisors</option>
              {advisors.map(a => <option key={a}>{a}</option>)}
            </select>
            <span className="ml-auto text-xs text-gray-500 bg-gray-100 py-1 px-3 rounded-full">Showing {filtered.length} of {appts.length}</span>
          </div>
          {filtered.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(a => (
                <div key={a.id} className="rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white">
                  <div className="font-medium text-gray-800">{a.customer}</div>
                  <div className="text-sm text-gray-600 mt-1">{a.type}</div>
                  <div className="text-xs text-gray-500 mt-2">{a.when} • Advisor: {a.advisor}</div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openAppt("edit", a)} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#1C0B7E] hover:text-[#1C0B7E] transition-colors text-xs font-medium">Modify</button>
                    <button onClick={() => cancelAppt(a.id)} className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-red-50 text-red-600 transition-colors text-xs font-medium">Cancel</button>
                    <button onClick={() => createJobFrom(a)} className="ml-auto px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-all text-xs font-medium" style={{background: BRAND}}>Create Job</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-xl text-center">No appointments match your filters</div>}
        </Card>

        {/* Jobs Workflow */}
        <Card title="Jobs Workflow">
          <div className="grid md:grid-cols-4 gap-5">
            {cols.map(col => (
              <div key={col} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="px-4 py-3 text-sm font-semibold flex items-center justify-between text-white" style={{background: BRAND_GRADIENT}}>
                  {col}
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20">{jobs.filter(j => j.status === col).length}</span>
                </div>
                <div className="p-3 space-y-3">
                  {jobs.filter(j => j.status === col).map(j => (
                    <div key={j.id} onDoubleClick={() => move(j.id, 1)} className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                      <div className="font-medium text-gray-800">{j.car}</div>
                      <div className="text-xs text-gray-500 mt-1">{j.type}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => move(j.id, -1)} className="px-2 py-1.5 rounded-lg border border-gray-300 hover:border-[#1C0B7E] hover:text-[#1C0B7E] transition-colors text-xs">←</button>
                        <button onClick={() => move(j.id, 1)} className="px-2 py-1.5 rounded-lg border border-gray-300 hover:border-[#1C0B7E] hover:text-[#1C0B7E] transition-colors text-xs">→</button>
                        <button onClick={() => openCard(j)} className="ml-auto px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-all text-xs font-medium" style={{background: BRAND}}>Job Card</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Appointment Modal */}
      <Modal open={mod.open} title={`${mod.mode === "new" ? "New" : "Modify"} Appointment`} onClose={() => setMod({open: false, mode: "new", data: {}})} onSave={saveAppt}>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["Customer", "customer"], ["Service Type", "type"], ["Advisor", "advisor"], ["Date/Time", "when"]
          ].map(([l, k]) => (
            <label key={k} className="text-sm">
              <span className="block text-gray-600 mb-2 font-medium">{l}</span>
              <input 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30 transition-colors" 
                value={mod.data[k] || ""}
                onChange={e => setMod(m => ({...m, data: {...m.data, [k]: e.target.value, branch}}))}
              />
            </label>
          ))}
          <label className="text-sm sm:col-span-2">
            <span className="block text-gray-600 mb-2 font-medium">Branch</span>
            <input value={branch} readOnly className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-600"/>
          </label>
        </div>
      </Modal>

      {/* Job Card Modal */}
      <Modal open={card.open} title={`Job Card • ${card.num || jc()}`} onClose={() => setCard({open: false})} onSave={() => window.print()}>
        {card.job && (
          <div>
            <div className="text-sm mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <div><b>Unit:</b> {card.job.car}</div>
                <div><b>Service:</b> {card.job.type}</div>
                <div className="col-span-2"><b>Branch:</b> {branch}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 font-medium text-white" style={{background: BRAND_GRADIENT}}>Checklist</div>
              <ul className="p-4 space-y-3">
                {(card.checks.length ? card.checks : (CHECKS[card.job.type] || []).map(t => ({t, done: false}))).map((c, i) => (
                  <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={c.done} 
                      onChange={() => toggleChk(i)} 
                      className="h-5 w-5 accent-[#1C0B7E] cursor-pointer"
                    />
                    <span className={`text-sm ${c.done ? "line-through text-gray-500" : "text-gray-800"}`}>{c.t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-gray-500 mt-4 bg-yellow-50 p-3 rounded-lg">
              Press <b>Save</b> to open print dialog → Select "Save as PDF".
            </p>
          </div>
        )}
      </Modal>

      <Toast msg={toast} onHide={() => setToast("")}/>
    </div>
  );
}