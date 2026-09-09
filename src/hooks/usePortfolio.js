import { api } from '../api/client.js'
import { useSemesterScopedResource } from './useSemesterScopedResource.js'

/**
 * @param {number|undefined} semesterKey - when this changes (e.g. the user
 * switched semesters), portfolio is refetched - it's semester-scoped on the
 * backend now, same as grades.
 * @param {boolean} enabled - wait for this before fetching (see
 * useSemesterScopedResource for why).
 */
export function usePortfolio(semesterKey, enabled = true) {
  return useSemesterScopedResource(api.portfolio, semesterKey, enabled)
}
