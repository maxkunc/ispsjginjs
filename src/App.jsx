import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { useLanguage } from './context/LanguageContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  const { authenticated, checking } = useAuth()
  const { t } = useLanguage()

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8e6e1] font-dots text-2xl tracking-widest text-black/70">
        {t('loading')}
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={authenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
