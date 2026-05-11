import styled from 'styled-components'

export const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 280px;
  flex-shrink: 0;
`

export const CanvasEl = styled.canvas`
  display: block;
  border-radius: 8px;
  background: #000;
`

export const StartBtn = styled.button`
  padding: 11px;
  background: linear-gradient(135deg, #00e5ff, #7c4dff);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 1px;
  transition: opacity 0.2s, transform 0.1s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #4a4a4a;
    cursor: not-allowed;
    transform: none;
  }
`
