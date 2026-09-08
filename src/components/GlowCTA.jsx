export default function GlowCTA({ className = '', onClick, label }) {
  return (
    <div className={`min-h-[150px] flex items-center justify-center ${className}`}>
      <button
        type="button"
        onClick={onClick}
        title={label}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-black"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #d9ff5c, #7be0c9 70%)',
          boxShadow: '0 0 40px 6px rgba(180,255,150,0.45)',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)" />
        </svg>
      </button>
    </div>
  )
}
