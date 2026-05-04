import { useState, useEffect } from 'react'
import PickupModal from '../../components/PickupModal'
import { getTodayPickup, type PickupResult } from '../../services/pickupService'
import siteConfig from '../../data/siteConfig.json'

export default function PickupPage() {
  const [result, setResult] = useState<PickupResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTodayPickup().then(res => {
      setResult(res)
      setLoading(false)
      if (!res) window.electronAPI?.resizeWindow(300, 160)
    })
  }, [])

  if (loading) {
    return (
      <div className="pickup-page">
        <p style={{ color: '#ffe8cc' }}>불러오는 중...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="pickup-page">
        <div style={{ color: '#ffe8cc', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
          <p>{siteConfig.closingTime.hour}:{String(siteConfig.closingTime.minute).padStart(2, '0')}에 자동 추첨됩니다</p>
        </div>
      </div>
    )
  }

  return <PickupModal result={result} onClose={() => window.close()} />
}
