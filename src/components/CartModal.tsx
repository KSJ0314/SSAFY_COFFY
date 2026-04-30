import { useRef, useEffect } from 'react'
import TempBadge from './TempBadge'
import type { CartItem } from './OrderForm'

type Props = {
  cart: CartItem[]
  name: string
  cls: string
  closed: boolean
  onRemove: (id: string) => void
  onChangeQty: (id: string, qty: number) => void
  onSubmit: () => void
  onClose: () => void
  focusItemId?: string | null
}

export default function CartModal({ cart, name, cls, closed, onRemove, onChangeQty, onSubmit, onClose, focusItemId }: Props) {
  const mouseDownOnBackdrop = useRef(false)
  const plusBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  useEffect(() => {
    if (!focusItemId) return
    const btn = plusBtnRefs.current.get(focusItemId)
    if (btn) btn.focus()
  }, [focusItemId])

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
                  <div className="cart-item-price">
                    {item.qty > 1 && (
                      <span className="cart-item-unit-price">{item.price.toLocaleString()}원 × {item.qty} = </span>
                    )}
                    {(item.price * item.qty).toLocaleString()}원
                  </div>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="cart-qty-btn"
                    onClick={() => onChangeQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >−</button>
                  <span className="cart-qty-value">{item.qty}</span>
                  <button
                    className="cart-qty-btn"
                    ref={el => {
                      if (el) plusBtnRefs.current.set(item.id, el)
                      else plusBtnRefs.current.delete(item.id)
                    }}
                    onClick={() => onChangeQty(item.id, item.qty + 1)}
                  >+</button>
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
