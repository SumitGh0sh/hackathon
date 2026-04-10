import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { label: "Benefits & Finance", sub: "Pensions, welfare, aid schemes", icon: "◈" },
  { label: "Land & Property", sub: "Registry, mutation, records", icon: "◉" },
  { label: "Identity Documents", sub: "Aadhaar, PAN, voter ID", icon: "◎" },
  { label: "Health & Insurance", sub: "Ayushman, hospital claims", icon: "◐" },
  { label: "Education", sub: "Scholarships, admissions", icon: "◑" },
  { label: "Legal & Courts", sub: "FIR, notices, hearings", icon: "◒" },
  { label: "Jobs & Business", sub: "Licenses, MSME, labour", icon: "◓" },
  { label: "Birth, Marriage & Death", sub: "Certificates and records", icon: "◔" },
];

const STEPS = [
  {
    num: "01",
    title: "Upload or Search",
    body: "Drop a government notice, scan a document, or simply describe your situation in plain words.",
  },
  {
    num: "02",
    title: "AI Reads & Simplifies",
    body: "Our engine strips away bureaucratic language and maps out exactly what the document requires of you.",
  },
  {
    num: "03",
    title: "Follow Guided Steps",
    body: "A clear checklist tells you which documents to gather, which office to visit, and in what order.",
  },
];

const LANGUAGES = ["हिंदी", "English", "বাংলা", "தமிழ்", "తెలుగు", "मराठी", "ਪੰਜਾਬੀ", "ગુજરાતી"];

const PLACEHOLDERS = [
  "Apply for a ration card…",
  "Understand my land notice…",
  "Claim old age pension…",
  "Register for PM Kisan…",
  "Get a birth certificate…",
];

function useTypingEffect(words, speed = 60, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (cIdx < word.length) {
          setDisplay(word.slice(0, cIdx + 1));
          setCIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (cIdx > 0) {
          setDisplay(word.slice(0, cIdx - 1));
          setCIdx(c => c - 1);
        } else {
          setDeleting(false);
          setWIdx(i => (i + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [cIdx, deleting, wIdx, words, speed, pause]);

  return display;
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const typed = useTypingEffect(PLACEHOLDERS);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ["rgba(250,248,245,0)", "rgba(250,248,245,0.95)"]);
  const navBorder = useTransform(scrollY, [0, 80], ["rgba(0,0,0,0)", "rgba(0,0,0,0.08)"]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAF8F5", color: "#1A1814", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <motion.nav
        style={{ background: navBg, borderBottom: `1px solid`, borderColor: navBorder, backdropFilter: "blur(12px)" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, letterSpacing: "-0.3px" }}>
              Saathi<span style={{ color: "#C85C2D" }}>Seva</span>
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="hidden md:flex items-center gap-8">
            {["Procedures", "Upload", "About"].map(item => (
              <a key={item} href="#" style={{ fontSize: 14, color: "#6B6760", fontWeight: 400, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#1A1814"}
                onMouseLeave={e => e.target.style.color = "#6B6760"}>
                {item}
              </a>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{ fontSize: 13, border: "1px solid #DDD9D2", borderRadius: 8, padding: "6px 14px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#1A1814" }}>
              {lang}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "white", border: "1px solid #E8E4DD", borderRadius: 12, padding: "8px", minWidth: 140, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 100 }}>
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", background: lang === l ? "#F5F0E8" : "transparent", cursor: "pointer", fontSize: 13, color: "#1A1814", fontFamily: "inherit" }}>
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 120, position: "relative", overflow: "hidden" }}>
        {/* Background texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(200,92,45,0.06) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(200,92,45,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />
        {/* Floating circle decoration */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: 100, right: "8%", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(200,92,45,0.12)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", top: 140, right: "10%", width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(200,92,45,0.08)", pointerEvents: "none" }}
        />

        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF3EE", border: "1px solid #F5C4AC", borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, background: "#C85C2D", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#C85C2D", fontWeight: 500, letterSpacing: "0.02em" }}>Available in 12 regional languages</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 24, color: "#1A1814" }}>
              Government paperwork,<br />
              <em style={{ fontStyle: "italic", color: "#C85C2D" }}>finally simple.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 18, color: "#6B6760", lineHeight: 1.7, marginBottom: 48, maxWidth: 520, fontWeight: 300 }}>
              Upload any government document or describe your situation — we decode the bureaucratic language and walk you through every step, in your language.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ background: "white", border: "1.5px solid #E8E4DD", borderRadius: 16, padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: 12, maxWidth: 580, boxShadow: "0 4px 32px rgba(0,0,0,0.06)", marginBottom: 20 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, color: "#AAA59E" }}>
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={typed}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#1A1814", background: "transparent", fontFamily: "inherit", caretColor: "#C85C2D" }}
              />
              <button
                style={{ background: "#C85C2D", color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "background 0.2s, transform 0.15s" }}
                onMouseEnter={e => { e.target.style.background = "#A84A22"; e.target.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.target.style.background = "#C85C2D"; e.target.style.transform = "scale(1)"; }}>
                Search
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid #DDD9D2", borderRadius: 10, padding: "10px 18px", fontSize: 14, cursor: "pointer", color: "#3D3B37", fontFamily: "inherit", transition: "border-color 0.2s, transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#C85C2D"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#DDD9D2"}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5v4M8 10.5v4M1.5 8h4m5 0h4" stroke="#C85C2D" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="5" y="5" width="6" height="6" rx="3" stroke="#C85C2D" strokeWidth="1.5" />
                </svg>
                Upload a document
              </button>
              <span style={{ fontSize: 13, color: "#AAA59E" }}>or speak your problem</span>
              <button style={{ width: 38, height: 38, borderRadius: "50%", background: "#FFF3EE", border: "1px solid #F5C4AC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="4" y="1" width="6" height="8" rx="3" stroke="#C85C2D" strokeWidth="1.3" />
                  <path d="M2 7.5a5 5 0 0 0 10 0" stroke="#C85C2D" strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M7 12.5v1" stroke="#C85C2D" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Hero image placeholder (right side) — visible on large screens */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", right: "4%", top: "50%", transform: "translateY(-50%)", width: "36%", maxWidth: 440, aspectRatio: "4/3", borderRadius: 24, overflow: "hidden", border: "1px solid #E8E4DD" }}
          className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80"
            alt="Government guidance"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Floating mini card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", bottom: 24, left: 24, background: "white", borderRadius: 14, padding: "14px 18px", border: "1px solid #E8E4DD", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: 220 }}>
            <div style={{ fontSize: 11, color: "#AAA59E", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Processing</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 10 }}>Ration Card Application</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Step 1", "Step 2", "Step 3"].map((s, i) => (
                <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: i === 0 ? "#C85C2D" : "#F5F0E8", color: i === 0 ? "white" : "#AAA59E" }}>{s}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* TRUST BAR */}
      <FadeUp>
        <div style={{ borderTop: "1px solid #E8E4DD", borderBottom: "1px solid #E8E4DD", background: "white", padding: "18px 0" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div style={{ display: "flex", gap: 48, alignItems: "center", overflowX: "auto", whiteSpace: "nowrap" }}>
              {[["50,000+", "Citizens helped"], ["12", "Regional languages"], ["200+", "Procedures covered"], ["Free", "Always"]].map(([num, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: "#C85C2D" }}>{num}</span>
                  <span style={{ fontSize: 13, color: "#6B6760" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div style={{ marginBottom: 64 }}>
              <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#C85C2D", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>How it works</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.5px", maxWidth: 480 }}>
                Three steps to clarity
              </h2>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {STEPS.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: "white", border: "1px solid #E8E4DD", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden", cursor: "default" }}>
                  <div style={{ position: "absolute", top: 20, right: 24, fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 400, color: "#F5F0E8", lineHeight: 1, userSelect: "none" }}>{step.num}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF3EE", border: "1px solid #F5C4AC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 20, color: "#C85C2D" }}>
                    {i === 0 ? "↑" : i === 1 ? "◈" : "→"}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12, color: "#1A1814" }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "#6B6760", lineHeight: 1.7, fontWeight: 300 }}>{step.body}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "80px 0", background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#C85C2D", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>Browse by category</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 400, letterSpacing: "-0.5px", lineHeight: 1.2 }}>Find your procedure</h2>
              </div>
              <a href="#" style={{ fontSize: 14, color: "#C85C2D", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>View all procedures →</a>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {CATEGORIES.map((cat, i) => (
              <FadeUp key={cat.label} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  style={{ background: "white", border: "1px solid #E8E4DD", borderRadius: 16, padding: "22px 24px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontSize: 22, color: "#C85C2D" }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#1A1814", marginBottom: 4 }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: "#AAA59E", lineHeight: 1.5 }}>{cat.sub}</div>
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#C85C2D", fontWeight: 500 }}>
                    Explore <span>→</span>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* UPLOAD CTA */}
      <section style={{ padding: "100px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="flex flex-col lg:grid">
            <FadeUp>
              <div>
                <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#C85C2D", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Got a document?</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 20 }}>
                  Drop it here.<br />We'll handle<br /><em style={{ color: "#C85C2D" }}>the rest.</em>
                </h2>
                <p style={{ fontSize: 16, color: "#6B6760", lineHeight: 1.7, marginBottom: 32, fontWeight: 300, maxWidth: 400 }}>
                  Received a confusing notice from a government office? Upload the PDF or photo. Our AI will read it and tell you — in plain language — what it means and what to do next.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button style={{ background: "#1A1814", color: "white", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s, background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#3D3B37"}
                    onMouseLeave={e => e.currentTarget.style.background = "#1A1814"}>
                    Upload document
                  </button>
                  <button style={{ background: "none", color: "#1A1814", border: "1px solid #DDD9D2", borderRadius: 12, padding: "14px 28px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#C85C2D"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#DDD9D2"}>
                    See an example
                  </button>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              {/* Upload drop zone */}
              <motion.div
                whileHover={{ borderColor: "#C85C2D" }}
                transition={{ duration: 0.2 }}
                style={{ border: "2px dashed #DDD9D2", borderRadius: 24, padding: "60px 40px", textAlign: "center", background: "white", cursor: "pointer" }}>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 64, height: 64, background: "#FFF3EE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4v16M7 10l7-7 7 7" stroke="#C85C2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 22h20" stroke="#C85C2D" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.div>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#1A1814", marginBottom: 8 }}>Drag & drop your document</p>
                <p style={{ fontSize: 13, color: "#AAA59E", marginBottom: 20 }}>PDF, JPG, PNG supported</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                  {["Secure", "Private", "Not stored"].map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 100, background: "#F5F0E8", color: "#6B6760", border: "1px solid #E8E4DD" }}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* LANGUAGE SECTION */}
      <section style={{ padding: "80px 0", background: "#1A1814", color: "white" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#C85C2D", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Multilingual</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.5px", color: "white", marginBottom: 16 }}>
                Speaks your language
              </h2>
              <p style={{ fontSize: 16, color: "#888480", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
                From Hindi to Tamil, Bengali to Punjabi — guidance in the language you think in, with optional voice instructions.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {LANGUAGES.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  whileHover={{ scale: 1.05, background: "#C85C2D", color: "white", borderColor: "#C85C2D" }}
                  style={{ padding: "10px 22px", borderRadius: 100, border: "1px solid #3D3B37", fontSize: 14, color: "#CCC9C4", cursor: "pointer", transition: "all 0.2s" }}>
                  {l}
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "120px 0", textAlign: "center" }}>
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 20 }}>
              No more confusion.<br /><em style={{ color: "#C85C2D" }}>Just clarity.</em>
            </h2>
            <p style={{ fontSize: 17, color: "#6B6760", marginBottom: 40, lineHeight: 1.7, fontWeight: 300 }}>
              Every citizen deserves to understand the paperwork that affects their life.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ background: "#C85C2D", color: "white", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.01em" }}>
              Get started — it's free
            </motion.button>
          </FadeUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #E8E4DD", padding: "32px 0", background: "white" }}>
        <div className="max-w-6xl mx-auto px-6" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 500 }}>
            Saathi<span style={{ color: "#C85C2D" }}>Seva</span>
          </span>
          <div style={{ display: "flex", gap: 32 }}>
            {["About", "Privacy", "Accessibility", "Contact"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "#AAA59E", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#1A1814"}
                onMouseLeave={e => e.target.style.color = "#AAA59E"}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#CCC9C4" }}>Independent guidance platform. Not affiliated with Government of India.</p>
        </div>
      </footer>
    </div>
  );
}