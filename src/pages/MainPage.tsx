import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoticeBoard from '../components/NoticeBoard'
import OrderForm from '../components/OrderForm'
import PickupWidget from '../components/PickupWidget'
import PatchNotesModal from '../components/PatchNotesModal'
import { useOrders } from '../context/OrderContext'
import patchNotes from '../data/patchNotes.json'

const LATEST_VERSION = patchNotes[0].version
const STORAGE_KEY = 'lastSeenPatchVersion'

function isClosed(): boolean {
  const now = new Date()
  return now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 40)
}

export default function MainPage() {
  const { addOrder, orders, loading } = useOrders()
  const [closed, setClosed] = useState(import.meta.env.DEV ? false : isClosed())
  const [showPatchNotes, setShowPatchNotes] = useState(false)
  const [hasNewPatch, setHasNewPatch] = useState(localStorage.getItem(STORAGE_KEY) !== LATEST_VERSION)
  const navigate = useNavigate()

  function handleOpenPatchNotes() {
    setShowPatchNotes(true)
    localStorage.setItem(STORAGE_KEY, LATEST_VERSION)
    setHasNewPatch(false)
  }

  useEffect(() => {
    if (import.meta.env.DEV) return
    const interval = setInterval(() => setClosed(isClosed()), 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="main-layout">
      {/* 왼쪽: 로고 + 공지 */}
      <div className="left-panel">
        <div className="top-btn-group">
          <button className="patch-notes-btn" onClick={handleOpenPatchNotes}>
            패치노트
            {hasNewPatch && <span className="patch-new-dot" />}
          </button>
          <button className="inquiry-top-btn" onClick={() => navigate('/inquiry')}>
            문의하기
          </button>
        </div>
        <div className="logo-area">
          <div className="logo">☕</div>
          <h1>SSAFY COFFEE</h1>
          <p>MEGA COFFEE</p>
          <p className="deadline">매일 11:40 마감</p>
        </div>
        <NoticeBoard />
        <PickupWidget />
        <button className="view-orders-btn" onClick={() => navigate('/orders')}>
          오늘의 주문 목록 보기 →
          <span className="order-count">{loading ? '…' : `${orders.length}건`}</span>
        </button>
      </div>

      {/* 오른쪽: 주문 폼 */}
      <div className="right-panel">
        <OrderForm
          onSubmit={async orders => { await Promise.all(orders.map(addOrder)); navigate('/orders') }}
          disabled={closed}
        />
      </div>
      {showPatchNotes && <PatchNotesModal onClose={() => setShowPatchNotes(false)} />}
    </div>
  )
}
