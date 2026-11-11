import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiBaseUrl, requestJson } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const verifySession = async () => {
    try {
      const payload = await requestJson('/auth/me')
      const nextUser = payload?.data ?? null
      setUser(nextUser)
      return Boolean(nextUser)
    } catch {
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifySession()
  }, [])

  const login = async (email, password) => {
    const payload = await requestJson('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    setUser(payload?.data || null)
    return payload
  }

  const logout = async () => {
    try {
      await requestJson('/auth/logout', {
        method: 'POST',
      })
    } catch {
      // Ignore logout network errors and clear local auth state.
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      logout,
      clearSession: () => setUser(null),
      refreshSession: verifySession,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthApi() {
  return { apiBaseUrl }
}
