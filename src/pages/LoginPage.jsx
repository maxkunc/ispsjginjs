import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import LanguageSwitch from '../components/LanguageSwitch.jsx'
import { ApiError } from '../api/client.js'

const ERROR_KEYS = {
  invalid_credentials: 'errorInvalidCredentials',
  missing_credentials: 'errorMissing',
  upstream_error: 'errorUpstream',
  ssl_error: 'errorUpstream',
}

export default function LoginPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorKey, setErrorKey] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username || !password) {
      setErrorKey('errorMissing')
      return
    }
    setSubmitting(true)
    setErrorKey(null)
    try {
      await login(username, password)
    } catch (err) {
      const code = err instanceof ApiError ? err.message : 'errorUnknown'
      setErrorKey(ERROR_KEYS[code] ?? 'errorUnknown')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e8e6e1] flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="font-dots text-xl tracking-widest text-black/80">is・psjg</div>
        <LanguageSwitch />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm rounded-[32px] grad-black p-8 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
          <div className="mb-6">
            <h1 className="font-dots text-2xl tracking-wide">{t('loginTitle')}</h1>
            <p className="mt-1 text-xs text-white/60">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase tracking-wide text-white/50">
                {t('username')}
              </span>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-white/40 transition"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] uppercase tracking-wide text-white/50">
                {t('password')}
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-white/40 transition"
              />
            </label>

            {errorKey && (
              <div className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-200 ring-1 ring-red-500/30">
                {t(errorKey)}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-white text-black font-semibold text-sm py-2.5 mt-2 transition hover:bg-white/90 disabled:opacity-60"
            >
              {submitting ? t('signingIn') : t('signIn')}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
