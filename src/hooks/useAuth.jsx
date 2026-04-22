import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

// Role → redirect path mapping
const ROLE_PATHS = {
  admin:          '/admin/dashboard',
  warden:         '/hostel/warden',
  'hostel-owner': '/hostel/owner',
  student:        '/student/dashboard',
  client:         '/dashboard',
  landlord:       '/dashboard',
  agent:          '/dashboard',
  provider:       '/dashboard',
}

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = 'default') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const signIn = useCallback((userData, navigate) => {
    setUser(userData)
    showToast(`Welcome, ${userData.name}!`, 'success')
    // Redirect to role-appropriate dashboard
    if (navigate) {
      const path = ROLE_PATHS[userData.role] || '/dashboard'
      setTimeout(() => navigate(path), 400)
    }
  }, [showToast])

  const signOut = useCallback((navigate) => {
    setUser(null)
    showToast('Signed out successfully')
    if (navigate) setTimeout(() => navigate('/'), 300)
  }, [showToast])

  return (
    <Ctx.Provider value={{ user, setUser, signIn, signOut, showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
export { ROLE_PATHS }
