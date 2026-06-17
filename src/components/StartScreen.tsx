import type { PhaseFilter, PlayerRole, WingerSide } from '../types'

interface Props {
  highScore: number
  role: PlayerRole
  side: WingerSide
  phaseFilter: PhaseFilter
  onRoleChange: (r: PlayerRole) => void
  onSideChange: (s: WingerSide) => void
  onFilterChange: (f: PhaseFilter) => void
  onStart: () => void
}

const ROLES: { value: PlayerRole; label: string; emoji: string; description: string }[] = [
  { value: 'striker',    label: 'Striker',    emoji: '⚽', description: 'Runs, finishing, hold-up' },
  { value: 'midfielder', label: 'Midfielder', emoji: '🔄', description: 'Combine, press, cover' },
  { value: 'winger',     label: 'Winger',     emoji: '⚡', description: 'Width, crosses, tracking' },
  { value: 'defender',   label: 'Defender',   emoji: '🛡️', description: 'Hold line, intercept, FB runs' },
]

const PHASES: { value: PhaseFilter; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'attacking', label: 'Attacking' },
  { value: 'defending', label: 'Defending' },
]

export default function StartScreen({
  highScore, role, side, phaseFilter,
  onRoleChange, onSideChange, onFilterChange, onStart,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6 text-center gap-5 overflow-y-auto">

      {/* Title */}
      <div>
        <div className="text-5xl mb-2">⚽</div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Soccer IQ Trainer
        </h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
          Pick your position, then tap or drag your player to the right spot.
        </p>
      </div>

      {/* Position picker */}
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Your position
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => onRoleChange(r.value)}
              className={`flex flex-col items-center py-3 px-2 rounded-xl text-sm font-semibold transition-colors ${
                role === r.value
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="text-2xl mb-1">{r.emoji}</span>
              <span className="font-bold">{r.label}</span>
              <span className={`text-xs mt-0.5 ${role === r.value ? 'text-blue-200' : 'text-gray-500'}`}>
                {r.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Side picker — only for winger */}
      {role === 'winger' && (
        <div className="w-full max-w-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Which side?
          </p>
          <div className="flex gap-2">
            {(['left', 'right'] as WingerSide[]).map(s => (
              <button
                key={s}
                onClick={() => onSideChange(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  side === s
                    ? 'bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {s === 'left' ? '← Left Winger' : 'Right Winger →'}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-1.5">
            Scenarios automatically flip for left or right side.
          </p>
        </div>
      )}

      {/* Phase filter */}
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Practice focus
        </p>
        <div className="flex gap-2">
          {PHASES.map(f => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                phaseFilter === f.value
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* High score */}
      {highScore > 0 && (
        <p className="text-gray-500 text-sm">
          Best score: <span className="text-yellow-400 font-bold">{highScore}</span>
        </p>
      )}

      {/* Start */}
      <button
        onClick={onStart}
        className="w-full max-w-sm py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-black text-xl shadow-xl transition-colors"
      >
        Kick Off! ▶
      </button>
    </div>
  )
}
