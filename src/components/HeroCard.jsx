export default function HeroCard({ className = '', avgGradeRounded, studentLabel }) {
  return (
    <div className={`relative rounded-[36px] grad-black text-white p-5 sm:p-7 min-h-[280px] flex flex-col shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden ${className}`}>
      {/* decorative dot-matrix grade glyph, echoes the reference's dot-pattern mark */}
      <div className="absolute top-4 left-5 font-dots text-6xl sm:text-8xl text-white/10 select-none pointer-events-none">
        {avgGradeRounded ?? '–'}
      </div>

      {/* abstract portrait stand-in - no real photo available, so a soft glow instead */}
      <div
        className="absolute right-[8%] top-[10%] w-[55%] h-[85%] rounded-[40%] blur-3xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff5d5d, transparent 70%)' }}
      />
      <div
        className="absolute right-[18%] bottom-0 w-[38%] h-[70%] rounded-t-[50%] opacity-90 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,120,90,0.35), rgba(255,120,90,0) 70%)' }}
      />

      <div className="relative z-10 mt-auto">
        <div className="font-dots font-bold text-4xl sm:text-6xl leading-none">{studentLabel}</div>
      </div>
    </div>
  )
}
