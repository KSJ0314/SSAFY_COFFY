import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { subscribeTodayOrders, saveOrder, updateOrderQty, deleteOrder, getTodayKST } from '../services/orderService'

export type Order = {
  id?: string
  name: string
  class: string
  menu: string
  temp: 'ICE' | 'HOT'
  options: string[]
  price: number
  qty?: number
  password: string
}

type OrderContextType = {
  orders: Order[]
  loading: boolean
  addOrder: (order: Order) => Promise<void>
  removeOrder: (id: string) => Promise<void>
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let currentDate = getTodayKST()
    let unsubscribe = subscribeTodayOrders(data => {
      setOrders(data)
      setLoading(false)
    })

    const interval = setInterval(() => {
      const newDate = getTodayKST()
      if (newDate !== currentDate) {
        currentDate = newDate
        unsubscribe()
        setOrders([])
        setLoading(true)
        unsubscribe = subscribeTodayOrders(data => {
          setOrders(data)
          setLoading(false)
        })
      }
    }, 60_000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  async function addOrder(order: Order) {
    const sortedNewOptions = [...(order.options ?? [])].sort().join('|')
    const existing = orders.find(o =>
      o.name === order.name &&
      o.class === order.class &&
      o.password === order.password &&
      o.menu === order.menu &&
      o.temp === order.temp &&
      [...(o.options ?? [])].sort().join('|') === sortedNewOptions
    )
    if (existing?.id) {
      await updateOrderQty(existing.id, (existing.qty ?? 1) + (order.qty ?? 1))
    } else {
      await saveOrder(order)
    }
  }

  async function removeOrder(id: string) {
    await deleteOrder(id)
  }

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
