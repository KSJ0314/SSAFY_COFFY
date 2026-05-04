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
