import { HashRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { OrderProvider } from './context/OrderContext'
import { ThemeProvider } from './styles/ThemeContext'
import { useTheme } from './styles/ThemeContext'
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

const ThemeToggleBtn = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.shadow};
  }
`

function ThemeToggle() {
  const { mode, toggle } = useTheme()
  return (
    <ThemeToggleBtn onClick={toggle} title={mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}>
      {mode === 'light' ? '🌙' : '☀️'}
    </ThemeToggleBtn>
  )
}

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
          </Routes>
          {!window.electronAPI && <ThemeToggle />}
        </HashRouter>
      </OrderProvider>
    </ThemeProvider>
  )
}
