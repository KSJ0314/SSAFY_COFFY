import styled from 'styled-components'

export const InquiryCancelBtn = styled.button`
  padding: 9px 20px;
  background: none;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.pageBg};
  }
`
