import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'

export function useHomeData() {
  const [data, setData] = useState(null)
  // The "recent grades" preview (ScheduleWidget) always shows the two most
  // recent grades, i.e. page 1's first rows - captured once here and never
  // overwritten by later page navigation, so paging through the full grades
  // table doesn't change what counts as "recent".
  const [recentGrades, setRecentGrades] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback((targetPage = page) => {
    setLoading(true)
    setError(null)
    return api
      .home(targetPage)
      .then((res) => {
        setData(res)
        setPage(res.page.current)
        if (res.page.current === 1) setRecentGrades(res.grades)
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load(1)
  }, [load])

  const switchSemester = useCallback(
    async (label) => {
      await api.setSemester(label)
      await load(1)
    },
    [load],
  )

  return { data, recentGrades, loading, error, page, setPage: (p) => load(p), refresh: () => load(page), switchSemester }
}
