import type { PhaseFilter } from '../types'

interface Props {
  highScore: number
  phaseFilter: PhaseFilter
  onFilterChange: (f: PhaseFilter) => void
  onStart: () => void
}

const FILTERS: { value: PhaseFilter; label: string; emoji: string }[] = [
  { value: 'all',       label: 'All',       emoji: '⚽' },
  { value: 'attacking', label: 'Attacking', emoji: '⚔️' },
  { value: 'defending', label: 'Defending', emoji: '🛡️' },
]

export default function StartScreen({ highScore, phaseFilter, onFilterChange, onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center gap-6">

      {/* Title */}
      <div>
        <div className="text-6xl mb-3">⚽</div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Soccer IQ Trainer
        </h1>
        <p className="text-gray-400 text-base mt-2 max-w-xs mx-auto">
          Test your positioning as a winger &amp; forward. Tap where you think
          you should go — then see how you did!
        </p>
      </div>

      {/* How to play */}
      <div className="bg-gray-800/70 rounded-2xl px-5 py-4 max-w-xs w-full text-left space-y-1.5">
        <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
          How it works
        </p>
        {[
          ['1', 'Read the situation on the pitch'],
          ['2', 'Tap or drag the ★ player to the right spot'],
          ['3', 'Hit "Lock it in" and see your score'],
          ['4', 'Stack up points and keep your streak!'],
        ].map(([n, text]) => (
          <div key={n} className="flex items-start gap-2.5">
            <span className="text-yellow-400 font-bold text-sm w-4 shrink-0">{n}.</span>
            <span className="text-gray-300 text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* Phase filter */}
      <div className="w-full max-w-xs">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Practice focus
        </p>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                phaseFilter === f.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f.emoji} {f.label}
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

      {/* Start button */}
      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-black text-xl shadow-xl transition-colors"
      >
        Kick Off! ▶
      </button>
    </div>
  )
}
