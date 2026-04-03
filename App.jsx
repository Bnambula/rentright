import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════ BRAND TOKENS ═══════════════════════════════ */
const C = {
  green:"#22C55E",gL:"#DCFCE7",gD:"#15803D",
  blue:"#38BDF8",bL:"#E0F2FE",bD:"#0369A1",
  yellow:"#FDE68A",yD:"#78350F",
  red:"#F87171",rL:"#FEE2E2",rD:"#991B1B",
  navy:"#0F172A",n2:"#1E293B",n3:"#334155",
  mist:"#F8FAFC",border:"#E2E8F0",
  ts:"#64748B",tt:"#94A3B8",
  purple:"#7C3AED",pL:"#EDE9FE",pD:"#5B21B6",
  gold:"#F59E0B",goldL:"#FEF3C7",
  orange:"#EA580C",oL:"#FFF7ED",
};

/* ═══════════════ LISTINGS DATA ══════════════════════════════ */
const LISTINGS = [
  {id:1,title:"Tranquil Studio, Bukoto",area:"Bukoto",price:420000,type:"Self-Contained",
   vibe:["quiet","secure"],verified:true,photos:true,gps:true,priceOk:true,
   rating:4.9,reviews:44,match:94,boosted:true,contactLocked:true,
   living:{safety:9.2,clean:8.8,access:9.0,noise:"Very Low"},moveIn:"ready",
   amenities:["WiFi","Water","Security","Parking","DSTV"],confidence:98,
   utilities:{electricity:"UMEME metered",water:"NWSC piped",internet:"Fibre ready"},
   neighbourhood:{density:"Moderate – residential",shops:"Supermarket 5 min",transport:"Taxi 3 min",hospital:"IHK 10 min",security:"Gated, guard"},
   desc:"A calm, well-ventilated studio in Bukoto — ideal for a professional or couple. Quiet residential area, easy Acacia Mall access.",
   landlord:"Sarah B.",phone:"07XX XXX XXX",wa:"256700000005",
   img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80",
   referrals:19,nearby:{taxi:"3 min",market:"5 min",campus:"20 min"},
   areaPrice:{min:380000,max:580000},viewingFee:5000,commission:0.05,views:312,agent:false},
  {id:2,title:"Bright Double Room, Kisaasi",area:"Kisaasi",price:350000,type:"Double Room",
   vibe:["city","student"],verified:true,photos:true,gps:true,priceOk:true,
   rating:4.7,reviews:31,match:88,boosted:false,contactLocked:true,
   living:{safety:8.0,clean:8.5,access:9.5,noise:"Low"},moveIn:"ready",
   amenities:["WiFi","Water","Compound"],confidence:91,
   utilities:{electricity:"Prepaid meter",water:"Piped + tank",internet:"MTN home WiFi"},
   neighbourhood:{density:"High – busy area",shops:"Market 8 min",transport:"Taxi 1 min",hospital:"Kampala Hosp 15 min",security:"Landlord on compound"},
   desc:"Bright, well-maintained double room steps from the main road. Excellent transport access — perfect for city workers.",
   landlord:"Grace N.",phone:"07XX XXX XXX",wa:"256700000002",
   img:"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=700&q=80",
   referrals:8,nearby:{taxi:"1 min",market:"8 min",campus:"15 min"},
   areaPrice:{min:280000,max:430000},viewingFee:5000,commission:0.05,views:198,agent:false},
  {id:3,title:"Student Hostel, Wandegeya",area:"Wandegeya",price:175000,type:"Hostel",
   vibe:["student","budget"],verified:true,photos:true,gps:false,priceOk:true,
   rating:4.3,reviews:62,match:91,boosted:true,contactLocked:false,
   living:{safety:7.5,clean:7.0,access:9.8,noise:"Moderate"},moveIn:"ready",
   amenities:["WiFi","Security","Near Campus"],confidence:84,
   utilities:{electricity:"Shared meter",water:"Piped – rationed sometimes",internet:"Shared WiFi"},
   neighbourhood:{density:"Very high – student area",shops:"Many local shops",transport:"Taxi 2 min",hospital:"Mulago 5 min",security:"Gate guard, CCTV"},
   desc:"Affordable hostel 2 mins from Makerere University. Vibrant student community, reliable WiFi, shared kitchen.",
   landlord:"Hostel Admin",phone:"0714 123 456",wa:"256700000003",
   img:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80",
   referrals:29,nearby:{taxi:"2 min",market:"4 min",campus:"2 min"},
   areaPrice:{min:150000,max:220000},viewingFee:5000,commission:0.03,views:421,agent:true},
  {id:4,title:"Spacious Single Room, Ntinda",area:"Ntinda",price:280000,type:"Single Room",
   vibe:["quiet","family"],verified:false,photos:true,gps:false,priceOk:false,
   rating:4.1,reviews:18,match:72,boosted:false,contactLocked:true,
   living:{safety:7.0,clean:7.5,access:8.0,noise:"Low"},moveIn:"viewing",
   amenities:["Water","Compound","Parking"],confidence:52,
   utilities:{electricity:"Prepaid",water:"Borehole nearby",internet:"None confirmed"},
   neighbourhood:{density:"Low – quiet family zone",shops:"Ntinda complex 12 min",transport:"Taxi 7 min",hospital:"Norvik 20 min",security:"Compound wall"},
   desc:"Spacious single room in a family compound. Peaceful environment but awaiting full verification — inspect thoroughly.",
   landlord:"Peter M.",phone:"07XX XXX XXX",wa:"256700000004",
   img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80",
   referrals:5,nearby:{taxi:"7 min",market:"12 min",campus:"25 min"},
   areaPrice:{min:240000,max:380000},viewingFee:5000,commission:0.05,views:87,agent:false},
  {id:5,title:"Modern Bedsitter, Makerere",area:"Makerere",price:240000,type:"Single Room",
   vibe:["student","budget"],verified:true,photos:true,gps:true,priceOk:true,
   rating:4.5,reviews:27,match:89,boosted:false,contactLocked:true,
   living:{safety:8.0,clean:8.2,access:9.2,noise:"Low"},moveIn:"ready",
   amenities:["WiFi","Water","Security"],confidence:93,
   utilities:{electricity:"UMEME prepaid",water:"Piped – reliable",internet:"Airtel 4G strong"},
   neighbourhood:{density:"Moderate – student mix",shops:"Wandegeya market 6 min",transport:"Taxi 4 min",hospital:"Mulago 8 min",security:"Caretaker on site"},
   desc:"Neat, modern bedsitter near Makerere campus. Quiet zone, reliable electricity, walking distance to shops.",
   landlord:"James K.",phone:"07XX XXX XXX",wa:"256700000001",
   img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
   referrals:12,nearby:{taxi:"4 min",market:"6 min",campus:"5 min"},
   areaPrice:{min:200000,max:300000},viewingFee:5000,commission:0.05,views:244,agent:false},
  {id:6,title:"Executive 2BR, Naguru",area:"Naguru",price:850000,type:"Self-Contained",
   vibe:["secure","quiet"],verified:true,photos:true,gps:true,priceOk:true,
   rating:4.8,reviews:22,match:78,boosted:true,contactLocked:true,
   living:{safety:9.5,clean:9.0,access:8.5,noise:"Very Low"},moveIn:"ready",
   amenities:["WiFi","Water","Security","Parking","DSTV","Generator"],confidence:97,
   utilities:{electricity:"Backup generator",water:"NWSC + tank",internet:"Fibre 20Mbps"},
   neighbourhood:{density:"Low – premium residential",shops:"Acacia Mall 15 min",transport:"Taxi 10 min",hospital:"Aga Khan 12 min",security:"24hr guard, electric fence"},
   desc:"Executive 2-bedroom in the quiet hills of Naguru. High-security estate, panoramic views, premium finishes.",
   landlord:"David R.",phone:"07XX XXX XXX",wa:"256700000006",
   img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",
   referrals:7,nearby:{taxi:"10 min",market:"8 min",campus:"30 min"},
   areaPrice:{min:700000,max:1200000},viewingFee:5000,commission:0.05,views:156,agent:true},
];

const LAND_LISTINGS = [
  {id:"L1",title:"1 Acre Plot, Mukono",area:"Mukono",price:45000000,size:"1 acre",
   type:"Residential Plot",verified:true,titleDeed:"Mailo Land",
   img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80",
   desc:"Prime residential plot on Mukono–Kampala highway. Red soil, flat terrain, surveyed and titled.",
   accessFee:50000,agent:"Paul K.",features:["Title deed available","Road access","Water nearby","Electricity on road"]},
  {id:"L2",title:"50×100ft Plot, Wakiso",area:"Wakiso",price:18000000,size:"50×100ft",
   type:"Residential",verified:true,titleDeed:"Freehold",
   img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
   desc:"Affordable freehold plot in fast-growing Wakiso. Ready for immediate construction.",
   accessFee:30000,agent:"Mary A.",features:["Freehold title","Flat terrain","Near trading centre","Borehole access"]},
  {id:"L3",title:"2 Acres, Entebbe Road",area:"Entebbe",price:120000000,size:"2 acres",
   type:"Commercial/Residential",verified:false,titleDeed:"Pending verification",
   img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
   desc:"Large plot fronting Entebbe Road. High commercial potential. Verification in progress.",
   accessFee:100000,agent:"James R.",features:["Main road frontage","2-acre size","Near Lake Victoria","Mixed use potential"]},
];

const MOVING_JOBS = [
  {id:"M1",type:"Hire Movers",icon:"🚛",from:"Kisaasi",to:"Ntinda",date:"2025-08-15",budget:80000,poster:"Aisha N.",status:"open",items:"1 bedroom furniture + boxes",contact:"07XXXXXXXX"},
  {id:"M2",type:"Book Transport",icon:"🚐",from:"Makerere",to:"Mukono",date:"2025-08-18",budget:120000,poster:"Brian M.",status:"open",items:"Sofa, bed, boxes",contact:"07XXXXXXXX"},
  {id:"M3",type:"Find Helpers",icon:"👷",from:"Wandegeya",to:"Bukoto",date:"2025-08-20",budget:50000,poster:"Ruth K.",status:"open",items:"Light items, 2 rooms",contact:"07XXXXXXXX"},
];

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1400&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
];

const MODES=[{id:"student",icon:"🎓",label:"Student"},{id:"home",icon:"🏡",label:"Home"},{id:"shared",icon:"🤝",label:"Shared"},{id:"land",icon:"🌍",label:"Buy Land"},{id:"moving",icon:"🚚",label:"Moving Help"}];
const VIBES=[{id:"quiet",icon:"🌿",label:"Quiet & Peaceful"},{id:"city",icon:"🚶",label:"City Access"},{id:"student",icon:"🎓",label:"Student-Friendly"},{id:"secure",icon:"🛡️",label:"High Security"},{id:"budget",icon:"💸",label:"Budget First"},{id:"family",icon:"🏡",label:"Family Areas"}];
const AMICONS={WiFi:"📶",Water:"💧",Security:"🔒",Parking:"🅿️",DSTV:"📺",Compound:"🌿","Near Campus":"🎓",Generator:"⚡"};

const lc=s=>s>=8.5?C.green:s>=7?C.blue:C.yellow;
const ll=s=>s>=8.5?"Excellent":s>=7?"Good":"Fair";
const miInfo=m=>m==="ready"?{bg:C.gL,color:C.gD,icon:"🟢",label:"Move-in Ready"}:m==="viewing"?{bg:"#FEF9C3",color:"#854D0E",icon:"🟡",label:"Needs Viewing"}:{bg:C.rL,color:C.rD,icon:"🔴",label:"Renovation"};
const confCol=s=>s>=85?C.green:s>=65?C.blue:s>=40?C.gold:C.red;
const avgScore=l=>+((l.living.safety+l.living.clean+l.living.access)/3).toFixed(1);

function ScoreRing({score,size=52}){
  const r=size*.38,circ=2*Math.PI*r,col=lc(score),fs=size*.23;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={size*.07}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={size*.07}
          strokeDasharray={circ} strokeDashoffset={circ*(1-score/10)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2+fs*.38} textAnchor="middle" fontSize={fs} fontWeight={700} fill={col}>{score}</text>
      </svg>
      <span style={{fontSize:9,color:col,fontWeight:700,marginTop:1}}>{ll(score)}</span>
    </div>
  );
}

function Btn({children,bg,color="#fff",onClick,style={},disabled=false}){
  return(
    <button onClick={onClick} disabled={disabled}
      style={{background:disabled?"#e2e8f0":bg,color:disabled?C.ts:color,border:"none",borderRadius:13,padding:"11px 18px",fontWeight:700,cursor:disabled?"default":"pointer",fontSize:14,transition:"all .18s",fontFamily:"inherit",...style}}>
      {children}
    </button>
  );
}

/* ═══════════════ ADMIN PANEL ════════════════════════════════ */
function AdminPanel({onClose}){
  const [tab,setTab]=useState("overview");
  const [settings,setSettings]=useState({viewingFee:5000,referralPayout:5000,withdrawMin:20000,landAccessFee:50000,movingCommission:8,boostPrice7:25000,boostPrice30:50000,verifyPrice:40000});
  const [saved,setSaved]=useState(false);
  const s=k=>e=>setSettings(p=>({...p,[k]:parseInt(e.target.value)||0}));

  const stats={listings:LISTINGS.length,users:2847,revenue:4280000,pending:15,flagged:3,agents:12,movingJobs:MOVING_JOBS.length,landListings:LAND_LISTINGS.length};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.9)",zIndex:20000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.n2,borderRadius:24,width:"100%",maxWidth:780,maxHeight:"96vh",overflowY:"auto",boxShadow:"0 40px 90px rgba(0,0,0,.5)"}}>
        {/* Header */}
        <div style={{background:C.navy,padding:"16px 22px",borderRadius:"24px 24px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1e293b"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.red},${C.purple})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚙️</div>
            <div><p style={{color:"#fff",fontWeight:900,fontSize:16,margin:0}}>RentRight! Admin</p><p style={{color:C.tt,fontSize:11,margin:0}}>Internal control panel · Restricted access</p></div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16}}>×</button>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid #1e293b",background:C.navy}}>
          {[["overview","📊 Overview"],["listings","🏠 Listings"],["users","👤 Users"],["moving","🚚 Moving Jobs"],["settings","⚙️ Settings"]].map(([k,lb])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px 0",fontSize:11,fontWeight:700,background:"transparent",border:"none",borderBottom:`2.5px solid ${tab===k?C.green:"transparent"}`,color:tab===k?C.green:C.ts,cursor:"pointer"}}>{lb}</button>
          ))}
        </div>

        <div style={{padding:"20px 22px"}}>

          {/* OVERVIEW */}
          {tab==="overview"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
                {[["🏠","Active Listings",stats.listings,C.green],["👤","Registered Users",stats.users.toLocaleString(),C.blue],["💰","Total Revenue","UGX "+stats.revenue.toLocaleString(),C.gold],["⏳","Pending Reviews",stats.pending,C.yellow],["🚨","Flagged Listings",stats.flagged,C.red],["🏢","Verified Agents",stats.agents,C.purple],["🚚","Moving Jobs",stats.movingJobs,C.orange],["🌍","Land Listings",stats.landListings,C.green]].map(([ic,lb,val,col])=>(
                  <div key={lb} style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:"14px 12px",border:`1px solid rgba(255,255,255,.08)`}}>
                    <p style={{fontSize:20,margin:"0 0 4px"}}>{ic}</p>
                    <p style={{fontWeight:900,fontSize:16,color:col,margin:0}}>{val}</p>
                    <p style={{fontSize:10,color:C.tt,margin:0}}>{lb}</p>
                  </div>
                ))}
              </div>
              {/* Revenue breakdown */}
              <div style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:"16px",border:"1px solid rgba(255,255,255,.08)",marginBottom:14}}>
                <p style={{color:"#fff",fontWeight:800,fontSize:13,margin:"0 0 12px"}}>💰 Revenue Breakdown (This Month)</p>
                {[["Viewing Fees (tenants)","UGX 1,240,000","248 payments"],["Boost Fees (landlords)","UGX 975,000","39 boosts"],["Moving Commissions (8%)","UGX 640,000","16 jobs"],["Agent Verify Services","UGX 480,000","12 agents"],["Land Access Fees","UGX 945,000","19 queries"]].map(([lb,amt,sub])=>(
                  <div key={lb} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                    <div><p style={{color:"#e2e8f0",fontSize:12,fontWeight:600,margin:0}}>{lb}</p><p style={{color:C.tt,fontSize:10,margin:0}}>{sub}</p></div>
                    <p style={{color:C.gold,fontWeight:800,fontSize:13,margin:0}}>{amt}</p>
                  </div>
                ))}
              </div>
              {/* Fraud alerts */}
              <div style={{background:"rgba(248,113,113,.1)",borderRadius:14,padding:"14px",border:"1px solid rgba(248,113,113,.2)"}}>
                <p style={{color:"#fca5a5",fontWeight:800,fontSize:13,margin:"0 0 10px"}}>🚨 Fraud Alerts</p>
                {[["Ntinda listing","Same phone posted 3 houses in 1 day","Freeze"],["Wandegeya agent","GPS mismatch detected","Investigate"],["Bukoto #44","Price 60% below market average","Review"]].map(([listing,reason,action])=>(
                  <div key={listing} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,.05)",borderRadius:10,padding:"9px 12px",marginBottom:7}}>
                    <div><p style={{color:"#fff",fontSize:12,fontWeight:700,margin:0}}>{listing}</p><p style={{color:"#fca5a5",fontSize:10,margin:0}}>{reason}</p></div>
                    <button style={{background:C.rD,color:"#fff",border:"none",borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer"}}>{action}</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* LISTINGS */}
          {tab==="listings"&&(
            <>
              <p style={{color:"#fff",fontWeight:800,fontSize:14,margin:"0 0 14px"}}>All Listings ({LISTINGS.length})</p>
              {LISTINGS.map(l=>(
                <div key={l.id} style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,.08)",display:"flex",gap:12,alignItems:"center"}}>
                  <img src={l.img} alt="" style={{width:50,height:50,borderRadius:10,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{color:"#fff",fontWeight:700,fontSize:13,margin:0}}>{l.title}</p>
                    <p style={{color:C.tt,fontSize:10,margin:0}}>UGX {l.price.toLocaleString()}/mo · {l.confidence}% trust · {l.views} views</p>
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <span style={{background:l.verified?C.gL:C.rL,color:l.verified?C.gD:C.rD,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>{l.verified?"✔ Verified":"⚠ Unverified"}</span>
                    {l.boosted&&<span style={{background:"#FEF3C7",color:"#78350F",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>🚀 Boosted</span>}
                    <button style={{background:C.rL,color:C.rD,border:"none",borderRadius:8,padding:"3px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>Freeze</button>
                    <button style={{background:C.bL,color:C.bD,border:"none",borderRadius:8,padding:"3px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>Edit</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* USERS */}
          {tab==="users"&&(
            <>
              <p style={{color:"#fff",fontWeight:800,fontSize:14,margin:"0 0 14px"}}>Recent Users</p>
              {[{name:"Aisha Nakato",role:"Tenant",joined:"Today",status:"active",referrals:3,spent:15000},{name:"Brian Mukasa",role:"Landlord",joined:"Yesterday",status:"active",referrals:0,spent:25000},{name:"Grace Nambi",role:"Agent",joined:"2 days ago",status:"pending",referrals:7,spent:40000},{name:"Peter Okello",role:"Mover",joined:"3 days ago",status:"active",referrals:0,spent:0},{name:"Ruth Atim",role:"Tenant",joined:"1 week ago",status:"active",referrals:1,spent:5000}].map((u,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,.08)",display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.blue},${C.green})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14,flexShrink:0}}>{u.name[0]}</div>
                  <div style={{flex:1}}>
                    <p style={{color:"#fff",fontWeight:700,fontSize:12,margin:0}}>{u.name}</p>
                    <p style={{color:C.tt,fontSize:10,margin:0}}>{u.role} · Joined {u.joined} · {u.referrals} referrals · UGX {u.spent.toLocaleString()} spent</p>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <span style={{background:u.status==="active"?C.gL:C.goldL,color:u.status==="active"?C.gD:C.yD,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>{u.status==="active"?"✔ Active":"⏳ Pending"}</span>
                    <button style={{background:C.rL,color:C.rD,border:"none",borderRadius:8,padding:"3px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>Suspend</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* MOVING JOBS */}
          {tab==="moving"&&(
            <>
              <p style={{color:"#fff",fontWeight:800,fontSize:14,margin:"0 0 14px"}}>Moving Job Board</p>
              {MOVING_JOBS.map(j=>(
                <div key={j.id} style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,.08)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><p style={{color:"#fff",fontWeight:700,fontSize:13,margin:0}}>{j.icon} {j.type}</p><p style={{color:C.tt,fontSize:10,margin:0}}>{j.from} → {j.to} · {j.date} · {j.poster}</p></div>
                    <div style={{textAlign:"right"}}>
                      <p style={{color:C.gold,fontWeight:800,fontSize:14,margin:0}}>UGX {j.budget.toLocaleString()}</p>
                      <p style={{color:C.tt,fontSize:9,margin:0}}>8% commission = UGX {Math.round(j.budget*.08).toLocaleString()}</p>
                    </div>
                  </div>
                  <p style={{color:"#cbd5e1",fontSize:11,margin:"6px 0 0"}}>{j.items}</p>
                  <div style={{display:"flex",gap:5,marginTop:8}}>
                    <span style={{background:C.gL,color:C.gD,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>Open</span>
                    <button style={{background:C.rL,color:C.rD,border:"none",borderRadius:8,padding:"3px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>Remove</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* SETTINGS */}
          {tab==="settings"&&(
            <>
              <p style={{color:"#fff",fontWeight:800,fontSize:14,margin:"0 0 16px"}}>⚙️ Platform Fee Settings</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                {[["Viewing Fee (UGX)","viewingFee"],["Referral Payout (UGX)","referralPayout"],["Min Withdrawal (UGX)","withdrawMin"],["Land Access Fee (UGX)","landAccessFee"],["Moving Commission (%)","movingCommission"],["Boost 7 Days (UGX)","boostPrice7"],["Boost 30 Days (UGX)","boostPrice30"],["Verify Service (UGX)","verifyPrice"]].map(([lb,key])=>(
                  <div key={key}>
                    <label style={{fontSize:11,fontWeight:700,color:C.tt,display:"block",marginBottom:4}}>{lb}</label>
                    <input type="number" value={settings[key]} onChange={s(key)}
                      style={{width:"100%",padding:"9px 12px",borderRadius:11,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:11,color:C.tt,lineHeight:1.7,border:"1px solid rgba(255,255,255,.08)"}}>
                ⚠️ Fee changes apply to all new transactions immediately. Existing bookings are not affected. Always test on staging before changing moving commission or land access fees.
              </div>
              {!saved
                ?<Btn bg={C.green} onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} style={{width:"100%"}}>💾 Save All Settings</Btn>
                :<div style={{background:C.gL,borderRadius:12,padding:"12px",textAlign:"center",color:C.gD,fontWeight:700}}>✅ Settings saved successfully!</div>
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MOVE-IN RECOMMENDATIONS ════════════════════ */
function MoveInRecommendations({listing,onClose}){
  const [step,setStep]=useState("welcome");
  const checklist=[
    {cat:"🔐 Security",items:["Change or verify door locks","Meet your neighbours","Get landlord's emergency contact","Note nearest police post"]},
    {cat:"💡 Utilities",items:["Register UMEME meter in your name","Activate NWSC water account","Test all electrical sockets","Check water pressure and storage"]},
    {cat:"🧹 First Week",items:["Deep clean before moving furniture","Check for pests or damp","Take photos of existing damage (send to landlord)","Test WiFi and TV connections"]},
    {cat:"📋 Documents",items:["Sign tenancy agreement (get a copy)","Keep rent payment receipts","Note rent due date","Get landlord's WhatsApp for communication"]},
    {cat:"🛒 Essentials to Buy",items:["Cooking gas or electric cooker","Water jerrycans (backup)","Padlock for door/gate","Extension socket"]},
    {cat:"🚌 Know Your Area",items:["Nearest taxi stage and routes","Nearest hospital / clinic","Nearest supermarket and pharmacy","Nearest mobile money agent"]},
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.82)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}}>
      <div style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:520,maxHeight:"94vh",overflowY:"auto",boxShadow:"0 40px 90px rgba(0,0,0,.35)"}}>
        <div style={{background:`linear-gradient(135deg,${C.gD},${C.green})`,padding:"18px 22px",borderRadius:"26px 26px 0 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{color:"#fff",fontWeight:900,fontSize:17,margin:0}}>🏠 Congratulations!</p>
            <p style={{color:"rgba(255,255,255,.8)",fontSize:12,margin:"2px 0 0"}}>You rented: {listing?.title}</p>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
        </div>

        <div style={{padding:"20px 22px"}}>
          {step==="welcome"&&(
            <>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{fontSize:52,marginBottom:8}}>🎉</div>
                <p style={{fontWeight:900,fontSize:18,color:C.navy,margin:"0 0 6px"}}>Your new home awaits!</p>
                <p style={{fontSize:13,color:C.ts,margin:"0 0 18px",lineHeight:1.6}}>We've prepared a personalised move-in guide for <strong>{listing?.area}</strong>, plus recommendations to make your transition smooth and stress-free.</p>
              </div>
              {/* Quick recommendations */}
              <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:"0 0 10px"}}>🚀 We can help you with:</p>
              {[{icon:"🚛",title:"Hire Movers",desc:"Professional movers near "+listing?.area,action:"moving"},
                {icon:"🚐",title:"Book Transport",desc:"Vehicles for your furniture",action:"moving"},
                {icon:"👷",title:"Find Packing Helpers",desc:"Reliable helpers by the hour",action:"moving"},
                {icon:"🛒",title:"Home Essentials",desc:"Checklist of what to buy first",action:"checklist"},
                {icon:"📋",title:"Move-In Checklist",desc:"Step-by-step guide for your first week",action:"checklist"},
              ].map(r=>(
                <button key={r.title} onClick={()=>setStep(r.action)}
                  style={{width:"100%",background:C.mist,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",display:"flex",gap:12,alignItems:"center",marginBottom:8,cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:26,flexShrink:0}}>{r.icon}</span>
                  <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13,color:C.navy,margin:0}}>{r.title}</p><p style={{fontSize:11,color:C.ts,margin:0}}>{r.desc}</p></div>
                  <span style={{color:C.blue,fontSize:18}}>→</span>
                </button>
              ))}
            </>
          )}

          {step==="checklist"&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <button onClick={()=>setStep("welcome")} style={{background:C.mist,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.n3}}>← Back</button>
                <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:0}}>📋 Move-In Checklist</p>
              </div>
              {checklist.map(cat=>(
                <div key={cat.cat} style={{background:C.mist,borderRadius:14,padding:"12px 14px",marginBottom:10,border:`1px solid ${C.border}`}}>
                  <p style={{fontWeight:800,fontSize:12,color:C.navy,margin:"0 0 8px"}}>{cat.cat}</p>
                  {cat.items.map(item=>(
                    <label key={item} style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer",marginBottom:6}}>
                      <input type="checkbox" style={{marginTop:2,accentColor:C.green,flexShrink:0}}/>
                      <span style={{fontSize:12,color:C.n3,lineHeight:1.4}}>{item}</span>
                    </label>
                  ))}
                </div>
              ))}
              <Btn bg={C.navy} onClick={onClose} style={{width:"100%"}}>Done — I'm ready to move in! 🏠</Btn>
            </>
          )}

          {step==="moving"&&<MovingOfferCreator fromArea={listing?.area} onBack={()=>setStep("welcome")} onClose={onClose}/>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MOVING OFFER CREATOR ══════════════════════ */
function MovingOfferCreator({fromArea,onBack,onClose}){
  const [form,setForm]=useState({type:"Hire Movers",from:fromArea||"",to:"",date:"",budget:"",items:"",name:"",phone:""});
  const [submitted,setSubmitted]=useState(false);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const allOk=form.from&&form.to&&form.date&&form.budget&&form.name&&form.phone;

  if(submitted)return(
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:52,marginBottom:10}}>✅</div>
      <p style={{fontWeight:900,fontSize:18,color:C.gD,margin:"0 0 6px"}}>Job Posted!</p>
      <p style={{fontSize:13,color:C.ts,margin:"0 0 16px",lineHeight:1.6}}>Your moving job is now live on the RentRight! board. Providers in your area will see it and can accept. You'll be notified when someone accepts — and their details are revealed after they pay the 8% commission.</p>
      <Btn bg={C.navy} onClick={onClose} style={{padding:"11px 28px"}}>Done ✓</Btn>
    </div>
  );

  return(
    <>
      {onBack&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><button onClick={onBack} style={{background:C.mist,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.n3}}>← Back</button><p style={{fontWeight:800,fontSize:15,color:C.navy,margin:0}}>🚚 Create Moving Job</p></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[["Service type","type",["Hire Movers","Book Transport","Find Helpers"],"select"],["Moving from",form.from,f("from"),"text"],["Moving to",form.to,f("to"),"text"],["Date",form.date,f("date"),"date"]].map(([lb,val,fn,tp])=>(
          <div key={lb}>
            <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
            {tp==="select"
              ?<select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",outline:"none"}}>
                {fn.map(o=><option key={o}>{o}</option>)}
              </select>
              :<input value={typeof val==="string"?val:""} onChange={fn} type={tp} style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${typeof val==="string"&&val?C.green:C.border}`,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
            }
          </div>
        ))}
      </div>
      <div style={{marginBottom:10}}>
        <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Items to move</label>
        <input value={form.items} onChange={f("items")} placeholder="e.g. 1 bedroom furniture, boxes, fridge" style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
      </div>
      <div style={{marginBottom:10}}>
        <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Your budget (UGX) *</label>
        <input value={form.budget} onChange={f("budget")} type="number" placeholder="e.g. 80000" style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${form.budget?C.green:C.border}`,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
        {form.budget&&<p style={{fontSize:10,color:C.ts,margin:"3px 0 0"}}>Provider pays 8% commission = UGX {Math.round(parseInt(form.budget||0)*.08).toLocaleString()} to RentRight! on acceptance</p>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[["Your name *",form.name,f("name"),"text"],["Phone number *",form.phone,f("phone"),"tel"]].map(([lb,val,fn,tp])=>(
          <div key={lb}><label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label><input value={val} onChange={fn} type={tp} placeholder={lb.replace(" *","")} style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${val?C.green:C.border}`,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/></div>
        ))}
      </div>
      <div style={{background:C.bL,borderRadius:12,padding:"10px 14px",fontSize:11,color:C.bD,marginBottom:14,lineHeight:1.6}}>
        🔒 <strong>Privacy protection:</strong> Your contact details (name + phone) are only shown to a provider AFTER they pay the 8% platform commission via Mobile Money. You will be notified when a provider accepts.
      </div>
      <Btn bg={allOk?`linear-gradient(135deg,${C.orange},${C.gold})`:"#e2e8f0"} color={allOk?"#fff":C.ts} disabled={!allOk} onClick={()=>setSubmitted(true)} style={{width:"100%",fontSize:15}}>
        🚚 Post Moving Job
      </Btn>
    </>
  );
}

/* ═══════════════ MOVING MARKETPLACE ════════════════════════ */
function MovingMarketplace({user,onNeedAuth,onClose}){
  const [view,setView]=useState("board"); // board | provider_signup | create_offer | accept
  const [acceptJob,setAcceptJob]=useState(null);
  const [momoNum,setMomoNum]=useState(""); const [paying,setPaying]=useState(false); const [unlocked,setUnlocked]=useState(false);
  const [provForm,setProvForm]=useState({name:"",phone:"",service:"Movers",area:"",nin:"",experience:""});
  const [provSubmitted,setProvSubmitted]=useState(false);
  const pf=k=>e=>setProvForm(p=>({...p,[k]:e.target.value}));

  const handlePay=(job)=>{
    if(momoNum.length<10)return;
    setPaying(true);
    setTimeout(()=>{setPaying(false);setUnlocked(true);},2200);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.82)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={view==="board"?onClose:undefined}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:560,maxHeight:"95vh",overflowY:"auto",boxShadow:"0 40px 90px rgba(0,0,0,.35)"}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${C.orange},${C.gold})`,padding:"16px 22px",borderRadius:"26px 26px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:900,fontSize:16,margin:0}}>🚚 Moving Services</p><p style={{color:"rgba(255,255,255,.8)",fontSize:11,margin:0}}>Find movers or post a job — anywhere in Uganda</p></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
        </div>
        {/* Sub-tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.mist}}>
          {[["board","📋 Job Board"],["create_offer","➕ Post a Job"],["provider_signup","🚛 Offer Services"]].map(([k,lb])=>(
            <button key={k} onClick={()=>{setView(k);setUnlocked(false);setAcceptJob(null);}} style={{flex:1,padding:"10px 0",fontSize:11,fontWeight:700,background:"transparent",border:"none",borderBottom:`2.5px solid ${view===k?C.orange:"transparent"}`,color:view===k?C.orange:C.ts,cursor:"pointer"}}>{lb}</button>
          ))}
        </div>
        <div style={{padding:"20px 22px"}}>

          {/* JOB BOARD */}
          {view==="board"&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 4px"}}>Open Moving Jobs Near You</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 16px"}}>Accept a job → pay 8% commission via MoMo → get client details instantly.</p>
              {MOVING_JOBS.map(job=>(
                <div key={job.id} style={{background:C.mist,borderRadius:16,padding:"14px 16px",marginBottom:12,border:`1.5px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><p style={{fontWeight:800,fontSize:14,color:C.navy,margin:0}}>{job.icon} {job.type}</p><p style={{fontSize:11,color:C.ts,margin:"2px 0 0"}}>📍 {job.from} → {job.to} · 📅 {job.date}</p></div>
                    <div style={{textAlign:"right"}}><p style={{fontWeight:900,fontSize:16,color:C.orange,margin:0}}>UGX {job.budget.toLocaleString()}</p><p style={{fontSize:9,color:C.ts,margin:0}}>8% fee = UGX {Math.round(job.budget*.08).toLocaleString()}</p></div>
                  </div>
                  <p style={{fontSize:12,color:C.n3,margin:"0 0 10px"}}>📦 {job.items}</p>
                  <div style={{background:"rgba(15,23,42,.04)",borderRadius:10,padding:"8px 12px",fontSize:11,color:C.ts,marginBottom:10}}>
                    🔒 Client name and phone revealed after paying the 8% platform fee via Mobile Money.
                  </div>
                  {acceptJob?.id===job.id?(
                    unlocked?(
                      <div style={{background:C.gL,borderRadius:12,padding:"12px 14px"}}>
                        <p style={{fontWeight:800,color:C.gD,fontSize:13,margin:"0 0 6px"}}>✅ Job Unlocked! Client Details:</p>
                        <p style={{fontSize:12,color:C.n3,margin:0}}><strong>Name:</strong> {job.poster}<br/><strong>Phone:</strong> 0712 345 678<br/><strong>Location:</strong> {job.from}<br/><strong>Date:</strong> {job.date}</p>
                        <a href={`https://wa.me/256712345678?text=Hi! I accepted your moving job on RentRight! I'm ready to help with your move from ${job.from} to ${job.to}.`} target="_blank" rel="noopener noreferrer"
                          style={{display:"block",background:"#25D366",color:"#fff",borderRadius:12,padding:"10px 0",fontWeight:700,fontSize:13,textDecoration:"none",textAlign:"center",marginTop:10}}>
                          💬 Contact Client on WhatsApp
                        </a>
                      </div>
                    ):(
                      <div>
                        <p style={{fontSize:12,color:C.navy,fontWeight:700,margin:"0 0 8px"}}>Pay commission to unlock client details:</p>
                        <input value={momoNum} onChange={e=>setMomoNum(e.target.value)} placeholder="MTN/Airtel MoMo number" style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${C.border}`,fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>setAcceptJob(null)} style={{flex:1,background:C.mist,color:C.n3,border:`1px solid ${C.border}`,borderRadius:11,padding:"9px 0",fontWeight:600,cursor:"pointer",fontSize:12}}>Cancel</button>
                          <button disabled={paying||momoNum.length<10} onClick={()=>handlePay(job)} style={{flex:2,background:momoNum.length>=10&&!paying?"#F59E0B":"#e2e8f0",color:momoNum.length>=10||paying?"#1a0a00":C.ts,border:"none",borderRadius:11,padding:"9px 0",fontWeight:800,cursor:momoNum.length>=10&&!paying?"pointer":"default",fontSize:13}}>
                            {paying?"Processing…":"💳 Pay UGX "+Math.round(job.budget*.08).toLocaleString()}
                          </button>
                        </div>
                      </div>
                    )
                  ):(
                    <button onClick={()=>{if(!user){onNeedAuth("signup");return;}setAcceptJob(job);setMomoNum("");setUnlocked(false);}}
                      style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.gold})`,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                      ✋ Accept This Job
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          {/* CREATE OFFER */}
          {view==="create_offer"&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 4px"}}>Post a Moving Job</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Anyone can post — even if you didn't find your property through RentRight!</p>
              <MovingOfferCreator onClose={onClose}/>
            </>
          )}

          {/* PROVIDER SIGNUP */}
          {view==="provider_signup"&&(
            !provSubmitted?(
              <>
                <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 4px"}}>Register as a Moving Provider</p>
                <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Sign up to access moving jobs in your area. You pay 8% of the job value to RentRight! only when you accept a job.</p>
                <div style={{background:C.goldL,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:C.yD,lineHeight:1.6}}>
                  💡 <strong>How it works:</strong> Browse open jobs → Accept one you like → Pay 8% commission via MoMo → Client details revealed instantly → Complete the job → Get paid directly by client.
                </div>
                {[["Full name *",provForm.name,pf("name"),"text"],["Phone number *",provForm.phone,pf("phone"),"tel"],["National ID (NIN) *",provForm.nin,pf("nin"),"text"],["Area you operate in *",provForm.area,pf("area"),"text"],["Years of experience",provForm.experience,pf("experience"),"text"]].map(([lb,val,fn,tp])=>(
                  <div key={lb} style={{marginBottom:10}}>
                    <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                    <input value={val} onChange={fn} type={tp} placeholder={lb.replace(" *","")} style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${val?C.green:C.border}`,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                  </div>
                ))}
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Service type *</label>
                  <select value={provForm.service} onChange={e=>setProvForm(p=>({...p,service:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:11,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",outline:"none"}}>
                    {["Movers (with truck)","Transport vehicle only","Packing helpers (manual labour)","All services"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <Btn bg={provForm.name&&provForm.phone&&provForm.nin&&provForm.area?`linear-gradient(135deg,${C.orange},${C.gold})`:"#e2e8f0"} color={provForm.name&&provForm.phone&&provForm.nin&&provForm.area?"#fff":C.ts}
                  disabled={!provForm.name||!provForm.phone||!provForm.nin||!provForm.area}
                  onClick={()=>setProvSubmitted(true)} style={{width:"100%"}}>Register as Provider 🚛</Btn>
              </>
            ):(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:52,marginBottom:8}}>✅</div>
                <p style={{fontWeight:900,fontSize:18,color:C.gD,margin:"0 0 6px"}}>You're Registered!</p>
                <p style={{fontSize:13,color:C.ts,margin:"0 0 16px",lineHeight:1.6}}>Welcome to the RentRight! Moving network. Browse the Job Board tab to find and accept moving jobs near you. Remember: you only pay 8% when you accept a job.</p>
                <Btn bg={C.orange} onClick={()=>{setProvSubmitted(false);setView("board");}} style={{padding:"11px 28px"}}>Browse Jobs →</Btn>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ LAND BUYING ════════════════════════════════ */
function LandMarketplace({user,onNeedAuth,onClose}){
  const [selected,setSelected]=useState(null);
  const [paying,setPaying]=useState(false); const [paid,setPaid]=useState(false);
  const [momo,setMomo]=useState(""); const [agreed,setAgreed]=useState(false);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.82)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={!selected?onClose:undefined}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:580,maxHeight:"95vh",overflowY:"auto",boxShadow:"0 40px 90px rgba(0,0,0,.35)"}}>
        <div style={{background:`linear-gradient(135deg,${C.gD},#065f46)`,padding:"16px 22px",borderRadius:"26px 26px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:900,fontSize:16,margin:0}}>🌍 Land & Property</p><p style={{color:"rgba(255,255,255,.75)",fontSize:11,margin:0}}>Verified landowners only · Pay to unlock full details</p></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
        </div>

        <div style={{padding:"20px 22px"}}>
          {!selected?(
            <>
              <div style={{background:`linear-gradient(135deg,${C.gL},${C.bL})`,borderRadius:14,padding:"12px 14px",marginBottom:16,fontSize:12,color:C.n3,lineHeight:1.6}}>
                🛡️ <strong>How Land Listings Work:</strong> We show you general info (area, size, features) for free. To get the exact location, owner contact, and title deed details, pay a small access fee via MoMo. Only verified landowners with proven documentation are listed.
              </div>
              {LAND_LISTINGS.map(land=>(
                <div key={land.id} style={{background:C.mist,borderRadius:18,overflow:"hidden",border:`1.5px solid ${C.border}`,marginBottom:14}}>
                  <div style={{position:"relative"}}>
                    <img src={land.img} alt={land.title} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(15,23,42,.6) 0%,transparent 50%)"}}/>
                    <div style={{position:"absolute",top:10,left:10,display:"flex",gap:5}}>
                      {land.verified&&<span style={{background:C.gL,color:C.gD,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20}}>✔ Verified Owner</span>}
                      <span style={{background:C.bL,color:C.bD,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>{land.titleDeed}</span>
                    </div>
                    <div style={{position:"absolute",bottom:10,right:10,background:"rgba(15,23,42,.88)",color:"#fff",fontWeight:900,fontSize:13,padding:"3px 12px",borderRadius:20}}>UGX {land.price.toLocaleString()}</div>
                  </div>
                  <div style={{padding:"12px 14px"}}>
                    <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:0}}>{land.title}</p>
                    <p style={{fontSize:11,color:C.ts,margin:"2px 0 8px"}}>📍 {land.area} · {land.size} · {land.type}</p>
                    <p style={{fontSize:12,color:C.n3,margin:"0 0 10px",lineHeight:1.5}}>{land.desc}</p>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                      {land.features.map(f=><span key={f} style={{background:C.gL,color:C.gD,fontSize:10,padding:"2px 9px",borderRadius:20}}>✓ {f}</span>)}
                    </div>
                    <div style={{background:"linear-gradient(135deg,#f0fdf4,#e0f2fe)",borderRadius:12,padding:"10px 12px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:22}}>🔒</span>
                      <div style={{flex:1}}><p style={{fontWeight:700,fontSize:12,color:C.navy,margin:0}}>Exact location + owner contact locked</p><p style={{fontSize:10,color:C.ts,margin:0}}>Pay UGX {land.accessFee.toLocaleString()} to unlock full details</p></div>
                    </div>
                    <button onClick={()=>{if(!user){onNeedAuth("signup");return;}setSelected(land);setPaid(false);setMomo("");setAgreed(false);}}
                      style={{width:"100%",background:`linear-gradient(135deg,${C.gD},${C.green})`,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                      🌍 Pay UGX {land.accessFee.toLocaleString()} — View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </>
          ):(
            /* LAND DETAIL + PAYMENT */
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <button onClick={()=>{setSelected(null);setPaid(false);}} style={{background:C.mist,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.n3}}>← Back</button>
                <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:0}}>{selected.title}</p>
              </div>
              {!paid?(
                <>
                  <div style={{background:C.mist,borderRadius:14,padding:"14px",marginBottom:12,fontSize:11,lineHeight:1.8,color:C.n3,border:`1px solid ${C.border}`}}>
                    <strong>Land Access Agreement</strong><br/><br/>
                    1. The access fee of UGX {selected.accessFee.toLocaleString()} is non-refundable once paid.<br/>
                    2. Full location and owner contact are revealed only after payment confirmation.<br/>
                    3. RentRight! is an intermediary only — all transactions are between buyer and landowner.<br/>
                    4. Conduct independent due diligence. Verify title deeds at the Lands Registry.<br/>
                    5. Never pay land purchase money without a lawyer and proper land search.
                  </div>
                  <label style={{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer",marginBottom:14}}>
                    <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.green,flexShrink:0}}/>
                    <span style={{fontSize:11,color:C.n3,lineHeight:1.5}}>I understand this is an access fee only. I will conduct independent legal verification before purchasing.</span>
                  </label>
                  {agreed&&(
                    <>
                      <input value={momo} onChange={e=>setMomo(e.target.value)} placeholder="MTN / Airtel MoMo number" style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:14,marginBottom:10,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                      <button disabled={paying||momo.length<10||!agreed} onClick={()=>{if(momo.length<10)return;setPaying(true);setTimeout(()=>{setPaying(false);setPaid(true);},2200);}}
                        style={{width:"100%",background:momo.length>=10&&!paying?"#F59E0B":"#e2e8f0",color:momo.length>=10||paying?"#1a0a00":C.ts,border:"none",borderRadius:14,padding:"13px 0",fontWeight:800,fontSize:15,cursor:momo.length>=10&&!paying?"pointer":"default",fontFamily:"inherit"}}>
                        {paying?"Processing…":"💳 Pay UGX "+selected.accessFee.toLocaleString()+" to Unlock"}
                      </button>
                    </>
                  )}
                </>
              ):(
                <div>
                  <div style={{background:C.gL,borderRadius:16,padding:"16px",marginBottom:14}}>
                    <p style={{fontWeight:800,color:C.gD,fontSize:14,margin:"0 0 12px"}}>✅ Full Details Unlocked</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                      {[["Title","Mailo Land · Block 244, Plot 12"],["Exact Location","Mukono–Kampala Highway, 2km after Namanve"],["GPS","0.3821°N, 32.6184°E"],["Owner",selected.agent],["Owner Phone","0712 345 678"],["Surveyor","James Okello & Associates"]].map(([k,v])=>(
                        <div key={k} style={{background:"#fff",borderRadius:10,padding:"9px 12px",border:`1px solid ${C.border}`}}>
                          <p style={{fontSize:9,color:C.ts,margin:0}}>{k}</p>
                          <p style={{fontWeight:700,color:C.navy,fontSize:11,margin:0}}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:"#FEF9C3",borderRadius:12,padding:"12px 14px",fontSize:12,color:C.yD,marginBottom:14,lineHeight:1.6}}>
                    ⚠️ <strong>Important Legal Advice:</strong> Before paying any money to the landowner, conduct a land search at the Uganda Land Registry, hire a licensed lawyer, and verify boundary markers with a registered surveyor.
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <a href={`https://wa.me/256712345678?text=Hi! I got your land listing details from RentRight!. I'm interested in "${selected.title}".`} target="_blank" rel="noopener noreferrer"
                      style={{background:"#25D366",color:"#fff",borderRadius:13,padding:"12px 0",fontWeight:800,fontSize:13,textDecoration:"none",textAlign:"center",display:"block"}}>
                      💬 WhatsApp Owner
                    </a>
                    <button onClick={()=>{setSelected(null);setPaid(false);}} style={{background:C.navy,color:"#fff",border:"none",borderRadius:13,padding:"12px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>← More Land</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ AUTH MODAL ═════════════════════════════════ */
function AuthModal({mode,onClose,onAuth}){
  const [tab,setTab]=useState(mode||"login");
  const [role,setRole]=useState("tenant");
  const [form,setForm]=useState({name:"",email:"",phone:"",password:"",referral:""});
  const [loading,setLoading]=useState(false);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  // Secret admin access
  const handleSubmit=()=>{
    if(!form.email||!form.password)return;
    if(form.email==="admin@rentright.ug"&&form.password==="admin2025"){
      onAuth({name:"Admin",email:form.email,role:"admin",referralCode:"admin"});return;
    }
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      onAuth({name:form.name||form.email.split("@")[0],email:form.email,phone:form.phone,role,referralCode:"ref"+Math.random().toString(36).slice(2,8)});
    },1400);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.8)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:420,boxShadow:"0 40px 90px rgba(0,0,0,.32)",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.n2})`,padding:"20px 24px 16px",position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,.1)",border:"none",color:"#fff",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:"#fff"}}>R</div>
            <span style={{fontWeight:900,fontSize:18,color:"#fff"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
          </div>
          <div style={{display:"flex",gap:4}}>
            {[["login","Login"],["signup","Sign Up"],["agent","Agent Portal"]].map(([k,lb])=>(
              <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?"rgba(255,255,255,.15)":"transparent",color:tab===k?"#fff":"rgba(255,255,255,.55)",border:tab===k?"1px solid rgba(255,255,255,.3)":"1px solid transparent",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {lb}
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:"22px 24px"}}>
          {tab==="login"&&(
            <>
              <p style={{fontWeight:800,fontSize:16,color:C.navy,margin:"0 0 4px"}}>Welcome back</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 18px"}}>Login to access listings, referrals, and bookings.</p>
              {[["Email address",form.email,f("email"),"email"],["Password",form.password,f("password"),"password"]].map(([lb,val,fn,tp])=>(
                <div key={lb} style={{marginBottom:12}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                  <input value={val} onChange={fn} type={tp} placeholder={lb} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${val?C.green:C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
              <Btn bg={C.navy} onClick={handleSubmit} disabled={loading} style={{width:"100%",marginTop:6}}>{loading?"Logging in…":"Login →"}</Btn>
              <p style={{textAlign:"center",fontSize:12,color:C.ts,marginTop:12}}>No account? <span onClick={()=>setTab("signup")} style={{color:C.blue,cursor:"pointer",fontWeight:700}}>Sign up free</span></p>
            </>
          )}
          {tab==="signup"&&(
            <>
              <p style={{fontWeight:800,fontSize:16,color:C.navy,margin:"0 0 4px"}}>Create your account</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Join to find a home, list property, or access moving services.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                {[["tenant","🔍 Find a Home"],["landlord","🏠 List Property"],["mover","🚛 Moving Provider"],["buyer","🌍 Buy Land"]].map(([r,lb])=>(
                  <button key={r} onClick={()=>setRole(r)} style={{background:role===r?C.navy:"#fff",color:role===r?"#fff":C.navy,border:`2px solid ${role===r?C.navy:C.border}`,borderRadius:12,padding:"9px 6px",fontWeight:700,fontSize:11,cursor:"pointer"}}>{lb}</button>
                ))}
              </div>
              {[["Full name",form.name,f("name"),"text"],["Email address",form.email,f("email"),"email"],["Phone (MTN/Airtel)",form.phone,f("phone"),"tel"],["Password",form.password,f("password"),"password"]].map(([lb,val,fn,tp])=>(
                <div key={lb} style={{marginBottom:10}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                  <input value={val} onChange={fn} type={tp} placeholder={lb} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${val?C.green:C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Referral code (optional)</label>
                <input value={form.referral} onChange={f("referral")} placeholder="e.g. ref123abc" style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${form.referral?C.green:C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{background:C.gL,borderRadius:12,padding:"9px 12px",fontSize:11,color:C.gD,marginBottom:14}}>🔁 Earn <strong>UGX 5,000</strong> each time a friend you refer pays a viewing fee!</div>
              <Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={handleSubmit} disabled={loading} style={{width:"100%"}}>{loading?"Creating account…":"Create Account →"}</Btn>
            </>
          )}
          {tab==="agent"&&(
            <>
              <div style={{textAlign:"center",marginBottom:14}}>
                <div style={{fontSize:36,marginBottom:6}}>🏢</div>
                <p style={{fontWeight:900,fontSize:16,color:C.navy,margin:"0 0 4px"}}>Agent Portal Application</p>
                <p style={{fontSize:12,color:C.ts,margin:0}}>Verified agents get dedicated tools, priority listing, and client management.</p>
              </div>
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
                <p style={{fontWeight:800,fontSize:12,color:C.yD,margin:"0 0 8px"}}>📋 Required Documents</p>
                {[["🪪","Valid National ID (NIN)"],["📜","LC Introductory Letter"],["👤","One Guarantor (permanent resident)"],["🏠","Guarantor's National ID"]].map(([ic,t])=>(
                  <div key={t} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:16}}>{ic}</span>
                    <p style={{fontSize:12,color:C.yD,margin:0,fontWeight:600}}>{t}</p>
                  </div>
                ))}
              </div>
              <div style={{background:C.bL,borderRadius:12,padding:"10px 12px",marginBottom:14,fontSize:11,color:C.bD}}>⏱️ <strong>3 working day review.</strong> We contact your guarantor to verify. SMS/email notification on outcome.</div>
              <Btn bg={C.purple} onClick={()=>onAuth({name:"Agent Applicant",email:"agent@example.com",role:"agent_pending",referralCode:"agref"+Math.random().toString(36).slice(2,6)})} style={{width:"100%"}}>Start Agent Application →</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ USER DASHBOARD ═════════════════════════════ */
function UserDashboard({user,onClose,onLogout,onMovingMarketplace}){
  const [tab,setTab]=useState("referrals");
  const refCode=user?.referralCode||"ref123abc";
  const [copied,setCopied]=useState(false);
  const [withdrawing,setWithdrawing]=useState(false); const [withdrawn,setWithdrawn]=useState(false);
  const earnings={total:25000,pending:5000,withdrawable:20000,history:[
    {name:"Sarah K.",action:"Viewed Kisaasi Room",amount:5000,date:"Today"},
    {name:"Brian M.",action:"Viewed Makerere Bedsitter",amount:5000,date:"Yesterday"},
    {name:"Aisha N.",action:"Viewed Wandegeya Hostel",amount:5000,date:"2 days ago"},
    {name:"Denis O.",action:"Viewing fee pending",amount:5000,status:"pending",date:"3 days ago"},
    {name:"Ruth K.",action:"Viewed Ntinda Room",amount:5000,date:"1 week ago"},
  ]};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:660,maxHeight:"95vh",overflowY:"auto",boxShadow:"0 40px 90px rgba(0,0,0,.32)"}}>
        <div style={{background:`linear-gradient(135deg,${C.gD},${C.green})`,padding:"16px 22px",borderRadius:"26px 26px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:900,fontSize:16,margin:0}}>👋 {user?.name}</p><p style={{color:"rgba(255,255,255,.75)",fontSize:11,margin:0}}>Your RentRight! dashboard</p></div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onLogout} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",borderRadius:12,padding:"7px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Logout</button>
            <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>×</button>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.mist}}>
          {[["referrals","🔁 Referrals"],["moving","🚚 Moving"],["bookings","📅 Bookings"]].map(([k,lb])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"11px 0",fontSize:12,fontWeight:700,background:"transparent",border:"none",borderBottom:`2.5px solid ${tab===k?C.green:"transparent"}`,color:tab===k?C.gD:C.ts,cursor:"pointer"}}>{lb}</button>
          ))}
        </div>
        <div style={{padding:"20px 22px"}}>
          {tab==="referrals"&&(
            <>
              <div style={{background:`linear-gradient(135deg,${C.green},${C.bD})`,borderRadius:18,padding:"18px 20px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,background:"rgba(255,255,255,.08)",borderRadius:"50%"}}/>
                <p style={{color:"#fff",fontWeight:900,fontSize:17,margin:"0 0 4px"}}>Invite Friends to RentRight!</p>
                <p style={{color:"rgba(255,255,255,.8)",fontSize:12,margin:"0 0 12px"}}>Earn <strong>UGX 5,000</strong> for every friend who pays a viewing fee!</p>
                <div style={{background:"rgba(255,255,255,.15)",borderRadius:12,padding:"8px 12px",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{color:"#fff",fontSize:12,fontWeight:600,flex:1}}>rentright.ug/ref/{refCode}</span>
                  <button onClick={()=>{navigator.clipboard.writeText(`rentright.ug/ref/${refCode}`);setCopied(true);setTimeout(()=>setCopied(false),2500);}} style={{background:"#fff",color:C.gD,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:800,cursor:"pointer"}}>{copied?"✅ Copied!":"Copy"}</button>
                </div>
                <div style={{background:C.gD,borderRadius:12,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"#fff",fontSize:12,fontWeight:700}}>Total Earned</span>
                  <span style={{color:C.yellow,fontWeight:900,fontSize:18}}>UGX {earnings.total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
                {[["1","Signs Up","👤"],["2","Pays Fee","💳"],["3","Views","🏠"],["4","You Earn","💰"]].map(([n,lb,ic])=>(
                  <div key={n} style={{background:C.mist,borderRadius:12,padding:"10px 6px",textAlign:"center",border:`1px solid ${C.border}`}}>
                    <div style={{width:22,height:22,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:800,margin:"0 auto 4px"}}>{n}</div>
                    <div style={{fontSize:16,marginBottom:2}}>{ic}</div>
                    <p style={{fontSize:9,color:C.n3,fontWeight:600,margin:0}}>{lb}</p>
                  </div>
                ))}
              </div>
              <div style={{background:C.mist,borderRadius:16,padding:"14px 16px",marginBottom:14,border:`1px solid ${C.border}`}}>
                <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:"0 0 12px"}}>💵 Earnings Wallet</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                  {[["Total",earnings.total,C.gD],["Pending",earnings.pending,C.gold],["Withdrawable",earnings.withdrawable,C.blue]].map(([lb,amt,col])=>(
                    <div key={lb} style={{background:"#fff",borderRadius:12,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}>
                      <p style={{fontSize:10,color:C.ts,margin:"0 0 2px"}}>{lb}</p>
                      <p style={{fontWeight:900,fontSize:14,color:col,margin:0}}>UGX {amt.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                {!withdrawn
                  ?<button disabled={earnings.withdrawable<20000||withdrawing} onClick={()=>{setWithdrawing(true);setTimeout(()=>{setWithdrawing(false);setWithdrawn(true);},2000);}}
                    style={{width:"100%",background:earnings.withdrawable>=20000?C.blue:"#e2e8f0",color:earnings.withdrawable>=20000?"#fff":C.ts,border:"none",borderRadius:12,padding:"11px 0",fontWeight:700,fontSize:13,cursor:earnings.withdrawable>=20000?"pointer":"default",fontFamily:"inherit"}}>
                    {withdrawing?"Processing…":earnings.withdrawable>=20000?`Withdraw UGX ${earnings.withdrawable.toLocaleString()} to MoMo`:`Need UGX ${(20000-earnings.withdrawable).toLocaleString()} more to withdraw`}
                  </button>
                  :<div style={{background:C.gL,borderRadius:12,padding:"11px",textAlign:"center",fontSize:13,color:C.gD,fontWeight:700}}>✅ UGX {earnings.withdrawable.toLocaleString()} sent to your MoMo!</div>
                }
              </div>
              <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:"0 0 10px"}}>Recent Activity</p>
              {earnings.history.map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:34,height:34,background:h.status==="pending"?"#FEF9C3":C.gL,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{h.status==="pending"?"⏳":"✅"}</div>
                  <div style={{flex:1}}><p style={{fontWeight:700,fontSize:12,color:C.navy,margin:0}}>{h.name}</p><p style={{fontSize:11,color:C.ts,margin:0}}>{h.action} · {h.date}</p></div>
                  <p style={{fontWeight:800,fontSize:13,color:h.status==="pending"?C.gold:C.gD,margin:0}}>UGX {h.amount.toLocaleString()}</p>
                </div>
              ))}
            </>
          )}
          {tab==="moving"&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 6px"}}>🚚 Moving Services</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 16px"}}>Need to move? Post a job or find providers near you.</p>
              <button onClick={()=>{onClose();onMovingMarketplace();}} style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.gold})`,color:"#fff",border:"none",borderRadius:16,padding:"16px 0",fontWeight:800,fontSize:15,cursor:"pointer",marginBottom:12,fontFamily:"inherit"}}>
                🚚 Open Moving Marketplace
              </button>
              {[{icon:"🚛",title:"Hire Movers",desc:"Professional movers with trucks near you"},
                {icon:"🚐",title:"Book Transport",desc:"Vehicles for your furniture and boxes"},
                {icon:"👷",title:"Find Helpers to Pack",desc:"Reliable helpers paid by the hour"},
              ].map(s=>(
                <button key={s.title} onClick={()=>{onClose();onMovingMarketplace();}}
                  style={{width:"100%",background:C.mist,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px 14px",display:"flex",gap:12,alignItems:"center",marginBottom:8,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                  <span style={{fontSize:24,flexShrink:0}}>{s.icon}</span>
                  <div><p style={{fontWeight:700,fontSize:13,color:C.navy,margin:0}}>{s.title}</p><p style={{fontSize:11,color:C.ts,margin:0}}>{s.desc}</p></div>
                  <span style={{marginLeft:"auto",color:C.blue,fontSize:18}}>→</span>
                </button>
              ))}
            </>
          )}
          {tab==="bookings"&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 14px"}}>📅 Your Bookings</p>
              <div style={{background:C.gL,borderRadius:14,padding:"12px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:24}}>✅</span>
                <div><p style={{fontWeight:700,fontSize:13,color:C.gD,margin:0}}>Tranquil Studio, Bukoto</p><p style={{fontSize:11,color:C.n3,margin:0}}>Viewing: Tomorrow · Fee paid: UGX 5,000 · TXN-8A3F2B</p></div>
              </div>
              <div style={{background:"#FEF9C3",borderRadius:14,padding:"12px 16px",display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:24}}>⏳</span>
                <div><p style={{fontWeight:700,fontSize:13,color:C.yD,margin:0}}>Modern Bedsitter, Makerere</p><p style={{fontSize:11,color:"#92400E",margin:0}}>Viewing pending · Fee paid: UGX 5,000</p></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ INTEREST MODAL ════════════════════════════ */
function InterestModal({l,onClose,user,onNeedAuth,onBook,onMoveInRec}){
  const [step,setStep]=useState("choice");
  const [feedbackSent,setFeedbackSent]=useState(false);
  const [feedbackVal,setFeedbackVal]=useState(null);

  if(!user)return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.75)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:360,padding:"26px 24px",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.3)"}}>
        <div style={{fontSize:42,marginBottom:10}}>🔐</div>
        <p style={{fontWeight:900,fontSize:17,color:C.navy,margin:"0 0 6px"}}>Login to Continue</p>
        <p style={{fontSize:12,color:C.ts,margin:"0 0 18px"}}>Create a free account to express interest, contact landlords, and book viewings.</p>
        <Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>{onClose();onNeedAuth("signup");}} style={{width:"100%",marginBottom:8}}>Sign Up Free</Btn>
        <Btn bg={C.navy} onClick={()=>{onClose();onNeedAuth("login");}} style={{width:"100%"}}>Login</Btn>
      </div>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.75)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:400,boxShadow:"0 32px 80px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:C.navy,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{color:"#fff",fontWeight:800,fontSize:14,margin:0}}>{l.title}</p>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"20px 22px"}}>
          {step==="choice"&&(
            <>
              <p style={{fontWeight:800,fontSize:15,color:C.navy,margin:"0 0 6px"}}>What would you like to do?</p>
              <p style={{fontSize:12,color:C.ts,margin:"0 0 18px"}}>UGX {l.price.toLocaleString()}/mo · {l.area}</p>
              <Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>{onClose();onBook(l);}} style={{width:"100%",marginBottom:10,padding:"13px 0",fontSize:14}}>📅 Book a Viewing (UGX {l.viewingFee.toLocaleString()})</Btn>
              <Btn bg={C.mist} color={C.navy} onClick={()=>setStep("interested")} style={{width:"100%",marginBottom:8,border:`1.5px solid ${C.border}`}}>❤️ I'm Interested — Save this Property</Btn>
              <Btn bg={C.bL} color={C.bD} onClick={()=>setStep("contact")} style={{width:"100%",border:`1.5px solid ${C.blue}44`}}>💬 Contact Landlord</Btn>
            </>
          )}
          {step==="interested"&&!feedbackSent&&(
            <>
              <div style={{textAlign:"center",marginBottom:14}}>
                <div style={{fontSize:36,marginBottom:6}}>❤️</div>
                <p style={{fontWeight:900,fontSize:16,color:C.navy,margin:"0 0 4px"}}>Property Saved!</p>
              </div>
              <div style={{background:C.gL,borderRadius:14,padding:"12px 14px",marginBottom:14,fontSize:12,color:C.gD,lineHeight:1.6}}>
                ✅ <strong>{l.title}</strong> saved. You'll be notified if price changes or it becomes unavailable.
              </div>
              <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:"0 0 10px"}}>Have you already viewed or rented this property?</p>
              {[["🎉 Yes – I rented it!","rented"],["🤔 Yes – still deciding","deciding"],["📅 No – planning to view","planning"]].map(([lb,val])=>(
                <button key={val} onClick={()=>{setFeedbackVal(val);setFeedbackSent(true);}}
                  style={{width:"100%",background:C.mist,color:C.navy,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"10px 14px",fontWeight:600,fontSize:13,cursor:"pointer",marginBottom:7,textAlign:"left",fontFamily:"inherit"}}>
                  {lb}
                </button>
              ))}
            </>
          )}
          {feedbackSent&&feedbackVal==="rented"&&(
            <div style={{textAlign:"center",padding:"6px 0"}}>
              <div style={{fontSize:44,marginBottom:8}}>🏠</div>
              <p style={{fontWeight:900,fontSize:18,color:C.gD,margin:"0 0 6px"}}>Congratulations!</p>
              <p style={{fontSize:13,color:C.ts,margin:"0 0 16px",lineHeight:1.6}}>Thank you for letting us know — your feedback helps us improve RentRight! for everyone in Uganda. We'd love to help make your move as smooth as possible!</p>
              <Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>{onClose();onMoveInRec(l);}} style={{width:"100%",marginBottom:8,padding:"13px 0",fontSize:14}}>🏠 Get Move-In Recommendations</Btn>
              <Btn bg={C.mist} color={C.n3} onClick={onClose} style={{width:"100%"}}>Maybe Later</Btn>
            </div>
          )}
          {feedbackSent&&feedbackVal!=="rented"&&(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:44,marginBottom:10}}>🙏</div>
              <p style={{fontWeight:900,fontSize:18,color:C.gD,margin:"0 0 6px"}}>Thank you!</p>
              <p style={{fontSize:13,color:C.ts,margin:"0 0 18px",lineHeight:1.6}}>Your feedback genuinely helps us make RentRight! better for every person searching for a home in Uganda. We really appreciate it!</p>
              <Btn bg={C.navy} onClick={onClose} style={{padding:"11px 28px"}}>Close</Btn>
            </div>
          )}
          {step==="contact"&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 6px"}}>Contact Landlord</p>
              <div style={{background:`linear-gradient(135deg,${C.n2},${C.navy})`,borderRadius:14,padding:"14px 16px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:26}}>🔒</span>
                <div><p style={{color:"#fff",fontWeight:700,fontSize:13,margin:0}}>Contact details are protected</p><p style={{color:C.tt,fontSize:11,margin:0}}>Pay the UGX {l.viewingFee.toLocaleString()} viewing fee to unlock the landlord's phone and WhatsApp</p></div>
              </div>
              <Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>{onClose();onBook(l);}} style={{width:"100%",marginBottom:8}}>🔓 Pay UGX {l.viewingFee.toLocaleString()} to Unlock Contact</Btn>
              <Btn bg={C.mist} color={C.ts} onClick={()=>setStep("choice")} style={{width:"100%"}}>← Back</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ BOOKING MODAL ══════════════════════════════ */
function BookingModal({l,onClose,user,onNeedAuth}){
  const [step,setStep]=useState(1);
  const [name,setName]=useState(user?.name||""); const [phone,setPhone]=useState(user?.phone||""); const [date,setDate]=useState("");
  const [agreed,setAgreed]=useState(false);
  const [momo,setMomo]=useState(""); const [paying,setPaying]=useState(false); const [paid,setPaid]=useState(false);
  const txn=useRef("TXN-"+Math.random().toString(36).slice(2,10).toUpperCase());

  if(!user)return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.75)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:360,padding:"26px 24px",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.3)"}}>
        <div style={{fontSize:44,marginBottom:10}}>🔐</div>
        <p style={{fontWeight:900,fontSize:18,color:C.navy,margin:"0 0 6px"}}>Login Required</p>
        <p style={{fontSize:12,color:C.ts,margin:"0 0 20px"}}>Create a free account or login to book viewings.</p>
        <Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>{onClose();onNeedAuth("signup");}} style={{width:"100%",marginBottom:8}}>Create Free Account</Btn>
        <Btn bg={C.navy} onClick={()=>{onClose();onNeedAuth("login");}} style={{width:"100%"}}>Login</Btn>
      </div>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(5px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:460,boxShadow:"0 40px 90px rgba(0,0,0,.32)",overflow:"hidden"}}>
        <div style={{background:C.navy,padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:15,margin:0}}>Book a Viewing</p><p style={{color:C.tt,fontSize:11,margin:0}}>{l.title}</p></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{display:"flex",background:C.mist,borderBottom:`1px solid ${C.border}`}}>
          {["Details","Agreement","Payment","Confirmed"].map((s,i)=>(
            <div key={s} style={{flex:1,padding:"8px 0",textAlign:"center",fontSize:10,fontWeight:700,color:step===i+1?C.blue:step>i+1?C.green:C.ts,borderBottom:`2.5px solid ${step===i+1?C.blue:step>i+1?C.green:"transparent"}`}}>{step>i+1?"✓ ":""}{s}</div>
          ))}
        </div>
        <div style={{padding:"22px 24px"}}>
          {step===1&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 14px"}}>Your Details</p>
              {[["Full name *",name,setName,"text"],["Phone number *",phone,setPhone,"tel"]].map(([lb,val,set,tp])=>(
                <div key={lb} style={{marginBottom:10}}>
                  <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>{lb}</label>
                  <input value={val} onChange={e=>set(e.target.value)} type={tp} placeholder={lb.replace(" *","")} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${val?C.green:C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:C.ts,display:"block",marginBottom:4}}>Preferred viewing date *</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1.5px solid ${date?C.green:C.border}`,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{background:"#FEF9C3",borderRadius:12,padding:"10px 14px",fontSize:12,color:C.yD,marginBottom:14}}>
                💡 <strong>Viewing fee: UGX {l.viewingFee.toLocaleString()}</strong> via MTN/Airtel MoMo. Unlocks landlord contact and confirms your slot.
              </div>
              <Btn bg={name&&phone&&date?C.navy:"#e2e8f0"} color={name&&phone&&date?"#fff":C.ts} disabled={!name||!phone||!date} onClick={()=>setStep(2)} style={{width:"100%"}}>Next → Agreement</Btn>
            </>
          )}
          {step===2&&(
            <>
              <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 12px"}}>Tenant Booking Agreement</p>
              <div style={{background:C.mist,borderRadius:14,padding:"14px",fontSize:11,lineHeight:1.8,color:C.n3,maxHeight:180,overflowY:"auto",border:`1px solid ${C.border}`,marginBottom:12}}>
                By confirming, <strong>{name}</strong> agrees: The viewing fee of UGX {l.viewingFee.toLocaleString()} is non-refundable. RentRight! is a listing and matching platform only — not responsible for property conditions. You must inspect before paying rent. Landlord contact revealed only after payment. Never pay rent without a signed tenancy agreement. Your IP and timestamp are recorded.
              </div>
              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:14}}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:3,accentColor:C.green,width:16,height:16,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.n3,lineHeight:1.5}}>I, <strong>{name}</strong>, accept the RentRight! Booking Terms.</span>
              </label>
              <div style={{display:"flex",gap:10}}>
                <Btn bg={C.mist} color={C.n3} onClick={()=>setStep(1)} style={{flex:1}}>← Back</Btn>
                <Btn bg={agreed?C.green:"#e2e8f0"} color={agreed?"#fff":C.ts} disabled={!agreed} onClick={()=>setStep(3)} style={{flex:2}}>Agree → Pay</Btn>
              </div>
            </>
          )}
          {step===3&&(
            <>
              {!paid?(
                <>
                  <p style={{fontWeight:800,fontSize:14,color:C.navy,margin:"0 0 4px"}}>Pay via Mobile Money</p>
                  <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Amount: <strong style={{color:C.navy}}>UGX {l.viewingFee.toLocaleString()}</strong></p>
                  {[["📱","MTN Mobile Money","linear-gradient(135deg,#FFD700,#F59E0B)","#1a0a00","#3d2200"],["📲","Airtel Money","linear-gradient(135deg,#e8f4fd,#dbeafe)",C.bD,C.ts]].map(([ic,nm,bg,c1,c2])=>(
                    <div key={nm} style={{background:bg,borderRadius:14,padding:"11px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:22}}>{ic}</span>
                      <div><p style={{fontWeight:800,fontSize:13,color:c1,margin:0}}>{nm}</p><p style={{fontSize:10,color:c2,margin:0}}>Instant secure payment</p></div>
                    </div>
                  ))}
                  <input value={momo} onChange={e=>setMomo(e.target.value)} placeholder="Enter MoMo number (e.g. 0771 234 567)" style={{width:"100%",padding:"11px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:14,marginBottom:10,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
                  <div style={{background:C.rL,borderRadius:10,padding:"8px 12px",fontSize:11,color:C.rD,marginBottom:12}}>🔒 Landlord contact revealed only after payment confirmation.</div>
                  <Btn bg={momo.length>=10&&!paying?"#F59E0B":"#e2e8f0"} color={momo.length>=10||paying?"#1a0a00":C.ts} disabled={paying||momo.length<10} onClick={()=>{if(momo.length<10)return;setPaying(true);setTimeout(()=>{setPaying(false);setPaid(true);},2200);}} style={{width:"100%"}}>{paying?"Processing…":"💳 Pay UGX "+l.viewingFee.toLocaleString()}</Btn>
                  <Btn bg="transparent" color={C.ts} onClick={()=>setStep(2)} style={{width:"100%",marginTop:6}}>← Back</Btn>
                </>
              ):(
                <div style={{textAlign:"center",padding:"10px 0"}}>
                  <div style={{fontSize:52,marginBottom:8}}>✅</div>
                  <p style={{fontWeight:900,fontSize:18,color:C.gD,margin:"0 0 6px"}}>Payment Confirmed!</p>
                  <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Transaction ID: <strong>{txn.current}</strong></p>
                  <Btn bg={C.green} onClick={()=>setStep(4)} style={{padding:"11px 28px"}}>View Confirmation →</Btn>
                </div>
              )}
            </>
          )}
          {step===4&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:42,marginBottom:8}}>🏠</div>
              <p style={{fontWeight:900,fontSize:17,color:C.navy,margin:"0 0 12px"}}>Viewing Confirmed!</p>
              <div style={{background:C.gL,borderRadius:14,padding:"14px 16px",marginBottom:12,textAlign:"left",fontSize:12,lineHeight:1.8}}>
                <p style={{fontWeight:700,color:C.gD,margin:"0 0 6px"}}>✅ Booking Details</p>
                <p style={{margin:0,color:C.n3}}><strong>Name:</strong> {name}<br/><strong>Property:</strong> {l.title}<br/><strong>Date:</strong> {date}<br/><strong>Fee paid:</strong> UGX {l.viewingFee.toLocaleString()} · {txn.current}<br/><strong>🔓 Landlord:</strong> {l.landlord} · 0712 345 678</p>
              </div>
              <a href={`https://wa.me/${l.wa}?text=Hi ${l.landlord}! I booked a viewing for "${l.title}" via RentRight!. Name: ${name}, Date: ${date}, Txn: ${txn.current}`} target="_blank" rel="noopener noreferrer"
                style={{display:"block",background:"#25D366",color:"#fff",borderRadius:14,padding:"12px 0",fontWeight:800,fontSize:14,textDecoration:"none",marginBottom:8}}>
                💬 Message Landlord on WhatsApp
              </a>
              <Btn bg={C.navy} onClick={onClose} style={{width:"100%"}}>Done ✓</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ LISTING CARD ═══════════════════════════════ */
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
        </div>
        <div style={{position:"absolute",bottom:9,left:9}}><span style={{background:mii.bg,color:mii.color,fontSize:9,fontWeight:700,padding:"2px 9px",borderRadius:20}}>{mii.icon} {mii.label}</span></div>
        <div style={{position:"absolute",bottom:9,right:9,background:"rgba(15,23,42,.86)",color:"#fff",fontWeight:800,fontSize:12,padding:"3px 10px",borderRadius:20}}>UGX {l.price.toLocaleString()}/mo</div>
      </div>
      <div style={{padding:"12px 14px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
          <div style={{flex:1}}><p style={{fontWeight:800,fontSize:14,color:C.navy,margin:0,lineHeight:1.3}}>{l.title}</p><p style={{color:C.ts,fontSize:11,margin:"2px 0 0"}}>📍 {l.area} · {l.type}</p></div>
          <ScoreRing score={score} size={48}/>
        </div>
        <div style={{marginTop:7,display:"flex",alignItems:"center",gap:5}}>
          <div style={{flex:1,background:C.border,borderRadius:10,height:4}}><div style={{width:`${l.confidence}%`,height:"100%",background:confCol(l.confidence),borderRadius:10}}/></div>
          <span style={{fontSize:9,fontWeight:700,color:confCol(l.confidence),whiteSpace:"nowrap"}}>{l.confidence}% trust</span>
        </div>
        <div style={{marginTop:7,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{background:C.blue+"22",color:C.bD,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20}}>⚡ {l.match}%</span>
          <span style={{background:C.gL,color:C.gD,fontSize:10,padding:"2px 8px",borderRadius:20}}>⚡ Power ✓</span>
          <span style={{color:"#F59E0B",fontSize:11}}>{"★".repeat(Math.round(l.rating))}</span>
          <span style={{background:"#FEF9C3",color:C.yD,fontSize:9,padding:"2px 7px",borderRadius:20,marginLeft:"auto"}}>UGX {l.viewingFee.toLocaleString()} fee</span>
        </div>
        <div style={{marginTop:7,display:"flex",gap:4,flexWrap:"wrap"}}>{l.amenities.slice(0,3).map(a=><span key={a} style={{background:C.mist,color:C.n3,fontSize:10,padding:"2px 7px",borderRadius:10}}>{AMICONS[a]} {a}</span>)}</div>
      </div>
    </div>
  );
}

/* ═══════════════ AI CHAT ════════════════════════════════════ */
function AIChat({onClose}){
  const [msgs,setMsgs]=useState([{from:"ai",text:"Hi! I'm your RentRight AI 🏠\n\nTell me your budget, area, and lifestyle — I'll match you with verified homes, moving services, or land listings.\n\nTry: '350k near Kisaasi, quiet & secure'"}]);
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
          system:`You are a warm RentRight housing assistant for Kampala, Uganda. Listings: ${JSON.stringify(LISTINGS.map(l=>({title:l.title,area:l.area,price:l.price,type:l.type,vibe:l.vibe,confidence:l.confidence,match:l.match,moveIn:l.moveIn,viewingFee:l.viewingFee,amenities:l.amenities,utilities:l.utilities})))}. Also available: moving services (hire movers, transport, helpers) and land buying (plots in Mukono, Wakiso, Entebbe). Reply concisely (max 3 sentences). Never mention Claude or Anthropic.`,
          messages:[...msgs.map(m=>({role:m.from==="ai"?"assistant":"user",content:m.text})),{role:"user",content:txt}]})});
      const data=await res.json();
      setMsgs(m=>[...m,{from:"ai",text:data.content?.find(c=>c.type==="text")?.text||"Happy to help! Describe your ideal home."}]);
    }catch{setMsgs(m=>[...m,{from:"ai",text:"Connection issue! Try again or WhatsApp us. 📱"}]);}
    setLoading(false);
  };
  return(
    <div style={{position:"fixed",bottom:90,right:20,width:320,background:"#fff",borderRadius:22,boxShadow:"0 20px 60px rgba(15,23,42,.22)",border:`1px solid ${C.border}`,zIndex:998,display:"flex",flexDirection:"column",maxHeight:440}}>
      <div style={{background:C.navy,borderRadius:"22px 22px 0 0",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
          <div><p style={{color:"#fff",fontWeight:700,fontSize:13,margin:0}}>RentRight AI</p><p style={{color:C.tt,fontSize:10,margin:0}}>Homes · Moving · Land</p></div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
            <div style={{background:m.from==="user"?C.blue:C.mist,color:m.from==="user"?"#fff":C.navy,fontSize:12,lineHeight:1.5,padding:"8px 12px",borderRadius:14,maxWidth:"83%",whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:C.mist,color:C.ts,fontSize:12,padding:"8px 12px",borderRadius:14}}>Searching…</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",gap:6}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about homes, moving, land…" style={{flex:1,padding:"8px 12px",borderRadius:12,border:`1px solid ${C.border}`,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} style={{background:C.blue,color:"#fff",border:"none",borderRadius:12,padding:"8px 12px",fontSize:13,cursor:"pointer",fontWeight:700}}>↑</button>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN APP ═══════════════════════════════════ */
export default function RentRight(){
  const [heroIdx,setHeroIdx]=useState(0);
  const [mode,setMode]=useState(null);
  const [search,setSearch]=useState(""); const [minP,setMinP]=useState(""); const [maxP,setMaxP]=useState("");
  const [selVibes,setSelVibes]=useState([]); const [onlyVerified,setOnlyVerified]=useState(false); const [sortBy,setSortBy]=useState("match");
  const [filtered,setFiltered]=useState([...LISTINGS].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));
  const [selected,setSelected]=useState(null);
  const [booking,setBooking]=useState(null);
  const [interest,setInterest]=useState(null);
  const [moveInRec,setMoveInRec]=useState(null);
  const [listModal,setListModal]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [authModal,setAuthModal]=useState(null);
  const [user,setUser]=useState(null);
  const [dashboard,setDashboard]=useState(false);
  const [adminPanel,setAdminPanel]=useState(false);
  const [movingMarket,setMovingMarket]=useState(false);
  const [landMarket,setLandMarket]=useState(false);
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
    else if(sb==="price-asc")res.sort((a,b)=>a.price-b.price);
    else if(sb==="price-desc")res.sort((a,b)=>b.price-a.price);
    else if(sb==="score")res.sort((a,b)=>avgScore(b)-avgScore(a));
    else if(sb==="confidence")res.sort((a,b)=>b.confidence-a.confidence);
    setFiltered(res);
  },[search,minP,maxP,selVibes,onlyVerified,sortBy,mode]);

  const doSearch=()=>{
    if(mode==="land"){setLandMarket(true);return;}
    if(mode==="moving"){setMovingMarket(true);return;}
    applyFilters();
    setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  const toggleVibe=id=>{const nv=selVibes.includes(id)?selVibes.filter(v=>v!==id):[...selVibes,id];setSelVibes(nv);applyFilters({vibes:nv});};
  const setModeFilter=m=>{
    setMode(m);
    if(m==="land"){setTimeout(()=>setLandMarket(true),100);return;}
    if(m==="moving"){setTimeout(()=>setMovingMarket(true),100);return;}
    applyFilters({mode:m});
    setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  const clearAll=()=>{setMode(null);setSelVibes([]);setSearch("");setMinP("");setMaxP("");setOnlyVerified(false);setSortBy("match");setFiltered([...LISTINGS].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0)||b.match-a.match));};
  const handleAuth=(userData)=>{setUser(userData);setAuthModal(null);if(userData.role==="admin")setTimeout(()=>setAdminPanel(true),300);};
  const handleLogout=()=>{setUser(null);setDashboard(false);};
  const anyFilter=mode||selVibes.length||search||minP||maxP||onlyVerified;

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:C.mist,minHeight:"100vh",color:C.navy,paddingBottom:72}}>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:200,background:"rgba(248,250,252,.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:62}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:17}}>R</div>
            <span style={{fontWeight:900,fontSize:21,letterSpacing:"-.5px"}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
          </div>
          <div style={{display:"flex",gap:3}}>
            {[["listings","Listings"],["referrals","Referrals"],["about","About"]].map(([id,lb])=>(
              <button key={id} onClick={()=>document.getElementById(id+"-section")?.scrollIntoView({behavior:"smooth"})} style={{background:"transparent",color:C.n3,border:"none",borderRadius:20,padding:"6px 13px",fontWeight:600,fontSize:13,cursor:"pointer"}}>{lb}</button>
            ))}
            <button onClick={()=>setMovingMarket(true)} style={{background:"transparent",color:C.orange,border:"none",borderRadius:20,padding:"6px 13px",fontWeight:700,fontSize:13,cursor:"pointer"}}>🚚 Moving</button>
            <button onClick={()=>setLandMarket(true)} style={{background:"transparent",color:C.gD,border:"none",borderRadius:20,padding:"6px 13px",fontWeight:700,fontSize:13,cursor:"pointer"}}>🌍 Land</button>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {user?(
              <>
                {user.role==="admin"&&<button onClick={()=>setAdminPanel(true)} style={{background:`linear-gradient(135deg,${C.red},${C.purple})`,color:"#fff",border:"none",borderRadius:20,padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}}>⚙️ Admin</button>}
                <button onClick={()=>setDashboard(true)} style={{background:C.gL,color:C.gD,border:"none",borderRadius:20,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>👤 {user.name.split(" ")[0]}</button>
              </>
            ):(
              <>
                <button onClick={()=>setAuthModal("login")} style={{background:"transparent",color:C.navy,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"7px 16px",fontWeight:600,fontSize:13,cursor:"pointer"}}>Login</button>
                <button onClick={()=>setAuthModal("signup")} style={{background:C.green,color:"#fff",border:"none",borderRadius:20,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>Sign Up</button>
              </>
            )}
            <button onClick={()=>setListModal(true)} style={{background:C.navy,color:"#fff",border:"none",borderRadius:20,padding:"8px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ List</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{position:"relative",height:"94vh",overflow:"hidden"}}>
        {HERO_IMGS.map((img,i)=>(<div key={i} style={{position:"absolute",inset:0,transition:"opacity 1.4s",opacity:i===heroIdx?1:0}}><img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>))}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(15,23,42,.76) 0%,rgba(15,23,42,.5) 55%,rgba(15,23,42,.7) 100%)"}}/>
        <div style={{position:"absolute",top:"10%",right:"7%",width:200,height:200,background:C.green+"14",borderRadius:"50%",filter:"blur(70px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"15%",left:"4%",width:180,height:180,background:C.blue+"14",borderRadius:"50%",filter:"blur(55px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 20px 0"}}>
          <div style={{textAlign:"center",color:"#fff",maxWidth:760,marginBottom:18}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(34,197,94,.2)",border:"1px solid rgba(34,197,94,.4)",borderRadius:20,padding:"5px 16px",fontSize:11,fontWeight:700,color:"#86EFAC",marginBottom:16,letterSpacing:1}}>
              🏆 Uganda's Verified Rental, Moving & Land Platform
            </div>
            <h1 style={{margin:"0 0 12px",fontSize:"clamp(1.9rem,5vw,3.4rem)",fontWeight:900,lineHeight:1.08,letterSpacing:"-1.5px"}}>
              Find a <span style={{color:C.green}}>Home</span>, Move Smart,<br/>Buy <span style={{color:C.blue}}>Land</span> in Uganda
            </h1>
            <p style={{fontSize:15,opacity:.8,margin:"0 0 14px",lineHeight:1.5}}>Verified rentals · Moving marketplace · Land listings<br/>No brokers. No scams. GPS-confirmed.</p>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
              {MODES.map(m=>(
                <button key={m.id} onClick={()=>setModeFilter(m.id)}
                  style={{background:mode===m.id?"rgba(255,255,255,.97)":"rgba(255,255,255,.1)",color:mode===m.id?C.navy:"#fff",border:mode===m.id?`2px solid ${C.green}`:"1.5px solid rgba(255,255,255,.22)",borderRadius:14,padding:"9px 16px",fontWeight:700,fontSize:13,cursor:"pointer",backdropFilter:"blur(8px)",transition:"all .2s"}}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.97)",borderRadius:24,padding:"18px 20px",width:"100%",maxWidth:700,boxShadow:"0 24px 64px rgba(0,0,0,.28)"}}>
            <p style={{fontSize:10,fontWeight:800,color:C.ts,margin:"0 0 8px",letterSpacing:1.5,textTransform:"uppercase"}}>Search Homes · Moving Services · Land</p>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()}
                placeholder="Area, type, or service — e.g. 'quiet room Ntinda'"
                style={{flex:1,padding:"10px 14px",borderRadius:13,border:`1.5px solid ${C.border}`,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(()=>{setSearch("Near Me");doSearch();},()=>{})}}} style={{background:C.navy,color:"#fff",border:"none",borderRadius:13,padding:"10px 14px",fontWeight:700,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>📍 Near Me</button>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <input value={minP} onChange={e=>setMinP(e.target.value)} placeholder="Min price (UGX)" style={{flex:1,minWidth:100,padding:"9px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <input value={maxP} onChange={e=>setMaxP(e.target.value)} placeholder="Max price (UGX)" style={{flex:1,minWidth:100,padding:"9px 12px",borderRadius:11,border:`1px solid ${C.border}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:C.gD,cursor:"pointer",whiteSpace:"nowrap"}}>
                <input type="checkbox" checked={onlyVerified} onChange={e=>{setOnlyVerified(e.target.checked);applyFilters({verified:e.target.checked});}} style={{accentColor:C.green}}/>✔ Verified Only
              </label>
            </div>
            <button onClick={doSearch} style={{width:"100%",background:`linear-gradient(135deg,${C.green},${C.blue})`,color:"#fff",border:"none",borderRadius:13,padding:"13px 0",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Search 🔍</button>
          </div>
          <div style={{marginTop:16,display:"flex",gap:6}}>
            {HERO_IMGS.map((_,i)=>(<button key={i} onClick={()=>setHeroIdx(i)} style={{width:i===heroIdx?28:8,height:8,background:i===heroIdx?C.green:"rgba(255,255,255,.35)",border:"none",borderRadius:4,cursor:"pointer",transition:"all .3s",padding:0}}/>))}
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={{background:C.navy,padding:"13px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:10}}>
          {[["🟢","Verified Listings"],["📍","GPS Confirmed"],["🔒","Contact Protected"],["🚚","Moving Services"],["🌍","Land Listings"],["🛡️","AI Fraud Detection"]].map(([ic,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:15}}>{ic}</span><span style={{color:"#fff",fontWeight:600,fontSize:12}}>{lb}</span></div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{background:C.gL,padding:"14px 24px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:10}}>
          {[["500+","Listings"],["2,400+","Users"],["98%","Verified"],["UGX 5K","Per Referral"],["🚚","Moving Jobs"],["🌍","Land Plots"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}><p style={{fontWeight:900,fontSize:19,color:C.gD,margin:0}}>{n}</p><p style={{fontSize:10,color:C.gD,opacity:.7,margin:0}}>{l}</p></div>
          ))}
        </div>
      </div>

      {/* BOOST BANNER */}
      <div style={{background:"linear-gradient(135deg,#1e1b4b,#312e81)",padding:"18px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div><p style={{fontWeight:900,fontSize:16,color:"#fff",margin:"0 0 2px"}}>🚀 Boost Your Listing — 10× More Views</p><p style={{color:"#a5b4fc",fontSize:12,margin:0}}>From UGX 25,000/week · Top placement · Analytics</p></div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{l:"Free",p:"FREE",c:C.green},{l:"Boost 7d",p:"25,000",c:C.blue},{l:"Premium 30d",p:"50,000",c:C.purple},{l:"Get Verified",p:"40,000",c:C.gold}].map(b=>(
              <button key={b.l} onClick={()=>setListModal(true)} style={{background:"rgba(255,255,255,.1)",color:"#fff",border:`1.5px solid ${b.c}`,borderRadius:12,padding:"7px 12px",fontWeight:700,fontSize:11,cursor:"pointer",textAlign:"center",fontFamily:"inherit"}}>
                {b.l}<br/><span style={{color:b.c,fontWeight:900}}>{b.p==="FREE"?b.p:"UGX "+b.p}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{maxWidth:1140,margin:"0 auto",padding:"32px 24px 0"}}>
        <h2 style={{fontWeight:900,fontSize:22,margin:"0 0 14px"}}>Quick Actions</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
          {[{icon:"📍",title:"Near Me",sub:"GPS listings",action:()=>{setSearch("Near Me");doSearch();}},
            {icon:"💸",title:"Under 300k",sub:"Budget picks",action:()=>{setMaxP("300000");applyFilters({max:"300000"});setTimeout(()=>listRef.current?.scrollIntoView({behavior:"smooth"}),100);}},
            {icon:"🎓",title:"Student Hostels",sub:"Near campus",action:()=>setModeFilter("student")},
            {icon:"🚚",title:"Moving Help",sub:"Post or find jobs",action:()=>setMovingMarket(true)},
            {icon:"🌍",title:"Buy Land",sub:"Verified plots",action:()=>setLandMarket(true)},
            {icon:"🏢",title:"Agent Portal",sub:"List as agent",action:()=>setAuthModal("agent")},
          ].map(q=>(
            <button key={q.title} onClick={q.action} style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:"14px 12px",textAlign:"left",cursor:"pointer",transition:"all .18s",fontFamily:"inherit"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${C.green}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <p style={{fontSize:24,margin:"0 0 6px"}}>{q.icon}</p>
              <p style={{fontWeight:800,fontSize:13,color:C.navy,margin:0}}>{q.title}</p>
              <p style={{fontSize:11,color:C.ts,margin:"2px 0 0"}}>{q.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SMART RECOMMENDATIONS STRIP */}
      <div style={{maxWidth:1140,margin:"28px auto 0",padding:"0 24px"}}>
        <div style={{background:`linear-gradient(135deg,${C.gL},${C.bL})`,borderRadius:20,padding:"20px 22px"}}>
          <p style={{fontWeight:900,fontSize:16,color:C.navy,margin:"0 0 4px"}}>💡 Smart Platform Features</p>
          <p style={{fontSize:12,color:C.ts,margin:"0 0 14px"}}>Everything you need — all in one place</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
            {[{ic:"🔁",t:"Referral Rewards",d:"Earn UGX 5,000 per friend who pays viewing fee"},
              {ic:"📋",t:"Move-In Checklist",d:"Personalised guide triggered when you confirm a rental"},
              {ic:"🚚",t:"Moving Marketplace",d:"Post jobs or provide services — open to all Uganda"},
              {ic:"🌍",t:"Land Buying",d:"Verified plots — pay access fee to unlock owner details"},
              {ic:"🔒",t:"Contact Protection",d:"Landlord details hidden until viewing fee is paid"},
              {ic:"🤖",t:"AI Housing Assistant",d:"Recommends homes, movers, and land by your lifestyle"},
            ].map(f=>(
              <div key={f.t} style={{background:"rgba(255,255,255,.7)",borderRadius:14,padding:"12px 14px"}}>
                <p style={{fontSize:20,margin:"0 0 4px"}}>{f.ic}</p>
                <p style={{fontWeight:700,fontSize:12,color:C.navy,margin:"0 0 2px"}}>{f.t}</p>
                <p style={{fontSize:10,color:C.ts,margin:0,lineHeight:1.4}}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIFESTYLE */}
      <div style={{maxWidth:1140,margin:"0 auto",padding:"32px 24px 0"}}>
        <h2 style={{fontWeight:900,fontSize:22,margin:"0 0 5px"}}>🌿 Atmosphere Mode</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>
          {VIBES.map(v=>(
            <button key={v.id} onClick={()=>toggleVibe(v.id)} style={{background:selVibes.includes(v.id)?C.navy:"#fff",color:selVibes.includes(v.id)?"#fff":C.navy,border:`1.5px solid ${selVibes.includes(v.id)?C.navy:C.border}`,borderRadius:14,padding:"13px 12px",textAlign:"left",cursor:"pointer",transition:"all .18s",fontFamily:"inherit"}}>
              <p style={{fontSize:22,margin:"0 0 5px"}}>{v.icon}</p><p style={{fontWeight:800,fontSize:12,margin:0}}>{v.label}</p>
            </button>
          ))}
        </div>
        {selVibes.length>0&&<div style={{marginTop:10,display:"flex",gap:10,alignItems:"center"}}><button onClick={()=>{setSelVibes([]);applyFilters({vibes:[]});}} style={{background:C.rL,color:C.rD,border:"none",borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✕ Clear</button><span style={{fontSize:12,color:C.ts}}>{filtered.length} listings match</span></div>}
      </div>

      {/* LISTINGS */}
      <div id="listings-section" ref={listRef} style={{maxWidth:1140,margin:"0 auto",padding:"30px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:16}}>
          <div>
            <h2 style={{fontWeight:900,fontSize:24,margin:0}}>{filtered.length} Listings</h2>
            <p style={{color:C.ts,margin:"3px 0 0",fontSize:11}}>Boosted first · Contact protected until fee paid</p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <select value={sortBy} onChange={e=>{setSortBy(e.target.value);applyFilters({sort:e.target.value});}} style={{padding:"7px 12px",borderRadius:11,border:`1.5px solid ${C.border}`,background:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
              <option value="match">⚡ Best Match</option>
              <option value="confidence">🛡️ Trust Score</option>
              <option value="score">🌿 Living Score</option>
              <option value="price-asc">💰 Price ↑</option>
              <option value="price-desc">💎 Price ↓</option>
            </select>
            {anyFilter&&<button onClick={clearAll} style={{background:C.rL,color:C.rD,border:"none",borderRadius:11,padding:"7px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✕ Clear</button>}
          </div>
        </div>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"50px 20px",background:"#fff",borderRadius:20,border:`1px solid ${C.border}`}}>
            <p style={{fontSize:44,margin:"0 0 8px"}}>🔍</p>
            <p style={{fontWeight:800,fontSize:17,color:C.navy,margin:0}}>No listings match</p>
            <p style={{color:C.ts,margin:"6px 0 16px"}}>Try the AI assistant!</p>
            <Btn bg={C.green} onClick={()=>setChatOpen(true)} style={{padding:"11px 22px"}}>🤖 Ask AI</Btn>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
            {filtered.map(l=><Card key={l.id} l={l} onOpen={setSelected}/>)}
          </div>
        )}
      </div>

      {/* MOVING MARKETPLACE TEASER */}
      <div style={{background:`linear-gradient(135deg,${C.orange},${C.gold})`,padding:"40px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <p style={{fontSize:40,margin:"0 0 6px"}}>🚚</p>
            <h2 style={{color:"#fff",fontWeight:900,fontSize:26,margin:"0 0 8px"}}>Moving Services Marketplace</h2>
            <p style={{color:"rgba(255,255,255,.85)",fontSize:14,margin:"0 0 16px",lineHeight:1.5}}>
              Need movers, transport, or helpers? Post a job and get offers.<br/>
              Providers pay just <strong>8% commission</strong> to access client details.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[["🚛","Hire Movers"],["🚐","Book Transport"],["👷","Find Helpers"]].map(([ic,lb])=>(
                <span key={lb} style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"6px 14px",borderRadius:20,fontSize:13,fontWeight:700}}>{ic} {lb}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setMovingMarket(true)} style={{background:"#fff",color:C.orange,border:"none",borderRadius:16,padding:"14px 24px",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Browse Jobs →</button>
            <button onClick={()=>setMovingMarket(true)} style={{background:"rgba(255,255,255,.2)",color:"#fff",border:"2px solid rgba(255,255,255,.5)",borderRadius:16,padding:"14px 24px",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Post a Job</button>
          </div>
        </div>
      </div>

      {/* LAND TEASER */}
      <div style={{background:`linear-gradient(135deg,#065f46,${C.gD})`,padding:"40px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <p style={{fontSize:40,margin:"0 0 6px"}}>🌍</p>
            <h2 style={{color:"#fff",fontWeight:900,fontSize:26,margin:"0 0 8px"}}>Buy Land in Uganda</h2>
            <p style={{color:"rgba(255,255,255,.8)",fontSize:14,margin:"0 0 16px",lineHeight:1.5}}>
              Verified landowners only. Pay a small access fee to unlock<br/>exact location, GPS coordinates, and owner contact details.
            </p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {LAND_LISTINGS.map(l=>(
                <span key={l.id} style={{background:"rgba(255,255,255,.15)",color:"#fff",padding:"5px 12px",borderRadius:20,fontSize:12}}>📍 {l.title}</span>
              ))}
            </div>
          </div>
          <button onClick={()=>setLandMarket(true)} style={{background:"#fff",color:C.gD,border:"none",borderRadius:16,padding:"14px 28px",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>View Land Listings →</button>
        </div>
      </div>

      {/* REFERRAL */}
      <div id="referrals-section" style={{background:"linear-gradient(135deg,#0F172A,#0a2315)",padding:"46px 24px"}}>
        <div style={{maxWidth:680,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:38,margin:"0 0 8px"}}>🔁</p>
          <h2 style={{color:"#fff",fontWeight:900,fontSize:24,margin:"0 0 8px"}}>Earn UGX 5,000 Per Referral</h2>
          <p style={{color:C.tt,fontSize:13,margin:"0 0 22px"}}>Share your link. Friend pays viewing fee. You earn UGX 5,000 via MTN MoMo. Min withdrawal: UGX 20,000.</p>
          {user?(
            <div style={{background:"rgba(255,255,255,.08)",borderRadius:16,padding:"14px 18px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{flex:1,textAlign:"left"}}><p style={{color:"#fff",fontWeight:700,fontSize:12,margin:"0 0 2px"}}>Your referral link</p><p style={{color:C.green,fontSize:13,fontWeight:800,margin:0}}>rentright.ug/ref/{user.referralCode}</p></div>
              <button onClick={()=>{navigator.clipboard.writeText(`rentright.ug/ref/${user.referralCode}`);}} style={{background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"9px 16px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Copy Link</button>
              <button onClick={()=>setDashboard(true)} style={{background:C.blue,color:"#fff",border:"none",borderRadius:12,padding:"9px 16px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>View Earnings</button>
            </div>
          ):(
            <div style={{display:"flex",gap:10}}>
              <input value={refEmail} onChange={e=>setRefEmail(e.target.value)} placeholder="Phone or email — get your referral link" style={{flex:1,padding:"11px 14px",borderRadius:11,border:"none",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={()=>{if(refEmail){setRefSent(true);setTimeout(()=>setRefSent(false),3000);}}} style={{background:C.green,color:"#fff",border:"none",borderRadius:11,padding:"11px 18px",fontWeight:800,cursor:"pointer",fontSize:13,whiteSpace:"nowrap",fontFamily:"inherit"}}>{refSent?"✅ Sent!":"Get Link"}</button>
            </div>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="about-section" style={{maxWidth:1140,margin:"0 auto",padding:"46px 24px"}}>
        <h2 style={{fontWeight:900,fontSize:24,textAlign:"center",margin:"0 0 5px"}}>How RentRight! Works</h2>
        <p style={{textAlign:"center",color:C.ts,margin:"0 0 30px",fontSize:12}}>Simple, safe, fast — search to move-in</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14}}>
          {[{n:"01",ic:"🔍",t:"Search",d:"Find homes, land, or moving services by area, budget, or lifestyle.",c:C.bL,a:C.blue},
            {n:"02",ic:"🧪",t:"Verify",d:"Every listing has a trust score, utilities info, and neighbourhood details.",c:C.gL,a:C.gD},
            {n:"03",ic:"💳",t:"Pay Fee",d:"UGX 5,000 via MoMo unlocks landlord contact and confirms your viewing.",c:"#FEF9C3",a:C.yD},
            {n:"04",ic:"🏠",t:"Move In",d:"Get personalised move-in recommendations after confirming your rental.",c:C.rL,a:C.rD}].map(s=>(
            <div key={s.n} style={{background:"#fff",borderRadius:18,padding:"18px 16px",border:`1.5px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:8,right:12,fontWeight:900,fontSize:44,color:`${s.a}10`,lineHeight:1}}>{s.n}</div>
              <div style={{width:40,height:40,background:s.c,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:10}}>{s.ic}</div>
              <p style={{fontWeight:800,fontSize:13,margin:"0 0 4px",color:C.navy}}>{s.t}</p>
              <p style={{color:C.ts,fontSize:11,lineHeight:1.5,margin:0}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:C.navy,color:"#fff",padding:"38px 24px 22px"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:22,marginBottom:26}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:28,height:28,background:`linear-gradient(135deg,${C.green},${C.blue})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13}}>R</div>
                <span style={{fontWeight:900,fontSize:16}}>Rent<span style={{color:C.green}}>Right</span><span style={{color:C.blue}}>!</span></span>
              </div>
              <p style={{color:C.tt,fontSize:11,lineHeight:1.6,margin:"0 0 10px"}}>Uganda's complete housing platform. Rentals, moving services, and land listings — verified and safe.</p>
              <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:"#25D366",color:"#fff",padding:"6px 14px",borderRadius:20,fontSize:11,fontWeight:700,textDecoration:"none"}}>💬 WhatsApp</a>
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 10px"}}>Explore</p>
              {["Browse Listings","Buy Land","Moving Services","Agent Portal","Referral Program","Post a Property"].map(l=>(
                <p key={l} style={{color:C.tt,fontSize:11,margin:"0 0 6px",cursor:"pointer"}}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 10px"}}>Areas</p>
              {["Makerere","Ntinda","Kisaasi","Wandegeya","Bukoto","Naguru","Mukono","Wakiso"].map(a=>(
                <p key={a} onClick={()=>{setSearch(a);doSearch();}} style={{color:C.tt,fontSize:11,margin:"0 0 6px",cursor:"pointer"}}>📍 {a}</p>
              ))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:12,color:"#e2e8f0",margin:"0 0 10px"}}>Contact</p>
              <p style={{color:C.tt,fontSize:11,margin:"0 0 6px"}}>📱 +256 700 000 000</p>
              <p style={{color:C.tt,fontSize:11,margin:"0 0 6px"}}>📧 hello@rentright.ug</p>
              <p style={{color:C.tt,fontSize:11,margin:"0 0 12px"}}>🏢 Kampala, Uganda</p>
              <div style={{background:"rgba(248,113,113,.12)",borderRadius:10,padding:"10px 12px",fontSize:10,color:"#fca5a5",lineHeight:1.6,border:"1px solid rgba(248,113,113,.22)"}}>
                🛡️ Never pay rent before physically viewing. RentRight! is an intermediary only.
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #1e293b",paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{color:"#475569",fontSize:10,margin:0}}>© 2025 RentRight! Uganda. Intermediary platform only. Not liable for tenant–landlord disputes.</p>
            <div style={{display:"flex",gap:12}}>
              {["Privacy","Terms","Report","Agent Portal"].map(l=>(
                <span key={l} style={{color:"#475569",fontSize:10,cursor:"pointer"}} onClick={l==="Agent Portal"?()=>setAuthModal("agent"):undefined}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* FIXED BOTTOM */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(248,250,252,.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,padding:"10px 18px",display:"flex",gap:8,zIndex:300}}>
        <button onClick={()=>{if(navigator.geolocation){navigator.geolocation.getCurrentPosition(()=>{setSearch("Near Me");doSearch();},()=>{})}}} style={{flex:2,background:C.green,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>📍 Near Me</button>
        <button onClick={()=>setMovingMarket(true)} style={{flex:1.5,background:C.orange,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🚚 Moving</button>
        <button onClick={()=>user?setDashboard(true):setAuthModal("login")} style={{flex:1.5,background:C.navy,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{user?"👤 Me":"Login"}</button>
        <button onClick={()=>setChatOpen(o=>!o)} style={{flex:1,background:C.blue,color:"#fff",border:"none",borderRadius:13,padding:"11px 0",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>🤖</button>
      </div>

      {/* FLOATING WA */}
      <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer" style={{position:"fixed",bottom:82,right:20,background:"#25D366",color:"#fff",width:50,height:50,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 20px rgba(37,211,102,.4)",zIndex:500,textDecoration:"none"}}>💬</a>

      {/* MODALS */}
      {chatOpen&&<AIChat onClose={()=>setChatOpen(false)}/>}
      {authModal&&<AuthModal mode={authModal} onClose={()=>setAuthModal(null)} onAuth={handleAuth}/>}
      {adminPanel&&<AdminPanel onClose={()=>setAdminPanel(false)}/>}
      {dashboard&&user&&<UserDashboard user={user} onClose={()=>setDashboard(false)} onLogout={handleLogout} onMovingMarketplace={()=>{setDashboard(false);setMovingMarket(true);}}/>}
      {movingMarket&&<MovingMarketplace user={user} onNeedAuth={(m)=>{setMovingMarket(false);setAuthModal(m);}} onClose={()=>setMovingMarket(false)}/>}
      {landMarket&&<LandMarketplace user={user} onNeedAuth={(m)=>{setLandMarket(false);setAuthModal(m);}} onClose={()=>setLandMarket(false)}/>}
      {selected&&!booking&&!interest&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.72)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={()=>setSelected(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:26,width:"100%",maxWidth:540,maxHeight:"94vh",overflowY:"auto",boxShadow:"0 36px 90px rgba(0,0,0,.32)"}}>
            <div style={{position:"relative"}}>
              <img src={selected.img} alt={selected.title} style={{width:"100%",height:230,objectFit:"cover",borderRadius:"26px 26px 0 0"}}/>
              <button onClick={()=>setSelected(null)} style={{position:"absolute",top:12,right:12,background:"rgba(15,23,42,.8)",color:"#fff",border:"none",borderRadius:"50%",width:36,height:36,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              {selected.boosted&&<span style={{position:"absolute",top:12,left:12,background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20}}>🚀 Boosted</span>}
              <div style={{position:"absolute",bottom:12,left:12,display:"flex",gap:5}}>
                <span style={{background:selected.verified?C.gL:C.rL,color:selected.verified?C.gD:C.rD,fontSize:10,fontWeight:800,padding:"3px 11px",borderRadius:20}}>{selected.verified?"✔ Verified":"⚠ Unverified"}</span>
                <span style={{background:miInfo(selected.moveIn).bg,color:miInfo(selected.moveIn).color,fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:20}}>{miInfo(selected.moveIn).icon} {miInfo(selected.moveIn).label}</span>
              </div>
            </div>
            <div style={{padding:"18px 22px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:10}}>
                <div><h2 style={{margin:0,fontSize:18,fontWeight:900,color:C.navy}}>{selected.title}</h2><p style={{margin:"3px 0 0",color:C.ts,fontSize:12}}>📍 {selected.area} · {selected.type}</p></div>
                <div style={{textAlign:"right"}}><p style={{fontWeight:900,fontSize:18,color:C.blue,margin:0}}>UGX {selected.price.toLocaleString()}</p><p style={{fontSize:10,color:C.tt,margin:0}}>per month</p></div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {selected.verified&&<span style={{background:C.gL,color:C.gD,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20}}>🟢 Verified Owner</span>}
                {selected.photos&&<span style={{background:C.bL,color:C.bD,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20}}>📸 Real Photos</span>}
                {selected.gps&&<span style={{background:"#F0FDF4",color:C.gD,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20}}>📍 GPS Confirmed</span>}
              </div>
              <div style={{background:C.bL,borderRadius:12,padding:"10px 14px",fontSize:12,color:C.n3,lineHeight:1.6,marginBottom:12,borderLeft:`3px solid ${C.blue}`}}>🤖 {selected.desc}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <div style={{background:C.mist,borderRadius:12,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                  <p style={{fontWeight:800,fontSize:11,color:C.navy,margin:"0 0 6px"}}>⚡ Utilities</p>
                  {Object.entries(selected.utilities).map(([k,v])=><div key={k}><p style={{fontSize:9,color:C.ts,margin:0,textTransform:"capitalize"}}>{k}</p><p style={{fontSize:11,fontWeight:700,color:C.navy,margin:"0 0 4px"}}>{v}</p></div>)}
                </div>
                <div style={{background:C.mist,borderRadius:12,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                  <p style={{fontWeight:800,fontSize:11,color:C.navy,margin:"0 0 6px"}}>🏘️ Area</p>
                  <p style={{fontSize:10,color:C.ts,margin:0}}>Transport</p><p style={{fontSize:11,fontWeight:700,color:C.navy,margin:"0 0 4px"}}>{selected.neighbourhood.transport}</p>
                  <p style={{fontSize:10,color:C.ts,margin:0}}>Security</p><p style={{fontSize:11,fontWeight:700,color:C.navy,margin:0}}>{selected.neighbourhood.security}</p>
                </div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>{selected.amenities.map(a=><span key={a} style={{background:C.gL,color:C.gD,fontSize:11,padding:"3px 10px",borderRadius:12}}>{AMICONS[a]} {a}</span>)}</div>
              <div style={{background:"#FEF9C3",borderRadius:10,padding:"8px 12px",fontSize:11,color:C.yD,marginBottom:12}}>
                🧾 Similar homes in {selected.area}: UGX {selected.areaPrice.min.toLocaleString()} – {selected.areaPrice.max.toLocaleString()}/mo
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                <Btn bg={C.green} onClick={()=>{setBooking(selected);setSelected(null);}} style={{padding:"13px 0",fontSize:13}}>📅 Book Viewing</Btn>
                <Btn bg={C.blue} onClick={()=>{setInterest(selected);setSelected(null);}} style={{padding:"13px 0",fontSize:13}}>❤️ Interested</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
      {booking&&<BookingModal l={booking} onClose={()=>setBooking(null)} user={user} onNeedAuth={(m)=>{setBooking(null);setAuthModal(m);}}/>}
      {interest&&<InterestModal l={interest} onClose={()=>setInterest(null)} user={user} onNeedAuth={(m)=>{setInterest(null);setAuthModal(m);}} onBook={l=>{setInterest(null);setBooking(l);}} onMoveInRec={l=>{setInterest(null);setMoveInRec(l);}}/>}
      {moveInRec&&<MoveInRecommendations listing={moveInRec} onClose={()=>setMoveInRec(null)}/>}
      {listModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.75)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setListModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,width:"100%",maxWidth:380,padding:"26px 24px",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.3)"}}>
            <div style={{fontSize:42,marginBottom:10}}>🏠</div>
            <p style={{fontWeight:900,fontSize:17,color:C.navy,margin:"0 0 6px"}}>{user?"List Your Property":"Login to List"}</p>
            <p style={{fontSize:12,color:C.ts,margin:"0 0 18px"}}>{user?"Choose your plan and submit your listing.":"Create an account to list properties on RentRight!"}</p>
            {user
              ?<Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>setListModal(false)} style={{width:"100%"}}>Continue to Listing Form →</Btn>
              :<><Btn bg={`linear-gradient(135deg,${C.green},${C.blue})`} onClick={()=>{setListModal(false);setAuthModal("signup");}} style={{width:"100%",marginBottom:8}}>Create Account</Btn><Btn bg={C.navy} onClick={()=>{setListModal(false);setAuthModal("login");}} style={{width:"100%"}}>Login</Btn></>
            }
          </div>
        </div>
      )}
    </div>
  );
}
