import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'

/**
 * @param {number|undefined} semesterKey - when this changes (e.g. the user
 * switched semesters), portfolio is refetched - it's semester-scoped on the
 * backend now, same as grades.
 */
export function usePortfolio(semesterKey) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .portfolio()
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
  }, [attempt, semesterKey])

  const refresh = useCallback(() => setAttempt((a) => a + 1), [])

  return { data, loading, error, refresh }
}
