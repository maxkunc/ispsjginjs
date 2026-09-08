/** Renders a value in the dot-matrix "LED Dots" font, used everywhere the
 * reference design shows a big segmented number (grades, percentages, counts).
 */
export default function DotNumber({ value, suffix = '', className = '' }) {
  const display = value === null || value === undefined || value === '' ? '–' : value

  return (
    <span className={`font-dots leading-none tabular-nums ${className}`}>
      {display}
      {suffix}
    </span>
  )
}
