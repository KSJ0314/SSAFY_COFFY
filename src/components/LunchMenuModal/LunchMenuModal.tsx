import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ModalBackdrop } from '../../styles/shared'

const PLANEAT_URL =
  'https://m.planeatchoice.net/newDailyMenu?lang=ko'

const Modal = styled.div<{ $standalone?: boolean }>`
  background: ${({ theme }) => theme.colors.surfaceModal};
  border-radius: ${({ $standalone }) => $standalone ? '0' : '16px'};
  padding: 4px;
  width: ${({ $standalone }) => $standalone ? '100vw' : 'calc(90vh / var(--ui-scale) * 360 / 740)'};
  max-width: ${({ $standalone }) => $standalone ? '100vw' : 'calc(90vw / var(--ui-scale))'};
  height: ${({ $standalone }) => $standalone ? '100vh' : 'calc(90vh / var(--ui-scale))'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  flex-shrink: 0;

  h2 {
    font-size: 1.05rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const FrameWrap = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 10px 10px;
`

const Frame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
`

interface Props {
  onClose: () => void
  standalone?: boolean
}

function ModalContent({ onClose, standalone }: { onClose: () => void, standalone?: boolean }) {
  const [src, setSrc] = useState('')
  const [frameKey, setFrameKey] = useState(0)

  useEffect(() => { setSrc(PLANEAT_URL) }, [])

  useEffect(() => {
    if (!standalone) return
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setFrameKey(k => k + 1), 300)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [standalone])

  return (
    <Modal $standalone={standalone}>
      <Header>
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
            <path d="M240-80v-366q-54-14-87-57t-33-97v-280h80v240h40v-240h80v240h40v-240h80v280q0 54-33 97t-87 57v366h-80Zm400 0v-381q-54-18-87-75.5T520-667q0-89 47-151t113-62q66 0 113 62.5T840-666q0 73-33 130t-87 75v381h-80Z"/>
          </svg>
          오늘의 점심
        </h2>
        <CloseBtn onClick={onClose}>✕</CloseBtn>
      </Header>
      <FrameWrap>
        <Frame key={frameKey} src={src} title="오늘의 점심 메뉴" />
      </FrameWrap>
    </Modal>
  )
}

export default function LunchMenuModal({ onClose, standalone }: Props) {
  if (standalone) return <ModalContent onClose={onClose} standalone />
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClose={onClose} />
    </ModalBackdrop>
  )
}
