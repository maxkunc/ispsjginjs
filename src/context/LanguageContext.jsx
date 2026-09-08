import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import cs from '../i18n/cs.js'
import en from '../i18n/en.js'

const dictionaries = { cs, en }
const STORAGE_KEY = 'ispsjginjs.lang'

const LanguageContext = createContext(null)

function detectInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'cs' || stored === 'en') return stored
  } catch {
    // localStorage can throw in private/blocked contexts - fall through to default.
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'cs'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang)

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore write failures (private mode etc.)
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'cs' ? 'en' : 'cs')
  }, [lang, setLang])

  const value = useMemo(() => {
    const dict = dictionaries[lang]
    return {
      lang,
      setLang,
      toggleLang,
      t: (key) => dict[key] ?? key,
    }
  }, [lang, setLang, toggleLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
