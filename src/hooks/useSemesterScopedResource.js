import { useCallback, useEffect, useState } from 'react'

/**
 * Fetch-on-ready, refetch-on-semester-change, manual-refresh hook shared by
 * every /api/* resource that's scoped to the currently selected semester
 * (portfolio, zkoušení, ...).
 *
 * @param {() => Promise<any>} fetchFn
 * @param {number|undefined} semesterKey - when this changes (e.g. the user
 * switched semesters), the resource is refetched.
 * @param {boolean} enabled - don't fetch until this is true. Dashboard.jsx
 * passes `Boolean(homeData)` here: firing before /api/home resolves used to
 * cost is.psjg.cz two wasted round trips per resource - the request raced
 * home's own studentId lookup (portfolio/subject need it, so an unfinished
 * home request meant a redundant duplicate mainpage fetch), and then fired
 * *again* once semesterKey flipped from undefined to the real value home
 * had just loaded, re-fetching the exact same data. Waiting for home to
 * finish first means studentId is already cached and semesterKey is
 * already its real value on the one fetch this actually needs.
 */
export function useSemesterScopedResource(fetchFn, semesterKey, enabled = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchFn()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, semesterKey, enabled])

  const refresh = useCallback(() => setAttempt((a) => a + 1), [])

  return { data, loading, error, refresh }
}
