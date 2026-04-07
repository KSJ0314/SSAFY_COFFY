import type { PickupResult } from '../services/pickupService'

type Props = {
  result: PickupResult
  onClose: () => void
}

export default function PickupModal({ result, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>뽑기 결과 상세</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-sub">
          {new Date(result.drawnAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 추첨
        </p>
        <div className="draw-list">
          <div className="draw-row draw-header">
            <div className="draw-rank">순위</div>
            <div className="draw-name">이름</div>
            <div className="draw-class">반</div>
            <div className="draw-bar-wrap" />
            <div className="draw-value">점수</div>
            <div className="draw-crown" />
          </div>
          {result.draws.map((d, i) => {
            const isWinner = d.name === result.winner.name && d.class === result.winner.class
            return (
              <div key={i} className={`draw-row ${isWinner ? 'draw-winner' : ''}`}>
                <div className="draw-rank">{i + 1}</div>
                <div className="draw-name">{d.name}</div>
                <div className="draw-class">{d.class}</div>
                <div className="draw-bar-wrap">
                  <div
                    className="draw-bar"
                    style={{ width: `${(d.randomValue * 100).toFixed(1)}%` }}
                  />
                </div>
                <div className="draw-value">{(d.randomValue * 100).toFixed(2)}</div>
                {isWinner && <div className="draw-crown">👑</div>}
              </div>
            )
          })}
        </div>
        <p className="modal-note">* 각 참여자에게 0~100 사이의 랜덤값이 배정되며, 가장 높은 값을 받은 분이 당첨됩니다.</p>
      </div>
    </div>
  )
}
