// Zkoušení (oral exam) dates come from is.psjg.cz as free-text table cells
// in Czech D.M.YYYY style (matches the same date format used throughout the
// grade CSV exports). Pull the date out with a regex rather than assuming
// the whole cell is exactly that format, since the real markup may carry
// extra text (a weekday prefix, whitespace) around it.
const DATE_RE = /(\d{1,2})\.(\d{1,2})\.(\d{4})/

export function parseExamDate(dateStr) {
  if (!dateStr) return null
  const m = DATE_RE.exec(String(dateStr))
  if (!m) return null
  const [, day, month, year] = m
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

// "Future" includes today - an exam scheduled for today hasn't happened
// yet from the student's point of view.
export function isFutureExam(dateStr, now = new Date()) {
  const examDate = parseExamDate(dateStr)
  if (!examDate) return false
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return examDate.getTime() >= startOfToday.getTime()
}
