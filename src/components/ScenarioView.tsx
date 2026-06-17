import { useRef, useState, useCallback, useEffect } from 'react'
import type { Scenario, Position, ScoreLevel, Arrow } from '../types'

// ── Coordinate helpers ────────────────────────────────────────────────────────
// SVG viewport: 68 × 105 units (matches real pitch proportions in metres)
// Game coords: x 0–100 (left→right), y 0–100 (own goal → opp goal)
// SVG y is FLIPPED: opponent goal (y=100) is at SVG top (0).

const PW = 68   // pitch width in SVG units
const PH = 105  // pitch height in SVG units

function toSVG(pos: Position) {
  return { x: pos.x * PW / 100, y: (100 - pos.y) * PH / 100 }
}

function toGame(svgX: number, svgY: number): Position {
  return {
    x: Math.max(0, Math.min(100, svgX * 100 / PW)),
    y: Math.max(0, Math.min(100, 100 - svgY * 100 / PH)),
  }
}

// Euclidean distance in game-coordinate space
function dist(a: Position, b: Position) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// ── Scoring ───────────────────────────────────────────────────────────────────
function scoreLevel(d: number, radius: number): ScoreLevel {
  if (d <= radius)           return 'perfect'
  if (d <= radius * 1.5)     return 'good'
  if (d <= radius * 2.5)     return 'close'
  return 'miss'
}

const SCORE_POINTS: Record<ScoreLevel, number> = {
  perfect: 100,
  good: 60,
  close: 20,
  miss: 0,
}

const SCORE_LABEL: Record<ScoreLevel, string> = {
  perfect: 'Perfect!',
  good: 'Good!',
  close: 'Close…',
  miss: 'Not quite',
}

const SCORE_COLOR: Record<ScoreLevel, string> = {
  perfect: 'text-yellow-300',
  good: 'text-green-400',
  close: 'text-orange-400',
  miss: 'text-red-400',
}

// ── Pitch markings ────────────────────────────────────────────────────────────
// All measurements in SVG units (68 × 105).
// Opp goal = top (SVG y ≈ 0), Own goal = bottom (SVG y ≈ 105).
const LINE = 'rgba(255,255,255,0.82)'
const STRIPE_A = '#2d7a30'
const STRIPE_B = '#327d35'

function PitchMarkings() {
  // Alternating horizontal stripes (every 10 "metres" ≈ 10.5 SVG units)
  const stripes = Array.from({ length: 10 }, (_, i) => ({
    y: i * 10.5,
    fill: i % 2 === 0 ? STRIPE_A : STRIPE_B,
  }))

  return (
    <g>
      {/* Stripes */}
      {stripes.map((s, i) => (
        <rect key={i} x={0} y={s.y} width={PW} height={10.5} fill={s.fill} />
      ))}

      {/* Pitch outline */}
      <rect x={0} y={0} width={PW} height={PH} fill="none" stroke={LINE} strokeWidth={0.5} />

      {/* Halfway line */}
      <line x1={0} y1={PH / 2} x2={PW} y2={PH / 2} stroke={LINE} strokeWidth={0.4} />

      {/* Centre circle & spot */}
      <circle cx={PW / 2} cy={PH / 2} r={9.15} fill="none" stroke={LINE} strokeWidth={0.4} />
      <circle cx={PW / 2} cy={PH / 2} r={0.4} fill={LINE} />

      {/* ── OPPONENT (top) penalty box + 6-yard box + arc ─── */}
      {/* Penalty box */}
      <rect x={13.84} y={0} width={40.32} height={16.5} fill="none" stroke={LINE} strokeWidth={0.4} />
      {/* 6-yard box */}
      <rect x={24.84} y={0} width={18.32} height={5.5} fill="none" stroke={LINE} strokeWidth={0.4} />
      {/* Penalty spot */}
      <circle cx={PW / 2} cy={11} r={0.4} fill={LINE} />
      {/* Penalty arc (outside the box) */}
      <path
        d={`M ${13.84} ${16.5} A 9.15 9.15 0 0 1 ${PW - 13.84} ${16.5}`}
        fill="none" stroke={LINE} strokeWidth={0.4}
        clipPath="url(#clip-top-box)"
      />

      {/* ── OWN GOAL (bottom) penalty box + 6-yard box + arc ─── */}
      <rect x={13.84} y={PH - 16.5} width={40.32} height={16.5} fill="none" stroke={LINE} strokeWidth={0.4} />
      <rect x={24.84} y={PH - 5.5} width={18.32} height={5.5} fill="none" stroke={LINE} strokeWidth={0.4} />
      <circle cx={PW / 2} cy={PH - 11} r={0.4} fill={LINE} />
      <path
        d={`M ${13.84} ${PH - 16.5} A 9.15 9.15 0 0 0 ${PW - 13.84} ${PH - 16.5}`}
        fill="none" stroke={LINE} strokeWidth={0.4}
        clipPath="url(#clip-bot-box)"
      />

      {/* Corner arcs */}
      <path d={`M 0 ${1} A 1 1 0 0 1 ${1} 0`}       fill="none" stroke={LINE} strokeWidth={0.4} />
      <path d={`M ${PW - 1} 0 A 1 1 0 0 1 ${PW} ${1}`}   fill="none" stroke={LINE} strokeWidth={0.4} />
      <path d={`M 0 ${PH - 1} A 1 1 0 0 0 ${1} ${PH}`}   fill="none" stroke={LINE} strokeWidth={0.4} />
      <path d={`M ${PW - 1} ${PH} A 1 1 0 0 0 ${PW} ${PH - 1}`} fill="none" stroke={LINE} strokeWidth={0.4} />

      {/* Goals (drawn outside the pitch boundary) */}
      <rect x={30.34} y={-2.4} width={7.32} height={2.4} fill="none" stroke={LINE} strokeWidth={0.5} />
      <rect x={30.34} y={PH}   width={7.32} height={2.4} fill="none" stroke={LINE} strokeWidth={0.5} />

      {/* Attacking direction arrow (subtle, midfield left side) */}
      <text x={1.5} y={46} fontSize={3} fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">▲</text>
      <text x={1.5} y={60} fontSize={2} fill="rgba(255,255,255,0.20)" fontFamily="sans-serif">ATK</text>

      {/* Clip paths to hide penalty arcs inside the box */}
      <defs>
        <clipPath id="clip-top-box">
          <rect x={0} y={16.5} width={PW} height={PH} />
        </clipPath>
        <clipPath id="clip-bot-box">
          <rect x={0} y={0} width={PW} height={PH - 16.5} />
        </clipPath>
      </defs>
    </g>
  )
}

// ── Arrow layer ───────────────────────────────────────────────────────────────
// Renders animated directional arrows that show what key players are doing.
// Dashes flow toward the arrowhead to indicate movement direction.

function ArrowLayer({ arrows }: { arrows?: Arrow[] }) {
  if (!arrows || arrows.length === 0) return null

  return (
    <g>
      <defs>
        <marker
          id="ah-own"
          viewBox="0 0 10 10"
          refX="8" refY="5"
          markerWidth="5" markerHeight="5"
          orient="auto"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#93c5fd" />
        </marker>
        <marker
          id="ah-opp"
          viewBox="0 0 10 10"
          refX="8" refY="5"
          markerWidth="5" markerHeight="5"
          orient="auto"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#fca5a5" />
        </marker>
      </defs>

      {arrows.map((arrow, i) => {
        const from = toSVG(arrow.from)
        const to   = toSVG(arrow.to)
        const isOwn   = arrow.team === 'own'
        const color   = isOwn ? '#93c5fd' : '#fca5a5'
        const markerId = isOwn ? 'ah-own' : 'ah-opp'

        const d = arrow.controlPoint
          ? (() => {
              const cp = toSVG(arrow.controlPoint)
              return `M ${from.x} ${from.y} Q ${cp.x} ${cp.y} ${to.x} ${to.y}`
            })()
          : `M ${from.x} ${from.y} L ${to.x} ${to.y}`

        const animName = isOwn ? 'dash-flow-own' : 'dash-flow-opp'

        return (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={0.75}
            fill="none"
            strokeDasharray="3 2"
            markerEnd={`url(#${markerId})`}
            opacity={0.88}
            style={{ animation: `${animName} 0.9s linear infinite` }}
          />
        )
      })}
    </g>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  scenario: Scenario
  scenarioNumber: number
  totalScenarios: number
  score: number
  streak: number
  roleLabel: string
  onScored: (points: number, level: ScoreLevel) => void
  onNext: () => void
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ScenarioView({
  scenario,
  roleLabel,
  scenarioNumber,
  totalScenarios,
  score,
  streak,
  onScored,
  onNext,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  const [playerPos, setPlayerPos] = useState<Position>(scenario.start)
  const [isDragging, setIsDragging] = useState(false)
  const [phase, setPhase] = useState<'placing' | 'revealed'>('placing')
  const [result, setResult] = useState<{ level: ScoreLevel; points: number } | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  // Reset when scenario changes
  useEffect(() => {
    setPlayerPos(scenario.start)
    setPhase('placing')
    setResult(null)
    setIsDragging(false)
    setShowCelebration(false)
  }, [scenario])

  // Convert screen (clientX/Y) → game coords via SVG CTM
  const screenToGame = useCallback((clientX: number, clientY: number): Position | null => {
    if (!svgRef.current) return null
    const pt = svgRef.current.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse())
    return toGame(svgP.x, svgP.y)
  }, [])

  // Pointer down: move player immediately + start drag
  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    if (phase !== 'placing') return
    const pos = screenToGame(clientX, clientY)
    if (pos) {
      setPlayerPos(pos)
      setIsDragging(true)
    }
  }, [phase, screenToGame])

  // Pointer move: continue drag
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || phase !== 'placing') return
    const pos = screenToGame(clientX, clientY)
    if (pos) setPlayerPos(pos)
  }, [isDragging, phase, screenToGame])

  const handlePointerUp = useCallback(() => setIsDragging(false), [])

  // Mouse events on the SVG
  const onSVGMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handlePointerDown(e.clientX, e.clientY)
  }
  const onSVGMouseMove = (e: React.MouseEvent) => handlePointerMove(e.clientX, e.clientY)
  const onSVGMouseUp   = () => handlePointerUp()

  // Touch events — use refs to attach {passive: false} imperatively
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      handlePointerDown(t.clientX, t.clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      handlePointerMove(t.clientX, t.clientY)
    }
    const onTouchEnd = () => handlePointerUp()

    svg.addEventListener('touchstart', onTouchStart, { passive: false })
    svg.addEventListener('touchmove',  onTouchMove,  { passive: false })
    svg.addEventListener('touchend',   onTouchEnd,   { passive: false })
    return () => {
      svg.removeEventListener('touchstart', onTouchStart)
      svg.removeEventListener('touchmove',  onTouchMove)
      svg.removeEventListener('touchend',   onTouchEnd)
    }
  }, [handlePointerDown, handlePointerMove, handlePointerUp])

  // Lock it in
  const handleLock = () => {
    if (phase !== 'placing') return
    const d = dist(playerPos, scenario.target)
    const level = scoreLevel(d, scenario.target.radius)
    const points = SCORE_POINTS[level]
    setResult({ level, points })
    setPhase('revealed')
    onScored(points, level)
    if (level === 'perfect') {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2200)
    }
  }

  // SVG coordinates for rendering
  const svgBall    = toSVG(scenario.ball)
  const svgPlayer  = toSVG(playerPos)
  const svgTarget  = toSVG(scenario.target)
  const svgTargetRx = scenario.target.radius * PW / 100
  const svgTargetRy = scenario.target.radius * PH / 100

  return (
    <div className="flex flex-col h-full select-none">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {scenarioNumber}/{totalScenarios}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-700 text-gray-300">
            {roleLabel}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            scenario.phase === 'attacking'
              ? 'bg-blue-900/60 text-blue-300'
              : 'bg-red-900/60 text-red-300'
          }`}>
            {scenario.phase === 'attacking' ? '⚔' : '🛡'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <span className="text-orange-400 font-bold text-sm">
              🔥 {streak}
            </span>
          )}
          <span className="text-white font-bold text-sm">
            {score} pts
          </span>
        </div>
      </div>

      {/* ── Prompt ── */}
      <div className="px-4 py-2.5 bg-gray-800/70 text-center">
        <p className="text-white text-sm md:text-base font-medium leading-snug">
          {scenario.prompt}
        </p>
        {phase === 'placing' && (
          <p className="text-gray-400 text-xs mt-1">
            Tap or drag <span className="text-yellow-300 font-semibold">your player</span> to where you think they should go
          </p>
        )}
      </div>

      {/* ── Pitch ── */}
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 relative">
        {/* Celebration overlay */}
        {showCelebration && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="text-7xl animate-bounce">⚽</div>
            <div className="text-4xl font-black text-yellow-300 drop-shadow-lg mt-1 animate-pop-in">
              PERFECT!
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`-1 -3 ${PW + 2} ${PH + 5}`}
          className="h-full w-auto max-w-full"
          style={{ cursor: phase === 'placing' ? (isDragging ? 'grabbing' : 'crosshair') : 'default', touchAction: 'none' }}
          onMouseDown={onSVGMouseDown}
          onMouseMove={onSVGMouseMove}
          onMouseUp={onSVGMouseUp}
          onMouseLeave={onSVGMouseUp}
        >
          {/* Pitch markings */}
          <PitchMarkings />

          {/* ── Movement arrows ── */}
          <ArrowLayer arrows={scenario.arrows} />

          {/* ── Target zone (revealed after lock) ── */}
          {phase === 'revealed' && (
            <ellipse
              cx={svgTarget.x}
              cy={svgTarget.y}
              rx={svgTargetRx}
              ry={svgTargetRy}
              fill="rgba(34,197,94,0.30)"
              stroke="rgba(34,197,94,0.85)"
              strokeWidth={0.6}
              strokeDasharray="2 1.5"
            />
          )}

          {/* ── Opponents (red) ── */}
          {scenario.opponents.map((op, i) => {
            const p = toSVG(op)
            return (
              <g key={`op-${i}`}>
                <circle cx={p.x} cy={p.y} r={2.2} fill="#ef4444" stroke="white" strokeWidth={0.4} />
              </g>
            )
          })}

          {/* ── Teammates (blue) ── */}
          {scenario.teammates.map((tm, i) => {
            const p = toSVG(tm)
            return (
              <circle key={`tm-${i}`} cx={p.x} cy={p.y} r={2.2} fill="#3b82f6" stroke="white" strokeWidth={0.4} />
            )
          })}

          {/* ── Ball ── */}
          {(() => {
            const b = svgBall
            return (
              <g>
                <circle cx={b.x} cy={b.y} r={1.6} fill="white" stroke="#222" strokeWidth={0.5} />
                {/* Simple pentagon pattern */}
                <circle cx={b.x} cy={b.y} r={0.5} fill="#333" />
              </g>
            )
          })()}

          {/* ── Player (son) — draggable, pulsing ── */}
          {(() => {
            const p = svgPlayer
            return (
              <g style={{ cursor: phase === 'placing' ? 'grab' : 'default' }}>
                {/* Pulse rings (only during placing) */}
                {phase === 'placing' && (
                  <>
                    <circle
                      cx={p.x} cy={p.y} r={2.8}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth={0.5}
                      className="pulse-ring-1"
                    />
                    <circle
                      cx={p.x} cy={p.y} r={2.8}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth={0.5}
                      className="pulse-ring-2"
                    />
                  </>
                )}
                {/* Player body */}
                <circle
                  cx={p.x} cy={p.y} r={2.8}
                  fill="#fbbf24"
                  stroke="white"
                  strokeWidth={0.5}
                />
                {/* Star mark */}
                <text
                  x={p.x} y={p.y + 1}
                  fontSize={2.8}
                  textAnchor="middle"
                  fill="#1a1a1a"
                  fontWeight="bold"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  ★
                </text>
              </g>
            )
          })()}

          {/* Score indicator dot (after reveal) */}
          {phase === 'revealed' && result && (
            <circle
              cx={svgPlayer.x} cy={svgPlayer.y} r={4}
              fill="none"
              stroke={
                result.level === 'perfect' ? '#fbbf24' :
                result.level === 'good'    ? '#4ade80' :
                result.level === 'close'   ? '#fb923c' : '#f87171'
              }
              strokeWidth={0.8}
              opacity={0.85}
            />
          )}
        </svg>
      </div>

      {/* ── Bottom panel ── */}
      <div className="px-4 pb-4 pt-2 bg-gray-900/80 backdrop-blur-sm">
        {phase === 'placing' ? (
          <button
            onClick={handleLock}
            className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold text-lg shadow-lg transition-colors"
          >
            Lock it in ✓
          </button>
        ) : (
          <div className="space-y-3">
            {/* Score feedback */}
            {result && (
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-2xl font-black ${SCORE_COLOR[result.level]}`}>
                    {SCORE_LABEL[result.level]}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    +{result.points} pts
                  </span>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <span className="text-green-400 text-xs font-medium">● Ideal zone</span>
                </div>
              </div>
            )}

            {/* Principle tag */}
            <div className="text-xs text-gray-400">
              <span className="text-yellow-400 font-semibold">Principle: </span>
              {scenario.principle}
            </div>

            {/* Explanation */}
            <p className="text-gray-200 text-sm leading-relaxed">
              {scenario.explanation}
            </p>

            <button
              onClick={onNext}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-lg shadow-lg transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulse-ring-svg {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0;   }
        }
        .pulse-ring-1 {
          transform-origin: ${svgPlayer.x}px ${svgPlayer.y}px;
          animation: pulse-ring-svg 1.4s ease-out infinite;
        }
        .pulse-ring-2 {
          transform-origin: ${svgPlayer.x}px ${svgPlayer.y}px;
          animation: pulse-ring-svg 1.4s ease-out 0.7s infinite;
        }
        /* Dashes flow in the direction of each arrow (toward arrowhead) */
        @keyframes dash-flow-own {
          from { stroke-dashoffset: 5; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes dash-flow-opp {
          from { stroke-dashoffset: 5; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
