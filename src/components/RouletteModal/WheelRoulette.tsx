import { useRef, useLayoutEffect, useEffect } from 'react'

const COLORS = [
  '#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D',
  '#CC5DE8', '#FF922B', '#20C997', '#F06595',
  '#74C0FC', '#A9E34B', '#FFA8A8', '#63E6BE',
]

const SIZE = 280

interface Props {
  names: string[]
  spinning: boolean
  onSpinEnd: (winnerIndex: number) => void
}

export default function WheelRoulette({ names, spinning, onSpinEnd }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(-Math.PI / 2)
  const rafRef = useRef<number | null>(null)

  function draw(angle: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const cx = SIZE / 2, cy = SIZE / 2, r = cx - 12

    ctx.clearRect(0, 0, SIZE, SIZE)

    if (names.length < 2) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = '#e5e7eb'
      ctx.fill()
      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('참여자를 2명 이상 입력하세요', cx, cy)
      return
    }

    const slice = (Math.PI * 2) / names.length
    names.forEach((name, i) => {
      const start = angle + i * slice, end = start + slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + slice / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${names.length > 8 ? 11 : 13}px sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 3
      ctx.fillText(name.length > 5 ? name.slice(0, 5) + '…' : name, r - 14, 0)
      ctx.restore()
    })

    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(cx - 8, 2)
    ctx.lineTo(cx + 8, 2)
    ctx.lineTo(cx, 28)
    ctx.closePath()
    ctx.fillStyle = '#1f2937'
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.fill()
    ctx.stroke()
  }

  useLayoutEffect(() => {
    if (!spinning) draw(angleRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.join(','), spinning])

  useEffect(() => {
    if (!spinning) return

    const totalRotation = Math.PI * 2 * (6 + Math.random() * 6)
    const duration = 4000 + Math.random() * 1500
    const startTime = performance.now()
    const startAngle = angleRef.current

    function animate(now: number) {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      const current = startAngle + totalRotation * eased
      angleRef.current = current
      draw(current)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        const slice = (Math.PI * 2) / names.length
        const offset = ((Math.PI * 3 / 2 - current) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
        onSpinEnd(Math.floor(offset / slice) % names.length)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning])

  return <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ display: 'block' }} />
}
