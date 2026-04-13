import { useState } from 'react'

type Props = {
  mode: 'create' | 'edit'
  initial?: { title: string; content: string }
  onSubmit: (data: { title: string; content: string; password: string; name: string; class: string }) => void
  onClose: () => void
}

export default function InquiryModal({ mode, initial, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState(localStorage.getItem('coffy_name') ?? '')
  const [cls, setCls] = useState(localStorage.getItem('coffy_class') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !password) return
    if (mode === 'create') {
      localStorage.setItem('coffy_name', name.trim())
      localStorage.setItem('coffy_class', cls.trim())
    }
    onSubmit({ title: title.trim(), content: content.trim(), password, name: name.trim(), class: cls.trim() })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal inquiry-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-header">
            <h2>{mode === 'create' ? '문의 작성' : '문의 수정'}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form className="inquiry-form" onSubmit={handleSubmit}>
            {mode === 'create' && (
              <div className="inquiry-form-row inquiry-form-row-inline">
                <div className="inquiry-form-inline-item">
                  <label>이름</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="이름"
                  />
                </div>
                <div className="inquiry-form-inline-item">
                  <label>반</label>
                  <input
                    value={cls}
                    onChange={e => setCls(e.target.value)}
                    placeholder="반"
                  />
                </div>
              </div>
            )}
            <div className="inquiry-form-row">
              <label>제목</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                autoFocus
              />
            </div>
            <div className="inquiry-form-row">
              <label>내용</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={5}
              />
            </div>
            <div className="inquiry-form-row">
              <label>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••"
                maxLength={4}
                className="inquiry-password-input"
              />
            </div>
            <div className="inquiry-form-actions">
              <button type="button" className="inquiry-cancel-btn" onClick={onClose}>취소</button>
              <button
                type="submit"
                className="inquiry-submit-btn"
                disabled={!title.trim() || !content.trim() || !password}
              >
                {mode === 'create' ? '작성' : '수정'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
