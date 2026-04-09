import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { useOrders } from '../context/OrderContext'
import TempBadge from '../components/TempBadge'

export default function OrderListPage() {
  const { orders, removeOrder } = useOrders()
  const navigate = useNavigate()
  const captureRef = useRef<HTMLDivElement>(null)
  const total = orders.reduce((sum, o) => sum + o.price, 0)
  const today = new Date().toLocaleDateString('ko-KR')

  async function handleDelete(o: (typeof orders)[0]) {
    if (!o.id) return
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

  return (
    <div className="list-page">
      <div className="list-header">
        <button className="back-btn" onClick={() => navigate('/')}>← 돌아가기</button>
        <div className="list-title-area">
          <span className="logo">☕</span>
          <h1>오늘의 주문 목록</h1>
        </div>
        <div className="list-actions">
          <div className="list-meta">{today} / 총{orders.length}건</div>
          {orders.length > 0 && (
            <button className="save-image-btn" onClick={handleSaveImage}>
              이미지로 저장
            </button>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty">아직 주문이 없습니다.</div>
      ) : (
        <>
          {/* 화면용 테이블 (이름/반 포함) */}
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
              {orders.map((o, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{o.name}</td>
                  <td>{o.class}</td>
                  <td>
                    <span className="menu-cell"><TempBadge temp={o.temp} size="sm" />{o.menu}</span>
                  </td>
                  <td>{o.options.length > 0 ? o.options.join(', ') : '-'}</td>
                  <td>{o.price.toLocaleString()}원</td>
                  <td><button className="delete-order-btn" onClick={() => handleDelete(o)}>✕</button></td>
                </tr>
              ))}
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
              <div className="capture-title">SSAFY COFFEE / 주문 목록</div>
              <div className="capture-date">{today} / 총{orders.length}건 / 합계 {total.toLocaleString()}원</div>
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
      )}
    </div>
  )
}
