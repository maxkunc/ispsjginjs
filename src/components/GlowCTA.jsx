export default function GlowCTA({ pos, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="absolute z-10 rounded-full flex items-center justify-center text-black"
      style={{
        ...pos,
        background: 'radial-gradient(circle at 35% 30%, #d9ff5c, #7be0c9 70%)',
        boxShadow: '0 0 40px 6px rgba(180,255,150,0.45)',
      }}
    >
      <svg viewBox="0 0 24 24" className="w-1/3 h-1/3" fill="currentColor">
        <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)" />
      </svg>
    </button>
  )
}
