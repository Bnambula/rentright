import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

// Phone detection
export function detectPhone(text) {
  const t = text.toLowerCase()
  return [
    /0[67]\d{8}/,
    /\b[67]\d{7,8}\b/,
    /\d[\s.\-_]\d[\s.\-_]\d/,
    /zero\s+(seven|eight)/i,
    /\b\d{7,10}\b/,
  ].some(p => p.test(t))
}

const fmt = n => 'UGX ' + Number(n).toLocaleString()

// Revenue bar chart
function RevenueChart({ data, color = 'var(--forest)' }) {
  const max = Math.max(...data.map(d => d.v), 1)
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const total = data.reduce((a,d) => a + d.v, 0)
  return (
    <div style={{background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:20,marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:700,color:'var(--ink)'}}>Revenue overview</div>
          <div style={{fontSize:'0.72rem',color:'var(--muted)',marginTop:2}}>Last 7 months</div>
        </div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:color,letterSpacing:'-0.04em'}}>{fmt(total)}</div>
      </div>
      <div style={{display:'flex',gap:4,alignItems:'flex-end',height:90}}>
        {data.map((d,i) => (
          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{fontSize:'9px',color:'var(--muted)',fontWeight:600}}>
              {d.v>0?(d.v>=1000000?(d.v/1e6).toFixed(1)+'M':(d.v/1000).toFixed(0)+'K'):''}
            </div>
            <div style={{width:'100%',background:color+'22',borderRadius:'3px 3px 0 0',height:Math.max(4,Math.round((d.v/max)*70)),position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,background:color,opacity:i===data.length-1?1:0.6,borderRadius:'3px 3px 0 0'}}/>
            </div>
            <div style={{fontSize:'9px',color:'var(--muted)',fontWeight:600}}>{MONTHS[d.m]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Enquiry Reply with phone detection
function EnquiryReplyModal({ enquiry, open, onClose, showToast }) {
  const [msg, setMsg] = useState('')
  const [flagged, setFlagged] = useState(false)
  const [appeal, setAppeal] = useState(false)
  const [appealMsg, setAppealMsg] = useState('')

  if (!open || !enquiry) return null

  const send = () => {
    if (detectPhone(msg)) {
      setFlagged(true)
      showToast('Contact sharing detected — chat closed. Violation logged.', 'error')
      return
    }
    if (!msg.trim()) return showToast('Please type a message', 'error')
    showToast('Reply sent to ' + enquiry.from, 'success')
    onClose()
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'#fff',width:'100%',maxWidth:520,borderRadius:'var(--r-2xl) var(--r-2xl) 0 0',boxShadow:'var(--sh-xl)',maxHeight:'85vh',overflow:'auto'}}>
        <div style={{width:40,height:4,background:'var(--border)',borderRadius:2,margin:'10px auto 0'}}/>
        <div style={{padding:'14px 20px 12px',borderBottom:'1px solid var(--surface)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)'}}>Reply to enquiry</div>
            <div style={{fontSize:'0.72rem',color:'var(--muted)',marginTop:2}}>From: {enquiry.from} · Re: {enquiry.property}</div>
          </div>
          <button onClick={onClose} style={{width:28,height:28,border:'none',background:'var(--surface)',borderRadius:'50%',cursor:'pointer',fontSize:16,color:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
        <div style={{padding:'16px 20px 24px'}}>
          <div style={{background:'var(--surface)',borderRadius:'var(--r-md)',padding:12,marginBottom:14}}>
            <div style={{fontSize:'0.72rem',color:'var(--muted)',marginBottom:4,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em'}}>Their message</div>
            <div style={{fontSize:'0.85rem',color:'var(--ink)',lineHeight:1.6}}>{enquiry.message}</div>
          </div>
          {flagged ? (
            <div style={{background:'var(--red-gl)',borderRadius:'var(--r-md)',padding:16,border:'1px solid var(--red)',textAlign:'center'}}>
              <div style={{fontSize:'1.4rem',marginBottom:8}}>🚫</div>
              <div style={{fontWeight:700,color:'var(--red)',marginBottom:6}}>Chat closed — contact sharing detected</div>
              <p style={{fontSize:'0.78rem',color:'var(--red)',lineHeight:1.6,marginBottom:14}}>Your message appeared to contain a phone number or contact info. This violates platform terms and may result in a permanent ban.</p>
              {!appeal ? (
                <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                  <button className="btn btn-sm btn-outline" onClick={()=>setAppeal(true)}>Appeal this decision</button>
                  <button className="btn btn-sm btn-forest" onClick={onClose}>Close</button>
                </div>
              ) : (
                <>
                  <textarea value={appealMsg} onChange={e=>setAppealMsg(e.target.value)} placeholder="Explain why this was not contact sharing..." style={{width:'100%',padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)',resize:'vertical',marginBottom:10,minHeight:80}}/>
                  <button className="btn btn-forest btn-sm btn-full" onClick={()=>{showToast('Appeal submitted. Admin reviews within 24hrs.','success');onClose()}}>Submit appeal</button>
                </>
              )}
            </div>
          ) : (
            <>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>Your reply</div>
                <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Type your reply. Do not share phone numbers or contact details — all communication must stay on Homeyo."
                  style={{width:'100%',padding:'10px 13px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)',resize:'vertical'}}/>
              </div>
              <div style={{background:'var(--amber-gl)',borderRadius:'var(--r-sm)',padding:'8px 12px',marginBottom:12,fontSize:'0.72rem',color:'#7A4510'}}>
                ⚠️ Do not share phone numbers. Violations result in immediate chat closure and possible permanent ban.
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                <button className="btn btn-forest" onClick={send}>Send reply</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Add listing modal
function AddListingModal({ open, onClose, showToast, listing=null }) {
  const isEdit = !!listing
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(listing || {name:'',area:'',type:'Self-Contained',price:'',beds:1,baths:1,sqm:'',desc:'',agentAssign:'platform',agentId:'',commission:8})
  const [submitting, setSubmitting] = useState(false)
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))
  const steps = ['Details','Location','Agent & Commission','Review']

  const submit = () => {
    if (!form.name||!form.area||!form.price||!form.desc) return showToast('Fill all required fields','error')
    if (detectPhone(form.desc)) return showToast('Description may not contain phone numbers. Permanent ban risk.','error')
    setSubmitting(true)
    setTimeout(()=>{ setSubmitting(false); showToast(isEdit?'Listing updated!':'Submitted for admin review','success'); onClose() },1400)
  }

  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'#fff',width:'100%',maxWidth:560,borderRadius:'var(--r-2xl) var(--r-2xl) 0 0',maxHeight:'92vh',overflow:'auto',boxShadow:'var(--sh-xl)'}}>
        <div style={{width:40,height:4,background:'var(--border)',borderRadius:2,margin:'10px auto 0'}}/>
        <div style={{padding:'14px 20px 12px',borderBottom:'1px solid var(--surface)',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'#fff',zIndex:2}}>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)'}}>{isEdit?'Edit listing':'Add new listing'}</div>
            <div style={{fontSize:'0.72rem',color:'var(--muted)',marginTop:2}}>Step {step} of {steps.length}: {steps[step-1]}</div>
          </div>
          <button onClick={onClose} style={{width:28,height:28,border:'none',background:'var(--surface)',borderRadius:'50%',cursor:'pointer',fontSize:16,color:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
        <div style={{display:'flex',borderBottom:'1px solid var(--border)'}}>
          {steps.map((s,i)=>(
            <div key={s} style={{flex:1,padding:'9px 4px',textAlign:'center',fontSize:'9px',fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',color:step===i+1?'var(--forest)':step>i+1?'var(--green-ok)':'var(--muted)',borderBottom:`2.5px solid ${step===i+1?'var(--forest)':step>i+1?'var(--green-ok)':'transparent'}`}}>
              {step>i+1?'✓ ':''}{s.split(' ')[0]}
            </div>
          ))}
        </div>
        <div style={{padding:'18px 20px 28px'}}>
          {step===1&&<>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}>
                <div className="field-label">Property name <span className="req">*</span></div>
                <input className="input" value={form.name} onChange={f('name')} placeholder="e.g. Tranquil Garden Studio"/>
              </div>
              <div>
                <div className="field-label">Type <span className="req">*</span></div>
                <select className="input select" value={form.type} onChange={f('type')}>
                  {['Self-Contained','Single Room','Double Room','Apartment','Studio','Shared Housing','Hostel'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div className="field-label">Monthly rent (UGX) <span className="req">*</span></div>
                <input className="input" type="number" value={form.price} onChange={f('price')} placeholder="e.g. 450000"/>
              </div>
              <div>
                <div className="field-label">Bedrooms</div>
                <select className="input select" value={form.beds} onChange={f('beds')}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select>
              </div>
              <div>
                <div className="field-label">Bathrooms</div>
                <select className="input select" value={form.baths} onChange={f('baths')}>{[1,2,3].map(n=><option key={n}>{n}</option>)}</select>
              </div>
              <div>
                <div className="field-label">Floor area (m²)</div>
                <input className="input" type="number" value={form.sqm} onChange={f('sqm')} placeholder="e.g. 45"/>
              </div>
              <div>
                <div className="field-label">Available from</div>
                <input className="input" type="date" value={form.availDate||''} onChange={f('availDate')}/>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <div className="field-label">Description <span className="req">*</span></div>
                <textarea className="input" rows={3} value={form.desc} onChange={f('desc')} placeholder="Describe the property. NO phone numbers — your contact is revealed after payment only."/>
                <div style={{fontSize:'9px',color:'var(--red)',marginTop:3}}>⚠️ Phone numbers in descriptions lead to permanent ban</div>
              </div>
              <div style={{display:'flex',gap:16}}>
                <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',fontSize:'0.82rem'}}>
                  <input type="checkbox" style={{accentColor:'var(--forest)'}} onChange={f('furnished')}/> Furnished
                </label>
                <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',fontSize:'0.82rem'}}>
                  <input type="checkbox" style={{accentColor:'var(--forest)'}} onChange={f('pets')}/> Pets allowed
                </label>
              </div>
            </div>
            <button className="btn btn-forest btn-full" style={{marginTop:16}} onClick={()=>setStep(2)}>Continue →</button>
          </>}
          {step===2&&<>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <div className="field-label">Area / Parish <span className="req">*</span></div>
                <input className="input" value={form.area} onChange={f('area')} placeholder="e.g. Kisaasi"/>
              </div>
              <div>
                <div className="field-label">District</div>
                <select className="input select">{['Kampala','Wakiso','Mukono','Entebbe'].map(d=><option key={d}>{d}</option>)}</select>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <div className="field-label">Key amenities (select all that apply)</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:7,marginTop:6}}>
                  {['NWSC water','UMEME prepaid','Generator','Borehole','Tarmac road','WiFi','Security guard','CCTV','Parking','Near market','Near school'].map(a=>(
                    <label key={a} style={{display:'flex',alignItems:'center',gap:5,cursor:'pointer',fontSize:'0.76rem',background:'var(--surface)',borderRadius:'var(--r-full)',padding:'4px 10px',border:'1px solid var(--border)'}}>
                      <input type="checkbox" style={{accentColor:'var(--forest)',width:12,height:12}}/> {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:16}}>
              <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-forest" onClick={()=>setStep(3)}>Continue →</button>
            </div>
          </>}
          {step===3&&<>
            <div style={{marginBottom:14}}>
              <div className="field-label" style={{marginBottom:8}}>Agent assignment</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['platform','🤖','Platform assigned','Highest-rated agent in your area'],['manual','👤','Choose agent','Search by name or ID']].map(([v,ico,t,d])=>(
                  <div key={v} onClick={()=>setForm(p=>({...p,agentAssign:v}))}
                    style={{border:`2px solid ${form.agentAssign===v?'var(--forest)':'var(--border)'}`,borderRadius:'var(--r-md)',padding:12,cursor:'pointer',background:form.agentAssign===v?'var(--forest-gl)':'#fff',transition:'all .15s'}}>
                    <div style={{fontSize:'1.1rem',marginBottom:4}}>{ico}</div>
                    <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.8rem',marginBottom:2}}>{t}</div>
                    <div style={{fontSize:'0.67rem',color:'var(--muted)'}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
            {form.agentAssign==='manual'&&(
              <div style={{marginBottom:14}}>
                <div className="field-label">Search agent by name/ID</div>
                <input className="input" value={form.agentId} onChange={f('agentId')} placeholder="Agent name or ID"/>
                <div style={{background:'var(--forest-gl)',borderRadius:'var(--r-sm)',padding:10,marginTop:7}}>
                  {['James K. — Rating 4.8 — 22 listings','Grace M. — Rating 4.7 — 18 listings'].map(a=>(
                    <div key={a} onClick={()=>setForm(p=>({...p,agentId:a.split(' — ')[0]}))}
                      style={{padding:'7px 0',borderBottom:'1px solid var(--forest-10)',cursor:'pointer',fontSize:'0.78rem',fontWeight:500,color:'var(--forest)',display:'flex',justifyContent:'space-between'}}>
                      <span>{a}</span><span style={{fontSize:10,fontWeight:700}}>Select</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{marginBottom:14}}>
              <div className="field-label">Commission rate</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[8,10,12,15].map(c=>(
                  <button key={c} onClick={()=>setForm(p=>({...p,commission:c}))}
                    style={{padding:'7px 18px',fontSize:13,fontWeight:700,borderRadius:'var(--r-full)',border:'1.5px solid var(--border)',background:form.commission===c?'var(--forest)':'#fff',color:form.commission===c?'#fff':'var(--muted)',cursor:'pointer',transition:'all .15s'}}>
                    {c}%
                  </button>
                ))}
              </div>
              <div style={{background:'var(--blue-gl)',borderRadius:'var(--r-sm)',padding:'9px 12px',marginTop:10,fontSize:'0.75rem',color:'var(--blue)'}}>
                Platform: {Math.round(form.commission*0.4)}% · Agent: {Math.round(form.commission*0.6)}% · Referrer: UGX 2,000 per viewing
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <button className="btn btn-outline" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn btn-forest" onClick={()=>setStep(4)}>Continue →</button>
            </div>
          </>}
          {step===4&&<>
            <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',padding:15,marginBottom:14}}>
              <div style={{fontWeight:700,color:'var(--ink)',marginBottom:10,fontSize:'0.9rem'}}>Listing summary</div>
              {[['Name',form.name||'—'],['Type',form.type],['Rent',form.price?fmt(form.price)+'/month':'—'],['Area',form.area||'—'],['Beds/Baths',form.beds+'bd · '+form.baths+'ba'],['Agent',form.agentAssign==='platform'?'Platform assigned':form.agentId||'—'],['Commission',form.commission+'%']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid var(--border)',fontSize:'0.78rem'}}>
                  <span style={{color:'var(--muted)'}}>{k}</span><span style={{fontWeight:600,color:'var(--ink)'}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:'var(--amber-gl)',borderRadius:'var(--r-md)',padding:12,border:'1px solid var(--amber)',marginBottom:14,fontSize:'0.75rem',color:'#7A4510',lineHeight:1.65}}>
              ✓ No phone numbers in description · ✓ Property in your ownership/management · ✓ Admin review within 2 hours before going live
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <button className="btn btn-outline" onClick={()=>setStep(3)}>← Back</button>
              <button className="btn btn-forest" disabled={submitting} onClick={submit}>{submitting?'⏳ Submitting...':isEdit?'Save changes':'Submit listing'}</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}

// Listings tab with edit/delete
function ListingsTab({ showToast }) {
  const [editListing, setEditListing] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [listings, setListings] = useState([
    {id:1,name:'Tranquil Garden Studio',area:'Bukoto',type:'Self-Contained',price:420000,beds:1,baths:1,conf:98,status:'Active',agent:'James K.'},
    {id:2,name:'Bright Double Room',area:'Kisaasi',type:'Double Room',price:350000,beds:1,baths:1,conf:91,status:'Active',agent:'Platform'},
    {id:3,name:'Executive Naguru 2BR',area:'Naguru',type:'Self-Contained',price:850000,beds:2,baths:2,conf:97,status:'Active',agent:'Grace K.'},
    {id:4,name:'Budget Wandegeya Room',area:'Wandegeya',type:'Single Room',price:150000,beds:1,baths:1,conf:76,status:'Pending review',agent:'None'},
  ])

  const doDelete = (id) => { setListings(p=>p.filter(l=>l.id!==id)); setConfirmDelete(null); showToast('Listing removed') }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)'}}>My listings</div>
        <button className="btn btn-forest btn-sm" onClick={()=>setAddOpen(true)}>➕ Add listing</button>
      </div>
      {listings.map(l=>{
        const cc = l.conf>=85?'var(--forest)':l.conf>=65?'var(--blue)':'var(--amber)'
        return (
          <div key={l.id} style={{background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:'15px 17px',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:10}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:'var(--ink)',marginBottom:2}}>{l.name}</div>
                <div style={{fontSize:'0.73rem',color:'var(--muted)'}}>📍 {l.area} · {l.type} · {l.beds}bd {l.baths}ba</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:700,color:'var(--forest)'}}>{fmt(l.price)}<span style={{fontSize:11,fontWeight:400,color:'var(--muted)'}}>/mo</span></div>
                <span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:l.status==='Active'?'var(--forest-gl)':'var(--amber-gl)',color:l.status==='Active'?'var(--forest)':'#7A4510'}}>{l.status}</span>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <div style={{flex:1,height:4,background:'var(--surface2)',borderRadius:'var(--r-full)',overflow:'hidden'}}>
                <div style={{width:l.conf+'%',height:'100%',background:cc,borderRadius:'var(--r-full)'}}/>
              </div>
              <div style={{fontSize:10,fontWeight:700,color:cc}}>{l.conf}% trust</div>
              <div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Agent: {l.agent}</div>
            </div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
              <button className="btn btn-sm btn-forest" onClick={()=>setEditListing(l)}>✏️ Edit</button>
              <button className="btn btn-sm btn-outline" onClick={()=>setConfirmDelete(l)}>🗑️ Remove</button>
              <button className="btn btn-sm btn-outline" onClick={()=>showToast('Opening listing preview...')}>👁️ Preview</button>
              <button className="btn btn-sm" style={{background:'var(--gold-gl)',color:'var(--gold-dk)',border:'1px solid rgba(201,168,76,.3)',borderRadius:'var(--r-xs)',fontSize:12,fontWeight:700,padding:'0 10px',minHeight:36,cursor:'pointer'}} onClick={()=>showToast('Boost options...')}>⭐ Boost</button>
            </div>
          </div>
        )
      })}
      {editListing&&<AddListingModal open={!!editListing} listing={editListing} onClose={()=>setEditListing(null)} showToast={showToast}/>}
      <AddListingModal open={addOpen} onClose={()=>setAddOpen(false)} showToast={showToast}/>
      {confirmDelete&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(4px)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'#fff',borderRadius:'var(--r-xl)',padding:24,maxWidth:360,width:'100%',boxShadow:'var(--sh-xl)'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:8}}>Remove listing?</div>
            <p style={{fontSize:'0.85rem',color:'var(--muted)',lineHeight:1.6,marginBottom:18}}>Remove <strong>{confirmDelete.name}</strong>? This will also remove pending viewings and enquiries.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <button className="btn btn-outline" onClick={()=>setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-red" onClick={()=>doDelete(confirmDelete.id)}>Remove listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Provider jobs — available, active, completed
function ProviderJobsTab({ type, showToast }) {
  const [offering, setOffering] = useState({type:'Plumbing',negotiable:true,rate:'35000',areas:'Kisaasi, Ntinda',desc:'Professional plumber, 10 years experience.'})
  const [editMode, setEditMode] = useState(false)
  const byType = {
    available:[
      {id:'J1',cat:'Plumbing',title:'Fix leaking pipe in kitchen',loc:'Kira',budget:45000,comm:3600,posted:'2h ago',urgent:1,ref:'JB-2025-001'},
      {id:'J3',cat:'Electrical',title:'Install 3 sockets plus fan',loc:'Wandegeya',budget:60000,comm:4800,posted:'1d ago',ref:'JB-2025-003'},
    ],
    active:[
      {id:'J2',cat:'Moving',title:'Move 1-bedroom Kisaasi to Ntinda',loc:'Kisaasi',budget:120000,comm:9600,started:'Yesterday',progress:65,ref:'JB-2025-002',client:'Brian M.'},
    ],
    completed:[
      {id:'JC1',cat:'Cleaning',title:'Deep clean 3BR Naguru',loc:'Naguru',budget:35000,comm:2800,date:'Dec 28',rating:4.8,ref:'JB-2024-089'},
      {id:'JC2',cat:'Plumbing',title:'Replace kitchen tap',loc:'Bukoto',budget:28000,comm:2240,date:'Dec 22',rating:5.0,ref:'JB-2024-076'},
    ],
  }
  const jobs = byType[type]||[]
  return (
    <div>
      {type==='available'&&(
        <>
          <div style={{background:'var(--forest)',borderRadius:'var(--r-lg)',padding:17,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div>
                <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:3}}>My service offering</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'#fff'}}>{offering.type}</div>
              </div>
              <button onClick={()=>{if(editMode)showToast('Services updated!','success');setEditMode(!editMode)}}
                style={{padding:'6px 13px',background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',borderRadius:'var(--r-sm)',color:'rgba(255,255,255,.85)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)'}}>
                {editMode?'💾 Save':'✏️ Edit'}
              </button>
            </div>
            {editMode?(
              <div style={{display:'grid',gap:9}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                  <div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:3}}>Service type</div>
                    <select value={offering.type} onChange={e=>setOffering(p=>({...p,type:e.target.value}))} style={{width:'100%',padding:'8px 10px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'var(--r-xs)',color:'#fff',fontSize:13,fontFamily:'var(--font-body)',outline:'none'}}>
                      {['Laundry','Movers','Cleaners','Plumbers','Electricians','Security','Carpentry','Gardeners','Packing'].map(t=><option key={t} style={{background:'#1A3C2E'}}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:3}}>Base rate (UGX)</div>
                    <input value={offering.rate} onChange={e=>setOffering(p=>({...p,rate:e.target.value}))} style={{width:'100%',padding:'8px 10px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'var(--r-xs)',color:'#fff',fontSize:13,fontFamily:'var(--font-body)',outline:'none'}}/>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:3}}>Service areas</div>
                  <input value={offering.areas} onChange={e=>setOffering(p=>({...p,areas:e.target.value}))} style={{width:'100%',padding:'8px 10px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'var(--r-xs)',color:'#fff',fontSize:13,fontFamily:'var(--font-body)',outline:'none'}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:3}}>Bio / description</div>
                  <textarea value={offering.desc} onChange={e=>setOffering(p=>({...p,desc:e.target.value}))} rows={2} style={{width:'100%',padding:'8px 10px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'var(--r-xs)',color:'#fff',fontSize:13,fontFamily:'var(--font-body)',outline:'none',resize:'vertical'}}/>
                </div>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.78rem',color:'rgba(255,255,255,.7)'}}>
                  <input type="checkbox" checked={offering.negotiable} onChange={e=>setOffering(p=>({...p,negotiable:e.target.checked}))} style={{accentColor:'var(--gold)',width:15,height:15}}/> Price is negotiable
                </label>
              </div>
            ):(
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:9}}>
                {[['💰','Rate','UGX '+offering.rate+'/visit'],['📍','Areas',offering.areas],['🤝','Negotiable',offering.negotiable?'Yes':'Fixed']].map(([ico,l,v])=>(
                  <div key={l} style={{background:'rgba(255,255,255,.08)',borderRadius:'var(--r-sm)',padding:'8px 10px'}}>
                    <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,.4)',fontWeight:700,marginBottom:2}}>{ico} {l}</div>
                    <div style={{fontSize:'0.8rem',color:'#fff',fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{background:'var(--amber-gl)',borderRadius:'var(--r-md)',padding:'10px 13px',border:'1px solid var(--amber)',marginBottom:14,display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{fontSize:'1.1rem',flexShrink:0}}>🪪</div>
            <div>
              <div style={{fontWeight:700,color:'#7A4510',fontSize:'0.82rem',marginBottom:2}}>National ID required to begin any work</div>
              <div style={{fontSize:'0.73rem',color:'#7A4510',lineHeight:1.55}}>Your NIN must be verified before accepting jobs. This protects you and your clients. <span style={{textDecoration:'underline',cursor:'pointer'}}>Complete verification →</span></div>
            </div>
          </div>
        </>
      )}
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:12}}>
        {type==='available'?'Available jobs near you':type==='active'?'Active jobs':'Completed jobs'}
      </div>
      {jobs.length===0&&<div style={{background:'var(--surface)',borderRadius:'var(--r-md)',padding:20,textAlign:'center',color:'var(--muted)',fontSize:'0.85rem'}}>No {type} jobs at the moment.</div>}
      {jobs.map(j=>(
        <div key={j.id} style={{background:j.urgent?'var(--amber-gl)':'#fff',borderRadius:'var(--r-lg)',border:`1.5px solid ${j.urgent?'var(--amber)':'var(--border)'}`,padding:'14px 16px',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:8}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3,flexWrap:'wrap'}}>
                <span style={{fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em'}}>{j.cat}</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--forest)',fontWeight:700,background:'var(--forest-gl)',padding:'1px 7px',borderRadius:'var(--r-full)'}}>{j.ref}</span>
                {j.urgent&&<span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--red)',color:'#fff'}}>URGENT</span>}
              </div>
              <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.9rem',marginBottom:2}}>{j.title}</div>
              <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>📍 {j.loc} · {j.posted||j.started||j.date}</div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--forest)'}}>{fmt(j.budget)}</div>
              <div style={{fontSize:10,color:'var(--red)',fontWeight:600}}>-{fmt(j.comm)} comm.</div>
              {j.rating&&<div style={{display:'flex',justifyContent:'flex-end',gap:1,marginTop:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:10,color:s<=j.rating?'var(--gold)':'var(--border)'}}>★</span>)}</div>}
            </div>
          </div>
          {j.progress!=null&&(
            <div style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontWeight:600,color:'var(--muted)',marginBottom:4}}><span>Progress</span><span>{j.progress}%</span></div>
              <div style={{height:5,background:'var(--surface2)',borderRadius:'var(--r-full)',overflow:'hidden'}}><div style={{width:j.progress+'%',height:'100%',background:'var(--forest)',borderRadius:'var(--r-full)',transition:'width .5s'}}/></div>
            </div>
          )}
          {type==='available'&&(
            <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
              <button className="btn btn-forest btn-sm" onClick={()=>showToast('Sign commission agreement to accept this job')}>Accept job</button>
              <button className="btn btn-gold btn-sm" onClick={()=>showToast('Counter offer must be divisible by 1,000')}>Counter offer</button>
              <button className="btn btn-outline btn-sm" onClick={()=>showToast('Viewing full scope of work...')}>View scope</button>
            </div>
          )}
          {type==='active'&&(
            <div style={{display:'flex',gap:7}}>
              <button className="btn btn-forest btn-sm" onClick={()=>showToast('Update progress...')}>Update progress</button>
              <button className="btn btn-outline btn-sm" onClick={()=>showToast('Message client (no contact sharing)')}>Message client</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Unlocked contacts — 7 day display
function UnlockedContactsTab({ showToast }) {
  const contacts = [
    {id:1,property:'Bright Double Room',area:'Kisaasi',ll:'Grace Namukasa',phone:'0712 345 678',ref:'TXN-XK7PABCD',expiresIn:5},
    {id:2,property:'Modern Makerere Bedsitter',area:'Makerere',ll:'James Kato',phone:'0756 789 012',ref:'TXN-YM3QEFGH',expiresIn:2},
    {id:3,property:'Kololo Shared 3BR',area:'Kololo',ll:'Anne Kisakye',phone:'0701 234 567',ref:'TXN-ZN9RIJKL',expiresIn:1},
  ]
  return (
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)',marginBottom:6}}>Unlocked landlord contacts</div>
      <div style={{fontSize:'0.8rem',color:'var(--muted)',marginBottom:16,lineHeight:1.6}}>Contact details visible for <strong>7 days</strong> from payment. After that, pay again to view.</div>
      {contacts.map(c=>(
        <div key={c.id} style={{background:'#fff',borderRadius:'var(--r-lg)',border:`1.5px solid ${c.expiresIn<=1?'var(--red)':c.expiresIn<=2?'var(--amber)':'var(--border)'}`,padding:'14px 16px',marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
            <div>
              <div style={{fontWeight:700,color:'var(--ink)',marginBottom:2}}>{c.property}</div>
              <div style={{fontSize:'0.7rem',color:'var(--muted)'}}>📍 {c.area} · <span style={{fontFamily:'var(--font-mono)',color:'var(--forest)'}}>{c.ref}</span></div>
            </div>
            <div style={{fontSize:'9px',fontWeight:700,padding:'3px 9px',borderRadius:'var(--r-full)',background:c.expiresIn<=1?'var(--red-gl)':c.expiresIn<=2?'var(--amber-gl)':'var(--forest-gl)',color:c.expiresIn<=1?'var(--red)':c.expiresIn<=2?'#7A4510':'var(--forest)'}}>
              {c.expiresIn===1?'Expires tomorrow':c.expiresIn+' days left'}
            </div>
          </div>
          <div style={{background:c.expiresIn<=1?'var(--red-gl)':c.expiresIn<=2?'var(--amber-gl)':'var(--forest-gl)',borderRadius:'var(--r-sm)',padding:'10px 13px',marginBottom:10}}>
            <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--ink)',marginBottom:3}}>🔓 {c.ll}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'var(--forest)',letterSpacing:'-0.02em'}}>{c.phone}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <a href={"tel:"+c.phone.replace(/\s/g,'')} className="btn btn-forest btn-sm">📞 Call</a>
            <a href={"https://wa.me/256"+c.phone.replace(/^0/,'').replace(/\s/g,'')} target="_blank" rel="noreferrer" className="btn btn-wa btn-sm">💬 WhatsApp</a>
            {c.expiresIn<=2&&<button className="btn btn-sm btn-outline" onClick={()=>showToast('Pay UGX 5,000 to renew 7-day access')}>🔄 Renew</button>}
          </div>
        </div>
      ))}
    </div>
  )
}

// Referral tab with platform structure
function ReferralTab({ showToast }) {
  const link = 'homeyo.ug/ref/ref'+Math.random().toString(36).slice(2,8)
  return (
    <div>
      <div style={{background:'var(--forest)',borderRadius:'var(--r-xl)',padding:20,marginBottom:18,color:'#fff'}}>
        <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8}}>Referral commission structure</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:12}}>
          {[{ico:'💳',lbl:'Viewing fee',val:'UGX 5,000',sub:'Paid by tenant'},{ico:'💸',lbl:'You earn',val:'UGX 2,000',sub:'40% of fee'},{ico:'🏦',lbl:'Platform',val:'UGX 3,000',sub:'60% retained'}].map((k,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,.08)',borderRadius:'var(--r-md)',padding:12,textAlign:'center',border:'1px solid rgba(255,255,255,.1)'}}>
              <div style={{fontSize:'1.1rem',marginBottom:4}}>{k.ico}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'1rem',fontWeight:700,color:'var(--gold-lt)'}}>{k.val}</div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',marginTop:2}}>{k.lbl}</div>
              <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,.3)',marginTop:1}}>{k.sub}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,.5)',lineHeight:1.6,borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:10}}>
          Minimum withdrawal: <strong style={{color:'var(--gold-lt)'}}>UGX 20,000</strong> via MTN/Airtel MoMo · No cap · Paid instantly per confirmed viewing
        </div>
      </div>
      <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:17,marginBottom:14}}>
        <div style={{fontSize:'10px',fontWeight:700,color:'var(--muted)',letterSpacing:'.09em',textTransform:'uppercase',marginBottom:6}}>Your referral link</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'0.85rem',fontWeight:700,color:'var(--forest)',wordBreak:'break-all',marginBottom:10}}>{link}</div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-forest btn-sm" onClick={()=>{navigator.clipboard?.writeText(link);showToast('Link copied!','success')}}>Copy link</button>
          <button className="btn btn-outline btn-sm" onClick={()=>window.open('https://wa.me/?text=Find a home in Uganda '+link)}>Share WhatsApp</button>
        </div>
      </div>
      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
        {[{ico:'👥',v:'2',l:'Total referrals'},{ico:'💰',v:'UGX 4,000',l:'Earned'},{ico:'⏳',v:'UGX 16,000',l:'Until min withdrawal'},{ico:'📤',v:'UGX 0',l:'Withdrawn'}].map((k,i)=>(
          <div key={i} className="kpi-card"><div className="kpi-icon">{k.ico}</div><div className="kpi-value" style={{fontSize:'1.1rem'}}>{k.v}</div><div className="kpi-label">{k.l}</div></div>
        ))}
      </div>
    </div>
  )
}

// Enquiries with reply & phone detection
function EnquiriesTab({ showToast }) {
  const [replyEnq, setReplyEnq] = useState(null)
  const enquiries = [
    {id:1,from:'Brian M.',property:'Bukoto Studio',message:'I am very interested in viewing this weekend. Is it still available?',date:'Today',unread:true},
    {id:2,from:'Ruth K.',property:'Naguru 2BR',message:'Is the price negotiable? I can pay 3 months upfront.',date:'Yesterday',unread:true},
    {id:3,from:'Denis O.',property:'Kisaasi Room',message:'When is the earliest I can come for a viewing?',date:'2d ago',unread:false},
  ]
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)'}}>Enquiries</div>
        <span style={{fontSize:'9px',fontWeight:700,padding:'3px 9px',borderRadius:'var(--r-full)',background:'var(--red-gl)',color:'var(--red)'}}>{enquiries.filter(e=>e.unread).length} unread</span>
      </div>
      {enquiries.map(e=>(
        <div key={e.id} style={{background:'#fff',borderRadius:'var(--r-lg)',border:`1.5px solid ${e.unread?'var(--forest)':'var(--border)'}`,padding:'13px 16px',marginBottom:10,cursor:'pointer'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:5}}>
            <div>
              <div style={{fontWeight:700,color:'var(--ink)',fontSize:'0.88rem'}}>{e.from}{e.unread&&<span style={{width:7,height:7,borderRadius:'50%',background:'var(--forest)',display:'inline-block',marginLeft:7,verticalAlign:'middle'}}/>}</div>
              <div style={{fontSize:'0.72rem',color:'var(--muted)',marginTop:1}}>Re: {e.property}</div>
            </div>
            <div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{e.date}</div>
          </div>
          <p style={{fontSize:'0.78rem',color:'var(--ink-lt)',lineHeight:1.55,marginBottom:10}}>{e.message}</p>
          <button className="btn btn-forest btn-sm" onClick={()=>setReplyEnq(e)}>Reply</button>
        </div>
      ))}
      <EnquiryReplyModal enquiry={replyEnq} open={!!replyEnq} onClose={()=>setReplyEnq(null)} showToast={showToast}/>
    </div>
  )
}

// Earnings with chart
function EarningsTab({ showToast }) {
  const data = [{m:6,v:45000},{m:7,v:78000},{m:8,v:52000},{m:9,v:120000},{m:10,v:95000},{m:11,v:156000},{m:0,v:140000}]
  return (
    <div>
      <RevenueChart data={data}/>
      <div className="kpi-grid">
        {[{ico:'💰',val:'UGX 285K',lbl:'Earned this month',bar:57,trend:'↑ 18% vs last',up:true},{ico:'✅',val:'21',lbl:'Jobs completed',bar:70,trend:'↑ 3 this month',up:true},{ico:'🧾',val:'UGX 22.8K',lbl:'Commission paid',bar:8,trend:'8% of earnings',up:false},{ico:'📤',val:'UGX 0',lbl:'To withdraw',bar:0,trend:'Min UGX 50K',up:false}].map((k,i)=>(
          <div key={i} className="kpi-card"><div className="kpi-icon">{k.ico}</div><div className="kpi-value" style={{fontSize:'1.1rem'}}>{k.val}</div><div className="kpi-label">{k.lbl}</div><div className="kpi-bar"><div className="kpi-bar-fill" style={{width:k.bar+'%'}}/></div><div className={"kpi-trend "+(k.up?'up':'dn')}>{k.trend}</div></div>
        ))}
      </div>
      <div style={{background:'var(--forest-gl)',borderRadius:'var(--r-md)',padding:12,fontSize:'0.8rem',color:'var(--forest)'}}>Min withdrawal: <strong>UGX 50,000</strong> via MoMo. Processing within 24 hours.</div>
      <button className="btn btn-forest btn-sm" style={{marginTop:10}} onClick={()=>showToast('Payout request sent','success')}>Request payout</button>
    </div>
  )
}

// Previous providers with profile preview (no contact)
function PreviousProvidersTab({ showToast }) {
  const [viewProfile, setViewProfile] = useState(null)
  const providers = [
    {id:'P1',name:'Aisha Nakato',type:'Laundry',area:'Kisaasi',rating:4.9,reviews:47,lastJob:'Dec 2024',price:'UGX 8,000/kg',verified:true,bio:'Professional laundry, same-day turnaround. Free pickup within 2km.'},
    {id:'P3',name:'Grace Clean Pro',type:'Cleaners',area:'Makerere',rating:4.8,reviews:62,lastJob:'Nov 2024',price:'UGX 25,000/room',verified:true,bio:'Deep cleaning specialists. Eco-friendly. Move-in/out specialists.'},
  ]
  return (
    <div>
      <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)',marginBottom:14}}>Previous service providers</div>
      {providers.map(p=>(
        <div key={p.id} style={{background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:'14px 16px',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:10}}>
            <div style={{width:44,height:44,borderRadius:'50%',background:'var(--forest-gl)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.1rem',flexShrink:0,color:'var(--forest)'}}>{p.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:'var(--ink)',marginBottom:2}}>{p.name}</div>
              <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>{p.type} · {p.area} · Last: {p.lastJob}</div>
              <div style={{display:'flex',gap:2,marginTop:3}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:10,color:s<=p.rating?'var(--gold)':'var(--border)'}}>★</span>)}<span style={{fontSize:10,color:'var(--muted)',marginLeft:4}}>{p.rating} ({p.reviews})</span></div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{fontWeight:700,color:'var(--forest)',fontSize:'0.85rem'}}>{p.price}</div>
              {p.verified&&<div style={{fontSize:'9px',color:'var(--forest)',fontWeight:700,marginTop:2}}>✓ Verified</div>}
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-forest btn-sm" onClick={()=>showToast('Pay to unlock '+p.name+' contact')}>Book again</button>
            <button className="btn btn-outline btn-sm" onClick={()=>setViewProfile(p)}>View profile</button>
          </div>
        </div>
      ))}
      {viewProfile&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
          onClick={e=>e.target===e.currentTarget&&setViewProfile(null)}>
          <div style={{background:'#fff',width:'100%',maxWidth:500,borderRadius:'var(--r-2xl) var(--r-2xl) 0 0',padding:24,boxShadow:'var(--sh-xl)'}}>
            <div style={{width:40,height:4,background:'var(--border)',borderRadius:2,margin:'-14px auto 16px'}}/>
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'var(--forest-gl)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.4rem',color:'var(--forest)',flexShrink:0}}>{viewProfile.name[0]}</div>
              <div>
                <div style={{fontWeight:800,fontSize:'1rem',color:'var(--ink)'}}>{viewProfile.name}{viewProfile.verified&&<span style={{fontSize:'9px',background:'var(--forest)',color:'#fff',borderRadius:'var(--r-full)',padding:'2px 7px',marginLeft:6,fontWeight:700}}>✓</span>}</div>
                <div style={{fontSize:'0.75rem',color:'var(--muted)',marginTop:2}}>{viewProfile.type} · {viewProfile.area}</div>
                <div style={{display:'flex',gap:2,marginTop:3}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:11,color:s<=viewProfile.rating?'var(--gold)':'var(--border)'}}>★</span>)}<span style={{fontSize:10,color:'var(--muted)',marginLeft:4}}>{viewProfile.rating} ({viewProfile.reviews})</span></div>
              </div>
            </div>
            <div style={{background:'var(--surface)',borderRadius:'var(--r-md)',padding:12,marginBottom:14,fontSize:'0.82rem',color:'var(--ink)',lineHeight:1.65}}>{viewProfile.bio}</div>
            <div style={{background:'var(--forest)',borderRadius:'var(--r-md)',padding:'11px 14px',marginBottom:14,display:'flex',gap:10,alignItems:'center'}}>
              <div style={{fontSize:'1rem'}}>🔒</div>
              <div><div style={{fontSize:'0.82rem',fontWeight:700,color:'#fff'}}>Contact details locked</div><div style={{fontSize:'0.72rem',color:'rgba(255,255,255,.55)'}}>Pay to book and unlock this provider's contact</div></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <button className="btn btn-outline" onClick={()=>setViewProfile(null)}>Close</button>
              <button className="btn btn-forest" onClick={()=>{setViewProfile(null);showToast('Pay to unlock contact...')}}>Pay to book</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Nav config
const NAV_BY_ROLE = {
  client:[
    {section:'My Account',items:[{id:'overview',icon:'🏠',label:'Overview'},{id:'bookings',icon:'📅',label:'My bookings',badge:2},{id:'saved',icon:'❤️',label:'Saved properties'},{id:'unlocked',icon:'🔓',label:'Unlocked contacts',badge:3},{id:'referrals',icon:'🔗',label:'Referral earnings',badge:'4K',badgeType:'gold'}]},
    {section:'Activity',items:[{id:'history',icon:'🕑',label:'Payment history'},{id:'providers',icon:'🔧',label:'Previous providers'},{id:'confirmed',icon:'✅',label:'Confirmed rentals'}]},
    {section:'Settings',items:[{id:'profile',icon:'👤',label:'My profile'},{id:'settings',icon:'⚙️',label:'Account settings'}]},
  ],
  landlord:[
    {section:'Properties',items:[{id:'overview',icon:'📊',label:'Overview'},{id:'listings',icon:'🏘️',label:'My listings'},{id:'addlisting',icon:'➕',label:'Add property'},{id:'agents',icon:'🤝',label:'Assigned agents',badge:1}]},
    {section:'Tenants',items:[{id:'enquiries',icon:'📩',label:'Enquiries',badge:3},{id:'tenants',icon:'👥',label:'Current tenants'},{id:'confirmed',icon:'✅',label:'Confirmed rentals'}]},
    {section:'Finance',items:[{id:'payments',icon:'💰',label:'Payments'},{id:'commissions',icon:'📊',label:'Commission tracker'},{id:'referrals',icon:'🔗',label:'Referral earnings'}]},
    {section:'Settings',items:[{id:'profile',icon:'👤',label:'My profile'},{id:'settings',icon:'⚙️',label:'Account settings'}]},
  ],
  provider:[
    {section:'My work',items:[{id:'overview',icon:'📊',label:'Overview'},{id:'available-jobs',icon:'🔍',label:'Nearby jobs',badge:6},{id:'active-jobs',icon:'🚀',label:'Active jobs',badge:2},{id:'completed-jobs',icon:'✅',label:'Completed jobs'}]},
    {section:'Profile & pricing',items:[{id:'offerings',icon:'🔧',label:'My services & prices'},{id:'reviews',icon:'⭐',label:'Reviews & ratings'}]},
    {section:'Finance',items:[{id:'earnings',icon:'💰',label:'Earnings & revenue'},{id:'commissions',icon:'🧾',label:'Commission history'},{id:'referrals',icon:'🔗',label:'Referral earnings'}]},
    {section:'Settings',items:[{id:'profile',icon:'👤',label:'My profile'},{id:'settings',icon:'⚙️',label:'Settings'}]},
  ],
  agent:[
    {section:'Portfolio',items:[{id:'overview',icon:'📊',label:'Overview'},{id:'listings',icon:'🏘️',label:'Managed listings',badge:4},{id:'enquiries',icon:'📩',label:'Enquiries',badge:5},{id:'tenants',icon:'👥',label:'Active tenants'}]},
    {section:'Finance',items:[{id:'commissions',icon:'💰',label:'Commission earnings'},{id:'landlords',icon:'🏗️',label:'My landlords',badge:2},{id:'referrals',icon:'🔗',label:'Referral earnings'}]},
    {section:'Settings',items:[{id:'profile',icon:'👤',label:'My profile'},{id:'settings',icon:'⚙️',label:'Settings'}]},
  ],
}

function Sidebar({ role, active, setActive }) {
  const { signOut } = useAuth()
  const nav = useNavigate()
  const items = NAV_BY_ROLE[role]||NAV_BY_ROLE.client
  return (
    <aside style={{width:240,background:'var(--forest)',minHeight:'100vh',display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto',scrollbarWidth:'none'}}>
      <div style={{padding:'18px 14px 14px',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,background:'var(--gold)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:700,color:'#fff',letterSpacing:'-0.02em'}}>Homeyo</div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,.3)',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase'}}>{(role||'client').toUpperCase()}</div>
          </div>
        </div>
      </div>
      <div style={{padding:'10px 8px',flex:1,overflowY:'auto'}}>
        {items.map(section=>(
          <div key={section.section}>
            <div style={{fontSize:'9px',fontWeight:700,color:'rgba(255,255,255,.28)',letterSpacing:'.12em',textTransform:'uppercase',padding:'10px 10px 4px'}}>{section.section}</div>
            {section.items.map(item=>(
              <button key={item.id} onClick={()=>setActive(item.id)}
                style={{display:'flex',alignItems:'center',gap:9,padding:'9px 10px',borderRadius:'var(--r-sm)',cursor:'pointer',width:'100%',textAlign:'left',border:'none',background:active===item.id?'rgba(201,168,76,.18)':'none',borderLeft:`3px solid ${active===item.id?'var(--gold)':'transparent'}`,marginBottom:1,transition:'all .15s',fontFamily:'var(--font-body)',minHeight:40}}>
                <span style={{fontSize:15,width:20,textAlign:'center',flexShrink:0}}>{item.icon}</span>
                <span style={{fontSize:'0.8rem',fontWeight:active===item.id?700:500,color:active===item.id?'var(--gold-lt)':'rgba(255,255,255,.55)',flex:1}}>{item.label}</span>
                {item.badge&&<span style={{background:item.badgeType==='gold'?'var(--gold)':'var(--red)',color:item.badgeType==='gold'?'var(--ink)':'#fff',fontSize:'9px',fontWeight:800,padding:'2px 6px',borderRadius:'var(--r-full)',minWidth:18,textAlign:'center'}}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{padding:'10px 8px',borderTop:'1px solid rgba(255,255,255,.07)'}}>
        <button onClick={()=>nav('/')} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 10px',width:'100%',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)'}}>
          <span style={{fontSize:15}}>🌐</span><span style={{fontSize:'0.8rem',color:'rgba(255,255,255,.45)'}}>Back to site</span>
        </button>
        <button onClick={()=>signOut(nav)} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 10px',width:'100%',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)'}}>
          <span style={{fontSize:15}}>🚪</span><span style={{fontSize:'0.8rem',color:'rgba(197,48,48,.75)'}}>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

function KPIRow({ role }) {
  const map = {
    client:[{ico:'📅',val:'2',lbl:'Viewings booked',bar:40,trend:'↑ 1 this month',up:true},{ico:'🔓',val:'3',lbl:'Unlocked contacts',bar:60,trend:'1 expiring soon',up:false},{ico:'🔗',val:'UGX 4K',lbl:'Referral earnings',bar:20,trend:'2 referrals',up:true},{ico:'✅',val:'1',lbl:'Active rental',bar:100,trend:'Confirmed',up:true}],
    landlord:[{ico:'🏘️',val:'6',lbl:'Listings',bar:75,trend:'↑ 2 this month',up:true},{ico:'📩',val:'3',lbl:'New enquiries',bar:30,trend:'Needs action',up:false},{ico:'💰',val:'UGX 3.4M',lbl:'Monthly revenue',bar:68,trend:'↑ 12%',up:true},{ico:'👥',val:'8',lbl:'Tenants',bar:80,trend:'All paying',up:true}],
    provider:[{ico:'🔍',val:'6',lbl:'Available jobs',bar:60,trend:'In your area',up:true},{ico:'🚀',val:'2',lbl:'Active jobs',bar:20,trend:'In progress',up:true},{ico:'💰',val:'UGX 285K',lbl:'Earnings MTD',bar:57,trend:'↑ 18%',up:true},{ico:'⭐',val:'4.8',lbl:'Your rating',bar:96,trend:'47 reviews',up:true}],
    agent:[{ico:'🏘️',val:'4',lbl:'Managed listings',bar:40,trend:'2 active',up:true},{ico:'📩',val:'5',lbl:'New enquiries',bar:50,trend:'3 urgent',up:false},{ico:'💰',val:'UGX 1.2M',lbl:'Commission MTD',bar:48,trend:'↑ 8%',up:true},{ico:'👥',val:'6',lbl:'Active tenants',bar:60,trend:'All confirmed',up:true}],
  }
  const kpis = map[role]||map.client
  return (
    <div className="kpi-grid">
      {kpis.map((k,i)=>(
        <div key={i} className="kpi-card">
          <div className="kpi-icon">{k.ico}</div>
          <div className="kpi-value">{k.val}</div>
          <div className="kpi-label">{k.lbl}</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{width:k.bar+'%'}}/></div>
          <div className={"kpi-trend "+(k.up?'up':'dn')}>{k.trend}</div>
        </div>
      ))}
    </div>
  )
}

function OverviewTab({ role, setActive, showToast }) {
  const revenueData = [{m:6,v:180000},{m:7,v:240000},{m:8,v:195000},{m:9,v:310000},{m:10,v:275000},{m:11,v:420000},{m:0,v:385000}]
  return (
    <div>
      <KPIRow role={role}/>
      {(role==='landlord'||role==='provider'||role==='agent')&&<RevenueChart data={revenueData}/>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={{background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',overflow:'hidden'}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',fontWeight:700,color:'var(--ink)',fontSize:'0.88rem'}}>Recent activity</div>
          {['Viewing booked: Kisaasi room','Referral: UGX 2,000 received','Provider booked: Aisha Nakato','Profile updated'].map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',borderBottom:i<3?'1px solid var(--surface)':''}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'var(--gold)',flexShrink:0}}/>
              <span style={{fontSize:'0.78rem',color:'var(--ink-lt)'}}>{a}</span>
            </div>
          ))}
        </div>
        <div style={{background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:16}}>
          <div style={{fontWeight:700,color:'var(--ink)',marginBottom:12,fontSize:'0.88rem'}}>Quick actions</div>
          {(role==='client'?[['🔍','Browse properties',()=>window.location.href='/'],['🔓','Unlocked contacts',()=>setActive('unlocked')],['🔧','Book a service',()=>window.location.href='/'],['🔗','Share referral',()=>setActive('referrals')]]:
           role==='provider'?[['🔍','Browse nearby jobs',()=>setActive('available-jobs')],['✏️','Update my services',()=>setActive('offerings')],['💰','View earnings',()=>setActive('earnings')]]:
           [['➕','Add new listing',()=>setActive('listings')],['📩','View enquiries',()=>setActive('enquiries')],['🤝','Assign agent',()=>setActive('agents')]]).map(([ico,lbl,action])=>(
            <button key={lbl} onClick={action} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',width:'100%',background:'none',border:'none',borderBottom:'1px solid var(--surface)',cursor:'pointer',textAlign:'left',fontFamily:'var(--font-body)'}}>
              <div style={{width:32,height:32,background:'var(--forest-gl)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.95rem',flexShrink:0}}>{ico}</div>
              <div style={{fontSize:'0.82rem',fontWeight:600,color:'var(--ink)',flex:1}}>{lbl}</div>
              <div style={{color:'var(--muted)',fontSize:16}}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, showToast } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('overview')

  if (!user) { navigate('/'); return null }

  const role = user.role || 'client'
  const titles = {
    overview:'Overview',bookings:'My bookings',saved:'Saved properties',unlocked:'Unlocked contacts',
    referrals:'Referral earnings',history:'Payment history',providers:'Previous providers',confirmed:'Confirmed rentals',
    profile:'My profile',settings:'Account settings',listings:'My listings',addlisting:'Add listing',
    agents:'Assigned agents',enquiries:'Enquiries',tenants:'Current tenants',payments:'Payments',
    commissions:'Commission tracker','available-jobs':'Jobs near you','active-jobs':'Active jobs',
    'completed-jobs':'Completed jobs',earnings:'Earnings & revenue',offerings:'My services & prices',
    reviews:'Reviews & ratings',landlords:'My landlords',
  }

  const render = () => {
    if (active==='overview')       return <OverviewTab role={role} setActive={setActive} showToast={showToast}/>
    if (active==='listings'||active==='addlisting') return <ListingsTab showToast={showToast}/>
    if (active==='enquiries')      return <EnquiriesTab showToast={showToast}/>
    if (active==='providers')      return <PreviousProvidersTab showToast={showToast}/>
    if (active==='referrals')      return <ReferralTab showToast={showToast}/>
    if (active==='unlocked')       return <UnlockedContactsTab showToast={showToast}/>
    if (active==='earnings')       return <EarningsTab showToast={showToast}/>
    if (active==='available-jobs') return <ProviderJobsTab type="available" showToast={showToast}/>
    if (active==='active-jobs')    return <ProviderJobsTab type="active" showToast={showToast}/>
    if (active==='completed-jobs') return <ProviderJobsTab type="completed" showToast={showToast}/>
    if (active==='offerings')      return <ProviderJobsTab type="available" showToast={showToast}/>
    if (active==='reviews')        return (
      <div>
        {[{n:'Aisha K.',r:4.9,t:'Excellent service.'},{n:'Brian M.',r:4.7,t:'Quick and careful.'},{n:'Ruth O.',r:5.0,t:'Best on Homeyo.'}].map((rv,i)=>(
          <div key={i} style={{background:'#fff',borderRadius:'var(--r-lg)',border:'1px solid var(--border)',padding:'12px 15px',marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><strong style={{fontSize:'0.85rem'}}>{rv.n}</strong><div style={{display:'flex',gap:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:11,color:s<=rv.r?'var(--gold)':'var(--border)'}}>★</span>)}</div></div>
            <p style={{fontSize:'0.78rem',color:'var(--muted)'}}>{rv.t}</p>
          </div>
        ))}
      </div>
    )
    if (active==='bookings') return (
      <div className="table-wrap"><table>
        <thead><tr><th>Property</th><th>Date</th><th>Fee paid</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td><strong>Bright Double Room</strong><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Kisaasi</div></td><td>2 Jan 2025</td><td>UGX 5,000</td><td><span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--forest-gl)',color:'var(--forest)'}}>Confirmed</span></td></tr>
          <tr><td><strong>Modern Bedsitter</strong><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Makerere</div></td><td>5 Jan 2025</td><td>UGX 5,000</td><td><span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--amber-gl)',color:'#7A4510'}}>Pending</span></td></tr>
        </tbody>
      </table></div>
    )
    if (active==='confirmed') return (
      <div>
        <div style={{background:'var(--blue-gl)',borderRadius:'var(--r-md)',padding:'10px 13px',marginBottom:14,fontSize:'0.8rem',color:'var(--blue)',borderLeft:'3px solid var(--blue)'}}>Confirming your rental ensures commission is tracked correctly.</div>
        <div className="table-wrap"><div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:700,color:'var(--ink)'}}>Confirmed rentals</div><button className="btn btn-forest btn-sm" onClick={()=>showToast('Report new rental')}>+ Confirm rental</button></div>
        <table><thead><tr><th>Property</th><th>Rent/month</th><th>Start</th><th>Status</th></tr></thead>
        <tbody><tr><td><strong>Bright Double Room</strong></td><td>UGX 350,000</td><td>Jan 2025</td><td><span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--forest-gl)',color:'var(--forest)'}}>Active</span></td></tr></tbody>
        </table></div>
      </div>
    )
    if (active==='agents') return (
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)'}}>Assigned agents</div>
          <button className="btn btn-forest btn-sm" onClick={()=>showToast('Opening agent assignment form...')}>+ Assign agent</button>
        </div>
        <div className="table-wrap"><table>
          <thead><tr><th>Agent</th><th>Area</th><th>Listings</th><th>Rating</th><th>Action</th></tr></thead>
          <tbody><tr><td><strong>James K.</strong><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Verified agent</div></td><td>Kisaasi</td><td>2</td><td>⭐ 4.8</td>
          <td><div style={{display:'flex',gap:6}}><button className="btn btn-sm btn-outline" onClick={()=>showToast('Viewing agent profile')}>Profile</button><button className="btn btn-sm btn-red" onClick={()=>showToast('Agent removed')}>Remove</button></div></td></tr></tbody>
        </table></div>
      </div>
    )
    if (active==='commissions') return (
      <div className="table-wrap"><div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',fontWeight:700,color:'var(--ink)'}}>Commission tracker</div>
      <table><thead><tr><th>Tenant</th><th>Property</th><th>Rent</th><th>Commission</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td><strong>Aisha N.</strong></td><td>Bright Double Room</td><td>UGX 350K</td><td>UGX 28K (8%)</td><td><span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--forest-gl)',color:'var(--forest)'}}>Paid</span></td></tr>
        <tr><td><strong>Brian M.</strong></td><td>Modern Bedsitter</td><td>UGX 240K</td><td>UGX 19.2K (8%)</td><td><span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--amber-gl)',color:'#7A4510'}}>Pending</span></td></tr>
      </tbody></table></div>
    )
    if (active==='tenants') return (
      <div className="table-wrap"><div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',fontWeight:700,color:'var(--ink)'}}>Current tenants</div>
      <table><thead><tr><th>Tenant</th><th>Property</th><th>Rent</th><th>Status</th></tr></thead>
      <tbody><tr><td><strong>Aisha Nakato</strong><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>0712 345 678</div></td><td>Bright Double Room</td><td>UGX 350,000</td><td><span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'var(--r-full)',background:'var(--forest-gl)',color:'var(--forest)'}}>Active</span></td></tr></tbody>
      </table></div>
    )
    if (active==='profile') return (
      <div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)',marginBottom:14}}>My profile</div>
        <div className="field"><div className="field-label">Display name</div><input className="input" defaultValue={user.name||''}/></div>
        {role==='provider'&&<><div className="field"><div className="field-label">Bio / description</div><textarea className="input" rows={3} placeholder="Describe your services..."/></div><div className="field"><div className="field-label">Service areas</div><input className="input" placeholder="e.g. Kisaasi, Ntinda"/></div><div className="field"><div className="field-label">Base rate (UGX)</div><input className="input" type="number" placeholder="e.g. 35000"/></div></>}
        <button className="btn btn-forest" onClick={()=>showToast('Profile saved!','success')}>Save changes</button>
      </div>
    )
    if (active==='settings') return (
      <div>
        <div style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:700,color:'var(--ink)',marginBottom:14}}>Account settings</div>
        <div className="field"><div className="field-label">Email</div><input className="input" type="email" defaultValue={user.email||''}/></div>
        <div className="field"><div className="field-label">Phone</div><input className="input" type="tel" placeholder="0771 234 567"/></div>
        <div className="field"><div className="field-label">Primary MoMo number (for payments)</div><input className="input" type="tel" placeholder="0771 234 567"/></div>
        <button className="btn btn-forest" style={{marginBottom:14}} onClick={()=>showToast('Settings saved!','success')}>Save changes</button>
        <div style={{borderTop:'1px solid var(--border)',paddingTop:18}}><div style={{fontSize:'0.85rem',fontWeight:700,color:'var(--red)',marginBottom:8}}>Danger zone</div><button className="btn btn-red btn-sm" onClick={()=>showToast('Deletion request sent. Admin will contact you.')}>Delete account</button></div>
      </div>
    )
    return <div style={{background:'var(--surface)',borderRadius:'var(--r-lg)',padding:22,textAlign:'center',color:'var(--muted)',fontSize:'0.85rem'}}>Connect backend API to populate this section.</div>
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--surface)'}}>
      <Sidebar role={role} active={active} setActive={setActive}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <div style={{background:'#fff',borderBottom:'1px solid var(--border)',padding:'0 22px',height:58,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10,boxShadow:'var(--sh-xs)',flexShrink:0}}>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:700,color:'var(--ink)',letterSpacing:'-0.02em'}}>{titles[active]||'Dashboard'}</div>
            <div style={{fontSize:'0.68rem',color:'var(--muted)',marginTop:1}}>{user.name} · {role.charAt(0).toUpperCase()+role.slice(1)}</div>
          </div>
          <div style={{width:32,height:32,borderRadius:'50%',background:'var(--gold)',color:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,border:'2px solid var(--gold-lt)',cursor:'pointer'}}>
            {user.name?.[0]?.toUpperCase()||'U'}
          </div>
        </div>
        <div style={{padding:22,flex:1,overflowY:'auto'}}>{render()}</div>
      </div>
    </div>
  )
}
