import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import TempBadge from '../TempBadge'
import {
  ModalBackdrop, Modal, ModalBody, ModalHeader, ModalClose,
} from '../../styles/shared'
import { RouletteBtn } from '../OrderForm/OrderForm.styled'
import type { Props } from './types'

const CartModal_ = styled(Modal)`
  width: 480px;
`

const Submitter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  margin-bottom: 8px;
`

const SubmitterName = styled.span`
  font-weight: 800;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`

const SubmitterCls = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.secondary};
`

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
`

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.surfaceModal};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 10px;
`

const ItemImage = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.pageBg};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ImagePlaceholder = styled.span`
  font-size: 1.6rem;
`

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const ItemMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
`

const ItemOptions = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const ItemPrice = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`

const UnitPrice = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  font-weight: 400;
  margin-right: 2px;
`

const ItemQty = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`

const QtyBtn = styled.button`
  background: ${({ theme }) => theme.colors.borderLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.border};
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
  }
`

const QtyValue = styled.span`
  min-width: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
`

const ItemRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textFaint};
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px;
  flex-shrink: 0;

  &:hover {
    color: #e53e3e;
  }
`

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px 4px;
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  margin-top: 8px;
`

const CartActions = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  margin-top: 16px;
`

const SubmitWrap = styled.div`
  flex: 1;
  position: relative;
`

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 0.95rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.btnDisabled};
    cursor: not-allowed;
    transform: none;
  }
`

const ClosedTooltip = styled.div`
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textOnDark};
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.secondary};
  }

  ${SubmitWrap}:hover & {
    display: block;
  }
`

export default function CartModal({ cart, name, cls, closed, onRemove, onChangeQty, onSubmit, onClose, onRoulette, focusItemId }: Props) {
  const mouseDownOnBackdrop = useRef(false)
  const plusBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  useEffect(() => {
    if (!focusItemId) return
    const btn = plusBtnRefs.current.get(focusItemId)
    if (btn) btn.focus()
  }, [focusItemId])

  return (
    <ModalBackdrop
      onMouseDown={() => { mouseDownOnBackdrop.current = true }}
      onMouseUp={() => { if (mouseDownOnBackdrop.current) onClose(); mouseDownOnBackdrop.current = false }}
    >
      <CartModal_ onMouseDown={e => { e.stopPropagation(); mouseDownOnBackdrop.current = false }}>
        <ModalBody>
          <ModalHeader>
            <h2>장바구니</h2>
            <ModalClose onClick={onClose}>✕</ModalClose>
          </ModalHeader>
          <Submitter>
            <SubmitterName>{name}</SubmitterName>
            <SubmitterCls>{cls}반</SubmitterCls>
          </Submitter>
          <CartList>
            {cart.map(item => (
              <CartItem key={item.id}>
                <ItemImage>
                  {item.image
                    ? <img src={item.image} alt={item.menu} />
                    : <ImagePlaceholder>☕</ImagePlaceholder>
                  }
                </ItemImage>
                <ItemInfo>
                  <ItemMenu>
                    <TempBadge temp={item.temp} size="sm" />
                    <span>{item.menu}</span>
                  </ItemMenu>
                  {item.options.length > 0 && (
                    <ItemOptions>{item.options.join(', ')}</ItemOptions>
                  )}
                  <ItemPrice>
                    {item.qty > 1 && (
                      <UnitPrice>{item.price.toLocaleString()}원 × {item.qty} = </UnitPrice>
                    )}
                    {(item.price * item.qty).toLocaleString()}원
                  </ItemPrice>
                </ItemInfo>
                <ItemQty>
                  <QtyBtn
                    onClick={() => onChangeQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >−</QtyBtn>
                  <QtyValue>{item.qty}</QtyValue>
                  <QtyBtn
                    ref={el => {
                      if (el) plusBtnRefs.current.set(item.id, el)
                      else plusBtnRefs.current.delete(item.id)
                    }}
                    onClick={() => onChangeQty(item.id, item.qty + 1)}
                  >+</QtyBtn>
                </ItemQty>
                <ItemRemove onClick={() => onRemove(item.id)}>✕</ItemRemove>
              </CartItem>
            ))}
          </CartList>
          <CartTotal>
            <span>합계</span>
            <span>{total.toLocaleString()}원</span>
          </CartTotal>
          <CartActions>
            <RouletteBtn type="button" title="주문자 뽑기" onClick={onRoulette}>🎰</RouletteBtn>
            <SubmitWrap>
              <SubmitBtn onClick={onSubmit} disabled={cart.length === 0 || closed}>
                주문하기
              </SubmitBtn>
              {closed && <ClosedTooltip>11시 40분까지 주문 가능합니다.</ClosedTooltip>}
            </SubmitWrap>
          </CartActions>
        </ModalBody>
      </CartModal_>
    </ModalBackdrop>
  )
}
