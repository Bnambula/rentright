import { useState } from 'react'
import { HOSTELS } from '../data/index.js'
import { useAuth } from '../hooks/useAuth.jsx'
import Modal from '../components/Modal.jsx'

function WardenPortal({ onClose }) {
  const [tab, setTab] = useState('overview')
  const totalRooms = HOSTELS.reduce((a,h)=>a+h.rooms.length,0)
  const booked = HOSTELS.reduce((a,h)=>a+h.rooms.filter(r=>r.status==='Booked').length,0)

  return (
    <Modal open onClose={onClose} title="Warden Portal" sub="Manage rooms, bookings and students" size="modal-lg">
      <div className="tabs" style={{ margin:'0 -22px 20px' }}>
        {['Overview','Bookings','Rooms','Students'].map(t=>(
          <button key={t} className={`tab-btn${tab===t.toLowerCase()?' active':''}`} onClick={()=>setTab(t.toLowerCase())}>{t}</button>
        ))}
      </div>
      {tab==='overview'&&<>
        <div className="kpi-grid">
          {[['🏠',totalRooms,'Total rooms'],['✅',totalRooms-booked,'Available'],['🔒',booked,'Booked'],['⏳',3,'Pending payment']].map(([i,v,l],k)=>(
            <div key={k} className="kpi-card"><div className="kpi-icon">{i}</div><div className="kpi-value">{v}</div><div className="kpi-label">{l}</div></div>
          ))}
        </div>
        <div className="note note-amber">3 students have paid booking fees at Stanbic Bank. Awaiting warden confirmation of payment.</div>
        <div className="note note-forest">Next semester bookings are now open. {totalRooms-booked} rooms available.</div>
      </>}
      {tab==='bookings'&&<div className="table-wrap"><table>
        <thead><tr><th>Reference</th><th>Student</th><th>Room</th><th>Booking fee</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {[['HST-H1-A102-XK7P','Aisha Nakato (24/U/1234)','Room A102 — Single','UGX 80,000','Confirmed'],
            ['HST-H2-R102-YM3Q','Brian Mukasa (23/U/5678)','Room R102 — Single','UGX 80,000','Pending payment'],
            ['HST-H1-B201-ZN9R','Grace Nambi (25/U/9012)','Room B201 — Double','UGX 80,000','Confirmed']].map((r,i)=>(
            <tr key={i}>
              <td style={{fontFamily:'monospace',fontSize:'0.75rem',fontWeight:800}}>{r[0]}</td>
              <td><strong style={{fontSize:'0.78rem'}}>{r[1]}</strong></td>
              <td style={{fontSize:'0.75rem',color:'var(--muted)'}}>{r[2]}</td>
              <td style={{fontWeight:700}}>{r[3]}</td>
              <td><span className={`badge ${r[4]==='Confirmed'?'badge-green':'badge-amber'}`}>{r[4]}</span></td>
              <td>{r[4]==='Pending payment'&&<button className="btn btn-sm btn-forest">Confirm payment</button>}</td>
            </tr>
          ))}
        </tbody>
      </table></div>}
      {tab==='rooms'&&<div>
        {HOSTELS.map(h=>(
          <div key={h.id}>
            <div style={{fontSize:'0.78rem',fontWeight:700,color:'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase',margin:'12px 0 6px'}}>{h.name}</div>
            {h.rooms.map(r=>(
              <div key={r.num} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:'var(--white)',borderRadius:'var(--r-sm)',border:'1px solid var(--bd)',marginBottom:5}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:r.status==='Available'?'var(--g)':'var(--rd)',flexShrink:0}}/>
                <div style={{flex:1}}>
                  <span style={{fontSize:'0.82rem',fontWeight:700,color:'var(--dk)'}}>Room {r.num}</span>
                  <span style={{fontSize:'0.7rem',color:'var(--muted)',marginLeft:8}}>{r.type} ({r.sharing}) — {r.sem} — UGX {r.price.toLocaleString()}/sem</span>
                </div>
                <span style={{fontSize:'0.72rem',fontWeight:700,color:r.status==='Available'?'var(--g)':'var(--muted)'}}>{r.status}</span>
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-forest btn-sm mt-3">+ Add room</button>
      </div>}
      {tab==='students'&&<div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Student ID</th><th>University</th><th>Room</th><th>NOK Contact</th><th>Status</th></tr></thead>
        <tbody>
          {[['Aisha Nakato','24/U/1234','Makerere','A102','Grace Nakato (mother) 0701234567','Resident'],
            ['Grace Nambi','25/U/9012','Makerere','B201','Peter Nambi (father) 0756789012','Resident']].map((s,i)=>(
            <tr key={i}><td><strong>{s[0]}</strong></td><td style={{fontFamily:'monospace',fontSize:'0.75rem'}}>{s[1]}</td><td>{s[2]}</td><td>{s[3]}</td><td style={{fontSize:'0.72rem',color:'var(--muted)'}}>{s[4]}</td><td><span className="badge badge-green">{s[5]}</span></td></tr>
          ))}
        </tbody>
      </table></div>}
    </Modal>
  )
}

function BookingModal({ hostel, room, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [refGenerated, setRefGenerated] = useState(false)
  const { showToast } = useAuth()
  const ref = `HST-${hostel.id}-${room.num}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
  const f = k => e => setFormData(p=>({...p,[k]:e.target.value}))

  const generate = () => {
    if(!formData.name||!formData.sid||!formData.ph||!formData.nok) return showToast('Please fill all required fields','error')
    setRefGenerated(true)
    showToast(`Reference ${ref} generated! Pay UGX 80,000 at Stanbic Bank.`,'success')
  }

  return (
    <Modal open onClose={onClose} title={`Book Room ${room.num}`} sub={`${hostel.name} — ${room.type} (${room.sharing})`}>
      <div style={{background:'var(--off)',borderRadius:'var(--r-md)',padding:13,marginBottom:14,border:'1px solid var(--bd)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:'0.75rem',color:'var(--muted)'}}>
          <div>Floor: <strong style={{color:'var(--dk)'}}>{room.floor}</strong></div>
          <div>Semester: <strong style={{color:'var(--dk)'}}>{room.sem}</strong></div>
          <div style={{gridColumn:'1/-1'}}>Features: <strong style={{color:'var(--dk)'}}>{room.features.join(', ')}</strong></div>
        </div>
        <div style={{marginTop:8,fontSize:'1rem',fontWeight:900,color:'var(--dk)'}}>UGX {room.price.toLocaleString()}/semester</div>
      </div>
      <div className="field-row">
        <div className="field"><label>Student full name <span className="req">*</span></label><input className="input" value={formData.name||''} onChange={f('name')} placeholder="Full name as on ID" /></div>
        <div className="field"><label>Student ID <span className="req">*</span></label><input className="input" value={formData.sid||''} onChange={f('sid')} placeholder="e.g. 24/U/1234" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>University <span className="req">*</span></label>
          <select className="input select" value={formData.uni||''} onChange={f('uni')}>
            <option>Makerere University</option><option>Kyambogo University</option><option>Uganda Martyrs University</option><option>Nkumba University</option><option>Other</option>
          </select>
        </div>
        <div className="field"><label>Year of study</label>
          <select className="input select" value={formData.yr||''} onChange={f('yr')}>
            {['Year 1','Year 2','Year 3','Year 4','Postgraduate'].map(y=><option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field"><label>Phone <span className="req">*</span></label><input className="input" type="tel" value={formData.ph||''} onChange={f('ph')} placeholder="0771 234 567" /></div>
        <div className="field"><label>Email</label><input className="input" type="email" value={formData.em||''} onChange={f('em')} placeholder="student@email.com" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>Next of kin name <span className="req">*</span></label><input className="input" value={formData.nok||''} onChange={f('nok')} placeholder="Parent or guardian" /></div>
        <div className="field"><label>Next of kin phone <span className="req">*</span></label><input className="input" type="tel" value={formData.nokp||''} onChange={f('nokp')} placeholder="0771 234 567" /></div>
      </div>
      <div className="note note-amber"><strong>Booking fee: UGX 80,000</strong> payable at any Stanbic Bank branch using the reference number below. Room allocated only after warden confirms payment.</div>
      {!refGenerated
        ? <button className="btn btn-forest btn-full" onClick={generate}>Generate Reference Number</button>
        : <>
            <div style={{background:'var(--dk)',borderRadius:'var(--r-lg)',padding:18,textAlign:'center',marginBottom:12}}>
              <div style={{fontSize:'9px',color:'rgba(255,255,255,.4)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6}}>Your booking reference</div>
              <div style={{fontSize:'1.6rem',fontWeight:900,color:'var(--g3)',letterSpacing:'.08em',fontFamily:'monospace'}}>{ref}</div>
              <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,.4)',marginTop:5}}>Valid 48 hours — Pay UGX 80,000 at any Stanbic Bank branch</div>
            </div>
            <div className="note note-forest">
              <strong>Payment instructions:</strong><br/>
              1. Go to any Stanbic Bank branch<br/>
              2. Deposit <strong>UGX 80,000</strong><br/>
              3. Quote reference: <strong>{ref}</strong><br/>
              4. Keep your deposit slip<br/>
              5. Warden confirms within 24 hours<br/>
              6. Room <strong>{room.num}</strong> allocated on confirmation
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <button className="btn btn-outline" onClick={()=>{navigator.clipboard?.writeText(ref);showToast('Reference '+ref+' copied!','success')}}>Copy reference</button>
              <button className="btn btn-wa" onClick={()=>window.open(`https://wa.me/${hostel.phone.replace(/\s/g,'')}?text=Hi Warden. Booking ref: ${ref} for Room ${room.num}. I will pay UGX 80,000 at Stanbic Bank.`)}>WhatsApp warden</button>
            </div>
          </>
      }
    </Modal>
  )
}

export default function HostelPortal() {
  const [wardenOpen, setWardenOpen] = useState(false)
  const [wardenAuthed, setWardenAuthed] = useState(false)
  const [wardenPw, setWardenPw] = useState('')
  const [wardenErr, setWardenErr] = useState('')
  const [booking, setBooking] = useState(null)
  const { showToast } = useAuth()

  const doWardenLogin = () => {
    if (wardenPw === 'warden2025') { setWardenAuthed(true) }
    else { setWardenErr('Wrong password. Try warden2025 for demo.') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--off)' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--g),var(--gd))', padding:'28px 0', textAlign:'center' }}>
        <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,.6)', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Student hostel portal</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.6rem,4vw,2.4rem)', color:'#fff', fontWeight:700, marginBottom:8 }}>Find your ideal hostel room</div>
        <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,.75)', maxWidth:480, margin:'0 auto 20px' }}>Browse rooms, generate a reference number and pay at any Stanbic Bank branch. Room allocated after confirmation.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', padding:'0 16px' }}>
          <a href="/" style={{ padding:'10px 20px', background:'rgba(255,255,255,.15)', color:'#fff', borderRadius:'var(--r-md)', fontSize:13, fontWeight:700, border:'1px solid rgba(255,255,255,.25)' }}>← Main site</a>
          <button onClick={()=>setWardenOpen(true)} style={{ padding:'10px 20px', background:'#fff', color:'var(--g)', borderRadius:'var(--r-md)', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' }}>🔑 Warden login</button>
        </div>
      </div>

      {/* Process steps */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'24px 16px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:28 }}>
          {[['🔍','Browse rooms','Find your preferred room type and semester'],['📄','Generate ref','Fill your details and get a reference number'],['🏦','Pay at bank','Deposit UGX 80,000 at Stanbic Bank with your reference'],['✅','Get allocated','Warden confirms and assigns your room within 24hrs']].map(([i,t,d],k)=>(
            <div key={k} style={{ background:'var(--white)', borderRadius:'var(--r-lg)', padding:16, border:'1px solid var(--bd)', textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:8 }}>{i}</div>
              <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--dk)', marginBottom:4 }}>{t}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)', lineHeight:1.5 }}>{d}</div>
            </div>
          ))}
        </div>

        {HOSTELS.map(h=>{
          const avail = h.rooms.filter(r=>r.status==='Available').length
          return (
            <div key={h.id} style={{ background:'var(--white)', borderRadius:'var(--r-xl)', border:'1px solid var(--bd)', overflow:'hidden', marginBottom:20, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ position:'relative', height:180 }}>
                <img src={h.img} alt={h.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.7))' }}/>
                <div style={{ position:'absolute', bottom:14, left:16, color:'#fff' }}>
                  <div style={{ fontSize:'1rem', fontWeight:800 }}>{h.name}</div>
                  <div style={{ fontSize:'0.75rem', opacity:.8 }}>📍 {h.area} — Near {h.uni}</div>
                </div>
                <div style={{ position:'absolute', top:12, right:12, background:avail>0?'var(--g)':'var(--rd)', color:'#fff', borderRadius:'var(--r-full)', padding:'4px 12px', fontSize:'0.72rem', fontWeight:700 }}>{avail} rooms available</div>
              </div>
              <div style={{ padding:16 }}>
                <div style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:14 }}>Warden: {h.warden} — {h.phone}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
                  {h.rooms.map(r=>{
                    const isAvail = r.status === 'Available'
                    return (
                      <div key={r.num} style={{ border:`1.5px solid ${isAvail?'var(--g2)':'var(--bd)'}`, borderRadius:'var(--r-md)', padding:12, background:isAvail?'var(--gl)':'var(--off)' }}>
                        <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--dk)', marginBottom:2 }}>Room {r.num}</div>
                        <div style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:2 }}>{r.type} — {r.sharing}</div>
                        <div style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:6 }}>{r.sem}</div>
                        <div style={{ fontSize:'0.82rem', fontWeight:800, color:'var(--dk)', marginBottom:8 }}>UGX {r.price.toLocaleString()}/sem</div>
                        {isAvail
                          ? <button className="btn btn-forest btn-sm btn-full" onClick={()=>setBooking({hostel:h,room:r})}>Book this room</button>
                          : <div style={{ padding:'6px 10px', background:'var(--bd)', borderRadius:'var(--r-sm)', fontSize:'10px', fontWeight:700, color:'var(--muted)', textAlign:'center' }}>Booked</div>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Warden login modal */}
      <Modal open={wardenOpen} onClose={()=>{setWardenOpen(false);setWardenAuthed(false);setWardenPw('');setWardenErr('')}} title="Warden portal" sub="Restricted access — hostel wardens only">
        {!wardenAuthed
          ? <>
              {wardenErr && <div className="note note-red">{wardenErr}</div>}
              <div className="field"><label>Warden password</label><input className="input" type="password" value={wardenPw} onChange={e=>setWardenPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doWardenLogin()} placeholder="Hostel warden password" autoFocus /></div>
              <div style={{fontSize:'10px',color:'var(--muted)',marginBottom:14}}>Demo password: warden2025</div>
              <button className="btn btn-forest btn-full" onClick={doWardenLogin}>Sign in to Warden Portal</button>
            </>
          : <WardenPortal onClose={()=>{setWardenOpen(false);setWardenAuthed(false)}} />
        }
      </Modal>

      {/* Booking modal */}
      {booking && <BookingModal hostel={booking.hostel} room={booking.room} onClose={()=>setBooking(null)} />}
    </div>
  )
}
