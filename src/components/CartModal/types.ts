import type { MenuTemp } from '../../constants/coffeeMenu'

export type CartItem = {
  id: string
  menu: string
  temp: MenuTemp
  options: string[]
  price: number
  qty: number
  image?: string
}

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
