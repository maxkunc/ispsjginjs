import { api } from '../api/client.js'
import { useSemesterScopedResource } from './useSemesterScopedResource.js'

/**
 * @param {number|undefined} semesterKey - refetches Zkoušení (oral exam
 * schedule) when the selected semester changes, same as portfolio/grades.
 */
export function useZkouseni(semesterKey) {
  return useSemesterScopedResource(api.zkouseni, semesterKey)
}
