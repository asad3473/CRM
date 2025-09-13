// dashboard.jsx
import React, {useEffect, useState} from "react";

export default function Dashboard(){
  const [range,setRange]=useState("30d");
  const [mounted,setMounted]=useState(false);
  useEffect(()=>{setMounted(true)},[]);
  const kpis=[
    {label:"Cars Serviced", value:"1,284", delta:"+12%"},
    {label:"Revenue (MTD)", value:"$214k", delta:"+8%"},
    {label:"Avg CSAT", value:"4.6⭐", delta:"+0.2"},
    {label:"Open Jobs", value:"73", delta:"-9%"}
  ];
  const branches=[
    {name:"HQ", cars:412, rev:72, csat:4.7},
    {name:"North", cars:329, rev:58, csat:4.5},
    {name:"East", cars:291, rev:47, csat:4.4},
    {name:"West", cars:252, rev:37, csat:4.6},
  ];
  const feedback=[
    {name:"A. Khan", rate:2, note:"Oil leak after service", ago:"2h"},
    {name:"M. Ali", rate:5, note:"Quick & clean", ago:"5h"},
    {name:"S. Noor", rate:3, note:"Late pickup", ago:"1d"},
    {name:"R. Omar", rate:4, note:"Great advisor", ago:"1d"},
  ];

  return (
  <div className={`min-h-screen bg-slate-50 text-slate-900 ${mounted?"fade-in":""}`}>
    {/* Top Bar */}
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">🚘 Cars — Admin Dashboard</h1>
        <div className="ml-auto flex gap-2">
          <input className="px-3 py-2 rounded-lg bg-slate-100 outline-none focus:ring ring-slate-300 transition"
                 placeholder="Search VIN, Plate, Customer…" />
          <select value={range} onChange={e=>setRange(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition">
            <option>7d</option><option>30d</option><option>90d</option><option>YTD</option>
          </select>
          <button className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all">New Booking</button>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto p-4 grid gap-4">
      {/* KPI Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k,i)=>(
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-xl transition-all">
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-slate-900/5 group-hover:scale-150 transition-transform"/>
            <p className="text-sm text-slate-500">{k.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <h3 className="text-3xl font-bold tracking-tight">{k.value}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${k.delta.includes('-')?"bg-rose-100 text-rose-700":"bg-emerald-100 text-emerald-700"}`}>
                {k.delta}
              </span>
            </div>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900/80 rounded-full animate-grow" style={{width:`${25+i*18}%`}}/>
            </div>
          </div>
        ))}
      </section>

      {/* Charts + Leaderboard */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Pipeline Chart */}
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Service Pipeline ({range})</h4>
            <div className="text-xs text-slate-500">Booked → In Progress → Completed → Closed</div>
          </div>
          <div className="mt-2 h-56 relative">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopOpacity="0.25"/><stop offset="100%" stopOpacity="0"/>
              </linearGradient></defs>
              <polyline points="0,160 80,120 160,90 240,70 320,55 400,48 500,44"
                        fill="url(#g)" stroke="currentColor" className="text-slate-900/30" strokeWidth="2"/>
              <g className="animate-dash">
                <polyline points="0,160 80,120 160,90 240,70 320,55 400,48 500,44"
                          fill="none" stroke="currentColor" className="text-slate-900" strokeWidth="2"/>
              </g>
            </svg>
          </div>
          <div className="mt-2 grid grid-cols-4 text-center text-sm">
            {["Booked","In Progress","Completed","Closed"].map((s,i)=>(
              <div key={i} className="py-2 rounded-lg hover:bg-slate-100 transition">{s}</div>
            ))}
          </div>
        </div>

        {/* Branch Leaderboard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-lg transition-shadow">
          <h4 className="font-semibold mb-2">Branch Leaderboard</h4>
          <ul className="space-y-2">
            {branches.map((b,i)=>(
              <li key={i} className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:shadow transition flex items-center gap-3">
                <span className="w-6 text-center font-semibold">{i+1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{b.name}</span>
                    <span className="text-slate-500">{b.cars} cars</span>
                  </div>
                  <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900/80 rounded-full" style={{width:`${b.rev}%`}}/>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">{b.csat}★</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Expiries + Feedback + Campaigns */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Expiries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-lg transition-shadow">
          <h4 className="font-semibold mb-3">Upcoming Expiries</h4>
          {["Warranty (30d): 46","Insurance (60d): 89","Warranty (90d): 121"].map((t,i)=>(
            <div key={i} className="group p-3 mb-2 rounded-xl border border-slate-200 hover:-translate-y-0.5 hover:shadow transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <span>{t}</span>
                <button className="text-xs px-2 py-1 rounded-lg bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition">View</button>
              </div>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900/80 rounded-full animate-grow" style={{width:`${55+i*15}%`}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-lg transition-shadow">
          <h4 className="font-semibold mb-3">Recent Feedback</h4>
          <ul className="space-y-2">
            {feedback.map((f,i)=>(
              <li key={i} className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:shadow transition">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{f.name}</span>
                  <span className="text-slate-500">{f.ago}</span>
                </div>
                <div className="mt-1 text-amber-500">{'★'.repeat(f.rate)}<span className="text-slate-300">{'★'.repeat(5-f.rate)}</span></div>
                <p className="text-sm text-slate-600 mt-1">{f.note}</p>
                <div className="mt-2 flex gap-2">
                  <button className="btn">Create Task</button>
                  <button className="btn alt">Contact</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Campaigns */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-lg transition-shadow">
          <h4 className="font-semibold mb-3">Active Campaigns</h4>
          {[
            {t:"Oil Change Reminder", s:"WhatsApp", m:"12,340 sent", c:"3.8% CTR"},
            {t:"Autumn Promo", s:"Email", m:"8,102 sent", c:"2.4% CTR"},
          ].map((c,i)=>(
            <div key={i} className="p-3 mb-2 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:shadow transition">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{c.t}</p>
                  <p className="text-xs text-slate-500">{c.s} • {c.m}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 self-start">{c.c}</span>
              </div>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900/80 rounded-full animate-grow" style={{width:`${60+i*18}%`}}/>
              </div>
            </div>
          ))}
          <button className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 text-white hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all">Create Campaign</button>
        </div>
      </section>
    </main>

    {/* Styles */}
    <style jsx>{`
      .fade-in{animation:fade .6s ease-out both}
      @keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      .animate-grow{animation:grow 1.2s var(--d,0s) ease-out both}
      @keyframes grow{from{width:0}to{}}
      .animate-dash polyline{stroke-dasharray:6 6; animation:dash 2.4s linear infinite}
      @keyframes dash{to{stroke-dashoffset:-60}}
      .btn{@apply text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 text-white transition hover:-translate-y-0.5 hover:shadow}
      .btn.alt{background:#e2e8f0;color:#0f172a}
    `}</style>
  </div>
  );
}
