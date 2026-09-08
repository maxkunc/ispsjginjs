const GRADIENTS = {
  green: 'grad-green',
  red: 'grad-red',
  maroon: 'grad-maroon',
  olive: 'grad-olive',
  purple: 'grad-purple',
  teal: 'grad-teal',
  pink: 'grad-pink',
  blue: 'grad-blue',
  yellow: 'grad-yellow',
  brown: 'grad-brown',
  skyblue: 'grad-skyblue',
}

function Wave({ markerPct = 60 }) {
  return (
    <svg viewBox="0 0 200 40" className="w-full h-8" preserveAspectRatio="none">
      <path
        d="M0 22 C 20 4, 40 4, 55 20 S 90 36, 110 20 S 145 4, 165 18 S 190 30, 200 20"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <line x1={markerPct * 2} y1="2" x2={markerPct * 2} y2="38" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Slider({ markerPct = 50 }) {
  return (
    <svg viewBox="0 0 200 24" className="w-full h-6" preserveAspectRatio="none">
      {Array.from({ length: 34 }).map((_, i) => (
        <line key={i} x1={i * 6} y1="4" x2={i * 6} y2="16" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      ))}
      <line x1={markerPct * 2} y1="2" x2={markerPct * 2} y2="22" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Dial({ pct = 60 }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" strokeDasharray="1 6.2" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <circle cx="50" cy={50 - r} r="4" fill="currentColor" transform={`rotate(${(pct / 100) * 360} 50 50)`} />
    </svg>
  )
}

function Scatter({ seed = 1, count = 22 }) {
  const dots = Array.from({ length: count }).map((_, i) => {
    const x = ((Math.sin(seed * 999 + i * 57.13) + 1) / 2) * 100
    const y = ((Math.cos(seed * 431 + i * 91.7) + 1) / 2) * 100
    const r = 1.5 + ((Math.sin(seed * 12 + i) + 1) / 2) * 2.5
    return { x, y, r, key: i }
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
      {dots.map((d) => (
        <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill="currentColor" fillOpacity="0.85" />
      ))}
    </svg>
  )
}

/**
 * One bento widget - a normal grid item. `className` carries its grid
 * placement (e.g. "col-span-12 sm:col-span-6 lg:col-span-3"). `large`
 * marks it as one of the dashboard's primary cards - bigger padding,
 * bolder/larger title and value text.
 */
export default function BentoCard({
  gradient = 'green',
  title,
  subtitle,
  value,
  footer,
  cornerLabel,
  visual = 'none',
  visualProps = {},
  className = '',
  large = false,
  children,
}) {
  return (
    <div
      className={`rounded-[28px] text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] flex flex-col justify-between overflow-hidden ${GRADIENTS[gradient]} ${
        large ? 'p-5 sm:p-7 min-h-[190px]' : 'p-4 sm:p-5 min-h-[150px]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {title && (
            <div className={large ? 'text-base sm:text-lg font-bold leading-tight' : 'text-[13px] sm:text-sm font-semibold leading-tight'}>
              {title}
            </div>
          )}
          {subtitle && <div className={large ? 'text-xs sm:text-sm text-white/70 leading-tight' : 'text-[11px] sm:text-xs text-white/70 leading-tight'}>{subtitle}</div>}
        </div>
        {cornerLabel && <div className="text-[10px] text-white/50">{cornerLabel}</div>}
      </div>

      {children ?? (
        <div className="flex items-center gap-2 my-1">
          {visual === 'dial' && <Dial {...visualProps} />}
          <div className={`min-w-0 font-dots leading-none ${large ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-4xl'}`}>{value}</div>
        </div>
      )}

      <div className="space-y-1">
        {visual === 'wave' && <Wave {...visualProps} />}
        {visual === 'slider' && <Slider {...visualProps} />}
        {visual === 'scatter' && <Scatter {...visualProps} />}
        {footer && <div className={large ? 'text-xs sm:text-sm text-white/60' : 'text-[11px] sm:text-xs text-white/60'}>{footer}</div>}
      </div>
    </div>
  )
}
