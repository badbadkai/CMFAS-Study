import { useNavigate } from 'react-router-dom'
import { modules } from '../data/modules'

export default function ModuleSelect() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-1 flex-col px-4">
      <div className="px-1 pb-6 pt-10">
        <h1 className="text-3xl font-black tracking-tight">CMFAS Study</h1>
        <p className="mt-1 text-sm text-slate-400">Pick a module to work on today.</p>
      </div>
      <div className="grid gap-3">
        {modules.map((m) => (
          <button
            key={m.id}
            disabled={!m.available}
            onClick={() => navigate(`/m/${m.id}`)}
            className={`tile flex items-center justify-between ${!m.available ? 'opacity-40' : ''}`}
          >
            <span>
              <span className="text-xl font-bold">{m.name}</span>
              <span className="mt-0.5 block text-sm text-slate-400">{m.subtitle}</span>
            </span>
            <span className="text-slate-500">{m.available ? '\u203A' : 'soon'}</span>
          </button>
        ))}
      </div>
      <p className="mt-auto py-6 text-center text-xs text-slate-600">Offline-ready. Add to Home Screen to install.</p>
    </div>
  )
}
