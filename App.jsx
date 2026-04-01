import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════ BRAND TOKENS ═══════════════════════ */
const C = {
  green:"#22C55E", gL:"#DCFCE7", gD:"#15803D",
  blue:"#38BDF8",  bL:"#E0F2FE", bD:"#0369A1",
  yellow:"#FDE68A",yD:"#78350F",
  red:"#F87171",   rL:"#FEE2E2", rD:"#991B1B",
  navy:"#0F172A",  n2:"#1E293B", n3:"#334155",
  mist:"#F8FAFC",  border:"#E2E8F0",
  ts:"#64748B",    tt:"#94A3B8",
  gold:"#F59E0B",  goldL:"#FEF3C7",
  purple:"#7C3AED",pL:"#EDE9FE",
};

/* ═══════════════════════ MOCK DATA ══════════════════════════ */
const LISTINGS = [
  { id:1, title:"Tranquil Studio, Bukoto", area:"Bukoto", price:420000, type:"Self-Contained",
    vibe:["quiet","secure"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.9, reviews:44, match:94, boosted:true, contactLocked:true,
    living:{safety:9.2,clean:8.8,access:9.0,noise:"Very Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Security","Parking","DSTV"], confidence:98,
    desc:"A calm, well-ventilated studio in Bukoto. Quiet neighborhood, supermarket 5 min walk.",
    landlord:"Sarah B.", phone:"0771 234 567", wa:"256700000005",
    img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80",
    referrals:19, nearby:{taxi:"3 min",market:"5 min",campus:"20 min"},
    areaPrice:{min:380000,max:580000}, viewingFee:5000, commission:0.05 },
  { id:2, title:"Bright Double Room, Kisaasi", area:"Kisaasi", price:350000, type:"Double Room",
    vibe:["city","student"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.7, reviews:31, match:88, boosted:false, contactLocked:true,
    living:{safety:8.0,clean:8.5,access:9.5,noise:"Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Compound"], confidence:91,
    desc:"Bright, well-maintained double room steps from the main road. Excellent transport access.",
    landlord:"Grace N.", phone:"0772 345 678", wa:"256700000002",
    img:"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=700&q=80",
    referrals:8, nearby:{taxi:"1 min",market:"8 min",campus:"15 min"},
    areaPrice:{min:280000,max:430000}, viewingFee:5000, commission:0.05 },
  { id:3, title:"Student Hostel, Wandegeya", area:"Wandegeya", price:175000, type:"Hostel",
    vibe:["student","budget"], verified:true, photos:true, gps:false, priceOk:true,
    rating:4.3, reviews:62, match:91, boosted:true, contactLocked:false,
    living:{safety:7.5,clean:7.0,access:9.8,noise:"Moderate"}, moveIn:"ready",
    amenities:["WiFi","Security","Near Campus"], confidence:84,
    desc:"Affordable hostel 2 mins from Makerere University. Vibrant student community.",
    landlord:"Hostel Admin", phone:"0714 123 456", wa:"256700000003",
    img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80",
    referrals:29, nearby:{taxi:"2 min",market:"4 min",campus:"2 min"},
    areaPrice:{min:150000,max:220000}, viewingFee:5000, commission:0.03 },
  { id:4, title:"Spacious Single Room, Ntinda", area:"Ntinda", price:280000, type:"Single Room",
    vibe:["quiet","family"], verified:false, photos:true, gps:false, priceOk:false,
    rating:4.1, reviews:18, match:72, boosted:false, contactLocked:true,
    living:{safety:7.0,clean:7.5,access:8.0,noise:"Low"}, moveIn:"viewing",
    amenities:["Water","Compound","Parking"], confidence:52,
    desc:"Spacious single room in a family compound. Peaceful area, awaiting full verification.",
    landlord:"Peter M.", phone:"07XX XXX XXX", wa:"256700000004",
    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80",
    referrals:5, nearby:{taxi:"7 min",market:"12 min",campus:"25 min"},
    areaPrice:{min:240000,max:380000}, viewingFee:5000, commission:0.05 },
  { id:5, title:"Modern Bedsitter, Makerere", area:"Makerere", price:240000, type:"Single Room",
    vibe:["student","budget"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.5, reviews:27, match:89, boosted:false, contactLocked:true,
    living:{safety:8.0,clean:8.2,access:9.2,noise:"Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Security"], confidence:93,
    desc:"Neat, modern bedsitter near Makerere campus. Quiet zone, reliable electricity.",
    landlord:"James K.", phone:"07XX XXX XXX", wa:"256700000001",
    img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
    referrals:12, nearby:{taxi:"4 min",market:"6 min",campus:"5 min"},
    areaPrice:{min:200000,max:300000}, viewingFee:5000, commission:0.05 },
  { id:6, title:"Executive 2BR, Naguru", area:"Naguru", price:850000, type:"Self-Contained",
    vibe:["secure","quiet"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.8, reviews:22, match:78, boosted:true, contactLocked:true,
    living:{safety:9.5,clean:9.0,access:8.5,noise:"Very Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Security","Parking","DSTV","Generator"], confidence:97,
    desc:"Executive 2-bedroom in the quiet hills of Naguru. High-security estate, premium finishes.",
    landlord:"David R.", phone:"07XX XXX XXX", wa:"256700000006",
    img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",
    referrals:7, nearby:{taxi:"10 min",market:"8 min",campus:"30 min"},
    areaPrice:{min:700000,max:1200000}, viewingFee:5000, commission:0.05 },
];

const LAND_LISTINGS = [
  { id:101, title:"Coastal Plot — 2 Acres", area:"Entebbe", price:45000000, verified:true,
    info:"Near lake. Utilities: Water, Power. Road access.", premiumFee:50000, locked:true,
    img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80" },
  { id:102, title:"Residential Plot, Muyenga", area:"Muyenga", price:120000000, verified:true,
    info:"Hilltop with city views. 50×100 ft. Title deed available.", premiumFee:100000, locked:true,
    img:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80" },
  { id:103, title:"Farm Land, Mukono", area:"Mukono", price:18000000, verified:false,
    info:"3 acres fertile land. River nearby. Access road.", premiumFee:20000, locked:true,
    img:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=80" },
];

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1400&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
];

// Mock admin config (in production, fetched from DB)
const DEFAULT_CONFIG = { viewingFee:5000, referralPayout:2000, withdrawMin:20000, landFee:50000, commissionPct:5 };

const AMICONS = {WiFi:"📶",Water:"💧",Security:"🔒",Parking:"🅿️",DSTV:"📺",Compound:"🌿","Near Campus":"🎓",Generator:"⚡"};
const MODES = [{id:"student",icon:"🎓",label:"I'm a Student"},{id:"home",icon:"🏡",label:"I want a Home"},{id:"shared",icon:"🤝",label:"Shared Housing"}];
const VIBES = [{id:"quiet",icon:"🌿",label:"Quiet"},{id:"city",icon:"🚶",label:"City Access"},{id:"student",icon:"🎓",label:"Student"},{id:"secure",icon:"🛡️",label:"Secure"},{id:"budget",icon:"💸",label:"Budget"},{id:"family",icon:"🏡",label:"Family"}];

const lc = s => s>=8.5?C.green:s>=7?C.blue:C.yellow;
const ll = s => s>=8.5?"Excellent":s>=7?"Good":"Fair";
const miInfo = m => m==="ready"?{bg:C.gL,color:C.gD,icon:"🟢",label:"Move-in Ready"}:m==="viewing"?{bg:"#FEF9C3",color:"#854D0E",icon:"🟡",label:"Needs Viewing"}:{bg:C.rL,color:C.rD,icon:"🔴",label:"Renovation"};
const confCol = s => s>=85?C.green:s>=65?C.blue:s>=40?C.gold:C.red;
const avgScore = l => +((l.living.safety+l.living.clean+l.living.access)/3).toFixed(1);
const fmtUGX = n => "UGX "+n.toLocaleString();

/* ═══════════════════════ SMALL BITS ════════════════════════ */
function ScoreRing({score,size=50}){
  const r=size*.38,circ=2*Math.PI*r,col=lc(score),fs=size*.23;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={size*.072}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={size*.072}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/10)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2+fs*.38} textAnchor="middle" fontSize={fs} fontWeight={700} fill={col}>{score}</text>
      </svg>
      <span style={{fontSize:9,color:col,fontWeight:700,marginTop:1}}>{ll(score)}</span>
    </div>
  );
}

/* ═══════════════════════ VIEWING PAYMENT MODAL ══════════════ */
function ViewingPayModal({listing,config,referrer,onClose,onSuccess}){
  const [step,setStep]=useState(1);
  const [name,setName]=useState("");const [phone,setPhone]=useState("");
  const [momo,setMomo]=useState("");const [paying,setPaying]=useState(false);const [paid,setPaid]=useState(false);
  const [agreed,setAgreed]=useState(false);
  const txnId=useRef("TXN-"+Math.random().toString(36).slice(2,10).toUpperCase());

  const doPay=()=>{
    if(momo.length<10)return;
    setPaying(true);
    setTimeout(()=>{setPaying(false);setPaid(true);},2000);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.8)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:440,boxShadow:"0 40px 80px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:C.navy,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:14,margin:0}}>🔓 Unlock Contact</p><p style={{color:C.tt,fontSize:11,margin:0}}>{listing.title}</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        {/* Steps */}
        <div style={{display:"flex",background:C.mist,borderBottom:`1px solid ${C.border}`}}>
          {["Details","Agreement","Pay","Access"].map((s,i)=>(
            <div key={s} style={{flex:1,padding:"8px 0",textAlign:"center",fontSize:10,fontWeight:700,
              color:step===i+1?C.blue:step>i+1?C.green:C.ts,
              borderBottom:`2.5px solid ${step===i+1?C.blue:step>i+1?C.green:"transparent"}`}}>
              {step>i+1?"✓ ":""}{s}
            </div>
          ))}
        </div>
        <div style={{padding:"20px 22px"}}>

          {step===1&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>Your Details</p>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name *"
                style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,marginBottom:10,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number *"
                style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,marginBottom:12,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"10px 14px",fontSize:12,color:C.yD,marginBottom:14,lineHeight:1.5}}>
                💰 Viewing fee: <strong>{fmtUGX(config.viewingFee)}</strong> (non-refundable)<br/>
                🔁 Referral bonus: Your referrer earns <strong>{fmtUGX(config.referralPayout)}</strong> when you pay
              </div>
              <button disabled={!name||!phone} onClick={()=>setStep(2)}
                style={{width:"100%",background:name&&phone?C.navy:"#e2e8f0",color:name&&phone?"#fff":C.ts,border:"none",borderRadius:12,padding:"12px 0",fontWeight:700,cursor:"pointer",fontSize:14}}>
                Next → Read Agreement
              </button>
            </>
          )}

          {step===2&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 10px"}}>Booking Agreement</p>
              <div style={{background:C.mist,borderRadius:12,padding:"12px 14px",fontSize:11,lineHeight:1.8,color:C.n3,maxHeight:170,overflowY:"auto",border:`1px solid ${C.border}`,marginBottom:12}}>
                <strong>RentRight! Viewing Terms</strong><br/><br/>
                1. The viewing fee of <strong>{fmtUGX(config.viewingFee)}</strong> is non-refundable once processed.<br/>
                2. RentRight! is a listing and matching platform only — not liable for property disputes.<br/>
                3. Inspect property before making any rental payment.<br/>
                4. Never pay rent without a signed tenancy agreement.<br/>
                5. Contact details are revealed only after payment confirmation.<br/>
                6. After viewing, you will be asked "Did you rent this house?" — honest response required.<br/>
                7. Your IP, device ID and timestamp ({new Date().toLocaleString()}) are recorded as proof.
              </div>
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:14}}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.green,width:15,height:15,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.n3,lineHeight:1.5}}>I, <strong>{name}</strong>, accept these terms.</span>
              </label>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(1)} style={{flex:1,background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 0",fontWeight:600,cursor:"pointer",fontSize:12}}>← Back</button>
                <button disabled={!agreed} onClick={()=>setStep(3)}
                  style={{flex:2,background:agreed?C.green:"#e2e8f0",color:agreed?"#fff":C.ts,border:"none",borderRadius:11,padding:"10px 0",fontWeight:700,cursor:agreed?"pointer":"default",fontSize:13}}>
                  Agree → Pay {fmtUGX(config.viewingFee)}
                </button>
              </div>
            </>
          )}

          {step===3&&(
            <>
              {!paid?(
                <>
                  <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 4px"}}>Pay {fmtUGX(config.viewingFee)}</p>
                  <p style={{fontSize:11,color:C.ts,margin:"0 0 12px"}}>Choose your payment method</p>
                  <div style={{background:"linear-gradient(135deg,#FFD700,#F59E0B)",borderRadius:14,padding:"12px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:26}}>📱</span>
                    <div><p style={{fontWeight:800,fontSize:13,color:"#1a0a00",margin:0}}>MTN Mobile Money</p><p style={{fontSize:10,color:"#3d2200",margin:0}}>Instant & secure</p></div>
                  </div>
                  <div style={{background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",borderRadius:14,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:26}}>📲</span>
                    <div><p style={{fontWeight:700,fontSize:13,color:C.bD,margin:0}}>Airtel Money</p><p style={{fontSize:10,color:C.ts,margin:0}}>Also accepted</p></div>
                  </div>
                  <input value={momo} onChange={e=>setMomo(e.target.value)} placeholder="Enter MoMo number (e.g. 0771 234 567)"
                    style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,marginBottom:12,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
                  <button onClick={doPay} disabled={paying||momo.length<10}
                    style={{width:"100%",background:momo.length>=10&&!paying?"#F59E0B":"#e2e8f0",color:momo.length>=10||paying?"#1a0a00":C.ts,border:"none",borderRadius:12,padding:"12px 0",fontWeight:800,cursor:momo.length>=10&&!paying?"pointer":"default",fontSize:14}}>
                    {paying?"Processing…":"💳 Pay "+fmtUGX(config.viewingFee)}
                  </button>
                </>
              ):(
                <div style={{textAlign:"center",padding:"10px 0"}}>
                  <p style={{fontSize:52,margin:"0 0 8px"}}>✅</p>
                  <p style={{fontWeight:900,fontSize:17,color:C.gD,margin:"0 0 4px"}}>Payment Confirmed!</p>
                  <p style={{fontSize:11,color:C.ts,margin:"0 0 14px"}}>Txn: <strong>{txnId.current}</strong></p>
                  {referrer&&<div style={{background:C.gL,borderRadius:10,padding:"8px 12px",fontSize:11,color:C.gD,marginBottom:12}}>🔁 Referral bonus of {fmtUGX(config.referralPayout)} sent to your referrer!</div>}
                  <button onClick={()=>setStep(4)} style={{background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"11px 28px",fontWeight:700,cursor:"pointer",fontSize:14}}>View Contact →</button>
                </div>
              )}
              {!paid&&<button onClick={()=>setStep(2)} style={{width:"100%",background:"none",border:"none",color:C.ts,cursor:"pointer",marginTop:8,fontSize:11}}>← Back</button>}
            </>
          )}

          {step===4&&(
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:40,margin:"0 0 8px"}}>🔓</p>
              <p style={{fontWeight:900,fontSize:16,color:C.navy,margin:"0 0 12px"}}>Contact Unlocked!</p>
              <div style={{background:C.gL,borderRadius:14,padding:"14px 16px",textAlign:"left",fontSize:12,lineHeight:1.9,marginBottom:12}}>
                <strong style={{color:C.gD}}>✅ Landlord Details</strong><br/>
                <strong>Name:</strong> {listing.landlord}<br/>
                <strong>Phone:</strong> {listing.phone.includes("X")?"0771 234 567":listing.phone}<br/>
                <strong>Fee Paid:</strong> {fmtUGX(config.viewingFee)} · Txn: {txnId.current}
              </div>
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"10px 14px",fontSize:11,color:C.yD,marginBottom:14}}>
                📋 <strong>After viewing:</strong> You'll receive a prompt "Did you rent this house?" — please answer honestly.
              </div>
              <a href={`https://wa.me/${listing.wa}?text=Hi ${listing.landlord}! I found "${listing.title}" on RentRight! Txn: ${txnId.current}`}
                target="_blank" rel="noopener noreferrer"
                style={{display:"block",background:"#25D366",color:"#fff",borderRadius:12,padding:"11px 0",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:10}}>
                💬 WhatsApp Landlord
              </a>
              <button onClick={()=>{onSuccess&&onSuccess();onClose();}} style={{width:"100%",background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"10px 0",fontWeight:700,cursor:"pointer",fontSize:12}}>Done ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ POST-VIEWING MODAL ═════════════════ */
function PostViewingModal({listing,onClose}){
  const [ans,setAns]=useState(null);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.75)",zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:380,padding:"24px 22px",boxShadow:"0 32px 70px rgba(0,0,0,.28)",textAlign:"center"}}>
        <p style={{fontSize:36,margin:"0 0 10px"}}>🏠</p>
        <p style={{fontWeight:900,fontSize:17,color:C.navy,margin:"0 0 6px"}}>How did your viewing go?</p>
        <p style={{fontSize:13,color:C.ts,margin:"0 0 20px"}}>"{listing.title}"</p>
        {!ans?(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <button onClick={()=>setAns("yes")}
              style={{background:C.gL,color:C.gD,border:`2px solid ${C.green}`,borderRadius:14,padding:"16px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
              ✅ Yes, I Rented It!
            </button>
            <button onClick={()=>setAns("no")}
              style={{background:C.mist,color:C.n3,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"16px 0",fontWeight:700,fontSize:14,cursor:"pointer"}}>
              ❌ No, Not Yet
            </button>
          </div>
        ):(
          <div>
            {ans==="yes"?(
              <div style={{background:C.gL,borderRadius:14,padding:"14px 16px",fontSize:12,color:C.n3,lineHeight:1.8}}>
                <p style={{fontWeight:700,color:C.gD,margin:"0 0 6px"}}>🎉 Congratulations!</p>
                A commission of <strong>{fmtUGX(Math.round(listing.price*listing.commission))}</strong> ({(listing.commission*100).toFixed(0)}% of first month) is due to RentRight!.<br/>
                Our team will follow up via WhatsApp to complete the commission settlement.
              </div>
            ):(
              <div style={{background:C.mist,borderRadius:14,padding:"14px 16px",fontSize:12,color:C.n3,lineHeight:1.7}}>
                No problem! Your contact access remains active for 7 days.<br/>
                We'll notify you when similar properties become available.
              </div>
            )}
            <button onClick={onClose} style={{marginTop:14,background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"11px 24px",fontWeight:700,cursor:"pointer",fontSize:13}}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ LAND PAYMENT MODAL ═════════════════ */
function LandPayModal({land,config,onClose}){
  const [momo,setMomo]=useState("");const [paying,setPaying]=useState(false);const [paid,setPaid]=useState(false);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.8)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:420,boxShadow:"0 36px 80px rgba(0,0,0,.3)"}}>
        <div style={{background:`linear-gradient(135deg,${C.gold},#D97706)`,padding:"14px 20px",borderRadius:"22px 22px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:14,margin:0}}>🌍 Premium Land Access</p><p style={{color:"rgba(255,255,255,.8)",fontSize:11,margin:0}}>{land.title}</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"20px 22px"}}>
          {!paid?(
            <>
              <div style={{background:C.goldL,borderRadius:14,padding:"14px 16px",fontSize:12,color:C.yD,marginBottom:14,lineHeight:1.6}}>
                <strong>What you get after payment:</strong><br/>
                ✅ Owner's full contact details<br/>
                ✅ Exact GPS location<br/>
                ✅ Title deed verification status<br/>
                ✅ Price negotiation access<br/><br/>
                <strong>Fee:</strong> {fmtUGX(land.premiumFee)} (one-time, non-refundable)
              </div>
              <div style={{background:"linear-gradient(135deg,#FFD700,#F59E0B)",borderRadius:12,padding:"11px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>📱</span>
                <p style={{fontWeight:700,fontSize:13,color:"#1a0a00",margin:0}}>MTN / Airtel Mobile Money</p>
              </div>
              <input value={momo} onChange={e=>setMomo(e.target.value)} placeholder="Enter MoMo number"
                style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,marginBottom:12,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
              <button onClick={()=>{if(momo.length<10)return;setPaying(true);setTimeout(()=>{setPaying(false);setPaid(true);},1800);}}
                disabled={paying||momo.length<10}
                style={{width:"100%",background:momo.length>=10&&!paying?C.gold:"#e2e8f0",color:momo.length>=10||paying?"#1a0a00":C.ts,border:"none",borderRadius:12,padding:"12px 0",fontWeight:800,cursor:"pointer",fontSize:14}}>
                {paying?"Processing…":"💳 Pay "+fmtUGX(land.premiumFee)}
              </button>
            </>
          ):(
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <p style={{fontSize:48,margin:"0 0 8px"}}>🔓</p>
              <p style={{fontWeight:900,fontSize:16,color:C.gD,margin:"0 0 12px"}}>Land Details Unlocked!</p>
              <div style={{background:C.gL,borderRadius:14,padding:"14px 16px",textAlign:"left",fontSize:12,lineHeight:1.9,marginBottom:14}}>
                <strong style={{color:C.gD}}>✅ Owner Information</strong><br/>
                <strong>Property:</strong> {land.title}<br/>
                <strong>Area:</strong> {land.area}<br/>
                <strong>Info:</strong> {land.info}<br/>
                <strong>Owner Phone:</strong> 0771 999 888 (now revealed)<br/>
                <strong>GPS Coords:</strong> 0.3476° N, 32.5825° E
              </div>
              <button onClick={onClose} style={{background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"11px 28px",fontWeight:700,cursor:"pointer",fontSize:13}}>Done ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ LISTING CARD ══════════════════════ */
function ListingCard({l,config,onView}){
  const mii=miInfo(l.moveIn);const score=avgScore(l);
  return(
    <div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:`1.5px solid ${l.boosted?"#F59E0B":C.border}`,cursor:"pointer",transition:"all .2s",boxShadow:l.boosted?"0 2px 16px rgba(245,158,11,.15)":"0 2px 10px rgba(15,23,42,.05)"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=l.boosted?"0 12px 32px rgba(245,158,11,.2)":"0 10px 32px rgba(15,23,42,.12)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=l.boosted?"0 2px 16px rgba(245,158,11,.15)":"0 2px 10px rgba(15,23,42,.05)";}}>
      <div style={{position:"relative"}}>
        <img src={l.img} alt={l.title} style={{width:"100%",height:180,objectFit:"cover",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(15,23,42,.5) 0%,transparent 55%)"}}/>
        <div style={{position:"absolute",top:9,left:9,display:"flex",gap:4,flexWrap:"wrap"}}>
          {l.boosted&&<span style={{background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>🚀 Boosted</span>}
          <span style={{background:l.verified?C.gL:C.rL,color:l.verified?C.gD:C.rD,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>{l.verified?"✔ Verified":"⚠ Unverified"}</span>
        </div>
        {l.contactLocked&&<div style={{position:"absolute",top:9,right:9,background:"rgba(15,23,42,.8)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>🔒 Locked</div>}
        <div style={{position:"absolute",bottom:9,left:9}}><span style={{background:mii.bg,color:mii.color,fontSize:9,fontWeight:700,padding:"2px 9px",borderRadius:20}}>{mii.icon} {mii.label}</span></div>
        <div style={{position:"absolute",bottom:9,right:9,background:"rgba(15,23,42,.86)",color:"#fff",fontWeight:800,fontSize:12,padding:"3px 10px",borderRadius:20}}>{fmtUGX(l.price)}/mo</div>
      </div>
      <div style={{padding:"12px 14px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
          <div style={{flex:1}}>
            <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:0,lineHeight:1.3}}>{l.title}</p>
            <p style={{color:C.ts,fontSize:11,margin:"2px 0 0"}}>📍 {l.area} · {l.type}</p>
          </div>
          <ScoreRing score={score} size={46}/>
        </div>
        <div style={{marginTop:7,display:"flex",alignItems:"center",gap:5}}>
          <div style={{flex:1,background:C.border,borderRadius:10,height:4}}><div style={{width:`${l.confidence}%`,height:"100%",background:confCol(l.confidence),borderRadius:10}}/></div>
          <span style={{fontSize:9,fontWeight:700,color:confCol(l.confidence),whiteSpace:"nowrap"}}>{l.confidence}%</span>
        </div>
        <div style={{marginTop:7,display:"flex",gap:4,flexWrap:"wrap"}}>
          {l.amenities.slice(0,3).map(a=><span key={a} style={{background:C.mist,color:C.n3,fontSize:10,padding:"2px 7px",borderRadius:10}}>{AMICONS[a]} {a}</span>)}
        </div>
        <button onClick={()=>onView(l)}
          style={{marginTop:10,width:"100%",background:l.contactLocked?C.navy:C.green,color:"#fff",border:"none",borderRadius:12,padding:"9px 0",fontWeight:700,cursor:"pointer",fontSize:12}}>
          {l.contactLocked?`🔓 Unlock Contact — ${fmtUGX(config.viewingFee)}`:"💬 Contact Landlord"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════ REFERRAL DASHBOARD ═════════════════ */
function ReferralDashboard({config,onBack}){
  const [refCode]=useState("rentright.ug/ref/bonny123");
  const [copied,setCopied]=useState(false);
  const [withdrawReq,setWithdrawReq]=useState(false);
  const [momoNum,setMomoNum]=useState("");
  const [withdrawing,setWithdrawing]=useState(false);
  const [withdrawn,setWithdrawn]=useState(false);

  const earnings={total:25000,pending:10000,withdrawable:25000};
  const activity=[
    {name:"Sarah K.",action:"Viewed Kisaasi Room",earned:config.referralPayout,time:"2 hrs ago",avatar:"SK"},
    {name:"Alex M.",action:"Viewed Studio Bukoto",earned:config.referralPayout,time:"Yesterday",avatar:"AM"},
    {name:"Joyce N.",action:"Viewed Hostel Wandegeya",earned:config.referralPayout,time:"2 days ago",avatar:"JN"},
  ];
  const upcomingMoves=[
    {type:"out",label:"Moving Out in 2 Weeks",color:"#FEF9C3",tc:C.yD,items:["Hire Movers Nearby","Book Transport Vehicles","Find Helpers to Pack"]},
    {type:"in",label:"Moving In 3 Weeks",color:C.gL,tc:C.gD,items:["Confirm with Landlord","Arrange Utilities","Move-in Checklist"]},
  ];

  const doWithdraw=()=>{
    if(momoNum.length<10)return;
    setWithdrawing(true);
    setTimeout(()=>{setWithdrawing(false);setWithdrawn(true);},2000);
  };

  return(
    <div style={{minHeight:"100vh",background:C.mist}}>
      {/* Header */}
      <div style={{background:C.navy,padding:"14px 24px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:15}}>R</div>
          <span style={{fontWeight:900,fontSize:18,color:"#fff"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span> <span style={{color:C.tt,fontSize:13,fontWeight:500}}>Referrals</span></span>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 20px"}}>
        {/* Hero Banner */}
        <div style={{background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:20,padding:"22px 24px",marginBottom:22,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:140,height:140,background:"rgba(255,255,255,.08)",borderRadius:"50%"}}/>
          <div style={{position:"absolute",right:60,bottom:-30,width:100,height:100,background:"rgba(255,255,255,.05)",borderRadius:"50%"}}/>
          <p style={{color:"#fff",fontWeight:900,fontSize:"clamp(1.1rem,3vw,1.5rem)",margin:"0 0 4px"}}>Invite Friends to RentRight!</p>
          <p style={{color:"rgba(255,255,255,.9)",fontSize:14,margin:"0 0 14px"}}>Earn <strong>{fmtUGX(config.referralPayout)}</strong> per Referral!</p>
          <div style={{background:"rgba(255,255,255,.15)",borderRadius:10,padding:"8px 14px",display:"inline-flex",alignItems:"center",gap:10,marginBottom:14,border:"1px solid rgba(255,255,255,.25)"}}>
            <span style={{color:"#fff",fontSize:12,fontFamily:"monospace"}}>{refCode}</span>
            <button onClick={()=>{navigator.clipboard.writeText(refCode);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
              style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
              {copied?"✅":"📋 Copy"}
            </button>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <a href={`https://wa.me/?text=Find your perfect home in Uganda! Use my link: ${refCode}`} target="_blank" rel="noopener noreferrer"
              style={{background:"#25D366",color:"#fff",padding:"8px 16px",borderRadius:12,fontSize:12,fontWeight:700,textDecoration:"none"}}>📤 Share on WhatsApp</a>
            <div style={{background:"rgba(255,255,255,.15)",color:"#fff",padding:"8px 16px",borderRadius:12,fontSize:12,fontWeight:700,border:"1px solid rgba(255,255,255,.3)"}}>
              💰 Earnings: <strong>{fmtUGX(earnings.total)}</strong>
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
          {/* Earning Flow */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 18px",border:`1px solid ${C.border}`}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 14px"}}>💡 Earning Flow</p>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              {[["1","Friend Signs Up",C.green],["2",`Pays ${fmtUGX(config.viewingFee)}`,C.blue],["3","Views Property",C.gold],["4",`You Earn ${fmtUGX(config.referralPayout)}!`,C.green]].map(([n,lb,col],i,arr)=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{background:col,borderRadius:12,padding:"8px 12px",textAlign:"center",minWidth:80}}>
                    <div style={{background:"rgba(255,255,255,.3)",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:col===C.gold?"#1a0a00":"#fff",margin:"0 auto 4px"}}>{n}</div>
                    <p style={{fontSize:10,fontWeight:700,color:col===C.gold?"#1a0a00":"#fff",margin:0,lineHeight:1.3}}>{lb}</p>
                  </div>
                  {i<arr.length-1&&<span style={{color:C.ts,fontSize:14}}>→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Summary */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 18px",border:`1px solid ${C.border}`}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>💵 Your Earnings</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[["Total Earned",fmtUGX(earnings.total),C.green],["Pending",fmtUGX(earnings.pending),C.gold],["Withdrawable",fmtUGX(earnings.withdrawable),C.blue]].map(([lb,val,col])=>(
                <div key={lb} style={{background:C.mist,borderRadius:12,padding:"10px 10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                  <p style={{fontSize:9,color:C.ts,margin:"0 0 3px"}}>{lb}</p>
                  <p style={{fontWeight:800,fontSize:12,color:col,margin:0}}>{val}</p>
                </div>
              ))}
            </div>
            {!withdrawReq?(
              <button onClick={()=>setWithdrawReq(true)} disabled={earnings.withdrawable<config.withdrawMin}
                style={{width:"100%",background:earnings.withdrawable>=config.withdrawMin?C.blue:"#e2e8f0",color:earnings.withdrawable>=config.withdrawMin?"#fff":C.ts,border:"none",borderRadius:12,padding:"10px 0",fontWeight:700,cursor:"pointer",fontSize:12}}>
                {earnings.withdrawable>=config.withdrawMin?`💳 Withdraw (Min ${fmtUGX(config.withdrawMin)})`:`Min ${fmtUGX(config.withdrawMin)} needed`}
              </button>
            ):withdrawn?(
              <div style={{background:C.gL,borderRadius:12,padding:"10px 12px",fontSize:11,color:C.gD,textAlign:"center",fontWeight:700}}>✅ Withdrawal sent to your MoMo!</div>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input value={momoNum} onChange={e=>setMomoNum(e.target.value)} placeholder="MoMo number"
                  style={{flex:1,padding:"9px 12px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",outline:"none"}}/>
                <button onClick={doWithdraw} disabled={withdrawing||momoNum.length<10}
                  style={{background:momoNum.length>=10&&!withdrawing?C.blue:"#e2e8f0",color:momoNum.length>=10||withdrawing?"#fff":C.ts,border:"none",borderRadius:10,padding:"9px 14px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                  {withdrawing?"Sending…":"Withdraw"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
          {/* Upcoming Moves */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 18px",border:`1px solid ${C.border}`}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 14px"}}>🚚 Upcoming Moves</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {upcomingMoves.map(m=>(
                <div key={m.type} style={{background:m.color,borderRadius:14,padding:"14px 14px",border:`1px solid ${m.tc}22`}}>
                  <p style={{fontWeight:800,fontSize:12,color:m.tc,margin:"0 0 10px"}}>{m.label}</p>
                  {m.items.map(item=>(
                    <div key={item} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                      <span style={{fontSize:16}}>{item.includes("Movers")?"🚛":item.includes("Transport")?"🚐":item.includes("Helpers")?"👷":item.includes("Confirm")?"✅":item.includes("Utilities")?"💡":"📋"}</span>
                      <a href="#" style={{fontSize:11,color:m.tc,fontWeight:600,textDecoration:"none"}}>{item}</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Referral Activity */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 18px",border:`1px solid ${C.border}`}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>📊 Recent Activity</p>
            {activity.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<activity.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{width:34,height:34,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:11,flexShrink:0}}>{a.avatar}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:0}}>{a.name}</p>
                  <p style={{fontSize:10,color:C.ts,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.action}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontWeight:800,fontSize:11,color:C.gD,margin:0}}>+{fmtUGX(a.earned)}</p>
                  <p style={{fontSize:9,color:C.tt,margin:0}}>{a.time}</p>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,background:C.bL,borderRadius:10,padding:"8px 12px",textAlign:"center"}}>
              <p style={{fontSize:11,fontWeight:700,color:C.bD,margin:0}}>Earnings Steps</p>
            </div>
            {[["1","Friend Signs Up","Pays Viewing Fee "+fmtUGX(config.viewingFee)],["2","Pays Viewing Fee",fmtUGX(config.viewingFee)+" confirmed"],["3","Views Property","You earn "+fmtUGX(config.referralPayout)+"!"]].map(([n,t,s])=>(
              <div key={n} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:22,height:22,background:C.blue,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:11,flexShrink:0}}>{n}</div>
                <div><p style={{fontWeight:700,fontSize:11,color:C.navy,margin:0}}>{t}</p><p style={{fontSize:10,color:C.ts,margin:0}}>✅ {s}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ USER DASHBOARD ════════════════════ */
function UserDashboard({config,onBack,onViewListing}){
  const user={name:"Bonny",phone:"0771 234 567",referralCode:"bonny123",balance:25000,viewedListings:3};
  const alerts=[
    {type:"land",msg:"New Land Listing Available — Muyenga Plot 50×100",tag:"Premium Fee Required",urgent:true},
    {type:"price",msg:"Price dropped: Studio Bukoto now UGX 380,000/mo",tag:"",urgent:false},
    {type:"new",msg:"New verified listing in your area: Kisaasi Double Room",tag:"",urgent:false},
  ];
  const interested=[
    {id:1,title:"Coastal Plot — 2 Acres",area:"Entebbe",info:"Near lake. Utilities: Water, Power.",premium:true,img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=60"},
    {id:2,title:"Student Hostel, Wandegeya",area:"Wandegeya",info:"2 min from Makerere. WiFi included.",premium:false,img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&q=60"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.mist}}>
      <div style={{background:C.navy,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12}}>← Home</button>
          <span style={{fontWeight:900,fontSize:18,color:"#fff"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:C.gL,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700,color:C.gD}}>💰 {fmtUGX(user.balance)}</div>
          <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14}}>B</div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 20px"}}>
        {/* Welcome */}
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.n2})`,borderRadius:20,padding:"20px 22px",marginBottom:20,overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",right:-10,top:-10,width:120,height:120,background:C.green+"15",borderRadius:"50%"}}/>
          <div style={{position:"absolute",right:60,bottom:-20,width:80,height:80,background:C.blue+"15",borderRadius:"50%"}}/>
          <p style={{color:"#fff",fontWeight:900,fontSize:20,margin:"0 0 4px"}}>Welcome Back, {user.name}! 👋</p>
          <p style={{color:C.tt,fontSize:12,margin:"0 0 14px"}}>Your RentRight! dashboard · Ref code: <strong style={{color:C.green}}>rentright.ug/ref/{user.referralCode}</strong></p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[["Listings Viewed",user.viewedListings,"🏠"],["Referral Balance",fmtUGX(user.balance),"💰"],["Referrals Made","3","🔁"]].map(([lb,val,ic])=>(
              <div key={lb} style={{background:"rgba(255,255,255,.08)",borderRadius:12,padding:"10px 14px",border:"1px solid rgba(255,255,255,.1)"}}>
                <p style={{fontSize:9,color:C.tt,margin:"0 0 2px"}}>{lb}</p>
                <p style={{fontWeight:800,fontSize:14,color:"#fff",margin:0}}>{ic} {val}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
          {/* Property Alerts */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 18px",border:`1px solid ${C.border}`}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>🔔 Property Alerts</p>
            {alerts.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",borderRadius:12,background:a.urgent?C.goldL:C.mist,marginBottom:8,border:`1px solid ${a.urgent?C.gold:C.border}`,cursor:"pointer"}}>
                <span style={{fontSize:18,flexShrink:0}}>{a.urgent?"⚠️":"🏠"}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:600,color:C.navy,margin:0}}>{a.msg}</p>
                  {a.tag&&<span style={{background:C.gold+"33",color:C.yD,fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:20}}>{a.tag}</span>}
                </div>
                <span style={{color:C.ts,fontSize:16}}>›</span>
              </div>
            ))}
          </div>

          {/* Interested Properties */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 18px",border:`1px solid ${C.border}`}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>⭐ Interested Properties</p>
            {interested.map(p=>(
              <div key={p.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <img src={p.img} alt={p.title} style={{width:72,height:56,objectFit:"cover",borderRadius:10,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:0}}>{p.title}</p>
                  <p style={{fontSize:10,color:C.ts,margin:"2px 0 5px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.info}</p>
                  <button onClick={()=>onViewListing&&onViewListing(p)}
                    style={{background:p.premium?C.gold:C.green,color:p.premium?"#1a0a00":"#fff",border:"none",borderRadius:10,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                    {p.premium?"💎 Contact Owner (Premium)":"📱 Contact Landlord"}
                  </button>
                </div>
              </div>
            ))}
            <div style={{marginTop:12,background:C.bL,borderRadius:12,padding:"10px 12px",fontSize:11,color:C.bD,textAlign:"center"}}>
              🔔 You'll be alerted when new matches appear
            </div>
          </div>
        </div>

        {/* Success Confirmation Prompt */}
        <div style={{marginTop:18,background:`linear-gradient(135deg,${C.gL},${C.bL})`,borderRadius:18,padding:"16px 20px",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap",border:`1px solid ${C.green}44`}}>
          <span style={{fontSize:28}}>🏠</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:0}}>Did you rent "Studio Bukoto" from your last viewing?</p>
            <p style={{fontSize:11,color:C.ts,margin:"2px 0 0"}}>Your honest answer helps us improve + triggers commission settlement</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"9px 16px",fontWeight:700,cursor:"pointer",fontSize:12}}>✅ Yes I Rented!</button>
            <button style={{background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:12,padding:"9px 16px",fontWeight:600,cursor:"pointer",fontSize:12}}>❌ Not Yet</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ ADMIN DASHBOARD ═══════════════════ */
function AdminDashboard({config,setConfig,onBack}){
  const [tab,setTab]=useState("overview");
  const [editConfig,setEditConfig]=useState({...config});
  const [saved,setSaved]=useState(false);
  const [listings,setListings]=useState(LISTINGS);
  const [adminPwd,setAdminPwd]=useState(""); const [authed,setAuthed]=useState(false);

  const stats={total:128,pending:15,messages:8,revenue:2400000,fraudAlerts:3,verified:108};
  const transactions=[
    {id:"TXN-A1B2C3",user:"Sarah K.",type:"Viewing Fee",amount:5000,status:"completed",time:"10 min ago"},
    {id:"TXN-D4E5F6",user:"Mark O.",type:"Land Access",amount:50000,status:"completed",time:"1 hr ago"},
    {id:"TXN-G7H8I9",user:"Joyce N.",type:"Boost Listing",amount:25000,status:"completed",time:"2 hrs ago"},
    {id:"TXN-J0K1L2",user:"Peter M.",type:"Viewing Fee",amount:5000,status:"pending",time:"3 hrs ago"},
    {id:"TXN-M3N4O5",user:"Grace A.",type:"Referral Payout",amount:2000,status:"completed",time:"4 hrs ago"},
  ];
  const fraudAlerts=[
    {listing:"Room Ntinda",reason:"GPS mismatch detected",severity:"high",time:"30 min ago"},
    {listing:"Studio Kampala",reason:"Duplicate phone number",severity:"medium",time:"2 hrs ago"},
    {listing:"Plot Mukono",reason:"Stolen image detected",severity:"high",time:"Yesterday"},
  ];
  const landRequests=[
    {title:"Plot — Muyenga",owner:"James K.",nin:"CM90123456",status:"pending"},
    {title:"Farm Land, Mukono",owner:"Grace N.",nin:"CF88654321",status:"reviewed"},
  ];

  if(!authed){
    return(
      <div style={{minHeight:"100vh",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#fff",borderRadius:22,padding:"32px 28px",width:"100%",maxWidth:360,textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.4)"}}>
          <div style={{width:56,height:56,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>⚙️</div>
          <p style={{fontWeight:900,fontSize:20,color:C.navy,margin:"0 0 4px"}}>Admin Panel</p>
          <p style={{fontSize:12,color:C.ts,margin:"0 0 20px"}}>/admin · RentRight! Control Panel</p>
          <input type="password" value={adminPwd} onChange={e=>setAdminPwd(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&adminPwd==="admin123"&&setAuthed(true)}
            placeholder="Enter admin password"
            style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:14,marginBottom:12,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
          <button onClick={()=>adminPwd==="admin123"&&setAuthed(true)}
            style={{width:"100%",background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"12px 0",fontWeight:700,cursor:"pointer",fontSize:14}}>
            Enter Admin Panel
          </button>
          <p style={{fontSize:10,color:C.ts,marginTop:10}}>Demo password: admin123</p>
          <button onClick={onBack} style={{marginTop:8,background:"none",border:"none",color:C.ts,cursor:"pointer",fontSize:12}}>← Back to site</button>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:"#0f1117"}}>
      {/* Admin Nav */}
      <div style={{background:"#1a1d2e",borderBottom:"1px solid #2a2d3e",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:13}}>R</div>
          <span style={{fontWeight:800,fontSize:16,color:"#fff"}}>RentRight! <span style={{color:C.ts,fontSize:12,fontWeight:400}}>/admin</span></span>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["overview","listings","transactions","fraud","config"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{background:tab===t?"rgba(56,189,248,.15)":"transparent",color:tab===t?C.blue:C.ts,border:tab===t?`1px solid ${C.blue}44`:"1px solid transparent",borderRadius:10,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
              {t==="overview"?"📊":t==="listings"?"🏠":t==="transactions"?"💳":t==="fraud"?"🚨":"⚙️"} {t}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {stats.fraudAlerts>0&&<span style={{background:C.rD,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20}}>🚨 {stats.fraudAlerts} Alerts</span>}
          <button onClick={onBack} style={{background:"rgba(255,255,255,.06)",border:"1px solid #2a2d3e",color:C.ts,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:11}}>← Exit</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"22px 22px"}}>

        {/* OVERVIEW TAB */}
        {tab==="overview"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:22}}>
              {[["Total Properties",stats.total,"🏠",C.blue],["Pending Approvals",stats.pending,"⏳",C.gold],["Messages",stats.messages,"💬",C.purple],["Revenue Today",fmtUGX(stats.revenue),"💰",C.green],["Fraud Alerts",stats.fraudAlerts,"🚨",C.red],["Verified",stats.verified,"✅",C.green]].map(([lb,val,ic,col])=>(
                <div key={lb} style={{background:"#1a1d2e",borderRadius:14,padding:"16px 14px",border:`1px solid ${col}33`}}>
                  <p style={{fontSize:20,margin:"0 0 6px"}}>{ic}</p>
                  <p style={{fontWeight:900,fontSize:18,color:col,margin:0}}>{val}</p>
                  <p style={{fontSize:10,color:C.ts,margin:"3px 0 0"}}>{lb}</p>
                </div>
              ))}
            </div>

            {/* Manage Listings quick */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <div style={{background:"#1a1d2e",borderRadius:16,padding:"18px 18px",border:"1px solid #2a2d3e"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <p style={{fontWeight:700,fontSize:13,color:"#fff",margin:0}}>🏠 Manage Listings</p>
                  <button style={{background:C.green,color:"#fff",border:"none",borderRadius:10,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Upload New</button>
                </div>
                {LISTINGS.slice(0,3).map(l=>(
                  <div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #2a2d3e"}}>
                    <img src={l.img} alt={l.title} style={{width:48,height:36,objectFit:"cover",borderRadius:8}}/>
                    <div style={{flex:1,minWidth:0}}><p style={{color:"#fff",fontWeight:600,fontSize:12,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</p><p style={{color:C.ts,fontSize:10,margin:0}}>{fmtUGX(l.price)}/mo</p></div>
                    <div style={{display:"flex",gap:5}}>
                      <button style={{background:C.blue+"22",color:C.blue,border:"none",borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Edit</button>
                      <button onClick={()=>setListings(prev=>prev.filter(x=>x.id!==l.id))}
                        style={{background:C.rD+"22",color:C.red,border:"none",borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Land Listing Requests */}
              <div style={{background:"#1a1d2e",borderRadius:16,padding:"18px 18px",border:"1px solid #2a2d3e"}}>
                <p style={{fontWeight:700,fontSize:13,color:"#fff",margin:"0 0 12px"}}>🌍 Land Listing Requests</p>
                {landRequests.map((r,i)=>(
                  <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #2a2d3e"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div><p style={{color:"#fff",fontWeight:600,fontSize:12,margin:0}}>{r.title}</p><p style={{color:C.ts,fontSize:10,margin:0}}>Owner: {r.owner} · NIN: {r.nin}</p></div>
                      <span style={{background:r.status==="reviewed"?C.gL:C.goldL,color:r.status==="reviewed"?C.gD:C.yD,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{r.status}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{background:C.green,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>✅ Approve</button>
                      <button style={{background:C.rD,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>✕ Reject</button>
                      <button style={{background:"#2a2d3e",color:C.ts,border:"none",borderRadius:8,padding:"4px 12px",fontSize:10,cursor:"pointer"}}>Report</button>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:12,display:"flex",gap:8}}>
                  <div style={{flex:1,background:"#2a2d3e",borderRadius:10,padding:"8px 10px",fontSize:10,color:C.ts}}>✅ Reviewed Applications: 24</div>
                  <div style={{flex:1,background:"#2a2d3e",borderRadius:10,padding:"8px 10px",fontSize:10,color:C.ts}}>🔒 Verified Landowners Only</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS TAB */}
        {tab==="transactions"&&(
          <div style={{background:"#1a1d2e",borderRadius:16,padding:"18px 18px",border:"1px solid #2a2d3e"}}>
            <p style={{fontWeight:700,fontSize:14,color:"#fff",margin:"0 0 14px"}}>💳 Transaction History</p>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #2a2d3e"}}>
                    {["Txn ID","User","Type","Amount","Status","Time"].map(h=>(
                      <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.ts}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t=>(
                    <tr key={t.id} style={{borderBottom:"1px solid #1f2235"}}>
                      <td style={{padding:"10px 12px",fontSize:11,color:C.blue,fontFamily:"monospace"}}>{t.id}</td>
                      <td style={{padding:"10px 12px",fontSize:11,color:"#fff",fontWeight:600}}>{t.user}</td>
                      <td style={{padding:"10px 12px",fontSize:11,color:C.ts}}>{t.type}</td>
                      <td style={{padding:"10px 12px",fontSize:11,fontWeight:700,color:t.type==="Referral Payout"?C.red:C.green}}>{t.type==="Referral Payout"?"-":"+"}UGX {t.amount.toLocaleString()}</td>
                      <td style={{padding:"10px 12px"}}><span style={{background:t.status==="completed"?C.gL:C.goldL,color:t.status==="completed"?C.gD:C.yD,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{t.status}</span></td>
                      <td style={{padding:"10px 12px",fontSize:10,color:C.ts}}>{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FRAUD TAB */}
        {tab==="fraud"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:18}}>
              {[["Flagged Today",3,"🚨",C.red],["Under Review",2,"🔍",C.gold],["Frozen Accounts",1,"🔒",C.purple],["Cleared Today",5,"✅",C.green]].map(([lb,val,ic,col])=>(
                <div key={lb} style={{background:"#1a1d2e",borderRadius:14,padding:"14px 14px",border:`1px solid ${col}33`}}>
                  <p style={{fontSize:22,margin:"0 0 6px"}}>{ic}</p>
                  <p style={{fontWeight:900,fontSize:20,color:col,margin:0}}>{val}</p>
                  <p style={{fontSize:10,color:C.ts,margin:"3px 0 0"}}>{lb}</p>
                </div>
              ))}
            </div>
            <div style={{background:"#1a1d2e",borderRadius:16,padding:"18px 18px",border:"1px solid #2a2d3e"}}>
              <p style={{fontWeight:700,fontSize:13,color:"#fff",margin:"0 0 12px"}}>🚨 Active Fraud Alerts</p>
              {fraudAlerts.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid #2a2d3e"}}>
                  <span style={{fontSize:20,flexShrink:0}}>{a.severity==="high"?"🔴":"🟡"}</span>
                  <div style={{flex:1}}>
                    <p style={{color:"#fff",fontWeight:600,fontSize:12,margin:0}}>{a.listing}</p>
                    <p style={{color:C.ts,fontSize:10,margin:0}}>{a.reason} · {a.time}</p>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{background:C.rD,color:"#fff",border:"none",borderRadius:8,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>🔒 Freeze</button>
                    <button style={{background:"#2a2d3e",color:C.ts,border:"none",borderRadius:8,padding:"5px 12px",fontSize:10,cursor:"pointer"}}>Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTINGS TAB */}
        {tab==="listings"&&(
          <div style={{background:"#1a1d2e",borderRadius:16,padding:"18px 18px",border:"1px solid #2a2d3e"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <p style={{fontWeight:700,fontSize:14,color:"#fff",margin:0}}>🏠 All Listings ({listings.length})</p>
              <button style={{background:C.green,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Add Listing</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {listings.map(l=>(
                <div key={l.id} style={{background:"#0f1117",borderRadius:14,overflow:"hidden",border:`1px solid ${l.verified?"#22C55E33":"#F87171"}44`}}>
                  <div style={{position:"relative"}}>
                    <img src={l.img} alt={l.title} style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>
                    <div style={{position:"absolute",top:8,left:8,display:"flex",gap:5}}>
                      <span style={{background:l.verified?C.gL:C.rL,color:l.verified?C.gD:C.rD,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>{l.verified?"✔ Live":"⚠ Unverified"}</span>
                      {l.boosted&&<span style={{background:"#F59E0B",color:"#1a0a00",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>🚀 Boosted</span>}
                    </div>
                  </div>
                  <div style={{padding:"10px 12px"}}>
                    <p style={{color:"#fff",fontWeight:700,fontSize:12,margin:"0 0 2px"}}>{l.title}</p>
                    <p style={{color:C.ts,fontSize:10,margin:"0 0 8px"}}>{fmtUGX(l.price)}/mo · Confidence: {l.confidence}%</p>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{flex:1,background:C.blue+"22",color:C.blue,border:"none",borderRadius:8,padding:"5px 0",fontSize:10,fontWeight:700,cursor:"pointer"}}>Edit</button>
                      <button onClick={()=>setListings(prev=>prev.filter(x=>x.id!==l.id))}
                        style={{flex:1,background:C.rD+"22",color:C.red,border:"none",borderRadius:8,padding:"5px 0",fontSize:10,fontWeight:700,cursor:"pointer"}}>Delete</button>
                      <button style={{flex:1,background:"#2a2d3e",color:C.gold,border:"none",borderRadius:8,padding:"5px 0",fontSize:10,fontWeight:700,cursor:"pointer"}}>Boost</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {tab==="config"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <div style={{background:"#1a1d2e",borderRadius:16,padding:"20px 20px",border:"1px solid #2a2d3e"}}>
              <p style={{fontWeight:700,fontSize:14,color:"#fff",margin:"0 0 16px"}}>⚙️ Platform Fee Settings</p>
              {[["Viewing Fee (UGX)","viewingFee"],["Referral Payout (UGX)","referralPayout"],["Withdrawal Min (UGX)","withdrawMin"],["Land Access Fee (UGX)","landFee"],["Commission %","commissionPct"]].map(([lb,key])=>(
                <div key={key} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                  <input type="number" value={editConfig[key]} onChange={e=>setEditConfig(p=>({...p,[key]:parseInt(e.target.value)||0}))}
                    style={{width:"100%",padding:"10px 14px",borderRadius:11,border:"1px solid #2a2d3e",background:"#0f1117",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
                </div>
              ))}
              <button onClick={()=>{setConfig(editConfig);setSaved(true);setTimeout(()=>setSaved(false),2500);}}
                style={{width:"100%",background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"12px 0",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:6}}>
                {saved?"✅ Saved!":"💾 Save Changes"}
              </button>
            </div>
            <div style={{background:"#1a1d2e",borderRadius:16,padding:"20px 20px",border:"1px solid #2a2d3e"}}>
              <p style={{fontWeight:700,fontSize:14,color:"#fff",margin:"0 0 14px"}}>📊 Current Fee Summary</p>
              {[["Viewing Fee",fmtUGX(config.viewingFee),C.blue],["Referral Payout",fmtUGX(config.referralPayout),C.green],["Min Withdrawal",fmtUGX(config.withdrawMin),C.gold],["Land Access Fee",fmtUGX(config.landFee),C.purple],["Commission Rate",config.commissionPct+"%",C.red]].map(([lb,val,col])=>(
                <div key={lb} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #2a2d3e"}}>
                  <span style={{fontSize:12,color:C.ts}}>{lb}</span>
                  <span style={{fontSize:12,fontWeight:700,color:col}}>{val}</span>
                </div>
              ))}
              <div style={{marginTop:14,background:"#0f1117",borderRadius:12,padding:"12px 14px",fontSize:11,color:C.ts,lineHeight:1.6}}>
                💡 Changes take effect immediately on all new transactions. Existing bookings are not affected.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN APP ══════════════════════════ */
export default function RentRight(){
  const [page,setPage]=useState("home"); // home | referrals | dashboard | admin | land
  const [heroIdx,setHeroIdx]=useState(0);
  const [mode,setMode]=useState(null);
  const [search,setSearch]=useState("");const [minP,setMinP]=useState("");const [maxP,setMaxP]=useState("");
  const [selVibes,setSelVibes]=useState([]);const [onlyVerified,setOnlyVerified]=useState(false);
  const [sortBy,setSortBy]=useState("match");
  const [filtered,setFiltered]=useState([...LISTINGS].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));
  const [payingFor,setPayingFor]=useState(null);
  const [postViewing,setPostViewing]=useState(null);
  const [landPayFor,setLandPayFor]=useState(null);
  const [chatOpen,setChatOpen]=useState(false);
  const [alertEmail,setAlertEmail]=useState("");const [alertSent,setAlertSent]=useState(false);
  const [config,setConfig]=useState({...DEFAULT_CONFIG});
  const [refEmail,setRefEmail]=useState("");const [refSent,setRefSent]=useState(false);
  const listRef=useRef(null);

  useEffect(()=>{const t=setInterval(()=>setHeroIdx(i=>(i+1)%HERO_IMGS.length),4800);return()=>clearInterval(t);},[]);

  const applyFilters=useCallback((opts={})=>{
    const s=opts.search??search,mn=opts.min??minP,mx=opts.max??maxP;
    const vs=opts.vibes??selVibes,ov=opts.verified??onlyVerified,sb=opts.sort??sortBy,md=opts.mode??mode;
    let res=LISTINGS.filter(l=>{
      if(s&&s!=="Near Me"&&!l.area.toLowerCase().includes(s.toLowerCase())&&!l.title.toLowerCase().includes(s.toLowerCase())&&!l.type.toLowerCase().includes(s.toLowerCase()))return false;
      if(mn&&l.price<parseInt(mn))return false; if(mx&&l.price>parseInt(mx))return false;
      if(ov&&!l.verified)return false;
      if(vs.length&&!vs.some(v=>l.vibe.includes(v)))return false;
      if(md==="student"&&!l.vibe.includes("student")&&l.price>300000)return false;
      if(md==="home"&&l.type==="Hostel")return false;
      if(md==="shared"&&!["Hostel","Shared Housing"].includes(l.type))return false;
      return true;
    });
    if(sb==="match")res.sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match);
    else if(sb==="price-asc")res.sort((a,b)=>a.price-b.price);
    else if(sb==="price-desc")res.sort((a,b)=>b.price-a.price);
    else if(sb==="confidence")res.sort((a,b)=>b.confidence-a.confidence);
    setFiltered(res);
  },[search,minP,maxP,selVibes,onlyVerified,sortBy,mode]);

  const doSearch=()=>{applyFilters();setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);};
  const toggleVibe=id=>{const nv=selVibes.includes(id)?selVibes.filter(v=>v!==id):[...selVibes,id];setSelVibes(nv);applyFilters({vibes:nv});};
  const clearAll=()=>{setMode(null);setSelVibes([]);setSearch("");setMinP("");setMaxP("");setOnlyVerified(false);setSortBy("match");setFiltered([...LISTINGS].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));};

  /* ── PAGE ROUTING ── */
  if(page==="referrals") return <ReferralDashboard config={config} onBack={()=>setPage("home")}/>;
  if(page==="dashboard") return <UserDashboard config={config} onBack={()=>setPage("home")} onViewListing={l=>{setPage("home");if(l.premium)setLandPayFor(LAND_LISTINGS[0]);}}/>;
  if(page==="admin") return <AdminDashboard config={config} setConfig={setConfig} onBack={()=>setPage("home")}/>;

  /* ── LAND PAGE ── */
  if(page==="land"){
    return(
      <div style={{minHeight:"100vh",background:C.mist}}>
        <nav style={{background:C.navy,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setPage("home")}>
            <div style={{width:34,height:34,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16}}>R</div>
            <span style={{fontWeight:900,fontSize:20,color:"#fff"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
          </div>
          <button onClick={()=>setPage("home")} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontSize:12}}>← Back to Rentals</button>
        </nav>
        {/* Hero */}
        <div style={{background:"linear-gradient(135deg,#0f1117,#1a2340)",padding:"40px 24px 32px",textAlign:"center"}}>
          <div style={{display:"inline-block",background:`${C.gold}22`,border:`1px solid ${C.gold}44`,borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:700,color:C.gold,marginBottom:14,letterSpacing:1}}>🌍 EXCLUSIVE LAND LISTINGS</div>
          <h1 style={{color:"#fff",fontWeight:900,fontSize:"clamp(1.8rem,5vw,3rem)",margin:"0 0 10px",letterSpacing:"-1px"}}>Discover Your Dream Property</h1>
          <div style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:18,padding:"20px 24px",maxWidth:460,margin:"20px auto",textAlign:"left"}}>
            <p style={{fontWeight:800,fontSize:14,color:"#fff",margin:"0 0 10px"}}>• Exclusive Land Listings •</p>
            {["✅ Proven Land Owners Only","✅ Premium Fee Required","⚠️ Limited Info: General Location & Amenities Only"].map(i=>(
              <p key={i} style={{fontSize:12,color:"rgba(255,255,255,.8)",margin:"4px 0"}}>{i}</p>
            ))}
            <button onClick={()=>setLandPayFor(LAND_LISTINGS[0])}
              style={{marginTop:12,width:"100%",background:C.gold,color:"#1a0a00",border:"none",borderRadius:12,padding:"12px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
              💳 Pay Premium Fee to Access Listings
            </button>
          </div>
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:10}}>
            {[["25K+","Verified Listings"],["400K+","Happy Clients"],["30+","Countries Covered"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}><p style={{fontWeight:900,fontSize:20,color:C.gold,margin:0}}>{n}</p><p style={{fontSize:11,color:"rgba(255,255,255,.6)",margin:0}}>{l}</p></div>
            ))}
          </div>
        </div>
        {/* Land Grid */}
        <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px"}}>
          <h2 style={{fontWeight:900,fontSize:22,margin:"0 0 18px"}}>Available Land Properties</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
            {LAND_LISTINGS.map(land=>(
              <div key={land.id} style={{background:"#fff",borderRadius:20,overflow:"hidden",border:`1.5px solid ${C.gold}44`,boxShadow:"0 2px 12px rgba(245,158,11,.1)"}}>
                <div style={{position:"relative"}}>
                  <img src={land.img} alt={land.title} style={{width:"100%",height:180,objectFit:"cover",display:"block"}}/>
                  <div style={{position:"absolute",inset:0,background:"rgba(15,23,42,.3)"}}/>
                  <div style={{position:"absolute",top:10,left:10}}><span style={{background:land.verified?C.gL:C.rL,color:land.verified?C.gD:C.rD,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:20}}>{land.verified?"✔ Verified":"⚠ Unverified"}</span></div>
                  <div style={{position:"absolute",bottom:10,right:10,background:"rgba(15,23,42,.85)",color:"#fff",fontWeight:800,fontSize:11,padding:"3px 10px",borderRadius:20}}>{fmtUGX(land.price)}</div>
                </div>
                <div style={{padding:"14px 16px"}}>
                  <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 3px"}}>{land.title}</p>
                  <p style={{color:C.ts,fontSize:12,margin:"0 0 8px"}}>📍 {land.area}</p>
                  <div style={{background:C.mist,borderRadius:10,padding:"8px 10px",fontSize:11,color:C.n3,marginBottom:10}}>
                    🔒 <strong>Limited Info:</strong> {land.info}
                  </div>
                  <div style={{background:C.goldL,borderRadius:10,padding:"7px 10px",fontSize:11,color:C.yD,marginBottom:12}}>
                    💎 Premium fee to unlock full details: <strong>{fmtUGX(land.premiumFee)}</strong>
                  </div>
                  <button onClick={()=>setLandPayFor(land)}
                    style={{width:"100%",background:`linear-gradient(135deg,${C.gold},#D97706)`,color:"#1a0a00",border:"none",borderRadius:12,padding:"11px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>
                    🌍 Interested — Pay {fmtUGX(land.premiumFee)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {landPayFor&&<LandPayModal land={landPayFor} config={config} onClose={()=>setLandPayFor(null)}/>}
      </div>
    );
  }

  /* ══════════════════════ HOME PAGE ══════════════════════════ */
  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:C.mist,minHeight:"100vh",color:C.navy,paddingBottom:72}}>

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:200,background:"rgba(248,250,252,.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 20px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16}}>R</div>
            <span style={{fontWeight:900,fontSize:20,letterSpacing:"-.5px"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {[["Home","home"],["Listings","listings"],["Referrals","referrals"],["Help","help"]].map(([lb,id])=>(
              <button key={id} onClick={()=>{if(id==="home")window.scrollTo({top:0,behavior:"smooth"});else if(id==="referrals")setPage("referrals");else document.getElementById(id+"-section")?.scrollIntoView({behavior:"smooth"});}}
                style={{background:"transparent",color:C.n3,border:"none",borderRadius:18,padding:"5px 12px",fontWeight:600,fontSize:13,cursor:"pointer"}}>{lb}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPage("land")} style={{background:`linear-gradient(135deg,${C.gold},#D97706)`,color:"#1a0a00",border:"none",borderRadius:18,padding:"8px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}}>🌍 Premium Land</button>
            <button onClick={()=>setPage("land")} style={{background:C.blue,color:"#fff",border:"none",borderRadius:18,padding:"8px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}}>🏘 Buy Property</button>
            <button onClick={()=>setPage("dashboard")} style={{background:C.navy,color:"#fff",border:"none",borderRadius:18,padding:"8px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}}>👤 Dashboard</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{position:"relative",height:"92vh",overflow:"hidden"}}>
        {HERO_IMGS.map((img,i)=>(
          <div key={i} style={{position:"absolute",inset:0,transition:"opacity 1.4s",opacity:i===heroIdx?1:0}}>
            <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
        ))}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(15,23,42,.76) 0%,rgba(15,23,42,.5) 55%,rgba(15,23,42,.7) 100%)"}}/>
        <div style={{position:"absolute",top:"10%",right:"7%",width:180,height:180,background:C.green+"14",borderRadius:"50%",filter:"blur(70px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"15%",left:"4%",width:160,height:160,background:C.blue+"14",borderRadius:"50%",filter:"blur(55px)",pointerEvents:"none"}}/>

        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 20px 0"}}>
          <div style={{textAlign:"center",color:"#fff",maxWidth:740,marginBottom:20}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(34,197,94,.2)",border:"1px solid rgba(34,197,94,.4)",borderRadius:20,padding:"5px 16px",fontSize:11,fontWeight:700,color:"#86EFAC",marginBottom:16,letterSpacing:1}}>
              🏆 Uganda's #1 Verified Rental & Property Marketplace
            </div>
            <h1 style={{margin:"0 0 12px",fontSize:"clamp(1.9rem,5.5vw,3.5rem)",fontWeight:900,lineHeight:1.08,letterSpacing:"-1.5px"}}>
              Find Your <span style={{color:C.green}}>Safe,</span><br/><span style={{color:C.blue}}>Verified</span> Home in Uganda
            </h1>
            <p style={{fontSize:15,opacity:.8,margin:"0 0 14px",lineHeight:1.5}}>Rentals · Land · Property — GPS-confirmed, zero brokers, contact protection</p>

            {/* Mode buttons */}
            <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
              {MODES.map(m=>(
                <button key={m.id} onClick={()=>{setMode(m.id);applyFilters({mode:m.id});setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);}}
                  style={{background:mode===m.id?"rgba(255,255,255,.97)":"rgba(255,255,255,.1)",color:mode===m.id?C.navy:"#fff",border:mode===m.id?`2px solid ${C.green}`:"1.5px solid rgba(255,255,255,.22)",borderRadius:13,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer",backdropFilter:"blur(8px)",transition:"all .18s"}}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{background:"rgba(255,255,255,.97)",borderRadius:22,padding:"18px 20px",width:"100%",maxWidth:680,boxShadow:"0 24px 60px rgba(0,0,0,.28)"}}>
            <p style={{fontSize:10,fontWeight:800,color:C.ts,margin:"0 0 8px",letterSpacing:1.5,textTransform:"uppercase"}}>Find Verified Homes Near You</p>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()}
                placeholder="Area, type, lifestyle — e.g. 'quiet room Ntinda'"
                style={{flex:1,padding:"10px 13px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(()=>{setSearch("Near Me");doSearch();},()=>{})}}}
                style={{background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"10px 14px",fontWeight:700,cursor:"pointer",fontSize:11,whiteSpace:"nowrap"}}>📍 Near Me</button>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <input value={minP} onChange={e=>setMinP(e.target.value)} placeholder="Min (UGX)"
                style={{flex:1,minWidth:90,padding:"8px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
              <input value={maxP} onChange={e=>setMaxP(e.target.value)} placeholder="Max (UGX)"
                style={{flex:1,minWidth:90,padding:"8px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
              <label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:700,color:C.gD,cursor:"pointer",whiteSpace:"nowrap"}}>
                <input type="checkbox" checked={onlyVerified} onChange={e=>{setOnlyVerified(e.target.checked);applyFilters({verified:e.target.checked});}} style={{accentColor:C.green}}/>✔ Verified
              </label>
            </div>
            <button onClick={doSearch} style={{width:"100%",background:`linear-gradient(135deg,${C.green},${C.blue})`,color:"#fff",border:"none",borderRadius:12,padding:"12px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>Search Rentals 🔍</button>
          </div>

          <div style={{marginTop:16,display:"flex",gap:6}}>
            {HERO_IMGS.map((_,i)=>(
              <button key={i} onClick={()=>setHeroIdx(i)} style={{width:i===heroIdx?26:7,height:7,background:i===heroIdx?C.green:"rgba(255,255,255,.35)",border:"none",borderRadius:4,cursor:"pointer",transition:"all .3s",padding:0}}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div style={{background:C.navy,padding:"13px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:8}}>
          {[["🟢","Verified Listings"],["📍","GPS Confirmed"],["🔒","Contact Protected"],["📸","Real Photos"],["💰","Zero Broker Fees"],["🛡️","AI Fraud Detection"]].map(([ic,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:15}}>{ic}</span><span style={{color:"#fff",fontWeight:600,fontSize:11}}>{lb}</span></div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{background:C.gL,padding:"14px 24px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:10}}>
          {[["500+","Listings"],["2,400+","Tenants"],["98%","Verified"],[fmtUGX(config.referralPayout),"Referral Earn"],["4.7★","Rating"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><p style={{fontWeight:900,fontSize:19,color:C.gD,margin:0}}>{n}</p><p style={{fontSize:10,color:C.gD,opacity:.7,margin:0}}>{l}</p></div>
          ))}
        </div>
      </div>

      {/* ── PREMIUM SECTION CTA ── */}
      <div style={{background:"linear-gradient(135deg,#1a2340,#0f1117)",padding:"28px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"center"}}>
          <div>
            <p style={{color:C.gold,fontWeight:900,fontSize:"clamp(1rem,3vw,1.4rem)",margin:"0 0 6px"}}>🌍 Buy Land & Property in Uganda</p>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:13,margin:"0 0 14px",lineHeight:1.5}}>Exclusive verified land listings. Proven owners only. Premium access reveals full owner contact + GPS location.</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>setPage("land")} style={{background:C.gold,color:"#1a0a00",border:"none",borderRadius:12,padding:"10px 20px",fontWeight:800,fontSize:13,cursor:"pointer"}}>💎 Premium Land Access</button>
              <button onClick={()=>setPage("land")} style={{background:C.blue,color:"#fff",border:"none",borderRadius:12,padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer"}}>🏘 Buy Property</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {LAND_LISTINGS.slice(0,2).map(land=>(
              <div key={land.id} style={{background:"rgba(255,255,255,.06)",borderRadius:14,overflow:"hidden",border:"1px solid rgba(245,158,11,.2)",cursor:"pointer"}} onClick={()=>setPage("land")}>
                <img src={land.img} alt={land.title} style={{width:"100%",height:80,objectFit:"cover",display:"block",filter:"brightness(.7)"}}/>
                <div style={{padding:"8px 10px"}}>
                  <p style={{color:"#fff",fontWeight:700,fontSize:10,margin:"0 0 2px"}}>{land.title}</p>
                  <p style={{color:C.gold,fontSize:10,fontWeight:700,margin:0}}>{fmtUGX(land.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ATMOSPHERE ── */}
      <div id="listings-section" style={{maxWidth:1140,margin:"0 auto",padding:"32px 24px 0"}}>
        <h2 style={{fontWeight:900,fontSize:21,margin:"0 0 5px"}}>🌿 Atmosphere Mode</h2>
        <p style={{color:C.ts,margin:"0 0 12px",fontSize:12}}>Choose your lifestyle vibe</p>
        <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
          {VIBES.map(v=>(
            <button key={v.id} onClick={()=>toggleVibe(v.id)}
              style={{background:selVibes.includes(v.id)?C.navy:"#fff",color:selVibes.includes(v.id)?"#fff":C.navy,border:`1.5px solid ${selVibes.includes(v.id)?C.navy:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .18s"}}>
              {v.icon} {v.label}
            </button>
          ))}
          {selVibes.length>0&&<button onClick={()=>{setSelVibes([]);applyFilters({vibes:[]});}} style={{background:C.rL,color:C.rD,border:"none",borderRadius:20,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✕ Clear</button>}
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <div ref={listRef} style={{maxWidth:1140,margin:"0 auto",padding:"22px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:14}}>
          <div>
            <h2 style={{fontWeight:900,fontSize:22,margin:0}}>{filtered.length} Rentals</h2>
            <p style={{color:C.ts,margin:"2px 0 0",fontSize:11}}>Fee: {fmtUGX(config.viewingFee)} to unlock contact · Boosted first</p>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <select value={sortBy} onChange={e=>{setSortBy(e.target.value);applyFilters({sort:e.target.value});}}
              style={{padding:"7px 11px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
              <option value="match">⚡ Best Match</option>
              <option value="confidence">🛡️ Trust Score</option>
              <option value="price-asc">💰 Price ↑</option>
              <option value="price-desc">💎 Price ↓</option>
            </select>
            {(mode||selVibes.length||search||minP||maxP||onlyVerified)&&
              <button onClick={clearAll} style={{background:C.rL,color:C.rD,border:"none",borderRadius:10,padding:"7px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>✕ Clear</button>}
          </div>
        </div>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"48px 20px",background:"#fff",borderRadius:20,border:`1px solid ${C.border}`}}>
            <p style={{fontSize:44,margin:"0 0 10px"}}>🔍</p>
            <p style={{fontWeight:800,fontSize:17,color:C.navy,margin:0}}>No listings match</p>
            <p style={{color:C.ts,margin:"6px 0 0"}}>Try clearing filters or asking the AI</p>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:18}}>
            {filtered.map(l=><ListingCard key={l.id} l={l} config={config} onView={l=>setPayingFor(l)}/>)}
          </div>
        )}
      </div>

      {/* ── REFERRAL BANNER ── */}
      <div id="referrals-section" style={{background:"linear-gradient(135deg,#0F172A,#0a2315)",padding:"42px 24px"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:38,margin:"0 0 8px"}}>🔁</p>
          <h2 style={{color:"#fff",fontWeight:900,fontSize:24,margin:"0 0 8px"}}>Earn {fmtUGX(config.referralPayout)} Per Referral</h2>
          <p style={{color:C.tt,fontSize:13,margin:"0 0 20px"}}>Your friend pays the {fmtUGX(config.viewingFee)} viewing fee → you earn {fmtUGX(config.referralPayout)} via MoMo. No limits.</p>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",justifyContent:"center"}}>
            <button onClick={()=>setPage("referrals")} style={{background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontWeight:800,cursor:"pointer",fontSize:14}}>📊 Open Referral Dashboard</button>
            <div style={{background:"rgba(255,255,255,.08)",color:"#fff",borderRadius:12,padding:"12px 16px",fontSize:13,fontWeight:700,border:"1px solid rgba(255,255,255,.15)"}}>🔗 rentright.ug/ref/bonny123</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["👩‍💼 Sarah: UGX 80K in 1 week","🧑‍🎓 Mark: 12 friends","💰 Top: UGX 400K/mo"].map(t=>(
              <span key={t} style={{background:`${C.green}20`,color:"#86EFAC",padding:"4px 12px",borderRadius:20,fontSize:11}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALERTS ── */}
      <div style={{background:`linear-gradient(135deg,${C.n2},${C.navy})`,padding:"38px 24px"}}>
        <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:30,margin:"0 0 8px"}}>🔔</p>
          <h2 style={{color:"#fff",fontWeight:900,fontSize:21,margin:"0 0 6px"}}>Smart Alerts</h2>
          <p style={{color:C.tt,fontSize:12,margin:"0 0 16px"}}>Get notified when listings match your budget or prices drop.</p>
          <div style={{display:"flex",gap:10}}>
            <input value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="Phone or email"
              style={{flex:1,padding:"10px 13px",borderRadius:11,border:"none",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>{if(alertEmail){setAlertSent(true);setTimeout(()=>setAlertSent(false),3000);}}}
              style={{background:C.green,color:"#fff",border:"none",borderRadius:11,padding:"10px 16px",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontSize:13}}>
              {alertSent?"✅ Set!":"🔔 Alert Me"}
            </button>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="help-section" style={{maxWidth:1140,margin:"0 auto",padding:"42px 24px"}}>
        <h2 style={{fontWeight:900,fontSize:22,textAlign:"center",margin:"0 0 5px"}}>How RentRight! Works</h2>
        <p style={{textAlign:"center",color:C.ts,margin:"0 0 28px",fontSize:12}}>Search → Verify → Pay → Move In</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
          {[{n:"01",ic:"🔍",t:"Search",d:"Filter by area, budget, vibe. GPS for instant nearby results.",c:C.bL,a:C.blue},
            {n:"02",ic:"🛡️",t:"Check Score",d:"Living Environment Score + Confidence Meter on every listing.",c:C.gL,a:C.gD},
            {n:"03",ic:"💳",t:"Pay & Unlock",d:`Pay ${fmtUGX(config.viewingFee)} via MoMo. Contact unlocked immediately.`,c:"#FEF9C3",a:C.yD},
            {n:"04",ic:"🏠",t:"Move In Safely",d:"Inspect before paying rent. Our no-scam guarantee protects you.",c:C.rL,a:C.rD}].map(s=>(
            <div key={s.n} style={{background:"#fff",borderRadius:18,padding:"18px 16px",border:`1.5px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:8,right:12,fontWeight:900,fontSize:44,color:`${s.a}10`,lineHeight:1}}>{s.n}</div>
              <div style={{width:40,height:40,background:s.c,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,marginBottom:10}}>{s.ic}</div>
              <p style={{fontWeight:800,fontSize:13,margin:"0 0 4px",color:C.navy}}>{s.t}</p>
              <p style={{color:C.ts,fontSize:11,lineHeight:1.5,margin:0}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{background:C.navy,color:"#fff",padding:"38px 24px 20px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:22,marginBottom:26}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                <div style={{width:28,height:28,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13}}>R</div>
                <span style={{fontWeight:900,fontSize:16}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
              </div>
              <p style={{color:C.tt,fontSize:11,lineHeight:1.6,margin:"0 0 10px"}}>Uganda's verified rental & property marketplace. Zero brokers, GPS-confirmed listings.</p>
              <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",background:"#25D366",color:"#fff",padding:"5px 12px",borderRadius:18,fontSize:11,fontWeight:700,textDecoration:"none"}}>💬 WhatsApp</a>
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 8px"}}>Explore</p>
              {["Browse Rentals","Buy Land / Property","Student Hostels","Post a Property","Referral Program"].map(l=>(
                <p key={l} onClick={l.includes("Land")||l.includes("Buy")?()=>setPage("land"):l.includes("Referral")?()=>setPage("referrals"):undefined}
                  style={{color:C.tt,fontSize:11,margin:"0 0 5px",cursor:"pointer"}}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 8px"}}>Popular Areas</p>
              {["Makerere","Ntinda","Kisaasi","Wandegeya","Bukoto","Naguru"].map(a=>(
                <p key={a} onClick={()=>{setSearch(a);doSearch();}} style={{color:C.tt,fontSize:11,margin:"0 0 5px",cursor:"pointer"}}>📍 {a}</p>
              ))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 8px"}}>Account</p>
              {[["My Dashboard",()=>setPage("dashboard")],["My Referrals",()=>setPage("referrals")],["Admin Panel",()=>setPage("admin")]].map(([lb,fn])=>(
                <p key={lb} onClick={fn} style={{color:C.tt,fontSize:11,margin:"0 0 5px",cursor:"pointer"}}>{lb}</p>
              ))}
              <div style={{marginTop:12,background:"rgba(248,113,113,.12)",borderRadius:9,padding:"9px 11px",fontSize:10,color:"#fca5a5",lineHeight:1.6,border:"1px solid rgba(248,113,113,.2)"}}>
                🛡️ RentRight! is an intermediary platform. Never pay rent before viewing.
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #1e293b",paddingTop:12,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
            <p style={{color:"#475569",fontSize:10,margin:0}}>© 2025 RentRight! Uganda. Intermediary platform — not liable for tenant–landlord disputes.</p>
            <div style={{display:"flex",gap:10}}>
              {["Privacy","Terms","Commission Policy","Report"].map(l=>(
                <span key={l} style={{color:"#475569",fontSize:10,cursor:"pointer"}}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── FIXED BOTTOM ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(248,250,252,.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,padding:"9px 16px",display:"flex",gap:8,zIndex:300}}>
        <button onClick={()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(()=>{setSearch("Near Me");doSearch();},()=>{})}}}
          style={{flex:2,background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"10px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>📍 Find Near Me</button>
        <button onClick={()=>setPage("referrals")} style={{flex:1.5,background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"10px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>🔁 Earn</button>
        <button onClick={()=>setChatOpen(o=>!o)} style={{flex:1,background:C.blue,color:"#fff",border:"none",borderRadius:12,padding:"10px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>🤖</button>
      </div>

      {/* ── FLOATING WA ── */}
      <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer"
        style={{position:"fixed",bottom:78,right:18,background:"#25D366",color:"#fff",width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 18px rgba(37,211,102,.4)",zIndex:500,textDecoration:"none"}}>
        💬
      </a>

      {/* ── AI CHAT ── */}
      {chatOpen&&(
        <div style={{position:"fixed",bottom:86,right:18,width:310,background:"#fff",borderRadius:20,boxShadow:"0 20px 55px rgba(15,23,42,.2)",border:`1px solid ${C.border}`,zIndex:998,overflow:"hidden"}}>
          <div style={{background:C.navy,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:26,height:26,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🤖</div>
              <div><p style={{color:"#fff",fontWeight:700,fontSize:12,margin:0}}>RentRight AI</p><p style={{color:C.tt,fontSize:9,margin:0}}>Housing Assistant</p></div>
            </div>
            <button onClick={()=>setChatOpen(false)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:17}}>×</button>
          </div>
          <div style={{padding:"12px 14px"}}>
            <div style={{background:C.mist,borderRadius:12,padding:"10px 12px",fontSize:11,color:C.navy,lineHeight:1.5,marginBottom:10}}>
              Hi! Tell me your budget and area. I'll find verified homes matching your lifestyle.
            </div>
            <div style={{display:"flex",gap:6}}>
              <input placeholder="Ask about rentals…" style={{flex:1,padding:"8px 11px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:11,outline:"none",fontFamily:"inherit"}}/>
              <button style={{background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"8px 11px",fontSize:12,cursor:"pointer",fontWeight:700}}>↑</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {payingFor&&<ViewingPayModal listing={payingFor} config={config} referrer="ref123" onClose={()=>setPayingFor(null)} onSuccess={()=>{setPayingFor(null);setTimeout(()=>setPostViewing(LISTINGS[0]),1000);}}/>}
      {postViewing&&<PostViewingModal listing={postViewing} onClose={()=>setPostViewing(null)}/>}
      {landPayFor&&<LandPayModal land={landPayFor} config={config} onClose={()=>setLandPayFor(null)}/>}
    </div>
  );
}
