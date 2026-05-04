import styled from 'styled-components'

export const WriteBtn = styled.button`
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

export const MetaText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const EmptyBox = styled.div`
  color: ${({ theme }) => theme.colors.textDisabled};
  text-align: center;
  padding: 64px;
  font-size: 0.95rem;
`

// ── 테이블 행 ──
export const InquiryHeaderRow = styled.tr`
  background: ${({ theme }) => theme.colors.surfaceAccent};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderMid};
  cursor: pointer;

  td {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    vertical-align: middle;
  }

  td:nth-child(4) {
    text-align: right;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHighlight};
  }
`

export const GroupToggle = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  display: inline-block;
  width: 14px;
  text-align: center;
`

export const IndexCell = styled.td`
  white-space: nowrap;
  vertical-align: middle;
`

export const ActionsCell = styled.td`
  vertical-align: middle;
`

export const ActionsInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

export const EditBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`

export const ContentRow = styled.tr`
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderMid};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSubtle};
  }

  td {
    padding: 0;
  }
`

export const ContentExpand = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ContentText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  white-space: pre-wrap;
  margin: 0;
`

export const Comments = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const CommentsTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.5px;
`

export const NoComments = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textFaint};
`

export const CommentItem = styled.div<{ $admin?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: ${({ $admin, theme }) => ($admin ? theme.colors.surfaceAccent : theme.colors.surfaceModal)};
  border-radius: 8px;
  border: 1px solid ${({ $admin, theme }) => ($admin ? '#d4a84b' : theme.colors.borderLight)};
`

export const AdminBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: #c47d1a;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
`

export const CommentContent = styled.span`
  flex: 1;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text};
`

export const CommentDate = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  flex-shrink: 0;
`

export const CommentDeleteBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textFaint};
  cursor: pointer;
  font-size: 0.75rem;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.15s;
  flex-shrink: 0;

  &:hover {
    color: #e53e3e;
  }
`

export const CommentInputRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 4px;
`

export const CommentContentInput = styled.input`
  flex: 1;
  padding: 7px 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const CommentPasswordInput = styled.input`
  width: 80px;
  padding: 7px 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const CommentSubmitBtn = styled.button`
  padding: 7px 14px;
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.btnDisabled};
    cursor: not-allowed;
  }
`

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const PageInfo = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
`
