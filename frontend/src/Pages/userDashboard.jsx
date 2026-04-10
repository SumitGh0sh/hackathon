import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApplications } from "../utils/applications";

/* ── fonts ── */
const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
);

/* ── static data ── */
const USER = {
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  language: "हिंदी",
  aadhaar: "XXXX-XXXX-4521",
  state: "Bihar",
  district: "Patna",
  avatar: "RS",
};

const LANGUAGES = ["English","हिंदी","বাংলা","தமிழ்","తెలుగు","मराठी","ਪੰਜਾਬੀ","ગુજરાતી","ಕನ್ನಡ","മലയാളം"];

const CATEGORIES = [
  { label: "Identity & Aadhaar", sub: "Update, correction, linking",  icon: "⬡", color: "emerald" },
  { label: "Land & Property",    sub: "Registry, mutation, records",   icon: "⬢", color: "amber"   },
  { label: "Benefits & Welfare", sub: "Pensions, PM schemes, aid",     icon: "◈", color: "sky"     },
  { label: "Health & Insurance", sub: "Ayushman, hospital claims",     icon: "◎", color: "rose"    },
  { label: "Education",          sub: "Scholarships, admissions",      icon: "◇", color: "violet"  },
  { label: "Legal & Courts",     sub: "FIR, notices, hearings",        icon: "◆", color: "orange"  },
  { label: "Jobs & Business",    sub: "Licences, MSME, labour",        icon: "◉", color: "teal"    },
  { label: "Certificates",       sub: "Birth, death, marriage docs",   icon: "◐", color: "indigo"  },
];

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
  sky:     { bg: "bg-sky-50",     border: "border-sky-100",     text: "text-sky-700",     dot: "bg-sky-500"     },
  rose:    { bg: "bg-rose-50",    border: "border-rose-100",    text: "text-rose-700",    dot: "bg-rose-500"    },
  violet:  { bg: "bg-violet-50",  border: "border-violet-100",  text: "text-violet-700",  dot: "bg-violet-500"  },
  orange:  { bg: "bg-orange-50",  border: "border-orange-100",  text: "text-orange-700",  dot: "bg-orange-500"  },
  teal:    { bg: "bg-teal-50",    border: "border-teal-100",    text: "text-teal-700",    dot: "bg-teal-500"    },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
};

const ACTIVE_FORMS = [
  {
    id: 1,
    title: "Ration Card Application",
    category: "Benefits & Welfare",
    color: "sky",
    progress: 65,
    status: "In Progress",
    filed: "12 Mar 2025",
    steps: [
      { label: "Form Submitted",       done: true,  date: "12 Mar" },
      { label: "Documents Verified",   done: true,  date: "18 Mar" },
      { label: "Field Verification",   done: true,  date: "24 Mar" },
      { label: "Approval Pending",     done: false, date: "~5 Apr" },
      { label: "Card Issued",          done: false, date: "~15 Apr"},
    ],
  },
  {
    id: 2,
    title: "Ayushman Bharat Registration",
    category: "Health & Insurance",
    color: "rose",
    progress: 90,
    status: "Almost Done",
    filed: "2 Feb 2025",
    steps: [
      { label: "Application Filed",    done: true,  date: "2 Feb"  },
      { label: "Aadhaar Linked",       done: true,  date: "5 Feb"  },
      { label: "Income Verified",      done: true,  date: "10 Feb" },
      { label: "Card Printing",        done: true,  date: "20 Feb" },
      { label: "Card Dispatched",      done: false, date: "~12 Apr"},
    ],
  },
  {
    id: 3,
    title: "Land Mutation — Survey #441",
    category: "Land & Property",
    color: "amber",
    progress: 30,
    status: "Awaiting Docs",
    filed: "1 Apr 2025",
    steps: [
      { label: "Application Filed",    done: true,  date: "1 Apr"  },
      { label: "Notice Published",     done: false, date: "~20 Apr"},
      { label: "Objection Period",     done: false, date: "~30 Apr"},
      { label: "Officer Visit",        done: false, date: "~10 May"},
      { label: "Mutation Approved",    done: false, date: "~20 May"},
    ],
  },
];

const BOT_SUGGESTIONS = [
  "How do I apply for a ration card?",
  "What documents are needed for Ayushman Bharat?",
  "Check my land mutation status",
  "Old age pension eligibility",
];

const INITIAL_MESSAGES = [
  { role: "bot", text: "Namaste Rahul! 🙏 I'm your SaathiSeva assistant. I can help you understand government procedures, track your applications, and guide you step by step. What would you like help with today?" },
];

const BOT_REPLIES = {
  "How do I apply for a ration card?": "To apply for a Ration Card in Bihar:\n\n1. Visit your nearest Block Office or apply online at epds.bihar.gov.in\n2. Fill Form RC-1 with your family details\n3. Attach Aadhaar card (all members), income certificate, address proof\n4. Pay ₹0 — it's completely free\n5. Track your status using your acknowledgement number\n\nExpected time: 15–30 working days.",
  "What documents are needed for Ayushman Bharat?": "For Ayushman Bharat (PMJAY) registration you need:\n\n• Aadhaar card\n• Ration card or SECC data match\n• Mobile number linked to Aadhaar\n• Income certificate (if self-enrolled)\n\nCheck eligibility first at pmjay.gov.in with your mobile number. The card is issued free of cost.",
  "Check my land mutation status": "Based on your profile, I can see your Land Mutation application for Survey #441 was filed on 1 Apr 2025. Current status: Notice Publishing stage.\n\nNext step: A public notice will be published in ~10 days. Ensure no objections are filed during the 15-day objection period.",
  "Old age pension eligibility": "For Bihar Old Age Pension (Mukhyamantri Vridhajan Pension Yojna):\n\n• Age: 60+ years\n• Must be a Bihar resident\n• Annual income < ₹1 lakh\n• Not receiving any other pension\n\nPension amount: ₹400/month (60-79 yrs), ₹500/month (80+ yrs). Apply at your nearest Block Development Office.",
};

/* ── nav items ── */
const NAV = [
  { id: "overview",   label: "Overview",   icon: <GridIcon /> },
  { id: "procedures", label: "Procedures", icon: <ListIcon /> },
  { id: "forms",      label: "My Forms",   icon: <DocIcon />  },
  { id: "chatbot",    label: "AI Assistant",icon: <BotIcon /> },
  { id: "profile",    label: "Profile",    icon: <UserIcon /> },
];

function GridIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>;
}
function ListIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M5 4h9M5 8h9M5 12h9M2 4h.5M2 8h.5M2 12h.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function DocIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10 1v3.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function BotIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><rect x="2" y="5" width="12" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5V2.5M6.5 2.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="5.5" cy="9.5" r="1" fill="currentColor"/><circle cx="10.5" cy="9.5" r="1" fill="currentColor"/><path d="M6 12.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function UserIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function MicIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 10a6 6 0 0 0 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 16v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function SendIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7l5 3 2 5 5-13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
}
function DownloadIcon() {
  return <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function SpeakerIcon() {
  return <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M3 5H1v4h2l4 3V2L3 5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M11 3a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9 5a2.5 2.5 0 0 1 0 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

/* ─────────── OVERVIEW PANEL ─────────── */
function OverviewPanel({ setActiveTab, forms }) {
  return (
    <div className="flex flex-col gap-6">
      {/* greeting */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <p className="text-emerald-200 text-xs font-medium uppercase tracking-widest mb-1">Good morning</p>
        <h2 className="font-serif text-2xl font-normal mb-1">Namaste, Rahul 🙏</h2>
        <p className="text-emerald-200 text-sm font-light">You have {forms.length} active applications.</p>
        <button
          onClick={() => setActiveTab("forms")}
          className="mt-4 bg-white/15 border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-xl cursor-pointer hover:bg-white/25 transition-colors">
          View My Forms →
        </button>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: "3", l: "Active Forms",     color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
          { n: "1", l: "Needs Attention",  color: "text-amber-700",   bg: "bg-amber-50 border-amber-100"   },
          { n: "8", l: "Procedures Saved", color: "text-sky-700",     bg: "bg-sky-50 border-sky-100"       },
        ].map(s => (
          <div key={s.l} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className={`font-serif text-3xl font-medium ${s.color}`}>{s.n}</p>
            <p className="text-xs text-stone-500 mt-1 leading-tight">{s.l}</p>
          </div>
        ))}
      </div>

      {/* recent forms */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Active Applications</p>
          <button onClick={() => setActiveTab("forms")} className="text-xs text-emerald-700 cursor-pointer bg-transparent border-none font-medium">View all</button>
        </div>
        <div className="flex flex-col gap-2">
          {forms.map(f => {
            const c = COLOR_MAP[f.color];
            return (
              <div key={f.id} className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className={`text-sm font-medium ${c.text}`}>{f.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{f.category}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${c.bg} ${c.text} ${c.border} shrink-0`}>{f.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/70 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.progress}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className={`h-full rounded-full ${c.dot}`} />
                  </div>
                  <span className={`text-xs font-medium ${c.text}`}>{f.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* quick actions */}
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Ask AI Assistant", tab: "chatbot", icon: <BotIcon /> },
            { label: "Browse Procedures", tab: "procedures", icon: <ListIcon /> },
          ].map(a => (
            <button key={a.label} onClick={() => setActiveTab(a.tab)}
              className="flex items-center gap-2 p-3.5 bg-white border border-stone-100 rounded-xl cursor-pointer hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200 text-sm text-stone-700 font-medium">
              <span className="text-emerald-700">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── PROCEDURES PANEL ─────────── */
function ProceduresPanel() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div className="mb-5">
        <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-1">Browse by category</p>
        <h2 className="font-serif text-2xl font-normal text-stone-900">Find your procedure</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const c = COLOR_MAP[cat.color];
          const isSelected = selected === cat.label;
          return (
            <motion.div
              key={cat.label}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(isSelected ? null : cat.label)}
              className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200
                ${isSelected ? `${c.bg} ${c.border} shadow-md` : "bg-white border-stone-100 hover:border-stone-200"}`}
            >
              <span className={`text-xl block mb-2 ${c.text}`}>{cat.icon}</span>
              <p className={`text-sm font-medium mb-0.5 ${isSelected ? c.text : "text-stone-800"}`}>{cat.label}</p>
              <p className="text-xs text-stone-400 leading-relaxed">{cat.sub}</p>
              {isSelected && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`text-xs font-medium mt-2 ${c.text}`}>
                  Explore →
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 bg-stone-900 text-white rounded-2xl p-5"
          >
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Selected Procedure</p>
            <p className="font-serif text-lg font-normal mb-3">{selected}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-emerald-700 rounded-xl text-xs font-medium cursor-pointer border-none hover:bg-emerald-600 transition-colors">
                Start Procedure
              </button>
              <button className="flex-1 py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs font-medium cursor-pointer hover:bg-white/20 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── FORM CARD with TIMELINE ─────────── */
function FormCard({ form }) {
  const [open, setOpen] = useState(false);
  const c = COLOR_MAP[form.color];
  return (
    <div className={`rounded-2xl border overflow-hidden ${c.bg} ${c.border}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className={`text-sm font-semibold ${c.text}`}>{form.title}</p>
            <p className="text-xs text-stone-400 mt-0.5">Filed {form.filed} · {form.category}</p>
          </div>
          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${c.bg} ${c.text} ${c.border}`}>
            {form.status}
          </span>
        </div>

        {/* progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-stone-500">Progress</p>
            <p className={`text-xs font-semibold ${c.text}`}>{form.progress}%</p>
          </div>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${form.progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${c.dot}`}
            />
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(o => !o)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer border transition-colors
              ${open ? `${c.text} ${c.border} bg-white/60` : `bg-white/50 border-white/60 text-stone-600 hover:${c.text}`}`}>
            {open ? "Hide Timeline" : "View Timeline"}
          </button>
          <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border-none ${c.text} bg-white/60 hover:bg-white transition-colors`}>
            <DownloadIcon /> Download
          </button>
        </div>
      </div>

      {/* timeline */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/40 pt-4">
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Application Timeline</p>
              <div className="relative">
                {/* vertical line */}
                <div className="absolute left-2 top-2 bottom-2 w-px bg-stone-200" />
                <div className="flex flex-col gap-4">
                  {form.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 pl-1">
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 z-10 flex items-center justify-center
                        ${step.done
                          ? `${c.dot} border-transparent`
                          : "bg-white border-stone-300"
                        }`}>
                        {step.done && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${step.done ? "text-stone-800" : "text-stone-400"}`}>{step.label}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── FORMS PANEL ─────────── */
function FormsPanel({ forms }) {
  return (
    <div>
      <div className="mb-5">
        <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-1">Your Applications</p>
        <h2 className="font-serif text-2xl font-normal text-stone-900">Track & Download</h2>
      </div>
      <div className="flex flex-col gap-4">
        {forms.map(f => <FormCard key={f.id} form={f} />)}
      </div>
    </div>
  );
}

/* ─────────── CHATBOT PANEL ─────────── */
function ChatbotPanel() {
  const [messages, setMessages]   = useState(INITIAL_MESSAGES);
  const [input, setInput]         = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(null);
  const [lang, setLang]           = useState("English");
  const bottomRef                 = useRef(null);
  const recogRef                  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    const reply = BOT_REPLIES[text] || "I'm looking into that for you. This procedure typically involves visiting your nearest government office. Would you like me to find the exact steps?";
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const botMsg = { role: "bot", text: reply };
      setMessages(m => [...m, botMsg]);
      speakText(reply);
    }, 900);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text.replace(/\n/g, " "));
    utter.lang = lang === "हिंदी" ? "hi-IN" : "en-IN";
    utter.rate = 0.95;
    setSpeaking(text);
    utter.onend = () => setSpeaking(null);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const recog = new SR();
    recog.lang = lang === "हिंदी" ? "hi-IN" : "en-IN";
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recog.onerror = () => setListening(false);
    recog.onend   = () => setListening(false);
    recogRef.current = recog;
    recog.start();
    setListening(true);
  };

  return (
    <div className="flex flex-col h-full" style={{ height: "calc(100vh - 180px)", minHeight: 500 }}>
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-0.5">AI Assistant</p>
          <h2 className="font-serif text-2xl font-normal text-stone-900">SaathiBot</h2>
        </div>
        {/* lang selector */}
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white text-stone-700 outline-none cursor-pointer focus:border-emerald-400">
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
          {speaking && (
            <button
              onClick={stopSpeaking}
              className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors">
              <SpeakerIcon />
            </button>
          )}
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 mb-4" style={{ scrollbarWidth: "thin" }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M7 4V2M5.5 2h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="4.5" cy="8" r="0.8" fill="currentColor"/>
                  <circle cx="9.5" cy="8" r="0.8" fill="currentColor"/>
                </svg>
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
              ${msg.role === "user"
                ? "bg-emerald-700 text-white rounded-br-sm"
                : "bg-white border border-stone-100 text-stone-800 rounded-bl-sm shadow-sm"
              }`}>
              {msg.text}
              {msg.role === "bot" && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 cursor-pointer bg-transparent border-none p-0 hover:text-emerald-800 transition-colors">
                  <SpeakerIcon /> Listen
                </button>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "none" }}>
        {BOT_SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)}
            className="shrink-0 text-xs px-3 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-100 transition-colors whitespace-nowrap">
            {s}
          </button>
        ))}
      </div>

      {/* input bar */}
      <div className={`flex items-center gap-2 bg-white border rounded-2xl px-3 py-2 transition-all duration-200
        ${listening ? "border-rose-400 shadow-[0_0_0_3px_rgba(251,113,133,0.15)]" : "border-stone-200 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(52,211,153,0.1)]"}`}>

        {/* mic button */}
        <motion.button
          onClick={toggleMic}
          whileTap={{ scale: 0.92 }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer border-none transition-all duration-200
            ${listening
              ? "bg-rose-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              : "bg-stone-100 text-stone-500 hover:bg-emerald-50 hover:text-emerald-700"
            }`}>
          {listening
            ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}><MicIcon active /></motion.div>
            : <MicIcon />
          }
        </motion.button>

        {listening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 mr-1">
            {[0,1,2,3].map(i => (
              <motion.div
                key={i}
                className="w-1 bg-rose-400 rounded-full"
                animate={{ height: ["6px","16px","6px"] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
        )}

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder={listening ? "Listening…" : "Ask about any government procedure…"}
          className="flex-1 bg-transparent border-none outline-none text-sm text-stone-800 placeholder:text-stone-300"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer border-none transition-all duration-200
            ${input.trim() ? "bg-emerald-700 text-white hover:bg-emerald-800" : "bg-stone-100 text-stone-300"}`}>
          <SendIcon />
        </motion.button>
      </div>

      {listening && (
        <p className="text-center text-xs text-rose-500 mt-2 font-medium animate-pulse">
          🎙 Listening… speak now
        </p>
      )}
    </div>
  );
}

/* ─────────── PROFILE PANEL ─────────── */
function ProfilePanel({ onSignOut }) {
  const [lang, setLang] = useState(USER.language);
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* avatar card */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center font-serif text-2xl font-medium">
            {USER.avatar}
          </div>
          <div>
            <h2 className="font-serif text-xl font-normal">{USER.name}</h2>
            <p className="text-stone-400 text-sm mt-0.5">{USER.phone}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-xs text-emerald-400">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* details */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-50">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Personal Details</p>
          <button
            onClick={() => setEditing(e => !e)}
            className="text-xs text-emerald-700 font-medium cursor-pointer bg-transparent border-none">
            {editing ? "Save" : "Edit"}
          </button>
        </div>
        {[
          { label: "Aadhaar",  value: USER.aadhaar  },
          { label: "State",    value: USER.state    },
          { label: "District", value: USER.district },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3.5 border-b border-stone-50 last:border-none">
            <p className="text-xs text-stone-400">{row.label}</p>
            {editing
              ? <input defaultValue={row.value} className="text-sm text-stone-800 text-right outline-none border-b border-emerald-300 bg-transparent w-40" />
              : <p className="text-sm text-stone-800 font-medium">{row.value}</p>
            }
          </div>
        ))}
      </div>

      {/* language preference */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5">
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-4">Language Preference</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-xs px-3.5 py-2 rounded-full border cursor-pointer transition-all duration-200 font-medium
                ${lang === l
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-stone-50 text-stone-500 border-stone-200 hover:border-emerald-300 hover:text-emerald-700"
                }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-col gap-2">
        {[
          { label: "Download all documents", color: "text-stone-700 bg-white border-stone-200 hover:border-stone-300", action: null },
          { label: "Privacy & Data settings", color: "text-stone-700 bg-white border-stone-200 hover:border-stone-300", action: null },
          { label: "Sign out", color: "text-rose-600 bg-rose-50 border-rose-100 hover:border-rose-300", action: onSignOut },
        ].map(a => (
          <button
            key={a.label}
            onClick={a.action || undefined}
            className={`w-full py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${a.color}`}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────── MAIN DASHBOARD ─────────── */
export default function Dashboard({ onSignOut, auth }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forms, setForms] = useState(ACTIVE_FORMS);

  useEffect(() => {
    const apps = getApplications()
      .filter((app) => !auth?.userId || app.userId === auth.userId)
      .map((app, idx) => ({
        id: app.id,
        title: app.schemeName,
        category: app.category || "General",
        color: ["sky", "rose", "amber", "emerald"][idx % 4],
        progress: app.progress || 20,
        status: app.status || "Pending",
        filed: app.filed || "-",
        steps: app.timeline || []
      }));
    if (apps.length) setForms(apps);
  }, [auth?.userId]);

  const panels = {
    overview:   <OverviewPanel setActiveTab={setActiveTab} forms={forms} />,
    procedures: <ProceduresPanel />,
    forms:      <FormsPanel forms={forms} />,
    chatbot:    <ChatbotPanel />,
    profile:    <ProfilePanel onSignOut={onSignOut} />,
  };

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
            <span className="font-serif text-lg font-medium tracking-tight">
              Saathi<span className="text-emerald-700">Seva</span>
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto w-7 h-7 flex items-center justify-center text-stone-400 cursor-pointer bg-transparent border-none text-lg">
              ×
            </button>
          </div>

          {/* user mini */}
          <div className="px-4 py-4 border-b border-stone-50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white text-xs font-serif font-medium flex items-center justify-center shrink-0">
                {USER.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{USER.name}</p>
                <p className="text-xs text-stone-400 truncate">{USER.language}</p>
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
                  }`}>
                <span className={activeTab === item.id ? "text-emerald-200" : "text-stone-400"}>
                  {item.icon}
                </span>
                {item.label}
                {item.id === "forms" && (
                  <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                    ${activeTab === item.id ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                    3
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* bottom help */}
          <div className="p-4 border-t border-stone-100 shrink-0">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-xs font-medium text-emerald-800 mb-0.5">Need help?</p>
              <p className="text-xs text-emerald-600 leading-relaxed">Call 1800-XXX-XXXX (toll free)</p>
            </div>
          </div>
        </motion.aside>

        {/* overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* topbar */}
          <header className="h-16 bg-white border-b border-stone-100 flex items-center px-5 sm:px-8 gap-4 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1 border border-stone-200 rounded-xl bg-white cursor-pointer shrink-0">
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
            </button>

            <div className="flex-1">
              <p className="text-sm font-medium text-stone-800 capitalize">
                {NAV.find(n => n.id === activeTab)?.label}
              </p>
              <p className="text-xs text-stone-400 hidden sm:block">
                {activeTab === "chatbot" ? "Voice & text enabled · Ask anything" : "SaathiSeva Dashboard"}
              </p>
            </div>

            {/* chatbot shortcut */}
            {activeTab !== "chatbot" && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab("chatbot")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-xs font-medium rounded-xl cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                style={{ boxShadow: "0 4px 14px rgba(5,150,105,0.3)" }}>
                <BotIcon /> Ask AI
              </motion.button>
            )}

            {/* profile avatar */}
            <button
              onClick={() => setActiveTab("profile")}
              className="w-9 h-9 rounded-xl bg-emerald-700 text-white text-xs font-serif font-medium flex items-center justify-center cursor-pointer border-none hover:bg-emerald-800 transition-colors shrink-0">
              {USER.avatar}
            </button>
            <button
              onClick={onSignOut}
              className="hidden sm:block px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-medium cursor-pointer hover:border-rose-300 transition-colors"
            >
              Sign out
            </button>
          </header>

          {/* scrollable content */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-w-2xl mx-auto"
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