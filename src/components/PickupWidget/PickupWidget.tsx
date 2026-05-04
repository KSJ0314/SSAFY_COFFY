import { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useOrders } from '../../context/OrderContext'
import { drawPickup, getTodayPickup, savePickupResult, sendPickupNotification, type PickupResult } from '../../services/pickupService'
import PickupModal from '../PickupModal'
import siteConfig from '../../data/siteConfig.json'
import type { Props } from './types'

const Wrap = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 16px;
  color: #ffe8cc;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
`

const Title = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffd080;
`

const DetailBtn = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: #fff8f0;
  padding: 2px 8px;
  font-size: 0.68rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
`

const Waiting = styled.div<{ $loading?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  ${({ $loading }) => $loading && css`animation: ${pulse} 1.2s ease-in-out infinite;`}

  p {
    font-size: 0.82rem;
    color: #c8a882;
  }
`

const Lock = styled.div`
  font-size: 1.8rem;
  opacity: 0.6;
`

const WinnerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
`

const Winners = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 10px;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const WinnerRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

const WinnerName = styled.span`
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffd080;
`

const WinnerClass = styled.span`
  font-size: 0.82rem;
  color: #c8a882;
`

function isDrawTime(): boolean {
  const { hour, minute } = siteConfig.closingTime
  const now = new Date()
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)
}

export default function PickupWidget({ autoOpenModal = false }: Props) {
  const { orders } = useOrders()
  const [result, setResult] = useState<PickupResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [pickupLoading, setPickupLoading] = useState(true)

  useEffect(() => {
    getTodayPickup().then(res => {
      if (res) setResult(res)
      setPickupLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!result) return
    const today = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10)
    if (localStorage.getItem('coffy_pickup_notified') !== today) {
      localStorage.setItem('coffy_pickup_notified', today)
      window.electronAPI?.notifyPickup(result.winners)
    }
    if (autoOpenModal) setShowModal(true)
  }, [result, autoOpenModal])

  useEffect(() => {
    if (result) return

    async function tryDraw() {
      if (!isDrawTime() || orders.length === 0) return

      const existing = await getTodayPickup()
      if (existing) { setResult(existing); return }

      const picked = drawPickup(orders)
      const saved = await savePickupResult(picked)
      if (saved) {
        setResult(picked)
        const totalQty = orders.reduce((sum, o) => sum + (o.qty ?? 1), 0)
        await sendPickupNotification(picked, totalQty)
      } else {
        const fallback = await getTodayPickup()
        if (fallback) setResult(fallback)
      }
    }

    tryDraw()
    const interval = setInterval(tryDraw, 5000)
    return () => clearInterval(interval)
  }, [orders, result])

  return (
    <>
      <Wrap>
        <TitleRow>
          <Title>오늘의 픽업 👑</Title>
          {result && (
            <DetailBtn onClick={() => setShowModal(true)}>
              자세히 보기
            </DetailBtn>
          )}
        </TitleRow>

        {pickupLoading ? (
          <Waiting $loading>불러오는 중...</Waiting>
        ) : result ? (
          <WinnerCard>
            <Winners>
              {result.winners.map((w, i) => (
                <WinnerRow key={i}>
                  <WinnerName>{w.name}</WinnerName>
                  <WinnerClass>{w.class}반</WinnerClass>
                </WinnerRow>
              ))}
            </Winners>
          </WinnerCard>
        ) : (
          <Waiting>
            <Lock>🔒</Lock>
            <p>{siteConfig.closingTime.hour}:{String(siteConfig.closingTime.minute).padStart(2, '0')}에 자동 추첨됩니다</p>
          </Waiting>
        )}
      </Wrap>

      {showModal && result && (
        <PickupModal result={result} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
