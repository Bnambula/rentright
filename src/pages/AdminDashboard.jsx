import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

const navItems = [
  {section:'Overview',items:[{id:'overview',icon:'📊',label:'Dashboard'},{id:'alerts',icon:'🔔',label:'Alerts',badge:7}]},
  {section:'Verification',items:[{id:'verify',icon:'✅',label:'Verify Providers',badge:15,badgeType:'gold'},{id:'agents',icon:'🤝',label:'Agents'}]},
  {section:'Content',items:[{id:'listings',icon:'🏘️',label:'Listings'},{id:'jobs',icon:'🔨',label:'Job Board'},{id:'land',icon:'🌿',label:'Land'},{id:'hostels',icon:'🏠',label:'Hostels'}]},
  {section:'Finance',items:[{id:'payments',icon:'💰',label:'Payments'},{id:'referrals',icon:'🔗',label:'Referrals'}]},
  {section:'Operations',items:[{id:'users',icon:'👥',label:'Users'},{id:'disputes',icon:'⚖️',label:'Disputes',badge:3},{id:'settings',icon:'⚙️',label:'Settings'}]},
]

function Prompt({p,onClose}){
  if(!p)return null
  const bg={crit:'var(--red-gl)',urg:'var(--amber-gl)',ok:'var(--forest-gl)'}
  const tc={crit:'var(--red)',urg:'var(--amber)',ok:'var(--forest)'}
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'#fff',borderRadius:'var(--r-xl)',width:'100%',maxWidth:440,boxShadow:'var(--sh-xl)',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--ivory-md)',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:bg[p.type]||bg.ok,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:tc[p.type]||tc.ok,flexShrink:0,fontSize:14}}>!</div>
          <div><div style={{fontWeight:700,color:'var(--ink)'}}>{p.title}</div><div style={{fontSize:'0.72rem',color:'var(--muted)',marginTop:2}}>{p.sub}</div></div>
        </div>
        <div style={{padding:'18px 20px'}}>
          <p style={{fontSize:'0.85rem',color:'var(--ink-lt)',lineHeight:1.65,marginBottom:16}}>{p.desc}</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {p.actions?.map((a,i)=>(
              <button key={i} className={`btn btn-sm ${a.style==='danger'?'btn-red':a.style==='warn'?'btn-gold':'btn-forest'}`}
                onClick={()=>{a.action?.();onClose()}}>{a.label}</button>
            ))}
            <button className="btn btn-outline btn-sm" onClick={onClose}>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  )
}


// ── Admin Job Board ─────────────────────────────────────────
function AdminJobsBoard({ showToast, mkPrompt }) {
  const [jobs, setJobs] = useState([
    {id:'J1',ref:'',title:'Fix leaking pipe in kitchen',cat:'Plumbing',loc:'Kira',budget:45000,client:'Aisha N.',phone:'0712345678',desc:'Kitchen sink pipe burst at joint under cabinet.',posted:'2h ago',urgent:1,status:'pending',flags:[]},
    {id:'J2',ref:'',title:'Move 1-bedroom Kisaasi to Ntinda',cat:'Moving',loc:'Kisaasi → Ntinda',budget:120000,client:'Brian M.',phone:'0756789012',desc:'1BR apartment move. Sofa, bed, 2 wardrobes, fridge, TV. Saturday morning.',posted:'5h ago',urgent:0,status:'pending',flags:[]},
    {id:'J3',ref:'',title:'Install 3 sockets plus ceiling fan',cat:'Electrical',loc:'Wandegeya',budget:60000,client:'Ruth K.',phone:'0701234567',desc:'New house needs 3 double sockets and one ceiling fan in bedroom.',posted:'1d ago',urgent:0,status:'approved',ref:'JB-2025-003',flags:[]},
    {id:'J5',ref:'',title:'Night guard 3 month contract',cat:'Security',loc:'Bukoto compound',budget:300000,client:'Sarah B.',phone:'0723456789',desc:'Call me on 0712345678 to discuss — FLAGGED: Contains phone number!',posted:'1d ago',urgent:0,status:'flagged',flags:['phone_number']},
    {id:'J6',ref:'',title:'Build wardrobe and bed frame',cat:'Carpentry',loc:'Ntinda',budget:200000,client:'Grace L.',phone:'0745678901',desc:'4-door wardrobe and queen bed frame with storage. Hardwood timber preferred.',posted:'6h ago',urgent:0,status:'pending',flags:[]},
  ])

  const genRef = () => 'JB-2025-' + String(Math.floor(Math.random()*900)+100)

  const approve = (id) => {
    const ref = genRef()
    setJobs(p=>p.map(j=>j.id===id?{...j,status:'approved',ref}:j))
    showToast('Job approved — Reference: '+ref,'success')
  }
  const reject = (id) => {
    setJobs(p=>p.map(j=>j.id===id?{...j,status:'rejected'}:j))
    showToast('Job rejected — client notified')
  }
  const requestInfo = (id) => {
    setJobs(p=>p.map(j=>j.id===id?{...j,status:'info_requested'}:j))
    showToast('More information requested from client')
  }
  const banUser = (id) => {
    const job = jobs.find(j=>j.id===id)
    mkPrompt('crit','Permanent ban','Flag violation',`Ban ${job?.client} permanently for contact sharing in job description?`,[{label:'Confirm permanent ban',style:'danger',action:()=>{setJobs(p=>p.map(j=>j.id===id?{...j,status:'banned'}:j));showToast('User '+job?.client+' permanently banned','error')}}])
  }

  const statusBadge = (s) => {
    const map = {pending:['var(--amber-gl)','#7A4510','Pending review'],approved:['var(--forest-gl)','var(--forest)','Approved'],rejected:['var(--red-gl)','var(--red)','Rejected'],flagged:['var(--red-gl)','var(--red)','🚫 Flagged'],info_requested:['var(--blue-gl)','var(--blue)','Info requested'],banned:['#1A1A1A','#fff','Permanently banned']}
    const [bg,col,lbl] = map[s]||['var(--surface)','var(--muted)','Unknown']
    return <span style={{fontSize:'9px',fontWeight:700,padding:'3px 9px',borderRadius:'var(--r-full)',background:bg,color:col}}>{lbl}</span>
  }

  const filter = useState('all')
  const activeFilter = filter[0]
  const setFilter = filter[1]

  const filtered = jobs.filter(j => activeFilter==='all' || j.status===activeFilter)

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)'}}>Job board moderation</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {['all','pending','approved','flagged','rejected'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'5px 12px',fontSize:11,fontWeight:700,borderRadius:'var(--r-full)',border:'1px solid var(--border)',background:activeFilter===f?'var(--forest)':'#fff',color:activeFilter===f?'#fff':'var(--muted)',cursor:'pointer',transition:'all .15s',textTransform:'capitalize'}}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{background:'var(--amber-gl)',borderRadius:'var(--r-md)',padding:'10px 14px',marginBottom:14,fontSize:'0.78rem',color:'#7A4510',borderLeft:'3px solid var(--amber)'}}>
        <strong>Moderation policy:</strong> All jobs must be manually approved before going live. Jobs with phone numbers in descriptions are auto-flagged. Approved jobs receive a platform reference number (JB-YYYY-NNN).
      </div>
      {filtered.map(j=>(
        <div key={j.id} style={{background:'#fff',borderRadius:'var(--r-lg)',border:`1.5px solid ${j.status==='flagged'||j.status==='banned'?'var(--red)':j.status==='approved'?'var(--forest)':j.status==='pending'?'var(--amber)':'var(--border)'}`,padding:'15px 17px',marginBottom:11}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:7,alignItems:'center',marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em'}}>{j.cat}</span>
                {j.ref&&<span style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--forest)',fontWeight:700,background:'var(--forest-gl)',padding:'1px 7px',borderRadius:'var(--r-full)'}}>{j.ref}</span>}
                {j.urgent===1&&<span style={{fontSize:'9px',fontWeight:700,padding:'2px 7px',borderRadius:'var(--r-full)',background:'var(--red)',color:'#fff'}}>URGENT</span>}
                {statusBadge(j.status)}
              </div>
              <div style={{fontWeight:700,color:'var(--ink)',marginBottom:3}}>{j.title}</div>
              <div style={{fontSize:'0.72rem',color:'var(--muted)',marginBottom:5}}>📍 {j.loc} · {j.posted} · Budget: {('UGX '+Number(j.budget).toLocaleString())}</div>
              <div style={{fontSize:'0.75rem',color:'var(--ink-lt)',lineHeight:1.6,marginBottom:6,background:'var(--surface)',borderRadius:'var(--r-xs)',padding:'8px 10px'}}>{j.desc}</div>
              <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>Client: <strong>{j.client}</strong> · <span style={{fontFamily:'var(--font-mono)',color:'var(--forest)'}}>{j.phone}</span></div>
            </div>
          </div>
          {j.status==='flagged'&&(
            <div style={{background:'var(--red-gl)',borderRadius:'var(--r-sm)',padding:'8px 12px',marginBottom:10,fontSize:'0.75rem',color:'var(--red)',border:'1px solid var(--red)'}}>
              🚫 <strong>Auto-flagged:</strong> Description contains a phone number (contact sharing detected). This violates platform terms.
            </div>
          )}
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {j.status==='pending'&&<>
              <button className="btn btn-forest btn-sm" onClick={()=>approve(j.id)}>✓ Approve & publish</button>
              <button className="btn btn-gold btn-sm" onClick={()=>requestInfo(j.id)}>Request info</button>
              <button className="btn btn-red btn-sm" onClick={()=>reject(j.id)}>Reject</button>
            </>}
            {j.status==='flagged'&&<>
              <button className="btn btn-red btn-sm" onClick={()=>banUser(j.id)}>🔨 Permanent ban</button>
              <button className="btn btn-gold btn-sm" onClick={()=>requestInfo(j.id)}>Request correction</button>
              <button className="btn btn-outline btn-sm" onClick={()=>reject(j.id)}>Reject only</button>
            </>}
            {j.status==='approved'&&(
              <div style={{fontSize:'0.75rem',color:'var(--forest)',fontWeight:600}}>✓ Live on platform · {j.ref}</div>
            )}
            {j.status==='info_requested'&&(
              <div style={{fontSize:'0.75rem',color:'var(--blue)',fontWeight:600}}>⏳ Awaiting client response</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard(){
  const {user,signOut,showToast}=useAuth()
  const nav=useNavigate()
  const [active,setActive]=useState('overview')
  const [prompt,setPrompt]=useState(null)

  if(!user||user.role!=='admin'){nav('/admin');return null}

  const mkPrompt=(type,title,sub,desc,actions)=>setPrompt({type,title,sub,desc,actions:actions.map(a=>({...a,action:()=>showToast(a.label+' executed')}))})

  const renderContent=()=>{
    if(active==='overview')return(
      <div>
        <div className="kpi-grid">
          {[['🏘️','8','Listings',90],['👥','2,847','Users',74],['💰','UGX 4.28M','Revenue MTD',88],['✅','15','Pending verify',30],['🔨','6','Active jobs',65],['⚖️','3','Disputes',45]].map(([ico,val,lbl,bar],i)=>(
            <div key={i} className="kpi-card"><div className="kpi-icon">{ico}</div><div className="kpi-value" style={{fontSize:'1.3rem'}}>{val}</div><div className="kpi-label">{lbl}</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:bar+'%'}}/></div></div>
          ))}
        </div>
        <div className="grid-2" style={{gap:14}}>
          <div className="table-wrap">
            <div className="table-hdr"><div className="table-title">Active alerts</div><button className="btn btn-outline btn-sm" onClick={()=>setActive('alerts')}>View all</button></div>
            {[{type:'crit',t:'Fraud: same phone 3 listings',d:'Ntinda auto-flagged',tm:'12m'},{type:'urg',t:'15 providers pending SLA',d:'3 past 20hr mark',tm:'1h'},{type:'ok',t:'Agent verified: Grace K.',d:'All docs confirmed',tm:'7h'}].map((a,i)=>(
              <div key={i} onClick={()=>mkPrompt(a.type,a.t,a.d,'This alert requires your attention. Review and take appropriate action.',[{label:'Investigate',style:'warn'},{label:'Resolve',style:'ok'},{label:'False alarm',style:'ok'}])}
                style={{display:'flex',alignItems:'center',gap:12,padding:'11px 17px',borderLeft:`3px solid ${a.type==='crit'?'var(--red)':a.type==='urg'?'var(--amber)':'var(--forest)'}`,borderBottom:'1px solid var(--ivory-md)',cursor:'pointer',transition:'background var(--dur-fast)'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--ivory)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <div style={{flex:1}}><div style={{fontSize:'0.8rem',fontWeight:700,color:'var(--ink)'}}>{a.t}</div><div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{a.d}</div></div>
                <span style={{fontSize:'0.65rem',color:'var(--muted)'}}>{a.tm}</span>
              </div>
            ))}
          </div>
          <div className="table-wrap">
            <div className="table-hdr"><div className="table-title">Recent transactions</div></div>
            {[['Viewing fee — Bukoto','UGX +5,000','Today','in'],['Job commission 8%','UGX +3,600','Today','in'],['Referral payout','UGX -2,000','Yesterday','out'],['Land access fee','UGX +50,000','2d ago','in']].map(([d,a,t,dir],i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 17px',borderBottom:'1px solid var(--ivory-md)'}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:dir==='in'?'var(--forest-gl)':'var(--red-gl)',color:dir==='in'?'var(--forest)':'var(--red)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800}}>{dir==='in'?'+':'−'}</div>
                <div style={{flex:1}}><div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--ink)'}}>{d}</div><div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{t}</div></div>
                <div style={{fontWeight:800,fontSize:'0.78rem',color:dir==='in'?'var(--forest)':'var(--red)'}}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    if(active==='alerts')return(
      <div className="table-wrap">
        <div className="table-hdr"><div className="table-title">All system alerts</div><button className="btn btn-outline btn-sm" onClick={()=>showToast('All alerts marked as read')}>Mark all read</button></div>
        {[{type:'crit',t:'Fraud: same phone 3 listings in 2hrs',d:'Ntinda — Auto-flagged by AI',tm:'12m',actions:[{label:'Ban user',style:'danger'},{label:'Freeze listing',style:'warn'},{label:'False alarm',style:'ok'}]},{type:'crit',t:'Dispute D001 unresolved 8 hours',d:'SLA breach — UGX 45,000',tm:'8h',actions:[{label:'Escalate',style:'danger'},{label:'Resolve',style:'ok'}]},{type:'urg',t:'15 providers pending SLA risk',d:'3 providers past 20-hour mark',tm:'1h',actions:[{label:'Send reminder',style:'warn'},{label:'Extend SLA',style:'ok'}]},{type:'ok',t:'Agent verified: Grace K.',d:'All docs confirmed, field visit done',tm:'7h',actions:[{label:'Archive',style:'ok'}]}].map((a,i)=>(
          <div key={i} onClick={()=>mkPrompt(a.type,a.t,a.tm,a.d,a.actions)}
            style={{display:'flex',alignItems:'flex-start',gap:12,padding:'13px 17px',borderLeft:`3px solid ${a.type==='crit'?'var(--red)':a.type==='urg'?'var(--amber)':'var(--forest)'}`,borderBottom:'1px solid var(--ivory-md)',cursor:'pointer'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--ivory)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
            <div style={{flex:1}}><div style={{fontSize:'0.82rem',fontWeight:700,color:'var(--ink)'}}>{a.t}</div><div style={{fontSize:'0.7rem',color:'var(--muted)',marginTop:2}}>{a.d}</div></div>
            <span style={{fontSize:'0.65rem',color:'var(--muted)',flexShrink:0}}>{a.tm}</span>
          </div>
        ))}
      </div>
    )

    if(active==='verify')return(
      <div>
        <div className="note note-amber" style={{marginBottom:16}}>SLA: All provider approvals within 24 hours. 15 pending.</div>
        {[{n:'Moses Opio',t:'Moving Provider',docs:['NIN Front','NIN Back','LC Letter','Agreement','Guarantor','Guarantor NIN'],done:[1,1,1,1,1,0]},{n:'Aisha Kamya',t:'Laundry',docs:['NIN Front','NIN Back','LC Letter','Agreement','Guarantor','Guarantor NIN'],done:[1,0,0,1,0,0]}].map((app,i)=>(
          <div key={i} className="table-wrap" style={{marginBottom:14}}>
            <div className="table-hdr">
              <div><div className="table-title">{app.n} — {app.t}</div><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>{app.done.filter(Boolean).length}/{app.docs.length} docs complete</div></div>
              <span className={`badge ${app.done.every(Boolean)?'badge-green':'badge-amber'}`}>{app.done.every(Boolean)?'Ready to approve':'Incomplete'}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,padding:'13px 17px'}}>
              {app.docs.map((d,j)=>(
                <div key={j} style={{background:'var(--ivory)',borderRadius:'var(--r-sm)',padding:'8px 10px',textAlign:'center',border:'1px solid var(--border)',cursor:'pointer'}}
                  onClick={()=>mkPrompt('ok','Review Document',`${d} — ${app.n}`,`In production, this opens the uploaded ${d} for review.`,[{label:'Approve doc',style:'ok'},{label:'Reject doc',style:'danger'},{label:'Request resubmit',style:'warn'}])}>
                  <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--ink)'}}>{d}</div>
                  <div style={{fontSize:10,fontWeight:700,color:app.done[j]?'var(--green-ok)':'var(--red)'}}>{app.done[j]?'✓ Submitted':'Missing'}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:8,padding:'11px 17px',borderTop:'1px solid var(--ivory-md)'}}>
              <button className="btn btn-forest btn-sm" onClick={()=>mkPrompt('ok','Approve Provider',app.n,`Approve ${app.n} as verified? SMS will be sent and account activated.`,[{label:'Yes, approve',style:'ok'}])}>Approve</button>
              <button className="btn btn-red btn-sm" onClick={()=>mkPrompt('crit','Reject Provider',app.n,`Reject ${app.n}? They will be notified by SMS with reason.`,[{label:'Reject',style:'danger'}])}>Reject</button>
              <button className="btn btn-outline btn-sm" onClick={()=>showToast('Document request sent to '+app.n)}>Request docs</button>
              <button className="btn btn-outline btn-sm" onClick={()=>mkPrompt('urg','Schedule Field Visit',app.n,'Schedule field agent to visit provider address. Cost UGX 30,000 charged to provider.',[{label:'Schedule visit',style:'warn'}])}>Field visit</button>
            </div>
          </div>
        ))}
      </div>
    )

    if(active==='settings')return(
      <div>
        <div className="table-wrap" style={{marginBottom:14}}>
          <div className="table-hdr"><div className="table-title">Platform fee settings</div><button className="btn btn-forest btn-sm" onClick={()=>mkPrompt('urg','Save Fee Settings','Platform fees','Changing fees takes effect immediately for all new transactions.',[{label:'Save and apply',style:'ok'}])}>Save changes</button></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,padding:18}}>
            {[['Viewing fee (UGX)','5,000'],['Platform keeps (UGX)','3,000'],['Referral payout (UGX)','2,000'],['Min withdrawal (UGX)','20,000'],['Job commission (%)','8'],['Land access fee (UGX)','50,000'],['Boost 7 days (UGX)','25,000'],['Boost 30 days (UGX)','50,000'],['Provider SLA (hrs)','24'],['Dispute SLA (hrs)','12']].map(([lbl,val],i)=>(
              <div key={i}><label className="field-label">{lbl}</label><input className="input" defaultValue={val}/></div>
            ))}
          </div>
        </div>
      </div>
    )

    if(active==='jobs')return(<AdminJobsBoard showToast={showToast} mkPrompt={mkPrompt}/>)

    return <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',padding:22,textAlign:'center',color:'var(--muted)',fontSize:'0.85rem'}}>Connect your backend API to populate this section with live data.</div>
  }

  return(
    <div className="dash-layout">
      <aside className="dash-side">
        <div className="dash-side-logo">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:34,height:34,background:'var(--gold)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="17" height="17" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg></div>
            <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'#fff'}}>Homeyo Admin</div><div style={{fontSize:'9px',color:'rgba(255,255,255,.3)',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase'}}>ADMIN PANEL</div></div>
          </div>
        </div>
        <div className="dash-nav">
          {navItems.map(section=>(
            <div key={section.section}>
              <div className="dash-nav-sec">{section.section}</div>
              {section.items.map(item=>(
                <button key={item.id} className={`dash-nav-item${active===item.id?' active':''}`} onClick={()=>setActive(item.id)}>
                  <span className="dash-nav-icon">{item.icon}</span>
                  <span className="dash-nav-label">{item.label}</span>
                  {item.badge&&<span className={`dash-nav-badge${item.badgeType==='gold'?' gold':''}`}>{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:'12px 8px',borderTop:'1px solid rgba(255,255,255,.07)'}}>
          <button className="dash-nav-item" onClick={()=>nav('/')}><span className="dash-nav-icon">🌐</span><span className="dash-nav-label">Main site</span></button>
          <button className="dash-nav-item" onClick={()=>{signOut();nav('/admin')}}><span className="dash-nav-icon">🚪</span><span className="dash-nav-label" style={{color:'rgba(197,48,48,.8)'}}>Sign out</span></button>
        </div>
      </aside>
      <div className="dash-main">
        <div className="dash-topbar">
          <div className="dash-page-title">{active.charAt(0).toUpperCase()+active.slice(1)}</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{textAlign:'right'}}><div style={{fontSize:'0.82rem',fontWeight:700,color:'var(--ink)'}}>Admin</div><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Platform administrator</div></div>
            <div className="dash-avatar">A</div>
          </div>
        </div>
        <div className="dash-content">{renderContent()}</div>
      </div>
      <Prompt p={prompt} onClose={()=>setPrompt(null)}/>
    </div>
  )
}
