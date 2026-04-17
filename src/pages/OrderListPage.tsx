import { useRef, useState, useMemo } from 'react'
import html2canvas from 'html2canvas'
import { useOrders } from '../context/OrderContext'
import TempBadge from '../components/TempBadge'
import PageLayout from '../components/PageLayout'
import siteConfig from '../data/siteConfig.json'

function isClosed(): boolean {
  const { hour, minute } = siteConfig.closingTime
  const now = new Date()
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)
}

export default function OrderListPage() {
  const { orders, loading, removeOrder } = useOrders()
  const captureRef = useRef<HTMLDivElement>(null)
  const total = orders.reduce((sum, o) => sum + o.price, 0)
  const today = new Date().toLocaleDateString('ko-KR')
  const closed = import.meta.env.DEV ? false : isClosed()

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const groupedOrders = useMemo(() => {
    const map = new Map<string, (typeof orders)>()
    for (const order of orders) {
      if (!map.has(order.name)) map.set(order.name, [])
      map.get(order.name)!.push(order)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, 'ko'))
  }, [orders])

  function toggleGroup(name: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  async function handleDelete(o: (typeof orders)[0]) {
    if (!o.id) return
    if (closed) {
      const { hour, minute } = siteConfig.closingTime
      window.alert(`${hour}:${String(minute).padStart(2, '0')} 이후에는 주문을 취소할 수 없습니다.`)
      return
    }
    const input = window.prompt(`${o.name}님의 주문을 삭제하려면 비밀번호를 입력하세요.`)
    if (input === null) return
    if (input !== o.password) {
      window.alert('비밀번호가 일치하지 않습니다.')
      return
    }
    await removeOrder(o.id)
  }

  async function handleSaveImage() {
    if (!captureRef.current) return
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
    })
    const link = document.createElement('a')
    link.download = `주문목록_${new Date().toISOString().slice(0, 10)}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function handleCopyAccount() {
    navigator.clipboard.writeText(siteConfig.account)
  }

  const actions = (
    <>
      <div className="list-meta">{today} / 총 {orders.length}건</div>
      {orders.length > 0 && (
        <button className="save-image-btn" onClick={handleSaveImage}>
          이미지로 저장
        </button>
      )}
      {siteConfig.account && (
        <span className="order-account-wrap">
          <span className="order-account-label">입금 계좌 : </span>
          <strong className="order-account" onClick={handleCopyAccount} title="클릭하여 복사">
            {siteConfig.account}
          </strong>
        </span>
      )}
    </>
  )

  return (
    <PageLayout title="오늘의 주문 목록" backPath="/" actions={actions}>
      <>
          {/* 화면용 그룹 테이블 */}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>이름</th>
                <th>반</th>
                <th>메뉴</th>
                <th>옵션</th>
                <th>가격</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="table-empty-cell loading-text">불러오는 중...</td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-empty-cell">아직 주문이 없습니다.</td>
                </tr>
              )}
              {!loading && groupedOrders.map(([name, groupOrders]) => {
                const expanded = expandedGroups.has(name)
                const groupTotal = groupOrders.reduce((s, o) => s + o.price, 0)
                const isMulti = groupOrders.length > 1
                return [
                  <tr
                    key={`group-${name}`}
                    className={`group-header-row${isMulti ? ' group-clickable' : ''}`}
                    onClick={isMulti ? () => toggleGroup(name) : undefined}
                  >
                    <td className="group-count-cell">
                      {isMulti && (
                        <span className="group-toggle">{expanded ? '▼' : '▶'}</span>
                      )}
                    </td>
                    <td className="group-name-cell">{name}</td>
                    <td>{groupOrders[0].class}</td>
                    {isMulti ? (
                      <td colSpan={2}>{groupOrders.length}건</td>
                    ) : (
                      <>
                        <td><span className="menu-cell"><TempBadge temp={groupOrders[0].temp} size="sm" />{groupOrders[0].menu}</span></td>
                        <td>{groupOrders[0].options.length > 0 ? groupOrders[0].options.join(', ') : '-'}</td>
                      </>
                    )}
                    <td>{isMulti ? groupTotal.toLocaleString() + '원' : groupOrders[0].price.toLocaleString() + '원'}</td>
                    <td>{!isMulti && <button className="delete-order-btn" onClick={e => { e.stopPropagation(); handleDelete(groupOrders[0]) }}>✕</button>}</td>
                  </tr>,
                  ...(expanded && isMulti ? groupOrders.map((o, j) => (
                    <tr key={o.id ?? j} className="group-child-row">
                      <td className="group-child-index">{j + 1}</td>
                      <td></td>
                      <td></td>
                      <td>
                        <span className="menu-cell"><TempBadge temp={o.temp} size="sm" />{o.menu}</span>
                      </td>
                      <td>{o.options.length > 0 ? o.options.join(', ') : '-'}</td>
                      <td>{o.price.toLocaleString()}원</td>
                      <td><button className="delete-order-btn" onClick={() => handleDelete(o)}>✕</button></td>
                    </tr>
                  )) : [])
                ]
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>합계</td>
                <td>{total.toLocaleString()}원</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          {/* 이미지 저장용 (화면 밖에 숨김, 이름/반 제외) */}
          <div ref={captureRef} className="capture-area capture-offscreen">
            <div className="capture-header">
              <div className="capture-title">{siteConfig.serviceName} / 주문 목록</div>
              <div className="capture-date">{today} / 총 {orders.length}건 / 합계 {total.toLocaleString()}원</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>메뉴</th>
                  <th>옵션</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="menu-cell"><TempBadge temp={o.temp} size="sm" />{o.menu}</span>
                    </td>
                    <td>{o.options.length > 0 ? o.options.join(', ') : '-'}</td>
                    <td>{o.price.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>합계</td>
                  <td>{total.toLocaleString()}원</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
    </PageLayout>
  )
}
