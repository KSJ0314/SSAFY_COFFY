import { useState } from 'react'
import styled from 'styled-components'
import UserInfoFields from '../../components/UserInfoFields'
import { RightPanel, Form, FormTitleRow, SubmitBtn } from '../../components/OrderForm/OrderForm.styled'

const SettingsLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.bg};
`

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
    <SettingsLayout>
      <RightPanel>
        <Form onSubmit={e => e.preventDefault()}>
          <FormTitleRow>
            <UserInfoFields
              name={name} cls={cls} password={password}
              onNameChange={setName}
              onClsChange={setCls}
              onPasswordChange={setPassword}
            />
            <SubmitBtn type="button" onClick={handleSave}>
              {saved ? '저장됨 ✓' : '저장'}
            </SubmitBtn>
          </FormTitleRow>
        </Form>
      </RightPanel>
    </SettingsLayout>
  )
}
