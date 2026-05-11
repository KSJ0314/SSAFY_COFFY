export interface Participant { name: string; cls: string }

export interface Ball {
  x: number; y: number; vx: number; vy: number
  radius: number; hue: number
  name: string; cls: string
  rank: number; alpha: number
}

export interface Wall { x1: number; y1: number; x2: number; y2: number }

export interface Bar { x1: number; y1: number; x2: number; y2: number }

export interface RotatingBar {
  cx: number; cy: number
  halfLen: number
  angle: number
  angularVelocity: number  // rad/tick, 양수=시계방향
}

export interface Pin { x: number; y: number; r: number }
