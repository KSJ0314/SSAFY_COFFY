import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { ModalBackdrop as BaseBackdrop, Modal } from '../../styles/shared'

const ModalBackdrop = styled(BaseBackdrop)`
  z-index: 300;
`
import CoffeeIcon from '../CoffeeIcon'

const STORAGE_KEY = 'landing_hide_until'

export function shouldShowLanding(): boolean {
  const val = localStorage.getItem(STORAGE_KEY)
  if (!val) return true
  return Date.now() > parseInt(val, 10)
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const LandingModal_ = styled(Modal)`
  animation: ${fadeIn} 0.3s ease;
  overflow: hidden;
  padding: 0;
  gap: 0;
`

const Hero = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  padding: 36px 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const LandingIcon = styled(CoffeeIcon)`
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
`

const ServiceName = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textOnDark};
  letter-spacing: 0.5px;
  text-align: center;
`


const Body = styled.div`
  padding: 24px 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const IntroText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  text-align: center;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HideLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    accent-color: ${({ theme }) => theme.colors.accent};
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`

const StartBtn = styled.button`
  padding: 9px 24px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.secondary});
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

interface Props {
  onClose: () => void
}

export default function LandingModal({ onClose }: Props) {
  const [hideWeek, setHideWeek] = useState(false)

  function handleStart() {
    if (hideWeek) {
      const until = Date.now() + 7 * 24 * 60 * 60 * 1000
      localStorage.setItem(STORAGE_KEY, String(until))
    }
    onClose()
  }

  return (
    <ModalBackdrop>
      <LandingModal_>
        <Hero>
          <LandingIcon size={56} />
          <ServiceName>SSAFY COFFEE</ServiceName>
        </Hero>
        <Body>
          <IntroText>
            교육생들을 위해 실습코치가 직접 만든 서비스!<br />
            메뉴 주문부터 주문 취합, 픽업 알림까지<br />
            SSAFY COFFEE가 함께합니다.
          </IntroText>
          <Divider />
          <Footer>
            <HideLabel>
              <input
                type="checkbox"
                checked={hideWeek}
                onChange={e => setHideWeek(e.target.checked)}
              />
              일주일간 보지 않기
            </HideLabel>
            <StartBtn onClick={handleStart}>시작하기</StartBtn>
          </Footer>
        </Body>
      </LandingModal_>
    </ModalBackdrop>
  )
}
