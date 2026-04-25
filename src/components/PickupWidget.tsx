import { useEffect, useState } from 'react'
import { useOrders } from '../context/OrderContext'
import { drawPickup, getTodayPickup, savePickupResult, sendPickupNotification, type PickupResult } from '../services/pickupService'
import PickupModal from './PickupModal'
import siteConfig from '../data/siteConfig.json'

function isDrawTime(): boolean {
  const { hour, minute } = siteConfig.closingTime
  const now = new Date()
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)
}

type Props = {
  autoOpenModal?: boolean
}

export default function PickupWidget({ autoOpenModal = false }: Props) {
  const { orders } = useOrders()
  const [result, setResult] = useState<PickupResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [pickupLoading, setPickupLoading] = useState(true)

  // Firebase에서 오늘 당첨자 조회
  useEffect(() => {
    getTodayPickup().then(res => {
      if (res) setResult(res)
      setPickupLoading(false)
    })
  }, [])

  // 결과 첫 수신 시 Electron 토스트 알림 (하루 1회) + autoOpenModal 처리
  useEffect(() => {
    if (!result) return
    const today = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10)
    if (localStorage.getItem('coffy_pickup_notified') !== today) {
      localStorage.setItem('coffy_pickup_notified', today)
      window.electronAPI?.notifyPickup(result.winners)
    }
    if (autoOpenModal) setShowModal(true)
  }, [result, autoOpenModal])

  // 11:40 감지 → 당첨자 없으면 자동 추첨
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
        await sendPickupNotification(picked, orders.length)
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
      <div className="pickup-widget">
        <div className="pickup-title-row">
          <div className="pickup-title">오늘의 픽업 👑</div>
          {result && (
            <button className="pickup-detail-btn" onClick={() => setShowModal(true)}>
              자세히 보기
            </button>
          )}
        </div>

        {pickupLoading ? (
          <div className="pickup-waiting loading-text">불러오는 중...</div>
        ) : result ? (
          <div className="pickup-winner-card">
            <div className="pickup-winners">
              {result.winners.map((w, i) => (
                <div key={i} className="pickup-winner-row">
                  <span className="pickup-winner-name">{w.name}</span>
                  <span className="pickup-winner-class">{w.class}반</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pickup-waiting">
            <div className="pickup-lock">🔒</div>
            <p>{siteConfig.closingTime.hour}:{String(siteConfig.closingTime.minute).padStart(2, '0')}에 자동 추첨됩니다</p>
          </div>
        )}
      </div>

      {showModal && result && (
        <PickupModal result={result} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
