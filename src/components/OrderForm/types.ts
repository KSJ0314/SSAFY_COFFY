import type { Order } from '../../context/OrderContext'

export type Props = {
  onSubmit: (orders: Order[]) => void
  disabled: boolean
}
