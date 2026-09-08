import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useHomeData } from '../hooks/useHomeData.js'
import { usePortfolio } from '../hooks/usePortfolio.js'
import LanguageSwitch from '../components/LanguageSwitch.jsx'
import BentoCard from '../components/BentoCard.jsx'
import HeroCard from '../components/HeroCard.jsx'
import PortraitCard from '../components/PortraitCard.jsx'
import IconCluster from '../components/IconCluster.jsx'
import ScheduleWidget from '../components/ScheduleWidget.jsx'
import GlowCTA from '../components/GlowCTA.jsx'
import DotNumber from '../components/DotNumber.jsx'
import DataSection from '../components/DataSection.jsx'
import { parsePercent } from '../lib/parsePercent.js'

// Absolute position of each widget inside the composition canvas, as % of
// the canvas box - mirrors the reference "AI OS" bento layout.
const POS = {
  avg: { top: '3%', left: '22%', width: '21%', height: '20%' },
  subjects: { top: '15.7%', left: '2.5%', width: '17.5%', height: '12.4%' },
  next: { top: '11%', left: '58.75%', width: '17%', height: '12.7%' },
  portrait: { top: '1.7%', left: '70%', width: '15.8%', height: '16.7%' },
  icons: { top: '16.3%', left: '80%', width: '16%', height: '12.7%' },
  gradeCount: { top: '17%', left: '35%', width: '16.7%', height: '11.1%' },
  hero: { top: '28.3%', left: '5%', width: '90%', height: '43.3%' },
  attendance: { top: '41%', left: '1.7%', width: '16.7%', height: '16.7%' },
  best: { top: '32.7%', left: '51.7%', width: '19.6%', height: '18%' },
  portfolioPoints: { top: '32.7%', left: '71.7%', width: '19.6%', height: '18%' },
  portfolioPlace: { top: '51.7%', left: '51.7%', width: '19.6%', height: '18%' },
  trend: { top: '51.7%', left: '71.7%', width: '19.6%', height: '18%' },
  semester: { top: '65.7%', left: '35%', width: '16.7%', height: '14.7%' },
  schedule: { top: '73.7%', left: '41.25%', width: '25%', height: '15.3%' },
  cta: { top: '76%', left: '75.4%', width: '15.8%', height: '12.7%' },
  overall: { top: '79%', left: '6.25%', width: '29.2%', height: '10%' },
}

export default function Dashboard() {
  const { logout } = useAuth()
  const { t, lang } = useLanguage()
  const { data, loading, error, setPage, refresh, switchSemester } = useHomeData()
  const { data: portfolio } = usePortfolio()

  const stats = data?.stats
  const studentLabel = t('student')

  const overallPct = useMemo(() => {
    const values = (data?.subjects ?? [])
      .map((s) => parsePercent(s.percentage))
      .filter((v) => v !== null)
    if (values.length === 0) return null
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }, [data])

  const trendValues = useMemo(
    () => (data?.grades ?? []).map((g) => parsePercent(g.percentage)).filter((v) => v !== null),
    [data],
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
        <p className="text-sm text-black/60">{t('errorUnknown')}</p>
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

      <div className="overflow-x-auto pb-2">
        <div className="relative mx-auto min-w-[880px] max-w-[1200px] aspect-[12/15.5] px-4 sm:px-6">
          <BentoCard
            gradient="green"
            pos={POS.avg}
            title={t('average')}
            subtitle={stats?.subject_count != null ? `${stats.subject_count} ${t('subjectsSub').toLowerCase()}` : t('averageSub')}
            visual="dial"
            visualProps={{ pct: stats?.avg_grade_rounded ? (6 - stats.avg_grade_rounded) * 20 : 0 }}
            value={<DotNumber value={stats?.avg_grade} />}
            footer={t('average')}
          />

          <BentoCard
            gradient="red"
            pos={POS.subjects}
            title={t('subjectsToday')}
            subtitle={t('subjectsSub')}
            value={<DotNumber value={stats?.subject_count} />}
            footer={lang === 'cs' ? 'Celkem' : 'Total'}
          />

          <BentoCard
            gradient="maroon"
            pos={POS.next}
            title={t('navExams')}
            cornerLabel="○"
            footer={t('wip')}
            value={<span className="text-2xl sm:text-3xl">🚧</span>}
          />

          <PortraitCard pos={POS.portrait} initial={studentLabel?.[0] ?? '?'} />

          <IconCluster pos={POS.icons} onLogout={logout} t={t} />

          <BentoCard
            gradient="olive"
            pos={POS.gradeCount}
            title={t('gradeCount')}
            subtitle={t('gradeCountSub')}
            value={<DotNumber value={stats?.grade_count} />}
            footer={t('gradeCountSub')}
          />

          <HeroCard
            pos={POS.hero}
            t={t}
            avgGradeRounded={stats?.avg_grade_rounded}
            studentLabel={studentLabel}
            semesters={data?.semesters}
            selectedSemester={selectedSemesterLabel}
            onSemesterChange={switchSemester}
          />

          <BentoCard
            gradient="skyblue"
            pos={POS.attendance}
            title={t('overall')}
            visual="dial"
            visualProps={{ pct: overallPct ?? 0 }}
            value={<DotNumber value={overallPct} suffix="%" className="text-2xl sm:text-3xl" />}
            footer={t('overallSub')}
          />

          <BentoCard
            gradient="purple"
            pos={POS.best}
            title={t('bestSubject')}
            subtitle={t('bestSubjectSub')}
            visual="wave"
            visualProps={{ markerPct: overallPct ?? 60 }}
            value={<DotNumber value={stats?.best_subject} className="text-base sm:text-xl" />}
          />

          <BentoCard
            gradient="teal"
            pos={POS.portfolioPoints}
            title={t('portfolioPoints')}
            subtitle={t('portfolioPointsSub')}
            visual="dial"
            visualProps={{ pct: portfolio ? Math.min(100, portfolio.points) : 0 }}
            value={<DotNumber value={portfolio?.points} />}
            footer={t('portfolioPointsSub')}
          />

          <BentoCard
            gradient="pink"
            pos={POS.portfolioPlace}
            title={t('portfolioPlace')}
            subtitle={t('portfolioPlaceSub')}
            visual="wave"
            value={<DotNumber value={portfolio?.place} suffix="." />}
          />

          <BentoCard
            gradient="blue"
            pos={POS.trend}
            title={t('trend')}
            subtitle={t('trendSub')}
            visual="scatter"
            visualProps={{ seed: trendValues.length || 1, count: Math.max(6, trendValues.length) }}
            footer="AM · PM"
          />

          <BentoCard
            gradient="yellow"
            pos={POS.semester}
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

          <ScheduleWidget pos={POS.schedule} grades={data?.grades} t={t} />

          <GlowCTA pos={POS.cta} onClick={refresh} label={t('refresh')} />

          <BentoCard
            gradient="brown"
            pos={POS.overall}
            title={t('overall')}
            visual="slider"
            visualProps={{ markerPct: overallPct ?? 0 }}
            value={<DotNumber value={overallPct} suffix="%" className="text-2xl sm:text-4xl" />}
            footer={t('overallSub')}
          />
        </div>
      </div>

      <DataSection home={data} onPage={setPage} portfolio={portfolio} t={t} />
    </div>
  )
}
