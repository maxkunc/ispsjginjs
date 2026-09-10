import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useHomeData } from '../hooks/useHomeData.js'
import { usePortfolio } from '../hooks/usePortfolio.js'
import { useZkouseni } from '../hooks/useZkouseni.js'
import { api } from '../api/client.js'
import { parsePercent } from '../lib/parsePercent.js'
import { errorToI18nKey } from '../lib/errorKey.js'
import { isFutureExam } from '../lib/examDate.js'
import { subjectAbbreviation } from '../lib/subjectAbbr.js'

// Nothing design system tokens (see ~/.claude/skills/nothing-design) - scoped
// entirely under .nd so this experimental UI can't bleed into the main app.
// Doto is already self-hosted for the main app (index.css); Space Grotesk /
// Space Mono are loaded via Google Fonts in index.html.
const NOTHING_STYLE = `
.nd {
  --nd-black: #000000;
  --nd-surface: #111111;
  --nd-surface-raised: #1A1A1A;
  --nd-border: #222222;
  --nd-border-visible: #333333;
  --nd-text-disabled: #666666;
  --nd-text-secondary: #999999;
  --nd-text-primary: #E8E8E8;
  --nd-text-display: #FFFFFF;
  --nd-accent: #D71921;
  --nd-accent-subtle: rgba(215,25,33,0.15);
  --nd-success: #4A9E5C;
  --nd-warning: #D4A843;
  --nd-interactive: #5B9BF6;
  background: var(--nd-black);
  color: var(--nd-text-primary);
  min-height: 100vh;
  font-family: "Space Grotesk", "DM Sans", system-ui, sans-serif;
}
.nd.nd-light {
  --nd-black: #F5F5F5;
  --nd-surface: #FFFFFF;
  --nd-surface-raised: #F0F0F0;
  --nd-border: #E8E8E8;
  --nd-border-visible: #CCCCCC;
  --nd-text-disabled: #999999;
  --nd-text-secondary: #666666;
  --nd-text-primary: #1A1A1A;
  --nd-text-display: #000000;
  --nd-interactive: #007AFF;
}
.nd-mono { font-family: "Space Mono", "JetBrains Mono", "SF Mono", monospace; }
.nd-display { font-family: "Doto", "Space Mono", monospace; }
.nd-label {
  font-family: "Space Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.nd-dots {
  background-image: radial-gradient(circle, var(--nd-border-visible) 1px, transparent 1px);
  background-size: 16px 16px;
}
`

function statusColor(pct) {
  if (pct === null || pct === undefined) return 'var(--nd-text-secondary)'
  if (pct >= 80) return 'var(--nd-success)'
  if (pct >= 50) return 'var(--nd-warning)'
  return 'var(--nd-accent)'
}

// Czech 1-5 scale, 1 best.
function gradeStatusColor(grade) {
  const g = Number(grade)
  if (!Number.isFinite(g)) return 'var(--nd-text-secondary)'
  if (g <= 2) return 'var(--nd-success)'
  if (g === 3) return 'var(--nd-warning)'
  return 'var(--nd-accent)'
}

function SegmentBar({ pct, segments = 24 }) {
  const clamped = pct === null || pct === undefined ? 0 : Math.max(0, Math.min(100, pct))
  const filled = Math.round((clamped / 100) * segments)
  const color = statusColor(pct)
  return (
    <div className="flex gap-[2px] h-2 w-full">
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} className="flex-1" style={{ background: i < filled ? color : 'var(--nd-border)' }} />
      ))}
    </div>
  )
}

function StatRow({ label, value, unit, color, border = true }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 py-3"
      style={border ? { borderBottom: '1px solid var(--nd-border)' } : undefined}
    >
      <span className="nd-label" style={{ color: 'var(--nd-text-secondary)' }}>
        {label}
      </span>
      <span className="nd-mono text-lg sm:text-xl" style={{ color: color ?? 'var(--nd-text-primary)' }}>
        {value ?? '--'}
        {unit && (
          <span className="nd-label ml-1.5" style={{ color: 'var(--nd-text-secondary)' }}>
            {unit}
          </span>
        )}
      </span>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="px-6 sm:px-10 py-10 sm:py-14 scroll-mt-16" style={{ borderTop: '1px solid var(--nd-border)' }}>
      <h2 className="nd-label mb-6" style={{ color: 'var(--nd-text-secondary)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function EmptyState({ text }) {
  return (
    <div className="py-12 text-center nd-mono text-sm" style={{ color: 'var(--nd-text-disabled)' }}>
      {text}
    </div>
  )
}

function errorLabel(error) {
  return errorToI18nKey(error)
    .replace(/^error/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toUpperCase() || 'UNKNOWN'
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex items-center gap-4 nd-mono text-sm" style={{ color: 'var(--nd-accent)' }}>
      <span>[ERROR: {errorLabel(error)}]</span>
      <button
        type="button"
        onClick={onRetry}
        className="nd-label px-3 py-1"
        style={{ border: '1px solid var(--nd-accent)', color: 'var(--nd-accent)', borderRadius: 999 }}
      >
        RETRY
      </button>
    </div>
  )
}

function SubjectRow({ subject }) {
  const [open, setOpen] = useState(false)
  const [grades, setGrades] = useState(null)
  const [loading, setLoading] = useState(false)
  const pct = parsePercent(subject.percentage)

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

  const displayGrade = subject.finalGrade || subject.knownGrade

  return (
    <div className="py-4" style={{ borderBottom: '1px solid var(--nd-border)' }}>
      <button type="button" onClick={toggle} className="w-full flex items-center gap-4 text-left">
        <span className="nd-mono text-lg w-8 shrink-0" style={{ color: gradeStatusColor(displayGrade) }}>
          {displayGrade || '--'}
        </span>
        <span className="flex-1 min-w-0 truncate text-sm" style={{ color: 'var(--nd-text-primary)' }}>
          {subject.name}
        </span>
        <span className="nd-mono text-sm w-12 text-right shrink-0" style={{ color: statusColor(pct) }}>
          {pct === null ? '--' : Math.round(pct)}%
        </span>
        <span className="nd-label shrink-0" style={{ color: 'var(--nd-text-disabled)' }}>
          {open ? '[-]' : '[+]'}
        </span>
      </button>
      <div className="mt-2 pl-12">
        <SegmentBar pct={pct} segments={32} />
      </div>

      {open && (
        <div className="mt-4 pl-12 space-y-2">
          {loading && <div className="nd-mono text-xs" style={{ color: 'var(--nd-text-disabled)' }}>[LOADING]</div>}
          {!loading && grades?.length === 0 && (
            <div className="nd-mono text-xs" style={{ color: 'var(--nd-text-disabled)' }}>NO GRADES</div>
          )}
          {!loading &&
            grades?.map((g, i) => (
              <div key={i} className="flex items-center gap-3 text-xs py-1.5" style={{ borderTop: '1px solid var(--nd-border)' }}>
                <span className="nd-mono w-6 shrink-0" style={{ color: gradeStatusColor(g.grade) }}>
                  {g.grade ?? '--'}
                </span>
                <span className="flex-1 min-w-0 truncate" style={{ color: 'var(--nd-text-secondary)' }}>
                  {g.description || g.name}
                </span>
                <span className="hidden sm:inline nd-mono" style={{ color: 'var(--nd-text-disabled)' }}>
                  {g.date}
                </span>
                <span className="nd-mono w-16 text-right shrink-0" style={{ color: statusColor(parsePercent(g.percentage)) }}>
                  {g.percentage ?? '--'}
                </span>
                <span className="nd-mono w-14 text-right shrink-0" style={{ color: 'var(--nd-text-disabled)' }}>
                  {g.points ?? '--'}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

function GradesTable({ grades, page, onPage }) {
  if (!grades || grades.length === 0) return <EmptyState text="NO GRADES FOUND" />
  return (
    <div>
      <div
        className="hidden sm:flex nd-label gap-3 pb-2"
        style={{ color: 'var(--nd-text-secondary)', borderBottom: '1px solid var(--nd-border-visible)' }}
      >
        <span className="w-8 shrink-0">GR</span>
        <span className="flex-1">NAME</span>
        <span className="w-40 shrink-0">SUBJECT</span>
        <span className="w-20 shrink-0">DATE</span>
        <span className="w-16 shrink-0 text-right">PCT</span>
        <span className="w-14 shrink-0 text-right">PTS</span>
      </div>
      {grades.map((row, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 text-xs sm:text-sm" style={{ borderBottom: '1px solid var(--nd-border)' }}>
          <span className="nd-mono w-8 shrink-0" style={{ color: gradeStatusColor(row.grade) }}>
            {row.grade ?? '--'}
          </span>
          <span className="flex-1 min-w-0 truncate">{row.name}</span>
          <span className="hidden sm:inline w-40 shrink-0 truncate" style={{ color: 'var(--nd-text-secondary)' }}>
            {row.subject}
          </span>
          <span className="hidden sm:inline w-20 shrink-0 nd-mono" style={{ color: 'var(--nd-text-disabled)' }}>
            {row.date}
          </span>
          <span className="nd-mono w-16 shrink-0 text-right" style={{ color: statusColor(parsePercent(row.percentage)) }}>
            {row.percentage ?? '--'}
          </span>
          <span className="nd-mono w-14 shrink-0 text-right" style={{ color: 'var(--nd-text-disabled)' }}>
            {row.points ?? '--'}
          </span>
        </div>
      ))}

      {page && page.total > 1 && (
        <div className="mt-6 flex items-center justify-center gap-6 nd-label">
          <button
            type="button"
            disabled={page.current <= 1}
            onClick={() => onPage(page.current - 1)}
            style={{ color: page.current <= 1 ? 'var(--nd-text-disabled)' : 'var(--nd-text-primary)' }}
          >
            &lt;
          </button>
          <span style={{ color: 'var(--nd-text-secondary)' }}>
            PAGE {page.current} / {page.total}
          </span>
          <button
            type="button"
            disabled={page.current >= page.total}
            onClick={() => onPage(page.current + 1)}
            style={{ color: page.current >= page.total ? 'var(--nd-text-disabled)' : 'var(--nd-text-primary)' }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  )
}

function PortfolioSection({ portfolio, loading, error, onRetry }) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (loading || !portfolio) return <div className="nd-mono text-sm" style={{ color: 'var(--nd-text-disabled)' }}>[LOADING]</div>
  if (!portfolio.data || portfolio.data.length === 0) return <EmptyState text="NOTHING YET" />
  return (
    <div className="space-y-8">
      {portfolio.data.map((cat, i) => (
        <div key={i}>
          <div className="flex items-baseline justify-between mb-3" style={{ borderBottom: '1px solid var(--nd-border-visible)' }}>
            <span className="text-sm pb-2" style={{ color: 'var(--nd-text-primary)' }}>
              {cat.name}
            </span>
            <span className="nd-mono text-sm pb-2" style={{ color: 'var(--nd-text-display)' }}>
              {cat.points} <span className="nd-label" style={{ color: 'var(--nd-text-secondary)' }}>PTS</span>
            </span>
          </div>
          <div className="space-y-1.5 pl-4">
            {cat.items.map((item, j) => (
              <div key={j} className="flex items-center gap-3 text-xs">
                <span className="flex-1 min-w-0 truncate" style={{ color: 'var(--nd-text-secondary)' }}>
                  {item.name}
                </span>
                <span className="hidden sm:inline truncate max-w-[40%]" style={{ color: 'var(--nd-text-disabled)' }}>
                  {item.description}
                </span>
                <span className="nd-mono shrink-0" style={{ color: 'var(--nd-text-primary)' }}>
                  {item.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExamsSection({ exams, loading, error, onRetry }) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (loading || !exams) return <div className="nd-mono text-sm" style={{ color: 'var(--nd-text-disabled)' }}>[LOADING]</div>
  if (exams.length === 0) return <EmptyState text="NO EXAMS SCHEDULED" />
  return (
    <div>
      {exams.map((exam, i) => {
        const future = isFutureExam(exam.date)
        return (
          <div key={i} className="flex items-center gap-3 py-2.5 text-xs sm:text-sm" style={{ borderBottom: '1px solid var(--nd-border)' }}>
            <span
              className="nd-label shrink-0 px-2 py-0.5"
              style={{
                borderRadius: 999,
                border: `1px solid ${future ? 'var(--nd-border-visible)' : 'var(--nd-border)'}`,
                color: future ? 'var(--nd-text-primary)' : 'var(--nd-text-disabled)',
              }}
            >
              {future ? 'UPCOMING' : 'PAST'}
            </span>
            <span className="flex-1 min-w-0 truncate">{exam.name}</span>
            <span className="hidden sm:inline truncate max-w-[25%]" style={{ color: 'var(--nd-text-secondary)' }}>
              {exam.subject}
            </span>
            <span className="nd-mono shrink-0" style={{ color: 'var(--nd-text-disabled)' }}>
              {exam.date}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function NothingDashboard() {
  const { logout } = useAuth()
  const [mode, setMode] = useState('dark')
  const { data, loading, error, setPage, refresh, switchSemester } = useHomeData()
  const homeReady = Boolean(data)
  const {
    data: portfolio,
    loading: portfolioLoading,
    error: portfolioError,
    refresh: refreshPortfolio,
  } = usePortfolio(data?.selectedSemester, homeReady)
  const {
    data: zkouseniData,
    loading: zkouseniLoading,
    error: zkouseniError,
    refresh: refreshZkouseni,
  } = useZkouseni(data?.selectedSemester, homeReady)

  const isReloading = loading || portfolioLoading || zkouseniLoading
  const handleReload = () => {
    if (isReloading) return
    refresh()
    refreshPortfolio()
    refreshZkouseni()
  }

  const stats = data?.stats
  const studentLabel = data?.studentName || 'STUDENT'

  const overallPct = useMemo(() => {
    const values = (data?.subjects ?? []).map((s) => parsePercent(s.percentage)).filter((v) => v !== null)
    if (values.length === 0) return null
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }, [data])

  const futureExamsCount = useMemo(
    () => (zkouseniData?.exams ?? []).filter((e) => isFutureExam(e.date)).length,
    [zkouseniData],
  )

  const selectedSemesterLabel = useMemo(
    () => data?.semesters?.find((s) => s.index + 1 === data?.selectedSemester)?.label,
    [data],
  )

  if (loading && !data) {
    return (
      <div className={`nd ${mode === 'light' ? 'nd-light' : ''}`}>
        <style>{NOTHING_STYLE}</style>
        <div className="min-h-screen flex items-center justify-center nd-mono text-sm" style={{ color: 'var(--nd-text-secondary)' }}>
          [LOADING]
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className={`nd ${mode === 'light' ? 'nd-light' : ''}`}>
        <style>{NOTHING_STYLE}</style>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
          <ErrorState error={error} onRetry={refresh} />
        </div>
      </div>
    )
  }

  return (
    <div className={`nd ${mode === 'light' ? 'nd-light' : ''}`}>
      <style>{NOTHING_STYLE}</style>

      <header
        className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 px-4 sm:px-10 py-5 sm:py-6"
        style={{ borderBottom: '1px solid var(--nd-border)' }}
      >
        <div className="shrink-0">
          <div className="nd-label" style={{ color: 'var(--nd-text-display)', letterSpacing: '0.1em' }}>
            IS・PSJG
          </div>
          <div className="nd-label mt-0.5" style={{ color: 'var(--nd-text-disabled)' }}>
            NOTHING EDITION
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-4 min-w-0">
          <div className="flex items-center shrink-0" style={{ border: '1px solid var(--nd-border-visible)', borderRadius: 999 }}>
            {['dark', 'light'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="nd-label px-3 py-1.5"
                style={{
                  borderRadius: 999,
                  background: mode === m ? 'var(--nd-text-display)' : 'transparent',
                  color: mode === m ? 'var(--nd-black)' : 'var(--nd-text-secondary)',
                }}
              >
                {m === 'dark' ? 'DARK' : 'LIGHT'}
              </button>
            ))}
          </div>

          {data?.semesters?.length > 0 && (
            <select
              value={selectedSemesterLabel}
              onChange={(e) => switchSemester(e.target.value)}
              className="nd-label px-3 py-1.5 outline-none shrink-0 max-w-[92px] sm:max-w-[140px] truncate"
              style={{
                background: 'transparent',
                border: '1px solid var(--nd-border-visible)',
                borderRadius: 8,
                color: 'var(--nd-text-primary)',
              }}
            >
              {data.semesters.map((s) => (
                <option key={s.index} value={s.label} style={{ background: 'var(--nd-surface)' }}>
                  {s.label}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleReload}
            disabled={isReloading}
            aria-label="Reload"
            title="Reload"
            className="grid place-items-center h-8 w-8 shrink-0"
            style={{
              border: '1px solid var(--nd-border-visible)',
              borderRadius: 999,
              color: 'var(--nd-text-primary)',
              opacity: isReloading ? 0.4 : 1,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-3.5 w-3.5 ${isReloading ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>

          <Link
            to="/"
            className="nd-label shrink-0 whitespace-nowrap hidden sm:inline"
            style={{ color: 'var(--nd-text-secondary)' }}
          >
            NORMAL UI
          </Link>
          <button
            type="button"
            onClick={logout}
            className="nd-label shrink-0 whitespace-nowrap"
            style={{ color: 'var(--nd-text-secondary)' }}
          >
            LOG OUT
          </button>
        </div>
      </header>

      <div className="nd-dots" style={{ opacity: 0.5 }}>
        <div className="px-6 sm:px-10 pt-12 sm:pt-20 pb-10">
          <div className="nd-label mb-4" style={{ color: 'var(--nd-text-secondary)' }}>
            AVERAGE GRADE
          </div>
          <div className="flex items-end gap-4 flex-wrap">
            {/* Hero number always renders at full --text-display contrast (not a
                status color) - it's the one element on the page meant to be read
                from across the room, so nothing should dilute it. */}
            <span
              className="nd-display"
              style={{
                fontSize: 'clamp(56px, 13vw, 108px)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: 'var(--nd-text-display)',
              }}
            >
              {stats?.avg_grade ?? '--'}
            </span>
            <span className="nd-label pb-3" style={{ color: 'var(--nd-text-secondary)' }}>
              OF 5
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-1 nd-mono text-sm" style={{ color: 'var(--nd-text-secondary)' }}>
            <span>{studentLabel}</span>
            {selectedSemesterLabel && <span>{selectedSemesterLabel}</span>}
          </div>
        </div>
      </div>

      <Section id="stats" title="STATS">
        <div className="grid sm:grid-cols-2 gap-x-12">
          <StatRow
            label="OVERALL SUCCESS RATE"
            value={overallPct === null ? '--' : `${overallPct}%`}
            color={overallPct === null ? undefined : statusColor(overallPct)}
          />
          <StatRow label="GRADES LOGGED" value={stats?.grade_count ?? '--'} />
          <StatRow
            label="PORTFOLIO POINTS"
            value={portfolioLoading ? '...' : portfolio?.points ?? '--'}
          />
          <StatRow label="RANK IN CLASS" value={portfolioLoading ? '...' : portfolio?.place ?? '--'} />
          <StatRow
            label="BEST SUBJECT"
            value={subjectAbbreviation(stats?.best_subject) ?? '--'}
          />
          <StatRow
            label="UPCOMING EXAMS"
            value={zkouseniLoading ? '...' : futureExamsCount}
            color={futureExamsCount > 0 ? 'var(--nd-warning)' : undefined}
            border={false}
          />
        </div>
      </Section>

      <Section id="subjects" title="SUBJECTS">
        {(!data?.subjects || data.subjects.length === 0) && <EmptyState text="NO SUBJECTS FOUND" />}
        {data?.subjects?.length > 0 && (
          <div>
            {data.subjects.map((s) => (
              <SubjectRow key={s.id} subject={s} />
            ))}
          </div>
        )}
      </Section>

      <Section id="grades" title="RECENT GRADES">
        <GradesTable grades={data?.grades} page={data?.page} onPage={setPage} />
      </Section>

      <Section id="portfolio" title="PORTFOLIO">
        <PortfolioSection
          portfolio={portfolio}
          loading={portfolioLoading}
          error={portfolioError}
          onRetry={refreshPortfolio}
        />
      </Section>

      <Section id="exams" title="EXAMS">
        <ExamsSection
          exams={zkouseniData?.exams}
          loading={zkouseniLoading}
          error={zkouseniError}
          onRetry={refreshZkouseni}
        />
      </Section>

      <footer className="px-6 sm:px-10 py-8 nd-label" style={{ color: 'var(--nd-text-disabled)' }}>
        IS・PSJG // NOTHING EDITION
      </footer>
    </div>
  )
}
