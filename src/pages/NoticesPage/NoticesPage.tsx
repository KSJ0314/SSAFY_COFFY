import styled from 'styled-components'
import NoticeBoard from '../../components/NoticeBoard'

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(160deg, ${({ theme }) => theme.colors.sidebarFrom}, ${({ theme }) => theme.colors.sidebarTo});

  > * {
    width: 100%;
  }
`

export default function NoticesPage() {
  return (
    <Page>
      <NoticeBoard />
    </Page>
  )
}
