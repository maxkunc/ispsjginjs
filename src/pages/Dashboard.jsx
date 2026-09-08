import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useHomeData } from '../hooks/useHomeData.js'
import { usePortfolio } from '../hooks/usePortfolio.js'
import { useZkouseni } from '../hooks/useZkouseni.js'
import BentoCard from '../components/BentoCard.jsx'
import HeroCard from '../components/HeroCard.jsx'
import ScheduleWidget from '../components/ScheduleWidget.jsx'
import DotNumber from '../components/DotNumber.jsx'
import DataSection from '../components/DataSection.jsx'
import { parsePercent } from '../lib/parsePercent.js'
import { errorToI18nKey } from '../lib/errorKey.js'
import { subjectAbbreviation } from '../lib/subjectAbbr.js'
import { isFutureExam } from '../lib/examDate.js'

// Grid placement for each widget - a real, non-overlapping 12-column bento
// grid (stacks to 1 column on mobile, 2 on tablet).
const HALF = 'col-span-12 sm:col-span-6 lg:col-span-6'
const HALF_ALWAYS = 'col-span-6 lg:col-span-6'

export default function Dashboard() {
  const { logout } = useAuth()
  const { t } = useLanguage()
  const { data, loading, error, setPage, refresh, switchSemester } = useHomeData()
  const {
    data: portfolio,
    loading: portfolioLoading,
    error: portfolioError,
    refresh: refreshPortfolio,
  } = usePortfolio(data?.selectedSemester)
  const {
    data: zkouseniData,
    loading: zkouseniLoading,
    error: zkouseniError,
    refresh: refreshZkouseni,
  } = useZkouseni(data?.selectedSemester)

  const stats = data?.stats
  const studentLabel = data?.studentName || t('student')

  const overallPct = useMemo(() => {
    const values = (data?.subjects ?? [])
      .map((s) => parsePercent(s.percentage))
      .filter((v) => v !== null)
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
      <div className="min-h-screen flex items-center justify-center bg-[#e8e6e1] font-dots text-2xl tracking-widest text-black/60">
        {t('loading')}
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#e8e6e1] px-4 text-center">
        <p className="text-sm text-black/60">{t(errorToI18nKey(error))}</p>
        <button type="button" onClick={refresh} className="rounded-full bg-black text-white text-sm px-4 py-2">
          {t('refresh')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#e8e6e1]" id="top">
      <header className="flex items-center justify-between gap-3 px-4 sm:px-8 py-5">
        <div className="font-dots text-lg sm:text-xl tracking-widest text-black/80">is・psjg</div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {data?.semesters?.length > 0 && (
            <select
              value={selectedSemesterLabel}
              onChange={(e) => switchSemester(e.target.value)}
              className="min-w-0 max-w-[120px] sm:max-w-none truncate rounded-full bg-black/5 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-black/60 outline-none hover:text-black/80 transition"
            >
              {data.semesters.map((s) => (
                <option key={s.index} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={logout}
            className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-black/40 hover:text-black/70 transition"
          >
            {t('logout')}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-12 gap-4 sm:gap-5">
          {/* Primary stats: bigger, bolder. On mobile the visual order is
              Portfolio+Success rate, Average, name, recent grades (see the
              order-* classes below) - desktop keeps the original order via
              the sm:order-* overrides. */}
          <BentoCard
            gradient="green"
            large
            className={`${HALF} order-3 sm:order-1`}
            title={t('average')}
            subtitle={stats?.subject_count != null ? `${stats.subject_count} ${t('subjectsSub').toLowerCase()}` : t('averageSub')}
            value={<DotNumber value={stats?.avg_grade} />}
            footer={t('average')}
          />

          <BentoCard
            gradient="skyblue"
            large
            className={`${HALF_ALWAYS} order-2`}
            title={t('overall')}
            value={<DotNumber value={overallPct} suffix="%" />}
            footer={t('overallSub')}
          />

          <ScheduleWidget className="col-span-12 order-5 sm:order-3" grades={data?.grades} t={t} />

          <HeroCard className="col-span-12 order-4" studentLabel={studentLabel} />

          {/* Primary: portfolio points, bigger/bolder */}
          <BentoCard
            gradient="teal"
            large
            className={`${HALF_ALWAYS} order-1 sm:order-5`}
            title={t('portfolioPoints')}
            subtitle={t('portfolioPointsSub')}
            value={<DotNumber value={portfolio?.points} />}
            footer={t('portfolioPointsSub')}
          />

          <BentoCard
            gradient="pink"
            className={`${HALF_ALWAYS} order-6`}
            title={t('portfolioPlace')}
            subtitle={t('portfolioPlaceSub')}
            visual="wave"
            value={<DotNumber value={portfolio?.place} suffix="." />}
          />

          <BentoCard
            gradient="olive"
            className={`${HALF_ALWAYS} order-8`}
            title={t('gradeCount')}
            subtitle={t('gradeCountSub')}
            value={<DotNumber value={stats?.grade_count} />}
            footer={t('gradeCountSub')}
          />

          <BentoCard
            gradient="purple"
            className={`${HALF_ALWAYS} order-9`}
            title={t('bestSubject')}
            subtitle={t('bestSubjectSub')}
            visual="wave"
            visualProps={{ markerPct: overallPct ?? 60 }}
            value={<DotNumber value={subjectAbbreviation(stats?.best_subject)} className="block truncate max-w-full" />}
          />

          <BentoCard
            gradient="blue"
            className={`${HALF_ALWAYS} order-10 sm:hidden`}
            title={t('futureExams')}
            subtitle={t('futureExamsSub')}
            value={<DotNumber value={futureExamsCount} />}
            footer={t('futureExamsSub')}
          />
        </div>
      </div>

      <DataSection
        home={data}
        onPage={setPage}
        portfolio={portfolio}
        portfolioLoading={portfolioLoading}
        portfolioError={portfolioError}
        onPortfolioRetry={refreshPortfolio}
        exams={zkouseniData?.exams}
        examsLoading={zkouseniLoading}
        examsError={zkouseniError}
        onExamsRetry={refreshZkouseni}
        t={t}
      />
    </div>
  )
}
