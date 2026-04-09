import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { subscribeTodayOrders, saveOrder, deleteOrder } from '../services/orderService'

export type Order = {
  id?: string
  name: string
  class: string
  menu: string
  temp: 'ICE' | 'HOT'
  options: string[]
  price: number
  password: string
}

type OrderContextType = {
  orders: Order[]
  addOrder: (order: Order) => Promise<void>
  removeOrder: (id: string) => Promise<void>
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const unsubscribe = subscribeTodayOrders(setOrders)
    return () => unsubscribe()
  }, [])

  async function addOrder(order: Order) {
    await saveOrder(order)
  }

  async function removeOrder(id: string) {
    await deleteOrder(id)
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
