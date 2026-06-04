export interface Position {
  x: number // 0–100: left touchline → right touchline
  y: number // 0–100: own goal line → opponent goal line
}

export interface TargetZone extends Position {
  radius: number // in game units (same scale as x/y)
}

export interface Scenario {
  id: string
  phase: 'attacking' | 'defending'
  principle: string
  prompt: string
  ball: Position
  teammates: Position[] // all other own-team players (not my son)
  opponents: Position[]
  start: Position       // where his marker begins (a plausible-wrong spot)
  target: TargetZone    // ideal zone
  explanation: string   // coaching why, kid-friendly
  arrows?: Arrow[]      // movement arrows that explain what's happening in the play
}

export interface Arrow {
  from: Position
  to: Position
  team: 'own' | 'opponent'
  controlPoint?: Position // optional quadratic bezier curve (e.g. for crosses)
}

export type ScoreLevel = 'perfect' | 'good' | 'close' | 'miss'
export type PhaseFilter = 'all' | 'attacking' | 'defending'
export type Screen = 'start' | 'game' | 'end'
