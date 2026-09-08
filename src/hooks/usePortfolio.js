import { api } from '../api/client.js'
import { useSemesterScopedResource } from './useSemesterScopedResource.js'

/**
 * @param {number|undefined} semesterKey - when this changes (e.g. the user
 * switched semesters), portfolio is refetched - it's semester-scoped on the
 * backend now, same as grades.
 */
export function usePortfolio(semesterKey) {
  return useSemesterScopedResource(api.portfolio, semesterKey)
}
