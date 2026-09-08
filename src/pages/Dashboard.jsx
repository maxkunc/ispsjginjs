import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useHomeData } from '../hooks/useHomeData.js'
import { usePortfolio } from '../hooks/usePortfolio.js'
import { useZkouseni } from '../hooks/useZkouseni.js'
import LanguageSwitch from '../components/LanguageSwitch.jsx'
import BentoCard from '../components/BentoCard.jsx'
import HeroCard from '../components/HeroCard.jsx'
import ScheduleWidget from '../components/ScheduleWidget.jsx'
import DotNumber from '../components/DotNumber.jsx'
import DataSection from '../components/DataSection.jsx'
import { parsePercent } from '../lib/parsePercent.js'
import { errorToI18nKey } from '../lib/errorKey.js'

// Grid placement for each widget - a real, non-overlapping 12-column bento
// grid (stacks to 1 column on mobile, 2 on tablet).
const QUARTER = 'col-span-12 sm:col-span-6 lg:col-span-3'
const HALF = 'col-span-12 sm:col-span-6 lg:col-span-6'

export default function Dashboard() {
  const { logout } = useAuth()
  const { t, lang } = useLanguage()
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
    <div className="min-h-screen bg-[#e8e6e1]" id="top">
      <header className="flex items-center justify-between px-4 sm:px-8 py-5">
        <div className="font-dots text-lg sm:text-xl tracking-widest text-black/80">is・psjg</div>
        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <button
            type="button"
            onClick={logout}
            className="text-[11px] font-semibold uppercase tracking-wide text-black/40 hover:text-black/70 transition"
          >
            {t('logout')}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-12 gap-4 sm:gap-5">
          <BentoCard
            gradient="green"
            className={QUARTER}
            title={t('average')}
            subtitle={stats?.subject_count != null ? `${stats.subject_count} ${t('subjectsSub').toLowerCase()}` : t('averageSub')}
            value={<DotNumber value={stats?.avg_grade} />}
            footer={t('average')}
          />

          <BentoCard
            gradient="red"
            className={QUARTER}
            title={t('subjectsToday')}
            subtitle={t('subjectsSub')}
            value={<DotNumber value={stats?.subject_count} />}
            footer={lang === 'cs' ? 'Celkem' : 'Total'}
          />

          <BentoCard
            gradient="olive"
            className={QUARTER}
            title={t('gradeCount')}
            subtitle={t('gradeCountSub')}
            value={<DotNumber value={stats?.grade_count} />}
            footer={t('gradeCountSub')}
          />

          <BentoCard
            gradient="skyblue"
            className={QUARTER}
            title={t('overall')}
            value={<DotNumber value={overallPct} suffix="%" className="text-2xl sm:text-3xl" />}
            footer={t('overallSub')}
          />

          <BentoCard
            gradient="purple"
            className="col-span-12"
            title={t('bestSubject')}
            subtitle={t('bestSubjectSub')}
            visual="wave"
            visualProps={{ markerPct: overallPct ?? 60 }}
            value={<DotNumber value={stats?.best_subject} className="text-xl sm:text-2xl" />}
          />

          <HeroCard
            className="col-span-12"
            t={t}
            avgGradeRounded={stats?.avg_grade_rounded}
            studentLabel={studentLabel}
            semesters={data?.semesters}
            selectedSemester={selectedSemesterLabel}
            onSemesterChange={switchSemester}
          />

          <BentoCard
            gradient="teal"
            className={QUARTER}
            title={t('portfolioPoints')}
            subtitle={t('portfolioPointsSub')}
            value={<DotNumber value={portfolio?.points} />}
            footer={t('portfolioPointsSub')}
          />

          <BentoCard
            gradient="pink"
            className={QUARTER}
            title={t('portfolioPlace')}
            subtitle={t('portfolioPlaceSub')}
            visual="wave"
            value={<DotNumber value={portfolio?.place} suffix="." />}
          />

          <BentoCard
            gradient="yellow"
            className={HALF}
            title={t('semester')}
            subtitle={t('semesterSub')}
            visual="slider"
            visualProps={{ markerPct: data?.selectedSemester ? ((data.selectedSemester % 2 === 0 ? 75 : 25)) : 50 }}
            value={
              <DotNumber
                value={selectedSemesterLabel?.split(' - ')[1] ?? '–'}
                className="text-sm sm:text-lg"
              />
            }
          />

          <ScheduleWidget className={HALF} grades={data?.grades} t={t} />

          <BentoCard
            gradient="brown"
            className={HALF}
            title={t('overall')}
            visual="slider"
            visualProps={{ markerPct: overallPct ?? 0 }}
            value={<DotNumber value={overallPct} suffix="%" className="text-2xl sm:text-4xl" />}
            footer={t('overallSub')}
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
