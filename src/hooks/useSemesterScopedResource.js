import { useCallback, useEffect, useState } from 'react'

/**
 * Fetch-on-mount, refetch-on-semester-change, manual-refresh hook shared by
 * every /api/* resource that's scoped to the currently selected semester
 * (portfolio, zkoušení, ...).
 *
 * @param {() => Promise<any>} fetchFn
 * @param {number|undefined} semesterKey - when this changes (e.g. the user
 * switched semesters), the resource is refetched.
 */
export function useSemesterScopedResource(fetchFn, semesterKey) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
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
  }, [attempt, semesterKey])

  const refresh = useCallback(() => setAttempt((a) => a + 1), [])

  return { data, loading, error, refresh }
}
