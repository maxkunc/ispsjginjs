/** Parses is.psjg.cz-style percentage strings ("91,75%", "-", "N") into a 0-100 number, or null. */
export function parsePercent(value) {
  if (value === null || value === undefined) return null
  const str = String(value).trim()
  if (!str || str === '-' || str === 'N') return null
  const num = parseFloat(str.replace('%', '').replace(',', '.'))
  return Number.isFinite(num) ? num : null
}
