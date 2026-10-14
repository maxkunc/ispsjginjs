import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  // Flips true if the initial session check is still pending after a few
  // seconds, so the loading screen can tell the user this might be a Render
  // cold start instead of just sitting there looking stuck.
  const [wakingUp, setWakingUp] = useState(false)

  useEffect(() => {
    let cancelled = false
    const wakingUpTimer = setTimeout(() => {
      if (!cancelled) setWakingUp(true)
    }, 4000)
    api
      .session()
      .then((res) => {
        if (!cancelled) setAuthenticated(Boolean(res?.authenticated))
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false)
      })
      .finally(() => {
        if (!cancelled) {
          setChecking(false)
          setWakingUp(false)
        }
      })
    return () => {
      cancelled = true
      clearTimeout(wakingUpTimer)
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
    () => ({ authenticated, checking, wakingUp, login, logout }),
    [authenticated, checking, wakingUp, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
