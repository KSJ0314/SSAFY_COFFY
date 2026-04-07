const MENU_LINK = 'https://map.naver.com/p/entry/place/1450717255?c=12.16,0,0,3,dh&isCorrectAnswer=true&placePath=/menu?entry=bmp&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202601231202&locale=ko&svcName=map_pcv5&searchText=%EB%A9%94%EA%B0%80%EC%BB%A4%ED%94%BC%20%EA%B4%91%EC%A3%BC%EC%B2%A8%EB%8B%A8%EC%8C%8D%EC%95%94%EA%B3%B5%EC%9B%90%EC%A0%90'

export default function NoticeBoard() {
  return (
    <div className="notice-board">
      <div className="notice-title">📋 공지사항</div>
      <ul className="notice-list">
        <li>
          <a href={MENU_LINK} target="_blank" rel="noreferrer">
            메가커피 광주첨단쌍암공원점
          </a>
        </li>
        <li>커피 수령자는 13:00 게이트 앞 자전거 보관소에서 커피 받아오셔야합니다.</li>
        <li>
          입금 안하면 MM에 올립니다~<br/>
          (신한 110601232721 김보경)
        </li>
      </ul>
    </div>
  )
}
