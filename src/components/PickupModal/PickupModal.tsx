import styled from 'styled-components'
import { ModalBackdrop, Modal, ModalBody, ModalHeader, ModalSub, ModalNote } from '../../styles/shared'
import type { Props } from './types'

const DrawList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DrawRow = styled.div<{ $winner?: boolean; $header?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: ${({ $winner, $header, theme }) =>
    $header ? theme.colors.surfaceAccent : $winner ? theme.colors.surfaceHighlight : theme.colors.surfaceAlt};
  border: ${({ $winner, $header, theme }) =>
    $header ? 'none' : $winner ? `1px solid #f59e0b` : `1px solid ${theme.colors.borderLight}`};
`

const DrawRank = styled.div`
  width: 28px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  text-align: center;
  flex-shrink: 0;
`

const DrawName = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  width: 64px;
  text-align: center;
  flex-shrink: 0;
`

const DrawClass = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  width: 40px;
  text-align: center;
  flex-shrink: 0;
`

const DrawBarWrap = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
`

const DrawBar = styled.div<{ $winner?: boolean }>`
  height: 100%;
  background: ${({ $winner }) =>
    $winner
      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
      : 'linear-gradient(90deg, #a0622a, #f59e0b)'};
  border-radius: 4px;
  transition: width 0.5s ease;
`

const DrawValue = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 40px;
  text-align: center;
  flex-shrink: 0;
`

const HeaderCell = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.label};
`

export default function PickupModal({ result, onClose }: Props) {
  return (
    <ModalBackdrop onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalBody>
          <ModalHeader>
            <h2>뽑기 결과 상세</h2>
          </ModalHeader>
          <ModalSub>
            {new Date(result.drawnAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 추첨
          </ModalSub>
          <DrawList>
            <DrawRow $header>
              <HeaderCell style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>순위</HeaderCell>
              <HeaderCell style={{ width: 64, textAlign: 'center', flexShrink: 0 }}>이름</HeaderCell>
              <HeaderCell style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>반</HeaderCell>
              <DrawBarWrap />
              <HeaderCell style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>점수</HeaderCell>
            </DrawRow>
            {result.draws.map((d, i) => {
              const isWinner = result.winners.some(w => w.name === d.name && w.class === d.class)
              return (
                <DrawRow key={i} $winner={isWinner}>
                  <DrawRank>{i + 1}</DrawRank>
                  <DrawName>{d.name}</DrawName>
                  <DrawClass>{d.class}</DrawClass>
                  <DrawBarWrap>
                    <DrawBar
                      $winner={isWinner}
                      style={{ width: `${(d.randomValue * 100).toFixed(1)}%` }}
                    />
                  </DrawBarWrap>
                  <DrawValue>{(d.randomValue * 100).toFixed(2)}</DrawValue>
                </DrawRow>
              )
            })}
          </DrawList>
          <ModalNote>* 각 참여자에게 0~100 사이의 랜덤값이 배정되며, 상위 {result.winners.length}명이 당첨됩니다.</ModalNote>
        </ModalBody>
      </Modal>
    </ModalBackdrop>
  )
}
