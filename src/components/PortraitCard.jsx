/** Reference has a real portrait photo here; we don't have one, so this is an
 * abstract gradient mark instead (avoids depicting a fake specific person).
 */
export default function PortraitCard({ className = '', initial = '?' }) {
  return (
    <div
      className={`relative rounded-[28px] min-h-[150px] overflow-hidden grad-red shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div className="absolute inset-0 grad-maroon opacity-70 mix-blend-multiply" />
      <div
        className="absolute -bottom-6 -right-6 w-2/3 h-2/3 rounded-full blur-2xl opacity-60"
        style={{ background: 'radial-gradient(circle, #ff9d6c, transparent 70%)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-dots text-white/90 text-5xl">{initial}</span>
      </div>
    </div>
  )
}
