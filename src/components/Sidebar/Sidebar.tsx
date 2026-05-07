import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../../context/OrderContext'
import NoticeBoard from '../NoticeBoard'
import PickupWidget from '../PickupWidget'
import PatchNotesModal from '../PatchNotesModal'
import patchNotes from '../../data/patchNotes.json'
import siteConfig from '../../data/siteConfig.json'
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

const Panel = styled.div`
  position: relative;
  width: 340px;
  flex-shrink: 0;
  background: linear-gradient(160deg, ${({ theme }) => theme.colors.sidebarFrom}, ${({ theme }) => theme.colors.sidebarTo});
  padding: 56px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TopBtnGroup = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
`

const TopBtn = styled.button<{ $relative?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #d4a87a;
  font-size: 0.72rem;
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.2s;
  position: ${({ $relative }) => ($relative ? 'relative' : 'static')};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`


const NewDot = styled.span`
  position: absolute;
  top: 1px;
  right: 1px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.sidebarFrom};
`

const DownloadBtnWrap = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
`

const DownloadBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 7px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }
`

const UpdateDot = styled.span`
  position: absolute;
  top: 1px;
  right: 1px;
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.sidebarFrom};
  pointer-events: none;
`

const LogoArea = styled.div`
  text-align: center;
  color: #fff8f0;

  .logo {
    font-size: 3rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 3px;
    margin-top: 4px;
  }

  p {
    font-size: 0.8rem;
    color: #d4a87a;
    letter-spacing: 2px;
    margin-top: 2px;
  }
`

const Deadline = styled.p`
  margin-top: 8px !important;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.8rem !important;
  color: #ffe0b2 !important;
  display: inline-block;
`

const ViewOrdersBtn = styled.button`
  margin-top: auto;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: #fff8f0;
  padding: 12px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`

const OrderCount = styled.span`
  background: #f59e0b;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
`

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
    <Panel>
      <TopBtnGroup>
        <TopBtn $relative onClick={handleOpenPatchNotes}>
          패치노트
          {hasNewPatch && <NewDot />}
        </TopBtn>
        <TopBtn onClick={() => navigate('/inquiry')}>
          자유 게시판
        </TopBtn>
        <DownloadBtnWrap>
          <DownloadBtn
            href={`https://github.com/KSJ0314/SSAFY_COFFY/releases/download/electron-v${ELECTRON_VERSION}/SSAFY_COFFEE_Setup.exe`}
            title="SSAFY_COFFEE for Desktop"
            onClick={handleDownload}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v7M3.5 5.5l3 3 3-3M2 11h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </DownloadBtn>
          {hasElectronUpdate && <UpdateDot />}
        </DownloadBtnWrap>
      </TopBtnGroup>

      <LogoArea>
        <div className="logo">☕</div>
        <h1>{siteConfig.serviceName}</h1>
        <p>{siteConfig.cafeName}</p>
        <Deadline>
          매일 {siteConfig.closingTime.hour}:{String(siteConfig.closingTime.minute).padStart(2, '0')} 마감
        </Deadline>
      </LogoArea>

      <NoticeBoard />
      <PickupWidget />

      <ViewOrdersBtn onClick={() => navigate('/orders')}>
        오늘의 주문 목록 보기 →
        <OrderCount>{loading ? '…' : `${orders.reduce((sum, o) => sum + (o.qty ?? 1), 0)}잔`}</OrderCount>
      </ViewOrdersBtn>

      {showPatchNotes && <PatchNotesModal onClose={() => setShowPatchNotes(false)} />}
    </Panel>
  )
}
