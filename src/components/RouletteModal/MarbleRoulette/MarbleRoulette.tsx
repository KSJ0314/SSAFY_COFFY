import { useRef, useEffect, useLayoutEffect, useCallback, type RefObject } from 'react'
import { MARBLE_W, MARBLE_H, WORLD_W, WORLD_H, MINIMAP_W, MINIMAP_H, GRAVITY, FRICTION, SUBSTEPS, REST_BAR, CAMERA_LERP, FUNNEL_Y } from './constants'
import type { Ball, Participant } from './types'
import { hitLine, hitPin, hitBall, hitRotatingBar } from './physics'
import { walls, goalY } from './course'
import { bars, rotatingBars } from './bars'
import { pins } from './pins'


interface Props {
  participants: Participant[]
  spinning: boolean
  scale?: number
  minimapRef?: RefObject<HTMLCanvasElement | null>
  onRaceEnd: (name: string, cls: string) => void
  onAllFinished?: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MarbleRoulette({ participants, spinning, scale = 1, minimapRef, onRaceEnd, onAllFinished }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const ballsRef   = useRef<Ball[]>([])
  const rafRef     = useRef<number|null>(null)
  const camY       = useRef(0)
  const rankCount  = useRef(0)
  const wFired     = useRef(false)
  const running    = useRef(false)
  const inFunnel      = useRef(false)
  const allDoneFired  = useRef(false)
  const lastTimeRef   = useRef(0)
  const shuffledRef = useRef(shuffle(participants))

  const ballR = (n: number) => n <= 4 ? 5 : 4
  const dropX = (i: number, n: number, r: number) => {
    const left = WORLD_W*2/5+r, right = WORLD_W*3/5-r
    return left + (right-left)/Math.max(n-1,1)*i + (Math.random()-.5)*r*.5
  }

  // ─── 뷰포트 렌더 ──────────────────────────────────────────────────────
  const drawViewport = useCallback((bs: Ball[], cy: number, zoom = 1) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, MARBLE_W, MARBLE_H)

    // 줌 트랜스폼 적용 (뷰포트 중앙 기준)
    ctx.save()
    if (zoom !== 1) {
      ctx.translate(MARBLE_W / 2, MARBLE_H / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-MARBLE_W / 2, -MARBLE_H / 2)
    }

    // 외벽 — 네온 보라
    ctx.shadowColor = '#cc44ff'; ctx.shadowBlur = 10 / zoom
    ctx.strokeStyle = '#cc44ff'; ctx.lineWidth = 1.5 / zoom
    walls.forEach(w => {
      ctx.beginPath(); ctx.moveTo(w.x1, w.y1-cy); ctx.lineTo(w.x2, w.y2-cy); ctx.stroke()
    })
    ctx.shadowBlur = 0

    // 정적 막대 — 네온 그린
    ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 10 / zoom
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 3 / zoom
    bars.forEach(b => {
      ctx.beginPath(); ctx.moveTo(b.x1, b.y1-cy); ctx.lineTo(b.x2, b.y2-cy); ctx.stroke()
    })
    ctx.shadowBlur = 0

    // 회전 막대 — 네온 시안
    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 14 / zoom
    ctx.strokeStyle = '#44ddff'; ctx.lineWidth = 6 / zoom
    rotatingBars.forEach(rb => {
      const cos = Math.cos(rb.angle), sin = Math.sin(rb.angle)
      ctx.beginPath()
      ctx.moveTo(rb.cx + cos*rb.halfLen, rb.cy + sin*rb.halfLen - cy)
      ctx.lineTo(rb.cx - cos*rb.halfLen, rb.cy - sin*rb.halfLen - cy)
      ctx.stroke()
    })
    ctx.shadowBlur = 0

    // 핀 — 네온 핑크
    ctx.fillStyle = '#ff4da6'; ctx.shadowColor = '#ff4da6'; ctx.shadowBlur = 10
    pins.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y-cy, p.r, 0, Math.PI*2); ctx.fill()
    })
    ctx.shadowBlur = 0

    const gy = goalY-cy
    ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 12
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2.5 / zoom; ctx.setLineDash([8, 6])
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(MARBLE_W, gy); ctx.stroke()
    ctx.setLineDash([]); ctx.shadowBlur = 0
    ctx.fillStyle = '#ffd700'; ctx.font = `bold ${10 / zoom}px sans-serif`
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'
    ctx.fillText('GOAL', MARBLE_W-6, gy-3)

    bs.forEach(ball => {
      if (ball.alpha <= 0) return
      const sy = ball.y-cy
      if (sy < -ball.radius || sy > MARBLE_H+ball.radius) return
      ctx.globalAlpha = ball.alpha
      ctx.shadowColor = `hsl(${ball.hue} 100% 60%)`; ctx.shadowBlur = 14
      ctx.beginPath(); ctx.arc(ball.x, sy, ball.radius, 0, Math.PI*2)
      ctx.fillStyle = `hsl(${ball.hue} 100% 65%)`; ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    })

    ctx.restore()

    // 공 이름 라벨 (줌 영향 없이 고정 폰트 크기)
    ctx.font = 'bold 9px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    bs.forEach(ball => {
      if (ball.alpha <= 0) return
      const sy = ball.y - cy
      if (sy < -ball.radius || sy > MARBLE_H + ball.radius) return
      // 뷰포트 좌표 → 스크린 좌표 변환 (줌 트랜스폼 역산)
      const sx = (ball.x - MARBLE_W / 2) * zoom + MARBLE_W / 2
      const sy2 = (sy - MARBLE_H / 2) * zoom + MARBLE_H / 2
      const labelY = sy2 + ball.radius * zoom + 2
      if (labelY < 0 || labelY > MARBLE_H + 16) return
      ctx.globalAlpha = ball.alpha
      ctx.fillStyle = `hsl(${ball.hue} 100% 80%)`
      ctx.fillText(ball.name, sx, labelY)
      ctx.globalAlpha = 1
    })

    // 스코어보드는 줌 영향 없이 고정 위치에 렌더
    const done = bs.filter(b => b.rank > 0).sort((a, b) => a.rank-b.rank)
    if (done.length) {
      const lh=15, pw=52, ph=lh*(done.length+.6), px=MARBLE_W-pw-6
      ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.beginPath(); ctx.roundRect(px, 6, pw, ph, 7); ctx.fill()
      ctx.font = 'bold 8px sans-serif'; ctx.textBaseline = 'middle'
      done.forEach((b, i) => {
        const y = 6+lh*(i+.8)
        ctx.fillStyle = i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#aaa'
        ctx.textAlign = 'left'; ctx.fillText(`${b.rank}위`, px+3, y)
        ctx.fillStyle = `hsl(${b.hue} 100% 70%)`; ctx.fillText(b.name, px+20, y)
      })
    }
  }, [])

  // ─── 미니맵 렌더 ──────────────────────────────────────────────────────
  const drawMinimap = useCallback((bs: Ball[], cy: number) => {
    const mc = minimapRef?.current
    if (!mc) return
    const mctx = mc.getContext('2d')
    if (!mctx) return
    const s = MINIMAP_H / WORLD_H

    mctx.fillStyle = '#111'; mctx.fillRect(0, 0, MINIMAP_W, MINIMAP_H)

    mctx.strokeStyle = '#cc44ff'; mctx.lineWidth = 1
    walls.forEach(w => {
      mctx.beginPath(); mctx.moveTo(w.x1*s, w.y1*s); mctx.lineTo(w.x2*s, w.y2*s); mctx.stroke()
    })

    mctx.strokeStyle = '#00ff88'; mctx.lineWidth = 1
    bars.forEach(b => {
      mctx.beginPath(); mctx.moveTo(b.x1*s, b.y1*s); mctx.lineTo(b.x2*s, b.y2*s); mctx.stroke()
    })

    mctx.strokeStyle = '#44ddff'; mctx.lineWidth = 1
    rotatingBars.forEach(rb => {
      const cos = Math.cos(rb.angle), sin = Math.sin(rb.angle)
      mctx.beginPath()
      mctx.moveTo((rb.cx + cos*rb.halfLen)*s, (rb.cy + sin*rb.halfLen)*s)
      mctx.lineTo((rb.cx - cos*rb.halfLen)*s, (rb.cy - sin*rb.halfLen)*s)
      mctx.stroke()
    })

    mctx.fillStyle = '#ff4da6'
    pins.forEach(p => {
      mctx.beginPath(); mctx.arc(p.x*s, p.y*s, Math.max(1, p.r*s), 0, Math.PI*2); mctx.fill()
    })

    mctx.strokeStyle = '#ffd700'; mctx.lineWidth = 1; mctx.setLineDash([3, 2])
    mctx.beginPath(); mctx.moveTo(0, goalY*s); mctx.lineTo(MINIMAP_W, goalY*s); mctx.stroke()
    mctx.setLineDash([])

    bs.forEach(ball => {
      if (ball.alpha <= 0) return
      mctx.globalAlpha = ball.alpha
      mctx.beginPath(); mctx.arc(ball.x*s, ball.y*s, Math.max(2, ball.radius*s), 0, Math.PI*2)
      mctx.fillStyle = `hsl(${ball.hue} 100% 65%)`; mctx.fill()
      mctx.globalAlpha = 1
    })

    mctx.fillStyle = 'rgba(255,255,255,0.06)'
    mctx.fillRect(0, cy*s, MINIMAP_W, MARBLE_H*s)
    mctx.shadowColor = '#00e5ff'; mctx.shadowBlur = 6
    mctx.strokeStyle = '#00e5ff'; mctx.lineWidth = 1.5
    mctx.strokeRect(0, cy*s, MINIMAP_W, MARBLE_H*s)
    mctx.shadowBlur = 0
  }, [minimapRef])

  // DPR + CSS zoom 대응 + 초기 드로우
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const apply = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0) return false
      const dpr      = window.devicePixelRatio || 1
      const cssScale = rect.width / MARBLE_W
      const total    = dpr * cssScale
      canvas.width   = Math.round(MARBLE_W * total)
      canvas.height  = Math.round(MARBLE_H * total)
      canvas.style.width  = `${MARBLE_W}px`
      canvas.style.height = `${MARBLE_H}px`
      canvas.getContext('2d')?.setTransform(total, 0, 0, total, 0, 0)
      if (!running.current) {
        drawViewport(ballsRef.current, 0)
        drawMinimap(ballsRef.current, 0)
      }
      return true
    }

    if (!apply()) {
      const ro = new ResizeObserver(() => { if (apply()) ro.disconnect() })
      ro.observe(canvas)
      return () => ro.disconnect()
    }
  }, [drawViewport, drawMinimap, scale])

  // CSS transition(0.2s) 완료 후 DPR 재적용
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const timer = setTimeout(() => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0) return
      const dpr      = window.devicePixelRatio || 1
      const cssScale = rect.width / MARBLE_W
      const total    = dpr * cssScale
      canvas.width   = Math.round(MARBLE_W * total)
      canvas.height  = Math.round(MARBLE_H * total)
      canvas.style.width  = `${MARBLE_W}px`
      canvas.style.height = `${MARBLE_H}px`
      canvas.getContext('2d')?.setTransform(total, 0, 0, total, 0, 0)
      if (!running.current) {
        drawViewport(ballsRef.current, 0)
        drawMinimap(ballsRef.current, 0)
      }
    }, 210)
    return () => clearTimeout(timer)
  }, [scale, drawViewport, drawMinimap])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ─── 참여자 변경 시 구슬 생성 (대기 상태) ────────────────────────────
  useEffect(() => {
    if (running.current) return
    shuffledRef.current = shuffledRef.current.filter(p => participants.some(q => q.name === p.name && q.cls === p.cls))
    participants.forEach(p => { if (!shuffledRef.current.some(q => q.name === p.name && q.cls === p.cls)) shuffledRef.current.push(p) })
    const shuffled = shuffledRef.current
    const n = shuffled.length, r = ballR(n)
    ballsRef.current = shuffled.map((p, i) => ({
      x: dropX(i, n, r), y: 50,
      vx: 0, vy: 0,
      radius: r, hue: (360/n)*i,
      name: p.name, cls: p.cls, rank: 0, alpha: 1,
    }))
    drawViewport(ballsRef.current, 0)
    drawMinimap(ballsRef.current, 0)
  }, [participants, drawViewport, drawMinimap])

  // ─── 레이스 ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!spinning) return
    camY.current=0; rankCount.current=0; wFired.current=false; running.current=true; inFunnel.current=false; allDoneFired.current=false; lastTimeRef.current=0

    // 구슬 위치 리셋 + 초기 속도 부여
    const shuffled = shuffledRef.current
    const n = shuffled.length, r = ballR(n)
    ballsRef.current = shuffled.map((p, i) => ({
      x: dropX(i, n, r), y: 50,
      vx: (Math.random()-.5)*1.5, vy: Math.random()*.5,
      radius: r, hue: (360/n)*i,
      name: p.name, cls: p.cls, rank: 0, alpha: 1,
    }))

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    function tick(now: number) {
      if (lastTimeRef.current === 0) lastTimeRef.current = now
      const dt = Math.min((now - lastTimeRef.current) / (1000 / 60), 3)
      lastTimeRef.current = now

      const bs = ballsRef.current
      const active = bs.filter(b => b.rank === 0)

      // 깔때기 구간 진입 감지 (한번 진입하면 유지)
      if (active.length) {
        const leader = active.reduce((a, b) => a.y > b.y ? a : b)
        if (leader.y >= FUNNEL_Y) inFunnel.current = true
      }
      const zoneMult = inFunnel.current ? 0.8 : 1
      const zoom     = inFunnel.current ? 2 : 1

      // 회전 막대 각도 업데이트 (틱당 1회, 구간 속도 적용)
      rotatingBars.forEach(rb => { rb.angle += rb.angularVelocity * zoneMult * dt })

      // 중력·마찰 적용 (틱당 1회, 구간 중력 적용)
      bs.forEach(ball => {
        if (ball.rank > 0) { ball.alpha = Math.max(0, ball.alpha - 0.015 * dt); return }
        ball.vy += GRAVITY * zoneMult * (0.8 + Math.random() * 0.2) * dt
        ball.vx *= Math.pow(FRICTION, dt)
        ball.vy *= Math.pow(FRICTION, dt)
      })

      // 서브스텝: 이동·충돌을 SUBSTEPS번 나눠 처리 → 터널링 방지
      for (let s = 0; s < SUBSTEPS; s++) {
        bs.forEach(ball => {
          if (ball.rank > 0) return
          ball.x += (ball.vx / SUBSTEPS) * dt
          ball.y += (ball.vy / SUBSTEPS) * dt

          walls.forEach(w => hitLine(ball, w.x1, w.y1, w.x2, w.y2))
          bars.forEach(b => hitLine(ball, b.x1, b.y1, b.x2, b.y2, REST_BAR))
          rotatingBars.forEach(rb => {
            const cos = Math.cos(rb.angle), sin = Math.sin(rb.angle)
            hitRotatingBar(
              ball,
              rb.cx+cos*rb.halfLen, rb.cy+sin*rb.halfLen,
              rb.cx-cos*rb.halfLen, rb.cy-sin*rb.halfLen,
              rb.cx, rb.cy, rb.angularVelocity * zoneMult
            )
          })
          pins.forEach(p => hitPin(ball, p))

          if (ball.y+ball.radius >= goalY && ball.rank === 0) {
            ball.rank = ++rankCount.current
            ball.y = goalY-ball.radius; ball.vy = 0; ball.vx = 0
            if (!wFired.current) { wFired.current=true; onRaceEnd(ball.name, ball.cls) }
          }
        })

        for (let i = 0; i < bs.length; i++)
          for (let j = i+1; j < bs.length; j++)
            if (bs[i].rank===0 && bs[j].rank===0) hitBall(bs[i], bs[j])
      }

      // 전원 골인 감지
      if (!allDoneFired.current && bs.length > 0 && bs.every(b => b.rank > 0)) {
        allDoneFired.current = true
        onAllFinished?.()
      }

      if (active.length) {
        const leader = active.reduce((a, b) => a.y > b.y ? a : b)
        // 줌 시 뷰포트 중앙에 선두 구슬이 오도록 카메라 타겟 조정
        const targetY = Math.max(0, Math.min(WORLD_H-MARBLE_H, leader.y - MARBLE_H / (2 * zoom)))
        camY.current += (targetY - camY.current) * CAMERA_LERP
      }

      drawViewport(bs, camY.current, zoom)
      drawMinimap(bs, camY.current)

      if (bs.some(b => b.rank===0) || bs.some(b => b.alpha>0))
        rafRef.current = requestAnimationFrame(tick)
      else running.current = false
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning])

  return <canvas ref={canvasRef} width={MARBLE_W} height={MARBLE_H} style={{ display: 'block', borderRadius: 6 }} />
}
