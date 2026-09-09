import { api } from '../api/client.js'
import { useSemesterScopedResource } from './useSemesterScopedResource.js'

/**
 * @param {number|undefined} semesterKey - refetches Zkoušení (oral exam
 * schedule) when the selected semester changes, same as portfolio/grades.
 * @param {boolean} enabled - wait for this before fetching (see
 * useSemesterScopedResource for why).
 */
export function useZkouseni(semesterKey, enabled = true) {
  return useSemesterScopedResource(api.zkouseni, semesterKey, enabled)
}
