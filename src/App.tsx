import { useState, useCallback, useEffect } from 'react'
import type {
  PhaseFilter, PlayerRole, Progress, Level, RoleProgress,
  ScoreLevel, Screen, WingerSide, Scenario, Arrow, Position as Pos,
} from './types'
import allScenarios from './data/scenarios'
import StartScreen from './components/StartScreen'
import ScenarioView from './components/ScenarioView'
import EndScreen from './components/EndScreen'

// ── Constants ─────────────────────────────────────────────────────────────────

const HS_KEY       = 'socceriq-highscore'
const PROGRESS_KEY = 'socceriq-progress'

export const LEVEL_NAMES: Record<Level, string> = {
  1: 'Grassroots',
  2: 'Club',
  3: 'Academy',
  4: 'Pro',
  5: 'Elite',
}

// Target radius multiplier per level — lower = tighter precision required
export const DIFFICULTY: Record<Level, number> = {
  1: 1.5,
  2: 1.2,
  3: 1.0,
  4: 0.75,
  5: 0.55,
}

const ROLE_LABEL: Record<PlayerRole, string> = {
  striker:    '⚽ Striker',
  midfielder: '🔄 Mid',
  winger:     '⚡ Winger',
  defender:   '🛡 Defender',
}

// ── Persistence ───────────────────────────────────────────────────────────────

function loadHighScore(): number {
  try { return parseInt(localStorage.getItem(HS_KEY) ?? '0', 10) || 0 }
  catch { return 0 }
}
function saveHighScore(n: number) {
  try { localStorage.setItem(HS_KEY, String(n)) } catch { /* noop */ }
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as Progress) : {}
  } catch { return {} }
}
function saveProgress(p: Progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) } catch { /* noop */ }
}

export function getRoleProgress(progress: Progress, role: PlayerRole): RoleProgress {
  return progress[role] ?? { unlocked: 1, best: {} }
}

// ── Scenario helpers ──────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function flipPos(p: Pos): Pos { return { x: 100 - p.x, y: p.y } }

function flipArrow(a: Arrow): Arrow {
  return {
    ...a,
    from: flipPos(a.from),
    to:   flipPos(a.to),
    controlPoint: a.controlPoint ? flipPos(a.controlPoint) : undefined,
  }
}

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

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen]               = useState<Screen>('start')
  const [role, setRole]                   = useState<PlayerRole>('winger')
  const [side, setSide]                   = useState<WingerSide>('right')
  const [selectedLevel, setSelectedLevel] = useState<Level>(1)
  const [phaseFilter, setPhaseFilter]     = useState<PhaseFilter>('all')
  const [progress, setProgress]           = useState<Progress>(loadProgress)

  const [queue, setQueue]       = useState<Scenario[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore]       = useState(0)
  const [streak, setStreak]     = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [highScore, setHighScore] = useState(loadHighScore)

  // Derived end-screen values
  const maxScore = queue.length * 100
  const scorePct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const levelPassed = scorePct >= 80

  const buildPool = useCallback(() => {
    let pool = allScenarios.filter(s => {
      if (s.role !== role) return false
      if (phaseFilter !== 'all' && s.phase !== phaseFilter) return false
      return true
    })
    if (pool.length === 0) pool = allScenarios.filter(s => s.role === role)
    if (role === 'winger' && side === 'left') pool = pool.map(mirrorScenario)
    return shuffle(pool)
  }, [role, side, phaseFilter])

  const startGame = useCallback((overrideLevel?: Level) => {
    setQueue(buildPool())
    setCurrentIdx(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    if (overrideLevel !== undefined) setSelectedLevel(overrideLevel)
    setScreen('game')
  }, [buildPool])

  const handleRoleChange = useCallback((r: PlayerRole) => {
    setRole(r)
    setSelectedLevel(1)
  }, [])

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

  // Persist high score and level progress when a session ends
  useEffect(() => {
    if (screen !== 'end') return

    if (score > highScore) { saveHighScore(score); setHighScore(score) }

    setProgress(prev => {
      const rp = prev[role] ?? { unlocked: 1 as Level, best: {} }
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
      const newBest = Math.max(rp.best[selectedLevel] ?? 0, pct)
      const passed = pct >= 80
      const nextLvl = (selectedLevel + 1) as Level
      const shouldUnlock = passed && selectedLevel < 5 && rp.unlocked < nextLvl
      const newUnlocked: Level = shouldUnlock ? nextLvl : rp.unlocked
      const updated: RoleProgress = {
        unlocked: Math.max(rp.unlocked, newUnlocked) as Level,
        best: { ...rp.best, [selectedLevel]: newBest },
      }
      const next = { ...prev, [role]: updated }
      saveProgress(next)
      return next
    })
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay    = useCallback(() => startGame(), [startGame])
  const handleHome      = useCallback(() => setScreen('start'), [])
  const handleNextLevel = useCallback(() => {
    const next = Math.min(5, selectedLevel + 1) as Level
    startGame(next)
  }, [selectedLevel, startGame])

  const roleLabel = role === 'winger'
    ? (side === 'left' ? '⚡ LW' : '⚡ RW')
    : ROLE_LABEL[role]

  const rp = getRoleProgress(progress, role)

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden flex flex-col">
      {screen === 'start' && (
        <StartScreen
          highScore={highScore}
          role={role}
          side={side}
          phaseFilter={phaseFilter}
          selectedLevel={selectedLevel}
          roleProgress={rp}
          onRoleChange={handleRoleChange}
          onSideChange={setSide}
          onFilterChange={setPhaseFilter}
          onLevelChange={setSelectedLevel}
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
          roleLabel={roleLabel}
          level={selectedLevel}
          difficultyMult={DIFFICULTY[selectedLevel]}
          onScored={handleScored}
          onNext={handleNext}
        />
      )}

      {screen === 'end' && (
        <EndScreen
          score={score}
          maxScore={maxScore}
          scorePct={scorePct}
          levelPassed={levelPassed}
          level={selectedLevel}
          role={role}
          maxStreak={maxStreak}
          highScore={highScore}
          hasNextLevel={selectedLevel < 5 && rp.unlocked >= Math.min(5, selectedLevel + 1) as unknown as boolean}
          onReplay={handleReplay}
          onNextLevel={handleNextLevel}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
