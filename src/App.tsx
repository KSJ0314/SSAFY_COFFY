import { HashRouter, Routes, Route } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import MainPage from './pages/MainPage'
import OrderListPage from './pages/OrderListPage'
import InquiryPage from './pages/InquiryPage'
import './App.css'

export default function App() {
  return (
    <OrderProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
        </Routes>
      </HashRouter>
    </OrderProvider>
  )
}
