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
  }, [ci, del, wi]);
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