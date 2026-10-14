import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { useLanguage } from './context/LanguageContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NothingDashboard from './pages/NothingDashboard.jsx'

function App() {
  const { authenticated, checking, wakingUp } = useAuth()
  const { t } = useLanguage()

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#e8e6e1] px-4 text-center">
        <div className="font-dots text-2xl tracking-widest text-black/70">{t('loading')}</div>
        {wakingUp && <p className="max-w-xs text-xs text-black/40">{t('wakingUp')}</p>}
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={authenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/nothing" element={authenticated ? <NothingDashboard /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
