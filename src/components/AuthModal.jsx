import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Modal from './Modal.jsx'

function UploadBox({ label, hint, file, onFile }) {
  const [prev, setPrev] = useState(null)
  const pick = () => {
    const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*,.pdf'
    inp.onchange = e => {
      const f = e.target.files[0]; if(!f) return; onFile(f)
      if(f.type.startsWith('image/')) { const r=new FileReader(); r.onload=ev=>setPrev(ev.target.result); r.readAsDataURL(f) }
    }; inp.click()
  }
  return (
    <div className={`upload-box${file?' done':''}`} onClick={pick}>
      {prev ? (
        <div className="upload-prev">
          <img src={prev} alt={label} />
          <button className="upload-del" onClick={e=>{e.stopPropagation();setPrev(null);onFile(null)}}>×</button>
        </div>
      ) : (
        <div className="upload-ph">
          <div className="upload-icon">🪪</div>
          <div className="upload-lbl">{label}</div>
          <div className="upload-hint">{file?`✓ ${file.name}`:hint}</div>
        </div>
      )}
    </div>
  )
}

function StepBar({ steps, current }) {
  return (
    <div className="step-bar">
      {steps.map((s,i)=>(
        <div key={s} className={`step-item${current===i+1?' active':current>i+1?' done':''}`}>
          {current>i+1?'✓ ':''}{s}
        </div>
      ))}
    </div>
  )
}

function RoleChooser({ onSelect }) {
  const roles = [
    {id:'client',icon:'🏠',name:'Client / Tenant',desc:'Find homes, book services, hire providers'},
    {id:'provider',icon:'🔧',name:'Service Provider',desc:'Accept jobs, negotiate, earn commissions'},
    {id:'landlord',icon:'🏗️',name:'Landlord / Agent',desc:'List and manage properties'},
    {id:'student',icon:'🎓',name:'Student',desc:'Hostel booking, jobs, campus services'},
    {id:'provider-login',icon:'🔑',name:'Already registered?',desc:'Sign in to your existing account'},
  ]
  return (
    <>
      <p style={{fontSize:'0.85rem',color:'var(--muted)',textAlign:'center',marginBottom:18}}>How would you like to continue?</p>
      <div className="role-grid">
        {roles.map(r=>(
          <div key={r.id} className="role-card" onClick={()=>onSelect(r.id)}>
            <div className="role-card-icon">{r.icon}</div>
            <div className="role-card-name">{r.name}</div>
            <div className="role-card-desc">{r.desc}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function ClientSignIn({ onSwitch, onSuccess }) {
  const [em,setEm]=useState(''); const [pw,setPw]=useState(''); const [loading,setLoading]=useState(false)
  const { signIn, showToast } = useAuth()
  const nav = useNavigate()
  const submit = () => {
    if(!em) return showToast('Please enter your email','error')
    setLoading(true)
    setTimeout(()=>{
      const userData = {name:em.split('@')[0],email:em,role:'client',ref:'ref'+Math.random().toString(36).slice(2,8)}
      signIn(userData, nav)
      setLoading(false)
    },1100)
  }
  return (
    <>
      <div className="tabs-pill mb-4">
        <button className="tab-pill active">Sign in</button>
        <button className="tab-pill" onClick={()=>onSwitch('client-signup')}>Create account</button>
      </div>
      <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="your@email.com" /></div>
      <div className="field" style={{marginBottom:8}}><label className="field-label">Password</label><input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==='Enter'&&submit()} /></div>
      <div style={{textAlign:'right',marginBottom:16}}><span style={{fontSize:'0.75rem',color:'var(--forest)',cursor:'pointer',fontWeight:600}}>Forgot password?</span></div>
      <button className="btn btn-forest btn-full" onClick={submit} disabled={loading||!em} style={{marginBottom:10}}>{loading?'⏳ Signing in...':'Sign in'}</button>
      <div className="form-divider">or continue with</div>
      <button className="social-btn" onClick={()=>{signIn({name:'Google User',email:'g@gmail.com',role:'client',ref:'ref'+Math.random().toString(36).slice(2,8)});onSuccess()}}>🟢 Continue with Google</button>
      <button className="social-btn" onClick={()=>{signIn({name:'Apple User',email:'a@apple.com',role:'client',ref:'ref'+Math.random().toString(36).slice(2,8)});onSuccess()}}>🍎 Continue with Apple</button>
    </>
  )
}

function ClientSignup({ onSuccess }) {
  const [step,setStep]=useState(1); const [data,setData]=useState({}); const [otp,setOtp]=useState(''); const [loading,setLoading]=useState(false)
  const [f,setF]=useState({fn:'',ln:'',em:'',ph:'',pw:''})
  const { signIn, showToast } = useAuth()
  const upd = k => e => setF(p=>({...p,[k]:e.target.value}))

  const next1 = () => {
    if(!f.fn||!f.em||!f.ph) return showToast('Fill all required fields','error')
    if(f.pw.length<8) return showToast('Password must be at least 8 characters','error')
    setData(f); setStep(2); showToast('OTP sent to '+f.ph)
  }
  const verify = () => {
    if(!otp||otp.length<4) return showToast('Enter OTP code','error')
    setLoading(true); setTimeout(()=>{setLoading(false);setStep(3)},900)
  }
  const done = () => { signIn({name:data.fn,email:data.em,role:'client',ref:'ref'+Math.random().toString(36).slice(2,8)}); onSuccess() }

  return (
    <>
      <StepBar steps={['Account','Verify','Welcome']} current={step} />
      {step===1&&<>
        <div className="field-row">
          <div className="field"><label className="field-label">First name <span className="req">*</span></label><input className="input" value={f.fn} onChange={upd('fn')} placeholder="First name" /></div>
          <div className="field"><label className="field-label">Last name</label><input className="input" value={f.ln} onChange={upd('ln')} placeholder="Last name" /></div>
        </div>
        <div className="field"><label className="field-label">Email <span className="req">*</span></label><input className="input" type="email" value={f.em} onChange={upd('em')} placeholder="your@email.com" /></div>
        <div className="field"><label className="field-label">Phone (MTN or Airtel) <span className="req">*</span></label><input className="input" type="tel" value={f.ph} onChange={upd('ph')} placeholder="0771 234 567" /></div>
        <div className="field"><label className="field-label">Password <span className="req">*</span></label><input className="input" type="password" value={f.pw} onChange={upd('pw')} placeholder="At least 8 characters" /></div>
        <div className="field"><label className="field-label">Referral code <span style={{color:'var(--muted)',fontSize:10}}>optional</span></label><input className="input" placeholder="e.g. ref123abc" /></div>
        <div className="note note-forest">🎁 Earn UGX 2,000 for every friend who pays a viewing fee through your referral link.</div>
        <button className="btn btn-forest btn-full" onClick={next1}>Continue →</button>
      </>}
      {step===2&&<>
        <div className="note note-blue">📱 OTP sent to <strong>{data.ph}</strong></div>
        <div className="field"><label className="field-label">Enter 6-digit OTP <span className="req">*</span></label>
          <input className="input" type="text" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value)} autoFocus
            style={{fontSize:'1.5rem',letterSpacing:'0.2em',textAlign:'center',fontWeight:700}} />
        </div>
        <p style={{textAlign:'center',fontSize:'0.75rem',color:'var(--muted)',marginBottom:16}}>
          Didn't receive it? <span style={{color:'var(--forest)',fontWeight:700,cursor:'pointer'}} onClick={()=>showToast('OTP resent')}>Resend</span>
        </p>
        <div className="field-row">
          <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
          <button className="btn btn-forest" onClick={verify} disabled={loading}>{loading?'⏳':'Verify →'}</button>
        </div>
      </>}
      {step===3&&<div style={{textAlign:'center',padding:'10px 0 16px'}}>
        <div style={{width:68,height:68,background:'var(--forest-gl)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',border:'3px solid var(--forest-lt)',fontSize:'1.8rem'}}>✓</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:'var(--ink)',marginBottom:6}}>Welcome to Homeyo!</div>
        <p style={{fontSize:'0.8rem',color:'var(--muted)',marginBottom:18}}>Your account is ready, {data.fn}.</p>
        <div className="note note-gold">Your referral link is ready — earn UGX 2,000 per friend who pays a viewing fee.</div>
        <button className="btn btn-forest btn-full" onClick={done}>Start exploring →</button>
      </div>}
    </>
  )
}

function ProviderSignup({ onSuccess }) {
  const [step,setStep]=useState(1); const [docs,setDocs]=useState({}); const [agreed,setAgreed]=useState(false); const [ninCon,setNinCon]=useState(false)
  const [sign,setSign]=useState(''); const [progress,setProgress]=useState(0); const [submitting,setSubmitting]=useState(false)
  const { showToast } = useAuth()
  const steps = ['Info','Your ID','Guarantor','LC Letter','Sign','Done']

  const submit = () => {
    if(!sign.trim()) return showToast('Type your full name to sign','error')
    if(!agreed||!ninCon) return showToast('Accept both checkboxes','error')
    setSubmitting(true); let p=0
    const iv=setInterval(()=>{ p+=8; setProgress(Math.min(p,100)); if(p>=100){clearInterval(iv);setTimeout(()=>{setSubmitting(false);setStep(6)},300)} },160)
  }

  return (
    <>
      <StepBar steps={steps} current={step} />
      {step===1&&<>
        <p style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:14}}>Step 1 of 6 — Personal information</p>
        <div className="field-row">
          <div className="field"><label className="field-label">Full legal name <span className="req">*</span></label><input className="input" placeholder="As on your NIN" /></div>
          <div className="field"><label className="field-label">Phone <span className="req">*</span></label><input className="input" type="tel" placeholder="0771 234 567" /></div>
        </div>
        <div className="field"><label className="field-label">Email</label><input className="input" type="email" placeholder="your@email.com" /></div>
        <div className="field"><label className="field-label">Service type <span className="req">*</span></label>
          <select className="input select">
            {['Laundry','Movers','Cleaners','Packing Helpers','Plumbers','Electricians','Security Guards','Gardeners','Carpentry','Painting'].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field-row">
          <div className="field"><label className="field-label">Area(s) served</label><input className="input" placeholder="Kisaasi, Ntinda" /></div>
          <div className="field"><label className="field-label">Your rate</label><input className="input" placeholder="UGX 20,000/session" /></div>
        </div>
        <div className="note note-amber">⚠️ Strict verification required: NIN + Guarantor NIN + LC letter. Admin reviews within 48 hours.</div>
        <button className="btn btn-forest btn-full" onClick={()=>setStep(2)}>Continue →</button>
      </>}
      {step===2&&<>
        <p style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:8}}>Step 2 — Upload your National ID (front and back)</p>
        <div className="note note-blue">Upload clear photos of BOTH sides of your NIN card.</div>
        <div className="field-row mb-4">
          <UploadBox label="NIN — Front" hint="Tap to upload photo" file={docs.nf} onFile={f=>setDocs(d=>({...d,nf:f}))} />
          <UploadBox label="NIN — Back" hint="Tap to upload photo" file={docs.nb} onFile={f=>setDocs(d=>({...d,nb:f}))} />
        </div>
        <div className="field-row">
          <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
          <button className="btn btn-forest" onClick={()=>setStep(3)}>Continue →</button>
        </div>
      </>}
      {step===3&&<>
        <p style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:8}}>Step 3 — Guarantor details and National ID</p>
        <div className="field-row">
          <div className="field"><label className="field-label">Guarantor full name <span className="req">*</span></label><input className="input" placeholder="Guarantor name" /></div>
          <div className="field"><label className="field-label">Guarantor phone <span className="req">*</span></label><input className="input" type="tel" placeholder="0771 234 567" /></div>
        </div>
        <div className="field-row mb-4">
          <UploadBox label="Guarantor NIN — Front" hint="Tap to upload" file={docs.gf} onFile={f=>setDocs(d=>({...d,gf:f}))} />
          <UploadBox label="Guarantor NIN — Back" hint="Tap to upload" file={docs.gb} onFile={f=>setDocs(d=>({...d,gb:f}))} />
        </div>
        <div className="field-row">
          <button className="btn btn-outline" onClick={()=>setStep(2)}>← Back</button>
          <button className="btn btn-forest" onClick={()=>setStep(4)}>Continue →</button>
        </div>
      </>}
      {step===4&&<>
        <p style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:8}}>Step 4 — Local Council (LC1) letter</p>
        <div className="note note-forest">LC1 letter confirms your residency and good character. Must be signed and stamped by your LC1 chairman.</div>
        <div className="field-row mb-4">
          <UploadBox label="LC Letter" hint="Photo or PDF" file={docs.lc} onFile={f=>setDocs(d=>({...d,lc:f}))} />
          <div style={{background:'var(--blue-gl)',borderRadius:'var(--r-md)',padding:13,fontSize:'0.75rem',color:'var(--blue)',lineHeight:1.6}}>Available at your local council office. Ask for a letter confirming residency and good character.</div>
        </div>
        <div className="field-row">
          <button className="btn btn-outline" onClick={()=>setStep(3)}>← Back</button>
          <button className="btn btn-forest" onClick={()=>setStep(5)}>Continue →</button>
        </div>
      </>}
      {step===5&&<>
        <p style={{fontSize:'0.78rem',color:'var(--muted)',marginBottom:12}}>Step 5 — Review agreement and sign</p>
        <div style={{background:'var(--ivory)',borderRadius:'var(--r-md)',padding:'13px 14px',fontSize:'0.75rem',lineHeight:1.75,color:'var(--ink-lt)',maxHeight:150,overflowY:'auto',marginBottom:14,border:'1px solid var(--border)'}}>
          <strong>PROVIDER AGREEMENT</strong><br/><br/>
          1. I agree to pay Homeyo Uganda 8% commission on all jobs obtained through the platform.<br/>
          2. All documents submitted are genuine. False documents constitute a criminal offence.<br/>
          3. I consent to NIN verification at NIRA, guarantor contact, and physical inspection at any time.<br/>
          4. I will not contact clients outside Homeyo before paying the agreed commission.<br/>
          5. Bypassing this agreement results in permanent ban and civil recovery of commission.<br/>
          6. This digital signature is binding under the Electronic Transactions Act, Uganda 2011.
        </div>
        <div className="esign-box">
          <div className="esign-label">Your electronic signature</div>
          <div className="esign-fields">
            <input className="esign-inp" placeholder="Type your full legal name to sign" value={sign} onChange={e=>setSign(e.target.value)} />
            <input className="esign-inp" value={new Date().toLocaleDateString()} readOnly />
          </div>
          <label className="esign-check"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} />I have read and agree to the Provider Agreement. This is my legal digital signature.</label>
          <label className="esign-check" style={{marginTop:8}}><input type="checkbox" checked={ninCon} onChange={e=>setNinCon(e.target.checked)} />All uploaded documents are genuine and belong to me and my named guarantor.</label>
          <div className="esign-secure">🔒 <span>Secured: IP address + timestamp + device ID recorded</span></div>
        </div>
        {submitting&&<div className="upload-progress" style={{display:'block',marginTop:10}}><div className="upload-prog-fill" style={{width:progress+'%'}} /></div>}
        <div className="field-row" style={{marginTop:14}}>
          <button className="btn btn-outline" onClick={()=>setStep(4)} disabled={submitting}>← Back</button>
          <button className="btn btn-forest" onClick={submit} disabled={submitting}>{submitting?'⏳ Uploading...':'Submit application'}</button>
        </div>
      </>}
      {step===6&&<div style={{textAlign:'center',padding:'10px 0 16px'}}>
        <div style={{fontSize:'3rem',marginBottom:10}}>✓</div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)',marginBottom:6}}>Application submitted!</div>
        <div style={{fontSize:'0.72rem',color:'var(--muted)',marginBottom:16}}>Ref: APP-{Math.random().toString(36).slice(2,8).toUpperCase()}</div>
        <div className="note note-forest">Admin reviews within 48 hours. You'll receive an SMS once approved.</div>
        <button className="btn btn-outline btn-full" onClick={onSuccess}>Close</button>
      </div>}
    </>
  )
}

function LandlordFlow({ onSuccess }) {
  const [tab,setTab]=useState('signin'); const [step,setStep]=useState(1)
  const [em,setEm]=useState(''); const [pw,setPw]=useState(''); const [loading,setLoading]=useState(false); const [docs,setDocs]=useState({})
  const { signIn, showToast } = useAuth()
  const nav = useNavigate()
  const doSignIn = () => {
    if(!em) return showToast('Enter your email','error')
    setLoading(true); setTimeout(()=>{ signIn({name:em.split('@')[0],email:em,role:'landlord'},nav); setLoading(false) },1100)
  }
  return (
    <>
      <div className="tabs-pill mb-4">
        <button className={`tab-pill${tab==='signin'?' active':''}`} onClick={()=>setTab('signin')}>Sign in</button>
        <button className={`tab-pill${tab==='register'?' active':''}`} onClick={()=>setTab('register')}>Register</button>
      </div>
      {tab==='signin'&&<>
        <div className="field"><label className="field-label">Email</label><input className="input" type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="your@email.com" /></div>
        <div className="field"><label className="field-label">Password</label><input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSignIn()} placeholder="Password" /></div>
        <div className="note note-forest" style={{marginBottom:14}}>Landlord verification: NIN + property photos. Approved within 12 hours.</div>
        <button className="btn btn-forest btn-full" onClick={doSignIn} disabled={loading||!em}>{loading?'⏳':'Sign in as Landlord / Agent'}</button>
      </>}
      {tab==='register'&&<>
        <StepBar steps={['Info','ID Docs','Done']} current={step} />
        {step===1&&<>
          <div className="field"><label className="field-label">Full name or business <span className="req">*</span></label><input className="input" placeholder="Your name or business" /></div>
          <div className="field-row">
            <div className="field"><label className="field-label">Email <span className="req">*</span></label><input className="input" type="email" /></div>
            <div className="field"><label className="field-label">Phone <span className="req">*</span></label><input className="input" type="tel" placeholder="0771 234 567" /></div>
          </div>
          <div className="field"><label className="field-label">Role</label><select className="input select"><option>Landlord</option><option>Property Agent</option><option>Hostel Owner</option><option>Property Manager</option></select></div>
          <button className="btn btn-forest btn-full" onClick={()=>setStep(2)}>Continue →</button>
        </>}
        {step===2&&<>
          <div className="note note-blue">Upload front and back of your National ID card.</div>
          <div className="field-row mb-4">
            <UploadBox label="NIN — Front" hint="Tap to upload" file={docs.nf} onFile={f=>setDocs(d=>({...d,nf:f}))} />
            <UploadBox label="NIN — Back" hint="Tap to upload" file={docs.nb} onFile={f=>setDocs(d=>({...d,nb:f}))} />
          </div>
          <div className="field-row">
            <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn btn-forest" onClick={()=>setStep(3)}>Submit application</button>
          </div>
        </>}
        {step===3&&<div style={{textAlign:'center',padding:'10px 0 16px'}}>
          <div style={{fontSize:'3rem',marginBottom:10}}>✓</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)',marginBottom:6}}>Application submitted!</div>
          <div className="note note-amber">Admin reviews within 12 hours. SMS sent on approval.</div>
          <button className="btn btn-outline btn-full" onClick={onSuccess}>Close</button>
        </div>}
      </>}
    </>
  )
}


function StudentSignIn({ onSuccess }) {
  const [tab,setTab]=useState('signin')
  const [em,setEm]=useState(''); const [pw,setPw]=useState(''); const [loading,setLoading]=useState(false)
  const [f2,setF2]=useState({fn:'',em:'',ph:'',sid:'',uni:'Kyambogo University',yr:'Year 1'})
  const { signIn, showToast } = useAuth()
  const nav = useNavigate()

  const doSignIn = () => {
    if(!em) return showToast('Enter your email','error')
    setLoading(true)
    setTimeout(()=>{ signIn({name:em.split('@')[0],email:em,role:'student'},nav); setLoading(false) },1100)
  }
  const upd = k => e => setF2(p=>({...p,[k]:e.target.value}))
  const doRegister = () => {
    if(!f2.fn||!f2.em||!f2.ph) return showToast('Fill all required fields','error')
    setLoading(true)
    setTimeout(()=>{ signIn({name:f2.fn,email:f2.em,role:'student'},nav); setLoading(false) },1200)
  }

  return (
    <>
      <div className="tabs-pill mb-4">
        <button className={`tab-pill${tab==='signin'?' active':''}`} onClick={()=>setTab('signin')}>Sign in</button>
        <button className={`tab-pill${tab==='register'?' active':''}`} onClick={()=>setTab('register')}>Register</button>
      </div>
      {tab==='signin'&&<>
        <div className="field"><label className="field-label">Email or student ID</label><input className="input" type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="your@email.com"/></div>
        <div className="field"><label className="field-label">Password</label><input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==='Enter'&&doSignIn()}/></div>
        <button className="btn btn-forest btn-full" onClick={doSignIn} disabled={loading||!em}>{loading?'⏳ Signing in...':'Sign in to Student portal'}</button>
      </>}
      {tab==='register'&&<>
        <div className="field-row">
          <div className="field"><label className="field-label">Full name <span className="req">*</span></label><input className="input" value={f2.fn} onChange={upd('fn')} placeholder="Full name"/></div>
          <div className="field"><label className="field-label">Phone <span className="req">*</span></label><input className="input" type="tel" value={f2.ph} onChange={upd('ph')} placeholder="0771 234 567"/></div>
        </div>
        <div className="field"><label className="field-label">Email <span className="req">*</span></label><input className="input" type="email" value={f2.em} onChange={upd('em')} placeholder="your@email.com"/></div>
        <div className="field-row">
          <div className="field"><label className="field-label">University</label><select className="input select" value={f2.uni} onChange={upd('uni')}>
            {['Makerere University','Kyambogo University','MUBS','Uganda Martyrs University','Nkumba University','Ndejje University','MUST Mbarara','Gulu University','Muni University','ISBAT','Other'].map(u=><option key={u}>{u}</option>)}
          </select></div>
          <div className="field"><label className="field-label">Year of study</label><select className="input select" value={f2.yr} onChange={upd('yr')}>
            {['Year 1','Year 2','Year 3','Year 4','Postgraduate'].map(y=><option key={y}>{y}</option>)}
          </select></div>
        </div>
        <div className="note note-forest">As a student you can book hostel rooms, browse campus jobs, book laundry and transition into renting after campus — all in one dashboard.</div>
        <button className="btn btn-forest btn-full" onClick={doRegister} disabled={loading}>{loading?'⏳ Creating account...':'Create student account'}</button>
      </>}
    </>
  )
}

function ProviderSignIn({ onSwitch, onSuccess }) {
  const [em,setEm]=useState(''); const [loading,setLoading]=useState(false)
  const { signIn, showToast } = useAuth()
  const nav = useNavigate()
  const submit = () => {
    if(!em) return showToast('Enter your email','error')
    setLoading(true); setTimeout(()=>{ signIn({name:em.split('@')[0],email:em,role:'provider'},nav); setLoading(false) },1100)
  }
  return (
    <>
      <div className="tabs-pill mb-4">
        <button className="tab-pill active">Sign in</button>
        <button className="tab-pill" onClick={()=>onSwitch('provider')}>Register</button>
      </div>
      <div className="field"><label className="field-label">Email or phone</label><input className="input" type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="your@email.com" /></div>
      <div className="field"><label className="field-label">Password</label><input className="input" type="password" placeholder="Password" /></div>
      <button className="btn btn-forest btn-full" onClick={submit} disabled={loading||!em}>{loading?'⏳':'Sign in as Provider'}</button>
    </>
  )
}

export default function AuthModal({ open, onClose, initial='choose' }) {
  const [mode,setMode]=useState(initial)
  const close = () => { setMode('choose'); onClose() }
  const done  = () => { setMode('choose'); onClose() }
  const titles = {
    choose:{title:'Welcome to Homeyo',sub:"Uganda's premium property marketplace"},
    client:{title:'Client sign in',sub:'Access your account'},
    'client-signup':{title:'Create your account',sub:'Join thousands finding homes safely'},
    provider:{title:'Service provider signup',sub:'6-step verification process'},
    'provider-login':{title:'Provider sign in',sub:'Access your jobs and earnings'},
    landlord:{title:'Landlord / Agent',sub:'List and manage properties'},
    student:{title:'Student account',sub:'Hostels, jobs and campus services'},
  }
  const t = titles[mode]||titles.choose
  return (
    <Modal open={open} onClose={close} title={t.title} sub={t.sub}>
      {mode==='choose'&&<RoleChooser onSelect={m=>{if(m==='provider-login')setMode('provider-login');else if(m==='provider')setMode('provider');else if(m==='landlord')setMode('landlord');else setMode('client')}} />}
      {mode==='client'&&<ClientSignIn onSwitch={setMode} onSuccess={done} />}
      {mode==='client-signup'&&<ClientSignup onSuccess={done} />}
      {mode==='provider'&&<ProviderSignup onSuccess={done} />}
      {mode==='provider-login'&&<ProviderSignIn onSwitch={setMode} onSuccess={done} />}
      {mode==='landlord'&&<LandlordFlow onSuccess={done} />}
      {mode==='student'&&<StudentSignIn onSuccess={done} />}
    </Modal>
  )
}
