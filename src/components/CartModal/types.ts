import type { CartItem } from '../OrderForm'

export type Props = {
  cart: CartItem[]
  name: string
  cls: string
  closed: boolean
  onRemove: (id: string) => void
  onChangeQty: (id: string, qty: number) => void
  onSubmit: () => void
  onClose: () => void
  onRoulette?: () => void
  focusItemId?: string | null
}
