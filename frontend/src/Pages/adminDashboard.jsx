import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApplications, updateApplicationStatus } from "../utils/applications";

/* ── Google Fonts ── */
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
    rel="stylesheet"
  />
);

/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */
const ADMIN = {
  name: "Priya Verma",
  role: "District Admin — Patna",
  dept: "Revenue & Land",
  avatar: "PV",
  email: "priya.verma@bihar.gov.in",
  phone: "+91 94100 77821",
  employeeId: "BHR-ADM-2041",
  joined: "14 Aug 2021",
};

const DEPARTMENTS = [
  "All Departments",
  "Revenue & Land",
  "Health & Insurance",
  "Benefits & Welfare",
  "Identity & Aadhaar",
  "Education",
  "Legal & Courts",
  "Jobs & Business",
  "Certificates",
];

const STATUSES = ["All", "Pending", "In Review", "Escalated", "Resolved", "Rejected"];

const QUERIES = [
  { id: "QRY-1041", citizen: "Rahul Sharma",   dept: "Benefits & Welfare",  subject: "Ration Card Application",          status: "In Review",  priority: "high",   filed: "12 Mar 2025", district: "Patna",    doc: true,  hash: "0x3a9f…c12e" },
  { id: "QRY-1042", citizen: "Sunita Devi",    dept: "Revenue & Land",      subject: "Land Mutation Survey #441",        status: "Pending",    priority: "medium", filed: "1 Apr 2025",  district: "Gaya",     doc: true,  hash: "0x7b2d…88af" },
  { id: "QRY-1043", citizen: "Mohan Prasad",   dept: "Health & Insurance",  subject: "Ayushman Bharat Card Dispatch",    status: "Escalated",  priority: "high",   filed: "2 Feb 2025",  district: "Muzaffarpur", doc: false, hash: "0xf104…33bc" },
  { id: "QRY-1044", citizen: "Lakshmi Rai",    dept: "Identity & Aadhaar",  subject: "Aadhaar Name Correction",          status: "Resolved",   priority: "low",    filed: "20 Jan 2025", district: "Patna",    doc: true,  hash: "0x9c6a…e77d" },
  { id: "QRY-1045", citizen: "Arjun Singh",    dept: "Education",           subject: "Scholarship Application 2025",     status: "Pending",    priority: "medium", filed: "5 Apr 2025",  district: "Nalanda",  doc: true,  hash: "0x2e81…a034" },
  { id: "QRY-1046", citizen: "Poonam Kumari",  dept: "Certificates",        subject: "Birth Certificate Correction",     status: "In Review",  priority: "low",    filed: "18 Mar 2025", district: "Bhagalpur",doc: false, hash: "0xd5c3…1190" },
  { id: "QRY-1047", citizen: "Dev Narayan",    dept: "Legal & Courts",      subject: "FIR Status — Case #2210",          status: "Escalated",  priority: "high",   filed: "29 Mar 2025", district: "Patna",    doc: true,  hash: "0x0af9…55c8" },
  { id: "QRY-1048", citizen: "Rekha Mishra",   dept: "Jobs & Business",     subject: "MSME Licence Renewal",             status: "Resolved",   priority: "low",    filed: "8 Feb 2025",  district: "Vaishali", doc: true,  hash: "0x6b44…fde2" },
];

const BLOCKCHAIN_RECORDS = [
  { block: 100421, hash: "0x3a9f4c12e", prev: "0x1b7e9a03f", tx: "QRY-1041 → In Review",   timestamp: "12 Mar 2025 09:14", valid: true  },
  { block: 100422, hash: "0x7b2d88af1", prev: "0x3a9f4c12e", tx: "QRY-1042 → Filed",        timestamp: "1 Apr 2025 11:30",  valid: true  },
  { block: 100423, hash: "0xf10433bc2", prev: "0x7b2d88af1", tx: "QRY-1043 → Escalated",    timestamp: "2 Feb 2025 14:52",  valid: true  },
  { block: 100424, hash: "0x9c6ae77d3", prev: "0xf10433bc2", tx: "QRY-1044 → Resolved",     timestamp: "20 Jan 2025 10:05", valid: true  },
  { block: 100425, hash: "0x2e81a0344", prev: "0x9c6ae77d3", tx: "QRY-1045 → Filed",        timestamp: "5 Apr 2025 08:41",  valid: true  },
  { block: 100426, hash: "0xd5c311905", prev: "0x2e81a0344", tx: "QRY-1046 → In Review",    timestamp: "18 Mar 2025 13:17", valid: false },
  { block: 100427, hash: "0x0af955c86", prev: "0xd5c311905", tx: "QRY-1047 → Escalated",    timestamp: "29 Mar 2025 17:00", valid: true  },
  { block: 100428, hash: "0x6b44fde27", prev: "0x0af955c86", tx: "QRY-1048 → Resolved",     timestamp: "8 Feb 2025 09:33",  valid: true  },
];

const AI_BOTS = [
  { id: "bot-1", name: "LandBot",       dept: "Revenue & Land",      desc: "Handles mutation, registry, survey queries",   active: true,  queries: 142 },
  { id: "bot-2", name: "AyushBot",      dept: "Health & Insurance",  desc: "PMJAY registration, hospital claim triage",    active: true,  queries: 89  },
  { id: "bot-3", name: "WelfareBot",    dept: "Benefits & Welfare",  desc: "Ration card, pension, PM scheme eligibility",  active: true,  queries: 214 },
  { id: "bot-4", name: "AadhaarBot",    dept: "Identity & Aadhaar",  desc: "Correction, linking, biometric issues",         active: false, queries: 31  },
  { id: "bot-5", name: "EduBot",        dept: "Education",           desc: "Scholarship triage, admission guidance",        active: true,  queries: 67  },
  { id: "bot-6", name: "LegalBot",      dept: "Legal & Courts",      desc: "FIR status, court notices, hearing schedules", active: false, queries: 18  },
];

const STATUS_META = {
  "Pending":   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  "In Review": { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     dot: "bg-sky-400"     },
  "Escalated": { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-400"    },
  "Resolved":  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  "Rejected":  { bg: "bg-stone-100",  text: "text-stone-500",   border: "border-stone-200",   dot: "bg-stone-400"   },
};

const PRIORITY_META = {
  high:   { text: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200"   },
  medium: { text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200"  },
  low:    { text: "text-stone-500",  bg: "bg-stone-50",  border: "border-stone-200"  },
};

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
function Icon({ d, size = "w-4 h-4" }) {
  return (
    <svg className={size} viewBox="0 0 16 16" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DashIcon  = () => <Icon d="M1 1h5v5H1zM10 1h5v5h-5zM1 10h5v5H1zM10 10h5v5h-5z" />;
const QueryIcon = () => <Icon d="M2 2h10v2H2zM2 6h10v2H2zM2 10h6v2H2zM12 11l2 2-2 2" />;
const BotIcon2  = () => <Icon d="M2 5h12v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM8 5V2.5M6.5 2.5h3M5 9h.01M11 9h.01M6 12h4" />;
const ChainIcon = () => <Icon d="M5 8h6M2 5l2 3-2 3M14 5l-2 3 2 3" />;
const UserIcon2 = () => <Icon d="M8 7a3 3 0 100-6 3 3 0 000 6zM2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" />;
const FilterIcon= () => <Icon d="M1 3h14M4 8h8M7 13h2" />;
const DocIcon2  = () => <Icon d="M3 2h8l3 3v11H3zM9 2v4h4M5 8h6M5 11h4" />;
const CheckIcon = () => <Icon d="M3 8l3.5 3.5L13 4" />;
const XIcon     = () => <Icon d="M4 4l8 8M12 4l-8 8" />;
const EditIcon  = () => <Icon d="M10 2l4 4-8 8H2v-4l8-8z" />;
const EyeIcon   = () => <Icon d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z M8 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />;
const ShieldIcon= () => <Icon d="M8 1l6 2.5v5C14 12 11 14.5 8 15c-3-0.5-6-3-6-6.5v-5L8 1z" />;
const CopyIcon  = () => <Icon d="M5 4H3a1 1 0 00-1 1v9a1 1 0 001 1h8a1 1 0 001-1v-2M6 2h6l3 3v7a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" />;

/* ══════════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════════ */
const NAV = [
  { id: "overview",   label: "Overview",       icon: <DashIcon />   },
  { id: "queries",    label: "Raised Queries",  icon: <QueryIcon />  },
  { id: "bots",       label: "AI Bots",         icon: <BotIcon2 />   },
  { id: "blockchain", label: "Blockchain Logs", icon: <ChainIcon />  },
  { id: "profile",    label: "Admin Profile",   icon: <UserIcon2 />  },
];

/* ══════════════════════════════════════════════
   SHARED BADGE
══════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {status}
    </span>
  );
}

/* ══════════════════════════════════════════════
   OVERVIEW PANEL
══════════════════════════════════════════════ */
function OverviewPanel({ setActiveTab, queries }) {
  const stats = [
    { n: queries.filter(q => q.status === "Pending").length,   label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50 border-amber-100"    },
    { n: queries.filter(q => q.status === "In Review").length, label: "In Review", color: "text-sky-700",     bg: "bg-sky-50 border-sky-100"        },
    { n: queries.filter(q => q.status === "Escalated").length, label: "Escalated", color: "text-rose-700",    bg: "bg-rose-50 border-rose-100"      },
    { n: queries.filter(q => q.status === "Approved" || q.status === "Resolved").length,  label: "Approved",  color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* hero */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-emerald-500/10" />
        <div className="absolute right-6 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin Command Centre</p>
        <h2 className="font-serif text-2xl font-normal mb-1">Namaste, Priya 🙏</h2>
        <p className="text-stone-400 text-sm">District Admin · Patna · {new Date().toDateString()}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setActiveTab("queries")} className="bg-emerald-700 border-none text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-emerald-600 transition-colors">
            Review Queries →
          </button>
          <button onClick={() => setActiveTab("blockchain")} className="bg-white/10 border border-white/10 text-white text-xs font-medium px-4 py-2 rounded-xl cursor-pointer hover:bg-white/20 transition-colors">
            Blockchain Logs
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(s => (
          <motion.div key={s.label} whileHover={{ y: -2 }} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className={`font-serif text-3xl font-medium ${s.color}`}>{s.n}</p>
            <p className="text-xs text-stone-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* recent queries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Recent Queries</p>
          <button onClick={() => setActiveTab("queries")} className="text-xs text-emerald-700 font-medium cursor-pointer bg-transparent border-none">
            View all
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {queries.slice(0, 4).map(q => (
            <div key={q.id} className="bg-white rounded-xl border border-stone-100 px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{q.subject}</p>
                <p className="text-xs text-stone-400 mt-0.5">{q.id} · {q.citizen} · {q.dept}</p>
              </div>
              <StatusBadge status={q.status} />
            </div>
          ))}
        </div>
      </div>

      {/* active bots */}
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-3">Active AI Bots</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AI_BOTS.filter(b => b.active).map(b => (
            <div key={b.id} className="bg-white border border-stone-100 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold text-stone-800">{b.name}</p>
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed">{b.dept}</p>
              <p className="text-xs font-medium text-emerald-700 mt-1">{b.queries} queries handled</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   QUERY DETAIL MODAL
══════════════════════════════════════════════ */
function QueryModal({ query, onClose, onStatusChange }) {
  const [status, setStatus] = useState(query.status);
  const [note, setNote] = useState("");

  const handleSave = () => {
    onStatusChange(query.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">{query.id}</p>
            <p className="font-serif text-lg font-normal mt-0.5">{query.subject}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 border-none text-white flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Citizen",    value: query.citizen  },
              { label: "Department", value: query.dept     },
              { label: "District",   value: query.district },
              { label: "Filed",      value: query.filed    },
            ].map(r => (
              <div key={r.label} className="bg-stone-50 rounded-xl p-3">
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">{r.label}</p>
                <p className="text-sm font-medium text-stone-800 mt-0.5">{r.value}</p>
              </div>
            ))}
          </div>

          {/* blockchain hash */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
            <ShieldIcon />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold">Blockchain Hash</p>
              <p className="text-xs font-mono text-emerald-800 truncate mt-0.5">{query.hash}</p>
            </div>
          </div>

          {/* document */}
          {query.doc && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-center gap-3">
              <span className="text-sky-600"><DocIcon2 /></span>
              <p className="text-sm text-sky-700 font-medium flex-1">Supporting document attached</p>
              <button className="text-xs font-semibold text-sky-700 bg-white border border-sky-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-sky-100 transition-colors">
                Download
              </button>
            </div>
          )}

          {/* status change */}
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {["Pending","In Review","Escalated","Resolved","Rejected"].map(s => {
                const m = STATUS_META[s];
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200
                      ${status === s ? `${m.bg} ${m.text} ${m.border}` : "bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* admin note */}
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-2">Admin Note</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note or forward instruction…"
              rows={3}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none resize-none focus:border-emerald-400 transition-colors placeholder:text-stone-300"
            />
          </div>

          {/* actions */}
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl border-none cursor-pointer hover:bg-emerald-600 transition-colors">
              Save & Process
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-stone-100 text-stone-600 text-sm font-semibold rounded-xl border-none cursor-pointer hover:bg-stone-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   QUERIES PANEL
══════════════════════════════════════════════ */
function QueriesPanel({ initialQueries }) {
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [queries, setQueries] = useState(initialQueries);
  const [search, setSearch] = useState("");

  const filtered = queries.filter(q => {
    const deptOk    = deptFilter === "All Departments" || q.dept === deptFilter;
    const statusOk  = statusFilter === "All" || q.status === statusFilter;
    const searchOk  = !search || q.subject.toLowerCase().includes(search.toLowerCase()) || q.citizen.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
    return deptOk && statusOk && searchOk;
  });

  const handleStatusChange = (id, newStatus) => {
    updateApplicationStatus(id, newStatus);
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-1">Query Management</p>
        <h2 className="font-serif text-2xl font-normal text-stone-900">Raised Queries</h2>
      </div>

      {/* filters */}
      <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-4 flex flex-col gap-3">
        {/* search */}
        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus-within:border-emerald-400 transition-colors">
          <FilterIcon />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, citizen, subject…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-stone-800 placeholder:text-stone-300"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* dept filter */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white text-stone-700 outline-none cursor-pointer focus:border-emerald-400"
          >
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>

          {/* status filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map(s => {
              const active = statusFilter === s;
              const m = s === "All" ? null : STATUS_META[s];
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200
                    ${active
                      ? s === "All" ? "bg-stone-900 text-white border-stone-900" : `${m.bg} ${m.text} ${m.border}`
                      : "bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300"
                    }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-stone-400">{filtered.length} query{filtered.length !== 1 ? "ies" : ""} found</p>
      </div>

      {/* query rows */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {filtered.map((q, i) => {
            const pm = PRIORITY_META[q.priority];
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="bg-white rounded-xl border border-stone-100 hover:border-emerald-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="p-4 flex items-center gap-3">
                  {/* priority dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_META[q.priority].bg.replace("bg-","bg-").replace("-50","-400")}`}
                    style={{ background: q.priority === "high" ? "#fb7185" : q.priority === "medium" ? "#fbbf24" : "#a8a29e" }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[10px] font-mono text-stone-400">{q.id}</p>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${pm.bg} ${pm.text} ${pm.border}`}>
                        {q.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-stone-800 mt-0.5 truncate">{q.subject}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{q.citizen} · {q.dept} · {q.district}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {q.doc && (
                      <span className="text-sky-500 w-4 h-4 shrink-0"><DocIcon2 /></span>
                    )}
                    <StatusBadge status={q.status} />
                    <button
                      onClick={() => setSelected(q)}
                      className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 flex items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                    >
                      <EyeIcon />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p className="text-sm">No queries match your filters</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <QueryModal
            query={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   AI BOTS PANEL
══════════════════════════════════════════════ */
function BotsPanel() {
  const [bots, setBots] = useState(AI_BOTS);
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [chatBot, setChatBot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const filtered = bots.filter(b => deptFilter === "All Departments" || b.dept === deptFilter);

  const toggleBot = (id) => {
    setBots(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const openChat = (bot) => {
    setChatBot(bot);
    setMessages([{ role: "bot", text: `Hi! I'm ${bot.name}, handling ${bot.dept}. How can I assist you today?` }]);
    setInput("");
  };

  const sendMsg = () => {
    if (!input.trim()) return;
    const user = { role: "user", text: input };
    setMessages(m => [...m, user]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { role: "bot", text: `Processing your query regarding "${user.text}". I'll route this to the ${chatBot.dept} queue and escalate if needed. Ticket created: QRY-${Math.floor(Math.random()*9000+1000)}.` }]);
    }, 900);
  };

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-1">AI Automation</p>
        <h2 className="font-serif text-2xl font-normal text-stone-900">AI Bots</h2>
      </div>

      {/* filter */}
      <div className="flex items-center gap-3 mb-4">
        <FilterIcon />
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white text-stone-700 outline-none cursor-pointer focus:border-emerald-400"
        >
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <p className="text-xs text-stone-400">{filtered.length} bot{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* bot cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map(bot => (
          <motion.div
            key={bot.id}
            whileHover={{ y: -2 }}
            className={`rounded-2xl border p-4 transition-all duration-200 ${bot.active ? "bg-white border-stone-100" : "bg-stone-50 border-stone-100 opacity-60"}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bot.active ? "bg-emerald-700" : "bg-stone-300"}`}>
                  <span className="text-white"><BotIcon2 /></span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{bot.name}</p>
                  <p className="text-[10px] text-stone-400">{bot.dept}</p>
                </div>
              </div>
              {/* toggle */}
              <button
                onClick={() => toggleBot(bot.id)}
                className={`relative w-10 h-5 rounded-full border-none cursor-pointer transition-colors duration-300 ${bot.active ? "bg-emerald-600" : "bg-stone-300"}`}
              >
                <motion.span
                  animate={{ x: bot.active ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                  style={{ display: "block" }}
                />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed mb-3">{bot.desc}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">
                <span className={`font-semibold ${bot.active ? "text-emerald-700" : "text-stone-400"}`}>{bot.queries}</span> queries handled
              </span>
              {bot.active && (
                <button
                  onClick={() => openChat(bot)}
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  Open Chat
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* bot chat drawer */}
      <AnimatePresence>
        {chatBot && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
              style={{ height: "520px" }}
            >
              {/* header */}
              <div className="bg-stone-900 text-white px-5 py-4 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center">
                  <BotIcon2 />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{chatBot.name}</p>
                  <p className="text-[10px] text-stone-400">{chatBot.dept}</p>
                </div>
                <button onClick={() => setChatBot(null)} className="w-8 h-8 rounded-xl bg-white/10 border-none text-white flex items-center justify-center cursor-pointer hover:bg-white/20">
                  <XIcon />
                </button>
              </div>

              {/* messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "thin" }}>
                {messages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                      ${m.role === "user" ? "bg-emerald-700 text-white rounded-br-sm" : "bg-stone-50 border border-stone-100 text-stone-800 rounded-bl-sm"}`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* input */}
              <div className="p-3 border-t border-stone-100 flex gap-2 shrink-0">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMsg()}
                  placeholder="Ask the bot…"
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 transition-colors"
                />
                <button onClick={sendMsg} disabled={!input.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors
                    ${input.trim() ? "bg-emerald-700 text-white hover:bg-emerald-600" : "bg-stone-100 text-stone-300"}`}>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7l5 3 2 5 5-13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BLOCKCHAIN PANEL
══════════════════════════════════════════════ */
function BlockchainPanel() {
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyHash = (hash) => {
    setCopied(hash);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-1">Immutable Audit Trail</p>
        <h2 className="font-serif text-2xl font-normal text-stone-900">Blockchain Logs</h2>
      </div>

      {/* legend */}
      <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Valid block</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Integrity warning</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-stone-300" /> Hash chain</div>
      </div>

      {/* hash chain visualisation */}
      <div className="mb-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 min-w-max px-1">
          {BLOCKCHAIN_RECORDS.map((r, i) => (
            <div key={r.block} className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setExpanded(expanded === r.block ? null : r.block)}
                className={`shrink-0 w-14 rounded-xl border-2 cursor-pointer transition-all duration-200 py-2 flex flex-col items-center gap-1
                  ${expanded === r.block ? "border-emerald-500 bg-emerald-50" : r.valid ? "border-stone-200 bg-white hover:border-emerald-300" : "border-rose-300 bg-rose-50"}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${r.valid ? "bg-emerald-500" : "bg-rose-400"}`} />
                <span className="text-[9px] font-mono text-stone-500">#{r.block}</span>
              </motion.button>
              {i < BLOCKCHAIN_RECORDS.length - 1 && (
                <div className="flex items-center">
                  <div className="w-4 h-px bg-stone-300" />
                  <svg className="w-2 h-2 text-stone-300" viewBox="0 0 8 8" fill="currentColor"><path d="M0 1l5 3-5 3V1z"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* block detail */}
      <AnimatePresence>
        {expanded && (() => {
          const r = BLOCKCHAIN_RECORDS.find(b => b.block === expanded);
          return r ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className={`mb-4 rounded-2xl border p-4 ${r.valid ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest">Block #{r.block}</p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${r.valid ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"}`}>
                  {r.valid ? "✓ Valid" : "⚠ Warning"}
                </span>
              </div>
              {[
                { label: "Transaction", value: r.tx         },
                { label: "Timestamp",   value: r.timestamp  },
                { label: "Block Hash",  value: r.hash, mono: true },
                { label: "Prev Hash",   value: r.prev, mono: true },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/60 last:border-none gap-3">
                  <p className="text-xs text-stone-400 shrink-0">{row.label}</p>
                  <div className="flex items-center gap-2 min-w-0">
                    <p className={`text-xs text-stone-800 truncate ${row.mono ? "font-mono" : "font-medium"}`}>{row.value}</p>
                    {row.mono && (
                      <button
                        onClick={() => copyHash(row.value)}
                        className="shrink-0 text-stone-400 cursor-pointer bg-transparent border-none hover:text-emerald-700 transition-colors"
                      >
                        {copied === row.value ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : null;
        })()}
      </AnimatePresence>

      {/* full log table */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-50">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Full Log</p>
        </div>
        <div className="flex flex-col divide-y divide-stone-50">
          {BLOCKCHAIN_RECORDS.map(r => (
            <div
              key={r.block}
              className="px-4 py-3 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition-colors"
              onClick={() => setExpanded(expanded === r.block ? null : r.block)}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${r.valid ? "bg-emerald-500" : "bg-rose-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-stone-500">#{r.block} · {r.hash}</p>
                <p className="text-sm font-medium text-stone-800 truncate mt-0.5">{r.tx}</p>
              </div>
              <p className="text-[10px] text-stone-400 shrink-0">{r.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PROFILE PANEL
══════════════════════════════════════════════ */
function ProfilePanel({ onSignOut }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ ...ADMIN });
  const [draft, setDraft] = useState({ ...ADMIN });
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(["Revenue", "Land Records", "Patna District", "Bihar"]);

  const save = () => { setProfile({ ...draft }); setEditing(false); };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(t => [...t, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag) => setTags(t => t.filter(x => x !== tag));

  return (
    <div className="flex flex-col gap-5">
      {/* avatar card */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-emerald-500/10" />
        <div className="absolute right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <div className="flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 flex items-center justify-center font-serif text-2xl font-medium shrink-0">
            {profile.avatar}
          </div>
          <div>
            <h2 className="font-serif text-xl font-normal">{profile.name}</h2>
            <p className="text-stone-400 text-sm mt-0.5">{profile.role}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-[10px] bg-emerald-700/40 border border-emerald-600/30 text-emerald-300 px-2.5 py-1 rounded-full">
                <ShieldIcon /> Admin Verified
              </span>
              <span className="text-[10px] bg-white/10 border border-white/10 text-stone-300 px-2.5 py-1 rounded-full">{profile.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* editable details */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-50">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Admin Details</p>
          {editing
            ? <div className="flex gap-2">
                <button onClick={save} className="text-xs font-semibold text-white bg-emerald-700 border-none px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-600">Save</button>
                <button onClick={() => { setDraft({ ...profile }); setEditing(false); }} className="text-xs font-medium text-stone-500 bg-stone-100 border-none px-3 py-1.5 rounded-lg cursor-pointer">Cancel</button>
              </div>
            : <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium cursor-pointer bg-transparent border-none">
                <EditIcon /> Edit
              </button>
          }
        </div>

        {[
          { label: "Full Name",    key: "name"    },
          { label: "Role",         key: "role"    },
          { label: "Department",   key: "dept"    },
          { label: "Email",        key: "email"   },
          { label: "Phone",        key: "phone"   },
          { label: "Employee ID",  key: "employeeId", readonly: true },
          { label: "Joined",       key: "joined",     readonly: true },
        ].map(row => (
          <div key={row.key} className="flex items-center justify-between px-5 py-3.5 border-b border-stone-50 last:border-none gap-4">
            <p className="text-xs text-stone-400 shrink-0 w-28">{row.label}</p>
            {editing && !row.readonly
              ? <input
                  value={draft[row.key]}
                  onChange={e => setDraft(d => ({ ...d, [row.key]: e.target.value }))}
                  className="flex-1 text-sm text-stone-800 text-right outline-none border-b border-emerald-300 bg-transparent pb-0.5"
                />
              : <p className="text-sm text-stone-800 font-medium text-right">{editing ? draft[row.key] : profile[row.key]}</p>
            }
          </div>
        ))}
      </div>

      {/* jurisdiction tags */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5">
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-3">Jurisdiction Tags</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
              {tag}
              <button onClick={() => removeTag(tag)} className="cursor-pointer bg-transparent border-none text-emerald-500 hover:text-rose-500 transition-colors leading-none p-0">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTag()}
            placeholder="Add jurisdiction tag…"
            className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 transition-colors"
          />
          <button onClick={addTag} className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl border-none cursor-pointer hover:bg-emerald-600 transition-colors">
            Add
          </button>
        </div>
      </div>

      {/* permissions */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-50">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Permissions</p>
        </div>
        {[
          { label: "Process Queries",        on: true  },
          { label: "Escalate to State Admin", on: true  },
          { label: "Access Blockchain Logs",  on: true  },
          { label: "Manage AI Bots",          on: true  },
          { label: "Export Data",             on: false },
          { label: "User Management",         on: false },
        ].map(p => (
          <div key={p.label} className="flex items-center justify-between px-5 py-3 border-b border-stone-50 last:border-none">
            <p className="text-sm text-stone-700">{p.label}</p>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border
              ${p.on ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-50 text-stone-400 border-stone-200"}`}>
              {p.on ? "Granted" : "Restricted"}
            </span>
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="flex flex-col gap-2">
        {[
          { label: "Download activity report", cls: "text-stone-700 bg-white border-stone-200 hover:border-stone-300" },
          { label: "Change password",           cls: "text-stone-700 bg-white border-stone-200 hover:border-stone-300" },
          { label: "Sign out",                  cls: "text-rose-600 bg-rose-50 border-rose-100 hover:border-rose-300"  },
        ].map(a => (
          <button key={a.label} onClick={a.label === "Sign out" ? onSignOut : undefined} className={`w-full py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${a.cls}`}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════════════════ */
export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab]   = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queries, setQueries] = useState(QUERIES);

  useEffect(() => {
    const apps = getApplications().map((app) => ({
      id: app.id,
      citizen: app.formData?.fullName || "Citizen",
      dept: app.category || "General",
      subject: app.schemeName,
      status: app.status || "Pending",
      priority: "medium",
      filed: app.filed || "-",
      district: app.state || "-",
      doc: Boolean(app.uploadedFiles?.length),
      hash: app.id
    }));
    if (apps.length) setQueries(apps);
  }, []);

  const panels = {
    overview:   <OverviewPanel setActiveTab={setActiveTab} queries={queries} />,
    queries:    <QueriesPanel initialQueries={queries} />,
    bots:       <BotsPanel />,
    blockchain: <BlockchainPanel />,
    profile:    <ProfilePanel onSignOut={onSignOut} />,
  };

  const pendingCount = queries.filter(q => q.status === "Pending").length;
  const escalated    = queries.filter(q => q.status === "Escalated").length;

  return (
    <div className="bg-stone-50 min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <FontLink />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .font-serif { font-family: 'Lora', serif !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 9999px; }
      `}</style>

      <div className="flex h-screen overflow-hidden">

        {/* ── SIDEBAR ── */}
        <motion.aside
          className={`bg-white border-r border-stone-100 flex flex-col z-40
            fixed inset-y-0 left-0 w-64
            lg:relative lg:translate-x-0 lg:flex
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* logo */}
          <div className="h-16 flex items-center px-6 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center">
                <ShieldIcon />
              </div>
              <span className="font-serif text-lg font-medium tracking-tight">
                Saathi<span className="text-emerald-700">Admin</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto w-7 h-7 flex items-center justify-center text-stone-400 cursor-pointer bg-transparent border-none text-xl">×</button>
          </div>

          {/* admin mini card */}
          <div className="px-4 py-4 border-b border-stone-50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white text-sm font-serif font-medium flex items-center justify-center shrink-0">
                {ADMIN.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{ADMIN.name}</p>
                <p className="text-xs text-stone-400 truncate">{ADMIN.dept}</p>
              </div>
            </div>
          </div>

          {/* nav */}
          <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-none text-left
                  ${activeTab === item.id
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-stone-500 bg-transparent hover:bg-stone-50 hover:text-stone-800"
                  }`}
              >
                <span className={activeTab === item.id ? "text-emerald-200" : "text-stone-400"}>{item.icon}</span>
                {item.label}
                {item.id === "queries" && pendingCount > 0 && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full
                    ${activeTab === item.id ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                    {pendingCount}
                  </span>
                )}
                {item.id === "queries" && escalated > 0 && activeTab !== item.id && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 ml-1" />
                )}
              </button>
            ))}
          </nav>

          {/* bottom */}
          <div className="p-4 border-t border-stone-100 shrink-0">
            <div className="bg-stone-900 rounded-xl p-3">
              <p className="text-xs font-semibold text-white mb-0.5">System Status</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-xs text-stone-400">All services operational</p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* topbar */}
          <header className="h-16 bg-white border-b border-stone-100 flex items-center px-5 sm:px-8 gap-4 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1 border border-stone-200 rounded-xl bg-white cursor-pointer shrink-0"
            >
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
            </button>

            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-800">
                {NAV.find(n => n.id === activeTab)?.label}
              </p>
              <p className="text-xs text-stone-400 hidden sm:block">SaathiSeva — Admin Panel · Bihar</p>
            </div>

            {/* alert badges */}
            <div className="hidden sm:flex items-center gap-2">
              {escalated > 0 && (
                <button onClick={() => setActiveTab("queries")}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {escalated} Escalated
                </button>
              )}
              {pendingCount > 0 && (
                <button onClick={() => setActiveTab("queries")}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {pendingCount} Pending
                </button>
              )}
            </div>

            {/* avatar */}
            <button
              onClick={() => setActiveTab("profile")}
              className="w-9 h-9 rounded-xl bg-emerald-700 text-white text-xs font-serif font-medium flex items-center justify-center cursor-pointer border-none hover:bg-emerald-800 transition-colors shrink-0"
            >
              {ADMIN.avatar}
            </button>
            <button
              onClick={onSignOut}
              className="hidden sm:block px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-medium cursor-pointer hover:border-rose-300 transition-colors"
            >
              Sign out
            </button>
          </header>

          {/* content */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-w-3xl mx-auto"
              >
                {panels[activeTab]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}