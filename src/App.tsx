import { useState, useCallback, useEffect } from 'react'
import type { PhaseFilter, ScoreLevel, Screen } from './types'
import allScenarios from './data/scenarios'
import StartScreen from './components/StartScreen'
import ScenarioView from './components/ScenarioView'
import EndScreen from './components/EndScreen'

const HS_KEY = 'socceriq-highscore'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadHighScore(): number {
  try { return parseInt(localStorage.getItem(HS_KEY) ?? '0', 10) || 0 }
  catch { return 0 }
}

function saveHighScore(n: number) {
  try { localStorage.setItem(HS_KEY, String(n)) } catch { /* noop */ }
}

export default function App() {
  const [screen, setScreen]           = useState<Screen>('start')
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all')
  const [queue, setQueue]             = useState(allScenarios)
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [score, setScore]             = useState(0)
  const [streak, setStreak]           = useState(0)
  const [maxStreak, setMaxStreak]     = useState(0)
  const [highScore, setHighScore]     = useState(loadHighScore)

  const startGame = useCallback(() => {
    const filtered = phaseFilter === 'all'
      ? allScenarios
      : allScenarios.filter((s) => s.phase === phaseFilter)

    const q = shuffle(filtered.length > 0 ? filtered : allScenarios)
    setQueue(q)
    setCurrentIdx(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setScreen('game')
  }, [phaseFilter])

  const handleScored = useCallback((points: number, level: ScoreLevel) => {
    setScore((s) => s + points)
    setStreak((prev) => {
      const next = level === 'perfect' || level === 'good' ? prev + 1 : 0
      setMaxStreak((m) => Math.max(m, next))
      return next
    })
  }, [])

  const handleNext = useCallback(() => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= queue.length) {
      // End of session — persist high score via effect-free flush
      setScreen('end')
    } else {
      setCurrentIdx(nextIdx)
    }
  }, [currentIdx, queue.length])

  // Persist high score when game ends
  useEffect(() => {
    if (screen !== 'end') return
    if (score > highScore) {
      saveHighScore(score)
      setHighScore(score)
    }
  }, [screen]) // intentionally omit score/highScore to read latest at transition

  const handleReplay = useCallback(() => {
    startGame()
  }, [startGame])

  const handleHome = useCallback(() => {
    setScreen('start')
  }, [])

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden flex flex-col">
      {screen === 'start' && (
        <StartScreen
          highScore={highScore}
          phaseFilter={phaseFilter}
          onFilterChange={setPhaseFilter}
          onStart={startGame}
        />
      )}

      {screen === 'game' && queue[currentIdx] && (
        <ScenarioView
          key={queue[currentIdx].id + currentIdx}
          scenario={queue[currentIdx]}
          scenarioNumber={currentIdx + 1}
          totalScenarios={queue.length}
          score={score}
          streak={streak}
          onScored={handleScored}
          onNext={handleNext}
        />
      )}

      {screen === 'end' && (
        <EndScreen
          score={score}
          maxStreak={maxStreak}
          totalScenarios={queue.length}
          highScore={highScore}
          onReplay={handleReplay}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
