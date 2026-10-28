import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)
const KEY = 'jobseek.user'

function readCached() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

function cache(user) {
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user))
    else localStorage.removeItem(KEY)
  } catch {
    /* storage can be blocked; the cookie is what actually matters */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readCached)
  const [checking, setChecking] = useState(true)

  const set = useCallback((u) => {
    setUser(u)
    cache(u)
  }, [])

  // The cached user only avoids a flash of "signed out". The cookie decides.
  useEffect(() => {
    let live = true
    api.get('/auth/user')
      .then(({ data }) => live && set(data))
      .catch(() => live && set(null))
      .finally(() => live && setChecking(false))
    return () => { live = false }
  }, [set])

  // If any request comes back 401 the session is gone.
  useEffect(() => {
    const id = api.interceptors.response.use(
      (r) => r,
      (err) => {
        const url = err?.config?.url || ''
        if (err?.response?.status === 401 && !url.startsWith('/auth/')) set(null)
        return Promise.reject(err)
      },
    )
    return () => api.interceptors.response.eject(id)
  }, [set])

  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/auth/signin', { username, password })
    set(data)
    return data
  }, [set])

  const register = useCallback(
    (payload) => api.post('/auth/signup', payload),
    [],
  )

  const logout = useCallback(async () => {
    try { await api.post('/auth/signout') } catch { /* already signed out */ }
    set(null)
  }, [set])

  const value = useMemo(() => {
    const roles = user?.roles || []
    return {
      user,
      checking,
      isAdmin: roles.includes('ROLE_ADMIN'),
      isRecruiter: roles.includes('ROLE_RECRUITER') || roles.includes('ROLE_ADMIN'),
      login,
      register,
      logout,
    }
  }, [user, checking, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
