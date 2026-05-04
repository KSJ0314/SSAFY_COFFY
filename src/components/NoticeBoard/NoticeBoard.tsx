import styled from 'styled-components'
import siteConfig from '../../data/siteConfig.json'

const Wrap = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 14px 16px;
  color: #ffe8cc;
`

const Title = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffd080;
  margin-bottom: 8px;
`

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    font-size: 0.82rem;
    color: #f5dfc0;
    line-height: 1.5;
    padding-left: 12px;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #ffd080;
    }
  }

  a {
    color: #ffd080;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: #fff;
    }
  }
`

export default function NoticeBoard() {
  return (
    <Wrap>
      <Title>📋 공지사항</Title>
      <List>
        <li>
          <a href={siteConfig.cafe.menuLink} target="_blank" rel="noreferrer">
            {siteConfig.cafe.name}
          </a>
        </li>
        {siteConfig.notices.map((notice, i) => (
          <li key={i}>{notice}</li>
        ))}
      </List>
    </Wrap>
  )
}
