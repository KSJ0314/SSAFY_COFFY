import { useState, useEffect } from 'react'
import styled from 'styled-components'
import PickupModal from '../../components/PickupModal'
import { getTodayPickup, type PickupResult } from '../../services/pickupService'
import siteConfig from '../../data/siteConfig.json'

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(160deg, ${({ theme }) => theme.colors.sidebarFrom}, ${({ theme }) => theme.colors.sidebarTo});
  color: #ffe8cc;
`

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
    return <Page><p>불러오는 중...</p></Page>
  }

  if (!result) {
    return (
      <Page>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
          <p>{siteConfig.closingTime.hour}:{String(siteConfig.closingTime.minute).padStart(2, '0')}에 자동 추첨됩니다</p>
        </div>
      </Page>
    )
  }

  return <PickupModal result={result} onClose={() => window.close()} />
}
