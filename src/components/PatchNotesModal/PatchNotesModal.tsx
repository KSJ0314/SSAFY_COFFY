import { useState } from 'react'
import patchNotes from '../../data/patchNotes.json'
import electronPatchNotes from '../../data/electronPatchNotes.json'
import type { Props } from './types'

export default function PatchNotesModal({ onClose }: Props) {
  const [tab, setTab] = useState<'web' | 'desktop'>('web')
  const notes = tab === 'web' ? patchNotes : electronPatchNotes

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-title-row">
              <h2>패치 노트</h2>
              <a
                href="https://github.com/KSJ0314/SSAFY_COFFY"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="patch-tabs">
            <button
              className={`category-tab${tab === 'web' ? ' selected' : ''}`}
              onClick={() => setTab('web')}
            >Web</button>
            <button
              className={`category-tab${tab === 'desktop' ? ' selected' : ''}`}
              onClick={() => setTab('desktop')}
            >Desktop</button>
          </div>
          <div className="patch-list">
            {notes.map(patch => (
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
    </div>
  )
}
