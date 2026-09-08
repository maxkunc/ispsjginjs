import { createContext, useContext, useMemo } from 'react'
import en from '../i18n/en.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const value = useMemo(
    () => ({
      t: (key) => en[key] ?? key,
    }),
    [],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
