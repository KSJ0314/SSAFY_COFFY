import styled, { css, keyframes } from 'styled-components'

// ── 페이지 레이아웃 ──
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

// ── 모달 ──
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surfaceModal};
  border-radius: 16px;
  padding: 4px;
  width: 480px;
  max-width: calc(90vw / var(--ui-scale));
  max-height: calc(80vh / var(--ui-scale));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ModalBody = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding: 24px 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} transparent;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.border}; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => theme.colors.accent}; }
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }
`

export const ModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
`

export const ModalSub = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  margin-top: -8px;
`

export const ModalNote = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textDisabled};
  line-height: 1.5;
`

// ── 테이블 ──
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.surfaceModal};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px ${({ theme }) => theme.colors.shadow};

  th {
    padding: 12px 14px;
    text-align: left;
    background: ${({ theme }) => theme.colors.btnPrimary};
    color: ${({ theme }) => theme.colors.textOnTable};
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.surfaceHighlight};
  }

  td {
    padding: 11px 14px;
    color: ${({ theme }) => theme.colors.text};
  }

  td:last-child,
  th:last-child {
    padding: 4px 8px;
    width: 32px;
  }

  td:nth-last-child(2),
  th:nth-last-child(2) {
    width: 60px;
    white-space: nowrap;
    text-align: center;
  }

  tfoot tr {
    background: ${({ theme }) => theme.colors.surfaceAccent};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    border-bottom: none;
  }

  tfoot td {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.secondary};
  }
`

// ── 공통 버튼 ──
export const PrimaryBtn = styled.button`
  padding: 9px 20px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
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

export const DeleteOrderBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textFaint};
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.15s;
  display: block;
  margin: 0 auto;

  &:hover {
    color: #e53e3e;
  }
`


// ── 공통 유틸 ──
const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
`

export const loadingTextCss = css`
  color: ${({ theme }) => theme.colors.textDisabled};
  opacity: 0.6;
  animation: ${pulse} 1.2s ease-in-out infinite;
`

export const TableEmptyCell = styled.td`
  text-align: center;
  color: ${({ theme }) => theme.colors.textDisabled};
  font-size: 0.9rem;
  vertical-align: middle;

  &.loading-text {
    ${loadingTextCss}
  }
`

export const CategoryTab = styled.button<{ $selected?: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid ${({ $selected, theme }) => ($selected ? theme.colors.secondary : theme.colors.border)};
  background: ${({ $selected, theme }) => ($selected ? theme.colors.secondary : theme.colors.surface)};
  color: ${({ $selected, theme }) => ($selected ? '#fff' : theme.colors.textMuted)};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  ${({ $selected, theme }) => $selected
    ? css`&:hover:not(:disabled) { background: ${theme.colors.primary}; }`
    : css`&:hover:not(:disabled) { border-color: ${theme.colors.accent}; background: ${theme.colors.surfaceAlt}; }`
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const KioskPaginationBtn = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.secondary};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

export const RouletteBtn = styled.button`
  flex-shrink: 0;
  min-height: 40px;
  aspect-ratio: 1 / 1;
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
