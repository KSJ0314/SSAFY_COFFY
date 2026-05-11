import type { Ball, Pin } from './types'
import { REST_WALL, REST_BAR, REST_PIN, REST_BALL } from './constants'

export function hitLine(ball: Ball, x1: number, y1: number, x2: number, y2: number, rest = REST_WALL) {
  const dx = x2-x1, dy = y2-y1, lsq = dx*dx+dy*dy
  if (!lsq) return
  const t  = Math.max(0, Math.min(1, ((ball.x-x1)*dx + (ball.y-y1)*dy) / lsq))
  const ex = ball.x-(x1+t*dx), ey = ball.y-(y1+t*dy)
  const d  = Math.sqrt(ex*ex+ey*ey)
  if (d < ball.radius && d > 0) {
    const nx = ex/d, ny = ey/d
    ball.x += nx*(ball.radius-d); ball.y += ny*(ball.radius-d)
    const dot = ball.vx*nx + ball.vy*ny
    if (dot < 0) { ball.vx -= (1+rest)*dot*nx; ball.vy -= (1+rest)*dot*ny }
  }
}

export function hitPin(ball: Ball, pin: Pin) {
  const dx = ball.x-pin.x, dy = ball.y-pin.y
  const d = Math.sqrt(dx*dx+dy*dy), min = ball.radius+pin.r
  if (d < min && d > 0) {
    const nx = dx/d, ny = dy/d
    ball.x += nx*(min-d); ball.y += ny*(min-d)
    const dot = ball.vx*nx + ball.vy*ny
    if (dot < 0) { ball.vx -= (1+REST_PIN)*dot*nx; ball.vy -= (1+REST_PIN)*dot*ny }
  }
}

// 회전 막대 충돌: 막대 표면의 회전 속도를 구슬에 전달
export function hitRotatingBar(
  ball: Ball,
  x1: number, y1: number, x2: number, y2: number,
  barCx: number, barCy: number, effectiveAngularVelocity: number,
  rest = REST_BAR
) {
  const dx = x2-x1, dy = y2-y1, lsq = dx*dx+dy*dy
  if (!lsq) return
  const t  = Math.max(0, Math.min(1, ((ball.x-x1)*dx + (ball.y-y1)*dy) / lsq))
  const px = x1+t*dx, py = y1+t*dy
  const ex = ball.x-px, ey = ball.y-py
  const d  = Math.sqrt(ex*ex+ey*ey)
  if (d < ball.radius && d > 0) {
    const nx = ex/d, ny = ey/d
    ball.x += nx*(ball.radius-d); ball.y += ny*(ball.radius-d)
    // 접촉점에서의 막대 표면 속도 (회전에 의한 선속도)
    const barVx = -effectiveAngularVelocity * (py - barCy)
    const barVy =  effectiveAngularVelocity * (px - barCx)
    const relDot = (ball.vx-barVx)*nx + (ball.vy-barVy)*ny
    if (relDot < 0) {
      ball.vx -= (1+rest)*relDot*nx
      ball.vy -= (1+rest)*relDot*ny
    }
  }
}

export function hitBall(a: Ball, b: Ball) {
  const dx = b.x-a.x, dy = b.y-a.y, d = Math.sqrt(dx*dx+dy*dy), min = a.radius+b.radius
  if (d < min && d > 0) {
    const nx = dx/d, ny = dy/d, ov = (min-d)/2
    a.x -= nx*ov; a.y -= ny*ov; b.x += nx*ov; b.y += ny*ov
    const dot = (b.vx-a.vx)*nx + (b.vy-a.vy)*ny
    if (dot < 0) { const imp=(1+REST_BALL)*dot/2; a.vx+=imp*nx; a.vy+=imp*ny; b.vx-=imp*nx; b.vy-=imp*ny }
  }
}
