import React, { useMemo, useState, useEffect } from "react";

const BR = [{ id: "DXB", name: "Dubai" }, { id: "AUH", name: "Abu Dhabi" }, { id: "SHJ", name: "Sharjah" }];
const TAGS = ["VIP", "Lost", "WarrantyExpired", "HighValue", "New"];
const seed = [
    { id: "1", first: "Ahmed", last: "Khan", phone: "+971501234567", email: "ahmed.k@example.com", lang: "ar", branch: "DXB", tags: ["VIP"], cars: [{ p: "A-12345", m: "Camry", y: 2021 }], last: "2025-08-14", csat: 5 },
    { id: "2", first: "Maya", last: "Singh", phone: "+971507654321", email: "maya.s@example.com", lang: "en", branch: "AUH", tags: ["New"], cars: [{ p: "H-77821", m: "Civic", y: 2019 }], last: "2025-07-30", csat: 4 },
    { id: "3", first: "Omar", last: "Hassan", phone: "+971504443333", email: "omar.h@example.com", lang: "ar", branch: "DXB", tags: ["WarrantyExpired"], cars: [{ p: "B-33112", m: "Patrol", y: 2018 }], last: "2025-06-01", csat: 2 },
    { id: "4", first: "Omar", last: "Hassan", phone: "+971504443333", email: "omar.h@example.com", lang: "ar", branch: "DXB", tags: ["VIP"], cars: [{ p: "B-33112", m: "Patrol", y: 2018 }], last: "2025-06-01", csat: 2 }
];

const Badge = ({ tone = "tag", children }) => (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 transition
    ${tone === "vip" && "bg-indigo-50 text-indigo-700 ring-indigo-100"}
    ${tone === "bad" && "bg-rose-50 text-rose-700 ring-rose-100"}
    ${tone === "warn" && "bg-amber-50 text-amber-800 ring-amber-100"}
    ${tone === "good" && "bg-emerald-50 text-emerald-700 ring-emerald-100"}
    ${tone === "tag" && "bg-slate-50 text-slate-700 ring-slate-200"}`}>
        {children}
    </span>
);

export default function Customers() {
    const [items, setItems] = useState(seed);
    const [q, setQ] = useState(""); const [branch, setBranch] = useState("ALL"); const [tags, setTags] = useState([]); const [sort, setSort] = useState("last"); const [p, setP] = useState(1); const ps = 6;
    const [open, setOpen] = useState(false); const [edit, setEdit] = useState(null);

    const list = useMemo(() => {
        let L = [...items];
        if (q) { const n = q.toLowerCase(); L = L.filter(c => `${c.first} ${c.last}`.toLowerCase().includes(n) || c.phone.includes(n) || (c.email || "").toLowerCase().includes(n) || c.cars.some(x => x.p.toLowerCase().includes(n) || x.m.toLowerCase().includes(n))); }
        if (branch !== "ALL") L = L.filter(c => c.branch === branch);
        if (tags.length) L = L.filter(c => tags.every(t => c.tags.includes(t)));
        L.sort((a, b) => sort === "name" ? `${a.first} ${a.last}`.localeCompare(`${b.first} ${b.last}`) : new Date(b.last) - new Date(a.last));
        return L;
    }, [items, q, branch, tags, sort]);

    const TP = Math.max(1, Math.ceil(list.length / ps)); const s = list.slice((p - 1) * ps, p * ps); useEffect(() => setP(1), [q, branch, tags, sort]);

    const save = v => { setItems(x => v.id ? x.map(i => i.id === v.id ? v : i) : [{ ...v, id: Math.random().toString(36).slice(2, 8) }, ...x]); setOpen(false) };
    const exp = () => { const H = "First,Last,Phone,Email,Lang,Branch,Tags,Cars,Last,CSAT\n"; const R = list.map(c => [c.first, c.last, c.phone, c.email || "", c.lang.toUpperCase(), c.branch, c.tags.join("|"), c.cars.map(x => `${x.p} ${x.m} ${x.y}`).join(" / "), c.last, c.csat].map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([H + R], { type: "text/csv" })); a.download = "customers.csv"; a.click(); URL.revokeObjectURL(a.href) };

    return (<div className="mx-auto max-w-7xl px-3 py-6">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 className="text-2xl font-semibold text-slate-900">Customers</h1><p className="text-sm text-slate-500">Search, filter, tag, edit, export.</p></div>
            <div className="flex gap-2">
                <button onClick={exp} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow">Export CSV</button>
                <button onClick={() => { setEdit(null); setOpen(true) }} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow">Add Customer</button>
            </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name/phone/email/plate/model…" className="sm:col-span-6 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500 hover:border-slate-300" />
            <select value={branch} onChange={e => setBranch(e.target.value)} className="sm:col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500 hover:border-slate-300"><option value="ALL">All Branches</option>{BR.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="sm:col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500 hover:border-slate-300"><option value="last">Last Service</option><option value="name">Name</option></select>
        </div>

        {/* Quick tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
            {TAGS.map(t => <button key={t} onClick={() => setTags(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t])} className={`rounded-full border px-2 py-1 text-xs transition hover:-translate-y-0.5 ${tags.includes(t) ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}>{t}</button>)}
            {!!tags.length && <button onClick={() => setTags([])} className="text-xs font-medium text-indigo-700 hover:underline">Clear</button>}
        </div>

        {/* Desktop table with subtle animation */}
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="max-h-[70vh] overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-slate-50/90 backdrop-blur">
                        <tr>
                            {["Customer", "Contact", "Cars", "Last", "CSAT", ""].map((h, i) => <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {s.map((c, idx) => (
                            <tr key={c.id} style={{ animationDelay: `${idx * 35}ms` }} className="animate-row bg-white odd:bg-slate-50/40 transition hover:-translate-y-[1px] hover:bg-white hover:shadow-sm">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-900 font-semibold">{c.first} {c.last}</span>
                                        <Badge tone={c.tags.includes("VIP") ? "vip" : "tag"}>{BR.find(b => b.id === c.branch)?.name || c.branch}</Badge>
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-1">{c.tags.map(t => <Badge key={t} tone={t === "VIP" ? "vip" : t === "WarrantyExpired" ? "bad" : t === "HighValue" ? "warn" : "tag"}>{t}</Badge>)}</div>
                                </td>
                                <td className="px-4 py-3 text-slate-800">
                                    {c.phone}
                                    <div className="text-xs text-slate-500">{c.email}</div>
                                    <div className="text-[11px] uppercase text-slate-400">Lang: {c.lang.toUpperCase()}</div>
                                </td>
                                <td className="px-4 py-3">
                                    {c.cars.map((x, i) => <div key={i} className="rounded px-2 py-1 transition hover:bg-slate-50">{x.p} — {x.m} · {x.y}</div>)}
                                </td>
                                <td className="px-4 py-3">{new Date(c.last).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <Badge tone={c.csat >= 4 ? "good" : c.csat <= 2 ? "bad" : "warn"}>{c.csat}★</Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => { setEdit(c); setOpen(true) }} className="mr-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50">Edit</button>
                                    <button onClick={() => setItems(x => x.filter(i => i.id !== c.id))} className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {s.length === 0 && (<tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No customers found.</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Mobile cards (light touch) */}
        <div className="grid gap-3 md:hidden">
            {s.map((c, idx) => <div key={c.id} style={{ animationDelay: `${idx * 35}ms` }} className="animate-row rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
                <div className="flex justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold">{c.first} {c.last}</h3>
                            <Badge tone={c.tags.includes("VIP") ? "vip" : "tag"}>{BR.find(b => b.id === c.branch)?.name}</Badge>
                        </div>
                        <p className="text-xs text-slate-600">{c.phone}</p>
                        <p className="text-[11px] text-slate-400">{c.email}</p>
                    </div>
                    <Badge tone={c.csat >= 4 ? "good" : c.csat <= 2 ? "bad" : "warn"}>{c.csat}★</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">{c.tags.map(t => <Badge key={t} tone={t === "VIP" ? "vip" : t === "WarrantyExpired" ? "bad" : t === "HighValue" ? "warn" : "tag"}>{t}</Badge>)}</div>
                <div className="mt-2 text-xs text-slate-600">Last: {new Date(c.last).toLocaleDateString()}</div>
                <div className="mt-2 flex justify-end gap-2">
                    <button onClick={() => { setEdit(c); setOpen(true) }} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs transition hover:-translate-y-0.5 hover:border-slate-300">Edit</button>
                    <button onClick={() => setItems(x => x.filter(i => i.id !== c.id))} className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs text-rose-700 transition hover:-translate-y-0.5 hover:border-rose-300">Delete</button>
                </div>
            </div>)}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: TP }).map((_, i) => <button key={i} onClick={() => setP(i + 1)} className={`h-9 w-9 rounded-md border text-sm font-semibold transition hover:-translate-y-0.5 ${p === i + 1 ? "border-indigo-300 bg-indigo-600 text-white hover:bg-indigo-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>{i + 1}</button>)}
        </div>

        {/* Modal */}
        {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => setOpen(false)}>
            <div className="animate-modal w-[95%] max-w-xl rounded-xl bg-white p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="mb-2 text-base font-semibold">{edit ? "Edit Customer" : "Add Customer"}</h3>
                <Form initial={edit} onSave={save} onCancel={() => setOpen(false)} />
            </div>
        </div>}

        {/* Keyframes (lightweight) */}
        <style>{`
      @keyframes row {0%{opacity:.0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
      .animate-row{animation:row .35s ease-out both}
      @keyframes modal {0%{opacity:0;transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
      .animate-modal{animation:modal .2s ease-out both}
    `}</style>
    </div>);
}

function Form({ initial, onSave, onCancel }) {
    const [f, setF] = useState(initial || { first: "", last: "", phone: "", email: "", lang: "en", branch: "DXB", tags: [], cars: [], last: new Date().toISOString().slice(0, 10), csat: 5, id: initial?.id });
    const addCar = () => setF(v => ({ ...v, cars: [...v.cars, { p: "", m: "", y: new Date().getFullYear() }] }));
    return (<form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {["first", "last", "phone", "email"].map((k, i) => <input key={k} required={i < 3} placeholder={k === "first" ? "First Name" : k === "last" ? "Last Name" : k === "phone" ? "+9715XXXXXXXX" : "Email"} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500 hover:border-slate-300" />)}
            <select value={f.lang} onChange={e => setF({ ...f, lang: e.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500"><option value="en">English</option><option value="ar">Arabic</option></select>
            <select value={f.branch} onChange={e => setF({ ...f, branch: e.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500">{BR.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
        </div>
        <div className="flex flex-wrap gap-1.5">{TAGS.map(t => <button type="button" key={t} onClick={() => setF(v => ({ ...v, tags: v.tags.includes(t) ? v.tags.filter(x => x !== t) : [...v.tags, t] }))} className={`rounded-full border px-2 py-1 text-xs transition hover:-translate-y-0.5 ${f.tags.includes(t) ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}>{t}</button>)}</div>
        <div>
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Cars</span><button type="button" onClick={addCar} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs transition hover:-translate-y-0.5 hover:border-slate-300">Add Car</button></div>
            <div className="mt-2 space-y-2">{f.cars.map((c, i) => <div key={i} className="grid grid-cols-12 gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
                <input className="col-span-4 rounded border border-slate-200 px-2 py-1 text-sm" value={c.p} onChange={e => setF(v => ({ ...v, cars: v.cars.map((x, j) => j === i ? { ...x, p: e.target.value } : x) }))} placeholder="Plate" />
                <input className="col-span-6 rounded border border-slate-200 px-2 py-1 text-sm" value={c.m} onChange={e => setF(v => ({ ...v, cars: v.cars.map((x, j) => j === i ? { ...x, m: e.target.value } : x) }))} placeholder="Model" />
                <input type="number" className="col-span-2 rounded border border-slate-200 px-2 py-1 text-sm" value={c.y} onChange={e => setF(v => ({ ...v, cars: v.cars.map((x, j) => j === i ? { ...x, y: +e.target.value } : x) }))} />
            </div>)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <input type="date" value={f.last} onChange={e => setF({ ...f, last: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input type="number" min={1} max={5} value={f.csat} onChange={e => setF({ ...f, csat: Math.max(1, Math.min(5, +e.target.value)) })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:border-slate-300">Cancel</button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700">Save</button>
        </div>
    </form>);
}