const ITEMS = [
  { key: 'subjects', grad: 'grad-teal', glyph: '▦', href: '#subjects' },
  { key: 'portfolio', grad: 'grad-yellow', glyph: '✦', href: '#portfolio' },
  { key: 'exams', grad: 'grad-maroon', glyph: '◰', href: '#exams' },
]

export default function IconCluster({ className = '', onLogout, t }) {
  return (
    <div
      className={`rounded-[28px] bg-black/85 backdrop-blur p-2.5 min-h-[150px] grid grid-cols-2 gap-2 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] ${className}`}
    >
      {ITEMS.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={`rounded-2xl ${item.grad} flex items-center justify-center text-white text-lg`}
        >
          {item.glyph}
        </a>
      ))}
      <button
        type="button"
        onClick={onLogout}
        title={t('logout')}
        className="rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-lg"
      >
        &#9099;
      </button>
    </div>
  )
}
