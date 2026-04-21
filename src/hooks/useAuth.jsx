import { createContext, useContext, useState, useCallback } from 'react'
const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [toasts, setToasts] = useState([])
  const showToast = useCallback((msg, type='default') => {
    const id = Date.now()+Math.random()
    setToasts(t=>[...t,{id,msg,type}])
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200)
  },[])
  const signIn = useCallback((u) => { setUser(u); showToast(`Welcome, ${u.name}!`,'success') },[showToast])
  const signOut = useCallback(() => { setUser(null); showToast('Signed out') },[showToast])
  return (
    <Ctx.Provider value={{user,setUser,signIn,signOut,showToast}}>
      {children}
      <div className="toast-container">
        {toasts.map(t=><div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
      </div>
    </Ctx.Provider>
  )
}
export const useAuth = () => useContext(Ctx)
