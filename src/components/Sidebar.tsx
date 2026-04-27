import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../context/OrderContext'
import NoticeBoard from './NoticeBoard'
import PickupWidget from './PickupWidget'
import PatchNotesModal from './PatchNotesModal'
import patchNotes from '../data/patchNotes.json'
import siteConfig from '../data/siteConfig.json'
declare const __ELECTRON_VERSION__: string

const LATEST_VERSION = patchNotes[0].version
const STORAGE_KEY = 'lastSeenPatchVersion'

const ELECTRON_VERSION: string = __ELECTRON_VERSION__
const ELECTRON_VERSION_KEY = 'coffy_electron_version'

function isNewer(available: string, current: string): boolean {
  const p = (v: string) => v.split('.').map(Number)
  const [a, b, c] = p(available)
  const [x, y, z] = p(current)
  return a > x || (a === x && b > y) || (a === x && b === y && c > z)
}

export default function Sidebar() {
  const { orders, loading } = useOrders()
  const navigate = useNavigate()
  const [showPatchNotes, setShowPatchNotes] = useState(false)
  const [hasNewPatch, setHasNewPatch] = useState(localStorage.getItem(STORAGE_KEY) !== LATEST_VERSION)

  const storedElectronVersion = localStorage.getItem(ELECTRON_VERSION_KEY)
  const hasElectronUpdate = storedElectronVersion === null || isNewer(ELECTRON_VERSION, storedElectronVersion)

  function handleOpenPatchNotes() {
    setShowPatchNotes(true)
    localStorage.setItem(STORAGE_KEY, LATEST_VERSION)
    setHasNewPatch(false)
  }

  function handleDownload() {
    localStorage.setItem(ELECTRON_VERSION_KEY, ELECTRON_VERSION)
  }

  return (
    <div className="left-panel">
      <div className="top-btn-group">
        <button className="patch-notes-btn" onClick={handleOpenPatchNotes}>
          패치노트
          {hasNewPatch && <span className="patch-new-dot" />}
        </button>
        <button className="inquiry-top-btn" onClick={() => navigate('/inquiry')}>
          문의하기
        </button>
        <div className="download-btn-wrap">
          <a
            className="download-app-btn"
            href={`https://github.com/KSJ0314/SSAFY_COFFY/releases/download/electron-v${ELECTRON_VERSION}/SSAFY_COFFEE_Setup.exe`}
            title="SSAFY_COFFEE for Desktop"
            onClick={handleDownload}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v7M3.5 5.5l3 3 3-3M2 11h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          {hasElectronUpdate && <span className="electron-update-dot" />}
        </div>
      </div>

      <div className="logo-area">
        <div className="logo">☕</div>
        <h1>{siteConfig.serviceName}</h1>
        <p>{siteConfig.cafeName}</p>
        <p className="deadline">
          매일 {siteConfig.closingTime.hour}:{String(siteConfig.closingTime.minute).padStart(2, '0')} 마감
        </p>
      </div>

      <NoticeBoard />
      <PickupWidget />

      <button className="view-orders-btn" onClick={() => navigate('/orders')}>
        오늘의 주문 목록 보기 →
        <span className="order-count">{loading ? '…' : `${orders.length}건`}</span>
      </button>

      {showPatchNotes && <PatchNotesModal onClose={() => setShowPatchNotes(false)} />}
    </div>
  )
}
