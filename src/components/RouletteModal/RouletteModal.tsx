import { useState, useEffect, useRef } from 'react'
import {
  Backdrop, Modal, ModalHeader, ModalTitle, CloseBtn, TabGroup, TabBtn,
  ModalBody, RouletteSection, CanvasWrap, SpinBtn, MaximizeBtn,
  ParticipantSection, ParticipantSectionLabel, ParticipantList,
  ParticipantRow, ParticipantInput, ClsInput, RemoveBtn, AddBtn,
  WinnerOverlay, WinnerCard, WinnerEmoji, WinnerName, WinnerLabel, ResetBtn,
  MinimapCanvas,
  CanvasRefreshBtn,
} from './RouletteModal.styled'
import WheelRoulette from './WheelRoulette'
import MarbleRoulette, { MINIMAP_W, MINIMAP_H } from './MarbleRoulette'

interface Props {
  open: boolean
  standalone?: boolean
  onClose: () => void
  onWinner: (name: string, cls: string) => void
}

export default function RouletteModal({ open, standalone, onClose, onWinner }: Props) {
  const [mode, setMode] = useState<'wheel' | 'marble'>('marble')
  const [inputs, setInputs] = useState([{ name: '', cls: '' }, { name: '', cls: '' }])
  const [winner, setWinner] = useState<string | null>(null)
  const [spinning, setSpinning]     = useState(false)
  const [marbleSpin, setMarbleSpin] = useState(false)
  const [expanded, setExpanded]     = useState(false)
  const [fsScale, setFsScale]       = useState(1)
  const [marbleKey, setMarbleKey]   = useState(0)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const modalRef   = useRef<HTMLDivElement>(null)

  const participants = inputs.filter(v => v.name.trim())
  const names = participants.map(v => v.name.trim())
  const isLocked = spinning || marbleSpin

  // standalone(Electron)이면 항상, 아니면 expanded일 때만 scale 계산
  useEffect(() => {
    if (!expanded && !standalone) { setFsScale(1); return }
    const calc = () => {
      const el = modalRef.current
      if (!el) return
      const rootZoom = parseFloat(getComputedStyle(document.getElementById('root')!).zoom) || 1
      const scale = Math.min(
        (window.innerWidth  / rootZoom) * 0.90 / el.offsetWidth,
        (window.innerHeight / rootZoom) * 0.90 / el.offsetHeight,
      )
      setFsScale(Math.max(1, scale))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [expanded, standalone, mode])

  function setName(i: number, v: string) { setInputs(p => p.map((x,j) => j===i ? {...x,name:v} : x)) }
  function setCls (i: number, v: string) { setInputs(p => p.map((x,j) => j===i ? {...x,cls:v}  : x)) }
  function remove (i: number)            { setInputs(p => p.filter((_,j) => j!==i)) }
  function add()                         { setInputs(p => [...p, {name:'', cls:''}]) }

  function handleWheelSpin() {
    if (spinning || names.length < 2) return
    setWinner(null); setSpinning(true)
  }
  function handleWheelEnd(idx: number) {
    setSpinning(false)
    setWinner(participants[idx].name)
    onWinner(participants[idx].name, participants[idx].cls)
  }

  function handleMarbleSpin() {
    if (marbleSpin || participants.length < 2) return
    setWinner(null); setMarbleSpin(true)
  }
  function handleMarbleEnd(name: string, cls: string) {
    setWinner(name); onWinner(name, cls)  // marbleSpin은 유지 — 레이스 계속
  }
  function handleMarbleAllDone() {
    setMarbleSpin(false)
  }

  function reset() {
    setWinner(null); setSpinning(false); setMarbleSpin(false)
  }

  const spinLabel = mode === 'wheel'
    ? (spinning   ? '돌아가는 중...' : 'SPIN')
    : (marbleSpin ? '레이스 중...'   : 'START')
  const spinDisabled = mode === 'wheel'
    ? (spinning   || names.length < 2)
    : (marbleSpin || participants.length < 2)

  function renderInputs(disabled: boolean) {
    return inputs.map((v, i) => (
      <ParticipantRow key={i}>
        <ParticipantInput placeholder={`참여자 ${i+1}`} value={v.name} maxLength={10} disabled={disabled}
          onChange={e => setName(i, e.target.value)} />
        <ClsInput placeholder="반" value={v.cls} maxLength={2} disabled={disabled}
          onChange={e => setCls(i, e.target.value)} />
        {inputs.length > 2 && <RemoveBtn type="button" disabled={disabled} onClick={() => remove(i)}>✕</RemoveBtn>}
      </ParticipantRow>
    ))
  }

  return (
    <Backdrop $standalone={standalone} onClick={standalone ? undefined : onClose}
      style={{ display: open ? undefined : 'none' }}>
      <Modal
        ref={modalRef}
        $wide={mode === 'marble'}
        $standalone={standalone}
        style={{ transform: fsScale !== 1 ? `scale(${fsScale})` : undefined, transition: 'transform 0.2s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>🎰 주문자 뽑기</ModalTitle>
          <TabGroup>
            <TabBtn type="button" $active={mode==='marble'} onClick={() => setMode('marble')}>마블 룰렛</TabBtn>
            <TabBtn type="button" $active={mode==='wheel'}  onClick={() => setMode('wheel')}>스핀 룰렛</TabBtn>
          </TabGroup>
          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
            {mode === 'marble' && !window.electronAPI && (
              <MaximizeBtn type="button" title={expanded ? '축소' : '확대'}
                onClick={() => setExpanded(v => !v)}>
                {expanded
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d="m156-100-56-56 124-124H120v-80h240v240h-80v-104L156-100Zm648 0L680-224v104h-80v-240h240v80H736l124 124-56 56ZM120-600v-80h104L100-804l56-56 124 124v-104h80v240H120Zm480 0v-240h80v104l124-124 56 56-124 124h104v80H600Z"/></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 -960 960 960" fill="currentColor"><path d="M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm480 0v-80h104L580-324l56-56 124 124v-104h80v240H600ZM324-580 200-704v104h-80v-240h240v80H256l124 124-56 56Zm312 0-56-56 124-124H600v-80h240v240h-80v-104L636-580Z"/></svg>
                }
              </MaximizeBtn>
            )}
            <CloseBtn type="button" onClick={onClose}>✕</CloseBtn>
          </div>
        </ModalHeader>

        <ModalBody>
          {mode === 'marble' && (
            <MinimapCanvas ref={minimapRef} width={MINIMAP_W} height={MINIMAP_H} />
          )}
          <RouletteSection>
            <CanvasWrap>
              {mode === 'wheel'
                ? <WheelRoulette names={names} spinning={spinning} onSpinEnd={handleWheelEnd} />
                : <MarbleRoulette key={marbleKey} participants={participants} spinning={marbleSpin} minimapRef={minimapRef} onRaceEnd={handleMarbleEnd} onAllFinished={handleMarbleAllDone} />
              }
              {mode === 'marble' && (
                <CanvasRefreshBtn type="button"
                  onClick={() => { reset(); setMarbleKey(k => k+1) }}>↺</CanvasRefreshBtn>
              )}
            </CanvasWrap>
            <SpinBtn type="button" disabled={spinDisabled}
              onClick={mode === 'wheel' ? handleWheelSpin : handleMarbleSpin}>
              {spinLabel}
            </SpinBtn>
          </RouletteSection>

          <ParticipantSection style={{ position: 'relative' }}>
            <ParticipantSectionLabel>참여자</ParticipantSectionLabel>
            <ParticipantList>{renderInputs(isLocked)}</ParticipantList>
            <AddBtn type="button" disabled={isLocked} onClick={add}>+ 추가</AddBtn>

            {/* 마블 모드: 참여자 영역에만 당첨 카드 표시 (캔버스 영역 블러 없음) */}
            {mode === 'marble' && winner && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 12, zIndex: 5,
              }}>
                <WinnerCard style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                  <CloseBtn type="button"
                    style={{ position: 'absolute', top: 8, right: 8, padding: '2px 6px' }}
                    onClick={() => setWinner(null)}>✕</CloseBtn>
                  <WinnerEmoji>🎉</WinnerEmoji>
                  <WinnerName>{winner}</WinnerName>
                  <WinnerLabel>당첨!</WinnerLabel>
                </WinnerCard>
              </div>
            )}
          </ParticipantSection>
        </ModalBody>

        {/* 일반 룰렛: 모달 전체 오버레이 */}
        {mode === 'wheel' && winner && (
          <WinnerOverlay onClick={onClose}>
            <WinnerCard onClick={e => e.stopPropagation()}>
              <WinnerEmoji>🎉</WinnerEmoji>
              <WinnerName>{winner}</WinnerName>
              <WinnerLabel>당첨!</WinnerLabel>
            </WinnerCard>
            <ResetBtn type="button" title="초기화"
              onClick={e => { e.stopPropagation(); reset() }}>🔄</ResetBtn>
          </WinnerOverlay>
        )}
      </Modal>
    </Backdrop>
  )
}
