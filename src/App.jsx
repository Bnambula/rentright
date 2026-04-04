import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — Global standard colour system
═══════════════════════════════════════════════════════════ */
const T = {
  // Brand
  green:     "#22C55E", greenLight: "#DCFCE7", greenDark: "#15803D",
  blue:      "#38BDF8", blueLight:  "#E0F2FE", blueDark:  "#0369A1",
  amber:     "#F59E0B", amberLight: "#FEF3C7", amberDark: "#92400E",
  red:       "#F87171", redLight:   "#FEE2E2", redDark:   "#991B1B",
  purple:    "#7C3AED", purpleLight:"#EDE9FE", purpleDark:"#5B21B6",
  orange:    "#EA580C", orangeLight:"#FFF7ED",
  // Neutrals
  navy:      "#0F172A", navy2:      "#1E293B", navy3:     "#334155",
  slate:     "#64748B", slateLight: "#94A3B8",
  bg:        "#F8FAFC", card:       "#FFFFFF", border:    "#E2E8F0",
  // Money
  moneyIn:   "#22C55E", moneyOut:   "#F87171",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STATE CONTEXT
═══════════════════════════════════════════════════════════ */
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════ */
const LISTINGS = [
  { id:1, title:"Tranquil Studio, Bukoto",        area:"Bukoto",     price:420000, type:"Self-Contained", verified:true,  boosted:true,  rating:4.9, match:94, confidence:98, moveIn:"ready",   amenities:["WiFi","Water","Security","DSTV"],          img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", desc:"Calm, well-ventilated studio ideal for professionals. Quiet neighbourhood, supermarket 5 min, UMEME metered.", landlord:"Sarah B.", wa:"256700000005", viewingFee:5000, livingScore:9.1, electric:"UMEME metered",   water:"NWSC piped",      noise:"Very Low", lat:0.3476, lng:32.6157 },
  { id:2, title:"Bright Double Room, Kisaasi",    area:"Kisaasi",    price:350000, type:"Double Room",    verified:true,  boosted:false, rating:4.7, match:88, confidence:91, moveIn:"ready",   amenities:["WiFi","Water","Compound"],                 img:"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80", desc:"Bright double room steps from main road. Excellent transport — taxi 1 min. Prepaid meter.",               landlord:"Grace N.",  wa:"256700000002", viewingFee:5000, livingScore:8.3, electric:"Prepaid meter", water:"Piped + tank",    noise:"Low",      lat:0.3620, lng:32.6234 },
  { id:3, title:"Student Hostel, Wandegeya",      area:"Wandegeya",  price:175000, type:"Hostel",         verified:true,  boosted:true,  rating:4.3, match:91, confidence:84, moveIn:"ready",   amenities:["WiFi","Security","Near Campus"],            img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80", desc:"Affordable hostel 2 mins from Makerere. Vibrant student community, reliable WiFi, shared kitchen.",        landlord:"Hostel Admin",wa:"256700000003",viewingFee:5000, livingScore:7.4, electric:"Shared meter",  water:"Piped",           noise:"Moderate", lat:0.3356, lng:32.5694 },
  { id:4, title:"Spacious Single Room, Ntinda",   area:"Ntinda",     price:280000, type:"Single Room",    verified:false, boosted:false, rating:4.1, match:72, confidence:52, moveIn:"viewing", amenities:["Water","Compound","Parking"],               img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", desc:"Spacious single room in a family compound. Peaceful area — awaiting full verification.",                  landlord:"Peter M.",  wa:"256700000004", viewingFee:5000, livingScore:7.1, electric:"Prepaid",       water:"Borehole",        noise:"Low",      lat:0.3540, lng:32.6312 },
  { id:5, title:"Modern Bedsitter, Makerere",     area:"Makerere",   price:240000, type:"Single Room",    verified:true,  boosted:false, rating:4.5, match:89, confidence:93, moveIn:"ready",   amenities:["WiFi","Water","Security"],                 img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", desc:"Neat modern bedsitter near Makerere campus. Quiet zone, reliable power, walking distance to shops.",       landlord:"James K.",  wa:"256700000001", viewingFee:5000, livingScore:8.1, electric:"UMEME prepaid", water:"NWSC reliable",   noise:"Low",      lat:0.3376, lng:32.5681 },
  { id:6, title:"Executive 2BR, Naguru",          area:"Naguru",     price:850000, type:"Self-Contained", verified:true,  boosted:true,  rating:4.8, match:78, confidence:97, moveIn:"ready",   amenities:["WiFi","Water","Security","Parking","DSTV","Generator"], img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", desc:"Executive 2BR in Naguru hills. High-security estate, panoramic views, backup generator.",            landlord:"David R.",  wa:"256700000006", viewingFee:5000, livingScore:9.3, electric:"Generator+UMEME",water:"NWSC + tank",     noise:"Very Low", lat:0.3487, lng:32.6218 },
];

const PROVIDERS = [
  { id:"P1", name:"Aisha Nakato",   type:"Cleaner",         icon:"🧹", area:"Kisaasi",    rating:4.9, reviews:47, price:"UGX 20,000/session", available:true,  dist:"0.8km", verified:true,  nin:"CM92...", img:null },
  { id:"P2", name:"Brian Trucks",   type:"Moving Truck",    icon:"🚛", area:"Ntinda",     rating:4.7, reviews:31, price:"UGX 80,000/job",     available:true,  dist:"1.2km", verified:true,  nin:"CM88...", img:null },
  { id:"P3", name:"Grace Laundry",  type:"Laundry",         icon:"👕", area:"Makerere",   rating:4.8, reviews:62, price:"UGX 6,000/kg",       available:true,  dist:"2.1km", verified:false, nin:"CF88...", img:null },
  { id:"P4", name:"Moses Helpers",  type:"Packing Help",    icon:"👷", area:"Wandegeya",  rating:4.6, reviews:28, price:"UGX 25,000/day",     available:false, dist:"1.5km", verified:true,  nin:"CM78...", img:null },
  { id:"P5", name:"Patrick Electric",type:"Electrician",    icon:"⚡", area:"Bukoto",     rating:4.9, reviews:85, price:"UGX 35,000/visit",   available:true,  dist:"3.2km", verified:true,  nin:"CM75...", img:null },
  { id:"P6", name:"Lucy Clean",     type:"Cleaner",         icon:"🧹", area:"Naguru",     rating:4.7, reviews:39, price:"UGX 15,000/session", available:true,  dist:"4.0km", verified:false, nin:"CF91...", img:null },
];

const REFERRAL_ACTIVITY = [
  { name:"Sarah K.",  action:"Paid viewing fee · Kisaasi Room",    amount:2000, date:"Today",      done:true  },
  { name:"Brian M.",  action:"Paid viewing fee · Makerere Bedsitter", amount:2000, date:"Yesterday", done:true  },
  { name:"Aisha N.",  action:"Paid viewing fee · Wandegeya Hostel",amount:2000, date:"2 days ago", done:true  },
  { name:"Denis O.",  action:"Viewing fee pending",                  amount:2000, date:"3 days ago", done:false },
  { name:"Ruth K.",   action:"Paid viewing fee · Ntinda Room",      amount:2000, date:"1 week ago", done:true  },
];

const TRANSACTIONS = [
  { id:"TXN-8A3F2B", desc:"Viewing fee — Bukoto Studio",     amount:5000,  type:"in",  split:"3k platform + 2k referral", date:"Today 9:14am"    },
  { id:"TXN-7C1E9A", desc:"Viewing fee — Kisaasi Room",      amount:5000,  type:"in",  split:"3k platform + 2k referral", date:"Yesterday 3:22pm" },
  { id:"TXN-4B8D2F", desc:"Referral payout — Brian Mukasa",  amount:2000,  type:"out", split:"Paid to referrer via MoMo", date:"Yesterday 3:22pm" },
  { id:"TXN-2F5A8C", desc:"Moving request — Kisaasi→Ntinda", amount:5000,  type:"in",  split:"Platform service fee",       date:"2 days ago 11:05am"},
  { id:"TXN-9E3B7D", desc:"Premium listing boost — Sarah B.",amount:25000, type:"in",  split:"7-day boost fee",            date:"3 days ago 8:30am" },
];

/* ═══════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════════════════════════════ */
const fmtUGX = n => "UGX " + Math.round(n).toLocaleString();
const scoreColor = s => s >= 8.5 ? T.green : s >= 7 ? T.blue : T.amber;
const confColor  = s => s >= 85  ? T.green : s >= 65 ? T.blue : s >= 40 ? T.amber : T.red;
const confLabel  = s => s >= 85  ? "High Trust" : s >= 65 ? "Good" : s >= 40 ? "Low" : "Risk";
const miInfo = m => m==="ready"
  ? { bg:T.greenLight, color:T.greenDark, icon:"🟢", label:"Move-in Ready" }
  : { bg:T.amberLight, color:T.amberDark, icon:"🟡", label:"Needs Viewing" };

/* ═══════════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════════ */
function Btn({ children, variant="navy", onClick, disabled, style={}, size="md" }) {
  const variants = {
    navy:    { bg: T.navy,   color: "#fff" },
    green:   { bg: T.green,  color: "#fff" },
    blue:    { bg: T.blue,   color: "#fff" },
    orange:  { bg: T.orange, color: "#fff" },
    purple:  { bg: T.purple, color: "#fff" },
    amber:   { bg: T.amber,  color: "#fff" },
    ghost:   { bg: "transparent", color: T.navy, border: `1.5px solid ${T.border}` },
    "ghost-blue": { bg: "transparent", color: T.blue, border: `1.5px solid ${T.blue}` },
    danger:  { bg: T.redLight, color: T.redDark },
  };
  const v = variants[variant] || variants.navy;
  const pad = size === "sm" ? "7px 14px" : size === "lg" ? "14px 26px" : "10px 18px";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? T.border : v.bg, color: disabled ? T.slateLight : v.color,
        border: v.border || "none", borderRadius: 13, padding: pad, fontWeight: 700,
        fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
        cursor: disabled ? "default" : "pointer", fontFamily: "inherit",
        transition: "all .18s", opacity: disabled ? .6 : 1, ...style }}>
      {children}
    </button>
  );
}

function Badge({ children, color = T.green, bg, style={} }) {
  return (
    <span style={{ background: bg || color + "22", color, fontSize: 10, fontWeight: 700,
      padding: "2px 8px", borderRadius: 20, display: "inline-block", ...style }}>
      {children}
    </span>
  );
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick}
      style={{ background: T.card, borderRadius: 18, border: `1.5px solid ${T.border}`,
        boxShadow: "0 2px 10px rgba(15,23,42,.05)", overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "all .2s" : "none", ...style }}
      onMouseEnter={onClick ? e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(15,23,42,.12)"; e.currentTarget.style.borderColor = T.blue; } : undefined}
      onMouseLeave={onClick ? e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 10px rgba(15,23,42,.05)"; e.currentTarget.style.borderColor = T.border; } : undefined}>
      {children}
    </div>
  );
}

function Pill({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: active ? T.navy : "#fff", color: active ? "#fff" : T.navy,
        border: `1.5px solid ${active ? T.navy : T.border}`, borderRadius: 24,
        padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer",
        whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .18s",
        display: "flex", alignItems: "center", gap: 6 }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
}

function Field({ label, children, style={} }) {
  return (
    <div style={{ marginBottom: 12, ...style }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: T.slate, display: "block", marginBottom: 4 }}>{label}</label>}
      {children}
    </div>
  );
}

function Input({ placeholder, value, onChange, type="text", style={} }) {
  return (
    <input value={value} onChange={onChange} type={type} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${value ? T.green : T.border}`,
        fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
        transition: "border-color .2s", ...style }} />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange}
      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${T.border}`,
        fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }}>
      {options.map(o => typeof o === "string"
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function InfoBox({ type = "blue", children }) {
  const map = { blue: [T.blueLight, T.blueDark, T.blue], green: [T.greenLight, T.greenDark, T.green], yellow: [T.amberLight, T.amberDark, T.amber], red: [T.redLight, T.redDark, T.red] };
  const [bg, col, border] = map[type] || map.blue;
  return (
    <div style={{ background: bg, color: col, borderLeft: `3px solid ${border}`,
      borderRadius: 12, padding: "10px 14px", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function ScoreRing({ score, size = 52 }) {
  const r = size * .38, circ = 2 * Math.PI * r, col = scoreColor(score), fs = size * .22;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={size*.07}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={size*.07}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/10)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2+fs*.4} textAnchor="middle" fontSize={fs} fontWeight={700} fill={col}>{score}</text>
      </svg>
      <span style={{ fontSize: 9, color: col, fontWeight: 700, marginTop: 1 }}>
        {score >= 8.5 ? "Excellent" : score >= 7 ? "Good" : "Fair"}
      </span>
    </div>
  );
}

function ConfBar({ score }) {
  const col = confColor(score);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: T.slate }}>🛡️ Trust Score</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: col }}>{score}% · {confLabel(score)}</span>
      </div>
      <div style={{ background: T.border, borderRadius: 10, height: 4, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: col, borderRadius: 10 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MODAL SYSTEM
═══════════════════════════════════════════════════════════ */
function Modal({ title, subtitle, headerBg, onClose, children, wide }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.78)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, backdropFilter: "blur(5px)" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 24, width: "100%",
          maxWidth: wide ? 640 : 480, maxHeight: "94vh", overflowY: "auto",
          boxShadow: "0 40px 90px rgba(0,0,0,.32)",
          animation: "slideUp .25s ease" }}>
        <style>{`@keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}`}</style>
        <div style={{ background: headerBg || T.navy, padding: "16px 22px",
          borderRadius: "24px 24px 0 0", display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", position: "sticky", top: 0, zIndex: 2 }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 15, margin: 0 }}>{title}</p>
            {subtitle && <p style={{ color: "rgba(255,255,255,.7)", fontSize: 11, margin: "2px 0 0" }}>{subtitle}</p>}
          </div>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff",
              borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginLeft: 12 }}>×</button>
        </div>
        <div style={{ padding: "20px 22px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

function StepBar({ steps, current }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.bg }}>
      {steps.map((s, i) => (
        <div key={s} style={{ flex: 1, padding: "9px 0", textAlign: "center", fontSize: 10, fontWeight: 700,
          color: current === i+1 ? T.blue : current > i+1 ? T.green : T.slate,
          borderBottom: `2.5px solid ${current === i+1 ? T.blue : current > i+1 ? T.green : "transparent"}` }}>
          {current > i+1 ? "✓ " : ""}{s}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AUTH MODAL — Phone + OTP flow
═══════════════════════════════════════════════════════════ */
function AuthModal({ defaultTab = "login", onClose, onAuth }) {
  const [tab, setTab] = useState(defaultTab);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setOtpSent(true); }, 1200);
  };

  const handleAuth = () => {
    if (!name && tab === "signup") return;
    if (!email || !password) return;
    // secret admin
    if (email === "admin@rentright.ug" && password === "admin2025") {
      onAuth({ name: "Admin", email, role: "admin", referralCode: "admin", earnings: { total: 0, withdrawable: 0 } });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({
        name: name || email.split("@")[0], email, phone, role,
        referralCode: "ref" + Math.random().toString(36).slice(2, 8),
        earnings: { total: 10000, withdrawable: 4000, pending: 6000 },
        savedListings: [], bookings: []
      });
    }, 1300);
  };

  return (
    <Modal title="Welcome to RentRight!" subtitle="Uganda's #1 verified rental platform" onClose={onClose}
      headerBg={`linear-gradient(135deg,${T.navy},${T.navy2})`}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bg, borderRadius: 14, padding: 4 }}>
        {[["login","Login"],["signup","Sign Up"],["agent","Agent/Provider"]].map(([k,lb]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ flex: 1, background: tab === k ? "#fff" : "transparent",
              color: tab === k ? T.navy : T.slate, border: "none", borderRadius: 10,
              padding: "8px 0", fontWeight: 700, fontSize: 12, cursor: "pointer",
              boxShadow: tab === k ? "0 2px 8px rgba(0,0,0,.08)" : "none", fontFamily: "inherit" }}>
            {lb}
          </button>
        ))}
      </div>

      {tab === "login" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 16, color: T.navy, margin: "0 0 4px" }}>Welcome back</p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 18px" }}>Login to access listings, referrals and bookings.</p>
          <Field label="Email address"><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email"/></Field>
          <Field label="Password"><Input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/></Field>
          <Btn variant="navy" onClick={handleAuth} disabled={loading} style={{ width: "100%", marginTop: 6 }}>
            {loading ? "Logging in…" : "Login →"}
          </Btn>
          <p style={{ textAlign: "center", fontSize: 12, color: T.slate, marginTop: 12 }}>
            No account? <span onClick={() => setTab("signup")} style={{ color: T.blue, cursor: "pointer", fontWeight: 700 }}>Sign up free</span>
          </p>
        </>
      )}

      {tab === "signup" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 16, color: T.navy, margin: "0 0 4px" }}>Create your account</p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 14px" }}>Join to find a home, list property, or offer services.</p>
          {/* Role selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[["tenant","🔍 Find a Home"],["landlord","🏠 List Property"],["mover","🚛 Moving Provider"],["cleaner","🧹 Service Provider"]].map(([r,lb]) => (
              <button key={r} onClick={() => setRole(r)}
                style={{ background: role===r ? T.navy : "#fff", color: role===r ? "#fff" : T.navy,
                  border: `2px solid ${role===r ? T.navy : T.border}`, borderRadius: 12,
                  padding: "9px 6px", fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                {lb}
              </button>
            ))}
          </div>
          <Field label="Full name *"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></Field>
          <Field label="Email address *"><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email"/></Field>
          {/* Phone + OTP */}
          <Field label="Phone number (MTN/Airtel) *">
            <div style={{ display: "flex", gap: 8 }}>
              <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0771 234 567" type="tel" style={{ flex: 1 }}/>
              <Btn variant="green" onClick={sendOTP} disabled={phone.length < 10 || otpSent} size="sm">
                {otpSent ? "✅ Sent" : loading ? "…" : "Send OTP"}
              </Btn>
            </div>
          </Field>
          {otpSent && (
            <Field label="Enter 6-digit OTP *">
              <div style={{ display: "flex", gap: 8 }}>
                <Input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" style={{ flex: 1 }}/>
                {otp.length === 6 && <span style={{ color: T.green, fontSize: 20, alignSelf: "center" }}>✅</span>}
              </div>
              <p style={{ fontSize: 10, color: T.slate, margin: "3px 0 0" }}>Code sent to {phone}. Demo: any 6 digits works.</p>
            </Field>
          )}
          <Field label="Password *"><Input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create password" type="password"/></Field>
          <Field label="Referral code (optional)"><Input value={referral} onChange={e=>setReferral(e.target.value)} placeholder="e.g. ref123abc"/></Field>
          <InfoBox type="green">🔁 Earn <strong>UGX 2,000</strong> for every friend who pays a viewing fee through your link!</InfoBox>
          <Btn variant="green" onClick={handleAuth} disabled={loading || !name || !email || !password}
            style={{ width: "100%", background: `linear-gradient(135deg,${T.green},${T.blue})` }}>
            {loading ? "Creating account…" : "Create Account →"}
          </Btn>
        </>
      )}

      {tab === "agent" && (
        <>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🏢</div>
            <p style={{ fontWeight: 900, fontSize: 15, color: T.navy, margin: "0 0 4px" }}>Agent / Provider Application</p>
            <p style={{ fontSize: 12, color: T.slate, margin: 0 }}>Strict verification · 48-hour review · Physical confirmation</p>
          </div>
          <InfoBox type="yellow">
            <strong>📋 Required before approval:</strong><br/>
            🪪 Valid National ID (NIN) · 📜 LC Introductory Letter · 👤 One Guarantor (permanent resident) · ✍️ Signed Digital Agreement
          </InfoBox>
          <InfoBox type="blue">⏱️ <strong>48-hour admin review.</strong> We verify NIN, contact your guarantor, and may assign a field agent to your address.</InfoBox>
          <Btn variant="purple" style={{ width: "100%" }}
            onClick={() => onAuth({ name: "Agent Applicant", email: "agent@example.com", role: "agent_pending", referralCode: "agref" + Math.random().toString(36).slice(2,6), earnings: { total: 0, withdrawable: 0 } })}>
            Start Agent Application →
          </Btn>
        </>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAYMENT MODAL — UGX 5,000 MoMo flow
═══════════════════════════════════════════════════════════ */
function PaymentModal({ amount, title, subtitle, onSuccess, onClose, splitNote }) {
  const [step, setStep] = useState(1); // 1=choose 2=pay 3=done
  const [method, setMethod] = useState("mtn");
  const [momo, setMomo] = useState("");
  const [paying, setPaying] = useState(false);
  const txn = useRef("TXN-" + Math.random().toString(36).slice(2, 10).toUpperCase());

  const pay = () => {
    if (momo.length < 10) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setStep(3); }, 2400);
  };

  return (
    <Modal title="Secure Payment" subtitle={title} onClose={onClose}
      headerBg={`linear-gradient(135deg,${T.navy},${T.navy2})`}>
      {step === 1 && (
        <>
          <p style={{ fontWeight: 800, fontSize: 15, color: T.navy, margin: "0 0 4px" }}>Choose Payment Method</p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 16px" }}>Amount: <strong style={{ color: T.navy, fontSize: 14 }}>{fmtUGX(amount)}</strong>{splitNote && <span style={{ color: T.slate, fontSize: 11 }}> — {splitNote}</span>}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["mtn","📱","MTN Mobile Money","Gold · Instant"],["airtel","📲","Airtel Money","Blue · Instant"]].map(([id,ic,nm,sub]) => (
              <button key={id} onClick={() => setMethod(id)}
                style={{ background: method===id ? (id==="mtn"?"linear-gradient(135deg,#FFD700,#F59E0B)":"linear-gradient(135deg,#2563EB,#38BDF8)") : T.bg,
                  border: `2px solid ${method===id?(id==="mtn"?"#F59E0B":T.blue):T.border}`,
                  borderRadius: 14, padding: "14px 12px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{ic}</span>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 12, color: method===id?"#fff":T.navy, margin: 0 }}>{nm}</p>
                    <p style={{ fontSize: 10, color: method===id?"rgba(255,255,255,.7)":T.slate, margin: 0 }}>{sub}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Btn variant={method==="mtn"?"amber":"blue"} onClick={() => setStep(2)} style={{ width:"100%" }}>
            Continue with {method==="mtn"?"MTN MoMo":"Airtel Money"} →
          </Btn>
        </>
      )}
      {step === 2 && (
        <>
          <p style={{ fontWeight: 800, fontSize: 15, color: T.navy, margin: "0 0 4px" }}>
            {method==="mtn"?"📱 MTN Mobile Money":"📲 Airtel Money"}
          </p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 16px" }}>
            Paying: <strong style={{ color: T.navy }}>{fmtUGX(amount)}</strong>
          </p>
          <Field label="Your MoMo number *">
            <Input value={momo} onChange={e=>setMomo(e.target.value)} placeholder="e.g. 0771 234 567" type="tel"/>
          </Field>
          <InfoBox type="blue">🔒 You'll receive a payment request on your phone. Approve to complete. Your landlord contact is revealed instantly after confirmation.</InfoBox>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
            <Btn variant={method==="mtn"?"amber":"blue"} onClick={pay} disabled={momo.length<10||paying}
              style={{ flex: 2 }}>
              {paying ? "Processing…" : `💳 Pay ${fmtUGX(amount)}`}
            </Btn>
          </div>
        </>
      )}
      {step === 3 && (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>✅</div>
          <p style={{ fontWeight: 900, fontSize: 18, color: T.greenDark, margin: "0 0 4px" }}>Payment Confirmed!</p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 16px" }}>Transaction: <strong>{txn.current}</strong></p>
          {splitNote && (
            <div style={{ background: T.greenLight, borderRadius: 12, padding: "10px 14px", fontSize: 11, color: T.greenDark, marginBottom: 16, textAlign: "left" }}>
              💰 <strong>Payment split:</strong> {splitNote}
            </div>
          )}
          <Btn variant="green" onClick={() => onSuccess(txn.current)} style={{ padding: "12px 32px" }}>
            Continue →
          </Btn>
        </div>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKING MODAL — full 4-step flow
═══════════════════════════════════════════════════════════ */
function BookingModal({ listing, onClose, user, onNeedAuth }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [date, setDate] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [showPay, setShowPay] = useState(false);

  if (!user) return (
    <Modal title="Login Required" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔐</div>
        <p style={{ fontWeight: 800, fontSize: 17, color: T.navy, margin: "0 0 6px" }}>Login to Book a Viewing</p>
        <p style={{ fontSize: 12, color: T.slate, margin: "0 0 20px" }}>Create a free account or login to unlock landlord contacts.</p>
        <Btn variant="green" onClick={() => { onClose(); onNeedAuth("signup"); }} style={{ width: "100%", marginBottom: 8 }}>Create Free Account</Btn>
        <Btn variant="navy" onClick={() => { onClose(); onNeedAuth("login"); }} style={{ width: "100%" }}>Login</Btn>
      </div>
    </Modal>
  );

  return (
    <>
      <Modal title="Book a Viewing" subtitle={listing.title} onClose={onClose}>
        <StepBar steps={["Details","Agreement","Payment","Confirmed"]} current={step}/>
        <div style={{ marginTop: 18 }}>
          {step === 1 && (
            <>
              <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>Your Details</p>
              <Field label="Full name *"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></Field>
              <Field label="Phone number *"><Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0771 234 567" type="tel"/></Field>
              <Field label="Preferred viewing date *"><Input value={date} onChange={e=>setDate(e.target.value)} type="date"/></Field>
              <InfoBox type="yellow">💡 <strong>Viewing fee: {fmtUGX(listing.viewingFee)}</strong> — Platform keeps UGX 3,000, your referrer earns UGX 2,000. Filters out time-wasters and ensures serious enquiries.</InfoBox>
              <Btn variant="navy" onClick={() => setStep(2)} disabled={!name||!phone||!date} style={{ width: "100%" }}>Next → Agreement</Btn>
            </>
          )}
          {step === 2 && (
            <>
              <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 12px" }}>Tenant Booking Agreement</p>
              <div style={{ background: T.bg, borderRadius: 14, padding: "14px", fontSize: 11, lineHeight: 1.8,
                color: T.navy3, maxHeight: 170, overflowY: "auto", border: `1px solid ${T.border}`, marginBottom: 12 }}>
                <strong>RentRight! Booking Terms</strong><br/><br/>
                1. Viewing fee of {fmtUGX(listing.viewingFee)} is <strong>non-refundable</strong> once paid.<br/>
                2. RentRight! is a listing &amp; matching platform only — not responsible for property conditions.<br/>
                3. Physically inspect before paying any rent.<br/>
                4. Landlord contact revealed only after payment.<br/>
                5. Never pay rent without a signed tenancy agreement.<br/>
                6. Your IP address, device ID and timestamp ({new Date().toLocaleString()}) are recorded.
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 14 }}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
                  style={{ marginTop: 3, accentColor: T.green, width: 16, height: 16, flexShrink: 0 }}/>
                <span style={{ fontSize: 11, color: T.navy3, lineHeight: 1.5 }}>
                  I, <strong>{name}</strong>, accept all RentRight! Booking Terms.
                </span>
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
                <Btn variant="green" onClick={() => setShowPay(true)} disabled={!agreed} style={{ flex: 2 }}>Agree → Pay {fmtUGX(listing.viewingFee)}</Btn>
              </div>
            </>
          )}
          {step === 3 && !txnId && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>✅</div>
              <p style={{ fontWeight: 900, fontSize: 18, color: T.greenDark, margin: "0 0 6px" }}>Payment Confirmed!</p>
              <p style={{ fontSize: 12, color: T.slate, margin: "0 0 14px" }}>Transaction: <strong>{txnId || "TXN-DEMO"}</strong></p>
              <Btn variant="green" onClick={() => setStep(4)}>View Confirmation →</Btn>
            </div>
          )}
          {step === 4 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>🏠</div>
              <p style={{ fontWeight: 900, fontSize: 17, color: T.navy, margin: "0 0 12px" }}>Viewing Confirmed!</p>
              <div style={{ background: T.greenLight, borderRadius: 14, padding: "14px 16px", marginBottom: 12, textAlign: "left", fontSize: 12, lineHeight: 1.8 }}>
                <p style={{ fontWeight: 700, color: T.greenDark, margin: "0 0 6px" }}>✅ Booking Details</p>
                <p style={{ margin: 0, color: T.navy3 }}>
                  <strong>Name:</strong> {name}<br/>
                  <strong>Property:</strong> {listing.title}<br/>
                  <strong>Date:</strong> {date}<br/>
                  <strong>Fee paid:</strong> {fmtUGX(listing.viewingFee)} · {txnId || "TXN-DEMO"}<br/>
                  <strong>🔓 Landlord:</strong> {listing.landlord} · 0712 345 678
                </p>
              </div>
              <a href={`https://wa.me/${listing.wa}?text=Hi! I booked a viewing for "${listing.title}" via RentRight!. Name: ${name}, Date: ${date}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#25D366", color: "#fff", borderRadius: 14,
                  padding: "12px 0", fontWeight: 800, fontSize: 14, textDecoration: "none", marginBottom: 8 }}>
                💬 Message Landlord on WhatsApp
              </a>
              <Btn variant="navy" onClick={onClose} style={{ width: "100%" }}>Done ✓</Btn>
            </div>
          )}
        </div>
      </Modal>
      {showPay && (
        <PaymentModal
          amount={listing.viewingFee}
          title={`Viewing fee — ${listing.title}`}
          splitNote="UGX 3,000 to platform · UGX 2,000 to your referrer"
          onSuccess={id => { setTxnId(id); setShowPay(false); setStep(4); }}
          onClose={() => setShowPay(false)}/>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   LISTING DETAIL MODAL
═══════════════════════════════════════════════════════════ */
function ListingDetail({ listing: l, onClose, onBook, user }) {
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);
  const mii = miInfo(l.moveIn);
  return (
    <Modal title={l.title} subtitle={`📍 ${l.area} · ${l.type}`} onClose={onClose} wide>
      {/* Image */}
      <div style={{ position: "relative", margin: "-20px -22px 0", marginBottom: 16 }}>
        <img src={l.img} alt={l.title} style={{ width: "100%", height: 220, objectFit: "cover" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,.5) 0%,transparent 55%)" }}/>
        <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 5 }}>
          <Badge color={l.verified ? T.greenDark : T.redDark} bg={l.verified ? T.greenLight : T.redLight}>
            {l.verified ? "✔ Verified Safe Home" : "⚠ Unverified"}
          </Badge>
          <Badge color={mii.color} bg={mii.bg}>{mii.icon} {mii.label}</Badge>
        </div>
        <div style={{ position: "absolute", bottom: 12, right: 12,
          background: "rgba(15,23,42,.86)", color: "#fff", fontWeight: 900,
          fontSize: 14, padding: "4px 12px", borderRadius: 20 }}>
          {fmtUGX(l.price)}/mo
        </div>
      </div>

      {/* Trust badges */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
        {l.verified && <Badge color={T.greenDark} bg={T.greenLight}>🟢 Verified Owner</Badge>}
        <Badge color={T.blueDark} bg={T.blueLight}>📸 Real Photos</Badge>
        <Badge color={T.greenDark} bg={T.greenLight}>📍 GPS Tagged</Badge>
        <Badge color={T.amberDark} bg={T.amberLight}>🧾 Price Verified</Badge>
        <Badge color={T.redDark} bg={T.redLight}>🔒 Contact Locked</Badge>
      </div>

      {/* Confidence */}
      <div style={{ marginBottom: 12 }}><ConfBar score={l.confidence}/></div>

      {/* AI desc */}
      <InfoBox type="blue">🤖 {l.desc}</InfoBox>

      {/* Living score */}
      <div style={{ background: T.bg, borderRadius: 14, padding: "12px 14px", marginBottom: 12, border: `1px solid ${T.border}` }}>
        <p style={{ fontWeight: 800, fontSize: 12, color: T.navy, margin: "0 0 10px" }}>🌿 Living Environment</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["⚡",l.electric||"UMEME"],["💧",l.water||"NWSC piped"],["🔇","Noise: "+l.noise]].map(([ic,val]) => (
            <div key={val} style={{ background: "#fff", borderRadius: 10, padding: "8px 10px", textAlign: "center", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{ic}</div>
              <div style={{ fontSize: 9, color: T.slate }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, background: "#fff", borderRadius: 12, padding: "9px 12px", border: `1px solid ${T.greenLight}` }}>
          <ScoreRing score={l.livingScore} size={46}/>
          <div>
            <p style={{ fontWeight: 800, fontSize: 13, color: T.navy, margin: 0 }}>Living Score: {l.livingScore}/10</p>
            <p style={{ fontSize: 10, color: T.slate, margin: 0 }}>Safety · Cleanliness · Access</p>
          </div>
          <Badge color={T.blueDark} bg={T.blueLight} style={{ marginLeft: "auto" }}>⚡ {l.match}% match</Badge>
        </div>
      </div>

      {/* Price transparency */}
      <InfoBox type="yellow">🧾 Similar homes in {l.area}: {fmtUGX(l.price * .8)} – {fmtUGX(l.price * 1.4)}/mo</InfoBox>

      {/* Amenities */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontWeight: 700, fontSize: 12, margin: "0 0 6px", color: T.navy }}>Amenities</p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {l.amenities.map(a => <Badge key={a} color={T.greenDark} bg={T.greenLight}>{a}</Badge>)}
        </div>
      </div>

      {/* Contact locked */}
      <div style={{ background: `linear-gradient(135deg,${T.navy2},${T.navy})`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 28 }}>🔒</span>
        <div>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: 0 }}>Landlord contact is hidden</p>
          <p style={{ color: T.slateLight, fontSize: 11, margin: 0 }}>Pay {fmtUGX(l.viewingFee)} viewing fee to unlock phone &amp; WhatsApp · UGX 2,000 credited to your referrer</p>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
        <Btn variant="green" onClick={() => onBook(l)} style={{ padding: "13px 0", fontSize: 14 }}>📅 Book Viewing</Btn>
        <Btn variant="blue" onClick={() => onBook(l)} style={{ padding: "13px 0", fontSize: 14 }}>🔓 Unlock Contact</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Btn variant="ghost-blue" onClick={() => { navigator.clipboard.writeText(`"${l.title}" on RentRight! ${fmtUGX(l.price)}/mo · ${l.area}\nrentright.ug`); setCopied(true); setTimeout(() => setCopied(false), 2500); }}>
          {copied ? "✅ Copied!" : "🔁 Share & Earn"}
        </Btn>
        {!reported
          ? <Btn variant="danger" onClick={() => setReported(true)}>🚨 Report</Btn>
          : <div style={{ background: T.greenLight, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: T.greenDark, fontWeight: 700 }}>✅ Reported</div>
        }
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   LISTING CARD
═══════════════════════════════════════════════════════════ */
function ListingCard({ l, onClick }) {
  const mii = miInfo(l.moveIn);
  const col = confColor(l.confidence);
  return (
    <Card onClick={onClick} style={{ border: l.boosted ? `1.5px solid ${T.amber}` : undefined }}>
      {/* Image */}
      <div style={{ position: "relative" }}>
        <img src={l.img} alt={l.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,.5) 0%,transparent 55%)" }}/>
        {/* Tags top */}
        <div style={{ position: "absolute", top: 9, left: 9, display: "flex", gap: 4 }}>
          {l.boosted && <Badge color="#fff" bg="linear-gradient(135deg,#F59E0B,#D97706)" style={{ color: "#fff" }}>🚀 Boosted</Badge>}
          <Badge color={l.verified ? T.greenDark : T.redDark} bg={l.verified ? T.greenLight : T.redLight}>
            {l.verified ? "✔" : "⚠"} {l.verified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <div style={{ position: "absolute", bottom: 9, left: 9 }}>
          <Badge color={mii.color} bg={mii.bg}>{mii.icon} {mii.label}</Badge>
        </div>
        <div style={{ position: "absolute", bottom: 9, right: 9, background: "rgba(15,23,42,.86)", color: "#fff", fontWeight: 800, fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>
          {fmtUGX(l.price)}/mo
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: 0, lineHeight: 1.3 }}>{l.title}</p>
            <p style={{ color: T.slate, fontSize: 11, margin: "2px 0 0" }}>📍 {l.area} · {l.type}</p>
          </div>
          <ScoreRing score={l.livingScore} size={48}/>
        </div>
        {/* Trust bar */}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ flex: 1, background: T.border, borderRadius: 10, height: 4, overflow: "hidden" }}>
            <div style={{ width: `${l.confidence}%`, height: "100%", background: col, borderRadius: 10 }}/>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: col, whiteSpace: "nowrap" }}>{l.confidence}% trust</span>
        </div>
        {/* Chips */}
        <div style={{ marginTop: 7, display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <Badge color={T.blueDark} bg={T.blueLight}>⚡ {l.match}%</Badge>
          <Badge color={T.greenDark} bg={T.greenLight}>⚡ Power ✓</Badge>
          <span style={{ color: T.amber, fontSize: 11 }}>{"★".repeat(Math.round(l.rating))}</span>
          <Badge color={T.amberDark} bg={T.amberLight} style={{ marginLeft: "auto" }}>Fee: {fmtUGX(l.viewingFee)}</Badge>
        </div>
        {/* Amenities */}
        <div style={{ marginTop: 7, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {l.amenities.slice(0, 3).map(a => <Badge key={a} color={T.navy3} bg={T.bg}>{a}</Badge>)}
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   USER DASHBOARD — earnings, referrals, saved, bookings
═══════════════════════════════════════════════════════════ */
function UserDashboard({ user, onClose, onLogout, onMoving }) {
  const [tab, setTab] = useState("earnings");
  const refCode = user?.referralCode || "ref123abc";
  const [copied, setCopied] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const e = user?.earnings || { total: 10000, withdrawable: 4000, pending: 6000 };

  return (
    <Modal title={`👋 ${user?.name}`} subtitle="Your RentRight! dashboard"
      headerBg={`linear-gradient(135deg,${T.greenDark},${T.green})`} onClose={onClose} wide>
      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[["💰","Total Earned",fmtUGX(e.total),T.greenDark],["⏳","Pending",fmtUGX(e.pending||0),T.amber],["✅","Withdrawable",fmtUGX(e.withdrawable),T.blue]].map(([ic,lb,val,col]) => (
          <div key={lb} style={{ background: T.bg, borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{ic}</div>
            <p style={{ fontWeight: 900, fontSize: 13, color: col, margin: 0 }}>{val}</p>
            <p style={{ fontSize: 9, color: T.slate, margin: 0 }}>{lb}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 18 }}>
        {[["earnings","💰 Earnings"],["referrals","🔁 Referrals"],["activity","📊 Activity"],["moving","🚚 Moving"]].map(([k,lb]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ flex: 1, padding: "10px 0", fontSize: 11, fontWeight: 700,
              background: "transparent", border: "none",
              borderBottom: `2.5px solid ${tab===k?T.green:"transparent"}`,
              color: tab===k?T.greenDark:T.slate, cursor: "pointer", fontFamily: "inherit" }}>
            {lb}
          </button>
        ))}
      </div>

      {/* EARNINGS TAB */}
      {tab === "earnings" && (
        <>
          {/* Referral banner */}
          <div style={{ background: `linear-gradient(135deg,${T.greenDark},${T.blue})`, borderRadius: 18, padding: "18px 20px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, background: "rgba(255,255,255,.08)", borderRadius: "50%" }}/>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 17, margin: "0 0 4px" }}>Invite Friends — Earn UGX 2,000 Each!</p>
            <p style={{ color: "rgba(255,255,255,.8)", fontSize: 12, margin: "0 0 12px" }}>Every time a friend pays a viewing fee through your link</p>
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, flex: 1 }}>rentright.ug/ref/{refCode}</span>
              <button onClick={() => { navigator.clipboard.writeText(`rentright.ug/ref/${refCode}`); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
                style={{ background: "#fff", color: T.greenDark, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                {copied ? "✅ Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["💰 Platform earns UGX 3,000","💸 You earn UGX 2,000","🎯 Per viewing fee paid"].map(t => (
                <span key={t} style={{ background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 10, padding: "3px 10px", borderRadius: 20 }}>{t}</span>
              ))}
            </div>
          </div>
          {/* Withdraw */}
          <div style={{ background: T.bg, borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: `1px solid ${T.border}` }}>
            <p style={{ fontWeight: 800, fontSize: 13, color: T.navy, margin: "0 0 12px" }}>💵 Withdraw Earnings</p>
            <p style={{ fontSize: 11, color: T.slate, margin: "0 0 12px" }}>Minimum withdrawal: <strong>UGX 20,000</strong>. Your balance: <strong style={{ color: T.blue }}>{fmtUGX(e.withdrawable)}</strong></p>
            {e.withdrawable >= 20000 ? (
              !withdrawn
                ? <Btn variant="blue" onClick={() => { setWithdrawing(true); setTimeout(() => { setWithdrawing(false); setWithdrawn(true); }, 2200); }} style={{ width: "100%" }}>
                    {withdrawing ? "Processing…" : `Withdraw ${fmtUGX(e.withdrawable)} to MoMo`}
                  </Btn>
                : <div style={{ background: T.greenLight, borderRadius: 12, padding: "11px", textAlign: "center", fontSize: 13, color: T.greenDark, fontWeight: 700 }}>✅ {fmtUGX(e.withdrawable)} sent to your MoMo!</div>
            ) : (
              <div style={{ background: T.bg, borderRadius: 12, padding: "11px", textAlign: "center", fontSize: 12, color: T.slate, border: `1px solid ${T.border}` }}>
                Need {fmtUGX(20000 - e.withdrawable)} more to withdraw. Keep referring!
              </div>
            )}
          </div>
        </>
      )}

      {/* REFERRALS TAB */}
      {tab === "referrals" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>Recent Referral Activity</p>
          {REFERRAL_ACTIVITY.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 34, height: 34, background: h.done ? T.greenLight : T.amberLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {h.done ? "✅" : "⏳"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: T.navy, margin: 0 }}>{h.name}</p>
                <p style={{ fontSize: 11, color: T.slate, margin: 0 }}>{h.action} · {h.date}</p>
              </div>
              <p style={{ fontWeight: 800, fontSize: 13, color: h.done ? T.greenDark : T.amber, margin: 0, whiteSpace: "nowrap" }}>+{fmtUGX(h.amount)}</p>
            </div>
          ))}
        </>
      )}

      {/* ACTIVITY TAB */}
      {tab === "activity" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>Transaction History</p>
          {TRANSACTIONS.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.bg, borderRadius: 12, marginBottom: 8, border: `1px solid ${T.border}` }}>
              <div style={{ width: 36, height: 36, background: t.type==="in" ? T.greenLight : T.redLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {t.type === "in" ? "↓" : "↑"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: T.navy, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.desc}</p>
                <p style={{ fontSize: 10, color: T.slate, margin: 0 }}>{t.id} · {t.date}</p>
                <p style={{ fontSize: 10, color: T.slate, margin: 0, fontStyle: "italic" }}>{t.split}</p>
              </div>
              <p style={{ fontWeight: 800, fontSize: 13, color: t.type==="in"?T.greenDark:T.redDark, margin: 0, whiteSpace: "nowrap" }}>
                {t.type==="in"?"+":"-"}{fmtUGX(t.amount)}
              </p>
            </div>
          ))}
        </>
      )}

      {/* MOVING TAB */}
      {tab === "moving" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 15, color: T.navy, margin: "0 0 6px" }}>🚚 Moving Services</p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 14px" }}>Need help moving? Post a job and providers near you will respond.</p>
          <Btn variant="orange" onClick={() => { onClose(); onMoving(); }} style={{ width: "100%", fontSize: 14, padding: "13px 0", marginBottom: 10 }}>
            🚚 Open Moving Marketplace
          </Btn>
          {[{icon:"🚛",title:"Hire Movers",desc:"Professionals with trucks near you"},{icon:"🚐",title:"Book Transport",desc:"Vehicle for your furniture"},{icon:"👷",title:"Packing Helpers",desc:"Manual helpers paid by the hour"}].map(s => (
            <button key={s.title} onClick={() => { onClose(); onMoving(); }}
              style={{ width:"100%", background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:14, padding:"12px 14px", display:"flex", gap:12, alignItems:"center", marginBottom:8, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div><p style={{ fontWeight:700, fontSize:13, color:T.navy, margin:0 }}>{s.title}</p><p style={{ fontSize:11, color:T.slate, margin:0 }}>{s.desc}</p></div>
              <span style={{ marginLeft:"auto", color:T.blue, fontSize:18 }}>→</span>
            </button>
          ))}
        </>
      )}

      {/* Logout */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
        <Btn variant="ghost" onClick={onLogout} style={{ flex: 1 }}>Logout</Btn>
        <Btn variant="navy" onClick={onClose} style={{ flex: 2 }}>Close Dashboard</Btn>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN DASHBOARD — full control panel
═══════════════════════════════════════════════════════════ */
function AdminDashboard({ onClose }) {
  const [tab, setTab] = useState("overview");
  const [fees, setFees] = useState({ viewingFee: 5000, referralPayout: 2000, withdrawMin: 20000, platformKeep: 3000, boostWeek: 25000, boost30: 50000, verify: 40000, movingComm: 8 });

  const PENDING_VERIFICATIONS = [
    { name:"Moses Opio",    type:"Moving Provider", nin:"CM920...", submitted:"2h ago",  docs:{nin:true,lc:true,agreement:true,vehicle:true},  status:"pending" },
    { name:"Aisha Kamya",   type:"Cleaner",         nin:"CF880...", submitted:"5h ago",  docs:{nin:true,lc:false,agreement:true,vehicle:false}, status:"pending" },
    { name:"Patrick Muwanga",type:"Agent",           nin:"CM780...", submitted:"1d ago",  docs:{nin:true,lc:true,agreement:true,vehicle:false},  status:"pending" },
    { name:"Ruth Adong",    type:"Moving Provider", nin:"CF950...", submitted:"2d ago",  docs:{nin:true,lc:true,agreement:true,vehicle:true},   status:"approved"},
  ];

  return (
    <Modal title="⚙️ Admin Control Panel" subtitle="RentRight! Internal — Restricted Access"
      headerBg={`linear-gradient(135deg,${T.redDark},${T.purpleDark})`} onClose={onClose} wide>
      {/* Tab bar */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${T.border}`, marginBottom: 18, gap: 0 }}>
        {[["overview","📊"],["listings","🏠"],["payments","💳"],["referrals","🔁"],["verify","🔍"],["moving","🚚"],["settings","⚙️"]].map(([k,ic]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, background: "transparent",
              border: "none", borderBottom: `2.5px solid ${tab===k?T.red:"transparent"}`,
              color: tab===k?T.redDark:T.slate, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {ic} {k.charAt(0).toUpperCase()+k.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 18 }}>
            {[["🏠","Listings",LISTINGS.length,T.green],["👤","Users","2,847",T.blue],["💰","Revenue","UGX 4.28M",T.amber],["⏳","Pending","15",T.amber],["🚨","Flagged","3",T.red],["🚚","Moving Jobs","8",T.orange]].map(([ic,lb,val,col]) => (
              <div key={lb} style={{ background: T.bg, borderRadius: 14, padding: "13px 12px", border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 22, margin: "0 0 4px" }}>{ic}</p>
                <p style={{ fontWeight: 900, fontSize: 15, color: col, margin: 0 }}>{val}</p>
                <p style={{ fontSize: 10, color: T.slate, margin: 0 }}>{lb}</p>
              </div>
            ))}
          </div>
          {/* Revenue breakdown */}
          <div style={{ background: T.bg, borderRadius: 14, padding: "14px", border: `1px solid ${T.border}`, marginBottom: 12 }}>
            <p style={{ fontWeight: 800, fontSize: 13, color: T.navy, margin: "0 0 12px" }}>💰 Revenue Split (Platform keeps UGX 3,000 of each UGX 5,000 viewing fee)</p>
            {[["Viewing Fees — platform share","UGX 744,000","248 payments × UGX 3,000"],["Referral payouts sent","UGX 496,000","248 payments × UGX 2,000 paid out"],["Boost fees","UGX 975,000","39 landlords boosted"],["Moving commissions (8%)","UGX 640,000","16 moving jobs"],["Land access fees","UGX 945,000","19 land queries"],["Verification service","UGX 480,000","12 physical verifications"]].map(([lb,amt,sub]) => (
              <div key={lb} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <div><p style={{ fontWeight: 600, fontSize: 12, color: T.navy, margin: 0 }}>{lb}</p><p style={{ fontSize: 10, color: T.slate, margin: 0 }}>{sub}</p></div>
                <p style={{ fontWeight: 800, fontSize: 13, color: T.amber, margin: 0 }}>{amt}</p>
              </div>
            ))}
          </div>
          {/* Fraud alerts */}
          <div style={{ background: T.redLight, borderRadius: 14, padding: "14px", border: `1px solid rgba(248,113,113,.3)` }}>
            <p style={{ fontWeight: 800, fontSize: 13, color: T.redDark, margin: "0 0 10px" }}>🚨 Fraud Alerts</p>
            {[["Ntinda listing","Same phone posted 3 houses in 1 day"],["Wandegeya agent","GPS mismatch detected"],["Bukoto #44","Price 60% below market average"]].map(([t,r]) => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,.6)", borderRadius: 10, padding: "9px 12px", marginBottom: 7 }}>
                <div><p style={{ fontWeight: 700, fontSize: 12, color: T.navy, margin: 0 }}>{t}</p><p style={{ fontSize: 10, color: T.redDark, margin: 0 }}>{r}</p></div>
                <Btn variant="danger" size="sm" onClick={() => alert(`Listing frozen: ${t}`)}>Freeze</Btn>
              </div>
            ))}
          </div>
        </>
      )}

      {/* LISTINGS */}
      {tab === "listings" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>All Listings ({LISTINGS.length})</p>
          {LISTINGS.map(l => (
            <div key={l.id} style={{ background: T.bg, borderRadius: 12, padding: "11px 14px", marginBottom: 8, border: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "center" }}>
              <img src={l.img} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: T.navy, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</p>
                <p style={{ fontSize: 10, color: T.slate, margin: 0 }}>{fmtUGX(l.price)}/mo · {l.confidence}% trust · {l.views||Math.floor(Math.random()*400)} views</p>
              </div>
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                <Badge color={l.verified?T.greenDark:T.redDark} bg={l.verified?T.greenLight:T.redLight}>{l.verified?"✔":"⚠"}</Badge>
                <Btn variant="danger" size="sm" onClick={() => alert(`Listing frozen: ${l.title}`)}>Freeze</Btn>
              </div>
            </div>
          ))}
        </>
      )}

      {/* PAYMENTS */}
      {tab === "payments" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>All Transactions</p>
          {TRANSACTIONS.map((t, i) => (
            <div key={i} style={{ background: T.bg, borderRadius: 12, padding: "11px 14px", marginBottom: 8, border: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, background: t.type==="in"?T.greenLight:T.redLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {t.type==="in"?"↓":"↑"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 12, color: T.navy, margin: 0 }}>{t.desc}</p>
                <p style={{ fontSize: 10, color: T.slate, margin: 0 }}>{t.id} · {t.date}</p>
                <p style={{ fontSize: 10, color: T.slate, margin: 0, fontStyle: "italic" }}>{t.split}</p>
              </div>
              <p style={{ fontWeight: 800, fontSize: 13, color: t.type==="in"?T.greenDark:T.redDark, margin: 0 }}>
                {t.type==="in"?"+":"-"}{fmtUGX(t.amount)}
              </p>
            </div>
          ))}
        </>
      )}

      {/* REFERRALS */}
      {tab === "referrals" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>Referral Payouts</p>
          <InfoBox type="blue">💸 System automatically pays <strong>UGX 2,000</strong> to referrer when their friend's viewing fee is confirmed. Platform retains <strong>UGX 3,000</strong>.</InfoBox>
          {REFERRAL_ACTIVITY.map((h,i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.bg, borderRadius: 12, marginBottom: 8, border: `1px solid ${T.border}` }}>
              <div style={{ width: 32, height: 32, background: h.done?T.greenLight:T.amberLight, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{h.done?"✅":"⏳"}</div>
              <div style={{ flex: 1 }}><p style={{ fontWeight:700, fontSize:12, color:T.navy, margin:0 }}>{h.name}</p><p style={{ fontSize:10, color:T.slate, margin:0 }}>{h.action} · {h.date}</p></div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight:800, fontSize:12, color:h.done?T.greenDark:T.amber, margin:0 }}>Paid: {fmtUGX(h.amount)}</p>
                <p style={{ fontSize:9, color:T.slate, margin:0 }}>Platform kept: {fmtUGX(3000)}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {/* VERIFY */}
      {tab === "verify" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 4px" }}>Document Verification Queue</p>
          <p style={{ fontSize: 12, color: T.slate, margin: "0 0 14px" }}>Review NINs, LC letters and signed agreements. 48-hour SLA.</p>
          {PENDING_VERIFICATIONS.map((app, idx) => (
            <div key={idx} style={{ background: app.status==="approved"?T.greenLight:T.bg, borderRadius: 14, padding: "14px", marginBottom: 14, border: `1.5px solid ${app.status==="approved"?T.green:T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 13, color: T.navy, margin: 0 }}>{app.name}</p>
                  <p style={{ fontSize: 10, color: T.slate, margin: "2px 0 0" }}>{app.type} · Submitted {app.submitted} · NIN: {app.nin}</p>
                </div>
                <Badge color={app.status==="approved"?T.greenDark:T.amberDark} bg={app.status==="approved"?T.greenLight:T.amberLight}>
                  {app.status==="approved"?"✅ Approved":"⏳ Pending"}
                </Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
                {[["🪪","NIN",app.docs.nin],["📜","LC Letter",app.docs.lc],["✍️","Agreement",app.docs.agreement],["🚛","Vehicle",app.docs.vehicle]].map(([ic,lb,has]) => (
                  <div key={lb} style={{ background: "#fff", borderRadius: 10, padding: "8px", textAlign: "center", border: `1px solid ${has?T.green:T.amber}` }}>
                    <p style={{ fontSize: 18, margin: "0 0 2px" }}>{ic}</p>
                    <p style={{ fontSize: 9, fontWeight: 700, color: has?T.greenDark:T.orange, margin: 0 }}>{lb}</p>
                    <p style={{ fontSize: 9, color: has?T.greenDark:T.redDark, margin: 0 }}>{has?"✅":"❌"}</p>
                  </div>
                ))}
              </div>
              {app.status === "pending" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <Btn variant="green" size="sm" onClick={() => alert(`✅ Approved: ${app.name}. SMS sent.`)}>Approve</Btn>
                  <Btn variant="danger" size="sm" onClick={() => alert(`❌ Rejected: ${app.name}. SMS sent.`)}>Reject</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => alert(`📋 Requested more docs from ${app.name}.`)}>Request Docs</Btn>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* MOVING */}
      {tab === "moving" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 14px" }}>Moving Job Requests</p>
          {[{from:"Kisaasi",to:"Ntinda",budget:80000,poster:"Aisha N.",date:"Aug 15",status:"open"},{from:"Makerere",to:"Mukono",budget:120000,poster:"Brian M.",date:"Aug 18",status:"open"},{from:"Wandegeya",to:"Bukoto",budget:50000,poster:"Ruth K.",date:"Aug 20",status:"matched"}].map((j,i) => (
            <div key={i} style={{ background: T.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 10, border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: T.navy, margin: 0 }}>🚛 {j.from} → {j.to}</p>
                  <p style={{ fontSize: 11, color: T.slate, margin: 0 }}>{j.poster} · {j.date}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 800, fontSize: 14, color: T.orange, margin: 0 }}>{fmtUGX(j.budget)}</p>
                  <p style={{ fontSize: 9, color: T.slate, margin: 0 }}>8% = {fmtUGX(j.budget*.08)}</p>
                </div>
              </div>
              <Badge color={j.status==="matched"?T.greenDark:T.amberDark} bg={j.status==="matched"?T.greenLight:T.amberLight}>
                {j.status==="matched"?"✅ Provider matched":"⏳ Seeking provider"}
              </Badge>
            </div>
          ))}
        </>
      )}

      {/* SETTINGS */}
      {tab === "settings" && (
        <>
          <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: "0 0 4px" }}>Platform Fee Settings</p>
          <InfoBox type="yellow">Changes apply to all new transactions. Existing bookings are not affected.</InfoBox>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[["Viewing Fee (UGX)","viewingFee"],["Referral Payout (UGX)","referralPayout"],["Platform Keeps (UGX)","platformKeep"],["Min Withdrawal (UGX)","withdrawMin"],["Boost 7 Days (UGX)","boostWeek"],["Boost 30 Days (UGX)","boost30"],["Verify Service (UGX)","verify"],["Moving Commission (%)","movingComm"]].map(([lb,key]) => (
              <Field key={key} label={lb}>
                <input type="number" value={fees[key]}
                  onChange={e => setFees(f => ({ ...f, [key]: parseInt(e.target.value)||0 }))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 11, border: `1px solid ${T.border}`, background: T.bg, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}/>
              </Field>
            ))}
          </div>
          <InfoBox type="blue">💡 With current settings: Viewing fee = {fmtUGX(fees.viewingFee)} → Platform keeps {fmtUGX(fees.platformKeep)} + Referrer earns {fmtUGX(fees.referralPayout)}</InfoBox>
          <Btn variant="green" onClick={() => alert("✅ Settings saved and applied to all new transactions!")} style={{ width: "100%" }}>💾 Save Settings</Btn>
        </>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI CHAT PANEL
═══════════════════════════════════════════════════════════ */
function AIChat({ open, onClose }) {
  const [msgs, setMsgs] = useState([{ from: "ai", text: "Hi! I'm your RentRight AI 🏠\n\nI can help you find:\n🏠 Verified rentals\n🧹 Service providers\n🚚 Moving help\n🌍 Land listings\n\nTry: '350k near Kisaasi, quiet room'" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim(); setInput(""); setLoading(true);
    setMsgs(m => [...m, { from: "user", text: txt }]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 300,
          system: `You are a warm RentRight housing assistant for Kampala, Uganda. Listings: Bukoto UGX 420k (studio), Kisaasi UGX 350k (double room), Wandegeya UGX 175k (hostel), Ntinda UGX 280k (single room), Makerere UGX 240k (bedsitter), Naguru UGX 850k (executive 2BR). Viewing fee is UGX 5,000 — platform keeps UGX 3,000, referrer earns UGX 2,000. Also available: moving services, home cleaners, laundry, plumbers, and land plots. Reply in 2-3 sentences max. Never mention Claude or Anthropic.`,
          messages: [...msgs.map(m => ({ role: m.from==="ai"?"assistant":"user", content: m.text })), { role: "user", content: txt }]
        })
      });
      const data = await res.json();
      setMsgs(m => [...m, { from: "ai", text: data.content?.find(c => c.type==="text")?.text || "Happy to help! Tell me your budget and area." }]);
    } catch {
      setMsgs(m => [...m, { from: "ai", text: "Connection issue — try again or WhatsApp us! 📱" }]);
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", bottom: 90, right: 18, width: 320, background: "#fff",
      borderRadius: 22, boxShadow: "0 20px 60px rgba(15,23,42,.22)", border: `1px solid ${T.border}`,
      zIndex: 998, display: "flex", flexDirection: "column", maxHeight: 440,
      animation: "slideUp .2s ease" }}>
      <div style={{ background: T.navy, borderRadius: "22px 22px 0 0", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: T.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: 0 }}>RentRight AI</p>
            <p style={{ color: T.slateLight, fontSize: 10, margin: 0 }}>Homes · Moving · Services · Land</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from==="user"?"flex-end":"flex-start" }}>
            <div style={{ background: m.from==="user"?T.blue:T.bg, color: m.from==="user"?"#fff":T.navy,
              fontSize: 12, lineHeight: 1.5, padding: "8px 12px", borderRadius: 14, maxWidth: "83%", whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex" }}><div style={{ background: T.bg, color: T.slate, fontSize: 12, padding: "8px 12px", borderRadius: 14 }}>Searching…</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()}
          placeholder="Ask about homes, moving, land…"
          style={{ flex: 1, padding: "8px 12px", borderRadius: 12, border: `1px solid ${T.border}`, fontSize: 12, outline: "none", fontFamily: "inherit" }}/>
        <button onClick={send} style={{ background: T.blue, color: "#fff", border: "none", borderRadius: 12, padding: "8px 12px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>↑</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function RentRight() {
  // State
  const [user, setUser] = useState(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [minP, setMinP] = useState(""); const [maxP, setMaxP] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeVibes, setActiveVibes] = useState([]);
  const [sortBy, setSortBy] = useState("match");
  const [filtered, setFiltered] = useState([...LISTINGS].sort((a,b) => (b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));
  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingListing, setBookingListing] = useState(null);
  const [showAuth, setShowAuth] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMoving, setShowMoving] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [alertEmail, setAlertEmail] = useState(""); const [alertSent, setAlertSent] = useState(false);
  const listRef = useRef(null);

  // Hero slideshow
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % 3), 4800);
    return () => clearInterval(t);
  }, []);

  const HERO_IMGS = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1400&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
  ];

  const VIBES = [
    {id:"quiet",icon:"🌿",label:"Quiet"},
    {id:"student",icon:"🎓",label:"Student"},
    {id:"cheap",icon:"💸",label:"Budget"},
    {id:"secure",icon:"🛡️",label:"Secure"},
    {id:"city",icon:"🚶",label:"City Access"},
    {id:"family",icon:"🏡",label:"Family"},
  ];

  // Filter logic
  const applyFilters = useCallback((opts = {}) => {
    const q = (opts.search ?? search).toLowerCase();
    const mn = parseInt(opts.min ?? minP) || 0;
    const mx = parseInt(opts.max ?? maxP) || Infinity;
    const vo = opts.verified ?? verifiedOnly;
    const vs = opts.vibes ?? activeVibes;
    const sb = opts.sort ?? sortBy;
    let res = LISTINGS.filter(l => {
      if (q && q !== "near me" && !l.area.toLowerCase().includes(q) && !l.title.toLowerCase().includes(q) && !l.type.toLowerCase().includes(q)) return false;
      if (l.price < mn || l.price > mx) return false;
      if (vo && !l.verified) return false;
      if (vs.includes("student") && l.type !== "Hostel" && !l.area.toLowerCase().includes("makerere") && !l.area.toLowerCase().includes("wandegeya")) return false;
      if (vs.includes("cheap") && l.price > 300000) return false;
      if (vs.includes("secure") && !l.verified) return false;
      return true;
    });
    if (sb === "match") res.sort((a,b) => (b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match);
    else if (sb === "price-asc") res.sort((a,b) => a.price-b.price);
    else if (sb === "price-desc") res.sort((a,b) => b.price-a.price);
    else if (sb === "confidence") res.sort((a,b) => b.confidence-a.confidence);
    setFiltered(res);
  }, [search, minP, maxP, verifiedOnly, activeVibes, sortBy]);

  const doSearch = () => {
    applyFilters();
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const toggleVibe = id => {
    const nv = activeVibes.includes(id) ? activeVibes.filter(v => v !== id) : [...activeVibes, id];
    setActiveVibes(nv);
    applyFilters({ vibes: nv });
  };

  const useGPS = () => {
    if (!navigator.geolocation) { alert("GPS not available"); return; }
    navigator.geolocation.getCurrentPosition(() => { setSearch("Near Me"); doSearch(); }, () => alert("Please allow location access"));
  };

  const handleAuth = userData => {
    setUser(userData);
    setShowAuth(null);
    if (userData.role === "admin") setTimeout(() => setShowAdmin(true), 300);
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", background: T.bg, minHeight: "100vh", color: T.navy, paddingBottom: 72 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { overflow-x: hidden; }
        button, input, select, textarea { font-family: 'DM Sans', sans-serif; }
        img { display: block; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.7; transform:scale(1.05); } }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(248,250,252,.97)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${T.green},${T.blue})`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 17 }}>R</div>
            <span style={{ fontWeight: 900, fontSize: 21, letterSpacing: "-.5px" }}>Rent<span style={{ color: T.green }}>Right</span><span style={{ color: T.blue }}>!</span></span>
          </div>
          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 4 }}>
            {[["listings","Listings"],["services","Services"],["referrals-section","Referrals"]].map(([id,lb]) => (
              <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "transparent", color: T.navy3, border: "none", borderRadius: 20, padding: "6px 12px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {lb}
              </button>
            ))}
            <button onClick={() => setShowMoving(true)} style={{ background: "transparent", color: T.orange, border: "none", borderRadius: 20, padding: "6px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🚚 Moving</button>
          </div>
          {/* Auth area */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {user ? (
              <>
                {user.role === "admin" && <Btn variant="danger" size="sm" onClick={() => setShowAdmin(true)}>⚙️ Admin</Btn>}
                <Btn variant="green" size="sm" onClick={() => setShowDashboard(true)}>👤 {user.name.split(" ")[0]}</Btn>
              </>
            ) : (
              <>
                <Btn variant="ghost" size="sm" onClick={() => setShowAuth("login")}>Login</Btn>
                <Btn variant="green" size="sm" onClick={() => setShowAuth("signup")}>Sign Up</Btn>
              </>
            )}
            <Btn variant="navy" size="sm" onClick={() => user ? setShowMoving(true) : setShowAuth("signup")}>+ List</Btn>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: "93vh", overflow: "hidden" }}>
        {HERO_IMGS.map((img, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, transition: "opacity 1.4s ease", opacity: i === heroIdx ? 1 : 0 }}>
            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(15,23,42,.78) 0%,rgba(15,23,42,.52) 55%,rgba(15,23,42,.72) 100%)" }}/>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: "10%", right: "6%", width: 200, height: 200, background: T.green+"14", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: "14%", left: "4%", width: 180, height: 180, background: T.blue+"14", borderRadius: "50%", filter: "blur(55px)", pointerEvents: "none" }}/>

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 0" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,.2)", border: "1px solid rgba(34,197,94,.4)", borderRadius: 20, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#86EFAC", marginBottom: 18, letterSpacing: 1, animation: "fadeIn 1s ease" }}>
            🏆 Uganda's #1 Verified Rental Platform · No Brokers · GPS-Confirmed
          </div>

          <h1 style={{ fontSize: "clamp(2rem,5.5vw,3.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.07, letterSpacing: "-1.5px", marginBottom: 14, textAlign: "center", animation: "fadeIn 1s ease .15s both" }}>
            Find Your <span style={{ color: T.green }}>Safe,</span><br/>
            <span style={{ color: T.blue }}>Verified</span> Home in Uganda
          </h1>
          <p style={{ fontSize: 15, opacity: .82, color: "#fff", lineHeight: 1.55, marginBottom: 22, textAlign: "center", animation: "fadeIn 1s ease .25s both" }}>
            No brokers. No scams. GPS-confirmed listings.<br/>
            Pay UGX 5,000 · Platform earns 3,000 · Your referrer earns 2,000
          </p>

          {/* Mode pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 22, animation: "fadeIn 1s ease .3s both" }}>
            {[["🏡","Find a Home"],["🎓","Student Hostel"],["🚚","Moving Help"],["🧹","Home Services"],["🌍","Buy Land"]].map(([ic,lb]) => (
              <button key={lb} onClick={() => lb==="Moving Help"?setShowMoving(true):doSearch()}
                style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.22)", borderRadius: 24, padding: "9px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all .2s", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.1)"; }}>
                {ic} {lb}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ background: "rgba(255,255,255,.97)", borderRadius: 24, padding: "18px 20px", width: "100%", maxWidth: 700, boxShadow: "0 24px 64px rgba(0,0,0,.28)", animation: "slideUp .5s ease .2s both" }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: T.slate, margin: "0 0 8px", letterSpacing: 1.5, textTransform: "uppercase" }}>Find Verified Homes, Services & Land Near You</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==="Enter"&&doSearch()}
                placeholder="Area, type, or service — e.g. 'quiet room Kisaasi'"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 13, border: `1.5px solid ${T.border}`, fontSize: 14, outline: "none", fontFamily: "inherit" }}/>
              <Btn variant="navy" onClick={useGPS} style={{ whiteSpace: "nowrap", fontSize: 12 }}>📍 Near Me</Btn>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <input value={minP} onChange={e => setMinP(e.target.value)} placeholder="Min price (UGX)"
                style={{ flex: 1, minWidth: 100, padding: "9px 12px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", fontFamily: "inherit" }}/>
              <input value={maxP} onChange={e => setMaxP(e.target.value)} placeholder="Max price (UGX)"
                style={{ flex: 1, minWidth: 100, padding: "9px 12px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", fontFamily: "inherit" }}/>
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: T.greenDark, cursor: "pointer", whiteSpace: "nowrap" }}>
                <input type="checkbox" checked={verifiedOnly} onChange={e => { setVerifiedOnly(e.target.checked); applyFilters({ verified: e.target.checked }); }} style={{ accentColor: T.green }}/>✔ Verified Only
              </label>
            </div>
            <button onClick={doSearch}
              style={{ width: "100%", background: `linear-gradient(135deg,${T.green},${T.blue})`, color: "#fff", border: "none", borderRadius: 13, padding: "13px 0", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
              Search 🔍
            </button>
          </div>

          {/* Dots */}
          <div style={{ marginTop: 18, display: "flex", gap: 6 }}>
            {HERO_IMGS.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                style={{ width: i===heroIdx?28:8, height: 8, background: i===heroIdx?T.green:"rgba(255,255,255,.35)", border: "none", borderRadius: 4, cursor: "pointer", transition: "all .3s", padding: 0 }}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ─────────────────────────────────────── */}
      <div style={{ background: T.navy, padding: "13px 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
          {[["🟢","Verified Listings"],["📍","GPS Confirmed"],["🔒","Contact Protected"],["💳","MoMo Payments"],["🛡️","AI Fraud Detection"],["💰","UGX 2K Referral"]].map(([ic,lb]) => (
            <div key={lb} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 15 }}>{ic}</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────── */}
      <div style={{ background: T.greenLight, padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
          {[["500+","Listings"],["2,400+","Happy Users"],["98%","Verified"],["UGX 2K","Per Referral"],["4.7★","Rating"],["120+","Providers"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 900, fontSize: 19, color: T.greenDark, margin: 0 }}>{n}</p>
              <p style={{ fontSize: 10, color: T.greenDark, opacity: .7, margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK CATEGORIES ─────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "34px 20px 0" }}>
        <h2 style={{ fontWeight: 900, fontSize: 22, margin: "0 0 6px" }}>Quick Browse</h2>
        <p style={{ color: T.slate, fontSize: 13, margin: "0 0 16px" }}>Find exactly what you need</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {[{icon:"🔥",label:"Under 300k",action:()=>{setMaxP("300000");applyFilters({max:"300000"});listRef.current?.scrollIntoView({behavior:"smooth"});}},
            {icon:"🎓",label:"Hostels",action:()=>{setSearch("Hostel");doSearch();}},
            {icon:"🤝",label:"Shared Rooms",action:()=>{setSearch("Shared");doSearch();}},
            {icon:"📍",label:"Near Me",action:useGPS},
            {icon:"🚀",label:"Boosted",action:()=>setFiltered(LISTINGS.filter(l=>l.boosted))},
            {icon:"✅",label:"Verified Only",action:()=>{setVerifiedOnly(true);applyFilters({verified:true});listRef.current?.scrollIntoView({behavior:"smooth"});}},
          ].map(q => (
            <button key={q.label} onClick={q.action}
              style={{ background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "12px 16px", textAlign: "center", cursor: "pointer", transition: "all .18s", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.green; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 6px 20px ${T.green}22`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{q.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: T.navy }}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── ATMOSPHERE VIBES ─────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 20px 0" }}>
        <h2 style={{ fontWeight: 900, fontSize: 20, margin: "0 0 5px" }}>🌿 Filter by Lifestyle</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {VIBES.map(v => (
            <Pill key={v.id} label={v.label} icon={v.icon} active={activeVibes.includes(v.id)} onClick={() => toggleVibe(v.id)}/>
          ))}
          {activeVibes.length > 0 && <Btn variant="danger" size="sm" onClick={() => { setActiveVibes([]); applyFilters({ vibes: [] }); }}>✕ Clear</Btn>}
        </div>
      </div>

      {/* ── LISTINGS ─────────────────────────────────────────── */}
      <div id="listings" ref={listRef} style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>{filtered.length} Listings</h2>
            <p style={{ color: T.slate, margin: "3px 0 0", fontSize: 12 }}>Boosted first · Verified landlords · Contact protected until fee paid</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); applyFilters({ sort: e.target.value }); }}
              style={{ padding: "7px 12px", borderRadius: 11, border: `1.5px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              <option value="match">⚡ Best Match</option>
              <option value="confidence">🛡️ Trust Score</option>
              <option value="price-asc">💰 Price ↑</option>
              <option value="price-desc">💎 Price ↓</option>
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 20, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 44, margin: "0 0 10px" }}>🔍</p>
            <p style={{ fontWeight: 800, fontSize: 17, color: T.navy, margin: "0 0 6px" }}>No listings match</p>
            <p style={{ color: T.slate, margin: "0 0 16px" }}>Try the AI assistant!</p>
            <Btn variant="green" onClick={() => setShowChat(true)}>🤖 Ask AI</Btn>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
            {filtered.map(l => (
              <ListingCard key={l.id} l={l} onClick={() => setSelectedListing(l)}/>
            ))}
          </div>
        )}

        {/* Smart match strip */}
        {filtered.length > 0 && (
          <div style={{ marginTop: 22, background: `linear-gradient(135deg,${T.greenLight},${T.blueLight})`, borderRadius: 16, padding: "15px 18px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: T.navy, margin: 0 }}>Smart Match Active</p>
              <p style={{ fontSize: 11, color: T.navy3, margin: 0 }}>{filtered.filter(l=>l.match>=85).length} high-match · {filtered.filter(l=>l.verified).length} verified · {filtered.filter(l=>l.boosted).length} boosted</p>
            </div>
            <Btn variant="navy" size="sm" onClick={() => setShowChat(true)}>Ask AI 🤖</Btn>
          </div>
        )}
      </div>

      {/* ── SERVICES SECTION ─────────────────────────────────── */}
      <div id="services" style={{ background: `linear-gradient(135deg,#f0fdf4,#e0f2fe)`, padding: "40px 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <h2 style={{ fontWeight: 900, fontSize: 22, margin: "0 0 6px" }}>🏠 Home Services Near You</h2>
          <p style={{ color: T.slate, fontSize: 13, margin: "0 0 20px" }}>Moving in? We connect you with trusted providers matched to your GPS location</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginBottom: 28 }}>
            {[["🧹","Cleaners","From UGX 15,000"],["👕","Laundry","From UGX 6,000/kg"],["🚛","Movers","From UGX 50,000"],["👷","Helpers","From UGX 20,000/day"],["🔧","Plumbers","From UGX 25,000"],["⚡","Electricians","From UGX 30,000"],["🔒","Security","From UGX 300K/mo"],["🌿","Gardeners","From UGX 20,000"]].map(([ic,t,p]) => (
              <button key={t} onClick={() => setShowMoving(true)}
                style={{ background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 12px", textAlign: "left", cursor: "pointer", transition: "all .18s", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.green; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform=""; }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ic}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: T.navy }}>{t}</div>
                <div style={{ fontSize: 11, color: T.green, fontWeight: 700, marginTop: 3 }}>{p}</div>
              </button>
            ))}
          </div>
          {/* Providers list */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "18px 20px", border: `1.5px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div><p style={{ fontWeight: 800, fontSize: 15, color: T.navy, margin: 0 }}>Providers Near You</p><p style={{ fontSize: 12, color: T.slate, margin: "2px 0 0" }}>Enable GPS to see closest first</p></div>
              <Btn variant="green" size="sm" onClick={useGPS}>📍 Use GPS</Btn>
            </div>
            {PROVIDERS.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
                onClick={() => setShowMoving(true)}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: p.available ? `linear-gradient(135deg,${T.green},${T.greenDark})` : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: T.navy, margin: 0 }}>{p.name}</p>
                    {p.verified && <Badge color={T.greenDark} bg={T.greenLight}>✅ Verified</Badge>}
                  </div>
                  <p style={{ fontSize: 11, color: T.slate, margin: "2px 0" }}>{p.type} · {p.area} · {p.dist}</p>
                  <p style={{ fontSize: 11, color: T.navy, fontWeight: 700, margin: 0 }}>{p.price}</p>
                </div>
                <div style={{ display: "flex", flex: "column", alignItems: "flex-end", gap: 4 }}>
                  <Badge color={p.available?T.greenDark:T.redDark} bg={p.available?T.greenLight:T.redLight}>
                    {p.available ? "✔ Available" : "Busy"}
                  </Badge>
                  <p style={{ fontSize: 11, color: T.amber, margin: "4px 0 0" }}>{"★".repeat(Math.round(p.rating))} ({p.reviews})</p>
                </div>
              </div>
            ))}
            <Btn variant="ghost" onClick={() => setShowMoving(true)} style={{ width: "100%", marginTop: 10 }}>🚀 View All Providers & Register as Provider →</Btn>
          </div>
        </div>
      </div>

      {/* ── MOVING TEASER ─────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg,${T.orange},${T.amber})`, padding: "40px 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ fontSize: 40, margin: "0 0 6px" }}>🚚</p>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: "0 0 8px" }}>Moving Services Marketplace</h2>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: 14, margin: "0 0 16px", lineHeight: 1.5 }}>
              Post a moving job with item photos, dimensions & vehicle specs.<br/>
              Providers pay <strong>8% commission</strong> only when they accept.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["🚛 Hire Movers","🚐 Book Truck","👷 Packing Help","Guard Rails ✓","Box Body ✓"].map(lb => (
                <span key={lb} style={{ background: "rgba(255,255,255,.2)", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{lb}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setShowMoving(true)} style={{ background: "#fff", color: T.orange, borderColor: "#fff", fontSize: 14, padding: "14px 24px", borderRadius: 16 }}>Browse Jobs →</Btn>
            <Btn variant="ghost" onClick={() => setShowMoving(true)} style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)", fontSize: 13, padding: "13px 20px", borderRadius: 16 }}>Post a Job</Btn>
          </div>
        </div>
      </div>

      {/* ── SMART ALERTS ─────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg,${T.navy2},${T.navy})`, padding: "40px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: "0 0 8px" }}>Smart Price Alerts</h2>
          <p style={{ color: T.slateLight, fontSize: 13, margin: "0 0 18px" }}>Get notified when listings match your budget or prices drop in your area.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={alertEmail} onChange={e => setAlertEmail(e.target.value)} placeholder="Phone or email for alerts"
              style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "none", fontSize: 13, outline: "none", fontFamily: "inherit" }}/>
            <Btn variant="green" onClick={() => { if(alertEmail){setAlertSent(true);setTimeout(()=>setAlertSent(false),3000);} }}>
              {alertSent ? "✅ Set!" : "🔔 Alert Me"}
            </Btn>
          </div>
        </div>
      </div>

      {/* ── REFERRALS ─────────────────────────────────────────── */}
      <div id="referrals-section" style={{ background: `linear-gradient(135deg,${T.navy},#0a2315)`, padding: "46px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 38, margin: "0 0 8px" }}>🔁</p>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 24, margin: "0 0 8px" }}>Earn UGX 2,000 Per Referral</h2>
          <p style={{ color: T.slateLight, fontSize: 13, margin: "0 0 20px" }}>
            Your friend pays UGX 5,000 viewing fee → <strong style={{ color: T.green }}>you earn UGX 2,000</strong> via MoMo · Platform earns UGX 3,000
          </p>
          {/* Flow */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 22 }}>
            {[["👤","1. Signs Up"],["💳","2. Pays Fee"],["🏠","3. Views"],["💰","You Earn!"]].map(([ic,lb]) => (
              <div key={lb} style={{ background: "rgba(255,255,255,.06)", borderRadius: 14, padding: "14px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{ic}</div>
                <p style={{ fontSize: 10, color: T.slateLight, fontWeight: 700, margin: 0 }}>{lb}</p>
              </div>
            ))}
          </div>
          {/* Money split visual */}
          <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 16, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0 }}>UGX 5,000</p>
              <p style={{ color: T.slateLight, fontSize: 10, margin: 0 }}>Viewing fee paid</p>
            </div>
            <span style={{ color: T.slateLight, fontSize: 20, alignSelf: "center" }}>→</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: T.green, fontWeight: 900, fontSize: 18, margin: 0 }}>UGX 2,000</p>
              <p style={{ color: T.slateLight, fontSize: 10, margin: 0 }}>To you (referrer)</p>
            </div>
            <span style={{ color: T.slateLight, fontSize: 20, alignSelf: "center" }}>+</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: T.blue, fontWeight: 900, fontSize: 18, margin: 0 }}>UGX 3,000</p>
              <p style={{ color: T.slateLight, fontSize: 10, margin: 0 }}>Platform revenue</p>
            </div>
          </div>
          {user ? (
            <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 12, margin: "0 0 2px" }}>Your referral link</p>
                <p style={{ color: T.green, fontSize: 13, fontWeight: 800, margin: 0 }}>rentright.ug/ref/{user.referralCode}</p>
              </div>
              <Btn variant="green" size="sm" onClick={() => navigator.clipboard.writeText(`rentright.ug/ref/${user.referralCode}`)}>Copy Link</Btn>
              <Btn variant="blue" size="sm" onClick={() => setShowDashboard(true)}>View Earnings</Btn>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <input value={alertEmail} onChange={e => setAlertEmail(e.target.value)} placeholder="Enter your phone/email to get referral link"
                style={{ flex: 1, padding: "11px 14px", borderRadius: 11, border: "none", fontSize: 13, outline: "none", fontFamily: "inherit" }}/>
              <Btn variant="green" onClick={() => setShowAuth("signup")}>Get My Link</Btn>
            </div>
          )}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "46px 20px" }}>
        <h2 style={{ fontWeight: 900, fontSize: 24, textAlign: "center", margin: "0 0 5px" }}>How RentRight! Works</h2>
        <p style={{ textAlign: "center", color: T.slate, margin: "0 0 32px", fontSize: 13 }}>Simple, safe, fast — from search to move-in</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          {[{n:"01",ic:"🔍",t:"Search",d:"Find homes, services, or land by area, budget, or lifestyle.",c:T.blueLight},{n:"02",ic:"💳",t:"Pay UGX 5,000",d:"MoMo payment unlocks landlord contact. Platform keeps 3K, referrer earns 2K.",c:T.amberLight},{n:"03",ic:"🏠",t:"View & Rent",d:"Inspect the property physically before paying any rent.",c:T.greenLight},{n:"04",ic:"📋",t:"Move In Safely",d:"Get personalised checklist, service providers, and neighbourhood guide.",c:T.redLight}].map(s => (
            <div key={s.n} style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", border: `1.5px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 8, right: 12, fontWeight: 900, fontSize: 44, color: "rgba(15,23,42,.06)", lineHeight: 1 }}>{s.n}</div>
              <div style={{ width: 42, height: 42, background: s.c, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{s.ic}</div>
              <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 5px", color: T.navy }}>{s.t}</p>
              <p style={{ color: T.slate, fontSize: 12, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: T.navy, color: "#fff", padding: "38px 20px 22px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 22, marginBottom: 26 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${T.green},${T.blue})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 }}>R</div>
                <span style={{ fontWeight: 900, fontSize: 16 }}>Rent<span style={{ color: T.green }}>Right</span><span style={{ color: T.blue }}>!</span></span>
              </div>
              <p style={{ color: T.slateLight, fontSize: 11, lineHeight: 1.6, margin: "0 0 10px" }}>Uganda's complete housing platform. Rentals, services, moving, and land — verified and safe.</p>
              <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#25D366", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>💬 WhatsApp</a>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#e2e8f0", margin: "0 0 10px" }}>Platform</p>
              {["Browse Listings","Moving Services","Home Services","Buy Land","Agent Portal","Referral Program"].map(lb => (
                <p key={lb} style={{ color: T.slateLight, fontSize: 11, margin: "0 0 6px", cursor: "pointer" }}>{lb}</p>
              ))}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#e2e8f0", margin: "0 0 10px" }}>Popular Areas</p>
              {["Makerere","Kisaasi","Ntinda","Wandegeya","Bukoto","Naguru","Mukono","Wakiso"].map(a => (
                <p key={a} onClick={() => { setSearch(a); doSearch(); }} style={{ color: T.slateLight, fontSize: 11, margin: "0 0 6px", cursor: "pointer" }}>📍 {a}</p>
              ))}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#e2e8f0", margin: "0 0 10px" }}>Contact</p>
              <p style={{ color: T.slateLight, fontSize: 11, margin: "0 0 6px" }}>📱 +256 700 000 000</p>
              <p style={{ color: T.slateLight, fontSize: 11, margin: "0 0 6px" }}>📧 hello@rentright.ug</p>
              <p style={{ color: T.slateLight, fontSize: 11, margin: "0 0 12px" }}>🏢 Kampala, Uganda</p>
              <div style={{ background: "rgba(248,113,113,.12)", borderRadius: 10, padding: "10px 12px", fontSize: 10, color: "#fca5a5", lineHeight: 1.6, border: "1px solid rgba(248,113,113,.22)" }}>
                🛡️ Never pay rent before physically viewing. RentRight! is an intermediary only.
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <p style={{ color: "#475569", fontSize: 10, margin: 0 }}>© 2025 RentRight! Uganda. Intermediary platform only. UGX 5K viewing fee → UGX 3K platform + UGX 2K referrer.</p>
            <div style={{ display: "flex", gap: 12 }}>
              {["Privacy","Terms","Report"].map(lb => <span key={lb} style={{ color: "#475569", fontSize: 10, cursor: "pointer" }}>{lb}</span>)}
            </div>
          </div>
        </div>
      </footer>

      {/* ── BOTTOM BAR (mobile) ───────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(248,250,252,.97)", backdropFilter: "blur(12px)", borderTop: `1px solid ${T.border}`, padding: "10px 16px", display: "flex", gap: 8, zIndex: 300 }}>
        <button onClick={() => { setSearch("Near Me"); doSearch(); }} style={{ flex: 2, background: T.green, color: "#fff", border: "none", borderRadius: 13, padding: "11px 0", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>📍 Near Me</button>
        <button onClick={() => setShowMoving(true)} style={{ flex: 1.5, background: T.orange, color: "#fff", border: "none", borderRadius: 13, padding: "11px 0", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>🚚</button>
        <button onClick={() => user ? setShowDashboard(true) : setShowAuth("login")} style={{ flex: 1.5, background: T.navy, color: "#fff", border: "none", borderRadius: 13, padding: "11px 0", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{user ? "👤 Me" : "Login"}</button>
        <button onClick={() => setShowChat(o => !o)} style={{ flex: 1, background: T.blue, color: "#fff", border: "none", borderRadius: 13, padding: "11px 0", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>🤖</button>
      </div>

      {/* ── FLOATING WA ───────────────────────────────────────── */}
      <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 82, right: 18, background: "#25D366", color: "#fff", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 20px rgba(37,211,102,.4)", zIndex: 500, textDecoration: "none" }}>
        💬
      </a>

      {/* ── AI CHAT ──────────────────────────────────────────── */}
      <AIChat open={showChat} onClose={() => setShowChat(false)}/>

      {/* ── MODALS ───────────────────────────────────────────── */}
      {showAuth && <AuthModal defaultTab={showAuth} onClose={() => setShowAuth(null)} onAuth={handleAuth}/>}
      {showDashboard && user && <UserDashboard user={user} onClose={() => setShowDashboard(false)} onLogout={() => { setUser(null); setShowDashboard(false); }} onMoving={() => { setShowDashboard(false); setShowMoving(true); }}/>}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)}/>}
      {selectedListing && !bookingListing && (
        <ListingDetail listing={selectedListing} onClose={() => setSelectedListing(null)}
          onBook={l => { setSelectedListing(null); setBookingListing(l); }} user={user}/>
      )}
      {bookingListing && (
        <BookingModal listing={bookingListing} onClose={() => setBookingListing(null)}
          user={user} onNeedAuth={tab => { setBookingListing(null); setShowAuth(tab); }}/>
      )}
      {showMoving && (
        <Modal title="🚚 Moving & Services" subtitle="Post jobs · Find providers · Register to offer services" onClose={() => setShowMoving(false)} wide>
          <InfoBox type="yellow">Full moving marketplace, item dimensions, photo upload, vehicle specs and provider registration are available in the complete app. This is the React component version — connect your Node.js backend to activate.</InfoBox>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Btn variant="orange" onClick={() => setShowMoving(false)} style={{ padding: "13px 0", fontSize: 14 }}>📋 Browse Open Jobs</Btn>
            <Btn variant="navy" onClick={() => setShowMoving(false)} style={{ padding: "13px 0", fontSize: 14 }}>➕ Post a Moving Job</Btn>
            <Btn variant="ghost" onClick={() => setShowMoving(false)} style={{ padding: "13px 0" }}>🚛 Register as Provider</Btn>
            <Btn variant="purple" onClick={() => setShowMoving(false)} style={{ padding: "13px 0" }}>🧹 Register as Cleaner</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
