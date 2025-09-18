import React, { useMemo, useState, useEffect } from "react";

const BRAND = "#1C0B7E";
const GRAD = "linear-gradient(135deg,#1C0B7E 0%,#2D1BA3 100%)";
const BASE = [
  { type:"Job",ref:"WO-101",name:"Omar Farouk",vin:"1HGCM82633A004352",plate:"D-12345",date:"2025-06-24",status:"In Progress",amount:"—",rating:"—" },
  { type:"Appointment",ref:"APT-889",name:"Huda Z.",vin:"5YJ3E1EA7KF317000",plate:"E-77821",date:new Date().toISOString().slice(0,10),status:"Scheduled",amount:"—",rating:"—" },
  { type:"Invoice",ref:"INV-5502",name:"Ahmed M.",vin:"JHMCM56557C404453",plate:"K-11223",date:"2025-06-22",status:"Unpaid",amount:"$340",rating:"—" },
  { type:"Job",ref:"WO-102",name:"Lina K.",vin:"WBA8E1G59GNU12345",plate:"M-99110",date:"2025-06-20",status:"Closed",amount:"$180",rating:"5" },
  { type:"Feedback",ref:"FB-77",name:"Sarah",vin:"—",plate:"A-22233",date:"2025-06-25",status:"—",amount:"—",rating:"2" }
];
const ALL = ["type","ref","name","vin","plate","date","status","amount","rating"];
const Icon = ({name}) => <span>{name==="pin"?"📌":name==="edit"?"✏️":name==="trash"?"🗑️":name==="csv"?"📤":name==="view"?"👁️":"🔄"}</span>;

export default function SearchSavedViewsPro(){
  const today=new Date().toISOString().slice(0,10);
  const last7=new Date(Date.now()-6*864e5).toISOString().slice(0,10);
  const [rows,setRows]=useState(BASE);
  const [q,setQ]=useState(""),[scope,setScope]=useState("All");
  const [from,setFrom]=useState(""),[to,setTo]=useState("");
  const [cols,setCols]=useState(["type","ref","name","date","status"]);
  const [views,setViews]=useState([
    {k:"Today's Appointments",q:"",scope:"Appointment",from:today,to:today,cols:["type","ref","name","date","status"],pin:true,selected:true},
    {k:"In-Progress Jobs",q:"",scope:"Job",from:"",to:"",cols:["type","ref","name","date","status"],extra:{status:"In Progress"}},
    {k:"Low Ratings (7d)",q:"",scope:"Feedback",from:last7,to:today,cols:["type","ref","name","date","rating"],extra:{ratingMax:3}}
  ]);
  const [recent,setRecent]=useState([]);
  const [toast,setToast]=useState(""); const [showToast,setShowToast]=useState(false);
  const [role, setRole] = useState("BranchManager");
  const [branch, setBranch] = useState("DXB-01");
  const [piiMask, setPiiMask] = useState(true);
  
  const flash=m=>{setToast(m);setShowToast(true);setTimeout(()=>setShowToast(false),2200);};
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setShowToast(false),2200);return()=>clearTimeout(t);},[toast]);

  const base=useMemo(()=>rows.filter(r=>{
    const t=(r.type+r.ref+r.name+r.vin+r.plate).toLowerCase();
    const mq=!q||t.includes(q.toLowerCase());
    const ms=scope==="All"||r.type.toLowerCase().includes(scope.toLowerCase());
    return mq&&ms&&((!from||r.date>=from)&&(!to||r.date<=to));
  }),[rows,q,scope,from,to]);

  const data=useMemo(()=>base.filter(r=>{
    const v=views.find(x=>x.selected);
    if(!v||!v.extra) return true;
    if(v.extra.status && r.status!==v.extra.status) return false;
    if(v.extra.ratingMax && Number(r.rating)>v.extra.ratingMax) return false;
    return true;
  }),[base,views]);

  const toggleCol=c=>setCols(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  const runSearch=val=>{setQ(val);setRecent(r=>[val,...r.filter(x=>x!==val)].slice(0,5));};
  const load=v=>{setViews(s=>s.map(x=>({...x,selected:x.k===v.k})));setQ(v.q);setScope(v.scope);setFrom(v.from||"");setTo(v.to||"");setCols(v.cols);flash(`Loaded: ${v.k}`);};
  const save=()=>{if(views.length>=10)return flash("Max 10 saved views");const k=prompt("View name?");if(!k)return;
    setViews(s=>[{k,q,scope,from,to,cols,selected:true},...s.map(x=>({...x,selected:false}))]);flash("View saved");};
  const pin=v=>setViews(s=>s.map(x=>x.k===v.k?{...x,pin:!x.pin}:x));
  const edit=v=>{const k=prompt("Rename view:",v.k)||v.k;setViews(s=>s.map(x=>x.k===v.k?{...x,k}:x));flash("View updated");};
  const delView=v=>{setViews(s=>s.filter(x=>x.k!==v.k));flash("View deleted");};
  const delRow=r=>{setRows(s=>s.filter(x=>x.ref!==r.ref));flash(`Removed ${r.ref}`);};
  const exportCSV=()=>{if(!data.length)return flash("No rows");
    const head=cols.join(","), body=data.map(r=>cols.map(c=>`"${String(r[c]??"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([head+"\n"+body],{type:"text/csv"}));a.download=`view_${Date.now()}.csv`;a.click();flash("Exported CSV");};

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      {/* FILE NAME CHIP (replaces navbar) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-2">
        <span className="inline-block text-xs sm:text-sm px-2.5 py-1 rounded-full bg-indigo-50 text-[#1C0B7E] border border-indigo-100">
          SearchSavedViewsPro.jsx
        </span>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-2 space-y-6">
        {/* Search / Filters */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid md:grid-cols-12 items-center gap-4">
            {/* Search input (⌘K chip hidden on mobile for space) */}
            <div className="md:col-span-6 min-w-0 flex items-center gap-3">
              <span className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-indigo-50 text-sm font-semibold text-[#1C0B7E]">⌘K</span>
              <input
                value={q}
                onChange={e=>runSearch(e.target.value)}
                placeholder="Search VIN, plate, customer, job, invoice…"
                className="h-11 w-full max-w-full min-w-0 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1C0B7E]/30 outline-none transition-all duration-200"
              />
            </div>

            {/* Scope */}
            <div className="md:col-span-2 min-w-0">
              <select
                value={scope}
                onChange={e=>setScope(e.target.value)}
                className="h-11 w-full max-w-full min-w-0 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1C0B7E]/30 outline-none transition-all duration-200"
              >
                {["All","VIN","Plate","Customer","Job","Appointment","Invoice","Feedback"].map(x=><option key={x}>{x}</option>)}
              </select>
            </div>

            {/* Date range: stack on mobile, inline from sm+ */}
            <div className="md:col-span-4 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input
                type="date"
                value={from}
                onChange={e=>setFrom(e.target.value)}
                className="h-11 w-full max-w-full min-w-0 px-4 rounded-xl border border-gray-300 transition-all duration-200"
              />
              <span className="text-gray-400 hidden sm:inline">→</span>
              <input
                type="date"
                value={to}
                onChange={e=>setTo(e.target.value)}
                className="h-11 w-full max-w-full min-w-0 px-4 rounded-xl border border-gray-300 transition-all duration-200"
              />
            </div>
          </div>

          {/* Columns + Recent */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">COLUMNS:</span>
            {ALL.map(c=>(
              <button
                key={c}
                onClick={()=>toggleCol(c)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs border transition-all duration-200 transform hover:scale-105 ${cols.includes(c)?"bg-[#1C0B7E] text-white border-transparent shadow-md":"bg-white border-gray-300 hover:border-[#1C0B7E]"}`}
              >
                {c}
              </button>
            ))}
            {/* Mobile: wrap to new line; sm+: push to the right */}
            <div className="basis-full sm:basis-auto sm:ml-auto flex items-center gap-2 text-xs mt-2 sm:mt-0">
              <span className="text-gray-500 font-medium">RECENT:</span>
              {[...new Set(recent)].slice(0,3).map(r=>(
                <button
                  key={r}
                  onClick={()=>setQ(r)}
                  className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  title={r}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Views */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-[#1C0B7E] mb-3">Saved Views</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...views].sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)).map(v=>(
              <div key={v.k} className={`rounded-2xl p-4 border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${v.selected?"border-[#1C0B7E] bg-indigo-50":"border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <button onClick={()=>load(v)} className="font-semibold text-gray-800 text-left hover:text-[#1C0B7E] transition-colors">{v.k}</button>
                  <div className="flex gap-1">
                    <button onClick={()=>pin(v)} className="p-1.5 rounded-lg hover:bg-white transition-all transform hover:scale-110"><Icon name="pin"/></button>
                    <button onClick={()=>edit(v)} className="p-1.5 rounded-lg hover:bg-white transition-all transform hover:scale-110"><Icon name="edit"/></button>
                    <button onClick={()=>delView(v)} className="p-1.5 rounded-lg hover:bg-red-50 transition-all transform hover:scale-110"><Icon name="trash"/></button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">Cols: {v.cols.join(", ")} {v.from&&`| ${v.from}`} {v.to&&`→ ${v.to}`}</div>
                {v.selected&&<div className="mt-2 h-1 w-full bg-[#1C0B7E] rounded-full animate-pulse" />}
              </div>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-auto rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <table className="min-w-full">
            <thead className="bg-indigo-50/60 sticky top-0">
              <tr>
                {cols.map(h=><th key={h} className="text-left px-6 py-4 font-semibold text-[#1C0B7E] transition-colors">{h.toUpperCase()}</th>)}
                <th className="px-6 py-4 text-right text-[#1C0B7E]">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.length?data.map((r,i)=>(
                <tr key={i} className="border-t hover:bg-indigo-50/40 transition-all duration-200">
                  {cols.map(c=><td key={c} className="px-6 py-4">{r[c]||"—"}</td>)}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={()=>flash(`Viewing ${r.ref}`)} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all transform hover:scale-110"><Icon name="view"/></button>
                      <button onClick={()=>flash(`Updated ${r.ref}`)} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 transition-all transform hover:scale-110"><Icon name="refresh"/></button>
                      <button onClick={()=>delRow(r)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-all transform hover:scale-110"><Icon name="trash"/></button>
                    </div>
                  </td>
                </tr>
              )):<tr><td className="px-6 py-8 text-center text-gray-500" colSpan={cols.length+1}>No results found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            {toast}
          </div>
        </div>
      )}

      <style jsx>{`
        html, body, #root { max-width: 100%; overflow-x: hidden; }
      `}</style>
    </div>
  );
}
