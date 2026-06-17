import { useEffect, useRef, useState } from 'react'
import type { Scenario } from '../types'

// ── Constants ─────────────────────────────────────────────────────────────────
// Projection: camera always looks toward the opponent goal (y=100 in game coords).
// This keeps the scene stable and always shows the relevant space ahead of the player.
// When the ball is behind the camera, a direction badge tells the player where it is.

const PITCH_W_M = 68   // pitch width in metres
const PITCH_L_M = 105  // pitch length in metres
const CAM_H     = 1.7  // eye height in metres
const PLAY_H    = 1.5  // average player height
const NEAR      = 0.4  // near-clip in metres

// Goal: 7.32m wide, 2.44m tall, centred at x=50
const GOAL_HALF_W = 3.66                             // half width in metres
const GOAL_H_M    = 2.44
const GOAL_L_GX   = 50 - GOAL_HALF_W * (100 / PITCH_W_M)  // ≈ 44.6
const GOAL_R_GX   = 50 + GOAL_HALF_W * (100 / PITCH_W_M)  // ≈ 55.4

// ── Projection ────────────────────────────────────────────────────────────────
// Camera looks in +Y direction (toward y=100). No rotation needed.
//   depth   = (gy - camGy) * PITCH_L_M/100   (metres ahead)
//   lateral = (gx - camGx) * PITCH_W_M/100   (metres right)
//   screen_x = vw/2 + FOCAL * lateral / depth
//   screen_y = HORIZON + FOCAL * (CAM_H - h) / depth

interface SP { x: number; y: number; depth: number }

function project(
  gx: number, gy: number, h: number,
  camGx: number, camGy: number,
  vw: number, horizon: number, focal: number,
): SP | null {
  const depth   = (gy - camGy) * (PITCH_L_M / 100)
  const lateral = (gx - camGx) * (PITCH_W_M / 100)
  if (depth < NEAR) return null
  return {
    x: vw / 2 + (lateral / depth) * focal,
    y: horizon + ((CAM_H - h) / depth) * focal,
    depth,
  }
}

// Build an SVG "M L L …" path for a list of [gx,gy] game coords
function makePath(
  pts: [number, number][], h: number,
  camGx: number, camGy: number,
  vw: number, vh: number, horizon: number, focal: number,
): string {
  const segs: string[] = []
  let pen = false
  for (const [gx, gy] of pts) {
    const sp = project(gx, gy, h, camGx, camGy, vw, horizon, focal)
    if (!sp || sp.y < horizon - 2 || sp.y > vh + 30) { pen = false; continue }
    segs.push(`${pen ? 'L' : 'M'}${sp.x.toFixed(1)},${sp.y.toFixed(1)}`)
    pen = true
  }
  return segs.join('')
}

function linePts(a: number, b: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1))
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  scenario: Scenario
  onDone: () => void
  autoDuration?: number
}

export default function GroundView({ scenario, onDone, autoDuration = 5000 }: Props) {
  // Measure actual container so the SVG fills it exactly — no letterboxing
  const containerRef = useRef<HTMLDivElement>(null)
  const [vw, setVw] = useState(390)
  const [vh, setVh] = useState(480)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      setVw(el.clientWidth  || 390)
      setVh(el.clientHeight || 480)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Progress timer
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())
  useEffect(() => {
    startRef.current = Date.now()
    setElapsed(0)
    const id = setInterval(() => {
      const e = Date.now() - startRef.current
      setElapsed(e)
      if (e >= autoDuration) { clearInterval(id); onDone() }
    }, 60)
    return () => clearInterval(id)
  }, [scenario, autoDuration, onDone])

  // Derived perspective params — scale with container
  const horizon = Math.round(vh * 0.27)
  const focal   = Math.round(vw * 0.22)

  const camGx = scenario.start.x
  const camGy = scenario.start.y

  const proj = (gx: number, gy: number, h = 0) =>
    project(gx, gy, h, camGx, camGy, vw, horizon, focal)

  // ── Ground polygon ──
  // Near edge: screen bottom corners (near-infinite depth near the camera)
  // Far edge: projected pitch corners at y=100
  const farL = proj(0,   100, 0)
  const farR = proj(100, 100, 0)
  const clampX = (p: SP | null, fb: number) =>
    p ? Math.max(-80, Math.min(vw + 80, p.x)) : fb
  const clampY = (p: SP | null) =>
    p ? Math.min(vh, Math.max(horizon, p.y)) : horizon

  const groundPoly = [
    `0,${vh}`,
    `${vw},${vh}`,
    `${clampX(farR, vw)},${clampY(farR)}`,
    `${clampX(farL, 0)},${clampY(farL)}`,
  ].join(' ')

  // ── Pitch lines ──
  const p = (pts: [number,number][], h = 0) =>
    makePath(pts, h, camGx, camGy, vw, vh, horizon, focal)

  const touchL   = p(linePts(0,  100, 36).map(y  => [0,   y] as [number,number]))
  const touchR   = p(linePts(0,  100, 36).map(y  => [100, y] as [number,number]))
  const goalLine = p(linePts(0,  100, 22).map(x  => [x, 100] as [number,number]))
  const ownLine  = p(linePts(0,  100, 22).map(x  => [x,   0] as [number,number]))
  const halfLine = p(linePts(0,  100, 22).map(x  => [x,  50] as [number,number]))
  // Penalty area (opp): 16.5m deep (y=83.5 in game), 40.32m wide (x 20.4–79.6)
  const penFront = p(linePts(20.4, 79.6, 12).map(x => [x, 83.5] as [number,number]))
  const penL     = p(linePts(83.5, 100,   6).map(y => [20.4, y] as [number,number]))
  const penR     = p(linePts(83.5, 100,   6).map(y => [79.6, y] as [number,number]))

  // ── Goal ──
  const glB = proj(GOAL_L_GX, 100, 0)
  const grB = proj(GOAL_R_GX, 100, 0)
  const glT = proj(GOAL_L_GX, 100, GOAL_H_M)
  const grT = proj(GOAL_R_GX, 100, GOAL_H_M)
  const showGoal = glB && grB && glT && grT

  // ── Players — sorted far→near (painter's algorithm) ──
  type Dot = { cx: number; cy: number; ry: number; rx: number; team: 'own'|'opp'; depth: number }
  const dots: Dot[] = []
  for (const op of scenario.opponents) {
    const sp = proj(op.x, op.y, PLAY_H / 2)
    if (!sp) continue
    const ry = Math.max(2, Math.min(26, ((PLAY_H / 2) / sp.depth) * focal))
    dots.push({ cx: sp.x, cy: sp.y, ry, rx: ry * 0.44, team: 'opp', depth: sp.depth })
  }
  for (const tm of scenario.teammates) {
    const sp = proj(tm.x, tm.y, PLAY_H / 2)
    if (!sp) continue
    const ry = Math.max(2, Math.min(26, ((PLAY_H / 2) / sp.depth) * focal))
    dots.push({ cx: sp.x, cy: sp.y, ry, rx: ry * 0.44, team: 'own', depth: sp.depth })
  }
  dots.sort((a, b) => b.depth - a.depth)

  // ── Ball ──
  const ballSp    = proj(scenario.ball.x, scenario.ball.y, 0.11)
  const ballR     = ballSp ? Math.max(3, Math.min(10, (0.18 / ballSp.depth) * focal)) : 0
  const ballBehind = !ballSp

  // Direction of ball from camera (for behind-camera indicator)
  const ballAngleDeg = (() => {
    const dx = scenario.ball.x - camGx
    const dy = scenario.ball.y - camGy   // positive = forward (toward y=100)
    return Math.atan2(dx, -dy) * (180 / Math.PI)  // 0=forward,90=right,180=back,270=left
  })()

  const progressPct = Math.min(100, (elapsed / autoDuration) * 100)

  return (
    <div ref={containerRef} className="h-full w-full flex flex-col">
      <svg
        width={vw}
        height={vh}
        viewBox={`0 0 ${vw} ${vh}`}
        className="flex-1"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="gv-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#5b9bd5" />
            <stop offset="100%" stopColor="#9cc4e4" />
          </linearGradient>
          <linearGradient id="gv-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1e5a18" />
            <stop offset="100%" stopColor="#307a2a" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={vw} height={horizon + 1} fill="url(#gv-sky)" />

        {/* Ground */}
        <polygon points={groundPoly} fill="url(#gv-grass)" />

        {/* Pitch markings */}
        {touchL   && <path d={touchL}   stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none" />}
        {touchR   && <path d={touchR}   stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none" />}
        {goalLine && <path d={goalLine} stroke="rgba(255,255,255,0.9)"  strokeWidth="1.8" fill="none" />}
        {ownLine  && <path d={ownLine}  stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" fill="none" />}
        {halfLine && <path d={halfLine} stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" fill="none" />}
        {penFront && <path d={penFront} stroke="rgba(255,255,255,0.6)"  strokeWidth="1"   fill="none" />}
        {penL     && <path d={penL}     stroke="rgba(255,255,255,0.6)"  strokeWidth="1"   fill="none" />}
        {penR     && <path d={penR}     stroke="rgba(255,255,255,0.6)"  strokeWidth="1"   fill="none" />}

        {/* Goal */}
        {showGoal && glB && grB && glT && grT && (
          <g>
            <polygon
              points={`${glT.x},${glT.y} ${grT.x},${grT.y} ${grB.x},${grB.y} ${glB.x},${glB.y}`}
              fill="rgba(255,255,255,0.1)" stroke="none"
            />
            <line x1={glB.x} y1={glB.y} x2={glT.x} y2={glT.y} stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1={grB.x} y1={grB.y} x2={grT.x} y2={grT.y} stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1={glT.x} y1={glT.y} x2={grT.x} y2={grT.y} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* Players — back to front */}
        {dots.map((d, i) => (
          <ellipse
            key={i}
            cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry}
            fill={d.team === 'opp' ? '#ef4444' : '#3b82f6'}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.7"
          />
        ))}

        {/* Ball */}
        {ballSp && (
          <g>
            <circle cx={ballSp.x} cy={ballSp.y} r={ballR + 2}  fill="rgba(255,255,255,0.15)" />
            <circle cx={ballSp.x} cy={ballSp.y} r={ballR}       fill="white" stroke="#333" strokeWidth="0.5" />
            <circle cx={ballSp.x} cy={ballSp.y} r={ballR * 0.3} fill="#222" />
          </g>
        )}

        {/* Ball direction badge when ball is behind the camera */}
        {ballBehind && (
          <g transform={`translate(${vw / 2}, ${vh - 52}) rotate(${ballAngleDeg})`}>
            <circle r="20" fill="rgba(245,158,11,0.9)" />
            <text y="5" textAnchor="middle" fontSize="16" style={{ userSelect: 'none' }}>⚽</text>
          </g>
        )}
        {ballBehind && (
          <text
            x={vw / 2} y={vh - 24}
            textAnchor="middle" fontSize="10"
            fill="rgba(245,158,11,0.85)"
            fontWeight="bold" fontFamily="sans-serif"
            style={{ userSelect: 'none' }}
          >
            BALL BEHIND YOU
          </text>
        )}

        {/* YOU marker at camera position (bottom centre) */}
        <text
          x={vw / 2} y={vh - 6}
          textAnchor="middle" fontSize="10"
          fill="rgba(251,191,36,0.82)"
          fontWeight="bold" fontFamily="sans-serif"
          style={{ userSelect: 'none' }}
        >
          YOU ▼
        </text>

        {/* Subtle horizon line */}
        <line x1={0} y1={horizon} x2={vw} y2={horizon} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </svg>

      {/* Progress bar */}
      <div className="h-1 bg-gray-700 flex-none">
        <div
          className="h-1 bg-blue-500"
          style={{ width: `${progressPct}%`, transition: 'width 0.08s linear' }}
        />
      </div>
    </div>
  )
}
