import type { Props } from './types'

export default function UserInfoFields({
  name, cls, password,
  onNameChange, onClsChange, onPasswordChange,
  showValidation = false,
}: Props) {
  return (
    <div className="form-row-inline">
      <div className="form-row">
        <label>이름</label>
        <div className="input-tooltip-wrap">
          {showValidation && !name && <div className="input-tooltip">필수 입력</div>}
          <input value={name} onChange={e => onNameChange(e.target.value)} placeholder="김싸피" />
        </div>
      </div>
      <div className="form-row">
        <label>반</label>
        <div className="input-tooltip-wrap">
          {showValidation && !cls && <div className="input-tooltip">필수 입력</div>}
          <input value={cls} onChange={e => onClsChange(e.target.value)} placeholder="1" />
        </div>
      </div>
      <div className="form-row">
        <label>비밀번호</label>
        <div className="input-tooltip-wrap">
          {showValidation && !password && <div className="input-tooltip">필수 입력</div>}
          <input
            type="password"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            placeholder="••••"
            maxLength={4}
            className="input-password"
          />
        </div>
      </div>
    </div>
  )
}
