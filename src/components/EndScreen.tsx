interface Props {
  score: number
  maxStreak: number
  totalScenarios: number
  highScore: number
  onReplay: () => void
  onHome: () => void
}

function grade(score: number, max: number): { label: string; emoji: string; color: string } {
  const pct = max > 0 ? score / max : 0
  if (pct >= 0.85) return { label: 'World Class!',    emoji: '🏆', color: 'text-yellow-300' }
  if (pct >= 0.65) return { label: 'Great Game!',     emoji: '⭐', color: 'text-green-400'  }
  if (pct >= 0.45) return { label: 'Decent Run',      emoji: '👍', color: 'text-blue-400'   }
  return               { label: 'Keep Practicing',  emoji: '💪', color: 'text-orange-400' }
}

export default function EndScreen({ score, maxStreak, totalScenarios, highScore, onReplay, onHome }: Props) {
  const maxPossible = totalScenarios * 100
  const g = grade(score, maxPossible)
  const isNewHigh = score > 0 && score >= highScore

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center gap-6">

      {/* Result */}
      <div>
        <div className="text-6xl mb-2">{g.emoji}</div>
        <h2 className={`text-3xl font-black ${g.color}`}>{g.label}</h2>
        {isNewHigh && (
          <div className="mt-2 inline-block bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1">
            <span className="text-yellow-300 font-bold text-sm">🎉 New High Score!</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-800/70 rounded-2xl px-6 py-5 max-w-xs w-full space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total Score</span>
          <span className="text-white font-bold text-2xl">{score}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all"
            style={{ width: `${Math.min(100, (score / maxPossible) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{maxPossible} max</span>
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
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onReplay}
          className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-black text-xl shadow-xl transition-colors"
        >
          Play Again ▶
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-300 font-semibold text-base transition-colors"
        >
          Change Settings
        </button>
      </div>
    </div>
  )
}
