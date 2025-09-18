import React, { useMemo, useState } from "react";

/* ===== Config ===== */
const BRAND = "#1C0B7E";
const BRAND_GRADIENT = "linear-gradient(135deg, #1C0B7E 0%, #2D1BA3 100%)";
const PROFILE = "https://i.pravatar.cc/80?img=32";
const MGR = { name: "Aisha Noor", branch: { id: 12, name: "Downtown Service Center" } };

/* ===== Primitives ===== */
const Icon = ({ d, c = "currentColor", cls = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={cls} fill={c}><path d={d} /></svg>
);

const Card = ({ title, action, onAction, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
      {action && (
        <button onClick={onAction}
          className="px-4 py-2 rounded-lg text-white hover:opacity-90 active:scale-[.98] transition-all shadow-sm hover:shadow-md font-medium"
          style={{ background: BRAND_GRADIENT }}>
          {action}
        </button>
      )}
    </header>
    <div className="p-5">{children}</div>
  </section>
);

/* ===== Modal + Toast ===== */
const Modal = ({ open, title, onClose, onSave, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[pop_.2s_ease-out]">
        <style>{`@keyframes pop{from{opacity:.4;transform:translateY(8px) scale(.98)}to{opacity:1}}`}</style>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors text-lg">✕</button>
        </div>
        <div className="p-5">{children}</div>
        <div className="px-5 pb-5 flex gap-3 justify-end">
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition-all font-medium" style={{ background: BRAND_GRADIENT }} onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ msg, onHide }) => {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 translate-y-3 opacity-0 animate-[toast_.3s_ease-out_forwards]">
      <style>{`@keyframes toast{to{transform:none;opacity:1}}`}</style>
      <div className="rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg font-medium">{msg}</div>
      {setTimeout(onHide, 1800) && null}
    </div>
  );
};

/* ===== App ===== */
export default function BranchManager() {
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState({ open: false, type: "" });
  const [toast, setToast] = useState("");

  const openNew = (type) => setModal({ open: true, type });
  const closeNew = () => setModal({ open: false, type: "" });
  const saved = () => {
    setToast(`Created ${cap(modal.type)} for branch_id=${MGR.branch.id}`);
    closeNew();
  };

  const tabs = useMemo(() => ([
    { k: "dashboard", t: "Dashboard", ro: true, ic: "M3 13h8V3h2v10h8v2h-8v8h-2v-8H3z" },
    { k: "customers", t: "Customers", ic: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 9H5a7 7 0 0 1 14 0Z" },
    { k: "cars", t: "Cars", ic: "M5 17h14l1-5-3-4H7L4 12l1 5Z" },
    { k: "jobs", t: "Jobs", ic: "M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" },
    { k: "invoices", t: "Invoices", ic: "M4 6h16v12H4Zm2 2h8m-8 4h12m-12 4h6" },
  ]), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* App Bar */}
      <header className="px-4 lg:px-8 py-4 text-white flex items-center justify-between shadow-md" style={{ background: BRAND_GRADIENT }}>
        <div className="font-bold tracking-wide text-xl">Multi-Branch Automotive CRM</div>
        <div className="text-sm bg-white/20 py-1 px-3 rounded-full">Branch: <span className="font-semibold">{MGR.branch.name}</span></div>
      </header>

      {/* Header card */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-md p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#1C0B7E]/10 blur-3xl" />
          <div className="flex items-center gap-5">
            <img src={PROFILE} alt="profile" className="w-16 h-16 rounded-xl object-cover ring-4 ring-white shadow-lg" />
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Branch Manager</div>
              <div className="font-bold text-xl text-gray-800">{MGR.name}</div>
              <div className="text-sm mt-1 flex items-center gap-2">
                {MGR.branch.name}
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">read-only</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">All data filtered by <b>branch_id = {MGR.branch.id}</b>. No switcher.</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map(x => (
              <button key={x.k} onClick={() => setTab(x.k)}
                className={`group inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-200 font-medium
                ${tab===x.k?"text-white border-[#1C0B7E] shadow-inner":"text-gray-700 border-gray-300 hover:border-[#1C0B7E]/40 hover:shadow-sm"}`}
                style={tab===x.k ? {background: BRAND_GRADIENT} : {}}>
                <Icon d={x.ic} cls={`w-4 h-4 ${tab===x.k?"text-white":"text-gray-600 group-hover:text-[#1C0B7E]"}`} />
                <span>{x.t}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${x.ro?"bg-white/30 text-white":"bg-[#1C0B7E] text-white"} group-hover:scale-105 transition-transform`}>{x.ro?"RO":"RW"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {tab==="dashboard" && (
            <>
              <Card title="Quick Actions" action="New Booking" onAction={()=>openNew("booking")}>
                <div className="grid grid-cols-2 gap-4">
                  {["customer","car","job","invoice"].map(k=>(
                    <button key={k} onClick={()=>openNew(k)}
                      className="rounded-2xl border border-gray-200 p-5 relative overflow-hidden hover:shadow-lg active:scale-[.98] transition-all duration-300 group bg-gradient-to-b from-white to-gray-50 hover:to-[#1C0B7E]">
                      <span className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-[#1C0B7E]/10 group-hover:scale-150 transition-transform duration-500" />
                      <div className="text-sm text-gray-500 group-hover:text-white/90 transition-colors">Create</div>
                      <div className="font-semibold capitalize group-hover:text-white transition-colors">{k}</div>
                      <span className="mt-3 inline-block text-xs px-3 py-1 rounded-full bg-gray-100 group-hover:bg-white/20 group-hover:text-white transition-all">+ New</span>
                    </button>
                  ))}
                </div>
              </Card>
              <Card title="Alerts">
                <ul className="space-y-3">
                  <li className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 before:content-[''] before:w-3 before:h-3 before:bg-red-500 before:rounded-full font-medium">
                    3 jobs overdue • escalate
                  </li>
                  <li className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 flex items-center gap-3 before:content-[''] before:w-3 before:h-3 before:bg-yellow-500 before:rounded-full font-medium">
                    2 invoices pending 7+ days
                  </li>
                </ul>
              </Card>
            </>
          )}

          {tab!=="dashboard" && (
            <Card title={cap(tab)} action={`New ${cap(tab).slice(0,-1)}`} onAction={()=>openNew(tab.slice(0,-1))}>
              <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-xl border border-gray-200">
                No records yet. All future data will be scoped to branch <b>{MGR.branch.id}</b>.
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal + Toast */}
      <EntityModal modal={modal} onClose={closeNew} onSave={saved} />
      <Toast msg={toast} onHide={()=>setToast("")} />
    </div>
  );
}

/* ===== Entity Modal (branch locked) ===== */
function EntityModal({ modal, onClose, onSave }) {
  const { open, type } = modal;
  const fields = {
    customer: ["Name", "Phone", "Email"],
    car: ["Model", "Year", "Plate"],
    job: ["Service Type", "Advisor", "Due Date"],
    invoice: ["Job ID", "Total", "Currency"],
    booking: ["Customer", "Car", "Date/Time"]
  }[type] || [];
  return (
    <Modal open={open} title={`New ${cap(type)}`} onClose={onClose} onSave={onSave}>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(f=>(
          <label key={f} className="text-sm">
            <span className="block text-gray-600 mb-2 font-medium">{f}</span>
            <input className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C0B7E]/30 transition-colors"
              style={{ boxShadow: "inset 0 0 0 0 rgba(0,0,0,0)" }}
              onFocus={e=>e.target.style.borderColor=BRAND} />
          </label>
        ))}
        <label className="text-sm sm:col-span-2">
          <span className="block text-gray-600 mb-2 font-medium">Branch</span>
          <input value="Locked to current branch" readOnly
            className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-600" />
        </label>
      </div>
    </Modal>
  );
}

/* ===== Utils ===== */
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : "";