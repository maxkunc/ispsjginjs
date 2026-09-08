import DotNumber from './DotNumber.jsx'
import { gradeBackground } from '../lib/gradeColors.js'

export default function ScheduleWidget({ className = '', grades, t }) {
  const rows = (grades ?? []).slice(0, 2)

  return (
    <div className={`rounded-[28px] grad-purple p-4 sm:p-5 min-h-[150px] text-white flex flex-col overflow-hidden shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="text-[11px] uppercase tracking-wide text-white/60 mb-2">{t('recentGrades')}</div>

      <div className="flex-1 space-y-2 overflow-hidden">
        {rows.length === 0 && <div className="text-xs text-white/50">{t('none')}</div>}
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1.5">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-dots shrink-0"
              style={{ background: gradeBackground(row.grade) }}
            >
              {row.grade ?? '–'}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs truncate">{row.name || row.subject}</div>
              <div className="text-[10px] text-white/50 truncate">{row.date}</div>
            </div>
            <DotNumber value={row.percentage} className="text-xs shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
