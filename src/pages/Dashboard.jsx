import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

const navsByRole = {
  client: [
    { section:'My Account', items:[
      {id:'overview',icon:'🏠',label:'Overview'},
      {id:'bookings',icon:'📅',label:'My bookings',badge:2},
      {id:'saved',icon:'❤️',label:'Saved properties'},
      {id:'referrals',icon:'🔗',label:'Referral earnings',badge:'UGX 4K',badgeType:'gold'},
    ]},
    { section:'Activity', items:[
      {id:'history',icon:'🕑',label:'Payment history'},
      {id:'providers',icon:'🔧',label:'Previous providers'},
      {id:'confirmed',icon:'✅',label:'Confirmed rentals'},
    ]},
    { section:'Settings', items:[
      {id:'profile',icon:'👤',label:'My profile'},
      {id:'settings',icon:'⚙️',label:'Account settings'},
    ]},
  ],
  landlord: [
    { section:'Properties', items:[
      {id:'overview',icon:'📊',label:'Overview'},
      {id:'listings',icon:'🏘️',label:'My listings'},
      {id:'addlisting',icon:'➕',label:'Add property'},
      {id:'agents',icon:'🤝',label:'Assigned agents',badge:1},
    ]},
    { section:'Tenants', items:[
      {id:'enquiries',icon:'📩',label:'Enquiries',badge:3},
      {id:'tenants',icon:'👥',label:'Current tenants'},
      {id:'confirmed',icon:'✅',label:'Confirmed rentals'},
    ]},
    { section:'Finance', items:[
      {id:'payments',icon:'💰',label:'Payments'},
      {id:'commissions',icon:'📊',label:'Commission tracker'},
    ]},
    { section:'Settings', items:[
      {id:'profile',icon:'👤',label:'My profile'},
      {id:'settings',icon:'⚙️',label:'Account settings'},
    ]},
  ],
  provider: [
    { section:'Work', items:[
      {id:'overview',icon:'📊',label:'Overview'},
      {id:'jobs',icon:'🔨',label:'Available jobs',badge:6},
      {id:'active',icon:'🚀',label:'Active jobs',badge:2},
      {id:'completed',icon:'✅',label:'Completed jobs'},
    ]},
    { section:'Finance', items:[
      {id:'earnings',icon:'💰',label:'Earnings'},
      {id:'commissions',icon:'🧾',label:'Commission history'},
    ]},
    { section:'Profile', items:[
      {id:'profile',icon:'👤',label:'My profile'},
      {id:'reviews',icon:'⭐',label:'Reviews & ratings'},
      {id:'settings',icon:'⚙️',label:'Settings'},
    ]},
  ],
  agent: [
    { section:'Portfolio', items:[
      {id:'overview',icon:'📊',label:'Overview'},
      {id:'listings',icon:'🏘️',label:'Managed listings',badge:4},
      {id:'enquiries',icon:'📩',label:'Client enquiries',badge:5},
      {id:'tenants',icon:'👥',label:'Active tenants'},
    ]},
    { section:'Finance', items:[
      {id:'commissions',icon:'💰',label:'Commission earnings'},
      {id:'landlords',icon:'🏗️',label:'My landlords',badge:2},
    ]},
    { section:'Settings', items:[
      {id:'profile',icon:'👤',label:'My profile'},
      {id:'settings',icon:'⚙️',label:'Settings'},
    ]},
  ],
}

function Sidebar({role, active, setActive, user}){
  const {signOut}=useAuth()
  const nav=useNavigate()
  const items=navsByRole[role]||navsByRole.client
  return(
    <aside className="dash-side">
      <div className="dash-side-logo">
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:34,height:34,background:'var(--gold)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--sh-gold)'}}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'#fff',letterSpacing:'-0.02em'}}>Homeyo</div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,.3)',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase'}}>{role?.toUpperCase()}</div>
          </div>
        </div>
      </div>
      <div className="dash-nav">
        {items.map(section=>(
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
        <button className="dash-nav-item" onClick={()=>nav('/')}>
          <span className="dash-nav-icon">🌐</span>
          <span className="dash-nav-label">Back to site</span>
        </button>
        <button className="dash-nav-item" onClick={signOut}>
          <span className="dash-nav-icon">🚪</span>
          <span className="dash-nav-label" style={{color:'rgba(197,48,48,.8)'}}>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

function KPIs({role}){
  const map={
    client:[
      {icon:'📅',value:'2',label:'Viewings booked',bar:40,trend:'↑ 1 this month',up:true},
      {icon:'❤️',value:'5',label:'Saved properties',bar:50,trend:'Updated today',up:true},
      {icon:'🔗',value:'UGX 4,000',label:'Referral earnings',bar:20,trend:'2 referrals',up:true},
      {icon:'✅',value:'1',label:'Active rental',bar:100,trend:'Confirmed',up:true},
    ],
    landlord:[
      {icon:'🏘️',value:'6',label:'Active listings',bar:75,trend:'↑ 2 this month',up:true},
      {icon:'👥',value:'8',label:'Current tenants',bar:80,trend:'All paying',up:true},
      {icon:'💰',value:'UGX 3.4M',label:'Monthly revenue',bar:68,trend:'↑ 12% vs last month',up:true},
      {icon:'📩',value:'3',label:'New enquiries',bar:30,trend:'Needs action',up:false},
    ],
    provider:[
      {icon:'🔨',value:'6',label:'Jobs available',bar:60,trend:'In your area',up:true},
      {icon:'✅',value:'2',label:'Active jobs',bar:20,trend:'In progress',up:true},
      {icon:'💰',value:'UGX 285K',label:'Earnings MTD',bar:57,trend:'↑ 18% vs last',up:true},
      {icon:'⭐',value:'4.8',label:'Your rating',bar:96,trend:'47 reviews',up:true},
    ],
    agent:[
      {icon:'🏘️',value:'4',label:'Managed listings',bar:40,trend:'2 active enquiries',up:true},
      {icon:'👥',value:'6',label:'Active tenants',bar:60,trend:'All confirmed',up:true},
      {icon:'💰',value:'UGX 1.2M',label:'Commission MTD',bar:48,trend:'↑ 8% vs last',up:true},
      {icon:'📩',value:'5',label:'New enquiries',bar:50,trend:'3 urgent',up:false},
    ],
  }
  const kpis=map[role]||map.client
  return(
    <div className="kpi-grid">
      {kpis.map((k,i)=>(
        <div key={i} className="kpi-card">
          <div className="kpi-icon">{k.icon}</div>
          <div className="kpi-value">{k.value}</div>
          <div className="kpi-label">{k.label}</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:k.bar+'%'}}/></div>
          <div className={`kpi-trend${k.up?' up':' dn'}`}>{k.trend}</div>
        </div>
      ))}
    </div>
  )
}

function TabContent({tab,role,showToast}){
  if(tab==='bookings') return(
    <div className="table-wrap">
      <div className="table-hdr"><div className="table-title">My viewing bookings</div></div>
      <table>
        <thead><tr><th>Property</th><th>Date</th><th>Landlord</th><th>Fee paid</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td><strong>Bright Double Room, Kisaasi</strong></td><td>2 Jan 2025</td><td>Grace N.</td><td>UGX 5,000</td><td><span className="badge badge-green">Confirmed</span></td></tr>
          <tr><td><strong>Modern Bedsitter, Makerere</strong></td><td>5 Jan 2025</td><td>James K.</td><td>UGX 5,000</td><td><span className="badge badge-amber">Pending</span></td></tr>
        </tbody>
      </table>
    </div>
  )

  if(tab==='confirmed') return(
    <div>
      <div className="note note-blue" style={{marginBottom:18}}>Confirming your rental helps the platform track commission due to landlords and agents correctly.</div>
      <div className="table-wrap">
        <div className="table-hdr"><div className="table-title">Confirmed rentals</div><button className="btn btn-forest btn-sm" onClick={()=>showToast('Report a new rental — connect to backend')}>+ Confirm rental</button></div>
        <table>
          <thead><tr><th>Property</th><th>Area</th><th>Monthly rent</th><th>Start date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><strong>Bright Double Room</strong></td><td>Kisaasi</td><td>UGX 350,000</td><td>1 Jan 2025</td><td><span className="badge badge-green">Active</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  if(tab==='providers') return(
    <div className="table-wrap">
      <div className="table-hdr"><div className="table-title">Previous service providers</div></div>
      <table>
        <thead><tr><th>Provider</th><th>Service</th><th>Date</th><th>Rating</th><th>Action</th></tr></thead>
        <tbody>
          {[['Aisha Nakato','Laundry','Dec 2024','⭐ 5.0'],['Grace Clean Pro','Cleaners','Nov 2024','⭐ 4.8']].map(([n,s,d,r],i)=>(
            <tr key={i}><td><strong>{n}</strong></td><td>{s}</td><td>{d}</td><td>{r}</td>
              <td><button className="btn btn-forest btn-sm" onClick={()=>showToast(`Booking ${n} again...`)}>Book again</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  if(tab==='referrals'){
    const link='homeyo.ug/ref/ref'+Math.random().toString(36).slice(2,8)
    return(
      <div>
        <div style={{background:'var(--forest)',borderRadius:'var(--r-lg)',padding:22,textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:'9px',color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6}}>Your referral link</div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.88rem',color:'var(--gold-lt)',fontWeight:700,marginBottom:12,wordBreak:'break-all'}}>{link}</div>
          <button className="btn btn-gold btn-sm" onClick={()=>{navigator.clipboard?.writeText(link);showToast('Referral link copied!','success')}}>Copy link</button>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-icon">👥</div><div className="kpi-value">2</div><div className="kpi-label">Total referrals</div></div>
          <div className="kpi-card"><div className="kpi-icon">💰</div><div className="kpi-value">UGX 4,000</div><div className="kpi-label">Earned</div></div>
          <div className="kpi-card"><div className="kpi-icon">⏳</div><div className="kpi-value">UGX 16,000</div><div className="kpi-label">Until withdrawal</div></div>
          <div className="kpi-card"><div className="kpi-icon">📤</div><div className="kpi-value">UGX 0</div><div className="kpi-label">Total withdrawn</div></div>
        </div>
        <div className="note note-forest">Minimum withdrawal: UGX 20,000 via MoMo. You earn UGX 2,000 per viewing fee paid by your referral.</div>
      </div>
    )
  }

  if(tab==='listings') return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)'}}>My listings</div>
        <button className="btn btn-forest btn-sm" onClick={()=>showToast('Add listing — connect to backend')}>+ Add listing</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Property</th><th>Type</th><th>Price/month</th><th>Trust</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {[['Tranquil Garden Studio','Bukoto','Self-Contained','UGX 420,000',98],['Bright Double Room','Kisaasi','Double Room','UGX 350,000',91],['Executive Naguru 2BR','Naguru','Self-Contained','UGX 850,000',97]].map((r,i)=>(
              <tr key={i}>
                <td><strong>{r[0]}</strong><br/><span style={{fontSize:'0.7rem',color:'var(--muted)'}}>{r[1]}</span></td>
                <td>{r[2]}</td><td>{r[3]}</td>
                <td><div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:40,height:4,background:'var(--border)',borderRadius:2,overflow:'hidden'}}><div style={{width:r[4]+'%',height:'100%',background:'var(--forest)'}}/></div><span style={{fontSize:'0.7rem'}}>{r[4]}%</span></div></td>
                <td><span className="badge badge-green">Active</span></td>
                <td><button className="btn btn-outline btn-sm" onClick={()=>showToast('Edit listing')}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  if(tab==='agents') return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)'}}>Assigned agents</div>
        <button className="btn btn-forest btn-sm" onClick={()=>showToast('Assign agent — connect to backend')}>+ Assign agent</button>
      </div>
      <div className="note note-blue" style={{marginBottom:16}}>Agents manage enquiries and viewings on your behalf. You retain full ownership control.</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Agent</th><th>Area</th><th>Listings</th><th>Enquiries</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>James K.</strong><br/><span style={{fontSize:'0.7rem',color:'var(--muted)'}}>Verified agent</span></td>
              <td>Kisaasi</td><td>2</td><td>14</td><td>⭐ 4.8</td>
              <td><div style={{display:'flex',gap:6}}>
                <button className="btn btn-forest btn-sm" onClick={()=>showToast('Viewing agent profile')}>View</button>
                <button className="btn btn-outline btn-sm" onClick={()=>showToast('Removing agent...')}>Remove</button>
              </div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  if(tab==='commissions') return(
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>Commission tracker</div>
      <div className="note note-amber" style={{marginBottom:16}}>Commissions are tracked when tenants confirm their rental through the platform.</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Tenant</th><th>Property</th><th>Monthly rent</th><th>Commission due</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><strong>Aisha N.</strong></td><td>Bright Double Room</td><td>UGX 350,000</td><td>UGX 28,000 (8%)</td><td><span className="badge badge-green">Paid</span></td></tr>
            <tr><td><strong>Brian M.</strong></td><td>Modern Bedsitter</td><td>UGX 240,000</td><td>UGX 19,200 (8%)</td><td><span className="badge badge-amber">Pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  if(tab==='tenants') return(
    <div className="table-wrap">
      <div className="table-hdr"><div className="table-title">Current tenants</div></div>
      <table>
        <thead><tr><th>Tenant</th><th>Property</th><th>Rent</th><th>Move-in</th><th>Status</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>Aisha Nakato</strong><br/><span style={{fontSize:'0.7rem',color:'var(--muted)'}}>0712 345 678</span></td>
            <td>Bright Double Room</td><td>UGX 350,000</td><td>Jan 2025</td>
            <td><span className="badge badge-green">Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  if(tab==='enquiries') return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)'}}>Enquiries</div>
        <span className="badge badge-red">3 unread</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>From</th><th>Property</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {[['Brian M.','Bukoto Studio','Interested in viewing this weekend','Today'],['Ruth K.','Naguru 2BR','Is the price negotiable?','Yesterday'],['Denis O.','Kisaasi Room','When can I view?','2d ago']].map((r,i)=>(
              <tr key={i}>
                <td><strong>{r[0]}</strong></td><td>{r[1]}</td>
                <td style={{color:'var(--muted)',fontSize:'0.78rem',maxWidth:160}}>{r[2]}</td>
                <td style={{color:'var(--muted)',fontSize:'0.72rem'}}>{r[3]}</td>
                <td><button className="btn btn-forest btn-sm" onClick={()=>showToast(`Replying to ${r[0]}...`)}>Reply</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  if(tab==='jobs') return(
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>Available jobs near you</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Job</th><th>Location</th><th>Budget</th><th>Commission</th><th>Action</th></tr></thead>
          <tbody>
            {[['Fix leaking pipe','Kira, Wakiso','UGX 45,000','UGX 3,600',true],['Move 1-bedroom','Kisaasi→Ntinda','UGX 120,000','UGX 9,600',false],['Deep clean 3BR','Naguru','UGX 35,000','UGX 2,800',false],['Install fan wiring','Wandegeya','UGX 60,000','UGX 4,800',false]].map((r,i)=>(
              <tr key={i}>
                <td><strong>{r[0]}</strong>{r[4]&&<span className="badge badge-red" style={{marginLeft:6}}>URGENT</span>}</td>
                <td style={{color:'var(--muted)',fontSize:'0.78rem'}}>{r[1]}</td>
                <td><strong>{r[2]}</strong></td>
                <td style={{color:'var(--red)',fontSize:'0.78rem'}}>{r[3]}</td>
                <td><div style={{display:'flex',gap:6}}>
                  <button className="btn btn-forest btn-sm" onClick={()=>showToast('Opening job details...')}>View</button>
                  <button className="btn btn-gold btn-sm" onClick={()=>showToast('Opening counter offer...')}>Counter</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  if(tab==='earnings') return(
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon">💰</div><div className="kpi-value">UGX 285K</div><div className="kpi-label">Earned this month</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:'57%'}}/></div><div className="kpi-trend up">↑ 18% vs last month</div></div>
        <div className="kpi-card"><div className="kpi-icon">✅</div><div className="kpi-value">21</div><div className="kpi-label">Jobs completed</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:'70%'}}/></div></div>
        <div className="kpi-card"><div className="kpi-icon">🧾</div><div className="kpi-value">UGX 22,800</div><div className="kpi-label">Commission paid</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:'8%'}}/></div></div>
        <div className="kpi-card"><div className="kpi-icon">📤</div><div className="kpi-value">UGX 0</div><div className="kpi-label">Available to withdraw</div></div>
      </div>
      <div className="note note-forest">Minimum withdrawal: UGX 50,000 via MoMo.</div>
      <button className="btn btn-forest btn-sm" onClick={()=>showToast('Payout request sent. Processed within 24 hours.','success')}>Request payout</button>
    </div>
  )

  if(tab==='reviews') return(
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>My reviews</div>
      {[{name:'Aisha K.',rating:4.9,text:'Excellent service, very thorough and professional.'},{name:'Brian M.',rating:4.7,text:'Quick, careful with my items. Highly recommend.'},{name:'Ruth O.',rating:5.0,text:'Best cleaner in Kampala, worth every shilling.'}].map((r,i)=>(
        <div key={i} style={{background:'var(--white)',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:16,marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <strong style={{fontSize:'0.85rem'}}>{r.name}</strong>
            <div style={{display:'flex',gap:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:12,color:s<=r.rating?'var(--gold)':'var(--border)'}}>★</span>)}</div>
          </div>
          <p style={{fontSize:'0.78rem',color:'var(--muted)'}}>{r.text}</p>
        </div>
      ))}
    </div>
  )

  if(tab==='profile') return(
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>My profile</div>
      <div className="field"><label className="field-label">Display name</label><input className="input" placeholder="Your display name"/></div>
      <div className="field"><label className="field-label">Bio</label><textarea className="input textarea" placeholder="Describe your services..."/></div>
      <div className="field"><label className="field-label">Service areas</label><input className="input" placeholder="e.g. Kisaasi, Ntinda, Bukoto"/></div>
      <div className="field"><label className="field-label">Your rate</label><input className="input" placeholder="e.g. UGX 20,000 per session"/></div>
      <button className="btn btn-forest" onClick={()=>showToast('Profile saved!','success')}>Save changes</button>
    </div>
  )

  if(tab==='settings') return(
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>Account settings</div>
      <div className="field"><label className="field-label">Display name</label><input className="input" placeholder="Your name"/></div>
      <div className="field"><label className="field-label">Email</label><input className="input" type="email" placeholder="your@email.com"/></div>
      <div className="field"><label className="field-label">Phone</label><input className="input" type="tel" placeholder="0771 234 567"/></div>
      <button className="btn btn-forest" style={{marginBottom:10}} onClick={()=>showToast('Settings saved!','success')}>Save changes</button>
      <div style={{borderTop:'1px solid var(--border)',paddingTop:20,marginTop:10}}>
        <div style={{fontSize:'0.85rem',fontWeight:700,color:'var(--red)',marginBottom:8}}>Danger zone</div>
        <button className="btn btn-red btn-sm" onClick={()=>showToast('Account deletion requested. Admin will contact you within 24 hours.')}>Delete my account</button>
      </div>
    </div>
  )

  if(tab==='overview') return(
    <div>
      <KPIs role={role}/>
      <div className="grid-2" style={{gap:14}}>
        <div className="table-wrap">
          <div className="table-hdr"><div className="table-title">Recent activity</div></div>
          <div style={{padding:14}}>
            {['Viewing booked: Kisaasi room','Referral payment received: UGX 2,000','Profile updated','Listed: Naguru 2BR'].map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<3?'1px solid var(--ivory-md)':''}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:'var(--gold)',flexShrink:0}}/>
                <span style={{fontSize:'0.78rem',color:'var(--body)'}}>{a}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <div className="table-hdr"><div className="table-title">Quick actions</div></div>
          <div style={{padding:14,display:'flex',flexDirection:'column',gap:8}}>
            {role==='client'&&<><button className="btn btn-forest btn-full btn-sm" onClick={()=>window.location.href='/'}>🔍 Browse properties</button><button className="btn btn-outline btn-full btn-sm" onClick={()=>window.location.href='/'}>🔧 Find a service provider</button></>}
            {(role==='landlord'||role==='agent')&&<><button className="btn btn-forest btn-full btn-sm" onClick={()=>showToast('Add listing form')}>➕ Add new listing</button><button className="btn btn-outline btn-full btn-sm" onClick={()=>showToast('Assign agent form')}>🤝 Assign agent</button></>}
            {role==='provider'&&<><button className="btn btn-forest btn-full btn-sm" onClick={()=>window.location.href='/'}>🔨 Browse available jobs</button><button className="btn btn-outline btn-full btn-sm" onClick={()=>showToast('Updating availability...')}>✅ Update availability</button></>}
          </div>
        </div>
      </div>
    </div>
  )

  return <div className="note note-blue">This section connects to your backend API to populate with live data.</div>
}

export default function Dashboard(){
  const {user,showToast}=useAuth()
  const navigate=useNavigate()
  const [active,setActive]=useState('overview')

  if(!user){navigate('/');return null}

  const role=user.role||'client'
  const titles={overview:'Overview',bookings:'My bookings',saved:'Saved properties',referrals:'Referral earnings',history:'Payment history',providers:'Previous providers',confirmed:'Confirmed rentals',profile:'My profile',settings:'Account settings',listings:'My listings',addlisting:'Add listing',agents:'Assigned agents',enquiries:'Enquiries',tenants:'Current tenants',payments:'Payment history',commissions:'Commission tracker',jobs:'Available jobs',active:'Active jobs',completed:'Completed jobs',earnings:'Earnings',reviews:'Reviews & ratings',landlords:'My landlords'}

  return(
    <div className="dash-layout">
      <Sidebar role={role} active={active} setActive={setActive} user={user}/>
      <div className="dash-main">
        <div className="dash-topbar">
          <div className="dash-page-title">{titles[active]||'Dashboard'}</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.82rem',fontWeight:700,color:'var(--ink)'}}>{user.name}</div>
              <div style={{fontSize:'0.7rem',color:'var(--muted)',textTransform:'capitalize'}}>{role}</div>
            </div>
            <div className="dash-avatar">{user.name?.[0]?.toUpperCase()||'U'}</div>
          </div>
        </div>
        <div className="dash-content">
          <TabContent tab={active} role={role} showToast={showToast}/>
        </div>
      </div>
    </div>
  )
}
