import { useState, useEffect } from 'react'
import { OPTION_ITEMS } from '../../constants/coffeeMenu'
import type { MenuTemp, MenuCategory } from '../../constants/coffeeMenu'
import TempBadge from '../TempBadge'
import { CategoryTab, KioskPaginationBtn, RightPanel, Form, FormTitleRow } from '../../styles/shared'
import type { Order } from '../../context/OrderContext'
import menuDataRaw from '../../data/menuData.json'
const menuData = menuDataRaw as MenuCategory[]
import CartModal from '../CartModal'
import UserInfoFields from '../UserInfoFields'
import RouletteModal from '../RouletteModal'
import {
  FormSectionTitle, ClosedBadge,
  CategoryTabsRow, CategoryTabs, MenuSearchWrap, MenuSearchInputWrap,
  MenuSearchGhost, MenuSearchGhostCompletion, MenuSearchInput, MenuSearchBtn,
  MenuSearchDropdown, MenuSearchDropdownItem,
  KioskSection, KioskLabel, KioskLabelSub,
  KioskGridWithImage, KioskGridColumn, KioskGrid,
  KioskPagination, KioskPaginationDots, KioskPaginationDot,
  KioskMenuImage, KioskImageKcal, KioskMenuImagePlaceholder,
  KioskCustomMenuArea, KioskCustomMenuInput,
  KioskBtn, KioskBtnBadgeRow, KioskBtnName, KioskBtnPrice,
  KioskOptions, OptionBtn, OptionPrice, OptionDivider, CustomOptionInput,
  PriceSummaryRow, PriceInputWrap, OrderSummary, SummaryMenu, SummaryOptions, SummaryPrice,
  SubmitRow, AddToCartBtn, SubmitBtn, CartCountBadge,
  UserInfoWithActions,
} from './OrderForm.styled'
import { RouletteBtn } from '../../styles/shared'
import type { CartItem } from '../CartModal'
import type { Props } from './types'

function getColCount(): number {
  const w = window.innerWidth
  if (w >= 1920) return 5
  if (w >= 1440) return 4
  if (w <= 1000) return 2
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
  const [password, setPassword] = useState(() => localStorage.getItem('coffy_password') ?? '')
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('coffy_cart') ?? '[]')
      return raw.map((item: CartItem) => ({ ...item, qty: item.qty ?? 1 }))
    } catch { return [] }
  })
  const [showCart, setShowCart] = useState(false)
  const [showRoulette, setShowRoulette] = useState(false)
  const [focusCartItemId, setFocusCartItemId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => { localStorage.setItem('coffy_cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('coffy_name', name) }, [name])
  useEffect(() => { localStorage.setItem('coffy_class', cls) }, [cls])
  useEffect(() => { localStorage.setItem('coffy_password', password) }, [password])
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
    const existing = cart.find(item =>
      item.menu === menuName &&
      item.temp === tempOption &&
      item.options.length === allOptions.length &&
      [...item.options].sort().join(',') === [...allOptions].sort().join(',')
    )
    if (existing) {
      const confirmed = window.confirm('이미 장바구니에 있는 메뉴입니다.\n장바구니에서 수량을 늘리시겠습니까?')
      if (confirmed) {
        setFocusCartItemId(existing.id)
        if (window.electronAPI) {
          window.electronAPI.openCart()
        } else {
          setShowCart(true)
        }
      }
      return
    }
    const newItem: CartItem = {
      id: crypto.randomUUID(),
      menu: menuName,
      temp: tempOption,
      options: allOptions,
      price: totalPrice,
      qty: 1,
      image: selectedType?.image,
    }
    setCart(prev => [...prev, newItem])
    resetMenuSelection()
  }

  function handleCartSubmit() {
    if (cart.length === 0) return
    if (!name || !cls || !password) {
      setShowCart(false)
      setFocusCartItemId(null)
      setShowInfoMessage(true)
      return
    }
    localStorage.setItem('coffy_name', name)
    localStorage.setItem('coffy_class', cls)
    const orders: Order[] = cart.map(item => ({
      name, class: cls, menu: item.menu, temp: item.temp,
      options: item.options, price: item.price, qty: item.qty, password,
    }))
    onSubmit(orders)
    setCart([])
    localStorage.removeItem('coffy_cart')
    setShowCart(false)
    setFocusCartItemId(null)
    setPassword('')
  }

  return (
    <RightPanel>
      <Form onSubmit={e => e.preventDefault()}>
        <FormTitleRow>
          <FormSectionTitle>
            주문하기 {disabled && <ClosedBadge>마감</ClosedBadge>}
          </FormSectionTitle>

          <UserInfoWithActions>
            <RouletteBtn type="button" title="주문자 뽑기" onClick={() => setShowRoulette(true)}>
              🎰
            </RouletteBtn>
            <UserInfoFields
              name={name} cls={cls} password={password}
              onNameChange={v => { setName(v); setShowInfoMessage(false) }}
              onClsChange={v => { setCls(v); setShowInfoMessage(false) }}
              onPasswordChange={v => { setPassword(v); setShowInfoMessage(false) }}
              showValidation={showInfoMessage}
            />
          </UserInfoWithActions>
        </FormTitleRow>

        {/* 메뉴 선택 */}
        <KioskSection>
          <CategoryTabsRow>
            <KioskLabel>메뉴</KioskLabel>
            <MenuSearchWrap>
              <MenuSearchInputWrap style={{ paddingRight: '6px' }}>
                {ghostCompletion && (
                  <MenuSearchGhost aria-hidden="true">
                    <span style={{ visibility: 'hidden' }}>{searchQuery}</span>
                    <MenuSearchGhostCompletion>{ghostCompletion}</MenuSearchGhostCompletion>
                  </MenuSearchGhost>
                )}
                <MenuSearchInput
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
                <MenuSearchBtn
                  type="button"
                  onMouseDown={e => { e.preventDefault(); executeSearch() }}
                >🔍</MenuSearchBtn>
              </MenuSearchInputWrap>
              {showDropdown && searchResults.length > 0 && (
                <MenuSearchDropdown>
                  {searchResults.map((item, i) => (
                    <MenuSearchDropdownItem
                      key={item.name}
                      $highlighted={i === highlightedIndex}
                      onMouseDown={() => handleSearchSelect(item.name)}
                    >
                      {item.name}
                    </MenuSearchDropdownItem>
                  ))}
                </MenuSearchDropdown>
              )}
            </MenuSearchWrap>
          </CategoryTabsRow>
          <CategoryTabs>
            {menuData.map(c => (
              <CategoryTab
                key={c.category}
                type="button"
                $selected={selectedCategory === c.category}
                onClick={() => handleCategoryClick(c.category)}
              >
                {c.category}
              </CategoryTab>
            ))}
            <CategoryTab
              type="button"
              $selected={selectedCategory === CUSTOM_CATEGORY}
              onClick={() => handleCategoryClick(CUSTOM_CATEGORY)}
            >
              기타
            </CategoryTab>
          </CategoryTabs>
          <KioskGridWithImage $noMinHeight={selectedCategory === CUSTOM_CATEGORY}>
            {selectedCategory === CUSTOM_CATEGORY ? (
              <KioskCustomMenuArea>
                <KioskCustomMenuInput
                  placeholder="메뉴명 직접 입력"
                  value={customMenu}
                  onChange={e => setCustomMenu(e.target.value)}
                  autoFocus
                />
              </KioskCustomMenuArea>
            ) : (
              <KioskGridColumn>
                <KioskGrid>
                  {currentCategoryItems.map(item => {
                    const availableTemps: MenuTemp[] = item.types.map((t: { temp: string }) => t.temp as MenuTemp)
                    const displayPrice = item.types.find((t: { temp: string }) => t.temp === 'ICE')?.price ?? item.types[0]?.price ?? 0
                    const isSelected = selectedMenu === item.name && !isCustomMenu
                    return (
                      <KioskBtn
                        key={item.name}
                        type="button"
                        $selected={isSelected}
                        onClick={() => handleMenuClick(item.name)}
                      >
                        <KioskBtnBadgeRow>
                          {availableTemps.map(t => <TempBadge key={t} temp={t} size="sm" />)}
                        </KioskBtnBadgeRow>
                        <KioskBtnName>{item.name}</KioskBtnName>
                        <KioskBtnPrice $selected={isSelected}>{displayPrice.toLocaleString()}원</KioskBtnPrice>
                      </KioskBtn>
                    )
                  })}
                </KioskGrid>
                {totalPages > 1 && (
                  <KioskPagination>
                    <KioskPaginationBtn
                      type="button"
                      onClick={() => setMenuPage(p => p - 1)}
                      disabled={menuPage === 0}
                    >‹</KioskPaginationBtn>
                    <KioskPaginationDots>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <KioskPaginationDot
                          key={i}
                          type="button"
                          $active={i === menuPage}
                          onClick={() => setMenuPage(i)}
                        />
                      ))}
                    </KioskPaginationDots>
                    <KioskPaginationBtn
                      type="button"
                      onClick={() => setMenuPage(p => p + 1)}
                      disabled={menuPage >= totalPages - 1}
                    >›</KioskPaginationBtn>
                  </KioskPagination>
                )}
              </KioskGridColumn>
            )}
            {selectedCategory !== CUSTOM_CATEGORY && (
              <KioskMenuImage>
                {selectedType?.image
                  ? <>
                      <img src={selectedType.image} alt={selectedItem?.name} />
                      {selectedType.kcal != null && (
                        <KioskImageKcal>{selectedType.kcal} kcal</KioskImageKcal>
                      )}
                    </>
                  : <KioskMenuImagePlaceholder>☕</KioskMenuImagePlaceholder>
                }
              </KioskMenuImage>
            )}
          </KioskGridWithImage>
        </KioskSection>

        {/* 옵션 선택 */}
        <KioskSection>
          <KioskLabel>옵션 <KioskLabelSub>(중복 선택 가능)</KioskLabelSub></KioskLabel>
          <KioskOptions>
            <OptionBtn
              type="button"
              $temp="ice"
              $selected={tempOption === 'ICE'}
              onClick={() => toggleTemp('ICE')}
              disabled={!isCustomMenu && (selectedItem?.types.length ?? 0) < 2}
            >ICE</OptionBtn>
            <OptionBtn
              type="button"
              $temp="hot"
              $selected={tempOption === 'HOT'}
              onClick={() => toggleTemp('HOT')}
              disabled={!isCustomMenu && (selectedItem?.types.length ?? 0) < 2}
            >HOT</OptionBtn>
            <OptionDivider />
            {OPTION_ITEMS.map(opt => (
              <OptionBtn
                key={opt.name}
                type="button"
                $selected={selectedOptions.includes(opt.name)}
                onClick={() => toggleOption(opt.name)}
              >
                {opt.name}{opt.price > 0 && <OptionPrice> +{opt.price.toLocaleString()}</OptionPrice>}
              </OptionBtn>
            ))}
            <OptionBtn
              type="button"
              $other
              $selected={isCustomOption}
              onClick={() => { setIsCustomOption(p => !p); setCustomOption(''); setCustomOptionPrice('') }}
            >기타</OptionBtn>
            {isCustomOption && (
              <>
                <CustomOptionInput
                  placeholder="옵션명"
                  value={customOption}
                  onChange={e => setCustomOption(e.target.value)}
                />
                <CustomOptionInput
                  type="number"
                  step={100}
                  $price
                  placeholder="+금액"
                  value={customOptionPrice}
                  onChange={e => setCustomOptionPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </>
            )}
          </KioskOptions>
        </KioskSection>

        {/* 가격 + 요약 */}
        <PriceSummaryRow>
          <PriceInputWrap>
            <KioskLabel>가격</KioskLabel>
            <input
              type="number"
              step={100}
              placeholder={isCustomMenu ? '가격 입력' : '메뉴 선택 시 자동'}
              value={isCustomMenu ? priceOverride : (autoPrice || '')}
              onChange={e => setPriceOverride(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={!isCustomMenu}
            />
          </PriceInputWrap>
          <OrderSummary>
            {currentMenu && (
              <>
                <SummaryMenu>
                  <TempBadge temp={tempOption} />
                  <span>{currentMenu}</span>
                </SummaryMenu>
                {selectedOptions.length > 0 && (
                  <SummaryOptions>· {selectedOptions.join(', ')}</SummaryOptions>
                )}
                <SummaryPrice>{totalPrice.toLocaleString()}원</SummaryPrice>
              </>
            )}
          </OrderSummary>
        </PriceSummaryRow>

        <SubmitRow>
          <AddToCartBtn type="button" onClick={handleAddToCart}>
            장바구니에 추가
          </AddToCartBtn>
          <SubmitBtn
            type="button"
            disabled={cart.length === 0}
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.openCart()
              } else {
                setShowCart(true)
              }
            }}
          >
            장바구니 확인
            {cart.length > 0 && <CartCountBadge>{cart.reduce((sum, item) => sum + item.qty, 0)}</CartCountBadge>}
          </SubmitBtn>
        </SubmitRow>

        <RouletteModal
          open={showRoulette}
          onClose={() => setShowRoulette(false)}
          onWinner={(picked, cls) => { setName(picked); if (cls) setCls(cls); setShowInfoMessage(false) }}
        />

        {showCart && (
          <CartModal
            cart={cart}
            name={name}
            cls={cls}
            closed={disabled}
            onRemove={id => setCart(prev => prev.filter(item => item.id !== id))}
            onChangeQty={(id, qty) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item))}
            onSubmit={handleCartSubmit}
            onClose={() => { setShowCart(false); setFocusCartItemId(null) }}
            onRoulette={() => setShowRoulette(true)}
            focusItemId={focusCartItemId}
          />
        )}
      </Form>
    </RightPanel>
  )
}
