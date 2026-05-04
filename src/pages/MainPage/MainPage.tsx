import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from '../../components/Sidebar'
import OrderForm from '../../components/OrderForm'
import { useOrders } from '../../context/OrderContext'
import siteConfig from '../../data/siteConfig.json'

const MainLayout = styled.div`
  display: flex;
  height: 100%;
`

function isClosed(): boolean {
  const { hour, minute } = siteConfig.closingTime
  const now = new Date()
  return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)
}

export default function MainPage() {
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  const [closed, setClosed] = useState(import.meta.env.DEV ? false : isClosed())

  useEffect(() => {
    if (import.meta.env.DEV) return
    const interval = setInterval(() => setClosed(isClosed()), 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <MainLayout>
      <Sidebar />
      <OrderForm
        onSubmit={async orders => { await Promise.all(orders.map(addOrder)); navigate('/orders') }}
        disabled={closed}
      />
    </MainLayout>
  )
}
