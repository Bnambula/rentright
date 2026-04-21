import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function AdminLogin() {
  const [em, setEm] = useState('admin@homeyo.ug')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const nav = useNavigate()

  const submit = () => {
    setErr('')
    if ((em === 'admin@homeyo.ug' || em === 'admin@rentright.ug') && pw === 'admin2025') {
      setLoading(true)
      setTimeout(() => { signIn({ name:'Admin', email:em, role:'admin' }); nav('/admin/dashboard') }, 900)
    } else {
      setErr('Invalid credentials. Access denied.')
      setPw('')
    }
  }

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--forest)' }}>
      <div style={{ width:380, background:'#fff', borderRadius:'var(--r-xl)', padding:40, boxShadow:'var(--sh-xl)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:48, height:48, background:'var(--gold)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:'var(--sh-gold)' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="#1A3C2E"><path d="M10 2L18 8.5V18H13V13H7V18H2V8.5L10 2Z"/></svg>
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, color:'var(--ink)', letterSpacing:'-0.02em' }}>Homeyo Admin</div>
          <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:5 }}>Restricted access — authorised personnel only</div>
        </div>

        {err && <div className="note note-red" style={{ marginBottom:16 }}>{err}</div>}

        <div className="field">
          <label className="field-label">Admin email</label>
          <input className={`input${err?' input-err':''}`} type="email" value={em} onChange={e=>setEm(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <input className={`input${err?' input-err':''}`} type="password" value={pw} onChange={e=>setPw(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Admin password" autoFocus />
        </div>

        <div style={{ fontSize:'10px', color:'var(--muted)', marginBottom:16, textAlign:'center', background:'var(--ivory)', borderRadius:'var(--r-sm)', padding:'8px 12px' }}>
          Demo: admin@homeyo.ug / admin2025
        </div>

        <button className="btn btn-forest btn-full" onClick={submit} disabled={loading||!em||!pw} style={{ fontSize:14, padding:'13px' }}>
          {loading ? '⏳ Signing in...' : 'Sign in to Admin Panel'}
        </button>

        <div style={{ textAlign:'center', marginTop:18 }}>
          <a href="/" style={{ fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontWeight:500 }}>← Back to Homeyo</a>
        </div>
      </div>
    </div>
  )
}
