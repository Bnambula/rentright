import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { HOSTELS, JOBS, PROVIDERS } from '../data/index.js'

const fmt = n => 'UGX ' + Number(n).toLocaleString()

const STUDENT_NAV = [
  { section:'My stay', items:[
    {id:'overview',icon:'🏠',label:'Overview'},
    {id:'my-room',icon:'🚪',label:'My room'},
    {id:'maintenance',icon:'🔧',label:'Report issue'},
    {id:'payments',icon:'💰',label:'Payments'},
  ]},
  { section:'Find housing', items:[
    {id:'hostels',icon:'🎓',label:'Browse hostels'},
    {id:'rentals',icon:'🏘️',label:'Rentals after campus'},
  ]},
  { section:'Earn money', items:[
    {id:'jobs',icon:'🔨',label:'Jobs near campus',badge:3},
    {id:'gigs',icon:'⚡',label:'Quick gigs'},
  ]},
  { section:'Services', items:[
    {id:'laundry',icon:'👗',label:'Book laundry'},
    {id:'cleaners',icon:'🧹',label:'Cleaners'},
  ]},
  { section:'Account', items:[
    {id:'profile',icon:'👤',label:'My profile'},
    {id:'settings',icon:'⚙️',label:'Settings'},
  ]},
]

function StudentSidebar({ active, setActive, user }) {
  const { signOut } = useAuth()
  const nav = useNavigate()
  return (
    <aside style={{ width:240, background:'#0F1F15', minHeight:'100vh', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh', overflowY:'auto' }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{ width:36,height:36,background:'var(--gold)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'#fff',letterSpacing:'-0.02em' }}>Homeyo</div>
            <div style={{ fontSize:'9px',color:'rgba(255,255,255,.3)',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase' }}>Student Portal</div>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,.06)',borderRadius:'var(--r-sm)',padding:'9px 11px' }}>
          <div style={{ width:30,height:30,borderRadius:'50%',background:'var(--forest)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0 }}>{user?.name?.[0]?.toUpperCase()||'S'}</div>
          <div>
            <div style={{ fontSize:'0.8rem',fontWeight:700,color:'#fff' }}>{user?.name||'Student'}</div>
            <div style={{ fontSize:'0.68rem',color:'rgba(255,255,255,.4)' }}>{user?.email||''}</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'10px 8px',flex:1,overflowY:'auto' }}>
        {STUDENT_NAV.map(section=>(
          <div key={section.section}>
            <div style={{ fontSize:'9px',fontWeight:700,color:'rgba(255,255,255,.25)',letterSpacing:'.12em',textTransform:'uppercase',padding:'12px 10px 4px' }}>{section.section}</div>
            {section.items.map(item=>(
              <button key={item.id} onClick={()=>setActive(item.id)}
                style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:'var(--r-sm)',cursor:'pointer',width:'100%',textAlign:'left',border:'none',background:active===item.id?'rgba(201,168,76,.18)':'none',borderLeft:`3px solid ${active===item.id?'var(--gold)':'transparent'}`,marginBottom:1,transition:'all var(--dur-fast)',fontFamily:'var(--font-body)' }}>
                <span style={{ fontSize:15,width:20,textAlign:'center',flexShrink:0 }}>{item.icon}</span>
                <span style={{ fontSize:'0.8rem',fontWeight:active===item.id?700:500,color:active===item.id?'var(--gold-lt)':'rgba(255,255,255,.5)',flex:1 }}>{item.label}</span>
                {item.badge&&<span style={{ background:'var(--red)',color:'#fff',fontSize:'9px',fontWeight:800,padding:'2px 6px',borderRadius:'var(--r-full)',minWidth:18,textAlign:'center' }}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:'10px 8px',borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <button onClick={()=>nav('/')} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 10px',width:'100%',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)' }}><span style={{ fontSize:15 }}>🌐</span><span style={{ fontSize:'0.8rem',color:'rgba(255,255,255,.4)' }}>Back to site</span></button>
        <button onClick={()=>signOut(nav)} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 10px',width:'100%',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)' }}><span style={{ fontSize:15 }}>🚪</span><span style={{ fontSize:'0.8rem',color:'rgba(197,48,48,.7)' }}>Sign out</span></button>
      </div>
    </aside>
  )
}

function OverviewTab({ setActive, showToast }) {
  return (
    <div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24 }}>
        {[
          {icon:'🚪',val:'Room P201',lbl:'My room',sub:'Sem 1 2025'},
          {icon:'💰',val:'UGX 1.2M',lbl:'Rent paid',sub:'This semester'},
          {icon:'🔨',val:'3 jobs',lbl:'Available near you',sub:'Tap to browse'},
          {icon:'⭐',val:'UGX 45,000',lbl:'Earned this month',sub:'From platform jobs'},
        ].map((k,i)=>(
          <div key={i} style={{ background:'#fff',borderRadius:'var(--r-lg)',padding:18,border:'1px solid var(--border)',boxShadow:'var(--sh-xs)' }}>
            <div style={{ fontSize:'1.3rem',marginBottom:8 }}>{k.icon}</div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',letterSpacing:'-0.03em',marginBottom:2 }}>{k.val}</div>
            <div style={{ fontSize:'10px',fontWeight:700,color:'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase' }}>{k.lbl}</div>
            <div style={{ fontSize:'0.68rem',color:'var(--muted)',marginTop:3 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        <div style={{ background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:20 }}>
          <div style={{ fontWeight:700,color:'var(--ink)',marginBottom:14 }}>My hostel stay</div>
          <div style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:12 }}>
            <div style={{ width:50,height:50,borderRadius:'var(--r-md)',background:'var(--forest-gl)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0 }}>🏠</div>
            <div>
              <div style={{ fontWeight:700,color:'var(--ink)' }}>Akamwesi Premium Hostel</div>
              <div style={{ fontSize:'0.75rem',color:'var(--muted)',marginTop:2 }}>📍 Banda · Room P201 · Double</div>
              <div style={{ fontSize:'0.75rem',color:'var(--forest)',fontWeight:600,marginTop:2 }}>Semester 1 2025 · Active</div>
            </div>
          </div>
          <div style={{ background:'var(--ivory)',borderRadius:'var(--r-sm)',padding:'10px 12px',fontSize:'0.75rem',color:'var(--muted)',lineHeight:1.6 }}>
            Warden: Mrs Sarah Nakato · 0771 234 567<br/>
            WiFi: 50Mbps · En-suite bathroom · Study desk · AC
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginTop:12,width:'100%' }} onClick={()=>setActive('my-room')}>View room details →</button>
        </div>
        <div style={{ background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:20 }}>
          <div style={{ fontWeight:700,color:'var(--ink)',marginBottom:14 }}>Quick actions</div>
          {[
            {ico:'🔧',lbl:'Report a maintenance issue',desc:'Leaking roof, broken lock etc.',action:()=>setActive('maintenance')},
            {ico:'👗',lbl:'Book laundry pickup',desc:'From UGX 8,000/kg',action:()=>setActive('laundry')},
            {ico:'🔨',lbl:'Find a job near campus',desc:'3 jobs available now',action:()=>setActive('jobs')},
            {ico:'🏘️',lbl:'Find rentals after campus',desc:'Transition easily into renting',action:()=>setActive('rentals')},
          ].map((a,i)=>(
            <button key={i} onClick={a.action} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 0',width:'100%',background:'none',border:'none',borderBottom:i<3?'1px solid var(--ivory-md)':'none',cursor:'pointer',textAlign:'left',transition:'all var(--dur-fast)',fontFamily:'var(--font-body)' }}>
              <div style={{ width:34,height:34,background:'var(--forest-gl)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0 }}>{a.ico}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.82rem',fontWeight:600,color:'var(--ink)' }}>{a.lbl}</div>
                <div style={{ fontSize:'0.7rem',color:'var(--muted)',marginTop:1 }}>{a.desc}</div>
              </div>
              <div style={{ color:'var(--muted)',fontSize:16 }}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function JobsTab({ showToast }) {
  const [applied, setApplied] = useState([])
  const campusJobs = JOBS.filter(j => j.status === 'approved')
  const apply = (id) => {
    setApplied(prev => [...prev, id])
    showToast('Application sent! Provider will contact you after admin approval.', 'success')
  }
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:6 }}>Jobs near campus</div>
      <p style={{ fontSize:'0.85rem',color:'var(--muted)',marginBottom:18 }}>Earn extra cash between lectures. All jobs are within 5km of your campus area.</p>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14 }}>
        {campusJobs.map(j=>{
          const isApplied = applied.includes(j.id)
          return (
            <div key={j.id} style={{ background:'#fff',borderRadius:'var(--r-lg)',border:'1.5px solid var(--border)',padding:18,transition:'all var(--dur-mid)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
                <div style={{ width:10,height:10,borderRadius:'50%',background:j.col,flexShrink:0 }}/>
                <span style={{ fontSize:10,fontWeight:700,color:j.col,letterSpacing:'.06em',textTransform:'uppercase' }}>{j.cat}</span>
                {j.urgent&&<span style={{ fontSize:'8px',fontWeight:700,padding:'2px 7px',borderRadius:'var(--r-full)',background:'var(--red-gl)',color:'var(--red)',textTransform:'uppercase',letterSpacing:'.06em' }}>URGENT</span>}
              </div>
              <div style={{ fontWeight:700,color:'var(--ink)',marginBottom:5,lineHeight:1.3 }}>{j.title}</div>
              <div style={{ fontSize:'0.75rem',color:'var(--muted)',marginBottom:8 }}>📍 {j.loc} · Posted {j.posted}</div>
              <div style={{ fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--forest)',marginBottom:10 }}>{fmt(j.budget)}</div>
              <div style={{ fontSize:'0.75rem',color:'var(--muted)',lineHeight:1.6,marginBottom:12 }}>{j.desc.slice(0,100)}...</div>
              <button onClick={()=>apply(j.id)} disabled={isApplied}
                style={{ width:'100%',padding:'9px',fontSize:12,fontWeight:700,borderRadius:'var(--r-sm)',border:'none',cursor:isApplied?'not-allowed':'pointer',background:isApplied?'var(--forest-gl)':'var(--forest)',color:isApplied?'var(--forest)':'#fff',transition:'all var(--dur-fast)' }}>
                {isApplied ? '✓ Applied' : 'Apply now'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LaundryTab({ showToast }) {
  const laundrers = PROVIDERS.filter(p => p.type === 'Laundry')
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:16 }}>Book laundry pickup</div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
        {laundrers.map(p=>(
          <div key={p.id} style={{ background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',overflow:'hidden' }}>
            <div style={{ padding:'16px 18px' }}>
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:10 }}>
                <div style={{ width:46,height:46,borderRadius:'50%',background:p.col,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.1rem',color:'var(--forest)',flexShrink:0 }}>{p.ini}</div>
                <div>
                  <div style={{ fontWeight:700,color:'var(--ink)' }}>{p.name}</div>
                  <div style={{ fontSize:'0.72rem',color:'var(--muted)' }}>{p.area} · {p.dist} away</div>
                </div>
              </div>
              <div style={{ fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--forest)',marginBottom:8 }}>{p.price}</div>
              <div style={{ display:'flex',gap:5,flexWrap:'wrap',marginBottom:12 }}>
                {p.specs.map(s=><span key={s} style={{ fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:'var(--r-full)',background:'var(--forest-gl)',color:'var(--forest)' }}>{s}</span>)}
              </div>
            </div>
            <div style={{ borderTop:'1px solid var(--border)' }}>
              <button onClick={()=>showToast(`Booking ${p.name} — negotiation chat opened`)} style={{ width:'100%',padding:'11px',fontSize:12,fontWeight:700,background:'var(--forest)',color:'#fff',border:'none',cursor:'pointer' }}>Book pickup</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HostelsTab({ showToast }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const tiers = ['all','budget','mid','premium']
  const filtered = HOSTELS.filter(h => {
    if (filter !== 'all' && h.tier !== filter) return false
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.area.toLowerCase().includes(search.toLowerCase()) && !h.uni.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  const tierColor = { budget:'var(--blue)', mid:'var(--amber)', premium:'var(--gold-dk)' }
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:6 }}>Browse hostels across Uganda</div>
      <p style={{ fontSize:'0.85rem',color:'var(--muted)',marginBottom:16 }}>Find your next accommodation from budget to premium. 8 hostels near major universities.</p>
      <div style={{ display:'flex',gap:10,marginBottom:18,flexWrap:'wrap',alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, area or university..."
          style={{ flex:1,minWidth:200,padding:'9px 13px',border:'1.5px solid var(--border)',borderRadius:'var(--r-md)',fontSize:13,outline:'none',fontFamily:'var(--font-body)' }}/>
        {tiers.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{ padding:'8px 16px',fontSize:11,fontWeight:700,borderRadius:'var(--r-full)',border:'1px solid var(--border)',background:filter===t?'var(--forest)':'#fff',color:filter===t?'#fff':'var(--muted)',cursor:'pointer',textTransform:'capitalize' }}>{t==='all'?'All tiers':t}</button>
        ))}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14 }}>
        {filtered.map(h=>{
          const avail = h.rooms.filter(r=>r.status==='Available').length
          const minPrice = Math.min(...h.rooms.map(r=>r.price))
          return (
            <div key={h.id} style={{ background:'#fff',borderRadius:'var(--r-lg)',overflow:'hidden',border:'1px solid var(--border)',boxShadow:'var(--sh-sm)',transition:'all var(--dur-mid)' }}>
              <div style={{ position:'relative',height:160 }}>
                <img src={h.img} alt={h.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(17,28,22,.78))' }}/>
                <div style={{ position:'absolute',top:10,left:10,display:'flex',gap:5 }}>
                  <span style={{ fontSize:'9px',fontWeight:700,padding:'3px 9px',borderRadius:'var(--r-full)',background:h.tier==='premium'?'var(--gold)':h.tier==='mid'?'var(--amber-gl)':'var(--blue-gl)',color:h.tier==='premium'?'var(--ink)':h.tier==='mid'?'#7A4510':'var(--blue)',textTransform:'capitalize' }}>{h.tier}</span>
                  <span style={{ fontSize:'9px',fontWeight:700,padding:'3px 9px',borderRadius:'var(--r-full)',background:avail>0?'var(--forest)':'var(--red)',color:'#fff' }}>{avail} available</span>
                </div>
                <div style={{ position:'absolute',bottom:10,left:12,color:'#fff' }}>
                  <div style={{ fontWeight:800,fontSize:'0.92rem' }}>{h.name}</div>
                  <div style={{ fontSize:'0.72rem',opacity:.8 }}>📍 {h.area} · {h.uni}</div>
                </div>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:'1rem',fontWeight:700,color:'var(--forest)' }}>From {fmt(minPrice)}<span style={{ fontSize:11,fontWeight:400,color:'var(--muted)' }}>/sem</span></div>
                  <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--muted)' }}>UGX {(h.financials.bookingFee/1000).toFixed(0)}K booking fee</div>
                </div>
                <div style={{ display:'flex',gap:4,flexWrap:'wrap',marginBottom:10 }}>
                  {h.facilities.slice(0,3).map(f=><span key={f} style={{ fontSize:'9px',fontWeight:600,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--forest-gl)',color:'var(--forest)' }}>{f}</span>)}
                </div>
                <button onClick={()=>showToast(`Opening booking for ${h.name}`)} style={{ width:'100%',padding:'9px',fontSize:12,fontWeight:700,background:'var(--forest)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',cursor:'pointer' }}>Book a room →</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MaintenanceTab({ showToast }) {
  const [sub, setSub] = useState({ room:'P201', type:'', desc:'', priority:'medium' })
  const [submitted, setSubmitted] = useState(false)
  const [myIssues, setMyIssues] = useState([
    { type:'Broken door lock', date:'Jan 2, 2025', status:'In progress', priority:'medium' }
  ])
  const submit = () => {
    if (!sub.type || !sub.desc) return showToast('Please fill in issue type and description', 'error')
    setMyIssues(prev => [{ ...sub, date: new Date().toLocaleDateString('en-UG'), status:'Open' }, ...prev])
    setSubmitted(true)
    showToast('Issue reported — warden will be notified', 'success')
  }
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:16 }}>Report a maintenance issue</div>
      {!submitted ? (
        <div style={{ background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:22,marginBottom:20 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>Room number</div>
              <input value={sub.room} onChange={e=>setSub(p=>({...p,room:e.target.value}))} style={{ width:'100%',padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)' }}/>
            </div>
            <div>
              <div style={{ fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>Issue type</div>
              <select value={sub.type} onChange={e=>setSub(p=>({...p,type:e.target.value}))} style={{ width:'100%',padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)',background:'#fff' }}>
                <option value="">Select type</option>
                {['Leaking roof','Broken door/window','Electrical issue','Plumbing problem','Bed/furniture broken','WiFi not working','Water shortage','Pest/rodent issue','Other'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>Description</div>
            <textarea value={sub.desc} onChange={e=>setSub(p=>({...p,desc:e.target.value}))} rows={4} placeholder="Describe the issue in detail. Include when it started and how it affects you." style={{ width:'100%',padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)',resize:'vertical' }}/>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6 }}>Priority</div>
            <div style={{ display:'flex',gap:8 }}>
              {[['low','Low','Normal pace'],['medium','Medium','Within a week'],['high','High','Urgent — affects safety']].map(([v,l,d])=>(
                <button key={v} onClick={()=>setSub(p=>({...p,priority:v}))} style={{ flex:1,padding:'9px',borderRadius:'var(--r-sm)',border:`1.5px solid ${sub.priority===v?v==='high'?'var(--red)':v==='medium'?'var(--amber)':'var(--forest)':'var(--border)'}`,background:sub.priority===v?v==='high'?'var(--red-gl)':v==='medium'?'var(--amber-gl)':'var(--forest-gl)':'#fff',cursor:'pointer',textAlign:'left' }}>
                  <div style={{ fontSize:'0.78rem',fontWeight:700,color:sub.priority===v?v==='high'?'var(--red)':v==='medium'?'#7A4510':'var(--forest)':'var(--muted)' }}>{l}</div>
                  <div style={{ fontSize:'0.65rem',color:'var(--muted)',marginTop:1 }}>{d}</div>
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-forest" onClick={submit}>Submit issue to warden</button>
        </div>
      ) : (
        <div style={{ background:'var(--forest-gl)',borderRadius:'var(--r-lg)',border:'1px solid var(--forest-10)',padding:22,marginBottom:20,textAlign:'center' }}>
          <div style={{ fontSize:'2rem',marginBottom:8 }}>✓</div>
          <div style={{ fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--forest)',marginBottom:6 }}>Issue reported!</div>
          <p style={{ fontSize:'0.82rem',color:'var(--muted)' }}>Your warden will be notified and will respond within 24 hours.</p>
          <button className="btn btn-outline btn-sm" style={{ marginTop:12 }} onClick={()=>setSubmitted(false)}>Report another issue</button>
        </div>
      )}
      <div style={{ fontWeight:700,color:'var(--ink)',marginBottom:12 }}>My reported issues</div>
      {myIssues.map((iss,i)=>(
        <div key={i} style={{ background:'#fff',borderRadius:'var(--r-md)',border:'1px solid var(--border)',padding:'13px 16px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div><div style={{ fontWeight:700,color:'var(--ink)',fontSize:'0.85rem' }}>{iss.type}</div><div style={{ fontSize:'0.72rem',color:'var(--muted)',marginTop:2 }}>Room {iss.room} · {iss.date}</div></div>
          <span style={{ fontSize:'9px',fontWeight:700,padding:'3px 9px',borderRadius:'var(--r-full)',background:iss.status==='Resolved'?'var(--forest-gl)':iss.status==='In progress'?'var(--blue-gl)':'var(--amber-gl)',color:iss.status==='Resolved'?'var(--forest)':iss.status==='In progress'?'var(--blue)':'#7A4510' }}>{iss.status}</span>
        </div>
      ))}
    </div>
  )
}

function PaymentsTab({ showToast }) {
  const ref = 'HST-H1-P201-YM3Q'
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:16 }}>My payments</div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:22 }}>
        {[{ico:'✅',val:'UGX 80,000',lbl:'Booking fee paid',sub:'Confirmed Jan 2025'},{ico:'🏠',val:'UGX 1.8M',lbl:'Sem 1 rent',sub:'Stanbic Bank · Jan 2025'},{ico:'⏳',val:'UGX 1.75M',lbl:'Sem 2 due',sub:'Due Aug 2025'}].map((k,i)=>(
          <div key={i} style={{ background:'#fff',borderRadius:'var(--r-lg)',padding:18,border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'1.3rem',marginBottom:8 }}>{k.ico}</div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',letterSpacing:'-0.03em' }}>{k.val}</div>
            <div style={{ fontSize:'10px',fontWeight:700,color:'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase',marginTop:4 }}>{k.lbl}</div>
            <div style={{ fontSize:'0.68rem',color:'var(--muted)',marginTop:2 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--forest)',borderRadius:'var(--r-lg)',padding:20,textAlign:'center',marginBottom:16 }}>
        <div style={{ fontSize:'9px',color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:6 }}>Your booking reference</div>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:'1.4rem',fontWeight:700,color:'var(--gold-lt)',letterSpacing:'.08em' }}>{ref}</div>
        <div style={{ fontSize:'0.72rem',color:'rgba(255,255,255,.45)',marginTop:5 }}>Quote this at any Stanbic Bank branch when paying rent</div>
        <button onClick={()=>{navigator.clipboard?.writeText(ref);showToast('Reference copied!')}} style={{ marginTop:12,padding:'8px 18px',background:'var(--gold)',color:'var(--ink)',border:'none',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:700,cursor:'pointer' }}>Copy reference</button>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user, showToast } = useAuth()
  const nav = useNavigate()
  const [active, setActive] = useState('overview')

  if (!user || user.role !== 'student') {
    nav('/'); return null
  }

  const titles = { overview:'Overview', 'my-room':'My room', maintenance:'Report maintenance issue', payments:'My payments', hostels:'Browse hostels', rentals:'Rentals after campus', jobs:'Jobs near campus', gigs:'Quick gigs', laundry:'Book laundry', cleaners:'Book cleaners', profile:'My profile', settings:'Settings' }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--ivory)' }}>
      <StudentSidebar active={active} setActive={setActive} user={user}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 28px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10, boxShadow:'var(--sh-xs)' }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)' }}>{titles[active]||'Dashboard'}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{user.name} · Kyambogo University · Year 2</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--gold)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>
              {user.name?.[0]?.toUpperCase()||'S'}
            </div>
          </div>
        </div>
        <div style={{ padding:28, flex:1, overflowY:'auto' }}>
          {active==='overview'    && <OverviewTab setActive={setActive} showToast={showToast}/>}
          {active==='jobs'        && <JobsTab showToast={showToast}/>}
          {active==='laundry'     && <LaundryTab showToast={showToast}/>}
          {active==='hostels'     && <HostelsTab showToast={showToast}/>}
          {active==='maintenance' && <MaintenanceTab showToast={showToast}/>}
          {active==='payments'    && <PaymentsTab showToast={showToast}/>}
          {(active==='my-room'||active==='rentals'||active==='gigs'||active==='cleaners'||active==='profile'||active==='settings') && (
            <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', padding:24, textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:10 }}>{['my-room','rentals','gigs','cleaners','profile','settings'].includes(active)?'🔧':'📊'}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)', marginBottom:6 }}>{titles[active]}</div>
              <p style={{ color:'var(--muted)', fontSize:'0.85rem', maxWidth:400, margin:'0 auto' }}>This section connects to your backend. All features will be live once integrated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
