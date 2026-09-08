export default function HeroCard({ className = '', t, avgGradeRounded, studentLabel, semesters, selectedSemester, onSemesterChange }) {
  const navItems = [
    { key: 'navDashboard', href: '#top', active: true },
    { key: 'navPortfolio', href: '#portfolio' },
    { key: 'navExams', href: '#exams' },
  ]

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

      <nav className="relative z-10 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-white/60">
        {navItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={item.active ? 'text-white font-semibold' : 'hover:text-white/90 transition'}
          >
            {t(item.key)}
          </a>
        ))}
      </nav>

      <div className="relative z-10 mt-auto flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center font-dots text-lg">
            {studentLabel?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="font-dots text-2xl sm:text-4xl leading-none">{studentLabel}</div>
        </div>

        {semesters?.length > 0 && (
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="rounded-full bg-white/10 text-white text-xs px-3 py-2 outline-none ring-1 ring-white/15 max-w-[45%]"
          >
            {semesters.map((s) => (
              <option key={s.index} value={s.label} className="text-black">
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}
