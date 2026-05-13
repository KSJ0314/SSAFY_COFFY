import styled from 'styled-components'
import { FormRowInline, FormRow } from './UserInfoFields.styled'
import type { Props } from './types'

const TooltipWrap = styled.div`
  position: relative;
  width: 100%;

  input {
    width: 100%;
    box-sizing: border-box;
  }
`

const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textOnDark};
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 12px;
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.secondary};
  }
`

export default function UserInfoFields({
  name, cls, password,
  onNameChange, onClsChange, onPasswordChange,
  showValidation = false,
}: Props) {
  return (
    <FormRowInline>
      <FormRow>
        <label>이름</label>
        <TooltipWrap>
          {showValidation && !name && <Tooltip>필수 입력</Tooltip>}
          <input value={name} onChange={e => onNameChange(e.target.value)} placeholder="김싸피" />
        </TooltipWrap>
      </FormRow>
      <FormRow>
        <label>반</label>
        <TooltipWrap>
          {showValidation && !cls && <Tooltip>필수 입력</Tooltip>}
          <input value={cls} onChange={e => onClsChange(e.target.value)} placeholder="1" />
        </TooltipWrap>
      </FormRow>
      <FormRow>
        <label>비밀번호</label>
        <TooltipWrap>
          {showValidation && !password && <Tooltip>필수 입력</Tooltip>}
          <input
            type="password"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            placeholder="••••"
            maxLength={4}
            className="input-password"
          />
        </TooltipWrap>
      </FormRow>
    </FormRowInline>
  )
}
