import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { subscribeTodayOrders, saveOrder } from '../services/orderService'

export type Order = {
  name: string
  class: string
  menu: string
  options: string[]
  price: number
}

type OrderContextType = {
  orders: Order[]
  addOrder: (order: Order) => Promise<void>
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

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
