import styled from 'styled-components'

export const Backdrop = styled.div<{ $standalone?: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ $standalone }) => $standalone ? 'transparent' : 'rgba(0, 0, 0, 0.55)'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: ${({ $standalone }) => $standalone ? 'default' : 'pointer'};
`

export const Modal = styled.div<{ $wide?: boolean; $standalone?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  width: ${({ $wide }) => $wide ? '700px' : '580px'};
  max-height: ${({ $standalone }) => $standalone ? 'none' : '88vh'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  position: relative;
  cursor: default;
`

export const MinimapCanvas = styled.canvas`
  display: block;
  border-radius: 6px;
  border: 1px solid rgba(0, 229, 255, 0.25);
  flex-shrink: 0;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

export const TabGroup = styled.div`
  display: flex;
  gap: 4px;
`

export const TabBtn = styled.button<{ $active?: boolean }>`
  padding: 5px 12px;
  border-radius: 8px;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  background: ${({ $active, theme }) => ($active ? theme.colors.surfaceAccent : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.textMutedAlt)};
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.secondary};
  }
`

export const ModalTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  padding: 4px 6px;
  line-height: 1;
  border-radius: 6px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`

export const MaximizeBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  padding: 4px 6px;
  line-height: 1;
  border-radius: 6px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`

export const ModalBody = styled.div`
  display: flex;
  gap: 20px;
  min-height: 0;
`

export const RouletteSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  width: 280px;
`

export const ParticipantSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  min-height: 0;
`

export const ParticipantSectionLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.label};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`

export const ParticipantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const ParticipantInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.88rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  transition: border-color 0.15s;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const ClsInput = styled.input`
  width: 44px;
  padding: 8px 6px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.88rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textInput};
  transition: border-color 0.15s;
  text-align: center;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  padding: 4px 7px;
  line-height: 1;
  border-radius: 6px;
  flex-shrink: 0;

  &:hover {
    color: #ef4444;
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const AddBtn = styled.button`
  background: none;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 7px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMutedAlt};
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const CanvasWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  canvas {
    display: block;
  }
`

export const CanvasRefreshBtn = styled.button`
  position: absolute;
  top: 6px;
  left: 6px;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

export const SpinBtn = styled.button`
  padding: 11px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 1px;
  transition: opacity 0.2s, transform 0.1s;

  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.btnDisabled};
    cursor: not-allowed;
    transform: none;
  }
`

export const WinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  animation: overlayIn 0.2s ease;
  cursor: pointer;

  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`

export const WinnerCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 2.5px solid #f59e0b;
  border-radius: 20px;
  padding: 36px 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  cursor: default;
  animation: cardUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes cardUp {
    from { opacity: 0; transform: translateY(32px) scale(0.88); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`

export const WinnerEmoji = styled.div`
  font-size: 2.4rem;
  line-height: 1;
`

export const WinnerName = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.secondary};
`

export const WinnerLabel = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const ResetBtn = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`

// 전체화면 오버레이
export const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #000;
  display: flex;
  flex-direction: column;
`

export const FullscreenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`

export const FullscreenTitle = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
`

export const FullscreenShrinkBtn = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ccc;
  padding: 6px 14px;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`

export const FullscreenContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 0;
  overflow: hidden;
`

export const FullscreenCanvasArea = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

export const FullscreenSidebar = styled.div`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 16px 16px 16px 0;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
`

export const FsParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 10px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 999px; }
`

export const FsParticipantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const FsParticipantInput = styled.input`
  flex: 1;
  padding: 7px 10px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 7px;
  font-size: 0.84rem;
  background: rgba(255,255,255,0.06);
  color: #eee;
  min-width: 0;

  &:focus { outline: none; border-color: #00e5ff; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &::placeholder { color: #666; }
`

export const FsClsInput = styled.input`
  width: 38px;
  padding: 7px 4px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 7px;
  font-size: 0.84rem;
  background: rgba(255,255,255,0.06);
  color: #eee;
  text-align: center;
  flex-shrink: 0;

  &:focus { outline: none; border-color: #00e5ff; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &::placeholder { color: #666; }
`

export const FsRemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  color: #666;
  padding: 4px 6px;
  border-radius: 5px;
  flex-shrink: 0;

  &:hover { color: #ef4444; background: rgba(239,68,68,0.12); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

export const FsAddBtn = styled.button`
  background: none;
  border: 1px dashed rgba(255,255,255,0.2);
  border-radius: 7px;
  padding: 7px;
  font-size: 0.8rem;
  color: #888;
  cursor: pointer;
  flex-shrink: 0;

  &:hover { border-color: #00e5ff; color: #00e5ff; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

export const FsSectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  padding-left: 2px;
`
