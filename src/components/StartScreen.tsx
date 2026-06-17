import type { PhaseFilter, PlayerRole, RoleProgress, Level, WingerSide } from '../types'
import { LEVEL_NAMES, DIFFICULTY } from '../App'

interface Props {
  highScore: number
  role: PlayerRole
  side: WingerSide
  phaseFilter: PhaseFilter
  selectedLevel: Level
  roleProgress: RoleProgress
  onRoleChange: (r: PlayerRole) => void
  onSideChange: (s: WingerSide) => void
  onFilterChange: (f: PhaseFilter) => void
  onLevelChange: (l: Level) => void
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

const LEVELS = ([1, 2, 3, 4, 5] as Level[])

// Compact description of what changes at each level
const LEVEL_HINTS: Record<Level, string> = {
  1: 'Wide target',
  2: 'Bit tighter',
  3: 'Standard',
  4: 'Precise',
  5: 'Pinpoint',
}

export default function StartScreen({
  highScore, role, side, phaseFilter, selectedLevel, roleProgress,
  onRoleChange, onSideChange, onFilterChange, onLevelChange, onStart,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-4 text-center gap-4 overflow-y-auto">

      {/* Title */}
      <div>
        <div className="text-4xl mb-1">⚽</div>
        <h1 className="text-3xl font-black text-white tracking-tight">Soccer IQ Trainer</h1>
        <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
          Pick your position and level, then tap or drag to the right spot.
        </p>
      </div>

      {/* Position picker */}
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Your position</p>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => onRoleChange(r.value)}
              className={`flex flex-col items-center py-2.5 px-2 rounded-xl text-sm font-semibold transition-colors ${
                role === r.value
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="text-xl mb-0.5">{r.emoji}</span>
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
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Which side?</p>
          <div className="flex gap-2">
            {(['left', 'right'] as WingerSide[]).map(s => (
              <button
                key={s}
                onClick={() => onSideChange(s)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                  side === s
                    ? 'bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {s === 'left' ? '← Left' : 'Right →'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level picker */}
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Difficulty level</p>
        <div className="flex gap-1.5">
          {LEVELS.map(lvl => {
            const locked   = roleProgress.unlocked < lvl
            const best     = roleProgress.best[lvl]
            const passed   = (best ?? 0) >= 80
            const active   = selectedLevel === lvl

            return (
              <button
                key={lvl}
                disabled={locked}
                onClick={() => !locked && onLevelChange(lvl)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-colors relative ${
                  locked
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : active
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {locked ? (
                  <>
                    <span className="text-base">🔒</span>
                    <span className="mt-0.5">{lvl}</span>
                  </>
                ) : (
                  <>
                    {/* green check if passed, star if active */}
                    <span className="text-base leading-none">
                      {passed ? '✅' : active ? '⭐' : <span className="text-gray-400">{lvl}</span>}
                    </span>
                    <span className={`font-bold mt-0.5 ${active ? 'text-white' : 'text-gray-300'}`}>
                      {LEVEL_NAMES[lvl]}
                    </span>
                    <span className={`text-[10px] mt-0.5 ${active ? 'text-blue-200' : 'text-gray-500'}`}>
                      {best !== undefined ? `${best}%` : LEVEL_HINTS[lvl]}
                    </span>
                    {/* difficulty ring hint */}
                    <span className={`text-[9px] mt-0.5 ${active ? 'text-blue-300' : 'text-gray-600'}`}>
                      {Math.round(DIFFICULTY[lvl] * 100)}% target
                    </span>
                  </>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-gray-600 text-xs mt-1.5">Score ≥80% to unlock the next level</p>
      </div>

      {/* Phase filter */}
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Practice focus</p>
        <div className="flex gap-2">
          {PHASES.map(f => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
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
        <p className="text-gray-500 text-xs">
          All-time best: <span className="text-yellow-400 font-bold">{highScore} pts</span>
        </p>
      )}

      {/* Start */}
      <button
        onClick={onStart}
        className="w-full max-w-sm py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-black text-xl shadow-xl transition-colors"
      >
        Kick Off! ▶
      </button>
    </div>
  )
}
