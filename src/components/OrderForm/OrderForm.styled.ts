import styled, { css } from 'styled-components'

export const RightPanel = styled.div`
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
  max-width: 880px;

  @media (min-width: 1440px) { max-width: 1100px; }
  @media (min-width: 1920px) { max-width: 1400px; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const FormTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

export const FormSectionTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`

export const ClosedBadge = styled.span`
  background: #dc2626;
  color: white;
  font-size: 0.72rem;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
`

export const FormRowInline = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
`

export const UserInfoWithActions = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`

export const RouletteBtn = styled.button`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 80px;
  flex: none;

  label {
    font-size: 0.82rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.label};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    padding: 10px 12px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 0.95rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textInput};
    transition: border-color 0.2s;
    width: 100%;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accent};
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.surfaceDisabled};
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  }
`

// ── 카테고리 탭 / 메뉴 검색 ──
export const CategoryTabsRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

export const CategoryTabs = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
`

export const MenuSearchWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`

export const MenuSearchInputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 0 14px;
  height: 34px;
  min-width: 160px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const MenuSearchGhost = styled.div`
  position: absolute;
  left: 14px;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  line-height: 1;
`

export const MenuSearchGhostCompletion = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
`

export const MenuSearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textInput};
  width: 100%;
  position: relative;
  z-index: 1;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMutedAlt};
  }
`

export const MenuSearchBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0 2px;
  line-height: 1;
  opacity: 0.6;
  flex-shrink: 0;
  position: relative;
  z-index: 1;

  &:hover {
    opacity: 1;
  }
`

export const MenuSearchDropdown = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 4px 16px ${({ theme }) => theme.colors.shadow};
  list-style: none;
  padding: 4px 0;
  margin: 0;
  z-index: 100;
  max-height: 240px;
  overflow-y: auto;
`

export const MenuSearchDropdownItem = styled.li<{ $highlighted?: boolean }>`
  padding: 8px 16px;
  font-size: 0.85rem;
  color: ${({ $highlighted, theme }) => ($highlighted ? theme.colors.secondary : theme.colors.textInput)};
  background: ${({ $highlighted, theme }) => ($highlighted ? theme.colors.surfaceAlt : 'transparent')};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.secondary};
  }
`

// ── 키오스크 섹션 ──
export const KioskSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const KioskLabel = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.label};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const KioskLabelSub = styled.span`
  font-weight: 400;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  text-transform: none;
`

export const KioskGridWithImage = styled.div<{ $noMinHeight?: boolean }>`
  display: flex;
  gap: 32px;
  align-items: stretch;
  min-height: ${({ $noMinHeight }) => ($noMinHeight ? 'unset' : '200px')};
`

export const KioskGridColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const KioskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  align-items: start;
  align-content: start;

  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1440px) { grid-template-columns: repeat(4, 1fr); }
  @media (min-width: 1920px) { grid-template-columns: repeat(5, 1fr); }
`

export const KioskPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`

export const KioskPaginationDots = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const KioskPaginationDot = styled.button<{ $active?: boolean }>`
  width: ${({ $active }) => ($active ? '20px' : '8px')};
  height: 8px;
  border-radius: ${({ $active }) => ($active ? '4px' : '50%')};
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.border)};
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
`

export const KioskMenuImage = styled.div`
  flex: 1;
  border-radius: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 240px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (min-width: 1920px) { max-width: 280px; }
`

export const KioskImageKcal = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.secondary};
  background: rgba(255, 255, 255, 0.82);
  border-radius: 6px;
  padding: 2px 5px;
  line-height: 1.3;
  pointer-events: none;
`

export const KioskMenuImagePlaceholder = styled.span`
  font-size: 3rem;
  opacity: 0.3;
`

export const KioskCustomMenuArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

export const KioskCustomMenuInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const KioskBtn = styled.button<{ $selected?: boolean; $other?: boolean; $inputMode?: boolean }>`
  background: ${({ $selected, theme }) => ($selected ? theme.colors.secondary : theme.colors.surface)};
  border: 1.5px solid ${({ $selected, theme }) => ($selected ? theme.colors.secondary : theme.colors.border)};
  border-style: ${({ $other }) => ($other ? 'dashed' : 'solid')};
  border-radius: 10px;
  padding: 10px 8px;
  cursor: ${({ $inputMode }) => ($inputMode ? 'default' : 'pointer')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
  max-height: 105px;
  width: 180px;
  position: relative;
  color: ${({ $selected, theme }) => ($selected ? '#fff' : theme.colors.text)};

  ${({ $selected, theme }) => $selected
    ? css`&:hover:not(:disabled) { background: ${theme.colors.primary}; }`
    : css`&:hover:not(:disabled) { border-color: ${theme.colors.accent}; background: ${theme.colors.surfaceAlt}; }`
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const KioskBtnBadgeRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 4px;
`

export const KioskBtnName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: inherit;
`

export const KioskBtnPrice = styled.span<{ $selected?: boolean }>`
  font-size: 0.75rem;
  color: ${({ $selected, theme }) => ($selected ? theme.colors.gold : theme.colors.textMutedAlt)};
`

export const KioskInlineInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  font-size: 0.85rem;
  color: #fff;
  font-weight: 600;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`

// ── 옵션 ──
export const KioskOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const OptionBtn = styled.button<{ $selected?: boolean; $other?: boolean; $temp?: 'ice' | 'hot' }>`
  background: ${({ $selected, theme }) => ($selected ? theme.colors.secondary : theme.colors.surface)};
  border: 1.5px solid ${({ $selected, theme }) => ($selected ? theme.colors.secondary : theme.colors.border)};
  border-style: ${({ $other }) => ($other ? 'dashed' : 'solid')};
  border-radius: 20px;
  padding: 7px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
  color: ${({ $selected, theme }) => ($selected ? '#fff' : theme.colors.text)};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $temp, $selected, theme }) => $temp === 'ice' && $selected && css`
    background: ${theme.colors.iceBg};
    border-color: ${theme.colors.iceBorder};
    color: ${theme.colors.iceText};
  `}

  ${({ $temp, $selected, theme }) => $temp === 'ice' && !$selected && css`
    &:hover:not(:disabled) {
      border-color: ${theme.colors.iceBorder};
      color: ${theme.colors.iceText};
    }
  `}

  ${({ $temp, $selected, theme }) => $temp === 'hot' && $selected && css`
    background: ${theme.colors.hotBg};
    border-color: ${theme.colors.hotBorder};
    color: ${theme.colors.hotText};
  `}

  ${({ $temp, $selected, theme }) => $temp === 'hot' && !$selected && css`
    &:hover:not(:disabled) {
      border-color: ${theme.colors.hotBorder};
      color: ${theme.colors.hotText};
    }
  `}
`

export const OptionPrice = styled.span`
  font-size: 0.75rem;
  opacity: 0.8;
`

export const OptionDivider = styled.div`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 2px;
`

export const CustomOptionInput = styled.input<{ $price?: boolean }>`
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  min-width: ${({ $price }) => ($price ? 'unset' : '150px')};
  width: ${({ $price }) => ($price ? '100px' : 'auto')};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

// ── 가격 + 요약 ──
export const PriceSummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const PriceInputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  input {
    flex: 1;
    height: 44px;
    box-sizing: border-box;
    padding: 0 12px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 0.9rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textInput};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accent};
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.surfaceDisabled};
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  }
`

export const OrderSummary = styled.div`
  flex: 1;
  min-width: 0;
  height: 44px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.surfaceHighlight};
  border: 1.5px solid #f59e0b;
  border-radius: 10px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  overflow: hidden;
`

export const SummaryMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text};
`

export const SummaryOptions = styled.span`
  color: ${({ theme }) => theme.colors.textMutedAlt};
  font-weight: 400;
  flex: 1;
`

export const SummaryPrice = styled.span`
  margin-left: auto;
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`

// ── 제출 버튼 ──
export const SubmitRow = styled.div`
  display: flex;
  gap: 10px;

  > button {
    flex: 1;
  }
`

export const AddToCartBtn = styled.button`
  flex: 1;
  padding: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAccent};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`

export const SubmitBtn = styled.button`
  padding: 14px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 1px;
  transition: opacity 0.2s, transform 0.1s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.btnDisabled};
    cursor: not-allowed;
    transform: none;
  }
`

export const CartCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.75rem;
  font-weight: 800;
  width: 20px;
  height: 20px;
  border-radius: 50%;
`
