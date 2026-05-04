export type Props = {
  name: string
  cls: string
  password: string
  onNameChange: (v: string) => void
  onClsChange: (v: string) => void
  onPasswordChange: (v: string) => void
  showValidation?: boolean
}
