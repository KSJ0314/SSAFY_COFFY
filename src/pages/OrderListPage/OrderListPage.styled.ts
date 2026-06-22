import styled from 'styled-components'

export const MetaText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const SaveImageBtn = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.btnPrimary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`

export const AccountWrap = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
  margin-left: 12px;
`

export const AccountLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
`

export const AccountValue = styled.strong`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

// ── 그룹 테이블 행 ──
export const GroupHeaderRow = styled.tr<{ $clickable?: boolean }>`
  background: ${({ theme }) => theme.colors.surfaceAccent};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderMid};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  td {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background: ${({ $clickable, theme }) => ($clickable ? theme.colors.surfaceHighlight : theme.colors.surfaceAccent)};
  }
`

export const GroupToggle = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  display: inline-block;
  width: 14px;
  text-align: center;
`

export const GroupCountCell = styled.td`
  text-align: center;
  width: 32px;
`

export const GroupNameCell = styled.td`
  font-weight: 800;
`

export const GroupChildRow = styled.tr`
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  td {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.87rem;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHighlight};
  }
`

export const GroupChildIndex = styled.td`
  text-align: center;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 0.78rem;
  padding-left: 20px !important;
`

export const MenuCell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

// ── 캡처 영역 (항상 라이트, 인쇄용) ──
export const CaptureArea = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`

// App.css 원본 테이블 스타일 그대로 — 테마 토큰 미사용, 항상 라이트
export const CaptureTable = styled.table`
  width: max-content;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: #fdf6ec;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  th {
    padding: 12px 14px;
    text-align: left;
    background: #4a2810;
    color: #fde8c8;
    font-size: 0.8rem;
    font-weight: 700;
  }

  tbody tr {
    border-bottom: 1px solid #f0e4d4;
  }

  tbody tr:hover {
    background: #fff3e0;
  }

  td {
    padding: 11px 14px;
    color: #3b1f0a;
    letter-spacing: 0;
    word-spacing: normal;
  }

  tfoot tr {
    background: #fdf0e0;
    border-top: 2px solid #d4b896;
    border-bottom: none;
  }

  tfoot td {
    font-weight: 700;
    color: #7c4519;
  }
`

export const CaptureOffscreen = styled(CaptureArea)`
  position: fixed;
  left: -9999px;
  top: 0;
  width: fit-content;
  pointer-events: none;
`

export const CaptureHeader = styled.div`
  margin-bottom: 16px;
`

export const CaptureTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a1a1a;
`

export const CaptureDate = styled.div`
  font-size: 0.85rem;
  color: #555;
  margin-top: 4px;
`

// ── 날짜 선택 달력 ──
export const CalendarWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const CalendarIconBtn = styled.button`
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  border-radius: 6px;
  transition: filter 0.15s, background 0.15s;
  filter: ${({ theme }) => theme.isDark ? 'brightness(0.55) saturate(0.6)' : 'none'};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAccent};
    filter: ${({ theme }) => theme.isDark ? 'brightness(0.75) saturate(0.8)' : 'none'};
  }
`

export const CalendarDropdown = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 200;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderMid};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  padding: 12px;
  min-width: 224px;
  user-select: none;
`

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const CalendarMonthLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const CalendarNavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAccent};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

export const CalendarDayLabel = styled.div`
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textFaint};
  padding: 2px 0 4px;
`

export const CalendarDay = styled.button<{ $today?: boolean; $selected?: boolean; $empty?: boolean }>`
  background: ${({ $today, $selected, theme }) =>
    $selected ? theme.colors.primary : $today ? theme.colors.surfaceAccent : 'none'};
  color: ${({ $today, $selected, theme }) =>
    $selected ? '#fff' : $today ? theme.colors.primary : theme.colors.text};
  border: ${({ $today, theme }) => ($today ? `1.5px solid ${theme.colors.primary}` : 'none')};
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: ${({ $today, $selected }) => ($today || $selected ? '700' : '400')};
  cursor: ${({ $empty }) => ($empty ? 'default' : 'pointer')};
  padding: 5px 0;
  text-align: center;
  transition: background 0.12s;
  visibility: ${({ $empty }) => ($empty ? 'hidden' : 'visible')};

  &:hover {
    background: ${({ $empty, $selected, theme }) =>
      $empty || $selected ? undefined : theme.colors.surfaceHighlight};
  }
`

export const BackTodayBtn = styled.button`
  padding: 4px 10px;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.borderMid};
  border-radius: 6px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAccent};
    color: ${({ theme }) => theme.colors.primary};
  }
`
