import { useState, useCallback, useEffect } from 'react'
import type { PhaseFilter, PlayerRole, ScoreLevel, Screen, WingerSide, Scenario, Arrow, Position as Pos } from './types'
import allScenarios from './data/scenarios'
import StartScreen from './components/StartScreen'
import ScenarioView from './components/ScenarioView'
import EndScreen from './components/EndScreen'

const HS_KEY = 'socceriq-highscore'

const ROLE_LABEL: Record<PlayerRole, string> = {
  striker:    '⚽ Striker',
  midfielder: '🔄 Mid',
  winger:     '⚡ Winger',
  defender:   '🛡 Defender',
}

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

// Flip a position around the vertical centre line: x → 100 − x
function flipPos(p: Pos): Pos {
  return { x: 100 - p.x, y: p.y }
}

function flipArrow(a: Arrow): Arrow {
  return {
    ...a,
    from: flipPos(a.from),
    to:   flipPos(a.to),
    controlPoint: a.controlPoint ? flipPos(a.controlPoint) : undefined,
  }
}

// Mirror every coordinate so a right-winger scenario becomes a left-winger one
function mirrorScenario(s: Scenario): Scenario {
  return {
    ...s,
    id: s.id + '-L',
    ball:      flipPos(s.ball),
    teammates: s.teammates.map(flipPos),
    opponents: s.opponents.map(flipPos),
    start:     flipPos(s.start),
    target:    { ...flipPos(s.target), radius: s.target.radius },
    arrows:    s.arrows?.map(flipArrow),
  }
}

export default function App() {
  const [screen, setScreen]           = useState<Screen>('start')
  const [role, setRole]               = useState<PlayerRole>('winger')
  const [side, setSide]               = useState<WingerSide>('right')
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all')
  const [queue, setQueue]             = useState<Scenario[]>([])
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [score, setScore]             = useState(0)
  const [streak, setStreak]           = useState(0)
  const [maxStreak, setMaxStreak]     = useState(0)
  const [highScore, setHighScore]     = useState(loadHighScore)

  const buildQueue = useCallback(() => {
    let pool = allScenarios.filter(s => {
      if (s.role !== role) return false
      if (phaseFilter !== 'all' && s.phase !== phaseFilter) return false
      return true
    })

    // Fall back to all scenarios for this role if the phase filter leaves nothing
    if (pool.length === 0) {
      pool = allScenarios.filter(s => s.role === role)
    }

    // Mirror every scenario for left winger
    if (role === 'winger' && side === 'left') {
      pool = pool.map(mirrorScenario)
    }

    return shuffle(pool)
  }, [role, side, phaseFilter])

  const startGame = useCallback(() => {
    setQueue(buildQueue())
    setCurrentIdx(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setScreen('game')
  }, [buildQueue])

  const handleScored = useCallback((points: number, level: ScoreLevel) => {
    setScore(s => s + points)
    setStreak(prev => {
      const next = level === 'perfect' || level === 'good' ? prev + 1 : 0
      setMaxStreak(m => Math.max(m, next))
      return next
    })
  }, [])

  const handleNext = useCallback(() => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= queue.length) {
      setScreen('end')
    } else {
      setCurrentIdx(nextIdx)
    }
  }, [currentIdx, queue.length])

  // Persist high score when session ends
  useEffect(() => {
    if (screen !== 'end') return
    if (score > highScore) {
      saveHighScore(score)
      setHighScore(score)
    }
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay = useCallback(() => startGame(), [startGame])
  const handleHome   = useCallback(() => setScreen('start'), [])

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden flex flex-col">
      {screen === 'start' && (
        <StartScreen
          highScore={highScore}
          role={role}
          side={side}
          phaseFilter={phaseFilter}
          onRoleChange={setRole}
          onSideChange={setSide}
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
          roleLabel={role === 'winger' ? (side === 'left' ? '⚡ LW' : '⚡ RW') : ROLE_LABEL[role]}
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
