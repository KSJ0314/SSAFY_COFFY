import type { MenuTemp } from '../../constants/coffeeMenu'
import type { Order } from '../../context/OrderContext'

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
  onSubmit: (orders: Order[]) => void
  disabled: boolean
}
