export type Props = {
  mode: 'create' | 'edit'
  initial?: { title: string; content: string }
  onSubmit: (data: { title: string; content: string; password: string; name: string; class: string }) => void
  onClose: () => void
}
