import { useNavigate } from 'react-router-dom'

export default function Header({ title, subtitle, back = true }: { title: string; subtitle?: string; back?: boolean }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 bg-ink/80 px-4 py-3 backdrop-blur">
      {back && (
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-lg ring-1 ring-white/10 active:scale-95"
        >
          &#8592;
        </button>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold leading-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
      </div>
    </header>
  )
}
