import { useState, useEffect } from 'react'
import { OPTION_ITEMS } from '../constants/coffeeMenu'
import type { MenuTemp } from '../constants/coffeeMenu'
import TempBadge from './TempBadge'
import type { Order } from '../context/OrderContext'
import menuData from '../data/menuData.json'
import CartModal from './CartModal'

export type CartItem = {
  id: string
  menu: string
  temp: MenuTemp
  options: string[]
  price: number
  image?: string
}

type Props = {
  onSubmit: (orders: Order[]) => void
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
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(sessionStorage.getItem('coffy_cart') ?? '[]') } catch { return [] }
  })
  const [showCart, setShowCart] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => {
    sessionStorage.setItem('coffy_cart', JSON.stringify(cart))
  }, [cart])
  const [showInfoMessage, setShowInfoMessage] = useState(false)
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
  const selectedItem = allItems.find(m => m.name === selectedMenu)

  const searchResults = searchFilter
    ? allItems.filter(item => item.name.includes(searchFilter))
    : []
  const topSuggestion = searchResults[0] ?? null
  const ghostCompletion = topSuggestion && topSuggestion.name.startsWith(searchQuery)
    ? topSuggestion.name.slice(searchQuery.length)
    : ''
  const selectedType = selectedItem?.types.find((t: { temp: string }) => t.temp === tempOption)
  const autoPrice = isCustomMenu ? 0 : (selectedType?.price ?? 0)
  const menuBasePrice = priceOverride !== '' ? priceOverride : autoPrice

  const optionTotal = selectedOptions.reduce((sum, opt) => {
    return sum + (OPTION_ITEMS.find(o => o.name === opt)?.price ?? 0)
  }, 0)

  const totalPrice = menuBasePrice + optionTotal + (isCustomOption && customOptionPrice !== '' ? customOptionPrice : 0)
  const currentMenu = isCustomMenu ? customMenu : selectedMenu

  function handleMenuClick(name: string) {
    const item = allItems.find(m => m.name === name)
    const defaultTemp: MenuTemp = item?.types.some((t: { temp: string }) => t.temp === 'ICE') ? 'ICE' : 'HOT'
    setIsCustomMenu(false)
    setCustomMenu('')
    setSelectedMenu(name)
    setPriceOverride('')
    setTempOption(defaultTemp)
  }

  function executeSearch() {
    if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
      handleSearchSelect(searchResults[highlightedIndex].name)
    } else if (topSuggestion) {
      handleSearchSelect(topSuggestion.name)
    } else {
      setSearchQuery(''); setSearchFilter(''); setShowDropdown(false)
    }
  }

  function handleSearchSelect(name: string) {
    const categoryObj = menuData.find(c => c.items.some((i: { name: string }) => i.name === name))
    if (!categoryObj) return
    const items = categoryObj.items
    const index = items.findIndex((i: { name: string }) => i.name === name)
    const page = Math.floor(index / ITEMS_PER_PAGE)
    setSelectedCategory(categoryObj.category)
    setMenuPage(page)
    handleMenuClick(name)
    setSearchQuery(name)
    setSearchFilter(name)
    setShowDropdown(false)
    setHighlightedIndex(-1)
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

  function resetMenuSelection() {
    setSelectedMenu(null)
    setCustomMenu('')
    setIsCustomMenu(false)
    setSelectedOptions([])
    setTempOption('ICE')
    setPriceOverride('')
    setIsCustomOption(false)
    setCustomOption('')
    setCustomOptionPrice('')
    setSelectedCategory(menuData[0].category)
    setMenuPage(0)
  }

  function handleAddToCart() {
    if (!currentMenu || !menuBasePrice) {
      window.alert('메뉴를 선택해주세요.')
      return
    }
    const menuName = currentMenu ?? ''
    const allOptions = [
      ...selectedOptions,
      ...(isCustomOption && customOption ? [`${customOption}${customOptionPrice ? `(+${Number(customOptionPrice).toLocaleString()}원)` : ''}`] : []),
    ]
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      menu: menuName,
      temp: tempOption,
      options: allOptions,
      price: totalPrice,
      image: selectedType?.image,
    }
    setCart(prev => [...prev, newItem])
    resetMenuSelection()
  }

  function handleCartSubmit() {
    if (!name || !cls || !password || cart.length === 0) return
    localStorage.setItem('coffy_name', name)
    localStorage.setItem('coffy_class', cls)
    const orders: Order[] = cart.map(item => ({
      name, class: cls, menu: item.menu, temp: item.temp,
      options: item.options, price: item.price, password,
    }))
    onSubmit(orders)
    setCart([])
    sessionStorage.removeItem('coffy_cart')
    setShowCart(false)
    setPassword('')
  }

  const missingInfo = !name || !cls || !password

  return (
    <form className="order-form" onSubmit={e => e.preventDefault()}>
      <div className="form-title-row">
        <div className="form-section-title">
          주문하기 {disabled && <span className="closed-badge">마감</span>}
        </div>

        {/* 이름 / 반 / 비밀번호 */}
        <div className="form-row-inline">
          <div className="form-row">
            <label>이름</label>
            <div className="input-tooltip-wrap">
              {showInfoMessage && !name && <div className="input-tooltip">필수 입력</div>}
              <input value={name} onChange={e => { setName(e.target.value); setShowInfoMessage(false) }} placeholder="김싸피" />
            </div>
          </div>
          <div className="form-row">
            <label>반</label>
            <div className="input-tooltip-wrap">
              {showInfoMessage && !cls && <div className="input-tooltip">필수 입력</div>}
              <input value={cls} onChange={e => { setCls(e.target.value); setShowInfoMessage(false) }} placeholder="1" />
            </div>
          </div>
          <div className="form-row">
            <label>비밀번호</label>
            <div className="input-tooltip-wrap">
              {showInfoMessage && !password && <div className="input-tooltip">필수 입력</div>}
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setShowInfoMessage(false) }} placeholder="••••" maxLength={4} className="input-password" />
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 선택 */}
      <div className="kiosk-section">
        <div className="kiosk-label">메뉴</div>
        <div className="category-tabs-row">
          <div className="category-tabs">
            {menuData.map(c => (
              <button
                key={c.category}
                type="button"
                className={`category-tab ${selectedCategory === c.category ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(c.category)}
              >
                {c.category}
              </button>
            ))}
            <button
              type="button"
              className={`category-tab ${selectedCategory === CUSTOM_CATEGORY ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(CUSTOM_CATEGORY)}
            >
              기타
            </button>
          </div>
          <div className="menu-search-wrap">
            <div className="menu-search-input-wrap" style={{ paddingRight: '6px' }}>
              {ghostCompletion && (
                <div className="menu-search-ghost" aria-hidden="true">
                  <span style={{ visibility: 'hidden' }}>{searchQuery}</span>
                  <span className="menu-search-ghost-completion">{ghostCompletion}</span>
                </div>
              )}
              <input
                className="menu-search-input"
                style={{ paddingRight: '4px' }}
                placeholder="메뉴 검색"
                value={searchQuery}
                onChange={e => {
                  const v = e.target.value
                  setSearchQuery(v)
                  setSearchFilter(v)
                  setShowDropdown(true)
                  setHighlightedIndex(-1)
                }}
                onFocus={() => { if (searchFilter) setShowDropdown(true) }}
                onBlur={() => setTimeout(() => {
                  setShowDropdown(false)
                  setHighlightedIndex(-1)
                  setSearchQuery(searchFilter)
                }, 150)}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    const next = Math.min(highlightedIndex + 1, searchResults.length - 1)
                    setHighlightedIndex(next)
                    setSearchQuery(searchResults[next]?.name ?? searchFilter)
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    const prev = Math.max(highlightedIndex - 1, -1)
                    setHighlightedIndex(prev)
                    setSearchQuery(prev === -1 ? searchFilter : (searchResults[prev]?.name ?? searchFilter))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    executeSearch()
                  } else if (e.key === 'Escape') {
                    setSearchQuery(''); setSearchFilter(''); setShowDropdown(false); setHighlightedIndex(-1)
                  }
                }}
              />
              <button
                type="button"
                className="menu-search-btn"
                onMouseDown={e => { e.preventDefault(); executeSearch() }}
              >🔍</button>
            </div>
            {showDropdown && searchResults.length > 0 && (
              <ul className="menu-search-dropdown">
                {searchResults.map((item, i) => (
                  <li
                    key={item.name}
                    className={`menu-search-dropdown-item${i === highlightedIndex ? ' highlighted' : ''}`}
                    onMouseDown={() => handleSearchSelect(item.name)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              />
            </div>
          ) : (
          <div className="kiosk-grid-column">
            <div className="kiosk-grid">
            {currentCategoryItems.map(item => {
              const availableTemps: MenuTemp[] = item.types.map((t: { temp: string }) => t.temp as MenuTemp)
              const displayPrice = item.types.find((t: { temp: string }) => t.temp === 'ICE')?.price ?? item.types[0]?.price ?? 0
              return (
                <button
                  key={item.name}
                  type="button"
                  className={`kiosk-btn ${selectedMenu === item.name && !isCustomMenu ? 'selected' : ''}`}
                  onClick={() => handleMenuClick(item.name)}
                >
                  <div className="kiosk-badge-row">
                    {availableTemps.map(t => <TempBadge key={t} temp={t} size="sm" />)}
                  </div>
                  <span className="kiosk-btn-name">{item.name}</span>
                  <span className="kiosk-btn-price">{displayPrice.toLocaleString()}원</span>
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
              {selectedType?.image
                ? <>
                    <img src={selectedType.image} alt={selectedItem?.name} />
                    {selectedType.kcal != null && (
                      <span className="kiosk-image-kcal">{selectedType.kcal} kcal</span>
                    )}
                  </>
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
            disabled={!isCustomMenu && (selectedItem?.types.length ?? 0) < 2}
          >
            ICE
          </button>
          <button
            type="button"
            className={`option-btn option-btn-hot ${tempOption === 'HOT' ? 'selected' : ''}`}
            onClick={() => toggleTemp('HOT')}
            disabled={!isCustomMenu && (selectedItem?.types.length ?? 0) < 2}
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
              >
              {opt.name}{opt.price > 0 && <span className="option-price"> +{opt.price.toLocaleString()}</span>}
            </button>
          ))}
          <button
            type="button"
            className={`option-btn option-btn-other ${isCustomOption ? 'selected' : ''}`}
            onClick={() => { setIsCustomOption(p => !p); setCustomOption(''); setCustomOptionPrice('') }}
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
              />
              <input
                type="number"
                step={100}
                className="custom-option-input custom-option-price"
                placeholder="+금액"
                value={customOptionPrice}
                onChange={e => setCustomOptionPrice(e.target.value === '' ? '' : Number(e.target.value))}
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
            value={isCustomMenu ? priceOverride : (autoPrice || '')}
            onChange={e => setPriceOverride(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={!isCustomMenu}
          />
        </div>
        <div className="order-summary">
          {currentMenu && (
            <>
              <div className="summary-menu">
                <TempBadge temp={tempOption} />
                <span>{currentMenu}</span>
              </div>
              {selectedOptions.length > 0 && (
                <span className="summary-options">· {selectedOptions.join(', ')}</span>
              )}
              <span className="summary-price">{totalPrice.toLocaleString()}원</span>
            </>
          )}
        </div>
      </div>

      <div className="submit-row">
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          장바구니에 추가
        </button>
        <button
          type="button"
          className="submit-btn"
          disabled={cart.length === 0}
          onClick={() => {
            if (missingInfo) {
              setShowInfoMessage(true)
            } else {
              setShowInfoMessage(false)
              setShowCart(true)
            }
          }}
        >
          장바구니 확인
          {cart.length > 0 && <span className="cart-count-badge">{cart.length}</span>}
        </button>
      </div>
      {showCart && (
        <CartModal
          cart={cart}
          name={name}
          cls={cls}
          closed={disabled}
          onRemove={id => setCart(prev => prev.filter(item => item.id !== id))}
          onSubmit={handleCartSubmit}
          onClose={() => setShowCart(false)}
        />
      )}
    </form>
  )
}
