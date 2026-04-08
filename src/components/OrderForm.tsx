import { useState } from 'react'
import { MENU_ITEMS, OPTION_ITEMS } from '../constants/coffeeMenu'
import type { MenuTemp } from '../constants/coffeeMenu'
import TempBadge from './TempBadge'
import type { Order } from '../context/OrderContext'

type Props = {
  onSubmit: (order: Order) => void
  disabled: boolean
}

export default function OrderForm({ onSubmit, disabled }: Props) {
  const [name, setName] = useState('')
  const [cls, setCls] = useState('')
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [customMenu, setCustomMenu] = useState('')
  const [isCustomMenu, setIsCustomMenu] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [tempOption, setTempOption] = useState<MenuTemp>('ICE')
  const [priceOverride, setPriceOverride] = useState<number | ''>('')

  const autoPrice = isCustomMenu ? 0 : (MENU_ITEMS.find(m => `${m.temp} ${m.name}` === selectedMenu)?.price ?? 0)
  const menuBasePrice = priceOverride !== '' ? priceOverride : autoPrice

  const optionTotal = selectedOptions.reduce((sum, opt) => {
    return sum + (OPTION_ITEMS.find(o => o.name === opt)?.price ?? 0)
  }, 0)

  const totalPrice = menuBasePrice + optionTotal
  const currentMenu = isCustomMenu ? customMenu : selectedMenu

  function handleMenuClick(fullName: string, price: number, temp: MenuTemp) {
    setIsCustomMenu(false)
    setCustomMenu('')
    setSelectedMenu(fullName)
    setPriceOverride(price)
    setTempOption(temp)
  }

  function handleCustomMenuClick() {
    setSelectedMenu(null)
    setIsCustomMenu(true)
    setPriceOverride('')
  }

  function toggleOption(name: string) {
    setSelectedOptions(prev =>
      prev.includes(name) ? prev.filter(o => o !== name) : [...prev, name]
    )
  }

  function toggleTemp(temp: MenuTemp) {
    setTempOption(temp)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !cls || !currentMenu || !menuBasePrice) return

    const menuName = isCustomMenu ? currentMenu : currentMenu.slice(4)

    const optionText = selectedOptions.length > 0 ? `\n옵션: ${selectedOptions.join(', ')}` : ''
    const confirmed = window.confirm(
      `주문을 확인해주세요!\n\n이름: ${name} (${cls})\n메뉴: [${tempOption}] ${menuName}${optionText}\n가격: ${totalPrice.toLocaleString()}원\n\n주문하시겠습니까?`
    )
    if (!confirmed) return

    onSubmit({ name, class: cls, menu: menuName, temp: tempOption, options: selectedOptions, price: totalPrice })

    setName('')
    setCls('')
    setSelectedMenu(null)
    setCustomMenu('')
    setIsCustomMenu(false)
    setSelectedOptions([])
    setTempOption('ICE')
    setPriceOverride('')
  }

  const canSubmit = !!name && !!cls && !!currentMenu && menuBasePrice > 0

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-section-title">
        주문하기 {disabled && <span className="closed-badge">마감</span>}
      </div>

      {/* 이름 / 반 */}
      <div className="form-row-inline">
        <div className="form-row">
          <label>이름</label>
          <input value={name} onChange={e => setName(e.target.value)} disabled={disabled} placeholder="김싸피" />
        </div>
        <div className="form-row">
          <label>반</label>
          <input value={cls} onChange={e => setCls(e.target.value)} disabled={disabled} placeholder="1" />
        </div>
      </div>

      {/* 메뉴 선택 */}
      <div className="kiosk-section">
        <div className="kiosk-label">메뉴</div>
        <div className="kiosk-grid">
          {MENU_ITEMS.map(item => {
            const fullName = `${item.temp} ${item.name}`
            return (
              <button
                key={fullName}
                type="button"
                className={`kiosk-btn ${selectedMenu === fullName && !isCustomMenu ? 'selected' : ''}`}
                onClick={() => handleMenuClick(fullName, item.price, item.temp)}
                disabled={disabled}
              >
                <div className="kiosk-badge-row"><TempBadge temp={item.temp} size="sm" /></div>
                <span className="kiosk-btn-name">{item.name}</span>
                <span className="kiosk-btn-price">{item.price.toLocaleString()}원</span>
              </button>
            )
          })}
          {isCustomMenu ? (
            <div className="kiosk-btn kiosk-btn-other selected kiosk-btn-input">
              <input
                className="kiosk-inline-input"
                placeholder="메뉴명 입력"
                value={customMenu}
                onChange={e => setCustomMenu(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
                disabled={disabled}
              />
            </div>
          ) : (
            <button
              type="button"
              className="kiosk-btn kiosk-btn-other"
              onClick={handleCustomMenuClick}
              disabled={disabled}
            >
              <span className="kiosk-btn-name">기타</span>
              <span className="kiosk-btn-price">직접 입력</span>
            </button>
          )}
        </div>
      </div>

      {/* 옵션 선택 */}
      <div className="kiosk-section">
        <div className="kiosk-label">옵션 <span className="kiosk-label-sub">(중복 선택 가능)</span></div>
        <div className="kiosk-options">
          {/* ICE / HOT 토글 */}
          <button
            type="button"
            className={`option-btn option-btn-ice ${tempOption === 'ICE' ? 'selected' : ''}`}
            onClick={() => toggleTemp('ICE')}
            disabled={disabled || !isCustomMenu}
          >
            ICE
          </button>
          <button
            type="button"
            className={`option-btn option-btn-hot ${tempOption === 'HOT' ? 'selected' : ''}`}
            onClick={() => toggleTemp('HOT')}
            disabled={disabled || !isCustomMenu}
          >
            HOT
          </button>
          <div className="option-divider" />
          {OPTION_ITEMS.map(opt => (
            <button
              key={opt.name}
              type="button"
              className={`option-btn ${selectedOptions.includes(opt.name) ? 'selected' : ''}`}
              onClick={() => toggleOption(opt.name)}
              disabled={disabled}
            >
              {opt.name}{opt.price > 0 && <span className="option-price"> +{opt.price.toLocaleString()}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 가격 */}
      <div className="kiosk-section">
        <div className="kiosk-label">가격 <span className="kiosk-label-sub">(메뉴 선택 시 자동 입력, 수정 가능)</span></div>
        <div className="form-row">
          <input
            type="number"
            placeholder="메뉴를 먼저 선택하세요"
            value={priceOverride}
            onChange={e => setPriceOverride(e.target.value === '' ? '' : Number(e.target.value))}
            onWheel={e => {
              e.preventDefault()
              const delta = e.deltaY < 0 ? 100 : -100
              setPriceOverride(prev => Math.max(0, (prev === '' ? 0 : prev) + delta))
            }}
            disabled={disabled || (!selectedMenu && !isCustomMenu)}
          />
        </div>
      </div>

      {/* 요약 */}
      {currentMenu && (
        <div className="order-summary">
          <div className="summary-menu">
            <TempBadge temp={tempOption} />
            <span>{isCustomMenu ? currentMenu : currentMenu.slice(4)}</span>
          </div>
          {selectedOptions.length > 0 && (
            <span className="summary-options">· {selectedOptions.join(', ')}</span>
          )}
          <span className="summary-price">{totalPrice.toLocaleString()}원</span>
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={disabled || !canSubmit}>
        주문하기
      </button>
    </form>
  )
}
