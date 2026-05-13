import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../../context/ThemeContext'
import MMWebhookModal from '../MMWebhookModal'
import LunchMenuModal from '../LunchMenuModal'

const BtnBase = styled.button`
  position: fixed;
  bottom: 24px;
  z-index: 200;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.shadow};
  }
`

const ThemeToggleBtn = styled(BtnBase)`
  right: 24px;
  font-size: 1.2rem;
`

const LunchMenuBtn = styled(BtnBase)`
  right: 80px;
  font-size: 1.2rem;
`

const MMBtn = styled(BtnBase)`
  right: 136px;
  font-size: 1.1rem;
`

export default function FloatingButtons() {
  const { pathname } = useLocation()
  const { mode, toggle } = useTheme()
  const [lunchOpen, setLunchOpen] = useState(false)
  const [mmOpen, setMmOpen] = useState(false)

  if (pathname === '/lunch') return null

  return (
    <>
      {!window.electronAPI && (
        <>
          <LunchMenuBtn onClick={() => setLunchOpen(true)} title="오늘의 점심 메뉴">
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
              <path d="M240-80v-366q-54-14-87-57t-33-97v-280h80v240h40v-240h80v240h40v-240h80v280q0 54-33 97t-87 57v366h-80Zm400 0v-381q-54-18-87-75.5T520-667q0-89 47-151t113-62q66 0 113 62.5T840-666q0 73-33 130t-87 75v381h-80Z"/>
            </svg>
          </LunchMenuBtn>
          <ThemeToggleBtn onClick={toggle} title={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}>
            {mode === 'light' ? '🌙' : '☀️'}
          </ThemeToggleBtn>
          {lunchOpen && <LunchMenuModal onClose={() => setLunchOpen(false)} />}
        </>
      )}
      {import.meta.env.DEV && (
        <>
          <MMBtn onClick={() => setMmOpen(true)} title="MM 웹훅 전송">MM</MMBtn>
          {mmOpen && <MMWebhookModal onClose={() => setMmOpen(false)} />}
        </>
      )}
    </>
  )
}
