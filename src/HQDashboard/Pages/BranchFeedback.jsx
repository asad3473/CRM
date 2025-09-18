import React, { useMemo, useState } from "react";

const BRAND = "#1C0B7E";
const BRAND_GRADIENT = "linear-gradient(135deg, #1C0B7E 0%, #2D1BA3 100%)";

const Card = ({ title, right, children, className = "" }) => (
  <section className={`rounded-3xl border border-gray-200 bg-white/90 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
    <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {right}
    </header>
    <div className="p-5">{children}</div>
  </section>
);

const Modal = ({ open, title, onClose, onSave, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[pop_.2s_ease-out]">
        <style>{`@keyframes pop{from{opacity:.4;transform:translateY(8px) scale(.98)}to{opacity:1}}`}</style>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">✕</button>
        </div>
        <div className="p-5">{children}</div>
        <div className="px-5 pb-5 flex gap-3 justify-end">
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition-all font-medium" style={{background: BRAND_GRADIENT}} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Bars = ({ counts, onBarClick, activeBar }) => {
  const keys = [1, 2, 3, 4, 5];
  0;
  const max = Math.max(...keys.map(k => counts[k] || 0), 1);
  const colors = ["#ffcdd2", "#ffecb3", "#c8e6c9", "#bbdefb", BRAND];
  return (
    <div className="grid grid-cols-5 gap-3 items-end h-32">
      {keys.map((k, i) => (
        <div key={k} className="text-center group relative">
          <div className={`w-full rounded-t-md transition-all duration-300 cursor-pointer transform ${activeBar === k ? 'scale-105 opacity-100' : 'hover:scale-105 hover:opacity-90'}`}
            style={{height: `${((counts[k] || 0) / max) * 100}%`, background: colors[i], boxShadow: activeBar === k ? `0 4px 12px ${colors[i]}80` : 'none'}}
            onClick={() => onBarClick && onBarClick(k)}/>
          <div className="text-xs mt-2 text-gray-600 font-medium">{k}★</div>
          <div className="text-xs text-gray-500 mt-1">{counts[k] || 0}</div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
            {counts[k] || 0} ratings
          </div>
        </div>
      ))}
    </div>
  );
};

const PieChart = ({ value, data, onSegmentClick, activeSegment }) => {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const colors = ["#ffcdd2", "#ffecb3", "#c8e6c9", "#bbdefb", BRAND];
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 group">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Object.entries(data).map(([stars, count], i) => {
            if (count === 0) return null;
            const percentage = (count / total) * 100;
            const angle = (percentage / 100) * 360;
            const prevAngle = Object.entries(data).slice(0, i).reduce((sum, [s, c]) => sum + (c / total) * 360, 0);
            return (
              <circle key={stars} cx="50" cy="50" r="40" fill="none" stroke={colors[i]} strokeWidth="20"
                strokeDasharray={`${angle} ${360 - angle}`} strokeDashoffset={-prevAngle} transform="rotate(-90 50 50)"
                className={`cursor-pointer transition-all duration-300 ${parseInt(stars) === activeSegment ? 'opacity-100 scale-105' : 'opacity-90 hover:opacity-100'}`}
                onClick={() => onSegmentClick && onSegmentClick(parseInt(stars))}/>
            );
          })}
          <circle cx="50" cy="50" r="30" fill="white" />
          <text x="50" y="55" textAnchor="middle" className="font-bold text-[#1C0B7E] text-lg">{value.toFixed(1)}★</text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 text-white text-xs rounded-lg px-2 py-1">Click segments to filter</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-4">
        {[1, 2, 3, 4, 5].map((star, i) => (
          <div key={star} className="flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-125"
            onClick={() => onSegmentClick && onSegmentClick(star)}>
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: colors[i], boxShadow: star === activeSegment ? `0 0 8px ${colors[i]}` : 'none'}}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ points, labels, onPointHover, activePoint }) => {
  const W = 320, H = 100, p = 10;
  const max = Math.max(...points, 1);
  const x = i => p + (i * (W - 2 * p)) / (labels.length - 1);
  const y = v => H - p - (v / max) * (H - 2 * p);
  const path = points.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1C0B7E" /><stop offset="100%" stopColor="#2D1BA3" />
          </linearGradient>
        </defs>
        <path d={path} stroke="url(#lineGradient)" strokeWidth="3" fill="none" className="animate-[draw_1s_ease-out]" />
        {points.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={activePoint === i ? "6" : "4"} fill={BRAND} className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => onPointHover && onPointHover(i)} onMouseLeave={() => onPointHover && onPointHover(null)}/>
            {activePoint === i && <text x={x(i)} y={y(v) - 10} textAnchor="middle" className="text-xs font-bold fill-[#1C0B7E]">{v.toFixed(1)}</text>}
          </g>
        ))}
        <style>{`@keyframes draw{from{stroke-dasharray:0 500}to{stroke-dasharray:500 0}}`}</style>
        <g fontSize="10" fill="#6b7280" className="font-medium">
          {labels.map((l, i) => <text key={l} x={x(i) - 4} y={H - 2}>{l}</text>)}
        </g>
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
        {points.map((point, i) => <span key={i} className={`transition-all duration-300 ${activePoint === i ? 'font-bold text-[#1C0B7E] scale-110' : ''}`}>{point.toFixed(1)}</span>)}
      </div>
    </div>
  );
};

export default function FeedbackReviewsPro() {
  const [branch] = useState("Downtown Service Center");
  const [surveys] = useState([
    { id: 1, name: "Omar F.", stars: 2, comment: "Oil leak after service" },
    { id: 2, name: "M. Ali", stars: 3, comment: "Delay at delivery" },
    { id: 3, name: "Huda Z.", stars: 5, comment: "Great staff!" },
    { id: 4, name: "Kareem", stars: 4, comment: "Quick check-in" },
    { id: 5, name: "Amna", stars: 3, comment: "Could be cleaner" }
  ]);
  const [queue, setQueue] = useState(surveys.filter(s => s.stars <= 3).map(s => ({ ...s, assignee: "Unassigned", resolved: false, note: "" })));
  const [modal, setModal] = useState({ open: false, idx: -1, note: "", assignee: "Unassigned" });
  const [selectedRating, setSelectedRating] = useState(null);
  const [activePoint, setActivePoint] = useState(null);

  const google = { 
    avg: 4.4, 
    connected: true, 
    reviews: [
      { id: "g1", author: "★ John D.", text: "Super friendly team." },
      { id: "g2", author: "★ Ayesha", text: "Clean facility, fast job." }
    ]
  };

  const counts = useMemo(() => surveys.reduce((m, s) => ((m[s.stars] = (m[s.stars] || 0) + 1), m), { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }), [surveys]);
  const csat = useMemo(() => surveys.reduce((a, b) => a + b.stars, 0) / surveys.length, [surveys]);
  const trend = useMemo(() => ({ labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], vals: [3.2, 3.4, 3.6, 3.3, 3.9, 3.7, csat] }), [csat]);

  const openResolve = (i) => setModal({ open: true, idx: i, note: queue[i].note, assignee: queue[i].assignee });
  const saveResolve = () => { 
    setQueue(q => q.map((x, i) => i !== modal.idx ? x : { ...x, resolved: true, note: modal.note, assignee: modal.assignee }));
    setModal({ open: false, idx: -1, note: "", assignee: "Unassigned" }); 
  };
  const handleBarClick = (rating) => setSelectedRating(selectedRating === rating ? null : rating);
  const handleSegmentClick = (rating) => setSelectedRating(selectedRating === rating ? null : rating);
  const handlePointHover = (index) => setActivePoint(index);
  const filteredSurveys = selectedRating ? surveys.filter(s => s.stars === selectedRating) : surveys;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar removed as requested */}

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card title="Ratings Distribution">
            <Bars counts={counts} onBarClick={handleBarClick} activeBar={selectedRating} />
            <div className="text-xs text-gray-500 text-center mt-3">
              Click on bars to filter feedback
              {selectedRating && <span className="block text-[#1C0B7E] font-medium">Showing {selectedRating}★ ratings only</span>}
            </div>
          </Card>
          
          <Card title="Average Rating (CSAT)">
            <PieChart value={csat} data={counts} onSegmentClick={handleSegmentClick} activeSegment={selectedRating} />
            <p className="text-xs text-center text-gray-500 mt-3">{surveys.length} surveys in last 30 days</p>
          </Card>
          
          <Card title="CSAT Trend (7 Days)">
            <LineChart points={trend.vals} labels={trend.labels} onPointHover={handlePointHover} activePoint={activePoint} />
            <div className="text-xs text-gray-500 mt-2 text-center">Hover over points to see values</div>
          </Card>
        </div>

        <Card title="Recent Survey Feedback" id="feedback-section">
          {selectedRating && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#1C0B7E] font-medium">Filtered by: {selectedRating}★ ratings</span>
              <button onClick={() => setSelectedRating(null)} className="text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Clear filter</button>
            </div>
          )}
          <ul className="grid md:grid-cols-2 gap-4 max-h-52 overflow-auto pr-1 text-sm">
            {filteredSurveys.map(s => (
              <li key={s.id} className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300 bg-white group">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110 ${
                    s.stars <= 2 ? 'bg-red-100 text-red-700' : s.stars <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {s.stars}
                  </div>
                  <b className="text-gray-800 group-hover:text-[#1C0B7E] transition-colors">{s.name}</b>
                </div>
                <div className="text-gray-600 mt-2 text-sm group-hover:text-gray-800 transition-colors">{s.comment}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Low-Rating Queue (≤3★)">
          <div className="grid md:grid-cols-2 gap-4">
            {queue.map((q, i) => (
              <div key={q.id} className={`rounded-2xl border p-4 transition-all duration-300 group ${q.resolved ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:shadow-md"}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110 ${
                    q.stars <= 2 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {q.stars}
                  </div>
                  <div className="text-sm font-medium text-gray-800 group-hover:text-[#1C0B7E] transition-colors">{q.name}</div>
                </div>
                <div className="text-xs text-gray-600 mt-2 group-hover:text-gray-800 transition-colors">{q.comment}</div>
                <div className="mt-3 flex items-center gap-2">
                  <select value={q.assignee} onChange={e => setQueue(arr => arr.map((x, ix) => ix === i ? { ...x, assignee: e.target.value } : x))}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs hover:border-[#1C0B7E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30">
                    {["Unassigned", "Sara", "Ahmed", "Lina"].map(a => <option key={a}>{a}</option>)}
                  </select>
                  <button onClick={() => openResolve(i)} className="ml-auto px-3 py-1.5 rounded-lg text-white text-xs font-medium hover:opacity-90 transition-all transform hover:scale-105" 
                    style={{ background: q.resolved ? "#10B981" : BRAND }}>
                    {q.resolved ? "View" : "Resolve"}
                  </button>
                </div>
                {q.resolved && (
                  <div className="mt-3 p-2 bg-white rounded-lg border border-gray-200 text-xs group-hover:bg-gray-50 transition-colors">
                    <div className="text-gray-700"><b>Note:</b> {q.note || "—"}</div>
                    <div className="text-gray-600 mt-1"><b>By:</b> {q.assignee}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Google Reviews" right={
          <span className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
            google.connected ? "bg-green-100 text-green-700 font-medium hover:bg-green-200" : "bg-gray-100 text-gray-600"}`}>
            {google.connected ? "Connected ✓" : "Not Connected"}
          </span>}>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-gray-800">{google.avg}★</div>
            <div className="text-sm text-gray-600">Google average rating</div>
          </div>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
            {google.reviews.map(r => (
              <li key={r.id} className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300 bg-white group">
                <div className="font-medium text-gray-800 group-hover:text-[#1C0B7E] transition-colors">{r.author}</div>
                <div className="text-gray-600 mt-2 group-hover:text-gray-800 transition-colors">{r.text}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal open={modal.open} title="Resolve Low Rating" onClose={() => setModal({ open: false, idx: -1, note: "", assignee: "Unassigned" })} onSave={saveResolve}>
        <label className="text-sm block">
          <span className="block text-gray-600 mb-2 font-medium">Assign to</span>
          <select value={modal.assignee} onChange={e => setModal(m => ({ ...m, assignee: e.target.value }))} 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30 transition-colors hover:border-[#1C0B7E]">
            {["Unassigned", "Sara", "Ahmed", "Lina"].map(a => <option key={a}>{a}</option>)}
          </select>
        </label>
        <label className="text-sm block mt-4">
          <span className="block text-gray-600 mb-2 font-medium">Resolution note</span>
          <textarea rows={4} value={modal.note} onChange={e => setModal(m => ({ ...m, note: e.target.value }))} 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30 transition-colors hover:border-[#1C0B7E]" 
            placeholder="Describe how this issue was resolved..." />
        </label>
      </Modal>
    </div>
  );
}
