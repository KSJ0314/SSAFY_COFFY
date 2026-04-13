import { useRef } from 'react'
import TempBadge from './TempBadge'
import type { CartItem } from './OrderForm'

type Props = {
  cart: CartItem[]
  name: string
  cls: string
  closed: boolean
  onRemove: (id: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function CartModal({ cart, name, cls, closed, onRemove, onSubmit, onClose }: Props) {
  const mouseDownOnBackdrop = useRef(false)
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div
      className="modal-backdrop"
      onMouseDown={() => { mouseDownOnBackdrop.current = true }}
      onMouseUp={() => { if (mouseDownOnBackdrop.current) onClose(); mouseDownOnBackdrop.current = false }}
    >
      <div className="modal cart-modal" onMouseDown={e => { e.stopPropagation(); mouseDownOnBackdrop.current = false }}>
        <div className="modal-body">
          <div className="modal-header">
            <h2>장바구니</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="cart-submitter">
            <span className="cart-submitter-name">{name}</span>
            <span className="cart-submitter-cls">{cls}반</span>
          </div>
          <div className="cart-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image
                    ? <img src={item.image} alt={item.menu} />
                    : <span className="cart-item-image-placeholder">☕</span>
                  }
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-menu">
                    <TempBadge temp={item.temp} size="sm" />
                    <span>{item.menu}</span>
                  </div>
                  {item.options.length > 0 && (
                    <div className="cart-item-options">{item.options.join(', ')}</div>
                  )}
                  <div className="cart-item-price">{item.price.toLocaleString()}원</div>
                </div>
                <button className="cart-item-remove" onClick={() => onRemove(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>합계</span>
            <span>{total.toLocaleString()}원</span>
          </div>
          <div className="cart-modal-actions">
            <button className="inquiry-cancel-btn" onClick={onClose}>닫기</button>
            <div className="cart-submit-wrap">
              <button
                className="submit-btn cart-submit-btn"
                onClick={onSubmit}
                disabled={cart.length === 0 || closed}
              >
                주문하기
              </button>
              {closed && <div className="cart-closed-tooltip">11시 40분까지 주문 가능합니다.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
