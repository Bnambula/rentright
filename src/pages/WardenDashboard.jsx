import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { HOSTELS } from '../data/index.js'

const fmt = n => 'UGX ' + Number(n).toLocaleString()

// ── Sidebar nav ─────────────────────────────────────
const NAV = [
  { section:'Overview',   items:[{id:'dashboard',icon:'📊',label:'Dashboard'},{id:'alerts',icon:'🔔',label:'Alerts',badge:3}]},
  { section:'Rooms',      items:[{id:'rooms',icon:'🚪',label:'All rooms'},{id:'bookings',icon:'📋',label:'Bookings',badge:4},{id:'add-room',icon:'➕',label:'Add room'}]},
  { section:'Students',   items:[{id:'students',icon:'🎓',label:'Student register'},{id:'payments',icon:'💰',label:'Payments & confirmations',badge:2},{id:'circulars',icon:'📢',label:'Send circular'},{id:'maintenance',icon:'🔧',label:'Maintenance issues',badge:1}]},
  { section:'Settings',   items:[{id:'settings',icon:'⚙️',label:'Hostel settings'}]},
]

function WardSidebar({ active, setActive, hostel }) {
  const { signOut } = useAuth()
  const nav = useNavigate()
  return (
    <aside style={{ width:240, background:'var(--forest)', minHeight:'100vh', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh', overflowY:'auto' }}>
      {/* Logo */}
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ width:36,height:36,background:'var(--gold)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'#fff', letterSpacing:'-0.02em' }}>Homeyo</div>
            <div style={{ fontSize:'9px', color:'rgba(255,255,255,.35)', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase' }}>Warden Portal</div>
          </div>
        </div>
        {hostel && (
          <div style={{ background:'rgba(255,255,255,.07)', borderRadius:'var(--r-sm)', padding:'8px 10px' }}>
            <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--gold-lt)' }}>{hostel.name}</div>
            <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,.5)', marginTop:2 }}>📍 {hostel.area} · {hostel.uni}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ padding:'10px 8px', flex:1, overflowY:'auto' }}>
        {NAV.map(section => (
          <div key={section.section}>
            <div style={{ fontSize:'9px', fontWeight:700, color:'rgba(255,255,255,.28)', letterSpacing:'.12em', textTransform:'uppercase', padding:'12px 10px 4px' }}>{section.section}</div>
            {section.items.map(item => (
              <button key={item.id}
                onClick={() => setActive(item.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:'var(--r-sm)', cursor:'pointer', width:'100%', textAlign:'left', border:'none', background: active===item.id ? 'rgba(201,168,76,.18)' : 'none', borderLeft: `3px solid ${active===item.id ? 'var(--gold)' : 'transparent'}`, marginBottom:1, transition:'all var(--dur-fast)', fontFamily:'var(--font-body)' }}>
                <span style={{ fontSize:15, width:20, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                <span style={{ fontSize:'0.8rem', fontWeight: active===item.id ? 700 : 500, color: active===item.id ? 'var(--gold-lt)' : 'rgba(255,255,255,.55)', flex:1 }}>{item.label}</span>
                {item.badge && <span style={{ background:'var(--red)', color:'#fff', fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'var(--r-full)', minWidth:18, textAlign:'center' }}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <button onClick={() => nav('/')} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', width:'100%', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>
          <span style={{ fontSize:15 }}>🌐</span>
          <span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,.45)' }}>Back to site</span>
        </button>
        <button onClick={() => signOut(nav)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', width:'100%', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>
          <span style={{ fontSize:15 }}>🚪</span>
          <span style={{ fontSize:'0.8rem', color:'rgba(197,48,48,.75)' }}>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

// ── KPI cards ─────────────────────────────────────
function KPIGrid({ hostel }) {
  const rooms = hostel?.rooms || []
  const total = rooms.length
  const booked = rooms.filter(r => r.status === 'Booked').length
  const avail  = total - booked
  const pending = 2 // mock pending payments
  const revenue = rooms.filter(r => r.status === 'Booked').reduce((a, r) => a + r.price, 0)

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
      {[
        { icon:'🚪', val:total,        lbl:'Total rooms',       bar:100, col:'var(--forest)' },
        { icon:'✅', val:avail,        lbl:'Available',         bar:Math.round(avail/total*100)||0, col:'var(--green-ok)' },
        { icon:'🔒', val:booked,       lbl:'Occupied',          bar:Math.round(booked/total*100)||0, col:'var(--amber)' },
        { icon:'⏳', val:pending,      lbl:'Pending payment',   bar:40, col:'var(--red)' },
        { icon:'💰', val:fmt(revenue), lbl:'Revenue this sem',  bar:65, col:'var(--gold-dk)' },
      ].map((k,i) => (
        <div key={i} style={{ background:'#fff', borderRadius:'var(--r-lg)', padding:18, border:'1px solid var(--border)', boxShadow:'var(--sh-sm)' }}>
          <div style={{ fontSize:'1.4rem', marginBottom:10 }}>{k.icon}</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, color:'var(--ink)', letterSpacing:'-0.05em', lineHeight:1, marginBottom:4 }}>{k.val}</div>
          <div style={{ fontSize:'10px', fontWeight:700, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:7 }}>{k.lbl}</div>
          <div style={{ height:3, background:'var(--ivory-md)', borderRadius:'var(--r-full)', overflow:'hidden' }}>
            <div style={{ width:k.bar+'%', height:'100%', background:k.col, borderRadius:'var(--r-full)', transition:'width 0.6s var(--ease-out)' }}/>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Rooms tab ─────────────────────────────────────
function RoomsTab({ hostel, showToast }) {
  const [filter, setFilter] = useState('all')
  const [adding, setAdding] = useState(false)
  const [newRoom, setNewRoom] = useState({ num:'', type:'Single', sharing:'Alone', floor:'Ground', price:'', sem:'Sem 1 2025' })
  const [rooms, setRooms] = useState(hostel?.rooms || [])

  const filtered = rooms.filter(r => {
    if (filter === 'available') return r.status === 'Available'
    if (filter === 'occupied') return r.status === 'Booked'
    return true
  })

  const addRoom = () => {
    if (!newRoom.num || !newRoom.price) return showToast('Room number and price required', 'error')
    setRooms(prev => [...prev, { ...newRoom, price: parseInt(newRoom.price), status:'Available', features:['WiFi'] }])
    setAdding(false)
    setNewRoom({ num:'', type:'Single', sharing:'Alone', floor:'Ground', price:'', sem:'Sem 1 2025' })
    showToast(`Room ${newRoom.num} added successfully`, 'success')
  }

  const toggleStatus = (num) => {
    setRooms(prev => prev.map(r => r.num === num ? { ...r, status: r.status === 'Available' ? 'Booked' : 'Available' } : r))
    showToast('Room status updated')
  }

  const removeRoom = (num) => {
    setRooms(prev => prev.filter(r => r.num !== num))
    showToast(`Room ${num} removed`)
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)', marginBottom:4 }}>Room management</div>
          <div style={{ display:'flex', gap:6 }}>
            {['all','available','occupied'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:'5px 13px', fontSize:11, fontWeight:700, borderRadius:'var(--r-full)', border:'1px solid var(--border)', background: filter===f ? 'var(--forest)' : '#fff', color: filter===f ? '#fff' : 'var(--muted)', cursor:'pointer', textTransform:'capitalize', transition:'all var(--dur-fast)' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-forest btn-sm" onClick={() => setAdding(!adding)}>➕ Add room</button>
      </div>

      {/* Add room form */}
      {adding && (
        <div style={{ background:'var(--forest-gl)', borderRadius:'var(--r-lg)', padding:20, marginBottom:18, border:'1px solid var(--forest-10)' }}>
          <div style={{ fontWeight:700, color:'var(--forest)', marginBottom:14, fontSize:'0.9rem' }}>Add new room</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:12 }}>
            {[['Room number','num','text','e.g. A201'],['Floor','floor','text','Ground / First'],['Price per semester (UGX)','price','number','e.g. 1500000']].map(([lbl,k,type,ph])=>(
              <div key={k}>
                <div style={{ fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>{lbl}</div>
                <input value={newRoom[k]} onChange={e=>setNewRoom(p=>({...p,[k]:e.target.value}))} placeholder={ph} type={type} style={{ width:'100%',padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)' }}/>
              </div>
            ))}
            {[['Type','type',['Single','Double','Triple']],['Sharing','sharing',['Alone','2 students','3 students']],['Semester','sem',['Sem 1 2025','Sem 2 2025','Sem 1 2026']]].map(([lbl,k,opts])=>(
              <div key={k}>
                <div style={{ fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>{lbl}</div>
                <select value={newRoom[k]} onChange={e=>setNewRoom(p=>({...p,[k]:e.target.value}))} style={{ width:'100%',padding:'9px 12px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,outline:'none',fontFamily:'var(--font-body)',background:'#fff' }}>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-forest btn-sm" onClick={addRoom}>Save room</button>
            <button className="btn btn-outline btn-sm" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Rooms grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
        {filtered.map(r => {
          const avail = r.status === 'Available'
          return (
            <div key={r.num} style={{ background:'#fff', borderRadius:'var(--r-lg)', border:`2px solid ${avail ? 'var(--forest-lt)' : 'var(--amber)'}`, padding:16, transition:'all var(--dur-mid)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:800, color:'var(--ink)', fontSize:'1rem' }}>Room {r.num}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>{r.type} · {r.sharing} · {r.floor} floor</div>
                </div>
                <span style={{ fontSize:'9px', fontWeight:800, padding:'3px 9px', borderRadius:'var(--r-full)', background: avail ? 'var(--forest-gl)' : 'var(--amber-gl)', color: avail ? 'var(--forest)' : '#7A4510' }}>{r.status}</span>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--forest)', marginBottom:6 }}>{fmt(r.price)}<span style={{ fontSize:11,fontWeight:400,color:'var(--muted)' }}>/sem</span></div>
              <div style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:10 }}>{r.sem} · {(r.features||[]).join(', ')}</div>
              <div style={{ display:'flex', gap:7 }}>
                <button onClick={() => toggleStatus(r.num)}
                  style={{ flex:1, padding:'7px', fontSize:11, fontWeight:700, borderRadius:'var(--r-xs)', border:'none', cursor:'pointer', background: avail ? 'var(--amber-gl)' : 'var(--forest-gl)', color: avail ? '#7A4510' : 'var(--forest)', transition:'all var(--dur-fast)' }}>
                  {avail ? 'Mark occupied' : 'Mark available'}
                </button>
                <button onClick={() => removeRoom(r.num)}
                  style={{ padding:'7px 10px', fontSize:11, fontWeight:700, borderRadius:'var(--r-xs)', border:'1px solid var(--red-gl)', background:'var(--red-gl)', color:'var(--red)', cursor:'pointer' }}>
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Bookings tab ─────────────────────────────────────
function BookingsTab({ showToast }) {
  const [bookings, setBookings] = useState([
    { ref:'HST-H1-P101-XK7P', student:'Aisha Nakato', sid:'24/U/1234', uni:'Kyambogo', room:'P101 - Single', sem:'Sem 1 2025', fee:'UGX 80,000', status:'Pending payment', phone:'0712345678', nok:'Grace Nakato (mother) 0701234567', date:'Jan 3, 2025' },
    { ref:'HST-H1-P201-YM3Q', student:'Brian Mukasa', sid:'23/U/5678', uni:'Kyambogo', room:'P201 - Double', sem:'Sem 1 2025', fee:'UGX 80,000', status:'Payment confirmed', phone:'0756789012', nok:'Peter Mukasa (father) 0789012345', date:'Jan 2, 2025' },
    { ref:'HST-H1-P102-ZN9R', student:'Grace Nambi', sid:'25/U/9012', uni:'Kyambogo', room:'P102 - Single', sem:'Sem 2 2025', fee:'UGX 80,000', status:'Payment confirmed', phone:'0701234567', nok:'Ruth Nambi (mother) 0756789012', date:'Dec 28, 2024' },
    { ref:'HST-H1-P301-WK2S', student:'Denis Okello', sid:'22/U/3456', uni:'Kyambogo', room:'P301 - Single', sem:'Sem 2 2025', fee:'UGX 80,000', status:'Pending payment', phone:'0789234567', nok:'Moses Okello (uncle) 0712456789', date:'Jan 4, 2025' },
  ])

  const confirm = (ref) => {
    setBookings(prev => prev.map(b => b.ref === ref ? { ...b, status:'Payment confirmed' } : b))
    showToast('Payment confirmed — room allocated', 'success')
  }
  const reject = (ref) => {
    setBookings(prev => prev.map(b => b.ref === ref ? { ...b, status:'Rejected' } : b))
    showToast('Booking rejected')
  }

  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>Student booking references</div>
      <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.78rem' }}>
          <thead>
            <tr style={{ background:'var(--ivory)' }}>
              {['Reference','Student','ID','Room','Semester','NOK contact','Booking fee','Status','Action'].map(h=>(
                <th key={h} style={{ textAlign:'left', padding:'11px 14px', fontSize:'9px', fontWeight:700, color:'var(--muted)', letterSpacing:'.08em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b,i) => (
              <tr key={i} style={{ borderBottom:'1px solid var(--ivory-md)' }}>
                <td style={{ padding:'12px 14px' }}><span style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', fontWeight:700, color:'var(--forest)' }}>{b.ref}</span></td>
                <td style={{ padding:'12px 14px' }}><div style={{ fontWeight:700, color:'var(--ink)' }}>{b.student}</div><div style={{ fontSize:'0.68rem', color:'var(--muted)', marginTop:1 }}>{b.phone}</div></td>
                <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--muted)' }}>{b.sid}</td>
                <td style={{ padding:'12px 14px' }}>{b.room}</td>
                <td style={{ padding:'12px 14px', color:'var(--muted)', fontSize:'0.72rem' }}>{b.sem}</td>
                <td style={{ padding:'12px 14px', fontSize:'0.68rem', color:'var(--muted)', maxWidth:160 }}>{b.nok}</td>
                <td style={{ padding:'12px 14px', fontWeight:700 }}>{b.fee}</td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ fontSize:'9px', fontWeight:700, padding:'3px 9px', borderRadius:'var(--r-full)', background: b.status==='Payment confirmed'?'var(--forest-gl)':b.status==='Rejected'?'var(--red-gl)':'var(--amber-gl)', color: b.status==='Payment confirmed'?'var(--forest)':b.status==='Rejected'?'var(--red)':'#7A4510' }}>{b.status}</span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  {b.status==='Pending payment' && (
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => confirm(b.ref)} style={{ padding:'5px 10px', fontSize:10, fontWeight:700, background:'var(--forest)', color:'#fff', border:'none', borderRadius:'var(--r-xs)', cursor:'pointer' }}>Confirm</button>
                      <button onClick={() => reject(b.ref)} style={{ padding:'5px 10px', fontSize:10, fontWeight:700, background:'var(--red-gl)', color:'var(--red)', border:'none', borderRadius:'var(--r-xs)', cursor:'pointer' }}>Reject</button>
                    </div>
                  )}
                  {b.status==='Payment confirmed' && <span style={{ fontSize:10, color:'var(--muted)' }}>Room allocated ✓</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Students tab ─────────────────────────────────────
function StudentsTab({ showToast }) {
  const students = [
    { name:'Aisha Nakato', sid:'24/U/1234', uni:'Kyambogo', yr:'Year 2', room:'P201', sem:'Sem 1 2025', phone:'0712345678', nok:'Grace Nakato (mother) 0701234567', status:'Resident', since:'Jan 2025' },
    { name:'Grace Nambi', sid:'25/U/9012', uni:'Kyambogo', yr:'Year 1', room:'P102', sem:'Sem 2 2025', phone:'0701234567', nok:'Peter Nambi (father) 0756789012', status:'Resident', since:'Dec 2024' },
  ]
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>Student register</div>
      <div style={{ display:'grid', gap:12 }}>
        {students.map((s,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:16, alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:700, color:'var(--ink)', marginBottom:2 }}>{s.name}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>{s.phone}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--forest)', fontFamily:'var(--font-mono)' }}>{s.sid}</div>
            </div>
            <div>
              <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:1 }}>University</div>
              <div style={{ fontWeight:600, color:'var(--ink)', fontSize:'0.82rem' }}>{s.uni} · {s.yr}</div>
            </div>
            <div>
              <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:1 }}>Room · Semester</div>
              <div style={{ fontWeight:600, color:'var(--ink)', fontSize:'0.82rem' }}>Room {s.room} · {s.sem}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--muted)' }}>Since {s.since}</div>
            </div>
            <div>
              <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:1 }}>Next of kin</div>
              <div style={{ fontSize:'0.72rem', color:'var(--ink-lt)' }}>{s.nok}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
              <span style={{ fontSize:'9px', fontWeight:700, padding:'3px 9px', borderRadius:'var(--r-full)', background:'var(--forest-gl)', color:'var(--forest)' }}>{s.status}</span>
              <button onClick={() => showToast(`WhatsApp opened for ${s.name}`)} style={{ padding:'5px 10px', fontSize:10, fontWeight:700, background:'#25D366', color:'#fff', border:'none', borderRadius:'var(--r-xs)', cursor:'pointer' }}>WhatsApp</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Payments tab ─────────────────────────────────────
function PaymentsTab({ hostel, showToast }) {
  const totalRevenue = (hostel?.rooms || []).filter(r => r.status === 'Booked').reduce((a,r)=>a+r.price,0)
  const bookingFees  = 2 * 80000
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>Payments & confirmations</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {[
          { icon:'💰', lbl:'Semester revenue', val: fmt(totalRevenue), sub:'from occupied rooms' },
          { icon:'📋', lbl:'Booking fees received', val: fmt(bookingFees), sub:'2 confirmed' },
          { icon:'⏳', lbl:'Pending confirmation', val:'2 students', sub:'UGX 160,000' },
        ].map((k,i)=>(
          <div key={i} style={{ background:'#fff', borderRadius:'var(--r-lg)', padding:20, border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'1.3rem', marginBottom:8 }}>{k.icon}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'var(--ink)', letterSpacing:'-0.03em' }}>{k.val}</div>
            <div style={{ fontSize:'10px', fontWeight:700, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase', marginTop:4 }}>{k.lbl}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginTop:3 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--amber-gl)', borderRadius:'var(--r-lg)', padding:'14px 18px', border:'1px solid rgba(212,133,58,.3)', marginBottom:16 }}>
        <div style={{ fontWeight:700, color:'#7A4510', marginBottom:4 }}>2 students pending payment confirmation</div>
        <div style={{ fontSize:'0.78rem', color:'#7A4510' }}>Aisha Nakato (HST-H1-P101-XK7P) and Denis Okello (HST-H1-P301-WK2S) have booked but not yet paid the UGX 80,000 booking fee at Stanbic Bank. Confirm once bank deposit receipt is verified.</div>
      </div>
      <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontWeight:700, color:'var(--ink)' }}>Payment ledger</div>
          <button className="btn btn-outline btn-sm" onClick={() => showToast('Export to CSV — connect to backend')}>Export CSV</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.78rem' }}>
          <thead><tr style={{ background:'var(--ivory)' }}>
            {['Date','Student','Reference','Type','Amount','Status'].map(h=>(
              <th key={h} style={{ textAlign:'left', padding:'10px 14px', fontSize:'9px', fontWeight:700, color:'var(--muted)', letterSpacing:'.08em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['Jan 2, 2025','Brian Mukasa','HST-H1-P201-YM3Q','Booking fee','UGX 80,000','Confirmed'],
              ['Dec 28, 2024','Grace Nambi','HST-H1-P102-ZN9R','Booking fee','UGX 80,000','Confirmed'],
              ['Jan 4, 2025','Denis Okello','HST-H1-P301-WK2S','Booking fee','UGX 80,000','Pending'],
              ['Jan 3, 2025','Aisha Nakato','HST-H1-P101-XK7P','Booking fee','UGX 80,000','Pending'],
            ].map((r,i)=>(
              <tr key={i} style={{ borderBottom:'1px solid var(--ivory-md)' }}>
                {r.map((c,j)=>(
                  <td key={j} style={{ padding:'12px 14px', color: j===5 ? (c==='Confirmed'?'var(--forest)':'var(--amber)') : 'var(--ink-lt)', fontWeight: j===5||j===4?700:400, fontFamily: j===2?'var(--font-mono)':'inherit', fontSize: j===2?'0.7rem':'inherit' }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Circulars tab ─────────────────────────────────────
function CircularsTab({ hostel, showToast }) {
  const [msg, setMsg] = useState('')
  const [subject, setSubject] = useState('')
  const [sentItems, setSentItems] = useState([
    { subject:'Water supply maintenance', msg:'Dear students, water supply will be interrupted on Saturday 6 Jan from 8am-2pm. Please store water accordingly.', date:'Jan 3, 2025', recipients: 2 },
  ])
  const send = () => {
    if (!subject || !msg) return showToast('Subject and message are required', 'error')
    setSentItems(prev => [{ subject, msg, date: new Date().toLocaleDateString('en-UG'), recipients:2 }, ...prev])
    setSubject(''); setMsg('')
    showToast('Circular sent to all 2 residents', 'success')
  }
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>Send circular to students</div>
      <div style={{ background:'var(--forest-gl)', borderRadius:'var(--r-lg)', padding:20, border:'1px solid var(--forest-10)', marginBottom:20 }}>
        <div style={{ fontWeight:700, color:'var(--forest)', marginBottom:14 }}>New circular</div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>Subject</div>
          <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Water supply interruption on Saturday" style={{ width:'100%', padding:'10px 13px', border:'1.5px solid var(--border)', borderRadius:'var(--r-sm)', fontSize:13, outline:'none', fontFamily:'var(--font-body)' }}/>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>Message to all residents</div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Type your message here. It will be sent to all current residents." style={{ width:'100%', padding:'10px 13px', border:'1.5px solid var(--border)', borderRadius:'var(--r-sm)', fontSize:13, outline:'none', fontFamily:'var(--font-body)', resize:'vertical' }}/>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button className="btn btn-forest" onClick={send}>📢 Send to all residents (2)</button>
          <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>Delivered via SMS and in-app notification</div>
        </div>
      </div>
      <div style={{ fontWeight:700, color:'var(--ink)', marginBottom:10 }}>Sent circulars</div>
      {sentItems.map((s,i)=>(
        <div key={i} style={{ background:'#fff', borderRadius:'var(--r-md)', border:'1px solid var(--border)', padding:'14px 18px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <div style={{ fontWeight:700, color:'var(--ink)' }}>{s.subject}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>{s.date} · {s.recipients} recipients</div>
          </div>
          <p style={{ fontSize:'0.78rem', color:'var(--muted)', lineHeight:1.6 }}>{s.msg}</p>
        </div>
      ))}
    </div>
  )
}

// ── Maintenance tab ─────────────────────────────────────
function MaintenanceTab({ showToast }) {
  const [issues, setIssues] = useState([
    { id:'M1', room:'B201', student:'Brian Mukasa', type:'Leaking roof', desc:'Water dripping from ceiling near the window when it rains. Affects bed and study desk.', date:'Jan 4, 2025', priority:'high', status:'Open' },
    { id:'M2', room:'P101', student:'Aisha Nakato', type:'Broken door lock', desc:'Bedroom door lock is faulty. Door does not close properly and lock tongue is bent.', date:'Jan 2, 2025', priority:'medium', status:'In progress' },
  ])
  const resolve = (id) => {
    setIssues(prev => prev.map(i => i.id===id ? {...i,status:'Resolved'} : i))
    showToast('Issue marked as resolved', 'success')
  }
  return (
    <div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>Maintenance issues</div>
      {issues.map(iss=>(
        <div key={iss.id} style={{ background:'#fff', borderRadius:'var(--r-lg)', border:`1.5px solid ${iss.priority==='high'?'var(--red)':iss.priority==='medium'?'var(--amber)':'var(--border)'}`, padding:'16px 20px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <div style={{ fontWeight:700, color:'var(--ink)' }}>{iss.type}</div>
                <span style={{ fontSize:'9px', fontWeight:700, padding:'2px 8px', borderRadius:'var(--r-full)', background: iss.priority==='high'?'var(--red-gl)':'var(--amber-gl)', color: iss.priority==='high'?'var(--red)':'#7A4510', textTransform:'uppercase', letterSpacing:'.06em' }}>{iss.priority} priority</span>
              </div>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>Room {iss.room} · {iss.student} · Reported {iss.date}</div>
            </div>
            <span style={{ fontSize:'9px', fontWeight:700, padding:'3px 9px', borderRadius:'var(--r-full)', background: iss.status==='Resolved'?'var(--forest-gl)':iss.status==='In progress'?'var(--blue-gl)':'var(--red-gl)', color: iss.status==='Resolved'?'var(--forest)':iss.status==='In progress'?'var(--blue)':'var(--red)' }}>{iss.status}</span>
          </div>
          <p style={{ fontSize:'0.8rem', color:'var(--ink-lt)', lineHeight:1.65, marginBottom:12 }}>{iss.desc}</p>
          {iss.status !== 'Resolved' && (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>resolve(iss.id)} className="btn btn-forest btn-sm">Mark resolved</button>
              <button className="btn btn-outline btn-sm" onClick={()=>showToast('Contractor contacted')}>Contact contractor</button>
            </div>
          )}
        </div>
      ))}
      <div style={{ background:'var(--ivory)', borderRadius:'var(--r-md)', padding:'13px 16px', border:'1px solid var(--border)', fontSize:'0.78rem', color:'var(--muted)' }}>
        💡 Students can report issues from their dashboard. All reports are timestamped and tracked here.
      </div>
    </div>
  )
}

// ── Dashboard overview ─────────────────────────────────
function DashboardTab({ hostel, setActive, showToast }) {
  return (
    <div>
      <KPIGrid hostel={hostel}/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Recent bookings */}
        <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, color:'var(--ink)' }}>Recent bookings</div>
            <button className="btn btn-forest btn-sm" onClick={()=>setActive('bookings')}>View all →</button>
          </div>
          {[{ref:'HST-H1-P101-XK7P',student:'Aisha Nakato',room:'P101',status:'Pending payment'},{ref:'HST-H1-P201-YM3Q',student:'Brian Mukasa',room:'P201',status:'Payment confirmed'}].map((b,i)=>(
            <div key={i} style={{ padding:'12px 18px', borderBottom:'1px solid var(--ivory-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.82rem', color:'var(--ink)' }}>{b.student}</div>
                <div style={{ fontSize:'0.7rem', fontFamily:'var(--font-mono)', color:'var(--muted)' }}>{b.ref}</div>
              </div>
              <span style={{ fontSize:'9px', fontWeight:700, padding:'3px 9px', borderRadius:'var(--r-full)', background:b.status==='Payment confirmed'?'var(--forest-gl)':'var(--amber-gl)', color:b.status==='Payment confirmed'?'var(--forest)':'#7A4510' }}>{b.status}</span>
            </div>
          ))}
        </div>
        {/* Room availability */}
        <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, color:'var(--ink)' }}>Room availability</div>
            <button className="btn btn-forest btn-sm" onClick={()=>setActive('rooms')}>Manage →</button>
          </div>
          {(hostel?.rooms||[]).map((r,i)=>(
            <div key={i} style={{ padding:'10px 18px', borderBottom:'1px solid var(--ivory-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.82rem', color:'var(--ink)' }}>Room {r.num}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{r.type} · {r.sharing} · {r.floor} floor</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:700, color:'var(--forest)' }}>{fmt(r.price)}</span>
                <div style={{ width:8, height:8, borderRadius:'50%', background:r.status==='Available'?'var(--green-ok)':'var(--amber)' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Warden Dashboard ─────────────────────────────
export default function WardenDashboard() {
  const { user, showToast } = useAuth()
  const nav = useNavigate()
  const [active, setActive] = useState('dashboard')

  // For demo: use first hostel with warden role
  const hostel = HOSTELS[0]

  if (!user || (user.role !== 'warden' && user.role !== 'admin')) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--ivory)' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'2rem', marginBottom:12 }}>🔒</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700, color:'var(--ink)', marginBottom:8 }}>Warden access required</div>
          <a href="/hostel" className="btn btn-forest btn-sm">Go to warden login</a>
        </div>
      </div>
    )
  }

  const pageTitles = { dashboard:'Dashboard', alerts:'System alerts', rooms:'Room management', bookings:'Booking references', 'add-room':'Add room', students:'Student register', payments:'Payments & confirmations', circulars:'Send circular', maintenance:'Maintenance issues', settings:'Hostel settings' }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--ivory)' }}>
      <WardSidebar active={active} setActive={setActive} hostel={hostel}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Top bar */}
        <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 28px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10, boxShadow:'var(--sh-xs)' }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)' }}>{pageTitles[active]||'Dashboard'}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{hostel?.name} · {user.name}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:'0.78rem', color:'var(--muted)' }}>{new Date().toLocaleDateString('en-UG',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</div>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--gold)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, border:'2px solid var(--gold-lt)' }}>
              {user.name?.[0]?.toUpperCase()||'W'}
            </div>
          </div>
        </div>
        {/* Page content */}
        <div style={{ padding:28, flex:1, overflowY:'auto' }}>
          {active==='dashboard'  && <DashboardTab hostel={hostel} setActive={setActive} showToast={showToast}/>}
          {active==='rooms'      && <RoomsTab hostel={hostel} showToast={showToast}/>}
          {active==='bookings'   && <BookingsTab showToast={showToast}/>}
          {active==='students'   && <StudentsTab showToast={showToast}/>}
          {active==='payments'   && <PaymentsTab hostel={hostel} showToast={showToast}/>}
          {active==='circulars'  && <CircularsTab hostel={hostel} showToast={showToast}/>}
          {active==='maintenance'&& <MaintenanceTab showToast={showToast}/>}
          {(active==='alerts'||active==='settings'||active==='add-room') && (
            <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1px solid var(--border)', padding:24, textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:10 }}>🔧</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'var(--ink)', marginBottom:6 }}>{pageTitles[active]}</div>
              <p style={{ color:'var(--muted)', fontSize:'0.85rem' }}>This section connects to your backend API. All data will be live once integrated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
