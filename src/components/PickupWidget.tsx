import { useEffect, useState } from 'react'
import { useOrders } from '../context/OrderContext'
import { drawPickup, getTodayPickup, savePickupResult, type PickupResult } from '../services/pickupService'
import PickupModal from './PickupModal'

function isDrawTime(): boolean {
  const now = new Date()
  return now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 40)
}

export default function PickupWidget() {
  const { orders } = useOrders()
  const [result, setResult] = useState<PickupResult | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Firebase에서 오늘 당첨자 조회
  useEffect(() => {
    getTodayPickup().then(res => {
      if (res) setResult(res)
    })
  }, [])

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

        {result ? (
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
            <p>11:40에 자동 추첨됩니다</p>
          </div>
        )}
      </div>

      {showModal && result && (
        <PickupModal result={result} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
