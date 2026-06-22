import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { ThemeProvider } from 'styled-components'
import { useOrders, type Order } from '../../context/OrderContext'
import { getOrdersByDate, getTodayKST } from '../../services/orderService'
import TempBadge from '../../components/TempBadge'
import PageLayout from '../../components/PageLayout'
import { StyledTable, DeleteOrderBtn } from '../../styles/shared'
import { lightTheme } from '../../styles/theme'
import {
  MetaText, SaveImageBtn, AccountWrap, AccountLabel, AccountValue,
  GroupHeaderRow, GroupToggle, GroupCountCell, GroupNameCell,
  GroupChildRow, GroupChildIndex, MenuCell,
  CaptureOffscreen, CaptureTable, CaptureHeader, CaptureTitle, CaptureDate,
  CalendarWrap, CalendarIconBtn, CalendarDropdown,
  CalendarHeader, CalendarMonthLabel, CalendarNavBtn,
  CalendarGrid, CalendarDayLabel, CalendarDay, BackTodayBtn,
} from './OrderListPage.styled'
import siteConfig from '../../data/siteConfig.json'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function isClosed(): boolean {
  const { hour, minute } = siteConfig.closingTime
  const now = new Date()
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}.${m}.${d}`
}

export default function OrderListPage() {
  const { orders: todayOrders, loading: todayLoading, removeOrder } = useOrders()
  const captureRef = useRef<HTMLDivElement>(null)
  const calCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const todayKST = getTodayKST()
  const todayDisplay = new Date().toLocaleDateString('ko-KR')
  const closed = import.meta.env.DEV ? false : isClosed()

  // 날짜 선택 상태
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [histOrders, setHistOrders] = useState<Order[]>([])
  const [histLoading, setHistLoading] = useState(false)

  // 달력 열림 상태
  const [calOpen, setCalOpen] = useState(false)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  // 그룹 펼치기 상태
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const isToday = selectedDate === null || selectedDate === todayKST
  const orders = isToday ? todayOrders : histOrders
  const loading = isToday ? todayLoading : histLoading

  useEffect(() => {
    if (!selectedDate || selectedDate === todayKST) return
    setHistLoading(true)
    setHistOrders([])
    getOrdersByDate(selectedDate).then(data => {
      setHistOrders(data)
      setHistLoading(false)
    })
  }, [selectedDate, todayKST])

  const total = orders.reduce((sum, o) => sum + o.price * (o.qty ?? 1), 0)

  const groupedOrders = useMemo(() => {
    const map = new Map<string, (typeof orders)>()
    for (const order of orders) {
      const key = `${order.name}\x00${order.class}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(order)
    }
    for (const groupOrders of map.values()) {
      groupOrders.sort((a, b) => a.menu.localeCompare(b.menu, 'ko'))
    }
    return Array.from(map.entries()).sort(([, aOrders], [, bOrders]) => {
      const clsCmp = (aOrders[0]?.class ?? '').localeCompare(bOrders[0]?.class ?? '', 'ko')
      if (clsCmp !== 0) return clsCmp
      return (aOrders[0]?.name ?? '').localeCompare(bOrders[0]?.name ?? '', 'ko')
    })
  }, [orders])

  const captureItems = useMemo(() => {
    const map = new Map<string, { temp: typeof orders[0]['temp'], menu: string, options: string[], qty: number, unitPrice: number }>()
    for (const o of orders) {
      const qty = o.qty ?? 1
      const key = `${o.temp}||${o.menu}||${[...o.options].sort().join('|')}`
      if (map.has(key)) {
        map.get(key)!.qty += qty
      } else {
        map.set(key, { temp: o.temp, menu: o.menu, options: o.options, qty, unitPrice: o.price })
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const menuCmp = a.menu.localeCompare(b.menu, 'ko')
      if (menuCmp !== 0) return menuCmp
      if (a.temp !== b.temp) return a.temp.localeCompare(b.temp)
      return a.options.join(',').localeCompare(b.options.join(','), 'ko')
    })
  }, [orders])

  const totalQty = captureItems.reduce((sum, item) => sum + item.qty, 0)

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
    await document.fonts.ready

    const el = captureRef.current
    el.style.left = '0'
    el.style.zIndex = '-1'

    const dataUrl = await toPng(el, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    })

    el.style.left = ''
    el.style.zIndex = ''

    const label = selectedDate ?? new Date().toISOString().slice(0, 10)
    const link = document.createElement('a')
    link.download = `주문목록_${label}.png`
    link.href = dataUrl
    link.click()
  }

  function handleCopyAccount() {
    navigator.clipboard.writeText(siteConfig.account)
  }

  // 달력 데이터 계산
  function buildCalendarDays(base: Date): (string | null)[] {
    const year = base.getFullYear()
    const month = base.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (string | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      cells.push(`${year}-${mm}-${dd}`)
    }
    return cells
  }

  const calendarDays = buildCalendarDays(calMonth)

  function handleCalendarSelect(date: string) {
    if (date > todayKST) return
    setSelectedDate(date === todayKST ? null : date)
    setExpandedGroups(new Set())
    setCalOpen(false)
  }

  function prevMonth() {
    setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  }

  function nextMonth() {
    const next = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1)
    const nowMonth = new Date()
    if (next.getFullYear() > nowMonth.getFullYear() || (next.getFullYear() === nowMonth.getFullYear() && next.getMonth() > nowMonth.getMonth())) return
    setCalMonth(next)
  }

  const isCurrentMonth = calMonth.getMonth() === new Date().getMonth() && calMonth.getFullYear() === new Date().getFullYear()

  const handleCalMouseEnter = useCallback(() => {
    if (calCloseTimer.current) clearTimeout(calCloseTimer.current)
    setCalOpen(true)
  }, [])

  const handleCalMouseLeave = useCallback(() => {
    calCloseTimer.current = setTimeout(() => setCalOpen(false), 200)
  }, [])

  const dateLabel = isToday
    ? todayDisplay
    : formatDisplayDate(selectedDate!)

  const pageTitle = isToday ? '오늘의 주문 목록' : `${formatDisplayDate(selectedDate!)} 주문 목록`

  const calendarDropdown = (
    <CalendarWrap onMouseEnter={handleCalMouseEnter} onMouseLeave={handleCalMouseLeave}>
      {!isToday && (
        <BackTodayBtn onClick={() => { setSelectedDate(null); setExpandedGroups(new Set()) }}>
          오늘로
        </BackTodayBtn>
      )}
      <CalendarIconBtn title="날짜별 주문 조회">📅</CalendarIconBtn>
      <CalendarDropdown $open={calOpen}>
        <CalendarHeader>
          <CalendarNavBtn onClick={prevMonth}>‹</CalendarNavBtn>
          <CalendarMonthLabel>
            {calMonth.getFullYear()}년 {calMonth.getMonth() + 1}월
          </CalendarMonthLabel>
          <CalendarNavBtn onClick={nextMonth} disabled={isCurrentMonth} style={{ opacity: isCurrentMonth ? 0.3 : 1 }}>›</CalendarNavBtn>
        </CalendarHeader>
        <CalendarGrid>
          {DAY_LABELS.map(d => (
            <CalendarDayLabel key={d}>{d}</CalendarDayLabel>
          ))}
          {calendarDays.map((date, i) => {
            if (!date) return <CalendarDay key={`empty-${i}`} $empty disabled />
            const isTodayCell = date === todayKST
            const isSelected = date === (selectedDate ?? todayKST)
            const isFuture = date > todayKST
            return (
              <CalendarDay
                key={date}
                $today={isTodayCell && !isSelected}
                $selected={isSelected}
                disabled={isFuture}
                style={{ opacity: isFuture ? 0.3 : 1, cursor: isFuture ? 'default' : 'pointer' }}
                onClick={() => handleCalendarSelect(date)}
              >
                {parseInt(date.slice(8))}
              </CalendarDay>
            )
          })}
        </CalendarGrid>
      </CalendarDropdown>
    </CalendarWrap>
  )

  const actions = (
    <>
      <MetaText>{dateLabel} / 총 {totalQty}잔</MetaText>
      {orders.length > 0 && (
        <SaveImageBtn onClick={handleSaveImage}>이미지로 저장</SaveImageBtn>
      )}
      {siteConfig.account && (
        <AccountWrap>
          <AccountLabel>입금 계좌 : </AccountLabel>
          <AccountValue onClick={handleCopyAccount} title="클릭하여 복사">
            {siteConfig.account}
          </AccountValue>
        </AccountWrap>
      )}
      <div style={{ marginLeft: 'auto' }}>{calendarDropdown}</div>
    </>
  )

  return (
    <PageLayout title={pageTitle} backPath="/" actions={actions}>
      <>
        {/* 화면용 그룹 테이블 */}
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th style={{ width: '80px' }}>이름</th>
              <th style={{ width: '48px' }}>반</th>
              <th>메뉴</th>
              <th style={{ width: '200px' }}>옵션</th>
              <th>수량</th>
              <th>가격</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }} className="loading-text">불러오는 중...</td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>주문이 없습니다.</td>
              </tr>
            )}
            {!loading && groupedOrders.map(([name, groupOrders]) => {
              const expanded = expandedGroups.has(name)
              const groupTotal = groupOrders.reduce((s, o) => s + o.price * (o.qty ?? 1), 0)
              const isMulti = groupOrders.length > 1
              return [
                <GroupHeaderRow
                  key={`group-${name}`}
                  $clickable={isMulti}
                  onClick={isMulti ? () => toggleGroup(name) : undefined}
                >
                  <GroupCountCell>
                    {isMulti && (
                      <GroupToggle>{expanded ? '▼' : '▶'}</GroupToggle>
                    )}
                  </GroupCountCell>
                  <GroupNameCell>{groupOrders[0].name}</GroupNameCell>
                  <td>{groupOrders[0].class}</td>
                  {isMulti ? (
                    <td colSpan={3}>{groupOrders.reduce((s, o) => s + (o.qty ?? 1), 0)}잔</td>
                  ) : (
                    <>
                      <td><MenuCell><TempBadge temp={groupOrders[0].temp} size="sm" />{groupOrders[0].menu}</MenuCell></td>
                      <td>{groupOrders[0].options.length > 0 ? groupOrders[0].options.join(', ') : '-'}</td>
                      <td>{groupOrders[0].qty ?? 1}</td>
                    </>
                  )}
                  <td>{isMulti ? groupTotal.toLocaleString() + '원' : (groupOrders[0].price * (groupOrders[0].qty ?? 1)).toLocaleString() + '원'}</td>
                  <td>{isToday && !isMulti && <DeleteOrderBtn onClick={e => { e.stopPropagation(); handleDelete(groupOrders[0]) }}>✕</DeleteOrderBtn>}</td>
                </GroupHeaderRow>,
                ...(expanded && isMulti ? groupOrders.map((o, j) => (
                  <GroupChildRow key={o.id ?? j}>
                    <GroupChildIndex>{j + 1}</GroupChildIndex>
                    <td></td>
                    <td></td>
                    <td>
                      <MenuCell><TempBadge temp={o.temp} size="sm" />{o.menu}</MenuCell>
                    </td>
                    <td>{o.options.length > 0 ? o.options.join(', ') : '-'}</td>
                    <td>{o.qty ?? 1}</td>
                    <td>{(o.price * (o.qty ?? 1)).toLocaleString()}원</td>
                    <td>{isToday && <DeleteOrderBtn onClick={() => handleDelete(o)}>✕</DeleteOrderBtn>}</td>
                  </GroupChildRow>
                )) : [])
              ]
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>합계</td>
              <td>{total.toLocaleString()}원</td>
              <td></td>
            </tr>
          </tfoot>
        </StyledTable>

        {/* 이미지 저장용 (화면 밖에 숨김, 이름/반 제외) */}
        <ThemeProvider theme={lightTheme}>
        <CaptureOffscreen ref={captureRef}>
          <CaptureHeader>
            <CaptureTitle>{siteConfig.serviceName} / 주문 목록</CaptureTitle>
            <CaptureDate>{dateLabel} / 총 {totalQty}잔 / 합계 {total.toLocaleString()}원</CaptureDate>
          </CaptureHeader>
          <CaptureTable>
            <thead>
              <tr>
                <th>#</th>
                <th>메뉴</th>
                <th>옵션</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {captureItems.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      marginRight: '5px',
                      verticalAlign: 'middle',
                      letterSpacing: 0,
                      background: item.temp === 'ICE' ? '#dbeafe' : '#fee2e2',
                      color: item.temp === 'ICE' ? '#1d4ed8' : '#b91c1c',
                      border: `1px solid ${item.temp === 'ICE' ? '#93c5fd' : '#fca5a5'}`,
                    }}>{item.temp}</span>{item.menu}
                  </td>
                  <td>{item.options.length > 0 ? item.options.join(', ') : '-'}</td>
                  <td>{item.qty}</td>
                  <td>{(item.unitPrice * item.qty).toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>합계</td>
                <td>{total.toLocaleString()}원</td>
              </tr>
            </tfoot>
          </CaptureTable>
        </CaptureOffscreen>
        </ThemeProvider>
      </>
    </PageLayout>
  )
}
