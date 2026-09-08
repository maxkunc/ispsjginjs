import { toDotFontSafe } from '../lib/dotFontSafe.js'

export default function HeroCard({ className = '', studentLabel }) {
  return (
    <div className={`relative rounded-[36px] grad-maroon text-white p-5 sm:p-7 min-h-[130px] sm:min-h-[220px] flex items-center justify-center text-center shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden ${className}`}>
      <div className="font-dots font-bold text-4xl sm:text-6xl leading-none">{toDotFontSafe(studentLabel)}</div>
    </div>
  )
}
