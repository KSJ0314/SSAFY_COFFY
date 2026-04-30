import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartModal from '../components/CartModal'
import { useOrders } from '../context/OrderContext'
import type { CartItem } from '../components/OrderForm'
import type { Order } from '../context/OrderContext'
import siteConfig from '../data/siteConfig.json'

function isClosed(): boolean {
  const { hour, minute } = siteConfig.closingTime
  const now = new Date()
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)
}

export default function CartPage() {
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('coffy_cart') ?? '[]')
      return raw.map((item: CartItem) => ({ ...item, qty: item.qty ?? 1 }))
    } catch { return [] }
  })
  const name = localStorage.getItem('coffy_name') ?? ''
  const cls = localStorage.getItem('coffy_class') ?? ''
  const password = localStorage.getItem('coffy_password') ?? ''
  const closed = import.meta.env.DEV ? false : isClosed()

  function handleRemove(id: string) {
    const updated = cart.filter(item => item.id !== id)
    setCart(updated)
    localStorage.setItem('coffy_cart', JSON.stringify(updated))
  }

  function handleChangeQty(id: string, qty: number) {
    const updated = cart.map(item => item.id === id ? { ...item, qty } : item)
    setCart(updated)
    localStorage.setItem('coffy_cart', JSON.stringify(updated))
  }

  async function handleSubmit() {
    if (!name || !cls || !password) {
      window.electronAPI?.openSettings()
      return
    }
    if (cart.length === 0) return
    const orders: Order[] = cart.map(item => ({
      name, class: cls, menu: item.menu, temp: item.temp,
      options: item.options, price: item.price, qty: item.qty, password,
    }))
    await Promise.all(orders.map(addOrder))
    localStorage.removeItem('coffy_cart')
    if (window.electronAPI) {
      window.electronAPI.openOrders()
      window.close()
    } else {
      navigate('/orders')
    }
  }

  function handleClose() {
    window.close()
  }

  return (
    <CartModal
      cart={cart}
      name={name}
      cls={cls}
      closed={closed}
      onRemove={handleRemove}
      onChangeQty={handleChangeQty}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  )
}
