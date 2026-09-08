import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    api
      .session()
      .then((res) => {
        if (!cancelled) setAuthenticated(Boolean(res?.authenticated))
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (username, password) => {
    await api.login(username, password)
    setAuthenticated(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setAuthenticated(false)
    }
  }, [])

  const value = useMemo(
    () => ({ authenticated, checking, login, logout }),
    [authenticated, checking, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
