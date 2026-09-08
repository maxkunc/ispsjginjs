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
      <polygon points={`${markerPct * 2 - 4},2 ${markerPct * 2 + 4},2 ${markerPct * 2},9`} fill="currentColor" />
    </svg>
  )
}

function Slider({ markerPct = 50 }) {
  return (
    <svg viewBox="0 0 200 24" className="w-full h-6" preserveAspectRatio="none">
      {Array.from({ length: 34 }).map((_, i) => (
        <line key={i} x1={i * 6} y1="4" x2={i * 6} y2="16" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      ))}
      <polygon points={`${markerPct * 2 - 5},18 ${markerPct * 2 + 5},18 ${markerPct * 2},24`} fill="currentColor" />
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
 * One bento widget. `pos` places it absolutely inside the composition canvas
 * as percentages of the canvas box, matching the reference layout.
 */
export default function BentoCard({
  gradient = 'green',
  pos,
  title,
  subtitle,
  value,
  footer,
  cornerLabel,
  visual = 'none',
  visualProps = {},
  className = '',
  children,
}) {
  return (
    <div
      className={`absolute z-10 rounded-[28px] p-4 sm:p-5 text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] flex flex-col justify-between overflow-hidden ${GRADIENTS[gradient]} ${className}`}
      style={pos}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {title && <div className="text-[13px] sm:text-sm font-semibold leading-tight">{title}</div>}
          {subtitle && <div className="text-[11px] sm:text-xs text-white/70 leading-tight">{subtitle}</div>}
        </div>
        {cornerLabel && <div className="text-[10px] text-white/50">{cornerLabel}</div>}
      </div>

      {children ?? (
        <div className="flex items-center gap-2 my-1">
          {visual === 'dial' && <Dial {...visualProps} />}
          <div className="text-2xl sm:text-4xl font-dots leading-none">{value}</div>
        </div>
      )}

      <div className="space-y-1">
        {visual === 'wave' && <Wave {...visualProps} />}
        {visual === 'slider' && <Slider {...visualProps} />}
        {visual === 'scatter' && <Scatter {...visualProps} />}
        {footer && <div className="text-[11px] sm:text-xs text-white/60">{footer}</div>}
      </div>
    </div>
  )
}
