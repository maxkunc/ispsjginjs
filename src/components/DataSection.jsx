import { useState } from 'react'
import DotNumber from './DotNumber.jsx'
import { gradeBackground } from '../lib/gradeColors.js'
import { api } from '../api/client.js'
import { errorToI18nKey } from '../lib/errorKey.js'

function SubjectRow({ subject, t }) {
  const [open, setOpen] = useState(false)
  const [grades, setGrades] = useState(null)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setOpen((o) => !o)
    if (!open && grades === null) {
      setLoading(true)
      try {
        const res = await api.subject(subject.id)
        setGrades(res.grades)
      } catch {
        setGrades([])
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="rounded-2xl bg-black/[0.04] hover:bg-black/[0.06] transition">
      <button type="button" onClick={toggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-dots shrink-0 text-white"
          style={{ background: gradeBackground(Number(subject.knownGrade)) }}
        >
          {subject.knownGrade || '–'}
        </span>
        <span className="flex-1 min-w-0 text-sm truncate">{subject.name}</span>
        <DotNumber value={subject.percentage} suffix="%" className="text-sm text-black/60 hidden sm:inline" />
        <DotNumber value={subject.points} className="text-sm text-black/40 hidden sm:inline" />
        <span className="text-black/30 text-xs">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="px-4 pb-3">
          {loading && <div className="text-xs text-black/40">{t('loading')}</div>}
          {!loading && grades?.length === 0 && <div className="text-xs text-black/40">{t('noGrades')}</div>}
          {!loading && grades && grades.length > 0 && (
            <div className="space-y-1">
              {grades.map((g, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1 border-t border-black/5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-dots text-white shrink-0"
                    style={{ background: gradeBackground(g.grade) }}
                  >
                    {g.grade ?? '–'}
                  </span>
                  <span className="flex-1 min-w-0 truncate">{g.description || g.name}</span>
                  <span className="text-black/40 shrink-0">{g.date}</span>
                  <DotNumber value={g.percentage} className="text-black/60 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GradesTable({ grades, page, t, onPage }) {
  if (!grades || grades.length === 0) {
    return <p className="text-sm text-black/40">{t('noGrades')}</p>
  }
  return (
    <div>
      <div className="space-y-1.5">
        {grades.map((row, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-black/[0.04] px-3 py-2 text-xs sm:text-sm">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-dots text-white shrink-0"
              style={{ background: gradeBackground(row.grade) }}
            >
              {row.grade ?? '–'}
            </span>
            <span className="flex-1 min-w-0 truncate">{row.name}</span>
            <span className="text-black/40 hidden sm:inline truncate max-w-[30%]">{row.subject}</span>
            <span className="text-black/40 hidden sm:inline">{row.date}</span>
            <DotNumber value={row.percentage} className="w-14 text-right shrink-0" />
          </div>
        ))}
      </div>

      {page && page.total > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            disabled={page.current <= 1}
            onClick={() => onPage(page.current - 1)}
            className="w-7 h-7 rounded-full bg-black/5 disabled:opacity-30"
          >
            ‹
          </button>
          <DotNumber value={`${page.current} / ${page.total}`} className="text-sm" />
          <button
            type="button"
            disabled={page.current >= page.total}
            onClick={() => onPage(page.current + 1)}
            className="w-7 h-7 rounded-full bg-black/5 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

function PortfolioPanel({ portfolio, loading, error, onRetry, t }) {
  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm text-black/50">
        <span>{t(errorToI18nKey(error))}</span>
        <button type="button" onClick={onRetry} className="rounded-full bg-black/10 px-3 py-1 text-xs shrink-0">
          {t('refresh')}
        </button>
      </div>
    )
  }
  if (loading || !portfolio) return <p className="text-sm text-black/40">{t('loading')}</p>
  if (!portfolio.data || portfolio.data.length === 0) {
    return <p className="text-sm text-black/40">{t('none')}</p>
  }
  return (
    <div className="space-y-3">
      {portfolio.data.map((cat, i) => (
        <div key={i} className="rounded-2xl bg-black/[0.04] p-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="flex-1 min-w-0 text-sm font-semibold truncate">{cat.name}</span>
            <span className="shrink-0 text-xs rounded-full bg-black/10 px-2 py-0.5">
              {cat.points} {t('points')}
            </span>
          </div>
          <div className="space-y-1">
            {cat.items.map((item, j) => (
              <div key={j} className="flex items-center gap-2 text-xs">
                <span className="flex-1 min-w-0 truncate">{item.name}</span>
                <span className="text-black/40 truncate max-w-[45%]">{item.description}</span>
                <span className="text-black/50 shrink-0">
                  {item.points} {t('points')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExamsPanel({ exams, loading, error, onRetry, t }) {
  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm text-black/50">
        <span>{t(errorToI18nKey(error))}</span>
        <button type="button" onClick={onRetry} className="rounded-full bg-black/10 px-3 py-1 text-xs shrink-0">
          {t('refresh')}
        </button>
      </div>
    )
  }
  if (loading || !exams) return <p className="text-sm text-black/40">{t('loading')}</p>
  if (exams.length === 0) return <p className="text-sm text-black/40">{t('noExams')}</p>
  return (
    <div className="space-y-1.5">
      {exams.map((exam, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-black/[0.04] px-3 py-2 text-xs sm:text-sm">
          <span className="flex-1 min-w-0 truncate">{exam.name}</span>
          <span className="text-black/40 truncate max-w-[30%]">{exam.subject}</span>
          <span className="text-black/40 hidden sm:inline truncate max-w-[20%]">{exam.group}</span>
          <span className="text-black/40 shrink-0">{exam.date}</span>
        </div>
      ))}
    </div>
  )
}

export default function DataSection({
  home,
  onPage,
  portfolio,
  portfolioLoading,
  portfolioError,
  onPortfolioRetry,
  exams,
  examsLoading,
  examsError,
  onExamsRetry,
  t,
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-24 grid grid-cols-1 gap-6 md:grid-cols-2">
      <section id="subjects" className="rounded-[28px] bg-white p-5 sm:p-6 scroll-mt-6">
        <h2 className="font-dots text-lg mb-3">{t('subjectsPanel')}</h2>
        {(!home?.subjects || home.subjects.length === 0) && (
          <p className="text-sm text-black/40">{t('noSubjects')}</p>
        )}
        {home?.subjects?.length > 0 && (
          <div className="space-y-1.5">
            {home.subjects.map((s) => (
              <SubjectRow key={s.id} subject={s} t={t} />
            ))}
          </div>
        )}
      </section>

      <section id="exams" className="rounded-[28px] bg-white p-5 sm:p-6 scroll-mt-6">
        <h2 className="font-dots text-lg mb-3">{t('navExams')}</h2>
        <ExamsPanel exams={exams} loading={examsLoading} error={examsError} onRetry={onExamsRetry} t={t} />
      </section>

      <section className="rounded-[28px] bg-white p-5 sm:p-6 md:col-span-2 scroll-mt-6">
        <h2 className="font-dots text-lg mb-3">{t('gradesPanel')}</h2>
        <GradesTable grades={home?.grades} page={home?.page} t={t} onPage={onPage} />
      </section>

      <section id="portfolio" className="rounded-[28px] bg-white p-5 sm:p-6 md:col-span-2 scroll-mt-6">
        <h2 className="font-dots text-lg mb-3">{t('portfolioPanel')}</h2>
        <PortfolioPanel portfolio={portfolio} loading={portfolioLoading} error={portfolioError} onRetry={onPortfolioRetry} t={t} />
      </section>
    </div>
  )
}
