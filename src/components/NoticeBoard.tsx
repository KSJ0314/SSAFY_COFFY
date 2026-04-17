import siteConfig from '../data/siteConfig.json'

export default function NoticeBoard() {
  return (
    <div className="notice-board">
      <div className="notice-title">📋 공지사항</div>
      <ul className="notice-list">
        <li>
          <a href={siteConfig.cafe.menuLink} target="_blank" rel="noreferrer">
            {siteConfig.cafe.name}
          </a>
        </li>
        {siteConfig.notices.map((notice, i) => (
          <li key={i}>{notice}</li>
        ))}
      </ul>
    </div>
  )
}
