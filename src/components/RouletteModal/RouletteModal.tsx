import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import {
  Backdrop, Modal, ModalHeader, ModalTitle, CloseBtn, TabGroup, TabBtn,
  ModalBody, RouletteSection, ParticipantSection, ParticipantSectionLabel,
  ParticipantList, ParticipantRow, ParticipantInput, ClsInput, RemoveBtn, AddBtn,
  CanvasWrap, SpinBtn,
  WinnerOverlay, WinnerCard, WinnerEmoji, WinnerName, WinnerLabel, ResetBtn,
} from './RouletteModal.styled'

const COLORS = [
  '#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D',
  '#CC5DE8', '#FF922B', '#20C997', '#F06595',
  '#74C0FC', '#A9E34B', '#FFA8A8', '#63E6BE',
]

const SIZE = 280

interface Props {
  open: boolean
  standalone?: boolean
  onClose: () => void
  onWinner: (name: string, cls: string) => void
}

export default function RouletteModal({ open, standalone, onClose, onWinner }: Props) {
  const [mode, setMode] = useState<'wheel' | 'marble'>('wheel')
  const [inputs, setInputs] = useState([{ name: '', cls: '' }, { name: '', cls: '' }])
  const [winner, setWinner] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(-Math.PI / 2)
  const rafRef = useRef<number | null>(null)
  const participants = inputs.filter(({ name }) => name.trim())
  const names = participants.map(({ name }) => name.trim())

  function drawWheel(angle: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cx = SIZE / 2
    const cy = SIZE / 2
    const r = cx - 12

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
      const start = angle + i * slice
      const end = start + slice

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
      const label = name.length > 5 ? name.slice(0, 5) + '…' : name
      ctx.fillText(label, r - 14, 0)
      ctx.restore()
    })

    // 중앙 원
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    ctx.stroke()

    // 상단 포인터 (고정)
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
    if (!spinning && mode === 'wheel') drawWheel(angleRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.join(','), spinning, mode])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setWinner(null)
    setSpinning(false)
    angleRef.current = -Math.PI / 2
  }

  function spin() {
    if (spinning || names.length < 2) return
    setWinner(null)
    setSpinning(true)

    const totalRotation = Math.PI * 2 * (6 + Math.random() * 6)
    const duration = 4000 + Math.random() * 1500
    const startTime = performance.now()
    const startAngle = angleRef.current

    function animate(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      const currentAngle = startAngle + totalRotation * eased
      angleRef.current = currentAngle
      drawWheel(currentAngle)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        const slice = (Math.PI * 2) / names.length
        const normalizedOffset = ((Math.PI * 3 / 2 - currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
        const winnerIndex = Math.floor(normalizedOffset / slice) % names.length
        const picked = names[winnerIndex]
        setWinner(picked)
        setSpinning(false)
        onWinner(participants[winnerIndex].name.trim(), participants[winnerIndex].cls.trim())
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  return (
    <Backdrop $standalone={standalone} onClick={standalone ? undefined : onClose} style={{ display: open ? undefined : 'none' }}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>🎰 주문자 뽑기</ModalTitle>
          <TabGroup>
            <TabBtn type="button" $active={mode === 'wheel'} onClick={() => setMode('wheel')}>일반 룰렛</TabBtn>
            <TabBtn type="button" $active={mode === 'marble'} onClick={() => setMode('marble')}>마블 룰렛</TabBtn>
          </TabGroup>
          <CloseBtn type="button" onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          <RouletteSection>
            {mode === 'wheel' ? (
              <>
                <CanvasWrap>
                  <canvas ref={canvasRef} width={SIZE} height={SIZE} />
                </CanvasWrap>
                <SpinBtn type="button" onClick={spin} disabled={spinning || names.length < 2}>
                  {spinning ? '돌아가는 중...' : 'SPIN 🎯'}
                </SpinBtn>
              </>
            ) : (
              <CanvasWrap style={{ width: SIZE, height: SIZE, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span style={{ fontSize: '2rem' }}>🪀</span>
                <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>마블 룰렛 준비 중</span>
              </CanvasWrap>
            )}
          </RouletteSection>

          <ParticipantSection>
            <ParticipantSectionLabel>참여자</ParticipantSectionLabel>
            <ParticipantList>
              {inputs.map((v, i) => (
                <ParticipantRow key={i}>
                  <ParticipantInput
                    placeholder={`참여자 ${i + 1}`}
                    value={v.name}
                    onChange={e => setInputs(prev => prev.map((val, idx) => idx === i ? { ...val, name: e.target.value } : val))}
                    maxLength={10}
                    disabled={spinning}
                  />
                  <ClsInput
                    placeholder="반"
                    value={v.cls}
                    onChange={e => setInputs(prev => prev.map((val, idx) => idx === i ? { ...val, cls: e.target.value } : val))}
                    maxLength={2}
                    disabled={spinning}
                  />
                  {inputs.length > 2 && (
                    <RemoveBtn
                      type="button"
                      onClick={() => setInputs(prev => prev.filter((_, idx) => idx !== i))}
                      disabled={spinning}
                    >
                      ✕
                    </RemoveBtn>
                  )}
                </ParticipantRow>
              ))}
            </ParticipantList>
            <AddBtn
              type="button"
              onClick={() => setInputs(prev => [...prev, { name: '', cls: '' }])}
              disabled={spinning}
            >
              + 추가
            </AddBtn>
          </ParticipantSection>
        </ModalBody>
        {winner && (
          <WinnerOverlay onClick={onClose}>
            <WinnerCard onClick={e => e.stopPropagation()}>
              <WinnerEmoji>🎉</WinnerEmoji>
              <WinnerName>{winner}</WinnerName>
              <WinnerLabel>당첨!</WinnerLabel>
            </WinnerCard>
            <ResetBtn type="button" title="초기화" onClick={e => { e.stopPropagation(); reset() }}>🔄</ResetBtn>
          </WinnerOverlay>
        )}
      </Modal>
    </Backdrop>
  )
}
