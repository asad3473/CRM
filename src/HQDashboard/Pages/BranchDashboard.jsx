import React, { useMemo, useState } from "react";

/* theme */
const BRAND = "#1C0B7E";
const BRAND_GRADIENT = "linear-gradient(135deg, #1C0B7E 0%, #2D1BA3 100%)";
const Icon = ({ d, cls = "w-5 h-5" }) => <svg viewBox="0 0 24 24" className={`${cls} fill-current`}><path d={d}/></svg>;
const Card = ({ className="", children }) => <div className={`rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}>{children}</div>;

/* tiny components */
const Toast = ({ msg, onHide }) => msg ? (
  <div className="fixed bottom-6 right-6 z-50 translate-y-2 opacity-0 animate-[toast_.25s_ease-out_forwards]">
    <style>{`@keyframes toast{to{transform:none;opacity:1}}`}</style>
    <div className="rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg font-medium">{msg}</div>
    {setTimeout(onHide, 1600) && null}
  </div>
) : null;

const Modal = ({ open, title, onClose, onSave, children }) => !open ? null : (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
    <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[pop_.2s_ease-out]">
      <style>{`@keyframes pop{from{opacity:.4;transform:translateY(8px) scale(.98)}to{opacity:1}}`}</style>
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">✕</button>
      </div>
      <div className="p-5">{children}</div>
      <div className="px-5 pb-5 flex gap-3 justify-end">
        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition-all font-medium" style={{background: BRAND_GRADIENT}} onClick={onSave}>Save</button>
      </div>
    </div>
  </div>
);

/* charts (no libs) */
const Line = ({ a, b, labels }) => {
  const W=360,H=120,p=10,max=Math.max(...a,...b,1);
  const x=i=>p+(i*(W-2*p))/(labels.length-1), y=v=>H-p-(v/max)*(H-2*p);
  const P=arr=>arr.map((v,i)=>`${i?"L":"M"}${x(i)},${y(v)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1C0B7E" />
          <stop offset="100%" stopColor="#2D1BA3" />
        </linearGradient>
        <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9AA3B2" />
          <stop offset="100%" stopColor="#C1C6D0" />
        </linearGradient>
      </defs>
      <path d={P(b)} stroke="url(#grayGradient)" strokeWidth="2" fill="none" className="animate-[draw_1s_ease-out]" />
      <path d={P(a)} stroke="url(#brandGradient)" strokeWidth="3" fill="none" className="animate-[draw_1s_ease-out]" />
      <style>{`@keyframes draw{from{stroke-dasharray:0 500}to{stroke-dasharray:500 0}}`}</style>
    </svg>
  );
};
const Stacked = ({ parts }) => {
  const total = Object.values(parts).reduce((a,b)=>a+b,0)||1;
  const C={scheduled:"#c7c9ff", inprog:BRAND, completed:"#7a6bf3", closed:"#4d3dcf"};
  return (
    <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden flex shadow-inner">
      {Object.entries(parts).map(([k,v])=>(
        <div key={k} title={`${k}: ${v}`} style={{width:`${(v/total)*100}%`,background:C[k]}} className="transition-[width] duration-500 hover:opacity-90" />
      ))}
    </div>
  );
};

/* app */
export default function BranchDashboardPlus() {
  const [toast,setToast]=useState("");
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({ customer:"", car:"", when:"" });
  const [data,setData]=useState({
    kpis:{ appt:8, inProg:12, done:6, csat:4.6 },
    last7:{ labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], appts:[6,8,7,9,10,5,8], done:[3,4,4,6,7,5,6] },
    pipe:{ scheduled:7, inprog:12, completed:18, closed:9 },
    alerts:{ low:["O. Farouk (2★)","M. Ali (3★)"], exp:["Warranty • Civic 2021 (12d)","Insurance • Camry 2020 (28d)"] }
  });

  const saveAppointment=()=>{
    setData(d=>{
      const nd={...d};
      nd.kpis.appt+=1;
      nd.last7.appts=[...nd.last7.appts.slice(1), (nd.last7.appts.at(-1)||0)+1]; // push today
      nd.pipe.scheduled+=1;
      return nd;
    });
    setToast(`Appointment created for ${form.customer || "customer"}`);
    setOpen(false); setForm({customer:"",car:"",when:""});
  };

  const addCustomer=()=>setToast("Customer added");
  const startJobCard=()=>setData(d=>({ ...d, pipe:{...d.pipe, inprog:d.pipe.inprog+1} }));

  const KPIs = useMemo(()=>[
    { t:"Appointments Today", v:data.kpis.appt, ic:"M7 2v2H5a2 2 0 0 0-2 2v3h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2Z", trend: "+2.5%" },
    { t:"Jobs In Progress", v:data.kpis.inProg, ic:"M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z", trend: "+8.3%" },
    { t:"Completed Today", v:data.kpis.done, ic:"M9 12l2 2 5-5 2 2-7 7-4-4 2-2", trend: "-4.2%" },
    { t:"Avg Rating (CSAT)", v:`${data.kpis.csat}★`, ic:"M12 17.3 6.2 21l1.6-6.9L2 9h7l3-6 3 6h7l-5.8 5.1L17.8 21Z", trend: "+0.3" },
  ],[data]);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100">
      {/* top bar */}
      <div className="sticky top-0 z-30 shadow-md" style={{background: BRAND_GRADIENT}}>
        <header className="px-4 lg:px-8 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Icon d="M3 6h18M3 12h18M3 18h18" cls="w-5 h-5 opacity-90" />
            <span className="font-bold tracking-wide text-lg">Branch Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-white/20 rounded-lg px-3 py-1">
              <Icon d="M10 18l6-6-6-6" cls="w-4 h-4 opacity-90" />
              <input placeholder="Search…" className="bg-transparent placeholder-white/80 text-white px-2 py-1 outline-none w-32" />
            </div>
            <button className="p-2 bg-white/15 rounded-full hover:bg-white/25 transition"><Icon d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-6a8 8 0 0 0-8 8h2a6 6 0 0 1 12 0h2a8 8 0 0 0-8-8Z" /></button>
            <img alt="avatar" src="https://i.pravatar.cc/40?img=32" className="w-8 h-8 rounded-full ring-2 ring-white/50"/>
          </div>
        </header>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {KPIs.map(k=>(
            <Card key={k.t} className="p-5 group hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl shadow-sm" style={{background:`${BRAND}15`, color:BRAND}}><Icon d={k.ic}/></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-medium">{k.t}</div>
                  <div className="text-2xl font-bold mt-1 text-gray-800">{k.v}</div>
                  <div className="text-xs mt-1 font-medium text-green-600">{k.trend}</div>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <span className="block h-full w-1/3 bg-[#1C0B7E] rounded-full transition-all duration-500 group-hover:w-2/3" style={{background: BRAND_GRADIENT}}/>
              </div>
            </Card>
          ))}
        </div>

        {/* chart + pipeline */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-lg text-gray-800">Last 7 Days</h2>
              <div className="text-xs text-gray-600 flex gap-4">
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{background:BRAND}}/>Appointments</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400"/>Completed</span>
              </div>
            </div>
            <div className="p-5">
              <Line a={data.last7.appts} b={data.last7.done} labels={data.last7.labels}/>
              <div className="mt-3 text-xs text-gray-500 flex justify-between px-2">
                {data.last7.labels.map(l=><span key={l} className="font-medium">{l}</span>)}
              </div>
            </div>
          </Card>
          <Card>
            <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-lg text-gray-800">Service Pipeline</h2></div>
            <div className="p-5 space-y-4">
              <Stacked parts={data.pipe}/>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(data.pipe).map(([k,v])=>(
                  <div key={k} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className={`w-3 h-3 rounded-full ${k==="inprog"?"bg-[#1C0B7E]":k==="completed"?"bg-[#7a6bf3]":k==="closed"?"bg-[#4d3dcf]":"bg-[#c7c9ff]"}`}/>
                    <span className="capitalize font-medium text-gray-700">{k}</span>
                    <b className="ml-auto text-gray-900">{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* actions + alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-lg text-gray-800">Quick Actions</h2>
              <button onClick={()=>setOpen(true)} className="px-4 py-2 rounded-lg text-white hover:opacity-90 active:scale-[.98] transition-all shadow-sm hover:shadow font-medium" style={{background: BRAND_GRADIENT}}>New Appointment</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <button onClick={addCustomer} className="rounded-2xl border border-gray-200 p-5 relative overflow-hidden hover:shadow-lg active:scale-[.98] transition-all duration-300 group text-left bg-gradient-to-b from-white to-gray-50 hover:to-[#1C0B7E]">
                <span className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-[#1C0B7E]/10 group-hover:scale-150 transition-transform duration-500"/>
                <div className="font-semibold text-gray-800 group-hover:text-white transition-colors">Add Customer</div>
                <span className="mt-3 inline-block text-xs px-3 py-1 rounded-full bg-gray-100 group-hover:bg-white/20 group-hover:text-white transition-all">+ Start</span>
              </button>
              <button onClick={startJobCard} className="rounded-2xl border border-gray-200 p-5 relative overflow-hidden hover:shadow-lg active:scale-[.98] transition-all duration-300 group text-left bg-gradient-to-b from-white to-gray-50 hover:to-[#1C0B7E]">
                <span className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-[#1C0B7E]/10 group-hover:scale-150 transition-transform duration-500"/>
                <div className="font-semibold text-gray-800 group-hover:text-white transition-colors">Create Job Card</div>
                <span className="mt-3 inline-block text-xs px-3 py-1 rounded-full bg-gray-100 group-hover:bg-white/20 group-hover:text-white transition-all">+ Start</span>
              </button>
            </div>
          </Card>
          <Card>
            <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-lg text-gray-800">Alerts</h2></div>
            <div className="p-5 space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">!</span>
                <div>Low Ratings (≤3★): {data.alerts.low.length} — {data.alerts.low.join(", ")}</div>
              </div>
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">!</span>
                <div>Warranty/Insurance ≤30d: {data.alerts.exp.length} — {data.alerts.exp.join(", ")}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* new appointment modal */}
      <Modal open={open} title="New Appointment" onClose={()=>setOpen(false)} onSave={saveAppointment}>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Customer","Car","Date/Time"].map((f,i)=>(
            <label key={f} className="text-sm">
              <span className="block text-gray-600 mb-2 font-medium">{f}</span>
              <input value={Object.values(form)[i]} onChange={e=>setForm(o=>({ ...o, [Object.keys(o)[i]]:e.target.value }))}
                     className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30 transition-colors"/>
            </label>
          ))}
          <label className="text-sm sm:col-span-2">
            <span className="block text-gray-600 mb-2 font-medium">Branch</span>
            <input value="Locked to current branch" readOnly className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-600"/>
          </label>
        </div>
      </Modal>

      <Toast msg={toast} onHide={()=>setToast("")}/>
    </div>
  );
}