import { useState, useEffect } from 'react'
import { OPTION_ITEMS } from '../constants/coffeeMenu'
import type { MenuTemp } from '../constants/coffeeMenu'
import TempBadge from './TempBadge'
import type { Order } from '../context/OrderContext'
import menuData from '../data/menuData.json'

type Props = {
  onSubmit: (order: Order) => void
  disabled: boolean
}

function getColCount(): number {
  const w = window.innerWidth
  if (w >= 1920) return 5
  if (w >= 1440) return 4
  return 3
}

export default function OrderForm({ onSubmit, disabled }: Props) {
  const [name, setName] = useState(() => localStorage.getItem('coffy_name') ?? '')
  const [cls, setCls] = useState(() => localStorage.getItem('coffy_class') ?? '')
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [customMenu, setCustomMenu] = useState('')
  const [isCustomMenu, setIsCustomMenu] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [tempOption, setTempOption] = useState<MenuTemp>('ICE')
  const [priceOverride, setPriceOverride] = useState<number | ''>('')
  const [isCustomOption, setIsCustomOption] = useState(false)
  const [customOption, setCustomOption] = useState('')
  const [customOptionPrice, setCustomOptionPrice] = useState<number | ''>('')
  const [password, setPassword] = useState('')
  const CUSTOM_CATEGORY = '기타'
  const [selectedCategory, setSelectedCategory] = useState(menuData[0].category)
  const [menuPage, setMenuPage] = useState(0)
  const [colCount, setColCount] = useState(getColCount)

  useEffect(() => {
    const handler = () => setColCount(getColCount())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const ITEMS_PER_PAGE = colCount * 2
  const allCategoryItems = menuData.find(c => c.category === selectedCategory)?.items ?? []
  const totalPages = Math.ceil(allCategoryItems.length / ITEMS_PER_PAGE)
  const currentCategoryItems = allCategoryItems.slice(menuPage * ITEMS_PER_PAGE, (menuPage + 1) * ITEMS_PER_PAGE)
  const allItems = menuData.flatMap(c => c.items)
  const selectedItem = allItems.find(m => `${m.temp} ${m.name}` === selectedMenu)
  const autoPrice = isCustomMenu ? 0 : (selectedItem?.price ?? 0)
  const menuBasePrice = priceOverride !== '' ? priceOverride : autoPrice

  const optionTotal = selectedOptions.reduce((sum, opt) => {
    return sum + (OPTION_ITEMS.find(o => o.name === opt)?.price ?? 0)
  }, 0)

  const totalPrice = menuBasePrice + optionTotal + (isCustomOption && customOptionPrice !== '' ? customOptionPrice : 0)
  const currentMenu = isCustomMenu ? customMenu : selectedMenu

  function handleMenuClick(fullName: string, price: number, temp: MenuTemp) {
    setIsCustomMenu(false)
    setCustomMenu('')
    setSelectedMenu(fullName)
    setPriceOverride(price)
    setTempOption(temp)
  }

  function handleCategoryClick(category: string) {
    setSelectedCategory(category)
    setMenuPage(0)
    if (category === CUSTOM_CATEGORY) {
      setSelectedMenu(null)
      setIsCustomMenu(true)
      setPriceOverride('')
    } else {
      setIsCustomMenu(false)
      setCustomMenu('')
    }
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

    const allOptions = [
      ...selectedOptions,
      ...(isCustomOption && customOption ? [`${customOption}${customOptionPrice ? `(+${Number(customOptionPrice).toLocaleString()}원)` : ''}`] : []),
    ]

    const optionText = allOptions.length > 0 ? `\n옵션: ${allOptions.join(', ')}` : ''
    const confirmed = window.confirm(
      `주문을 확인해주세요!\n\n이름: ${name}\n반: ${cls}\n메뉴: [${tempOption}] ${menuName}${optionText}\n가격: ${totalPrice.toLocaleString()}원\n비밀번호: ${password}\n\n주문하시겠습니까?`
    )
    if (!confirmed) return

    localStorage.setItem('coffy_name', name)
    localStorage.setItem('coffy_class', cls)
    onSubmit({ name, class: cls, menu: menuName, temp: tempOption, options: allOptions, price: totalPrice, password })

    setName('')
    setCls('')
    setSelectedMenu(null)
    setCustomMenu('')
    setIsCustomMenu(false)
    setSelectedOptions([])
    setTempOption('ICE')
    setPriceOverride('')
    setIsCustomOption(false)
    setCustomOption('')
    setCustomOptionPrice('')
    setPassword('')
  }

  const canSubmit = !!name && !!cls && !!currentMenu && menuBasePrice > 0 && !!password

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-title-row">
        <div className="form-section-title">
          주문하기 {disabled && <span className="closed-badge">마감</span>}
        </div>

        {/* 이름 / 반 / 비밀번호 */}
        <div className="form-row-inline">
          <div className="form-row">
            <label>이름</label>
            <input value={name} onChange={e => setName(e.target.value)} disabled={disabled} placeholder="김싸피" />
          </div>
          <div className="form-row">
            <label>반</label>
            <input value={cls} onChange={e => setCls(e.target.value)} disabled={disabled} placeholder="1" />
          </div>
          <div className="form-row">
            <label>비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={disabled} placeholder="••••" maxLength={4} className="input-password" />
          </div>
        </div>
      </div>

      {/* 메뉴 선택 */}
      <div className="kiosk-section">
        <div className="kiosk-label">메뉴</div>
        <div className="category-tabs">
          {menuData.map(c => (
            <button
              key={c.category}
              type="button"
              className={`category-tab ${selectedCategory === c.category ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(c.category)}
              disabled={disabled}
            >
              {c.category}
            </button>
          ))}
          <button
            type="button"
            className={`category-tab ${selectedCategory === CUSTOM_CATEGORY ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(CUSTOM_CATEGORY)}
            disabled={disabled}
          >
            기타
          </button>
        </div>
        <div className={`kiosk-grid-with-image${selectedCategory === CUSTOM_CATEGORY ? ' no-min-height' : ''}`}>
          {selectedCategory === CUSTOM_CATEGORY ? (
            <div className="kiosk-custom-menu-area">
              <input
                className="kiosk-custom-menu-input"
                placeholder="메뉴명 직접 입력"
                value={customMenu}
                onChange={e => setCustomMenu(e.target.value)}
                autoFocus
                disabled={disabled}
              />
            </div>
          ) : (
          <div className="kiosk-grid-column">
            <div className="kiosk-grid">
            {currentCategoryItems.map(item => {
              const fullName = `${item.temp} ${item.name}`
              return (
                <button
                  key={fullName}
                  type="button"
                  className={`kiosk-btn ${selectedMenu === fullName && !isCustomMenu ? 'selected' : ''}`}
                  onClick={() => handleMenuClick(fullName, item.price, item.temp as MenuTemp)}
                  disabled={disabled}
                >
                  <div className="kiosk-badge-row"><TempBadge temp={item.temp as MenuTemp} size="sm" /></div>
                  <span className="kiosk-btn-name">{item.name}</span>
                  <span className="kiosk-btn-price">{item.price.toLocaleString()}원</span>
                </button>
              )
            })}
            </div>
            {totalPages > 1 && (
              <div className="kiosk-pagination">
                <button
                  type="button"
                  className="kiosk-pagination-btn"
                  onClick={() => setMenuPage(p => p - 1)}
                  disabled={menuPage === 0}
                >
                  ‹
                </button>
                <div className="kiosk-pagination-dots">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`kiosk-pagination-dot ${i === menuPage ? 'active' : ''}`}
                      onClick={() => setMenuPage(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="kiosk-pagination-btn"
                  onClick={() => setMenuPage(p => p + 1)}
                  disabled={menuPage >= totalPages - 1}
                >
                  ›
                </button>
              </div>
            )}
          </div>
          )}
          {selectedCategory !== CUSTOM_CATEGORY && (
            <div className="kiosk-menu-image">
              {selectedItem?.image
                ? <img src={selectedItem.image} alt={selectedItem.name} />
                : <span className="kiosk-menu-image-placeholder">☕</span>
              }
            </div>
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
          <button
            type="button"
            className={`option-btn option-btn-other ${isCustomOption ? 'selected' : ''}`}
            onClick={() => { setIsCustomOption(p => !p); setCustomOption(''); setCustomOptionPrice('') }}
            disabled={disabled}
          >
            기타
          </button>
          {isCustomOption && (
            <>
              <input
                className="custom-option-input"
                placeholder="옵션명"
                value={customOption}
                onChange={e => setCustomOption(e.target.value)}
                disabled={disabled}
              />
              <input
                type="number"
                step={100}
                className="custom-option-input custom-option-price"
                placeholder="+금액"
                value={customOptionPrice}
                onChange={e => setCustomOptionPrice(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={disabled}
              />
            </>
          )}
        </div>
      </div>

      {/* 가격 + 요약 한 줄 */}
      <div className="price-summary-row">
        <div className="price-input-wrap">
          <span className="kiosk-label">가격</span>
          <input
            type="number"
            step={100}
            placeholder={isCustomMenu ? "가격 입력" : "메뉴 선택 시 자동"}
            value={priceOverride}
            onChange={e => setPriceOverride(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={disabled || !isCustomMenu}
          />
        </div>
        <div className="order-summary">
          {currentMenu && (
            <>
              <div className="summary-menu">
                <TempBadge temp={tempOption} />
                <span>{isCustomMenu ? currentMenu : currentMenu.slice(4)}</span>
              </div>
              {selectedOptions.length > 0 && (
                <span className="summary-options">· {selectedOptions.join(', ')}</span>
              )}
              <span className="summary-price">{totalPrice.toLocaleString()}원</span>
            </>
          )}
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={disabled || !canSubmit}>
        주문하기
      </button>
    </form>
  )
}
