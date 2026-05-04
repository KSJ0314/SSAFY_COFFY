import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import type { Props } from './types'

const Bg = styled.div`
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.pageBg};
  background-image: radial-gradient(ellipse at top, ${({ theme }) => theme.colors.pageBg} 0%, ${({ theme }) => theme.colors.borderMid} 100%);
`

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BackBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .logo {
    font-size: 2rem;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
  }
`
const SubTitleArea = styled.div`
  align-items: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1rem;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export default function PageLayout({ title, subTitle, icon = '☕', backPath, actions, children, tableMinHeight }: Props) {
  const navigate = useNavigate()
  return (
    <Bg>
      <Page>
        <Header>
          {!window.electronAPI && (
            <BackBtn onClick={() => navigate(backPath)}>← 돌아가기</BackBtn>
          )}
          <TitleArea>
            <span className="logo">{icon}</span>
            <h1>{title}</h1>
          </TitleArea>
          <SubTitleArea>
            {subTitle}
          </SubTitleArea>
          <Actions>
            {actions}
          </Actions>
        </Header>
        <div className="list-page-body" style={tableMinHeight ? { minHeight: `${tableMinHeight}px` } : undefined}>
          {children}
        </div>
      </Page>
    </Bg>
  )
}
