import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'

export function useHomeData() {
  const [data, setData] = useState(null)
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

  return { data, loading, error, page, setPage: (p) => load(p), refresh: () => load(page), switchSemester }
}
