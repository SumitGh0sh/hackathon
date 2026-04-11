import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Polygon, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ─── typing hook ─────────────────────────────────────────────── */
function useTyping(words, speed = 70, pause = 1800) {
  const [text, setText] = useState("");
  const [wi, setWi]     = useState(0);
  const [ci, setCi]     = useState(0);
  const [del, setDel]   = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
  },
  "Aadhaar Card": {
    cost: 0,
    time: "1-3 days",
    documents: ["Birth Certificate", "Address Proof", "Photo"],
    difficulty: "Easy",
    fees: { government: 0, service: 0 },
    tips: ["Visit nearest enrollment center", "Bring original documents"],
    successRate: "99%"
  },
  "Voter ID": {
    cost: 0,
    time: "15-30 days",
    documents: ["Aadhaar", "Address Proof", "Photo"],
    difficulty: "Easy",
    fees: { government: 0, service: 0 },
    tips: ["Apply online for faster processing", "Check eligibility first"],
    successRate: "97%"
  },
  "Ration Card": {
    cost: 0,
    time: "7-15 days",
    documents: ["Aadhaar", "Address Proof", "Income Certificate"],
    difficulty: "Medium",
    fees: { government: 0, service: 0 },
    tips: ["Apply through CSC centers", "Required for subsidized food"],
    successRate: "95%"
  },
  "Marriage Certificate": {
    cost: 100,
    time: "7-14 days",
    documents: ["ID Proof", "Address Proof", "Witness Documents"],
    difficulty: "Easy",
    fees: { government: 100, service: 0 },
    tips: ["Apply at local registrar office", "Both parties must be present"],
    successRate: "98%"
  },
  "Death Certificate": {
    cost: 0,
    time: "1-3 days",
    documents: ["Hospital Certificate", "ID Proof"],
    difficulty: "Easy",
    fees: { government: 0, service: 0 },
    tips: ["Apply within 21 days", "Required for various procedures"],
    successRate: "99%"
  },
  "Property Registration": {
    cost: 5000,
    time: "30-60 days",
    documents: ["Property Documents", "ID Proof", "Address Proof"],
    difficulty: "Hard",
    fees: { government: 5000, service: 0 },
    tips: ["Consult lawyer first", "Stamp duty varies by state"],
    successRate: "90%"
  },
  "GST Registration": {
    cost: 0,
    time: "7-15 days",
    documents: ["PAN Card", "Address Proof", "Bank Details"],
    difficulty: "Medium",
    fees: { government: 0, service: 0 },
    tips: ["Required for business", "Apply online through GST portal"],
    successRate: "94%"
  },
  "MSME Registration": {
    cost: 0,
    time: "1-7 days",
    documents: ["PAN Card", "Aadhaar", "Address Proof"],
    difficulty: "Easy",
    fees: { government: 0, service: 0 },
    tips: ["Free registration", "Required for government schemes"],
    successRate: "98%"
  },
  "PM Kisan Registration": {
    cost: 0,
    time: "15-30 days",
    documents: ["Aadhaar", "Bank Details", "Land Documents"],
    difficulty: "Easy",
    fees: { government: 0, service: 0 },
    tips: ["For farmers", "Income support scheme"],
    successRate: "96%"
  },
  "Ayushman Bharat Card": {
    cost: 0,
    time: "7-15 days",
    documents: ["Aadhaar", "Income Certificate", "Family Details"],
    difficulty: "Easy",
    fees: { government: 0, service: 0 },
    tips: ["Free health insurance", "For eligible families"],
    successRate: "97%"
  },
  "Scholarship Application": {
    cost: 0,
    time: "30-60 days",
    documents: ["Mark Sheets", "Income Certificate", "Bank Details"],
    difficulty: "Medium",
    fees: { government: 0, service: 0 },
    tips: ["Apply through NSP portal", "Check eligibility criteria"],
    successRate: "92%"
  }
};

const MOCK_SCHEMES = {
  Jharkhand: {
    Agriculture: [
      { id: "SCH001", name: "PM Kisan Samman Nidhi", benefit: "₹6000/year", eligibility: "Small and marginal farmers", mode: "Online + CSC", rating: 4.8 },
      { id: "SCH002", name: "Pradhan Mantri Fasal Bima Yojana", benefit: "Crop insurance support", eligibility: "All enrolled farmers", mode: "Online + Bank", rating: 4.6 },
      { id: "SCH003", name: "KCC - Kisan Credit Card", benefit: "Low-interest crop loans", eligibility: "Eligible landholding farmers", mode: "Bank + CSC", rating: 4.5 }
    ],
    Health: [
      { id: "SCH004", name: "Ayushman Bharat PM-JAY", benefit: "Up to ₹5 lakh family cover", eligibility: "Eligible low-income households", mode: "Online + Hospital Desk", rating: 4.9 },
      { id: "SCH005", name: "Janani Suraksha Yojana", benefit: "Cash support for institutional delivery", eligibility: "Pregnant women under criteria", mode: "Offline + PHC", rating: 4.4 },
      { id: "SCH006", name: "National Dialysis Programme", benefit: "Subsidized/free dialysis", eligibility: "Patients in empaneled hospitals", mode: "Hospital + Referral", rating: 4.3 }
    ],
    Education: [
      { id: "SCH007", name: "Post Matric Scholarship (ST/SC/OBC)", benefit: "Tuition and maintenance support", eligibility: "Eligible category students", mode: "Online", rating: 4.7 },
      { id: "SCH008", name: "NSP Central Sector Scholarship", benefit: "Annual scholarship support", eligibility: "Meritorious students under income cap", mode: "Online", rating: 4.5 },
      { id: "SCH009", name: "Pre-Matric Scholarship", benefit: "School-level financial support", eligibility: "Eligible school students", mode: "Online + School", rating: 4.4 }
    ],
    Women: [
      { id: "SCH010", name: "PM Matru Vandana Yojana", benefit: "₹5000 maternity benefit", eligibility: "First live birth under conditions", mode: "Online + Anganwadi", rating: 4.6 },
      { id: "SCH011", name: "One Stop Centre Scheme", benefit: "Legal and counseling support", eligibility: "Women facing violence", mode: "Offline + Helpline", rating: 4.3 },
      { id: "SCH012", name: "Beti Bachao Beti Padhao", benefit: "Awareness + support initiatives", eligibility: "Girl child and families", mode: "Offline + District Office", rating: 4.2 }
    ],
    Employment: [
      { id: "SCH013", name: "MGNREGA", benefit: "100 days wage employment", eligibility: "Rural households", mode: "Offline + Panchayat", rating: 4.7 },
      { id: "SCH014", name: "PMEGP", benefit: "Credit-linked subsidy for enterprises", eligibility: "New entrepreneurs", mode: "Online + KVIC", rating: 4.4 },
      { id: "SCH015", name: "Skill India PMKVY", benefit: "Free skill training", eligibility: "Youth seeking employment", mode: "Online + Training Center", rating: 4.5 }
    ]
  },
  Maharashtra: {
    Agriculture: [
      { id: "SCH101", name: "PM Kisan Samman Nidhi", benefit: "₹6000/year", eligibility: "Small and marginal farmers", mode: "Online + CSC", rating: 4.8 },
      { id: "SCH102", name: "PM Fasal Bima Yojana", benefit: "Seasonal crop risk coverage", eligibility: "Notified crop farmers", mode: "Online + Bank", rating: 4.6 },
      { id: "SCH103", name: "Soil Health Card Scheme", benefit: "Soil testing + nutrient advisory", eligibility: "All farmers", mode: "Offline + Agriculture Office", rating: 4.3 }
    ],
    Health: [
      { id: "SCH104", name: "Ayushman Bharat PM-JAY", benefit: "Up to ₹5 lakh family cover", eligibility: "Eligible families", mode: "Online + Hospital Desk", rating: 4.9 },
      { id: "SCH105", name: "Mahatma Jyotiba Phule Jan Arogya Yojana", benefit: "Cashless treatment package", eligibility: "State eligible beneficiaries", mode: "Hospital + Card", rating: 4.7 },
      { id: "SCH106", name: "Jan Aushadhi Scheme", benefit: "Affordable generic medicines", eligibility: "All citizens", mode: "Offline + Store", rating: 4.4 }
    ],
    Education: [
      { id: "SCH107", name: "Post Matric Scholarship", benefit: "Fee and stipend support", eligibility: "Eligible category students", mode: "Online", rating: 4.6 },
      { id: "SCH108", name: "EBC Fee Reimbursement", benefit: "Partial/full fee reimbursement", eligibility: "Economically backward class students", mode: "Online", rating: 4.5 },
      { id: "SCH109", name: "National Means-cum-Merit Scholarship", benefit: "Annual school scholarship", eligibility: "Merit + income criteria", mode: "Online + School", rating: 4.4 }
    ],
    Women: [
      { id: "SCH110", name: "PM Matru Vandana Yojana", benefit: "₹5000 maternity benefit", eligibility: "Eligible mothers", mode: "Online + Anganwadi", rating: 4.6 },
      { id: "SCH111", name: "Women Helpline Scheme", benefit: "24x7 emergency support", eligibility: "All women", mode: "Helpline + Offline", rating: 4.3 },
      { id: "SCH112", name: "Self Help Group Support (NRLM)", benefit: "Credit and livelihood support", eligibility: "Women SHGs", mode: "Offline + Block Office", rating: 4.4 }
    ],
    Employment: [
      { id: "SCH113", name: "MGNREGA", benefit: "100 days wage employment", eligibility: "Rural households", mode: "Offline + Panchayat", rating: 4.7 },
      { id: "SCH114", name: "PMEGP", benefit: "Subsidy for micro-enterprise setup", eligibility: "Entrepreneurs", mode: "Online + DIC", rating: 4.5 },
      { id: "SCH115", name: "NULM Skill Training", benefit: "Urban livelihood and skilling", eligibility: "Urban poor youth", mode: "Online + ULB", rating: 4.3 }
    ]
  }
};

const PIN_STATE_MAP = {
  "826001": "Jharkhand",
  "834001": "Jharkhand",
  "831001": "Jharkhand",
  "400001": "Maharashtra",
  "411001": "Maharashtra",
  "440001": "Maharashtra"
};

const CITY_STATE_MAP = {
  dhanbad: "Jharkhand",
  ranchi: "Jharkhand",
  jamshedpur: "Jharkhand",
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  nagpur: "Maharashtra"
};

function getStateFromInput(input) {
  const cleaned = (input || "").trim().toLowerCase();
  if (!cleaned) return "";

  if (/^\d{6}$/.test(cleaned)) {
    return PIN_STATE_MAP[cleaned] || "";
  }

  return CITY_STATE_MAP[cleaned] || "";
}

function flattenSchemesByCategory(schemesByCategory) {
  return Object.entries(schemesByCategory || {}).flatMap(([category, schemes]) =>
    (schemes || []).map((scheme) => ({ ...scheme, category }))
  );
}

const jharkhandCoords = [
  [24.8, 83.1],
  [25.7, 84.9],
  [24.7, 86.8],
  [23.5, 87.8],
  [22.3, 87.4],
  [21.7, 85.5],
  [22.1, 84.2],
  [23.2, 83.2]
];

const jharkhandCenter = [23.61, 85.28];
const ranchiMarker = [23.3441, 85.3096];
const markerIcon = L.divIcon({
  className: "jharkhand-marker",
  html: '<div style="background:#047857;color:white;border-radius:9999px;padding:6px 8px;font-size:11px;font-weight:600;box-shadow:0 6px 16px rgba(0,0,0,0.22);">Jharkhand</div>'
});

function IndiaSchemesMap({ detectedState, onSelectJharkhand }) {
  return (
    <MapContainer center={[22.7, 79.8]} zoom={4.5} className="w-full h-full rounded-2xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        positions={jharkhandCoords}
        pathOptions={{
          color: detectedState === "Jharkhand" ? "#059669" : "#10b981",
          fillColor: detectedState === "Jharkhand" ? "#059669" : "#34d399",
          fillOpacity: detectedState === "Jharkhand" ? 0.45 : 0.28,
          weight: 2
        }}
        eventHandlers={{ click: onSelectJharkhand }}
      >
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">Jharkhand</p>
            <p>Click to load schemes</p>
          </div>
        </Popup>
      </Polygon>
      <Marker position={ranchiMarker} icon={markerIcon} eventHandlers={{ click: onSelectJharkhand }}>
        <Popup>Ranchi, Jharkhand</Popup>
      </Marker>
      <Marker position={jharkhandCenter} opacity={0} />
    </MapContainer>
  );
}

const CENTERS_DATA = [
  {
    name: "CSC Center - Village Hub",
    distance: "1.2 km",
    address: "Near Post Office, Village Main Road, Maharashtra",
    status: "Open",
    services: ["PAN", "Aadhaar", "Ration", "Voter ID", "PM Kisan", "Ayushman Bharat"],
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
    services: ["Passport", "Driving License", "Birth Certificate", "Death Certificate", "Marriage Certificate", "Property Registration"],
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
    services: ["PAN", "Aadhaar", "GST Registration", "MSME Registration"],
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
    services: ["PAN", "Passport", "Driving License", "Aadhaar", "Voter ID", "Ration Card", "Scholarship Application"],
    rating: 4.7,
    waitingTime: "10 mins",
    verified: true,
    type: "CSC",
    phone: "+91 98765 43213"
  },
  {
    name: "Municipal Office - Nagar Palika",
    distance: "5.2 km",
    address: "Municipal Building, City Center, Maharashtra",
    status: "Open",
    services: ["Birth Certificate", "Death Certificate", "Marriage Certificate", "Property Registration"],
    rating: 4.0,
    waitingTime: "45 mins",
    verified: true,
    type: "Government",
    phone: "+91 98765 43214"
  },
  {
    name: "RTO Office - Regional Transport",
    distance: "6.8 km",
    address: "RTO Complex, Highway Road, Maharashtra",
    status: "Open",
    services: ["Driving License", "Vehicle Registration", "Permit Renewal"],
    rating: 3.9,
    waitingTime: "60 mins",
    verified: true,
    type: "Government",
    phone: "+91 98765 43215"
  },
  {
    name: "Bank CSC - HDFC Services",
    distance: "7.1 km",
    address: "HDFC Bank Branch, Mall Road, Maharashtra",
    status: "Open",
    services: ["PAN", "Aadhaar", "GST Registration", "MSME Registration", "PM Kisan"],
    rating: 4.3,
    waitingTime: "20 mins",
    verified: true,
    type: "CSC",
    phone: "+91 98765 43216"
  },
  {
    name: "Post Office Agent",
    distance: "8.5 km",
    address: "Main Post Office, Station Road, Maharashtra",
    status: "Open",
    services: ["PAN", "Aadhaar", "Passport", "Voter ID"],
    rating: 4.1,
    waitingTime: "25 mins",
    verified: true,
    type: "Government",
    phone: "+91 98765 43217"
  }
];

const STEPS = [
  { n: "01", title: "Upload or Search",    body: "Drop a government notice or describe your situation in plain words — any language works." },
  { n: "02", title: "AI Reads & Decodes", body: "Our engine strips bureaucratic jargon and maps exactly what the document demands of you." },
  { n: "03", title: "Follow Your Steps",  body: "A clear checklist shows which documents to gather, which office to visit, and in what order." },
];

const CHAT_SUGGESTIONS = [
  "Apply for Aadhaar",
  "PAN card status",
  "Driving license",
  "Passport apply",
];

const SERVICE_GUIDE = {
  income_certificate: {
    key: "income_certificate",
    slug: "income-certificate",
    label: "Income Certificate",
    documents: ["Aadhaar Card", "Address Proof", "Income Proof", "Passport size photo"],
    eligibility: "Available for residents who need official income verification from the local authority.",
    processingTime: "7–10 business days",
    keywords: ["income certificate", "income", "certificate", "apply"],
  },
  pan_card: {
    key: "pan_card",
    slug: "pan-card",
    label: "PAN Card",
    documents: ["Aadhaar Card", "Photo", "Address Proof", "Identity Proof"],
    eligibility: "For individuals seeking a permanent account number for taxation and banking.",
    processingTime: "5–7 business days",
    keywords: ["pan card", "pan", "status", "documents"],
  },
  driving_license: {
    key: "driving_license",
    slug: "driving-license",
    label: "Driving License",
    documents: ["Aadhaar Card", "Medical Certificate", "Address Proof", "Passport size photo"],
    eligibility: "For eligible drivers applying for a new license or renewal.",
    processingTime: "7–14 business days",
    keywords: ["driving license", "driving", "license", "apply"],
  },
  passport: {
    key: "passport",
    slug: "passport",
    label: "Passport",
    documents: ["Aadhaar Card", "Address Proof", "Birth Certificate", "Passport size photo"],
    eligibility: "For Indian citizens applying for a new passport or renewal.",
    processingTime: "15–30 business days",
    keywords: ["passport", "apply passport", "documents"],
  },
  aadhaar_card: {
    key: "aadhaar_card",
    slug: "aadhaar-card",
    label: "Aadhaar Card",
    documents: ["Proof of Identity", "Proof of Address", "Birth Proof", "Passport size photo"],
    eligibility: "For all residents who need a unique identity number for government services.",
    processingTime: "1–3 business days",
    keywords: ["aadhaar", "aadhaar card", "uidai", "apply"],
  },
};

const LANGUAGES = ["हिंदी","English","বাংলা","தமிழ்","తెలుగు","मराठी","ਪੰਜਾਬੀ","ગુજરાતી","ಕನ್ನಡ","മലയാളం"];
const PLACEHOLDERS = [
  "Apply for a ration card…",
  "Understand my land notice…",
  "Claim old age pension…",
  "Register for PM Kisan…",
  "Get a birth certificate…",
];

/* ─── auth modal ──────────────────────────────────────────────── */
function AuthModal({ open, onClose, mode, setMode, onAuthSuccess, onOpenAdminDetails }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    lang: "English",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.email || !form.password || (mode === "Register" && !form.name)) {
      setError("Please fill all required fields.");
      return;
    }

    const endpoint = mode === "Login" ? "login" : "register";
    const payload =
      mode === "Login"
        ? { email: form.email, password: form.password, role: form.role }
        : { name: form.name, email: form.email, password: form.password, lang: form.lang };

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      onAuthSuccess?.({ token: data.token, role: data?.user?.role || form.role });
      onClose();
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-300 bg-white" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-stone-500 tracking-wide">Mobile or email</label>
                <input
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-300 bg-white" />
              </div>
              {mode === "Login" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-stone-500 tracking-wide">Login as</label>
                  <select
                    value={form.role}
                    onChange={handleChange("role")}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-stone-500 tracking-wide">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-300 bg-white" />
              </div>
              {mode === "Register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-stone-500 tracking-wide">Preferred language</label>
                  <select
                    value={form.lang}
                    onChange={handleChange("lang")}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white">
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              )}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-700 text-white text-sm font-medium mt-1 cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                style={{ boxShadow: "0 4px 20px rgba(5,150,105,0.35)" }}>
                {loading ? "Please wait..." : mode === "Login" ? "Sign in" : "Create account"}
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
            {mode === "Login" && (
              <p className="text-center text-xs text-stone-400 mt-2">
                Need an admin account?{" "}
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminDetails?.();
                  }}
                  className="text-emerald-700 font-medium border-none bg-transparent cursor-pointer text-xs"
                >
                  Add admin details
                </button>
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DocumentLineIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100" aria-hidden>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    </span>
  );
}

/* Structured service card shown under assistant messages when intent matches */
function ServiceResponseCard({ service }) {
  if (!service) return null;
  const { label, documents, eligibility, processingTime } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-3 w-full max-w-[min(100%,22rem)] rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-700">Service</p>
          <h3 className="font-serif text-lg font-medium leading-snug text-stone-900">{label}</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-800 border border-emerald-100">
          Guide
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-stone-500">Required documents</p>
        <ul className="space-y-2.5">
          {documents.map((doc) => (
            <li key={doc} className="flex items-center gap-3 text-sm text-stone-800">
              <DocumentLineIcon />
              <span className="leading-snug">{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {(eligibility || processingTime) && (
        <div className="mb-4 space-y-2 rounded-xl bg-stone-50 px-3 py-3 text-xs text-stone-600 border border-stone-100">
          {processingTime && (
            <p>
              <span className="font-medium text-stone-700">Processing time: </span>
              {processingTime}
            </p>
          )}
          {eligibility && (
            <p>
              <span className="font-medium text-stone-700">Eligibility: </span>
              {eligibility}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── hero chatbot (reusable UI) ─────────────────────────────── */
function HeroChatbot({
  suggestions,
  messages,
  isTyping,
  inputValue,
  onInputChange,
  onSend,
  onSuggestionClick,
  onApplyClick,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="search-shadow bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 mb-5 w-full max-w-2xl">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick(suggestion)}
              className="text-xs sm:text-sm text-stone-700 bg-emerald-50 border border-emerald-100 rounded-full px-3.5 sm:px-4 py-2 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
              {suggestion}
            </button>
          ))}
        </div>

        <div className="flex gap-2 sm:gap-3 items-center">
          <input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask about any government form or service..."
            aria-label="Ask about government forms or services"
            className="flex-1 min-w-0 bg-stone-50 border border-stone-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm text-stone-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100/80 transition-[box-shadow,border-color]"
          />
          <motion.button
            type="button"
            whileHover={inputValue.trim() ? { scale: 1.03 } : {}}
            whileTap={inputValue.trim() ? { scale: 0.96 } : {}}
            onClick={onSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
            className={`shrink-0 h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center border-none transition-colors ${
              inputValue.trim()
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
            style={
              inputValue.trim()
                ? { boxShadow: "0 4px 14px rgba(5,150,105,0.28)" }
                : undefined
            }>
            <svg
              className="w-[18px] h-[18px] -translate-x-px translate-y-px"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden>
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </motion.button>
        </div>

        <div
          className="min-h-[140px] max-h-[min(44vh,320px)] sm:max-h-[272px] overflow-y-auto overflow-x-hidden rounded-2xl border border-stone-100 bg-stone-50 p-3 sm:p-4 space-y-3 scroll-smooth"
          role="log"
          aria-live="polite"
          aria-relevant="additions">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className={`flex w-full min-w-0 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[min(100%,22rem)] sm:max-w-[90%]`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-emerald-700 text-white rounded-br-md rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                        : "bg-white text-stone-800 rounded-bl-md rounded-tr-2xl rounded-tl-2xl rounded-br-2xl border border-stone-100 whitespace-pre-wrap"
                    }`}>
                    {message.text}
                  </div>
                  {message.role === "assistant" && message.card && (
                    <>
                      <ServiceResponseCard service={message.card} />
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onApplyClick?.(message.card.key)}
                        className="mt-3 w-full max-w-[min(100%,22rem)] rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white border-none cursor-pointer hover:bg-emerald-800 transition-colors"
                        style={{ boxShadow: "0 4px 16px rgba(5,150,105,0.3)" }}>
                        Apply with SaathiSeva
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22 }}
                className="flex justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-stone-500 border border-stone-100 text-sm leading-6 shadow-sm">
                  <span className="flex gap-1" aria-hidden>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-bounce [animation-delay:300ms]" />
                  </span>
                  <span>AI is typing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} className="h-0 w-full" aria-hidden />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── main ────────────────────────────────────────────────────── */
export default function LandingPage({ isAuthenticated, role, onAuthSuccess, onSignOut, openLoginOnMount }) {
  const navigate = useNavigate();
  const redirectAfterLoginRef = useRef(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi there! Ask about any government form or service and I’ll help you get started.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!isAuthenticated);
  const [langOpen,  setLangOpen]  = useState(false);
  const [selLang,   setSelLang]   = useState("English");
  const [modal,     setModal]     = useState(false);
  const [mode,      setMode]      = useState("Login");
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (openLoginOnMount && !isAuthenticated) {
      setMode("Login");
      setModal(true);
    }
  }, [openLoginOnMount, isAuthenticated]);

  const handleAuthSuccessWithRedirect = (payload) => {
    redirectAfterLoginRef.current = true;
    onAuthSuccess?.(payload);
  };

  // Estimator state
  const [estimatorQuery, setEstimatorQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showCompare, setShowCompare] = useState(false);

  // Apply Near You state
  const [locationQuery, setLocationQuery] = useState("");
  const [schemesData, setSchemesData] = useState(null);
  const [detectedState, setDetectedState] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const { scrollY } = useScroll();
  const navShadow = useTransform(scrollY, [0, 60],
    ["0 0 0 rgba(0,0,0,0)", "0 2px 24px rgba(0,0,0,0.07)"]);

  // Function to format date in readable format
  const formatDateReadable = (date) => {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  // Function to calculate estimated delivery date
  const getEstimatedDeliveryDate = (isUrgent) => {
    const today = new Date();
    // Same date range for both Normal and Urgent
    const minDays = 7;
    const maxDays = 10;
    const minDate = new Date(today);
    const maxDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    maxDate.setDate(today.getDate() + maxDays);
    return `${formatDateReadable(minDate)} – ${formatDateReadable(maxDate)}`;
  };

  const detectServiceIntent = (question) => {
    const normalized = question.trim().toLowerCase();
    if (!/\b(apply|documents|required|eligibility|certificate|license|passport|pan|aadhaar|income|status)\b/.test(normalized)) {
      return null;
    }

    const matchedKey = Object.keys(SERVICE_GUIDE).find((key) =>
      SERVICE_GUIDE[key].keywords.some((term) => normalized.includes(term))
    );

    if (matchedKey) return matchedKey;
    if (/\bincome certificate\b/.test(normalized) || (/\bincome\b/.test(normalized) && /\bcertificate\b/.test(normalized))) return "income_certificate";
    if (normalized.includes("passport")) return "passport";
    if (normalized.includes("pan")) return "pan_card";
    if (normalized.includes("driving") || normalized.includes("license")) return "driving_license";
    if (normalized.includes("aadhaar")) return "aadhaar_card";
    return null;
  };

  const getAiResponse = (question, serviceKey) => {
    if (serviceKey && SERVICE_GUIDE[serviceKey]) {
      const service = SERVICE_GUIDE[serviceKey];
      let procedure = "";
      if (serviceKey === "income_certificate") {
        procedure = `Here's the step-by-step procedure to apply for an Income Certificate:\n\n1. Gather all required documents: ${service.documents.join(", ")}.\n2. Visit your local municipal office or tehsil office.\n3. Fill out the income certificate application form.\n4. Submit the form along with your documents and pay any applicable fee.\n5. Collect your certificate after verification (usually ${service.processingTime}).\n\nEligibility: ${service.eligibility}`;
      } else if (serviceKey === "pan_card") {
        procedure = `Here's the step-by-step procedure to apply for a PAN Card:\n\n1. Gather all required documents: ${service.documents.join(", ")}.\n2. Apply online through the NSDL website or authorized centers.\n3. Fill the online application form with your details.\n4. Upload scanned documents and submit.\n5. Pay the application fee and track your application status.\n\nEligibility: ${service.eligibility}`;
      } else if (serviceKey === "driving_license") {
        procedure = `Here's the step-by-step procedure to apply for a Driving License:\n\n1. Gather all required documents: ${service.documents.join(", ")}.\n2. Pass the learner's license test if you don't have one.\n3. Apply at your local RTO (Regional Transport Office).\n4. Complete the driving test and submit documents.\n5. Collect your license after approval.\n\nEligibility: ${service.eligibility}`;
      } else if (serviceKey === "passport") {
        procedure = `Here's the step-by-step procedure to apply for a Passport:\n\n1. Gather all required documents: ${service.documents.join(", ")}.\n2. Apply online through the Passport Seva website.\n3. Book an appointment at a Passport Seva Kendra.\n4. Visit the center with documents for verification.\n5. Collect your passport after processing.\n\nEligibility: ${service.eligibility}`;
      } else if (serviceKey === "aadhaar_card") {
        procedure = `Here's the step-by-step procedure to apply for an Aadhaar Card:\n\n1. Gather all required documents: ${service.documents.join(", ")}.\n2. Visit the nearest Aadhaar enrollment center.\n3. Fill the enrollment form and provide biometrics.\n4. Submit documents for verification.\n5. Collect your Aadhaar card after processing.\n\nEligibility: ${service.eligibility}`;
      }
      return procedure;
    }

    const normalized = question.trim().toLowerCase();
    if (/aadhaar/.test(normalized)) {
      return "For Aadhaar, you can apply online or visit the nearest enrollment centre. Keep your address proof and photo ready.";
    }
    if (/pan/.test(normalized)) {
      return "PAN status updates are available on the NSDL/TIN portal. Enter your application number, or I can help list the documents needed for a fresh PAN request.";
    }
    if (/driving|license/.test(normalized)) {
      return "Driving license processing usually needs a learner licence, medical certificate and address proof. I can guide you through the state-specific steps.";
    }
    if (/passport/.test(normalized)) {
      return "To apply for a passport, prepare Aadhaar, address proof and photos. I can help you check which category and documents apply to you.";
    }
    return "Great question — most government services need ID, address proof and the right application form. Tell me which one you want, and I'll give you the next step.";
  };

  const sendChatMessage = (message) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const userId = `u-${Date.now()}`;
    setChatMessages((prev) => [...prev, { id: userId, role: "user", text: trimmed }]);
    setChatInput("");
    setIsTyping(true);

    const serviceKey = detectServiceIntent(trimmed);
    const serviceCard = serviceKey ? { key: serviceKey, ...SERVICE_GUIDE[serviceKey] } : null;

    window.setTimeout(() => {
      const reply = getAiResponse(trimmed, serviceKey);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: reply,
          ...(serviceCard ? { card: serviceCard } : {}),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const sendCurrentChatInput = () => sendChatMessage(chatInput);

  const handleApplyService = (serviceKey) => {
    if (!serviceKey) return;
    if (isLoggedIn) {
      navigate(`/apply/${SERVICE_GUIDE[serviceKey].slug}`);
    } else {
      setMode("Register");
      setModal(true);
    }
  };

  const openLogin = () => { setMode("Login");    setModal(true); };
  const openReg   = () => { setMode("Register"); setModal(true); };

  const handleFetchSchemesByState = (stateName) => {
    setDetectedState(stateName);
    setSchemesData(MOCK_SCHEMES[stateName] || {});
  };

  const handleUseMyLocation = () => {
    setIsLocationLoading(true);
    setTimeout(() => {
      handleFetchSchemesByState("Jharkhand");
      setIsLocationLoading(false);
    }, 1200);
  };

  const handleSearchSchemes = () => {
    setIsLocationLoading(true);
    setTimeout(() => {
      const stateName = getStateFromInput(locationQuery);
      if (!stateName) {
        setDetectedState("");
        setSchemesData({});
      } else {
        handleFetchSchemesByState(stateName);
      }
      setIsLocationLoading(false);
    }, 700);
  };

  const recommendedSchemes = flattenSchemesByCategory(schemesData)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);

  const handleApplyScheme = (scheme, category) => {
    const payload = { ...scheme, category, detectedState };
    if (!isAuthenticated || role !== "user") {
      localStorage.setItem("pendingSchemeApply", JSON.stringify(payload));
      setMode("Login");
      setModal(true);
      return;
    }
    navigate(`/apply/${scheme.id}`, { state: { scheme: payload, detectedState } });
  };

  const handleJharkhandPinClick = (pin) => {
    setLocationQuery(pin);
    setIsLocationLoading(true);
    setTimeout(() => {
      const stateName = getStateFromInput(pin);
      handleFetchSchemesByState(stateName || "Jharkhand");
      setIsLocationLoading(false);
    }, 450);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const pending = localStorage.getItem("pendingSchemeApply");
    if (pending && role === "user") {
      try {
        const parsed = JSON.parse(pending);
        localStorage.removeItem("pendingSchemeApply");
        redirectAfterLoginRef.current = false;
        navigate(`/apply/${parsed.id}`, { state: { scheme: parsed, detectedState: parsed.detectedState || "Jharkhand" } });
        return;
      } catch (error) {
        localStorage.removeItem("pendingSchemeApply");
      }
    }
    if (redirectAfterLoginRef.current) {
      redirectAfterLoginRef.current = false;
      navigate(role === "admin" ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, role, navigate]);

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

      <AuthModal
        open={modal}
        onClose={() => setModal(false)}
        mode={mode}
        setMode={setMode}
        onAuthSuccess={handleAuthSuccessWithRedirect}
        onOpenAdminDetails={() => navigate("/admin-details")}
      />

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

            {!isAuthenticated ? (
              <>
                <button onClick={openLogin}
                  className="hidden sm:block text-sm border border-stone-200 rounded-xl px-4 py-2 bg-white text-stone-700 cursor-pointer hover:border-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  Login
                </button>

                <button onClick={openReg}
                  className="btn-shadow text-sm rounded-xl px-4 py-2 bg-emerald-700 text-white cursor-pointer font-medium hover:bg-emerald-800 transition-colors border-none">
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate(role === "admin" ? "/admin" : "/dashboard")}
                  className="btn-shadow text-sm rounded-xl px-4 py-2 bg-emerald-700 text-white cursor-pointer font-medium hover:bg-emerald-800 transition-colors border-none whitespace-nowrap"
                >
                  Go to dashboard
                </button>
                <button
                  onClick={onSignOut}
                  className="text-sm border border-rose-200 rounded-xl px-4 py-2 bg-rose-50 text-rose-700 cursor-pointer hover:border-rose-300 transition-colors font-medium"
                >
                  Sign out
                </button>
              </>
            )}

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
                <div className="flex flex-col gap-3 pt-4">
                  {!isAuthenticated ? (
                    <div className="flex gap-3">
                      <button onClick={openLogin}
                        className="flex-1 py-3 border border-stone-200 rounded-xl text-sm text-stone-700 cursor-pointer bg-white">
                        Login
                      </button>
                      <button onClick={openReg}
                        className="flex-1 py-3 rounded-xl text-sm text-white cursor-pointer bg-emerald-700 border-none">
                        Register
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { navigate(role === "admin" ? "/admin" : "/dashboard"); setMobileNav(false); }}
                        className="w-full py-3 rounded-xl text-sm text-white cursor-pointer bg-emerald-700 border-none font-medium"
                      >
                        Go to dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => { onSignOut(); setMobileNav(false); }}
                        className="w-full py-3 border border-rose-200 rounded-xl text-sm text-rose-700 cursor-pointer bg-rose-50 font-medium"
                      >
                        Sign out
                      </button>
                    </>
                  )}
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

              <HeroChatbot
                suggestions={CHAT_SUGGESTIONS}
                messages={chatMessages}
                isTyping={isTyping}
                inputValue={chatInput}
                onInputChange={setChatInput}
                onSend={sendCurrentChatInput}
                onSuggestionClick={sendChatMessage}
                onApplyClick={handleApplyService}
              />
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
                      <option>Andhra Pradesh</option>
                      <option>Arunachal Pradesh</option>
                      <option>Assam</option>
                      <option>Bihar</option>
                      <option>Chhattisgarh</option>
                      <option>Goa</option>
                      <option>Gujarat</option>
                      <option>Haryana</option>
                      <option>Himachal Pradesh</option>
                      <option>Jharkhand</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Madhya Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Manipur</option>
                      <option>Meghalaya</option>
                      <option>Mizoram</option>
                      <option>Nagaland</option>
                      <option>Odisha</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                      <option>Sikkim</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>Tripura</option>
                      <option>Uttar Pradesh</option>
                      <option>Uttarakhand</option>
                      <option>West Bengal</option>
                      <option>Delhi</option>
                      <option>Jammu and Kashmir</option>
                      <option>Ladakh</option>
                      <option>Puducherry</option>
                      <option>Chandigarh</option>
                      <option>Andaman and Nicobar Islands</option>
                      <option>Daman and Diu</option>
                      <option>Dadra and Nagar Haveli</option>
                      <option>Lakshadweep</option>
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
                          {isUrgent && <span className="text-sm text-amber-600 ml-2">⚡ Urgent</span>}
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

                    {/* Cost Breakdown & Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className={`rounded-2xl p-6 border ${isUrgent ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUrgent ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                            <svg className={`w-5 h-5 ${isUrgent ? 'text-amber-700' : 'text-emerald-700'}`} viewBox="0 0 20 20" fill="none">
                              <path d="M10 1v3m0 0l-3-3m3 3l3-3m-6 6h6m-6 4h6m-6 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div>
                            <p className={`text-xs font-medium uppercase tracking-wide ${isUrgent ? 'text-amber-700' : 'text-emerald-700'}`}>Total Cost</p>
                            <p className={`text-2xl font-serif font-normal ${isUrgent ? 'text-amber-800' : 'text-emerald-800'}`}>
                              ₹{isUrgent ? Math.round(selectedService.cost * 1.2) : selectedService.cost}
                              {isUrgent && <span className="text-sm text-amber-600 ml-2">⚡</span>}
                            </p>
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
                          {isUrgent && (
                            <div className="flex justify-between border-t border-amber-200 pt-2 mt-2">
                              <span className="text-stone-600">Urgent Processing Fee</span>
                              <span className="font-medium text-amber-600">₹{Math.round(selectedService.cost * 0.2)}</span>
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
                            <p className="text-2xl font-serif font-normal text-blue-800">
                              {isUrgent ? "1–3 days" : selectedService.time}
                              {isUrgent && <span className="text-sm text-amber-600 ml-2">⚡</span>}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-stone-600">
                            {isUrgent ? "Fast Processing ⚡" : "Standard processing time"}
                          </p>
                          <div className="pt-2 border-t border-blue-200">
                            <p className="text-xs text-blue-700 font-medium uppercase tracking-wide mb-1">Estimated Delivery</p>
                            <p className="text-sm font-medium text-blue-800">
                              {getEstimatedDeliveryDate(isUrgent)}
                            </p>
                          </div>
                        </div>
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
                        <div className="space-y-2">
                          {selectedService.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={checkedDocs[doc] || false}
                                onChange={(e) => setCheckedDocs({...checkedDocs, [doc]: e.target.checked})}
                                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                              />
                              <span className={`text-sm flex-1 ${checkedDocs[doc] ? 'line-through text-stone-400' : 'text-stone-600'}`}>
                                {doc}
                              </span>
                              {checkedDocs[doc] && <span className="text-green-600 text-sm">✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Important Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M10 6v4M10 14v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Important Information
                      </h3>

                      <div className="space-y-4">
                        {/* Why Urgent Costs More */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-stone-800 mb-2 flex items-center gap-2">
                            <span className="text-amber-500">💰</span>
                            Why Urgent Processing Costs +20%?
                          </p>
                          <ul className="text-xs text-stone-600 space-y-1 ml-6">
                            <li>• Dedicated priority queue - skip waiting lines</li>
                            <li>• Additional staff assigned to your case</li>
                            <li>• Expedited document verification & approval</li>
                            <li>• Weekend/holiday processing if needed</li>
                          </ul>
                        </div>

                        {/* Processing Time Factors */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-stone-800 mb-2 flex items-center gap-2">
                            <span className="text-blue-500">⏱️</span>
                            What Affects Processing Time?
                          </p>
                          <ul className="text-xs text-stone-600 space-y-1 ml-6">
                            <li>• <strong>Document accuracy</strong> - errors cause delays (±2-5 days)</li>
                            <li>• <strong>Field verification</strong> - varies by district/pincode</li>
                            <li>• <strong>Government approvals</strong> - depend on current queue</li>
                            <li>• <strong>Your responsiveness</strong> - queries slow processing</li>
                          </ul>
                        </div>

                        {/* Did You Know */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-stone-800 mb-2 flex items-center gap-2">
                            <span className="text-green-500">💡</span>
                            Did You Know? (Common Sense Tips)
                          </p>
                          <ul className="text-xs text-stone-600 space-y-1 ml-6">
                            <li>• 89% delays are due to <strong>incomplete/incorrect documents</strong></li>
                            <li>• Uploading docs in correct format saves 3-7 days</li>
                            <li>• Verifying applicant details before submission = no re-processing</li>
                            <li>• Weekend applications don't process faster (if govt closed)</li>
                          </ul>
                        </div>

                        {/* Document Accuracy Warning */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                          <p className="text-sm font-medium text-orange-900 mb-2 flex items-center gap-2">
                            <span className="text-red-500">⚠️</span>
                            Document Accuracy = No Delays
                          </p>
                          <p className="text-xs text-orange-800">
                            Wrong/blurry document photos, mismatched names, or missing signatures are the #1 cause of processing extensions. Take clear photos, double-check spelling, and verify you're uploading the right file.
                          </p>
                        </div>

                        {/* Timeline Disclaimer */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                            <span className="text-purple-600">📋</span>
                            Estimated vs Actual Timeline
                          </p>
                          <p className="text-xs text-purple-800 leading-relaxed">
                            <strong>Same timeline (7–10 days):</strong> Both Normal and Urgent processing take the same time to complete. The difference is priority handling and cost. Urgent gets faster document verification and dedicated staff attention.
                          </p>
                          <p className="text-xs text-purple-700 mt-2 font-medium">
                            ✓ Timeline starts AFTER document verification, not submission.
                          </p>
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
                          <p className="text-sm text-stone-600 mb-3">
                            Based on 750+ successful applications this month
                          </p>
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-stone-700">Success Rate</span>
                              <span className="text-xs font-semibold text-green-600">{parseInt(selectedService.successRate)}%</span>
                            </div>
                            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{width: `${parseInt(selectedService.successRate)}%`}}></div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-emerald-700 text-white text-sm font-medium rounded-xl px-6 py-2.5 cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                            >
                              Apply Now
                            </motion.button>
                            <button 
                              onClick={() => setShowCompare(true)}
                              className="border border-stone-200 text-stone-600 text-sm rounded-xl px-6 py-2.5 cursor-pointer hover:border-emerald-500 hover:text-emerald-700 transition-colors bg-white">
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

          {/* Comparison Modal */}
          <AnimatePresence>
            {showCompare && selectedService && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowCompare(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-stone-100 p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-normal text-stone-900">Service Comparison</h2>
                      <p className="text-sm text-stone-500 mt-1">{Object.keys(SERVICES_DATA).find(key => SERVICES_DATA[key] === selectedService)}</p>
                    </div>
                    <button
                      onClick={() => setShowCompare(false)}
                      className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-8">
                    {/* Normal vs Urgent Comparison */}
                    <div>
                      <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="none">
                          <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Normal vs Urgent
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Normal */}
                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                          <p className="text-sm font-medium text-emerald-700 mb-4">Normal Processing</p>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-stone-600 mb-1">Cost</p>
                              <p className="text-2xl font-serif font-normal text-emerald-800">₹{selectedService.cost}</p>
                            </div>
                            <div>
                              <p className="text-xs text-stone-600 mb-1">Time</p>
                              <p className="text-lg font-medium text-stone-800">7–10 days</p>
                            </div>
                            <div>
                              <p className="text-xs text-stone-600 mb-1">Delivery</p>
                              <p className="text-sm text-stone-700">{getEstimatedDeliveryDate().split('–')[0].trim()}</p>
                              <p className="text-xs text-stone-500">to {getEstimatedDeliveryDate().split('–')[1].trim()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Urgent */}
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                          <p className="text-sm font-medium text-amber-700 mb-4">🚀 Urgent Processing</p>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-stone-600 mb-1">Cost</p>
                              <p className="text-2xl font-serif font-normal text-amber-800">₹{Math.round(selectedService.cost * 1.2)}</p>
                              <p className="text-xs text-amber-600">+₹{Math.round(selectedService.cost * 0.2)} faster</p>
                            </div>
                            <div>
                              <p className="text-xs text-stone-600 mb-1">Time</p>
                              <p className="text-lg font-medium text-stone-800">1–3 days ⚡</p>
                            </div>
                            <div>
                              <p className="text-xs text-stone-600 mb-1">Delivery</p>
                              <p className="text-sm text-stone-700">{getEstimatedDeliveryDate().split('–')[0].trim()}</p>
                              <p className="text-xs text-stone-500">to {getEstimatedDeliveryDate().split('–')[1].trim()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Savings */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                      <p className="text-sm font-medium text-purple-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                          <path d="M10 1L13 7h6l-5 4 2 6-6-4-6 4 2-6-5-4h6L10 1Z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Value Comparison
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-stone-600">Cost per day (Normal)</p>
                          <p className="text-xl font-medium text-stone-800">₹{Math.round(selectedService.cost / 8.5)}/day</p>
                        </div>
                        <div>
                          <p className="text-xs text-stone-600">Cost per day (Urgent)</p>
                          <p className="text-xl font-medium text-stone-800">₹{Math.round((selectedService.cost * 1.2) / 8.5)}/day</p>
                        </div>
                      </div>
                      <p className="text-xs text-purple-700 mt-3 font-medium">
                        💡 Same delivery time, but save ₹{Math.round(selectedService.cost * 0.2)} total by choosing Normal
                      </p>
                    </div>

                    {/* Document Comparison */}
                    <div>
                      <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 20 20" fill="none">
                          <path d="M5 2h8l4 4v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Documents Required
                      </h3>
                      <p className="text-sm text-stone-600 mb-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        Same documents needed for both Normal and Urgent processing
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedService.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-100">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-emerald-600 text-xs font-bold">{idx + 1}</span>
                            </div>
                            <span className="text-sm text-stone-700">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Similar Services */}
                    <div>
                      <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M6 10h8M10 6v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Related Services
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(SERVICES_DATA)
                          .filter(([k, v]) => v !== selectedService && v.difficulty === selectedService.difficulty)
                          .slice(0, 4)
                          .map(([name, service]) => (
                            <div key={name} className="p-4 border border-stone-100 rounded-lg hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer">
                              <p className="font-medium text-stone-800">{name}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-stone-600">
                                <div>Cost: ₹{service.cost}</div>
                                <div>Time: {service.time}</div>
                              </div>
                              <span className="text-xs font-medium text-stone-500 mt-2 inline-block px-2 py-1 bg-stone-100 rounded">
                                {service.difficulty} difficulty
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex gap-3 pt-6 border-t border-stone-100">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-emerald-700 text-white text-sm font-medium rounded-xl px-6 py-3 cursor-pointer border-none hover:bg-emerald-800 transition-colors"
                      >
                        Apply Now
                      </motion.button>
                      <button
                        onClick={() => setShowCompare(false)}
                        className="flex-1 border border-stone-200 text-stone-600 text-sm rounded-xl px-6 py-3 cursor-pointer hover:border-stone-300 transition-colors bg-white font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
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
                      onClick={handleUseMyLocation}
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
                        onKeyDown={(e) => e.key === "Enter" && handleSearchSchemes()}
                        placeholder="Enter city or PIN code"
                        className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors bg-white"
                      />
                    </div>
                    <button
                      onClick={handleSearchSchemes}
                      className="mt-2 w-full bg-stone-900 text-white text-sm font-medium rounded-xl px-4 py-2.5 border-none cursor-pointer hover:bg-stone-800 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-emerald-100 px-4 py-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-emerald-700">Jharkhand quick PINs:</span>
                  {["826001", "834001", "831001"].map((pin) => (
                    <button
                      key={pin}
                      onClick={() => handleJharkhandPinClick(pin)}
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100 transition-colors"
                    >
                      {pin}
                    </button>
                  ))}
                  <span className="text-xs text-stone-400 ml-auto">Enter any Jharkhand PIN to auto-load schemes</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Schemes discovery section */}
          <Reveal delay={0.18} className="mb-12">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 border border-stone-100">
              <p className="text-xs text-emerald-700 uppercase tracking-widest font-medium mb-2">Schemes Available in Your Area</p>
              <h3 className="font-serif text-2xl font-normal text-stone-900 mb-4">
                {detectedState ? `📍 ${detectedState}` : "📍 Detect your state to explore schemes"}
              </h3>

              {isLocationLoading ? (
                <div className="py-6 text-sm text-stone-500">Loading schemes...</div>
              ) : schemesData && Object.keys(schemesData).length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-stone-800 mb-3">🔥 Recommended</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recommendedSchemes.map((scheme) => (
                        <div key={scheme.id} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 cursor-pointer" onClick={() => handleApplyScheme(scheme, scheme.category)}>
                          <p className="text-sm font-semibold text-emerald-900">{scheme.name}</p>
                          <p className="text-xs text-emerald-700 mt-1">{scheme.category}</p>
                          <p className="text-xs text-stone-600 mt-2">Benefit: {scheme.benefit}</p>
                          <p className="text-xs text-stone-600">Eligibility: {scheme.eligibility}</p>
                          <p className="text-xs text-stone-600">Mode: {scheme.mode}</p>
                          <p className="text-xs text-stone-700 mt-1">⭐ {scheme.rating}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {Object.entries(schemesData).map(([category, schemes]) => (
                    <div key={category}>
                      <p className="text-base font-medium text-stone-900 mb-3">
                        {category === "Agriculture" ? "🌾" : category === "Health" ? "🏥" : category === "Education" ? "🎓" : category === "Women" ? "👩" : "💼"} {category}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {schemes.map((scheme) => (
                          <div key={scheme.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4 cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => handleApplyScheme(scheme, category)}>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-stone-900">{scheme.name}</p>
                              <div className="flex gap-1">
                                {scheme.rating >= 4.7 && (
                                  <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700">Popular</span>
                                )}
                                {scheme.mode.toLowerCase().includes("online") && (
                                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Easy Apply</span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-stone-600 mt-2">Benefit: {scheme.benefit}</p>
                            <p className="text-xs text-stone-600">Eligibility: {scheme.eligibility}</p>
                            <p className="text-xs text-stone-600">Mode: {scheme.mode}</p>
                            <p className="text-xs text-stone-700 mt-1">⭐ {scheme.rating}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : detectedState || locationQuery ? (
                <div className="py-6 text-sm text-stone-500">No schemes found for this input.</div>
              ) : (
                <div className="py-6 text-sm text-stone-500">Use location or search by city/PIN to discover schemes.</div>
              )}
            </div>
          </Reveal>

          {/* Interactive India map + region info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal delay={0.2}>
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 border border-stone-700 h-96 lg:h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.22),transparent_42%)]" />
                <div className="relative h-full">
                  <p className="text-xs uppercase tracking-widest text-emerald-300 mb-2">Interactive India Map</p>
                  <p className="text-sm text-stone-300 mb-4">Click on <span className="text-emerald-300 font-medium">Jharkhand</span> to view state schemes</p>
                  <div className="h-[88%] bg-white/5 border border-white/10 rounded-2xl p-2">
                    <IndiaSchemesMap
                      detectedState={detectedState}
                      onSelectJharkhand={() => handleFetchSchemesByState("Jharkhand")}
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="space-y-4 max-h-96 lg:max-h-[500px] overflow-y-auto">
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-emerald-700 font-medium mb-2">State Discovery</p>
                  <h3 className="font-serif text-2xl text-stone-900 mb-3">{detectedState || "No State Selected"}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Select Jharkhand on the map, use "Use my location", or enter a valid Jharkhand PIN (826001, 834001, 831001).
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-3">Quick Actions</p>
                  <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => handleFetchSchemesByState("Jharkhand")} className="w-full text-left px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium cursor-pointer hover:bg-emerald-100 transition-colors">
                      Open Jharkhand Schemes
                    </button>
                    <button onClick={() => handleJharkhandPinClick("826001")} className="w-full text-left px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-sm cursor-pointer hover:bg-stone-100 transition-colors">
                      Search by PIN: 826001 (Dhanbad)
                    </button>
                    <button onClick={() => handleJharkhandPinClick("834001")} className="w-full text-left px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-sm cursor-pointer hover:bg-stone-100 transition-colors">
                      Search by PIN: 834001 (Ranchi)
                    </button>
                  </div>
                </div>
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