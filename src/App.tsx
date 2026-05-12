import { HashRouter, Routes, Route } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import { ThemeProvider } from './styles/ThemeContext'
import FloatingButtons from './components/FloatingButtons'
import MainPage from './pages/MainPage'
import OrderListPage from './pages/OrderListPage'
import InquiryPage from './pages/InquiryPage'
import OrderPage from './pages/OrderPage'
import CartPage from './pages/CartPage'
import PickupPage from './pages/PickupPage'
import SettingsPage from './pages/SettingsPage'
import NoticesPage from './pages/NoticesPage'
import BackgroundPage from './pages/BackgroundPage'
import PatchNotesPage from './pages/PatchNotesPage'
import RoulettePage from './pages/RoulettePage'
import LunchPage from './pages/LunchPage'


export default function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/inquiry" element={<InquiryPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/pickup" element={<PickupPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/background" element={<BackgroundPage />} />
            <Route path="/patchnotes" element={<PatchNotesPage />} />
            <Route path="/roulette" element={<RoulettePage />} />
            <Route path="/lunch" element={<LunchPage />} />
          </Routes>
          <FloatingButtons />
        </HashRouter>
      </OrderProvider>
    </ThemeProvider>
  )
}
