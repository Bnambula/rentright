import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   BRAND TOKENS
═══════════════════════════════════════════════════════════ */
const C = {
  green:"#22C55E", gL:"#DCFCE7", gD:"#15803D",
  blue:"#38BDF8",  bL:"#E0F2FE", bD:"#0369A1",
  yellow:"#FDE68A",yD:"#78350F",
  red:"#F87171",   rL:"#FEE2E2", rD:"#991B1B",
  navy:"#0F172A",  n2:"#1E293B", n3:"#334155",
  mist:"#F8FAFC",  border:"#E2E8F0",
  ts:"#64748B",    tt:"#94A3B8",
  purple:"#7C3AED",pL:"#EDE9FE",pD:"#5B21B6",
  gold:"#F59E0B",  goldL:"#FEF3C7",
};

/* ═══════════════════════════════════════════════════════════
   LISTINGS DATA
═══════════════════════════════════════════════════════════ */
const LISTINGS = [
  { id:1, title:"Tranquil Studio, Bukoto", area:"Bukoto", price:420000, type:"Self-Contained",
    vibe:["quiet","secure"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.9, reviews:44, match:94, boosted:true, contactLocked:true,
    living:{safety:9.2,clean:8.8,access:9.0,noise:"Very Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Security","Parking","DSTV"], confidence:98,
    desc:"A calm, well-ventilated studio in Bukoto — ideal for a professional or couple. Quiet neighborhood, supermarket 5 min walk, easy taxi access.",
    landlord:"Sarah B.", phone:"07XX XXX XXX", wa:"256700000005",
    img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80",
    referrals:19, nearby:{taxi:"3 min",market:"5 min",campus:"20 min"},
    areaPrice:{min:380000,max:580000}, viewingFee:5000, commission:0.05,
    views:312, inquiries:24 },
  { id:2, title:"Bright Double Room, Kisaasi", area:"Kisaasi", price:350000, type:"Double Room",
    vibe:["city","student"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.7, reviews:31, match:88, boosted:false, contactLocked:true,
    living:{safety:8.0,clean:8.5,access:9.5,noise:"Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Compound"], confidence:91,
    desc:"Bright, well-maintained double room steps from the main road. Excellent transport access — perfect for city workers.",
    landlord:"Grace N.", phone:"07XX XXX XXX", wa:"256700000002",
    img:"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=700&q=80",
    referrals:8, nearby:{taxi:"1 min",market:"8 min",campus:"15 min"},
    areaPrice:{min:280000,max:430000}, viewingFee:3000, commission:0.05,
    views:198, inquiries:15 },
  { id:3, title:"Student Hostel, Wandegeya", area:"Wandegeya", price:175000, type:"Hostel",
    vibe:["student","budget"], verified:true, photos:true, gps:false, priceOk:true,
    rating:4.3, reviews:62, match:91, boosted:true, contactLocked:false,
    living:{safety:7.5,clean:7.0,access:9.8,noise:"Moderate"}, moveIn:"ready",
    amenities:["WiFi","Security","Near Campus"], confidence:84,
    desc:"Affordable hostel 2 mins from Makerere University. Vibrant student community, reliable WiFi, shared kitchen.",
    landlord:"Hostel Admin", phone:"0714 123 456", wa:"256700000003",
    img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80",
    referrals:29, nearby:{taxi:"2 min",market:"4 min",campus:"2 min"},
    areaPrice:{min:150000,max:220000}, viewingFee:2000, commission:0.03,
    views:421, inquiries:38 },
  { id:4, title:"Spacious Single Room, Ntinda", area:"Ntinda", price:280000, type:"Single Room",
    vibe:["quiet","family"], verified:false, photos:true, gps:false, priceOk:false,
    rating:4.1, reviews:18, match:72, boosted:false, contactLocked:true,
    living:{safety:7.0,clean:7.5,access:8.0,noise:"Low"}, moveIn:"viewing",
    amenities:["Water","Compound","Parking"], confidence:52,
    desc:"Spacious single room in a family compound. Peaceful area but awaiting full verification — proceed with caution.",
    landlord:"Peter M.", phone:"07XX XXX XXX", wa:"256700000004",
    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80",
    referrals:5, nearby:{taxi:"7 min",market:"12 min",campus:"25 min"},
    areaPrice:{min:240000,max:380000}, viewingFee:2000, commission:0.05,
    views:87, inquiries:6 },
  { id:5, title:"Modern Bedsitter, Makerere", area:"Makerere", price:240000, type:"Single Room",
    vibe:["student","budget"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.5, reviews:27, match:89, boosted:false, contactLocked:true,
    living:{safety:8.0,clean:8.2,access:9.2,noise:"Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Security"], confidence:93,
    desc:"Neat, modern bedsitter near Makerere campus. Quiet zone, reliable electricity, walking distance to shops.",
    landlord:"James K.", phone:"07XX XXX XXX", wa:"256700000001",
    img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
    referrals:12, nearby:{taxi:"4 min",market:"6 min",campus:"5 min"},
    areaPrice:{min:200000,max:300000}, viewingFee:2000, commission:0.05,
    views:244, inquiries:19 },
  { id:6, title:"Executive 2BR, Naguru", area:"Naguru", price:850000, type:"Self-Contained",
    vibe:["secure","quiet"], verified:true, photos:true, gps:true, priceOk:true,
    rating:4.8, reviews:22, match:78, boosted:true, contactLocked:true,
    living:{safety:9.5,clean:9.0,access:8.5,noise:"Very Low"}, moveIn:"ready",
    amenities:["WiFi","Water","Security","Parking","DSTV","Generator"], confidence:97,
    desc:"Executive 2-bedroom in the quiet hills of Naguru. High-security estate, panoramic views, premium finishes.",
    landlord:"David R.", phone:"07XX XXX XXX", wa:"256700000006",
    img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",
    referrals:7, nearby:{taxi:"10 min",market:"8 min",campus:"30 min"},
    areaPrice:{min:700000,max:1200000}, viewingFee:10000, commission:0.05,
    views:156, inquiries:11 },
];

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1400&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
];

const MODES = [{id:"student",icon:"🎓",label:"I'm a Student"},{id:"home",icon:"🏡",label:"I want a Home"},{id:"shared",icon:"🤝",label:"Shared Housing"}];
const VIBES = [{id:"quiet",icon:"🌿",label:"Quiet & Peaceful"},{id:"city",icon:"🚶",label:"City Access"},{id:"student",icon:"🎓",label:"Student-Friendly"},{id:"secure",icon:"🛡️",label:"High Security"},{id:"budget",icon:"💸",label:"Budget First"},{id:"family",icon:"🏡",label:"Family Areas"}];
const AMICONS = {WiFi:"📶",Water:"💧",Security:"🔒",Parking:"🅿️",DSTV:"📺",Compound:"🌿","Near Campus":"🎓",Generator:"⚡"};

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const lc = s => s>=8.5?C.green:s>=7?C.blue:C.yellow;
const ll = s => s>=8.5?"Excellent":s>=7?"Good":"Fair";
const miInfo = m => m==="ready"?{bg:C.gL,color:C.gD,icon:"🟢",label:"Move-in Ready"}:m==="viewing"?{bg:"#FEF9C3",color:"#854D0E",icon:"🟡",label:"Needs Viewing"}:{bg:C.rL,color:C.rD,icon:"🔴",label:"Renovation"};
const confCol = s => s>=85?C.green:s>=65?C.blue:s>=40?C.gold:C.red;
const confLbl = s => s>=85?"High Trust":s>=65?"Moderate":s>=40?"Low":"High Risk";
const avgScore = l => +((l.living.safety+l.living.clean+l.living.access)/3).toFixed(1);

/* ═══════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════ */
function ScoreRing({score,size=54}){
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

function TrustMeter({score}){
  const col=confCol(score);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,fontWeight:700,color:C.navy}}>🛡️ Confidence Score</span>
        <span style={{fontSize:11,fontWeight:800,color:col}}>{score}% · {confLbl(score)}</span>
      </div>
      <div style={{background:C.border,borderRadius:10,height:7,overflow:"hidden"}}>
        <div style={{width:`${score}%`,height:"100%",background:`linear-gradient(90deg,${col},${col}bb)`,borderRadius:10}}/>
      </div>
    </div>
  );
}

function Pill({children,bg,color,style={}}){
  return <span style={{background:bg,color,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,...style}}>{children}</span>;
}

/* ═══════════════════════════════════════════════════════════
   BOOKING MODAL  (4 steps: details → agreement → payment → confirm)
═══════════════════════════════════════════════════════════ */
function BookingModal({l,onClose}){
  const [step,setStep]=useState(1);
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [date,setDate]=useState("");
  const [agreed,setAgreed]=useState(false);
  const [momo,setMomo]=useState(""); const [paying,setPaying]=useState(false); const [paid,setPaid]=useState(false);
  const txn = useRef("TXN-"+Math.random().toString(36).slice(2,10).toUpperCase());

  const pay = () => {
    if(momo.length<10)return;
    setPaying(true);
    setTimeout(()=>{setPaying(false);setPaid(true);},2200);
  };

  const steps=["Details","Agreement","Payment","Confirmed"];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(5px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:460,boxShadow:"0 40px 90px rgba(0,0,0,.32)",overflow:"hidden"}}>
        {/* header */}
        <div style={{background:C.navy,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:15,margin:0}}>Book a Viewing</p><p style={{color:C.tt,fontSize:11,margin:0}}>{l.title}</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        {/* step bar */}
        <div style={{display:"flex",background:C.mist,borderBottom:`1px solid ${C.border}`}}>
          {steps.map((s,i)=>(
            <div key={s} style={{flex:1,padding:"9px 0",textAlign:"center",fontSize:10,fontWeight:700,
              color:step===i+1?C.blue:step>i+1?C.green:C.ts,
              borderBottom:`2.5px solid ${step===i+1?C.blue:step>i+1?C.green:"transparent"}`}}>
              {step>i+1?"✓ ":""}{s}
            </div>
          ))}
        </div>
        <div style={{padding:"22px 24px"}}>

          {/* STEP 1 */}
          {step===1&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 14px"}}>Your Details</p>
              {[["Full name *",name,setName,"text","e.g. Aisha Nakato"],["Phone number *",phone,setPhone,"tel","e.g. 0771 234 567"],].map(([lb,val,set,tp,ph])=>(
                <div key={lb} style={{marginBottom:10}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                  <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={tp}
                    style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:14,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Preferred viewing date *</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:14,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
              </div>
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"10px 14px",fontSize:12,color:C.yD,marginBottom:14,lineHeight:1.5}}>
                💡 <strong>Viewing fee:</strong> UGX {l.viewingFee.toLocaleString()} (non-refundable). This fee filters out time-wasters and ensures landlords take your inquiry seriously.
              </div>
              <button disabled={!name||!phone||!date} onClick={()=>setStep(2)}
                style={{width:"100%",background:name&&phone&&date?C.navy:"#e2e8f0",color:name&&phone&&date?"#fff":C.ts,border:"none",borderRadius:14,padding:"13px 0",fontWeight:700,cursor:"pointer",fontSize:14}}>
                Next → Read Agreement
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step===2&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>Tenant Booking Agreement</p>
              <div style={{background:C.mist,borderRadius:14,padding:"14px 16px",fontSize:11,lineHeight:1.8,color:C.n3,maxHeight:190,overflowY:"auto",border:`1px solid ${C.border}`,marginBottom:14}}>
                <strong>RentRight! Tenant Booking Terms</strong><br/><br/>
                By confirming this booking, <strong>{name}</strong> agrees to the following:<br/><br/>
                1. The viewing fee of <strong>UGX {l.viewingFee.toLocaleString()}</strong> is non-refundable once payment is processed.<br/>
                2. <strong>RentRight! is a listing and matching platform only.</strong> We do not own, manage, or guarantee any property listed on this platform.<br/>
                3. You must physically inspect the property before making any rental payment to the landlord.<br/>
                4. Never transfer rent without a signed written tenancy agreement with the landlord.<br/>
                5. Landlord contact details are only revealed after successful viewing fee payment.<br/>
                6. Report any discrepancy between the listing and actual property immediately via the Report function.<br/>
                7. Your IP address, device ID, and this timestamp ({new Date().toLocaleString()}) are recorded as proof of agreement.<br/><br/>
                <em>⚠️ RentRight! is not liable for any disputes arising between tenant and landlord. This platform serves as an intermediary only.</em>
              </div>
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:16}}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.green,width:16,height:16,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.n3,lineHeight:1.5}}>I, <strong>{name}</strong>, confirm I have read and accept the RentRight! Booking Terms in full.</span>
              </label>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(1)} style={{flex:1,background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 0",fontWeight:600,cursor:"pointer",fontSize:13}}>← Back</button>
                <button disabled={!agreed} onClick={()=>setStep(3)}
                  style={{flex:2,background:agreed?C.green:"#e2e8f0",color:agreed?"#fff":C.ts,border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,cursor:agreed?"pointer":"default",fontSize:14}}>
                  I Agree → Pay UGX {l.viewingFee.toLocaleString()}
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step===3&&(
            <>
              {!paid?(
                <>
                  <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 4px"}}>Secure Payment</p>
                  <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Amount: <strong style={{color:C.navy}}>UGX {l.viewingFee.toLocaleString()}</strong></p>
                  {/* MTN */}
                  <div style={{background:"linear-gradient(135deg,#FFD700,#F59E0B)",borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:28}}>📱</div>
                    <div><p style={{fontWeight:800,fontSize:14,color:"#1a0a00",margin:0}}>MTN Mobile Money</p><p style={{fontSize:11,color:"#3d2200",margin:0}}>Instant, secure, Uganda-optimised</p></div>
                  </div>
                  <div style={{background:"linear-gradient(135deg,#e8f4fd,#dbeafe)",borderRadius:14,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:22}}>📲</div>
                    <div><p style={{fontWeight:700,fontSize:13,color:C.bD,margin:0}}>Airtel Money also accepted</p><p style={{fontSize:11,color:C.ts,margin:0}}>Contact support for Airtel payment flow</p></div>
                  </div>
                  <input value={momo} onChange={e=>setMomo(e.target.value)} placeholder="Enter MTN MoMo number (e.g. 0771 234 567)"
                    style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:14,marginBottom:10,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
                  <div style={{background:C.rL,borderRadius:10,padding:"8px 12px",fontSize:11,color:C.rD,marginBottom:14}}>
                    🔒 Your contact details are protected. Landlord's phone is revealed only after payment confirmation.
                  </div>
                  <button onClick={pay} disabled={paying||momo.length<10}
                    style={{width:"100%",background:momo.length>=10&&!paying?"#F59E0B":"#e2e8f0",color:momo.length>=10||paying?"#1a0a00":C.ts,border:"none",borderRadius:14,padding:"13px 0",fontWeight:800,cursor:momo.length>=10&&!paying?"pointer":"default",fontSize:15}}>
                    {paying?"Processing payment…":"💳 Pay UGX "+l.viewingFee.toLocaleString()}
                  </button>
                  <button onClick={()=>setStep(2)} style={{width:"100%",background:"none",border:"none",color:C.ts,cursor:"pointer",marginTop:8,fontSize:12}}>← Back</button>
                </>
              ):(
                <div style={{textAlign:"center",padding:"10px 0"}}>
                  <div style={{fontSize:56,marginBottom:10}}>✅</div>
                  <p style={{fontWeight:900,fontSize:18,color:C.gD,margin:"0 0 4px"}}>Payment Confirmed!</p>
                  <p style={{fontSize:12,color:C.ts,margin:"0 0 16px"}}>Transaction ID: <strong>{txn.current}</strong></p>
                  <button onClick={()=>setStep(4)} style={{background:C.green,color:"#fff",border:"none",borderRadius:14,padding:"12px 28px",fontWeight:700,cursor:"pointer",fontSize:14}}>View Confirmation →</button>
                </div>
              )}
            </>
          )}

          {/* STEP 4 */}
          {step===4&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:44,marginBottom:10}}>🏠</div>
              <p style={{fontWeight:900,fontSize:18,color:C.navy,margin:"0 0 14px"}}>Viewing Booked!</p>
              <div style={{background:C.gL,borderRadius:14,padding:"14px 16px",marginBottom:12,textAlign:"left",fontSize:12,lineHeight:1.8}}>
                <p style={{fontWeight:700,color:C.gD,margin:"0 0 6px"}}>✅ Booking Confirmation</p>
                <p style={{margin:0,color:C.n3}}>
                  <strong>Name:</strong> {name}<br/>
                  <strong>Property:</strong> {l.title}<br/>
                  <strong>Date:</strong> {date}<br/>
                  <strong>Your phone:</strong> {phone}<br/>
                  <strong>Fee paid:</strong> UGX {l.viewingFee.toLocaleString()}<br/>
                  <strong>Txn ID:</strong> {txn.current}<br/>
                  <strong>Landlord:</strong> {l.landlord} · {l.phone.includes("X")?"🔓 "+l.phone.replace(/X/g,"*")+" (now revealed)":l.phone}<br/>
                  <strong>Commission:</strong> UGX {Math.round(l.price*l.commission).toLocaleString()} due to RentRight! on successful rental.
                </p>
              </div>
              <p style={{fontSize:11,color:C.ts,margin:"0 0 14px"}}>The landlord will contact you to confirm viewing time. Please arrive 5 mins early and inspect thoroughly before agreeing to rent.</p>
              <a href={`https://wa.me/${l.wa}?text=Hi ${l.landlord}! I've booked a viewing for "${l.title}" via RentRight!. Name: ${name}, Phone: ${phone}, Date: ${date}. Txn: ${txn.current}`}
                target="_blank" rel="noopener noreferrer"
                style={{display:"block",background:"#25D366",color:"#fff",borderRadius:14,padding:"12px 0",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:10}}>
                💬 Message Landlord on WhatsApp
              </a>
              <button onClick={onClose} style={{width:"100%",background:C.navy,color:"#fff",border:"none",borderRadius:14,padding:"11px 0",fontWeight:700,cursor:"pointer",fontSize:13}}>Done ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIST PROPERTY MODAL  (5 steps)
═══════════════════════════════════════════════════════════ */
function ListModal({onClose}){
  const [step,setStep]=useState(1);
  const [plan,setPlan]=useState(null);
  const [form,setForm]=useState({title:"",area:"",price:"",type:"Single Room",phone:"",nin:"",desc:""});
  const [otpSent,setOtpSent]=useState(false); const [otpVal,setOtpVal]=useState(""); const [otpOk,setOtpOk]=useState(false);
  const [sig,setSig]=useState(""); const [agreed,setAgreed]=useState(false);
  const [submitting,setSubmitting]=useState(false); const [done,setDone]=useState(false);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const allFilled = form.title&&form.area&&form.price&&form.phone&&form.nin;

  const plans=[
    {id:"free",  label:"Free Basic",     price:0,      color:C.green,  badge:null,        features:["Upload property","Basic photos","Standard visibility","WhatsApp contact button"]},
    {id:"boost", label:"Boost 7 Days",   price:25000,  color:C.blue,   badge:"Popular",   features:["🚀 Top search placement","📍 Featured badge","🔥 Homepage slot","📈 View analytics (7 days)"]},
    {id:"prem",  label:"Premium 30 Days",price:50000,  color:C.purple, badge:"Best Value", features:["All Boost features","Priority verification","Social media promo","Dedicated agent support"]},
    {id:"verify",label:"Verify Property",price:40000,  color:C.gold,   badge:"Trust",     features:["Physical inspection visit","Photo validation","GPS confirmation","🟢 Verified Safe Home badge"]},
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(5px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:520,maxHeight:"95vh",overflowY:"auto",boxShadow:"0 40px 90px rgba(0,0,0,.32)"}}>
        <div style={{background:C.navy,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"26px 26px 0 0",position:"sticky",top:0,zIndex:2}}>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:15,margin:0}}>List Your Property</p><p style={{color:C.tt,fontSize:11,margin:0}}>Free to start · Boost for 10× visibility</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{display:"flex",background:C.mist,borderBottom:`1px solid ${C.border}`}}>
          {["Plan","Details","Verify","Sign","Done"].map((s,i)=>(
            <div key={s} style={{flex:1,padding:"8px 0",textAlign:"center",fontSize:10,fontWeight:700,
              color:step===i+1?C.blue:step>i+1?C.green:C.ts,
              borderBottom:`2.5px solid ${step===i+1?C.blue:step>i+1?C.green:"transparent"}`}}>
              {step>i+1?"✓":""}{s}
            </div>
          ))}
        </div>
        <div style={{padding:"22px 24px"}}>

          {/* STEP 1 – Plan */}
          {step===1&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 4px"}}>Choose Your Plan</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 16px"}}>Start free — upgrade anytime to dominate search results.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {plans.map(p=>(
                  <div key={p.id} onClick={()=>setPlan(p.id)}
                    style={{border:`2px solid ${plan===p.id?p.color:C.border}`,borderRadius:16,padding:"14px 14px 12px",cursor:"pointer",background:plan===p.id?p.color+"0d":"#fff",transition:"all .18s",position:"relative"}}>
                    {p.badge&&<span style={{position:"absolute",top:-8,right:8,background:p.color,color:p.id==="verify"?"#1a0a00":"#fff",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:20}}>{p.badge}</span>}
                    <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:"0 0 2px"}}>{p.label}</p>
                    <p style={{fontWeight:900,fontSize:14,color:p.color,margin:"0 0 8px"}}>{p.price===0?"FREE":"UGX "+p.price.toLocaleString()}</p>
                    {p.features.map(f=><p key={f} style={{fontSize:10,color:C.n3,margin:"1px 0"}}>✓ {f}</p>)}
                  </div>
                ))}
              </div>
              <button disabled={!plan} onClick={()=>setStep(2)} style={{width:"100%",marginTop:14,background:plan?C.navy:"#e2e8f0",color:plan?"#fff":C.ts,border:"none",borderRadius:14,padding:"13px 0",fontWeight:700,cursor:plan?"pointer":"default",fontSize:14}}>
                Continue with {plan?plans.find(p=>p.id===plan).label:"…"} →
              </button>
            </>
          )}

          {/* STEP 2 – Details */}
          {step===2&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 14px"}}>Property Details</p>
              {[["title","Property title *","e.g. Bright Studio, Ntinda"],["area","Area / Location *","e.g. Kisaasi, Kampala"],["price","Monthly rent (UGX) *","e.g. 350000"],["phone","Your phone number *","e.g. 0771 234 567"],["nin","National ID Number (NIN) *","For mandatory identity check"]].map(([k,lb,ph])=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                  <input value={form[k]} onChange={f(k)} placeholder={ph}
                    style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${form[k]?C.green:C.border}`,fontSize:13,boxSizing:"border-box",fontFamily:"inherit",outline:"none",transition:"border-color .2s"}}/>
                </div>
              ))}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Property type</label>
                <select value={form.type} onChange={f("type")} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",outline:"none"}}>
                  {["Single Room","Double Room","Hostel","Shared Housing","Self-Contained","Apartment"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Description</label>
                <textarea value={form.desc} onChange={f("desc")} placeholder="Describe the property in detail…" rows={3}
                  style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,boxSizing:"border-box",fontFamily:"inherit",outline:"none",resize:"vertical"}}/>
              </div>
              <div style={{background:C.bL,borderRadius:12,padding:"10px 14px",fontSize:11,color:C.bD,marginBottom:14}}>
                📍 <strong>GPS Rule:</strong> Photos must be geo-tagged & timestamped. Your listing location will be cross-checked with your device GPS. Mismatches are automatically flagged.
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(1)} style={{flex:1,background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 0",fontWeight:600,cursor:"pointer",fontSize:13}}>← Back</button>
                <button disabled={!allFilled} onClick={()=>setStep(3)} style={{flex:2,background:allFilled?C.navy:"#e2e8f0",color:allFilled?"#fff":C.ts,border:"none",borderRadius:13,padding:"11px 0",fontWeight:700,fontSize:14,cursor:allFilled?"pointer":"default"}}>
                  Next → Verify Identity
                </button>
              </div>
            </>
          )}

          {/* STEP 3 – Verify */}
          {step===3&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 4px"}}>Identity Verification</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 16px"}}>Required before listing. Protects tenants from scam listings.</p>
              {[
                {icon:"🪪",title:"National ID (NIN)",sub:`NIN …${form.nin.slice(-4)||"XXXX"} — submitted & recorded`,done:form.nin.length>5,btn:"✔ On File"},
                {icon:"📱",title:"Phone OTP",sub:`Send 6-digit code to ${form.phone||"your number"}`,done:otpOk,btn:otpOk?"✔ Verified":otpSent?"Enter Code →":"Send OTP →"},
                {icon:"🤳",title:"AI Selfie Match",sub:"Selfie compared to NIN using AI — fakes rejected automatically",done:false,btn:"Take Selfie →"},
                {icon:"📸",title:"Photo Geo-tag Check",sub:"Upload must include GPS coordinates & timestamp",done:false,btn:"Upload Photos →"},
                {icon:"📍",title:"GPS Location Lock",sub:"Listing location vs your current device GPS — auto-checked",done:true,btn:"✔ Auto-detected"},
                {icon:"🔒",title:"Device Fingerprint",sub:"Browser ID, IP & device recorded to prevent banned users returning",done:true,btn:"✔ Captured"},
              ].map(v=>(
                <div key={v.title} style={{display:"flex",gap:12,alignItems:"center",background:C.mist,borderRadius:13,padding:"11px 14px",marginBottom:8,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:22,flexShrink:0}}>{v.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:0}}>{v.title}</p>
                    <p style={{fontSize:10,color:C.ts,margin:0}}>{v.sub}</p>
                    {v.title==="Phone OTP"&&otpSent&&!otpOk&&(
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        <input value={otpVal} onChange={e=>setOtpVal(e.target.value)} placeholder="6-digit code" maxLength={6}
                          style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",outline:"none",width:100}}/>
                        <button onClick={()=>setOtpOk(true)} style={{background:C.green,color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Verify</button>
                      </div>
                    )}
                  </div>
                  <button onClick={()=>{if(v.title==="Phone OTP"&&!otpSent){setOtpSent(true);}else if(!v.done){alert(v.title+" — full flow in production app!");}}}
                    style={{background:v.done?C.gL:C.bL,color:v.done?C.gD:C.bD,border:"none",borderRadius:10,padding:"5px 11px",fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                    {v.btn}
                  </button>
                </div>
              ))}
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"10px 14px",fontSize:11,color:C.yD,marginBottom:14}}>
                🧠 <strong>AI Fraud Scanner active:</strong> Duplicate phone numbers, stolen images, unrealistic pricing, and GPS mismatches are flagged automatically before your listing goes live.
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(2)} style={{flex:1,background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 0",fontWeight:600,cursor:"pointer",fontSize:13}}>← Back</button>
                <button onClick={()=>setStep(4)} style={{flex:2,background:C.navy,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:700,fontSize:14,cursor:"pointer"}}>Next → Sign Agreement</button>
              </div>
            </>
          )}

          {/* STEP 4 – Sign */}
          {step===4&&!done&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 12px"}}>Digital Listing Agreement</p>
              <div style={{background:C.mist,borderRadius:14,padding:"14px 16px",fontSize:11,lineHeight:1.8,color:C.n3,maxHeight:170,overflowY:"auto",border:`1px solid ${C.border}`,marginBottom:14}}>
                <strong>RentRight! Landlord Agreement</strong><br/><br/>
                By listing on RentRight!, I confirm:<br/>
                1. I am the legal owner or authorized agent for this property.<br/>
                2. All information (price, location, photos) is accurate and truthful.<br/>
                3. Submitting false information may result in permanent account suspension and potential legal action.<br/>
                4. I consent to RentRight! verifying my identity via NIN, GPS, and AI selfie matching.<br/>
                5. I will not bypass the platform to avoid commission fees once a tenant connection is made through RentRight!.<br/>
                6. A commission of 3–7% of the first month's rent is due to RentRight! upon successful rental.<br/>
                7. Landlord contacts are hidden until tenant pays a viewing fee — this protects both parties.<br/>
                8. My IP address, device ID, and this timestamp ({new Date().toLocaleString()}) are recorded as proof of consent and form a legally binding digital signature.<br/><br/>
                <em>RentRight! is a listing and matching intermediary platform. It does not own, manage, or guarantee properties listed herein.</em>
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:5}}>Digital Signature — Type your full legal name</label>
                <input value={sig} onChange={e=>setSig(e.target.value)} placeholder="Type full name to sign digitally…"
                  style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1.5px solid ${sig?C.green:C.border}`,fontSize:15,boxSizing:"border-box",fontFamily:"cursive",fontStyle:"italic",outline:"none"}}/>
                {sig&&<p style={{fontSize:10,color:C.ts,margin:"4px 0 0"}}>✅ Signed as "{sig}" · IP logged · {new Date().toLocaleString()}</p>}
              </div>
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:16}}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.green,width:16,height:16,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.n3,lineHeight:1.5}}>I, <strong>{sig||"[your name]"}</strong>, agree to all terms above and confirm this listing is genuine.</span>
              </label>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(3)} style={{flex:1,background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 0",fontWeight:600,cursor:"pointer",fontSize:13}}>← Back</button>
                <button disabled={!sig||!agreed||submitting} onClick={()=>{setSubmitting(true);setTimeout(()=>{setSubmitting(false);setDone(true);},2000);}}
                  style={{flex:2,background:sig&&agreed?C.green:"#e2e8f0",color:sig&&agreed?"#fff":C.ts,border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:14,cursor:sig&&agreed?"pointer":"default"}}>
                  {submitting?"Submitting…":"🚀 Submit Listing"}
                </button>
              </div>
            </>
          )}

          {/* DONE */}
          {done&&(
            <div style={{textAlign:"center",paddingBottom:10}}>
              <div style={{fontSize:52,marginBottom:10}}>🎉</div>
              <p style={{fontWeight:900,fontSize:20,color:C.gD,margin:"0 0 6px"}}>Listing Submitted!</p>
              <div style={{background:C.gL,borderRadius:14,padding:"14px 16px",fontSize:12,color:C.n3,textAlign:"left",marginBottom:14,lineHeight:1.8}}>
                <strong>Property:</strong> {form.title}<br/>
                <strong>Area:</strong> {form.area}<br/>
                <strong>Rent:</strong> UGX {parseInt(form.price||0).toLocaleString()}/mo<br/>
                <strong>Plan:</strong> {plans.find(p=>p.id===plan)?.label}<br/>
                <strong>Status:</strong> 🕐 Under verification (24–48 hrs)<br/>
                <strong>Signed by:</strong> {sig}
              </div>
              <p style={{fontSize:11,color:C.ts,marginBottom:16}}>Our team will verify your listing via NIN, GPS, and photo checks. SMS confirmation sent to {form.phone}.</p>
              <button onClick={onClose} style={{background:C.navy,color:"#fff",border:"none",borderRadius:14,padding:"12px 28px",fontWeight:700,cursor:"pointer",fontSize:14}}>Done ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IN-PLATFORM MESSAGE MODAL
═══════════════════════════════════════════════════════════ */
function MessageModal({l,paid,onClose,onPayFirst}){
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  const msgs=[
    {from:"ai",text:`Hi! I'm the RentRight! messaging system for "${l.title}".\n\n${paid?"✅ Contact unlocked — landlord details revealed below.":"🔒 To protect both parties, landlord details are hidden until you pay the viewing fee (UGX "+l.viewingFee.toLocaleString()+").\n\nPay the small fee to unlock direct contact and book your viewing."}`},
  ];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.75)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:C.navy,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:14,margin:0}}>💬 In-Platform Chat</p><p style={{color:C.tt,fontSize:10,margin:0}}>{l.title}</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"16px 18px 14px"}}>
          <div style={{background:C.mist,borderRadius:14,padding:"12px 14px",fontSize:12,lineHeight:1.6,color:C.navy,marginBottom:12,whiteSpace:"pre-wrap"}}>{msgs[0].text}</div>
          {paid?(
            <>
              <div style={{background:C.gL,borderRadius:12,padding:"12px 14px",fontSize:12,color:C.n3,lineHeight:1.7,marginBottom:12}}>
                🔓 <strong>Landlord Contact Unlocked</strong><br/>
                Name: <strong>{l.landlord}</strong><br/>
                Phone: <strong>{l.phone.includes("X")?"0712 345 678":l.phone}</strong><br/>
                WhatsApp: <strong>+{l.wa}</strong>
              </div>
              {!sent?(
                <>
                  <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type your message to the landlord…" rows={3}
                    style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",boxSizing:"border-box",outline:"none",resize:"none",marginBottom:10}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button disabled={!msg} onClick={()=>setSent(true)} style={{flex:2,background:msg?C.blue:"#e2e8f0",color:msg?"#fff":C.ts,border:"none",borderRadius:12,padding:"10px 0",fontWeight:700,cursor:msg?"pointer":"default",fontSize:13}}>Send Message</button>
                    <a href={`https://wa.me/${l.wa}?text=${encodeURIComponent(msg||"Hi, I'm interested in "+l.title)}`} target="_blank" rel="noopener noreferrer"
                      style={{flex:1.5,background:"#25D366",color:"#fff",borderRadius:12,padding:"10px 0",fontWeight:700,fontSize:12,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      WhatsApp
                    </a>
                  </div>
                </>
              ):(
                <div style={{textAlign:"center",padding:"10px 0"}}><div style={{fontSize:36}}>✅</div><p style={{fontWeight:700,color:C.gD,fontSize:14}}>Message sent! Landlord will reply shortly.</p></div>
              )}
            </>
          ):(
            <button onClick={onPayFirst} style={{width:"100%",background:`linear-gradient(135deg,${C.green},${C.blue})`,color:"#fff",border:"none",borderRadius:14,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
              🔓 Pay UGX {l.viewingFee.toLocaleString()} to Unlock Contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REPORT MODAL
═══════════════════════════════════════════════════════════ */
function ReportModal({l,onClose}){
  const [reason,setReason]=useState(""); const [detail,setDetail]=useState(""); const [sent,setSent]=useState(false);
  const reasons=["Fake / duplicate listing","Price looks unrealistic","Photos appear stolen","Requesting upfront payment","Contact not responding","Property doesn't match description","Other"];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.72)",zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:400,boxShadow:"0 24px 60px rgba(0,0,0,.28)"}}>
        <div style={{background:C.rD,borderRadius:"22px 22px 0 0",padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{color:"#fff",fontWeight:800,fontSize:13,margin:0}}>🚨 Report Listing</p>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"18px 20px"}}>
          {!sent?(
            <>
              <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:"0 0 10px"}}>Reporting: {l?.title}</p>
              {reasons.map(r=>(
                <label key={r} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",cursor:"pointer",borderBottom:`1px solid ${C.border}`}}>
                  <input type="radio" name="reason" onChange={()=>setReason(r)} style={{accentColor:C.red}}/>
                  <span style={{fontSize:12,color:C.n3}}>{r}</span>
                </label>
              ))}
              <textarea value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Additional details (optional)" rows={2}
                style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:11,fontFamily:"inherit",boxSizing:"border-box",outline:"none",resize:"none",margin:"10px 0"}}/>
              <button disabled={!reason} onClick={()=>setSent(true)} style={{width:"100%",background:reason?C.rD:"#e2e8f0",color:reason?"#fff":C.ts,border:"none",borderRadius:12,padding:"11px 0",fontWeight:700,cursor:reason?"pointer":"default",fontSize:13}}>Submit Report</button>
            </>
          ):(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:44,marginBottom:8}}>✅</div>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 6px"}}>Report Received</p>
              <p style={{fontSize:11,color:C.ts,margin:"0 0 14px"}}>This listing has been flagged. Our trust team will investigate within 24 hours. If fraud is confirmed, the listing is frozen and the landlord account suspended.</p>
              <button onClick={onClose} style={{background:C.navy,color:"#fff",border:"none",borderRadius:12,padding:"9px 22px",fontWeight:700,cursor:"pointer",fontSize:12}}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETAIL MODAL
═══════════════════════════════════════════════════════════ */
function DetailModal({l,onClose,onBook,onMsg,onReport}){
  const [copied,setCopied]=useState(false);
  if(!l)return null;
  const mii=miInfo(l.moveIn); const score=avgScore(l);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.72)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:560,maxHeight:"94vh",overflowY:"auto",boxShadow:"0 36px 90px rgba(0,0,0,.32)"}}>
        <div style={{position:"relative"}}>
          <img src={l.img} alt={l.title} style={{width:"100%",height:240,objectFit:"cover",borderRadius:"26px 26px 0 0"}}/>
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(15,23,42,.8)",color:"#fff",border:"none",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          {l.boosted&&<span style={{position:"absolute",top:12,left:12,background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20}}>🚀 Boosted</span>}
          <div style={{position:"absolute",bottom:12,left:12,display:"flex",gap:6}}>
            <span style={{background:l.verified?C.gL:C.rL,color:l.verified?C.gD:C.rD,fontSize:10,fontWeight:800,padding:"3px 11px",borderRadius:20}}>{l.verified?"✔ Verified Safe Home":"⚠ Unverified"}</span>
            <span style={{background:mii.bg,color:mii.color,fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:20}}>{mii.icon} {mii.label}</span>
          </div>
        </div>
        <div style={{padding:"20px 22px 26px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:10}}>
            <div><h2 style={{margin:0,fontSize:19,fontWeight:900,color:C.navy}}>{l.title}</h2><p style={{margin:"3px 0 0",color:C.ts,fontSize:12}}>📍 {l.area} · {l.type} · by {l.landlord}</p></div>
            <div style={{textAlign:"right"}}><p style={{fontWeight:900,fontSize:19,color:C.blue,margin:0}}>UGX {l.price.toLocaleString()}</p><p style={{fontSize:10,color:C.tt,margin:0}}>per month</p></div>
          </div>
          {/* Trust pills */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
            {l.verified&&<Pill bg={C.gL} color={C.gD}>🟢 Verified Owner</Pill>}
            {l.photos&&<Pill bg={C.bL} color={C.bD}>📸 Real Photos</Pill>}
            {l.gps&&<Pill bg="#F0FDF4" color={C.gD}>📍 GPS Confirmed</Pill>}
            {l.priceOk&&<Pill bg="#FEF9C3" color={C.yD}>🧾 Price Verified</Pill>}
            {l.contactLocked&&<Pill bg={C.rL} color={C.rD}>🔒 Contact Hidden</Pill>}
            {!l.contactLocked&&<Pill bg={C.gL} color={C.gD}>🔓 Contact Visible</Pill>}
          </div>
          {/* Trust meter */}
          <div style={{marginBottom:12}}><TrustMeter score={l.confidence}/></div>
          {/* AI desc */}
          <div style={{background:C.bL,borderRadius:12,padding:"10px 14px",fontSize:12,color:C.n3,lineHeight:1.6,marginBottom:12,borderLeft:`3px solid ${C.blue}`}}>
            🤖 <strong>AI Summary:</strong> {l.desc}
          </div>
          {/* Living score */}
          <div style={{background:C.mist,borderRadius:14,padding:"12px 14px",marginBottom:12}}>
            <p style={{fontWeight:800,fontSize:12,color:C.navy,margin:"0 0 10px"}}>🌿 Living Environment Score</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[["Safety",l.living.safety],["Cleanliness",l.living.clean],["Accessibility",l.living.access]].map(([k,v])=>(
                <div key={k}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.ts,marginBottom:3}}><span>{k}</span><span style={{fontWeight:700,color:lc(v)}}>{v}/10</span></div><div style={{background:C.border,borderRadius:10,height:5}}><div style={{width:`${v*10}%`,height:"100%",background:lc(v),borderRadius:10}}/></div></div>
              ))}
              <div style={{background:"#fff",borderRadius:10,padding:"7px 10px",border:`1px solid ${C.border}`}}><p style={{fontSize:9,color:C.ts,margin:0}}>Noise</p><p style={{fontWeight:700,color:C.navy,fontSize:12,margin:0}}>🔇 {l.living.noise}</p></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:12,padding:"9px 12px",border:`1px solid ${C.gL}`}}>
              <ScoreRing score={score} size={46}/>
              <div><p style={{fontWeight:800,fontSize:13,color:C.navy,margin:0}}>Score: {score}/10</p><p style={{fontSize:10,color:C.ts,margin:0}}>Safety · Clean · Access</p></div>
              <span style={{marginLeft:"auto",background:C.blue+"22",color:C.bD,fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:20}}>⚡ {l.match}% match</span>
            </div>
          </div>
          {/* Nearby */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[["🚕","Taxi",l.nearby.taxi],["🛒","Market",l.nearby.market],["🎓","Campus",l.nearby.campus]].map(([ic,lb,v])=>(
              <div key={lb} style={{background:C.mist,borderRadius:10,padding:"8px 10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                <p style={{fontSize:18,margin:"0 0 2px"}}>{ic}</p><p style={{fontSize:9,color:C.ts,margin:0}}>{lb}</p><p style={{fontWeight:800,fontSize:11,color:C.navy,margin:0}}>{v}</p>
              </div>
            ))}
          </div>
          {/* Price comparison */}
          <div style={{background:"#FEF9C3",borderRadius:10,padding:"9px 12px",fontSize:11,color:C.yD,marginBottom:10}}>
            🧾 Similar homes in {l.area}: UGX {l.areaPrice.min.toLocaleString()} – {l.areaPrice.max.toLocaleString()}/mo
          </div>
          {/* Commission */}
          <div style={{background:C.mist,borderRadius:10,padding:"9px 12px",fontSize:11,color:C.n3,marginBottom:12,border:`1px solid ${C.border}`}}>
            💼 <strong>Commission:</strong> UGX {Math.round(l.price*l.commission).toLocaleString()} ({(l.commission*100).toFixed(0)}% of first month) due to RentRight! on successful rental.
          </div>
          {/* Amenities */}
          <div style={{marginBottom:12}}><p style={{fontWeight:700,fontSize:12,margin:"0 0 6px",color:C.navy}}>Amenities</p><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{l.amenities.map(a=><span key={a} style={{background:C.gL,color:C.gD,fontSize:11,padding:"3px 10px",borderRadius:12}}>{AMICONS[a]} {a}</span>)}</div></div>
          {/* Contact lock banner */}
          {l.contactLocked&&(
            <div style={{background:`linear-gradient(135deg,${C.n2},${C.navy})`,borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:28}}>🔒</div>
              <div><p style={{color:"#fff",fontWeight:700,fontSize:13,margin:0}}>Landlord contact is hidden</p><p style={{color:C.tt,fontSize:11,margin:0}}>Pay viewing fee (UGX {l.viewingFee.toLocaleString()}) to unlock phone & WhatsApp</p></div>
            </div>
          )}
          {/* CTAs */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <button onClick={()=>onBook(l)} style={{background:C.green,color:"#fff",border:"none",borderRadius:14,padding:"13px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>📅 Book Viewing</button>
            <button onClick={()=>onMsg(l)} style={{background:C.blue,color:"#fff",border:"none",borderRadius:14,padding:"13px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>{l.contactLocked?"🔒 Chat":"💬 Message"}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>{navigator.clipboard.writeText(`"${l.title}" on RentRight!\n📍 ${l.area} · UGX ${l.price.toLocaleString()}/mo\nrightright.ug`);setCopied(true);setTimeout(()=>setCopied(false),2500);}}
              style={{background:"transparent",color:C.blue,border:`1.5px solid ${C.blue}`,borderRadius:14,padding:"10px 0",fontWeight:700,fontSize:11,cursor:"pointer"}}>
              {copied?"✅ Copied!":"🔁 Share & Earn"}
            </button>
            <button onClick={()=>onReport(l)} style={{background:C.rL,color:C.rD,border:"none",borderRadius:14,padding:"10px 0",fontWeight:700,fontSize:11,cursor:"pointer"}}>🚨 Report Listing</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LISTING CARD
═══════════════════════════════════════════════════════════ */
function Card({l,onOpen}){
  const mii=miInfo(l.moveIn); const score=avgScore(l);
  return(
    <div onClick={()=>onOpen(l)} style={{background:"#fff",borderRadius:20,overflow:"hidden",border:`1.5px solid ${l.boosted?"#F59E0B":C.border}`,cursor:"pointer",transition:"all .2s",boxShadow:l.boosted?"0 2px 16px rgba(245,158,11,.15)":"0 2px 10px rgba(15,23,42,.05)"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=l.boosted?"0 12px 40px rgba(245,158,11,.2)":"0 12px 36px rgba(15,23,42,.12)";e.currentTarget.style.borderColor=l.boosted?"#F59E0B":C.blue;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=l.boosted?"0 2px 16px rgba(245,158,11,.15)":"0 2px 10px rgba(15,23,42,.05)";e.currentTarget.style.borderColor=l.boosted?"#F59E0B":C.border;}}>
      <div style={{position:"relative"}}>
        <img src={l.img} alt={l.title} style={{width:"100%",height:185,objectFit:"cover",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(15,23,42,.5) 0%,transparent 55%)"}}/>
        <div style={{position:"absolute",top:9,left:9,display:"flex",gap:4,flexWrap:"wrap"}}>
          {l.boosted&&<span style={{background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>🚀 Boosted</span>}
          <span style={{background:l.verified?C.gL:C.rL,color:l.verified?C.gD:C.rD,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>{l.verified?"✔ Verified":"⚠ Unverified"}</span>
          {l.price<250000&&<span style={{background:"#FEF9C3",color:C.yD,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>🌅 Budget</span>}
        </div>
        {l.contactLocked&&<div style={{position:"absolute",top:9,right:9,background:"rgba(15,23,42,.8)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>🔒 Contact hidden</div>}
        <div style={{position:"absolute",bottom:9,left:9}}><span style={{background:mii.bg,color:mii.color,fontSize:9,fontWeight:700,padding:"2px 9px",borderRadius:20}}>{mii.icon} {mii.label}</span></div>
        <div style={{position:"absolute",bottom:9,right:9,background:"rgba(15,23,42,.86)",color:"#fff",fontWeight:800,fontSize:12,padding:"3px 10px",borderRadius:20}}>UGX {l.price.toLocaleString()}/mo</div>
      </div>
      <div style={{padding:"12px 14px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
          <div style={{flex:1}}>
            <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:0,lineHeight:1.3}}>{l.title}</p>
            <p style={{color:C.ts,fontSize:11,margin:"2px 0 0"}}>📍 {l.area} · {l.type}</p>
          </div>
          <ScoreRing score={score} size={50}/>
        </div>
        {/* Confidence bar */}
        <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
          <div style={{flex:1,background:C.border,borderRadius:10,height:4}}><div style={{width:`${l.confidence}%`,height:"100%",background:confCol(l.confidence),borderRadius:10}}/></div>
          <span style={{fontSize:9,fontWeight:700,color:confCol(l.confidence),whiteSpace:"nowrap"}}>{l.confidence}% trust</span>
        </div>
        <div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{background:C.blue+"22",color:C.bD,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20}}>⚡ {l.match}%</span>
          <span style={{background:"#F0FDF4",color:C.gD,fontSize:10,padding:"2px 8px",borderRadius:20}}>🔁 {l.referrals}</span>
          <span style={{color:"#F59E0B",fontSize:11}}>{"★".repeat(Math.round(l.rating))}</span>
          <span style={{background:"#FEF9C3",color:C.yD,fontSize:9,padding:"2px 7px",borderRadius:20,marginLeft:"auto"}}>📅 {l.viewingFee.toLocaleString()} fee</span>
        </div>
        <div style={{marginTop:7,display:"flex",gap:4,flexWrap:"wrap"}}>
          {l.amenities.slice(0,3).map(a=><span key={a} style={{background:C.mist,color:C.n3,fontSize:10,padding:"2px 7px",borderRadius:10}}>{AMICONS[a]} {a}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI CHAT
═══════════════════════════════════════════════════════════ */
function AIChat({onClose}){
  const [msgs,setMsgs]=useState([{from:"ai",text:"Hi! I'm your RentRight AI 🏠\n\nTell me your budget, area, and lifestyle. I'll match you with verified homes.\n\nExample: '350k near Kisaasi, quiet and secure'"}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const txt=input.trim();setInput("");setLoading(true);
    setMsgs(m=>[...m,{from:"user",text:txt}]);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:350,
          system:`You are a warm RentRight housing assistant for Kampala, Uganda. Listings: ${JSON.stringify(LISTINGS.map(l=>({title:l.title,area:l.area,price:l.price,type:l.type,vibe:l.vibe,confidence:l.confidence,match:l.match,moveIn:l.moveIn,viewingFee:l.viewingFee,amenities:l.amenities})))}. Reply concisely (max 3 sentences). Mention specific listings with confidence scores and viewing fees. Never mention Claude or Anthropic.`,
          messages:[...msgs.map(m=>({role:m.from==="ai"?"assistant":"user",content:m.text})),{role:"user",content:txt}]})});
      const data=await res.json();
      setMsgs(m=>[...m,{from:"ai",text:data.content?.find(c=>c.type==="text")?.text||"Happy to help! Describe your ideal home."}]);
    }catch{setMsgs(m=>[...m,{from:"ai",text:"Connection issue — try again or WhatsApp us! 📱"}]);}
    setLoading(false);
  };
  return(
    <div style={{position:"fixed",bottom:90,right:20,width:320,background:"#fff",borderRadius:22,boxShadow:"0 20px 60px rgba(15,23,42,.22)",border:`1px solid ${C.border}`,zIndex:998,display:"flex",flexDirection:"column",maxHeight:440}}>
      <div style={{background:C.navy,borderRadius:"22px 22px 0 0",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
          <div><p style={{color:"#fff",fontWeight:700,fontSize:13,margin:0}}>RentRight AI</p><p style={{color:C.tt,fontSize:10,margin:0}}>Smart Housing Assistant · Online</p></div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
            <div style={{background:m.from==="user"?C.blue:C.mist,color:m.from==="user"?"#fff":C.navy,fontSize:12,lineHeight:1.5,padding:"8px 12px",borderRadius:14,maxWidth:"83%",whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:C.mist,color:C.ts,fontSize:12,padding:"8px 12px",borderRadius:14}}>Searching listings…</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",gap:6}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about rentals…"
          style={{flex:1,padding:"8px 12px",borderRadius:12,border:`1px solid ${C.border}`,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} style={{background:C.blue,color:"#fff",border:"none",borderRadius:12,padding:"8px 12px",fontSize:13,cursor:"pointer",fontWeight:700}}>↑</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function RentRight(){
  const [heroIdx,setHeroIdx]=useState(0);
  const [mode,setMode]=useState(null);
  const [search,setSearch]=useState(""); const [minP,setMinP]=useState(""); const [maxP,setMaxP]=useState("");
  const [selVibes,setSelVibes]=useState([]); const [onlyVerified,setOnlyVerified]=useState(false);
  const [sortBy,setSortBy]=useState("match");
  const [filtered,setFiltered]=useState([...LISTINGS].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));
  const [selected,setSelected]=useState(null);
  const [booking,setBooking]=useState(null);
  const [messaging,setMessaging]=useState(null);
  const [reporting,setReporting]=useState(null);
  const [listModal,setListModal]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [alertEmail,setAlertEmail]=useState(""); const [alertSent,setAlertSent]=useState(false);
  const [refEmail,setRefEmail]=useState(""); const [refSent,setRefSent]=useState(false);
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
    else if(sb==="price-asc")res.sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||a.price-b.price);
    else if(sb==="price-desc")res.sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.price-a.price);
    else if(sb==="score")res.sort((a,b)=>avgScore(b)-avgScore(a));
    else if(sb==="confidence")res.sort((a,b)=>b.confidence-a.confidence);
    else if(sb==="referrals")res.sort((a,b)=>b.referrals-a.referrals);
    setFiltered(res);
  },[search,minP,maxP,selVibes,onlyVerified,sortBy,mode]);

  const doSearch=()=>{applyFilters();setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);};
  const toggleVibe=id=>{const nv=selVibes.includes(id)?selVibes.filter(v=>v!==id):[...selVibes,id];setSelVibes(nv);applyFilters({vibes:nv});};
  const setModeFilter=m=>{setMode(m);applyFilters({mode:m});setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);};
  const clearAll=()=>{setMode(null);setSelVibes([]);setSearch("");setMinP("");setMaxP("");setOnlyVerified(false);setSortBy("match");setFiltered([...LISTINGS].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));};

  const anyFilter=mode||selVibes.length||search||minP||maxP||onlyVerified;

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:C.mist,minHeight:"100vh",color:C.navy,paddingBottom:72}}>

      {/* ── NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:200,background:"rgba(248,250,252,.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:62}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:17}}>R</div>
            <span style={{fontWeight:900,fontSize:21,letterSpacing:"-.5px"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
          </div>
          <div style={{display:"flex",gap:3}}>
            {["listings","lifestyle","referrals","about"].map(n=>(
              <button key={n} onClick={()=>document.getElementById(n+"-section")?.scrollIntoView({behavior:"smooth"})}
                style={{background:"transparent",color:C.n3,border:"none",borderRadius:20,padding:"6px 13px",fontWeight:600,fontSize:13,cursor:"pointer",textTransform:"capitalize"}}>{n}</button>
            ))}
          </div>
          <button onClick={()=>setListModal(true)} style={{background:C.green,color:"#fff",border:"none",borderRadius:20,padding:"9px 20px",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ List Property</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{position:"relative",height:"94vh",overflow:"hidden"}}>
        {HERO_IMGS.map((img,i)=>(
          <div key={i} style={{position:"absolute",inset:0,transition:"opacity 1.4s",opacity:i===heroIdx?1:0}}>
            <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
        ))}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(15,23,42,.76) 0%,rgba(15,23,42,.5) 55%,rgba(15,23,42,.7) 100%)"}}/>
        <div style={{position:"absolute",top:"10%",right:"7%",width:200,height:200,background:C.green+"14",borderRadius:"50%",filter:"blur(70px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"15%",left:"4%",width:180,height:180,background:C.blue+"14",borderRadius:"50%",filter:"blur(55px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 20px 0"}}>
          <div style={{textAlign:"center",color:"#fff",maxWidth:740,marginBottom:20}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(34,197,94,.2)",border:"1px solid rgba(34,197,94,.4)",borderRadius:20,padding:"5px 16px",fontSize:11,fontWeight:700,color:"#86EFAC",marginBottom:18,letterSpacing:1}}>
              🏆 Uganda's #1 Verified Rental Marketplace · Zero Brokers · GPS-Confirmed
            </div>
            <h1 style={{margin:"0 0 12px",fontSize:"clamp(2rem,5.5vw,3.6rem)",fontWeight:900,lineHeight:1.08,letterSpacing:"-1.5px"}}>
              Find Your <span style={{color:C.green}}>Safe,</span><br/><span style={{color:C.blue}}>Verified</span> Home in Uganda
            </h1>
            <p style={{fontSize:16,opacity:.8,margin:"0 0 14px",lineHeight:1.5}}>No brokers. No scams. GPS-confirmed listings, Living Environment Scores,<br/>and in-platform contact protection.</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:12,fontWeight:700,letterSpacing:1.2}}>CHOOSE YOUR GOAL TO PERSONALISE YOUR EXPERIENCE</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:22,flexWrap:"wrap"}}>
              {MODES.map(m=>(
                <button key={m.id} onClick={()=>setModeFilter(m.id)}
                  style={{background:mode===m.id?"rgba(255,255,255,.97)":"rgba(255,255,255,.1)",color:mode===m.id?C.navy:"#fff",border:mode===m.id?`2px solid ${C.green}`:"1.5px solid rgba(255,255,255,.22)",borderRadius:14,padding:"9px 18px",fontWeight:700,fontSize:13,cursor:"pointer",backdropFilter:"blur(8px)",transition:"all .2s"}}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>
          {/* Search box */}
          <div style={{background:"rgba(255,255,255,.97)",borderRadius:24,padding:"20px 22px",width:"100%",maxWidth:700,boxShadow:"0 24px 64px rgba(0,0,0,.28)"}}>
            <p style={{fontSize:10,fontWeight:800,color:C.ts,margin:"0 0 8px",letterSpacing:1.5,textTransform:"uppercase"}}>Find Verified Homes Near You</p>
            <div style={{display:"flex",gap:8,marginBottom:9}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()}
                placeholder="Area, type or lifestyle — e.g. 'quiet room Ntinda'"
                style={{flex:1,padding:"10px 14px",borderRadius:13,border:`1.5px solid ${C.border}`,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(()=>{setSearch("Near Me");doSearch();},()=>{})}}}
                style={{background:C.navy,color:"#fff",border:"none",borderRadius:13,padding:"10px 15px",fontWeight:700,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>📍 Near Me</button>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:9,flexWrap:"wrap"}}>
              <input value={minP} onChange={e=>setMinP(e.target.value)} placeholder="Min price (UGX)"
                style={{flex:1,minWidth:100,padding:"9px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <input value={maxP} onChange={e=>setMaxP(e.target.value)} placeholder="Max price (UGX)"
                style={{flex:1,minWidth:100,padding:"9px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:C.gD,cursor:"pointer",whiteSpace:"nowrap"}}>
                <input type="checkbox" checked={onlyVerified} onChange={e=>{setOnlyVerified(e.target.checked);applyFilters({verified:e.target.checked});}} style={{accentColor:C.green}}/>✔ Verified Only
              </label>
            </div>
            <button onClick={doSearch} style={{width:"100%",background:`linear-gradient(135deg,${C.green},${C.blue})`,color:"#fff",border:"none",borderRadius:13,padding:"13px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>Search Rentals 🔍</button>
          </div>
          <div style={{marginTop:18,display:"flex",gap:6}}>
            {HERO_IMGS.map((_,i)=>(
              <button key={i} onClick={()=>setHeroIdx(i)} style={{width:i===heroIdx?28:8,height:8,background:i===heroIdx?C.green:"rgba(255,255,255,.35)",border:"none",borderRadius:4,cursor:"pointer",transition:"all .3s",padding:0}}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div style={{background:C.navy,padding:"14px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:10}}>
          {[["🟢","Verified Listings"],["📍","GPS Confirmed"],["🔒","Contact Protection"],["📸","Real Photos Only"],["💰","Zero Broker Fees"],["🛡️","AI Fraud Detection"]].map(([ic,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{ic}</span><span style={{color:"#fff",fontWeight:600,fontSize:12}}>{lb}</span></div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{background:C.gL,padding:"16px 24px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:10}}>
          {[["500+","Listings"],["2,400+","Tenants"],["98%","Verified"],["UGX 20K","Referral"],["4.7★","Rating"],["UGX 2.4M","Daily Fees"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><p style={{fontWeight:900,fontSize:20,color:C.gD,margin:0}}>{n}</p><p style={{fontSize:10,color:C.gD,opacity:.7,margin:0}}>{l}</p></div>
          ))}
        </div>
      </div>

      {/* ── MONETIZATION BANNER ── */}
      <div style={{background:"linear-gradient(135deg,#1e1b4b,#312e81)",padding:"22px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div><p style={{fontWeight:900,fontSize:18,color:"#fff",margin:"0 0 3px"}}>🚀 Boost Your Listing — Get 10× More Views</p><p style={{color:"#a5b4fc",fontSize:12,margin:0}}>From UGX 25,000/week · Top placement · Featured badge · Homepage visibility · Analytics</p></div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{l:"Free Basic",p:"FREE",c:C.green},{l:"Boost 7 Days",p:"25,000",c:C.blue},{l:"Premium 30 Days",p:"50,000",c:C.purple},{l:"Verify Property",p:"40,000",c:C.gold}].map(b=>(
              <button key={b.l} onClick={()=>setListModal(true)}
                style={{background:"rgba(255,255,255,.1)",color:"#fff",border:`1.5px solid ${b.c}`,borderRadius:12,padding:"8px 14px",fontWeight:700,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",textAlign:"center"}}>
                {b.l}<br/><span style={{color:b.c,fontWeight:900}}>{b.p==="FREE"?b.p:"UGX "+b.p}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GROWTH PHASE ROADMAP ── */}
      <div style={{background:C.n2,padding:"22px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <p style={{color:"#fff",fontWeight:800,fontSize:14,margin:"0 0 14px",textAlign:"center"}}>📈 RentRight! Growth Roadmap — Phase by Phase</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
            {[
              {phase:"Phase 1",title:"Survival",color:C.green,active:true,items:["Free listings","WhatsApp contact","Manual verification","Basic search"]},
              {phase:"Phase 2",title:"Control",color:C.blue,active:true,items:["Booking fees (MoMo)","Verified badge system","In-platform chat","Contact protection"]},
              {phase:"Phase 3",title:"Scale",color:C.purple,active:false,items:["AI fraud detection","GPS enforcement","Commission automation","Device fingerprinting"]},
              {phase:"Phase 4",title:"Dominance",color:C.gold,active:false,items:["Kampala monopoly","Pricing intelligence","Escrow system","Roommate matching"]},
            ].map(p=>(
              <div key={p.phase} style={{background:p.active?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",borderRadius:14,padding:"14px 14px 12px",border:`1.5px solid ${p.active?p.color+"66":"rgba(255,255,255,.08)"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{color:p.color,fontWeight:800,fontSize:11}}>{p.phase}</span>
                  {p.active&&<span style={{background:p.color+"33",color:p.color,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>LIVE</span>}
                </div>
                <p style={{color:"#fff",fontWeight:800,fontSize:13,margin:"0 0 8px"}}>{p.title}</p>
                {p.items.map(item=><p key={item} style={{fontSize:10,color:p.active?"#94a3b8":"#475569",margin:"2px 0"}}>✓ {item}</p>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{maxWidth:1140,margin:"0 auto",padding:"36px 24px 0"}}>
        <h2 style={{fontWeight:900,fontSize:22,margin:"0 0 14px"}}>Quick Actions</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
          {[{icon:"📍",title:"Near Me",sub:"GPS listings",action:()=>{setSearch("Near Me");doSearch();}},
            {icon:"💸",title:"Under 300k",sub:"Budget picks",action:()=>{setMaxP("300000");applyFilters({max:"300000"});setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);}},
            {icon:"🎓",title:"Student Hostels",sub:"Campus-close",action:()=>setModeFilter("student")},
            {icon:"🚀",title:"Boosted Listings",sub:"Top visibility",action:()=>setFiltered(LISTINGS.filter(l=>l.boosted))},
            {icon:"🛡️",title:"High Trust",sub:"90%+ confidence",action:()=>{setSortBy("confidence");applyFilters({sort:"confidence"});}},
          ].map(q=>(
            <button key={q.title} onClick={q.action}
              style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:"15px 13px",textAlign:"left",cursor:"pointer",transition:"all .18s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${C.green}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <p style={{fontSize:26,margin:"0 0 7px"}}>{q.icon}</p>
              <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:0}}>{q.title}</p>
              <p style={{fontSize:11,color:C.ts,margin:"2px 0 0"}}>{q.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── ATMOSPHERE ── */}
      <div id="lifestyle-section" style={{maxWidth:1140,margin:"0 auto",padding:"36px 24px 0"}}>
        <h2 style={{fontWeight:900,fontSize:22,margin:"0 0 5px"}}>🌿 Atmosphere Mode</h2>
        <p style={{color:C.ts,margin:"0 0 14px",fontSize:13}}>Choose your lifestyle vibe — smarter than standard filters</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(158px,1fr))",gap:10}}>
          {VIBES.map(v=>(
            <button key={v.id} onClick={()=>toggleVibe(v.id)}
              style={{background:selVibes.includes(v.id)?C.navy:"#fff",color:selVibes.includes(v.id)?"#fff":C.navy,border:`1.5px solid ${selVibes.includes(v.id)?C.navy:C.border}`,borderRadius:14,padding:"14px 12px",textAlign:"left",cursor:"pointer",transition:"all .18s"}}>
              <p style={{fontSize:22,margin:"0 0 5px"}}>{v.icon}</p>
              <p style={{fontWeight:800,fontSize:12,margin:0}}>{v.label}</p>
            </button>
          ))}
        </div>
        {selVibes.length>0&&(
          <div style={{marginTop:10,display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>{setSelVibes([]);applyFilters({vibes:[]});}} style={{background:C.rL,color:C.rD,border:"none",borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>✕ Clear</button>
            <span style={{fontSize:12,color:C.ts}}>{filtered.length} listings match</span>
          </div>
        )}
      </div>

      {/* ── MAP ── */}
      <div style={{maxWidth:1140,margin:"34px auto 0",padding:"0 24px"}}>
        <h2 style={{fontWeight:900,fontSize:22,margin:"0 0 5px"}}>🗺️ Comfort Zone Map</h2>
        <p style={{color:C.ts,margin:"0 0 12px",fontSize:13}}>🟢 Safe zones · 🔵 Urban zones · 🟡 Budget zones</p>
        <div style={{background:"#fff",borderRadius:20,border:`1.5px solid ${C.border}`,overflow:"hidden",position:"relative",height:210}}>
          <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#e8f5e9 0%,#e3f2fd 55%,#fffde7 100%)",position:"relative"}}>
            {[{x:"20%",y:"35%",c:C.green,sz:60},{x:"46%",y:"22%",c:C.green,sz:50},{x:"31%",y:"62%",c:C.blue,sz:55},{x:"62%",y:"44%",c:C.blue,sz:48},{x:"72%",y:"68%",c:C.yellow,sz:45},{x:"14%",y:"74%",c:C.green,sz:52}].map((z,i)=>(
              <div key={i} style={{position:"absolute",left:z.x,top:z.y,width:z.sz,height:z.sz,background:z.c+"50",borderRadius:"50%",transform:"translate(-50%,-50%)",filter:"blur(22px)"}}/>
            ))}
            {[{x:"20%",y:"35%",c:C.green,l:"Bukoto"},{x:"46%",y:"22%",c:C.green,l:"Kisaasi"},{x:"31%",y:"62%",c:C.blue,l:"Makerere"},{x:"62%",y:"44%",c:C.blue,l:"Ntinda"},{x:"72%",y:"68%",c:"#92400E",l:"Wandegeya"},{x:"14%",y:"74%",c:C.green,l:"Naguru"}].map(z=>(
              <div key={z.l} style={{position:"absolute",left:z.x,top:z.y,transform:"translate(-50%,-50%)"}}>
                <span style={{background:z.c,color:"#fff",fontSize:10,fontWeight:800,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>📍 {z.l}</span>
              </div>
            ))}
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(255,255,255,.93)",borderRadius:12,padding:"9px 18px",textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
              <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:0}}>Interactive Map · Phase 3</p>
              <p style={{fontSize:10,color:C.ts,margin:0}}>Google Maps live pins · GPS heatmaps</p>
            </div>
          </div>
          <div style={{position:"absolute",bottom:8,right:8,display:"flex",gap:5}}>
            {[[C.green,"Safe"],[C.blue,"Urban"],[C.yellow,"Budget"]].map(([c,l])=>(
              <span key={l} style={{background:"rgba(255,255,255,.92)",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,border:`1px solid ${c}`}}><span style={{color:c}}>●</span> {l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <div id="listings-section" ref={listRef} style={{maxWidth:1140,margin:"0 auto",padding:"34px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:16}}>
          <div>
            <h2 style={{fontWeight:900,fontSize:24,margin:0}}>
              {mode?`${MODES.find(m=>m.id===mode)?.icon} `:""}{filtered.length} Listings
            </h2>
            <p style={{color:C.ts,margin:"3px 0 0",fontSize:11}}>Boosted first · Verified landlords · Contact protected until fee paid</p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <select value={sortBy} onChange={e=>{setSortBy(e.target.value);applyFilters({sort:e.target.value});}}
              style={{padding:"7px 12px",borderRadius:11,border:`1.5px solid ${C.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
              <option value="match">⚡ Best Match</option>
              <option value="confidence">🛡️ Trust Score</option>
              <option value="score">🌿 Living Score</option>
              <option value="price-asc">💰 Price ↑</option>
              <option value="price-desc">💎 Price ↓</option>
              <option value="referrals">🔁 Most Referred</option>
            </select>
            {anyFilter&&<button onClick={clearAll} style={{background:C.rL,color:C.rD,border:"none",borderRadius:11,padding:"7px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>✕ Clear All</button>}
          </div>
        </div>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"50px 20px",background:"#fff",borderRadius:20,border:`1px solid ${C.border}`}}>
            <p style={{fontSize:44,margin:"0 0 10px"}}>🔍</p>
            <p style={{fontWeight:800,fontSize:17,color:C.navy,margin:0}}>No listings match</p>
            <p style={{color:C.ts,margin:"6px 0 18px"}}>Ask the AI — it knows all listings!</p>
            <button onClick={()=>setChatOpen(true)} style={{background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"11px 22px",fontWeight:700,cursor:"pointer",fontSize:13}}>🤖 Ask AI</button>
          </div>
        ):(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
              {filtered.map(l=><Card key={l.id} l={l} onOpen={setSelected}/>)}
            </div>
            <div style={{marginTop:20,background:`linear-gradient(135deg,${C.gL},${C.bL})`,borderRadius:16,padding:"15px 18px",display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <p style={{fontSize:24,margin:0}}>🤖</p>
              <div style={{flex:1}}><p style={{fontWeight:800,fontSize:13,color:C.navy,margin:0}}>Smart Match Active</p><p style={{fontSize:11,color:C.n3,margin:0}}>{filtered.filter(l=>l.match>=85).length} high-match · {filtered.filter(l=>l.verified).length} verified · {filtered.filter(l=>l.boosted).length} boosted · {filtered.filter(l=>!l.contactLocked).length} open contact</p></div>
              <button onClick={()=>setChatOpen(true)} style={{background:C.navy,color:"#fff",border:"none",borderRadius:11,padding:"9px 16px",fontWeight:700,fontSize:12,cursor:"pointer"}}>Ask AI 🤖</button>
            </div>
          </>
        )}
      </div>

      {/* ── SCAM PREVENTION ── */}
      <div style={{background:C.navy,padding:"48px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <p style={{fontSize:34,margin:"0 0 8px"}}>🛡️</p>
            <h2 style={{color:"#fff",fontWeight:900,fontSize:24,margin:"0 0 6px"}}>Uganda's Strongest Anti-Scam System</h2>
            <p style={{color:C.tt,fontSize:12,margin:0}}>6-layer verification before any listing goes live · Fraud frozen within hours</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
            {[
              {icon:"🪪",title:"NIN Verification",desc:"Every landlord verified by National ID Number before listing is approved.",col:C.green},
              {icon:"🤳",title:"AI Selfie Match",desc:"Selfie compared to NIN photo. Fake identities automatically rejected.",col:C.blue},
              {icon:"📍",title:"GPS Locking",desc:"Listing must match your current device GPS. Mismatches flagged instantly.",col:C.gold},
              {icon:"📸",title:"Photo Geo-tagging",desc:"Photos must carry GPS coordinates and timestamp. Stolen images detected.",col:C.green},
              {icon:"🔒",title:"Device Fingerprint",desc:"IP, browser ID, and device tracked. Banned users cannot return.",col:C.purple},
              {icon:"🚨",title:"Report & Freeze",desc:"Any user can report. Confirmed fraud listings frozen within 24 hours.",col:C.red},
            ].map(s=>(
              <div key={s.title} style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:"16px 14px",border:`1px solid rgba(255,255,255,.08)`}}>
                <p style={{fontSize:26,margin:"0 0 8px"}}>{s.icon}</p>
                <p style={{fontWeight:800,fontSize:12,color:"#fff",margin:"0 0 4px"}}>{s.title}</p>
                <p style={{fontSize:10,color:C.tt,lineHeight:1.5,margin:0}}>{s.desc}</p>
              </div>
            ))}
          </div>
          {/* Commission policy */}
          <div style={{marginTop:24,background:"rgba(255,255,255,.06)",borderRadius:16,padding:"18px 20px",border:"1px solid rgba(255,255,255,.1)"}}>
            <p style={{color:"#fff",fontWeight:800,fontSize:13,margin:"0 0 8px"}}>💼 Commission & Payment Policy</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,fontSize:11,color:C.tt,lineHeight:1.6}}>
              <div><strong style={{color:"#e2e8f0"}}>Viewing Fee (Tenant):</strong><br/>UGX 2,000–10,000 · Non-refundable · Unlocks landlord contact</div>
              <div><strong style={{color:"#e2e8f0"}}>Commission (Landlord):</strong><br/>3–7% of first month's rent · Due on successful rental · Automated or manual</div>
              <div><strong style={{color:"#e2e8f0"}}>Boost Fee (Landlord):</strong><br/>UGX 25,000–50,000 · 7–30 day priority placement · Analytics included</div>
              <div><strong style={{color:"#e2e8f0"}}>Verification Service:</strong><br/>UGX 20,000–80,000 · Physical inspection · GPS + photo + NIN validation</div>
            </div>
          </div>
          {/* Liability */}
          <div style={{marginTop:14,background:"rgba(248,113,113,.1)",borderRadius:14,padding:"14px 18px",border:"1px solid rgba(248,113,113,.25)",textAlign:"center"}}>
            <p style={{color:"#fca5a5",fontSize:12,margin:0,lineHeight:1.7}}>
              ⚖️ <strong>Legal Notice:</strong> RentRight! is a listing and matching platform only. We do not own, manage, or guarantee any property listed herein. All rental agreements are solely between tenant and landlord. RentRight! serves as an intermediary facilitating connections and is not liable for disputes between parties.
            </p>
          </div>
        </div>
      </div>

      {/* ── ALERTS ── */}
      <div style={{background:`linear-gradient(135deg,${C.n2},${C.navy})`,padding:"42px 24px"}}>
        <div style={{maxWidth:580,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:34,margin:"0 0 8px"}}>🔔</p>
          <h2 style={{color:"#fff",fontWeight:900,fontSize:22,margin:"0 0 8px"}}>Smart Price Alerts</h2>
          <p style={{color:C.tt,fontSize:12,margin:"0 0 16px"}}>Get notified when listings match your budget or prices drop in your area.</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center",marginBottom:16}}>
            {["New listing matches budget","Price dropped in area","Verified listing near campus","High-security home added"].map(a=>(
              <span key={a} style={{background:`${C.blue}22`,color:C.blue,fontSize:10,padding:"4px 11px",borderRadius:20,border:`1px solid ${C.blue}44`}}>{a}</span>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <input value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="Phone or email for alerts"
              style={{flex:1,padding:"11px 14px",borderRadius:12,border:"none",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>{if(alertEmail){setAlertSent(true);setTimeout(()=>setAlertSent(false),3000);}}}
              style={{background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"11px 18px",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              {alertSent?"✅ Set!":"🔔 Alert Me"}
            </button>
          </div>
        </div>
      </div>

      {/* ── REFERRAL ── */}
      <div id="referrals-section" style={{background:"linear-gradient(135deg,#0F172A,#0a2315)",padding:"48px 24px"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:40,margin:"0 0 8px"}}>🔁</p>
          <h2 style={{color:"#fff",fontWeight:900,fontSize:26,margin:"0 0 8px"}}>Earn While You Help Friends Find Homes</h2>
          <p style={{color:C.tt,fontSize:13,margin:"0 0 24px"}}>Refer anyone. They book a viewing. You earn <strong style={{color:C.green}}>UGX 20,000</strong> via MTN MoMo. No limits.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:22}}>
            {[["🔗","Share","Copy your unique referral link"],["✅","They Book","Friend pays viewing fee via your link"],["💰","You Earn","UGX 20,000 to MoMo instantly"]].map(([ic,s,d])=>(
              <div key={s} style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:"14px 12px"}}>
                <p style={{fontSize:24,margin:"0 0 6px"}}>{ic}</p>
                <p style={{fontWeight:900,color:C.green,fontSize:13,margin:"0 0 4px"}}>{s}</p>
                <p style={{color:C.tt,fontSize:11,lineHeight:1.5,margin:0}}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <input value={refEmail} onChange={e=>setRefEmail(e.target.value)} placeholder="Your phone or email for referral link"
              style={{flex:1,padding:"11px 14px",borderRadius:11,border:"none",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>{if(refEmail){setRefSent(true);setTimeout(()=>setRefSent(false),3000);}}}
              style={{background:C.green,color:"#fff",border:"none",borderRadius:11,padding:"11px 20px",fontWeight:800,cursor:"pointer",fontSize:13,whiteSpace:"nowrap"}}>
              {refSent?"✅ Sent!":"Get My Link"}
            </button>
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
            {["👩‍💼 Sarah: UGX 80K in 1 week","🧑‍🎓 Mark: 12 friends referred","💰 Top: UGX 400K/month"].map(t=>(
              <span key={t} style={{background:`${C.green}20`,color:"#86EFAC",padding:"4px 12px",borderRadius:20,fontSize:11}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="about-section" style={{maxWidth:1140,margin:"0 auto",padding:"48px 24px"}}>
        <h2 style={{fontWeight:900,fontSize:24,textAlign:"center",margin:"0 0 5px"}}>How RentRight! Works</h2>
        <p style={{textAlign:"center",color:C.ts,margin:"0 0 32px",fontSize:12}}>Simple, safe, fast — search to move-in</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14}}>
          {[{n:"01",ic:"🔍",t:"Search & Filter",d:"Enter area, budget, or lifestyle. GPS or atmosphere modes for precision.",c:C.bL,a:C.blue},
            {n:"02",ic:"🧪",t:"Check the Score",d:"Every listing has a Living Environment Score, Confidence Meter, and trust badges.",c:C.gL,a:C.gD},
            {n:"03",ic:"📅",t:"Book a Viewing",d:"Pay viewing fee via MoMo. Sign digital agreement. Landlord contact unlocked.",c:"#FEF9C3",a:C.yD},
            {n:"04",ic:"🏠",t:"Move In Safely",d:"Inspect first. Rent only after viewing. Our no-scam guarantee has your back.",c:C.rL,a:C.rD}].map(s=>(
            <div key={s.n} style={{background:"#fff",borderRadius:18,padding:"20px 16px",border:`1.5px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:8,right:12,fontWeight:900,fontSize:46,color:`${s.a}10`,lineHeight:1}}>{s.n}</div>
              <div style={{width:42,height:42,background:s.c,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:12}}>{s.ic}</div>
              <p style={{fontWeight:800,fontSize:14,margin:"0 0 5px",color:C.navy}}>{s.t}</p>
              <p style={{color:C.ts,fontSize:12,lineHeight:1.55,margin:0}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{background:C.navy,color:"#fff",padding:"40px 24px 22px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:24,marginBottom:28}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14}}>R</div>
                <span style={{fontWeight:900,fontSize:17}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
              </div>
              <p style={{color:C.tt,fontSize:11,lineHeight:1.6,margin:"0 0 10px"}}>Uganda's verified healthy living marketplace. Verified landlords, GPS-confirmed listings, zero brokers.</p>
              <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",background:"#25D366",color:"#fff",padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,textDecoration:"none"}}>
                💬 WhatsApp Us
              </a>
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 10px"}}>Explore</p>
              {["Browse Listings","Student Hostels","Verified Only","Post a Property","Boost a Listing","Verification Service","Referral Program"].map(l=>(
                <p key={l} onClick={l==="Post a Property"||l.includes("Boost")||l.includes("Verif")?()=>setListModal(true):undefined} style={{color:C.tt,fontSize:11,margin:"0 0 6px",cursor:"pointer"}}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 10px"}}>Popular Areas</p>
              {["Makerere","Ntinda","Kisaasi","Wandegeya","Bukoto","Naguru","Mukono","Entebbe"].map(a=>(
                <p key={a} onClick={()=>{setSearch(a);doSearch();}} style={{color:C.tt,fontSize:11,margin:"0 0 6px",cursor:"pointer"}}>📍 {a}</p>
              ))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 10px"}}>Contact & Legal</p>
              <p style={{color:C.tt,fontSize:11,margin:"0 0 6px"}}>📱 +256 700 000 000</p>
              <p style={{color:C.tt,fontSize:11,margin:"0 0 6px"}}>📧 hello@rentright.ug</p>
              <p style={{color:C.tt,fontSize:11,margin:"0 0 12px"}}>🏢 Kampala, Uganda</p>
              <div style={{background:"rgba(248,113,113,.12)",borderRadius:10,padding:"10px 12px",fontSize:10,color:"#fca5a5",lineHeight:1.6,border:"1px solid rgba(248,113,113,.22)"}}>
                🛡️ <strong>Safety Notice:</strong> RentRight! is an intermediary platform only. Never pay rent before physically viewing and signing a tenancy agreement.
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #1e293b",paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{color:"#475569",fontSize:10,margin:0}}>© 2025 RentRight! Uganda. RentRight! is a listing and matching intermediary only. Not liable for tenant–landlord disputes.</p>
            <div style={{display:"flex",gap:12}}>
              {["Privacy","Terms","Commission Policy","Report Listing","Safety Guide"].map(l=>(
                <span key={l} style={{color:"#475569",fontSize:10,cursor:"pointer"}}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── FIXED BOTTOM ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(248,250,252,.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,padding:"10px 18px",display:"flex",gap:10,zIndex:300}}>
        <button onClick={()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(()=>{setSearch("Near Me");doSearch();},()=>{})}}}
          style={{flex:2,background:C.green,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>📍 Find Near Me</button>
        <button onClick={()=>setListModal(true)} style={{flex:1.5,background:C.navy,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>+ List</button>
        <button onClick={()=>setChatOpen(o=>!o)} style={{flex:1,background:C.blue,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:13,cursor:"pointer"}}>🤖</button>
      </div>

      {/* ── FLOATING WA ── */}
      <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer"
        style={{position:"fixed",bottom:82,right:20,background:"#25D366",color:"#fff",width:50,height:50,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 20px rgba(37,211,102,.4)",zIndex:500,textDecoration:"none"}}>
        💬
      </a>

      {/* ── MODALS ── */}
      {chatOpen&&<AIChat onClose={()=>setChatOpen(false)}/>}
      {selected&&!booking&&!messaging&&!reporting&&(
        <DetailModal l={selected} onClose={()=>setSelected(null)}
          onBook={l=>{setSelected(null);setBooking(l);}}
          onMsg={l=>{setSelected(null);setMessaging(l);}}
          onReport={l=>{setSelected(null);setReporting(l);}}/>
      )}
      {booking&&<BookingModal l={booking} onClose={()=>setBooking(null)}/>}
      {messaging&&<MessageModal l={messaging} paid={!messaging.contactLocked} onClose={()=>setMessaging(null)} onPayFirst={()=>{setMessaging(null);setBooking(messaging);}}/>}
      {reporting&&<ReportModal l={reporting} onClose={()=>setReporting(null)}/>}
      {listModal&&<ListModal onClose={()=>setListModal(false)}/>}
    </div>
  );
}
