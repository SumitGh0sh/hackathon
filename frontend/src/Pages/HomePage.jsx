import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─── typing hook ─────────────────────────────────────────────── */
function useTyping(words, speed = 70, pause = 1800) {
  const [text, setText] = useState("");
  const [wi, setWi]     = useState(0);
  const [ci, setCi]     = useState(0);
  const [del, setDel]   = useState(false);
  useEffect(() => {
    const w = words[wi];
    const id = setTimeout(() => {
      if (!del) {
        if (ci < w.length) { setText(w.slice(0, ci + 1)); setCi(c => c + 1); }
        else setTimeout(() => setDel(true), pause);
      } else {
        if (ci > 0) { setText(w.slice(0, ci - 1)); setCi(c => c - 1); }
        else { setDel(false); setWi(i => (i + 1) % words.length); }
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(id);
  }, [ci, del, wi, words, pause, speed]);
  return text;
}

/* ─── scroll reveal ───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── data ────────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Identity & Aadhaar",  sub: "Update, correction, linking",   icon: "⬡" },
  { label: "Land & Property",     sub: "Registry, mutation, records",    icon: "⬢" },
  { label: "Benefits & Welfare",  sub: "Pensions, PM schemes, aid",      icon: "◈" },
  { label: "Health & Insurance",  sub: "Ayushman, hospital claims",      icon: "◎" },
  { label: "Education",           sub: "Scholarships, admissions",       icon: "◇" },
  { label: "Legal & Courts",      sub: "FIR, notices, hearings",         icon: "◆" },
  { label: "Jobs & Business",     sub: "Licences, MSME, labour",         icon: "◉" },
  { label: "Certificates",        sub: "Birth, death, marriage docs",    icon: "◐" },
];

const SERVICES_DATA = {
  "PAN Card": {
    cost: 110,
    time: "7 days",
    documents: ["Aadhaar Card", "Photo"],
    difficulty: "Easy",
    fees: { government: 93, service: 17 },
    tips: ["Apply online to avoid queues", "Keep Aadhaar updated"],
    successRate: "98%"
  },
  "Passport": {
    cost: 1500,
    time: "15-30 days",
    documents: ["Aadhaar", "Birth Certificate", "Photo", "Address Proof"],
    difficulty: "Medium",
    fees: { government: 1500, service: 0 },
    tips: ["Book appointment in advance", "Get police verification done early"],
    successRate: "95%"
  },
  "Driving License": {
    cost: 200,
    time: "7-14 days",
    documents: ["Aadhaar", "Medical Certificate", "Address Proof"],
    difficulty: "Easy",
    fees: { government: 200, service: 0 },
    tips: ["Complete driving test beforehand", "Choose RTO with less crowd"],
    successRate: "92%"
  },
  "Birth Certificate": {
    cost: 50,
    time: "3-7 days",
    documents: ["Hospital Certificate", "Parent ID", "Address Proof"],
    difficulty: "Easy",
    fees: { government: 50, service: 0 },
    tips: ["Apply at local municipal office", "Keep all medical records ready"],
    successRate: "99%"
  }
};

const CENTERS_DATA = [
  {
    name: "CSC Center - Village Hub",
    distance: "1.2 km",
    address: "Near Post Office, Village Main Road, Maharashtra",
    status: "Open",
    services: ["PAN", "Aadhaar", "Ration"],
    rating: 4.5,
    waitingTime: "15 mins",
    verified: true,
    type: "CSC",
    phone: "+91 98765 43210"
  },
  {
    name: "Government Office - Tehsil",
    distance: "2.8 km",
    address: "Tehsil Building, District Road, Maharashtra",
    status: "Open",
    services: ["Passport", "Driving License", "Certificates"],
    rating: 4.2,
    waitingTime: "30 mins",
    verified: true,
    type: "Government",
    phone: "+91 98765 43211"
  },
  {
    name: "Authorized Agent - Sharma Services",
    distance: "3.5 km",
    address: "Shop No. 12, Market Complex, Maharashtra",
    status: "Closed",
    services: ["PAN", "Aadhaar"],
    rating: 3.8,
    waitingTime: "N/A",
    verified: false,
    type: "Agent",
    phone: "+91 98765 43212"
  },
  {
    name: "CSC Center - Digital Seva",
    distance: "4.1 km",
    address: "Opposite Bank, Main Street, Maharashtra",
    status: "Open",
    services: ["PAN", "Passport", "Driving License"],
    rating: 4.7,
    waitingTime: "10 mins",
    verified: true,
    type: "CSC",
    phone: "+91 98765 43213"
  }
];

const STEPS = [
  { n: "01", title: "Upload or Search",    body: "Drop a government notice or describe your situation in plain words — any language works." },
  { n: "02", title: "AI Reads & Decodes", body: "Our engine strips bureaucratic jargon and maps exactly what the document demands of you." },
  { n: "03", title: "Follow Your Steps",  body: "A clear checklist shows which documents to gather, which office to visit, and in what order." },
];

const LANGUAGES = ["हिंदी","English","বাংলা","தமிழ்","తెలుగు","मराठी","ਪੰਜਾਬੀ","ગુજરાતી","ಕನ್ನಡ","മലയാളം"];
const PLACEHOLDERS = [
  "Apply for a ration card…",
  "Understand my land notice…",
  "Claim old age pension…",
  "Register for PM Kisan…",
  "Get a birth certificate…",
];

/* ─── auth modal ──────────────────────────────────────────────── */
function AuthModal({ open, onClose, mode, setMode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: "rgba(16,13,8,0.55)", backdropFilter: "blur(10px)" }}
          onClick={onClose}>
          <motion.div
            className="bg-white rounded-3xl w-full max-w-sm p-8 relative"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)" }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}>

            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center text-lg transition-colors bg-transparent cursor-pointer">
              ×
            </button>

            {/* tab */}
            <div className="flex bg-stone-100 rounded-xl p-1 mb-7">
              {["Login", "Register"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-[10px] text-sm font-medium transition-all duration-200 border-none cursor-pointer ${
                    mode === m ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 bg-transparent hover:text-stone-600"
                  }`}>
                  {m}
                </button>
              ))}
            </div>

            <h2 className="font-serif text-2xl font-normal text-stone-800 mb-1.5">
              {mode === "Login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-stone-400 mb-7 leading-relaxed">
              {mode === "Login"
                ? "Sign in to access your saved procedures."
                : "Join thousands getting clarity on government forms."}
            </p>

            <div className="flex flex-col gap-4">
              {mode === "Register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-stone-500 tracking-wide">Full name</label>
                  <input placeholder="Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-300 bg-white" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-stone-500 tracking-wide">Mobile or email</label>
                <input placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-300 bg-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-stone-500 tracking-wide">Password</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-300 bg-white" />
              </div>
              {mode === "Register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-stone-500 tracking-wide">Preferred language</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white">
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl bg-emerald-700 text-white text-sm font-medium mt-1 cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                style={{ boxShadow: "0 4px 20px rgba(5,150,105,0.35)" }}>
                {mode === "Login" ? "Sign in" : "Create account"}
              </motion.button>
            </div>

            <p className="text-center text-xs text-stone-400 mt-5">
              {mode === "Login" ? "No account? " : "Have an account? "}
              <button
                onClick={() => setMode(mode === "Login" ? "Register" : "Login")}
                className="text-emerald-700 font-medium border-none bg-transparent cursor-pointer text-xs">
                {mode === "Login" ? "Register" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── main ────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [query,     setQuery]     = useState("");
  const [langOpen,  setLangOpen]  = useState(false);
  const [selLang,   setSelLang]   = useState("English");
  const [modal,     setModal]     = useState(false);
  const [mode,      setMode]      = useState("Login");
  const [mobileNav, setMobileNav] = useState(false);
  const typed = useTyping(PLACEHOLDERS);

  // Estimator state
  const [estimatorQuery, setEstimatorQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Apply Near You state
  const [locationQuery, setLocationQuery] = useState("");
  const [nearbyCenters, setNearbyCenters] = useState([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("5km");
  const [selectedRating, setSelectedRating] = useState("All");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("All");
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY, [0, 60],
    ["0 0 0 rgba(0,0,0,0)", "0 2px 24px rgba(0,0,0,0.07)"]);

  const openLogin = () => { setMode("Login");    setModal(true); };
  const openReg   = () => { setMode("Register"); setModal(true); };

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Lora', serif !important; }
        ::placeholder { color: #c0bbb4; }

        .card-lift {
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.07);
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s;
        }
        .card-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08), 0 24px 56px rgba(0,0,0,0.12);
        }
        .step-lift {
          box-shadow: 0 2px 6px rgba(0,0,0,0.04), 0 12px 36px rgba(0,0,0,0.08);
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s;
        }
        .step-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08), 0 28px 64px rgba(0,0,0,0.12);
        }
        .hero-card {
          box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 20px 56px rgba(0,0,0,0.1);
        }
        .search-shadow {
          box-shadow: 0 4px 8px rgba(0,0,0,0.05), 0 16px 44px rgba(0,0,0,0.09);
        }
        .upload-box {
          box-shadow: 0 4px 12px rgba(0,0,0,0.04), 0 16px 44px rgba(0,0,0,0.08);
          transition: box-shadow 0.25s, border-color 0.25s;
        }
        .upload-box:hover {
          box-shadow: 0 8px 24px rgba(5,150,105,0.1), 0 24px 56px rgba(5,150,105,0.09);
          border-color: #059669;
        }
        .lang-pill {
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s;
        }
        .lang-pill:hover {
          background: #065f46;
          color: white;
          border-color: #065f46;
          box-shadow: 0 4px 16px rgba(6,95,70,0.3);
          transform: translateY(-2px);
        }
        .btn-shadow { box-shadow: 0 4px 14px rgba(5,150,105,0.32); }
        .btn-shadow:hover { box-shadow: 0 6px 20px rgba(5,150,105,0.42); }
      `}</style>

      <AuthModal open={modal} onClose={() => setModal(false)} mode={mode} setMode={setMode} />

      {/* ══ NAVBAR ════════════════════════════════════════════════ */}
      <motion.nav
        style={{ boxShadow: navShadow }}
        className="fixed top-0 left-0 right-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* logo */}
          <motion.span
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="font-serif text-xl font-medium shrink-0 cursor-pointer tracking-tight">
            Saathi<span className="text-emerald-700">Seva</span>
          </motion.span>

          {/* desktop center links */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-8">
            {["Procedures", "Upload", "About"].map(item => (
              <a key={item} href="#"
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors no-underline">
                {item}
              </a>
            ))}
          </motion.div>

          {/* right side */}
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-3">

            {/* language picker */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-700 cursor-pointer hover:border-stone-300 transition-colors"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                {selLang}
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-[calc(100%+8px)] right-0 bg-white border border-stone-100 rounded-2xl p-1.5 w-36 z-50"
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                    {LANGUAGES.map(l => (
                      <button key={l} onClick={() => { setSelLang(l); setLangOpen(false); }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-xs cursor-pointer border-none transition-colors ${
                          selLang === l
                            ? "bg-emerald-50 text-emerald-800 font-medium"
                            : "text-stone-700 hover:bg-stone-50 bg-transparent"
                        }`}>
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* login */}
            <button onClick={openLogin}
              className="hidden sm:block text-sm border border-stone-200 rounded-xl px-4 py-2 bg-white text-stone-700 cursor-pointer hover:border-emerald-600 hover:text-emerald-700 transition-colors font-medium"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              Login
            </button>

            {/* register */}
            <button onClick={openReg}
              className="btn-shadow text-sm rounded-xl px-4 py-2 bg-emerald-700 text-white cursor-pointer font-medium hover:bg-emerald-800 transition-colors border-none">
              Register
            </button>

            {/* hamburger */}
            <button onClick={() => setMobileNav(o => !o)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1 border border-stone-200 rounded-xl bg-white cursor-pointer">
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
              <span className="w-4 h-px bg-stone-700 block rounded-full" />
            </button>
          </motion.div>
        </div>

        {/* mobile dropdown */}
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-100 overflow-hidden">
              <div className="px-5 py-4 flex flex-col gap-0.5">
                {["Procedures", "Upload", "About"].map(item => (
                  <a key={item} href="#"
                    className="py-3 border-b border-stone-100 text-sm text-stone-600 no-underline hover:text-stone-900 transition-colors block">
                    {item}
                  </a>
                ))}
                <div className="flex gap-3 pt-4">
                  <button onClick={openLogin}
                    className="flex-1 py-3 border border-stone-200 rounded-xl text-sm text-stone-700 cursor-pointer bg-white">
                    Login
                  </button>
                  <button onClick={openReg}
                    className="flex-1 py-3 rounded-xl text-sm text-white cursor-pointer bg-emerald-700 border-none">
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        {/* ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-[480px] sm:h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.11) 0%, transparent 70%)", transform: "translate(25%,-25%)" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-96 sm:h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(214,211,208,0.55) 0%, transparent 70%)", transform: "translate(-25%,25%)" }} />

        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* left */}
            <div className="max-w-xl w-full">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-7">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                <span className="text-xs text-emerald-700 font-medium tracking-wide">Available in 12 regional languages</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.1] tracking-tight mb-5 text-stone-900">
                Government forms,<br />
                <em className="text-emerald-700" style={{ fontStyle: "italic" }}>finally clear.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }}
                className="text-base sm:text-lg text-stone-500 leading-[1.75] mb-9 max-w-md font-light">
                Upload any government document or describe your situation — our AI decodes the language and walks you through every step, in your language.
              </motion.p>

              {/* search bar */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26 }}
                className="search-shadow flex items-center bg-white border border-stone-200 rounded-2xl pl-4 pr-1.5 py-1.5 mb-5 w-full max-w-lg">
                <svg className="w-4 h-4 text-stone-300 shrink-0 mr-3" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder={typed}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-stone-800" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-shadow shrink-0 bg-emerald-700 text-white text-sm font-medium rounded-xl px-5 py-3 cursor-pointer border-none hover:bg-emerald-800 transition-colors">
                  Search
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-3">
                <button
                  className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer hover:border-emerald-600 hover:text-emerald-700 transition-colors"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v9M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 13h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  Upload document
                </button>
                <span className="text-stone-300 text-sm">or</span>
                <button className="flex items-center gap-2 text-sm text-stone-500 cursor-pointer bg-transparent border-none hover:text-emerald-700 transition-colors p-0">
                  <span className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-700" viewBox="0 0 14 14" fill="none">
                      <rect x="4" y="1" width="6" height="8" rx="3" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M2 7.5a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M7 12.5v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                  Speak your problem
                </button>
              </motion.div>
            </div>

            {/* right — floating card mockup */}
            <motion.div
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block relative h-[380px]">

              {/* main image */}
              <div className="hero-card absolute inset-x-8 top-0 bottom-12 rounded-3xl overflow-hidden border border-stone-100">
                <img src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80"
                  alt="Office guidance" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,9,6,0.35), transparent)" }} />
              </div>

              {/* floating step pill */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 left-0 bg-white rounded-2xl px-5 py-4 border border-stone-100 min-w-[210px]"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.13)" }}>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">Processing</p>
                <p className="text-sm font-medium text-stone-800 mb-2.5">Ration Card Application</p>
                <div className="flex gap-1.5">
                  {["Step 1","Step 2","Step 3"].map((s,i) => (
                    <span key={s}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        i === 0 ? "bg-emerald-700 text-white" : "bg-stone-100 text-stone-400"
                      }`}>
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* floating language badge */}
              <motion.div
                animate={{ y: [0, 7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 right-0 bg-white rounded-2xl px-4 py-3 border border-stone-100"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.11)" }}>
                <p className="text-[10px] text-stone-400 mb-0.5">Available in</p>
                <p className="text-sm font-medium text-stone-800">12 Languages</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ═════════════════════════════════════════════ */}
      <Reveal>
        <div className="border-y border-stone-100 bg-white py-5">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-10 gap-y-3">
              {[["50,000+","Citizens helped"],["12","Regional languages"],["200+","Procedures covered"],["Free","Always & forever"]].map(([n, l]) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="font-serif text-xl text-emerald-700 font-medium">{n}</span>
                  <span className="text-sm text-stone-400">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal className="mb-12 sm:mb-16">
            <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-3">How it works</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-snug">
              Three steps to clarity
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="step-lift bg-white rounded-3xl p-8 relative overflow-hidden cursor-default border border-stone-100">
                  <span className="absolute top-5 right-6 font-serif text-7xl text-stone-100 leading-none select-none">
                    {s.n}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 text-xl mb-7">
                    {i === 0 ? "↑" : i === 1 ? "◈" : "→"}
                  </div>
                  <h3 className="text-base font-medium text-stone-800 mb-3">{s.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-light">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COST & TIME ESTIMATOR ═══════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-50/50 to-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal className="text-center mb-12 sm:mb-16">
            <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-3">Cost & Time Estimator</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-snug mb-4">
              Know your cost & time instantly
            </h2>
            <p className="text-base sm:text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto font-light">
              Get transparent estimates for fees and processing time before you apply
            </p>
          </Reveal>

          {/* Input Section */}
          <Reveal delay={0.1} className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Search Bar */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">Service</label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" viewBox="0 0 18 18" fill="none">
                        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text"
                        value={estimatorQuery}
                        onChange={(e) => setEstimatorQuery(e.target.value)}
                        placeholder="Search service (e.g. PAN Card, Passport, Driving License)"
                        className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                      />
                    </div>
                  </div>

                  {/* State Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                    >
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Uttar Pradesh</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                      <option>West Bengal</option>
                    </select>
                  </div>
                </div>

                {/* Urgent Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-stone-700">Processing Type:</label>
                    <div className="flex bg-stone-100 rounded-lg p-1">
                      <button
                        onClick={() => setIsUrgent(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          !isUrgent ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setIsUrgent(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          isUrgent ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"
                        }`}
                      >
                        Urgent
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        const service = Object.keys(SERVICES_DATA).find(s =>
                          s.toLowerCase().includes(estimatorQuery.toLowerCase())
                        );
                        setSelectedService(service ? SERVICES_DATA[service] : null);
                        setIsLoading(false);
                      }, 1000);
                    }}
                    className="bg-emerald-700 text-white text-sm font-medium rounded-xl px-6 py-3 cursor-pointer border-none hover:bg-emerald-800 transition-colors shadow-md"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Estimating...
                      </div>
                    ) : (
                      "Get Estimate"
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results Section */}
          <AnimatePresence>
            {selectedService && (
              <Reveal delay={0.2}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-lg">
                    {/* Service Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-serif font-normal text-stone-900 mb-1">
                          {Object.keys(SERVICES_DATA).find(key => SERVICES_DATA[key] === selectedService)}
                        </h3>
                        <p className="text-sm text-stone-500">Estimate for {selectedState}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedService.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        selectedService.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedService.difficulty}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 20 20" fill="none">
                              <path d="M10 1v3m0 0l-3-3m3 3l3-3m-6 6h6m-6 4h6m-6 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Total Cost</p>
                            <p className="text-2xl font-serif font-normal text-emerald-800">₹{selectedService.cost}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-stone-600">Government Fees</span>
                            <span className="font-medium">₹{selectedService.fees.government}</span>
                          </div>
                          {selectedService.fees.service > 0 && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Service Charges</span>
                              <span className="font-medium">₹{selectedService.fees.service}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-700" viewBox="0 0 20 20" fill="none">
                              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M10 6v4l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Processing Time</p>
                            <p className="text-2xl font-serif font-normal text-blue-800">{selectedService.time}</p>
                          </div>
                        </div>
                        <p className="text-sm text-stone-600">
                          {isUrgent ? "Expedited processing applied" : "Standard processing time"}
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-700" viewBox="0 0 20 20" fill="none">
                              <path d="M7 3h6l2 4v10H5V7l2-4z" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M9 9h2m-2 3h2m-2 3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Documents Needed</p>
                            <p className="text-lg font-medium text-purple-800">{selectedService.documents.length} required</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {selectedService.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                              <span className="text-sm text-stone-600">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tips and Actions */}
                    <div className="border-t border-stone-100 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-stone-800 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-amber-600" viewBox="0 0 20 20" fill="none">
                              <path d="M10 2L13 6.5L18 7L14 11L15 16L10 13.5L5 16L6 11L2 7L7 6.5L10 2Z" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                            Tips to avoid delay
                          </h4>
                          <ul className="space-y-2">
                            {selectedService.tips.map((tip, index) => (
                              <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
                                <span className="text-emerald-600 mt-1">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-stone-800 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="none">
                              <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                            Success Rate: {selectedService.successRate}
                          </h4>
                          <p className="text-sm text-stone-600 mb-4">
                            Based on 750+ successful applications this month
                          </p>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-emerald-700 text-white text-sm font-medium rounded-xl px-6 py-2.5 cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                            >
                              Apply Now
                            </motion.button>
                            <button className="border border-stone-200 text-stone-600 text-sm rounded-xl px-6 py-2.5 cursor-pointer hover:border-emerald-500 hover:text-emerald-700 transition-colors bg-white">
                              Compare Services
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══ APPLY NEAR YOU ════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal className="text-center mb-12 sm:mb-16">
            <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-3">Apply Near You</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-snug mb-4">
              Apply near you
            </h2>
            <p className="text-base sm:text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto font-light">
              Find nearby centers where you can apply offline with assistance
            </p>
          </Reveal>

          {/* Location Input */}
          <Reveal delay={0.1} className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Use My Location Button */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Location Access</label>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsLocationLoading(true);
                        setTimeout(() => {
                          setNearbyCenters(CENTERS_DATA);
                          setIsLocationLoading(false);
                        }, 1500);
                      }}
                      className="w-full bg-emerald-700 text-white text-sm font-medium rounded-xl px-6 py-3 cursor-pointer border-none hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {isLocationLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Getting location...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                            <path d="M10 2.5C6.5 2.5 3.5 5.5 3.5 9C3.5 12.5 6.5 15.5 10 15.5C13.5 15.5 16.5 12.5 16.5 9C16.5 5.5 13.5 2.5 10 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="10" cy="9" r="2" fill="currentColor"/>
                          </svg>
                          Use my location
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Manual Search */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Or enter city / PIN code</label>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" viewBox="0 0 18 18" fill="none">
                        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        placeholder="Enter city or PIN code"
                        className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-stone-700">Distance:</label>
                      <select
                        value={selectedDistance}
                        onChange={(e) => setSelectedDistance(e.target.value)}
                        className="px-3 py-1 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                      >
                        <option>1km</option>
                        <option>5km</option>
                        <option>10km</option>
                        <option>25km</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-stone-700">Rating:</label>
                      <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="px-3 py-1 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                      >
                        <option>All</option>
                        <option>4+ stars</option>
                        <option>3+ stars</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-stone-700">Service:</label>
                      <select
                        value={selectedServiceFilter}
                        onChange={(e) => setSelectedServiceFilter(e.target.value)}
                        className="px-3 py-1 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                      >
                        <option>All</option>
                        <option>PAN</option>
                        <option>Passport</option>
                        <option>Driving License</option>
                        <option>Aadhaar</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-white border-stone-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="verified" className="text-sm text-stone-700 cursor-pointer">
                      Show only verified centers
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Map and Centers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <Reveal delay={0.2}>
              <div className="bg-stone-100 rounded-3xl p-6 border border-stone-200 h-96 lg:h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-stone-100 opacity-50"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-emerald-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <p className="text-stone-600 font-medium mb-2">Interactive Map</p>
                    <p className="text-sm text-stone-500">Nearby centers will appear here</p>
                  </div>
                </div>
                {/* Mock pins */}
                {nearbyCenters.slice(0, 4).map((center, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${
                      center.type === 'CSC' ? 'bg-blue-500' :
                      center.type === 'Government' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {center.name.split(' - ')[0]}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Centers List */}
            <Reveal delay={0.3}>
              <div className="space-y-4 max-h-96 lg:max-h-[500px] overflow-y-auto">
                {nearbyCenters.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-stone-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <p className="text-stone-500">Click "Use my location" to find nearby centers</p>
                  </div>
                ) : (
                  nearbyCenters
                    .filter(center => !showVerifiedOnly || center.verified)
                    .filter(center => selectedServiceFilter === 'All' || center.services.includes(selectedServiceFilter))
                    .map((center, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-medium text-stone-900">{center.name}</h3>
                              {center.verified && (
                                <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                                  ✓ Verified
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-stone-500 mb-2">{center.distance} away</p>
                            <p className="text-sm text-stone-600">{center.address}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            center.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {center.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Services</p>
                            <div className="flex flex-wrap gap-1">
                              {center.services.slice(0, 3).map(service => (
                                <span key={service} className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-stone-900">{center.rating}</span>
                              <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Waiting Time</p>
                            <p className="text-sm font-medium text-stone-900">{center.waitingTime}</p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-stone-100 text-stone-700 text-sm rounded-lg px-4 py-2 cursor-pointer border-none hover:bg-stone-200 transition-colors"
                            >
                              Call Now
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-emerald-700 text-white text-sm rounded-lg px-4 py-2 cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                            >
                              Get Directions
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ background: "rgba(241,238,233,0.5)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
              <div>
                <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-3">Browse by category</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">Find your procedure</h2>
              </div>
              <a href="#" className="text-sm text-emerald-700 no-underline hover:underline shrink-0">View all →</a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.label} delay={i * 0.06}>
                <div className="card-lift bg-white rounded-2xl p-6 cursor-pointer border border-stone-100">
                  <span className="text-2xl text-emerald-600 block mb-4">{cat.icon}</span>
                  <p className="text-sm font-medium text-stone-800 mb-1.5">{cat.label}</p>
                  <p className="text-xs text-stone-400 leading-relaxed mb-5">{cat.sub}</p>
                  <span className="text-xs text-emerald-700 font-medium">Explore →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ UPLOAD CTA ════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <Reveal>
              <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-5">Got a document?</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.15] mb-6 text-stone-900">
                Drop it here.<br />We handle<br /><em className="text-emerald-700">the rest.</em>
              </h2>
              <p className="text-base text-stone-400 leading-relaxed mb-9 max-w-sm font-light">
                Received a confusing notice from a government office? Upload the PDF or a photo. Our AI reads it and tells you — in plain language — what it means and what you must do next.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="bg-stone-900 text-white text-sm font-medium rounded-xl px-6 py-3.5 cursor-pointer border-none hover:bg-stone-800 transition-colors"
                  style={{ boxShadow: "0 4px 18px rgba(0,0,0,0.18)" }}>
                  Upload document
                </motion.button>
                <button
                  className="bg-white border border-stone-200 text-stone-600 text-sm rounded-xl px-6 py-3.5 cursor-pointer hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  See an example
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="upload-box bg-white rounded-3xl border-2 border-dashed border-stone-200 p-12 sm:p-16 text-center cursor-pointer">
                <motion.div
                  animate={{ y: [0, -7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4v16M7 10l7-7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 22h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </motion.div>
                <p className="text-base font-medium text-stone-700 mb-2">Drag & drop your document</p>
                <p className="text-sm text-stone-400 mb-7">PDF, JPG, PNG supported</p>
                <div className="flex justify-center flex-wrap gap-2">
                  {["Secure", "Private", "Not stored"].map(tag => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-stone-50 text-stone-500 border border-stone-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ LANGUAGES ═════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-stone-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <Reveal>
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-4">Multilingual</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight mb-4">
              Speaks your language
            </h2>
            <p className="text-base text-stone-400 max-w-md mx-auto leading-relaxed font-light mb-14">
              From Hindi to Tamil, Bengali to Punjabi — guidance in the language you think in, with optional voice instructions.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {LANGUAGES.map((l, i) => (
                <motion.button key={l}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="lang-pill bg-stone-800 border border-stone-700 text-stone-300 text-sm rounded-full px-5 py-2.5 cursor-pointer border-solid">
                  {l}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 text-center">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-tight mb-5 text-stone-900">
              No confusion.<br /><em className="text-emerald-700">Just clarity.</em>
            </h2>
            <p className="text-base sm:text-lg text-stone-400 mb-10 leading-relaxed font-light">
              Every citizen deserves to understand the paperwork that shapes their life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button onClick={openReg} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-shadow bg-emerald-700 text-white rounded-2xl px-8 py-4 text-base font-medium cursor-pointer border-none hover:bg-emerald-800 transition-colors">
                Get started — it's free
              </motion.button>
              <button
                className="bg-white border border-stone-200 text-stone-600 rounded-2xl px-8 py-4 text-base cursor-pointer hover:border-stone-400 transition-colors"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                See how it works
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <span className="font-serif text-lg font-medium">
            Saathi<span className="text-emerald-700">Seva</span>
          </span>
          <div className="flex flex-wrap justify-center gap-6">
            {["About", "Privacy", "Accessibility", "Contact"].map(l => (
              <a key={l} href="#" className="text-sm text-stone-400 no-underline hover:text-stone-700 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-stone-300 sm:text-right leading-relaxed">
            Independent guidance platform.<br />Not affiliated with Government of India.
          </p>
        </div>
      </footer>
      
    </div>
  );
}