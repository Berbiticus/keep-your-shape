import type { Level, PlayerRole } from '../types'
import { LEVEL_NAMES } from '../App'

interface Props {
  score: number
  maxScore: number
  scorePct: number
  levelPassed: boolean
  level: Level
  role: PlayerRole
  maxStreak: number
  highScore: number
  hasNextLevel: boolean
  onReplay: () => void
  onNextLevel: () => void
  onHome: () => void
}

function grade(pct: number): { label: string; emoji: string; color: string } {
  if (pct >= 85) return { label: 'World Class!',   emoji: '🏆', color: 'text-yellow-300' }
  if (pct >= 65) return { label: 'Great Game!',    emoji: '⭐', color: 'text-green-400'  }
  if (pct >= 45) return { label: 'Decent Run',     emoji: '👍', color: 'text-blue-400'   }
  return               { label: 'Keep Practicing', emoji: '💪', color: 'text-orange-400' }
}

const LEVEL_ICONS: Record<Level, string> = { 1: '🌱', 2: '🏅', 3: '🎓', 4: '🌟', 5: '👑' }

export default function EndScreen({
  score, maxScore, scorePct, levelPassed, level, role,
  maxStreak, highScore, hasNextLevel,
  onReplay, onNextLevel, onHome,
}: Props) {
  const g = grade(scorePct)
  const isNewHigh = score > 0 && score >= highScore
  const nextLevel = (level + 1) as Level
  const isMaxLevel = level === 5

  // Pass banner messaging
  const passedMaxLevel = levelPassed && isMaxLevel
  const justUnlocked   = levelPassed && !isMaxLevel

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-6 text-center gap-5">

      {/* Level context */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{LEVEL_ICONS[level]}</span>
        <span className="font-semibold text-gray-300">{LEVEL_NAMES[level]}</span>
        <span>·</span>
        <span className="capitalize">{role}</span>
      </div>

      {/* Grade */}
      <div>
        <div className="text-5xl mb-2">{g.emoji}</div>
        <h2 className={`text-3xl font-black ${g.color}`}>{g.label}</h2>
        {isNewHigh && (
          <div className="mt-2 inline-block bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1">
            <span className="text-yellow-300 font-bold text-sm">🎉 New High Score!</span>
          </div>
        )}
      </div>

      {/* Level pass / fail banner */}
      {passedMaxLevel ? (
        <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl px-5 py-3 max-w-xs w-full">
          <div className="text-2xl mb-1">👑</div>
          <p className="text-yellow-300 font-bold">Elite Complete!</p>
          <p className="text-yellow-400/80 text-xs mt-1">You've mastered all 5 levels for {role}.</p>
        </div>
      ) : justUnlocked ? (
        <div className="bg-green-500/20 border border-green-500/40 rounded-2xl px-5 py-3 max-w-xs w-full">
          <div className="text-2xl mb-1">{LEVEL_ICONS[nextLevel]}</div>
          <p className="text-green-300 font-bold">{LEVEL_NAMES[nextLevel]} Unlocked!</p>
          <p className="text-green-400/80 text-xs mt-1">{scorePct}% — nice work, keep going!</p>
        </div>
      ) : !levelPassed ? (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl px-5 py-3 max-w-xs w-full">
          <p className="text-orange-300 font-semibold text-sm">
            {scorePct}% — need 80% to unlock {LEVEL_NAMES[nextLevel]}
          </p>
          <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-orange-400 transition-all"
              style={{ width: `${Math.min(100, scorePct)}%` }}
            />
            {/* 80% marker */}
            <div className="relative">
              <div className="absolute top-[-8px] h-2 w-px bg-white/60" style={{ left: '80%' }} />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1">80% goal shown above</p>
        </div>
      ) : null}

      {/* Stats */}
      <div className="bg-gray-800/70 rounded-2xl px-5 py-4 max-w-xs w-full space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Score</span>
          <span className="text-white font-bold text-xl">{score} / {maxScore}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-green-500 transition-all"
            style={{ width: `${scorePct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className={scorePct >= 80 ? 'text-green-400 font-bold' : ''}>{scorePct}%</span>
          <span>100%</span>
        </div>
        {maxStreak > 0 && (
          <div className="flex justify-between items-center border-t border-gray-700 pt-3">
            <span className="text-gray-400 text-sm">Best Streak</span>
            <span className="text-orange-400 font-bold">🔥 {maxStreak}</span>
          </div>
        )}
        {highScore > 0 && (
          <div className="flex justify-between items-center border-t border-gray-700 pt-3">
            <span className="text-gray-400 text-sm">All-Time Best</span>
            <span className="text-yellow-400 font-bold">{Math.max(score, highScore)}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-2.5">
        {hasNextLevel && (
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-lg shadow-xl transition-colors"
          >
            {LEVEL_ICONS[nextLevel]} Try {LEVEL_NAMES[nextLevel]}
          </button>
        )}
        <button
          onClick={onReplay}
          className="w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-black text-lg shadow-xl transition-colors"
        >
          Play Again ▶
        </button>
        <button
          onClick={onHome}
          className="w-full py-2.5 rounded-2xl bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-300 font-semibold text-sm transition-colors"
        >
          Change Position / Level
        </button>
      </div>
    </div>
  )
}
