import { useLanguage } from '../context/LanguageContext.jsx'

export default function LanguageSwitch({ className = '' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className={`inline-flex items-center rounded-full bg-black/5 p-0.5 text-[11px] font-semibold tracking-wide ${className}`}
      role="group"
      aria-label="Language"
    >
      {['cs', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === code ? 'bg-black text-white' : 'text-black/50 hover:text-black/80'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
