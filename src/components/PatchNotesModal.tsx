import patchNotes from '../data/patchNotes.json'

type Props = {
  onClose: () => void
}

export default function PatchNotesModal({ onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>패치 노트</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="patch-list">
          {patchNotes.map(patch => (
            <div key={patch.version} className="patch-item">
              <div className="patch-header">
                <span className="patch-version">v{patch.version}</span>
                <span className="patch-date">{patch.date}</span>
              </div>
              <ul className="patch-changes">
                {patch.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
