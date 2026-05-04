import { useState } from 'react'
import UserInfoFields from '../../components/UserInfoFields'

export default function SettingsPage() {
  const [name, setName] = useState(() => localStorage.getItem('coffy_name') ?? '')
  const [cls, setCls] = useState(() => localStorage.getItem('coffy_class') ?? '')
  const [password, setPassword] = useState(() => localStorage.getItem('coffy_password') ?? '')
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    localStorage.setItem('coffy_name', name)
    localStorage.setItem('coffy_class', cls)
    localStorage.setItem('coffy_password', password)
    if (window.electronAPI) {
      await window.electronAPI.saveSettings({ name, class: cls, password })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="right-panel">
      <div className="order-form">
        <div className="form-title-row">
          <UserInfoFields
            name={name} cls={cls} password={password}
            onNameChange={setName}
            onClsChange={setCls}
            onPasswordChange={setPassword}
          />
          <button className="submit-btn" onClick={handleSave}>
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
