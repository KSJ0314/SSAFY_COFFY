import { useState } from 'react'
import styled from 'styled-components'
import { SubmitBtn } from '../OrderForm/OrderForm.styled'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  width: 760px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 32px ${({ theme }) => theme.colors.shadow};
`

const Title = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 320px;
  padding: 10px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textInput};
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const TestBtn = styled(SubmitBtn)`
  padding: 10px 18px;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1.5px solid ${({ theme }) => theme.colors.accent};

  &:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }
`

const SendBtn = styled(SubmitBtn)`
  padding: 10px 18px;
  font-size: 0.9rem;
`

type Status = 'idle' | 'sending' | 'ok' | 'error'

interface Props {
  onClose: () => void
}

export default function MMWebhookModal({ onClose }: Props) {
  const [message, setMessage] = useState('')
  const [testStatus, setTestStatus] = useState<Status>('idle')
  const [prodStatus, setProdStatus] = useState<Status>('idle')

  async function send(url: string, setStatus: (s: Status) => void) {
    if (!url || !message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 3000)
  }

  function label(status: Status, defaultText: string) {
    if (status === 'sending') return '전송 중…'
    if (status === 'ok') return '전송됨 ✓'
    if (status === 'error') return '실패 ✗'
    return defaultText
  }

  const devUrl = import.meta.env.VITE_MM_WEBHOOK_URL
  const prodUrl = import.meta.env.VITE_MM_WEBHOOK_PROD_URL
  const isSending = testStatus === 'sending' || prodStatus === 'sending'

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>MM 웹훅 전송 (dev only)</Title>
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="전송할 메시지를 입력하세요. Mattermost 마크다운 지원"
          autoFocus
        />
        <BtnRow>
          <TestBtn
            type="button"
            disabled={isSending || !message.trim()}
            onClick={() => send(devUrl, setTestStatus)}
          >
            {label(testStatus, '테스트 전송')}
          </TestBtn>
          <SendBtn
            type="button"
            disabled={isSending || !message.trim()}
            onClick={() => send(prodUrl, setProdStatus)}
          >
            {label(prodStatus, '전송')}
          </SendBtn>
        </BtnRow>
      </Modal>
    </Overlay>
  )
}
