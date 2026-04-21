import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { useState, useEffect, useRef } from 'react'
import AuthModal from './components/AuthModal.jsx'
import Modal from './components/Modal.jsx'
import { LISTINGS, JOBS, PROVIDERS, MOVING_PROVIDERS, LAND, HOSTELS, LAND_TIPS, AREAS, TYPES } from './data/index.js'
import Dashboard from './pages/Dashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import HostelPortal from './pages/HostelPortal.jsx'

const fmt = n => 'UGX ' + Number(n).toLocaleString()
const starEl = r => Array.from({length:5},(_,i)=>(
  <span key={i} style={{fontSize:11,color:i<Math.round(r)?'var(--gold)':'var(--border)'}}>{i<Math.round(r)?'★':'☆'}</span>
))

function TrustBar({val}){
  const c=val>=85?'var(--forest)':val>=65?'var(--blue)':val>=40?'var(--amber)':'var(--red)'
  return <div className="trust-bar"><div className="trust-bar-fill" style={{width:val+'%',background:c}}/></div>
}

/* ──── NAV ──── */
function Nav({onAuth}){
  const {user,signOut}=useAuth()
  const [solid,setSolid]=useState(false)
  useEffect(()=>{const h=()=>setSolid(window.scrollY>60);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h)},[])
  return(
    <nav className={`nav ${solid?'nav-solid':'nav-transparent'}`}>
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark"><svg width="18" height="18" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg></div>
          <div>
            <div className={`nav-logo-text${solid?' dark-text':''}`}>Homeyo</div>
            <div className={`nav-logo-sub${solid?' dark-text':''}`}>Uganda's property marketplace</div>
          </div>
        </a>
        <div className="nav-links">
          {['Properties','Jobs','Services','Moving','Land','Hostels'].map(l=>(
            <button key={l} className={`nav-link${solid?' dark':''}`}
              onClick={()=>document.getElementById('sec-'+l.toLowerCase())?.scrollIntoView({behavior:'smooth'})}>{l}</button>
          ))}
        </div>
        <div className="nav-actions">
          {user?(<>
            <a href="/dashboard" className="btn btn-sm" style={{color:solid?'var(--ink)':'rgba(255,255,255,.88)',border:'1px solid '+(solid?'var(--border)':'rgba(255,255,255,.28)'),background:'none',padding:'8px 16px',borderRadius:'var(--r-sm)',textDecoration:'none',fontSize:13,fontWeight:600}}>My Dashboard</a>
            <button onClick={signOut} style={{fontSize:12,fontWeight:600,color:solid?'var(--muted)':'rgba(255,255,255,.6)',background:'none',border:'none',cursor:'pointer'}}>Sign out</button>
          </>):(<>
            <button className="btn btn-sm" onClick={()=>onAuth('client')} style={{color:solid?'var(--ink)':'rgba(255,255,255,.88)',border:'1px solid '+(solid?'var(--border)':'rgba(255,255,255,.28)'),background:'none',padding:'8px 16px'}}>Sign in</button>
            <button className="btn btn-gold btn-sm" onClick={()=>onAuth('landlord')}>List property</button>
          </>)}
        </div>
      </div>
    </nav>
  )
}

/* ──── HERO ──── */
function Hero({onSearch,onAuth}){
  const [tab,setTab]=useState('rent')
  const [area,setArea]=useState('')
  const [type,setType]=useState('')
  const [budget,setBudget]=useState('')
  const [idx,setIdx]=useState(0)
  const boosted=LISTINGS.filter(l=>l.boost)
  const imgs=['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85','https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=85','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=85']
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%boosted.length),5000);return()=>clearInterval(t)},[])
  const feat=boosted[idx%boosted.length]
  const doSearch=()=>{onSearch({area,type,budget,tab});document.getElementById('sec-properties')?.scrollIntoView({behavior:'smooth'})}

  return(
    <section className="hero" id="sec-home">
      <div className="hero-bg"/>
      <div className="hero-img" style={{backgroundImage:`url(${imgs[idx%3]})`}}/>
      <div className="hero-overlay"/>
      <div className="hero-content">
        <div>
          <div className="hero-badge">
            <div className="hero-badge-dot"/>
            <span className="label-caps" style={{color:'var(--gold-lt)'}}>Uganda's #1 verified property marketplace</span>
          </div>
          <h1 className="hero-title">Find the home<br/><strong>you deserve.</strong></h1>
          <p className="hero-sub">Verified rentals, premium land, student hostels and home services across Uganda. GPS-confirmed, no brokers, no scams.</p>

          {/* Search box */}
          <div style={{background:'rgba(255,255,255,.97)',backdropFilter:'blur(20px)',borderRadius:'var(--r-xl)',overflow:'hidden',boxShadow:'var(--sh-xl)',marginBottom:24}}>
            <div className="search-tab-bar">
              {[['rent','🏠 Rent'],['buy','💰 Buy'],['hostel','🎓 Hostel'],['land','🌿 Land'],['services','🔧 Services']].map(([k,l])=>(
                <button key={k} className={`search-tab${tab===k?' active':''}`} onClick={()=>setTab(k)}>{l}</button>
              ))}
            </div>
            <div style={{display:'flex',alignItems:'center',padding:'8px',gap:0}}>
              {[['Area',AREAS,area,setArea],['Type',TYPES,type,setType]].map(([lbl,opts,val,setVal])=>(
                <div key={lbl} className="search-field">
                  <label>{lbl}</label>
                  <select className="select" value={val} onChange={e=>setVal(e.target.value)} style={{border:'none',outline:'none',background:'transparent',fontSize:13,color:'var(--ink)',fontWeight:500,fontFamily:'var(--font-body)',width:'100%'}}>
                    {opts.map(o=><option key={o} value={o.startsWith('All')?'':o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="search-field">
                <label>Budget</label>
                <select className="select" value={budget} onChange={e=>setBudget(e.target.value)} style={{border:'none',outline:'none',background:'transparent',fontSize:13,color:'var(--ink)',fontWeight:500,fontFamily:'var(--font-body)',width:'100%'}}>
                  <option value="">Any price</option>
                  <option value="0-200000">Under UGX 200K</option>
                  <option value="200000-400000">UGX 200K–400K</option>
                  <option value="400000-800000">UGX 400K–800K</option>
                  <option value="800000-9999999">Above UGX 800K</option>
                </select>
              </div>
              <button className="btn btn-forest" onClick={doSearch} style={{borderRadius:'var(--r-lg)',padding:'12px 24px',flexShrink:0,marginLeft:4}}>🔍 Search</button>
            </div>
          </div>

          <div className="hero-stats">
            {[['500+','Verified listings'],['2,400','Happy tenants'],['98%','GPS confirmed'],['120+','Providers']].map(([n,l])=>(
              <div key={l}><div className="hero-stat-n">{n}</div><div className="hero-stat-l">{l}</div></div>
            ))}
          </div>
        </div>

        {feat&&(
          <div>
            <div className="label-caps" style={{color:'var(--gold-lt)',marginBottom:12}}>Featured property</div>
            <div className="feat-card">
              <div className="feat-card-img">
                <img src={feat.img} alt={feat.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(17,28,22,.72) 0%,transparent 60%)'}}/>
                <div style={{position:'absolute',top:12,left:12,display:'flex',gap:5}}>
                  {feat.v&&<span className="badge badge-forest">✓ Verified</span>}
                  <span className="badge badge-gold">⭐ Featured</span>
                </div>
              </div>
              <div className="feat-card-body">
                <div className="feat-card-price">{fmt(feat.price)}<span style={{fontFamily:'var(--font-body)',fontSize:12,color:'rgba(255,255,255,.45)'}}>/mo</span></div>
                <div className="feat-card-name">{feat.name}</div>
                <div className="feat-card-loc">📍 {feat.area}</div>
                <div className="feat-card-meta">
                  <div className="feat-card-meta-item">🛏 {feat.beds} bed</div>
                  <div className="feat-card-meta-item">🚿 {feat.baths} bath</div>
                  <div className="feat-card-meta-item">📐 {feat.sqm}m²</div>
                  <div className="feat-card-meta-item">⭐ {feat.rating}</div>
                </div>
                <div className="feat-card-dots">
                  {boosted.map((_,i)=><button key={i} className={`feat-dot${i===idx%boosted.length?' active':''}`} onClick={()=>setIdx(i)}/>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ──── PROPERTY CARD ──── */
function PropCard({l,onView,onBook}){
  const [faved,setFaved]=useState(false)
  const cc=l.conf>=85?'var(--forest)':l.conf>=65?'var(--blue)':l.conf>=40?'var(--amber)':'var(--red)'
  return(
    <div className="prop-card" onClick={()=>onView(l)}>
      <div className="prop-card-img" style={{height:220,overflow:'hidden',position:'relative'}}>
        <img src={l.img} alt={l.name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s var(--ease-out)'}}/>
        <div className="prop-card-badges">
          {l.boost&&<span className="badge badge-gold">⭐ Featured</span>}
          {l.v?<span className="badge badge-forest">✓ Verified</span>:<span className="badge badge-red">Unverified</span>}
          {l.hostel&&<span className="badge badge-blue">Hostel</span>}
          {l.agent&&<span className="badge badge-white">Agent</span>}
        </div>
        <button className="prop-card-fav" onClick={e=>{e.stopPropagation();setFaved(!faved)}}>{faved?'❤️':'🤍'}</button>
      </div>
      <div className="prop-card-body">
        <div style={{marginBottom:8}}>
          <span className="prop-card-price">{fmt(l.price)}</span>
          <span className="prop-card-period">/month</span>
        </div>
        <div className="prop-card-name">{l.name}</div>
        <div className="prop-card-loc">📍 {l.area} · {l.type}</div>
        <div className="prop-card-meta">
          <div className="prop-card-meta-item">🛏 {l.beds}</div><div className="prop-card-meta-div"/>
          <div className="prop-card-meta-item">🚿 {l.baths}</div><div className="prop-card-meta-div"/>
          <div className="prop-card-meta-item">📐 {l.sqm}m²</div><div className="prop-card-meta-div"/>
          <div className="prop-card-meta-item">⭐ {l.rating}</div>
        </div>
        <div className="prop-card-trust"><TrustBar val={l.conf}/><span style={{fontSize:10,fontWeight:700,color:cc,whiteSpace:'nowrap',marginLeft:6}}>{l.conf}%</span></div>
        <button className="btn btn-forest btn-sm btn-full" style={{marginTop:10}} onClick={e=>{e.stopPropagation();onBook(l)}}>
          Book viewing — {fmt(l.fee)}
        </button>
      </div>
    </div>
  )
}

/* ──── LISTING DETAIL MODAL ──── */
function ListingModal({l,open,onClose,onBook}){
  if(!l)return null
  const cc=l.conf>=85?'var(--forest)':l.conf>=65?'var(--blue)':'var(--amber)'
  const checklist=[
    {k:'Utilities nearby',ok:l.conf>80},{k:'Land title verified',ok:l.v},{k:'No family land issue',ok:!false},{k:'Developed neighbourhood',ok:l.conf>70},
    {k:'Tarmac road access',ok:l.conf>75},{k:'NWSC water supply',ok:l.conf>80},{k:'Security nearby',ok:l.conf>65},{k:'Market within 1km',ok:l.conf>60},
    {k:'Transport links',ok:true},{k:'Good structure condition',ok:l.ready},
  ]
  const passed=checklist.filter(c=>c.ok).length
  return(
    <Modal open={open} onClose={onClose} size="modal-lg">
      <div style={{margin:'-22px -24px 20px',position:'relative'}}>
        <img src={l.img} alt={l.name} style={{width:'100%',height:240,objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(17,28,22,.7) 0%,transparent 50%)'}}/>
        <div style={{position:'absolute',bottom:16,left:20,right:20}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:'#fff',marginBottom:4}}>{l.name}</div>
          <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,.68)'}}>📍 {l.area} · {l.type}{l.agent?` · Agent: ${l.agname}`:''}</div>
        </div>
        {onClose&&<button className="modal-close modal-close-white" onClick={onClose} style={{position:'absolute',top:12,right:12}}>×</button>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div><span style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:700,color:'var(--gold-dk)',letterSpacing:'-0.04em'}}>{fmt(l.price)}</span><span style={{fontSize:13,color:'var(--muted)'}}>/month</span></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:10,fontWeight:700,color:cc,marginBottom:4}}>{l.conf}% trust score</div><TrustBar val={l.conf}/></div>
      </div>
      <p style={{fontSize:'0.85rem',color:'var(--ink-lt)',lineHeight:1.7,marginBottom:16}}>{l.desc}</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
        {[[`✓ ${passed}/10`,'Checklist','passed checks'],['🏠','Amenities','nearby places'],['🔗','Share','earn UGX 2,000']].map(([i,t,s])=>(
          <div key={t} style={{background:'var(--ivory)',borderRadius:'var(--r-md)',padding:'10px 12px',textAlign:'center',cursor:'pointer',border:'1px solid var(--border)'}}>
            <div style={{fontSize:'1rem',marginBottom:3}}>{i}</div>
            <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--ink)'}}>{t}</div>
            <div style={{fontSize:'0.65rem',color:'var(--muted)'}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{background:'var(--forest)',borderRadius:'var(--r-md)',padding:'12px 14px',display:'flex',gap:10,alignItems:'center',marginBottom:14}}>
        <div style={{fontSize:'1.3rem'}}>🔒</div>
        <div style={{flex:1}}><div style={{fontSize:'0.85rem',fontWeight:700,color:'#fff'}}>Landlord contact is locked</div><div style={{fontSize:'0.72rem',color:'rgba(255,255,255,.55)'}}>Pay {fmt(l.fee)} to unlock · Platform UGX 3,000 + Referrer UGX 2,000</div></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button className="btn btn-forest btn-full" onClick={()=>onBook(l)}>📅 Book viewing</button>
        <button className="btn btn-gold btn-full" onClick={()=>onBook(l)}>🔓 Unlock contact</button>
      </div>
    </Modal>
  )
}

/* ──── BOOKING MODAL ──── */
function BookingModal({l,open,onClose}){
  const {user}=useAuth()
  const [step,setStep]=useState(1)
  const [name,setName]=useState(user?.name||'')
  const [phone,setPhone]=useState('')
  const [date,setDate]=useState('')
  const [signName,setSignName]=useState('')
  const [agreed,setAgreed]=useState(false)
  const [momo,setMomo]=useState('')
  const [pay,setPay]=useState('mtn')
  const [loading,setLoading]=useState(false)
  const [txn,setTxn]=useState('')
  if(!l)return null
  const steps=['Details','Agreement','Payment','Done']
  const pay3=()=>{
    if(!momo||momo.length<10)return
    setLoading(true)
    setTimeout(()=>{setTxn('TXN-'+Math.random().toString(36).slice(2,10).toUpperCase());setStep(4);setLoading(false)},2200)
  }
  return(
    <Modal open={open} onClose={onClose} title="Book a viewing" sub={`${l.name} · ${fmt(l.price)}/mo`}>
      <div className="step-bar">{steps.map((s,i)=><div key={s} className={`step-item${step===i+1?' active':step>i+1?' done':''}`}>{step>i+1?'✓ ':''}{s}</div>)}</div>
      {step===1&&<>
        <div className="field"><label className="field-label">Full name <span className="req">*</span></label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></div>
        <div className="field"><label className="field-label">Phone <span className="req">*</span></label><input className="input" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0771 234 567"/></div>
        <div className="field"><label className="field-label">Viewing date <span className="req">*</span></label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
        <div className="note note-amber">Viewing fee: <strong>{fmt(l.fee)}</strong> · Platform UGX 3,000 + Referrer UGX 2,000</div>
        <button className="btn btn-forest btn-full" disabled={!name||!phone||!date} onClick={()=>setStep(2)}>Continue →</button>
      </>}
      {step===2&&<>
        <div style={{background:'var(--ivory)',borderRadius:'var(--r-md)',padding:'12px 14px',fontSize:'0.78rem',lineHeight:1.75,maxHeight:140,overflowY:'auto',marginBottom:14,border:'1px solid var(--border)',color:'var(--ink-lt)'}}>
          <strong>Homeyo Booking Terms.</strong><br/>1. Viewing fee {fmt(l.fee)} is non-refundable once paid.<br/>2. Homeyo is an intermediary only. Always inspect property before paying rent.<br/>3. Landlord contact revealed only after payment confirmation.<br/>4. Never pay rent without a signed tenancy agreement.<br/>5. Your IP address and timestamp are recorded as legal proof.
        </div>
        <div className="esign-box">
          <div className="esign-label">Your e-signature</div>
          <div className="esign-fields">
            <input className="esign-inp" placeholder="Type your full name to sign" value={signName} onChange={e=>setSignName(e.target.value)}/>
            <input className="esign-inp" value={new Date().toLocaleDateString()} readOnly/>
          </div>
          <label className="esign-check"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/>I accept all Booking Terms. This is my legal digital signature.</label>
          <div className="esign-secure">🔒 <span>Secured: IP + timestamp recorded</span></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:14}}>
          <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
          <button className="btn btn-forest" disabled={!signName||!agreed} onClick={()=>setStep(3)}>Agree & Pay →</button>
        </div>
      </>}
      {step===3&&<>
        <div style={{marginBottom:14}}><div style={{fontWeight:700,color:'var(--ink)',marginBottom:4}}>Pay viewing fee</div><div style={{fontSize:'0.78rem',color:'var(--muted)'}}>Amount: <strong style={{color:'var(--ink)',fontFamily:'var(--font-display)',fontSize:'1.1rem'}}>{fmt(l.fee)}</strong></div></div>
        <div className="pay-grid">
          {[['mtn','MTN MoMo','📱'],['airtel','Airtel Money','📲']].map(([id,nm,ico])=>(
            <div key={id} className={`pay-card${pay===id?' on':''}`} onClick={()=>setPay(id)}>
              <div style={{fontSize:'1.4rem',marginBottom:4}}>{ico}</div>
              <div style={{fontWeight:700,color:'var(--ink)',fontSize:13}}>{nm}</div>
            </div>
          ))}
        </div>
        <div className="field"><label className="field-label">Your MoMo number <span className="req">*</span></label><input className="input" type="tel" value={momo} onChange={e=>setMomo(e.target.value)} placeholder="0771 234 567"/></div>
        <div className="note note-blue">🔒 Landlord contact revealed instantly after payment confirmation</div>
        <button className="btn btn-forest btn-full" disabled={!momo||momo.length<10||loading} onClick={pay3}>{loading?'⏳ Processing...':'💳 Pay '+fmt(l.fee)}</button>
        <button className="btn btn-ghost btn-full" onClick={()=>setStep(2)} style={{marginTop:6}}>← Back</button>
      </>}
      {step===4&&<div style={{textAlign:'center',padding:'8px 0 16px'}}>
        <div style={{width:70,height:70,background:'var(--forest-gl)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',border:'3px solid var(--forest-lt)',fontSize:'2rem'}}>✓</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:5}}>Viewing confirmed!</div>
        <div style={{fontSize:'0.75rem',color:'var(--muted)',marginBottom:18}}>Ref: <strong>{txn}</strong></div>
        <div className="note note-forest" style={{textAlign:'left'}}><strong>Details</strong><br/>Property: {l.name}<br/>Landlord: {l.ll} — 0712 345 678<br/>Fee paid: {fmt(l.fee)} · {txn}</div>
        <a href={`https://wa.me/${l.wa}?text=Hi! Booked viewing via Homeyo. Property: ${l.name}. Ref: ${txn}`} target="_blank" rel="noreferrer" className="btn btn-wa btn-full" style={{display:'flex',marginBottom:8}}>💬 Message Landlord on WhatsApp</a>
        <button className="btn btn-outline btn-full" onClick={()=>{onClose();setStep(1);setSignName('');setAgreed(false);setMomo('')}}>Done</button>
      </div>}
    </Modal>
  )
}

/* ──── JOB MODAL ──── */
function JobModal({j,open,onClose}){
  const {showToast}=useAuth()
  const [view,setView]=useState('detail')
  const [signName,setSignName]=useState('')
  const [agreed,setAgreed]=useState(false)
  const [momo,setMomo]=useState('')
  const [counterVal,setCounterVal]=useState('')
  const [loading,setLoading]=useState(false)
  const [unlocked,setUnlocked]=useState(false)
  if(!j)return null
  const comm=Math.round(j.budget*0.08)
  const accept=()=>{
    if(!signName||!agreed||!momo||momo.length<10)return showToast('Fill all fields and sign','error')
    setLoading(true);setTimeout(()=>{setLoading(false);setUnlocked(true)},2200)
  }
  if(unlocked)return(
    <Modal open={open} onClose={()=>{setUnlocked(false);setView('detail');onClose()}} title="Job Unlocked!" sub="Commission paid — client contact revealed">
      <div style={{textAlign:'center',padding:'8px 0 14px'}}>
        <div style={{fontSize:'2.5rem',marginBottom:10}}>✓</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:5}}>Commission of {fmt(comm)} paid</div>
      </div>
      <div className="note note-forest"><strong>Client contact details</strong><br/>Name: {j.client}<br/>Phone: {j.clientPhone}<br/>Location: {j.loc}</div>
      <a href={`https://wa.me/256${j.clientPhone.replace(/^0/,'')}`} target="_blank" rel="noreferrer" className="btn btn-wa btn-full" style={{display:'flex',marginBottom:8}}>💬 WhatsApp Client</a>
      <button className="btn btn-outline btn-full" onClick={()=>{setUnlocked(false);setView('detail');onClose()}}>Done</button>
    </Modal>
  )
  return(
    <Modal open={open} onClose={()=>{setView('detail');onClose()}} size="modal-lg" title={j.cat+' Job'} sub="Review scope, then accept or counter offer">
      <div style={{background:'var(--ivory)',borderRadius:'var(--r-md)',padding:16,marginBottom:14,border:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:j.col,flexShrink:0}}/>
          <div style={{fontWeight:700,color:'var(--ink)',flex:1}}>{j.title}</div>
          {j.urgent&&<span className="badge badge-red">URGENT</span>}
        </div>
        <div style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:8}}>📍 {j.loc} · Posted {j.posted}</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
          {j.tags.map(t=><span key={t} className="badge badge-forest">{t}</span>)}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:'1px solid var(--border)',paddingTop:10}}>
          <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:'var(--forest)',letterSpacing:'-0.03em'}}>{fmt(j.budget)}</div><div style={{fontSize:'0.72rem',color:'var(--muted)'}}>Client budget</div></div>
          <div style={{textAlign:'right'}}><div style={{fontWeight:800,color:'var(--red)'}}>{fmt(comm)}</div><div style={{fontSize:'0.72rem',color:'var(--muted)'}}>8% commission (you pay)</div></div>
        </div>
      </div>
      <div className="note note-blue">Client contact revealed ONLY after signing and paying {fmt(comm)} commission via MoMo.</div>
      {view==='detail'&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
        <button className="btn btn-forest btn-full" onClick={()=>setView('accept')}>✓ Accept job</button>
        <button className="btn btn-gold btn-full" onClick={()=>setView('counter')}>↕ Counter offer</button>
        <button className="btn btn-outline btn-full" onClick={()=>setView('ask')}>? Ask question</button>
      </div>}
      {view==='accept'&&<>
        <div className="esign-box">
          <div className="esign-label">Commission agreement — {fmt(comm)} (8%)</div>
          <div className="esign-fields">
            <input className="esign-inp" placeholder="Your full legal name" value={signName} onChange={e=>setSignName(e.target.value)}/>
            <input className="esign-inp" value={new Date().toLocaleDateString()} readOnly/>
          </div>
          <label className="esign-check"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/>I agree to pay {fmt(comm)} commission before client contact is revealed. This is my legal digital signature.</label>
          <div className="esign-secure">🔒 <span>Legally binding under Electronic Transactions Act Uganda 2011</span></div>
        </div>
        <div className="field" style={{marginTop:12}}><label className="field-label">MoMo number to pay commission</label><input className="input" type="tel" value={momo} onChange={e=>setMomo(e.target.value)} placeholder="0771 234 567"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <button className="btn btn-outline" onClick={()=>setView('detail')}>← Back</button>
          <button className="btn btn-forest" disabled={loading} onClick={accept}>{loading?'⏳ Processing...':'Sign & Pay '+fmt(comm)}</button>
        </div>
      </>}
      {view==='counter'&&<>
        <div style={{background:'var(--amber-gl)',borderRadius:'var(--r-md)',padding:16,border:'1px solid rgba(212,133,58,.3)',marginBottom:12}}>
          <div style={{fontWeight:700,color:'#7A4510',marginBottom:10}}>Your counter offer</div>
          <div className="field"><label className="field-label">Your price (UGX)</label>
            <input className="input" type="number" value={counterVal} onChange={e=>setCounterVal(e.target.value)} placeholder={`e.g. ${Math.round(j.budget*1.1)}`} style={{fontSize:'1.1rem',fontWeight:700}}/>
          </div>
          <div className="field"><label className="field-label">Message (optional)</label><input className="input" placeholder="Explain your counter price..."/></div>
          <p style={{fontSize:'0.72rem',color:'#7A4510'}}>If client accepts, you still pay 8% commission before contact is revealed.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <button className="btn btn-outline" onClick={()=>setView('detail')}>← Back</button>
          <button className="btn btn-gold" disabled={!counterVal} onClick={()=>{showToast(`Counter offer of ${fmt(parseInt(counterVal)||0)} sent`);setView('detail');onClose()}}>Send counter offer</button>
        </div>
      </>}
      {view==='ask'&&<>
        <div className="field"><label className="field-label">Your question for the client</label><input className="input" placeholder="e.g. What materials do you have? Is water supply available?"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <button className="btn btn-outline" onClick={()=>setView('detail')}>← Back</button>
          <button className="btn btn-forest" onClick={()=>{showToast('Question sent to client');onClose()}}>Send question</button>
        </div>
      </>}
    </Modal>
  )
}

/* ──── NEGOTIATION CHAT ──── */
function NegoModal({provider,open,onClose}){
  const {showToast}=useAuth()
  const [msgs,setMsgs]=useState([])
  const [inp,setInp]=useState('')
  const [offerVal,setOfferVal]=useState('')
  const [showOffer,setShowOffer]=useState(false)
  const [unlocked,setUnlocked]=useState(false)
  const ref=useRef()

  useEffect(()=>{
    if(open&&provider){
      setMsgs([{t:'sys',txt:'Negotiation started'},{t:'them',txt:`Hi! I'm ${provider.name}. My rate is ${provider.price}. What are your requirements?`}])
      setInp('');setOfferVal('');setShowOffer(false);setUnlocked(false)
    }
  },[open,provider])

  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight},[msgs])
  if(!provider)return null

  const send=()=>{
    if(!inp.trim())return
    setMsgs(m=>[...m,{t:'me',txt:inp}]);setInp('')
    setTimeout(()=>setMsgs(m=>[...m,{t:'them',txt:'Thanks for the details! Let me check my availability and confirm.'}]),1200)
  }
  const sendOffer=()=>{
    const amt=parseInt(offerVal)||0;if(amt<500)return showToast('Enter a valid amount','error')
    setMsgs(m=>[...m,{t:'offer-me',amt}]);setShowOffer(false);setOfferVal('')
    setTimeout(()=>{
      const accept=Math.random()>0.38
      if(accept){
        setMsgs(m=>[...m,{t:'them',txt:`I accept UGX ${amt.toLocaleString()}! Paying commission now...`},{t:'sys',txt:'Processing commission payment...'}])
        setTimeout(()=>setUnlocked(true),2500)
      }else{
        const ctr=Math.round(amt*1.18/1000)*1000
        setMsgs(m=>[...m,{t:'them',txt:`I need UGX ${ctr.toLocaleString()} — covers materials and travel. Can you agree?`},{t:'offer-them',amt:ctr}])
      }
    },1500)
  }
  const acceptCounter=amt=>{
    setMsgs(m=>[...m,{t:'me',txt:`Accepted! UGX ${amt.toLocaleString()}.`},{t:'sys',txt:'Processing commission payment...'}])
    setTimeout(()=>setUnlocked(true),2500)
  }

  if(unlocked)return(
    <Modal open={open} onClose={()=>{setUnlocked(false);onClose()}} title="Contact revealed!" sub="Commission paid — provider contact unlocked">
      <div style={{textAlign:'center',padding:'8px 0 14px'}}><div style={{fontSize:'2.5rem',marginBottom:10}}>✓</div><div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:5}}>Deal agreed!</div></div>
      <div className="note note-forest"><strong>Provider contact</strong><br/>Name: {provider.name}<br/>Phone: 0712 345 678<br/>Area: {provider.area} · {provider.dist}</div>
      <a href="https://wa.me/256712345678" target="_blank" rel="noreferrer" className="btn btn-wa btn-full" style={{display:'flex',marginBottom:8}}>💬 WhatsApp {provider.name}</a>
      <button className="btn btn-outline btn-full" onClick={()=>{setUnlocked(false);onClose()}}>Done</button>
    </Modal>
  )

  return(
    <Modal open={open} onClose={onClose} size="modal-lg" title={`${provider.type} — Negotiate`} sub={`${provider.name} · ${provider.dist} · ${provider.price}`}>
      {/* Spec fields */}
      <div style={{background:'var(--ivory)',borderRadius:'var(--r-md)',padding:12,marginBottom:12,border:'1px solid var(--border)'}}>
        <div className="label-caps" style={{color:'var(--muted)',marginBottom:8}}>Service specifications</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {provider.type==='Laundry'&&<><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Weight (kg)</div><input className="input" type="number" placeholder="e.g. 5"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Laundry type</div><select className="input select"><option>Regular</option><option>Delicate</option><option>Bedding</option></select></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Ironing?</div><select className="input select"><option>Yes</option><option>No</option></select></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Pickup date</div><input className="input" type="date"/></div></>}
          {(provider.type==='Movers'||provider.type==='Packing Helpers')&&<><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Moving from</div><input className="input" placeholder="Area"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Moving to</div><input className="input" placeholder="Area"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Items</div><input className="input" placeholder="e.g. sofa, fridge"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Move date</div><input className="input" type="date"/></div></>}
          {provider.type==='Cleaners'&&<><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Number of rooms</div><input className="input" type="number" placeholder="e.g. 3"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Clean type</div><select className="input select"><option>Regular</option><option>Deep clean</option><option>Move-in</option></select></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Date</div><input className="input" type="date"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Special requests</div><input className="input" placeholder="e.g. carpets"/></div></>}
          {!['Laundry','Movers','Cleaners','Packing Helpers'].includes(provider.type)&&<><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Description</div><input className="input" placeholder="What you need"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Date needed</div><input className="input" type="date"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Your location</div><input className="input" placeholder="Your area"/></div><div><div className="label-caps" style={{color:'var(--muted)',marginBottom:3}}>Your budget (UGX)</div><input className="input" type="number" placeholder="Budget"/></div></>}
        </div>
      </div>
      {/* Chat */}
      <div className="chat-wrap">
        <div className="chat-msgs" ref={ref}>
          {msgs.map((m,i)=>{
            if(m.t==='sys')return <div key={i} className="chat-msg-sys">{m.txt}</div>
            if(m.t==='me')return <div key={i} className="chat-msg-me">{m.txt}</div>
            if(m.t==='them')return <div key={i} className="chat-msg-them">{m.txt}</div>
            if(m.t==='offer-me')return <div key={i} className="chat-offer-me"><div className="chat-offer-label" style={{color:'var(--amber)'}}>Your offer</div><div className="chat-offer-amount">{fmt(m.amt)}</div></div>
            if(m.t==='offer-them')return <div key={i} className="chat-offer-them">
              <div className="chat-offer-label" style={{color:'var(--blue)'}}>Counter from {provider.name}</div>
              <div className="chat-offer-amount">{fmt(m.amt)}</div>
              <div style={{display:'flex',gap:7,marginTop:7}}>
                <button className="btn btn-forest btn-sm" onClick={()=>acceptCounter(m.amt)}>Accept</button>
                <button onClick={()=>setMsgs(mm=>[...mm,{t:'me',txt:'I will pass. Thank you.'}])} style={{padding:'6px 12px',fontSize:11,fontWeight:700,background:'var(--red-gl)',color:'var(--red)',border:'none',borderRadius:'var(--r-xs)',cursor:'pointer'}}>Decline</button>
              </div>
            </div>
            return null
          })}
        </div>
        <div className="chat-inp-row">
          <input className="chat-inp" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message..."/>
          <button className="btn btn-gold btn-sm" onClick={()=>setShowOffer(!showOffer)}>Make offer</button>
          <button className="btn btn-forest btn-sm" onClick={send}>↑</button>
        </div>
      </div>
      {showOffer&&<div style={{background:'var(--amber-gl)',borderRadius:'var(--r-md)',padding:12,marginTop:10,border:'1px solid rgba(212,133,58,.3)'}}>
        <div style={{fontWeight:700,color:'#7A4510',marginBottom:8}}>Your price offer (UGX)</div>
        <div style={{display:'flex',gap:8}}>
          <input className="input" type="number" value={offerVal} onChange={e=>setOfferVal(e.target.value)} placeholder="Enter your price" style={{fontWeight:700}}/>
          <button className="btn btn-gold btn-sm" onClick={sendOffer} style={{flexShrink:0}}>Send offer</button>
        </div>
        <p style={{fontSize:'0.7rem',color:'#7A4510',marginTop:6}}>If provider accepts, they pay 8% commission before contact is revealed.</p>
      </div>}
      <div className="note note-blue" style={{marginTop:10}}>Once a price is agreed, provider pays 8% commission and their contact details are revealed instantly.</div>
    </Modal>
  )
}

/* ──── HOSTEL MODAL ──── */
function HostelModal({open,onClose}){
  const {showToast}=useAuth()
  const [sel,setSel]=useState(null)
  const [form,setForm]=useState({})
  const [refDone,setRefDone]=useState(false)
  const genRef=`HST-${sel?.h?.id||'H1'}-${sel?.r?.num||'R101'}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}))
  const generate=()=>{
    if(!form.name||!form.sid||!form.ph||!form.nok)return showToast('Fill all required fields','error')
    setRefDone(true);showToast(`Ref ${genRef} generated! Pay UGX 80,000 at Stanbic Bank.`,'success')
  }
  return(
    <Modal open={open} onClose={()=>{setSel(null);setRefDone(false);setForm({});onClose()}} size="modal-xl" title="Student Hostel Portal" sub="Browse rooms · Generate reference · Pay at Stanbic Bank">
      {!sel&&<>
        <div className="note note-forest" style={{marginBottom:16}}><strong>How it works:</strong> Select room → Fill details → Generate reference → Pay UGX 80,000 at Stanbic Bank → Room allocated within 24hrs</div>
        {HOSTELS.map(h=>{
          const avail=h.rooms.filter(r=>r.status==='Available').length
          return(
            <div key={h.id} style={{border:'1px solid var(--border)',borderRadius:'var(--r-lg)',overflow:'hidden',marginBottom:16}}>
              <div style={{position:'relative',height:150}}>
                <img src={h.img} style={{width:'100%',height:'100%',objectFit:'cover'}} alt={h.name}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(17,28,22,.8))'}}/>
                <div style={{position:'absolute',bottom:12,left:16,color:'#fff'}}><div style={{fontWeight:800}}>{h.name}</div><div style={{fontSize:'0.72rem',opacity:.8}}>📍 {h.area} · {h.uni}</div></div>
                <div style={{position:'absolute',top:10,right:10,background:avail>0?'var(--forest)':'var(--red)',color:'#fff',borderRadius:'var(--r-full)',padding:'3px 10px',fontSize:10,fontWeight:700}}>{avail} rooms available</div>
              </div>
              <div style={{padding:16}}>
                <div style={{fontSize:'0.75rem',color:'var(--muted)',marginBottom:12}}>Warden: {h.warden} · {h.phone}</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
                  {h.rooms.map(r=>{
                    const ok=r.status==='Available'
                    return(
                      <div key={r.num} style={{border:`1.5px solid ${ok?'var(--forest-lt)':'var(--border)'}`,borderRadius:'var(--r-md)',padding:10,background:ok?'var(--forest-gl)':'var(--ivory)'}}>
                        <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.82rem'}}>Room {r.num}</div>
                        <div style={{fontSize:'0.7rem',color:'var(--muted)'}}>{r.type} · {r.sharing}</div>
                        <div style={{fontSize:'0.7rem',color:'var(--muted)',marginBottom:5}}>{r.sem}</div>
                        <div style={{fontFamily:'var(--font-display)',fontSize:'0.9rem',fontWeight:700,color:'var(--forest)',marginBottom:8}}>{fmt(r.price)}/sem</div>
                        {ok?<button className="btn btn-forest btn-sm btn-full" onClick={()=>setSel({h,r})}>Book this room</button>:<div style={{textAlign:'center',fontSize:10,color:'var(--muted)',padding:'5px 0',fontWeight:700}}>Booked</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </>}
      {sel&&!refDone&&<>
        <div style={{background:'var(--forest-gl)',borderRadius:'var(--r-md)',padding:13,marginBottom:16,border:'1px solid var(--forest-10)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontWeight:700,color:'var(--forest)'}}>{sel.h.name} · Room {sel.r.num}</div><div style={{fontSize:'0.72rem',color:'var(--muted)'}}>{sel.r.type} ({sel.r.sharing}) · {sel.r.sem}</div></div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--forest)'}}>{fmt(sel.r.price)}/sem</div>
        </div>
        <div className="field-row">
          <div className="field"><label className="field-label">Student full name <span className="req">*</span></label><input className="input" value={form.name||''} onChange={f('name')} placeholder="Full name as on ID"/></div>
          <div className="field"><label className="field-label">Student ID <span className="req">*</span></label><input className="input" value={form.sid||''} onChange={f('sid')} placeholder="24/U/1234"/></div>
        </div>
        <div className="field-row">
          <div className="field"><label className="field-label">University</label><select className="input select" value={form.uni||''} onChange={f('uni')}><option>Makerere University</option><option>Kyambogo University</option><option>Uganda Martyrs University</option><option>Other</option></select></div>
          <div className="field"><label className="field-label">Year of study</label><select className="input select" value={form.yr||''} onChange={f('yr')}>{['Year 1','Year 2','Year 3','Year 4','Postgraduate'].map(y=><option key={y}>{y}</option>)}</select></div>
        </div>
        <div className="field-row">
          <div className="field"><label className="field-label">Phone <span className="req">*</span></label><input className="input" type="tel" value={form.ph||''} onChange={f('ph')} placeholder="0771 234 567"/></div>
          <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={form.em||''} onChange={f('em')}/></div>
        </div>
        <div className="field-row">
          <div className="field"><label className="field-label">Next of kin name <span className="req">*</span></label><input className="input" value={form.nok||''} onChange={f('nok')} placeholder="Parent or guardian"/></div>
          <div className="field"><label className="field-label">Next of kin phone <span className="req">*</span></label><input className="input" type="tel" value={form.nokp||''} onChange={f('nokp')} placeholder="0771 234 567"/></div>
        </div>
        <div className="note note-amber"><strong>Booking fee: UGX 80,000</strong> payable at any Stanbic Bank branch using the reference below. Room allocated only after warden confirms payment.</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <button className="btn btn-outline" onClick={()=>setSel(null)}>← Back</button>
          <button className="btn btn-forest" onClick={generate}>Generate reference →</button>
        </div>
      </>}
      {sel&&refDone&&<>
        <div style={{background:'var(--forest)',borderRadius:'var(--r-lg)',padding:20,textAlign:'center',marginBottom:14}}>
          <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:6}}>Your booking reference</div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'1.6rem',fontWeight:700,color:'var(--gold-lt)',letterSpacing:'.08em'}}>{genRef}</div>
          <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,.45)',marginTop:5}}>Valid 48 hours · Pay UGX 80,000 at any Stanbic Bank branch</div>
        </div>
        <div className="note note-forest"><strong>Payment instructions:</strong><br/>1. Go to any Stanbic Bank branch<br/>2. Deposit <strong>UGX 80,000</strong><br/>3. Quote reference: <strong>{genRef}</strong><br/>4. Keep your deposit slip<br/>5. Warden confirms within 24 hours<br/>6. Room <strong>{sel.r.num}</strong> allocated upon confirmation</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <button className="btn btn-outline" onClick={()=>{navigator.clipboard?.writeText(genRef);showToast('Reference copied!','success')}}>Copy reference</button>
          <button className="btn btn-wa" onClick={()=>window.open(`https://wa.me/${sel.h.phone}?text=Hi Warden. Booking ref: ${genRef} for Room ${sel.r.num}. Paying UGX 80,000 at Stanbic Bank.`)}>WhatsApp warden</button>
        </div>
        <button className="btn btn-ghost btn-full" onClick={()=>{setSel(null);setRefDone(false);setForm({})}}>Book another room</button>
      </>}
    </Modal>
  )
}

/* ──── HOME PAGE ──── */
function HomePage(){
  const {user}=useAuth()
  const [authOpen,setAuthOpen]=useState(false)
  const [authMode,setAuthMode]=useState('choose')
  const [filters,setFilters]=useState({})
  const [viewL,setViewL]=useState(null)
  const [bookL,setBookL]=useState(null)
  const [jobM,setJobM]=useState(null)
  const [negoP,setNegoP]=useState(null)
  const [hostelOpen,setHostelOpen]=useState(false)
  const [activeChip,setActiveChip]=useState('all')

  const openAuth=m=>{setAuthMode(m);setAuthOpen(true)}

  const chips=[{k:'all',l:'All'},{k:'boosted',l:'⭐ Featured'},{k:'ready',l:'✓ Move-in ready'},{k:'student',l:'🎓 Student'},{k:'shared',l:'🤝 Shared'},{k:'verified',l:'🛡️ Verified'}]
  const filtered=LISTINGS.filter(l=>{
    if(filters.area&&l.area!==filters.area)return false
    if(filters.type&&l.type!==filters.type)return false
    if(filters.budget){const[mn,mx]=filters.budget.split('-').map(Number);if(l.price<mn||l.price>mx)return false}
    if(activeChip==='boosted')return l.boost
    if(activeChip==='ready')return l.ready
    if(activeChip==='student')return l.hostel||l.area==='Wandegeya'||l.area==='Makerere'
    if(activeChip==='shared')return l.type==='Shared Housing'
    if(activeChip==='verified')return l.v
    return true
  })

  const SH=({label,title,sub,action})=>(
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:28,flexWrap:'wrap',gap:14}}>
      <div>
        <div className="label-caps section-label">{label}</div>
        <h2 className="section-title">{title}</h2>
        {sub&&<p className="section-sub">{sub}</p>}
      </div>
      {action}
    </div>
  )

  return(
    <>
      <Nav onAuth={openAuth}/>
      <Hero onSearch={setFilters} onAuth={openAuth}/>

      {/* ── Properties ── */}
      <section className="section" id="sec-properties" style={{background:'var(--white)'}}>
        <div className="container">
          <SH label="Properties" title="Find your perfect home" sub="GPS-verified listings across Kampala and surrounds" action={<button className="btn btn-outline btn-sm">View all →</button>}/>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:22}}>
            {chips.map(c=>(
              <button key={c.k} onClick={()=>setActiveChip(c.k)} className="btn btn-sm btn-pill"
                style={{background:activeChip===c.k?'var(--forest)':'var(--ivory)',color:activeChip===c.k?'#fff':'var(--ink-lt)',border:`1px solid ${activeChip===c.k?'var(--forest)':'var(--border)'}`,fontWeight:activeChip===c.k?700:500}}>
                {c.l}
              </button>
            ))}
          </div>
          {filtered.length===0?<div style={{textAlign:'center',padding:'48px 20px',color:'var(--muted)'}}>No properties match. <button className="btn btn-ghost btn-sm" onClick={()=>{setActiveChip('all');setFilters({})}}>Clear filters</button></div>:
          <div className="grid-auto">{filtered.map(l=><PropCard key={l.id} l={l} onView={setViewL} onBook={setBookL}/>)}</div>}
        </div>
      </section>

      {/* ── Jobs ── */}
      <section className="section" id="sec-jobs" style={{background:'var(--ivory)'}}>
        <div className="container">
          <SH label="Job Board" title="Service jobs near you" sub="View full scope, accept or counter offer. Commission paid before client contact revealed." action={<button className="btn btn-gold btn-sm">+ Post a job</button>}/>
          <div className="grid-auto">
            {JOBS.map(j=>{
              const comm=Math.round(j.budget*0.08)
              return(
                <div key={j.id} className={`job-card${j.urgent?' job-card-urgent':''}`} onClick={()=>setJobM(j)}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <div className="job-cat-dot" style={{background:j.col}}/>
                    <span className="label-caps" style={{color:j.col}}>{j.cat}</span>
                    {j.urgent&&<span className="badge badge-red" style={{marginLeft:'auto'}}>URGENT</span>}
                  </div>
                  <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.95rem',marginBottom:4,lineHeight:1.3}}>{j.title}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--muted)',marginBottom:8}}>📍 {j.loc} · {j.posted}</div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:12}}>{j.tags.map(t=><span key={t} className="badge badge-forest">{t}</span>)}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:'1px solid var(--ivory-md)',paddingTop:10}}>
                    <div><div className="job-card-budget">{fmt(j.budget)}</div><div className="job-card-commission">8% = {fmt(comm)}</div></div>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-forest btn-sm" onClick={e=>{e.stopPropagation();setJobM(j)}}>View job</button>
                      <button className="btn btn-gold btn-sm" onClick={e=>{e.stopPropagation();setJobM(j)}}>Counter</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section" id="sec-services" style={{background:'var(--white)'}}>
        <div className="container">
          <SH label="Home Services" title="Verified providers near you" sub="GPS-matched. Negotiate directly. Commission before contact revealed."/>
          <div className="grid-4" style={{marginBottom:32}}>
            {[{ico:'👗',t:'Laundry',p:'From UGX 6,000/kg'},{ico:'🚛',t:'Movers',p:'From UGX 50,000'},{ico:'🧹',t:'Cleaners',p:'From UGX 15,000'},{ico:'📦',t:'Packing Helpers',p:'From UGX 20,000/day'},{ico:'🔧',t:'Plumbers',p:'From UGX 25,000'},{ico:'⚡',t:'Electricians',p:'From UGX 30,000'},{ico:'🔒',t:'Security',p:'UGX 300,000/mo'},{ico:'🌿',t:'Gardeners',p:'From UGX 20,000'}].map(s=>(
              <div key={s.t} className="service-card">
                <div className="service-icon">{s.ico}</div>
                <div className="service-title">{s.t}</div>
                <div className="service-count">{PROVIDERS.filter(p=>p.type===s.t).length} provider{PROVIDERS.filter(p=>p.type===s.t).length!==1?'s':''} nearby</div>
                <div className="service-desc">{s.p}</div>
              </div>
            ))}
          </div>
          <div className="grid-auto">
            {PROVIDERS.map(p=>(
              <div key={p.id} className="prov-card" onClick={()=>p.available?setNegoP(p):{}}>
                <div style={{padding:'16px 18px',display:'flex',gap:12,alignItems:'flex-start',borderBottom:'1px solid var(--ivory-md)'}}>
                  <div className="prov-avatar" style={{background:p.col,color:'var(--forest)',fontWeight:800,fontSize:'1.1rem'}}>{p.ini}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.92rem',marginBottom:2}}>{p.name}{p.verified&&<span className="badge badge-forest" style={{marginLeft:6,fontSize:'8px'}}>✓</span>}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--muted)',marginBottom:4}}>{p.type} · {p.area} · {p.dist}</div>
                    <div style={{display:'flex',alignItems:'center',gap:3}}>{starEl(p.rating)}<span style={{fontSize:10,color:'var(--muted)',marginLeft:4}}>{p.rating} ({p.reviews})</span></div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:'0.88rem',fontWeight:700,color:'var(--forest)'}}>{p.price}</div>
                    <div style={{fontSize:9,fontWeight:700,marginTop:4,padding:'2px 7px',borderRadius:'var(--r-full)',background:p.available?'var(--green-gl)':'var(--ivory)',color:p.available?'#1a8a4a':'var(--muted)'}}>{p.available?'Available':'Busy'}</div>
                  </div>
                </div>
                <div style={{padding:'10px 18px',display:'flex',gap:5,flexWrap:'wrap'}}>{p.specs.slice(0,3).map(s=><span key={s} className="badge badge-green">{s}</span>)}</div>
                <div style={{display:'flex',borderTop:'1px solid var(--ivory-md)'}}>
                  <div style={{flex:1,padding:'11px 16px',fontSize:12,fontWeight:600,color:'var(--muted)',borderRight:'1px solid var(--ivory-md)',cursor:'pointer',textAlign:'center'}}>View profile</div>
                  <button className="btn btn-sm" style={{flex:1,background:p.available?'var(--forest)':'var(--ivory)',color:p.available?'#fff':'var(--muted)',border:'none',borderRadius:0,cursor:p.available?'pointer':'not-allowed',fontSize:12,fontWeight:600}}>
                    {p.available?'Contact & negotiate':'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Moving ── */}
      <section className="section" id="sec-moving" style={{background:'var(--ivory)'}}>
        <div className="container">
          <SH label="Moving Services" title="Moving trucks near you" sub="Compare capacity and price. Photos shown. Negotiate directly with providers."/>
          <div className="grid-auto">
            {MOVING_PROVIDERS.map(p=>(
              <div key={p.id} className="truck-card">
                <div className="truck-img" style={{height:175,position:'relative',overflow:'hidden'}}>
                  <img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(17,28,22,.65) 0%,transparent 50%)'}}/>
                  <div style={{position:'absolute',top:10,left:10,display:'flex',gap:5}}>
                    {p.verified&&<span className="badge badge-forest">✓ Verified</span>}
                    <span className={`badge ${p.available?'badge-forest':'badge-red'}`}>{p.available?'Available':'Unavailable'}</span>
                  </div>
                  <div style={{position:'absolute',bottom:10,right:10,background:'rgba(17,28,22,.85)',color:'#fff',borderRadius:'var(--r-xs)',padding:'4px 9px',fontSize:10,fontWeight:700,backdropFilter:'blur(4px)'}}>{p.capacity}</div>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                    <div><div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.92rem'}}>{p.name}</div><div style={{fontSize:'0.72rem',color:'var(--muted)',marginTop:1}}>📍 {p.area}</div></div>
                    <div style={{textAlign:'right'}}><div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--forest)'}}>{p.price}</div><div style={{display:'flex',justifyContent:'flex-end',gap:2,marginTop:2}}>{starEl(p.rating)}<span style={{fontSize:10,color:'var(--muted)',marginLeft:3}}>{p.reviews}</span></div></div>
                  </div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:12}}>{p.features.map(f=><span key={f} className="badge badge-green">{f}</span>)}</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    <button className="btn btn-forest btn-sm" disabled={!p.available} onClick={()=>p.available&&setNegoP({...p,type:'Movers',dist:'nearby',col:'#EEF4FD',ini:p.name[0],bio:`${p.capacity}. ${p.features.join(', ')}.`,specs:[p.capacity,p.price,...p.features]})}>Contact</button>
                    <button className="btn btn-outline btn-sm" disabled={!p.available}>Get quote</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Land ── */}
      <section className="section" id="sec-land" style={{background:'var(--white)'}}>
        <div className="container">
          <SH label="Land & Property Sales" title="Verified land for sale" sub="Owner verified. GPS coordinates confirmed. Pay access fee to unlock full details."/>
          <div className="grid-3">
            {LAND.map(l=>(
              <div key={l.id} className="card" style={{cursor:'pointer'}}>
                <div style={{height:200,overflow:'hidden',position:'relative'}}>
                  <img src={l.img} alt={l.name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s var(--ease-out)'}}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(17,28,22,.68) 0%,transparent 55%)'}}/>
                  <div style={{position:'absolute',top:10,left:10,display:'flex',gap:5}}>
                    {l.prem&&<span className="badge badge-gold">Premium</span>}
                    <span className="badge badge-dark">{l.deed}</span>
                  </div>
                  <div style={{position:'absolute',bottom:12,left:14,right:14}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:'var(--gold-lt)',letterSpacing:'-0.03em'}}>{fmt(l.price)}</div>
                    <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,.7)',marginTop:1}}>📍 {l.area} · {l.size}</div>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{fontWeight:700,color:'var(--ink)',marginBottom:8}}>{l.name}</div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:12}}>{l.feats.map(f=><span key={f} className="badge badge-green">{f}</span>)}</div>
                  <div style={{background:'var(--forest)',borderRadius:'var(--r-sm)',padding:'9px 12px',display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontSize:'1rem'}}>🔒</span>
                    <div style={{flex:1}}><div style={{fontSize:'0.78rem',fontWeight:700,color:'#fff'}}>GPS + title + owner locked</div><div style={{fontSize:'0.7rem',color:'rgba(255,255,255,.55)'}}>Pay {fmt(l.fee)} to unlock</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Land Safety ── */}
      <section className="section" style={{background:'linear-gradient(135deg,var(--forest) 0%,#1f5040 100%)'}}>
        <div className="container">
          <div style={{marginBottom:32}}>
            <div className="label-caps section-label" style={{color:'var(--gold-lt)'}}>Land Safety Guide</div>
            <h2 className="section-title" style={{color:'#fff'}}>Buying land in Uganda safely</h2>
            <p className="section-sub" style={{color:'rgba(255,255,255,.6)'}}>Industry-standard checks used by licensed Ugandan property lawyers.</p>
          </div>
          <div className="grid-auto">
            {LAND_TIPS.map(t=>(
              <div key={t.n} style={{background:'rgba(255,255,255,.07)',border:`1px solid rgba(255,255,255,${t.risk==='high'?'.22':'.1'})`,borderRadius:'var(--r-lg)',padding:18}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(201,168,76,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'var(--gold-lt)',flexShrink:0}}>{t.n}</div>
                  <div>
                    <div style={{fontSize:'0.85rem',fontWeight:700,color:'#fff',marginBottom:4}}>{t.title}{t.risk==='high'&&<span className="badge badge-red" style={{marginLeft:6,fontSize:'8px'}}>HIGH RISK</span>}</div>
                    <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,.55)',lineHeight:1.6}}>{t.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hostels ── */}
      <section className="section" id="sec-hostels" style={{background:'var(--ivory)'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
            <div>
              <div className="label-caps section-label">For Students</div>
              <h2 className="section-title">Student hostel booking made simple</h2>
              <p className="section-sub">Generate a reference, pay at Stanbic Bank, and your room is allocated. Wardens manage everything in real time.</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,margin:'24px 0'}}>
                {[['📄','Generate reference','Fill details, get unique booking ref'],['🏦','Pay at bank','Deposit UGX 80,000 at Stanbic'],['👩‍💼','Warden confirms','Real-time payment system'],['🏠','Room allocated','Secured within 24 hours']].map(([i,t,d])=>(
                  <div key={t} style={{background:'var(--white)',borderRadius:'var(--r-md)',padding:14,border:'1px solid var(--border)'}}>
                    <div style={{fontSize:'1.3rem',marginBottom:7}}>{i}</div>
                    <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.82rem',marginBottom:4}}>{t}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--muted)',lineHeight:1.5}}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <button className="btn btn-forest btn-lg" onClick={()=>setHostelOpen(true)}>Browse hostel rooms →</button>
                <a href="/hostel" className="btn btn-outline btn-lg">Warden portal</a>
              </div>
            </div>
            <div style={{display:'grid',gap:10}}>
              {HOSTELS.map(h=>{
                const avail=h.rooms.filter(r=>r.status==='Available').length
                return(
                  <div key={h.id} style={{borderRadius:'var(--r-lg)',overflow:'hidden',boxShadow:'var(--sh-md)',cursor:'pointer'}} onClick={()=>setHostelOpen(true)}>
                    <div style={{position:'relative',height:140}}>
                      <img src={h.img} style={{width:'100%',height:'100%',objectFit:'cover'}} alt={h.name}/>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(17,28,22,.8))'}}/>
                      <div style={{position:'absolute',bottom:12,left:14,color:'#fff'}}><div style={{fontWeight:800,fontSize:'0.92rem'}}>{h.name}</div><div style={{fontSize:'0.72rem',opacity:.8}}>📍 {h.area} · {avail} rooms available</div></div>
                      <div style={{position:'absolute',top:10,right:10,background:'var(--forest)',color:'#fff',borderRadius:'var(--r-full)',padding:'3px 10px',fontSize:10,fontWeight:700}}>From {fmt(Math.min(...h.rooms.map(r=>r.price)))}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Referral ── */}
      <section className="section" id="sec-ref" style={{background:'var(--forest)'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
            <div>
              <div className="label-caps" style={{color:'var(--gold-lt)',marginBottom:12}}>Earn money</div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1.8rem,3vw,2.6rem)',fontWeight:600,color:'#fff',lineHeight:1.1,marginBottom:14}}>Refer a friend,<br/>earn UGX 2,000</h2>
              <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,.6)',lineHeight:1.7,marginBottom:22}}>Every time a friend pays a viewing fee through your link, UGX 2,000 lands in your MoMo. No cap. Withdraw from UGX 20,000.</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                {[['UGX 5K','Viewing fee'],['UGX 2K','You earn'],['UGX 3K','Platform']].map(([n,l])=>(
                  <div key={l} style={{background:'rgba(255,255,255,.07)',borderRadius:'var(--r-md)',padding:14,textAlign:'center',border:'1px solid rgba(255,255,255,.1)'}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--gold-lt)'}}>{n}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.4)',fontWeight:600,letterSpacing:'.07em',textTransform:'uppercase',marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'rgba(0,0,0,.2)',borderRadius:'var(--r-xl)',padding:24,border:'1px solid rgba(255,255,255,.08)'}}>
              <RefWidget/>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid-4" style={{marginBottom:48}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:12}}>
                <div className="nav-logo-mark"><svg width="16" height="16" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg></div>
                <span className="footer-logo-text">Homeyo</span>
              </div>
              <p className="footer-tagline">Uganda's premium verified property marketplace. No brokers. GPS-confirmed.</p>
              <button className="btn btn-wa btn-sm" style={{marginTop:16}} onClick={()=>window.open('https://wa.me/256700000000')}>WhatsApp us</button>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              {['Properties','Job board','Home services','Moving services','Land for sale','Student hostels'].map(l=>(
                <div key={l} className="footer-link">{l}</div>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Popular areas</div>
              {['Makerere','Kisaasi','Ntinda','Bukoto','Wandegeya','Naguru','Kololo'].map(a=><div key={a} className="footer-link">{a}</div>)}
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <div className="footer-link">+256 700 000 000</div>
              <div className="footer-link">hello@homeyo.ug</div>
              <div className="footer-link">Kampala, Uganda</div>
              <div style={{marginTop:16}}><div className="footer-col-title">Portals</div>
                <a href="/admin" className="footer-link" style={{opacity:.45,fontSize:'0.75rem'}}>Admin</a>
                <a href="/hostel" className="footer-link" style={{opacity:.45,fontSize:'0.75rem'}}>Hostel warden</a>
              </div>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:22,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
            <div className="footer-copy">© 2025 Homeyo Uganda · UGX 5K viewing fee · 8% service commission</div>
            <div style={{display:'flex',gap:16}}><span className="footer-copy">Privacy</span><span className="footer-copy">Terms</span></div>
          </div>
        </div>
      </footer>

      {/* Mobile nav */}
      <div className="mobile-nav">
        <div className="mobile-nav-tabs">
          {[['🏠','Home',()=>window.scrollTo({top:0,behavior:'smooth'})],['🔍','Search',()=>document.getElementById('sec-properties')?.scrollIntoView({behavior:'smooth'})],['🔧','Services',()=>document.getElementById('sec-services')?.scrollIntoView({behavior:'smooth'})],['🔨','Jobs',()=>document.getElementById('sec-jobs')?.scrollIntoView({behavior:'smooth'})],['👤','Me',()=>user?window.location.href='/dashboard':openAuth('choose')]].map(([ico,lbl,action])=>(
            <button key={lbl} className="mobile-nav-tab" onClick={action}>
              <span>{ico}</span><span>{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* All modals */}
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} initial={authMode}/>
      <ListingModal l={viewL} open={!!viewL} onClose={()=>setViewL(null)} onBook={l=>{setViewL(null);setBookL(l)}}/>
      <BookingModal l={bookL} open={!!bookL} onClose={()=>setBookL(null)}/>
      <JobModal j={jobM} open={!!jobM} onClose={()=>setJobM(null)}/>
      <NegoModal provider={negoP} open={!!negoP} onClose={()=>setNegoP(null)}/>
      <HostelModal open={hostelOpen} onClose={()=>setHostelOpen(false)}/>
    </>
  )
}

function RefWidget(){
  const [inp,setInp]=useState('');const [link,setLink]=useState('')
  return(
    <>
      <div className="label-caps" style={{color:'rgba(255,255,255,.4)',marginBottom:8}}>Get your referral link</div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} placeholder="Phone or email" style={{flex:1,padding:'10px 13px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:'var(--r-sm)',fontSize:13,color:'#fff',outline:'none',fontFamily:'var(--font-body)'}}/>
        <button className="btn btn-gold btn-sm" onClick={()=>{if(!inp)return;setLink('homeyo.ug/ref/ref'+Math.random().toString(36).slice(2,10))}}>Get link</button>
      </div>
      {link&&<>
        <div style={{background:'rgba(0,0,0,.3)',borderRadius:'var(--r-sm)',padding:11,marginBottom:10,border:'1px solid rgba(255,255,255,.08)'}}>
          <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:4}}>Your referral link</div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'0.82rem',color:'var(--gold-lt)',wordBreak:'break-all'}}>{link}</div>
        </div>
        <button className="btn btn-outline btn-sm btn-full" onClick={()=>navigator.clipboard?.writeText(link)} style={{color:'rgba(255,255,255,.7)',borderColor:'rgba(255,255,255,.2)'}}>Copy link</button>
      </>}
      {[['1','Share your link'],['2','Friend pays UGX 5,000 viewing fee'],['3','UGX 2,000 credited to your MoMo'],['4','Withdraw above UGX 20,000 anytime']].map(([n,s])=>(
        <div key={n} style={{display:'flex',gap:10,alignItems:'flex-start',marginTop:10}}>
          <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(201,168,76,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'var(--gold-lt)',flexShrink:0}}>{n}</div>
          <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,.5)',lineHeight:1.55,paddingTop:2}}>{s}</div>
        </div>
      ))}
    </>
  )
}

/* ──── DASHBOARD ──── */


function ProtectedDash(){const{user}=useAuth();if(!user)return<Navigate to="/" replace/>;if(user.role==='admin')return<Navigate to="/admin/dashboard" replace/>;return<Dashboard/>}
function ProtectedAdmin(){const{user}=useAuth();if(!user||user.role!=='admin')return<Navigate to="/admin" replace/>;return<AdminDashboard/>}

function AppRoutes(){
  return(
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/dashboard" element={<ProtectedDash/>}/>
      <Route path="/admin" element={<AdminLogin/>}/>
      <Route path="/admin/dashboard" element={<ProtectedAdmin/>}/>
      <Route path="/hostel" element={<HostelPortal/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}

export default function App(){
  return(
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
  )
}
