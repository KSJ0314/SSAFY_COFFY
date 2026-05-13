import styled from 'styled-components'

export const FormRowInline = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
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
